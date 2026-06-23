import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button, Form, Alert, Spinner, Badge, Dropdown } from "react-bootstrap";
import "../styles/OrderSuccess.css";

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
            <span className="ms-2 text-danger fw-bold">
              Cancelled
            </span>
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

/* -------------------- Cancel Order Popup -------------------- */
const CancelOrderPopup = ({ show, handleClose, order }) => {
  const navigate = useNavigate();
  const [reason, setReason] = useState("");
  const [otherDetails, setOtherDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const reasons = [
    "Applicable discount/offer was not applied",
    "Changed my mind. Don't need the product",
    "Bought it from somewhere else",
    "Wrong shade/size/colour ordered",
    "Forgot to apply coupon/reward points",
    "Wrong address/phone",
    "Other",
  ];

  const checkAuthentication = async () => {
    try {
      const response = await fetch("https://beauty.joyory.com/api/user/profile", {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      setIsAuthenticated(response.ok);
      return response.ok;
    } catch {
      setIsAuthenticated(false);
      return false;
    }
  };

  useEffect(() => {
    checkAuthentication();
  }, []);

  const getCancellableOrderId = () => order?._id || order?.orderId || order?.displayOrderId || null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalReason = reason === "Other" ? otherDetails.trim() : reason.trim();
    if (!finalReason) {
      setMessage({ type: "danger", text: "Cancellation reason is required" });
      return;
    }

    const isAuth = await checkAuthentication();
    if (!isAuth) {
      setMessage({ type: "warning", text: "Please login to cancel the order." });
      sessionStorage.setItem("redirectAfterLogin", window.location.pathname);
      setTimeout(() => navigate("/login"), 1500);
      return;
    }

    const orderIdToCancel = getCancellableOrderId();
    if (!orderIdToCancel) {
      setMessage({ type: "danger", text: "Order ID not found" });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const endpoint = `https://beauty.joyory.com/api/user/cart/cancel/${orderIdToCancel}`;
      const res = await fetch(endpoint, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: finalReason }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        const updatedOrder = {
          ...order,
          orderStatus: "Cancelled",
          status: "Cancelled",
          cancellation: {
            reason: finalReason,
            cancelledBy: "Customer",
            requestedAt: new Date().toISOString(),
          },
        };

        sessionStorage.setItem(`cancelledOrder_${orderIdToCancel}`, JSON.stringify(updatedOrder));
        handleClose();
        window.handleCancelSuccess?.({ order: updatedOrder });
      } else {
        throw new Error(data.message || "Cancellation failed");
      }
    } catch (err) {
      setMessage({ type: "danger", text: err.message || "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Cancel Order</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {message && (
          <Alert variant={message.type} dismissible onClose={() => setMessage(null)}>
            {message.text}
          </Alert>
        )}

        {!isAuthenticated && (
          <Alert variant="warning">
            <strong>Authentication Required!</strong> You need to be logged in to cancel orders.
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Reason for Cancellation*</Form.Label>
            <Dropdown className="w-100" onSelect={(val) => setReason(val)}>
              <Dropdown.Toggle 
                variant="outline-dark" 
                className="w-100 text-start d-flex justify-content-between align-items-center custom-select-black select-text"
                disabled={loading || !isAuthenticated}
              >
                {reason || "Select a reason"}
              </Dropdown.Toggle>
              <Dropdown.Menu className="w-100 custom-dropdown-menu">
                <Dropdown.Item eventKey="">Select a reason</Dropdown.Item>
                {reasons.map((r, i) => (
                  <Dropdown.Item key={i} eventKey={r} active={reason === r}>
                    {r}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </Form.Group>

          {reason === "Other" && (
            <Form.Group className="mb-3">
              <Form.Label>Other Details*</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={otherDetails}
                onChange={(e) => setOtherDetails(e.target.value)}
                maxLength={250}
                required
                className="custom-select-black"
                disabled={loading || !isAuthenticated}
              />
            </Form.Group>
          )}

          <div className="d-flex gap-2 justify-content-between align-items-center mt-3" style={{ width: "100%" }}>
            <button
              type="button"
              onClick={handleClose}
              className="w-50 btn-cancel-popup mt-0"
              disabled={loading}
            >
              Close
            </button>
            <button
              type="submit"
              className="w-50 btn-cancel-popup mt-0"
              disabled={loading || !isAuthenticated}
            >
              {loading ? <Spinner animation="border" size="sm" /> : "Confirm Cancellation"}
            </button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

/* -------------------- Status Badge -------------------- */
const StatusBadge = ({ status }) => {
  const statusLower = (status || "").toLowerCase();
  let bg = "secondary";
  if (statusLower.includes("awaiting")) bg = "warning";
  else if (statusLower.includes("confirmed")) bg = "success";
  else if (statusLower.includes("processing")) bg = "primary";
  else if (statusLower.includes("shipped")) bg = "info";
  else if (statusLower.includes("delivered")) bg = "success";
  else if (statusLower.includes("cancelled")) bg = "danger";

  return <Badge bg={bg}>{status}</Badge>;
};

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

/* -------------------- Main Component -------------------- */
const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [cancelledOrder, setCancelledOrder] = useState(null);
  const [showPriceDetails, setShowPriceDetails] = useState(false);

  const checkAuthAndRedirect = async () => {
    try {
      const response = await fetch("https://beauty.joyory.com/api/user/profile", {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        sessionStorage.setItem("redirectAfterLogin", window.location.pathname);
        navigate("/login");
        return false;
      }
      return true;
    } catch {
      sessionStorage.setItem("redirectAfterLogin", window.location.pathname);
      navigate("/login");
      return false;
    }
  };

  const fetchOrderDetails = async (id) => {
    try {
      setLoading(true);
      setError(null);

      const isAuthenticated = await checkAuthAndRedirect();
      if (!isAuthenticated) return;

      const orderIdToFetch = id || orderId;
      if (!orderIdToFetch) throw new Error("No order ID provided");

      const endpoints = [
        `https://beauty.joyory.com/api/payment/success/${orderIdToFetch}`,
        `https://beauty.joyory.com/api/order/${orderIdToFetch}`,
        `https://beauty.joyory.com/api/user/orders/${orderIdToFetch}`,
      ];

      let response = null;
      for (const endpoint of endpoints) {
        response = await fetch(endpoint, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });
        if (response.ok) break;
      }

      if (!response || !response.ok) throw new Error("Failed to load order");

      const data = await response.json();
      const orderData = data.order || data;
      setOrder(orderData);

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

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <Spinner animation="border" />
        <p className="mt-3">Loading order details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          <h5>Failed to load order details</h5>
          <p>{error || "Order not found"}</p>
          <Button variant="primary" onClick={() => fetchOrderDetails()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const currentOrder = cancelledOrder || order;
  const isOrderCancelled =
    currentOrder?.status === "Cancelled" || currentOrder?.orderStatus === "Cancelled";

  const products = currentOrder?.products || [];
  const firstProduct = products[0];

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
        <div className="success-banner">
          <div className="success-banner-content">
            <div>
              <h2>
                <span className="success-title-text">Your Order Is Placed Successfully</span>{" "}
                <span className="success-check">
                  <i className="bi bi-check-lg"></i>
                </span>
              </h2>
              <p>
                We’ve received your order and it’s now being processed.
              </p>
              <div className="success-banner-btns d-flex gap-3 flex-nowrap align-items-center justify-content-center justify-content-md-start">
                <button
                  className="btn btn-light cancel-mini-btn"
                  onClick={() => setShowCancelPopup(true)}
                  disabled={isOrderCancelled}
                >
                  Cancel Order
                </button>
                <button
                  className="btn btn-light continue-shopping-btn"
                  onClick={() => navigate("/")}
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="order-card">
          <div className="card-head">
            <div className="card-head-left">
              <span className="card-icon">
                <i className="bi bi-bag"></i>
              </span>
              <h5>Order Summary</h5>
            </div>
            <div className="order-id-text">
              Order ID: {currentOrder?.displayOrderId || currentOrder?.orderId}
              <i className="bi bi-clipboard ms-2"></i>
            </div>
          </div>

          <div className="order-products-list">
            {products.map((product, index) => (
              <div key={index} className="order-product-row">
                <div className="product-image-wrap">
                  <img src={product?.image || "/placeholder.png"} alt={product?.name} />
                </div>

                <div className="product-info info-success">
                  <h6>{product?.brand || product?.name || "Product"}</h6>
                  <p>{product?.name}</p>
                  <span>Quantity: {product?.quantity || 1}</span>
                </div>

                <div className="product-price price-success">
                  ₹{((product?.price || product?.variant?.discountedPrice || 0) || 0).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          {showPriceDetails && (
            <div className="price-details-dropdown">
              <div className="price-detail-item">
                <span>Subtotal:</span>
                <span>₹{(currentOrder?.amount?.subtotal || 0).toFixed(2)}</span>
              </div>
              <div className="price-detail-item text-danger">
                <span>Discount:</span>
                <span>-₹{(currentOrder?.amount?.discount || 0).toFixed(2)}</span>
              </div>
              {currentOrder?.amount?.pointsDiscount > 0 && (
                <div className="price-detail-item text-danger">
                  <span>Points Discount:</span>
                  <span>-₹{currentOrder.amount.pointsDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="price-detail-item">
                <span>GST:</span>
                <span>₹{(currentOrder?.amount?.gst || 0).toFixed(2)}</span>
              </div>
              <div className="price-detail-item">
                <span>Shipping:</span>
                <span className="text-success">
                  {(currentOrder?.amount?.shipping || 0) === 0
                    ? "Free"
                    : `₹${(currentOrder?.amount?.shipping || 0).toFixed(2)}`}
                </span>
              </div>
            </div>
          )}

          <div
            className="paid-row"
            onClick={() => setShowPriceDetails(!showPriceDetails)}
            style={{ cursor: "pointer" }}
            title="Click to view payment details"
          >
            <div>
              <h6 className="d-flex align-items-center">
                Total Paid
                <i className={`bi bi-chevron-${showPriceDetails ? "up" : "down"} ms-2`} style={{ fontSize: "0.85rem" }}></i>
              </h6>
              <p>Paid via {currentOrder?.payment?.method || "Cash on Delivery"}</p>
            </div>
            <div className="paid-amount">
              ₹{(currentOrder?.amount?.grandTotal || 0).toFixed(2)}
            </div>
          </div>
        </div>

        {/* Tracking */}
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

          {/* <div className="text-center mt-4">
            <button className="btn btn-outline-secondary view-details-btn">
              View Full Details <i className="bi bi-chevron-down ms-2"></i>
            </button>
          </div> */}
        </div>

        {/* Two-column section */}
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
                {/* <button className="btn btn-sm btn-link text-success text-decoration-none">
                  <i className="bi bi-pencil-square me-1"></i> Edit
                </button> */}
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

        {/* Help section */}
        <div className="order-card help-card">
          <div className="help-grid">
            <div className="help-item">
              <i className="bi bi-headset"></i>
              <div>
                <h6>Need Help?</h6>
                <p>We’re here for you</p>
              </div>
            </div>
            <div className="help-item">
              <i className="bi bi-chat-dots"></i>
              <div>
                <h6>Live Chat</h6>
                <p>Chat with us</p>
              </div>
            </div>
            <div className="help-item">
              <i className="bi bi-telephone"></i>
              <div>
                <h6>Call Us</h6>
                <p>+91 9601177701</p>
              </div>
            </div>
            <div className="help-item">
              <i className="bi bi-envelope"></i>
              <div>
                <h6>Email Us</h6>
                <p>hello@joyory.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Trust strip */}
        <div className="trust-banner">
          <div className="trust-left">
            <i className="bi bi-shield-check"></i>
            <div>
              <h6>Thank you for shopping with Joyory.</h6>
              <p>We hope you love your order!</p>
            </div>
          </div>
          <div className="trust-items">
            <span><i className="bi bi-shield-check me-2"></i> Secure Payments</span>
            <span><i className="bi bi-people me-2"></i> Genuine Products</span>
            <span><i className="bi bi-box-seam me-2"></i> Easy Returns</span>
          </div>
        </div>

        {/* Footer reassurance */}
        <div className="reassurance-grid">
          <div>
            <i className="bi bi-shield-check"></i>
            <h6>100% Authentic</h6>
            <p>Sourced from trusted brands</p>
          </div>
          <div>
            <i className="bi bi-arrow-counterclockwise"></i>
            <h6>Easy Returns</h6>
            <p>Hassle-free return policy</p>
          </div>
          <div>
            <i className="bi bi-credit-card"></i>
            <h6>Secure Payments</h6>
            <p>Your payments are safe</p>
          </div>
          <div>
            <i className="bi bi-headset"></i>
            <h6>Customer Support</h6>
            <p>9 AM - 6 PM, Mon - Sat</p>
          </div>
        </div>

        {/* Modals */}
        <CancelOrderPopup
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