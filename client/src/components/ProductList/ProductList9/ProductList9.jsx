import React, { useState, useEffect, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import ReactDOM from "react-dom";
import { GiSandsOfTime } from "react-icons/gi";
import { ImPriceTags } from "react-icons/im";
import { BiSolidCategoryAlt } from "react-icons/bi";
import PopupModal from "../../Modals/PopupModal/PopupModal";
import { useThemeProvider } from "../../AdminDashboard/utils/ThemeContext"; // Import the theme context

const ProductList9 = () => {
  const navigate = useNavigate();
  const { currentTheme } = useThemeProvider(); // Get current theme
  const [products, setProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [timeLeft, setTimeLeft] = useState({});
  const [isFetching, setIsFetching] = useState(true);
  const productsPerPage = 12;
  const API_URL = import.meta.env.VITE_API_URL;

  const handleOpenPopup = (productId) => {
    const product = products.find((p) => p._id === productId);
    setSelectedProduct(product);
  };

  const handleClosePopup = () => {
    setSelectedProduct(null);
  };

  const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/api/products/`);
        const data = await response.json();

        // Fix: Access the products array from the response
        const productsArray = data.products || [];

        const activeProducts = productsArray.filter(
          (product) => product.status === "Active"
        );

        if (activeProducts.length === 0) {
          console.log("No active products found");
        }

        const randomizedData = shuffleArray(activeProducts);
        setProducts(randomizedData);
        setDisplayedProducts(randomizedData.slice(0, productsPerPage));
        setIsFetching(false);

        initializeTimers(randomizedData);
      } catch (error) {
        console.error("Error fetching products:", error);
        setIsFetching(false);
      }
    };

    fetchProducts();
  }, []);

  const initializeTimers = (products) => {
    products.forEach((product) => {
      const { biddingStartDate, biddingStartTime, biddingEndTime } = product;
      const startDate = new Date(biddingStartDate);
      const startTime = new Date(biddingStartTime);

      startDate.setUTCHours(
        startTime.getUTCHours(),
        startTime.getUTCMinutes(),
        0,
        0
      );

      const endTime = new Date(biddingEndTime);

      if (!isNaN(endTime)) {
        updateTimer(product._id, startDate, endTime);
        setInterval(() => updateTimer(product._id, startDate, endTime), 1000);
      } else {
        console.error("Invalid end time for product:", product._id);
      }
    });
  };

  const updateTimer = (productId, startTime, endTime) => {
    const now = new Date().getTime();
    let difference =
      now < startTime.getTime()
        ? startTime.getTime() - now
        : endTime.getTime() - now;

    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
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
  }, [currentIndex, loading, products]);

  const handleScroll = useCallback(
    (e) => {
      const bottom =
        e.target.scrollHeight - Math.round(e.target.scrollTop) <=
        e.target.clientHeight + 5;
      if (bottom) {
        loadMoreProducts();
      }
    },
    [loadMoreProducts]
  );

  // Skeleton Loader Component - Updated for dark mode
  const SkeletonCard = () => (
    <div
      className={`w-full p-4 rounded-xl ${
        currentTheme === "dark" ? "bg-gray-800" : "bg-gray-100"
      } backdrop-blur-md transition-all duration-300`}
    >
      <div className="flex flex-row items-center">
        {/* Image placeholder */}
        <div
          className={`w-40 h-52 ${
            currentTheme === "dark" ? "bg-gray-700" : "bg-gray-300"
          } rounded-xl mr-5 animate-pulse`}
        ></div>

        <div className="flex-1">
          {/* Title placeholder */}
          <div
            className={`h-6 ${
              currentTheme === "dark" ? "bg-gray-700" : "bg-gray-300"
            } rounded mb-2 w-3/4 animate-pulse`}
          ></div>

          {/* Category placeholder */}
          <div
            className={`h-4 ${
              currentTheme === "dark" ? "bg-gray-700" : "bg-gray-300"
            } rounded mb-2 w-1/2 animate-pulse`}
          ></div>

          {/* Price placeholder */}
          <div
            className={`h-4 ${
              currentTheme === "dark" ? "bg-gray-700" : "bg-gray-300"
            } rounded mb-2 w-1/3 animate-pulse`}
          ></div>

          {/* Timer placeholder */}
          <div
            className={`h-4 ${
              currentTheme === "dark" ? "bg-gray-700" : "bg-gray-300"
            } rounded mb-2 w-1/4 animate-pulse`}
          ></div>

          {/* Button placeholder */}
          <div
            className={`h-10 ${
              currentTheme === "dark" ? "bg-gray-700" : "bg-gray-300"
            } rounded mt-3 w-24 animate-pulse`}
          ></div>
        </div>
      </div>
    </div>
  );

  // Empty state component - Updated for dark mode
  const EmptyState = () => (
    <div className="col-span-full flex flex-col items-center justify-center py-12">
      <svg
        className={`w-16 h-16 ${
          currentTheme === "dark" ? "text-gray-500" : "text-gray-400"
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
          currentTheme === "dark" ? "text-gray-200" : "text-gray-900"
        }`}
      >
        No products available
      </h3>
      <p
        className={`mt-1 text-sm ${
          currentTheme === "dark" ? "text-gray-400" : "text-gray-500"
        }`}
      >
        Check back soon for new products
      </p>
    </div>
  );

  return (
    <div
      className={`w-full min-h-screen ${
        currentTheme === "dark" ? "bg-[#191919]" : "bg-white"
      } p-5`}
    >
      <div
        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-y-auto max-w-full max-h-[160vh] mx-auto p-2 ${
          currentTheme === "dark" ? "text-gray-200" : "text-gray-900"
        }`}
        onScroll={handleScroll}
      >
        {isFetching ? (
          // Show skeleton cards when fetching
          Array.from({ length: productsPerPage }).map((_, index) => (
            <SkeletonCard key={`skeleton-${index}`} />
          ))
        ) : products.length === 0 ? (
          // Show empty state when no products
          <EmptyState />
        ) : (
          // Show actual products
          displayedProducts.map((product) => (
            <div
              key={product._id}
              className={`w-full p-4 rounded-xl ${
                currentTheme === "dark"
                  ? "bg-gray-800 hover:bg-gray-700"
                  : "bg-gray-100 hover:bg-gray-50"
              } backdrop-blur-md transition-all duration-300 hover:shadow-lg`}
            >
              <div className="flex flex-row items-center">
                <img
                  src={
                    product.images[0]?.secure_url ||
                    "https://via.placeholder.com/150"
                  }
                  alt={product.name}
                  className="w-40 h-52 object-cover rounded-xl mr-5"
                />
                <div className="flex-1">
                  <h5
                    className={`font-bold text-lg mb-2 truncate ${
                      currentTheme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {product.name}
                  </h5>
                  <h6
                    className={`text-sm mb-2 ${
                      currentTheme === "dark"
                        ? "text-gray-300"
                        : "text-gray-700"
                    }`}
                  >
                    <BiSolidCategoryAlt className="inline mr-1" />{" "}
                    {product.category}
                  </h6>
                  <h5
                    className={`text-sm mb-2 ${
                      currentTheme === "dark"
                        ? "text-gray-300"
                        : "text-gray-900"
                    }`}
                  >
                    <ImPriceTags className="inline mr-1" /> ₹
                    {product.biddingStartPrice}
                  </h5>
                  <p
                    className={`font-bold text-xs mb-3 ${
                      currentTheme === "dark"
                        ? "text-blue-400"
                        : "text-blue-600"
                    }`}
                  >
                    <GiSandsOfTime className="inline mr-1" />{" "}
                    {timeLeft[product._id]
                      ? `${timeLeft[product._id].days}d ${
                          timeLeft[product._id].hours
                        }h ${timeLeft[product._id].minutes}m ${
                          timeLeft[product._id].seconds
                        }s`
                      : "Loading..."}
                  </p>
                  <div className="flex justify-center">
                    <button
                      className={`px-6 py-2 ${
                        currentTheme === "dark"
                          ? "bg-blue-700 hover:bg-blue-600"
                          : "bg-blue-600 hover:bg-blue-700"
                      } text-white rounded-xl transition-all duration-300 hover:shadow-lg`}
                      onClick={() => handleOpenPopup(product._id)}
                      aria-label={`Bid on ${product.name}`}
                    >
                      Bid Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}

        {/* Loading indicator for infinite scroll */}
        {loading && (
          <div className="col-span-full flex justify-center items-center w-full py-4">
            <div
              className={`w-8 h-8 border-4 border-t-transparent ${
                currentTheme === "dark" ? "border-blue-500" : "border-blue-600"
              } rounded-full animate-spin`}
            ></div>
          </div>
        )}
      </div>

      {/* Product details popup */}
      {selectedProduct &&
        ReactDOM.createPortal(
          <PopupModal product={selectedProduct} onClose={handleClosePopup} />,
          document.body
        )}
    </div>
  );
};

export default ProductList9;
