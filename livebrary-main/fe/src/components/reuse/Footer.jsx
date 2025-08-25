import React from "react";
import { Link } from "react-router-dom";
import "../../assets/style/footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Về BookShare</h3>
          <ul>
            <li>
              <Link to="/about">Giới thiệu</Link>
            </li>
            <li>
              <Link to="/contact">Liên hệ</Link>
            </li>
            <li>
              <Link to="/privacy">Chính sách bảo mật</Link>
            </li>
            <li>
              <Link to="/terms">Điều khoản sử dụng</Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Khám phá</h3>
          <ul>
            <li>
              <Link to="/books">Thư viện sách</Link>
            </li>
            <li>
              <Link to="/communities">Cộng đồng</Link>
            </li>
            <li>
              <Link to="/authors">Tác giả</Link>
            </li>
            <li>
              <Link to="/categories">Thể loại</Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Kết nối với chúng tôi</h3>
          <div className="social-links">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Facebook
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Twitter
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h3>Đăng ký nhận tin</h3>
          <div className="newsletter">
            <input type="email" placeholder="Email của bạn" />
            <button>Đăng ký</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
