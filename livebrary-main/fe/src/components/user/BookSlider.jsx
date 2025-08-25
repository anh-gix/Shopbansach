import React from "react";
import { Link } from "react-router-dom";
import "../../assets/style/bookslider.css";

const BookSlider = ({ title, books, viewAllLink }) => {
  return (
    <div className="book-slider">
      <div className="slider-header">
        <h2>{title}</h2>
        {viewAllLink && (
          <Link to={viewAllLink} className="view-all">
            Xem tất cả
          </Link>
        )}
      </div>

      <div className="slider-container">
        <div className="slider-content">
          {books.map((book) => (
            <div key={book._id} className="slider-item">
              <Link to={`/books/${book._id}`}>
                <img src={book.image} alt={book.title} />
                <div className="book-info">
                  <h3>{book.title}</h3>
                  <p>{book.author}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookSlider;
