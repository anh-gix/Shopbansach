import React, { useState, useEffect } from "react";
import BookSlider from "./BookSlider";
import "../../assets/style/bookrecommendation.css";
import { fetchBooks } from "../../../services/book";

const BookRecommendation = ({ bookId }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookResponse = await fetchBooks();

        console.log("Books before shuffle:", bookResponse);

        const shuffledBooks = bookResponse.sort(() => Math.random() - 0.5);

        console.log("Books after shuffle:", shuffledBooks);

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

  return (
    <BookSlider title="Sách tương tự" books={books} viewAllLink={`/books`} />
  );
};

export default BookRecommendation;
