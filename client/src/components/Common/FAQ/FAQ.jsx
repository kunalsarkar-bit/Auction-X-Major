import { useState } from "react";

const FAQItem = ({ question, answer }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border-b border-gray-200 py-4">
      <button
        className="w-full flex justify-between items-center text-left focus:outline-none"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
      >
        <span className="text-lg font-semibold text-gray-800">{question}</span>
        <span
          className={`w-8 h-8 text-4xl ml-2 text-gray-800 transform transition-transform duration-300 ease-in-out ${
            expanded ? "rotate-45" : ""
          }`}
        >
          +
        </span>
      </button>
      <div
        className={`mt-2 text-gray-600 overflow-hidden transition-all duration-300 ease-in-out ${
          expanded ? "max-h-[500px]" : "max-h-0"
        }`}
      >
        <p>{answer}</p>
      </div>
    </div>
  );
};

const FAQList = () => {
  const faqData = [
    {
      question: "What is your refund policy?",
      answer:
        "We offer a 30-day refund policy on all our products. Please contact support for more details.",
    },
    {
      question: "How can I track my order?",
      answer:
        "You can track your order using the tracking number provided in your order confirmation email.",
    },
    {
      question: "Do you offer technical support?",
      answer:
        "Yes, we provide 24/7 technical support. Contact us anytime for assistance.",
    },
  ];

  return (
    <div className="w-full max-w-[2000px] mx-auto my-8 p-8 bg-white shadow rounded-xl overflow-x-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Frequently Asked Questions
      </h2>
      {faqData.map((faq, index) => (
        <FAQItem key={index} question={faq.question} answer={faq.answer} />
      ))}
    </div>
  );
};

export default FAQList;
