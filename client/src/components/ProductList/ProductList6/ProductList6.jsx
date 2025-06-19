import React, { useState, useEffect, useContext } from "react";
import PopupModal from "../../Modals/PopupModal/PopupModal";
import { useThemeProvider } from "../../AdminDashboard/utils/ThemeContext"; // Adjust the import path as needed

const ProductList6 = () => {
  const { currentTheme } = useThemeProvider();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });
  const API_URL = import.meta.env.VITE_API_URL;

  // Function to get first description item
  const getFirstDescription = (descriptionArray) => {
    if (
      !descriptionArray ||
      !Array.isArray(descriptionArray) ||
      descriptionArray.length === 0
    ) {
      return { name: "", description: "" };
    }
    return descriptionArray[0];
  };

  // Function to truncate text
  const truncateText = (text, maxLength = 25) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  // Calculate Timer
  const calculateTimeLeft = (startDate, endDate) => {
    const now = new Date().getTime();
    let difference =
      now < startDate.getTime()
        ? startDate.getTime() - now
        : endDate.getTime() - now;

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

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await fetch(`${API_URL}/api/products/`);
        const data = await response.json();

        // Extract the products array from the response
        const productsArray = data.products || [];

        // Filter active products
        const activeProperties = productsArray.filter(
          (product) => product.status === "Active"
        );

        if (activeProperties.length > 0) {
          // Get the first property
          const selectedProperty = activeProperties[0];

          // Fetch seller data for the property
          if (selectedProperty.email) {
            try {
              // Fetch basic user data
              const sellerResponse = await fetch(
                `${API_URL}/api/auth/user/user/${selectedProperty.email}`
              );
              const sellerData = await sellerResponse.json();

              // Fetch profile picture specifically
              const picResponse = await fetch(
                `${API_URL}/api/auth/user/profile-pic?email=${selectedProperty.email}`
              );
              const picData = await picResponse.json();

              setProperty({
                ...selectedProperty,
                sellerData: {
                  ...sellerData,
                  profilePic: picData.profilePic,
                  name: picData.name || sellerData.name,
                },
              });
            } catch (error) {
              console.error(
                `Error fetching seller data for ${selectedProperty.email}:`,
                error
              );
              setProperty(selectedProperty);
            }
          } else {
            setProperty(selectedProperty);
          }
        } else {
          console.log("No active properties found");
          setProperty(null);
        }
      } catch (error) {
        console.error("Error fetching property:", error);
        setProperty(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, []);

  // Timer Effect
  useEffect(() => {
    let timerInterval;

    if (property && property.biddingStartDate && property.biddingEndTime) {
      const startDate = new Date(property.biddingStartDate);
      const endDate = new Date(property.biddingEndTime);

      // Initial timer calculation
      setTimeLeft(calculateTimeLeft(startDate, endDate));

      // Set up interval to update timer every second
      timerInterval = setInterval(() => {
        setTimeLeft(calculateTimeLeft(startDate, endDate));
      }, 1000);
    }

    // Cleanup interval on component unmount
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [property]);

  const openModal = () => {
    if (!property) return;

    const firstDescItem = getFirstDescription(property.description);
    setSelectedProduct({
      id: property._id,
      imageSrc:
        property.images && property.images.length > 0
          ? property.images[0].secure_url
          : "",
      imageAlt: property.name,
      name: property.name,
      description: firstDescItem.description,
      price: property.biddingStartPrice,
      images: property.images || [],
      // Add any additional fields needed for the modal
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  if (loading) {
    return (
      <div
        className={`min-h-screen w-full ${
          currentTheme === "dark"
            ? "bg-[#191919] text-gray-100"
            : "bg-white text-gray-900"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h2 className="text-3xl font-bold text-center mb-10">
            Featured Property
          </h2>
          <div
            className={`flex flex-col mx-auto justify-center place-content-center my-10 ${
              currentTheme === "dark"
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-300"
            } border rounded-lg shadow md:flex-row hover:bg-gray-100 dark:hover:bg-gray-700 mb-10`}
          >
            <div className="animate-pulse w-full h-96 md:h-64 md:w-1/4 bg-gray-300 dark:bg-gray-600 rounded-t-lg md:rounded-none md:rounded-l-lg"></div>
            <div className="flex flex-col-reverse md:w-3/4 justify-between md:flex-row lg:flex-row-reverse">
              <div className="flex flex-col-reverse md:flex-col lg:flex-row w-full md:w-1/2 lg:w-2/3">
                <div
                  className={`p-4 lg:w-1/2 border ${
                    currentTheme === "dark"
                      ? "border-gray-700"
                      : "border-gray-300"
                  }`}
                >
                  <div className="animate-pulse h-6 w-1/2 bg-gray-300 dark:bg-gray-600 mb-2"></div>
                  <div className="flex">
                    <div className="animate-pulse w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-600 mr-4"></div>
                    <div className="w-full">
                      <div className="animate-pulse h-4 w-3/4 bg-gray-300 dark:bg-gray-600 mb-2"></div>
                      <div className="animate-pulse h-4 w-1/2 bg-gray-300 dark:bg-gray-600"></div>
                    </div>
                  </div>
                </div>
                <div
                  className={`flex p-4 md:flex-col md:w-full lg:w-1/2 gap-2 justify-center border ${
                    currentTheme === "dark"
                      ? "border-gray-700"
                      : "border-gray-300"
                  }`}
                >
                  <div className="animate-pulse h-4 w-3/4 bg-gray-300 dark:bg-gray-600"></div>
                  <div className="animate-pulse h-4 w-3/4 bg-gray-300 dark:bg-gray-600"></div>
                </div>
              </div>
              <div
                className={`w-full md:w-1/2 p-4 flex flex-col justify-center border ${
                  currentTheme === "dark"
                    ? "border-gray-700"
                    : "border-gray-300"
                }`}
              >
                <div className="flex justify-between">
                  <div className="animate-pulse h-4 w-1/4 bg-gray-300 dark:bg-gray-600"></div>
                  <div className="animate-pulse h-4 w-1/4 bg-gray-300 dark:bg-gray-600"></div>
                </div>
                <div className="animate-pulse h-6 w-1/2 bg-gray-300 dark:bg-gray-600 my-2"></div>
                <div className="animate-pulse h-4 w-3/4 bg-gray-300 dark:bg-gray-600"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div
        className={`min-h-screen w-full ${
          currentTheme === "dark"
            ? "bg-[#191919] text-gray-100"
            : "bg-white text-gray-900"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h2 className="text-3xl font-bold text-center mb-10">
            Featured Property
          </h2>
          <div className="flex flex-col items-center justify-center py-12">
            <svg
              className="w-16 h-16 text-gray-400 mb-4"
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
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              No property available
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Check back soon for new listings
            </p>
          </div>
        </div>
      </div>
    );
  }

  const firstDescItem = getFirstDescription(property.description);

  return (
    <div
      className={`min-h-screen w-full ${
        currentTheme === "dark"
          ? "bg-[#191919] text-gray-100"
          : "bg-white text-gray-900"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-center mb-10">
          Featured Property
        </h2>

        <div
          className={`flex flex-col mx-auto justify-center place-content-center my-10 ${
            currentTheme === "dark"
              ? "bg-gray-800 border-gray-700 hover:bg-gray-700"
              : "bg-white border-gray-300 hover:bg-gray-100"
          } border rounded-lg shadow md:flex-row mb-10 cursor-pointer animate-fade-in`}
          onClick={openModal}
        >
          {/* Image Section - Fixed Height and Width */}
          <div className="w-full md:w-1/4 h-64 flex-shrink-0">
            <img
              className="object-cover w-full h-full rounded-t-lg md:rounded-none md:rounded-l-lg"
              src={
                property.images && property.images.length > 0
                  ? property.images[0].secure_url
                  : "https://res.cloudinary.com/dszvpb3q5/image/upload/v1743180239/ave3utbydiwk7bkmalxa.jpg"
              }
              alt={property.name}
            />
          </div>

          {/* Content Section */}
          <div className="flex flex-col-reverse md:w-3/4 justify-between md:flex-row lg:flex-row-reverse">
            {/* Seller and Details Section */}
            <div className="flex flex-col-reverse md:flex-col lg:flex-row w-full md:w-1/2 lg:w-2/3">
              {/* Seller Info */}
              <div
                className={`p-4 lg:w-1/2 border ${
                  currentTheme === "dark"
                    ? "border-gray-700"
                    : "border-gray-300"
                }`}
              >
                <h6 className="mb-1 text-gray-600 dark:text-gray-400 mt-15">
                  Seller
                </h6>
                <div className="flex">
                  <img
                    className="w-12 h-12 rounded-full object-cover mr-4 shadow"
                    src={
                      property.sellerData?.profilePic ||
                      "https://res.cloudinary.com/dszvpb3q5/image/upload/v1743180239/ave3utbydiwk7bkmalxa.jpg"
                    }
                    alt="Seller"
                  />
                  <div className="w-full overflow-hidden">
                    <h2 className="text-medium font-semibold text-gray-900 dark:text-gray-100 -mt-1 truncate">
                      {property.sellerData?.name || "Anonymous Seller"}
                    </h2>
                    <span
                      className="text-slate-400 dark:text-slate-500 block truncate"
                      title={property.email}
                    >
                      {truncateText(property.email, 20)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Product Details */}
              <div
                className={`flex p-4 md:flex-col md:w-full lg:w-1/2 gap-2 justify-center border ${
                  currentTheme === "dark"
                    ? "border-gray-700"
                    : "border-gray-300"
                }`}
              >
                <div className="w-full">
                  <span className="font-medium dark:text-gray-300">
                    {firstDescItem.name || "Details"}
                  </span>
                </div>
                <div className="w-full text-sm text-gray-600 dark:text-gray-400">
                  <span>{truncateText(firstDescItem.description, 80)}</span>
                  {/* Timer Display */}
                  <div className="text-center mb-4">
                    <div className="flex justify-center space-x-4">
                      <div className="flex flex-col items-center">
                        <span className="text-3xl font-bold text-gray-800 dark:text-gray-200">
                          {timeLeft.days}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Days
                        </span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-3xl font-bold text-gray-800 dark:text-gray-200">
                          {timeLeft.hours}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Hours
                        </span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-3xl font-bold text-gray-800 dark:text-gray-200">
                          {timeLeft.minutes}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Minutes
                        </span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-3xl font-bold text-gray-800 dark:text-gray-200">
                          {timeLeft.seconds}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Seconds
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Price and Name Section */}
            <div
              className={`w-full md:w-1/2 p-4 flex flex-col justify-center border ${
                currentTheme === "dark" ? "border-gray-700" : "border-gray-300"
              }`}
            >
              <div className="flex justify-between">
                <h3 className="font-normal text-gray-700 dark:text-gray-300">
                  {property.category || "Item"}
                </h3>
                <h3 className="text-sm text-blue-600 dark:text-blue-400">
                  {property.condition || "New"}
                </h3>
              </div>
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                ${property.biddingStartPrice}
              </h5>
              <h5
                className="mb-2 font-light tracking-tight text-gray-900 dark:text-gray-300 truncate"
                title={property.name}
              >
                {property.name}
              </h5>
            </div>
          </div>
        </div>

        {/* Render the PopupModal if isModalOpen is true */}
        {isModalOpen && selectedProduct && (
          <PopupModal product={selectedProduct} onClose={closeModal} />
        )}
      </div>

      <style>{`
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ProductList6;
