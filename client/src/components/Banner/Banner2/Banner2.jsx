import React from "react";
import { useNavigate } from "react-router-dom";
import TodayBids from "../../../assets/images/components/Banner4/Today.gif";
import TommorowBids from "../../../assets/images/components/Banner4/Tommorow.gif";
import { useThemeProvider } from "../../AdminDashboard/utils/ThemeContext"
const Banner2 = () => {
  const navigate = useNavigate();
  const { currentTheme } = useThemeProvider();

  const handleImageClick = (route) => {
    navigate(route);
  };

  return (
    <div className={`flex flex-row justify-center items-center gap-3 p-3 ${
      currentTheme === 'dark' ? 'bg-[#191919]' : 'bg-white'
    }`}>
      {/* First Image Box */}
      <div
        className="cursor-pointer w-1/2 flex justify-center items-center aspect-video overflow-hidden rounded-xl transition-transform duration-300 hover:scale-105 hover:shadow-lg"
        onClick={() => handleImageClick("/todaybid")}
      >
        <img
          src={TodayBids}
          alt="Product 1"
          className="w-full h-full object-cover rounded-xl"
        />
      </div>

      {/* Second Image Box */}
      <div
        className="cursor-pointer w-1/2 flex justify-center items-center aspect-video overflow-hidden rounded-xl transition-transform duration-300 hover:scale-105 hover:shadow-lg"
        onClick={() => handleImageClick("/tomorrowbid")}
      >
        <img
          src={TommorowBids}
          alt="Product 2"
          className="w-full h-full object-cover rounded-xl"
        />
      </div>
    </div>
  );
};

export default Banner2;