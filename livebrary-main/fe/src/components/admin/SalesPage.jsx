import React, { useEffect, useState, useMemo } from "react";
import Sidebar_Admin from "../reuse/Sidebar_Admin";
import { fetchBooks } from "../../../services/book";
import "../../assets/style/bookSale.css";
import {
  FaSearch,
  FaShoppingCart,
  FaCheckCircle,
  FaSpinner,
  FaPlus,
  FaMinus,
  FaTrash,
} from "react-icons/fa";

const SalesPage = () => {
  const [books, setBooks] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getBooks = async () => {
      try {
        const data = await fetchBooks();
        setBooks(data);
      } catch (err) {
        console.error(err);
        alert("Lấy sách thất bại");
      }
    };
    getBooks();
  }, []);

  const filtered = useMemo(() => {
    const k = keyword.toLowerCase();
    return books.filter(
      (b) =>
        b.title.toLowerCase().includes(k) ||
        (b.author && b.author.toLowerCase().includes(k))
    );
  }, [books, keyword]);

  const addItem = (book) => {
    const idx = items.findIndex((i) => i.bookId === book._id);
    if (idx >= 0) {
      const clone = [...items];
      clone[idx].quantity += 1;
      setItems(clone);
    } else {
      setItems([
        ...items,
        { bookId: book._id, title: book.title, price: book.price, quantity: 1 },
      ]);
    }
  };

  // Hàm cập nhật số lượng chung
  const updateQuantity = (bookId, qty) => {
    const q = Math.max(0, Number(qty) || 0);
    setItems((prev) =>
      prev
        .map((i) => (i.bookId === bookId ? { ...i, quantity: q } : i))
        .filter((i) => i.quantity > 0)
    );
  };

  // Hàm giảm số lượng
  const decrementQuantity = (bookId) => {
    setItems((prev) =>
      prev
        .map((i) =>
          i.bookId === bookId ? { ...i, quantity: i.quantity - 1 } : i
        )
        .filter((i) => i.quantity > 0)
    );
  };

  // Hàm xóa sản phẩm
  const removeItem = (bookId) => {
    setItems((prev) => prev.filter((i) => i.bookId !== bookId));
  };

  const subtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0);

  const submit = async () => {
    if (items.length === 0) return alert("Chưa chọn sách");
    try {
      setLoading(true);
      const payload = {
        items: items.map((i) => ({ bookId: i.bookId, quantity: i.quantity })),
        shippingFee: 0,
      };
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:9999/order/manual", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed");
      alert("Tạo đơn thành công");
      setItems([]);
    } catch (e) {
      console.error(e);
      alert("Lỗi tạo đơn");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-container">
      <Sidebar_Admin />
      <div className="main-content">
        <h2 className="page-title">Tạo Đơn Bán Hàng</h2>
        <div className="sales-layout">
          {/* Book List Section */}
          <div className="section book-list-section">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                placeholder="Tìm sách theo tên hoặc tác giả..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
            <div className="book-items-container">
              {filtered.length > 0 ? (
                filtered.map((b) => (
                  <div className="book-item" key={b._id}>
                    <div className="book-info">
                      <div className="book-title">{b.title}</div>
                      <div className="book-author">{b.author}</div>
                    </div>
                    <div className="book-price-and-action">
                      <div className="book-price">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(b.price || 0)}
                      </div>
                      <button className="add-button" onClick={() => addItem(b)}>
                        Chọn
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-results">Không tìm thấy sách nào.</p>
              )}
            </div>
          </div>

          {/* Cart Section */}
          <div className="section cart-section">
            <h3 className="cart-title">
              <FaShoppingCart className="cart-icon" /> Giỏ Hàng
            </h3>
            <div className="cart-items-container">
              {items.length > 0 ? (
                items.map((i) => (
                  <div className="cart-item" key={i.bookId}>
                    <div className="cart-item-title">{i.title}</div>
                    <div className="cart-item-details">
                      {/* Nút giảm số lượng */}
                      <button
                        className="quantity-btn"
                        onClick={() => decrementQuantity(i.bookId)}
                      >
                        <FaMinus />
                      </button>

                      <input
                        type="number"
                        min={1}
                        value={i.quantity}
                        onChange={(e) =>
                          updateQuantity(i.bookId, e.target.value)
                        }
                      />
                      {/* Nút tăng số lượng */}
                      <button
                        className="quantity-btn"
                        onClick={() => updateQuantity(i.bookId, i.quantity + 1)}
                      >
                        <FaPlus />
                      </button>
                      <div className="cart-item-price">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(i.quantity * i.price)}
                      </div>
                      {/* Nút xóa sản phẩm */}
                      <button
                        className="remove-item-btn"
                        onClick={() => removeItem(i.bookId)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="empty-cart-message">Giỏ hàng trống.</p>
              )}
            </div>
            <div className="cart-summary">
              <div className="subtotal">
                <strong>Tổng cộng:</strong>
                <span className="subtotal-amount">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(subtotal)}
                </span>
              </div>
              <button
                className="submit-button"
                onClick={submit}
                disabled={loading || items.length === 0}
              >
                {loading ? (
                  <FaSpinner className="loading-icon" />
                ) : (
                  <>
                    <FaCheckCircle /> Tạo Đơn
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesPage;
