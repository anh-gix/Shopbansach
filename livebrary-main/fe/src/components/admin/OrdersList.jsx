import React, { useEffect, useState } from "react";
import Sidebar_Admin from "../reuse/Sidebar_Admin";
import { Form } from 'react-bootstrap';
import { Link } from "react-router-dom";

const OrdersList = () => {
  const [orders, setOrders] = useState([]);

  const fetchAll = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:9999/order/all`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) setOrders(await res.json());
  };
  console.log(orders);

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
  const getStatusClass = (status) => {
    switch (status) {
      case "pending":
        return "bg-primary text-white";
      case "completed":
        return "bg-success text-white";
      case "shipped":
        return "bg-warning text-white";
      case "cancelled":
        return "bg-danger text-white";
      default:
        return "bg-secondary text-white";
    }
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
              <th>Tổng Tiền</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o._id}>
               <td> <Link to={`/admin/detail-order/${o._id}`}>{o._id}</Link></td>
                <td>{o.createdBy || '-'}</td>
                <td>{o.total?.toLocaleString('vi-VN')}₫</td>
                <td>{o.status}</td>
                <td>
                  <Form.Select
                    value={o.status}
                    onChange={e => updateStatus(o._id, e.target.value)}
                    className={getStatusClass(o.status)}
                  >
                    {['pending', 'paid', 'shipped', 'completed', 'cancelled'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </Form.Select>
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


