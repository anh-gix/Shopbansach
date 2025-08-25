import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../../assets/style/communities.css";
import Header from "../reuse/Header";
import { fetchCommunities } from "../../../services/community";

const Communities = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [communities, setCommunities] = useState([]);

  useEffect(() => {
    const loadCommunities = async () => {
      try {
        const data = await fetchCommunities();
        setCommunities(data || []);
      } catch (error) {
        setError("Không thể tải danh sách cộng đồng. Vui lòng thử lại!");
      } finally {
        setLoading(false);
      }
    };

    loadCommunities();
  }, []);

  return (
    <>
      <Header />
      <div className="communities-container">
        <div className="communities-header">
          <h1>Cộng đồng đọc sách</h1>
        </div>

        {loading ? (
          <div className="loading">Đang tải...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : communities.length === 0 ? (
          <p className="no-communities">Chưa có cộng đồng nào.</p>
        ) : (
          <div className="communities-grid">
            {communities.map((community) => (
              <div key={community._id} className="community-card">
                <div className="community-image">
                  <img src={community.image} alt={community.name} />
                </div>
                <div className="community-info">
                  <h3>{community.name}</h3>
                  <p>{community.description}</p>
                  <div className="community-meta">
                    <span>
                      {community.members?.length.toLocaleString() || 0} thành
                      viên
                    </span>
                  </div>
                  <Link
                    to={`/communities/${community._id}`}
                    className="btn-view"
                  >
                    Xem chi tiết
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Communities;
