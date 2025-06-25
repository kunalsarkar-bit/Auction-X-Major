import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import PopupModal from "../../Modals/PopupModal/PopupModal";

const ProductList = () => {
  // Get user from Redux store
  const { user } = useSelector((state) => state.auth);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [timeLeft, setTimeLeft] = useState({});
  const productsPerPage = 12;
  const API_URL = import.meta.env.VITE_API_URL;
  const RECOMMENDATION_API_URL = import.meta.env.VITE_RECOMMENDATION_API_URL;

  // Track user interaction
  const trackInteraction = async (productId, interactionType) => {
    if (!user?.email) return;

    try {
      await fetch(`${RECOMMENDATION_API_URL}/track`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          product_id: productId,
          interaction_type: interactionType,
        }),
      });
    } catch (error) {
      console.error("Error tracking interaction:", error);
    }
  };

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

        const intervalId = setInterval(
          () => updateTimer(product._id, startDate, endTime),
          1000
        );

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
    const fetchRecommendations = async () => {
      try {
        setIsFetching(true);

        if (!user?.email) {
          // Fallback to regular products if no user is logged in
          const response = await fetch(`${API_URL}/api/products/`);
          const data = await response.json();
          const activeProducts =
            data.products?.filter((p) => p.status === "Active") || [];
          setProducts(activeProducts);
          setDisplayedProducts(activeProducts.slice(0, productsPerPage));
          initializeTimers(activeProducts);
          return;
        }

        // Fetch recommendations for logged-in user
        const response = await fetch(
          `${RECOMMENDATION_API_URL}/recommendations/${encodeURIComponent(
            user.email
          )}?count=${productsPerPage}`
        );

        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        const recommendedProducts = data.products || [];

        if (recommendedProducts.length > 0) {
          setProducts(recommendedProducts);
          setDisplayedProducts(recommendedProducts);
          initializeTimers(recommendedProducts);
        } else {
          // Fallback to regular products if no recommendations
          const fallbackResponse = await fetch(`${API_URL}/products/`);
          const fallbackData = await fallbackResponse.json();
          const activeProducts =
            fallbackData.products?.filter((p) => p.status === "Active") || [];
          setProducts(activeProducts);
          setDisplayedProducts(activeProducts.slice(0, productsPerPage));
          initializeTimers(activeProducts);
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

    fetchRecommendations();

    return () => {
      products.forEach((product) => {
        if (product.timerId) {
          clearInterval(product.timerId);
        }
      });
    };
  }, [user?.email]); // Refetch when user changes

  const openPopup = (product) => {
    trackInteraction(product._id, "view");
    setSelectedProduct(product);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  const NoProductsPlaceholder = () => (
    <div className="col-span-full flex flex-col items-center justify-center py-12">
      <svg
        className="w-16 h-16 text-gray-400 mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
        ></path>
      </svg>
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
        No products available
      </h3>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
        Check back soon for new products
      </p>
    </div>
  );

  return (
    <div className="relative bg-white dark:bg-[#191919]">
      <div className="mx-auto max-w-full px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          {user ? "Recommended for you" : "Featured products"}
        </h2>

        <div className="mt-4 sm:mt-6 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-6 gap-x-4 xl:gap-x-6">
          {isLoading || isFetching ? (
            Array.from({ length: 6 }).map((_, index) => (
              <motion.div
                key={index}
                className="group relative"
                variants={cardVariants}
              >
                <div className="aspect-square w-full rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                <div className="mt-4 flex justify-between">
                  <div>
                    <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
                    <div className="mt-2 h-4 w-16 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
                  </div>
                  <div className="h-4 w-12 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
                </div>
              </motion.div>
            ))
          ) : displayedProducts.length > 0 ? (
            displayedProducts.map((product, index) => (
              <motion.div
                key={product._id || index}
                className="group relative cursor-pointer"
                onClick={() => openPopup(product)}
                variants={cardVariants}
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
                    alt={
                      product.imageAlt || `Product image for ${product.name}`
                    }
                    src={
                      product.images?.[0]?.secure_url ||
                      product.image ||
                      "placeholder-image.jpg"
                    }
                    className="aspect-square w-full rounded-md bg-gray-200 dark:bg-gray-700 object-cover group-hover:opacity-75"
                  />
                </div>
                <div className="mt-4 flex justify-between">
                  <div>
                    <h3 className="text-sm sm:text-base text-gray-700 dark:text-gray-100">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {product.color || product.category || ""}
                    </p>
                  </div>
                  <p className="text-sm sm:text-base font-medium text-gray-900 dark:text-gray-100">
                    {product.biddingStartPrice?.toFixed?.(2) || ""}
                  </p>
                </div>
              </motion.div>
            ))
          ) : (
            <NoProductsPlaceholder />
          )}
        </div>
      </div>

      <AnimatePresence>
        {selectedProduct && (
          <PopupModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            onBid={() => trackInteraction(selectedProduct._id, "bid")}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductList;
