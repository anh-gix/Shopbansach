import React, { useEffect, useMemo, useState } from "react";
import Sidebar_Admin from "../reuse/Sidebar_Admin";
import { fetchBooks } from "../../../services/book";
import { createOrder } from "../../../services/order";

const SalesPage = () => {
  const [books, setBooks] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [items, setItems] = useState([]); // {bookId, title, price, quantity}
  const [customer, setCustomer] = useState({ name: "", phone: "", email: "", address: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBooks().then(setBooks).catch(() => {});
  }, []);

  const filtered = useMemo(() => {
    const k = keyword.toLowerCase();
    return books.filter(b => b.title.toLowerCase().includes(k) || b.author.toLowerCase().includes(k));
  }, [books, keyword]);

  const addItem = (book) => {
    const idx = items.findIndex(i => i.bookId === book._id);
    if (idx >= 0) {
      const clone = [...items];
      clone[idx].quantity += 1;
      setItems(clone);
    } else {
      setItems([...items, { bookId: book._id, title: book.title, price: book.price, quantity: 1 }]);
    }
  };

  const changeQty = (bookId, qty) => {
    const q = Math.max(0, Number(qty) || 0);
    setItems(prev => prev.map(i => i.bookId === bookId ? { ...i, quantity: q } : i).filter(i => i.quantity > 0));
  };

  const subtotal = items.reduce((s, i) => s + i.quantity * i.price, 0);

  const submit = async () => {
    if (items.length === 0) return alert("Chưa chọn sách");
    try {
      setLoading(true);
      // use manual order endpoint
      const payload = {
        customerName: customer.name,
        customerPhone: customer.phone,
        customerEmail: customer.email,
        customerAddress: customer.address,
        items: items.map(i => ({ bookId: i.bookId, quantity: i.quantity })),
        shippingFee: 0
      };
      // reuse order service update endpoint via axios directly
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:9999/order/manual`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Failed');
      alert("Tạo đơn thành công");
      setItems([]);
    } catch (e) {
      alert("Lỗi tạo đơn");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-container">
      <Sidebar_Admin />
      <div className="main-content">
        <h2>Bán hàng</h2>
        <div style={{ display: 'flex', gap: 24 }}>
          <div style={{ flex: 1 }}>
            <input placeholder="Tìm sách..." value={keyword} onChange={e => setKeyword(e.target.value)} />
            <div style={{ maxHeight: 400, overflow: 'auto', marginTop: 8 }}>
              {filtered.map(b => (
                <div key={b._id} style={{ display: 'flex', justifyContent: 'space-between', padding: 8, borderBottom: '1px solid #eee' }}>
                  <div>
                    <div>{b.title}</div>
                    <div style={{ fontSize: 12, color: '#666' }}>{b.author}</div>
                  </div>
                  <div>
                    <div>{(b.price||0).toLocaleString('vi-VN')}₫</div>
                    <button onClick={() => addItem(b)} disabled={(b.stock||0) <= 0}>Chọn</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <h3>Giỏ bán</h3>
            {items.map(i => (
              <div key={i.bookId} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, padding: 8, borderBottom: '1px solid #eee' }}>
                <div>{i.title}</div>
                <input type="number" value={i.quantity} min={1} onChange={e => changeQty(i.bookId, e.target.value)} style={{ width: 70 }} />
                <div>{(i.quantity * i.price).toLocaleString('vi-VN')}₫</div>
              </div>
            ))}
            <div style={{ marginTop: 12, textAlign: 'right' }}>
              <strong>Tạm tính: {subtotal.toLocaleString('vi-VN')}₫</strong>
            </div>
            <h3>Khách hàng</h3>
            <input placeholder="Tên" value={customer.name} onChange={e => setCustomer({ ...customer, name: e.target.value })} />
            <input placeholder="SĐT" value={customer.phone} onChange={e => setCustomer({ ...customer, phone: e.target.value })} />
            <input placeholder="Email" value={customer.email} onChange={e => setCustomer({ ...customer, email: e.target.value })} />
            <input placeholder="Địa chỉ" value={customer.address} onChange={e => setCustomer({ ...customer, address: e.target.value })} />
            <div style={{ marginTop: 12 }}>
              <button onClick={submit} disabled={loading || items.length === 0}>Tạo đơn</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesPage;


