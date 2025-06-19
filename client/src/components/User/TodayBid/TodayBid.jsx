import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ReactDOM from "react-dom";
import PopupModal from "../../Modals/PopupModal/PopupModal"; // Fixed import name
import { Clock, Tag, DollarSign, Calendar } from "lucide-react";

const TodayBid = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null); // Changed to store full product object
  const [timeLeft, setTimeLeft] = useState({});
  const productsPerPage = 12;
  const intervalsRef = useRef({});
  const API_URL = import.meta.env.VITE_API_URL;

  const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

  const getDayName = (dateString) => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const date = new Date(dateString);
    return days[date.getDay()] || "Unknown";
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsFetching(true);

        const response = await fetch(`${API_URL}/api/products/`);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (!data.products || !Array.isArray(data.products)) {
          throw new Error(
            "Expected products array in response but got: " +
              JSON.stringify(data)
          );
        }

        const today = new Date().toISOString().split("T")[0];

        const activeProducts = data.products.filter(
          (product) =>
            product.status === "Active" &&
            product.biddingStartDate &&
            new Date(product.biddingStartDate).toISOString().split("T")[0] ===
              today
        );

        console.log("Active products for today:", activeProducts.length);

        if (activeProducts.length > 0) {
          const randomizedData = shuffleArray(activeProducts);
          setProducts(randomizedData);
          setDisplayedProducts(randomizedData.slice(0, productsPerPage));

          initializeTimers(randomizedData);
        } else {
          console.log("No active products found for today");
          setProducts([]);
          setDisplayedProducts([]);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
        setDisplayedProducts([]);
      } finally {
        setIsLoading(false);
        setIsFetching(false);
      }
    };

    fetchProducts();

    return () => {
      Object.values(intervalsRef.current).forEach(clearInterval);
      intervalsRef.current = {};
    };
  }, []);

  const initializeTimers = (products) => {
    products.forEach((product) => {
      const { biddingEndTime } = product;
      const endTime = new Date(biddingEndTime);

      if (!isNaN(endTime)) {
        updateTimer(product._id, endTime);

        intervalsRef.current[product._id] = setInterval(
          () => updateTimer(product._id, endTime),
          1000
        );
      } else {
        console.error("Invalid end time for product:", product._id);
      }
    });
  };

  const updateTimer = (productId, endTime) => {
    const now = new Date().getTime();
    const difference = endTime.getTime() - now;

    if (difference > 0) {
      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft((prev) => ({
        ...prev,
        [productId]: {
          hours: String(hours).padStart(2, "0"),
          minutes: String(minutes).padStart(2, "0"),
          seconds: String(seconds).padStart(2, "0"),
        },
      }));
    } else {
      clearInterval(intervalsRef.current[productId]);
      delete intervalsRef.current[productId];

      setTimeLeft((prev) => ({
        ...prev,
        [productId]: {
          hours: "00",
          minutes: "00",
          seconds: "00",
        },
      }));
    }
  };

  const loadMoreProducts = useCallback(() => {
    if (isLoading) return;
    setIsLoading(true);

    setTimeout(() => {
      const nextIndex = currentIndex + productsPerPage;
      setDisplayedProducts((prev) => [
        ...prev,
        ...products.slice(currentIndex, nextIndex),
      ]);
      setCurrentIndex(nextIndex);
      setIsLoading(false);
    }, 1000);
  }, [currentIndex, isLoading, products]);

  const handleScroll = (e) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop <= e.target.clientHeight + 100;
    if (bottom && !isLoading && currentIndex < products.length) {
      loadMoreProducts();
    }
  };

  const calculateTimeLeft = (productId) => {
    if (timeLeft[productId]) {
      const { hours, minutes, seconds } = timeLeft[productId];
      return `${hours}:${minutes}:${seconds}`;
    }
    return "00:00:00";
  };

  const handleOpenPopup = (productId) => {
    // Find the full product object by ID
    const product = products.find((p) => p._id === productId);
    if (product) {
      setSelectedProduct(product);
    } else {
      console.error("Product not found:", productId);
    }
  };

  const handleClosePopup = () => {
    setSelectedProduct(null);
  };

  return (
    <div className="pt-24 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen dark:bg-[#191919] dark:from-[#191919] dark:to-[#121212]">
      <div className="container mx-auto px-4 pb-16">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-2 dark:text-white">
            Today's Bidding
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto dark:text-gray-300">
            Explore today's handpicked collection of premium items available for
            bidding. Don't miss your chance to get amazing deals!
          </p>
        </div>

        {isFetching ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : displayedProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm dark:bg-[#303030]">
            <h3 className="text-xl font-medium text-gray-800 mb-2 dark:text-white">
              No items available for bidding today
            </h3>
            <p className="text-gray-600 mb-4 dark:text-gray-300">
              Check back tomorrow for new bidding opportunities!
            </p>
          </div>
        ) : (
          <div
            id="result"
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 overflow-y-auto"
            onScroll={handleScroll}
            style={{ maxHeight: "calc(100vh - 240px)" }}
          >
            {displayedProducts.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1 dark:bg-[#303030] dark:hover:shadow-gray-700"
              >
                <div className="relative">
                  <img
                    src={
                      product.images[0]?.secure_url ||
                      "/api/placeholder/400/320"
                    }
                    alt={product.name}
                    className="w-full h-56 object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-blue-500 text-white font-semibold px-3 py-1 rounded-full text-sm">
                    {calculateTimeLeft(product._id)}
                  </div>
                </div>
                <div className="p-5">
                  <h5 className="text-xl font-semibold text-gray-800 mb-2 truncate dark:text-white">
                    {product.name}
                  </h5>

                  <div className="flex items-center mb-2">
                    <Tag
                      size={16}
                      className="text-gray-500 mr-2 dark:text-gray-400"
                    />
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {product.category}
                    </p>
                  </div>

                  <div className="flex items-center mb-2">
                    <DollarSign size={16} className="text-green-600 mr-2" />
                    <p className="text-lg font-bold text-gray-800 dark:text-white">
                      ₹{product.biddingStartPrice.toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center mb-4">
                    <Calendar
                      size={16}
                      className="text-gray-500 mr-2 dark:text-gray-400"
                    />
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {getDayName(product.biddingStartDate)}
                    </p>
                  </div>

                  <button
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center font-medium"
                    onClick={() => handleOpenPopup(product._id)}
                  >
                    <span>Bid Now</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {isLoading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>

      {selectedProduct &&
        ReactDOM.createPortal(
          <PopupModal product={selectedProduct} onClose={handleClosePopup} />,
          document.body
        )}
    </div>
  );
};

export default TodayBid;
