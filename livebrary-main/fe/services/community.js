import axios from "axios";

const API_BASE_URL = "http://localhost:9999/community";

const token = localStorage.getItem("token");

// Tạo cộng đồng mới
const createCommunity = async (communityData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API_BASE_URL}/createCommunity`,
      communityData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error creating community:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Lấy tất cả cộng đồng
const fetchCommunities = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_BASE_URL}/getAllCommunity`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching communities:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Lấy cộng đồng theo ID
const fetchCommunityById = async (communityId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_BASE_URL}/${communityId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching community:",
      error.response?.data || error.message
    );
    throw error;
  }
};

const updateCommunity = async (communityId, updatedData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(
      `${API_BASE_URL}/updateCommunity/${communityId}`,
      updatedData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error updating community:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Xóa cộng đồng theo ID
const deleteCommunity = async (communityId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.delete(
      `${API_BASE_URL}/deleteCommunity/${communityId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error deleting community:",
      error.response?.data || error.message
    );
    throw error;
  }
};

const joinCommunity = async (communityId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.patch(
      `${API_BASE_URL}/${communityId}/addMember`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error joining community:",
      error.response?.data || error.message
    );
    throw error;
  }
};
const leaveCommunity = async (communityId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.patch(
      `${API_BASE_URL}/${communityId}/removeMember`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error leaving community:",
      error.response?.data || error.message
    );
    throw error;
  }
};
export {
  createCommunity,
  fetchCommunities,
  fetchCommunityById,
  updateCommunity,
  deleteCommunity,
  joinCommunity,
  leaveCommunity,
};
