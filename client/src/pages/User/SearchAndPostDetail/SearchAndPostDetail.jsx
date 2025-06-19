import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useThemeProvider } from "../../../components/AdminDashboard/utils/ThemeContext";

const SearchAndPostDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentTheme } = useThemeProvider();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState({});
  const isDarkMode = currentTheme === "dark";
  const [isFetchingRelated, setIsFetchingRelated] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchProductDetail = useCallback(async () => {
    try {
      setLoading(true);
      // Using the URL format from your example
      const response = await axios.get(`${API_URL}/api/products/${id}`);
      setProduct(response.data.product);

      // Once we have the product, fetch related products
      if (response.data.product.category) {
        setIsFetchingRelated(true);
        const formattedCategory = response.data.product.category.replace(
          / /g,
          "%20"
        );
        const relatedResponse = await axios.get(
          `${API_URL}/api/products/category/${formattedCategory}`
        );
        // Filter out the current product
        const filteredProducts = relatedResponse.data.filter(
          (item) => item._id !== id
        );
        setRelatedProducts(filteredProducts);
        initializeTimers(filteredProducts);
        setIsFetchingRelated(false);
      }

      setError(null);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to fetch product details. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProductDetail();

    // Cleanup function
    return () => {
      if (relatedProducts) {
        relatedProducts.forEach((product) => {
          if (product.timerId) {
            clearInterval(product.timerId);
          }
        });
      }
    };
  }, [id, fetchProductDetail]);

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

        // Create interval to update timer
        const intervalId = setInterval(() => {
          updateTimer(_id, startDate, endTime);
        }, 1000);

        // Store interval ID for cleanup
        product.timerId = intervalId;
      } else {
        console.error("Invalid end time for product:", _id);
      }
    });
    setTimeLeft(newTimeLeft);
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

  const nextImage = () => {
    if (product && product.images && product.images.length > 0) {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % product.images.length
      );
    }
  };

  const prevImage = () => {
    if (product && product.images && product.images.length > 0) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
      );
    }
  };

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  // Skeleton UI for product detail
  const ProductDetailSkeleton = () => (
    <div
      className={`${
        isDarkMode ? "bg-[#303030]" : "bg-white"
      } bg-opacity-50 rounded-lg shadow-2xl overflow-hidden max-w-6xl mx-auto`}
    >
      <div className="flex flex-col lg:flex-row">
        {/* Image Skeleton */}
        <div className="w-full lg:w-1/2 p-6">
          <div
            className={`h-96 rounded-lg ${
              isDarkMode ? "bg-[#505050]" : "bg-gray-200"
            } animate-pulse`}
          ></div>
          <div className="flex mt-4 space-x-2">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className={`h-16 w-16 rounded-md ${
                  isDarkMode ? "bg-[#505050]" : "bg-gray-200"
                } animate-pulse`}
              ></div>
            ))}
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="w-full lg:w-1/2 p-6">
          <div
            className={`h-8 w-3/4 ${
              isDarkMode ? "bg-[#505050]" : "bg-gray-200"
            } rounded animate-pulse mb-4`}
          ></div>
          <div
            className={`h-6 w-1/2 ${
              isDarkMode ? "bg-[#505050]" : "bg-gray-200"
            } rounded animate-pulse mb-4`}
          ></div>
          <div
            className={`h-10 w-1/3 ${
              isDarkMode ? "bg-[#505050]" : "bg-gray-200"
            } rounded animate-pulse mb-6`}
          ></div>

          <div className="grid grid-cols-4 gap-2 mb-6">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className={`h-20 ${
                  isDarkMode ? "bg-[#505050]" : "bg-gray-200"
                } rounded animate-pulse`}
              ></div>
            ))}
          </div>

          <div
            className={`h-32 ${
              isDarkMode ? "bg-[#505050]" : "bg-gray-200"
            } rounded animate-pulse mb-6`}
          ></div>

          <div className="flex gap-4">
            <div
              className={`h-12 w-32 ${
                isDarkMode ? "bg-[#505050]" : "bg-gray-200"
              } rounded animate-pulse`}
            ></div>
            <div
              className={`h-12 w-32 ${
                isDarkMode ? "bg-[#505050]" : "bg-gray-200"
              } rounded animate-pulse`}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );

  // Skeleton for related products
  const RelatedProductsSkeleton = () => (
    <div className="mt-16">
      <div
        className={`h-8 w-64 mx-auto ${
          isDarkMode ? "bg-[#505050]" : "bg-gray-200"
        } rounded animate-pulse mb-8`}
      ></div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <motion.div
            key={index}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            className={`${
              isDarkMode ? "bg-[#303030]" : "bg-white"
            } rounded-lg overflow-hidden shadow-lg`}
          >
            <div
              className={`h-48 ${
                isDarkMode ? "bg-[#505050]" : "bg-gray-200"
              } animate-pulse`}
            ></div>
            <div className="p-4">
              <div
                className={`h-6 w-3/4 ${
                  isDarkMode ? "bg-[#505050]" : "bg-gray-200"
                } rounded animate-pulse mb-2`}
              ></div>
              <div className="flex justify-between items-center mb-3">
                <div
                  className={`h-4 w-1/3 ${
                    isDarkMode ? "bg-[#505050]" : "bg-gray-200"
                  } rounded animate-pulse`}
                ></div>
                <div
                  className={`h-4 w-1/4 ${
                    isDarkMode ? "bg-[#505050]" : "bg-gray-200"
                  } rounded animate-pulse`}
                ></div>
              </div>
              <div
                className={`h-16 ${
                  isDarkMode ? "bg-[#505050]" : "bg-gray-200"
                } rounded animate-pulse`}
              ></div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  // Function to render description properly
  const renderDescription = () => {
    if (!product || !product.description) return null;

    if (Array.isArray(product.description)) {
      return product.description.map((desc, index) => (
        <div key={index} className="mb-3">
          {desc.name && <h4 className="font-medium">{desc.name}</h4>}
          {desc.description && <p>{desc.description}</p>}
        </div>
      ));
    } else {
      return <p>{product.description}</p>;
    }
  };

  // Main render with theme awareness
  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-[#191919] text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="container mx-auto px-4 py-8 mt-20">
        {/* Main Product Detail */}
        {loading ? (
          <ProductDetailSkeleton />
        ) : error ? (
          <div className="text-center py-16 px-4">
            <div
              className={`${
                isDarkMode
                  ? "bg-red-900 border-red-700 text-red-100"
                  : "bg-red-100 border-red-400 text-red-700"
              } border px-4 py-3 rounded max-w-lg mx-auto`}
            >
              <p>{error}</p>
            </div>
          </div>
        ) : product ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`${
              isDarkMode ? "bg-[#303030] bg-opacity-50" : "bg-white"
            } rounded-lg shadow-2xl overflow-hidden max-w-6xl mx-auto`}
          >
            <div className="flex flex-col lg:flex-row">
              {/* Image Gallery Section */}
              <div className="w-full lg:w-1/2 p-6 relative">
                <div
                  className={`relative rounded-lg overflow-hidden ${
                    isDarkMode ? "bg-[#191919]" : "bg-gray-100"
                  } h-96`}
                >
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-transparent opacity-50 blur-2xl"></div>

                  {/* Image */}
                  {product.images && product.images.length > 0 ? (
                    <motion.img
                      key={currentImageIndex}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      src={product.images[currentImageIndex].secure_url}
                      alt={`${product.name} - Image ${currentImageIndex + 1}`}
                      className="w-full h-full object-contain relative z-10"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Images Available
                    </div>
                  )}

                  {/* Navigation arrows */}
                  {product.images && product.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full p-2 text-white hover:bg-opacity-70 transition z-20"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full p-2 text-white hover:bg-opacity-70 transition z-20"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
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
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnail images */}
                {product.images && product.images.length > 1 && (
                  <div className="flex mt-4 space-x-2 overflow-x-auto pb-2">
                    {product.images.map((image, index) => (
                      <div
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`cursor-pointer rounded-md overflow-hidden h-16 w-16 flex-shrink-0 border-2 ${
                          currentImageIndex === index
                            ? "border-amber-500"
                            : "border-transparent"
                        }`}
                      >
                        <img
                          src={image.secure_url}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Information Section */}
              <div className="w-full lg:w-1/2 p-6">
                <h1
                  className={`text-3xl font-bold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  } mb-2`}
                >
                  {product.name}
                </h1>
                <div className="flex items-center mb-4">
                  <span
                    className={isDarkMode ? "text-gray-400" : "text-gray-600"}
                  >
                    Category:
                  </span>
                  <span
                    className="ml-2 text-amber-500 hover:text-amber-400 cursor-pointer"
                    onClick={() =>
                      navigate(
                        `/category/${product.category.replace(/ /g, "-")}`
                      )
                    }
                  >
                    {product.category}
                  </span>
                </div>

                <div className="mb-6">
                  <div className="text-2xl font-bold text-amber-500 mb-1">
                    Starting Price: $
                    {product.biddingStartPrice?.toLocaleString() || "0"}
                  </div>

                  {/* Bidding Time Section */}
                  {product.biddingEndTime && (
                    <div className="mt-4">
                      <h3
                        className={`${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        } mb-2`}
                      >
                        Auction Ends In:
                      </h3>
                      <div className="grid grid-cols-4 gap-2">
                        <div
                          className={`${
                            isDarkMode ? "bg-[#191919]" : "bg-gray-100"
                          } rounded p-2 text-center`}
                        >
                          <span className="block text-2xl font-bold text-amber-500">
                            {timeLeft[product._id]?.days || "00"}
                          </span>
                          <span
                            className={
                              isDarkMode ? "text-gray-400" : "text-gray-500"
                            }
                          >
                            Days
                          </span>
                        </div>
                        <div
                          className={`${
                            isDarkMode ? "bg-[#191919]" : "bg-gray-100"
                          } rounded p-2 text-center`}
                        >
                          <span className="block text-2xl font-bold text-amber-500">
                            {timeLeft[product._id]?.hours || "00"}
                          </span>
                          <span
                            className={
                              isDarkMode ? "text-gray-400" : "text-gray-500"
                            }
                          >
                            Hours
                          </span>
                        </div>
                        <div
                          className={`${
                            isDarkMode ? "bg-[#191919]" : "bg-gray-100"
                          } rounded p-2 text-center`}
                        >
                          <span className="block text-2xl font-bold text-amber-500">
                            {timeLeft[product._id]?.minutes || "00"}
                          </span>
                          <span
                            className={
                              isDarkMode ? "text-gray-400" : "text-gray-500"
                            }
                          >
                            Minutes
                          </span>
                        </div>
                        <div
                          className={`${
                            isDarkMode ? "bg-[#191919]" : "bg-gray-100"
                          } rounded p-2 text-center`}
                        >
                          <span className="block text-2xl font-bold text-amber-500">
                            {timeLeft[product._id]?.seconds || "00"}
                          </span>
                          <span
                            className={
                              isDarkMode ? "text-gray-400" : "text-gray-500"
                            }
                          >
                            Seconds
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <h3
                    className={`text-lg font-semibold ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    } mb-2`}
                  >
                    Description:
                  </h3>
                  <div
                    className={isDarkMode ? "text-gray-300" : "text-gray-600"}
                  >
                    {renderDescription()}
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-wrap gap-4 mt-6">
                  <button
                    onClick={() => navigate(`/product/${id}`)}
                    className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
                  >
                    Place Bid Now
                  </button>
                  <button
                    onClick={() => window.history.back()}
                    className={`px-6 py-3 ${
                      isDarkMode
                        ? "bg-[#505050] hover:bg-[#404040]"
                        : "bg-gray-200 hover:bg-gray-300"
                    } font-bold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200`}
                  >
                    Back
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <div
            className={`text-center py-10 ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            <p>No product details available.</p>
          </div>
        )}

        {/* Related Products Section */}
        {isFetchingRelated ? (
          <RelatedProductsSkeleton />
        ) : (
          relatedProducts &&
          relatedProducts.length > 0 && (
            <div className="mt-16">
              <h2
                className={`text-2xl font-bold mb-6 text-center ${
                  isDarkMode ? "text-white" : "text-gray-800"
                }`}
              >
                Related Products in {product.category}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct, index) => (
                  <motion.div
                    key={relatedProduct._id}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={cardVariants}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                    className={`${
                      isDarkMode ? "bg-[#303030]" : "bg-white"
                    } rounded-lg overflow-hidden shadow-lg transform transition-all hover:scale-105 hover:shadow-xl cursor-pointer`}
                    onClick={() => navigate(`/product/${relatedProduct._id}`)}
                  >
                    {/* Product Image */}
                    <div className="h-48 overflow-hidden relative">
                      {/* Timer added above the image */}
                      {timeLeft[relatedProduct._id] && (
                        <div className="absolute z-10 top-2 left-2 bg-black/60 text-white px-2 py-1 rounded-md text-xs">
                          <span>{timeLeft[relatedProduct._id].days}d </span>
                          <span>{timeLeft[relatedProduct._id].hours}h </span>
                          <span>{timeLeft[relatedProduct._id].minutes}m </span>
                          <span>{timeLeft[relatedProduct._id].seconds}s</span>
                        </div>
                      )}

                      {relatedProduct.images &&
                      relatedProduct.images.length > 0 ? (
                        <img
                          src={relatedProduct.images[0].secure_url}
                          alt={relatedProduct.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div
                          className={`w-full h-full ${
                            isDarkMode ? "bg-[#505050]" : "bg-gray-200"
                          } flex items-center justify-center ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          No Image
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <h3
                        className={`text-lg font-semibold ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        } mb-2 truncate`}
                      >
                        {relatedProduct.name}
                      </h3>

                      <div className="flex justify-between items-center mb-3">
                        <span
                          className={
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          }
                        >
                          {relatedProduct.category}
                        </span>
                        <span className="text-amber-500 font-bold">
                          $
                          {relatedProduct.biddingStartPrice?.toLocaleString() ||
                            "0"}
                        </span>
                      </div>

                      {/* Countdown Timer */}
                      <div
                        className={`${
                          isDarkMode ? "bg-[#191919]" : "bg-gray-100"
                        } rounded p-2 text-center`}
                      >
                        <div className="grid grid-cols-4 gap-1 text-xs">
                          <div>
                            <span className="block text-lg font-bold text-amber-500">
                              {timeLeft[relatedProduct._id]?.days || "00"}
                            </span>
                            <span
                              className={
                                isDarkMode ? "text-gray-400" : "text-gray-500"
                              }
                            >
                              Days
                            </span>
                          </div>
                          <div>
                            <span className="block text-lg font-bold text-amber-500">
                              {timeLeft[relatedProduct._id]?.hours || "00"}
                            </span>
                            <span
                              className={
                                isDarkMode ? "text-gray-400" : "text-gray-500"
                              }
                            >
                              Hrs
                            </span>
                          </div>
                          <div>
                            <span className="block text-lg font-bold text-amber-500">
                              {timeLeft[relatedProduct._id]?.minutes || "00"}
                            </span>
                            <span
                              className={
                                isDarkMode ? "text-gray-400" : "text-gray-500"
                              }
                            >
                              Min
                            </span>
                          </div>
                          <div>
                            <span className="block text-lg font-bold text-amber-500">
                              {timeLeft[relatedProduct._id]?.seconds || "00"}
                            </span>
                            <span
                              className={
                                isDarkMode ? "text-gray-400" : "text-gray-500"
                              }
                            >
                              Sec
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default SearchAndPostDetail;
