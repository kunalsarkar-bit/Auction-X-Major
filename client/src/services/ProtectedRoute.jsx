// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ element, requiredRole = null }) => {
  const { isAuthenticated, role } = useSelector((state) => state.auth);

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If a specific role is required and user doesn't have it
  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  // User is authenticated and has the right role
  return element;
};

export default ProtectedRoute;

// Usage in App.jsx:
// <Route
//   path="/admin/dashboard"
//   element={
//     <ProtectedRoute
//       element={<Dashboard />}
//       requiredRole="admin"
//     />
//   }
// />
