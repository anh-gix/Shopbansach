import React, { useState, useEffect } from "react";
import axios from "axios";
import BookSlider from "../../components/user/BookSlider";
import "../../assets/style/homepage.css";
import FeaturedBooks from "../../components/user/FeaturedBooks";
import RecommendedBooks from "../../components/user/RecommendedBooks";
import Header from "../reuse/Header";
import Footer from "../reuse/Footer";
import SearchResults from "./SearchResults";
import { fetchGenres } from "../../../services/genres";
import { fetchCommunities } from "../../../services/community";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [genres, setGenres] = useState([]);
  const [communities, setCommunities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGenress = async () => {
      try {
        const response = await fetchGenres();
        setGenres(response);
      } catch (error) {
        console.error(
          "Lỗi khi lấy danh sách thể loại:",
          error.response?.data || error.message
        );
      }
    };

    const loadCommunities = async () => {
      try {
        const data = await fetchCommunities();
        setCommunities(data || []);
      } catch (error) {}
    };

    loadCommunities();
    fetchGenress();
  }, []);

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleNavigate = (id) => {
    navigate(`/communities/${id}`);
  };

  const handleNavigateGenres = (id) => {
    localStorage.setItem("genre", id);
    navigate(`/books`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchModalOpen(true);
    }
  };

  return (
    <>
      <Header />

      <div className="home-container">
        <section className="hero-section">
          <div className="hero-content">
            <h1>Khám phá thế giới qua từng trang sách</h1>
            <p>Tìm kiếm, đọc và chia sẻ những cuốn sách yêu thích của bạn</p>
            <form className="search-container" onSubmit={handleSearchSubmit}>
              <input
                type="text"
                placeholder="Tìm kiếm theo tên sách, tác giả..."
                value={searchQuery}
                onChange={handleSearchInputChange}
              />
              <button type="submit" className="btn-search">
                Tìm kiếm
              </button>
            </form>
          </div>
        </section>

        <section className="featured-section appear">
          <FeaturedBooks />
        </section>

        <section className="recommended-section appear">
          <RecommendedBooks />
        </section>

        <section className="category-section appear">
          <h2>Thể loại</h2>
          <div className="category-list">
            {genres.length > 0 ? (
              genres.map((genre) => (
                <div
                  key={genre._id}
                  className="category-item"
                  onClick={() => handleNavigateGenres(genre._id)}
                >
                  {genre.name}
                </div>
              ))
            ) : (
              <p>Đang tải thể loại...</p>
            )}
          </div>
        </section>

        <section className="community-preview appear">
          <h2>Cộng đồng đọc sách</h2>
          <div className="community-cards">
            {communities.map((c) => {
              return (
                <div
                  className="community-card"
                  key={c._id}
                  onClick={() => handleNavigate(c._id)}
                >
                  <h3>{c.name}</h3>
                  <p> {c.members?.length.toLocaleString() || 0} thành viên</p>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <Footer />

      {/* Search Modal */}
      <SearchResults
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        initialQuery={searchQuery}
      />
    </>
  );
};

export default Home;
