import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

const WhiteThemeHeader = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const timeoutRef = useRef(null);
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const handleDropdownToggle = (index) => {
    if (activeDropdown === index) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(index);
    }
  };

  // Handle mouse enter with delay clearing
  const handleMouseEnter = (index) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setActiveDropdown(index);
  };

  // Handle mouse leave with delay
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 300); // 300ms delay gives users time to move to the dropdown
  };

  // Navigation handler for Sign In and Start Selling buttons
const handleAuthNavigation = (isSeller = false) => {
  // Force the route change even if we're already on the login page
  navigate("/login", { 
    state: { 
      isFlipped: isSeller, 
      key: Date.now() // Add a unique timestamp to force route update
    } 
  });
};




  const navigationItems = [
    {
      title: "Learn",
      items: [
        { title: "Seller Success Story", path: "/learn/seller-success-story" },
        { title: "FAQs", path: "/learn/faqs" },
        { title: "Seller Vlogs", path: "/learn/seller-vlogs" },
      ],
    },
    {
      title: "Grow",
      items: [
        { title: "Auction X Ads", path: "/grow/auction-x-ads" },
        { title: "Insight and Tools", path: "/grow/insight-and-tools" },
        { title: "Service Partners", path: "/grow/service-partners" },
        {
          title: "Auction X Value Services",
          path: "/grow/auction-x-value-services",
        },
        { title: "Shopping Festivals", path: "/grow/shopping-festivals" },
      ],
    },
    {
      title: "Fees and Commission",
      items: [
        { title: "Payment Cycle", path: "/fees/payment-cycle" },
        { title: "Fees Type", path: "/fees/fees-type" },
        {
          title: "Calculate Gross Margin",
          path: "/fees/calculate-gross-margin",
        },
      ],
    },
    {
      title: "Sell Online",
      items: [
        { title: "Create Account", path: "/sell-online/create-account" },
        { title: "List Products", path: "/sell-online/list-products" },
        {
          title: "Storage and Shipping",
          path: "/sell-online/storage-and-shipping",
        },
        { title: "Receive Payment", path: "/sell-online/receive-payment" },
        { title: "Grow Faster", path: "/sell-online/grow-faster" },
        { title: "Help and Support", path: "/sell-online/help-and-support" },
        {
          title: "Terms and Condition",
          path: "/sell-online/terms-and-condition",
        },
      ],
    },
  ];

  return (
    <div className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <header className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo on the far left */}
            <div className="flex-shrink-0 mr-8">
              <Link to="/" className="flex items-center">
                <img
                  className="w-auto h-10"
                  src="https://res.cloudinary.com/dszvpb3q5/image/upload/v1731178921/cifsfk5fzryh0iwp3fua.png"
                  alt="Logo"
                />
              </Link>
            </div>

            {/* Navigation links - centered */}
            <div className="hidden lg:flex lg:items-center lg:justify-center flex-1">
              {navigationItems.map((category, index) => (
                <div className="relative px-4" key={index}>
                  <button
                    className="text-gray-800 font-medium hover:text-blue-600 transition-colors duration-200 py-2 focus:outline-none text-sm"
                    onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={handleMouseLeave}
                  >
                    {category.title}
                  </button>
                  {activeDropdown === index && (
                    <div
                      className="absolute left-0 mt-2 w-64 bg-white rounded-md shadow-lg py-2 z-50"
                      onMouseEnter={() => handleMouseEnter(index)}
                      onMouseLeave={handleMouseLeave}
                    >
                      {category.items.map((item, itemIndex) => (
                        <Link
                          key={itemIndex}
                          to={item.path}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                        >
                          {item.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Buttons on the right */}
            <div className="flex items-center space-x-3">
              <button 
                className="text-sm text-gray-700 hover:text-blue-600 px-3 py-1 hidden sm:block"
                onClick={() => handleAuthNavigation(true)}
              >
                Sign In
              </button>
              <button 
                className="text-sm text-white bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                onClick={() => handleAuthNavigation(true)}
              >
                Start Selling
              </button>

              {/* Mobile menu button */}
              <button
                onClick={toggleMobileMenu}
                className="lg:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
              >
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {isMobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-gray-50 border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigationItems.map((category, index) => (
                <div key={index} className="py-2">
                  <button
                    onClick={() => handleDropdownToggle(index)}
                    className="w-full flex items-center justify-between px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-md"
                  >
                    <span>{category.title}</span>
                    <svg
                      className={`ml-2 h-5 w-5 transition-transform duration-200 ${
                        activeDropdown === index ? "transform rotate-180" : ""
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>

                  {activeDropdown === index && (
                    <div className="mt-2 pl-4">
                      {category.items.map((item, itemIndex) => (
                        <Link
                          key={itemIndex}
                          to={item.path}
                          className="block px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-md"
                          onClick={toggleMobileMenu}
                        >
                          {item.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="flex flex-col px-4 space-y-3">
                  <button 
                    className="block w-full text-center px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-md"
                    onClick={() => handleAuthNavigation(true)}
                  >
                    Sign In
                  </button>
                  <button 
                    className="block w-full text-center px-3 py-2 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                    onClick={() => handleAuthNavigation(true)}
                  >
                    Start Selling
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>
    </div>
  );
};

export default WhiteThemeHeader;