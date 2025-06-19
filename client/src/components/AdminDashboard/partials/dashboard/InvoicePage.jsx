import React, { useState, useEffect } from "react";
import axios from "axios";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

function Invoice() {
  const [currentPage, setCurrentPage] = useState(1);
  const [orders, setOrders] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const ordersPerPage = 5;
  const API_URL = import.meta.env.VITE_API_URL;
  // SVG placeholder as data URI
  const placeholderImage = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' fill='%23e5e7eb'/%3E%3Ctext x='50%' y='50%' font-family='sans-serif' font-size='10' fill='%236b7280' text-anchor='middle' dominant-baseline='middle'%3ENo Image%3C/text%3E%3C/svg%3E`;

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${API_URL}/api/orders`, {
          params: { page: currentPage, limit: ordersPerPage },
          headers: { "Content-Type": "application/json" },
        });

        if (Array.isArray(response.data)) {
          setOrders(response.data);
          setTotalPages(Math.ceil(response.data.length / ordersPerPage));
        } else if (response.data && Array.isArray(response.data.orders)) {
          setOrders(response.data.orders);
          setTotalPages(response.data.totalPages || 1);
        } else {
          console.error("Invalid response format:", response.data);
          setOrders([]);
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to fetch orders. Please try again later.");
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [currentPage]);

  const handleDownloadInvoice = async (orderId) => {
    const order = orders.find((o) => o._id === orderId);
    if (order) {
      try {
        // Step 1: Create a PDF document
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([595, 842]); // A4 size in points

        // Step 2: Set up fonts
        const helveticaBold = await pdfDoc.embedFont(
          StandardFonts.HelveticaBold
        );
        const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const timesRoman = await pdfDoc.embedFont(StandardFonts.TimesRoman);

        const { width, height } = page.getSize();

        // For debugging - log entire order object
        console.log(
          "Creating invoice for order:",
          JSON.stringify(order, null, 2)
        );

        // Step 3: Draw header with company name
        page.drawText("Auction X", {
          x: 50,
          y: height - 50,
          size: 24,
          font: helveticaBold,
          color: rgb(0.2, 0.2, 0.2),
        });

        // Step 4: Draw invoice title
        page.drawText("Order Invoice", {
          x: width - 150,
          y: height - 50,
          size: 20,
          font: helveticaBold,
          color: rgb(0.2, 0.2, 0.2),
        });

        // Step 5: Draw a horizontal divider
        page.drawLine({
          start: { x: 50, y: height - 70 },
          end: { x: width - 50, y: height - 70 },
          thickness: 1,
          color: rgb(0.8, 0.8, 0.8),
        });

        // Step 6: Draw invoice details section
        page.drawText("Invoice Details", {
          x: 50,
          y: height - 90,
          size: 14,
          font: helveticaBold,
          color: rgb(0.3, 0.3, 0.3),
        });

        // Create a safe ID string (in case order._id is undefined)
        const orderId = order._id || "N/A";
        page.drawText(`Invoice ID: #${orderId}`, {
          x: 50,
          y: height - 110,
          size: 11,
          font: helvetica,
          color: rgb(0.3, 0.3, 0.3),
        });

        // Handle dates safely
        let createdAt;
        try {
          createdAt = new Date(order.createdAt || Date.now());
        } catch (e) {
          createdAt = new Date();
        }

        const date = createdAt.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });

        const time = createdAt.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        });

        page.drawText(`Date: ${date}`, {
          x: 50,
          y: height - 125,
          size: 11,
          font: helvetica,
          color: rgb(0.3, 0.3, 0.3),
        });

        page.drawText(`Time: ${time}`, {
          x: 50,
          y: height - 140,
          size: 11,
          font: helvetica,
          color: rgb(0.3, 0.3, 0.3),
        });

        // Step 7: Draw buyer details section
        page.drawText("Buyer Details", {
          x: 50,
          y: height - 180,
          size: 14,
          font: helveticaBold,
          color: rgb(0.3, 0.3, 0.3),
        });

        // Ensure we have buyer information
        const buyerName = order.name || order.userName || "N/A";
        const buyerEmail = order.userEmail || order.email || "N/A";
        const buyerPhone = order.phoneNo || order.phone || "N/A";
        const buyerAddress = order.address || order.shippingAddress || "N/A";

        page.drawText(`Name: ${buyerName}`, {
          x: 50,
          y: height - 200,
          size: 11,
          font: helvetica,
          color: rgb(0.3, 0.3, 0.3),
        });

        page.drawText(`Email: ${buyerEmail}`, {
          x: 50,
          y: height - 215,
          size: 11,
          font: helvetica,
          color: rgb(0.3, 0.3, 0.3),
        });

        page.drawText(`Phone Number: ${buyerPhone}`, {
          x: 50,
          y: height - 230,
          size: 11,
          font: helvetica,
          color: rgb(0.3, 0.3, 0.3),
        });

        page.drawText(`Address: ${buyerAddress}`, {
          x: 50,
          y: height - 245,
          size: 11,
          font: helvetica,
          color: rgb(0.3, 0.3, 0.3),
          maxWidth: 250,
          lineHeight: 14,
        });

        // Step 8: Draw seller details section
        page.drawText("Seller Details", {
          x: width - 250,
          y: height - 180,
          size: 14,
          font: helveticaBold,
          color: rgb(0.3, 0.3, 0.3),
        });

        // Ensure we have seller information
        const sellerEmail = order.sellerEmail || order.seller?.email || "N/A";
        page.drawText(`Email: ${sellerEmail}`, {
          x: width - 250,
          y: height - 200,
          size: 11,
          font: helvetica,
          color: rgb(0.3, 0.3, 0.3),
        });

        // Draw a horizontal divider
        page.drawLine({
          start: { x: 50, y: height - 270 },
          end: { x: width - 50, y: height - 270 },
          thickness: 1,
          color: rgb(0.8, 0.8, 0.8),
        });

        // Step 9: Draw order information section
        page.drawText("Order Information", {
          x: 50,
          y: height - 290,
          size: 14,
          font: helveticaBold,
          color: rgb(0.3, 0.3, 0.3),
        });

        // Ensure we have item information
        const itemName =
          order.title || order.itemName || order.item?.name || "N/A";
        const itemCategory = order.category || order.item?.category || "N/A";

        page.drawText(`Item Name: ${itemName}`, {
          x: 50,
          y: height - 310,
          size: 11,
          font: helvetica,
          color: rgb(0.3, 0.3, 0.3),
        });

        page.drawText(`Category: ${itemCategory}`, {
          x: 50,
          y: height - 325,
          size: 11,
          font: helvetica,
          color: rgb(0.3, 0.3, 0.3),
        });

        // Step 10: Draw image placeholder
        const imageUrl =
          order.images?.[0]?.secure_url || order.image || order.item?.image;

        page.drawRectangle({
          x: 50,
          y: height - 440,
          width: 150,
          height: 100,
          borderColor: rgb(0.8, 0.8, 0.8),
          borderWidth: 1,
          color: rgb(0.95, 0.95, 0.95),
        });

        if (imageUrl) {
          page.drawText("Image preview", {
            x: 85,
            y: height - 390,
            size: 12,
            font: helvetica,
            color: rgb(0.5, 0.5, 0.5),
          });
          page.drawText("available in app", {
            x: 80,
            y: height - 405,
            size: 12,
            font: helvetica,
            color: rgb(0.5, 0.5, 0.5),
          });
        } else {
          page.drawText("No image available", {
            x: 75,
            y: height - 400,
            size: 12,
            font: helvetica,
            color: rgb(0.5, 0.5, 0.5),
          });
        }

        // Step 11: Draw price breakdown section
        page.drawText("Price Breakdown", {
          x: width - 250,
          y: height - 290,
          size: 14,
          font: helveticaBold,
          color: rgb(0.3, 0.3, 0.3),
        });

        // Ensure we have price information
        const startingPrice =
          order.biddingStartPrice ||
          order.startingPrice ||
          order.item?.startingPrice ||
          0;
        const highestBid =
          order.highestBid ||
          order.soldPrice ||
          order.item?.soldPrice ||
          startingPrice;

        page.drawText(`Starting Bid Price: Rs. ${startingPrice}`, {
          x: width - 250,
          y: height - 310,
          size: 11,
          font: helvetica,
          color: rgb(0.3, 0.3, 0.3),
        });

        page.drawText(`Final/Highest Bid Price: Rs. ${highestBid}`, {
          x: width - 250,
          y: height - 325,
          size: 11,
          font: helvetica,
          color: rgb(0.3, 0.3, 0.3),
        });

        page.drawText(`Total Amount Paid: Rs. ${highestBid}`, {
          x: width - 250,
          y: height - 340,
          size: 11,
          font: helveticaBold,
          color: rgb(0.3, 0.3, 0.3),
        });

        // Draw a horizontal divider
        page.drawLine({
          start: { x: 50, y: height - 460 },
          end: { x: width - 50, y: height - 460 },
          thickness: 1,
          color: rgb(0.8, 0.8, 0.8),
        });

        // Step 12: Draw additional information
        page.drawText("Additional Information", {
          x: 50,
          y: height - 480,
          size: 14,
          font: helveticaBold,
          color: rgb(0.3, 0.3, 0.3),
        });

        // Handle update dates safely
        let updatedAt;
        try {
          updatedAt = new Date(order.updatedAt || createdAt);
        } catch (e) {
          updatedAt = createdAt;
        }

        const updatedDate = updatedAt.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });

        page.drawText(`Created At: ${date} ${time}`, {
          x: 50,
          y: height - 500,
          size: 10,
          font: helvetica,
          color: rgb(0.4, 0.4, 0.4),
        });

        page.drawText(`Updated At: ${updatedDate}`, {
          x: 50,
          y: height - 515,
          size: 10,
          font: helvetica,
          color: rgb(0.4, 0.4, 0.4),
        });

        // Step 13: Draw footer
        page.drawLine({
          start: { x: 50, y: 70 },
          end: { x: width - 50, y: 70 },
          thickness: 1,
          color: rgb(0.8, 0.8, 0.8),
        });

        page.drawText("Thank you for using Auction X!", {
          x: width / 2 - 100,
          y: 50,
          size: 12,
          font: helveticaBold,
          color: rgb(0.3, 0.3, 0.3),
        });

        page.drawText(
          "For any queries, contact our support at support@auctionx.com",
          {
            x: width / 2 - 180,
            y: 30,
            size: 10,
            font: helvetica,
            color: rgb(0.4, 0.4, 0.4),
          }
        );

        // Serialize the PDF to bytes and download
        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `AuctionX_Invoice_${orderId}.pdf`;

        // Add a slight delay before clicking to ensure all rendering is complete
        setTimeout(() => {
          link.click();
          URL.revokeObjectURL(url);
        }, 100);
      } catch (err) {
        console.error("Error generating PDF:", err);
        console.error("Order data:", order);
        alert("Failed to generate invoice. Please check console for details.");
      }
    }
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const ellipsisStyle = {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "130px",
  };

  if (isLoading) {
    return (
      <div className="col-span-full xl:col-span-6 bg-white dark:bg-gray-800 shadow-xs rounded-xl p-5">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="col-span-full xl:col-span-6 bg-white dark:bg-gray-800 shadow-xs rounded-xl p-5">
        <div className="flex flex-col justify-center items-center h-64">
          <svg
            className="w-12 h-12 text-red-500 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
          <button
            onClick={() => {
              setError(null);
              setCurrentPage(1);
            }}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const hasOrders = Array.isArray(orders) && orders.length > 0;

  return (
    <div className="col-span-full xl:col-span-6 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">
          Order History
        </h2>
      </header>
      <div className="p-3">
        {!hasOrders ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500 dark:text-gray-400">No orders found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="table-auto w-full">
                <thead className="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="p-2 whitespace-nowrap">
                      <div className="font-semibold text-left">Item</div>
                    </th>
                    <th className="p-2 whitespace-nowrap">
                      <div className="font-semibold text-left">Buyer Email</div>
                    </th>
                    <th className="p-2 whitespace-nowrap">
                      <div className="font-semibold text-left">
                        Seller Email
                      </div>
                    </th>
                    <th className="p-2 whitespace-nowrap">
                      <div className="font-semibold text-left">Start Price</div>
                    </th>
                    <th className="p-2 whitespace-nowrap">
                      <div className="font-semibold text-left">Highest Bid</div>
                    </th>
                    <th className="p-2 whitespace-nowrap">
                      <div className="font-semibold text-left">Actions</div>
                    </th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700/60">
                  {orders.map((order) => {
                    const itemName = order.title || order.itemName || "N/A";
                    const startingPrice =
                      order.biddingStartPrice || order.startingPrice || 0;
                    const highestBid =
                      order.highestBid || order.soldPrice || startingPrice;
                    const imageUrl =
                      order.images?.[0]?.secure_url || order.image;

                    return (
                      <tr key={order._id}>
                        <td className="p-2 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 shrink-0 mr-2 sm:mr-3">
                              {imageUrl ? (
                                <img
                                  className="w-full h-full object-cover rounded-lg"
                                  src={imageUrl}
                                  width="40"
                                  height="40"
                                  alt={itemName}
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = placeholderImage;
                                  }}
                                />
                              ) : (
                                <div
                                  className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center"
                                  dangerouslySetInnerHTML={{
                                    __html: placeholderImage,
                                  }}
                                />
                              )}
                            </div>
                            <div className="font-medium text-gray-800 dark:text-gray-100">
                              <div style={ellipsisStyle} title={itemName}>
                                {itemName}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-2 whitespace-nowrap">
                          <div className="text-left">
                            <div style={ellipsisStyle} title={order.userEmail}>
                              {order.userEmail}
                            </div>
                          </div>
                        </td>
                        <td className="p-2 whitespace-nowrap">
                          <div className="text-left">
                            <div
                              style={ellipsisStyle}
                              title={order.sellerEmail}
                            >
                              {order.sellerEmail}
                            </div>
                          </div>
                        </td>
                        <td className="p-2 whitespace-nowrap">
                          <div className="text-left font-medium text-blue-500">
                            ₹{startingPrice}
                          </div>
                        </td>
                        <td className="p-2 whitespace-nowrap">
                          <div className="text-left font-medium text-green-500">
                            ₹{highestBid}
                          </div>
                        </td>
                        <td className="p-2 whitespace-nowrap">
                          <button
                            onClick={() => handleDownloadInvoice(order._id)}
                            className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
                          >
                            Download Invoice
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md transition duration-200 ${
                  currentPage === 1
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                Previous
              </button>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md transition duration-200 ${
                  currentPage === totalPages
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Invoice;
