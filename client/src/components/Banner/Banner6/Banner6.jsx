import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useThemeProvider } from "../../AdminDashboard/utils/ThemeContext";
import axios from "axios";

const Banner6 = () => {
  const navigate = useNavigate();
  const { currentTheme } = useThemeProvider();
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const API_URL = import.meta.env.VITE_API_URL;

  // Fetch banners from API
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/banners`, {
          params: {
            position: "top",
            isActive: true,
          },
        });

        // Access the banners data from the response
        const bannersData = response.data?.data || response.data || [];

        // Filter active banners and map to required format
        const formattedBanners = bannersData
          .filter((banner) => banner?.imageUrl && banner?.isActive)
          .map((banner) => ({
            id: banner._id,
            url: banner.imageUrl,
            author: banner.title,
            category: banner.description,
            link: banner.link,
          }));

        setBanners(formattedBanners);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching banners:", err);
        setError("Failed to load banners");
        setLoading(false);
        setBanners([]);
      }
    };

    fetchBanners();
  }, []);

  // Auto-rotation effect
  useEffect(() => {
    if (banners.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [banners.length]);

  // Navigate to link or category page
  const handleClick = (banner) => {
    if (banner.link) {
      if (banner.link.startsWith("http")) {
        window.open(banner.link, "_blank");
      } else {
        navigate(banner.link);
      }
    } else if (banner.category) {
      navigate(`/category/${banner.category}`);
    }
  };

  // Swipe handlers for touch devices
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (banners.length === 0) return;

    if (touchStart - touchEnd > 50) {
      // Swipe left
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }

    if (touchStart - touchEnd < -50) {
      // Swipe right
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? banners.length - 1 : prevIndex - 1
      );
    }
  };

  // Go to next slide
  const nextSlide = () => {
    if (banners.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
  };

  // Go to previous slide
  const prevSlide = () => {
    if (banners.length === 0) return;
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? banners.length - 1 : prevIndex - 1
    );
  };

  if (loading) {
    return (
      <div
        className={`w-full ${
          currentTheme === "dark" ? "bg-[#191919]" : "bg-white"
        } flex items-center justify-center p-3 sm:p-2 md:p-4 transition-colors duration-300`}
      >
        <div className="w-full mx-auto">
          <div className="relative overflow-hidden rounded-2xl sm:rounded-2xl shadow-lg h-[250px] sm:h-[300px] md:h-[400px] lg:h-[500px] w-full flex items-center justify-center">
            <p
              className={`${
                currentTheme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Loading banners...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`w-full ${
          currentTheme === "dark" ? "bg-[#191919]" : "bg-white"
        } flex items-center justify-center p-3 sm:p-2 md:p-4 transition-colors duration-300`}
      >
        <div className="w-full mx-auto">
          <div className="relative overflow-hidden rounded-2xl sm:rounded-2xl shadow-lg h-[250px] sm:h-[300px] md:h-[400px] lg:h-[500px] w-full flex items-center justify-center">
            <p
              className={`${
                currentTheme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`w-full ${
        currentTheme === "dark" ? "bg-[#191919]" : "bg-white"
      } flex items-center justify-center p-3 sm:p-2 md:p-4 transition-colors duration-300`}
    >
      <div className="w-full mx-auto">
        <div
          className="relative overflow-hidden rounded-2xl sm:rounded-2xl shadow-lg h-[250px] sm:h-[300px] md:h-[400px] lg:h-[500px] w-full group"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Navigation arrows */}
          <button
            className={`absolute left-4 top-1/2 -translate-y-1/2 z-10 ${
              currentTheme === "dark"
                ? "bg-gray-800/70 hover:bg-gray-800/90 text-white"
                : "bg-white/70 hover:bg-white/90 text-gray-900"
            } p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300`}
            onClick={prevSlide}
            aria-label="Previous slide"
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
            className={`absolute right-4 top-1/2 -translate-y-1/2 z-10 ${
              currentTheme === "dark"
                ? "bg-gray-800/70 hover:bg-gray-800/90 text-white"
                : "bg-white/70 hover:bg-white/90 text-gray-900"
            } p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300`}
            onClick={nextSlide}
            aria-label="Next slide"
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

          {/* Slides */}
          {banners.length > 0 ? (
            banners.map((banner, index) => (
              <div
                key={banner.id}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  index === currentIndex
                    ? "opacity-100"
                    : "opacity-0 pointer-events-none"
                }`}
                onClick={() => handleClick(banner)}
              >
                <img
                  src={banner.url}
                  alt={banner.author}
                  className="w-full h-full object-cover rounded-none sm:rounded-2xl cursor-pointer"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://via.placeholder.com/800x400?text=Banner+Image+Not+Found";
                  }}
                />

                {/* Caption */}
                <div
                  className={`absolute bottom-0 left-0 right-0 ${
                    currentTheme === "dark"
                      ? "bg-gradient-to-t from-black/80 to-transparent"
                      : "bg-gradient-to-t from-black/70 to-transparent"
                  } p-4 sm:p-6 text-white`}
                >
                  <p className="text-sm sm:text-base font-semibold">
                    {banner.author}
                  </p>
                  <p className="text-xs sm:text-sm opacity-90">
                    {banner.category}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div
              className={`absolute inset-0 flex items-center justify-center ${
                currentTheme === "dark" ? "bg-gray-800" : "bg-gray-200"
              } rounded-none sm:rounded-2xl w-full`}
            >
              <p
                className={`${
                  currentTheme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                No banners available
              </p>
            </div>
          )}

          {/* Indicator dots */}
          {banners.length > 0 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
              {banners.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-colors ${
                    index === currentIndex
                      ? currentTheme === "dark"
                        ? "bg-gray-200"
                        : "bg-white"
                      : currentTheme === "dark"
                      ? "bg-gray-200/50"
                      : "bg-white/50"
                  }`}
                  onClick={() => setCurrentIndex(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Banner6;
