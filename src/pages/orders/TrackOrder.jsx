import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Loader from "../../components/common/Loader";
import "../../styles/TrackOrder.css";

const TrackOrder = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId } = location.state || {};

  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!orderId) {
      navigate("/");
      return;
    }

    const fetchTracking = async () => {
      try {
        const apiUrl = `https://beauty.joyory.com/api/user/cart/tracking/${orderId}`;

        const res = await fetch(apiUrl, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) throw new Error(`Server responded with ${res.status}`);

        const data = await res.json();
        setTrackingData(data);
      } catch (err) {
        console.error("Error fetching tracking data:", err);
        setError("Failed to load tracking details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTracking();
  }, [orderId, navigate]);

  // Helper function to get status color
  const getStatusColor = (status) => {
    const statusMap = {
      'Cancelled': 'danger',
      'Delivered': 'success',
      'Shipped': 'info',
      'Processing': 'warning',
      'Pending': 'secondary',
      'RTO Initiated': 'danger',
      'refund_initiated': 'warning',
      'success': 'success',
      'failed': 'danger',
      'Payment Successful': 'success',
      'Order Placed': 'primary',
      'Awaiting Payment': 'warning',
      'Awaiting Pickup': 'info',
      'Shipment Created': 'info',
      'Picked Up': 'info',
      'In Transit': 'info',
      'Out for Delivery': 'warning',
      'Completed': 'success'
    };
    return statusMap[status] || 'secondary';
  };

  // Helper function to determine if timeline item is completed
  const isTimelineCompleted = (currentStatus, timelineStatus, timeline, currentIndex) => {
    if (currentStatus === 'Cancelled') {
      // For cancelled orders, all items up to "RTO Initiated" are completed
      const rtoIndex = timeline.findIndex(item => item.status === 'RTO Initiated');
      return currentIndex <= rtoIndex;
    }

    // For normal orders, all items up to current status are completed
    const currentStatusIndex = timeline.findIndex(item => item.status === currentStatus);
    return currentIndex <= currentStatusIndex;
  };

  // Helper function to determine if timeline item is current
  const isCurrentTimelineItem = (currentStatus, timelineStatus, timeline, currentIndex) => {
    if (currentStatus === 'Cancelled') {
      return timelineStatus === 'RTO Initiated';
    }

    const currentStatusIndex = timeline.findIndex(item => item.status === currentStatus);
    return currentIndex === currentStatusIndex;
  };

  // Helper function to get timeline dot class
  const getTimelineDotClass = (isCompleted, isCurrent) => {
    if (isCompleted) return "timeline-dot completed";
    if (isCurrent) return "timeline-dot current blinking-dot";
    return "timeline-dot upcoming";
  };

  if (loading)
    return (
      <div className="d-flex flex-column align-items-center justify-content-center vh-100 text-center">
        <Loader text="Fetching tracking details..." height={150} />
      </div>
    );

  if (error)
    return (
      <div className="container text-center py-5">
        <p className="text-danger fw-semibold">{error}</p>
        <button className="btn btn-outline-primary me-2" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <button className="btn btn-primary" onClick={() => navigate("/")}>
          🏠 Go to Home
        </button>
      </div>
    );

  if (!trackingData) return null;

  const {
    shipment = {},
    products = [],
    status,
    timeline = [],
    shippingAddress = {},
    payment = {},
    orderId: id,
    amount,
    createdAt,
  } = trackingData;

  return (
    <div className="container py-4">
      {/* Back + Header */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <button className="btn btn-outline-secondary btn-sm me-2" onClick={() => navigate(-1)}>
            ← Back
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => navigate("/")}>
            🏠 Go to Home
          </button>
        </div>
        <h3 className="fw-bold mb-0 text-primary">Track Your Order</h3>
      </div>

      {/* Order Summary */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-primary text-white fw-semibold">Order Summary</div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <p><strong>Order ID:</strong> {id}</p>
              <p><strong>Order Date:</strong> {new Date(createdAt).toLocaleString()}</p>
            </div>
            <div className="col-md-6">
              <p><strong>Total Amount:</strong> ₹{amount}</p>
              <p>
                <strong>Current Status:</strong>{" "}
                <span className={`badge bg-${getStatusColor(status)} text-white ms-2 mt-1`}>
                  {status}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Shipment Info */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-primary text-white fw-semibold">Shipment Details</div>
        <div className="card-body">
          <p><strong>Shipment ID:</strong> {shipment.shipment_id || "N/A"}</p>
          <p><strong>Courier:</strong> {shipment.courier_name || "N/A"}</p>
          <p><strong>AWB Code:</strong> {shipment.awb_code || "N/A"}</p>
          <p>
            <strong>Tracking URL:</strong>{" "}
            {shipment.tracking_url ? (
              <a
                href={shipment.tracking_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-decoration-none text-primary fw-semibold"
              >
                View Tracking ↗
              </a>
            ) : (
              "Unavailable"
            )}
          </p>
          <p>
            <strong>Shipment Status:</strong>{" "}
            <span className={`badge bg-${getStatusColor(shipment.current_status)} text-white ms-2 mt-1`}>
              {shipment.current_status || "N/A"}
            </span>
          </p>
        </div>
      </div>

      {/* Ordered Products */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-primary text-white fw-semibold">Ordered Products</div>
        <div className="card-body">
          {products.length ? (
            products.map((p, i) => (
              <div
                key={i}
                className="d-flex flex-column flex-md-row align-items-start border-bottom pb-3 mb-3"
              >
                <img
                  src={p.image}
                  alt={p.name}
                  className="rounded mb-2 mb-md-0"
                  style={{ width: "100px", height: "100px", objectFit: "cover" }}
                />
                <div className="ms-md-3">
                  <h6 className="fw-bold">{p.name}</h6>
                  <p className="mb-1 text-muted">
                    Variant: {p.variant?.shadeName || p.variant || "N/A"}
                  </p>
                  <p className="mb-1">Qty: {p.quantity}</p>
                  <p className="fw-bold text-success">₹{p.price}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted">No product details available.</p>
          )}
        </div>
      </div>

      {/* Timeline */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-primary text-white fw-semibold">Order Timeline</div>
        <div className="card-body">
          {timeline.length ? (
            <div className="timeline-container">
              {timeline.map((t, i) => {
                const isCompleted = isTimelineCompleted(status, t.status, timeline, i);
                const isCurrent = isCurrentTimelineItem(status, t.status, timeline, i);
                const dotClass = getTimelineDotClass(isCompleted, isCurrent);

                return (
                  <div key={i} className="timeline-item">
                    <div className="timeline-marker">
                      <div className={dotClass}></div>
                      {i < timeline.length - 1 && <div className="timeline-connector"></div>}
                    </div>
                    <div className="timeline-content">
                      <div className="d-flex align-items-center mb-1">
                        <h6 className="fw-bold mb-0 me-2">{t.status}</h6>
                        {/* <span className={`badge bg-${getStatusColor(t.status)} text-white`}>
                          {isCurrent ? 'Current' : isCompleted ? 'Completed' : 'Upcoming'}
                        </span> */}

                        <span
                          className={`badge bg-${getStatusColor(t.status)} text-white`}
                          style={{ marginLeft: "180px" }}
                        >
                          {isCurrent ? "Current" : isCompleted ? "Completed" : "Upcoming"}
                        </span>

                      </div>
                      <p className="small text-muted mb-1">
                        {t.timestamp ? new Date(t.timestamp).toLocaleString() : "N/A"}
                      </p>
                      {t.location && (
                        <p className="small text-secondary mb-0">
                          <i className="bi bi-geo-alt me-1"></i>
                          {t.location}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-muted">No timeline events available.</p>
          )}
        </div>
      </div>

      {/* Shipping Info */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-primary text-white fw-semibold">Shipping Address</div>
        <div className="card-body">
          <p className="mb-1 fw-bold">{shippingAddress.name}</p>
          <p className="mb-1">
            {shippingAddress.addressLine1}, {shippingAddress.city}, {shippingAddress.state} -{" "}
            {shippingAddress.pincode}
          </p>
          <p className="mb-0 text-muted">
            <i className="bi bi-telephone me-1"></i>
            {shippingAddress.phone}
          </p>
        </div>
      </div>

      {/* Payment Info */}
      <div className="card border-0 shadow-sm mb-5">
        <div className="card-header bg-primary text-white fw-semibold">Payment Details</div>
        <div className="card-body">
          <p>
            <strong>Method:</strong> {payment.method ? payment.method.toUpperCase() : "N/A"}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <span className={`badge mt-1 ms-2 bg-${getStatusColor(payment.status)} text-white`}>
              {payment.status ? payment.status.replace('_', ' ').toUpperCase() : "N/A"}
            </span>
          </p>
          <p>
            <strong>Transaction ID:</strong> {payment.transactionId || "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;
