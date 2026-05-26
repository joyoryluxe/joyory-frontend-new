// OrderTrack.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import "../css/orderTrack.css";

import {
  FaCheckCircle,
  FaBox,
  FaTruck,
  FaTimesCircle,
  FaClock,
  FaArrowLeft,
  FaMapMarkerAlt,
  FaRupeeSign,
  FaShippingFast,
  FaInfoCircle,
} from "react-icons/fa";

// Format date as DD-MM-YYYY
const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  const d = new Date(dateStr);
  return `${d.getDate().toString().padStart(2, "0")}-${(d.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${d.getFullYear()}`;
};

// Format date with time
const formatDateTime = (dateStr) => {
  if (!dateStr) return "N/A";
  const d = new Date(dateStr);
  return `${d.getDate().toString().padStart(2, "0")}-${(d.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${d.getFullYear()} ${d
    .getHours()
    .toString()
    .padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
};

const OrderTrack = () => {
  const { shipmentId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [shipmentData, setShipmentData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Get data from navigation state
  const { shipmentData: locationShipmentData, selectedProduct } =
    location.state || {};

  useEffect(() => {
    if (locationShipmentData) {
      setShipmentData(locationShipmentData);
    } else {
      // If no data passed, you might want to fetch it from API
      setLoading(true);
      // fetchShipmentDetails(); // Uncomment if you want to fetch from API
    }
  }, [locationShipmentData]);

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
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

  const getTimelineIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "order confirmed":
        return <FaCheckCircle className="timeline-icon confirmed" />;
      case "shipped":
      case "shipping label created":
        return <FaShippingFast className="timeline-icon shipped" />;
      case "delivered":
        return <FaTruck className="timeline-icon delivered" />;
      default:
        return <FaClock className="timeline-icon pending" />;
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="container mt-4">
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading tracking details...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!shipmentData) {
    return (
      <>
        <Header />
        <div className="container mt-4">
          <div className="alert alert-warning">
            <FaInfoCircle className="me-2" />
            No shipment data found. Please go back and try again.
          </div>
          <button className="btn btn-primary" onClick={() => navigate(-1)}>
            <FaArrowLeft className="me-2" /> Go Back
          </button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <div className="container mt-4">
        {/* Back Button */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <button
            className="btn btn-outline-secondary"
            onClick={() => navigate(-1)}
          >
            <FaArrowLeft className="me-2" /> Back to Order Details
          </button>
          <h4 className="mb-0 text-primary">
            <FaShippingFast className="me-2" />
            Order Tracking
          </h4>
        </div>

        {/* Selected Product Highlight */}
        {selectedProduct && (
          <div className="alert alert-info mb-4">
            <div className="d-flex align-items-center">
              <div className="flex-shrink-0">
                <img
                  src={selectedProduct.image || "/placeholder.png"}
                  alt={selectedProduct.name}
                  style={{ width: "50px", height: "50px", objectFit: "cover" }}
                  className="rounded"
                />
              </div>
              <div className="flex-grow-1 ms-3">
                <h6 className="mb-1">Tracking for:</h6>
                <p className="mb-0 fw-bold">
                  {selectedProduct.name} - {selectedProduct.variant}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tracking Header Card */}
        <div className="card mb-4 border-primary">
          <div className="card-header bg-primary text-white">
            <div className="row align-items-center">
              <div className="col-md-8">
                <h4 className="mb-0">
                  <FaShippingFast className="me-2" />
                  Shipment Tracking
                </h4>
              </div>
              <div className="col-md-4 d-flex justify-content-end">
                <span
                  className={`badge bg-${
                    shipmentData.shipmentStatus === "Confirmed"
                      ? "warning"
                      : shipmentData.shipmentStatus === "Shipped"
                      ? "info"
                      : shipmentData.shipmentStatus === "Delivered"
                      ? "success"
                      : "secondary"
                  } fs-6`}
                >
                  {getStatusIcon(shipmentData.shipmentStatus)}
                  {shipmentData.shipmentStatus}
                </span>
              </div>
            </div>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <p>
                  <strong>Shipment ID:</strong> {shipmentData.shipmentId}
                </p>
                <p>
                  <strong>Order ID:</strong> {shipmentData.orderInfo?.orderId}
                </p>
                <p>
                  <strong>AWB Number:</strong>{" "}
                  <span
                    className="ms-2 badge bg-dark fs-6"
                    style={{
                      marginTop: "2px",
                      
                    }}
                  >
                    {shipmentData.courier?.awb || "N/A"}
                  </span>
                </p>
              </div>
              <div className="col-md-6">
                <p>
                  <strong>Order Date:</strong>{" "}
                  {formatDate(shipmentData.orderInfo?.orderDate)}
                </p>
                <p>
                  <strong>Expected Delivery:</strong>{" "}
                  {formatDate(shipmentData.expectedDelivery)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          {/* Left Column - Tracking Timeline */}
          <div className="col-lg-8">
            {/* Detailed Tracking Timeline */}
            <div className="card mb-4">
              <div className="card-header bg-light">
                <h5 className="mb-0">
                  <FaTruck className="me-2" />
                  Detailed Tracking Timeline
                </h5>
              </div>
              <div className="card-body">
                {shipmentData.trackingTimeline?.length > 0 ? (
                  <div className="timeline">
                    {shipmentData.trackingTimeline.map((event, index) => (
                      <div key={index} className="timeline-item">
                        <div className="timeline-marker">
                          {getTimelineIcon(event.status)}
                        </div>
                        <div className="timeline-content">
                          <h6 className="mb-1 text-primary">{event.status}</h6>
                          <p className="text-muted mb-1">{event.description}</p>
                          <small className="text-muted d-none">
                            {formatDateTime(event.time)}
                            {event.location && ` • ${event.location}`}
                          </small>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <FaClock className="text-muted mb-3" size="3em" />
                    <p className="text-muted">
                      No tracking updates available yet.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Product Information */}
            {/* <div className="card">
              <div className="card-header bg-light">
                <h5 className="mb-0">
                  <FaBox className="me-2" />
                  Product Information
                </h5>
              </div>
              <div className="card-body">
                {selectedProduct ? (
                  <div className="row">
                    <div className="col-md-3">
                      <img
                        src={selectedProduct.image || "/placeholder.png"}
                        alt={selectedProduct.name}
                        className="img-fluid rounded"
                        style={{ maxHeight: "120px" }}
                      />
                    </div>
                    <div className="col-md-9">
                      <h6 className="mb-1">{selectedProduct.name}</h6>
                      <p className="text-muted mb-1">
                        Variant: {selectedProduct.variant}
                      </p>
                      <p className="mb-1">Quantity: {selectedProduct.qty}</p>
                      <p className="mb-1">
                        Price: <strong>₹{selectedProduct.sellingPrice}</strong>
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted">No specific product selected for tracking.</p>
                )}
              </div>
            </div> */}
          </div>

          {/* Right Column - Shipping Info */}
          <div className="col-lg-4">
            {/* Shipping Address */}
            <div className="card mb-4">
              <div className="card-header bg-light">
                <h5 className="mb-0">
                  <FaMapMarkerAlt className="me-2" />
                  Delivery Address
                </h5>
              </div>
              <div className="card-body">
                {shipmentData.shippingAddress ? (
                  <>
                    <p className="mb-1">
                      <strong>{shipmentData.shippingAddress.name}</strong>
                    </p>
                    <p className="mb-1">
                      {shipmentData.shippingAddress.addressLine1}
                    </p>
                    {shipmentData.shippingAddress.addressLine2 && (
                      <p className="mb-1">
                        {shipmentData.shippingAddress.addressLine2}
                      </p>
                    )}
                    <p className="mb-1">
                      {shipmentData.shippingAddress.city},{" "}
                      {shipmentData.shippingAddress.state} -{" "}
                      {shipmentData.shippingAddress.pincode}
                    </p>
                    <p className="mb-1">
                      {shipmentData.shippingAddress.country}
                    </p>
                    <hr />
                    <p className="mb-1">
                      <strong>Phone:</strong>{" "}
                      {shipmentData.shippingAddress.phone}
                    </p>
                    <p className="mb-0">
                      <strong>Email:</strong>{" "}
                      {shipmentData.shippingAddress.email}
                    </p>
                  </>
                ) : (
                  <p className="text-muted">No shipping address available</p>
                )}
              </div>
            </div>

            {/* Courier Information */}
            {shipmentData.courier && (
              <div className="card">
                <div className="card-header bg-light">
                  <h5 className="mb-0">
                    <FaShippingFast className="me-2" />
                    Courier Information
                  </h5>
                </div>
                <div className="card-body">
                  {shipmentData.courier.name && (
                    <p className="mb-2">
                      <strong>Courier:</strong> {shipmentData.courier.name}
                    </p>
                  )}
                  {shipmentData.courier.awb && (
                    <p className="mb-2">
                      <strong>AWB Number:</strong>{" "}
                      <code>{shipmentData.courier.awb}</code>
                    </p>
                  )}
                  {/* {shipmentData.courier.trackingUrl && (
                    <a
                      href={shipmentData.courier.trackingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary btn-sm w-100"
                    >
                      <FaShippingFast className="me-2" />
                      Track on Courier Site
                    </a>
                  )} */}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add some CSS for the timeline */}
      <style jsx>{`
        .timeline {
          position: relative;
          padding-left: 30px;
        }
        .timeline-item {
          position: relative;
          margin-bottom: 20px;
        }
        .timeline-marker {
          position: absolute;
          left: -30px;
          top: 0;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }
        .timeline-content {
          padding: 10px;
          border-left: 2px solid #dee2e6;
          margin-left: 10px;
        }
        .timeline-icon.confirmed {
          color: #28a745;
        }
        .timeline-icon.shipped {
          color: #17a2b8;
        }
        .timeline-icon.delivered {
          color: #007bff;
        }
        .timeline-icon.pending {
          color: #6c757d;
        }
      `}</style>

      <Footer />
    </>
  );
};

export default OrderTrack;
