import React, { useState, useEffect } from "react";
import BookSlider from "./BookSlider";
import "../../assets/style/featuredbooks.css";
import { fetchBooks } from "../../../services/book";

const FeaturedBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookResponse = await fetchBooks();

        console.log(bookResponse);

        const filteredBooks = bookResponse.filter(
          (book) => book.genre === "67d6787365d9ff421be796b5"
        );

        console.log(filteredBooks);

        setBooks(filteredBooks);
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

  return <BookSlider title="Sách nổi bật" books={books} viewAllLink="/books" />;
};

export default FeaturedBooks;
