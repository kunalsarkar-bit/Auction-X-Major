import React, { useState, useEffect } from "react";
import axios from "axios";

function SubscriptionPage() {
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [subscriptions, setSubscriptions] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const subscriptionsPerPage = 5;
  const API_URL = import.meta.env.VITE_API_URL;
  // Fetch subscriptions from the backend
  useEffect(() => {
    const fetchSubscriptions = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/api/subscriptions`);

        if (Array.isArray(response.data)) {
          setSubscriptions(response.data);
          setTotalPages(Math.ceil(response.data.length / subscriptionsPerPage));
        } else if (response.data && response.data.subscriptions) {
          setSubscriptions(response.data.subscriptions);
          setTotalPages(response.data.totalPages || 1);
        } else {
          console.error("Invalid response format:", response.data);
          setSubscriptions([]);
        }
      } catch (err) {
        console.error("Error fetching subscriptions:", err);
        setSubscriptions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, [currentPage]);

  // Function to handle "View" button click
  const handleViewDetails = (subscriptionId) => {
    const subscription = subscriptions.find((s) => s._id === subscriptionId);
    setSelectedSubscription(subscription);
  };

  // Function to close the modal
  const handleCloseModal = () => {
    setSelectedSubscription(null);
  };

  // Function to change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Get subscription status class
  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-700/20 dark:text-green-400";
      case "expired":
        return "bg-red-100 text-red-800 dark:bg-red-700/20 dark:text-red-400";
      case "cancelled":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700/20 dark:text-gray-400";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-700/20 dark:text-yellow-400";
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-700/20 dark:text-blue-400";
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Inline styles for ellipsis
  const ellipsisStyle = {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "130px",
  };

  return (
    <div className="col-span-full xl:col-span-6 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">
          Subscriptions
        </h2>
      </header>
      <div className="p-3">
        {/* Loading indicator */}
        {loading ? (
          <div className="text-center py-4">
            <p className="text-gray-500 dark:text-gray-400">
              Loading subscriptions...
            </p>
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="table-auto w-full">
                {/* Table header */}
                <thead className="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="p-2 whitespace-nowrap">
                      <div className="font-semibold text-left">Plan</div>
                    </th>
                    <th className="p-2 whitespace-nowrap">
                      <div className="font-semibold text-left">User</div>
                    </th>
                    <th className="p-2 whitespace-nowrap">
                      <div className="font-semibold text-left">Status</div>
                    </th>
                    <th className="p-2 whitespace-nowrap">
                      <div className="font-semibold text-left">Start Date</div>
                    </th>
                    <th className="p-2 whitespace-nowrap">
                      <div className="font-semibold text-left">End Date</div>
                    </th>
                    <th className="p-2 whitespace-nowrap">
                      <div className="font-semibold text-left">Price</div>
                    </th>
                    <th className="p-2 whitespace-nowrap">
                      <div className="font-semibold text-left">Actions</div>
                    </th>
                  </tr>
                </thead>
                {/* Table body */}
                <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700/60">
                  {subscriptions && subscriptions.length > 0 ? (
                    subscriptions.map((subscription) => (
                      <tr key={subscription._id}>
                        <td className="p-2 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 shrink-0 mr-2 sm:mr-3">
                              <div className="w-full h-full rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-300 font-semibold text-xs">
                                {subscription.planName
                                  .substring(0, 2)
                                  .toUpperCase()}
                              </div>
                            </div>
                            <div className="font-medium text-gray-800 dark:text-gray-100">
                              <div style={ellipsisStyle}>
                                {subscription.planName}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-2 whitespace-nowrap">
                          <div className="text-left">
                            <div style={ellipsisStyle}>
                              {subscription.userEmail}
                            </div>
                          </div>
                        </td>
                        <td className="p-2 whitespace-nowrap">
                          <div
                            className={`text-left inline-flex px-2 py-1 rounded-full text-xs font-semibold ${getStatusClass(
                              subscription.status
                            )}`}
                          >
                            {subscription.status}
                          </div>
                        </td>
                        <td className="p-2 whitespace-nowrap">
                          <div className="text-left text-gray-500 dark:text-gray-400">
                            {formatDate(subscription.startDate)}
                          </div>
                        </td>
                        <td className="p-2 whitespace-nowrap">
                          <div className="text-left text-gray-500 dark:text-gray-400">
                            {formatDate(subscription.endDate)}
                          </div>
                        </td>
                        <td className="p-2 whitespace-nowrap">
                          <div className="text-left font-medium text-blue-500">
                            ${subscription.price.toFixed(2)}
                          </div>
                        </td>
                        <td className="p-2 whitespace-nowrap">
                          <button
                            onClick={() => handleViewDetails(subscription._id)}
                            className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="7"
                        className="p-4 text-center text-gray-500 dark:text-gray-400"
                      >
                        No subscriptions found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination - only show if there are subscriptions */}
            {subscriptions && subscriptions.length > 0 && (
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-200"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-200"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal for Subscription Details */}
      {selectedSubscription && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md shadow-lg">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                Subscription Details
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition duration-200"
              >
                &times;
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-4">
              {/* Plan Name and Icon */}
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-300 font-semibold text-lg">
                  {selectedSubscription.planName.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    {selectedSubscription.planName}
                  </p>
                  <p
                    className={`text-sm inline-flex px-2 py-1 rounded-full text-xs font-semibold ${getStatusClass(
                      selectedSubscription.status
                    )}`}
                  >
                    {selectedSubscription.status}
                  </p>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    User Email
                  </p>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                    {selectedSubscription.userEmail}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Subscription ID
                  </p>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100 break-all">
                    {selectedSubscription._id}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Start Date
                  </p>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                    {new Date(
                      selectedSubscription.startDate
                    ).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    End Date
                  </p>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                    {new Date(
                      selectedSubscription.endDate
                    ).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Price
                  </p>
                  <p className="text-sm font-medium text-blue-500">
                    ${selectedSubscription.price.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Auto Renew
                  </p>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                    {selectedSubscription.autoRenew ? "Yes" : "No"}
                  </p>
                </div>
                {selectedSubscription.features && (
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Features
                    </p>
                    <ul className="list-disc pl-5 text-sm font-medium text-gray-800 dark:text-gray-100">
                      {selectedSubscription.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="mt-6 flex justify-end space-x-2">
              {selectedSubscription.status.toLowerCase() === "active" && (
                <button className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200">
                  Cancel Subscription
                </button>
              )}
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SubscriptionPage;
