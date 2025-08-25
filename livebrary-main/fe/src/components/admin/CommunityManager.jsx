import React, { useState, useEffect } from "react";
import "../../assets/style/bookmanager.css";
//import Sidebar_Admin from "../reuse/Sidebar_Admin";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar_Admin from "../reuse/Sidebar_Admin";
import {
  createCommunity,
  deleteCommunity,
  fetchCommunities,
  updateCommunity,
} from "../../../services/community";

const ServiceModal = ({ type, data, onSave, onClose, genres }) => {
  const [communityData, setCommunityData] = useState({
    ...data,
    member: data?.member || [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name !== "member") {
      setCommunityData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = () => {
    if (!communityData.name || !communityData.description) {
      toast.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }
    const communityDataToSave = {
      ...communityData,
      member: data?.member || [],
    };
    onSave(communityDataToSave);
  };

  return (
    <div className="manage-service-modal">
      <div className="modal-content">
        <input
          type="text"
          name="name"
          placeholder="Tên cộng đồng"
          value={communityData.name || ""}
          onChange={handleChange}
        />

        <input
          type="text"
          name="description"
          placeholder="Miêu tả"
          value={communityData.description || ""}
          onChange={handleChange}
        />

        <div className="modal-actions">
          <button className="manage-service-save-btn" onClick={handleSubmit}>
            Lưu
          </button>
          <button className="manage-service-close-btn" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

// Modal for Delete Service
const DeleteServiceModal = ({ service, onDelete, onClose }) => {
  const handleDelete = () => {
    onDelete(service._id);
    onClose();
  };
  return (
    <div className="manage-service-modal">
      <div className="modal-content">
        <h3>Xác nhận xóa</h3>
        <p>Bạn có chắc chắn muốn xóa cộng đồng này không?</p>
        <div className="modal-actions">
          <button className="manage-service-delete-btn" onClick={handleDelete}>
            Xóa
          </button>
          <button className="manage-service-close-btn" onClick={onClose}>
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
};

const CommunityManager = () => {
  const [community, setCommunity] = useState([]);
  const [genres, setGenres] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [modalType, setModalType] = useState("");

  const [currentService, setCurrentService] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(5);

  useEffect(() => {
    // Fetching Service Types
    fetchCommunities()
      .then((data) => setCommunity(data))
      .catch((error) => console.error("Error fetching communities:", error));
  }, []);

  // Add Service
  const handleAddService = (newCommunity) => {
    createCommunity(newCommunity)
      .then(() => {
        fetchCommunities()
          .then((data) => setCommunity(data))
          .catch((error) =>
            console.error("Error fetching communities:", error)
          );
        toast.success("Cộng đồng đã được thêm thành công!");
        setShowModal(false);
      })
      .catch(() => toast.error("Thêm cộng đồng thất bại!"));
  };

  // Edit Service
  const handleEditService = (updatedCommunity) => {
    updateCommunity(updatedCommunity._id, {
      name: updatedCommunity.name,
      description: updatedCommunity.description,
      member: updatedCommunity.member,
    })
      .then(() => {
        fetchCommunities()
          .then((data) => setCommunity(data))
          .catch((error) =>
            console.error("Error fetching communities:", error)
          );
        toast.success("Cộng đồng đã được cập nhật thành công!");
        setShowModal(false);
      })
      .catch(() => toast.error("Sửa cộng đồng thất bại!"));
  };

  // Delete Service
  const handleDeleteBook = (id) => {
    deleteCommunity(id)
      .then(() => {
        fetchCommunities()
          .then((data) => setCommunity(data))
          .catch((error) =>
            console.error("Error fetching communities:", error)
          );
        toast.success("Xóa sách thành công!");
        setShowModal(false);
      })
      .catch(() => toast.error("Xóa sách thất bại!"));
  };

  const handleAddBookClick = () => {
    setModalType("service");
    setCurrentService(null);
    setShowModal(true);
  };

  const handleEditBookClick = (community) => {
    setModalType("service");
    setCurrentService(community);
    setShowModal(true);
  };

  const handleSaveBook = (communityData) => {
    if (modalType === "service") {
      if (communityData._id) {
        handleEditService(communityData);
      } else {
        handleAddService(communityData);
      }
    }
  };

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = community.slice(indexOfFirstRecord, indexOfLastRecord);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="admin-container">
      <Sidebar_Admin />
      <div className="main-content">
        <div className="manage-service-container">
          <h2>Quản Lý Cộng Đồng</h2>

          <button
            className="manage-service-add-btn"
            onClick={handleAddBookClick}
          >
            <FaPlus /> Thêm cộng đồng
          </button>
          <table className="manage-service-table">
            <thead>
              <tr>
                <th>Tên cộng đồng</th>
                <th>Miêu tả</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.map((c) => (
                <tr key={c._id}>
                  <td>{c.name}</td>
                  <td>{c.description}</td>
                  <td>
                    <div className="manage-service-actions">
                      <button
                        className="manage-service-edit-btn"
                        onClick={() => handleEditBookClick(c)}
                      >
                        <FaEdit /> Sửa
                      </button>
                      <button
                        className="manage-service-delete-btn"
                        onClick={() => {
                          setCurrentService(c);
                          setShowDeleteModal(true);
                        }}
                      >
                        <FaTrash /> Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="pagination">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Trước
            </button>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage * recordsPerPage >= community.length}
            >
              Sau
            </button>
          </div>

          {/* Modal for Add/Edit Service */}
          {showModal && modalType === "service" && (
            <ServiceModal
              type={modalType}
              data={currentService}
              genres={genres}
              onSave={handleSaveBook}
              onClose={() => setShowModal(false)}
            />
          )}

          {/* Modal for Delete Service */}
          {showDeleteModal && (
            <DeleteServiceModal
              service={currentService}
              onDelete={handleDeleteBook}
              onClose={() => setShowDeleteModal(false)}
            />
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default CommunityManager;
