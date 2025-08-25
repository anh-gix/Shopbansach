import React, { useState, useEffect } from "react";
import BookCard from "../../components/user/BookCard";
import FilterSidebar from "../../components/user/FilterSidebar";
import "../../assets/style/booklist.css";
import Header from "../reuse/Header";
import Footer from "../reuse/Footer";
import { fetchBooks } from "../../../services/book";

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [sortOption, setSortOption] = useState("newest");

  const loadBooks = async () => {
    try {
      const data = await fetchBooks();
      setBooks(data);
      if (localStorage.getItem("genre")) {
        setSelectedGenre(localStorage.getItem("genre"));
        localStorage.removeItem("genre");
      }
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  // Lọc sách theo thể loại
  let filteredBooks = selectedGenre
    ? books.filter((book) => book.genre === selectedGenre)
    : books;

  filteredBooks = [...filteredBooks].sort((a, b) => {
    if (sortOption === "newest") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortOption === "title") {
      return (a.title || "").localeCompare(b.title || "", "vi");
    }
    return 0;
  });

  return (
    <div>
      <Header />
      <div className="book-list-container">
        <h1>Thư viện sách</h1>

        <div className="book-list-content">
          <FilterSidebar
            onGenreSelect={setSelectedGenre}
            onSortChange={setSortOption}
          />

          <div className="books-grid">
            {loading ? (
              <div className="loading">Đang tải...</div>
            ) : filteredBooks.length > 0 ? (
              filteredBooks.map((book) => (
                <BookCard key={book._id} book={book} />
              ))
            ) : (
              <div className="no-books">Không tìm thấy sách phù hợp</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookList;
