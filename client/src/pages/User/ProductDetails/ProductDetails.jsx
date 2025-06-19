import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { MdAccountBalanceWallet } from "react-icons/md";
import { RiMapPinTimeFill } from "react-icons/ri";
import { IoPerson } from "react-icons/io5";
import { ImHammer2 } from "react-icons/im";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import io from "socket.io-client";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import ShareMenu from "../../../components/Common/MiniComponent/ShareMenu/ShareMenu";

const ProductDetails = () => {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const { id } = useParams();
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [bidAmount, setBidAmount] = useState("");
  const [currentBid, setCurrentBid] = useState(0);
  const [bidderName, setBidderName] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [userMoney, setUserMoney] = useState(0);
  const [profilePicUrl, setProfilePicUrl] = useState("");
  const [sellerName, setSellerName] = useState("");
  const [productDeleted, setProductDeleted] = useState(false);
  const [serverDown, setServerDown] = useState(false);
  const [carData, setCarData] = useState({
    images: [],
    name: "",
    biddingStartPrice: 0,
    email: "",
    description: "",
  });
  const API_URL = import.meta.env.VITE_API_URL;

  const [socket, setSocket] = useState(null);
  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });
  const [isBiddingStarted, setIsBiddingStarted] = useState(false);
  const [isBiddingEnded, setIsBiddingEnded] = useState(false);
  const [biddingEndTime, setBiddingEndTime] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [loading, setLoading] = useState(true);

  // Get user data from Redux
  const { email: userEmail, name: userName } = useSelector(
    (state) => state.auth.user || {}
  );
  const token = useSelector((state) => state.auth.token);

  // Configure axios with auth token
  const api = axios.create({
    baseURL: `${API_URL}/api`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const socketInstance = io(`${API_URL}`, {
      auth: { token },
    });
    setSocket(socketInstance);

    socketInstance.emit("joinProductRoom", id);
    socketInstance.on("productData", (productData) => {
      if (productData.productId === id) {
        setCurrentBid(productData.currentBid);
        setBidderName(productData.bidderName);
        setBiddingEndTime(new Date(productData.biddingEndTime));
      }
    });

    return () => socketInstance.disconnect();
  }, [id, token]);

  const updateTimer = (startTime, endTime) => {
    if (
      !startTime ||
      !endTime ||
      isNaN(startTime.getTime()) ||
      isNaN(endTime.getTime())
    )
      return;
    const now = new Date().getTime();
    let difference = isBiddingStarted
      ? endTime.getTime() - now
      : startTime.getTime() - now;

    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({
        days: String(days).padStart(2, "0"),
        hours: String(hours).padStart(2, "0"),
        minutes: String(minutes).padStart(2, "0"),
        seconds: String(seconds).padStart(2, "0"),
      });
    } else {
      setTimeLeft({ days: "00", hours: "00", minutes: "00", seconds: "00" });
      if (!isBiddingStarted) setIsBiddingStarted(true);
      else setIsBiddingEnded(true);
    }
  };

  const fetchProductData = async () => {
    try {
      const response = await api.get(`/products/${id}`);
      const { success, product } = response.data;
      const {
        biddingStartDate,
        biddingStartTime,
        biddingEndTime,
        tempuseremail,
        tempname,
        images = [],
        ...restData
      } = product;

      setCarData({
        images,
        ...restData,
      });

      if (tempuseremail) setBidderName(tempname);
      setCurrentBid(product.biddingStartPrice || 0);

      if (biddingStartDate && biddingStartTime) {
        const startDate = new Date(biddingStartDate);
        const startTime = new Date(biddingStartTime);
        startDate.setUTCHours(
          startTime.getUTCHours(),
          startTime.getUTCMinutes(),
          0,
          0
        );
        const endTime = new Date(biddingEndTime);
        setBiddingEndTime(endTime);
        if (!isNaN(endTime)) updateTimer(startDate, endTime);
      }

      setLoading(false);
      setServerDown(false);
    } catch (error) {
      console.error("Error fetching product data:", error);
      setLoading(false);
      setServerDown(true);
    }
  };

  useEffect(() => {
    fetchProductData();
    const interval = setInterval(() => {
      if (biddingEndTime && !isBiddingEnded)
        updateTimer(new Date(), biddingEndTime);
    }, 1000);
    return () => clearInterval(interval);
  }, [biddingEndTime, isBiddingStarted, isBiddingEnded]);

  useEffect(() => {
    if (isBiddingEnded) handleBiddingEnd();
  }, [isBiddingEnded]);

  const handleBiddingEnd = async () => {
    try {
      const productResponse = await api.get(`/products/${id}`);
      const productData = productResponse.data.product;

      const {
        name: title,
        email: sellerEmail,
        category,
        images,
        tempuseremail: winnerEmail,
        tempamount: highestBid,
        tempname: winnerName,
        biddingStartPrice,
      } = productData;
      alert(winnerEmail);
      alert(productData);
      console.log(productData);
      if (winnerEmail) {
        const userResponse = await api.get(`/auth/user/user/${winnerEmail}`);
        const { address, phoneNo } = userResponse.data;

        const auctionSummary = {
          title,
          sellerEmail,
          category,
          images,
          userEmail: winnerEmail,
          highestBid,
          name: winnerName,
          biddingStartPrice,
          address,
          phoneNo,
        };

        await api.post("/orders/", auctionSummary);
        await api.delete(`/products/deleteSuccessProduct/${id}`);
        setProductDeleted(true);

        if (productDeleted) {
          Swal.fire({
            title: "Product Sold",
            text: "This product is no longer available.",
            icon: "info",
          }).then(() => navigate("/"));
        }
      } else {
        await api.patch(`/products/statuspatch/${id}`, { status: "Closed" });
      }
    } catch (error) {
      console.error("Error handling auction end:", error);
      toast.error("Failed to complete auction");
    }
  };
  useEffect(() => {
    const fetchAmount = async () => {
      try {
        const response = await fetch(`${API_URL}/api/auth/get-amount`, {
          method: "GET",
          credentials: "include", // 🔑 Important to send cookies
        });

        const data = await response.json();

        if (response.ok && data.amount !== undefined) {
          setUserMoney(data.amount);
          // Optional: setUserName(data.name);
        } else {
          console.error("Server responded with error:", data);
        }
      } catch (error) {
        console.error("Error fetching amount:", error);
      }
    };

    fetchAmount();
  }, []);

  const fetchProfilePic = async () => {
    try {
      if (!carData.email) return;
      const response = await api.get("/auth/seller/profile-pic", {
        params: { email: carData.email },
      });

      if (response.data.profilePic) {
        setProfilePicUrl(response.data.profilePic);
      }
      if (response.data.name) {
        setSellerName(response.data.name);
      }
    } catch (error) {
      console.log("Error fetching profile picture");
    }
  };

  useEffect(() => {
    if (carData?.email) fetchProfilePic();
  }, [carData]);

  const handleSelect = (selectedIndex) => setIndex(selectedIndex);
  const toggleDropdown = () => setDropdownVisible(!isDropdownVisible);

  const handleBidSubmit = async () => {
    try {
      const enteredAmount = parseFloat(bidAmount);
      const minimumAmount = currentBid + 200;

      if (isNaN(enteredAmount) || enteredAmount < minimumAmount) {
        setAlertMessage(
          `Invalid amount. Your bid must be at least ₹${minimumAmount}.`
        );
        return;
      }

      if (enteredAmount > userMoney) {
        setAlertMessage("Not enough money to place the bid.");
        return;
      }

      const productResponse = await api.get(`/products/${id}`);
      const productData = productResponse.data;
      const previousBidderEmail = productData.tempuseremail || "";

      if (previousBidderEmail) {
        toast.success(`${userName} just placed a bid!`);
        const amountResponse = await api.get(
          `/auth/get-amount-by-email/${previousBidderEmail}`
        );
        const fetchedAmount = amountResponse.data?.amount || 0;
        const newAmount = (productData.tempamount || 0) + fetchedAmount;

        await api.patch(
          `/auth/update-amount`,
          {
            email: previousBidderEmail,
            amount: newAmount,
          },
          {
            withCredentials: true,
          }
        );
      }

      const updatedUserBalance = userMoney - enteredAmount;
      await api.patch(
        `/auth/update-amount`,
        {
          email: userEmail,
          amount: updatedUserBalance,
        },
        {
          withCredentials: true,
        }
      );

      await api.patch(`/products/tempdata/${id}`, {
        tempuseremail: userEmail,
        tempamount: enteredAmount,
        tempname: userName,
        biddingStartPrice: enteredAmount,
      });

      const bidData = {
        productId: id,
        currentBid: enteredAmount,
        bidderName: userName,
      };

      socket.emit("placeBid", bidData);
      setAlertMessage("Bid placed successfully!");
      setCurrentBid(enteredAmount);
    } catch (error) {
      console.error("Error placing bid:", error);
      setAlertMessage("Failed to place bid. Please try again.");
    } finally {
      setBidAmount("");
      setDropdownVisible(false);
    }
  };

  useEffect(() => {
    let interval;
    if (isHovered && carData.images?.length > 0) {
      interval = setInterval(() => {
        setIndex((prevIndex) => (prevIndex + 1) % carData.images.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isHovered, carData.images]);

  const SkeletonLoading = () => {
    return (
      <div className="mt-32 mb-32">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-8 gap-6">
            {/* Left Column */}
            <div className="col-span-5">
              {/* Main Image Container */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
                <div className="relative">
                  <div className="carousel">
                    <div className="carousel-item">
                      <div className="w-full h-96 bg-gray-200 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Thumbnail Container */}
              <div className="bg-white rounded-lg shadow-lg p-4">
                <div className="grid grid-cols-4 gap-2 mt-4">
                  {[...Array(4)].map((_, idx) => (
                    <div
                      key={idx}
                      className="w-24 h-16 bg-gray-200 animate-pulse rounded-lg"
                    ></div>
                  ))}
                </div>
              </div>

              {/* Description Container */}
              <div className="mt-6">
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h4 className="text-xl font-bold mb-4">Description</h4>
                  <div className="h-4 bg-gray-200 animate-pulse rounded w-full"></div>
                  <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4 mt-2"></div>
                  <div className="h-4 bg-gray-200 animate-pulse rounded w-1/2 mt-2"></div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="col-span-3">
              {/* Bidding and Seller Info */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-2xl font-bold mb-4">
                  <div className="h-6 bg-gray-200 animate-pulse rounded w-3/4"></div>
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <div className="h-4 bg-gray-200 animate-pulse rounded w-1/2"></div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="h-4 bg-gray-200 animate-pulse rounded w-1/2"></div>
                  </div>
                  <div className="timer">
                    <h2 className="text-xl font-bold flex items-center space-x-2">
                      <div className="h-6 bg-gray-200 animate-pulse rounded w-1/2"></div>
                    </h2>
                    <div className="grid grid-cols-4 gap-2 mt-4">
                      {[...Array(4)].map((_, idx) => (
                        <div key={idx} className="text-center">
                          <div className="h-8 bg-gray-200 animate-pulse rounded w-full"></div>
                          <div className="h-4 bg-gray-200 animate-pulse rounded w-1/2 mt-1"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center space-x-2">
                  <div className="h-4 bg-gray-200 animate-pulse rounded w-1/2"></div>
                </div>
              </div>
              <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
                <h5 className="text-xl font-bold mb-4">
                  <div className="h-6 bg-gray-200 animate-pulse rounded w-1/2"></div>
                </h5>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-200 animate-pulse rounded-full"></div>
                  <div className="h-4 bg-gray-200 animate-pulse rounded w-1/2"></div>
                </div>
                <div className="mt-4">
                  <h6 className="text-lg font-semibold">
                    <div className="h-6 bg-gray-200 animate-pulse rounded w-1/2"></div>
                  </h6>
                  <div className="h-4 bg-gray-200 animate-pulse rounded w-1/2 mt-1"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return serverDown ? (
      <div className="pt-32 pb-32 text-center">
        <h2 className="text-2xl font-bold dark:text-white">
          Server Unavailable
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Please try again later.
        </p>
      </div>
    ) : (
      <SkeletonLoading />
    );
  }

  if (productDeleted) {
    return (
      <div className="pt-32 pb-32 text-center">
        <h2 className="text-2xl font-bold dark:text-white">
          Product No Longer Available
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          This product has been sold.
        </p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-32 bg-white dark:bg-[#191919] min-h-screen">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-8 gap-6">
          {/* Left Column */}
          <div className="col-span-5">
            {/* Main Image Container */}
            <div className="bg-white dark:bg-[#303030] rounded-lg shadow-lg overflow-hidden mb-6">
              <div
                className="relative"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <div className="carousel">
                  {carData.images?.length > 0 ? (
                    carData.images.map((image, idx) => (
                      <div
                        key={idx}
                        className={`carousel-item ${
                          index === idx ? "block" : "hidden"
                        }`}
                      >
                        <img
                          src={image.secure_url}
                          alt={`Slide ${idx + 1}`}
                          className="w-full h-96 object-contain bg-white dark:bg-gray-800"
                        />
                      </div>
                    ))
                  ) : (
                    <div className="w-full h-96 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <span className="text-gray-500 dark:text-gray-300">
                        No images available
                      </span>
                    </div>
                  )}
                </div>
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-2">
                  {carData.images?.map((_, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleSelect(idx)}
                      className={`h-1.5 w-8 rounded-full transition-all cursor-pointer ${
                        index === idx
                          ? "bg-white dark:bg-gray-200"
                          : "bg-gray-300 dark:bg-gray-600"
                      }`}
                    ></div>
                  ))}
                </div>
                {/* Navigation Arrows */}
                {carData.images?.length > 1 && (
                  <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={() =>
                        handleSelect(
                          (index - 1 + carData.images.length) %
                            carData.images.length
                        )
                      }
                      className="bg-black bg-opacity-50 dark:bg-white dark:bg-opacity-20 text-white dark:text-gray-200 p-2 rounded-full hover:bg-opacity-75 dark:hover:bg-opacity-30"
                    >
                      <FaChevronLeft className="text-2xl" />
                    </button>
                    <button
                      onClick={() =>
                        handleSelect((index + 1) % carData.images.length)
                      }
                      className="bg-black bg-opacity-50 dark:bg-white dark:bg-opacity-20 text-white dark:text-gray-200 p-2 rounded-full hover:bg-opacity-75 dark:hover:bg-opacity-30"
                    >
                      <FaChevronRight className="text-2xl" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Thumbnail Container */}
            {carData.images?.length > 0 && (
              <div className="bg-white dark:bg-[#303030] rounded-lg shadow-lg p-4">
                <div className="grid grid-cols-4 gap-2 mt-4">
                  {carData.images.map((image, idx) => (
                    <img
                      key={idx}
                      src={image.secure_url}
                      onClick={() => handleSelect(idx)}
                      className="w-24 h-16 object-cover rounded-lg cursor-pointer"
                      alt={`Thumbnail ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Description Container */}
            <div className="mt-6">
              <div className="bg-white dark:bg-[#303030] rounded-lg shadow-lg p-6">
                <h4 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                  Description
                </h4>

                {carData.description && carData.description.length > 0 ? (
                  <div className="space-y-2">
                    {carData.description.map((item, index) => (
                      <div key={index}>
                        <h5 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          {item.name}
                        </h5>
                        <p className="text-gray-600 dark:text-gray-300">
                          {item.description}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 dark:text-gray-300">
                    No description available
                  </p>
                )}

                <div className="z-2">
                  <ShareMenu />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="col-span-3">
            {/* Bidding and Seller Info */}
            <div className="bg-white dark:bg-[#303030] rounded-lg shadow-lg p-6">
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                {carData.name || "Product Name"}
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-gray-900 dark:text-gray-100">
                  <ImHammer2 className="text-xl" />
                  <span>Current Bid: ₹{currentBid}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-900 dark:text-gray-100">
                  <IoPerson className="text-xl" />
                  <span>Current Bidder: {bidderName || "None"}</span>
                </div>
                <div className="timer">
                  <h2 className="text-xl font-bold flex items-center space-x-2 text-gray-900 dark:text-white">
                    <span>
                      BID{" "}
                      {isBiddingStarted
                        ? isBiddingEnded
                          ? "HAS ENDED"
                          : "ENDS IN"
                        : "STARTS IN"}
                    </span>
                    <RiMapPinTimeFill className="text-xl" />
                  </h2>
                  <div className="grid grid-cols-4 gap-2 mt-4">
                    <div className="text-center">
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">
                        {timeLeft.days}
                      </span>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        DAYS
                      </div>
                    </div>
                    <div className="text-center">
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">
                        {timeLeft.hours}
                      </span>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        HOURS
                      </div>
                    </div>
                    <div className="text-center">
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">
                        {timeLeft.minutes}
                      </span>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        MINUTES
                      </div>
                    </div>
                    <div className="text-center">
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">
                        {timeLeft.seconds}
                      </span>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        SECONDS
                      </div>
                    </div>
                  </div>
                  {!isBiddingStarted ? null : (
                    <button
                      onClick={toggleDropdown}
                      disabled={isBiddingEnded || !userEmail}
                      className={`w-full mt-4 py-2 rounded-lg ${
                        isBiddingEnded
                          ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                          : !userEmail
                          ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                          : "bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
                      } text-white`}
                    >
                      {isBiddingEnded
                        ? "Bidding Ended"
                        : !userEmail
                        ? "Login to Bid"
                        : "Bid on this"}
                    </button>
                  )}
                </div>
              </div>
              {isDropdownVisible && (
                <div className="mt-4">
                  <div className="bg-white dark:bg-[#404040] rounded-lg shadow-lg p-4">
                    <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">
                      Enter Your Bid:
                    </label>
                    <input
                      type="number"
                      placeholder={`Minimum: ₹${currentBid + 200}`}
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      className="w-full p-2 border rounded-lg bg-white dark:bg-[#505050] dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                    />
                    <div
                      onClick={handleBidSubmit}
                      className="mt-4 flex justify-center"
                    >
                      <div className="w-24 h-24 bg-yellow-200 dark:bg-yellow-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-yellow-300 dark:hover:bg-yellow-700 transition">
                        <i className="fas fa-gavel text-4xl text-gray-800 dark:text-gray-200"></i>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {alertMessage && (
                <div
                  className={`mt-4 p-3 rounded-lg ${
                    alertMessage.includes("Invalid") ||
                    alertMessage.includes("Not enough")
                      ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                      : "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                  }`}
                >
                  {alertMessage}
                </div>
              )}
            </div>

            <div className="mt-6 bg-white dark:bg-[#303030] rounded-lg shadow-lg p-6">
              <div className="flex items-center space-x-2 text-gray-900 dark:text-gray-100">
                <MdAccountBalanceWallet className="text-xl" />
                <span>Balance: ₹{userMoney}</span>
              </div>
            </div>

            <div className="mt-6 bg-white dark:bg-[#303030] rounded-lg shadow-lg p-6">
              <h5 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                About Seller
              </h5>
              <div
                onClick={() =>
                  navigate("/seller-profile-view", {
                    state: { sellerEmail: carData.email },
                  })
                }
                className="flex items-center space-x-4 cursor-pointer"
              >
                <img
                  src={profilePicUrl || "/default-profile.png"}
                  alt="Seller"
                  className="w-12 h-12 rounded-full"
                />
                <span className="text-gray-900 dark:text-gray-100">
                  {sellerName || "Unknown Seller"}
                </span>
              </div>
              <div className="mt-4">
                <h6 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Seller's Reputation
                </h6>
                <p className="text-gray-700 dark:text-gray-300">⭐⭐⭐⭐☆</p>
              </div>
              <button
                onClick={() => navigate("/contact")}
                className="w-full mt-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors"
              >
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
