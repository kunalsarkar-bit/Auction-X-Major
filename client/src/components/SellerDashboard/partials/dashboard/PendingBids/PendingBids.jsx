import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import {
  Edit3,
  Trash2,
  Clock,
  Mail,
  Phone,
  Tag,
  DollarSign,
  Package,
} from "lucide-react";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "https://localhost:5000/api";

const api = {
  getListingsByEmail: async (email) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/email/${email}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        signal: AbortSignal.timeout(10000),
      });

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) {
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      if (error.name === "AbortError") {
        throw new Error(
          "Request timeout. Please check your connection and try again."
        );
      } else if (
        error.name === "TypeError" &&
        error.message.includes("Failed to fetch")
      ) {
        throw new Error(
          "Unable to connect to server. Please check if the server is running."
        );
      }
      throw error;
    }
  },

  deleteListing: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        signal: AbortSignal.timeout(10000),
      });

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) {
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return await response.json();
      }
      return { success: true };
    } catch (error) {
      if (error.name === "AbortError") {
        throw new Error("Request timeout. Please try again.");
      } else if (
        error.name === "TypeError" &&
        error.message.includes("Failed to fetch")
      ) {
        throw new Error(
          "Unable to connect to server. Please check if the server is running."
        );
      }
      throw error;
    }
  },
};

const SellerHistoryPage = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const { user, isAuthenticated } = useSelector((state) => state.auth);

  // Helper function to format description properly
  const formatDescription = (description) => {
    if (!description) return "No description available";

    // If it's already a string and looks normal, return it
    if (
      typeof description === "string" &&
      !description.startsWith("[") &&
      !description.startsWith("{")
    ) {
      return description;
    }

    // Try to parse if it's JSON
    try {
      const parsed =
        typeof description === "string" ? JSON.parse(description) : description;

      // If it's an array of objects with name/description pairs
      if (Array.isArray(parsed)) {
        return parsed
          .map((item) => {
            if (item.name && item.description) {
              return `${item.name}: ${item.description}`;
            } else if (item.name) {
              return item.name;
            } else if (typeof item === "string") {
              return item;
            }
            return "";
          })
          .filter(Boolean)
          .join(", ");
      }

      // If it's an object, try to extract meaningful text
      if (typeof parsed === "object") {
        const values = Object.values(parsed).filter(
          (v) => typeof v === "string" && v.length > 0
        );
        return values.length > 0
          ? values.join(", ")
          : "No description available";
      }

      return String(parsed);
    } catch (e) {
      // If parsing fails, clean up the string representation
      const cleanString = String(description)
        .replace(/^\[|\]$/g, "") // Remove brackets
        .replace(/^\{|\}$/g, "") // Remove braces
        .replace(/"/g, "") // Remove quotes
        .replace(/_id:[^,}]+,?/g, "") // Remove _id fields
        .replace(/,\s*$/, "") // Remove trailing comma
        .replace(/\s+/g, " ") // Normalize whitespace
        .trim();

      return cleanString || "No description available";
    }
  };

  // Helper function to format the title properly
  const formatTitle = (name) => {
    if (!name) return "Untitled Listing";

    // If the name is all caps or looks weird, format it properly
    if (name === name.toUpperCase() && name.length > 5) {
      return name
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    }

    return name;
  };

  useEffect(() => {
    const fetchListings = async () => {
      // Wait until user data is properly loaded
      if (isAuthenticated && !user) {
        return;
      }

      if (!isAuthenticated || !user?.email) {
        setError(
          "Authentication required. Please log in to view your listings."
        );
        setLoading(false);
        return;
      }

      try {
        setError(null);
        const data = await api.getListingsByEmail(user.email);

        let listingsArray = [];
        if (Array.isArray(data)) {
          listingsArray = data;
        } else if (data?.products) {
          listingsArray = data.products;
        } else if (data?.listings) {
          listingsArray = data.listings;
        } else if (data?.data) {
          listingsArray = data.data;
        } else if (data && typeof data === "object") {
          listingsArray = [data];
        }

        setListings(listingsArray);
      } catch (error) {
        setError(
          error.message || "Failed to fetch listings. Please try again."
        );
        toast.error(
          error.message || "Failed to fetch listings. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [isAuthenticated, user]);

  const retryFetchListings = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await api.getListingsByEmail(user.email);
      let listingsArray = [];
      if (Array.isArray(data)) {
        listingsArray = data;
      } else if (data?.products) {
        listingsArray = data.products;
      } else if (data?.listings) {
        listingsArray = data.listings;
      } else if (data?.data) {
        listingsArray = data.data;
      } else if (data && typeof data === "object") {
        listingsArray = [data];
      }

      setListings(listingsArray);
      toast.success("Listings loaded successfully!");
    } catch (error) {
      setError(error.message || "Failed to fetch listings. Please try again.");
      toast.error(
        error.message || "Failed to fetch listings. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    navigate(`/pendingbids/update/${id}`);
  };

  const handleDelete = async (id) => {
    const listingToDelete = listings.find((listing) => listing._id === id);
    if (!listingToDelete) {
      toast.error("Listing not found");
      return;
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${formatTitle(
        listingToDelete.name
      )}"? This action cannot be undone.`
    );

    if (confirmDelete) {
      setDeleteLoading(id);
      try {
        await api.deleteListing(id);
        toast.success(
          `${formatTitle(listingToDelete.name)} deleted successfully`
        );
        setListings((prevListings) =>
          prevListings.filter((listing) => listing._id !== id)
        );
      } catch (error) {
        console.error("Error deleting listing:", error);
        toast.error("Failed to delete listing. Please try again.");
      } finally {
        setDeleteLoading(null);
      }
    }
  };

  const calculateTimeLeft = (biddingStartTime) => {
    if (!biddingStartTime)
      return { text: "Date not available", expired: false };

    const endTime = new Date(biddingStartTime);
    if (isNaN(endTime.getTime()))
      return { text: "Invalid Date", expired: false };

    const now = new Date();
    const timeDifference = endTime - now;

    if (timeDifference <= 0) return { text: "Expired", expired: true };

    const hoursLeft = Math.floor(timeDifference / (1000 * 60 * 60));
    const minutesLeft = Math.floor(
      (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
    );

    return {
      text: `${hoursLeft}h ${minutesLeft}m left`,
      expired: false,
    };
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setListings((prevListings) =>
        prevListings.map((listing) => ({
          ...listing,
          timeLeft: calculateTimeLeft(listing.biddingStartTime),
        }))
      );
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  if (loading || (isAuthenticated && !user)) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
          <p className="text-lg text-slate-600 dark:text-gray-300">Loading your listings...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center p-8 rounded-xl shadow-lg bg-white dark:bg-gray-800">
          <p className="text-lg mb-4 text-slate-600 dark:text-gray-300">
            Please log in to view your listings
          </p>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (error && !loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center p-8 rounded-xl shadow-lg bg-white dark:bg-gray-800">
          <div className="mb-4 text-red-500 dark:text-red-400">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2 text-slate-800 dark:text-gray-100">
            Error Loading Listings
          </h3>
          <p className="mb-6 text-slate-600 dark:text-gray-300">{error}</p>
          <button
            onClick={retryFetchListings}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-slate-800 dark:text-gray-100">
            Your Listings
          </h1>
          <p className="text-slate-600 dark:text-gray-300">
            Manage and track your auction listings
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="p-6 rounded-xl shadow-sm border bg-white dark:bg-gray-800 border-slate-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-gray-300">
                  Total Listings
                </p>
                <p className="text-2xl font-bold text-slate-800 dark:text-gray-100">
                  {listings.length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900">
                <Tag className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="p-6 rounded-xl shadow-sm border bg-white dark:bg-gray-800 border-slate-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-gray-300">
                  Active Auctions
                </p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {
                    listings.filter(
                      (l) => !calculateTimeLeft(l.biddingStartTime).expired
                    ).length
                  }
                </p>
              </div>
              <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900">
                <Clock className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="p-6 rounded-xl shadow-sm border bg-white dark:bg-gray-800 border-slate-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-gray-300">
                  Total Value
                </p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  ₹
                  {listings
                    .reduce((sum, l) => sum + (l.biddingStartPrice || 0), 0)
                    .toLocaleString()}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900">
                <DollarSign className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        {/* No Listings State */}
        {listings.length === 0 ? (
          <div className="rounded-xl shadow-sm border p-12 text-center bg-white dark:bg-gray-800 border-slate-200 dark:border-gray-700">
            <Package className="h-16 w-16 mx-auto mb-4 text-slate-400 dark:text-gray-400" />
            <h3 className="text-xl font-semibold mb-2 text-slate-800 dark:text-gray-100">
              No listings found
            </h3>
            <p className="mb-6 text-slate-600 dark:text-gray-300">
              You haven't created any listings yet. Start by adding your first
              item!
            </p>
            <button
              onClick={() => navigate("/create-listing")}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Create Your First Listing
            </button>
          </div>
        ) : (
          /* Listings Grid */
          <div className="space-y-6">
            {listings.map((listing) => {
              const timeLeft = calculateTimeLeft(listing.biddingStartTime);
              const biddingStartPrice = listing.biddingStartPrice || 0;
              const formattedDescription = formatDescription(
                listing.description
              );
              const formattedTitle = formatTitle(listing.name);

              return (
                <div
                  key={listing._id}
                  className="rounded-xl shadow-sm border overflow-hidden transition-shadow hover:shadow-md bg-white dark:bg-gray-800 border-slate-200 dark:border-gray-700"
                >
                  <div className="flex flex-col lg:flex-row">
                    {/* Image */}
                    <div className="lg:w-80 h-64 lg:h-auto flex-shrink-0 bg-slate-100 dark:bg-gray-700">
                      <img
                        src={
                          listing.images?.[0]?.secure_url ||
                          "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop"
                        }
                        alt={formattedTitle}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6">
                      <div className="flex flex-col h-full">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-xl font-semibold mb-2 text-slate-800 dark:text-gray-100">
                                {formattedTitle}
                              </h3>
                              <div className="flex items-center gap-4 text-sm mb-3 text-slate-600 dark:text-gray-300">
                                <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-gray-700">
                                  {listing.category || "Uncategorized"}
                                </span>
                                <div
                                  className={`flex items-center gap-1 px-3 py-1 rounded-full ${
                                    timeLeft.expired
                                      ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
                                      : 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                                  }`}
                                >
                                  <Clock className="h-4 w-4" />
                                  {timeLeft.text}
                                </div>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2 ml-4">
                              <button
                                onClick={() => handleEdit(listing._id)}
                                className="p-2 rounded-lg transition-colors text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/30"
                                title="Edit listing"
                              >
                                <Edit3 className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => handleDelete(listing._id)}
                                disabled={deleteLoading === listing._id}
                                className="p-2 rounded-lg transition-colors disabled:opacity-50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
                                title="Delete listing"
                              >
                                {deleteLoading === listing._id ? (
                                  <div className="animate-spin h-5 w-5 border-2 rounded-full border-t-transparent border-red-600 dark:border-red-400"></div>
                                ) : (
                                  <Trash2 className="h-5 w-5" />
                                )}
                              </button>
                            </div>
                          </div>

                          <p className="mb-4 line-clamp-2 text-slate-600 dark:text-gray-300">
                            {formattedDescription}
                          </p>

                          {/* Contact Info */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-gray-300">
                              <Mail className="h-4 w-4 flex-shrink-0" />
                              <span className="truncate">
                                {listing.email || "No email provided"}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-gray-300">
                              <Phone className="h-4 w-4 flex-shrink-0" />
                              <span>
                                {listing.mobileNumber || "No phone number"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-gray-700">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-slate-600 dark:text-gray-400">
                                Starting Price
                              </p>
                              <p className="text-2xl font-bold text-slate-800 dark:text-gray-100">
                                ₹{biddingStartPrice.toLocaleString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-slate-600 dark:text-gray-400">Status</p>
                              <p
                                className={`font-medium ${
                                  timeLeft.expired
                                    ? 'text-red-600 dark:text-red-400'
                                    : 'text-green-600 dark:text-green-400'
                                }`}
                              >
                                {timeLeft.expired ? "Auction Ended" : "Active"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerHistoryPage;