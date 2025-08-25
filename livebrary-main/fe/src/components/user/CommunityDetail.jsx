import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../reuse/Header";
import {
  fetchCommunityById,
  joinCommunity,
  leaveCommunity,
} from "../../../services/community";
import { createPost, fetchPostsByCommunity } from "../../../services/post";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import "../../assets/style/communitydetail.css";

const CommunityDetail = () => {
  const { id } = useParams();
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMember, setIsMember] = useState(false);
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const loadCommunityData = async () => {
      try {
        const communityData = await fetchCommunityById(id);
        const postsData = await fetchPostsByCommunity(id);

        setCommunity(communityData);
        setPosts(postsData);
        setIsMember(communityData.members.includes(userId));
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu cộng đồng:", error);
      } finally {
        setLoading(false);
      }
    };
    loadCommunityData();
  }, [id]);

  const handleToggleMembership = async () => {
    if (isProcessing) return;

    setIsProcessing(true);
    try {
      if (isMember) {
        await leaveCommunity(id);
        setCommunity((prev) => ({
          ...prev,
          members: prev.members.filter((member) => member !== userId),
        }));
      } else {
        await joinCommunity(id);
        setCommunity((prev) => ({
          ...prev,
          members: [...prev.members, userId],
        }));
      }
      setIsMember(!isMember);
    } catch (error) {
      console.error("Lỗi khi cập nhật thành viên:", error);
    }
    setIsProcessing(false);
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!postTitle.trim() || !postContent.trim()) return;

    try {
      await createPost({
        title: postTitle,
        content: postContent,
        communityId: id,
        userId,
      });
      const updatedPosts = await fetchPostsByCommunity(id);
      setPosts(updatedPosts);
      setPostTitle("");
      setPostContent("");
    } catch (error) {
      console.error("Lỗi khi đăng bài:", error);
    }
  };

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  return (
    <>
      <Header />
      <div className="community-detail-container">
        <div className="community-header">
          <img
            src={community.image}
            alt={community.name}
            className="community-banner"
          />
          <div className="community-info">
            <h1>{community.name}</h1>
            <p>{community.description}</p>
            <div className="community-meta">
              <span>{community.members.length} thành viên</span>
              <span>
                Thành lập:{" "}
                {new Date(community.createdAt).toLocaleDateString("vi-VN")}
              </span>
            </div>
            <button
              className={`btn-membership ${isMember ? "leave" : "join"}`}
              onClick={handleToggleMembership}
              disabled={isProcessing}
            >
              {isProcessing
                ? "Đang xử lý..."
                : isMember
                ? "Rời cộng đồng"
                : "Tham gia cộng đồng"}
            </button>
          </div>
        </div>

        <div className="community-content">
          {isMember ? (
            <>
              <div className="post-form">
                <h3>Đăng bài trong cộng đồng</h3>
                <form onSubmit={handleCreatePost}>
                  <input
                    type="text"
                    placeholder="Tiêu đề bài viết..."
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                  />
                  <textarea
                    placeholder="Chia sẻ suy nghĩ của bạn..."
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                  ></textarea>
                  <button type="submit" className="btn-post">
                    Đăng bài
                  </button>
                </form>
              </div>

              <div className="posts-container">
                <h3>Bài đăng gần đây</h3>
                {posts.length > 0 ? (
                  posts
                    .sort(
                      (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
                    )
                    .map((post) => (
                      <div key={post._id} className="post-card">
                        <div className="post-header">
                          <span className="post-author">
                            Người đăng: {post.userId.username}
                          </span>
                          <span className="post-time">
                            {formatDistanceToNow(new Date(post.updatedAt), {
                              addSuffix: true,
                              locale: vi,
                            })}
                          </span>
                        </div>
                        <div className="post-content">
                          <h4>{post.title}</h4>
                          <p>{post.content}</p>
                        </div>
                      </div>
                    ))
                ) : (
                  <p>Chưa có bài đăng nào.</p>
                )}
              </div>
            </>
          ) : (
            <div className="community-restricted">
              <h3>Bạn cần tham gia cộng đồng để xem nội dung.</h3>
            </div>
          )}

          <div className="community-sidebar">
            <div className="community-rules">
              <h3>Nội quy cộng đồng</h3>
              <p>1. Tôn trọng mọi người.</p>
              <p>2. Không spam, quảng cáo.</p>
              <p>3. Chia sẻ nội dung có giá trị.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CommunityDetail;
