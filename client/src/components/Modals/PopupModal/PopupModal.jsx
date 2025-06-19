import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ImPriceTags } from 'react-icons/im';
import { MdOutlineDescription } from 'react-icons/md';
import { RiMapPinTimeFill } from 'react-icons/ri';

const PopupModal = ({ product, onClose }) => {
  const navigate = useNavigate();
  
  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });
  const [isBiddingStarted, setIsBiddingStarted] = useState(false);
  const [isBiddingEnded, setIsBiddingEnded] = useState(false);
  const [biddingEndTime, setBiddingEndTime] = useState(null);

  useEffect(() => {
    let interval;

    const initializeTimer = () => {
      try {
        // Safely access nested properties with optional chaining and null checks
        const biddingStartDate = product?.biddingStartDate;
        const biddingStartTime = product?.biddingStartTime;
        const biddingEndTime = product?.biddingEndTime;

        if (biddingStartDate && biddingStartTime) {
          const startDate = new Date(biddingStartDate);
          const startTime = new Date(biddingStartTime);

          if (isNaN(startDate) || isNaN(startTime)) {
            console.error("Invalid start date or time");
            return;
          }

          startDate.setUTCHours(
            startTime.getUTCHours(),
            startTime.getUTCMinutes(),
            0,
            0
          );

          const endTime = new Date(biddingEndTime);
          if (!isNaN(endTime)) {
            setBiddingEndTime(endTime);
            interval = setInterval(() => updateTimer(startDate, endTime), 1000);
          } else {
            console.error("Invalid end time");
          }
        }
      } catch (error) {
        console.error("Error initializing timer:", error);
      }
    };

    const updateTimer = (startTime, endTime) => {
      const now = new Date().getTime();
      let difference = isBiddingStarted
        ? endTime.getTime() - now
        : startTime.getTime() - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({
          days: String(days).padStart(2, "0"),
          hours: String(hours).padStart(2, "0"),
          minutes: String(minutes).padStart(2, "0"),
          seconds: String(seconds).padStart(2, "0"),
        });
      } else {
        setTimeLeft({ days: "00", hours: "00", minutes: "00", seconds: "00" });
        clearInterval(interval);
        if (!isBiddingStarted) {
          setIsBiddingStarted(true);
        } else {
          setIsBiddingEnded(true);
        }
      }
    };

    if (product) {
      initializeTimer();
    }

    return () => clearInterval(interval);
  }, [product, isBiddingStarted]);

  if (!product) return null;

  // Safely extract product properties with fallbacks
  const productName = typeof product?.name === 'string' ? product.name : 'Product Name';
  const productDescription = typeof product?.description === 'string' ? product.description : 'No description available';
  const productPrice = typeof product?.biddingStartPrice === 'number' 
    ? product.biddingStartPrice 
    : 0;
  const imageUrl = product?.images?.[0]?.secure_url || '';

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" onClick={onClose}>
      {/* Dimmed Background with Blur */}
      <div className="absolute inset-0 backdrop-blur-sm bg-opacity-70"></div>
      
      {/* Popup Content */}
      <div 
        className="relative bg-white dark:bg-[#191919] p-6 rounded-lg shadow-xl z-50 w-full max-w-4xl mx-4 flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className="absolute top-2 right-2 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 text-xl font-bold"
          onClick={onClose}
        >
          ✖
        </button>

        {/* Left Content - Product Details */}
        <div className="md:w-1/2 p-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">{productName}</h2>
          <p className="flex items-center text-gray-700 dark:text-gray-300 mb-2">
            <ImPriceTags className="mr-2" /> Price: ₹{productPrice.toLocaleString()}
          </p>
          <p className="flex items-center text-gray-700 dark:text-gray-300 mb-4">
            <MdOutlineDescription className="mr-2" /> Description: {productDescription}
          </p>
          
          {/* Timer Section */}
          <div className="mt-6">
            <h2 className="flex items-center text-lg font-semibold text-gray-800 dark:text-white mb-3">
              BID{" "}
              {isBiddingStarted
                ? isBiddingEnded
                  ? "HAS ENDED"
                  : "ENDS IN "
                : "STARTS IN "}
              <RiMapPinTimeFill className="ml-2" />
            </h2>
            
            {/* Timer Boxes */}
            <div className="flex space-x-2 mb-4">
              <div className="bg-gray-800 dark:bg-[#303030] text-white rounded-lg p-2 text-center w-16">
                <span className="block text-xl font-bold">{timeLeft.days}</span>
                <span className="text-xs">DAYS</span>
              </div>
              <div className="bg-gray-800 dark:bg-[#303030] text-white rounded-lg p-2 text-center w-16">
                <span className="block text-xl font-bold">{timeLeft.hours}</span>
                <span className="text-xs">HOURS</span>
              </div>
              <div className="bg-gray-800 dark:bg-[#303030] text-white rounded-lg p-2 text-center w-16">
                <span className="block text-xl font-bold">{timeLeft.minutes}</span>
                <span className="text-xs">MINUTES</span>
              </div>
              <div className="bg-gray-800 dark:bg-[#303030] text-white rounded-lg p-2 text-center w-16">
                <span className="block text-xl font-bold">{timeLeft.seconds}</span>
                <span className="text-xs">SECONDS</span>
              </div>
            </div>
            
            {/* View Item Button */}
            <button
              onClick={() => navigate(`/product/${product._id}`)}
              className="w-full mt-4 bg-gray-800 dark:bg-[#303030] hover:bg-gray-700 dark:hover:bg-[#404040] text-white py-2 px-4 rounded-lg transition-all duration-300 hover:shadow-lg"
            >
              View Item
            </button>
          </div>
        </div>
        
        {/* Right Content - Product Image */}
        <div className="md:w-1/2 p-4">
          <img
            src={imageUrl}
            alt={productName}
            className="w-full h-64 md:h-96 object-contain rounded-lg"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default PopupModal;