import React, { useState, useEffect } from "react";
import "../../assets/style/bookmanager.css";
import Sidebar_Admin from "../reuse/Sidebar_Admin";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  createGenre,
  deleteGenre,
  fetchGenres,
  updateGenre,
} from "../../../services/genres";

// Modal for Add/Edit Service
const ServiceModal = ({ type, data, onSave, onClose, genres }) => {
  const [bookData, setbookData] = useState(data || {});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setbookData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!bookData.name || !bookData.description) {
      toast.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }
    const bookDataToSave = { ...bookData };

    onSave(bookDataToSave);
  };

  return (
    <div className="manage-service-modal">
      <div className="modal-content">
        <input
          type="text"
          name="name"
          placeholder="Tên thể loại"
          value={bookData.name || ""}
          onChange={handleChange}
        />

        <input
          type="text"
          name="description"
          placeholder="Miêu tả"
          value={bookData.description || ""}
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
        <p>Bạn có chắc chắn muốn xóa thể loại này không?</p>
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

const GenreManager = () => {
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [modalType, setModalType] = useState("");

  const [currentService, setCurrentService] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(5);

  useEffect(() => {
    // Fetching Service Types
    fetchGenres()
      .then((data) => setBooks(data))
      .catch((error) => console.error("Error fetching genres:", error));
  }, []);

  // Add Service
  const handleAddService = (newBook) => {
    createGenre(newBook)
      .then(() => {
        fetchGenres()
          .then((data) => setBooks(data))
          .catch((error) => console.error("Error fetching genres:", error));
        toast.success("Thể loại đã được thêm thành công!");
        setShowModal(false);
      })
      .catch(() => toast.error("Thêm thể loại thất bại!"));
  };

  // Edit Service
  const handleEditService = (updatedBook) => {
    updateGenre(updatedBook._id, {
      name: updatedBook.name,
      description: updatedBook.description,
    })
      .then(() => {
        fetchGenres()
          .then((data) => setBooks(data))
          .catch((error) => console.error("Error fetching genres:", error));
        toast.success("Thể loại đã được sửa thành công!");
        setShowModal(false);
      })
      .catch(() => toast.error("Cập nhật thể loại thất bại!"));
  };

  // Delete Service
  const handleDeleteBook = (id) => {
    deleteGenre(id)
      .then(() => {
        fetchGenres()
          .then((data) => setBooks(data))
          .catch((error) => console.error("Error fetching books:", error));
        toast.success("Thể loại đã được xóa thành công!");
        setShowModal(false);
      })
      .catch(() => toast.error("Xóa thể loại thất bại!"));
  };

  const handleAddBookClick = () => {
    setModalType("service");
    setCurrentService(null);
    setShowModal(true);
  };

  const handleEditBookClick = (book) => {
    setModalType("service");
    setCurrentService(book);
    setShowModal(true);
  };

  const handleSaveBook = (bookData) => {
    if (modalType === "service") {
      if (bookData._id) {
        handleEditService(bookData);
      } else {
        handleAddService(bookData);
      }
    }
  };

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = books.slice(indexOfFirstRecord, indexOfLastRecord);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="admin-container">
      <Sidebar_Admin />
      <div className="main-content">
        <div className="manage-service-container">
          <h2>Quản Lý Thể Loại</h2>

          <button
            className="manage-service-add-btn"
            onClick={handleAddBookClick}
          >
            <FaPlus /> Thêm Thể Loại
          </button>
          <table className="manage-service-table">
            <thead>
              <tr>
                <th>Tên thể loại</th>
                <th>Miêu tả</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.map((book) => (
                <tr key={book._id}>
                  <td>{book.name}</td>
                  <td>{book.description}</td>
                  <td>
                    <div className="manage-service-actions">
                      <button
                        className="manage-service-edit-btn"
                        onClick={() => handleEditBookClick(book)}
                      >
                        <FaEdit /> Sửa
                      </button>
                      <button
                        className="manage-service-delete-btn"
                        onClick={() => {
                          setCurrentService(book);
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
              disabled={currentPage * recordsPerPage >= books.length}
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

export default GenreManager;
