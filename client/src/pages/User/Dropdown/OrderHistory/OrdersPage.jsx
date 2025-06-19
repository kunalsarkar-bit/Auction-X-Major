import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { FaBoxOpen, FaRupeeSign, FaGavel, FaEye } from "react-icons/fa";
const API_URL = import.meta.env.VITE_API_URL;

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get user email from Redux store
  const userEmail = useSelector((state) => state.auth.user?.email);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!userEmail) {
        setLoading(false);
        return;
      }

      try {
        // Fetch orders for the specific user email

        const response = await axios.get(
          `${API_URL}/api/orders/user/${userEmail}`
        );
        // Ensure `orders` is always an array, even if API returns an object
        const receivedData = response.data;
        const ordersArray = Array.isArray(receivedData)
          ? receivedData
          : receivedData?.orders || receivedData?.data || [];

        setOrders(ordersArray);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to fetch orders");
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userEmail]);

  if (error) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 mx-auto mt-16 mb-12 bg-gray-50 text-gray-900 py-8 sm:py-10 rounded-lg shadow-lg">
        <p className="text-center text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 mx-auto mt-16 mb-12 bg-gray-50 dark:bg-[#191919] text-gray-900 dark:text-white py-8 sm:py-10 rounded-lg shadow-lg">
      <h2 className="text-center text-2xl sm:text-3xl font-semibold mb-6 sm:mb-8 flex items-center justify-center gap-2">
        <FaBoxOpen className="text-black dark:text-white" /> Your Orders
      </h2>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[1, 2, 3].map((index) => (
            <div
              key={index}
              className="bg-white dark:bg-[#303030] rounded-lg shadow-md p-4 sm:p-6 flex flex-col sm:flex-row border border-gray-200 dark:border-gray-600 animate-pulse"
            >
              <div className="w-full sm:w-40 h-40 flex-shrink-0 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
              <div className="w-full sm:pl-4 mt-4 sm:mt-0 flex flex-col justify-between">
                <div>
                  <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/3"></div>
                </div>
                <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded mt-4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <p className="text-center text-lg text-gray-800 dark:text-gray-300">
          No orders found.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white dark:bg-[#303030] rounded-lg shadow-md p-4 sm:p-6 flex flex-col sm:flex-row border border-gray-200 dark:border-gray-600"
            >
              <div className="w-full sm:w-40 h-40 flex-shrink-0 overflow-hidden">
                <img
                  src={
                    order.images[0]?.secure_url ||
                    "https://m.media-amazon.com/images/I/91nkc6fMx1L._AC_SY195_.jpg"
                  }
                  className="w-full h-full object-cover rounded-lg border border-gray-300 dark:border-gray-500"
                  alt={order.title || "Order Image"}
                />
              </div>
              <div className="w-full sm:pl-4 mt-4 sm:mt-0 flex flex-col justify-between">
                <div>
                  <h1
                    className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white line-clamp-2"
                    title={order.title}
                  >
                    {order.title}
                  </h1>
                  <h4 className="text-base sm:text-lg mt-2 flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <FaRupeeSign className="text-black dark:text-white" />{" "}
                    Price:{" "}
                    {order.biddingStartPrice
                      ? `₹${order.biddingStartPrice.toFixed(2)}`
                      : "N/A"}
                  </h4>
                  <h4 className="text-base sm:text-lg flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <FaGavel className="text-black dark:text-white" /> Highest
                    Bid:{" "}
                    {order.highestBid
                      ? `₹${order.highestBid.toFixed(2)}`
                      : "N/A"}
                  </h4>
                </div>
                <Link
                  to={`/order/${order._id}`}
                  className="mt-4 px-4 py-2 flex items-center justify-center gap-2 border border-black dark:border-white text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black rounded-md transition text-base sm:text-lg font-medium w-full"
                >
                  <FaEye /> View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
