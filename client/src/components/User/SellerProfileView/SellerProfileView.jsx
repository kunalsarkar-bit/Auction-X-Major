import React, { useState, useEffect } from "react";
import {
  Star,
  Shield,
  Award,
  Calendar,
  Gavel,
  MessageCircle,
  ThumbsUp,
  Flag,
  TrendingUp,
  Clock,
  User,
  MapPin,
  DollarSign,
  Package,
  Loader2,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import SellerProductsList from "./SellerProductsList";

const SellerProfileView = () => {
  const [activeTab, setActiveTab] = useState("reviews");
  const [expandedReview, setExpandedReview] = useState(null);
  const [seller, setSeller] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [error, setError] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;
  // Get email from your app's state/context - replace this with your actual state management
  const location = useLocation();
  const { sellerEmail } = location.state || {};

  useEffect(() => {
    const fetchSellerData = async () => {
      if (!sellerEmail) {
        setError("No email provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(
          `${API_URL}/api/auth/seller/user/${encodeURIComponent(sellerEmail)}`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch seller data: ${response.status}`);
        }

        const sellerData = await response.json();

        // Transform the API data to match the component's expected format
        const transformedSeller = {
          id: sellerData._id,
          name: sellerData.name,
          username: `@${sellerData.email.split("@")[0]}`,
          avatar:
            sellerData.profilePic && sellerData.profilePic.length > 0
              ? sellerData.profilePic[0].secure_url
              : "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
          location: `${sellerData.city || "Unknown City"}, ${
            sellerData.state || "Unknown State"
          }, ${sellerData.country || "Unknown Country"}`,
          joinDate: new Date(sellerData.createdAt).toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          }),
          verified: sellerData.isVerified,
          email: sellerData.email,
          phone: sellerData.phoneNo,
          alternativePhone: sellerData.alternativePhoneNo,
          address: sellerData.address,
          pinCode: sellerData.pinCode,
          gender: sellerData.gender,
          storeName: sellerData.storeName,
          storeDescription: sellerData.storeDescription,
          amount: sellerData.amount || 0,
          // Mock data for auction-related fields (you can replace these with real data from your auctions collection)
          totalAuctions: 247,
          successfulBids: 189,
          rating: 0, // Will be calculated from reviews
          totalReviews: 0, // Will be set from reviews
          responseTime: "< 2 hours",
          avgBidAmount: "$245",
          highestBid: "$1,850",
          bio:
            sellerData.storeDescription ||
            "Passionate collector and seller of vintage electronics and collectibles. I specialize in authentic items with detailed condition reports. All auctions include comprehensive photos and honest descriptions.",
          badges: [
            "Power Bidder",
            "Trusted Seller",
            "Quick Shipper",
            "Verified Account",
          ],
          auctionStats: {
            winRate: 76.5,
            avgBidTime: "2.3 days before close",
            paymentSpeed: "Same day",
            shippingSpeed: "Next day",
          },
        };

        setSeller(transformedSeller);
        setError(null);
      } catch (err) {
        console.error("Error fetching seller data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSellerData();
  }, [sellerEmail]);

  // Fetch product feedback/reviews
  useEffect(() => {
    const fetchReviews = async () => {
      if (!sellerEmail) return;

      try {
        setReviewsLoading(true);
        const response = await fetch(
          `${API_URL}/api/product-feedback/seller/${encodeURIComponent(
            sellerEmail
          )}`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch reviews: ${response.status}`);
        }

        const feedbackData = await response.json();

        // Use feedbackData.feedbacks instead of feedbackData
        const feedbackItems = feedbackData.feedbacks || []; // Fallback to empty array if undefined

        const transformedReviews = feedbackItems.map((feedback, index) => ({
          id: feedback._id,
          buyer: feedback.userEmail
            ? feedback.userEmail.split("@")[0]
            : "Anonymous",
          avatar:
            "https://cdn.pixabay.com/photo/2019/08/11/18/59/icon-4399701_1280.png", // Single stock image
          rating: feedback.rating,
          date: formatDate(feedback.createdAt),
          item: feedback.productName,
          finalBid: "N/A",
          startingBid: "N/A",
          totalBids: "N/A",
          review: feedback.reviewText,
          helpful: Math.floor(Math.random() * 20) + 1,
          verified: true,
          auctionType: "auction",
          productImage: feedback.productImage,
          additionalPhotos: feedback.additionalPhotos || [],
          orderId: feedback.orderId || "N/A",
        }));

        setReviews(transformedReviews);

        if (seller && transformedReviews.length > 0) {
          const avgRating =
            transformedReviews.reduce((sum, review) => sum + review.rating, 0) /
            transformedReviews.length;
          setSeller((prev) => ({
            ...prev,
            rating: Math.round(avgRating * 10) / 10,
            totalReviews: transformedReviews.length,
          }));
        }
      } catch (err) {
        console.error("Error fetching reviews:", err);
      } finally {
        setReviewsLoading(false);
      }
    };
    if (seller) {
      fetchReviews();
    }
  }, [seller?.email, sellerEmail]);

  // Helper function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30)
      return `${Math.ceil(diffDays / 7)} week${
        Math.ceil(diffDays / 7) > 1 ? "s" : ""
      } ago`;
    if (diffDays < 365)
      return `${Math.ceil(diffDays / 30)} month${
        Math.ceil(diffDays / 30) > 1 ? "s" : ""
      } ago`;
    return `${Math.ceil(diffDays / 365)} year${
      Math.ceil(diffDays / 365) > 1 ? "s" : ""
    } ago`;
  };

  const auctionHistory = [
    {
      id: 1,
      title: "Retro Sony Walkman WM-EX194",
      finalBid: "$125",
      startingBid: "$20",
      endDate: "3 days ago",
      image:
        "https://images.unsplash.com/photo-1493225255266-d9ba33d16087?w=100&h=100&fit=crop",
      condition: "Excellent",
      totalBids: 18,
      bidders: 12,
      rating: 5,
      auctionDuration: "7 days",
    },
  ];

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating
            ? "fill-yellow-400 text-yellow-400"
            : "text-gray-300 dark:text-gray-600"
        }`}
      />
    ));
  };

  // Loading state
  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-6 bg-white dark:bg-[#191919] min-h-screen">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-600" />
            <p className="text-gray-600 dark:text-gray-400">
              Loading seller profile...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-5xl mx-auto p-6 bg-white dark:bg-[#191919] min-h-screen">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="bg-red-100 dark:bg-red-900 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-2">
                Error Loading Profile
              </h2>
              <p className="text-red-600 dark:text-red-400">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No seller data
  if (!seller) {
    return (
      <div className="max-w-5xl mx-auto p-6 bg-white dark:bg-[#191919] min-h-screen">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400">
              No seller data found
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white dark:bg-[#191919] min-h-screen">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-[#303030] dark:to-[#303030] rounded-2xl p-8 mb-8 shadow-lg">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
          <div className="relative">
            <img
              src={seller.avatar}
              alt={seller.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
            />
            {seller.verified && (
              <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2">
                <Shield className="w-4 h-4 text-white" />
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {seller.name}
              </h1>
              {seller.verified && (
                <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm font-medium">
                  Verified Seller
                </span>
              )}
            </div>

            <p className="text-gray-600 dark:text-gray-300 mb-2">
              {seller.username}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {seller.location}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Selling since {seller.joinDate}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Responds in {seller.responseTime}
              </div>
            </div>

            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {seller.bio}
            </p>

            {/* Store Information */}
            {seller.storeName && (
              <div className="mb-4 p-3 bg-white dark:bg-[#191919] rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {seller.storeName}
                </h3>
                {seller.storeDescription && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {seller.storeDescription}
                  </p>
                )}
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {seller.badges.map((badge, index) => (
                <span
                  key={index}
                  className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1"
                >
                  <Award className="w-3 h-3" />
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center bg-white dark:bg-[#303030] rounded-xl p-4 shadow-md">
              <div className="flex items-center justify-center gap-1 mb-2">
                {renderStars(Math.floor(seller.rating))}
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {seller.rating}
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {seller.totalReviews} reviews
              </p>
            </div>

            <div className="text-center bg-white dark:bg-[#303030] rounded-xl p-4 shadow-md">
              <div className="flex items-center justify-center mb-2">
                <Gavel className="w-5 h-5 text-blue-500" />
              </div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {seller.auctionStats.winRate}%
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Win Rate
              </p>
            </div>

            <div className="text-center bg-white dark:bg-[#303030] rounded-xl p-4 shadow-md">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {seller.totalAuctions}
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Auctions
              </p>
            </div>

            <div className="text-center bg-white dark:bg-[#303030] rounded-xl p-4 shadow-md">
              <div className="flex items-center justify-center mb-2">
                <DollarSign className="w-5 h-5 text-purple-500" />
              </div>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {seller.avgBidAmount}
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Avg Bid
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
        <nav className="flex space-x-8">
          {[
            { id: "reviews", label: "Buyer Reviews", icon: MessageCircle },
            { id: "sellerItems", label: "Seller Products List", icon: Gavel },
            { id: "stats", label: "Bidding Stats", icon: TrendingUp },
            { id: "profile", label: "Profile Details", icon: User },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === id
                  ? "border-purple-500 text-purple-600 dark:text-purple-400"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* Profile Details Tab */}
      {activeTab === "profile" && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Profile Details
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 dark:bg-[#303030] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Contact Information
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="text-gray-600 dark:text-gray-400 text-sm">
                    Email:
                  </span>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {seller.email}
                  </div>
                </div>
                {seller.phone && (
                  <div>
                    <span className="text-gray-600 dark:text-gray-400 text-sm">
                      Phone:
                    </span>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {seller.phone}
                    </div>
                  </div>
                )}
                {seller.alternativePhone && (
                  <div>
                    <span className="text-gray-600 dark:text-gray-400 text-sm">
                      Alternative Phone:
                    </span>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {seller.alternativePhone}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-[#303030] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Address Details
              </h3>
              <div className="space-y-3">
                {seller.address && (
                  <div>
                    <span className="text-gray-600 dark:text-gray-400 text-sm">
                      Address:
                    </span>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {seller.address}
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  {seller.pinCode && (
                    <div>
                      <span className="text-gray-600 dark:text-gray-400 text-sm">
                        PIN Code:
                      </span>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {seller.pinCode}
                      </div>
                    </div>
                  )}
                  {seller.gender && (
                    <div>
                      <span className="text-gray-600 dark:text-gray-400 text-sm">
                        Gender:
                      </span>
                      <div className="font-medium text-gray-900 dark:text-white capitalize">
                        {seller.gender}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reviews Tab */}
      {activeTab === "reviews" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Buyer Reviews
            </h2>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {reviewsLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading reviews...
                </div>
              ) : (
                `Showing ${reviews.length} reviews`
              )}
            </div>
          </div>

          {reviewsLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                No reviews available yet
              </p>
            </div>
          ) : (
            reviews.map((review) => (
              <div
                key={review.id}
                className="bg-gray-50 dark:bg-[#303030] rounded-xl p-6 shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={review.avatar}
                    alt={review.buyer}
                    className="w-12 h-12 rounded-full object-cover"
                  />

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {review.buyer}
                      </h3>
                      {review.verified && (
                        <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded text-xs">
                          Verified Buyer
                        </span>
                      )}
                      <span className="text-gray-500 dark:text-gray-400 text-sm">
                        {review.date}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex">{renderStars(review.rating)}</div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        •
                      </span>
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                        Product Review
                      </span>
                    </div>

                    <div className="bg-white dark:bg-[#191919] rounded-lg p-4 mb-4">
                      <div className="flex items-start gap-3">
                        {review.productImage && (
                          <img
                            src={review.productImage}
                            alt={review.item}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                        )}
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                            {review.item}
                          </h4>
                          {review.orderId && (
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              Order ID:{" "}
                              <span className="font-mono">
                                {review.orderId}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      {review.review}
                    </p>

                    {/* Additional Photos */}
                    {review.additionalPhotos &&
                      review.additionalPhotos.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            Additional photos:
                          </p>
                          <div className="flex gap-2 flex-wrap">
                            {review.additionalPhotos.map((photo, index) => (
                              <img
                                key={index}
                                src={photo}
                                alt={`Additional photo ${index + 1}`}
                                className="w-20 h-20 rounded-lg object-cover border border-gray-200 dark:border-gray-600"
                              />
                            ))}
                          </div>
                        </div>
                      )}

                    <div className="flex items-center gap-4 text-sm">
                      <button className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                        <ThumbsUp className="w-4 h-4" />
                        Helpful ({review.helpful})
                      </button>
                      <button className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                        <Flag className="w-4 h-4" />
                        Report
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
      {/* Other Items from Seller Tab */}
      {activeTab === "sellerItems" && (
        <SellerProductsList sellerEmail={sellerEmail} />
      )}

      {/* Bidding Stats Tab */}
      {activeTab === "stats" && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Bidding Statistics
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 dark:bg-[#303030] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Auction Performance
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">
                    Success Rate
                  </span>
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    {seller.auctionStats.winRate}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">
                    Average Bid Amount
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {seller.avgBidAmount}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">
                    Highest Winning Bid
                  </span>
                  <span className="font-semibold text-purple-600 dark:text-purple-400">
                    {seller.highestBid}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">
                    Total Auctions Won
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {seller.successfulBids}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">
                    Account Balance
                  </span>
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    ${seller.amount}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-[#303030] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Seller Reliability
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">
                    Avg Bid Timing
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {seller.auctionStats.avgBidTime}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">
                    Payment Speed
                  </span>
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    {seller.auctionStats.paymentSpeed}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">
                    Shipping Speed
                  </span>
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    {seller.auctionStats.shippingSpeed}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">
                    Response Time
                  </span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    {seller.responseTime}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Trust Indicators Footer */}
      <div className="mt-12 bg-green-50 dark:bg-[#303030] rounded-xl p-6">
        <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Auction Trust & Safety
        </h3>
        <div className="grid md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Identity verified by platform
          </div>
          <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            All bids protected by guarantee
          </div>
          <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Secure payment processing
          </div>
          <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Active seller for 2+ years
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerProfileView;
