import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

// Async action to fetch CSRF token
export const fetchCsrfToken = createAsyncThunk(
  "csrf/fetchToken",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/csrf-token`, {
        withCredentials: true,
      });
      return response.data.csrfToken;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch CSRF token"
      );
    }
  }
);

const csrfSlice = createSlice({
  name: "csrf",
  initialState: {
    token: null,
    loading: false,
    error: null,
  },
  reducers: {
    resetCsrf: (state) => {
      state.token = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCsrfToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCsrfToken.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload;
      })
      .addCase(fetchCsrfToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetCsrf } = csrfSlice.actions;
export default csrfSlice.reducer;
