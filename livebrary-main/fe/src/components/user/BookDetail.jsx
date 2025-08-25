import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import ReviewList from "../../components/user/ReviewList";
import BookRecommendation from "../../components/user/BookRecommendation";
import "../../assets/style/bookdetail.css";
import Header from "../reuse/Header";
import Footer from "../reuse/Footer";
import { fetchBookById } from "../../../services/book";
import { addToCart } from "../../../services/cart";
import {
  addToFavorites,
  deleteFavorite,
  getFavoritesByUser,
} from "../../../services/favorite";
import { addReview, fetchReviewsByBook } from "../../../services/review";
import { fetchGenres } from "../../../services/genres";

const BookDetail = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [genres, setGenres] = useState([]);
  const [adding, setAdding] = useState(false);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchData = async () => {
      try {
  
        const bookResponse = await fetchBookById(id);
        setBook(bookResponse);

        const genres = await fetchGenres();
        setGenres(genres);

        console.log(genres);

        const favoriteResponse = await getFavoritesByUser(userId);
        const favorites = favoriteResponse || [];
        setIsFavorite(favorites.some((fav) => fav.bookId === id));

        // Lấy danh sách đánh giá của sách
        const reviewResponse = await fetchReviewsByBook(id);
        setReviews(reviewResponse);

        document.getElementById("top").scrollIntoView({
          behavior: "smooth",
        });

        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [id, userId]);

  const toggleFavorite = async () => {
    try {
      if (isFavorite) {
        try {
          await deleteFavorite(userId, id);
        } catch (error) {
          console.error("Lỗi khi xóa sách khỏi danh sách yêu thích:", error);
        }
      } else {
        await addToFavorites(userId, id);
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Lỗi khi cập nhật yêu thích:", error);
    }
  };

  const handleSubmitReview = async () => {
    if (!rating || !reviewText) {
      alert("Vui lòng nhập đánh giá và chọn số sao!");
      return;
    }

    try {
      const newReview = {
        bookId: id,
        userId,
        rating,
        review: reviewText,
      };

      await addReview(newReview);
      setReviews([...reviews, newReview]); // Cập nhật UI
      setRating(0);
      setReviewText("");
    } catch (error) {
      console.error("Lỗi khi gửi đánh giá:", error);
    }
  };

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  return (
    <>
      <Header />
      <div className="book-detail-container">
        <div className="book-detail-header">
          <div className="book-detail-book-cover">
            <img src={book.image} alt={book.title} />
          </div>
          <div className="book-info">
            <h1>{book.title}</h1>
            <p className="book-author">Tác giả: {book.author}</p>

            <div className="book-meta">
              <p>
                <strong>Năm xuất bản:</strong> {book.publicationYear}
              </p>
              <p>
                <strong>Nhà xuất bản:</strong> {book.author}
              </p>
              <p>
                <strong>Cập nhật:</strong>{" "}
                {new Date(book.updatedAt).toLocaleDateString("vi-VN")}
              </p>

              <p>
                <strong>Thể loại:</strong>{" "}
                {genres.find((g) => g._id == book.genre)?.name}
              </p>
            </div>

            <div className="book-actions">
              <button
                className={`btn-favorite ${isFavorite ? "active" : ""}`}
                onClick={toggleFavorite}
              >
                {isFavorite ? "Đã thêm vào yêu thích" : "Thêm vào yêu thích"}
              </button>
              <button
                className="btn-add-cart"
                disabled={adding || book.stock <= 0}
                onClick={async () => {
                  try {
                    setAdding(true);
                    await addToCart(book._id, 1);
                    alert("Đã thêm vào giỏ hàng");
                  } catch (e) {
                    alert("Lỗi khi thêm giỏ hàng");
                  } finally {
                    setAdding(false);
                  }
                }}
              >
                {book.stock > 0 ? "Thêm vào giỏ" : "Hết hàng"}
              </button>
              <button
                className="btn-share"
                onClick={() => alert("Chia sẻ sách: " + book.title)}
              >
                Chia sẻ
              </button>
            </div>
          </div>
        </div>

        <div className="book-description">
          <h2>Giới thiệu sách</h2>
          <p>{book.description}</p>
          <p><strong>Giá:</strong> {book.price?.toLocaleString('vi-VN')}₫</p>
          <p><strong>Tồn kho:</strong> {book.stock}</p>
        </div>

        <div className="book-reviews">
          <h2>Đánh giá và bình luận</h2>
          <ReviewList reviews={reviews} />

          <div className="write-review">
            <h3>Viết đánh giá của bạn</h3>
            <div className="rating-input">
              <span>Đánh giá: </span>
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`star ${rating === star ? "selected" : ""}`}
                    onClick={() => setRating(star)}
                    style={{ cursor: "pointer", fontSize: "24px" }}
                  >
                    {star <= rating ? "★" : "☆"}
                  </span>
                ))}
              </div>
            </div>
            <textarea
              placeholder="Chia sẻ suy nghĩ của bạn về cuốn sách..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            ></textarea>
            <button className="btn-submit" onClick={handleSubmitReview}>
              Gửi đánh giá
            </button>
          </div>
        </div>

        <div className="book-recommendations">
          <h2>Có thể bạn cũng thích</h2>
          <BookRecommendation bookId={book.id} />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BookDetail;
