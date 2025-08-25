import React, { useState, useEffect } from "react";
import "../../assets/style/bookmanager.css";
//import Sidebar_Admin from "../reuse/Sidebar_Admin";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  createBook,
  deleteBook,
  fetchBooks,
  updateBook,
} from "../../../services/book";
import { fetchGenres } from "../../../services/genres";
import Sidebar_Admin from "../reuse/Sidebar_Admin";

// Modal for Add/Edit Service
const ServiceModal = ({ type, data, onSave, onClose, genres }) => {
  const [bookData, setbookData] = useState(data || {});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setbookData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (
      !bookData.title ||
      !bookData.author ||
      !bookData.description ||
      !bookData.genre ||
      !bookData.publicationYear ||
      !bookData.image ||
      bookData.price === undefined ||
      bookData.stock === undefined
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }
    const bookDataToSave = { ...bookData };
    onSave(bookDataToSave);
  };

  return (
    <div className="manage-service-modal">
      <div className="modal-content">
        <select
          name="genre"
          value={bookData.genre || ""}
          onChange={handleChange}
        >
          <option value="">Chọn thể loại</option>
          {genres.map((g) => (
            <option key={g._id} value={g._id}>
              {g.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="title"
          placeholder="Tiêu đề"
          value={bookData.title || ""}
          onChange={handleChange}
        />

        <input
          type="text"
          name="author"
          placeholder="Tác giả"
          value={bookData.author || ""}
          onChange={handleChange}
        />

        <input
          type="text"
          name="description"
          placeholder="Nội dung"
          value={bookData.description || ""}
          onChange={handleChange}
        />

        <input
          type="number"
          name="publicationYear"
          placeholder="Ngày xuất bản"
          value={bookData.publicationYear || ""}
          onChange={handleChange}
        />

        <input
          type="text"
          name="image"
          placeholder="Anh"
          value={bookData.image || ""}
          onChange={handleChange}
        />

        <input
          type="number"
          name="price"
          placeholder="Giá bán"
          value={bookData.price || ""}
          onChange={handleChange}
        />

        <input
          type="number"
          name="stock"
          placeholder="Tồn kho"
          value={bookData.stock || ""}
          onChange={handleChange}
        />

        

        <input
          type="text"
          name="publisher"
          placeholder="Nhà xuất bản"
          value={bookData.publisher || ""}
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
        <p>Bạn có chắc chắn muốn xóa quyển sách này không?</p>
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

const BookManager = () => {
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
    fetchBooks()
      .then((data) => setBooks(data))
      .catch((error) => console.error("Error fetching books:", error));

    // Fetching Services
    fetchGenres()
      .then((data) => setGenres(data))
      .catch((error) => console.error("Error fetching genres:", error));
  }, []);

  // Add Service
  const handleAddService = (newBook) => {
    createBook(newBook)
      .then(() => {
        fetchBooks()
          .then((data) => setBooks(data))
          .catch((error) => console.error("Error fetching books:", error));
        toast.success("Sách đã được thêm thành công!");
        setShowModal(false);
      })
      .catch(() => toast.error("Thêm sách thất bại!"));
  };

  // Edit Service
  const handleEditService = (updatedBook) => {
    updateBook(updatedBook._id, {
      title: updatedBook.title,
      author: updatedBook.author,
      description: updatedBook.description,
      genre: updatedBook.genre,
      publicationYear: updatedBook.publicationYear,
      image: updatedBook.image,
      price: Number(updatedBook.price),
      stock: Number(updatedBook.stock),
      publisher: updatedBook.publisher,
    })
      .then(() => {
        fetchBooks()
          .then((data) => setBooks(data))
          .catch((error) => console.error("Error fetching books:", error));
        toast.success("Sách đã được cập nhật thành công!");
        setShowModal(false);
      })
      .catch(() => toast.error("Cập nhật sách thất bại!"));
  };

  // Delete Service
  const handleDeleteBook = (id) => {
    deleteBook(id)
      .then(() => {
        fetchBooks()
          .then((data) => setBooks(data))
          .catch((error) => console.error("Error fetching books:", error));
        toast.success("Sách đã được xóa thành công!");
        setShowModal(false);
      })
      .catch(() => toast.error("Xóa sách thất bại!"));
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
          <h2>Quản Lý Sách</h2>

          <button
            className="manage-service-add-btn"
            onClick={handleAddBookClick}
          >
            <FaPlus /> Thêm Sách
          </button>
          <table className="manage-service-table">
            <thead>
              <tr>
                <th>Tiêu đề</th>
                <th>Tác giả</th>
                <th>Miêu tả</th>
                <th>Thể loại</th>
                <th>Ngày xuất bản</th>
                <th>Giá</th>
                <th>Tồn kho</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.map((book) => (
                <tr key={book._id}>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.description}</td>
                  <td>{genres.find((g) => g._id == book.genre)?.name}</td>
                  <td>{book.publicationYear}</td>
                  <td>{book.price?.toLocaleString('vi-VN')}₫</td>
                  <td>{book.stock}</td>
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

export default BookManager;
