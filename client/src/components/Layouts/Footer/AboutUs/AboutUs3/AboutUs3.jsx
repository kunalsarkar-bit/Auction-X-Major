import React from "react";
import avatar2 from "../../../../../assets/images/FooterElements/AboutUs/KunalSarkar.jpg";
import avatar3 from "../../../../../assets/images/FooterElements/AboutUs/OmSardar.jpg";
import avatar4 from "../../../../../assets/images/FooterElements/AboutUs/SouravKhanra.jpg";
import avatar5 from "../../../../../assets/images/FooterElements/AboutUs/SubhoSamanta.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedin, faGithub } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { useThemeProvider } from "../../../../AdminDashboard/utils/ThemeContext"; // Update path as needed

const AboutUs3 = () => {
  const { currentTheme } = useThemeProvider();
  const isDark = currentTheme === 'dark';

  return (
    <div className={`w-full min-h-screen py-10 transition-colors duration-300 ${
      isDark ? 'bg-[#191919]' : 'bg-white'
    }`}>
      <div className="w-full h-full flex items-center justify-center px-4">
        <div className="w-full h-fit flex items-center justify-center flex-col font-poppins">
          {/* Title */}
          <div className={`text-2xl md:text-4xl font-bold mb-6 md:mb-10 text-center transition-colors duration-300 ${
            isDark ? 'text-white' : 'text-gray-800'
          }`}>
            Our Team
          </div>

          {/* Team Profiles */}
          <div className="w-full h-fit flex items-center justify-center flex-wrap gap-y-10 md:gap-y-16">
            {/* Kunal Sarkar */}
            <div className="w-full sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/4 h-fit relative flex items-center justify-end flex-col pt-5 px-2 max-h-[100px] transition-all duration-500 ease-in-out group hover:max-h-[500px]">
              {/* Card */}
              <div className={`w-full max-w-[320px] h-[300px] mb-5 p-5 hidden items-center justify-center flex-col rounded-[6mm] relative group-hover:flex animate-fade transform transition-all duration-300 ease-out scale-95 group-hover:scale-100 opacity-0 group-hover:opacity-100 ${
                isDark ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'
              }`}>
                <div className="w-full flex items-end justify-start mb-1">
                  <img
                    src={avatar2}
                    alt="Kunal Sarkar"
                    className="w-[60px] h-[60px] rounded-[5mm]"
                  />
                  <div className={`text-base font-light w-fit ml-2.5 border px-2 rounded-[3mm] transition-colors duration-300 ${
                    isDark ? 'border-gray-500 text-white' : 'border-gray-400 text-gray-800'
                  }`}>
                    Kunal Sarkar
                  </div>
                </div>
                <div className="flex-grow flex justify-center flex-col text-sm relative">
                  <div className={`font-light text-sm transition-colors duration-300 ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    Lead Developer/Technical Strategist
                  </div>
                  A passionate Graphic & Branding Designer and Full Stack
                  Developer, blending creativity and technical expertise to
                  craft impactful solutions.
                </div>
                <div className={`backdrop-blur-[9px] backdrop-saturate-180 w-full px-5 rounded-[7mm] flex items-center justify-evenly transition-colors duration-300 ${
                  isDark ? 'bg-gray-700' : 'bg-gray-200'
                }`}>
                  <a
                    href="https://www.linkedin.com/in/kunal-sarkar-592a1230a/"
                    target="_blank"
                    className={`w-10 h-10 leading-10 text-center no-underline text-base transition-all duration-350 hover:rounded-full ${
                      isDark 
                        ? 'text-white hover:bg-white hover:text-gray-800' 
                        : 'text-gray-800 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <FontAwesomeIcon icon={faLinkedin} />
                  </a>
                  <a
                    href="https://github.com/kunalsarkar-bit"
                    target="_blank"
                    className={`w-10 h-10 leading-10 text-center no-underline text-base transition-all duration-350 hover:rounded-full ${
                      isDark 
                        ? 'text-white hover:bg-white hover:text-gray-800' 
                        : 'text-gray-800 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <FontAwesomeIcon icon={faGithub} />
                  </a>
                  <a
                    href="mailto:kunalsarkar6290@gmail.com"
                    target="_blank"
                    className={`w-10 h-10 leading-10 text-center no-underline text-base transition-all duration-350 hover:rounded-full ${
                      isDark 
                        ? 'text-white hover:bg-white hover:text-gray-800' 
                        : 'text-gray-800 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <FontAwesomeIcon icon={faEnvelope} />
                  </a>
                </div>
                {/* Adjusted Blur Effect */}
                <div className="absolute top-[calc(60%-0px)] left-1/3 transform -translate-x-1/2 bg-pink-500/50 w-[90px] h-[30px] blur-[20px]"></div>
                <div className="absolute top-[calc(20%-30px)] left-2/3 transform -translate-x-1/2 bg-teal-400/50 w-[90px] h-[30px] blur-[20px]"></div>
              </div>

              {/* Profile Image */}
              <img
                src={avatar2}
                alt="Kunal Sarkar"
                className="w-10 h-10 rounded-full relative z-10 transition-transform duration-300 ease-in-out group-hover:scale-110"
              />

              {/* Profile Details */}
              <div className={`flex flex-col items-center text-center text-base font-semibold transition-colors duration-300 ${
                isDark ? 'text-white' : 'text-gray-800'
              }`}>
                Kunal Sarkar
                <span className={`font-light text-sm transition-colors duration-300 ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Lead Developer/Technical Strategist
                </span>
              </div>
            </div>

            {/* Om Sardar */}
            <div className="w-full sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/4 h-fit relative flex items-center justify-end flex-col pt-5 px-2 max-h-[100px] transition-all duration-500 ease-in-out group hover:max-h-[500px]">
              {/* Card */}
              <div className={`w-full max-w-[320px] h-[300px] mb-5 p-5 hidden items-center justify-center flex-col rounded-[6mm] relative group-hover:flex animate-fade transform transition-all duration-300 ease-out scale-95 group-hover:scale-100 opacity-0 group-hover:opacity-100 ${
                isDark ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'
              }`}>
                <div className="w-full flex items-end justify-start mb-1">
                  <img
                    src={avatar3}
                    alt="Om Sardar"
                    className="w-[60px] h-[60px] rounded-[5mm]"
                  />
                  <div className={`text-base font-light w-fit ml-2.5 border px-2 rounded-[3mm] transition-colors duration-300 ${
                    isDark ? 'border-gray-500 text-white' : 'border-gray-400 text-gray-800'
                  }`}>
                    Om Sardar
                  </div>
                </div>
                <div className="flex-grow flex justify-center flex-col text-sm relative">
                  <div className={`font-light text-sm transition-colors duration-300 ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    Lead Full-Stack Developer
                  </div>
                  A passionate BCA student with proficiency in Python, Java, C,
                  OOP, and Data Structures, committed to developing innovative
                  and efficient solutions.
                </div>
                <div className={`backdrop-blur-[9px] backdrop-saturate-180 w-full px-5 rounded-[7mm] flex items-center justify-evenly transition-colors duration-300 ${
                  isDark ? 'bg-gray-700' : 'bg-gray-200'
                }`}>
                  <a
                    href="https://www.linkedin.com/in/om-sardar"
                    target="_blank"
                    className={`w-10 h-10 leading-10 text-center no-underline text-base transition-all duration-350 hover:rounded-full ${
                      isDark 
                        ? 'text-white hover:bg-white hover:text-gray-800' 
                        : 'text-gray-800 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <FontAwesomeIcon icon={faLinkedin} />
                  </a>
                  <a
                    href="https://github.com/OM-SARDAR"
                    target="_blank"
                    className={`w-10 h-10 leading-10 text-center no-underline text-base transition-all duration-350 hover:rounded-full ${
                      isDark 
                        ? 'text-white hover:bg-white hover:text-gray-800' 
                        : 'text-gray-800 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <FontAwesomeIcon icon={faGithub} />
                  </a>
                  <a
                    href="mailto:omsardar14@gmail.com"
                    target="_blank"
                    className={`w-10 h-10 leading-10 text-center no-underline text-base transition-all duration-350 hover:rounded-full ${
                      isDark 
                        ? 'text-white hover:bg-white hover:text-gray-800' 
                        : 'text-gray-800 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <FontAwesomeIcon icon={faEnvelope} />
                  </a>
                </div>
                {/* Adjusted Blur Effect */}
                <div className="absolute top-[calc(60%-0px)] left-1/3 transform -translate-x-1/2 bg-teal-400/50 w-[90px] h-[30px] blur-[20px]"></div>
                <div className="absolute top-[calc(20%-30px)] left-2/3 transform -translate-x-1/2 bg-pink-400/50 w-[90px] h-[30px] blur-[20px]"></div>
              </div>

              {/* Profile Image */}
              <img
                src={avatar3}
                alt="Om Sardar"
                className="w-10 h-10 rounded-full relative z-10 transition-transform duration-300 ease-in-out group-hover:scale-110"
              />

              {/* Profile Details */}
              <div className={`flex flex-col items-center text-center text-base font-semibold transition-colors duration-300 ${
                isDark ? 'text-white' : 'text-gray-800'
              }`}>
                Om Sardar
                <span className={`font-light text-sm transition-colors duration-300 ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Lead Full-Stack Developer
                </span>
              </div>
            </div>

            {/* Sourav Khanra */}
            <div className="w-full sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/4 h-fit relative flex items-center justify-end flex-col pt-5 px-2 max-h-[100px] transition-all duration-500 ease-in-out group hover:max-h-[500px]">
              {/* Card */}
              <div className={`w-full max-w-[320px] h-[300px] mb-5 p-5 hidden items-center justify-center flex-col rounded-[6mm] relative group-hover:flex animate-fade transform transition-all duration-300 ease-out scale-95 group-hover:scale-100 opacity-0 group-hover:opacity-100 ${
                isDark ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'
              }`}>
                <div className="w-full flex items-end justify-start mb-1">
                  <img
                    src={avatar4}
                    alt="Sourav Khanra"
                    className="w-[60px] h-[60px] rounded-[5mm]"
                  />
                  <div className={`text-base font-light w-fit ml-2.5 border px-2 rounded-[3mm] transition-colors duration-300 ${
                    isDark ? 'border-gray-500 text-white' : 'border-gray-400 text-gray-800'
                  }`}>
                    Sourav Khanra
                  </div>
                </div>
                <div className="flex-grow flex justify-center flex-col text-sm relative">
                  <div className={`font-light text-sm transition-colors duration-300 ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    Frontend Developer
                  </div>
                  Skilled in building responsive, user-friendly web interfaces
                  with a focus on performance, accessibility, and modern design
                  principles.
                </div>
                <div className={`backdrop-blur-[9px] backdrop-saturate-180 w-full px-5 rounded-[7mm] flex items-center justify-evenly transition-colors duration-300 ${
                  isDark ? 'bg-gray-700' : 'bg-gray-200'
                }`}>
                  <a
                    href="https://www.linkedin.com/in/sourav-khanra-87912433a/"
                    target="_blank"
                    className={`w-10 h-10 leading-10 text-center no-underline text-base transition-all duration-350 hover:rounded-full ${
                      isDark 
                        ? 'text-white hover:bg-white hover:text-gray-800' 
                        : 'text-gray-800 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <FontAwesomeIcon icon={faLinkedin} />
                  </a>
                  <a
                    href="https://github.com/Sorav-khanra"
                    target="_blank"
                    className={`w-10 h-10 leading-10 text-center no-underline text-base transition-all duration-350 hover:rounded-full ${
                      isDark 
                        ? 'text-white hover:bg-white hover:text-gray-800' 
                        : 'text-gray-800 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <FontAwesomeIcon icon={faGithub} />
                  </a>
                  <a
                    href="mailto:prolaccy60@gmail.com"
                    target="_blank"
                    className={`w-10 h-10 leading-10 text-center no-underline text-base transition-all duration-350 hover:rounded-full ${
                      isDark 
                        ? 'text-white hover:bg-white hover:text-gray-800' 
                        : 'text-gray-800 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <FontAwesomeIcon icon={faEnvelope} />
                  </a>
                </div>
                {/* Adjusted Blur Effect */}
                <div className="absolute top-[calc(60%-0px)] left-1/3 transform -translate-x-1/2 bg-red-400/50 w-[90px] h-[30px] blur-[20px]"></div>
                <div className="absolute top-[calc(20%-30px)] left-2/3 transform -translate-x-1/2 bg-teal-400/50 w-[90px] h-[30px] blur-[20px]"></div>
              </div>

              {/* Profile Image */}
              <img
                src={avatar4}
                alt="Sourav Khanra"
                className="w-10 h-10 rounded-full relative z-10 transition-transform duration-300 ease-in-out group-hover:scale-110"
              />

              {/* Profile Details */}
              <div className={`flex flex-col items-center text-center text-base font-semibold transition-colors duration-300 ${
                isDark ? 'text-white' : 'text-gray-800'
              }`}>
                Sourav Khanra
                <span className={`font-light text-sm transition-colors duration-300 ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Frontend Developer
                </span>
              </div>
            </div>

            {/* Subho Samanta */}
            <div className="w-full sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/4 h-fit relative flex items-center justify-end flex-col pt-5 px-2 max-h-[100px] transition-all duration-500 ease-in-out group hover:max-h-[500px]">
              {/* Card */}
              <div className={`w-full max-w-[320px] h-[300px] mb-5 p-5 hidden items-center justify-center flex-col rounded-[6mm] relative group-hover:flex animate-fade transform transition-all duration-300 ease-out scale-95 group-hover:scale-100 opacity-0 group-hover:opacity-100 ${
                isDark ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'
              }`}>
                <div className="w-full flex items-end justify-start mb-1">
                  <img
                    src={avatar5}
                    alt="Subho Samanta"
                    className="w-[60px] h-[60px] rounded-[5mm]"
                  />
                  <div className={`text-base font-light w-fit ml-2.5 border px-2 rounded-[3mm] transition-colors duration-300 ${
                    isDark ? 'border-gray-500 text-white' : 'border-gray-400 text-gray-800'
                  }`}>
                    Subho Samanta
                  </div>
                </div>
                <div className="flex-grow flex justify-center flex-col text-sm relative">
                  <div className={`font-light text-sm transition-colors duration-300 ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    Development Coordinator
                  </div>
                  Oversees the development process, ensuring timely delivery and
                  alignment with business goals, while bridging technical and
                  non-technical teams.
                </div>
                <div className={`backdrop-blur-[9px] backdrop-saturate-180 w-full px-5 rounded-[7mm] flex items-center justify-evenly transition-colors duration-300 ${
                  isDark ? 'bg-gray-700' : 'bg-gray-200'
                }`}>
                  <a
                    href="https://www.linkedin.com/in/subha-samanta-93883423b/"
                    target="_blank"
                    className={`w-10 h-10 leading-10 text-center no-underline text-base transition-all duration-350 hover:rounded-full ${
                      isDark 
                        ? 'text-white hover:bg-white hover:text-gray-800' 
                        : 'text-gray-800 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <FontAwesomeIcon icon={faLinkedin} />
                  </a>
                  <a
                    href="https://github.com/Subho256"
                    target="_blank"
                    className={`w-10 h-10 leading-10 text-center no-underline text-base transition-all duration-350 hover:rounded-full ${
                      isDark 
                        ? 'text-white hover:bg-white hover:text-gray-800' 
                        : 'text-gray-800 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <FontAwesomeIcon icon={faGithub} />
                  </a>
                  <a
                    href="mailto:subhasamantal968@gmail.com"
                    target="_blank"
                    className={`w-10 h-10 leading-10 text-center no-underline text-base transition-all duration-350 hover:rounded-full ${
                      isDark 
                        ? 'text-white hover:bg-white hover:text-gray-800' 
                        : 'text-gray-800 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <FontAwesomeIcon icon={faEnvelope} />
                  </a>
                </div>
                {/* Adjusted Blur Effect */}
                <div className="absolute top-[calc(60%-0px)] left-1/3 transform -translate-x-1/2 bg-green-400/50 w-[90px] h-[30px] blur-[20px]"></div>
                <div className="absolute top-[calc(20%-30px)] left-2/3 transform -translate-x-1/2 bg-purple-400/50 w-[90px] h-[30px] blur-[20px]"></div>
              </div>

              {/* Profile Image */}
              <img
                src={avatar5}
                alt="Subho Samanta"
                className="w-10 h-10 rounded-full relative z-10 transition-transform duration-300 ease-in-out group-hover:scale-110"
              />

              {/* Profile Details */}
              <div className={`flex flex-col items-center text-center text-base font-semibold transition-colors duration-300 ${
                isDark ? 'text-white' : 'text-gray-800'
              }`}>
                Subho Samanta
                <span className={`font-light text-sm transition-colors duration-300 ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Development Coordinator
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs3;