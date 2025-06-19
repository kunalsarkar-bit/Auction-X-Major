import { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import PopupModal from "../../Modals/PopupModal/PopupModal";
import { useThemeProvider } from "../../AdminDashboard/utils/ThemeContext"; // Adjust the path as needed

const ProductList4 = () => {
  const { currentTheme } = useThemeProvider();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState(null);
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
        const intervalId = setInterval(
          () => updateTimer(product._id, startDate, endTime),
          1000
        );

        // Optional: Store interval ID if you want to clear intervals later
        product.timerIntervalId = intervalId;
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
    const fetchProperties = async () => {
      try {
        const response = await fetch(`${API_URL}/api/products/`);
        const data = await response.json();

        // Extract the products array from the response
        const productsArray = data.products || [];

        // Limit to 8 products
        const limitedProducts = productsArray.slice(0, 8);

        // Filter active properties
        const activeProperties = limitedProducts.filter(
          (product) => product.status === "Active"
        );

        if (activeProperties.length > 0) {
          // For each property, fetch seller data with proper validation
          const propertiesWithSellerData = await Promise.all(
            activeProperties.map(async (property) => {
              // Validate email exists and is properly formatted
              if (
                !property.email ||
                typeof property.email !== "string" ||
                !property.email.includes("@")
              ) {
                console.warn(
                  `Invalid email for property ${property._id}:`,
                  property.email
                );
                return {
                  ...property,
                  sellerData: {
                    name: "Unknown Seller",
                    profilePic: null,
                    phoneNo: "No contact info",
                  },
                };
              }

              try {
                // Encode email for URL safety
                const sellerResponse = await fetch(
                  `${API_URL}/api/auth/user/user/${encodeURIComponent(
                    property.email
                  )}`
                );

                // Check if response is successful
                if (!sellerResponse.ok) {
                  throw new Error(
                    `Failed to fetch seller data: ${sellerResponse.status}`
                  );
                }

                const sellerData = await sellerResponse.json();

                // Safely get profile picture URL with optional chaining
                const profilePicUrl =
                  sellerData.profilePic?.[0]?.secure_url || null;

                return {
                  ...property,
                  sellerData: {
                    ...sellerData,
                    profilePic: profilePicUrl,
                    name: sellerData.name || "Unknown Seller",
                    phoneNo: sellerData.phoneNo || "No contact info",
                  },
                };
              } catch (error) {
                console.error(
                  `Error fetching seller data for ${property.email}:`,
                  error
                );
                return {
                  ...property,
                  sellerData: {
                    name: "Unknown Seller",
                    profilePic: null,
                    phoneNo: "No contact info",
                  },
                };
              }
            })
          );

          const randomizedData = shuffleArray(propertiesWithSellerData);
          setProperties(randomizedData);
          initializeTimers(randomizedData);
        } else {
          console.log("No active properties found");
          setProperties([]);
        }
      } catch (error) {
        console.error("Error fetching properties:", error);
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();

    // Cleanup function to clear intervals
    return () => {
      properties.forEach((property) => {
        if (property.timerIntervalId) {
          clearInterval(property.timerIntervalId);
        }
      });
    };
  }, []);

  // Dark mode classes
  const darkModeClasses = {
    container:
      currentTheme === "dark"
        ? "bg-[#191919] text-gray-100"
        : "bg-white text-gray-800",
    card:
      currentTheme === "dark"
        ? "bg-gray-800 hover:bg-gray-700"
        : "bg-white hover:shadow-lg",
    textPrimary: currentTheme === "dark" ? "text-gray-100" : "text-gray-900",
    textSecondary: currentTheme === "dark" ? "text-gray-300" : "text-gray-700",
    border: currentTheme === "dark" ? "border-gray-700" : "border-gray-300",
    footer: currentTheme === "dark" ? "bg-gray-700" : "bg-gray-100",
    emptyState: currentTheme === "dark" ? "text-gray-300" : "text-gray-500",
  };

  return (
    <div
      className={`container max-w-full mx-auto p-4 ${darkModeClasses.container}`}
    >
      <h2
        className={`text-2xl sm:text-3xl font-extrabold mb-6 text-center ${darkModeClasses.textPrimary}`}
      >
        Property Listings
      </h2>

      {loading ? (
        <motion.div
          className="grid gap-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          initial="hidden"
          whileInView="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.3 },
            },
          }}
          viewport={{ once: true }}
        >
          {Array.from({ length: 4 }).map((_, index) => (
            <motion.div
              key={index}
              className={`flex flex-col ${darkModeClasses.card}`}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <div
                className={`w-full h-40 sm:h-60 ${
                  currentTheme === "dark" ? "bg-gray-700" : "bg-gray-200"
                } animate-pulse rounded-t-lg`}
              ></div>
              <div className="p-2 sm:p-4 text-center">
                <div
                  className={`h-4 sm:h-6 w-3/4 ${
                    currentTheme === "dark" ? "bg-gray-600" : "bg-gray-200"
                  } animate-pulse rounded mx-auto`}
                ></div>
                <div
                  className={`h-3 sm:h-5 w-1/2 ${
                    currentTheme === "dark" ? "bg-gray-600" : "bg-gray-200"
                  } animate-pulse rounded mt-2 mx-auto`}
                ></div>
                <div
                  className={`h-6 sm:h-10 w-full ${
                    currentTheme === "dark" ? "bg-gray-600" : "bg-gray-200"
                  } animate-pulse rounded-full mt-2 sm:mt-4`}
                ></div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : properties.length > 0 ? (
        <motion.div
          className="grid gap-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          initial="hidden"
          whileInView="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.3 },
            },
          }}
          viewport={{ once: true }}
        >
          {properties.map((property, index) => (
            <motion.div
              key={property._id || index}
              className={`flex flex-col transform hover:scale-105 transition-all cursor-pointer relative ${darkModeClasses.card}`}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
              onClick={() => setSelectedProperty(property)}
            >
              {/* Enhanced Timer Display */}
              <div className="absolute top-2 right-2 z-10">
                <div className="bg-black/70 rounded-full px-3 py-1">
                  <div className="flex items-center space-x-2">
                    <div className="flex flex-col items-center">
                      <span className="text-white font-bold text-sm">
                        {timeLeft[property._id]?.days || "00"}
                      </span>
                      <span className="text-xs text-gray-300">Days</span>
                    </div>
                    <span className="text-white text-sm">:</span>
                    <div className="flex flex-col items-center">
                      <span className="text-white font-bold text-sm">
                        {timeLeft[property._id]?.hours || "00"}
                      </span>
                      <span className="text-xs text-gray-300">Hrs</span>
                    </div>
                    <span className="text-white text-sm">:</span>
                    <div className="flex flex-col items-center">
                      <span className="text-white font-bold text-sm">
                        {timeLeft[property._id]?.minutes || "00"}
                      </span>
                      <span className="text-xs text-gray-300">Min</span>
                    </div>
                    <span className="text-white text-sm">:</span>
                    <div className="flex flex-col items-center">
                      <span className="text-white font-bold text-sm">
                        {timeLeft[property._id]?.seconds || "00"}
                      </span>
                      <span className="text-xs text-gray-300">Sec</span>
                    </div>
                  </div>
                </div>
              </div>

              <img
                src={property.images && property.images[0]?.secure_url}
                alt={property.name}
                className="w-full h-40 sm:h-60 object-cover"
              />
              <div className="p-2 sm:p-4 text-center">
                <h3
                  className={`text-sm sm:text-xl font-semibold ${darkModeClasses.textPrimary}`}
                >
                  {property.name}{" "}
                  {property.category && `(${property.category})`}
                </h3>
                <p
                  className={`text-xs sm:text-lg font-medium ${darkModeClasses.textSecondary}`}
                >
                  ${property.biddingStartPrice}
                </p>
              </div>
              <div
                className={`px-2 sm:px-4 pt-2 sm:pt-3 border-t ${darkModeClasses.border}`}
              >
                <p
                  className={`text-xs sm:text-sm ${darkModeClasses.textSecondary}`}
                >
                  {property.description && property.description[0]?.description
                    ? property.description[0].description
                    : "No description available"}
                </p>
              </div>
              <div
                className={`flex p-2 sm:p-4 border-t ${darkModeClasses.border} ${darkModeClasses.textSecondary}`}
              >
                <div className="flex-1 inline-flex items-center">
                  <p className="text-xs sm:text-sm">
                    <span
                      className={`font-bold ${darkModeClasses.textPrimary}`}
                    >
                      {property.description && property.description[0]?.name
                        ? property.description[0].name
                        : "N/A"}
                    </span>{" "}
                    Details
                  </p>
                </div>
              </div>
              <div
                className={`px-2 sm:px-4 pt-2 sm:pt-3 pb-3 sm:pb-4 border-t ${darkModeClasses.border} ${darkModeClasses.footer}`}
              >
                <div
                  className={`text-xs uppercase font-bold tracking-wide ${darkModeClasses.textSecondary}`}
                >
                  Seller
                </div>
                <div className="flex items-center pt-1 sm:pt-2">
                  <div
                    className="bg-cover bg-center w-8 h-8 sm:w-10 sm:h-10 rounded-full mr-2 sm:mr-3"
                    style={{
                      backgroundImage: property.sellerData?.profilePic
                        ? `url(${property.sellerData.profilePic})`
                        : "url('https://cdn.vectorstock.com/i/500p/62/34/user-profile-icon-anonymous-person-symbol-blank-vector-53216234.jpg')",
                    }}
                  ></div>
                  <div>
                    <p
                      className={`text-xs sm:text-sm font-bold ${darkModeClasses.textPrimary}`}
                    >
                      {property.sellerData?.name || "Unknown Seller"}
                    </p>
                    <p className={`text-xs ${darkModeClasses.textSecondary}`}>
                      {property.sellerData?.phoneNo || "No contact info"}
                    </p>
                  </div>
                  <div className="flex ml-30">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-300"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                    ))}
                  </div>
                </div>
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
          <h3 className={`text-lg font-medium ${darkModeClasses.textPrimary}`}>
            No products available
          </h3>
          <p className={`mt-1 text-sm ${darkModeClasses.emptyState}`}>
            Check back soon for new products
          </p>
        </div>
      )}

      {selectedProperty && (
        <PopupModal
          product={{
            ...selectedProperty,
            images: selectedProperty.images || [],
            description:
              selectedProperty.description?.[0]?.description ||
              "No description available",
            biddingStartPrice: selectedProperty.biddingStartPrice || 0,
            seller: selectedProperty.sellerData || {},
          }}
          onClose={() => setSelectedProperty(null)}
        />
      )}
    </div>
  );
};

export default ProductList4;
