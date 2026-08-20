import React from 'react';
import {
    FaCheckCircle, FaBox, FaTruck, FaTimesCircle, FaClock,
    FaShippingFast, FaInfoCircle, FaUndo,
} from 'react-icons/fa';

export const getTrackingStatusIcon = (st) => {
    if (!st) return <FaInfoCircle className="text-secondary" />;
    const status = st.toLowerCase();

    if (status === "delivered") return <FaTruck className="text-success" />;
    if (status === "in transit" || status === "shipped") return <FaShippingFast className="text-info" />;
    if (status === "cancelled" || status === "rto initiated" || status === "rto delivered") return <FaTimesCircle className="text-danger" />;
    if (status === "pickup scheduled") return <FaClock className="text-warning" />;
    if (status === "shipment created") return <FaBox className="text-primary" />;
    if (status === "picked up") return <FaCheckCircle className="text-success" />;
    if (status === "out for delivery") return <FaTruck className="text-success" />;
    if (status === "confirmed" || status === "processing") return <FaCheckCircle className="text-warning" />;

    // Return specific tracking icons
    if (status === "requested" || status === "return_requested") return <FaUndo className="text-warning" />;
    if (status === "pickup_pending") return <FaClock className="text-warning" />;
    if (status === "qc_passed") return <FaCheckCircle className="text-success" />;
    if (status === "qc_failed") return <FaTimesCircle className="text-danger" />;

    return <FaInfoCircle className="text-secondary" />;
};

export const getStatusIcon = (st, returnType) => {
    if (!st) return <FaClock className="status-icon pending" />;
    const status = st.toLowerCase();

    if (returnType === "return" || returnType === "replace") {
        if (status === "requested" || status === "return_requested") return <FaUndo className="status-icon warning" />;
        if (status === "pickup_scheduled" || status === "pickup_pending") return <FaClock className="status-icon warning" />;
        if (status === "in_transit") return <FaShippingFast className="status-icon info" />;
        if (status === "qc_passed" || status === "completed") return <FaCheckCircle className="status-icon success" />;
        if (status === "qc_failed" || status === "rejected") return <FaTimesCircle className="status-icon danger" />;
    }

    if (status === "delivered") return <FaTruck className="status-icon delivered" />;
    if (status === "shipped" || status === "in transit") return <FaShippingFast className="status-icon shipped" />;
    if (status === "confirmed" || status === "processing") return <FaCheckCircle className="status-icon confirmed" />;
    if (status === "cancelled" || status === "rto initiated" || status === "rto delivered") return <FaTimesCircle className="status-icon cancelled" />;
    if (status === "out for delivery") return <FaTruck className="status-icon delivered" />;
    if (status === "pickup scheduled" || status === "shipment created") return <FaBox className="status-icon pending" />;
    if (status === "picked up") return <FaShippingFast className="status-icon shipped" />;

    return <FaClock className="status-icon pending" />;
};

export const getStatusColor = (st, returnType) => {
    if (!st) return "secondary";
    const status = st.toLowerCase();

    if (returnType === "return" || returnType === "replace") {
        if (status === "requested" || status === "return_requested") return "warning";
        if (status === "pickup_scheduled" || status === "pickup_pending") return "warning";
        if (status === "in_transit") return "info";
        if (status === "qc_passed" || status === "completed") return "success";
        if (status === "qc_failed" || status === "rejected") return "danger";
    }

    if (status === "delivered") return "success";
    if (status === "shipped" || status === "in transit" || status === "picked up") return "info";
    if (status === "confirmed" || status === "processing") return "warning";
    if (status === "cancelled" || status === "rto initiated" || status === "rto delivered") return "danger";
    if (status === "out for delivery") return "success";
    if (status === "pickup scheduled" || status === "shipment created") return "secondary";

    return "secondary";
};

export default function ShipmentStatusTracker({
    shipmentData,
    orderInfo,
    courier,
    trackingTimeline,
    returns,
    formatDate,
    formatDateTime,
    getWaybill,
}) {
    return (
        <div className="od-card">
            <h5 className="od-card-title">
                <FaTruck className="me-2" /> Shipment & Tracking Info
            </h5>

            <div className="metadata-grid mb-4">
                <div className="metadata-item">
                    <strong>Shipment ID:</strong> <span>{shipmentData.shipmentId}</span>
                </div>
                <div className="metadata-item">
                    <strong>Order Date:</strong> <span>{formatDate(orderInfo.orderDate)}</span>
                </div>
                <div className="metadata-item">
                    <strong>Expected Delivery:</strong>{" "}
                    <span className="text-success fw-bold">
                        {shipmentData.expectedDelivery ? formatDate(shipmentData.expectedDelivery) : "TBD"}
                    </span>
                </div>
                <div className="metadata-item">
                    <strong>Courier Partner:</strong> <span>{courier.name || "Assigning..."}</span>
                </div>
                {getWaybill(shipmentData) && (
                    <div className="metadata-item col-span-2">
                        <strong>Waybill / AWB:</strong>
                        <span className="text-dark border ms-2 px-1">{getWaybill(shipmentData)}</span>
                    </div>
                )}
            </div>

            {/* Timeline nested in Shipment Card */}
            {(trackingTimeline.length > 0 || returns.some((r) => r.trackingTimeline?.length > 0)) && (
                <div className="border-top pt-4 mt-3">
                    <h6 className="fw-bold mb-3" style={{ fontSize: "0.95rem" }}>
                        Tracking Timeline
                    </h6>
                    <div className="timeline" style={{ maxHeight: "350px", overflowY: "auto", paddingRight: "10px" }}>
                        {/* Shipment tracking events - reversed to show newest first */}
                        {trackingTimeline
                            .slice()
                            .reverse()
                            .map((evt, i) => (
                                <div key={`ship-${i}`} className="timeline-item">
                                    <div className="timeline-marker">{getTrackingStatusIcon(evt.status)}</div>
                                    <div className="timeline-content">
                                        <h6 className="text-capitalize">{evt.status}</h6>
                                        <p>{evt.description || evt.courierStatus}</p>
                                        <span className="timestamp">
                                            {formatDateTime(evt.timestamp)} {evt.location ? `| ${evt.location}` : ""}
                                        </span>
                                    </div>
                                </div>
                            ))}

                        {/* Return tracking events */}
                        {returns.map(
                            (ret, retIdx) =>
                                ret.trackingTimeline?.length > 0 && (
                                    <React.Fragment key={`ret-${retIdx}`}>
                                        <div className="my-3 py-1 px-3 bg-light rounded text-uppercase tracking-header-label">
                                            <small className="fw-bold text-muted" style={{ fontSize: 10 }}>
                                                {ret.type} Tracking — {ret.statusLabel || ret.status}
                                            </small>
                                        </div>
                                        {ret.trackingTimeline
                                            .slice()
                                            .reverse()
                                            .map((evt, i) => (
                                                <div key={`ret-${retIdx}-${i}`} className="timeline-item">
                                                    <div className="timeline-marker">{getTrackingStatusIcon(evt.status)}</div>
                                                    <div className="timeline-content">
                                                        <h6 className="text-capitalize">{evt.status.replace(/_/g, " ")}</h6>
                                                        <p>{evt.description}</p>
                                                        <span className="timestamp">
                                                            {formatDateTime(evt.timestamp)} {evt.location ? `| ${evt.location}` : ""}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                    </React.Fragment>
                                )
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
