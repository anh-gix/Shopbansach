import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchBooks } from "../../../services/book.js";
import genresData from '../../../../database/livebrary.genres.json';
import '../../assets/style/salesdashboard.css';
import Sidebar_Admin from '../reuse/Sidebar_Admin';
import axios from 'axios';

const SalesDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookImages, setBookImages] = useState({});
  const [genreMap, setGenreMap] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    // Tạo map từ ID sang tên thể loại
    const map = {};
    genresData.forEach(g => {
      map[g._id.$oid] = g.name;
    });
    setGenreMap(map);

    // Lấy dữ liệu thống kê doanh số
    axios.get('http://localhost:9999/sales/stats')
      .then(async res => {
        setStats(res.data);
        // Sau khi có topBooks, lấy hình ảnh cho từng sách
        try {
          const books = await fetchBooks();
          // Tạo map: title -> image
          const imageMap = {};
          books.forEach(b => {
            imageMap[b.title] = b.image;
          });
          setBookImages(imageMap);
        } catch (e) {
          // Nếu lỗi vẫn hiển thị doanh số
        }
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Đang tải dữ liệu...</div>;
  if (error) return <div>Lỗi: {error}</div>;
  if (!stats) return <div>Không có dữ liệu doanh số.</div>;

  return (
    <div className="sales-dashboard-page sales-dashboard-bg">
      <Sidebar_Admin />
      <div className="sales-dashboard-content">
        <h2 className="page-title">Thống kê Doanh số</h2>
        <div className="sales-dashboard">
          <ul>
            <li><b>Tổng doanh thu:</b> {stats.totalRevenue ? stats.totalRevenue.toLocaleString() + 'đ' : '0đ'}</li>
            <li><b>Tổng số đơn hàng:</b> {stats.totalOrders || 0}</li>
            <li><b>Tổng số sản phẩm bán ra:</b> {stats.totalProducts || 0}</li>
            <li><b>Doanh thu trung bình/đơn:</b> {stats.avgRevenue ? stats.avgRevenue.toLocaleString() + 'đ' : '0đ'}</li>
          </ul>
          <h3>Top sách bán chạy</h3>
          {stats.topBooks && stats.topBooks.length > 0 ? (
            <ol>
              {stats.topBooks.map(b => (
                <li
                  key={b.id || b.title}
                  style={{display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer'}}
                  onClick={() => navigate(`/books/${b.id || b.title}`)}
                  title="Xem chi tiết sách"
                >
                  {bookImages[b.title] && (
                    <img src={bookImages[b.title]} alt={b.title} style={{width: '48px', height: '64px', objectFit: 'cover', borderRadius: '6px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)'}} />
                  )}
                  <span>{b.title} ({b.sold} cuốn)</span>
                </li>
              ))}
            </ol>
          ) : <div>Không có sách bán chạy.</div>}
          <h3>Doanh thu theo ngày</h3>
          {stats.revenueByDate && Object.keys(stats.revenueByDate).length > 0 ? (
            <ul>
              {Object.entries(stats.revenueByDate).map(([date, rev]) => (
                <li key={date}>{date}: {rev ? rev.toLocaleString() + 'đ' : '0đ'}</li>
              ))}
            </ul>
          ) : <div>Không có dữ liệu doanh thu theo ngày.</div>}
          <h3>Doanh thu theo thể loại</h3>
          {stats.genreRevenue && Object.keys(stats.genreRevenue).length > 0 ? (
            <ul>
              {Object.entries(stats.genreRevenue).map(([genreId, rev]) => (
                <li key={genreId}>{genreMap[genreId] || genreId}: {rev ? rev.toLocaleString() + 'đ' : '0đ'}</li>
              ))}
            </ul>
          ) : <div>Không có dữ liệu doanh thu theo thể loại.</div>}
        </div>
      </div>
    </div>
  );
};

export default SalesDashboard;
