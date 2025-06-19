import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useThemeProvider } from "../../../../AdminDashboard/utils/ThemeContext";
import { useSelector, useDispatch } from "react-redux";
import { fetchCsrfToken } from "../../../../../redux/slices/csrfSecuritySlice";

const ContactUs = () => {
  const { currentTheme } = useThemeProvider();
  const user = useSelector((state) => state.auth.user);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    subject: "",
    message: "",
  });
  const API_URL = import.meta.env.VITE_API_URL;
  const [status, setStatus] = useState({ submitted: false, error: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { token: csrfToken, loading } = useSelector((state) => state.csrf);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!csrfToken && !loading) {
      dispatch(fetchCsrfToken());
    }
  }, [dispatch, csrfToken, loading]);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Only allow changes to subject and message if user is logged in
    if (!user || (name !== "name" && name !== "email")) {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.subject ||
      !formData.message
    ) {
      toast.error("All fields are required to send a message.");
      return;
    }

    setStatus({ submitted: false, error: false });
    setIsSubmitting(true);

    try {
      const response = await axios.post(`${API_URL}/api/contact/`, formData, {
        headers: {
          "X-CSRF-Token": csrfToken,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      if (response.data.code === "SUCCESS") {
        setStatus({ submitted: true, error: false });
        toast.success(response.data.message);
        setFormData((prev) => ({ ...prev, subject: "", message: "" }));
      } else {
        throw new Error(response.data.message || "Failed to send message");
      }
    } catch (error) {
      setStatus({ submitted: true, error: true });
      const errorMessage =
        error.response?.data?.message ||
        "Oops! An error occurred while sending your message. Please try again later.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-[#191919] text-gray-800 dark:text-gray-100 py-24 transition-colors">
      <h2 className="text-4xl font-bold mb-12 text-center text-gray-800 dark:text-white">
        CONTACT US
      </h2>

      <div className="flex flex-col lg:flex-row gap-12 max-w-7xl mx-auto px-8">
        {/* Contact Form */}
        <div className="w-full lg:w-1/2">
          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-[#303030] p-8 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 transition-colors"
          >
            <div className="mb-6">
              <input
                type="text"
                placeholder="Your Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                readOnly={!!user} // Make read-only if user is logged in
                className={`w-full p-3 rounded-lg ${
                  user
                    ? "bg-gray-100 dark:bg-[#505050] cursor-not-allowed"
                    : "bg-gray-50 dark:bg-[#404040]"
                } text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                required
              />
            </div>
            <div className="mb-6">
              <input
                type="email"
                placeholder="Your Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                readOnly={!!user} // Make read-only if user is logged in
                className={`w-full p-3 rounded-lg ${
                  user
                    ? "bg-gray-100 dark:bg-[#505050] cursor-not-allowed"
                    : "bg-gray-50 dark:bg-[#404040]"
                } text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                required
              />
            </div>
            <div className="mb-6">
              <input
                type="text"
                placeholder="Subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-gray-50 dark:bg-[#404040] text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                required
              />
            </div>
            <div className="mb-6">
              <textarea
                rows={5}
                placeholder="Message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-gray-50 dark:bg-[#404040] text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 dark:bg-blue-600 dark:hover:bg-blue-700 dark:disabled:bg-blue-500 text-white py-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                  Sending...
                </span>
              ) : (
                "Send Message"
              )}
            </button>
          </form>
        </div>

        {/* Google Map and Contact Info */}
        <div className="w-full lg:w-1/2">
          <div className="w-full h-96 rounded-xl overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-700">
            <iframe
              src="https://www.google.com/maps/d/embed?mid=13RYCmCKJ3-Rzs6hzfnXwT-tsJrkZubw&ehbc=2E312F"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

          <div className="mt-8 p-8 bg-white dark:bg-[#303030] rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 transition-colors">
            <p className="flex items-center mb-4 text-gray-700 dark:text-gray-300">
              <i className="fas fa-map-marker-alt mr-3 text-blue-500 dark:text-blue-400"></i>
              Pailan College of Technology and Management, West Bengal, India
            </p>
            <p className="flex items-center mb-4 text-gray-700 dark:text-gray-300">
              <i className="fas fa-envelope mr-3 text-blue-500 dark:text-blue-400"></i>
              info@example.com
            </p>
            <p className="flex items-center text-gray-700 dark:text-gray-300">
              <i className="fas fa-phone mr-3 text-blue-500 dark:text-blue-400"></i>
              +012 345 67890
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
