import axios from "axios";
import { useEffect, useState } from "react";

const API_BASE_URL = "http://localhost:9999/genres";

// Tạo thể loại sách mới
const createGenre = async (genreData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API_BASE_URL}/createGenres`,
      genreData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error creating genre:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Lấy tất cả thể loại sách
const fetchGenres = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_BASE_URL}/getAllGenres`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching genres:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Lấy thể loại sách theo ID
const fetchGenreById = async (genreId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_BASE_URL}/${genreId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching genre:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Cập nhật thể loại sách theo ID
const updateGenre = async (genreId, genreData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(
      `${API_BASE_URL}/updateGenres/${genreId}`,
      genreData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error updating genre:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Xóa thể loại sách theo ID
const deleteGenre = async (genreId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.delete(
      `${API_BASE_URL}/deleteGenres/${genreId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error deleting genre:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export { createGenre, fetchGenres, fetchGenreById, updateGenre, deleteGenre };
