// src/services/authService.js - Updated to work with https-only cookies
import axios from "axios";

// Base URL for API calls
const API_URL = import.meta.env.VITE_API_URL;
// Create axios instance with credentials enabled
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important: This allows cookies to be sent with requests
});

// Fetch CSRF token before any modifying request
const getCsrfToken = async () => {
  try {
    const response = await api.get("/api/csrf-token");
    return response.data.csrfToken;
  } catch (error) {
    console.error(
      "CSRF Token fetch failed:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Auth service methods
const authService = {
  // Fetch CSRF Token (already declared above)
  getCsrfToken,

  // User Login
  userLogin: async (email, password) => {
    try {
      const csrfToken = await getCsrfToken();
      const response = await api.post(
        "/api/auth/user/login",
        { email, password },
        {
          headers: {
            "X-CSRF-Token": csrfToken,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      throw error;
    }
  },

  // User Registration
  userRegister: async (userData) => {
    try {
      const csrfToken = await getCsrfToken();
      const response = await api.post("/api/auth/user/register", userData, {
        headers: {
          "X-CSRF-Token": csrfToken,
        },
      });
      return response.data;
    } catch (error) {
      console.error(
        "Registration failed:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  sellerLogin: async (email, password) => {
    try {
      const csrfToken = await getCsrfToken();
      const response = await api.post(
        "/api/auth/seller/login",
        { email, password },
        {
          headers: {
            "X-CSRF-Token": csrfToken,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      throw error;
    }
  },

  // User Registration
  sellerRegister: async (userData) => {
    try {
      const csrfToken = await getCsrfToken();
      const response = await api.post("/api/auth/seller/register", userData, {
        headers: {
          "X-CSRF-Token": csrfToken,
        },
      });
      return response.data;
    } catch (error) {
      console.error(
        "Registration failed:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Google Login
  userGoogleLogin: () => {
    window.location.href = `${API_URL}/auth/google`;
  },

  // Check Authentication Status
  checkAuth: async () => {
    try {
      const response = await api.get("/api/auth/check", { withCredentials: true });
      return response.data;
    } catch (error) {
      console.error(
        "Auth check failed:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Logout
  logout: async () => {
    try {
      const csrfToken = await getCsrfToken();
      const response = await api.post(
        "/api/auth/logout",
        {},
        {
          headers: {
            "X-CSRF-Token": csrfToken,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Logout failed:", error.response?.data || error.message);
      throw error;
    }
  },

  // Profile Update
  updateProfile: async (profileData) => {
    try {
      const csrfToken = await getCsrfToken();
      const response = await api.patch("/api/user/profile", profileData, {
        headers: {
          "X-CSRF-Token": csrfToken,
        },
      });
      return response.data;
    } catch (error) {
      console.error(
        "Profile update failed:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // OTP Verification
  sendOtp: async (email) => {
    try {
      const csrfToken = await getCsrfToken();
      const response = await api.post(
        "/api/auth/send-otp",
        { email },
        {
          headers: {
            "X-CSRF-Token": csrfToken,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("OTP send failed:", error.response?.data || error.message);
      throw error;
    }
  },

  verifyOtp: async (email, otp) => {
    try {
      const csrfToken = await getCsrfToken();
      const response = await api.post(
        "/api/auth/verify-otp",
        { email, otp },
        {
          headers: {
            "X-CSRF-Token": csrfToken,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        "OTP verification failed:",
        error.response?.data || error.message
      );
      throw error;
    }
  },
};

export default authService;
