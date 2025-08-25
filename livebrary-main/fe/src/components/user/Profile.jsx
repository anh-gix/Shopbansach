import React, { useState, useEffect } from "react";
import "../../assets/style/profile.css";
import Header from "../reuse/Header";
import Footer from "../reuse/Footer";
import { fetchUserById, updateUser } from "../../../services/auth";
import { format } from "date-fns";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(null);

  const userID = localStorage.getItem("userId");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await fetchUserById(userID);

        setProfile(user.user);

        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [userID, profile]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setEditedProfile({ ...profile });
    }
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      const updatedUser = await updateUser(userID, {
        username: editedProfile.username,
        password: editedProfile.password,
      });

      setProfile(updatedUser);
      setIsEditing(false);

      console.log("Cập nhật thành công:", updatedUser);
    } catch (error) {
      console.error("Lỗi khi cập nhật hồ sơ:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile({ ...editedProfile, [name]: value });
  };

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  return (
    <>
      <Header />
      <div className="profile-container">
        <h1>Hồ sơ của tôi</h1>

        <div className="profile-content">
          <div className="profile-main">
            <div className="profile-avatar">
              <img src="/public/UserImage.png" alt="Avatar" />
            </div>

            <div className="profile-info">
              {isEditing ? (
                <form className="profile-form">
                  <div className="form-group">
                    <label>Tên người dùng</label>
                    <input
                      type="text"
                      name="username"
                      value={editedProfile.username}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Mật khẩu</label>
                    <input
                      type="password"
                      name="password"
                      value={editedProfile.password}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-actions">
                    <button
                      type="button"
                      className="btn-save"
                      onClick={handleSaveProfile}
                    >
                      Lưu thay đổi
                    </button>
                    <button
                      type="button"
                      className="btn-cancel"
                      onClick={handleEditToggle}
                    >
                      Hủy
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="profile-detail">
                    <div className="detail-item">
                      <span className="detail-label">Họ tên:</span>
                      <span className="detail-value">{profile?.username}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Email:</span>
                      <span className="detail-value">{profile?.email}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Ngày tham gia:</span>
                      <span className="detail-value">
                        {profile?.createdAt
                          ? format(new Date(profile.createdAt), "dd/MM/yyyy")
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                  <button className="btn-edit" onClick={handleEditToggle}>
                    Chỉnh sửa
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
