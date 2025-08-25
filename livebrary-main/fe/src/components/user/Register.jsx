import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../assets/style/register.css";
import { register } from "../../../services/auth";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  let newUser = { email, username, password };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await register(newUser);
    if (response.status == 201) {
      toast.success("Đăng ký thành công", {
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
        navigate("/login");
      }, 2000);
    } else if (response.status == 500) {
      toast.error("Tài khoản mật khẩu đã tồn tại, vui lòng thử lại ", {
        className: "custom_toast",
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        transition: Bounce,
      });
    } else
      toast.error("Lỗi đăng kí ", {
        className: "custom_toast",
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        transition: Bounce,
      });
  };

  return (
    <div className="register-container">
      <ToastContainer></ToastContainer>
      <div className="register-form">
        <h2>Đăng ký tài khoản</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Tên đăng nhập</label>
            <input
              type="text"
              id="name"
              value={username}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
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
            Đăng ký
          </button>
        </form>

        <div className="register-footer">
          <p>
            Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
