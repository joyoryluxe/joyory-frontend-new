import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Modal, Button, Alert, Badge, Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/ordersuccess.css";

const CancelOrder = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId } = useParams();

  // Get order from location state or fetch from sessionStorage
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!location.state?.order);
  const [refundOptions, setRefundOptions] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState("");
  const [showRefundPopup, setShowRefundPopup] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [error, setError] = useState("");

  // Extract data from order
  const items = order?.products || [];
  const shippingAddress = order?.shipping?.address || {};
  const paymentMethod = order?.payment?.method || "Not Available";
  const orderIdToUse = order?._id || orderId;

  // Use order.amount for calculations
  const subtotal = order?.amount?.subtotal || 0;
  const discount = order?.amount?.discount || 0;
  const shippingCharge = order?.amount?.shipping || 0;
  const grandTotal = order?.amount?.grandTotal || 0;

  // ✅ Handle back button prevention
  useEffect(() => {
    // Clear order success data from sessionStorage
    sessionStorage.removeItem("orderSuccessData");
    sessionStorage.removeItem("lastOrderId");
    
    // Push current state to history to prevent going back
    window.history.pushState(null, "", window.location.href);
    
    // Handle popstate event (back button)
    const handlePopState = (event) => {
      // Prevent going back to order success page
      window.history.pushState(null, "", window.location.href);
      
      // Show confirmation or redirect
      const confirmLeave = window.confirm(
        "You cannot go back to the order confirmation page. Would you like to go to My Orders?"
      );
      
      if (confirmLeave) {
        // First remove the event listener to prevent infinite loop
        window.removeEventListener("popstate", handlePopState);
        navigate("/myorders", { replace: true });
      }
    };

    window.addEventListener("popstate", handlePopState);

    // Cleanup
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);

  // ✅ Prevent going back via browser back button
  useEffect(() => {
    // Disable browser back button by manipulating history
    const disableBackButton = () => {
      window.history.pushState(null, "", window.location.href);
      window.onpopstate = function () {
        window.history.pushState(null, "", window.location.href);
        // Optionally show a message
        alert("Please use the navigation buttons provided to leave this page.");
      };
    };

    disableBackButton();

    return () => {
      window.onpopstate = null;
    };
  }, []);

  // Fetch order details if not in state
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!order && orderId) {
        try {
          setLoading(true);
          // Try to get from sessionStorage first
          const storedOrder = sessionStorage.getItem(`cancelledOrder_${orderId}`);
          if (storedOrder) {
            setOrder(JSON.parse(storedOrder));
            setLoading(false);
            return;
          }

          // Fetch from API
          const response = await fetch(
            `https://beauty.joyory.com/api/user/orders/${orderId}`,
            {
              method: "GET",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            if (data.success && data.order) {
              setOrder(data.order);
              sessionStorage.setItem(`cancelledOrder_${orderId}`, JSON.stringify(data.order));
            }
          }
        } catch (err) {
          console.error("Error fetching order details:", err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchOrderDetails();
  }, [order, orderId]);

  // ✅ Fetch refund options
  useEffect(() => {
    const fetchRefundOptions = async () => {
      try {
        // If order has refund methods, use them
        if (order?.refund?.availableMethods?.length > 0) {
          setRefundOptions(order.refund.availableMethods);
          return;
        }

        // Otherwise fetch from API
        const res = await fetch("https://beauty.joyory.com/api/payment/refund-methods", {
          method: "GET",
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          console.log("🟩 Refund Methods Response:", data);

          if (data?.success && Array.isArray(data.methods)) {
            setRefundOptions(data.methods);
          } else {
            // Fallback to default options
            setRefundOptions([
              { key: "razorpay", label: "Original Payment Method" },
              { key: "wallet", label: "Joyory Wallet" },
            ]);
          }
        }
      } catch (err) {
        console.error("❌ Error fetching refund methods:", err);
        setRefundOptions([
          { key: "razorpay", label: "Original Payment Method" },
          { key: "wallet", label: "Joyory Wallet" },
        ]);
      }
    };

    if (order) {
      fetchRefundOptions();
    }
  }, [order]);

  // ✅ Handle refund method selection
  const handleRefund = async () => {
    if (!selectedMethod) {
      alert("Please select a refund method!");
      return;
    }

    if (!orderIdToUse) {
      setError("Order ID not found");
      return;
    }

    setProcessing(true);
    setError("");
    setSuccessMsg("");

    try {
      console.log("📤 Sending Refund Request:", {
        orderId: orderIdToUse,
        method: selectedMethod,
      });

      const res = await fetch("https://beauty.joyory.com/api/payment/refund-method", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: orderIdToUse,
          method: selectedMethod,
        }),
        credentials: "include",
      });

      const data = await res.json();
      console.log("🟩 Refund Response:", data);

      if (data.success) {
        setSuccessMsg(data.message || "✅ Refund method submitted successfully!");
        setShowRefundPopup(false);

        // Update order in state and sessionStorage
        const updatedOrder = {
          ...order,
          refund: {
            ...order?.refund,
            selectedMethod: selectedMethod,
            selectedMethodLabel: refundOptions.find(opt => opt.key === selectedMethod)?.label,
            status: "processing",
          },
        };

        setOrder(updatedOrder);
        sessionStorage.setItem(`cancelledOrder_${orderIdToUse}`, JSON.stringify(updatedOrder));
      } else {
        setError(data.message || "Refund submission failed. Please try again later.");
      }
    } catch (err) {
      console.error("❌ Refund error:", err);
      setError("Something went wrong while processing your refund.");
    } finally {
      setProcessing(false);
    }
  };

  // ✅ Safe navigation function
  const safeNavigate = (path) => {
    // Remove the popstate listener before navigating
    window.onpopstate = null;
    navigate(path, { replace: true });
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container py-5 text-center">
        <h4 className="text-danger mb-3">No Cancel Order Details Found</h4>
        <button className="btn btn-primary" onClick={() => safeNavigate("/myorders")}>
          Go to My Orders
        </button>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* ✅ Header */}
      <div className="text-center mb-4">
        <div className="d-flex justify-content-center mb-3">
          <div
            className="bg-danger text-white rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: "80px", height: "80px" }}
          >
            <i className="bi bi-x-circle" style={{ fontSize: "36px" }}></i>
          </div>
        </div>
        <h4 className="fw-bold text-danger mt-3">Your Order Has Been Cancelled!</h4>
        <p className="text-muted small">
          {order?.payment?.paid && !order?.refund?.selectedMethod
            ? "Please select your preferred refund method below."
            : order?.refund?.status === "processing"
            ? "Your refund is being processed."
            : "Your order has been cancelled successfully."}
        </p>
        <div className="alert alert-info d-inline-block">
          <strong>Order ID:</strong> {order?.displayOrderId || order?.orderId}
          {order?.cancellation?.reason && (
            <span className="ms-3">
              <strong>Reason:</strong> {order.cancellation.reason}
            </span>
          )}
        </div>
      </div>

      {/* ✅ Refund Status */}
      {order?.refund?.selectedMethod && (
        <div className="alert alert-success mb-4">
          <div className="d-flex align-items-center">
            <i className="bi bi-check-circle-fill me-2 fs-4"></i>
            <div>
              <h6 className="mb-1">Refund Update</h6>

              {/* ✅ Dynamic Status Message */}
              <p className="mb-1">
                Refund via: <strong>{order.refund.selectedMethodLabel}</strong>
              </p>

              <p className="mb-0 small">
                Status:{" "}
                <Badge
                  bg={
                    order.refund.status === "completed"
                      ? "success"
                      : order.refund.status === "processing"
                      ? "warning"
                      : "info"
                  }
                >
                  {order.refund.status === "completed"
                    ? "Completed"
                    : order.refund.status === "processing"
                    ? "Processing"
                    : "Requested"}
                </Badge>
              </p>

              {/* ✅ Extra Message */}
              {order.refund.status !== "completed" && (
                <p className="mb-0 small text-muted mt-1">
                  Your refund is being processed. It may take 3–7 business days.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ✅ Cancelled Products */}
      <div className="card shadow-sm mb-4 height-section">
        <div className="card-header fw-bold">Cancelled Products</div>
        <div className="card-body">
          {items.map((item, index) => (
            <div
              key={index}
              className="d-flex flex-column flex-md-row align-items-start gap-3 mb-3 border-bottom pb-3"
            >
              <div className="position-relative">
                <img
                  src={item.image || "/placeholder.png"}
                  alt={item.name}
                  className="rounded"
                  style={{ width: "90px", height: "90px", objectFit: "cover" }}
                />
                {/* {item.variant?.discountPercent && (
                  <span
                    className="position-absolute top-0 start-0 badge bg-danger mt-1 ms-1"
                    style={{ fontSize: "12px" }}
                  >
                    -{item.variant.discountPercent}%
                  </span>
                )} */}
              </div>
              <div>
                <h6 className="fw-bold mb-1">{item.name}</h6>
                {item.variant && (
                  <p className="text-muted small mb-1">
                    {item.variant.shadeName || item.variant.sku || "Default Variant"}
                  </p>
                )}
                <p className="small mb-1">Qty: {item.quantity}</p>
                <div className="d-flex align-items-center">
                  {item.variant?.originalPrice && (
                    <span className="text-decoration-line-through text-muted me-2">
                      ₹{item.variant.originalPrice.toFixed(2)}
                    </span>
                  )}
                  <p className="fw-semibold mb-0">₹{item.price?.toFixed(2) || "0.00"}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ Order Summary */}
      <div className="card shadow-sm mb-4">
        <div className="card-header fw-bold">Order Summary</div>
        <div className="card-body">
          <div className="d-flex justify-content-between mb-2">
            <span>Sub Total</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="d-flex justify-content-between mb-2 text-success">
            <span>Discount</span>
            <span>-₹{discount.toFixed(2)}</span>
          </div>
          <div className="d-flex justify-content-between mb-2">
            <span>Shipping Charge</span>
            <span>{shippingCharge > 0 ? `₹${shippingCharge.toFixed(2)}` : "Free"}</span>
          </div>
          {order?.amount?.gst > 0 && (
            <div className="d-flex justify-content-between mb-2">
              <span>GST</span>
              <span>₹{order.amount.gst.toFixed(2)}</span>
            </div>
          )}
          <hr />
          <div className="d-flex justify-content-between fw-bold fs-5">
            <span>Grand Total</span>
            <span className="text-primary">₹{grandTotal.toFixed(2)}</span>
          </div>
          {order?.payment?.paid && !order?.refund?.selectedMethod && (
            <div className="alert alert-info mt-3 mb-0 small">
              <i className="bi bi-info-circle me-1"></i>
              Refundable Amount: <strong>₹{grandTotal.toFixed(2)}</strong>
            </div>
          )}
        </div>
      </div>

      {/* ✅ Refund Option Button (only if order was paid and no refund method selected) */}
      {order?.payment?.paid &&
        !order?.refund?.selectedMethod &&
        !["requested", "processing", "completed"].includes(order?.refund?.status) && (
          <div className="text-center mb-4">
            <button
              className="btn btn-primary px-4 py-2"
              onClick={() => setShowRefundPopup(true)}
            >
              <i className="bi bi-wallet2 me-2"></i>
              Select Refund Method
            </button>
            <p className="text-muted small mt-2">
              Please choose how you'd like to receive your refund
            </p>
          </div>
        )}

      {successMsg && (
        <div className="alert alert-success text-center">{successMsg}</div>
      )}
      {error && <div className="alert alert-danger text-center">{error}</div>}

      {/* ✅ Delivery Address */}
      <div className="card shadow-sm mb-4">
        <div className="card-header fw-bold">Delivery Address</div>
        <div className="card-body">
          <p className="mb-1 fw-bold">{shippingAddress.name}</p>
          <p className="mb-1">{shippingAddress.addressLine1}</p>
          {shippingAddress.addressLine2 && (
            <p className="mb-1">{shippingAddress.addressLine2}</p>
          )}
          <p className="mb-1">
            {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.pincode}
          </p>
          <p className="mb-0">
            <i className="bi bi-telephone me-1"></i>
            {shippingAddress.phone}
          </p>
          {shippingAddress.email && (
            <p className="mb-0">
              <i className="bi bi-envelope me-1"></i>
              {shippingAddress.email}
            </p>
          )}
        </div>
      </div>

      {/* ✅ Back Button */}
      <div className="text-center">
        <button
          className="btn btn-outline-primary px-4 me-2"
          onClick={() => safeNavigate("/myorders")}
        >
          <i className="bi bi-arrow-left me-1"></i>
          Back to My Orders
        </button>
        <button className="btn btn-outline-secondary px-4" onClick={() => safeNavigate("/")}>
          <i className="bi bi-house me-1"></i>
          Go to Homepage
        </button>
      </div>

      {/* ✅ Refund Popup */}
      {showRefundPopup && (
        <div
          className="refund-popup-overlay d-flex align-items-center justify-content-center"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0, 0, 0, 0.4)",
            zIndex: 9999,
          }}
        >
          <div
            className="refund-popup bg-white p-4 rounded-4 shadow-lg"
            style={{
              width: "90%",
              maxWidth: "420px",
              fontFamily: "Inter, sans-serif",
            }}
          >
            <div className="d-flex align-items-center mb-4">
              <button
                className="btn btn-link p-0 me-2 text-dark fw-bold"
                onClick={() => setShowRefundPopup(false)}
                style={{ fontSize: "1.2rem", textDecoration: "none" }}
              >
                ←
              </button>
              <h5 className="fw-bold mb-0">Select Refund Method</h5>
            </div>

            <div className="alert alert-light border rounded-3 py-2 px-3 mb-3">
              <small className="text-muted">
                <strong>Payment Method:</strong> {paymentMethod}
                <br />
                <strong>Refund Amount:</strong> ₹{grandTotal.toFixed(2)}
              </small>
            </div>

            {refundOptions.length === 0 ? (
              <p className="text-center text-muted small mb-3">
                Loading available refund methods...
              </p>
            ) : (
              refundOptions.map((option) => (
                <label
                  key={option.key}
                  className={`d-flex align-items-start gap-3 p-3 border rounded-3 mb-2 ${
                    selectedMethod === option.key
                      ? "border-primary bg-light"
                      : "border-light"
                  }`}
                  style={{ cursor: "pointer" }}
                >
                  <input
                    type="radio"
                    className="form-check-input mt-1"
                    name="refundMethod"
                    value={option.key}
                    checked={selectedMethod === option.key}
                    onChange={() => setSelectedMethod(option.key)}
                    style={{
                      accentColor: "#1a73e8",
                      width: "1.2rem",
                      height: "1.2rem",
                    }}
                  />
                  <div>
                    <p className="fw-semibold mb-1 text-dark">{option.label}</p>
                    {option.description && (
                      <p className="small text-muted mb-0">{option.description}</p>
                    )}
                  </div>
                </label>
              ))
            )}

            <button
              className="btn w-100 mt-2 py-2 fw-semibold"
              style={{
                backgroundColor: "#2b6cb0",
                color: "#fff",
                borderRadius: "10px",
              }}
              onClick={handleRefund}
              disabled={processing || !selectedMethod}
            >
              {processing ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  ></span>
                  Processing...
                </>
              ) : (
                "Confirm Refund Method"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CancelOrder;