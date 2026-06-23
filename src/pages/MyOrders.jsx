import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/MyOrders.css";
import Header from "../components/common/Header";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import Footer from "../components/common/Footer";
import axios from "axios";

import {
  FaCheckCircle,
  FaBox,
  FaTruck,
  FaTimesCircle,
  FaClock,
  FaChevronRight
} from "react-icons/fa";

const ORDERS_API = "https://beauty.joyory.com/api/user/cart/orders";

// Format date as DD-MM-YYYY
const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  const d = new Date(dateStr);
  return `${d.getDate().toString().padStart(2, '0')}-${(d.getMonth() + 1)
    .toString()
    .padStart(2, '0')}-${d.getFullYear()}`;
};

const Myorders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(ORDERS_API, { withCredentials: true });
      if (res.data?.success && res.data?.orders) {
        setOrders(res.data.orders);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error("Fetch Orders Error:", err);
      if (err.response && err.response.status === 401) {
        navigate("/login");
      } else {
        setError(err.response?.data?.message || "Failed to load orders");
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ Helper: check cancelled
  const isShipmentCancelled = (shipment) => {
    return shipment?.status?.toLowerCase() === "cancelled";
  };

  const isOrderCancelled = (order) => {
    return order?.status?.toLowerCase() === "cancelled" ||
      order?.orderStatus?.toLowerCase() === "cancelled" ||
      order?.shipments?.some(s => s.status?.toLowerCase() === "cancelled");
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
      case "placed":
        return <FaCheckCircle className="status-icon confirmed" />;
      case "shipped":
        return <FaBox className="status-icon shipped" />;
      case "delivered":
        return <FaTruck className="status-icon delivered" />;
      case "cancelled":
        return <FaTimesCircle className="status-icon cancelled" />;
      default:
        return <FaClock className="status-icon pending" />;
    }
  };

  // ==================== ORDER CLICK ====================
  const handleOrderClick = (order, shipmentId, shipment) => {
    if (isShipmentCancelled(shipment) || isOrderCancelled(order)) {
      navigate(`/CancelOrder/${order._id || order.orderId}`, { state: { order } });
      return;
    }

    if (shipmentId && shipmentId.trim() !== "") {
      navigate(`/order-details/${shipmentId}`, { state: { order } });
    } else {
      navigate(`/ordersuccess/${order._id || order.orderId}`, {
        state: {
          order,
          orderId: order._id || order.orderId,
          message: "Shipment details are not yet available. Tracking will be updated soon."
        }
      });
    }
  };

  // ==================== PRODUCT CLICK ====================
  const handleProductClick = (order, shipment, product, e) => {
    e.stopPropagation();

    if (isShipmentCancelled(shipment) || isOrderCancelled(order)) {
      navigate(`/CancelOrder/${order._id || order.orderId}`, { state: { order } });
      return;
    }

    const shipmentId = shipment.shipment_id;

    if (shipmentId && shipmentId.trim() !== "") {
      navigate(`/order-details/${shipmentId}`, {
        state: { order, selectedProduct: product, selectedShipment: shipment }
      });
    } else {
      navigate(`/ordersuccess/${order._id || order.orderId}`, {
        state: {
          order,
          orderId: order._id || order.orderId,
          selectedProduct: product,
          message: "Shipment details are not yet available. Tracking will be updated soon."
        }
      });
    }
  };

  // ==================== VIEW DETAILS ====================
  const handleViewDetails = (order) => {
    const validShipment = order.shipments?.find(
      s => s.shipment_id && s.shipment_id.trim() !== ""
    );

    if (isOrderCancelled(order) || (validShipment && isShipmentCancelled(validShipment))) {
      navigate(`/CancelOrder/${order._id || order.orderId}`, { state: { order } });
      return;
    }

    if (validShipment) {
      navigate(`/order-details/${validShipment.shipment_id}`, { state: { order } });
    } else {
      navigate(`/ordersuccess/${order._id || order.orderId}`, {
        state: {
          order,
          orderId: order._id || order.orderId,
          message: "Shipment details are not yet available. Tracking will be updated soon."
        }
      });
    }
  };

  // ==================== LOADING ====================
  if (loading) return (
    <>
      <Header />
      <div className="fullscreen-loader page-title-main-name" style={{ minHeight: "100vh", width: "100%" }}>
        <div className="text-center">
          <DotLottieReact
            className="foryoulanding-css"
            src="https://lottie.host/73673e65-df58-41a5-87e7-b837c5d00fe8/dJVGVbJuYJ.lottie"
            loop
            autoplay
          />
          <p className="text-muted mb-0">
            Please wait while we prepare the best products for you...
          </p>
        </div>
      </div>
      <Footer />
    </>
  );

  // ==================== ERROR ====================
  if (error) return (
    <>
      <Header />
      <div className="container mt-4 text-center py-5">
        <div className="alert alert-danger">{error}</div>
        <button className="btn btn-primary" onClick={fetchOrders}>Retry</button>
      </div>
      <Footer />
    </>
  );

  return (
    <>
      <Header />
      <div className="orders-page-wrapper bg-white pb-5 page-title-main-name mt-lg-5 pt-lg-5 mt-md-5 pt-md-5">
        <div className="container orders-container">
          <h2 className="orders-title py-4 page-title-main-name mt-5 pt-lg-4 mt-md-0 pt-md-0">
            My Orders
          </h2>

          {orders.length === 0 ? (
            <div className="empty-orders text-center p-5 bg-white shadow-sm rounded">
              <h4 className="page-title-main-name fw-semibold mb-2">No Orders Placed Yet</h4>
              <p className="empty-text fs-6 page-title-main-name text-muted mb-4">
                Explore our curated beauty collections and start your shopping journey today!
              </p>
              <button className="btn btn-dark page-title-main-name" onClick={() => navigate("/")}>
                Start Shopping
              </button>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order._id}
                className="order-main-card mb-4"
              >
                {/* Header */}
                <div className="order-header d-flex justify-content-between align-items-center p-3 bg-white position-sticky top-0">
                  <div>
                    <p className="order-id-label mb-0 text-muted small text-uppercase fw-bold">Order ID</p>
                    <p className="order-id-value mb-0 fw-normal">{order.orderId}</p>
                  </div>
                  <div className="text-end">
                    <p className="order-date-label mb-0 text-muted small text-uppercase fw-bold">Placed On</p>
                    <p className="order-date-value mb-0">{formatDate(order.date)}</p>
                  </div>
                </div>

                {/* Shipments */}
                {order.shipments && order.shipments.map((shipment) => (
                  <div
                    key={shipment.shipment_id || `shipment-${Math.random()}`}
                    className="shipment-wrapper border-bottom p-3 clickable-shipment"
                    onClick={() => handleOrderClick(order, shipment.shipment_id, shipment)}
                  >
                    <div className="shipment-meta d-lg-flex justify-content-between align-items-center mb-3">
                      <div className="d-flex align-items-center">
                        <span className="shipment-badge bg-dark text-white px-2 py-1 rounded small me-2">
                          {shipment.label}
                        </span>
                        <span className="text-muted small">
                          {shipment.shipment_id ? (
                            <>ID: {shipment.shipment_id}</>
                          ) : (
                            <span className="text-warning">Shipment Pending</span>
                          )}
                        </span>
                      </div>
                      <div className={`status-pill status-${shipment.status?.toLowerCase() || 'pending'} d-flex align-items-center gap-2 fw-bold mt-lg-0`}>
                        {getStatusIcon(shipment.status)}
                        {shipment.status || "Pending"}
                      </div>
                    </div>

                    {/* Products */}
                    <div className="shipment-products-list">
                      {shipment.products.map((product, idx) => (
                        <div
                          key={idx}
                          className="product-row d-flex align-items-center gap-3 mb-2"
                          onClick={(e) => handleProductClick(order, shipment, product, e)}
                        >
                          <img
                            src={product.image || "/placeholder.png"}
                            alt={product.name}
                            className="rounded border"
                            style={{ width: "70px", height: "70px", objectFit: "cover" }}
                          />
                          <div className="flex-grow-1">
                            <h6 className="mb-1 fw-bold">{product.name}</h6>
                            <p className="text-muted mb-0 small">
                              Variant: {product.variant || "Standard"}
                            </p>
                          </div>
                          <FaChevronRight />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Footer */}
                <div className="order-footer p-3 bg-white d-flex justify-content-between align-items-center position-sticky bottom-0">
                  <div>
                    <span className="text-muted small">Total Amount: </span>
                    <span className="fw-bold text-dark">₹{order.amount}</span>
                  </div>
                  {(!order.shipments || order.shipments.length === 0) && (
                    <button
                      className="btn btn-sm btn-outline-dark fw-bold"
                      onClick={() => handleViewDetails(order)}
                    >
                      View Details
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Myorders;