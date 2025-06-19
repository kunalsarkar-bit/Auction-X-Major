import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux"; // Import Redux Provider
import { store, persistor } from "./redux/store"; // Import your Redux store
import { PersistGate } from "redux-persist/integration/react";
import "./index.css";
import ThemeProvider from "./components/AdminDashboard/utils/ThemeContext.jsx";
import App from "./App.jsx";
import LoaderManager from "./components/Common/Loader/LoaderManager.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {" "}
        {/* Wrap your app with Provider */}
        <ThemeProvider>
          {/* <Loading /> */}
          <LoaderManager>
            <App />
          </LoaderManager>
          {/* <App />   */}
        </ThemeProvider>
      </PersistGate>
    </Provider>
  </StrictMode>
);
