import React, { useState, useRef, useEffect } from "react";
import ChatBot from "../../../assets/images/Layouts/ChatBot.png";
import axios from "axios";
import { useThemeProvider } from "../../AdminDashboard/utils/ThemeContext"; // Update this path

const ChatQnA = () => {
  const { currentTheme } = useThemeProvider();
  const [isOpen, setIsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  const [selectedSubQuestion, setSelectedSubQuestion] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [userQuery, setUserQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [typingText, setTypingText] = useState("");
  const [currentTypingMessage, setCurrentTypingMessage] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingMessageIndex, setSpeakingMessageIndex] = useState(null);
  const chatRef = useRef(null);
  const buttonRef = useRef(null);
  const messagesEndRef = useRef(null);
  const messagesStartRef = useRef(null);
  const chatBodyRef = useRef(null);
  const questionRefs = useRef({});
  const subQuestionRefs = useRef({});
  const speechSynthesis = useRef(window.speechSynthesis);
  const [buttonPosition, setButtonPosition] = useState({
    right: 16,
    bottom: 80,
  });

  const API_URL = import.meta.env.VITE_API_URL;

  // Get button position for animation start point
  useEffect(() => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setButtonPosition({
        right: window.innerWidth - rect.right,
        bottom: window.innerHeight - rect.bottom,
      });
    }
  }, [isOpen]);

  // Text-to-Speech functionality
  const speakText = (text, messageIndex = null) => {
    // Stop any current speech
    if (speechSynthesis.current.speaking) {
      speechSynthesis.current.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);

    // Configure voice settings for a more appealing female voice
    const voices = speechSynthesis.current.getVoices();

    // Try to find a good female voice
    const femaleVoice =
      voices.find(
        (voice) =>
          voice.name.toLowerCase().includes("female") ||
          voice.name.toLowerCase().includes("woman") ||
          voice.name.toLowerCase().includes("zira") ||
          voice.name.toLowerCase().includes("hazel") ||
          (voice.gender && voice.gender.toLowerCase() === "female")
      ) ||
      voices.find(
        (voice) =>
          voice.lang.startsWith("en") &&
          (voice.name.toLowerCase().includes("samantha") ||
            voice.name.toLowerCase().includes("susan") ||
            voice.name.toLowerCase().includes("karen") ||
            voice.name.toLowerCase().includes("moira"))
      );

    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }

    // Voice settings for a more appealing sound
    utterance.rate = 0.9; // Slightly slower for clarity
    utterance.pitch = 1.1; // Slightly higher pitch
    utterance.volume = 0.8; // Good volume level

    // Event handlers
    utterance.onstart = () => {
      setIsSpeaking(true);
      setSpeakingMessageIndex(messageIndex);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setSpeakingMessageIndex(null);
    };

    utterance.onerror = (event) => {
      console.error("Speech synthesis error:", event.error);
      setIsSpeaking(false);
      setSpeakingMessageIndex(null);
    };

    speechSynthesis.current.speak(utterance);
  };

  // Stop speaking
  const stopSpeaking = () => {
    speechSynthesis.current.cancel();
    setIsSpeaking(false);
    setSpeakingMessageIndex(null);
  };

  // Load voices when they become available
  useEffect(() => {
    const loadVoices = () => {
      const voices = speechSynthesis.current.getVoices();
      if (voices.length > 0) {
        // console.log('Available voices:', voices.map(v => ({ name: v.name, lang: v.lang, gender: v.gender })));
      }
    };

    // Load voices immediately if available
    loadVoices();

    // Also load when voices change (some browsers load them asynchronously)
    speechSynthesis.current.addEventListener("voiceschanged", loadVoices);

    return () => {
      speechSynthesis.current.removeEventListener("voiceschanged", loadVoices);
    };
  }, []);

  // Toggle the popup visibility with animation
  const togglePopup = () => {
    if (!isOpen) {
      setIsAnimating(true);
      setIsOpen(true);
      // Reset animation state after animation completes
      setTimeout(() => setIsAnimating(false), 500);
    } else {
      if (isFullscreen) {
        // First shrink, then close
        setIsFullscreen(false);
        setTimeout(() => {
          setIsOpen(false);
        }, 400);
      } else {
        setIsOpen(false);
      }
    }
  };

  // Toggle fullscreen mode with animation
  const toggleFullscreen = () => {
    setIsAnimating(true);
    setIsFullscreen(!isFullscreen);
    // Reset animation state after animation completes
    setTimeout(() => setIsAnimating(false), 500);
  };

  // Close the popup when clicking outside
  const handleClickOutside = (event) => {
    if (
      chatRef.current &&
      !chatRef.current.contains(event.target) &&
      buttonRef.current &&
      !buttonRef.current.contains(event.target)
    ) {
      togglePopup();
    }
  };

  // Attach event listener for outside click
  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Scroll to the bottom whenever messages update or typing text changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingText]);

  // Typing effect animation - Fixed version
  useEffect(() => {
    if (currentTypingMessage && isTyping) {
      let i = 0;
      setTypingText("");

      const typingInterval = setInterval(() => {
        if (i < currentTypingMessage.length) {
          // Fix: Use functional update to ensure we always have the latest state
          setTypingText((prev) => currentTypingMessage.substring(0, i + 1));
          i++;
        } else {
          clearInterval(typingInterval);
          setIsTyping(false);
          setMessages((prev) => [
            ...prev,
            { type: "bot", text: currentTypingMessage },
          ]);
          setCurrentTypingMessage("");
          setTypingText("");
        }
      }, 20); // Speed of typing, lower = faster

      return () => clearInterval(typingInterval);
    }
  }, [currentTypingMessage, isTyping]);

  // Predefined questions with sub-questions
  const questionBank = [
    {
      id: 1,
      question: "What is Auction X?",
      subQuestions: [
        {
          id: "1a",
          question: "What does Auction X offer?",
          answer:
            "Auction X offers an online bidding platform for sellers and buyers.",
        },
        {
          id: "1b",
          question: "Who can use Auction X?",
          answer:
            "Anyone who wants to buy or sell products via auctions can use Auction X.",
        },
      ],
    },
    {
      id: 2,
      question: "How does bidding work?",
      subQuestions: [
        {
          id: "2a",
          question: "What is the minimum bid?",
          answer: "The minimum bid is set by the seller for each item.",
        },
        {
          id: "2b",
          question: "Can I withdraw my bid?",
          answer: "No, once placed, a bid cannot be withdrawn.",
        },
      ],
    },
    {
      id: 3,
      question: "How can I create an account?",
      subQuestions: [
        {
          id: "3a",
          question: "Is account creation free?",
          answer: "Yes, creating an account on Auction X is free.",
        },
        {
          id: "3b",
          question: "What details are required?",
          answer:
            "You need an email, phone number, and password to create an account.",
        },
      ],
    },
    {
      id: 4,
      question: "How to add money?",
      subQuestions: [
        {
          id: "4a",
          question: "What are the payment methods?",
          answer:
            "You can add money using credit cards, debit cards, UPI, or net banking.",
        },
        {
          id: "4b",
          question: "Is there a minimum deposit?",
          answer: "Yes, the minimum deposit is $10 to activate your wallet.",
        },
        {
          id: "4c",
          question: "Are there any fees?",
          answer: "No, there are no additional fees for adding money.",
        },
      ],
    },
    {
      id: 5,
      question: "What are the types of login?",
      subQuestions: [
        {
          id: "5a",
          question: "How does normal login work?",
          answer: "You can log in using your registered email and password.",
        },
        {
          id: "5b",
          question: "How does Google login work?",
          answer:
            "Click on 'Login with Google,' and sign in using your Google account.",
        },
        {
          id: "5c",
          question: "Can I switch between login types?",
          answer:
            "Yes, you can log in with either type as long as your email matches.",
        },
      ],
    },
  ];

  // Handle main question selection
  const handleQuestionClick = (id) => {
    // Toggle selected question state
    setSelectedQuestionId(selectedQuestionId === id ? null : id);
    setSelectedSubQuestion(null);
    setIsTyping(false);
  };

  // Handle sub-question selection
  const handleSubQuestionClick = (subQuestion) => {
    // Add to chat messages
    setMessages([...messages, { type: "user", text: subQuestion.question }]);

    setSelectedSubQuestion(null);
    setIsTyping(true);
    setCurrentTypingMessage(subQuestion.answer);
  };

  // Handle suggestion click (quick questions above input)
  const handleSuggestionClick = (question) => {
    // Find the full question object from questionBank
    const mainQuestion = questionBank.find((q) => q.question === question);
    if (
      mainQuestion &&
      mainQuestion.subQuestions &&
      mainQuestion.subQuestions.length > 0
    ) {
      handleSubQuestionClick({
        question: mainQuestion.question,
        answer: mainQuestion.subQuestions[0].answer,
      });
    }
  };

  // Search FAQ using backend API
  const searchFAQ = async (query) => {
    try {
      const response = await axios.get(`${API_URL}/api/search-faq`, {
        params: { query },
      });

      return response.data;
    } catch (error) {
      console.error("Error searching FAQ:", error);
      return {
        question: query,
        answer:
          "Sorry, I'm having trouble connecting to the server right now. Please try again later.",
        score: 0,
      };
    }
  };

  // Handle user input submission
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!userQuery.trim()) return;

    // Add user message to chat
    setMessages([...messages, { type: "user", text: userQuery }]);

    // Get response from backend
    const queryText = userQuery;
    setUserQuery("");

    setIsTyping(true);

    // Simulate API delay
    setTimeout(async () => {
      const result = await searchFAQ(queryText);
      const botResponse =
        result.answer ||
        "I'm not sure about that. Can you try asking something else?";

      // Start typing effect instead of directly adding the message
      setCurrentTypingMessage(botResponse);
    }, 500);
  };

  // Voice recognition functionality
  const startListening = () => {
    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setUserQuery(transcript);

        // Auto-submit after a short delay
        setTimeout(() => {
          handleSubmit();
        }, 500);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      alert("Speech recognition is not supported in your browser.");
    }
  };

  // Theme-based classes
  const isDark = currentTheme === "dark";
  const bgClass = isDark ? "bg-[#191919]" : "bg-white";
  const textClass = isDark ? "text-white" : "text-gray-800";
  const borderClass = isDark ? "border-gray-600" : "border-gray-200";
  const headerBgClass = isDark
    ? "bg-gradient-to-r from-purple-600 to-purple-800"
    : "bg-gradient-to-r from-blue-500 to-blue-700";
  const buttonBgClass = isDark
    ? "bg-gray-700 hover:bg-gray-600"
    : "bg-gray-100 hover:bg-gray-200";
  const inputBgClass = isDark
    ? "bg-gray-700 text-white border-gray-600"
    : "bg-white text-gray-800 border-gray-300";
  const messageBgClass = isDark ? "bg-gray-700" : "bg-gray-100";
  const userMessageBgClass = isDark
    ? "bg-purple-600 text-white"
    : "bg-blue-100 text-gray-800";

  return (
    <div>
      {/* Button to toggle chat popup */}
      <button
        ref={buttonRef}
        onClick={togglePopup}
        className={`fixed bottom-20 right-4 ${bgClass} p-2 rounded-full shadow-lg hover:shadow-xl transition-shadow z-50 ${
          isOpen ? "opacity-0" : "opacity-100"
        }`}
        style={{ display: isOpen ? "none" : "block" }}
      >
        <img src={ChatBot} alt="ChatBot" className="w-10 h-10" />
      </button>

      {/* Chat popup with animation */}
      {isOpen && (
        <div
          ref={chatRef}
          className={`fixed z-50 ${bgClass} shadow-2xl ${borderClass} border overflow-hidden flex flex-col resize-none ${
            isFullscreen ? "rounded-none" : "rounded-lg"
          }`}
          style={{
            position: "fixed",
            transition: "all 500ms cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            ...(isAnimating && !isFullscreen && !isOpen
              ? {
                  width: "56px", // Match button width
                  height: "56px", // Match button height
                  right: `${buttonPosition.right}px`,
                  bottom: `${buttonPosition.bottom}px`,
                  borderRadius: "50%",
                }
              : isFullscreen
              ? {
                  width: "100%",
                  height: "100%",
                  right: "0",
                  bottom: "0",
                  borderRadius: "0",
                }
              : {
                  width: "320px",
                  height: "384px",
                  right: "20px",
                  bottom: "10px",
                  borderRadius: "0.5rem",
                }),
          }}
        >
          {/* Chat header */}
          <div className={`${headerBgClass} p-3 text-center relative`}>
            <h2 className="text-xl font-bold text-white">
              Chat with our personal AI assistance
            </h2>
            <p className="text-xs text-white">Get help 24X7</p>

            {/* Global stop speaking button */}
            {isSpeaking && (
              <button
                onClick={stopSpeaking}
                className={`absolute right-20 top-3 text-white ${
                  isDark ? "hover:bg-purple-700" : "hover:bg-blue-600"
                } p-1 rounded animate-pulse`}
                title="Stop speaking"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 11-6.219-8.56"
                  />
                </svg>
              </button>
            )}

            {/* Toggle fullscreen button */}
            <button
              onClick={toggleFullscreen}
              className={`absolute right-10 top-3 text-white ${
                isDark ? "hover:bg-purple-700" : "hover:bg-blue-600"
              } p-1 rounded`}
            >
              {isFullscreen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 3v3a2 2 0 01-2 2H3m18 0h-3a2 2 0 01-2-2V3m0 18v-3a2 2 0 012-2h3M3 16h3a2 2 0 012 2v3"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 0h-4m4 0l-5-5"
                  />
                </svg>
              )}
            </button>

            {/* Close button */}
            <button
              onClick={togglePopup}
              className={`absolute right-3 top-3 text-white ${
                isDark ? "hover:bg-purple-700" : "hover:bg-blue-600"
              } p-1 rounded`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Chat body */}
          <div ref={chatBodyRef} className="flex-1 p-3 overflow-y-auto">
            <div ref={messagesStartRef} />{" "}
            {/* Reference for scrolling to top */}
            {/* Initial greeting for new chat */}
            {messages.length === 0 && (
              <div className="mb-3">
                <p className={`${textClass} mb-2`}>
                  Hello! How can I help you with Auction X today?
                </p>
                <p
                  className={`${
                    isDark ? "text-gray-400" : "text-gray-600"
                  } text-sm`}
                >
                  Choose from popular questions below or type your own:
                </p>
              </div>
            )}
            {/* Message history */}
            {messages.length > 0 && (
              <div className="mb-3 space-y-3">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${
                      msg.type === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {msg.type === "bot" && (
                      <div className="w-8 h-8 rounded-full mr-2 self-end overflow-hidden">
                        <img
                          src="data:image/png;base64,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"
                          alt="Bot"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex flex-col">
                      <div
                        className={`max-w-3/4 p-2 rounded-lg ${
                          msg.type === "user"
                            ? userMessageBgClass
                            : `${messageBgClass} ${textClass}`
                        }`}
                      >
                        {msg.text}
                      </div>
                      {/* Speak button for bot messages */}
                      {msg.type === "bot" && (
                        <div className="flex justify-start mt-1">
                          <button
                            onClick={() => speakText(msg.text, idx)}
                            className={`text-xs px-2 py-1 rounded-full ${
                              speakingMessageIndex === idx
                                ? isDark
                                  ? "bg-purple-600 text-white animate-pulse"
                                  : "bg-blue-500 text-white animate-pulse"
                                : isDark
                                ? "bg-gray-600 hover:bg-gray-500 text-gray-300"
                                : "bg-gray-200 hover:bg-gray-300 text-gray-600"
                            } transition-colors duration-200`}
                            disabled={
                              isSpeaking && speakingMessageIndex !== idx
                            }
                            title={
                              speakingMessageIndex === idx
                                ? "Speaking..."
                                : "Click to hear this message"
                            }
                          >
                            {speakingMessageIndex === idx ? (
                              <div className="flex items-center space-x-1">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-3 w-3"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 9H4a1 1 0 00-1 1v4a1 1 0 001 1h1.586l4.707 4.707C10.923 20.337 12 19.939 12 19V5c0-.939-1.077-1.337-1.707-.707L5.586 9z"
                                  />
                                </svg>
                                <span>Speaking...</span>
                              </div>
                            ) : (
                              <div className="flex items-center space-x-1">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-3 w-3"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 9H4a1 1 0 00-1 1v4a1 1 0 001 1h1.586l4.707 4.707C10.923 20.337 12 19.939 12 19V5c0-.939-1.077-1.337-1.707-.707L5.586 9z"
                                  />
                                </svg>
                                <span>Speak</span>
                              </div>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Typing indicator or real-time typing text */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="w-8 h-8 rounded-full mr-2 self-end overflow-hidden">
                      <img
                        src="data:image/png;base64,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"
                        alt="Bot"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div
                      className={`${messageBgClass} p-2 rounded-lg ${
                        isDark ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {typingText || (
                        <div className="flex space-x-1">
                          <div
                            className={`w-2 h-2 ${
                              isDark ? "bg-gray-400" : "bg-gray-500"
                            } rounded-full animate-bounce`}
                            style={{ animationDelay: "0ms" }}
                          ></div>
                          <div
                            className={`w-2 h-2 ${
                              isDark ? "bg-gray-400" : "bg-gray-500"
                            } rounded-full animate-bounce`}
                            style={{ animationDelay: "150ms" }}
                          ></div>
                          <div
                            className={`w-2 h-2 ${
                              isDark ? "bg-gray-400" : "bg-gray-500"
                            } rounded-full animate-bounce`}
                            style={{ animationDelay: "300ms" }}
                          ></div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
            {/* Main question list - Only show if not in fullscreen mode */}
            {!isFullscreen && (
              <div className="space-y-1">
                {questionBank.map((mainQuestion) => (
                  <div key={mainQuestion.id} id={`question-${mainQuestion.id}`}>
                    <button
                      ref={(el) => (questionRefs.current[mainQuestion.id] = el)}
                      onClick={() => handleQuestionClick(mainQuestion.id)}
                      className={`w-full text-left p-2 ${buttonBgClass} rounded-lg ${textClass} text-sm font-semibold`}
                    >
                      {mainQuestion.question}
                    </button>

                    {/* Sub-questions */}
                    {selectedQuestionId === mainQuestion.id && (
                      <div className="ml-3 mt-1 space-y-1">
                        {mainQuestion.subQuestions.map((subQuestion) => (
                          <button
                            key={subQuestion.id}
                            id={`subquestion-${subQuestion.id}`}
                            ref={(el) =>
                              (subQuestionRefs.current[subQuestion.id] = el)
                            }
                            onClick={() => handleSubQuestionClick(subQuestion)}
                            className={`w-full text-left p-2 ${
                              isDark
                                ? "bg-gray-800 hover:bg-gray-700"
                                : "bg-gray-50 hover:bg-gray-100"
                            } rounded-lg ${
                              isDark ? "text-gray-300" : "text-gray-700"
                            } text-sm`}
                          >
                            {subQuestion.question}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Suggestion questions in fullscreen mode */}
          {isFullscreen && (
            <div
              className={`flex flex-wrap justify-center gap-2 px-4 py-2 border-t ${borderClass}`}
            >
              {questionBank.map((q) => (
                <button
                  key={q.id}
                  onClick={() => handleSuggestionClick(q.question)}
                  className={`${buttonBgClass} ${textClass} text-xs px-3 py-1 rounded-full`}
                >
                  {q.question}
                </button>
              ))}
            </div>
          )}

          {/* Input area */}
          <form
            onSubmit={handleSubmit}
            className={`p-3 border-t ${borderClass}`}
          >
            <div className="flex">
              <input
                type="text"
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                placeholder="Type your question..."
                className={`flex-1 p-2 border rounded-l-lg focus:outline-none focus:ring-1 ${
                  isDark ? "focus:ring-purple-500" : "focus:ring-blue-500"
                } ${inputBgClass}`}
              />
              {/* Voice input button */}
              <button
                type="button"
                onClick={startListening}
                className={`${
                  isDark
                    ? "bg-gray-600 hover:bg-gray-500"
                    : "bg-gray-200 hover:bg-gray-300"
                } p-2 ${
                  isListening
                    ? "text-red-500"
                    : isDark
                    ? "text-gray-300"
                    : "text-gray-700"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  />
                </svg>
              </button>
              {/* Send button */}
              <button
                type="submit"
                className={`${
                  isDark
                    ? "bg-purple-600 hover:bg-purple-700"
                    : "bg-blue-500 hover:bg-blue-600"
                } text-white p-2 rounded-r-lg`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatQnA;
