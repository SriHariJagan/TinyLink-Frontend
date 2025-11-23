import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import {jwtDecode } from "jwt-decode";
import { AuthContext } from "../Store/Context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { token, logout } = useContext(AuthContext);

  if (!token) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode (token);
    const currentTime = Date.now() / 1000;

    if (decoded.exp < currentTime) {
      // Token expired
      logout(); // clear user & token
      return <Navigate to="/login" replace />;
    }
  } catch (err) {
    // Invalid token
    logout();
    return <Navigate to="/login" replace />;
  }

  // Token valid
  return children;
};

export default ProtectedRoute;
