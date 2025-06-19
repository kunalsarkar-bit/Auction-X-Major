import React, { useEffect, useState } from "react";
import { useThemeProvider } from "../../AdminDashboard/utils/ThemeContext"; // Adjust the import path as needed
import AuctionXJapanese from "../../../assets/images/components/Banner2/AuctionXJapanese.jpg";
import AuctionXMessi from "../../../assets/images/components/Banner2/AuctionXMessi.jpg";
import AuctionXVirat from "../../../assets/images/components/Banner2/AuctionXVirat.jpg";
import AuctionXRonaldo from "../../../assets/images/components/Banner2/AuctionXRonaldo.jpg";
import AuctionXRock from "../../../assets/images/components/Banner2/AuctionXRock.jpg";

const images = [
  "https://images.bewakoof.com/uploads/grid/app/Mad-Diwali-Sale-IK-RM-1x1-HC-Banner-deals-are-live--1--1730374454.gif",
  AuctionXJapanese,
  AuctionXMessi,
  AuctionXVirat,
  AuctionXRonaldo,
  AuctionXRock,
];

const Banner4 = () => {
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );
  const { currentTheme } = useThemeProvider();

  // Update window width on resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Calculate image width and spacing based on screen size
  const getImageWidth = () => {
    if (windowWidth < 640) return "w-64"; // Small screens
    if (windowWidth < 1024) return "w-80"; // Medium screens
    return "w-96"; // Large screens
  };

  const getMargin = () => {
    if (windowWidth < 640) return "mr-3";
    return "mr-5";
  };

  return (
    <div className={`flex items-center justify-center p-2 md:p-4 ${currentTheme === 'dark' ? 'bg-[#191919]' : 'bg-white'}`}>
      {/* Carousel Container with No Background */}
      <div className="w-full max-w-8xl mx-auto overflow-hidden rounded-xl relative">
        {/* Carousel with Inline Animation */}
        <div
          className="flex"
          style={{
            animation: "savingzoneScroll 40s linear infinite",
          }}
        >
          {images.concat(images).map((src, index) => (
            <div
              key={index}
              className={`flex-shrink-0 ${getImageWidth()} ${getMargin()}`}
            >
              <img
                src={src}
                alt={`Promo ${index}`}
                className="w-full h-auto rounded-xl shadow-lg"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Responsive Keyframes */}
      <style>{`
        @keyframes savingzoneScroll {
          0% {
            transform: translateX(0);
          }
          10% {
            transform: translateX(0);
          }
          15% {
            transform: translateX(
              calc(
                -1 * (
                    ${windowWidth < 640
                        ? "67px"
                        : windowWidth < 1024
                        ? "85px"
                        : "101px"} + ${windowWidth < 640 ? "12px" : "20px"}
                  ) * 1
              )
            );
          }
          25% {
            transform: translateX(
              calc(
                -1 * (
                    ${windowWidth < 640
                        ? "67px"
                        : windowWidth < 1024
                        ? "85px"
                        : "101px"} + ${windowWidth < 640 ? "12px" : "20px"}
                  ) * 1
              )
            );
          }
          30% {
            transform: translateX(
              calc(
                -1 * (
                    ${windowWidth < 640
                        ? "67px"
                        : windowWidth < 1024
                        ? "85px"
                        : "101px"} + ${windowWidth < 640 ? "12px" : "20px"}
                  ) * 2
              )
            );
          }
          40% {
            transform: translateX(
              calc(
                -1 * (
                    ${windowWidth < 640
                        ? "67px"
                        : windowWidth < 1024
                        ? "85px"
                        : "101px"} + ${windowWidth < 640 ? "12px" : "20px"}
                  ) * 2
              )
            );
          }
          45% {
            transform: translateX(
              calc(
                -1 * (
                    ${windowWidth < 640
                        ? "67px"
                        : windowWidth < 1024
                        ? "85px"
                        : "101px"} + ${windowWidth < 640 ? "12px" : "20px"}
                  ) * 3
              )
            );
          }
          55% {
            transform: translateX(
              calc(
                -1 * (
                    ${windowWidth < 640
                        ? "67px"
                        : windowWidth < 1024
                        ? "85px"
                        : "101px"} + ${windowWidth < 640 ? "12px" : "20px"}
                  ) * 3
              )
            );
          }
          60% {
            transform: translateX(
              calc(
                -1 * (
                    ${windowWidth < 640
                        ? "67px"
                        : windowWidth < 1024
                        ? "85px"
                        : "101px"} + ${windowWidth < 640 ? "12px" : "20px"}
                  ) * 4
              )
            );
          }
          70% {
            transform: translateX(
              calc(
                -1 * (
                    ${windowWidth < 640
                        ? "67px"
                        : windowWidth < 1024
                        ? "85px"
                        : "101px"} + ${windowWidth < 640 ? "12px" : "20px"}
                  ) * 4
              )
            );
          }
          75% {
            transform: translateX(
              calc(
                -1 * (
                    ${windowWidth < 640
                        ? "67px"
                        : windowWidth < 1024
                        ? "85px"
                        : "101px"} + ${windowWidth < 640 ? "12px" : "20px"}
                  ) * 5
              )
            );
          }
          85% {
            transform: translateX(
              calc(
                -1 * (
                    ${windowWidth < 640
                        ? "67px"
                        : windowWidth < 1024
                        ? "85px"
                        : "101px"} + ${windowWidth < 640 ? "12px" : "20px"}
                  ) * 5
              )
            );
          }
          100% {
            transform: translateX(
              calc(
                -1 * (
                    ${windowWidth < 640
                        ? "67px"
                        : windowWidth < 1024
                        ? "85px"
                        : "101px"} + ${windowWidth < 640 ? "12px" : "20px"}
                  ) * 6
              )
            );
          }
        }
      `}</style>
    </div>
  );
};

export default Banner4;