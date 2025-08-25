import React, { useEffect, useState } from "react";
import Header from "../reuse/Header";
import Footer from "../reuse/Footer";
import { fetchCart, updateCartItem, clearCart } from "../../../services/cart";
import { createOrder } from "../../../services/order";

const CartPage = () => {
  const [cart, setCart] = useState({ items: [], subtotal: 0 });
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      const c = await fetchCart();
      setCart(c || { items: [], subtotal: 0 });
    } catch (e) {}
  };

  useEffect(() => { load(); }, []);

  const changeQty = async (bookId, qty) => {
    await updateCartItem(bookId, Number(qty));
    load();
  };

  const checkout = async () => {
    try {
      setLoading(true);
      await createOrder("" /* shippingAddress optional */);
      await clearCart();
      await load();
      alert("Đặt hàng thành công");
    } catch (e) {
      alert("Lỗi đặt hàng");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="book-detail-container">
        <h2>Giỏ hàng</h2>
        {cart.items?.map(i => (
          <div key={i.book} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: 8, borderBottom: '1px solid #eee' }}>
            <div style={{ flex: 1 }}>{i?.book?.title || ''}</div>
            <div>{(i.unitPrice||0).toLocaleString('vi-VN')}₫</div>
            <input type="number" min={0} value={i.quantity} onChange={e => changeQty(i.book._id || i.book, e.target.value)} style={{ width: 70 }} />
            <div>{(i.lineTotal||0).toLocaleString('vi-VN')}₫</div>
          </div>
        ))}
        <div style={{ textAlign: 'right', marginTop: 12 }}>
          <strong>Tạm tính: { (cart.subtotal||0).toLocaleString('vi-VN') }₫</strong>
        </div>
        <div style={{ marginTop: 12, textAlign: 'right' }}>
          <button disabled={loading || (cart.items||[]).length === 0} onClick={checkout}>Đặt hàng</button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CartPage;


