import React, { useState, useEffect } from "react";
import BookSlider from "./BookSlider";
import { fetchBooks } from "../../../services/book";

const RecommendedBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookResponse = await fetchBooks();

        const shuffledBooks = bookResponse.sort(() => Math.random() - 0.5);

        setBooks(shuffledBooks);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  return <BookSlider title="Dành cho bạn" books={books} viewAllLink="/books" />;
};

export default RecommendedBooks;
