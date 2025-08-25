import axios from "axios";

const API_BASE_URL = "http://localhost:9999/user";

const token = localStorage.getItem("token");

// Register User
const register = async (user) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/register`, user);
    return response;
  } catch (error) {
    return error;
  }
};

// Login User
const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, {
      email,
      password,
    });
    return response;
  } catch (error) {
    return error;
  }
};

// Lấy tất cả người dùng
const getAllUsers = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_BASE_URL}/getAll`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("====================================");
    console.log(response);
    console.log("====================================");
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

// Cập nhật thông tin người dùng
const updateUser = async (userId, userData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(`${API_BASE_URL}/${userId}`, userData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

const fetchUserById = async (userId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_BASE_URL}/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching book:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export { getAllUsers, updateUser, register, login, fetchUserById };
