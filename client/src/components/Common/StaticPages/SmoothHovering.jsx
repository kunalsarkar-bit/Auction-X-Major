import React, { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';


const SmoothHovering = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check if dark mode is already enabled
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const companies = [
    {
      name: "Apple",
      logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
      href: "#apple",
      category: "tech"
    },
    {
      name: "Google",
      logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
      href: "#google",
      category: "tech"
    },
    {
      name: "Microsoft",
      logo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg",
      href: "#microsoft",
      category: "tech"
    },
    {
      name: "Amazon",
      logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
      href: "#amazon",
      category: "ecommerce"
    },
    {
      name: "Meta",
      logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg",
      href: "#meta",
      category: "social"
    },
    {
      name: "Tesla",
      logo: "https://upload.wikimedia.org/wikipedia/commons/b/bb/Tesla_T_symbol.svg",
      href: "#tesla",
      category: "automotive"
    },
    {
      name: "Netflix",
      logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
      href: "#netflix",
      category: "entertainment"
    },
    {
      name: "Spotify",
      logo: "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg",
      href: "#spotify",
      category: "music"
    },
    {
      name: "Adobe",
      logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Adobe_Systems_logo_and_wordmark.svg",
      href: "#adobe",
      category: "creative"
    },
    {
      name: "Nvidia",
      logo: "https://upload.wikimedia.org/wikipedia/en/2/21/Nvidia_logo.svg",
      href: "#nvidia",
      category: "hardware"
    }
  ];

  return (
    <div className="min-h-screen transition-all duration-500 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:bg-gradient-to-br dark:from-gray-900 dark:via-slate-800 dark:to-gray-900">
      {/* Dark Mode Toggle */}
     

      {/* Header */}
      <div className="pt-20 pb-12 text-center">
        <h1 className="text-5xl font-bold mb-4 transition-colors duration-300 text-gray-800 dark:text-white">
          Company Showcase
        </h1>
        <p className="text-xl transition-colors duration-300 text-gray-600 dark:text-gray-300">
          Hover over the logos to see them come alive
        </p>
      </div>

      {/* Logo Grid */}
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
          {companies.map((company, index) => (
            <a
              key={company.name}
              href={company.href}
              className="group relative block p-8 rounded-2xl transition-all duration-500 ease-out transform hover:scale-110 hover:-translate-y-2 bg-white/80 hover:bg-white shadow-lg hover:shadow-2xl hover:shadow-blue-500/20 dark:bg-gray-800/50 dark:hover:bg-gray-700/70 dark:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-purple-500/20 backdrop-blur-sm border border-opacity-20 border-gray-200 dark:border-gray-600 hover:border-opacity-40"
              style={{
                animationDelay: `${index * 100}ms`
              }}
            >
              {/* Glow Effect */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-purple-500/10 dark:to-blue-500/10" />
              
              {/* Logo Container */}
              <div className="relative z-10 flex flex-col items-center justify-center h-full">
                <div className="w-16 h-16 mb-4 transition-all duration-500 group-hover:scale-125">
                  <img
                    src={company.logo}
                    alt={`${company.name} logo`}
                    className="w-full h-full object-contain transition-all duration-500 grayscale group-hover:grayscale-0 dark:filter dark:brightness-0 dark:invert dark:group-hover:brightness-100 dark:group-hover:invert-0 dark:group-hover:grayscale-0"
                    onError={(e) => {
                      // Fallback to a colored div if logo fails to load
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  {/* Fallback colored square */}
                  <div 
                    className="w-full h-full rounded-lg items-center justify-center text-2xl font-bold hidden bg-gradient-to-br from-blue-500 to-purple-500 text-white dark:from-purple-500 dark:to-blue-500 dark:text-white"
                  >
                    {company.name.charAt(0)}
                  </div>
                </div>
                
                {/* Company Name */}
                <h3 className="text-sm font-semibold text-center transition-all duration-300 group-hover:text-lg text-gray-800 group-hover:text-gray-900 dark:text-gray-200 dark:group-hover:text-white">
                  {company.name}
                </h3>
                
                {/* Category Badge */}
                <span className="mt-2 px-3 py-1 text-xs rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                  {company.category}
                </span>
              </div>

              {/* Animated Border */}
              <div className={`
                absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500
                bg-gradient-to-r ${isDarkMode 
                  ? 'from-purple-500 via-blue-500 to-purple-500' 
                  : 'from-blue-500 via-purple-500 to-blue-500'
                }
                animate-pulse
              `} style={{
                background: isDarkMode 
                  ? 'linear-gradient(45deg, #8b5cf6, #3b82f6, #8b5cf6)' 
                  : 'linear-gradient(45deg, #3b82f6, #8b5cf6,rgb(21, 87, 192))',
                backgroundSize: '200% 200%',
                animation: 'gradient 3s ease infinite',
                padding: '2px',
                zIndex: -1
              }}>
                <div className={`w-full h-full rounded-2xl ${
                  isDarkMode ? 'bg-gray-800' : 'bg-white'
                }`} />
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-20 pb-12 text-center">
        <p className={`text-sm transition-colors duration-300 ${
          isDarkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          Click on any logo to explore more
        </p>
      </div>

      <style jsx>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
};

export default SmoothHovering;