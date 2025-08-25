import React, { useEffect, useState } from "react";
import Sidebar_Admin from "../reuse/Sidebar_Admin";

const OrdersList = () => {
  const [orders, setOrders] = useState([]);

  const fetchAll = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:9999/order/all`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) setOrders(await res.json());
  };

  useEffect(() => { fetchAll(); }, []);

  const updateStatus = async (orderId, status) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:9999/order/${orderId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status })
    });
    if (res.ok) fetchAll();
  };

  return (
    <div className="admin-container">
      <Sidebar_Admin />
      <div className="main-content">
        <h2>Đơn hàng</h2>
        <table className="manage-service-table">
          <thead>
            <tr>
              <th>Mã</th>
              <th>Khách</th>
              <th>Tổng</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o._id}>
                <td>{o._id}</td>
                <td>{o.customerName || '-'}</td>
                <td>{o.total?.toLocaleString('vi-VN')}₫</td>
                <td>{o.status}</td>
                <td>
                  <select value={o.status} onChange={e => updateStatus(o._id, e.target.value)}>
                    {['pending','paid','shipped','completed','cancelled'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersList;


