import axios from "axios";

const API_BASE_URL = "http://localhost:9999/cart";

const authHeader = () => ({ Authorization: `Bearer ${localStorage.getItem("token")}` });

export const fetchCart = async () => {
  const res = await axios.get(`${API_BASE_URL}/`, { headers: authHeader() });
  return res.data;
};

export const addToCart = async (bookId, quantity = 1) => {
  const res = await axios.post(`${API_BASE_URL}/add`, { bookId, quantity }, { headers: authHeader() });
  return res.data;
};

export const updateCartItem = async (bookId, quantity) => {
  const res = await axios.put(`${API_BASE_URL}/update`, { bookId, quantity }, { headers: authHeader() });
  return res.data;
};

export const clearCart = async () => {
  const res = await axios.post(`${API_BASE_URL}/clear`, {}, { headers: authHeader() });
  return res.data;
};


