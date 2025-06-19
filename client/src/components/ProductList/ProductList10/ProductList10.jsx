import React, { useState, useEffect } from "react";
import { useThemeProvider } from "../../AdminDashboard/utils/ThemeContext"; // Adjust the import path as needed

const ProductList = () => {
  const { currentTheme } = useThemeProvider();
  const [products, setProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(true);
  const [partialLoading, setPartialLoading] = useState({});
  const productsPerPage = 7;
  const API_URL = import.meta.env.VITE_API_URL;

  // Helper function to randomize array
  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Initialize timers (placeholder for your timer logic)
  const initializeTimers = (products) => {
    // console.log("Initializing timers for", products.length, "products");
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/api/products/`);
        const data = await response.json();

        const productsArray = data.products || [];
        const activeProducts = productsArray.filter(
          (product) => product.status === "Active"
        );

        if (activeProducts.length === 0) {
          console.log("No active products found");
        }

        const initialPartialLoading = {};
        activeProducts.forEach((product) => {
          initialPartialLoading[product._id] = true;
        });
        setPartialLoading(initialPartialLoading);

        const randomizedData = shuffleArray(activeProducts);
        setProducts(randomizedData);
        setDisplayedProducts(randomizedData.slice(0, productsPerPage));
        setIsFetching(false);
        setLoading(false);

        randomizedData.slice(0, productsPerPage).forEach((product, index) => {
          setTimeout(() => {
            setPartialLoading((prev) => ({
              ...prev,
              [product._id]: false,
            }));
          }, 500 + index * 300);
        });

        initializeTimers(randomizedData);
      } catch (error) {
        console.error("Error fetching products:", error);
        setIsFetching(false);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Skeleton Loader Component with dark mode support
  const SkeletonLoader = () => (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 lg:grid-rows-5 gap-4 p-4 min-h-screen ${
        currentTheme === "dark" ? "bg-[#191919]" : "bg-gray-100"
      }`}
    >
      {/* Skeleton for Product 1 */}
      <div
        className={`lg:col-span-2 lg:row-span-5 shadow-lg rounded-lg animate-pulse ${
          currentTheme === "dark" ? "bg-gray-700" : "bg-gray-300"
        }`}
      ></div>

      {/* Skeleton for Product 2 */}
      <div
        className={`lg:col-start-3 lg:row-span-3 shadow-lg rounded-lg animate-pulse ${
          currentTheme === "dark" ? "bg-gray-700" : "bg-gray-300"
        }`}
      ></div>

      {/* Skeleton for Product 3 */}
      <div
        className={`lg:col-start-4 lg:row-span-2 shadow-lg rounded-lg animate-pulse ${
          currentTheme === "dark" ? "bg-gray-700" : "bg-gray-300"
        }`}
      ></div>

      {/* Skeleton for Product 4 */}
      <div
        className={`lg:col-start-5 lg:row-span-3 shadow-lg rounded-lg animate-pulse ${
          currentTheme === "dark" ? "bg-gray-700" : "bg-gray-300"
        }`}
      ></div>

      {/* Skeleton for Product 5 */}
      <div
        className={`lg:col-start-3 lg:row-start-4 lg:row-span-2 shadow-lg rounded-lg animate-pulse ${
          currentTheme === "dark" ? "bg-gray-700" : "bg-gray-300"
        }`}
      ></div>

      {/* Skeleton for Product 6 */}
      <div
        className={`lg:col-start-4 lg:row-start-3 lg:row-span-3 shadow-lg rounded-lg animate-pulse ${
          currentTheme === "dark" ? "bg-gray-700" : "bg-gray-300"
        }`}
      ></div>

      {/* Skeleton for Product 7 */}
      <div
        className={`lg:col-start-5 lg:row-start-4 lg:row-span-2 shadow-lg rounded-lg animate-pulse ${
          currentTheme === "dark" ? "bg-gray-700" : "bg-gray-300"
        }`}
      ></div>
    </div>
  );

  // Individual product skeleton with dark mode support
  const ProductSkeleton = ({ className }) => (
    <div
      className={`${className} shadow-lg rounded-lg animate-pulse ${
        currentTheme === "dark" ? "bg-gray-700" : "bg-gray-300"
      }`}
    ></div>
  );

  if (loading) {
    return <SkeletonLoader />;
  }

  // Handle case when no products are found with dark mode support
  if (displayedProducts.length === 0) {
    return (
      <div
        className={`flex justify-center items-center h-screen ${
          currentTheme === "dark" ? "bg-[#191919]" : "bg-gray-100"
        }`}
      >
        <div
          className={`text-center p-8 rounded-lg shadow-lg ${
            currentTheme === "dark"
              ? "bg-gray-800 text-gray-200"
              : "bg-white text-gray-800"
          }`}
        >
          <h2 className="text-xl font-bold">No products available</h2>
          <p className="mt-2">Check back later for new items</p>
        </div>
      </div>
    );
  }

  // Helper function to get the primary image URL
  const getProductImage = (product) => {
    if (
      product.hasBanner &&
      product.bannerImage &&
      product.bannerImage.secure_url
    ) {
      return product.bannerImage.secure_url;
    } else if (
      product.images &&
      product.images.length > 0 &&
      product.images[0].secure_url
    ) {
      return product.images[0].secure_url;
    }
    return "https://res.cloudinary.com/dszvpb3q5/image/upload/v1743180239/ave3utbydiwk7bkmalxa.jpg";
  };

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 lg:grid-rows-5 gap-4 p-4 min-h-screen ${
        currentTheme === "dark" ? "bg-[#191919]" : "bg-gray-100"
      }`}
    >
      {/* Product 1 */}
      {displayedProducts[0] ? (
        partialLoading[displayedProducts[0]._id] ? (
          <ProductSkeleton className="lg:col-span-2 lg:row-span-5" />
        ) : (
          <div
            className={`lg:col-span-2 lg:row-span-5 shadow-lg rounded-lg relative overflow-hidden ${
              currentTheme === "dark" ? "bg-gray-800" : "bg-white"
            }`}
          >
            <img
              src={getProductImage(displayedProducts[0])}
              alt={displayedProducts[0].name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://res.cloudinary.com/dszvpb3q5/image/upload/v1743180239/ave3utbydiwk7bkmalxa.jpg";
              }}
            />
            <div
              className={`absolute inset-x-0 bottom-0 bg-gradient-to-t ${
                currentTheme === "dark"
                  ? "from-gray-800 to-transparent text-gray-200"
                  : "from-white to-transparent text-gray-800"
              } h-32 flex flex-col justify-end p-4`}
            >
              <h2 className="text-lg font-bold">{displayedProducts[0].name}</h2>
              <p>₹{displayedProducts[0].biddingStartPrice.toLocaleString()}</p>
            </div>
          </div>
        )
      ) : (
        <ProductSkeleton className="lg:col-span-2 lg:row-span-5" />
      )}

      {/* Product 2 */}
      {displayedProducts[1] ? (
        partialLoading[displayedProducts[1]._id] ? (
          <ProductSkeleton className="lg:col-start-3 lg:row-span-3" />
        ) : (
          <div
            className={`lg:col-start-3 lg:row-span-3 shadow-lg rounded-lg relative overflow-hidden ${
              currentTheme === "dark" ? "bg-gray-800" : "bg-white"
            }`}
          >
            <img
              src={getProductImage(displayedProducts[1])}
              alt={displayedProducts[1].name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://res.cloudinary.com/dszvpb3q5/image/upload/v1743180239/ave3utbydiwk7bkmalxa.jpg";
              }}
            />
            <div
              className={`absolute inset-x-0 bottom-0 bg-gradient-to-t ${
                currentTheme === "dark"
                  ? "from-gray-800 to-transparent text-gray-200"
                  : "from-white to-transparent text-gray-800"
              } h-32 flex flex-col justify-end p-4`}
            >
              <h2 className="text-lg font-bold">{displayedProducts[1].name}</h2>
              <p>₹{displayedProducts[1].biddingStartPrice.toLocaleString()}</p>
            </div>
          </div>
        )
      ) : (
        <ProductSkeleton className="lg:col-start-3 lg:row-span-3" />
      )}

      {/* Product 3 */}
      {displayedProducts[2] ? (
        partialLoading[displayedProducts[2]._id] ? (
          <ProductSkeleton className="lg:col-start-4 lg:row-span-2" />
        ) : (
          <div
            className={`lg:col-start-4 lg:row-span-2 shadow-lg rounded-lg relative overflow-hidden ${
              currentTheme === "dark" ? "bg-gray-800" : "bg-white"
            }`}
          >
            <img
              src={getProductImage(displayedProducts[2])}
              alt={displayedProducts[2].name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://res.cloudinary.com/dszvpb3q5/image/upload/v1743180239/ave3utbydiwk7bkmalxa.jpg";
              }}
            />
            <div
              className={`absolute inset-x-0 bottom-0 bg-gradient-to-t ${
                currentTheme === "dark"
                  ? "from-gray-800 to-transparent text-gray-200"
                  : "from-white to-transparent text-gray-800"
              } h-32 flex flex-col justify-end p-4`}
            >
              <h2 className="text-lg font-bold">{displayedProducts[2].name}</h2>
              <p>₹{displayedProducts[2].biddingStartPrice.toLocaleString()}</p>
            </div>
          </div>
        )
      ) : (
        <ProductSkeleton className="lg:col-start-4 lg:row-span-2" />
      )}

      {/* Product 4 */}
      {displayedProducts[3] ? (
        partialLoading[displayedProducts[3]._id] ? (
          <ProductSkeleton className="lg:col-start-5 lg:row-span-3" />
        ) : (
          <div
            className={`lg:col-start-5 lg:row-span-3 shadow-lg rounded-lg relative overflow-hidden ${
              currentTheme === "dark" ? "bg-gray-800" : "bg-white"
            }`}
          >
            <img
              src={getProductImage(displayedProducts[3])}
              alt={displayedProducts[3].name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://res.cloudinary.com/dszvpb3q5/image/upload/v1743180239/ave3utbydiwk7bkmalxa.jpg";
              }}
            />
            <div
              className={`absolute inset-x-0 bottom-0 bg-gradient-to-t ${
                currentTheme === "dark"
                  ? "from-gray-800 to-transparent text-gray-200"
                  : "from-white to-transparent text-gray-800"
              } h-32 flex flex-col justify-end p-4`}
            >
              <h2 className="text-lg font-bold">{displayedProducts[3].name}</h2>
              <p>₹{displayedProducts[3].biddingStartPrice.toLocaleString()}</p>
            </div>
          </div>
        )
      ) : (
        <ProductSkeleton className="lg:col-start-5 lg:row-span-3" />
      )}

      {/* Product 5 */}
      {displayedProducts[4] ? (
        partialLoading[displayedProducts[4]._id] ? (
          <ProductSkeleton className="lg:col-start-3 lg:row-start-4 lg:row-span-2" />
        ) : (
          <div
            className={`lg:col-start-3 lg:row-start-4 lg:row-span-2 shadow-lg rounded-lg relative overflow-hidden ${
              currentTheme === "dark" ? "bg-gray-800" : "bg-white"
            }`}
          >
            <img
              src={getProductImage(displayedProducts[4])}
              alt={displayedProducts[4].name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://res.cloudinary.com/dszvpb3q5/image/upload/v1743180239/ave3utbydiwk7bkmalxa.jpg";
              }}
            />
            <div
              className={`absolute inset-x-0 bottom-0 bg-gradient-to-t ${
                currentTheme === "dark"
                  ? "from-gray-800 to-transparent text-gray-200"
                  : "from-white to-transparent text-gray-800"
              } h-32 flex flex-col justify-end p-4`}
            >
              <h2 className="text-lg font-bold">{displayedProducts[4].name}</h2>
              <p>₹{displayedProducts[4].biddingStartPrice.toLocaleString()}</p>
            </div>
          </div>
        )
      ) : (
        <ProductSkeleton className="lg:col-start-3 lg:row-start-4 lg:row-span-2" />
      )}

      {/* Product 6 */}
      {displayedProducts[5] ? (
        partialLoading[displayedProducts[5]._id] ? (
          <ProductSkeleton className="lg:col-start-4 lg:row-start-3 lg:row-span-3" />
        ) : (
          <div
            className={`lg:col-start-4 lg:row-start-3 lg:row-span-3 shadow-lg rounded-lg relative overflow-hidden ${
              currentTheme === "dark" ? "bg-gray-800" : "bg-white"
            }`}
          >
            <img
              src={getProductImage(displayedProducts[5])}
              alt={displayedProducts[5].name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://res.cloudinary.com/dszvpb3q5/image/upload/v1743180239/ave3utbydiwk7bkmalxa.jpg";
              }}
            />
            <div
              className={`absolute inset-x-0 bottom-0 bg-gradient-to-t ${
                currentTheme === "dark"
                  ? "from-gray-800 to-transparent text-gray-200"
                  : "from-white to-transparent text-gray-800"
              } h-32 flex flex-col justify-end p-4`}
            >
              <h2 className="text-lg font-bold">{displayedProducts[5].name}</h2>
              <p>₹{displayedProducts[5].biddingStartPrice.toLocaleString()}</p>
            </div>
          </div>
        )
      ) : (
        <ProductSkeleton className="lg:col-start-4 lg:row-start-3 lg:row-span-3" />
      )}

      {/* Product 7 */}
      {displayedProducts[6] ? (
        partialLoading[displayedProducts[6]._id] ? (
          <ProductSkeleton className="lg:col-start-5 lg:row-start-4 lg:row-span-2" />
        ) : (
          <div
            className={`lg:col-start-5 lg:row-start-4 lg:row-span-2 shadow-lg rounded-lg relative overflow-hidden ${
              currentTheme === "dark" ? "bg-gray-800" : "bg-white"
            }`}
          >
            <img
              src={getProductImage(displayedProducts[6])}
              alt={displayedProducts[6].name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://res.cloudinary.com/dszvpb3q5/image/upload/v1743180239/ave3utbydiwk7bkmalxa.jpg";
              }}
            />
            <div
              className={`absolute inset-x-0 bottom-0 bg-gradient-to-t ${
                currentTheme === "dark"
                  ? "from-gray-800 to-transparent text-gray-200"
                  : "from-white to-transparent text-gray-800"
              } h-32 flex flex-col justify-end p-4`}
            >
              <h2 className="text-lg font-bold">{displayedProducts[6].name}</h2>
              <p>₹{displayedProducts[6].biddingStartPrice.toLocaleString()}</p>
            </div>
          </div>
        )
      ) : (
        <ProductSkeleton className="lg:col-start-5 lg:row-start-4 lg:row-span-2" />
      )}
    </div>
  );
};

export default ProductList;
