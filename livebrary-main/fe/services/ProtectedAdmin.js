import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const token = localStorage.getItem("token");

const isAuthenticated = () => {
  return !localStorage.getItem("token");
};

const isAdmin = () => {
  try {
    const decoded = jwtDecode(token);

    console.log(decoded);

    if (decoded.role === false) {
      return true;
    }
  } catch (error) {
    return false;
  }
};

const ProtectedAdmin = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
    } else if (!isAdmin()) {
      navigate("/not-authorized");
    }
  }, [navigate]);

  return children;
};

export { ProtectedAdmin };
