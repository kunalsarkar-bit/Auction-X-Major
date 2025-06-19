import React, { useEffect, useState } from "react";

function RevenueVisitors() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;
  useEffect(() => {
    // Fetch data from the backend
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/api/items`);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setItems(data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">Error: {error}</div>;
  }

  const ellipsisStyle = {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "130px", // Adjust the width as needed
    display: "inline-block", // Use inline-block instead of block
  };

  return (
    <div className="col-span-full xl:col-span-8 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">
          Top Channels
        </h2>
      </header>
      <div className="p-3">
        {/* Table */}
        <div className="overflow-x-auto">
          <table
            className="table-auto w-full dark:text-gray-300"
            style={{ tableLayout: "fixed" }}
          >
            {/* Table header */}
            <thead className="text-xs uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/50 rounded-xs">
              <tr>
                <th className="p-2" style={{ width: "20%" }}>
                  <div className="font-semibold text-left">Products</div>
                </th>
                <th className="p-2" style={{ width: "20%" }}>
                  <div className="font-semibold text-center">
                    Products Visitors
                  </div>
                </th>
                <th className="p-2" style={{ width: "20%" }}>
                  <div className="font-semibold text-center">Revenues</div>
                </th>
                <th className="p-2" style={{ width: "20%" }}>
                  <div className="font-semibold text-center">
                    Seller Revenues
                  </div>
                </th>
                <th className="p-2" style={{ width: "20%" }}>
                  <div className="font-semibold text-center">
                    Total Revenues
                  </div>
                </th>
              </tr>
            </thead>
            {/* Table body */}
            <tbody className="text-sm font-medium divide-y divide-gray-100 dark:divide-gray-700/60">
              {items.map((item, index) => (
                <tr key={index}>
                  <td className="p-2">
                    <div className="flex items-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-8 h-8 mr-2 rounded-full"
                      />
                      <div
                        className="text-gray-800 dark:text-gray-100"
                        style={ellipsisStyle}
                      >
                        {item.name}
                      </div>
                    </div>
                  </td>
                  <td className="p-2">
                    <div className="text-center">
                      <div style={ellipsisStyle}>{item.visitors}</div>
                    </div>
                  </td>
                  <td className="p-2">
                    <div className="text-center text-green-500">
                      <div style={ellipsisStyle}>{item.revenue}</div>
                    </div>
                  </td>
                  <td className="p-2">
                    <div className="text-center">
                      <div style={ellipsisStyle}>{item.sellerRevenue}</div>
                    </div>
                  </td>
                  <td className="p-2">
                    <div className="text-center text-sky-500">
                      <div style={ellipsisStyle}>{item.totalRevenue}</div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default RevenueVisitors;
