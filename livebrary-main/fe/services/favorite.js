import axios from "axios";
import { useEffect, useState } from "react";

const API_BASE_URL = "http://localhost:9999/favorite";

// Thêm sách vào danh sách yêu thích
const addToFavorites = async (userId, bookId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API_BASE_URL}/addToFavorite`,
      {
        userId,
        bookId,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error adding book to favorites:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Lấy danh sách yêu thích của người dùng theo userId
const getFavoritesByUser = async (userId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_BASE_URL}/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching favorites:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Xóa sách khỏi danh sách yêu thích
const deleteFavorite = async (userId, bookId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.delete(`${API_BASE_URL}/${userId}/${bookId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error deleting favorite:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export { addToFavorites, getFavoritesByUser, deleteFavorite };
