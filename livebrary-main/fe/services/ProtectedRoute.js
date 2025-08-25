import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    return decoded;
  } catch (error) {
    return null;
  }
};

const ProtectedRoute = ({ children, requiredRole }) => {
  const navigate = useNavigate();
  const user = isAuthenticated();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else if (requiredRole !== undefined && user.role !== requiredRole) {
      navigate("/not-authorized");
    }
  }, [user, navigate, requiredRole]);

  return user ? children : null;
};

export { ProtectedRoute };
