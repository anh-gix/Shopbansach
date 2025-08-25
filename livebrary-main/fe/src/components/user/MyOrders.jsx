import React, { useEffect, useState } from "react";
import Header from "../reuse/Header";
import Footer from "../reuse/Footer";
import { fetchMyOrders } from "../../../services/order";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchMyOrders().then(setOrders).catch(() => {});
  }, []);

  return (
    <>
      <Header />
      <div className="book-detail-container">
        <h2>Đơn hàng của tôi</h2>
        <table className="manage-service-table">
          <thead>
            <tr>
              <th>Mã</th>
              <th>Ngày</th>
              <th>Tổng</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o._id}>
                <td>{o._id}</td>
                <td>{new Date(o.createdAt).toLocaleString('vi-VN')}</td>
                <td>{o.total?.toLocaleString('vi-VN')}₫</td>
                <td>{o.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Footer />
    </>
  );
};

export default MyOrders;


