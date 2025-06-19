import { useEffect, useRef, useState } from "react";
import React from "react";
import PopupModal from "../../Modals/PopupModal/PopupModal";
import { useThemeProvider } from "../../AdminDashboard/utils/ThemeContext"; // Adjust the path as needed

export default function ProductList5() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [timeLeft, setTimeLeft] = useState({});
  const productRefs = useRef([]);
  const { currentTheme } = useThemeProvider();
  const API_URL = import.meta.env.VITE_API_URL;

  // Function to shuffle array (Fisher-Yates algorithm)
  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Function to truncate text
  const truncateText = (text, maxLength = 60) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  // Helper function to get first description item
  const getFirstDescription = (descriptionArray) => {
    if (!descriptionArray || !Array.isArray(descriptionArray) || descriptionArray.length === 0) {
      return { name: "", description: "" };
    }
    return descriptionArray[0];
  };

  // Timer initialization and update functions
  const initializeTimers = (products) => {
    products.forEach((product) => {
      const { biddingStartDate, biddingStartTime, biddingEndTime } = product;
      const startDate = new Date(biddingStartDate);
      const startTime = new Date(biddingStartTime);
      startDate.setUTCHours(startTime.getUTCHours(), startTime.getUTCMinutes(), 0, 0);
      
      const endTime = new Date(biddingEndTime);
      if (!isNaN(endTime)) {
        updateTimer(product._id, startDate, endTime);
        const timerId = setInterval(() => updateTimer(product._id, startDate, endTime), 1000);
        
        // Store timer ID to clear it later if needed
        product.timerId = timerId;
      } else {
        console.error("Invalid end time for product:", product._id);
      }
    });
  };

  const updateTimer = (productId, startTime, endTime) => {
    const now = new Date().getTime();
    let difference = now < startTime.getTime() ? startTime.getTime() - now : endTime.getTime() - now;
    
    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      
      setTimeLeft((prev) => ({
        ...prev,
        [productId]: {
          days: String(days).padStart(2, "0"),
          hours: String(hours).padStart(2, "0"),
          minutes: String(minutes).padStart(2, "0"),
          seconds: String(seconds).padStart(2, "0"),
        },
      }));
    } else {
      setTimeLeft((prev) => ({
        ...prev,
        [productId]: {
          days: "00",
          hours: "00",
          minutes: "00",
          seconds: "00",
        },
      }));
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/api/products/`);
        const data = await response.json();
        
        // Check if data.products exists
        const productsArray = data.products || [];
        
        const activeProducts = productsArray
          .filter((product) => product.status === "Active")
          .slice(0, 10); // Limit to 10 products

        if (activeProducts.length > 0) {
          const randomizedData = shuffleArray(activeProducts);
          setProducts(randomizedData);
          
          // Initialize timers for products
          initializeTimers(randomizedData);
        } else {
          console.log("No active products found");
          setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    // Cleanup function to clear intervals
    return () => {
      products.forEach((product) => {
        if (product.timerId) {
          clearInterval(product.timerId);
        }
      });
    };
  }, []);

  useEffect(() => {
    if (!loading) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const delay = entry.target.getAttribute("data-delay") || 0;
              setTimeout(() => {
                entry.target.classList.add("animate-slide-fade");
                entry.target.classList.remove("opacity-0");
              }, delay);
            }
          });
        },
        { threshold: 0.2 }
      );

      productRefs.current.forEach((card) => {
        if (card) observer.observe(card);
      });
      return () => observer.disconnect();
    }
  }, [loading]);

  return (
    <section className={`w-full ${currentTheme === 'dark' ? 'bg-[#191919]' : 'bg-gray-100'} py-16`}>
      <div className="container max-w-full mx-auto px-4 sm:px-6">
        <h2 className={`text-3xl sm:text-4xl font-bold text-center mb-12 ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Our Snacks
        </h2>
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className={`p-4 sm:p-6 rounded-lg shadow animate-pulse ${currentTheme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
              ></div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            {products.map((product, index) => {
              const firstDescItem = getFirstDescription(product.description);
              const productTimer = timeLeft[product._id] || {
                days: "00",
                hours: "00",
                minutes: "00",
                seconds: "00",
              };
              
              return (
                <div
                  key={product._id || index}
                  ref={(el) => (productRefs.current[index] = el)}
                  className={`p-4 sm:p-6 rounded-lg shadow transition-transform duration-300 ease-in-out opacity-0 product-card ${
                    currentTheme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
                  }`}
                  data-delay={index * 100} // Sequential delay based on index
                >
                  <img
                    src={product.images && product.images[0]?.secure_url}
                    alt={product.name}
                    className="w-full h-32 sm:h-48 object-cover rounded-md"
                  />
                  <h3 className={`mt-3 sm:mt-4 text-lg sm:text-xl font-bold ${
                    currentTheme === 'dark' ? 'text-white' : 'text-gray-800'
                  }`}>
                    {product.name}
                  </h3>
                  {firstDescItem && (
                    <>
                      <h4 className={`text-sm font-medium ${
                        currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {firstDescItem.name}
                      </h4>
                      <p className={`text-sm sm:text-base mt-1 sm:mt-2 ${
                        currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {truncateText(firstDescItem.description)}
                      </p>
                    </>
                  )}
                  <p className={`text-base sm:text-lg font-semibold mt-1 sm:mt-2 ${
                    currentTheme === 'dark' ? 'text-orange-400' : 'text-gray-900'
                  }`}>
                    Starting at: ${product.biddingStartPrice}
                  </p>
                  {/* Timer Display */}
                  <div className={`mt-2 sm:mt-4 flex justify-between text-sm font-medium ${
                    currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    <div className="flex flex-col items-center">
                      <span>{productTimer.days}</span>
                      <span className="text-xs">Days</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span>{productTimer.hours}</span>
                      <span className="text-xs">Hours</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span>{productTimer.minutes}</span>
                      <span className="text-xs">Mins</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span>{productTimer.seconds}</span>
                      <span className="text-xs">Secs</span>
                    </div>
                  </div>
                  <button
                    className={`mt-2 sm:mt-4 text-white px-3 sm:px-4 py-1 sm:py-2 rounded transition-all duration-300 text-sm sm:text-base ${
                      currentTheme === 'dark' 
                        ? 'bg-orange-600 hover:bg-orange-700' 
                        : 'bg-orange-500 hover:bg-orange-600'
                    }`}
                    onClick={() => setSelectedProduct(product)}
                  >
                    View Details
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-12">
            <svg 
              className={`w-16 h-16 mb-4 ${currentTheme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              ></path>
            </svg>
            <h3 className={`text-lg font-medium ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              No products available
            </h3>
            <p className={`mt-1 text-sm ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Check back soon for new products
            </p>
          </div>
        )}
      </div>
      {selectedProduct && (
        <PopupModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          currentTheme={currentTheme}
        />
      )}
      <style>{`
        @keyframes slide-fade-up {
          0% { transform: translateY(50px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-fade {
          animation: slide-fade-up 0.5s ease-out forwards;
        }
      `}</style>
    </section>
  );
}