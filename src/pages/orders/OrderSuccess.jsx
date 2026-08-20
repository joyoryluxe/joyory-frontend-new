// OrderSuccess.jsx - Modularized with subcomponents
import React, { useState, useEffect } from "react";
import { getUserProfile } from "../../api/userApi";
import axiosInstance from "../../utils/axiosInstance";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button, Spinner } from "react-bootstrap";
import "../../styles/OrderSuccess.css";

import CancelOrderModal from "../../components/sections/orders/CancelOrderModal";
import OrderSuccessBanner from "../../components/sections/orders/OrderSuccessBanner";
import OrderProductsSummaryCard from "../../components/sections/orders/OrderProductsSummaryCard";
import OrderTrustFooter from "../../components/sections/orders/OrderTrustFooter";

/* -------------------- Success Popup -------------------- */
const CancelSuccessPopup = ({ show, handleClose, onConfirm, order }) => (
  <Modal show={show} onHide={handleClose} centered>
    <Modal.Body className="text-center p-4">
      <div className="mb-3">
        <div className="d-flex justify-content-center mb-3">
          <div className="success-icon-circle">
            <i className="bi bi-check-lg"></i>
          </div>
        </div>
        <h5 className="fw-bold mb-2">Order Cancelled Successfully!</h5>
        <p className="text-muted small mb-3">
          {order?.payment?.paid
            ? "Refund will be processed within 3–5 business days."
            : "Order has been cancelled successfully."}
        </p>
        <div className="mb-3 border p-3 rounded text-start">
          <p className="mb-1">
            <strong>Order ID:</strong> {order?.displayOrderId || order?.orderId}
          </p>
          <p className="mb-1">
            <strong>Status:</strong>{" "}
            <span className="ms-2 text-danger fw-bold">Cancelled</span>
          </p>
          {order?.cancellation?.reason && (
            <p className="mb-1">
              <strong>Cancellation Reason:</strong> {order.cancellation.reason}
            </p>
          )}
        </div>

        <Button
          onClick={() => {
            handleClose();
            onConfirm && onConfirm();
          }}
          className="w-100 btn-black"
        >
          Okay
        </Button>
      </div>
    </Modal.Body>
  </Modal>
);

/* -------------------- Tracking Step -------------------- */
const TrackingStep = ({ active, title, subtitle }) => (
  <div className={`tracking-step ${active ? "active" : ""}`}>
    <div className="tracking-dot">{active ? <i className="bi bi-check-lg" /> : ""}</div>
    <div className="tracking-content">
      <div className="tracking-title">{title}</div>
      <div className="tracking-subtitle">{subtitle}</div>
    </div>
  </div>
);

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [cancelledOrder, setCancelledOrder] = useState(null);

  const checkAuthAndRedirect = async () => {
    try {
      await getUserProfile();
      setIsAuthenticated(true);
      return true;
    } catch {
      setIsAuthenticated(false);
      sessionStorage.setItem("redirectAfterLogin", window.location.pathname);
      navigate("/login");
      return false;
    }
  };

  const fetchOrderDetails = async (id) => {
    try {
      setLoading(true);
      setError(null);

      const isAuth = await checkAuthAndRedirect();
      if (!isAuth) return;

      const orderIdToFetch = id || orderId;
      if (!orderIdToFetch) throw new Error("No order ID provided");

      const candidateEndpoints = [
        `/api/payment/success/${orderIdToFetch}`,
        `/api/order/${orderIdToFetch}`,
        `/api/user/orders/${orderIdToFetch}`,
      ];

      let orderData = null;
      for (const endpoint of candidateEndpoints) {
        try {
          const res = await axiosInstance.get(endpoint);
          if (res.data) {
            orderData = res.data;
            break;
          }
        } catch {
          // try next
        }
      }

      if (!orderData) throw new Error("Failed to load order");
      const data = orderData;

      if (data && data.success === false) {
        throw new Error(data.message || "Failed to load order");
      }

      let parsedOrder = null;
      if (data && typeof data === "object") {
        if ("order" in data) {
          parsedOrder = data.order;
        } else {
          parsedOrder = data;
        }
      }
      setOrder(parsedOrder);

      // Track Purchase in Meta Pixel
      if (window.fbq) {
        window.fbq('track', 'Purchase', {
          value: orderData?.amount?.grandTotal || 0,
          currency: 'INR',
          content_ids: (orderData?.products || []).map(p => p.productId || p._id)
        });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();

    window.handleCancelSuccess = (data) => {
      const orderIdToRedirect = data.order?._id || data.order?.orderId || orderId;
      navigate(`/CancelOrder/${orderIdToRedirect}`, { state: { order: data.order } });
    };

    return () => {
      delete window.handleCancelSuccess;
    };
  }, [orderId, location.state]);

  // Disable browser back to payment/checkout page
  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href);
      navigate("/", { replace: true });
    };
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);

  useEffect(() => {
    if (!loading && isAuthenticated && (!order || error)) {
      navigate("/404", { replace: true });
    }
  }, [loading, order, error, isAuthenticated, navigate]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <Spinner animation="border" />
        <p className="mt-3">Loading order details...</p>
      </div>
    );
  }

  if (error || !order) {
    return null;
  }

  const currentOrder = cancelledOrder || order;
  const isOrderCancelled =
    currentOrder?.status === "Cancelled" || currentOrder?.orderStatus === "Cancelled";

  const products = currentOrder?.products || [];

  const trackingSteps = [
    { title: "Order Confirmed", subtitle: "We received your order", active: true },
    { title: "Processing", subtitle: "We’re preparing your order", active: false },
    { title: "Packed", subtitle: "Your order is being packed", active: false },
    { title: "Shipped", subtitle: "On its way to you", active: false },
    { title: "Delivered", subtitle: "At your doorstep", active: false },
  ];

  return (
    <div className="order-success-page">
      <div className="container page-shell py-4">
        {/* Success Banner */}
        <OrderSuccessBanner
          onCancelOrder={() => setShowCancelPopup(true)}
          onContinueShopping={() => navigate("/", { replace: true })}
          isOrderCancelled={isOrderCancelled}
        />

        {/* Order Products & Price Summary */}
        <OrderProductsSummaryCard
          order={currentOrder}
          products={products}
        />

        {/* Tracking Card */}
        <div className="order-card">
          <div className="card-head">
            <div className="card-head-left">
              <span className="card-icon">
                <i className="bi bi-truck"></i>
              </span>
              <h5>Track Your Order</h5>
            </div>
          </div>

          <div className="tracking-line">
            <div className="tracking-truck-icon">
              <i className="bi bi-truck"></i>
            </div>
            {trackingSteps.map((step, index) => (
              <TrackingStep key={index} {...step} />
            ))}
          </div>
        </div>

        {/* Delivery & Payment Grid */}
        <div className="row g-3">
          <div className="col-lg-6">
            <div className="order-card h-100">
              <div className="card-head">
                <div className="card-head-left">
                  <span className="card-icon">
                    <i className="bi bi-geo-alt"></i>
                  </span>
                  <h5>Delivering To</h5>
                </div>
              </div>

              <div className="address-block">
                <h6>{currentOrder?.shipping?.address?.name}</h6>
                <p>
                  {currentOrder?.shipping?.address?.addressLine1},{" "}
                  {currentOrder?.shipping?.address?.city},{" "}
                  {currentOrder?.shipping?.address?.state} -{" "}
                  {currentOrder?.shipping?.address?.pincode}
                </p>
                <p>
                  <i className="bi bi-telephone me-2"></i>
                  {currentOrder?.shipping?.address?.phone}
                </p>
                {currentOrder?.shipping?.address?.email && (
                  <p>
                    <i className="bi bi-envelope me-2"></i>
                    {currentOrder.shipping.address.email}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="order-card h-100">
              <div className="card-head">
                <div className="card-head-left">
                  <span className="card-icon">
                    <i className="bi bi-credit-card"></i>
                  </span>
                  <h5>Payment Details</h5>
                </div>
              </div>

              <div className="payment-block">
                <div className="payment-row">
                  <span>Payment Method</span>
                  <strong>{currentOrder?.payment?.method || "Cash on Delivery"}</strong>
                </div>
                <div className="payment-row">
                  <span>Payment Status</span>
                  <strong style={{ color: currentOrder?.payment?.status === "pending" ? "#d97706" : "#1d9b4c" }}>
                    {currentOrder?.payment?.status?.toUpperCase() || "PAID"}
                  </strong>
                </div>
                <hr />
                <div className="payment-row total-row">
                  <span>Total Paid</span>
                  <strong>₹{(currentOrder?.amount?.grandTotal || 0).toFixed(2)}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Support & Trust Sections */}
        <OrderTrustFooter />

        {/* Modals */}
        <CancelOrderModal
          show={showCancelPopup}
          handleClose={() => setShowCancelPopup(false)}
          order={currentOrder}
        />
        <CancelSuccessPopup
          show={showSuccessPopup}
          handleClose={() => setShowSuccessPopup(false)}
          onConfirm={() => { }}
          order={currentOrder}
        />
      </div>
    </div>
  );
};

export default OrderSuccess;
