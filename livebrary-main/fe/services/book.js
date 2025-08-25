import axios from "axios";
import { useEffect, useState } from "react";

const API_BASE_URL = "http://localhost:9999/book";

// Lấy tất cả sách
const fetchBooks = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_BASE_URL}/getAllBook`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching books:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Lấy sách theo ID
const fetchBookById = async (bookId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_BASE_URL}/${bookId}`, {
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

// Tạo sách mới
const createBook = async (bookData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(`${API_BASE_URL}/addBook`, bookData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error creating book:",
      error.response?.data || error.message
    );
    throw error;
  }
};

const filterBook = async (query) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_BASE_URL}/filter/${query}`, {
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

// Cập nhật sách theo ID
const updateBook = async (bookId, bookData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(
      `${API_BASE_URL}/updateBook/${bookId}`,
      bookData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error updating book:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Xóa sách theo ID
const deleteBook = async (bookId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.delete(
      `${API_BASE_URL}/deleteBook/${bookId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error deleting book:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export {
  fetchBooks,
  fetchBookById,
  createBook,
  updateBook,
  deleteBook,
  filterBook,
};
