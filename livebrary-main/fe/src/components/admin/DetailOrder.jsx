import React, { useEffect, useState } from "react";
import Sidebar_Admin from "../reuse/Sidebar_Admin";
import { Row, Col, Table, Badge } from "react-bootstrap";
import { useParams } from "react-router-dom";

export default function DetailOrder() {
    const [order, setOrder] = useState(null);
    const { id } = useParams();

    const fetchDetailOrder = async () => {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:9999/order/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) setOrder(await res.json());
    };

    useEffect(() => { fetchDetailOrder(); }, []);

    if (!order) return <p>Loading...</p>;

    const getSelectBg = (status) => {
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
                <Row className="mb-4">
                    <Col xs={12}>
                        <h2 className="text-center">Chi tiết đơn hàng</h2>
                    </Col>
                </Row>

                <Row>
                    <Col xs={12} md={{ span: 8, offset: 2 }}>
                        <p><strong>Người mua:</strong> {order.createdBy}</p>
                        <p>
                            <strong>Trạng thái:</strong>{" "}
                            <Badge bg={
                                order.status === "pending" ? "warning" :
                                    order.status === "completed" ? "success" :
                                        order.status === "cancelled" ? "danger" : "secondary"
                            }>
                                {order.status}
                            </Badge>
                        </p>
                        <p><strong>Phí vận chuyển:</strong> {order.shippingFee?.toLocaleString('vi-VN')}₫</p>
                        <p><strong>Total:</strong> {order.total?.toLocaleString('vi-VN')}₫</p>

                        <h5>Danh sách sản phẩm:</h5>
                        <Table bordered >
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Tên sách</th>
                                    <th>Số lượng</th>
                                    <th>Đơn giá</th>
                                    <th>Tổng</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.items.map((item, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item.title}</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.unitPrice?.toLocaleString('vi-VN')}₫</td>
                                        <td>{item.lineTotal?.toLocaleString('vi-VN')}₫</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </div>
        </div>
    );
}
