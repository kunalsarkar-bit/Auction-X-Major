import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useThemeProvider } from "../../../components/AdminDashboard/utils/ThemeContext"; // Adjust path as needed
import companylogo from "../../../assets/images/Layouts/AutionX.png";
import facebooklogo from "../../../assets/images/Layouts/facebook.png";
import instagramlogo from "../../../assets/images/Layouts/instagram.png";
import xlogo from "../../../assets/images/Layouts/twitter.png";
import linkedinlogo from "../../../assets/images/Layouts/linkedin.png";
import githublogo from "../../../assets/images/Layouts/github-logo.png";
import LogoSlider from "../../../components/Common/LogoSlider/LogoSlider";

const Footer = () => {
  const [activeSection, setActiveSection] = useState(null);
  const { currentTheme } = useThemeProvider();
  const isMobileView = window.innerWidth <= 768;

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  return (
    <footer className="bg-white dark:bg-[#191919] text-black dark:text-white py-10 relative overflow-hidden border-t border-b border-gray-200 dark:border-gray-700 shadow-sm transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div>
          <LogoSlider />
        </div>
        <div className="flex flex-col items-center space-y-5">
          {/* Logo with Watery Reflection and Glow on Hover */}
          <div className="flex items-center mb-5 relative group">
            <Link to="/" className="relative">
              <img
                src={companylogo}
                alt="Company Logo"
                className="w-56 h-auto mr-4 transition-transform duration-200 ease-in-out hover:scale-110 hover:filter hover:drop-shadow-[0_0_10px_rgba(0,0,0,0.2)] dark:hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]"
              />
              {/* Watery Reflection for Logo */}
              <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-white dark:from-[#191919] to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>
            </Link>
            <span className="text-xl text-yellow-500 font-semibold">
              Place your first bid now!!
            </span>
          </div>
          <div className="w-full max-w-6xl flex justify-between flex-wrap gap-5">
            {/* About Section */}
            <div className="flex-1 min-w-[200px] px-5">
              <h3
                className="text-xl font-bold text-yellow-500 border-b-2 border-yellow-500 pb-2 text-center cursor-pointer"
                onClick={() => isMobileView && toggleSection("about")}
              >
                About
              </h3>
              <nav
                className={`${
                  activeSection === "about" || !isMobileView
                    ? "block"
                    : "hidden"
                }`}
              >
                <ul className="mt-4 flex space-x-6 justify-center">
                  <li>
                    <Link
                      to="/contact"
                      className="text-black dark:text-white hover:text-yellow-500 transition-colors duration-300"
                    >
                      Contact Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/about"
                      className="text-black dark:text-white hover:text-yellow-500 transition-colors duration-300"
                    >
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/whyus"
                      className="text-black dark:text-white hover:text-yellow-500 transition-colors duration-300"
                    >
                      Why Us
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>

            {/* Consumer Policy Section */}
            <div className="flex-1 min-w-[200px] px-5">
              <h3
                className="text-xl font-bold text-yellow-500 border-b-2 border-yellow-500 pb-2 text-center cursor-pointer"
                onClick={() => isMobileView && toggleSection("consumer")}
              >
                Consumer Policy
              </h3>
              <nav
                className={`${
                  activeSection === "consumer" || !isMobileView
                    ? "block"
                    : "hidden"
                }`}
              >
                <ul className="mt-4 flex space-x-6 justify-center">
                  <li>
                    <Link
                      to="/terms"
                      className="text-black dark:text-white hover:text-yellow-500 transition-colors duration-300"
                    >
                      Terms & Conditions
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/security"
                      className="text-black dark:text-white hover:text-yellow-500 transition-colors duration-300"
                    >
                      Security
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/privacy"
                      className="text-black dark:text-white hover:text-yellow-500 transition-colors duration-300"
                    >
                      Privacy
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>

            {/* HELP Section */}
            <div className="flex-1 min-w-[200px] px-5">
              <h3
                className="text-xl font-bold text-yellow-500 border-b-2 border-yellow-500 pb-2 text-center cursor-pointer"
                onClick={() => isMobileView && toggleSection("help")}
              >
                HELP
              </h3>
              <nav
                className={`${
                  activeSection === "help" || !isMobileView ? "block" : "hidden"
                }`}
              >
                <ul className="mt-4 flex space-x-6 justify-center">
                  <li>
                    <Link
                      to="/payment"
                      className="text-black dark:text-white hover:text-yellow-500 transition-colors duration-300"
                    >
                      Payment
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/shipping"
                      className="text-black dark:text-white hover:text-yellow-500 transition-colors duration-300"
                    >
                      Shipping
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/report"
                      className="text-black dark:text-white hover:text-yellow-500 transition-colors duration-300"
                    >
                      Reports
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/faq"
                      className="text-black dark:text-white hover:text-yellow-500 transition-colors duration-300"
                    >
                      FAQ
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center">
          <div className="flex justify-center space-x-4">
            {/* Social Media Icons with Reflection and Glow */}
            {[
              {
                href: "https://linktr.ee/auctionx_official",
                src: githublogo,
                alt: "GitHub",
                color: "#333",
                glowColor: "rgba(51, 51, 51, 0.5)",
                darkGlowColor: "rgba(255, 255, 255, 0.3)",
              },
              {
                href: "https://linktr.ee/AuctionX",
                src: linkedinlogo,
                alt: "LinkedIn",
                color: "#0072b1",
                glowColor: "rgba(0, 114, 177, 0.5)",
                darkGlowColor: "rgba(0, 114, 177, 0.7)",
              },
              {
                href: "https://www.facebook.com/share/15nxmDHcJ6/",
                src: facebooklogo,
                alt: "Facebook",
                color: "#426782",
                glowColor: "rgba(66, 103, 130, 0.5)",
                darkGlowColor: "rgba(66, 103, 130, 0.7)",
              },
              {
                href: "https://www.instagram.com/auctionx_official/",
                src: instagramlogo,
                alt: "Instagram",
                color: "#E1306C",
                glowColor: "rgba(225, 48, 108, 0.5)",
                darkGlowColor: "rgba(225, 48, 108, 0.7)",
              },
              {
                href: "https://x.com/Auction__X",
                src: xlogo,
                alt: "X",
                color: "#1DA1F2",
                glowColor: "rgba(29, 161, 242, 0.5)",
                darkGlowColor: "rgba(29, 161, 242, 0.7)",
              },
            ].map((icon, index) => (
              <a
                key={index}
                href={icon.href}
                target="_blank"
                rel="noopener noreferrer"
                className="relative group"
              >
                <div className="relative">
                  {/* Original Icon */}
                  <img
                    src={icon.src}
                    alt={icon.alt}
                    className="w-12 h-12 rounded-full transition-all duration-500"
                    style={{ boxShadow: "none" }} // No shadow by default
                  />
                  {/* Glow Effect (Subtle) */}
                  <div
                    className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      boxShadow: `0 0 15px 5px ${
                        currentTheme === 'dark' ? icon.darkGlowColor : icon.glowColor
                      }`, // Theme-aware glow
                    }}
                  ></div>
                  {/* Watery Reflection */}
                  <div className="absolute inset-x-0 top-full transform scale-y-[-1] translate-y-2 opacity-50 group-hover:opacity-70 transition-opacity duration-500">
                    <img
                      src={icon.src}
                      alt={icon.alt}
                      className="w-12 h-12 rounded-full blur-[1px]"
                      style={{ filter: "brightness(0.8)" }}
                    />
                    {/* Gradient Overlay for Reflection */}
                    <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#191919] to-transparent opacity-50"></div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
        <p className="mt-4 text-sm text-black dark:text-white">
          &copy; {new Date().getFullYear()} AuctionX. All rights reserved.{" "}
          <a href="/terms" className="text-yellow-500 hover:text-black dark:hover:text-white transition-colors duration-300">
            Terms & Conditions
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;