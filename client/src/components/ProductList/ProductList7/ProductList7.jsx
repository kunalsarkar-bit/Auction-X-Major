import React, { useState, useEffect, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GiSandsOfTime } from "react-icons/gi";
import { ImPriceTags } from "react-icons/im";
import ReactDOM from "react-dom";
import PopupModal from "../../Modals/PopupModal/PopupModal";
import { useThemeProvider } from "../../AdminDashboard/utils/ThemeContext"; // Adjust the import path as needed

const SkeletonProductCard = ({ darkMode }) => {
  return (
    <div
      className={`w-full sm:w-[46%] md:w-[30%] lg:w-[23%] xl:w-[18%] h-[380px] m-[2%] p-4 mt-8 rounded-xl ${
        darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      } border shadow-sm flex flex-col justify-between animate-pulse`}
    >
      <div
        className={`w-full h-[150px] ${
          darkMode ? "bg-gray-700" : "bg-gray-300"
        } rounded-xl`}
      ></div>
      <div
        className={`h-6 ${
          darkMode ? "bg-gray-700" : "bg-gray-300"
        } rounded w-3/4 mx-auto my-2`}
      ></div>
      <div
        className={`h-4 ${
          darkMode ? "bg-gray-700" : "bg-gray-300"
        } rounded w-1/2 mx-auto my-2`}
      ></div>
      <div
        className={`h-4 ${
          darkMode ? "bg-gray-700" : "bg-gray-300"
        } rounded w-1/2 mx-auto my-2`}
      ></div>
      <div
        className={`h-10 ${
          darkMode ? "bg-gray-700" : "bg-gray-300"
        } rounded w-full mt-auto`}
      ></div>
    </div>
  );
};

const ProductList7 = () => {
  const navigate = useNavigate();
  const { currentTheme } = useThemeProvider();
  const darkMode = currentTheme === "dark";

  const [products, setProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [productsPerPage, setProductsPerPage] = useState(11);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isFetching, setIsFetching] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;

  // Adjust products per page based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setProductsPerPage(4); // Mobile
      } else if (window.innerWidth < 1024) {
        setProductsPerPage(6); // Tablet
      } else {
        setProductsPerPage(11); // Desktop
      }
    };

    // Set initial value and add listener
    handleResize();
    window.addEventListener("resize", handleResize);

    // Clean up
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleOpenPopup = (productId) => {
    const product = products.find((p) => p._id === productId);
    setSelectedProduct(product);
  };

  const handleClosePopup = () => {
    setSelectedProduct(null);
  };

  const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  useEffect(() => {
    const fetchAndRandomizeProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/api/products/`);
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();

        // Extract the products array from the response
        const productsArray = data.products || [];

        // Filter active products
        const activeProducts = productsArray.filter(
          (product) => product.status === "Active"
        );

        if (activeProducts.length === 0) {
          console.log("No active products found");
        }
        const randomizedData = shuffleArray(activeProducts);
        setProducts(randomizedData);
        setDisplayedProducts(randomizedData.slice(0, productsPerPage));
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchAndRandomizeProducts();
  }, [productsPerPage]);

  const loadMoreProducts = useCallback(() => {
    if (loading) return;
    setLoading(true);

    setTimeout(() => {
      const nextIndex = currentIndex + productsPerPage;
      setDisplayedProducts((prev) => [
        ...prev,
        ...products.slice(currentIndex, nextIndex),
      ]);
      setCurrentIndex(nextIndex);
      setLoading(false);
    }, 2000);
  }, [currentIndex, loading, products, productsPerPage]);

  const handleScroll = (e) => {
    const container = e.target;
    // More responsive threshold for different devices
    const threshold = 100; // px from bottom to trigger load
    const isNearBottom =
      container.scrollHeight - (container.scrollTop + container.clientHeight) <=
      threshold;

    if (isNearBottom && !loading) {
      loadMoreProducts();
    }
  };

  const calculateTimeLeft = (
    biddingStartDate,
    biddingStartTime,
    biddingEndTime
  ) => {
    // Check if any of the required values are missing or invalid
    if (!biddingStartDate || !biddingStartTime || !biddingEndTime) {
      return "Date not available";
    }

    try {
      const startDate = new Date(biddingStartDate);
      const startTime = new Date(biddingStartTime);

      // Check if dates are valid
      if (isNaN(startDate.getTime()) || isNaN(startTime.getTime())) {
        return "Invalid date";
      }

      startDate.setUTCHours(
        startTime.getUTCHours(),
        startTime.getUTCMinutes(),
        0,
        0
      );

      const endDateTime = new Date(biddingEndTime);

      // Check if end date is valid
      if (isNaN(endDateTime.getTime())) {
        return "Invalid end date";
      }

      const now = new Date();

      let timeDifference;
      let isBiddingStarted = now >= startDate;

      if (isBiddingStarted) {
        timeDifference = endDateTime - now;
      } else {
        timeDifference = startDate - now;
      }

      if (timeDifference <= 0) return "Time expired";

      // Calculate time components
      const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor(
        (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
      );
      const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

      // Simplify the display on smaller screens
      if (window.innerWidth < 640) {
        return `${days}d ${hours}h`;
      }

      return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    } catch (error) {
      console.error("Error calculating time:", error, {
        startDate: biddingStartDate,
        startTime: biddingStartTime,
        endTime: biddingEndTime,
      });
      return "Time calculation error";
    }
  };

  const [liveCountdown, setLiveCountdown] = useState({});

  useEffect(() => {
    const intervalId = setInterval(() => {
      setLiveCountdown((prevState) => {
        const updatedCountdown = {};
        displayedProducts.forEach((product) => {
          const timeLeft = calculateTimeLeft(
            product.biddingStartDate,
            product.biddingStartTime,
            product.biddingEndTime
          );
          updatedCountdown[product._id] = timeLeft;
        });
        return updatedCountdown;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [displayedProducts]);

  return (
    <div
      className={`w-full rounded-xl sm:rounded-2xl font-sans ${
        darkMode ? "text-gray-200 bg-[#191919]" : "text-gray-800 bg-white"
      } shadow-lg p-2 sm:p-4`}
    >
      <div
        id="result"
        className={`w-full flex flex-wrap justify-center sm:justify-around overflow-y-auto max-h-[80vh] sm:max-h-[120vh] md:max-h-[150vh] lg:max-h-[180vh] scrollbar-thin ${
          darkMode
            ? "scrollbar-thumb-gray-600 scrollbar-track-gray-800"
            : "scrollbar-thumb-gray-300 scrollbar-track-gray-100"
        } mt-4 sm:mt-10`}
        onScroll={handleScroll}
      >
        {isFetching
          ? Array.from({ length: productsPerPage }).map((_, index) => (
              <SkeletonProductCard key={index} darkMode={darkMode} />
            ))
          : displayedProducts.map((product) => (
              <div
                key={product._id}
                className={`w-full sm:w-[46%] md:w-[30%] lg:w-[23%] xl:w-[18%] h-[320px] sm:h-[350px] md:h-[380px] m-[3%] sm:m-[2%] p-3 sm:p-4 md:p-5 mt-6 sm:mt-8 md:mt-12 rounded-xl ${
                  darkMode
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                } border shadow-sm flex flex-col justify-between transition-transform hover:scale-105 hover:shadow-md`}
              >
                <img
                  src={
                    product.images[0]?.secure_url ||
                    "https://via.placeholder.com/150"
                  }
                  alt={product.name}
                  className="w-full h-[120px] sm:h-[150px] object-cover rounded-xl"
                  loading="lazy"
                />
                <h3
                  className={`text-center my-1 sm:my-2 ${
                    darkMode ? "text-gray-100" : "text-gray-900"
                  } text-base sm:text-lg font-bold tracking-wide line-clamp-2`}
                >
                  {product.name}
                </h3>
                <h4
                  className={`text-center my-1 sm:my-2 ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  } text-xs sm:text-sm`}
                >
                  <ImPriceTags className="inline-block mr-1" /> ₹
                  {product.biddingStartPrice}
                </h4>
                <h4
                  className={`text-center my-1 sm:my-2 ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  } text-xs sm:text-sm`}
                >
                  <GiSandsOfTime className="inline-block mr-1" />{" "}
                  {liveCountdown[product._id] || "Loading..."}
                </h4>
                <div className="flex justify-center gap-2 mt-auto">
                  <button
                    onClick={() => handleOpenPopup(product._id)}
                    className="w-full py-1.5 sm:py-2 bg-blue-600 text-white text-sm sm:text-medium rounded-lg sm:rounded-xl border-none cursor-pointer transition-all hover:bg-blue-700 hover:scale-105"
                  >
                    Bid Now
                  </button>
                </div>
              </div>
            ))}
        {loading && (
          <div className="flex justify-center items-center w-full my-4 sm:my-5">
            <div
              className={`w-8 h-8 sm:w-10 sm:h-10 border-6 sm:border-8 ${
                darkMode
                  ? "border-gray-600 border-t-gray-500"
                  : "border-gray-300 border-t-gray-400"
              } rounded-full animate-spin`}
            ></div>
          </div>
        )}
        {displayedProducts.length === 0 && !isFetching && (
          <div className="col-span-full flex flex-col items-center justify-center py-12">
            <svg
              className={`w-16 h-16 ${
                darkMode ? "text-gray-500" : "text-gray-400"
              } mb-4`}
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
            <h3
              className={`text-lg font-medium ${
                darkMode ? "text-gray-200" : "text-gray-900"
              }`}
            >
              No products available
            </h3>
            <p
              className={`mt-1 text-sm ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Check back soon for new products
            </p>
          </div>
        )}
        {selectedProduct &&
          typeof document !== "undefined" &&
          ReactDOM.createPortal(
            <PopupModal
              product={selectedProduct}
              onClose={handleClosePopup}
              darkMode={darkMode}
            />,
            document.body
          )}
      </div>
    </div>
  );
};

export default ProductList7;
