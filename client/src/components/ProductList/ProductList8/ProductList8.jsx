import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ImPriceTags } from "react-icons/im";
import PopupModal from "../../Modals/PopupModal/PopupModal";
import ReactDOM from "react-dom";
import { useThemeProvider } from "../../AdminDashboard/utils/ThemeContext"; // Adjust the path as needed

// Skeleton Component - Updated for dark mode
const ProductSkeleton = () => {
  return (
    <div className="bg-gray-100 dark:bg-gray-800 backdrop-blur-lg rounded-2xl p-4 m-2 w-48 text-center flex-shrink-0 overflow-hidden">
      <div className="w-full h-44 bg-gray-300 dark:bg-gray-700 animate-pulse rounded-2xl mb-2"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-700 animate-pulse rounded w-3/4 mx-auto mb-2"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-700 animate-pulse rounded w-1/2 mx-auto mb-2"></div>
      <div className="h-10 bg-gray-300 dark:bg-gray-700 animate-pulse rounded-2xl w-full mt-2"></div>
    </div>
  );
};

const ProductList8 = () => {
  const productListRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [displayCount, setDisplayCount] = useState(7);
  const [category, setCategory] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { currentTheme } = useThemeProvider(); // Get current theme
  const API_URL = import.meta.env.VITE_API_URL;

  const handleOpenPopup = (productId) => {
    const product = products.find((p) => p._id === productId);
    setSelectedProduct(product);
  };

  const handleClosePopup = () => {
    setSelectedProduct(null);
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/products/`);
      const productsArray = response.data.products || [];
      const activeProducts = productsArray.filter(
        (product) => product.status === "Active"
      );
      const filteredProducts = category
        ? activeProducts.filter((product) => product.category === category)
        : activeProducts;
      const shuffledProducts = shuffleArray(filteredProducts);
      setProducts(shuffledProducts.slice(0, 20));
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  useEffect(() => {
    fetchProducts();
  }, [category]);

  const scroll = (direction) => {
    const { current } = productListRef;
    if (current) {
      const scrollAmount =
        direction === "left" ? -current.clientWidth : current.clientWidth;
      current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const loadMoreProducts = () => {
    setDisplayCount((prevCount) => Math.min(prevCount + 7, products.length));
  };

  return (
    <div
      className={`flex items-center p-5 relative w-full rounded-2xl shadow-lg ${
        currentTheme === "dark" ? "bg-[#191919]" : "bg-white"
      }`}
    >
      {/* Left Scroll Button */}
      <button
        className={`text-2xl cursor-pointer absolute top-1/2 -translate-y-1/2 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 left-5 z-2 ${
          currentTheme === "dark"
            ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
            : "bg-gray-800 text-white hover:bg-gray-700"
        }`}
        onClick={() => scroll("left")}
      >
        ❮
      </button>

      {/* Product List */}
      <div
        className="flex gap-5 overflow-x-auto scrollbar-hide flex-nowrap w-full"
        ref={productListRef}
      >
        {isLoading ? (
          // Display Skeleton Loading State
          Array.from({ length: displayCount }).map((_, index) => (
            <ProductSkeleton key={index} />
          ))
        ) : products.length === 0 ? (
          <p
            className={`text-lg text-center w-full p-5 rounded-2xl ${
              currentTheme === "dark"
                ? "bg-gray-800 text-gray-300"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            No products yet.
          </p>
        ) : (
          products.slice(0, displayCount).map((product) => (
            <div
              key={product._id}
              className={`backdrop-blur-lg rounded-2xl p-4 m-2 w-48 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-md flex-shrink-0 overflow-hidden ${
                currentTheme === "dark"
                  ? "bg-gray-800 hover:shadow-gray-700"
                  : "bg-gray-100 hover:shadow-gray-300"
              }`}
            >
              <img
                src={product.images[0]?.secure_url}
                alt={product.name}
                className="w-full h-44 object-cover rounded-2xl mb-2"
              />
              <p
                className={`font-bold text-sm truncate ${
                  currentTheme === "dark" ? "text-gray-200" : "text-gray-800"
                }`}
              >
                {product.name}
              </p>
              <p
                className={`text-sm flex items-center justify-center gap-1 truncate ${
                  currentTheme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                <ImPriceTags /> ₹{product.biddingStartPrice}
              </p>
              <button
                className={`text-sm font-bold py-2 px-4 rounded-2xl w-full mt-2 shadow-md transition-all duration-200 hover:scale-105 ${
                  currentTheme === "dark"
                    ? "bg-blue-700 text-white hover:bg-blue-600"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
                onClick={() => handleOpenPopup(product._id)}
              >
                Bid Now
              </button>
            </div>
          ))
        )}
      </div>

      {/* Right Scroll Button */}
      <button
        className={`text-2xl cursor-pointer absolute top-1/2 -translate-y-1/2 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 right-5 z-2 ${
          currentTheme === "dark"
            ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
            : "bg-gray-800 text-white hover:bg-gray-700"
        }`}
        onClick={() => {
          scroll("right");
          loadMoreProducts();
        }}
      >
        ❯
      </button>

      {/* Popup */}
      {selectedProduct &&
        ReactDOM.createPortal(
          <PopupModal product={selectedProduct} onClose={handleClosePopup} />,
          document.body
        )}
    </div>
  );
};

export default ProductList8;
