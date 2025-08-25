import React from "react";
import { Link } from "react-router-dom";
import "../../assets/style/bookcard.css";

const BookCard = ({ book }) => {
  return (
    <div className="book-card">
      <Link to={`/books/${book._id}`} className="book-cover">
        <img src={book.image} alt={book.title} />
      </Link>
      <div className="book-info">
        <h3 className="book-title">
          <Link to={`/books/${book._id}`}>{book.title}</Link>
        </h3>
        <p className="book-author">{book.author}</p>
        {book.price !== undefined && (
          <p className="book-price">{book.price.toLocaleString('vi-VN')}₫</p>
        )}
      </div>
    </div>
  );
};

export default BookCard;
