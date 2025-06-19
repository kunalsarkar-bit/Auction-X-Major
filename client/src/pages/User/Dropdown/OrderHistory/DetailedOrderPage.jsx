import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import DownloadInvoice from "../../../../components/User/DownloadInvoice/DownloadInvoice";
import Steps from "../../../../components/User/ProgressBar/ProgressBar";
import { fetchCsrfToken } from "../../../../redux/slices/csrfSecuritySlice";
import { useSelector, useDispatch } from "react-redux";
const API_URL = import.meta.env.VITE_API_URL;

const DetailedOrderPage = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState("");
  const [uploadedImages, setUploadedImages] = useState([]);
  // In your DetailedOrderPage component
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const { token: csrfToken } = useSelector((state) => state.csrf);
  const dispatch = useDispatch();
  const userEmail = useSelector((state) => state.auth.user?.email);

  useEffect(() => {
    if (!csrfToken && !loading) {
      dispatch(fetchCsrfToken());
    }
  }, [dispatch, csrfToken, loading]);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        if (!id) {
          setError("Invalid Order ID");
          setLoading(false);
          return;
        }

        // Fetch specific order details by ID
        const response = await axios.get(`${API_URL}/api/orders/${id}`);
        setOrder(response.data);

        // Determine current step based on order status
        const statusSteps = [
          "Order Confirmed",
          "Shipped",
          "Out For Delivery",
          "Delivered",
        ];

        // Set current step based on order's current status
        const currentStatusIndex = statusSteps.findIndex(
          (status) => status === response.data.status
        );
        setCurrentStep(currentStatusIndex + 1);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching order details:", err);
        setError("Failed to fetch order details");
        setLoading(false);
      }
    };

    const removeImage = (index) => {
      setUploadedImages((prev) => prev.filter((_, i) => i !== index));
    };

    fetchOrderDetails();
  }, [id]);

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const isValidImageUrl = (url) => {
    if (!url) return false;
    // Check if it's a Google Images encrypted URL (these don't work for hotlinking)
    if (
      url.includes("encrypted-tbn0.gstatic.com") ||
      url.includes("googleusercontent.com")
    ) {
      return false;
    }
    // Add other problematic URL patterns here
    return true;
  };

  const handleReviewSubmit = async () => {
    if (rating === 0) {
      setSubmitError("Please provide a rating");
      return;
    }

    if (!review.trim()) {
      setSubmitError("Please write your review");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      if (!userEmail) {
        throw new Error("User email not available");
      }

      // Create FormData for file uploads
      const formData = new FormData();
      formData.append("productName", order.title);
      formData.append("rating", rating);
      formData.append("reviewText", review);
      formData.append("orderId", order._id);
      formData.append("userEmail", userEmail);
      formData.append("sellerEmail", order.sellerEmail);
      // Handle image uploads
      if (uploadedImages.length > 0) {
        formData.append("productImage", uploadedImages[0].file);
      } else if (order.images?.[0]?.secure_url) {
        formData.append("productImageUrl", order.images[0].secure_url);
      }

      // Add additional photos
      uploadedImages.slice(1).forEach((image) => {
        formData.append("additionalPhotos", image.file);
      });

      const response = await axios.post(
        `${API_URL}/api/product-feedback/add`,
        formData,
        {
          headers: {
            "X-CSRF-Token": csrfToken,
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setSubmitSuccess(true);
        setRating(0);
        setReview("");
        setUploadedImages([]);
      } else {
        setSubmitError(response.data.message || "Failed to submit feedback");
      }
    } catch (error) {
      console.error("Submission error:", error);
      setSubmitError(
        error.response?.data?.message ||
          error.message ||
          "Failed to submit feedback"
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);

    // Validate file types and sizes
    const validFiles = files.filter((file) => {
      const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        setSubmitError("Only JPG, PNG, GIF, or WEBP images are allowed");
        return false;
      }

      if (file.size > maxSize) {
        setSubmitError("Image size must be less than 5MB");
        return false;
      }

      return true;
    });

    if (validFiles.length === 0) return;

    // Check total number of images (main + additional)
    if (uploadedImages.length + validFiles.length > 3) {
      setSubmitError("You can upload a maximum of 5 images");
      return;
    }

    const imagePromises = validFiles.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve({
            file,
            preview: e.target.result,
            name: file.name,
          });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(imagePromises).then((images) => {
      setUploadedImages((prev) => [...prev, ...images]);
    });
  };

  const handleStarClick = (starValue) => {
    setRating(starValue);
  };

  const removeImage = (index) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-gray-800 py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/30 p-12">
            <div className="text-center">
              <div className="relative">
                <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"></div>
                <div className="absolute inset-0 rounded-full bg-blue-100/30 animate-pulse"></div>
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Loading Order Details
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Please wait while we fetch your information...
              </p>
            </div>

            {/* Enhanced Skeleton Loading */}
            <div className="animate-pulse mt-10 space-y-8">
              <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-4">
                    <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-2xl"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full w-3/4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full w-1/2"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-rose-100 dark:from-gray-900 dark:via-red-900/20 dark:to-gray-800 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 rounded-3xl shadow-2xl border border-red-200/30 dark:border-red-800/30 p-12 text-center">
            <div className="relative mb-8">
              <div className="text-8xl mb-4 animate-bounce">⚠️</div>
              <div className="absolute inset-0 bg-red-400/20 rounded-full blur-xl animate-pulse"></div>
            </div>
            <h2 className="text-3xl font-bold text-red-600 dark:text-red-400 mb-4">
              Oops! Something went wrong
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg mb-8">
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="group relative px-8 py-4 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
            >
              <span className="relative z-10">Try Again</span>
              <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100 dark:from-gray-900 dark:via-slate-800 dark:to-gray-800 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 rounded-3xl shadow-2xl border border-gray-200/30 dark:border-gray-700/30 p-12 text-center">
            <div className="text-8xl mb-6 opacity-60">📦</div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
              Order Not Found
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              The order you're looking for doesn't exist or has been removed.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-gray-800 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Floating Header Section */}
        <div className="text-center mb-12 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-3xl rounded-full"></div>
          <div className="relative">
            <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4 tracking-tight">
              Order Details
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-xl font-medium">
              Track your order and manage your purchase
            </p>
          </div>
        </div>

        {/* Enhanced Order Progress */}
        <div className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/30 p-8 mb-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5"></div>
          <div className="relative">
            <Steps
              currentStep={currentStep}
              totalSteps={4}
              steps={[
                "Order Confirmed",
                "Shipped",
                "Out For Delivery",
                "Delivered",
              ]}
              onNext={nextStep}
              onPrev={prevStep}
            />
          </div>
        </div>

        {/* Enhanced Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Delivery Information Card */}
          <div className="group backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/30 p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="relative">
              <div className="flex items-center mb-8">
                <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-4 rounded-2xl shadow-lg mr-4 group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-7 h-7 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                    Delivery Address
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Where it's going
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-start group/item">
                  <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 w-20 flex-shrink-0">
                    Name:
                  </span>
                  <span className="font-bold text-gray-800 dark:text-white group-hover/item:text-blue-600 dark:group-hover/item:text-blue-400 transition-colors">
                    {order.name}
                  </span>
                </div>
                <div className="flex items-start group/item">
                  <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 w-20 flex-shrink-0">
                    Address:
                  </span>
                  <span className="text-gray-700 dark:text-gray-300 group-hover/item:text-gray-900 dark:group-hover/item:text-gray-100 transition-colors">
                    {order.address}
                  </span>
                </div>
                <div className="flex items-start group/item">
                  <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 w-20 flex-shrink-0">
                    Phone:
                  </span>
                  <span className="text-gray-700 dark:text-gray-300 group-hover/item:text-gray-900 dark:group-hover/item:text-gray-100 transition-colors">
                    {order.phoneNo}
                  </span>
                </div>
                <div className="flex items-start group/item">
                  <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 w-20 flex-shrink-0">
                    Date:
                  </span>
                  <span className="text-gray-700 dark:text-gray-300 group-hover/item:text-gray-900 dark:group-hover/item:text-gray-100 transition-colors">
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Product Information */}
          <div className="group backdrop-blur-sm bg-gradient-to-br from-emerald-50/90 to-green-100/90 dark:from-emerald-900/30 dark:to-green-900/30 rounded-3xl shadow-xl border border-emerald-200/30 dark:border-emerald-800/30 p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/10 to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="relative">
              <div className="text-center mb-8">
                <div className="inline-flex items-center bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 py-3 rounded-full text-sm font-bold shadow-lg mb-6 group-hover:scale-105 transition-transform duration-300">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  🎉 Congratulations! You Won!
                </div>
              </div>

              <div className="text-center">
                <div className="relative group/image mb-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-green-500/20 rounded-2xl blur-xl group-hover/image:blur-2xl transition-all duration-500"></div>
                  <img
                    src={
                      order.images[0]?.secure_url ||
                      "https://via.placeholder.com/300"
                    }
                    className="relative rounded-2xl w-full h-64 object-cover shadow-2xl group-hover/image:shadow-3xl transition-all duration-500 border-4 border-white/50 dark:border-gray-700/50"
                    alt={order.title || "Product image"}
                    onError={(e) => {
                      console.log("Image failed to load:", e.target.src);
                      e.target.src =
                        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop&crop=center";
                    }}
                    onLoad={(e) => {
                      console.log("Image loaded successfully:", e.target.src);
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl opacity-0 group-hover/image:opacity-100 transition-opacity duration-500"></div>
                </div>

                <div className="space-y-6">
                  <h4 className="text-2xl font-bold text-gray-800 dark:text-white">
                    {order.title}
                  </h4>

                  <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-white/30 dark:border-gray-700/30 shadow-lg">
                    <div className="flex justify-between items-center">
                      <div className="text-center flex-1">
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Start Price
                        </p>
                        <p className="font-bold text-gray-700 dark:text-gray-300 text-lg mt-1">
                          ${order.biddingStartPrice}
                        </p>
                      </div>
                      <div className="w-px h-12 bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>
                      <div className="text-center flex-1">
                        <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                          Your Winning Bid
                        </p>
                        <p className="font-black text-emerald-600 dark:text-emerald-400 text-2xl mt-1">
                          ${order.highestBid}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Actions Panel */}
          <div className="group backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/30 p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="relative">
              <div className="flex items-center mb-8">
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-4 rounded-2xl shadow-lg mr-4 group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-7 h-7 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                    Quick Actions
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Manage your order
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="transform hover:scale-105 transition-transform duration-300">
                    <DownloadInvoice id={order._id} order={order} />
                  </div>
                </div>

                <button className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl group/btn transform hover:scale-105">
                  <svg
                    className="w-5 h-5 mr-3 group-hover/btn:animate-bounce"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.959 8.959 0 01-4.906-1.444l-3.448 1.724a1.009 1.009 0 01-1.413-1.413l1.724-3.448A8.959 8.959 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z"
                    />
                  </svg>
                  Contact Support
                </button>

                <button className="w-full bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 dark:from-gray-700 dark:to-gray-600 dark:hover:from-gray-600 dark:hover:to-gray-500 text-gray-800 dark:text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl group/btn transform hover:scale-105">
                  <svg
                    className="w-5 h-5 mr-3 group-hover/btn:animate-pulse"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Track Package
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Review Section */}
        <div className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/30 p-10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-orange-500/5"></div>

          <div className="relative">
            <div className="flex items-center mb-12">
              <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-4 rounded-2xl shadow-lg mr-6">
                <svg
                  className="w-8 h-8 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                  Rate & Review
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  Share your experience with this product
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-wider">
                    Your Rating
                  </label>
                  <div className="flex gap-3 mb-8">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleStarClick(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="text-4xl transition-all duration-300 focus:outline-none transform hover:scale-125"
                      >
                        <span
                          className={`${
                            star <= (hoverRating || rating)
                              ? "text-yellow-400 drop-shadow-lg"
                              : "text-gray-300 dark:text-gray-600"
                          } transition-all duration-300`}
                        >
                          ★
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-wider">
                    Write Your Review
                  </label>
                  <div className="relative">
                    <textarea
                      value={review}
                      onChange={(e) => {
                        if (e.target.value.length <= 500) {
                          setReview(e.target.value);
                        }
                      }}
                      className="w-full h-40 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700/50 dark:text-white rounded-2xl p-6 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 resize-none backdrop-blur-sm text-lg"
                      placeholder="Tell us about your experience with this product..."
                    />
                    <div
                      className={`absolute bottom-4 right-4 text-sm ${
                        review.length >= 450
                          ? "text-yellow-500"
                          : "text-gray-400"
                      } ${
                        review.length >= 500 ? "text-red-500 font-bold" : ""
                      }`}
                    >
                      {review.length}/500
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-wider">
                    Add Photos (Optional)
                  </label>
                  {/* Enhanced Image Upload Area */}
                  <div className="border-3 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-12 text-center hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all duration-300 group/upload">
                    <div className="relative">
                      <svg
                        className="w-16 h-16 text-gray-400 mx-auto mb-6 group-hover/upload:text-blue-500 group-hover/upload:scale-110 transition-all duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      <p className="text-gray-600 dark:text-gray-300 mb-4 text-lg font-semibold">
                        Drop your images here or
                      </p>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="review-images"
                      />
                      <label
                        htmlFor="review-images"
                        className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-2xl cursor-pointer transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        Browse Files
                      </label>
                    </div>
                  </div>
                  {/* Enhanced Image Previews */}
                  {uploadedImages.length > 0 && (
                    <div className="mt-8">
                      <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-6 uppercase tracking-wider">
                        Uploaded Images ({uploadedImages.length})
                      </h4>
                      <div className="grid grid-cols-2 gap-6">
                        {uploadedImages.map((image, index) => (
                          <div key={index} className="relative group/image">
                            <div className="relative overflow-hidden rounded-2xl">
                              <img
                                src={image.preview}
                                alt={`Upload ${index + 1}`}
                                className="w-full h-32 object-cover border-2 border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 transition-all duration-300 group-hover/image:scale-110"
                                onError={(e) => {
                                  console.log(
                                    "Preview image failed to load:",
                                    image.name
                                  );
                                  e.target.src =
                                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f3f4f6'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='12' fill='%236b7280' text-anchor='middle' dy='0.3em'%3EImage Error%3C/text%3E%3C/svg%3E";
                                }}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover/image:opacity-100 transition-all duration-300 rounded-2xl"></div>
                            </div>
                            <button
                              onClick={() => removeImage(index)}
                              className="absolute -top-3 -right-3 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold opacity-0 group-hover/image:opacity-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  // Add this to your review section JSX
                  {submitError && (
                    <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
                      <p>{submitError}</p>
                    </div>
                  )}
                  {submitSuccess ? (
                    <div className="mb-6 p-4 bg-green-100 border-l-4 border-green-500 text-green-700">
                      <p>
                        Thank you! Your feedback has been submitted
                        successfully.
                      </p>
                      <button
                        onClick={() => setSubmitSuccess(false)}
                        className="mt-2 text-green-700 underline"
                      >
                        Submit another review
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleReviewSubmit}
                      disabled={isSubmitting || rating === 0}
                      className={`w-full mt-8 font-bold py-6 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center text-lg shadow-xl hover:shadow-2xl ${
                        rating === 0 || isSubmitting
                          ? "bg-gray-400 cursor-not-allowed text-gray-600 shadow-none"
                          : "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white"
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-6 h-6 mr-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                            />
                          </svg>
                          {rating === 0
                            ? "Please rate to submit"
                            : "Submit Review"}
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedOrderPage;
