import React from "react";
import { useThemeProvider } from "../../AdminDashboard/utils/ThemeContext"; // Adjust path as needed

const LogoSlider = () => {
  const { currentTheme } = useThemeProvider();

  // Array of company logo URLs (SVG format)
  const companyLogos = [
    "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg", // Google
    "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg", // Meta
    "https://upload.wikimedia.org/wikipedia/commons/5/53/Visa_2020_logo.svg", // Visa (updated URL)
    "https://upload.wikimedia.org/wikipedia/commons/d/df/Disney_Logo.svg", // Disney
    "https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg", // Nike
    "https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg", // Airbnb
    "https://upload.wikimedia.org/wikipedia/commons/4/4e/Playstation_logo_colour.svg", // PlayStation
    "https://upload.wikimedia.org/wikipedia/commons/c/ce/Coca-Cola_logo.svg", // Coca-Cola
    "https://upload.wikimedia.org/wikipedia/commons/0/0c/DeepSeek_Logo.svg", // DeepSeek (placeholder, replace with actual URL)
  ];

  return (
    <div className="w-full bg-white dark:bg-[#191919] pb-6 transition-colors duration-300">
      {/* Adaptive background and smooth transitions */}
      <div className="w-full overflow-hidden">
        <div
          className="flex items-center" // Center logos vertically
          style={{
            animation: "slide 25s linear infinite",
          }}
        >
          {/* Map through company logos */}
          {companyLogos.map((logo, index) => (
            <img
              key={index}
              src={logo}
              alt={`Company Logo ${index + 1}`}
              className={`w-24 h-16 mx-6 object-contain transition-all duration-300 ${
                currentTheme === 'dark' 
                  ? 'filter brightness-0 invert opacity-80 hover:opacity-100' 
                  : 'hover:opacity-80'
              }`}
              onError={(e) => {
                if (!e.target.dataset.failed) {
                  e.target.dataset.failed = true; // Prevent infinite loop
                  e.target.src =
                    "https://images.ctfassets.net/ihx0a8chifpc/GTlzd4xkx4LmWsG1Kw1BB/ad1834111245e6ee1da4372f1eb5876c/placeholder.com-1280x720.png?w=1920&q=60&fm=webp";
                }
              }}
            />
          ))}
          {/* Duplicate logos for infinite scrolling effect */}
          {companyLogos.map((logo, index) => (
            <img
              key={`dup-${index}`}
              src={logo}
              alt={`Company Logo ${index + 1} duplicate`}
              className={`w-24 h-16 mx-6 object-contain transition-all duration-300 ${
                currentTheme === 'dark' 
                  ? 'filter brightness-0 invert opacity-80 hover:opacity-100' 
                  : 'hover:opacity-80'
              }`}
              onError={(e) => {
                // Fallback in case the image fails to load
                if (!e.target.dataset.failed) {
                  e.target.dataset.failed = true;
                  e.target.src =
                    "https://images.ctfassets.net/ihx0a8chifpc/GTlzd4xkx4LmWsG1Kw1BB/ad1834111245e6ee1da4372f1eb5876c/placeholder.com-1280x720.png?w=1920&q=60&fm=webp";
                }
              }}
            />
          ))}
        </div>
      </div>

      {/* Inline styles for the animation */}
      <style>
        {`
          @keyframes slide {
            from {
              transform: translateX(0);
            }
            to {
              transform: translateX(-50%);
            }
          }
        `}
      </style>
    </div>
  );
};

export default LogoSlider;