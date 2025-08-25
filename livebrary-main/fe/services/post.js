import axios from "axios";
import { useEffect, useState } from "react";

const API_BASE_URL = "http://localhost:9999/post";

// Tạo bài viết mới
const createPost = async (postData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(`${API_BASE_URL}/createPost`, postData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error creating post:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Lấy danh sách bài viết theo ID cộng đồng
const fetchPostsByCommunity = async (communityId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${API_BASE_URL}/community/${communityId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching posts:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Lấy bài viết theo ID
const fetchPostById = async (postId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_BASE_URL}/${postId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching post:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Cập nhật bài viết theo ID
const updatePost = async (postId, postData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(`${API_BASE_URL}/${postId}`, postData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error updating post:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Xóa bài viết theo ID
const deletePost = async (postId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.delete(`${API_BASE_URL}/${postId}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error deleting post:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export {
  createPost,
  fetchPostsByCommunity,
  fetchPostById,
  updatePost,
  deletePost,
};
