import React, { useState, useContext } from "react";
import { useSelector } from "react-redux";
import { useThemeProvider } from "../../../../AdminDashboard/utils/ThemeContext";

const Report = () => {
  // Get user info from Redux
  const { user } = useSelector((state) => state.auth || {});

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    orderNumber: "",
    reportType: "",
    details: "",
    attachments: [],
  });
  const API_URL = import.meta.env.VITE_API_URL;
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [imagePreviews, setImagePreviews] = useState([]);
  const { currentTheme } = useThemeProvider();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    // Restrict to maximum 2 images
    if (files.length > 2) {
      setError("You can only upload a maximum of 2 files.");
      return;
    }

    // Validate file types and sizes
    const validFiles = [];
    const previews = [];

    for (let file of files) {
      // Check file type
      if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
        setError(
          "Only image files (PNG, JPG, JPEG) and PDF files are allowed."
        );
        return;
      }

      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        setError("File size must be less than 10MB.");
        return;
      }

      validFiles.push(file);

      // Create preview for images
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          previews.push({
            file: file,
            url: e.target.result,
            type: "image",
          });
          if (
            previews.length ===
            files.filter((f) => f.type.startsWith("image/")).length
          ) {
            setImagePreviews((prev) => [
              ...prev.filter((p) => p.type !== "image"),
              ...previews,
            ]);
          }
        };
        reader.readAsDataURL(file);
      } else {
        previews.push({
          file: file,
          url: null,
          type: "pdf",
        });
      }
    }

    setError("");
    setFormData({
      ...formData,
      attachments: validFiles,
    });

    // Set previews for non-image files immediately
    const nonImagePreviews = files
      .filter((f) => !f.type.startsWith("image/"))
      .map((file) => ({
        file: file,
        url: null,
        type: "pdf",
      }));

    if (nonImagePreviews.length > 0) {
      setImagePreviews((prev) => [
        ...prev.filter((p) => p.type !== "pdf"),
        ...nonImagePreviews,
      ]);
    }

    // If only images, set empty previews for now (will be filled by FileReader)
    if (files.every((f) => f.type.startsWith("image/"))) {
      setImagePreviews([]);
    }
  };

  const removeFile = (index) => {
    const newAttachments = formData.attachments.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);

    setFormData({
      ...formData,
      attachments: newAttachments,
    });
    setImagePreviews(newPreviews);
  };

  const validateForm = () => {
    // Check required fields and trim them
    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedDetails = formData.details.trim();

    if (!trimmedName) {
      setError("Name is required.");
      return false;
    }

    if (!trimmedEmail) {
      setError("Email is required.");
      return false;
    }

    // Basic email validation
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return false;
    }

    if (!formData.reportType) {
      setError("Please select a report type.");
      return false;
    }

    if (!trimmedDetails) {
      setError("Please provide details about your issue.");
      return false;
    }

    if (trimmedDetails.length < 10) {
      setError("Please provide at least 10 characters describing your issue.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    // Validate form before submission
    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      const submitData = new FormData();

      // Add form fields (trim strings to remove empty spaces)
      submitData.append("name", formData.name.trim());
      submitData.append("email", formData.email.trim());
      submitData.append("reportType", formData.reportType);
      submitData.append("details", formData.details.trim());

      // Only add orderNumber if it's not empty
      const trimmedOrderNumber = formData.orderNumber.trim();
      if (trimmedOrderNumber) {
        submitData.append("orderNumber", trimmedOrderNumber);
      }

      // Append files
      formData.attachments.forEach((file) => {
        submitData.append("attachments", file);
      });

      const response = await fetch(`${API_URL}/api/admin/reports`, {
        method: "POST",
        body: submitData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            result.errors?.join(", ") ||
            "Failed to submit report"
        );
      }

      console.log("Report submitted successfully:", result);
      setIsSubmitted(true);

      // Reset form
      setFormData({
        name: user?.name || "",
        email: user?.email || "",
        orderNumber: "",
        reportType: "",
        details: "",
        attachments: [],
      });
      setImagePreviews([]);

      // Reset file input
      const fileInput = document.getElementById("file-upload");
      if (fileInput) {
        fileInput.value = "";
      }
    } catch (error) {
      console.error("Error submitting report:", error);
      setError(error.message || "Failed to submit report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const reportTypes = [
    { id: "delivery", label: "Product Delivery Issues" },
    { id: "illegal", label: "Illegal or Unethical Items" },
    { id: "payment-deposit", label: "Payment Issues - Depositing Money" },
    { id: "payment-withdraw", label: "Payment Issues - Withdrawing Money" },
    { id: "other", label: "Other Issues" },
  ];

  // Dark mode classes
  const darkModeClasses = {
    bg: currentTheme === "dark" ? "bg-[#191919]" : "bg-white",
    containerBg: currentTheme === "dark" ? "bg-[#303030]" : "bg-gray-50",
    border: currentTheme === "dark" ? "border-gray-600" : "border-gray-200",
    textPrimary: currentTheme === "dark" ? "text-white" : "text-gray-900",
    textSecondary: currentTheme === "dark" ? "text-gray-300" : "text-gray-600",
    inputBg:
      currentTheme === "dark"
        ? "bg-[#404040] border-gray-500 text-white"
        : "bg-white border-gray-300",
    headerBg: currentTheme === "dark" ? "bg-[#404040]" : "bg-gray-100",
    successBg:
      currentTheme === "dark"
        ? "bg-green-900 border-green-700"
        : "bg-green-50 border-green-200",
    helpBg:
      currentTheme === "dark"
        ? "bg-blue-900 border-blue-700"
        : "bg-blue-50 border-blue-100",
    helpText: currentTheme === "dark" ? "text-blue-200" : "text-blue-700",
    helpTitle: currentTheme === "dark" ? "text-blue-100" : "text-blue-900",
  };

  return (
    <div className={`min-h-screen ${darkModeClasses.bg} mt-20`}>
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1
            className={`text-3xl font-bold ${darkModeClasses.textPrimary} mb-2`}
          >
            Report an Issue
          </h1>
          <p className={`text-lg ${darkModeClasses.textSecondary}`}>
            We take all reports seriously and will address your concerns as
            quickly as possible
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {isSubmitted ? (
          // Success message
          <div
            className={`${darkModeClasses.successBg} border rounded-lg p-8 text-center`}
          >
            <div className="inline-flex justify-center items-center w-12 h-12 rounded-full bg-green-100 mb-4">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
            <h2
              className={`text-2xl font-semibold ${darkModeClasses.textPrimary} mb-2`}
            >
              Report Submitted Successfully
            </h2>
            <p className={`${darkModeClasses.textSecondary} mb-6`}>
              Thank you for your report. Our team will review it and get back to
              you within 24-48 hours.
            </p>
            <button
              onClick={() => setIsSubmitted(false)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Submit Another Report
            </button>
          </div>
        ) : (
          // Report form
          <div
            className={`${darkModeClasses.containerBg} rounded-lg shadow-sm border ${darkModeClasses.border}`}
          >
            <div
              className={`px-6 py-5 border-b ${darkModeClasses.border} ${darkModeClasses.headerBg} rounded-t-lg`}
            >
              <h2
                className={`text-xl font-medium ${darkModeClasses.textPrimary}`}
              >
                Report Details
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                {/* Name - Not editable if from Redux */}
                <div className="sm:col-span-1">
                  <label
                    htmlFor="name"
                    className={`block text-sm font-medium ${darkModeClasses.textSecondary} mb-1`}
                  >
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    readOnly={!!user?.name}
                    className={`block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border ${
                      darkModeClasses.inputBg
                    } ${!!user?.name ? "cursor-not-allowed opacity-75" : ""}`}
                    placeholder="Enter your full name"
                  />
                  {!!user?.name && (
                    <p
                      className={`text-xs ${darkModeClasses.textSecondary} mt-1`}
                    >
                      Name from your account profile
                    </p>
                  )}
                </div>

                {/* Email - Not editable if from Redux */}
                <div className="sm:col-span-1">
                  <label
                    htmlFor="email"
                    className={`block text-sm font-medium ${darkModeClasses.textSecondary} mb-1`}
                  >
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    readOnly={!!user?.email}
                    className={`block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border ${
                      darkModeClasses.inputBg
                    } ${!!user?.email ? "cursor-not-allowed opacity-75" : ""}`}
                    placeholder="Enter your email address"
                  />
                  {!!user?.email && (
                    <p
                      className={`text-xs ${darkModeClasses.textSecondary} mt-1`}
                    >
                      Email from your account profile
                    </p>
                  )}
                </div>

                {/* Order Number */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="orderNumber"
                    className={`block text-sm font-medium ${darkModeClasses.textSecondary} mb-1`}
                  >
                    Order/Listing Number (optional)
                  </label>
                  <input
                    type="text"
                    name="orderNumber"
                    id="orderNumber"
                    value={formData.orderNumber}
                    onChange={handleChange}
                    className={`block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border ${darkModeClasses.inputBg}`}
                    placeholder="Enter order or listing number if applicable"
                  />
                </div>

                {/* Report Type */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="reportType"
                    className={`block text-sm font-medium ${darkModeClasses.textSecondary} mb-1`}
                  >
                    Issue Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="reportType"
                    name="reportType"
                    required
                    value={formData.reportType}
                    onChange={handleChange}
                    className={`block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border ${darkModeClasses.inputBg}`}
                  >
                    <option value="">Select an issue type</option>
                    {reportTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Issue Details */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="details"
                    className={`block text-sm font-medium ${darkModeClasses.textSecondary} mb-1`}
                  >
                    Describe Your Issue <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="details"
                    name="details"
                    rows={5}
                    required
                    value={formData.details}
                    onChange={handleChange}
                    className={`block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border ${darkModeClasses.inputBg}`}
                    placeholder="Please provide detailed information about the issue... (minimum 10 characters)"
                    minLength={10}
                  />
                  <p
                    className={`text-xs ${darkModeClasses.textSecondary} mt-1`}
                  >
                    {formData.details.length}/10 characters minimum
                  </p>
                </div>

                {/* File Upload */}
                <div className="sm:col-span-2">
                  <label
                    className={`block text-sm font-medium ${darkModeClasses.textSecondary} mb-1`}
                  >
                    Attachments (optional) - Maximum 2 files
                  </label>
                  <div
                    className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 ${darkModeClasses.border} border-dashed rounded-md`}
                  >
                    <div className="space-y-1 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                        >
                          <span>Upload files</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            multiple
                            accept="image/*,.pdf"
                            onChange={handleFileChange}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, PDF up to 10MB (Max 2 files)
                      </p>
                    </div>
                  </div>

                  {/* File Previews */}
                  {imagePreviews.length > 0 && (
                    <div className="mt-4">
                      <h4
                        className={`text-sm font-medium ${darkModeClasses.textSecondary} mb-2`}
                      >
                        Selected Files:
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="relative">
                            {preview.type === "image" ? (
                              <div className="relative">
                                <img
                                  src={preview.url}
                                  alt={`Preview ${index + 1}`}
                                  className="w-full h-32 object-cover rounded-lg border"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeFile(index)}
                                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                                >
                                  ×
                                </button>
                              </div>
                            ) : (
                              <div
                                className={`${darkModeClasses.containerBg} border ${darkModeClasses.border} rounded-lg p-4 flex items-center justify-between`}
                              >
                                <div className="flex items-center">
                                  <svg
                                    className="w-8 h-8 text-red-500 mr-3"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  <span
                                    className={`text-sm ${darkModeClasses.textPrimary}`}
                                  >
                                    {preview.file.name}
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeFile(index)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <svg
                                    className="w-5 h-5"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setFormData({
                      name: user?.name || "",
                      email: user?.email || "",
                      orderNumber: "",
                      reportType: "",
                      details: "",
                      attachments: [],
                    });
                    setImagePreviews([]);
                    setError("");
                    const fileInput = document.getElementById("file-upload");
                    if (fileInput) fileInput.value = "";
                  }}
                  className={`mr-3 px-4 py-2 border rounded-md shadow-sm text-sm font-medium ${
                    currentTheme === "dark"
                      ? "bg-[#404040] border-gray-500 text-white hover:bg-[#505050]"
                      : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                >
                  Reset Form
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? "Submitting..." : "Submit Report"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Additional Help Info */}
        <div
          className={`mt-12 ${darkModeClasses.helpBg} rounded-lg p-6 border ${darkModeClasses.border}`}
        >
          <h3
            className={`text-lg font-medium ${darkModeClasses.helpTitle} mb-3`}
          >
            Need Immediate Assistance?
          </h3>
          <p className={`${darkModeClasses.helpText} mb-4`}>
            For urgent matters requiring immediate attention, please contact our
            support team directly:
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-blue-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
              </svg>
              <span className={darkModeClasses.textPrimary}>
                +1 (800) 123-4567
              </span>
            </div>
            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-blue-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
              </svg>
              <span className={darkModeClasses.textPrimary}>
                support@auctionx.com
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;
