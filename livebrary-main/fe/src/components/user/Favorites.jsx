import React, { useState, useEffect } from "react";
import BookCard from "../../components/user/BookCard";
import "../../assets/style/favorites.css";
import Header from "../reuse/Header";
import Footer from "../reuse/Footer";
import { deleteFavorite, getFavoritesByUser } from "../../../services/favorite";
import { fetchBookById } from "../../../services/book";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const favor = await getFavoritesByUser(userId);

        const books = await Promise.all(
          favor.map((f) => fetchBookById(f.bookId))
        );

        setFavorites(books);
      } catch (error) {
        console.log("Không thể tải. Vui lòng thử lại!");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const removeFromFavorites = async (bookId) => {
    try {
      await deleteFavorite(userId, bookId);
      setFavorites(favorites.filter((book) => book._id !== bookId));
    } catch (error) {
      console.error("Lỗi khi xóa sách khỏi danh sách yêu thích:", error);
    }
  };

  return (
    <>
      <Header></Header>
      <div className="favorites-container">
        <h1>Sách yêu thích của tôi</h1>

        {loading ? (
          <div className="loading">Đang tải...</div>
        ) : favorites.length > 0 ? (
          <div className="favorites-grid">
            {favorites.map((book) => (
              <div key={book._id} className="favorite-item">
                <BookCard book={book} />
                <button
                  className="btn-remove"
                  onClick={() => removeFromFavorites(book._id)}
                >
                  Xóa khỏi danh sách
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-favorites">
            <p>Bạn chưa có sách yêu thích nào.</p>
            <a href="/books" className="btn-browse">
              Khám phá sách ngay
            </a>
          </div>
        )}
      </div>
    </>
  );
};

export default Favorites;
