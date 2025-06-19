import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuthenticated: false,
  role: null,
  profilePic: null,
  isVerified: false, // Changed from 'verified' to match backend
  isSeller: false,
  loginType: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;

      if (action.payload) {
        state.role = action.payload.role || null;
        state.profilePic = action.payload.profilePic || null;
        // Handle both 'verified' and 'isVerified' for backward compatibility
        state.isVerified =
          action.payload.isVerified || action.payload.verified || false;
        state.isSeller = action.payload.role === "seller";
        state.loginType = action.payload.loginType || null;

        // Ensure user object also has isVerified
        if (state.user) {
          state.user.isVerified = state.isVerified;
        }
      } else {
        // Reset all on null payload
        Object.assign(state, initialState);
      }
    },
    setSeller: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;

      if (action.payload) {
        state.role = "seller";
        state.profilePic = action.payload.profilePic || null;
        state.isVerified =
          action.payload.isVerified || action.payload.verified || false;
        state.isSeller = true;
        state.loginType = action.payload.loginType || null;

        if (state.user) {
          state.user.role = "seller";
          state.user.isVerified = state.isVerified;
          state.user.loginType = state.loginType;
        }
      } else {
        Object.assign(state, initialState);
      }
    },

    updateVerification: (state, action) => {
      state.isVerified = action.payload;
      if (state.user) {
        state.user.isVerified = action.payload;
      }
    },
    setLoginType: (state, action) => {
      state.loginType = action.payload;
      if (state.user) {
        state.user.loginType = action.payload;
      }
    },
    logout: (state) => {
      console.log("Logout action triggered"); // Check if this logs
      return initialState;
    },
  },
});

export const { setUser, setSeller, setLoginType, logout, updateVerification } =
  authSlice.actions;
export default authSlice.reducer;
