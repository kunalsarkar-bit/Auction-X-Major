import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useThemeProvider } from "../../../../AdminDashboard/utils/ThemeContext"; // Adjust path as needed
import Team from "../AboutUs3/AboutUs3";

const AboutUs2 = () => {
  const navigate = useNavigate();
  const { currentTheme } = useThemeProvider();

  useEffect(() => {
    // Delay execution to ensure DOM is fully rendered
    const init = () => {
      const cards = document.querySelectorAll(".stacked-cards-card");
      const stackArea = document.querySelector(".stacked-cards-stack-area");

      console.log("Cards:", cards);
      console.log("Stack Area:", stackArea);

      if (!cards.length || !stackArea) {
        console.error("Cards or Stack Area not found!");
        return;
      }

      const rotateCards = () => {
        console.log("Rotating cards");
        let angle = 0;
        cards.forEach((card) => {
          if (card.classList.contains("active")) {
            card.style.transform = `translate(-50%, -120vh) rotate(-48deg)`;
          } else {
            card.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
            angle = angle - 10;
          }
        });
      };

      rotateCards();

      const handleScroll = () => {
        console.log("Scroll event triggered");
        let proportion =
          stackArea.getBoundingClientRect().top / window.innerHeight;
        if (proportion <= 0) {
          let n = cards.length;
          let index = Math.ceil((proportion * n) / 2);
          index = Math.abs(index) - 1;
          for (let i = 0; i < n; i++) {
            if (i <= index) {
              cards[i].classList.add("active");
            } else {
              cards[i].classList.remove("active");
            }
          }
          rotateCards();
        }
      };

      window.addEventListener("scroll", handleScroll);

      const adjust = () => {
        const windowWidth = window.innerWidth;
        const left = document.querySelector(".stacked-cards-left");

        if (left && stackArea) {
          left.remove();
          if (windowWidth < 800) {
            stackArea.insertAdjacentElement("beforebegin", left);
          } else {
            stackArea.insertAdjacentElement("afterbegin", left);
          }
        }
      };

      adjust();
      window.addEventListener("resize", adjust);

      return () => {
        window.removeEventListener("scroll", handleScroll);
        window.removeEventListener("resize", adjust);
      };
    };

    // Delay execution slightly to ensure DOM is ready
    const timeoutId = setTimeout(init, 100);

    // Cleanup timeout on unmount
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="w-full h-fit bg-white dark:bg-[#191919] mb-[6%] transition-colors duration-300">
      <div className="w-full h-fit flex flex-col items-center justify-center">
        <div className="w-full h-[630px] flex items-center justify-center px-4 text-center">
          <b className="font-poppins text-[50px] sm:text-[80px] md:text-[120px] lg:text-[150px] text-black dark:text-white transition-colors duration-300">
            Auction X
          </b>
        </div>

        <div className="w-full h-[300vh] relative flex justify-center stacked-cards-stack-area">
          <div className="h-screen sticky lg:ml-[270px] top-0 flex flex-col items-center justify-center text-center md:text-left md:items-start basis-1/2 stacked-cards-left px-4">
            <div className="max-w-[420px] font-poppins text-[48px] sm:text-[64px] md:text-[84px] font-bold leading-tight text-black dark:text-white transition-colors duration-300">
              About Us
            </div>
            <div className="max-w-[420px] font-poppins text-[12px] sm:text-[14px] mt-4 sm:mt-6 text-black dark:text-gray-300 transition-colors duration-300">
              For us, AuctionX is the spirit of looking at things differently.
              This was the spirit on which AuctionX was founded in 2024. With
              the belief that a business cannot be about financial gain alone.
              It is about making a positive impact. That's what AuctionX is
              about.
              <br />
              <button
                onClick={() => navigate("/our-story")}
                className="font-poppins text-[12px] sm:text-[14px] px-6 py-3 bg-white dark:bg-gray-800 text-black dark:text-white rounded-[8mm] border border-black dark:border-gray-600 outline-none cursor-pointer mt-5 sm:mt-6 transition-all duration-300 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
              >
                See More Details
              </button>
            </div>
          </div>

          <div className="h-screen w-full sticky top-0 flex items-center justify-center basis-1/2">
            <div className="w-full h-full relative">
              <div className="w-[350px] h-[350px] p-[35px] rounded-[6mm] flex flex-col justify-between absolute top-1/2 left-1/2 transition-all duration-500 ease-in-out bg-[rgb(64,122,255)] dark:bg-[rgb(54,112,245)] z-4 stacked-cards-card shadow-lg dark:shadow-gray-900/20">
                <div className="font-poppins text-[20px] font-bold text-white">
                  Simplified
                </div>
                <div className="font-poppins text-[44px] font-bold leading-[54px] text-white">
                  Auction are now simple
                </div>
              </div>
              <div className="w-[350px] h-[350px] p-[35px] rounded-[6mm] flex flex-col justify-between absolute top-1/2 left-1/2 transition-all duration-500 ease-in-out bg-[rgb(221,62,88)] dark:bg-[rgb(211,52,78)] z-3 stacked-cards-card shadow-lg dark:shadow-gray-900/20">
                <div className="font-poppins text-[20px] font-bold text-white">
                  Effortless Auction
                </div>
                <div className="font-poppins text-[44px] font-bold leading-[54px] text-white">
                  Seamless Auction Experience
                </div>
              </div>
              <div className="w-[350px] h-[350px] p-[35px] rounded-[6mm] flex flex-col justify-between absolute top-1/2 left-1/2 transition-all duration-500 ease-in-out bg-[rgb(186,113,245)] dark:bg-[rgb(176,103,235)] z-2 stacked-cards-card shadow-lg dark:shadow-gray-900/20">
                <div className="font-poppins text-[20px] font-bold text-white">
                  Real-Time Bid
                </div>
                <div className="font-poppins text-[44px] font-bold leading-[54px] text-white">
                  Real-Time Bidding Updates
                </div>
              </div>
              <div className="w-[350px] h-[350px] p-[35px] rounded-[6mm] flex flex-col justify-between absolute top-1/2 left-1/2 transition-all duration-500 ease-in-out bg-[rgb(247,92,208)] dark:bg-[rgb(237,82,198)] z-1 stacked-cards-card shadow-lg dark:shadow-gray-900/20">
                <div className="font-poppins text-[20px] font-bold text-white">
                  Support
                </div>
                <div className="font-poppins text-[44px] font-bold leading-[54px] text-white">
                  Now it's 24/7 support
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full h-screen flex items-center justify-center bg-white dark:bg-[#191919] transition-colors duration-300">
          <Team />
        </div>
      </div>
    </div>
  );
};

export default AboutUs2;
