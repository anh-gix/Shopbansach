import axios from "axios";

const API_BASE_URL = "http://localhost:9999/order";

const authHeader = () => ({ Authorization: `Bearer ${localStorage.getItem("token")}` });

export const createOrder = async (shippingAddress) => {
  const res = await axios.post(`${API_BASE_URL}/create`, { shippingAddress }, { headers: authHeader() });
  return res.data;
};

export const fetchMyOrders = async () => {
  const res = await axios.get(`${API_BASE_URL}/mine`, { headers: authHeader() });
  return res.data;
};

export const updateOrderStatus = async (orderId, status) => {
  const res = await axios.put(`${API_BASE_URL}/${orderId}/status`, { status }, { headers: authHeader() });
  return res.data;
};


