import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import BookCard from "../../components/user/BookCard";
import "../../assets/style/searchresult.css";
import { filterBook } from "../../../services/book";

const SearchResult = ({ isOpen, onClose, initialQuery = "" }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const modalRef = useRef(null);
  const typingTimeoutRef = useRef(null); // Ref để lưu timeout

  // Update query when initialQuery changes or modal opens
  useEffect(() => {
    if (isOpen && initialQuery) {
      setQuery(initialQuery);
    }
  }, [isOpen, initialQuery]);

  // Handle click outside modal to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Handle ESC key press to close modal
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscKey);
    }
    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [isOpen, onClose]);

  // Search functionality with debounce
  useEffect(() => {
    if (!query.trim() || !isOpen) return;

    setLoading(true);

    // Xóa timeout cũ nếu người dùng tiếp tục nhập
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(async () => {
      try {
        const response = await filterBook(query.toLowerCase());
        setResults(response);
      } catch (error) {
        console.error(
          "Lỗi khi tìm kiếm sách:",
          error.response?.data || error.message
        );
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 500); // Chờ 500ms mới gọi API

    return () => clearTimeout(typingTimeoutRef.current); // Cleanup timeout khi unmount hoặc query thay đổi
  }, [query, isOpen]);

  const handleSearchChange = (e) => {
    setQuery(e.target.value);
  };

  if (!isOpen) return null;

  return (
    <div className="search-modal-overlay">
      <div className="search-modal" ref={modalRef}>
        <div className="search-modal-header">
          <div className="search-input-container">
            <input
              type="text"
              value={query}
              onChange={handleSearchChange}
              placeholder="Tìm kiếm theo tên sách..."
              autoFocus
              className="search-input"
            />
            {query && (
              <button className="clear-search" onClick={() => setQuery("")}>
                ×
              </button>
            )}
          </div>
          <button className="close-modal" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="search-modal-content">
          {loading ? (
            <div className="loading">Đang tìm kiếm...</div>
          ) : query.trim() ? (
            results.length > 0 ? (
              <>
                <h3 className="results-heading">
                  Kết quả tìm kiếm cho "{query}"
                </h3>
                <div className="results-grid">
                  {results.map((book) => (
                    <div
                      key={book._id}
                      className="result-item"
                      onClick={onClose}
                    >
                      <BookCard book={book} />
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="no-results">
                <p>Không tìm thấy kết quả cho "{query}".</p>
                <p>
                  Vui lòng thử lại với từ khóa khác hoặc duyệt qua danh mục sách
                  của chúng tôi.
                </p>
                <Link to="/books" className="btn-browse" onClick={onClose}>
                  Xem tất cả sách
                </Link>
              </div>
            )
          ) : (
            <div className="search-suggestions">
              <p>Nhập vào để tìm kiếm</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResult;
