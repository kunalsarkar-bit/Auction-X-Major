import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./slices/authSlice";
import csrfReducer from "./slices/csrfSecuritySlice";
import loadingReducer from "./slices/loadingSlice";

const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["isAuthenticated", "verified"], // Added 'verified' to persisted fields
  blacklist: ["loading", "user"], // Don't persist loading state
};

export const store = configureStore({
  reducer: {
    auth: persistReducer(authPersistConfig, authReducer),
    csrf: csrfReducer,
    loading: loadingReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
        ignoredPaths: ["auth.user"], // Add this to prevent serialization warnings
      },
    }),
});

export const persistor = persistStore(store);
