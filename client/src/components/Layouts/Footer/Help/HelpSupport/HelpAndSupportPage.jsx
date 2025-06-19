import React, { useState, useEffect } from "react";
import { useSelector ,useDispatch } from "react-redux";
import { fetchCsrfToken } from "../../../../../redux/slices/csrfSecuritySlice";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import axios from 'axios';

const HelpAndSupportPage = () => {
  const [activeTab, setActiveTab] = useState("faq");
  const [searchQuery, setSearchQuery] = useState("");
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [ticketSubmitted, setTicketSubmitted] = useState(false);
   const { token: csrfToken, loading } = useSelector((state) => state.csrf);
    const dispatch = useDispatch();

  // Get user data from Redux store
  const user = useSelector((state) => state.auth?.user || state.user?.data || state.user);
  // Adjust the path above based on your Redux store structure
  // Common patterns: state.auth.user, state.user.data, state.user, etc.


    useEffect(() => {
      if (!csrfToken && !loading) {
        dispatch(fetchCsrfToken());
      }
    }, [dispatch, csrfToken, loading]);
  

  // Populate form with user data when component mounts or user data changes
  useEffect(() => {
    if (user) {
      setContactForm(prev => ({
        ...prev,
        name: user.name || user.fullName || user.firstName + ' ' + user.lastName || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  // Handle contact form changes
  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle contact form submission
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Create payload for API
      const payload = {
        category: 'support',
        fullName: contactForm.name,
        email: contactForm.email,
        requestType: contactForm.subject,
        details: contactForm.message
      };
      
      // Send to API
    const response = await fetch('https://localhost:5000/api/privacy', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfToken,
    },
    body: JSON.stringify(payload),
    credentials: 'include',
});

      
      if (!response.ok) {
        throw new Error('Failed to submit support ticket');
      }
      
      toast.success("Your support ticket has been submitted");
      setTicketSubmitted(true);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error("There was an error submitting your ticket. Please try again.");
    }
  };

  // Filter FAQs based on search query
  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );


  return (
<div className="min-h-screen bg-[#191919] py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
            Help & Support
          </h1>
          <p className="mt-4 text-xl text-gray-300">
            We're here to help you make the most of your Auction X experience
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto mb-10">
          <input
            type="text"
            placeholder="Search for help..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-600 bg-[#303030] text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm"
          />
          <svg
            className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-600 mb-8">
          <nav className="flex -mb-px space-x-8 justify-center">
            <button
              onClick={() => setActiveTab("faq")}
              className={`py-4 px-1 border-b-2 font-medium text-md ${
                activeTab === "faq"
                  ? "border-purple-500 text-purple-400"
                  : "border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500"
              }`}
            >
              Frequently Asked Questions
            </button>
            <button
              onClick={() => setActiveTab("guides")}
              className={`py-4 px-1 border-b-2 font-medium text-md ${
                activeTab === "guides"
                  ? "border-purple-500 text-purple-400"
                  : "border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500"
              }`}
            >
              User Guides
            </button>
            <button
              onClick={() => setActiveTab("contact")}
              className={`py-4 px-1 border-b-2 font-medium text-md ${
                activeTab === "contact"
                  ? "border-purple-500 text-purple-400"
                  : "border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500"
              }`}
            >
              Contact Support
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-[#303030] rounded-xl shadow-lg p-6 mb-10">
          {/* FAQ Section */}
          {activeTab === "faq" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">
                Frequently Asked Questions
              </h2>

              {searchQuery && filteredFaqs.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-lg text-gray-300">
                    No FAQs match your search query. Please try different keywords or contact our support team.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-600">
                  {(searchQuery ? filteredFaqs : faqs).map((faq, index) => (
                    <FaqItem key={index} faq={faq} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* User Guides Section */}
          {activeTab === "guides" && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">
                User Guides
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {guides.map((guide, index) => (
                  <GuideCard key={index} guide={guide} />
                ))}
              </div>
            </div>
          )}

          {/* Contact Support Section */}
          {activeTab === "contact" && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">
                Contact Support
              </h2>

              {ticketSubmitted ? (
                <div className="bg-green-900/30 border border-green-600 rounded-lg p-6 text-center">
                  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-800/50 mb-4">
                    <svg
                      className="h-8 w-8 text-green-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-green-400 mb-2">
                    Support Ticket Submitted!
                  </h3>
                  <p className="text-green-300 mb-4">
                    We've received your request and will get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setTicketSubmitted(false)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    Submit Another Request
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-2">
                    <form onSubmit={handleContactSubmit} className="space-y-6">
                       <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-300"
            >
              Your Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              required
              value={contactForm.name}
              onChange={handleContactChange}
              className="mt-1 block w-full rounded-md border-gray-600 bg-[#191919] text-white shadow-sm focus:border-purple-500 focus:ring-purple-500"
              placeholder={user ? "" : "Enter your name"}
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300"
            >
              Email Address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              required
              value={contactForm.email}
              onChange={handleContactChange}
              className="mt-1 block w-full rounded-md border-gray-600 bg-[#191919] text-white shadow-sm focus:border-purple-500 focus:ring-purple-500"
              placeholder={user ? "" : "Enter your email"}
            />
          </div>

                      <div>
                        <label
                          htmlFor="subject"
                          className="block text-sm font-medium text-gray-300"
                        >
                          Subject
                        </label>
                        <select
                          name="subject"
                          id="subject"
                          required
                          value={contactForm.subject}
                          onChange={handleContactChange}
                          className="mt-1 block w-full rounded-md border-gray-600 bg-[#191919] text-white shadow-sm focus:border-purple-500 focus:ring-purple-500"
                        >
                          <option value="">Select a topic</option>
                          <option value="Bidding Issues">Bidding Issues</option>
                          <option value="Payment Issues">Payment Issues</option>
                          <option value="Account Questions">Account Questions</option>
                          <option value="Item Questions">Item Questions</option>
                          <option value="Shipping & Delivery">Shipping & Delivery</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor="message"
                          className="block text-sm font-medium text-gray-300"
                        >
                          Message
                        </label>
                        <textarea
                          name="message"
                          id="message"
                          rows={5}
                          required
                          value={contactForm.message}
                          onChange={handleContactChange}
                          className="mt-1 block w-full rounded-md border-gray-600 bg-[#191919] text-white placeholder-gray-400 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                          placeholder="Please describe your issue or question in detail..."
                        ></textarea>
                      </div>

                      <div>
                        <button
                          type="submit"
                          className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                        >
                          Submit Support Ticket
                        </button>
                      </div>
                    </form>
                  </div>

                  <div className="bg-[#191919] p-6 rounded-lg">
                    <h3 className="text-lg font-medium text-white mb-4">
                      Contact Information
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <svg
                          className="h-6 w-6 text-purple-400 mt-0.5 mr-3 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="text-gray-300">support@auctionx.com</span>
                      </div>
                      <div className="flex items-start">
                        <svg
                          className="h-6 w-6 text-purple-400 mt-0.5 mr-3 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                        <span className="text-gray-300">1-800-AUCTION (1-800-282-8466)</span>
                      </div>
                      <div className="flex items-start">
                        <svg
                          className="h-6 w-6 text-purple-400 mt-0.5 mr-3 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <div>
                          <span className="block text-gray-300">Support Hours</span>
                          <span className="block text-gray-400 text-sm">
                            Monday-Friday: 9am - 8pm EST
                          </span>
                          <span className="block text-gray-400 text-sm">
                            Saturday: 10am - 6pm EST
                          </span>
                          <span className="block text-gray-400 text-sm">
                            Sunday: Closed
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8">
                      <h4 className="text-md font-medium text-white mb-2">
                        Expected Response Time
                      </h4>
                      <p className="text-sm text-gray-400">
                        We aim to respond to all inquiries within 24 hours during business days.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

      {/* Quick Links */}
    <div className="bg-white dark:bg-[#303030] rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Quick Links</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/guide">
            <QuickLink
              title="Bidding Guide"
              icon={
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              }
            />
          </Link>
          <Link to="/payment">
            <QuickLink
              title="Payment Options"
              icon={
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              }
            />
          </Link>
          <Link to="/shipping">
            <QuickLink
              title="Shipping Policy"
              icon={
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
                  />
                </svg>
              }
            />
          </Link>
          <Link to="/return-policy">
            <QuickLink
              title="Return Policy"
              icon={
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z"
                  />
                </svg>
              }
            />
          </Link>
        </div>
      </div>

      </div>
    </div>
  );
};

// FAQ Accordion Item Component
const FaqItem = ({ faq }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full text-left focus:outline-none"
      >
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">{faq.question}</h3>
        <span className="ml-6 flex-shrink-0">
          <svg
            className={`h-5 w-5 transform ${isOpen ? "rotate-180" : "rotate-0"}`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </span>
      </button>
      <div
        className={`mt-2 transition-all duration-200 ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <p className="text-gray-600 dark:text-gray-300 text-base">{faq.answer}</p>
      </div>
    </div>
  );
};

// Guide Card Component
const GuideCard = ({ guide }) => {
  return (
    <div className="bg-gray-50 dark:bg-[#303030] rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 ">
      <div className="p-5">
        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-500 text-white mb-4">
          {guide.icon}
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{guide.title}</h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{guide.description}</p>
        <a
          href={guide.link}
          className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 font-medium text-sm inline-flex items-center"
        >
          Read Guide
          <svg
            className="w-4 h-4 ml-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            ></path>
          </svg>
        </a>
      </div>
    </div>
  );
};

// Quick Link Component
const QuickLink = ({ title, icon }) => {
  return (
    <a
      href="#"
      className="flex items-center p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
    >
      <div className="flex-shrink-0 text-purple-600 dark:text-purple-400 mr-3">{icon}</div>
      <span className="text-sm font-medium text-gray-700 dark:text-white">{title}</span>
    </a>
  );
};
// Sample data for FAQs
const faqs = [
  {
    question: "How do I place a bid?",
    answer:
      "To place a bid, navigate to the item you're interested in and click the 'Bid Now' button. Enter your bid amount, which must be at least the minimum bid increment above the current bid. Review your bid details and confirm. You'll receive a confirmation email once your bid is placed."
  },
  {
    question: "What happens if I win an auction?",
    answer:
      "Congratulations! When you win an auction, you'll receive a notification email with payment instructions. You'll need to complete the payment within 48 hours. Once payment is confirmed, the seller will ship the item to your registered address."
  },
  {
    question: "How do shipping costs work?",
    answer:
      "Shipping costs are typically calculated based on the item's size, weight, and your delivery location. The shipping cost will be displayed on the item page before you place a bid. Some sellers offer free shipping, which will be clearly indicated on the item listing."
  },
  {
    question: "Can I cancel a bid once it's placed?",
    answer:
      "In exceptional circumstances, we may allow bid cancellations. Please contact our support team immediately with your bid details and reason for cancellation. Note that cancellations are reviewed on a case-by-case basis and are not guaranteed."
  },
  {
    question: "What payment methods are accepted?",
    answer:
      "We accept various payment methods including credit/debit cards (Visa, MasterCard, American Express), PayPal, and bank transfers. Available payment options will be shown during the checkout process after winning an auction."
  },
  {
    question: "What is your return policy?",
    answer:
      "Our return policy allows for returns within 14 days of receiving an item if it significantly differs from its description. Items must be returned in their original condition. Some specialty items may be marked as 'no returns', which will be clearly indicated in the listing."
  },
];

// Sample data for guides
const guides = [
  {
    title: "Getting Started with Auction X",
    description: "Learn the basics of navigating our platform and setting up your account for success.",
    link: "#",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )
  },
  {
    title: "Bidding Strategies",
    description: "Discover effective bidding techniques to increase your chances of winning auctions.",
    link: "#",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )
  },
  {
    title: "Payment & Shipping Guide",
    description: "Everything you need to know about completing payments and shipping arrangements.",
    link: "#",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    )
  },
  {
    title: "Seller's Handbook",
    description: "Learn how to effectively list and sell your items on our auction platform.",
    link: "#",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    )
  },
  {
    title: "Authentication Process",
    description: "Understand how our experts authenticate items to ensure quality and authenticity.",
    link: "#",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    )
  },
  {
    title: "Dispute Resolution",
    description: "How to resolve issues with transactions, bidding, or item conditions.",
    link: "#",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016zM12 9v2m0 4h.01" />
      </svg>
    )
  },
];

export default HelpAndSupportPage;