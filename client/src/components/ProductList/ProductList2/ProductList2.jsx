import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import PopupModal from "../../Modals/PopupModal/PopupModal";
import { useThemeProvider } from "../../AdminDashboard/utils/ThemeContext"; // Adjust the import path as needed

const ProductList2 = () => {
  const { currentTheme } = useThemeProvider();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [productsData, setProductsData] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [timeLeft, setTimeLeft] = useState({});
  const ref = useRef(null);
  const isInView = useInView(ref, { triggerOnce: true, threshold: 0.2 });
  const [hasAnimated, setHasAnimated] = useState(false);
  const PRODUCTS_LIMIT = 10;
  const API_URL = import.meta.env.VITE_API_URL;

  // Shuffle array utility function
  const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

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

        // Store the interval so we can clear it later
        const intervalId = setInterval(
          () => updateTimer(product._id, startDate, endTime),
          1000
        );

        // Store interval IDs to clear them later
        product.timerId = intervalId;
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

        if (!data.products || !Array.isArray(data.products)) {
          console.warn("Unexpected API response format:", data);
          throw new Error("Expected products array in response");
        }

        const activeProducts = data.products.filter(
          (product) => product.status === "Active"
        );

        if (activeProducts.length > 0) {
          const randomizedData = shuffleArray(activeProducts);
          const limitedProducts = randomizedData.slice(0, PRODUCTS_LIMIT);

          setProductsData(randomizedData);
          setDisplayedProducts(limitedProducts);
          initializeTimers(limitedProducts);
        } else {
          console.log("No active products found");
          setProductsData([]);
          setDisplayedProducts([]);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setProductsData([]);
        setDisplayedProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();

    return () => {
      displayedProducts.forEach((product) => {
        if (product.timerId) {
          clearInterval(product.timerId);
        }
      });
    };
  }, []);

  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true);
    }
  }, [isInView, hasAnimated]);

  const openPopup = (product) => {
    setSelectedProduct(product);
  };

  const closePopup = () => {
    setSelectedProduct(null);
  };

  // No products placeholder
  const NoProductsPlaceholder = () => (
    <div
      className={`col-span-full flex flex-col items-center justify-center py-12 ${
        currentTheme === "dark" ? "text-gray-300" : "text-gray-900"
      }`}
    >
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
          currentTheme === "dark" ? "text-gray-300" : "text-gray-900"
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
      className={currentTheme === "dark" ? "bg-[#191919]" : "bg-white"}
      ref={ref}
    >
      <div className="mx-auto max-w-full px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <h2 className="sr-only">Products</h2>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={hasAnimated ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-5 xl:gap-x-8"
        >
          {isLoading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="group relative">
                <div
                  className={`aspect-square w-full rounded-lg ${
                    currentTheme === "dark" ? "bg-gray-700" : "bg-gray-200"
                  } animate-pulse`}
                ></div>
                <div className="mt-4">
                  <div
                    className={`h-4 w-3/4 rounded ${
                      currentTheme === "dark" ? "bg-gray-700" : "bg-gray-200"
                    } animate-pulse`}
                  ></div>
                  <div
                    className={`mt-2 h-4 w-1/2 rounded ${
                      currentTheme === "dark" ? "bg-gray-700" : "bg-gray-200"
                    } animate-pulse`}
                  ></div>
                </div>
              </div>
            ))
          ) : displayedProducts.length > 0 ? (
            displayedProducts.map((product, index) => (
              <motion.div
                key={product._id || index}
                className="group relative cursor-pointer"
                onClick={() => openPopup(product)}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={hasAnimated ? { opacity: 1, scale: 1 } : {}}
                transition={{
                  duration: 0.5,
                  ease: "easeOut",
                  delay: 0.1 * (index % 10),
                }}
              >
                {timeLeft[product._id] && (
                  <div className="absolute z-10 top-2 left-2 bg-black/60 text-white px-2 py-1 rounded-md text-xs">
                    <span>{timeLeft[product._id].days}d </span>
                    <span>{timeLeft[product._id].hours}h </span>
                    <span>{timeLeft[product._id].minutes}m </span>
                    <span>{timeLeft[product._id].seconds}s</span>
                  </div>
                )}
                <div className="relative">
                  <img
                    alt={product.name || "Product image"}
                    src={
                      product.images && product.images[0]
                        ? product.images[0].secure_url
                        : "placeholder-image.jpg"
                    }
                    className="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-7/8"
                  />
                </div>
                <h3
                  className={`mt-4 text-sm ${
                    currentTheme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {product.name}
                </h3>
                <p
                  className={`mt-1 text-lg font-medium ${
                    currentTheme === "dark" ? "text-gray-100" : "text-gray-900"
                  }`}
                >
                  {typeof product.biddingStartPrice === "number"
                    ? `$${product.biddingStartPrice.toFixed(2)}`
                    : product.biddingStartPrice || ""}
                </p>
              </motion.div>
            ))
          ) : (
            <NoProductsPlaceholder />
          )}
        </motion.div>
      </div>

      {selectedProduct && (
        <PopupModal product={selectedProduct} onClose={closePopup} />
      )}
    </div>
  );
};

export default ProductList2;
