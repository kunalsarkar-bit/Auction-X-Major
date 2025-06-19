import React, { useState, useEffect } from "react";
import SpotifyEmbed from "../../../SpotifyEmbed/SpotifyEmbed";
import axios from "axios";

const FanbookPage = () => {
  const [activeTab, setActiveTab] = useState("featured");
  const [scrollPosition, setScrollPosition] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;

  // Sample playlist data (keeping as is per your request)
  const playlists = [
    {
      id: 1,
      name: "Auction X Store Vibes",
      description: "The soundtrack to our physical stores",
      image:
        "https://i1.sndcdn.com/artworks-8TPHyl9TJ4u0Xt1z-PFUArQ-t500x500.jpg",
      songs: [
        { title: "Retro Wave", artist: "Neon Dreams" },
        { title: "Urban Pulse", artist: "City Lights" },
        { title: "Vintage Groove", artist: "The Collectors" },
      ],
    },
    {
      id: 2,
      name: "New Collection Energy",
      description: "Tracks that inspired our latest designs",
      image:
        "https://i1.sndcdn.com/artworks-8TPHyl9TJ4u0Xt1z-PFUArQ-t500x500.jpg",
      songs: [
        { title: "Fashion Forward", artist: "Trend Setters" },
        { title: "Runway Ready", artist: "Model Behavior" },
        { title: "Design Process", artist: "Creative Flow" },
      ],
    },
  ];

  // Fetch products from the API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/api/goodies/`);

        // Transform the backend data to match our component's expected format
        const transformedProducts = response.data.map((item) => ({
          id: item._id,
          name: item.name,
          price: `$${item.price.toFixed(2)}`,
          description: item.description,
          image:
            item.images[0] ||
            "https://res.cloudinary.com/dszvpb3q5/image/upload/v1742673771/cws3gkgelerpbhroxrnk.png", // Use first image or fallback
          trending: item.stock < 10, // Assume low stock items are trending
          category: item.category.toLowerCase(),
        }));

        setProducts(transformedProducts);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again later.");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const filteredProducts =
    activeTab === "featured"
      ? products
      : activeTab === "trending"
      ? products.filter((product) => product.trending)
      : products.filter((product) => product.category === activeTab);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:bg-[#191919]">
      {/* Header */}
      <header
        className="sticky top-0 z-10 bg-white dark:bg-[#303030] shadow-md transition-all duration-300"
        style={{
          height: scrollPosition > 100 ? "60px" : "80px",
          opacity: scrollPosition > 500 ? 0.9 : 1,
        }}
      >
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              Auction X
            </h1>
            <span className="ml-2 text-lg font-light text-gray-600 dark:text-gray-300">
              Fanbook
            </span>
          </div>
          <nav className="hidden md:flex space-x-6">
            <a
              href="#products"
              className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              T-Shirts
            </a>
            <a
              href="#music"
              className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Music
            </a>
            <a
              href="#about"
              className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              About
            </a>
          </nav>
          <div className="flex items-center space-x-4">
            <button className="rounded-full bg-gray-100 dark:bg-gray-700 p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
            <button className="rounded-full bg-gray-100 dark:bg-gray-700 p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-96 overflow-hidden">
        <div className="absolute inset-0 bg-indigo-900 opacity-50"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src="/api/placeholder/1200/600"
            alt="Collection Cover"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
          <h2
            className="text-4xl md:text-6xl font-bold mb-4"
            style={{
              transform: `translateY(-${scrollPosition * 0.2}px)`,
              opacity: 1 - scrollPosition * 0.003,
            }}
          >
            Spring Collection 2025
          </h2>
          <p
            className="text-xl md:text-2xl max-w-2xl"
            style={{
              transform: `translateY(-${scrollPosition * 0.1}px)`,
              opacity: 1 - scrollPosition * 0.003,
            }}
          >
            Explore our latest T-shirt designs while listening to curated
            playlists
          </p>
          <button className="mt-8 px-8 py-3 bg-white  text-indigo-700 dark:text-indigo-400 font-semibold rounded-full hover:bg-opacity-90 dark:hover:bg-opacity-80 transition-all transform hover:scale-105">
            Shop Now
          </button>
        </div>
      </section>

      {/* T-shirt Collection */}
      <section id="products" className="py-16 bg-white dark:bg-[#191919]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">
            Our T-Shirt Collection
          </h2>

          {/* Tabs */}
          <div className="flex flex-wrap justify-center mb-12 space-x-2 space-y-2 md:space-y-0">
            <button
              onClick={() => setActiveTab("featured")}
              className={`px-6 py-2 rounded-full ${
                activeTab === "featured"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              } transition-colors`}
            >
              Featured
            </button>
            <button
              onClick={() => setActiveTab("trending")}
              className={`px-6 py-2 rounded-full ${
                activeTab === "trending"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              } transition-colors`}
            >
              Trending
            </button>
            <button
              onClick={() => setActiveTab("graphic")}
              className={`px-6 py-2 rounded-full ${
                activeTab === "graphic"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              } transition-colors`}
            >
              Graphic
            </button>
            <button
              onClick={() => setActiveTab("streetwear")}
              className={`px-6 py-2 rounded-full ${
                activeTab === "streetwear"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              } transition-colors`}
            >
              Streetwear
            </button>
          </div>

          {/* Loading and Error States */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
            </div>
          )}

          {error && (
            <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 p-4 rounded-md text-center max-w-md mx-auto">
              {error}
            </div>
          )}

          {/* Products Grid */}
          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white dark:bg-[#303030] rounded-lg overflow-hidden shadow-lg hover:shadow-xl dark:shadow-gray-500 dark:hover:shadow-gray-300 transition-shadow group"
                  >
                    <div className="h-80 overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/api/placeholder/400/400";
                        }}
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-semibold dark:text-white">
                          {product.name}
                        </h3>
                        <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                          {product.price}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        {product.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <button className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors">
                          Add to Cart
                        </button>
                        {product.trending && (
                          <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full text-xs font-semibold">
                            Trending
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-10">
                  <p className="text-gray-500 dark:text-gray-400">
                    No products found in this category.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Music Section - SpotifyEmbedded Component */}
      <section
        id="music"
        className="py-16 bg-white dark:bg-[#191919] text-gray-900 dark:text-white"
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Our Soundtrack
          </h2>
          <div className="mb-10">
            <SpotifyEmbed />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {playlists.map((playlist) => (
              <div
                key={playlist.id}
                className="bg-gray-100 dark:bg-[#303030] rounded-lg overflow-hidden"
              >
                <div className="p-6 flex space-x-4">
                  <div className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0">
                    <img
                      src={playlist.image}
                      alt={playlist.name}
                      className="w-full h-full object-cover rounded-xl"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/api/placeholder/128/128";
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                      {playlist.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {playlist.description}
                    </p>

                    <div className="space-y-2">
                      {playlist.songs.map((song, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-3 p-2 hover:bg-gray-200 dark:hover:bg-[#191919] rounded transition-colors"
                        >
                          <button className="w-8 h-8 flex items-center justify-center rounded-full bg-indigo-600 hover:bg-indigo-500 transition-colors">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polygon points="5 3 19 12 5 21 5 3"></polygon>
                            </svg>
                          </button>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {song.title}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {song.artist}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Follow our complete playlists on Spotify
            </p>
            <a
              href="https://open.spotify.com/playlist/5WToK4EWSLTg7V5lYZQEUX?si=YEs8LFAzR-ONbJENBiQ3uA"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors">
                Follow on Spotify
              </button>
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-white dark:bg-[#191919]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center bg-gray-100 dark:bg-[#303030] rounded-lg p-8">
            <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
              About Auction X
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Auction X is more than just a T-shirt brand. We're a lifestyle, a
              movement, a community of creative individuals who express
              themselves through fashion and music. Our designs are inspired by
              the rhythms and melodies that move us.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="px-6 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors">
                Our Story
              </button>
              <button className="px-6 py-3 border border-indigo-600 text-indigo-600 dark:text-indigo-400 rounded-full hover:bg-indigo-600 hover:text-white transition-colors">
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-12 bg-indigo-100 dark:bg-[#191919]">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white dark:bg-[#303030] rounded-lg p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="md:w-1/2">
                <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                  Stay in the Loop
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Subscribe to our newsletter for exclusive offers, new
                  releases, and playlists.
                </p>
              </div>
              <div className="md:w-1/2">
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="flex-1 px-4 py-3 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-gray-50 dark:bg-[#191919] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border border-gray-300 dark:border-gray-600"
                  />
                  <button className="px-6 py-3 bg-indigo-600 text-white rounded-r-lg hover:bg-indigo-700 transition-colors">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FanbookPage;
