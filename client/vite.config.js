import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    host: true, // 👈 This enables access via local IP
    proxy: {
      "/api": {
        target: "http://localhost:5000/", // Your backend server URL
        changeOrigin: true,
        secure: false,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // ✅ Correct alias syntax
    },
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  define: {
    "process.env": {
      VITE_API_URL: process.env.VITE_API_URL, // ✅ Enables process.env.VITE_API_URL in app
      VITE_RAZORPAY_API_KEY: process.env.VITE_RAZORPAY_API_KEY,
      VITE_RECOMMENDATION_API_URL: process.env.VITE_RECOMMENDATION_API_URL,
    },
  },
});
