import React, { useState, useEffect } from "react";
import axios from "axios";

function OrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState(null); // State for selected order (modal)
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const [orders, setOrders] = useState([]); // State for orders fetched from the backend
  const [totalPages, setTotalPages] = useState(1); // State for total pages
  const ordersPerPage = 5; // Number of orders to display per page
  const API_URL = import.meta.env.VITE_API_URL;
  // Fetch orders from the backend
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/orders?page=${currentPage}&limit=${ordersPerPage}`
        );
        setOrders(response.data.orders);
        setTotalPages(response.data.totalPages);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };

    fetchOrders();
  }, [currentPage]);

  // Function to handle "View" button click
  const handleViewDetails = (orderId) => {
    const order = orders.find((o) => o._id === orderId); // Find the selected order
    setSelectedOrder(order); // Set the selected order in state
  };

  // Function to close the modal
  const handleCloseModal = () => {
    setSelectedOrder(null); // Reset the selected order
  };

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  // Function to change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Inline styles for ellipsis
  const ellipsisStyle = {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "130px", // Adjust the width as needed
  };

  return (
    <div className="col-span-full xl:col-span-6 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">
          Orders
        </h2>
      </header>
      <div className="p-3">
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full">
            {/* Table header */}
            <thead className="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-semibold text-left">Item Name</div>
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-semibold text-left">User Email</div>
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-semibold text-left">Seller Email</div>
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-semibold text-left">Starting Price</div>
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-semibold text-left">Sold Price</div>
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-semibold text-left">Actions</div>
                </th>
              </tr>
            </thead>
            {/* Table body */}
            <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700/60">
              {orders.map((order) => (
                <tr key={order._id}>
                  <td className="p-2 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 shrink-0 mr-2 sm:mr-3">
                        <img
                          className="w-full h-full object-cover rounded-lg"
                          src={order.image}
                          width="40"
                          height="40"
                          alt={order.itemName}
                        />
                      </div>
                      <div className="font-medium text-gray-800 dark:text-gray-100">
                        <div style={ellipsisStyle}>{order.itemName}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <div className="text-left">
                      <div style={ellipsisStyle}>{order.userEmail}</div>
                    </div>
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <div className="text-left">
                      <div style={ellipsisStyle}>{order.sellerEmail}</div>
                    </div>
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <div className="text-left font-medium text-blue-500">
                      <div style={ellipsisStyle}>{order.startingPrice}</div>
                    </div>
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <div className="text-left font-medium text-green-500">
                      <div style={ellipsisStyle}>{order.soldPrice}</div>
                    </div>
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <button
                      onClick={() => handleViewDetails(order._id)} // Call handleViewDetails on click
                      className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
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
      </div>

      {/* Modal for Order Details */}
      {selectedOrder && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md shadow-lg">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                Order Details
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
              {/* Item Image and Name */}
              <div className="flex items-center space-x-4">
                <img
                  className="w-12 h-12 rounded-full"
                  src={selectedOrder.image}
                  alt={selectedOrder.itemName}
                />
                <div>
                  <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    {selectedOrder.itemName}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Sold to: {selectedOrder.userEmail}
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
                    {selectedOrder.userEmail}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Seller Email
                  </p>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                    {selectedOrder.sellerEmail}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Starting Price
                  </p>
                  <p className="text-sm font-medium text-blue-500">
                    {selectedOrder.startingPrice}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Sold Price
                  </p>
                  <p className="text-sm font-medium text-green-500">
                    {selectedOrder.soldPrice}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="mt-6 flex justify-end">
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

export default OrdersPage;
