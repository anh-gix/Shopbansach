import React from "react";
import {
  FaUsers,
  FaDollarSign,
  FaPenFancy,
  FaServicestack,
  FaProductHunt,
  FaPeopleArrows,
  FaHome,
  FaSign,
  FaSearchDollar,
  FaStore,
  FaSignOutAlt,
} from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import "../../assets/style/sidebarAdmin.css";
import { CgLogOut } from "react-icons/cg";

const Sidebar_Admin = ({ isSidebarOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const logOut = () => {
    localStorage.clear();
    navigate("/login");
  };

  // Hàm kiểm tra đường dẫn để set active class
  const isActive = (path) => (location.pathname === path ? "active" : "");

  return (
    <div className={`sidebar ${isSidebarOpen ? "active" : ""}`}>
      <div className="sidebar-brand"></div>
      <div className="sidebar-menu-toggle" onClick={toggleSidebar}>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div className="sidebar-menu">
        <button
          className={`sidebar-link ${isActive("/admin/manage-user")}`}
          onClick={() => navigate("/admin/manage-genre")}
        >
          <FaUsers /> Quản lý thể loại
        </button>
        <button
          className={`sidebar-link ${isActive("/admin/manage-branches")}`}
          onClick={() => navigate("/admin/manage-book")}
        >
          <FaHome /> Quản lý sách
        </button>
        <button
          className={`sidebar-link ${isActive("/admin/manage-service")}`}
          onClick={() => navigate("/admin/manage-community")}
        >
          <FaServicestack /> Quản lý cộng đồng
        </button>
        <button
          className={`sidebar-link ${isActive("/admin/sales")}`}
          onClick={() => navigate("/admin/sales")}
        >
          <FaDollarSign /> Bán hàng
        </button>
        <button
          className={`sidebar-link ${isActive("/admin/orders")}`}
          onClick={() => navigate("/admin/orders")}
        >
          <FaStore /> Đơn hàng
        </button>
        <button className={`sidebar-link `} onClick={() => logOut()}>
          <CgLogOut /> Đăng Xuất
        </button>
      </div>
    </div>
  );
};

export default Sidebar_Admin;
