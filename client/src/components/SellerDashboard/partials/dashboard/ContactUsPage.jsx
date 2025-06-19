import React, { useState, useEffect } from "react";
import axios from "axios";

function AdminContactUsPage() {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const contactsPerPage = 5;

  // Fetch contact messages from the backend
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await axios.get("https://localhost:5000/api/contact");
        setContacts(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching contact messages:", error);
        setError("Failed to fetch contact messages. Please try again later.");
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  // Function to handle "View" button click
  const handleViewDetails = (contact) => {
    setSelectedContact(contact);
  };

  // Function to close the modal
  const handleCloseModal = () => {
    setSelectedContact(null);
  };

  // Pagination logic
  const indexOfLastContact = currentPage * contactsPerPage;
  const indexOfFirstContact = indexOfLastContact - contactsPerPage;
  const currentContacts = Array.isArray(contacts) ? 
    contacts.slice(indexOfFirstContact, indexOfLastContact) : [];

  // Function to change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Display loading state
  if (loading) {
    return (
      <div className="col-span-full xl:col-span-6 bg-white dark:bg-gray-800 shadow-xs rounded-xl p-5">
        <p>Loading contact messages...</p>
      </div>
    );
  }

  // Display error state
  if (error) {
    return (
      <div className="col-span-full xl:col-span-6 bg-white dark:bg-gray-800 shadow-xs rounded-xl p-5">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  // Inline styles for ellipsis
  const ellipsisStyle = {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "150px",
  };

  return (
    <div className="col-span-full xl:col-span-6 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">
          Contact Messages
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
                  <div className="font-semibold text-left">Name</div>
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-semibold text-left">Email</div>
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-semibold text-left">Subject</div>
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-semibold text-left">Date</div>
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-semibold text-left">Actions</div>
                </th>
              </tr>
            </thead>
            {/* Table body */}
            <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700/60">
              {currentContacts.map((contact) => (
                <tr key={contact._id}>
                  <td className="p-2 whitespace-nowrap">
                    <div className="font-medium text-gray-800 dark:text-gray-100">
                      <div style={ellipsisStyle}>{contact.name}</div>
                    </div>
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <div className="text-left">
                      <div style={ellipsisStyle}>{contact.email}</div>
                    </div>
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <div className="text-left">
                      <div style={ellipsisStyle}>{contact.subject}</div>
                    </div>
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <div className="text-left text-gray-600 dark:text-gray-400">
                      {new Date(contact.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <button
                      onClick={() => handleViewDetails(contact)}
                      className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200 mr-2"
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
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-200 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Page {currentPage} of{" "}
            {Math.ceil(contacts.length / contactsPerPage)}
          </span>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={
              currentPage === Math.ceil(contacts.length / contactsPerPage)
            }
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-200 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Modal for Contact Details */}
      {selectedContact && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-2xl shadow-lg max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                Contact Message Details
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition duration-200 text-2xl"
              >
                &times;
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Name
                  </p>
                  <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    {selectedContact.name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Email
                  </p>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                    {selectedContact.email}
                  </p>
                </div>
              </div>

              {/* Subject */}
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  Subject
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                  {selectedContact.subject}
                </p>
              </div>

              {/* Date Created */}
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  Date Submitted
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                  {new Date(selectedContact.createdAt).toLocaleString()}
                </p>
              </div>

              {/* Message Details */}
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  Message
                </p>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm text-gray-800 dark:text-gray-100 whitespace-pre-wrap">
                    {selectedContact.message}
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

export default AdminContactUsPage;