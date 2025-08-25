import axios from "axios";
import { useEffect, useState } from "react";

const API_BASE_URL = "http://localhost:9999/review";

// Thêm đánh giá mới cho sách
const addReview = async (reviewData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(`${API_BASE_URL}/addReview`, reviewData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error adding review:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Lấy tất cả đánh giá của sách theo bookId
const fetchReviewsByBook = async (bookId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_BASE_URL}/${bookId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching reviews:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export { addReview, fetchReviewsByBook };
