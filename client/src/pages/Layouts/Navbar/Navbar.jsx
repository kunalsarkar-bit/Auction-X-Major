import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import debounce from "lodash.debounce";
import { toast } from "react-hot-toast";
import ThemeToggle from "../../../components/AdminDashboard/components/ThemeToggle";
const API_URL = import.meta.env.VITE_API_URL;
const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const [allProducts, setAllProducts] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userCountry, setUserCountry] = useState("");
  const [openCategory, setOpenCategory] = useState(null);
  const [profilePic, setProfilePic] = useState("");
  const role = useSelector((state) => state.auth.role);

  const dropdownRef = useRef(null);
  const mobileDropdownRef = useRef(null);
  const searchRef = useRef(null);

  const navigate = useNavigate();

  // Get user email from Redux store
  const userEmail = useSelector((state) => state.auth.user?.email);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const toggleMobileDropdown = () => {
    setIsMobileDropdownOpen((prev) => !prev);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (userEmail) {
        try {
          const endpoint =
            role === "seller"
              ? `${API_URL}/api/auth/seller/user/${userEmail}`
              : `${API_URL}/api/auth/user/user/${userEmail}`;
          const userResponse = await axios.get(endpoint);

          // Assuming the response contains a country field
          setUserCountry(userResponse.data.country || "");

          // Get profile picture if available
          if (
            userResponse.data.profilePic &&
            userResponse.data.profilePic.length > 0 &&
            userResponse.data.profilePic[0].secure_url
          ) {
            setProfilePic(userResponse.data.profilePic[0].secure_url);
          } else {
            // Set default profile picture
            setProfilePic(
              "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            );
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          toast.error("Failed to fetch user data.");
          // Set default profile picture in case of error
          setProfilePic(
            "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
          );
        }
      } else {
        // Set default profile picture if no user email
        setProfilePic(
          "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
        );
      }
    };

    fetchUserData();
    const handleProfileUpdated = () => {
      fetchUserData(); // re-fetch when image is updated
    };

    window.addEventListener("profile-updated", handleProfileUpdated);

    return () => {
      window.removeEventListener("profile-updated", handleProfileUpdated);
    };
  }, [userEmail]);

  // Fetch all products and extract categories on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch products
        const productsResponse = await axios.get(`${API_URL}/api/products/`);

        // Filter products by 'Active' status
        const activeProducts = productsResponse.data.products
          ? productsResponse.data.products.filter(
              (product) => product.status === "Active"
            )
          : productsResponse.data.filter(
              (product) => product.status === "Active"
            );

        setAllProducts(activeProducts);

        // Extract unique categories from products
        const uniqueCategories = [];
        const categoryIds = new Set();

        activeProducts.forEach((product) => {
          // Check if category exists and is not already added
          if (
            product.category &&
            typeof product.category === "string" &&
            !categoryIds.has(product.category)
          ) {
            categoryIds.add(product.category);
            uniqueCategories.push({
              _id: product.category,
              name: "Category " + product.category.slice(0, 4), // Placeholder name
              status: "Active",
            });
          }
        });

        setAllCategories(uniqueCategories);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch data. Please try again later.");
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter suggestions based on search text
  const fetchSuggestions = (searchText) => {
    if (!searchText) {
      setSuggestions([]);
      return;
    }

    // First search in products
    let productSuggestions = allProducts
      .filter((product) =>
        product.name.toLowerCase().includes(searchText.toLowerCase())
      )
      .slice(0, 3)
      .map((product) => ({
        ...product,
        type: "product",
      }));

    // If there are fewer than 3 product results, add category results
    const remainingSlots = 5 - productSuggestions.length;

    let categorySuggestions = [];
    if (remainingSlots > 0) {
      categorySuggestions = allCategories
        .filter((category) =>
          category.name.toLowerCase().includes(searchText.toLowerCase())
        )
        .slice(0, remainingSlots)
        .map((category) => ({
          ...category,
          type: "category",
        }));
    }

    // Combine both types of suggestions
    const combinedSuggestions = [...productSuggestions, ...categorySuggestions];
    setSuggestions(combinedSuggestions);
  };

  // Debounce search to prevent excessive API calls
  const debouncedFetchSuggestions = useCallback(
    debounce(fetchSuggestions, 300),
    [allProducts, allCategories]
  );

  // Handle search input changes
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchText(value);
    setActiveSuggestionIndex(-1);
    debouncedFetchSuggestions(value);
  };

  // Handle keyboard navigation for search suggestions
  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveSuggestionIndex((prevIndex) =>
        prevIndex < suggestions.length - 1 ? prevIndex + 1 : prevIndex
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveSuggestionIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : 0
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      handleSearch(e);
    } else if (e.key === "Escape") {
      setSuggestions([]);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setSearchText("");
    setSuggestions([]);

    if (suggestion.type === "product") {
      navigate(`/posts/${suggestion._id}`);
    } else {
      navigate(`/category/${suggestion._id}`);
    }
  };

  // Handle search submission with cascading search
  const handleSearch = (e) => {
    if (e) e.preventDefault();

    const selectedSuggestion = suggestions[activeSuggestionIndex];

    if (selectedSuggestion) {
      setSearchText("");
      setSuggestions([]);

      if (selectedSuggestion.type === "product") {
        navigate(`/posts/${selectedSuggestion._id}`);
      } else {
        navigate(`/category/${selectedSuggestion._id}`);
      }
    } else if (searchText.trim()) {
      // First search in products
      const filteredProducts = allProducts.filter((product) =>
        product.name.toLowerCase().includes(searchText.toLowerCase())
      );

      if (filteredProducts.length > 0) {
        // If product found, navigate to it
        setSearchText("");
        setSuggestions([]);
        navigate(`/posts/${filteredProducts[0]._id}`);
      } else {
        // If no product found, search in categories
        const filteredCategories = allCategories.filter((category) =>
          category.name.toLowerCase().includes(searchText.toLowerCase())
        );

        if (filteredCategories.length > 0) {
          // If category found, navigate to it
          setSearchText("");
          setSuggestions([]);
          navigate(`/category/${filteredCategories[0]._id}`);
        } else {
          // If nothing found in either products or categories
          toast.error("No matching product or category found.");
        }
      }
    }
  };

  // Speech recognition functionality
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Speech recognition is not supported in your browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSearchText(transcript);
      debouncedFetchSuggestions(transcript);
    };
    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
      toast.error(
        "An error occurred during speech recognition. Please try again."
      );
    };
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (
        mobileDropdownRef.current &&
        !mobileDropdownRef.current.contains(event.target)
      ) {
        setIsMobileDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSuggestions([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const CATEGORIES = {
    "Collectibles & Antiques": [
      "Rare Coins & Currency",
      "Stamps & Philately",
      "Vintage Memorabilia",
      "Classic Art & Paintings",
      "Historical Artifacts",
      "Vintage Toys & Games",
      "Antique Furniture",
      "Vintage Postcards & Maps",
    ],
    "Electronics & Gadgets": [
      "Smartphones & Accessories",
      "Laptops & Computers",
      "Cameras & Lenses",
      "Gaming Consoles & Accessories",
      "Smart Wearables",
      "Vintage Electronics",
      "Audio Equipment",
      "Drones & Robotics",
    ],
    "Luxury & Fashion": [
      "Watches & Timepieces",
      "Designer Clothing & Shoes",
      "Handbags & Accessories",
      "Jewelry & Gemstones",
      "Luxury Sunglasses",
      "Rare Fashion Collectibles",
      "Limited Edition Sneakers",
      "Vintage Designer Pieces",
    ],
    "Automobiles & Accessories": [
      "Classic & Vintage Cars",
      "Luxury Cars",
      "Motorcycles & Bikes",
      "Car Accessories & Performance Parts",
      "Rare Auto Memorabilia",
      "Vintage Car Parts",
      "Racing Collectibles",
      "Automotive Art & Models",
    ],
    "Real Estate & Properties": [
      "Luxury Villas & Apartments",
      "Commercial Properties",
      "Land & Plots",
      "Auctioned Foreclosed Properties",
      "Rare Historic Buildings",
      "Investment Properties",
      "Undeveloped Land",
      "Unique Architectural Properties",
    ],
    "Sports & Memorabilia": [
      "Signed Jerseys & Merchandise",
      "Rare Sneakers",
      "Limited Edition Sporting Equipment",
      "Olympic & Championship Memorabilia",
      "Vintage Sports Cards",
      "Game-Used Equipment",
      "Athlete Autographs",
      "Sports Photography & Art",
    ],
    "Art & Handmade Crafts": [
      "Original Paintings & Sculptures",
      "Handcrafted Decor & Furniture",
      "NFTs & Digital Art",
      "Rare Artisan Crafts",
      "Vintage Craft Tools",
      "Handmade Jewelry",
      "Unique Ceramics & Pottery",
      "Limited Edition Art Prints",
    ],
    "Rare Books & Documents": [
      "First Editions & Signed Books",
      "Ancient Manuscripts & Documents",
      "Comic Books & Graphic Novels",
      "Rare Scientific Publications",
      "Vintage Maps & Atlases",
      "Autographed Literature",
      "Historical Newspapers",
      "Rare Academic Journals",
    ],
    "Industrial & Business Auctions": [
      "Heavy Machinery & Equipment",
      "Wholesale & Liquidation Stocks",
      "Restaurant & Hotel Equipment",
      "Manufacturing Surplus",
      "Office Furniture & Technology",
      "Construction Equipment",
      "Agricultural Machinery",
      "Industrial Inventory Liquidation",
    ],
    "Unique Experiences & Services": [
      "VIP Concert & Event Tickets",
      "Exclusive Travel Packages",
      "Meet & Greet with Celebrities",
      "Private Dining Experiences",
      "Luxury Retreat Packages",
      "Exclusive Workshop & Masterclasses",
      "Personal Training Sessions",
      "Private Guided Tours",
    ],
    "Collectible Technology": [
      "Vintage Computer Systems",
      "Rare Mobile Phones",
      "Classic Video Game Consoles",
      "Limited Edition Tech Gadgets",
      "Prototype Devices",
      "Vintage Computer Components",
      "Rare Software & Operating Systems",
      "Tech Memorabilia",
    ],
    "Musical Instruments & Equipment": [
      "Vintage Guitars",
      "Rare Musical Instruments",
      "Classic Amplifiers",
      "Signed Music Equipment",
      "Limited Edition Synthesizers",
      "Vintage Recording Equipment",
      "Collectible Drum Kits",
      "Rare Microphones",
    ],
    "Luxury Lifestyle": [
      "Fine Wines & Spirits",
      "Rare Whiskey & Bourbon",
      "Vintage Champagne",
      "Luxury Cigars",
      "Collectible Wine Accessories",
      "Rare Bar Equipment",
      "Limited Edition Decanters",
      "Vintage Cocktail Memorabilia",
    ],
  };

  return (
    <div
      className={`bg-white dark:bg-[#191919] fixed top-0 left-0 w-full z-50 border-b border-gray-200 dark:border-gray-600`}
    >
      <header className="bg-[#FCF8F1] dark:bg-[#191919] bg-opacity-30 dark:bg-opacity-100">
        {/* Constrain width for mobile and tablet */}
        <div className="px-4 mx-auto sm:px-6 sm:max-w-[90%] sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center">
                <img
                  className="w-auto h-8"
                  src="https://res.cloudinary.com/dszvpb3q5/image/upload/v1731178921/cifsfk5fzryh0iwp3fua.png"
                  alt="Logo"
                />
                {userCountry && (
                  <span className="ml-2 bg-yellow-100 dark:bg-yellow-200 text-yellow-800 dark:text-yellow-900 text-xs px-2 py-0.5 rounded">
                    {userCountry}
                  </span>
                )}
              </Link>
            </div>
            <div className="hidden lg:flex lg:items-center lg:justify-center lg:space-x-10 relative">
              <div
                onMouseEnter={() => setOpenCategory("Categories")}
                onMouseLeave={() => setOpenCategory(null)}
                className="relative group"
              >
                <div className="text-base cursor-pointer text-black dark:text-white group-hover:text-opacity-80">
                  Categories
                </div>
                <div
                  onMouseEnter={() => setOpenCategory("Categories")}
                  className={`absolute top-full left-[-380px] mt-3 w-[1400px] bg-white dark:bg-[#191919] shadow-lg rounded-lg border dark:border-gray-600 p-6 z-50 transition-all duration-300 ${
                    openCategory === "Categories"
                      ? "opacity-100 visible"
                      : "opacity-0 invisible"
                  }`}
                >
                  <div
                    className="grid grid-cols-6 gap-4 max-h-[500px] overflow-y-auto"
                    style={{
                      scrollbarWidth: "none",
                      msOverflowStyle: "none",
                    }}
                  >
                    {Object.entries(CATEGORIES).map(
                      ([category, subcategories]) => (
                        <div key={category} className="space-y-2">
                          <h4 className="font-bold text-sm text-gray-800 dark:text-gray-200 border-b dark:border-gray-600 pb-2 mb-2">
                            {category}
                          </h4>
                          <ul className="space-y-1">
                            {subcategories.map((subcategory) => (
                              <li
                                key={subcategory}
                                className="transition duration-200 ease-in-out"
                              >
                                <Link
                                  to={`/category/${subcategory.replace(
                                    /\s+/g,
                                    "-"
                                  )}`}
                                  className="text-sm text-gray-600 dark:text-gray-300 hover:text-yellow-600 dark:hover:text-yellow-400 hover:pl-1 block transition-all duration-200"
                                >
                                  {subcategory}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>

              <Link
                to="/bid"
                className="text-base text-black dark:text-white hover:text-opacity-80"
              >
                Bid an Item
              </Link>
              <Link
                to="/seller"
                className="hidden lg:inline-flex items-center px-5 py-2.5 text-black dark:text-white bg-yellow-300 dark:bg-yellow-400 rounded-full hover:bg-black dark:hover:bg-[#303030] hover:text-white dark:hover:text-white"
              >
                Become a Seller
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              {/* Updated Search Bar without Toggle */}
              <div className="hidden lg:block relative" ref={searchRef}>
                <form onSubmit={handleSearch} className="relative">
                  <div className="flex items-center bg-gray-100 dark:bg-gray-600 rounded-full px-4 py-2 space-x-2 transition-all duration-200 focus-within:ring-2 focus-within:ring-yellow-300 dark:focus-within:ring-yellow-400">
                    <input
                      type="text"
                      placeholder="Search products or categories..."
                      value={searchText}
                      onChange={handleSearchChange}
                      onKeyDown={handleKeyDown}
                      className="bg-transparent outline-none placeholder-gray-500 dark:placeholder-gray-300 text-sm w-64 transition-all duration-200 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={startListening}
                      className={`cursor-pointer p-2 bg-white dark:bg-gray-500 rounded-full text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-400 hover:text-gray-700 dark:hover:text-white transition duration-200 focus:outline-none flex items-center justify-center ${
                        isListening
                          ? "animate-pulse ring-2 ring-yellow-300 dark:ring-yellow-400"
                          : ""
                      }`}
                      title="Voice search"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        stroke="none"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M12 15c2.761 0 5-2.239 5-5V5a5 5 0 10-10 0v5c0 2.761 2.239 5 5 5z"></path>
                        <path d="M19 10v1a7 7 0 01-14 0v-1H3v1a9 9 0 009 9v3h2v-3a9 9 0 009-9v-1h-2z"></path>
                      </svg>
                    </button>
                    <button
                      type="submit"
                      className="cursor-pointer p-2 bg-black dark:bg-gray-500 rounded-full text-white dark:text-white hover:bg-yellow-300 dark:hover:bg-yellow-400 hover:text-black dark:hover:text-black transition duration-200 focus:outline-none"
                      title="Search"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </button>
                  </div>
                </form>

                {/* Search Suggestions with Type Badges */}
                {suggestions.length > 0 && (
                  <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-[#191919] rounded-lg shadow-lg z-50 border border-gray-100 dark:border-gray-600 max-h-64 overflow-y-auto">
                    {isLoading ? (
                      <div className="p-4 text-center text-gray-500 dark:text-gray-300">
                        Loading...
                      </div>
                    ) : (
                      <ul>
                        {suggestions.map((suggestion, index) => (
                          <li
                            key={suggestion._id || index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className={`px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-[#303030] transition-colors duration-150 flex items-center ${
                              index === activeSuggestionIndex
                                ? "bg-gray-100 dark:bg-gray-600"
                                : ""
                            }`}
                          >
                            <div className="flex-shrink-0 mr-3 bg-gray-200 dark:bg-gray-500 rounded-md w-8 h-8 flex items-center justify-center">
                              <svg
                                className="w-4 h-4 text-gray-600 dark:text-gray-300"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                              </svg>
                            </div>
                            <div className="flex-grow">
                              <div className="font-medium text-sm dark:text-white">
                                {suggestion.name}
                              </div>
                              {suggestion.type === "product" &&
                                suggestion.price && (
                                  <div className="text-xs text-gray-500 dark:text-gray-300">
                                    ${suggestion.price.toFixed(2)}
                                  </div>
                                )}
                            </div>
                            <span
                              className={`text-xs px-2 py-1 rounded ${
                                suggestion.type === "product"
                                  ? "bg-yellow-100 dark:bg-yellow-200 text-yellow-800 dark:text-yellow-900"
                                  : "bg-blue-100 dark:bg-blue-200 text-blue-800 dark:text-blue-900"
                              }`}
                            >
                              {suggestion.type === "product"
                                ? "Product"
                                : "Category"}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>

              {/* Sign In Button */}
              {!userEmail && (
                <Link
                  to="/login"
                  className="hidden lg:inline-flex items-center px-5 py-2.5 text-white dark:text-white bg-black dark:bg-gray-600 rounded-full hover:bg-yellow-300 dark:hover:bg-yellow-400 hover:text-black dark:hover:text-black"
                >
                  Sign In
                </Link>
              )}

              <div>
                <ThemeToggle />
              </div>

              {/* Profile Dropdown for Desktop */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  className="hidden lg:inline-flex items-center p-2 text-black dark:text-white bg-gray-100 dark:bg-gray-600 rounded-full hover:bg-gray-200 dark:hover:bg-gray-500 focus:outline-none cursor-pointer"
                  aria-expanded={isDropdownOpen}
                  aria-haspopup="true"
                >
                  <img
                    className="w-10 h-10 rounded-full object-cover"
                    src={profilePic}
                    alt="Profile"
                  />
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#191919] rounded-lg shadow-lg z-50 cursor-pointer border dark:border-gray-600">
                    <div className="py-2">
                      <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                        <h6>Sign In with</h6>
                        <h5 className="truncate text-gray-900 dark:text-white">
                          {userEmail || "Sign in to continue"}
                        </h5>
                      </div>
                      <ul className="flex flex-col">
                        <li className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#303030] truncate">
                          <Link to="/profile/myprofile">Profile</Link>
                        </li>
                        <li className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#303030] truncate">
                          <Link to="/orders">My Bids</Link>
                        </li>
                        <li className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#303030] truncate">
                          <Link to="/scheduledbids">Scheduled Bid</Link>
                        </li>
                        <li className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#303030] truncate">
                          <Link to="/balance">Add Money</Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={toggleMobileMenu}
                className="lg:hidden p-2 text-black dark:text-white focus:outline-none"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu Content */}
          {isMobileMenuOpen && (
            <div className="lg:hidden bg-white dark:bg-[#191919] shadow-lg mt-2 border-t dark:border-gray-600">
              <ul className="flex flex-col space-y-2 p-4">
                <li>
                  <Link
                    to="/category"
                    className="text-base text-black dark:text-white hover:text-opacity-80"
                  >
                    Categories
                  </Link>
                </li>
                <li>
                  <Link
                    to="/bid"
                    className="text-base text-black dark:text-white hover:text-opacity-80"
                  >
                    Bid an Item
                  </Link>
                </li>
                <li>
                  <Link
                    to="/sell"
                    className="inline-flex items-center px-5 py-2.5 text-black dark:text-black bg-yellow-300 dark:bg-yellow-400 rounded-full hover:bg-black dark:hover:bg-[#303030] hover:text-white dark:hover:text-white"
                  >
                    Become a Seller
                  </Link>
                </li>
                <li>
                  <Link
                    to="/login"
                    className="inline-flex items-center px-5 py-2.5 text-white dark:text-white bg-black dark:bg-gray-600 rounded-full hover:bg-yellow-300 dark:hover:bg-yellow-400 hover:text-black dark:hover:text-black"
                  >
                    Sign In
                  </Link>
                </li>

                {/* Profile Dropdown for Mobile */}
                <li>
                  <div className="relative" ref={mobileDropdownRef}>
                    <button
                      onClick={toggleMobileDropdown}
                      className="inline-flex items-center p-2 text-black dark:text-white bg-gray-100 dark:bg-gray-600 rounded-full hover:bg-gray-200 dark:hover:bg-gray-500 focus:outline-none cursor-pointer"
                      aria-expanded={isMobileDropdownOpen}
                      aria-haspopup="true"
                    >
                      <img
                        className="w-6 h-6 rounded-full object-cover"
                        src={profilePic}
                        alt="Profile"
                      />
                    </button>
                    {isMobileDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#191919] rounded-lg shadow-lg z-50 cursor-pointer border dark:border-gray-600">
                        <div className="py-2">
                          <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                            <h6>Sign In with</h6>
                            <h5 className="truncate text-gray-900 dark:text-white">
                              {userEmail || "Sign in to continue"}
                            </h5>
                          </div>
                          <ul className="flex flex-col">
                            <li className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#303030] truncate">
                              <Link to="/profile/myprofile">Profile</Link>
                            </li>
                            <li className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#303030] truncate">
                              <Link to="/orders">My Bids</Link>
                            </li>
                            <li className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#303030] truncate">
                              <Link to="/scheduledbids">Scheduled Bid</Link>
                            </li>
                            <li className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#303030] truncate">
                              <Link to="/balance">Add Money</Link>
                            </li>
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                </li>
              </ul>

              {/* Mobile Search Bar without Type Toggle */}
              <div className="p-4 relative" ref={searchRef}>
                <form onSubmit={handleSearch} className="relative">
                  <div className="flex items-center bg-gray-100 dark:bg-gray-600 rounded-full px-4 py-2 space-x-2 transition-all duration-200 focus-within:ring-2 focus-within:ring-yellow-300 dark:focus-within:ring-yellow-400">
                    <input
                      type="text"
                      placeholder="Search products or categories..."
                      value={searchText}
                      onChange={handleSearchChange}
                      onKeyDown={handleKeyDown}
                      className="bg-transparent outline-none placeholder-gray-500 dark:placeholder-gray-300 text-sm w-full transition-all duration-200 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={startListening}
                      className={`p-2 bg-white dark:bg-gray-500 rounded-full text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-400 hover:text-gray-700 dark:hover:text-white transition duration-200 focus:outline-none flex items-center justify-center ${
                        isListening
                          ? "animate-pulse ring-2 ring-yellow-300 dark:ring-yellow-400"
                          : ""
                      }`}
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        stroke="none"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M12 15c2.761 0 5-2.239 5-5V5a5 5 0 10-10 0v5c0 2.761 2.239 5 5 5z"></path>
                        <path d="M19 10v1a7 7 0 01-14 0v-1H3v1a9 9 0 009 9v3h2v-3a9 9 0 009-9v-1h-2z"></path>
                      </svg>
                    </button>
                    <button
                      type="submit"
                      className="p-2 bg-black dark:bg-gray-500 rounded-full text-white dark:text-white hover:bg-yellow-300 dark:hover:bg-yellow-400 hover:text-black dark:hover:text-black transition duration-200 focus:outline-none"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </button>
                  </div>
                </form>

                {/* Mobile Search Suggestions */}
                {suggestions.length > 0 && (
                  <div className="absolute left-4 right-4 mt-2 bg-white dark:bg-[#191919] rounded-lg shadow-lg z-50 border border-gray-100 dark:border-gray-600 max-h-64 overflow-y-auto">
                    {isLoading ? (
                      <div className="p-4 text-center text-gray-500 dark:text-gray-300">
                        Loading...
                      </div>
                    ) : (
                      <ul>
                        {suggestions.map((suggestion, index) => (
                          <li
                            key={suggestion._id || index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className={`px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-[#303030] transition-colors duration-150 flex items-center ${
                              index === activeSuggestionIndex
                                ? "bg-gray-100 dark:bg-gray-600"
                                : ""
                            }`}
                          >
                            <div className="flex-shrink-0 mr-3 bg-gray-200 dark:bg-gray-500 rounded-md w-8 h-8 flex items-center justify-center">
                              <svg
                                className="w-4 h-4 text-gray-600 dark:text-gray-300"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                              </svg>
                            </div>
                            <div className="flex-grow">
                              <div className="font-medium text-sm dark:text-white">
                                {suggestion.name}
                              </div>
                              {suggestion.type === "product" &&
                                suggestion.price && (
                                  <div className="text-xs text-gray-500 dark:text-gray-300">
                                    ${suggestion.price.toFixed(2)}
                                  </div>
                                )}
                            </div>
                            <span
                              className={`text-xs px-2 py-1 rounded ${
                                suggestion.type === "product"
                                  ? "bg-yellow-100 dark:bg-yellow-200 text-yellow-800 dark:text-yellow-900"
                                  : "bg-blue-100 dark:bg-blue-200 text-blue-800 dark:text-blue-900"
                              }`}
                            >
                              {suggestion.type === "product"
                                ? "Product"
                                : "Category"}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </header>
    </div>
  );
};

export default Navbar;
