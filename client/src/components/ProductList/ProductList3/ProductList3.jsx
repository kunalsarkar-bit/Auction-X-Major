import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import PopupModal from "../../Modals/PopupModal/PopupModal";
import { useThemeProvider } from "../../AdminDashboard/utils/ThemeContext"; // Adjust the import path as needed

const ProductList3 = () => {
  const { currentTheme } = useThemeProvider();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [timeLeft, setTimeLeft] = useState({});
  const API_URL = import.meta.env.VITE_API_URL;

  // Shuffle array utility function
  const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

  // Timer initialization and update functions
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
        const interval = setInterval(
          () => updateTimer(product._id, startDate, endTime),
          1000
        );

        // Clean up the interval when the component unmounts
        return () => clearInterval(interval);
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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/api/products/`);
        const data = await response.json();

        // Extract the products array from the response
        const productsArray = data.products || [];

        // Filter active products
        const activeProducts = productsArray.filter(
          (product) => product.status === "Active"
        );

        if (activeProducts.length > 0) {
          const randomizedData = shuffleArray(activeProducts);
          // Limit to 8 items
          const limitedProducts = randomizedData.slice(0, 8);
          setProducts(limitedProducts);

          // Initialize timers for products
          initializeTimers(limitedProducts);
        } else {
          console.log("No active products found");
          setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleBuyNow = (product) => {
    const modalProduct = {
      ...product,
      imageSrc: product.images && product.images[0]?.secure_url,
      imageAlt: product.name,
      price: product.biddingStartPrice,
    };
    setSelectedProduct(modalProduct);
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };

  return (
    <div
      className={`container max-w-full mx-auto p-6 ${
        currentTheme === "dark" ? "bg-[#191919]" : "bg-white"
      }`}
    >
      <h2
        className={`text-3xl font-extrabold mb-6 text-center ${
          currentTheme === "dark" ? "text-white" : "text-gray-800"
        }`}
      >
        Our Products
      </h2>

      {isLoading ? (
        <motion.div
          className="grid gap-6 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          {Array.from({ length: 4 }).map((_, index) => (
            <motion.div
              key={index}
              className={`flex flex-col hover:shadow-2xl transform hover:scale-105 transition-all ${
                currentTheme === "dark" ? "bg-gray-800" : "bg-white"
              }`}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <div
                className={`w-full h-60 ${
                  currentTheme === "dark" ? "bg-gray-700" : "bg-gray-200"
                } animate-pulse rounded-t-lg`}
              ></div>
              <div className="p-4 text-center">
                <div
                  className={`h-6 w-3/4 ${
                    currentTheme === "dark" ? "bg-gray-600" : "bg-gray-200"
                  } animate-pulse rounded mx-auto`}
                ></div>
                <div
                  className={`h-5 w-1/2 ${
                    currentTheme === "dark" ? "bg-gray-600" : "bg-gray-200"
                  } animate-pulse rounded mt-2 mx-auto`}
                ></div>
                <div
                  className={`h-10 w-full ${
                    currentTheme === "dark" ? "bg-gray-600" : "bg-gray-200"
                  } animate-pulse rounded-full mt-4`}
                ></div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : products.length > 0 ? (
        <motion.div
          className="grid gap-6 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          {products.map((product, index) => (
            <motion.div
              key={product._id || index}
              className={`flex flex-col hover:shadow-2xl transform hover:scale-105 transition-all relative ${
                currentTheme === "dark" ? "bg-gray-800" : "bg-white"
              }`}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              {/* Timer Display */}
              <div
                className={`absolute top-2 left-2 right-2 z-10 flex justify-between ${
                  currentTheme === "dark"
                    ? "bg-gray-700/70 text-white"
                    : "bg-white/50 text-black"
                } font-semibold px-2 py-1 rounded`}
              >
                <div className="text-xs">
                  <span>{timeLeft[product._id]?.days || "00"}d </span>
                  <span>{timeLeft[product._id]?.hours || "00"}h </span>
                  <span>{timeLeft[product._id]?.minutes || "00"}m </span>
                  <span>{timeLeft[product._id]?.seconds || "00"}s</span>
                </div>
              </div>

              <img
                src={product.images && product.images[0]?.secure_url}
                alt={product.name}
                className="w-full h-60 object-cover rounded-t-lg"
              />
              <div className="p-4 text-center">
                <h3
                  className={`text-xl font-semibold ${
                    currentTheme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {product.name}
                </h3>
                <p
                  className={`text-lg font-medium ${
                    currentTheme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  ${product.biddingStartPrice}
                </p>
                <button
                  onClick={() => handleBuyNow(product)}
                  className={`mt-4 w-full px-6 py-3 rounded-full transition-all ${
                    currentTheme === "dark"
                      ? "bg-gray-700 text-white hover:bg-gray-600"
                      : "bg-gray-300 text-gray-800 hover:bg-gray-400"
                  }`}
                >
                  Buy Now
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="col-span-full flex flex-col items-center justify-center py-12">
          <svg
            className={`w-16 h-16 mb-4 ${
              currentTheme === "dark" ? "text-gray-500" : "text-gray-400"
            }`}
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
              currentTheme === "dark" ? "text-white" : "text-gray-900"
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
      )}

      {selectedProduct && (
        <PopupModal product={selectedProduct} onClose={closeModal} />
      )}
    </div>
  );
};

export default ProductList3;
