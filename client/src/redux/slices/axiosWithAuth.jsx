import axios from "axios";
import { store } from "../../redux/store";
const API_URL = import.meta.env.VITE_API_URL;
const axiosWithAuth = axios.create({
  baseURL: `${API_URL}/api`,
});

// Interceptor to attach token
axiosWithAuth.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle 401 errors (token expired)
axiosWithAuth.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh the token
        const refreshResponse = await axios.post(
          `${API_URL}/api/auth/refresh-token`,
          {},
          { withCredentials: true } // For cookie-based refresh
        );

        // Update Redux with new token
        store.dispatch(setToken(refreshResponse.data.token));

        // Retry the original request
        originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.token}`;
        return axiosWithAuth(originalRequest);
      } catch (refreshError) {
        // Force logout if refresh fails
        store.dispatch(logout());
        window.location.href = "/login"; // Redirect to login
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosWithAuth;
