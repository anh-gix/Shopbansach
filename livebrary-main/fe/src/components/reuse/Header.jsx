import React, { useEffect, useState } from "react";
import { FaCarTunnel, FaLocationDot } from "react-icons/fa6";
import "../../assets/style/header.css";
import { FaBell, FaMobileAlt, FaRegPaperPlane, FaSearch } from "react-icons/fa";
import { FaUser, FaRegClock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BsCart } from "react-icons/bs";
import { SlLogout } from "react-icons/sl";
import { CgProfile } from "react-icons/cg";
import { jwtDecode } from "jwt-decode";

const Header = () => {
  const curentUser = localStorage.getItem("token");
  const [isLogin, setIsLogin] = useState(false);
  const [username, setUsername] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (curentUser != null) {
      const token = localStorage.getItem("token");
      const decode = jwtDecode(token);
      setUsername(decode.username);
    }
  }, []);

  useEffect(() => {
    if (curentUser !== null) {
      setIsLogin(true);
    }
  }, [curentUser]);

  const handleNavigate = (link) => {
    navigate(link);
  };

  const handleLogout = () => {
    localStorage.clear();

    setIsLogin(false);
    navigate("/");
  };

  const handleLogin = () => {
    toast.success("loginnnnn");
    navigate("/login");
  };

  return (
    <div id="top">
      <nav className="prenav">
        <div className="prenav-brand">
          <span> LIVEBRARY</span>
        </div>
        <div className="prenav-container">
          <div className="prenav-item">
            <div className="prenav-icon">
              <FaRegClock style={{ color: "gray" }}></FaRegClock>
            </div>
            <div className="prenav-item-content">
              <p>THỨ 2-THỨ 6: 08:00 SÁNG - 20:00 TỐI</p>
              <i>Thứ 7 và Chủ Nhật : ĐÓNG CỬA </i>
            </div>
          </div>
          <div className="prenav-item">
            <div className="prenav-icon">
              <FaMobileAlt style={{ color: "gray" }}></FaMobileAlt>
            </div>
            <div className="prenav-item-content">
              <p>0938.343.432</p>
              <i>Liên hệ ngay </i>
            </div>
          </div>
          <div className="prenav-item">
            <div className="prenav-icon">
              <FaLocationDot style={{ color: "gray" }}></FaLocationDot>
            </div>
            <div className="prenav-item-content">
              <p>TP.HCM</p>
              <i style={{ color: "green" }}>Đang mở cửa</i>
            </div>
          </div>
        </div>
      </nav>

      <nav className="navbar">
        <div className="navbar-container">
          <div className={`nav-items`}>
            <div>
              <Link to="/" className="nav-link">
                Trang chủ
              </Link>
            </div>
            <div>
              <Link to="/books" className="nav-link">
                Thư viện sách
              </Link>
            </div>
            <div>
              <Link to="/communities" className="nav-link">
                Cộng Đồng
              </Link>
            </div>
            <div>
              <Link to="/favorites" className="nav-link">
                Yêu Thích
              </Link>
            </div>
          </div>
        </div>

        <div className="navbar-funct">
          <div className="navbar-icons">
            <FaSearch></FaSearch>
          </div>
          <div className="navbar-icons">
            <FaBell style={{ color: "red" }}></FaBell>
          </div>

          {isLogin ? (
            <div className="user-hover">
              <FaUser />
              <div className="user-content">
                <div className="user-info">
                  <p className="username">{username}</p>
                  <div
                    className="manage-container"
                    style={{ marginTop: "15px" }}
                  >
                    <p>Quản lí sách</p>
                  </div>
                  <div
                    className="manage-item-container"
                    onClick={() => handleNavigate("/favorites")}
                  >
                    <BsCart />
                    <p>Danh sách yêu thích</p>
                  </div>

                  <div className="manage-container">
                    <p>Mua sắm</p>
                  </div>
                  <div
                    className="manage-item-container"
                    onClick={() => handleNavigate("/cart")}
                  >
                    <BsCart />
                    <p>Giỏ hàng</p>
                  </div>
                  <div
                    className="manage-item-container"
                    onClick={() => handleNavigate("/orders")}
                  >
                    <BsCart />
                    <p>Đơn hàng của tôi</p>
                  </div>

                  <div className="manage-container">
                    <p>Tài khoản</p>
                  </div>
                  <div
                    className="manage-item-container"
                    onClick={() => handleNavigate("/profile")}
                  >
                    <CgProfile />
                    <p>Thông tin cá nhân</p>
                  </div>
                  <div className="manage-item-container" onClick={handleLogout}>
                    <SlLogout />
                    <p>Đăng xuất</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="homepage-login" onClick={handleLogin}>
              <p>Đăng Nhập</p>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Header;
