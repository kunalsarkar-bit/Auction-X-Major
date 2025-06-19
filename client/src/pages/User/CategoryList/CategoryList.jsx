import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AnimatePresence } from "framer-motion";
import PopupModal from "../../../components/Modals/PopupModal/PopupModal";
const API_URL = import.meta.env.VITE_API_URL;

const CategoryList = () => {
  const [products, setProducts] = useState([]);
  const [timeLeft, setTimeLeft] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { category } = useParams();

  // Convert dashes to spaces for API call and display
  const formattedCategory = category.replace(/-/g, " ");

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_URL}/api/products/category/${formattedCategory}`
      );
      const fetchedProducts = response.data;

      setProducts(fetchedProducts);
      initializeTimers(fetchedProducts);
      setError(null);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to fetch products. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [formattedCategory]);

  useEffect(() => {
    fetchProducts();

    // Cleanup function to clear timers when component unmounts
    return () => {
      products.forEach((product) => {
        if (product.timerId) {
          clearInterval(product.timerId);
        }
      });
    };
  }, [formattedCategory, fetchProducts]);

  const initializeTimers = (products) => {
    const newTimeLeft = {};
    products.forEach((product) => {
      const { _id, biddingStartDate, biddingStartTime, biddingEndTime } =
        product;
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
        const timer = calculateTimer(startDate, endTime);
        newTimeLeft[_id] = timer;
      } else {
        console.error("Invalid end time for product:", _id);
      }
    });
    setTimeLeft(newTimeLeft);
  };

  const calculateTimer = (startTime, endTime) => {
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

      return {
        days: String(days).padStart(2, "0"),
        hours: String(hours).padStart(2, "0"),
        minutes: String(minutes).padStart(2, "0"),
        seconds: String(seconds).padStart(2, "0"),
      };
    }

    return {
      days: "00",
      hours: "00",
      minutes: "00",
      seconds: "00",
    };
  };

  const openPopup = (product) => {
    setSelectedProduct(product);
  };

  const closePopup = () => {
    setSelectedProduct(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-[#191919] text-gray-800 dark:text-white">
        Loading products...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center mt-10 bg-gray-100 dark:bg-[#191919] min-h-screen pt-20">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#191919]">
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">
          {formattedCategory} Products
        </h2>
        {products.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-300">
            No products found in this category.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white dark:bg-[#303030] shadow-lg rounded-lg overflow-hidden transform transition-all hover:scale-105 hover:shadow-xl cursor-pointer"
                onClick={() => openPopup(product)}
              >
                {/* Product Images Carousel */}
                <div className="w-full h-64 overflow-hidden">
                  {product.images.length > 0 ? (
                    <img
                      src={product.images[0].secure_url}
                      alt={`${product.name} - Main Image`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400">
                      No Image
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {product.name}
                  </h3>

                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-600 dark:text-gray-300">
                      Category: {product.category}
                    </span>
                    <span className="text-lg font-bold text-green-600 dark:text-green-400">
                      ${product.biddingStartPrice.toLocaleString()}
                    </span>
                  </div>

                  {/* Countdown Timer */}
                  <div className="bg-gray-100 dark:bg-[#505050] rounded-lg p-4 text-center">
                    <div className="grid grid-cols-4 gap-2">
                      <div className="bg-white dark:bg-[#404040] shadow rounded p-2">
                        <span className="block text-2xl font-bold text-gray-800 dark:text-white">
                          {timeLeft[product._id]?.days || "00"}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Days
                        </span>
                      </div>
                      <div className="bg-white dark:bg-[#404040] shadow rounded p-2">
                        <span className="block text-2xl font-bold text-gray-800 dark:text-white">
                          {timeLeft[product._id]?.hours || "00"}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Hours
                        </span>
                      </div>
                      <div className="bg-white dark:bg-[#404040] shadow rounded p-2">
                        <span className="block text-2xl font-bold text-gray-800 dark:text-white">
                          {timeLeft[product._id]?.minutes || "00"}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Minutes
                        </span>
                      </div>
                      <div className="bg-white dark:bg-[#404040] shadow rounded p-2">
                        <span className="block text-2xl font-bold text-gray-800 dark:text-white">
                          {timeLeft[product._id]?.seconds || "00"}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Seconds
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <AnimatePresence>
          {selectedProduct && (
            <PopupModal
              product={{
                ...selectedProduct,
                imageSrc: selectedProduct.images[0]?.secure_url || "",
                imageAlt: `${selectedProduct.name} - Main Image`,
                price: `$${selectedProduct.biddingStartPrice.toLocaleString()}`,
                color: selectedProduct.category,
              }}
              onClose={closePopup}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CategoryList;
