import React, { useEffect, useState } from "react";
import "../../assets/style/filtersidebar.css";
import { fetchGenres } from "../../../services/genres";

const FilterSidebar = ({ onGenreSelect, onSortChange }) => {
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [sortOption, setSortOption] = useState("newest");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const genres = await fetchGenres();
        setGenres(genres);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      }
    };

    fetchData();
  }, []);

  const handleGenreChange = (genreId) => {
    setSelectedGenre(genreId);
    onGenreSelect(genreId);
  };

  const handleResetFilter = () => {
    setSelectedGenre(null);
    onGenreSelect(null);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
    onSortChange(e.target.value);
  };

  return (
    <div className="filter-sidebar">
      <div className="filter-section">
        <h3>Thể loại</h3>
        <ul className="category-filter">
          {genres.map((category) => (
            <li key={category._id}>
              <label>
                <input
                  type="radio"
                  name="category"
                  value={category._id}
                  checked={selectedGenre === category._id}
                  onChange={() => handleGenreChange(category._id)}
                />
                {category.name}
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div className="filter-section">
        <h3>Sắp xếp theo</h3>
        <select
          className="sort-select"
          value={sortOption}
          onChange={handleSortChange}
        >
          <option value="newest">Mới nhất</option>
          <option value="title">Theo tên (A-Z)</option>
        </select>
      </div>

      <button className="btn-reset-filter" onClick={handleResetFilter}>
        Đặt lại bộ lọc
      </button>
    </div>
  );
};

export default FilterSidebar;
