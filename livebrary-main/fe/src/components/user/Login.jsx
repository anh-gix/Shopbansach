import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import "../../assets/style/login.css";
import { login } from "../../../services/auth";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await login(email, password);

    if (response.status == 200) {
      localStorage.setItem("userId", response.data.user._id);
      localStorage.setItem("token", response.data.token);

      if (response.data.user.role === true) {
        toast.success("Đăng nhập thành công", {
          className: "custom_toast",
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          transition: Bounce,
        });
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else if (response.data.user.role === false) {
        toast.success("Đăng nhập admin thành công", {
          className: "custom_toast",
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          transition: Bounce,
        });
        setTimeout(() => {
          navigate("/admin/manage-book");
        }, 1000);
      }
    } else {
      toast.error("Sai tài khoản hoặc mật khẩu", {
        className: "custom_toast",
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        transition: Bounce,
      });
    }
  };

  return (
    <div className="login-container">
      <ToastContainer />
      <div className="login-form">
        <h2>Đăng nhập</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-primary">
            Đăng nhập
          </button>
        </form>

        <div className="login-footer">
          <p>
            Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
