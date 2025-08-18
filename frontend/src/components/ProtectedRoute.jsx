import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";

const ProtectedRoute = ({ children, redirectPath = "/login" }) => {
  if (!isAuthenticated()) {
    return <Navigate to={redirectPath} replace />;
  }
  return children;
};

export default ProtectedRoute;