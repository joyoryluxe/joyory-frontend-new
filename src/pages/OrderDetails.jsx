import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import Loader from "../components/common/Loader";
import "../styles/OrderDetails.css";
import {
  FaCheckCircle, FaBox, FaTruck, FaTimesCircle, FaClock,
  FaArrowLeft, FaShippingFast, FaInfoCircle, FaBan, FaExclamationTriangle,
  FaCamera, FaTrash, FaUndo, FaExchangeAlt, FaDownload, FaExternalLinkAlt
} from "react-icons/fa";
import axios from "axios";

/* ---------- constants ---------- */
const SHIPMENT_API = "https://beauty.joyory.com/api/user/cart/shipment";
const RETURN_API = "https://beauty.joyory.com/api/returns/request";
const INVOICE_BASE_URL = "https://beauty.joyory.com/api/user/cart/invoice";

/* ---------- backend rule map ---------- */
const RETURN_REASON_RULES = {
  DAMAGED: { imagesRequired: true },
  WRONG_ITEM: { imagesRequired: true },
  EXPIRED: { imagesRequired: true },
  QUALITY_ISSUE: { imagesRequired: true },
  SIZE_ISSUE: { imagesRequired: false },
  NO_LONGER_NEEDED: { imagesRequired: false }
};

/* ---------- user-friendly reason options ---------- */
const RETURN_REASON_OPTIONS = {
  return: [
    { value: "DAMAGED", label: "Defective / Damaged product" },
    { value: "WRONG_ITEM", label: "Wrong item received" },
    { value: "EXPIRED", label: "Expired product" },
    { value: "QUALITY_ISSUE", label: "Quality issue" },
    { value: "SIZE_ISSUE", label: "Size / Fit issue" },
    { value: "NO_LONGER_NEEDED", label: "No longer needed / Change of mind" }
  ],
  replace: [
    { value: "DAMAGED", label: "Defective / Damaged product" },
    { value: "WRONG_ITEM", label: "Wrong item received" },
    { value: "QUALITY_ISSUE", label: "Quality issue" },
    { value: "SIZE_ISSUE", label: "Size / Fit issue" }
  ]
};

/* ---------- helpers ---------- */
const formatDate = (d) => {
  if (!d) return "N/A";
  const dt = new Date(d);
  return `${String(dt.getDate()).padStart(2, "0")}-${String(dt.getMonth() + 1).padStart(2, "0")}-${dt.getFullYear()}`;
};
const formatDateTime = (d) => {
  if (!d) return "N/A";
  const dt = new Date(d);
  return `${formatDate(d)} ${String(dt.getHours()).padStart(2, "0")}:${String(dt.getMinutes()).padStart(2, "0")}`;
};
const formatCurrency = (n) => (n ? Number(n).toFixed(2) : "0.00");
const getWaybill = (s) => s?.courier?.awb || s?.waybill || s?.awb || s?.orderInfo?.awb || null;

const OrderDetails = () => {
  const { shipmentId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const selectedProduct = location.state?.selectedProduct;

  /* ---- state ---- */
  const [shipmentData, setShipmentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* cancellation
  const [cancelling, setCancelling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  */

  /* return / replace */
  const [returnForms, setReturnForms] = useState({});
  const [returning, setReturning] = useState(false);

  /* invoice download */
  const [downloadingInvoice, setDownloadingInvoice] = useState(false);

  /* ---- data fetch ---- */
  const fetchShipmentDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${SHIPMENT_API}/${shipmentId}`, { withCredentials: true });
      if (res.data?.success) {
        setShipmentData(res.data);
      } else setError("Failed to fetch shipment details");
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) navigate("/login");
      else setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShipmentDetails();
  }, [shipmentId]);

  /* ---------- INVOICE DOWNLOAD LOGIC ---------- */
  const handleDownloadInvoice = async () => {
    const invoiceId = shipmentData?.invoice?.invoiceId;

    if (!invoiceId) {
      alert("Invoice not available yet.");
      return;
    }

    setDownloadingInvoice(true);

    try {
      const response = await axios.get(`${INVOICE_BASE_URL}/${invoiceId}`, {
        withCredentials: true,
        responseType: "blob",
      });

      let fileName = "Invoice.pdf";
      const contentDisposition = response.headers["content-disposition"];
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+)"/);
        if (match?.[1]) fileName = match[1];
      }

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);

    } catch (err) {
      console.error("Invoice Download Error:", err);

      if (err.response?.data instanceof Blob) {
        const text = await err.response.data.text();
        try {
          const json = JSON.parse(text);
          alert(json.message || "Failed to download invoice");
        } catch {
          alert("Failed to download invoice");
        }
      } else {
        alert("Something went wrong while downloading invoice");
      }

    } finally {
      setDownloadingInvoice(false);
    }
  };

  /* ---- cancellation logic ----
  const isCancellable = (st) => {
    if (!st) return false;
    const blocked = ["picked up", "in transit", "out for delivery", "delivered", "cancelled", "rto initiated", "rto delivered"];
    return !blocked.includes(st.toLowerCase());
  };

  const initiateCancellation = () => {
    setCancelReason("");
    setShowCancelModal(true);
  };

  const handleConfirmCancel = async () => {
    if (!cancelReason.trim()) return alert("Reason required");
    if (cancelling) return;
    const orderId = shipmentData?.orderInfo?._id;
    const waybill = getWaybill(shipmentData);
    if (!orderId) return alert("Order ID missing");
    if (!waybill) return alert("Waybill not assigned yet");
    setCancelling(true);
    try {
      const res = await axios.put(
        `${SHIPMENT_API}/cancel/${shipmentId}`,
        { orderId, reason: cancelReason.trim() },
        { withCredentials: true }
      );
      if (res.data?.success) {
        alert(res.data.message || "Cancelled");
        setShowCancelModal(false);
        fetchShipmentDetails();
      } else alert(res.data?.message || "Failed");
    } catch (e) {
      alert(e.response?.data?.message || "Error");
    } finally {
      setCancelling(false);
    }
  };
  */

  /* ---------- RETURN / REPLACE ---------- */
  const openReturnForm = (idx, type) => {
    const product = shipmentData.products[idx];
    setReturnForms((prev) => ({
      ...prev,
      [idx]: {
        type,
        reason: "",
        description: "",
        images: [],
        quantity: 1,
        maxQuantity: product.qty
      }
    }));
  };

  const closeReturnForm = (idx) => {
    setReturnForms((prev) => {
      const copy = { ...prev };
      delete copy[idx];
      return copy;
    });
  };

  const handleReturnQuantity = (idx, delta) => {
    setReturnForms((prev) => {
      const form = prev[idx];
      if (!form) return prev;
      let newQty = form.quantity + delta;
      newQty = Math.max(1, Math.min(newQty, form.maxQuantity));
      return { ...prev, [idx]: { ...form, quantity: newQty } };
    });
  };

  const handleReturnImages = (idx, files) => {
    if (!files || !files.length) return;
    const form = returnForms[idx];
    if (!form) return;
    const total = form.images.length + files.length;
    if (total > 5) return alert("Max 5 images allowed");
    const newImgs = Array.from(files).map((file) =>
      Object.assign(file, { preview: URL.createObjectURL(file) })
    );
    setReturnForms((prev) => ({
      ...prev,
      [idx]: { ...form, images: [...form.images, ...newImgs] }
    }));
  };

  const removeReturnImage = (idx, i) => {
    const form = returnForms[idx];
    if (!form) return;
    const copy = { ...form, images: form.images.filter((_, k) => k !== i) };
    setReturnForms((prev) => ({ ...prev, [idx]: copy }));
  };

  const submitReturn = async (idx) => {
    const form = returnForms[idx];
    if (!form) return;
    if (!form.reason) return alert("Please select a reason");

    const rule = RETURN_REASON_RULES[form.reason];
    if (rule?.imagesRequired && form.images.length === 0) {
      return alert(`Images are required for reason: ${form.reason}`);
    }

    const product = shipmentData.products[idx];
    if (!product) return;

    const productId = product.productId || product._id;
    let variantPayload = undefined;
    if (product.variant && typeof product.variant === "object" && product.variant.sku) {
      variantPayload = { sku: product.variant.sku };
    }

    const body = new FormData();
    body.append("type", form.type);
    body.append("reason", form.reason);
    body.append("reasonDescription", form.description.trim());

    const itemsPayload = [
      {
        productId,
        quantity: form.quantity,
        ...(variantPayload ? { variant: variantPayload } : {})
      }
    ];

    body.append("items", JSON.stringify(itemsPayload));

    form.images.forEach((file) => {
      body.append(`images_${productId}`, file);
    });

    setReturning(true);
    try {
      const res = await axios.post(`${RETURN_API}/${shipmentId}`, body, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" }
      });
      if (res.data?.success) {
        alert(res.data.message || "Request submitted successfully");
        closeReturnForm(idx);
        fetchShipmentDetails();
      } else {
        alert(res.data?.message || "Request failed");
      }
    } catch (e) {
      console.error("Return Error:", e);
      alert(e.response?.data?.message || "Something went wrong");
    } finally {
      setReturning(false);
    }
  };

  const hasActiveReturn = (p) => {
    const returns = shipmentData?.returns || [];
    return returns.some(
      (r) =>
        ["requested", "pickup_scheduled", "in_transit", "pickup_pending", "qc_passed", "qc_failed"].includes(r.status) &&
        r.items.some((i) => i.productId.toString() === (p.productId || p._id).toString())
    );
  };

  const getReturnForProduct = (p) => {
    const returns = shipmentData?.returns || [];
    return returns.find(
      (r) => r.items.some((i) => i.productId.toString() === (p.productId || p._id).toString())
    );
  };

  /* ---------- GET EFFECTIVE STATUS (Priority: Return > Shipment) ---------- */
  const getEffectiveStatus = () => {
    const activeReturn = shipmentData?.activeReturn;
    const returns = shipmentData?.returns || [];

    // Check if there's an active return
    if (activeReturn && activeReturn.status) {
      return {
        status: activeReturn.status,
        statusLabel: activeReturn.statusLabel || "Return Requested",
        type: activeReturn.type || "return"
      };
    }

    // Check if any return has tracking (return in progress)
    const returnWithTracking = returns.find(r => r.trackingTimeline?.length > 0);
    if (returnWithTracking) {
      return {
        status: returnWithTracking.status,
        statusLabel: returnWithTracking.statusLabel || returnWithTracking.status,
        type: returnWithTracking.type
      };
    }

    // Fall back to shipment status
    return {
      status: shipmentData?.shipmentStatus,
      statusLabel: shipmentData?.shipmentStatus,
      type: "shipment"
    };
  };

  /* ---------- STATUS HELPERS (Matching Backend Status Values) ---------- */
  const getStatusIcon = (st, returnType) => {
    if (!st) return <FaClock className="status-icon pending" />;
    const status = st.toLowerCase();

    // Return/Replace specific icons
    if (returnType === "return" || returnType === "replace") {
      if (status === "requested" || status === "return_requested") return <FaUndo className="status-icon warning" />;
      if (status === "pickup_scheduled" || status === "pickup_pending") return <FaClock className="status-icon warning" />;
      if (status === "in_transit") return <FaShippingFast className="status-icon info" />;
      if (status === "qc_passed" || status === "completed") return <FaCheckCircle className="status-icon success" />;
      if (status === "qc_failed" || status === "rejected") return <FaTimesCircle className="status-icon danger" />;
    }

    // Shipment status icons
    if (status === "delivered") return <FaTruck className="status-icon delivered" />;
    if (status === "shipped" || status === "in transit") return <FaShippingFast className="status-icon shipped" />;
    if (status === "confirmed" || status === "processing") return <FaCheckCircle className="status-icon confirmed" />;
    if (status === "cancelled" || status === "rto initiated" || status === "rto delivered") return <FaTimesCircle className="status-icon cancelled" />;
    if (status === "out for delivery") return <FaTruck className="status-icon delivered" />;
    if (status === "pickup scheduled" || status === "shipment created") return <FaBox className="status-icon pending" />;
    if (status === "picked up") return <FaShippingFast className="status-icon shipped" />;

    return <FaClock className="status-icon pending" />;
  };

  const getStatusColor = (st, returnType) => {
    if (!st) return "secondary";
    const status = st.toLowerCase();

    // Return status colors
    if (returnType === "return" || returnType === "replace") {
      if (status === "requested" || status === "return_requested") return "warning";
      if (status === "pickup_scheduled" || status === "pickup_pending") return "warning";
      if (status === "in_transit") return "info";
      if (status === "qc_passed" || status === "completed") return "success";
      if (status === "qc_failed" || status === "rejected") return "danger";
    }

    // Shipment status colors
    if (status === "delivered") return "success";
    if (status === "shipped" || status === "in transit" || status === "picked up") return "info";
    if (status === "confirmed" || status === "processing") return "warning";
    if (status === "cancelled" || status === "rto initiated" || status === "rto delivered") return "danger";
    if (status === "out for delivery") return "success";
    if (status === "pickup scheduled" || status === "shipment created") return "secondary";

    return "secondary";
  };

  const getTrackingStatusIcon = (st) => {
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

  const isSelectedProduct = (p) => selectedProduct && p.name === selectedProduct.name;

  /* ---------- render ---------- */
  if (loading) return (
    <>
      <Header />
      <div className="container mt-4 text-center py-5" style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Loader text="Loading Shipment..." height={150} />
      </div>
      <Footer />
    </>
  );

  if (error || !shipmentData) return (
    <>
      <Header />
      <div className="container mt-4 text-center py-5">
        <div className="alert alert-danger">{error || "No data available"}</div>
        <button className="btn btn-primary" onClick={() => navigate(-1)}>Go Back</button>
      </div>
      <Footer />
    </>
  );

  const priceDetails = shipmentData.priceDetails || {};
  const orderInfo = shipmentData.orderInfo || {};
  const courier = shipmentData.courier || {};
  const trackingTimeline = shipmentData.trackingTimeline || [];
  const returns = shipmentData.returns || [];
  const otherItems = shipmentData.otherItems || [];
  const invoice = shipmentData.invoice || {};

  // Get effective status (prioritizing return status over shipment status)
  const effectiveStatus = getEffectiveStatus();
  const displayStatus = effectiveStatus.statusLabel || effectiveStatus.status;

  // Determine if return is active
  const isReturnActive = effectiveStatus.type === "return" || effectiveStatus.type === "replace";

  return (
    <div className="order-details-page">
      <Header />
      <div className="container py-4 mt-lg-5 mt-3 pt-0">

        {/* Navigation / Back Button */}
        <div className="mb-3 pt-lg-3">
          <button className="btn back-btn" onClick={() => navigate(-1)}>
            <FaArrowLeft className="me-2" /> Back to Orders
          </button>
        </div>

        {/* Header Row */}
        <div className="details-header-row">
          <div className="details-header-title">
            <h4>Order Details</h4>
            <span>Order ID: <strong>{orderInfo.orderId}</strong></span>
          </div>

          <div className="details-header-actions">
            {/* Status Badge */}
            <div className={`status-badge-pill ${getStatusColor(effectiveStatus.status, effectiveStatus.type)}`}>
              {getStatusIcon(effectiveStatus.status, effectiveStatus.type)}
              <span>
                {isReturnActive && (
                  <span className="text-muted-50 me-1" style={{ fontSize: "10px", fontWeight: "normal" }}>
                    {effectiveStatus.type === "return" ? "Return: " : "Replace: "}
                  </span>
                )}
                {displayStatus || "Pending"}
              </span>
            </div>

            {/* Cancel Shipment Button
            {isCancellable(shipmentData.shipmentStatus) && getWaybill(shipmentData) && !isReturnActive && (
              <button className="btn-premium-action btn-danger-p" onClick={initiateCancellation}>
                <FaBan /> Cancel Shipment
              </button>
            )}
            */}

            {/* Download Invoice Button */}
            <button
              className="btn btn-premium-action btn-outline-p downl-inv"
              onClick={handleDownloadInvoice}
              disabled={downloadingInvoice || !invoice?.invoiceId}
            >
              {downloadingInvoice ? (
                <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
              ) : (
                <FaDownload className="me-1" />
              )}
              {downloadingInvoice ? "Generating..." : "Download Invoice"}
            </button>
          </div>
        </div>

        {/* 2-Column Grid Layout */}
        <div className="row g-4">
          {/* Left Column (Primary Details) */}
          <div className="col-lg-8">

            {/* Shipment Metadata & Tracking history Card */}
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
                  <strong>Expected Delivery:</strong> <span className="text-success fw-bold">{shipmentData.expectedDelivery ? formatDate(shipmentData.expectedDelivery) : "TBD"}</span>
                </div>
                <div className="metadata-item">
                  <strong>Courier Partner:</strong> <span>{courier.name || "Assigning..."}</span>
                </div>
                {getWaybill(shipmentData) && (
                  <div className="metadata-item col-span-2">
                    <strong>Waybill / AWB:</strong>
                    <span className=" text-dark border ms-2 px-1">{getWaybill(shipmentData)}</span>
                    {/* {courier.trackingUrl && (
                      <a
                         href={courier.trackingUrl}
                         target="_blank"
                         rel="noopener noreferrer"
                         className="ms-2 btn btn-sm btn-outline-secondary py-0 px-2 fw-normal"
                         style={{ fontSize: "11px" }}
                       >
                         <FaExternalLinkAlt size={10} className="me-1" /> Track
                       </a>
                    )} */}
                  </div>
                )}
              </div>

              {/* Timeline nested in Shipment Card */}
              {(trackingTimeline.length > 0 || returns.some(r => r.trackingTimeline?.length > 0)) && (
                <div className="border-top pt-4 mt-3">
                  <h6 className="fw-bold mb-3" style={{ fontSize: "0.95rem" }}>Tracking Timeline</h6>
                  <div className="timeline" style={{ maxHeight: "350px", overflowY: "auto", paddingRight: "10px" }}>

                    {/* Shipment tracking events - reversed to show newest first */}
                    {trackingTimeline.slice().reverse().map((evt, i) => (
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
                    {returns.map((ret, retIdx) => (
                      ret.trackingTimeline?.length > 0 && (
                        <React.Fragment key={`ret-${retIdx}`}>
                          <div className="my-3 py-1 px-3 bg-light rounded text-uppercase tracking-header-label">
                            <small className="fw-bold text-muted" style={{ fontSize: 10 }}>
                              {ret.type} Tracking — {ret.statusLabel || ret.status}
                            </small>
                          </div>
                          {ret.trackingTimeline.slice().reverse().map((evt, i) => (
                            <div key={`ret-${retIdx}-${i}`} className="timeline-item">
                              <div className="timeline-marker">{getTrackingStatusIcon(evt.status)}</div>
                              <div className="timeline-content">
                                <h6 className="text-capitalize">{evt.status.replace(/_/g, ' ')}</h6>
                                <p>{evt.description}</p>
                                <span className="timestamp">
                                  {formatDateTime(evt.timestamp)} {evt.location ? `| ${evt.location}` : ""}
                                </span>
                              </div>
                            </div>
                          ))}
                        </React.Fragment>
                      )
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Items in Shipment Card */}
            <div className="od-card">
              <h5 className="od-card-title">
                <FaBox className="me-2" /> Items in Shipment
              </h5>

              <div className="product-rows-list">
                {shipmentData.products?.map((p, idx) => {
                  const form = returnForms[idx];
                  const activeReturn = hasActiveReturn(p);
                  const returnInfo = getReturnForProduct(p);
                  const canOpenReturn = shipmentData.shipmentStatus?.toLowerCase() === "delivered" && !activeReturn;

                  const variantDisplay = typeof p.variant === "object"
                    ? (p.variant?.shadeName || p.variant?.sku || "N/A")
                    : (p.variant || "N/A");
                  const skuDisplay = typeof p.variant === "object"
                    ? (p.variant?.sku || "N/A")
                    : (p.variant || "N/A");

                  return (
                    <div key={idx} className={`product-row-item ${isSelectedProduct(p) ? "highlight-item" : ""}`}>
                      <div className="od-img-wrap">
                        <img src={p.image} alt={p.name} />
                      </div>

                      <div className="product-details">
                        <h6>{p.name}</h6>
                        <div className="variant-label">
                          <span>Variant: <strong>{variantDisplay}</strong></span>
                          <span className="mx-2">|</span>
                          <span>SKU: <strong>{skuDisplay}</strong></span>
                          <span className="mx-2">|</span>
                          <span>Qty: <strong>{p.qty}</strong></span>
                        </div>

                        {/* Return / Replace Buttons */}
                        {canOpenReturn && !form && (
                          <div className="action-buttons-wrap">
                            <button className="btn btn-premium-action btn-dark-p btn-sm" onClick={() => openReturnForm(idx, "return")}>
                              <FaUndo /> Return
                            </button>
                            <button className="btn btn-premium-action btn-outline-p btn-sm" onClick={() => openReturnForm(idx, "replace")}>
                              <FaExchangeAlt /> Replace
                            </button>
                          </div>
                        )}

                        {/* Active Return Banner */}
                        {activeReturn && returnInfo && (
                          <div className="mt-2">
                            <span className="status-badge-pill warning py-1 px-3">
                              {returnInfo.statusLabel || returnInfo.status}
                            </span>
                            {returnInfo.courier?.waybill && (
                              <small className="d-block text-muted mt-1" style={{ fontSize: "11px" }}>
                                Return AWB: <strong>{returnInfo.courier.waybill}</strong>
                              </small>
                            )}
                          </div>
                        )}

                        {/* Return/Replace Form inside the product details context */}
                        {form && (
                          <div className="return-form-container mt-3">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                              <h6 className="mb-0 text-capitalize fw-bold">{form.type} Request</h6>
                              <button className="btn btn-link text-danger p-0" onClick={() => closeReturnForm(idx)}>
                                <FaTimesCircle size={18} />
                              </button>
                            </div>

                            <div className="mb-3">
                              <label className="form-label fw-bold small">Quantity to {form.type}</label>
                              <div className="qty-counter-wrap">
                                <button className="qty-counter-btn" onClick={() => handleReturnQuantity(idx, -1)} disabled={form.quantity <= 1}>-</button>
                                <span className="qty-counter-value">{form.quantity}</span>
                                <button className="qty-counter-btn" onClick={() => handleReturnQuantity(idx, 1)} disabled={form.quantity >= form.maxQuantity}>+</button>
                              </div>
                            </div>

                            <div className="mb-3">
                              <label className="form-label fw-bold small">Reason for {form.type} <span className="text-danger">*</span></label>
                              <select
                                className="custom-select"
                                value={form.reason}
                                onChange={(e) => setReturnForms(prev => ({ ...prev, [idx]: { ...prev[idx], reason: e.target.value } }))}
                              >
                                <option value="">Select a reason</option>
                                {RETURN_REASON_OPTIONS[form.type].map(opt => (
                                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                              </select>
                            </div>

                            <div className="mb-3">
                              <label className="form-label fw-bold small">Additional Comments</label>
                              <textarea
                                className="custom-textarea"
                                rows="2"
                                value={form.description}
                                onChange={(e) => setReturnForms(prev => ({ ...prev, [idx]: { ...prev[idx], description: e.target.value } }))}
                                placeholder="Please provide any additional details..."
                              />
                            </div>

                            <div className="mb-3">
                              <label className="form-label fw-bold small">
                                Upload Images {RETURN_REASON_RULES[form.reason]?.imagesRequired && <span className="text-danger">*</span>}
                              </label>
                              <div
                                className="od-upload-area"
                                onClick={() => document.getElementById(`ret-img-${idx}`).click()}
                              >
                                <FaCamera size={24} className="text-muted mb-2" />
                                <p className="mb-0 fw-semibold">Click to upload product image</p>
                                <small className="text-muted d-block mt-1">Required for damaged or quality issues (Max 5)</small>
                              </div>
                              <input id={`ret-img-${idx}`} type="file" multiple accept="image/*" className="d-none" onChange={(e) => handleReturnImages(idx, e.target.files)} />

                              {form.images?.length > 0 && (
                                <div className="od-preview-grid">
                                  {form.images.map((img, i) => (
                                    <div key={i} className="od-preview-img-wrap">
                                      <img src={img.preview} alt="preview" />
                                      <button className="btn-remove-preview" onClick={() => removeReturnImage(idx, i)}>
                                        <FaTrash size={8} />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            <button
                              className="btn btn-premium-action btn-dark-p w-100 justify-content-center btn-sm mt-2"
                              disabled={returning || !form.reason || (RETURN_REASON_RULES[form.reason]?.imagesRequired && form.images.length === 0)}
                              onClick={() => submitReturn(idx)}
                            >
                              {returning ? (
                                <>
                                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                  Submitting...
                                </>
                              ) : (
                                `Submit ${form.type.toUpperCase()}`
                              )}
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="product-price-wrap">
                        <div className="price-now">₹{formatCurrency(p.sellingPrice * p.qty)}</div>
                        {p.mrp > p.sellingPrice && <div className="price-old">₹{formatCurrency(p.mrp * p.qty)}</div>}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Other Items Section (Different Shipment) */}
              {otherItems.length > 0 && (
                <div className="border-top pt-4 mt-4">
                  <h6 className="fw-bold mb-3" style={{ fontSize: "0.95rem" }}>Other Items in this Order (In a different shipment)</h6>
                  <div className="product-rows-list">
                    {otherItems.map((p, idx) => (
                      <div key={`other-${idx}`} className="product-row-item opacity-75">
                        <div className="od-img-wrap">
                          <img src={p.image} alt={p.name} />
                        </div>
                        <div className="product-details">
                          <span className="badge bg-secondary mb-1">Different Shipment</span>
                          <h6>{p.name}</h6>
                          <div className="variant-label">
                            <span>Variant: <strong>{typeof p.variant === "object" ? (p.variant?.shadeName || p.variant?.sku || "N/A") : (p.variant || "N/A")}</strong></span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Returns & Replacements Summary Card */}
            {returns.length > 0 && (
              <div className="od-card">
                <h5 className="od-card-title">
                  <FaUndo className="me-2" /> Returns & Replacements
                </h5>
                <div style={{ maxHeight: "450px", overflowY: "auto", paddingRight: "10px" }}>
                  {returns.map((ret, idx) => (
                    <div key={idx} className="border rounded p-3 mb-3 bg-light bg-opacity-40">
                      <div className="d-flex justify-content-between align-items-start mb-3 flex-wrap gap-2">
                        <div>
                          <span className="badge bg-black text-white me-2 text-capitalize">{ret.type}</span>
                          <span className={`status-badge-pill py-1 px-2 ${getStatusColor(ret.status, "return")}`} style={{ fontSize: "11px" }}>
                            {ret.statusLabel || ret.status}
                          </span>
                        </div>
                        <small className="text-muted">{formatDateTime(ret.createdAt)}</small>
                      </div>

                      {ret.courier?.name && (
                        <div className="mb-2 small text-muted">
                          <strong>Courier:</strong> {ret.courier.name}
                          {ret.courier.waybill && (
                            <span className="ms-2 badge bg-white text-dark border">AWB: {ret.courier.waybill}</span>
                          )}
                        </div>
                      )}

                      {ret.refund && (
                        <div className="mb-2 small text-muted">
                          <strong>Refund Amount:</strong> ₹{formatCurrency(ret.refund.amount)}
                          <span className={`badge ml ms-2 bg-${ret.refund.status === 'completed' ? 'success' : ret.refund.status === 'failed' ? 'danger' : 'warning'}`}>
                            {ret.refund.status}
                          </span>
                          {ret.refund.refundedAt && (
                            <span className="text-muted ms-1">({formatDateTime(ret.refund.refundedAt)})</span>
                          )}
                        </div>
                      )}

                      {ret.qc?.status && (
                        <div className="mb-2 small text-muted">
                          <strong>QC Status:</strong> <span className="fw-semibold">{ret.qc.status}</span>
                          {ret.qc.notes && <span className="text-muted"> - {ret.qc.notes}</span>}
                        </div>
                      )}

                      <div className="border-top pt-2 mt-2">
                        {ret.items.map((item, i) => (
                          <div key={i} className="small text-muted mb-2">
                            <strong>Reason:</strong> {RETURN_REASON_OPTIONS.return.find(r => r.value === item.reason)?.label || item.reason}
                            {item.reasonDescription && <span className="text-muted"> - {item.reasonDescription}</span>}
                            <div className="mt-1">
                              <strong>Condition:</strong> {item.condition} | <strong>Qty:</strong> {item.quantity}
                              {item.images?.length > 0 && (
                                <div className="d-flex gap-2 mt-2">
                                  {item.images.map((img, imgIdx) => (
                                    <img key={imgIdx} src={img} alt="return-proof" style={{ width: 44, height: 44, objectFit: "cover" }} className="rounded border" />
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column (Sidebar Transactional Info) */}
          <div className="col-lg-4">

            {/* Price Summary Card */}
            <div className="od-card">
              <h5 className="od-card-title">
                <FaInfoCircle className="me-2" /> Price Summary
              </h5>

              <div className="price-rows-wrap mt-3">
                <div className="price-row-item">
                  <span>Total MRP</span>
                  <span>₹{formatCurrency(priceDetails.totalMRP)}</span>
                </div>

                {Number(priceDetails.totalDiscount) > 0 && (
                  <div className="price-row-item">
                    <span>Total Discount</span>
                    <span className="text-success">-₹{formatCurrency(priceDetails.totalDiscount)}</span>
                  </div>
                )}

                <div className="price-row-item">
                  <span>Subtotal</span>
                  <span>₹{formatCurrency(priceDetails.breakdown?.sellingPrice || priceDetails.shipmentTotal - priceDetails.otherCharges)}</span>
                </div>

                {/* Shipping Charge */}
                {priceDetails.breakdown?.shippingCharge !== undefined && Number(priceDetails.breakdown?.shippingCharge) >= 0 && (
                  <div className="price-row-item">
                    <span>Shipping</span>
                    {priceDetails.isFreeShipping || Number(priceDetails.breakdown?.shippingCharge) === 0 ? (
                      <span className="text-success fw-bold">FREE</span>
                    ) : (
                      <span className="text-info">+₹{formatCurrency(priceDetails.breakdown.shippingCharge)}</span>
                    )}
                  </div>
                )}

                {Number(priceDetails.breakdown?.gst) > 0 && (
                  <div className="price-row-item">
                    <span>GST</span>
                    <span>+₹{formatCurrency(priceDetails.breakdown.gst)}</span>
                  </div>
                )}

                {Number(priceDetails.breakdown?.couponDiscount) > 0 && (
                  <div className="price-row-item">
                    <span>Coupon Discount</span>
                    <span className="text-success">-₹{formatCurrency(priceDetails.breakdown.couponDiscount)}</span>
                  </div>
                )}

                {Number(priceDetails.breakdown?.pointsDiscount) > 0 && (
                  <div className="price-row-item">
                    <span>Points Discount</span>
                    <span className="text-success">-₹{formatCurrency(priceDetails.breakdown.pointsDiscount)}</span>
                  </div>
                )}

                {Number(priceDetails.breakdown?.giftCardDiscount) > 0 && (
                  <div className="price-row-item">
                    <span>Gift Card Discount</span>
                    <span className="text-success">-₹{formatCurrency(priceDetails.breakdown.giftCardDiscount)}</span>
                  </div>
                )}

                <div className="price-row-item total-row">
                  <span>Shipment Total</span>
                  <span>₹{formatCurrency(priceDetails.shipmentTotal)}</span>
                </div>

                {priceDetails.totalShipments > 1 && (
                  <div className="price-row-item text-muted small mt-2">
                    <span>Order Total ({priceDetails.totalShipments} shipments)</span>
                    <span>₹{formatCurrency(priceDetails.orderTotal)}</span>
                  </div>
                )}

                {Number(priceDetails.youSaved) > 0 && (
                  <div className="savings-highlight">
                    🎉 You saved ₹{formatCurrency(priceDetails.youSaved)} on this order!
                  </div>
                )}

                <div className="border-top pt-3 mt-4 small text-muted">
                  <div className="d-flex justify-content-between mb-2">
                    <span>Payment Mode:</span>
                    <strong className="text-dark">{priceDetails.paymentMode || shipmentData.paymentMethod || "N/A"}</strong>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>Order Type:</span>
                    <span className="text-dark">{shipmentData.orderType || "N/A"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Address Card */}
            <div className="od-card">
              <h5 className="od-card-title">
                <FaShippingFast className="me-2" /> Shipping Address
              </h5>

              <div className="address-details mt-3">
                <div className="contact-detail-row">
                  <div className="contact-text">
                    <strong className="text-dark d-block mb-1">{shipmentData.shippingAddress?.name || "N/A"}</strong>
                    <div>{shipmentData.shippingAddress?.addressLine1 || "N/A"}</div>
                    {shipmentData.shippingAddress?.addressLine2 && <div>{shipmentData.shippingAddress.addressLine2}</div>}
                    <div>{shipmentData.shippingAddress?.city}, {shipmentData.shippingAddress?.state} - {shipmentData.shippingAddress?.pincode}</div>
                  </div>
                </div>

                <div className="border-top pt-3 mt-3">
                  <div className="contact-detail-row">
                    <i className="bi bi-telephone me-2"></i>
                    <span className="contact-text">Phone: <strong>{shipmentData.shippingAddress?.phone || "N/A"}</strong></span>
                  </div>
                  {shipmentData.shippingAddress?.email && (
                    <div className="contact-detail-row mt-2">
                      <i className="bi bi-envelope me-2"></i>
                      <span className="contact-text">Email: <strong>{shipmentData.shippingAddress?.email || "N/A"}</strong></span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cancel shipment modal using custom premium styles
        {showCancelModal && (
          <div className="od-modal-overlay">
            <div className="od-modal-content">
              <div className="od-modal-header">
                <h5>Cancel Shipment</h5>
                <button type="button" className="btn-close-custom" onClick={() => setShowCancelModal(false)}>×</button>
              </div>
              <div className="od-modal-body">
                <p className="mb-3 text-muted">Are you sure you want to cancel this shipment? This action is irreversible.</p>
                <div className="form-group mb-2">
                  <label className="fw-bold mb-2 small text-dark">Reason for Cancellation <span className="text-danger">*</span></label>
                  <textarea
                    className="custom-textarea"
                    rows="3"
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    placeholder="Please provide a cancellation reason..."
                  />
                </div>
              </div>
              <div className="od-modal-footer">
                <button type="button" className="btn btn-premium-action btn-outline-p btn-sm" onClick={() => setShowCancelModal(false)}>Close</button>
                <button type="button" className="btn btn-premium-action btn-danger-p btn-sm" onClick={handleConfirmCancel} disabled={cancelling}>
                  {cancelling ? "Processing..." : "Confirm Cancellation"}
                </button>
              </div>
            </div>
          </div>
        )}
        */}
      </div>
      <Footer />
    </div>
  );
};

export default OrderDetails;