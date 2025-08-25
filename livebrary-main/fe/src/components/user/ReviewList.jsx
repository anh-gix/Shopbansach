import React, { useState, useEffect } from "react";
import "../../assets/style/reviewlist.css";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { fetchUserById } from "../../../services/auth";

const ReviewList = ({ reviews }) => {
  const [usernames, setUsernames] = useState({});

  useEffect(() => {
    const fetchUsernames = async () => {
      const userMap = {};
      await Promise.all(
        reviews.map(async (review) => {
          if (!userMap[review.userId]) {
            try {
              const user = await fetchUserById(review.userId);
              userMap[review.userId] = user.user.username;
            } catch (error) {
              userMap[review.userId] = "Người dùng ẩn danh";
            }
          }
        })
      );
      setUsernames(userMap);
    };

    fetchUsernames();
  }, [reviews]);

  const formatTimeAgo = (dateString) => {
    if (!dateString) return "Vừa xong";
    const date = new Date(dateString);
    return isNaN(date)
      ? "Vừa xong"
      : formatDistanceToNow(date, { addSuffix: true, locale: vi });
  };

  if (!reviews || reviews.length === 0) {
    return (
      <p className="no-reviews">Chưa có đánh giá nào cho cuốn sách này.</p>
    );
  }

  return (
    <div className="reviews-container">
      <div className="reviews-list">
        {reviews.map((review) => (
          <div key={review._id} className="review-card">
            <div className="review-header">
              <img
                src="/public/UserImage.png"
                className="reviewer-avatar"
                alt="Avatar"
              />
              <div className="reviewer-info">
                <h4>{usernames[review.userId] || "Đang tải..."}</h4>
                <div className="review-meta">
                  <span className="review-date">
                    {formatTimeAgo(review.createdAt)}
                  </span>
                  <span className="review-rating">
                    {"★".repeat(review.rating)}
                    {"☆".repeat(5 - review.rating)}
                  </span>
                </div>
              </div>
            </div>
            <div className="review-content">
              <p>{review.review}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewList;
