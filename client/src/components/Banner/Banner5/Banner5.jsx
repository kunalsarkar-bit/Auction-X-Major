import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useThemeProvider } from "../../AdminDashboard/utils/ThemeContext"; // Update the import path
// Importing images from the local folder
import image1 from "../../../assets/images/components/Banner/auction 1.png";
import image2 from "../../../assets/images/components/Banner/auction 2.png";
import image3 from "../../../assets/images/components/Banner/auction 3.jpg";
import image4 from "../../../assets/images/components/Banner/auction 4.png";
import image5 from "../../../assets/images/components/Banner/auction 5.png";
import image6 from "../../../assets/images/components/Banner/auction 6.png";
import image7 from "../../../assets/images/components/Banner/auction 7.png";

const Banner5 = () => {
  const navigate = useNavigate();
  const { currentTheme } = useThemeProvider();

  const products = [
    { id: 1, url: image1, author: "Author 1", category: "Currencies" },
    { id: 2, url: image2, author: "Author 2", category: "Antiques" },
    { id: 3, url: image3, author: "Author 3", category: "Automobiles" },
    { id: 4, url: image4, author: "Author 4", category: "Automobiles" },
    { id: 5, url: image5, author: "Author 5", category: "Books" },
    { id: 6, url: image6, author: "Author 6", category: "Furnitures" },
    { id: 7, url: image7, author: "Author 7", category: "Properties" },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Auto-rotation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [products.length]);

  // Navigate to category page
  const handleClick = (category) => {
    navigate(`/category/${category}`);
  };

  // Swipe handlers for touch devices
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      // Swipe left
      setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
    }

    if (touchStart - touchEnd < -50) {
      // Swipe right
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? products.length - 1 : prevIndex - 1
      );
    }
  };

  // Go to next slide
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
  };

  // Go to previous slide
  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? products.length - 1 : prevIndex - 1
    );
  };

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
          {products.length > 0 ? (
            products.map((product, index) => (
              <div
                key={product.id}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  index === currentIndex
                    ? "opacity-100"
                    : "opacity-0 pointer-events-none"
                }`}
                onClick={() => handleClick(product.category)}
              >
                <img
                  src={product.url}
                  alt={product.author}
                  className="w-full h-full object-cover rounded-none sm:rounded-2xl"
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
                    {product.author}
                  </p>
                  <p className="text-xs sm:text-sm opacity-90">
                    {product.category}
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
                No images available
              </p>
            </div>
          )}

          {/* Indicator dots */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
            {products.map((_, index) => (
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
        </div>
      </div>
    </div>
  );
};

export default Banner5;
