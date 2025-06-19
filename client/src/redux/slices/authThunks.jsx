import { persistor } from "../store";
import { logout } from "./authSlice"; // Correct import
const API_URL = import.meta.env.VITE_API_URL;
export const completeLogout = () => async (dispatch) => {
  try {
    // 1. Call backend logout endpoint
    const response = await fetch(`${API_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) throw new Error("Logout failed");

    // 2. Clear persisted state
    await persistor.purge();

    // 3. Dispatch logout action
    dispatch(logout()); // Now properly imported

    // 4. Force reload
    window.location.href = "/login";
  } catch (error) {
    console.error("Logout error:", error);
  }
};
