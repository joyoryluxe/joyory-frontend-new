/* Chatbot.jsx – Full Product Display with SWIPER SLIDER + Category Selection Flow + Infinite Load */
import React, { useState, useEffect, useRef, useContext, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/free-mode";
import "../Css/Chatbot.css";
import { CartContext } from "../context/CartContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Modal, Button, Form, Alert, Spinner, Card, Badge } from "react-bootstrap";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  FaBox, FaTruck, FaCheckCircle, FaTimesCircle, FaClock,
  FaShippingFast, FaDownload, FaMapMarkerAlt,
  FaCamera, FaTrash, FaUndo, FaChevronDown, FaArrowLeft,
  FaThLarge, FaShoppingBag,
} from "react-icons/fa";

/* ─── CONFIG ─────────────────────────────────────────────────────────────── */
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "YOUR_GEMINI_API_KEY");
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

const PRODUCT_ALL_API  = "https://beauty.joyory.com/api/user/products/all";
const CART_API_BASE    = "https://beauty.joyory.com/api/user/cart";
const SHIPMENT_API     = "https://beauty.joyory.com/api/user/cart/shipment";
const LOGIN_API        = "https://beauty.joyory.com/api/user/login";
const PROFILE_API      = "https://beauty.joyory.com/api/user/profile";
const CANCEL_ORDER_API = "https://beauty.joyory.com/api/payment/cancel";
const INVOICE_BASE_URL = "https://beauty.joyory.com/api/user/cart/invoice";
const RETURN_API       = "https://beauty.joyory.com/api/returns/request";

/* ─── HELPERS ────────────────────────────────────────────────────────────── */
const getSku = (v) => v?.sku || v?.variantSku || `sku-${v?._id || "default"}`;
const isValidHexColor = (hex) => {
  if (!hex || typeof hex !== "string") return false;
  return /^#([a-f0-9]{6}|[a-f0-9]{3})$/.test(hex.trim().toLowerCase());
};
const getVariantDisplayText = (v) =>
  (v?.shadeName || v?.name || v?.size || v?.ml || v?.weight || "Default").toUpperCase();
const groupVariantsByType = (variants) => {
  const g = { color: [], text: [] };
  (variants || []).forEach((v) => {
    if (!v) return;
    v.hex && isValidHexColor(v.hex) ? g.color.push(v) : g.text.push(v);
  });
  return g;
};
const getBrandName = (p) => {
  if (!p?.brand) return "Unknown Brand";
  if (typeof p.brand === "object" && p.brand.name) return p.brand.name;
  if (typeof p.brand === "string") return p.brand;
  return "Unknown Brand";
};
const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  const d = new Date(dateStr);
  return `${d.getDate().toString().padStart(2, "0")}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d.getFullYear()}`;
};
const formatTime = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};
const formatCurrency = (n) => (n ? Number(n).toFixed(2) : "0.00");

/* ─── CATEGORY EMOJI MAP ──────────────────────────────────────────────────── */
const CATEGORY_EMOJI = {
  makeup: "💄", skin: "✨", skincare: "✨", hair: "💇", haircare: "💇",
  face: "🧴", eyes: "👁️", lips: "💋", nails: "💅", perfume: "🌸",
  body: "🧼", sunscreen: "☀️", serum: "💧", moisturizer: "🧴",
  foundation: "🎨", blush: "🌹", eyeliner: "🖊️", mascara: "👁️",
  lipstick: "💋", lipbalm: "💋", lipmask: "💋", default: "🛍️",
};
const getCategoryEmoji = (name = "") => {
  const key = name.toLowerCase().replace(/\s/g, "");
  return CATEGORY_EMOJI[key] || CATEGORY_EMOJI.default;
};

/* ─── CONSTANTS ──────────────────────────────────────────────────────────── */
const RETURN_REASON_RULES = {
  DAMAGED:          { imagesRequired: true },
  WRONG_ITEM:       { imagesRequired: true },
  EXPIRED:          { imagesRequired: true },
  QUALITY_ISSUE:    { imagesRequired: true },
  SIZE_ISSUE:       { imagesRequired: false },
  NO_LONGER_NEEDED: { imagesRequired: false },
};
const RETURN_REASON_OPTIONS = {
  return: [
    { value: "DAMAGED",          label: "Defective / Damaged product" },
    { value: "WRONG_ITEM",       label: "Wrong item received" },
    { value: "EXPIRED",          label: "Expired product" },
    { value: "QUALITY_ISSUE",    label: "Quality issue" },
    { value: "SIZE_ISSUE",       label: "Size / Fit issue" },
    { value: "NO_LONGER_NEEDED", label: "No longer needed / Change of mind" },
  ],
  replace: [
    { value: "DAMAGED",       label: "Defective / Damaged product" },
    { value: "WRONG_ITEM",    label: "Wrong item received" },
    { value: "QUALITY_ISSUE", label: "Quality issue" },
    { value: "SIZE_ISSUE",    label: "Size / Fit issue" },
  ],
};
const MAIN_OPTIONS = [
  { key: "products", label: "🛍️ Products" },
  { key: "orders",   label: "📦 Orders" },
  { key: "support",  label: "💬 Support" },
  // { key: "ask-ai",   label: "🤖 Ask AI Assistant" },
];
const ORDER_OPTIONS = [
  { key: "track",   label: "📦 Track My Order" },
  { key: "cancel",  label: "❌ Cancel Order" },
  { key: "invoice", label: "🧾 Download Invoice" },
  { key: "return",  label: "🔄 Return / Refund" },
  { key: "support", label: "💬 Contact Support" },
];
const CANCELLATION_REASONS = [
  "Applicable discount/offer was not applied",
  "Changed my mind. Don't need the product",
  "Bought it from somewhere else",
  "Wrong shade/size/colour ordered",
  "Forgot to apply coupon/reward points",
  "Wrong address/phone",
  "Other",
];

/* ══════════════════════════════════════════════════════════════════════════
   POPUP COMPONENTS
   ══════════════════════════════════════════════════════════════════════════ */
const InvoiceDownloadPopup = ({ show, handleClose, shipmentData }) => {
  const [downloading, setDownloading] = useState(false);
  if (!shipmentData) return null;
  const invoiceId = shipmentData?.invoice?.invoiceId;
  const handleDownload = async () => {
    if (!invoiceId) { alert("Invoice not available yet."); return; }
    setDownloading(true);
    try {
      const response = await axios.get(`${INVOICE_BASE_URL}/${invoiceId}`, { withCredentials: true, responseType: "blob" });
      let fileName = "Invoice.pdf";
      const cd = response.headers["content-disposition"];
      if (cd) { const m = cd.match(/filename="(.+)"/); if (m?.[1]) fileName = m[1]; }
      const url  = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url; link.download = fileName;
      document.body.appendChild(link); link.click();
      link.remove(); window.URL.revokeObjectURL(url);
      toast.success("Invoice downloaded!"); handleClose();
    } catch { toast.error("Failed to download invoice"); }
    finally { setDownloading(false); }
  };
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton><Modal.Title>Download Invoice</Modal.Title></Modal.Header>
      <Modal.Body className="text-center">
        <h5>Order: {shipmentData.orderInfo?.orderId}</h5>
        <p className="text-muted">Shipment: {shipmentData.shipmentId}</p>
        <Button variant="primary" className="w-100" onClick={handleDownload} disabled={downloading}>
          {downloading ? <Spinner animation="border" size="sm" /> : <><FaDownload className="me-2" />Download PDF</>}
        </Button>
      </Modal.Body>
    </Modal>
  );
};

const CancelSuccessPopup = ({ show, handleClose, onConfirm, refundMethods }) => (
  <Modal show={show} onHide={handleClose} centered>
    <Modal.Body className="text-center p-4">
      <h5 className="fw-bold mb-3 text-success">Order Cancelled Successfully!</h5>
      <p className="text-muted small mb-3">Refund will be processed within 3–5 business days.</p>
      {refundMethods?.length > 0 && (
        <div className="mb-3">
          <h6 className="fw-semibold">Refund Method:</h6>
          <ul className="list-unstyled mb-0">
            {refundMethods.map((m, i) => <li key={i} className="text-muted">• {m.label} ({m.method})</li>)}
          </ul>
        </div>
      )}
      <Button onClick={() => { handleClose(); onConfirm?.(); }} className="w-100" style={{ backgroundColor: "#4A90E2", border: "none" }}>Okay</Button>
    </Modal.Body>
  </Modal>
);

const CancelOrderPopup = ({ show, handleClose, orderId, paymentMethod, onCancelSuccess }) => {
  const [reason, setReason] = useState("");
  const [otherDetails, setOtherDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason) { setMessage({ type: "danger", text: "Please select a reason." }); return; }
    setLoading(true); setMessage(null);
    try {
      const res = await fetch(CANCEL_ORDER_API, {
        method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include",
        body: JSON.stringify({ orderId, reason: reason === "Other" ? otherDetails : reason, method: paymentMethod?.toLowerCase() || "wallet" }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessage({ type: "success", text: data.message || "Cancelled!" });
        setTimeout(() => { handleClose(); onCancelSuccess?.(data); }, 800);
      } else setMessage({ type: "danger", text: data?.message || "Failed to cancel." });
    } catch { setMessage({ type: "danger", text: "Network error." }); }
    finally { setLoading(false); }
  };
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton><Modal.Title>Cancel Order</Modal.Title></Modal.Header>
      <Modal.Body>
        {message && <Alert variant={message.type}>{message.text}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Reason *</Form.Label>
            <Form.Select required value={reason} onChange={(e) => setReason(e.target.value)}>
              <option value="">Select a reason</option>
              {CANCELLATION_REASONS.map((r, i) => <option key={i} value={r}>{r}</option>)}
            </Form.Select>
          </Form.Group>
          {reason === "Other" && (
            <Form.Group className="mb-3">
              <Form.Label>Other Details</Form.Label>
              <Form.Control as="textarea" rows={3} maxLength={250} value={otherDetails} onChange={(e) => setOtherDetails(e.target.value)} />
              <div className="text-end small text-muted mt-1">{otherDetails.length}/250</div>
            </Form.Group>
          )}
          <Button type="submit" className="w-100" disabled={loading} style={{ backgroundColor: "#1e88e5", border: "none" }}>
            {loading ? <><Spinner animation="border" size="sm" /> Submitting...</> : "Submit"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

const ReturnModal = ({ show, handleClose, shipmentData }) => {
  const [returning, setReturning] = useState(false);
  const [activeProductIdx, setActiveProductIdx] = useState(null);
  const [returnForm, setReturnForm] = useState({ type: "return", reason: "", description: "", images: [], quantity: 1 });
  if (!shipmentData) return null;
  const openReturnForm = (idx) => {
    const product = shipmentData.products[idx];
    setReturnForm({ type: "return", reason: "", description: "", images: [], quantity: 1, maxQuantity: product.qty });
    setActiveProductIdx(idx);
  };
  const handleReturnImages = (files) => {
    if (!files?.length) return;
    if (returnForm.images.length + files.length > 5) return alert("Max 5 images");
    const newImgs = Array.from(files).map((f) => Object.assign(f, { preview: URL.createObjectURL(f) }));
    setReturnForm((p) => ({ ...p, images: [...p.images, ...newImgs] }));
  };
  const removeReturnImage = (i) => setReturnForm((p) => ({ ...p, images: p.images.filter((_, k) => k !== i) }));
  const submitReturn = async () => {
    if (!returnForm.reason) return alert("Please select a reason");
    const rule = RETURN_REASON_RULES[returnForm.reason];
    if (rule?.imagesRequired && returnForm.images.length === 0) return alert("Images required for this reason");
    const product = shipmentData.products[activeProductIdx];
    if (!product) return;
    const productId = product.productId || product._id;
    const variantPayload = product.variant?.sku ? { sku: product.variant.sku } : undefined;
    const body = new FormData();
    body.append("type", returnForm.type);
    body.append("reason", returnForm.reason);
    body.append("reasonDescription", returnForm.description.trim());
    body.append("items", JSON.stringify([{ productId, quantity: returnForm.quantity, ...(variantPayload ? { variant: variantPayload } : {}) }]));
    returnForm.images.forEach((f) => body.append(`images_${productId}`, f));
    setReturning(true);
    try {
      const res = await axios.post(`${RETURN_API}/${shipmentData.shipmentId}`, body, { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } });
      if (res.data?.success) { toast.success(res.data.message || "Request submitted!"); handleClose(); }
      else toast.error(res.data?.message || "Request failed");
    } catch (e) { toast.error(e.response?.data?.message || "Something went wrong"); }
    finally { setReturning(false); }
  };
  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton><Modal.Title>Return / Replace Items</Modal.Title></Modal.Header>
      <Modal.Body style={{ maxHeight: "70vh", overflowY: "auto" }}>
        {shipmentData.products?.map((p, idx) => (
          <Card key={idx} className="mb-2 border shadow-sm">
            <Card.Body className="d-flex align-items-center p-2">
              <img src={p.image} style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 4 }} alt={p.name} />
              <div className="ms-3 flex-grow-1">
                <div className="fw-bold small">{p.name}</div>
                <small className="text-muted">Qty: {p.qty}</small>
              </div>
              {activeProductIdx === idx
                ? <Button variant="secondary" size="sm" onClick={() => setActiveProductIdx(null)}>Cancel</Button>
                : <Button variant="outline-primary" size="sm" onClick={() => openReturnForm(idx)}><FaUndo className="me-1" />Return</Button>}
            </Card.Body>
            {activeProductIdx === idx && (
              <div className="p-3 bg-light border-top">
                <div className="mb-2">
                  <Form.Label>Action Type</Form.Label>
                  <div className="btn-group w-100">
                    <Button variant={returnForm.type === "return" ? "primary" : "outline-primary"} onClick={() => setReturnForm({ ...returnForm, type: "return" })}>Return</Button>
                    <Button variant={returnForm.type === "replace" ? "primary" : "outline-primary"} onClick={() => setReturnForm({ ...returnForm, type: "replace" })}>Replace</Button>
                  </div>
                </div>
                <div className="mb-2">
                  <Form.Label>Quantity</Form.Label>
                  <div className="d-flex align-items-center gap-2">
                    <Button size="sm" variant="outline-secondary" onClick={() => setReturnForm({ ...returnForm, quantity: Math.max(1, returnForm.quantity - 1) })}>-</Button>
                    <span className="fw-bold">{returnForm.quantity}</span>
                    <Button size="sm" variant="outline-secondary" onClick={() => setReturnForm({ ...returnForm, quantity: Math.min(returnForm.maxQuantity, returnForm.quantity + 1) })}>+</Button>
                  </div>
                </div>
                <Form.Group className="mb-2">
                  <Form.Label>Reason <span className="text-danger">*</span></Form.Label>
                  <Form.Select value={returnForm.reason} onChange={(e) => setReturnForm({ ...returnForm, reason: e.target.value })}>
                    <option value="">-- Select Reason --</option>
                    {RETURN_REASON_OPTIONS[returnForm.type].map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Description</Form.Label>
                  <Form.Control as="textarea" rows="2" value={returnForm.description} onChange={(e) => setReturnForm({ ...returnForm, description: e.target.value })} />
                </Form.Group>
                <div className="mb-3">
                  <Form.Label>Images{RETURN_REASON_RULES[returnForm.reason]?.imagesRequired ? " *" : ""}</Form.Label>
                  <div className="border p-3 text-center bg-white" style={{ borderStyle: "dashed", cursor: "pointer" }} onClick={() => document.getElementById("chat-ret-img").click()}>
                    <FaCamera size={24} className="mb-2 text-muted" /><p className="mb-0 small text-muted">Upload Photo</p>
                  </div>
                  <input id="chat-ret-img" type="file" multiple accept="image/*" className="d-none" onChange={(e) => handleReturnImages(e.target.files)} />
                  <div className="d-flex gap-2 mt-2 flex-wrap">
                    {returnForm.images.map((img, i) => (
                      <div key={i} className="position-relative">
                        <img src={img.preview} alt="prev" style={{ width: 60, height: 60, objectFit: "cover" }} className="rounded border" />
                        <button className="btn btn-danger btn-sm position-absolute top-0 end-0 rounded-circle p-0" style={{ width: 20, height: 20 }} onClick={() => removeReturnImage(i)}><FaTrash size={10} /></button>
                      </div>
                    ))}
                  </div>
                </div>
                <Button variant="success" className="w-100"
                  disabled={returning || !returnForm.reason || (RETURN_REASON_RULES[returnForm.reason]?.imagesRequired && returnForm.images.length === 0)}
                  onClick={submitReturn}>
                  {returning ? "Submitting..." : `Submit ${returnForm.type}`}
                </Button>
              </div>
            )}
          </Card>
        ))}
      </Modal.Body>
    </Modal>
  );
};

/* ─── TRACKING CARD ──────────────────────────────────────────────────────── */
const ProfessionalTrackingCard = ({ shipmentData }) => {
  if (!shipmentData) return null;
  const { shipmentId, orderInfo, shipmentStatus, courier, trackingTimeline, products, expectedDelivery } = shipmentData;
  const getStatusColor = (s) => {
    s = s?.toLowerCase() || "";
    if (s.includes("delivered")) return "success";
    if (s.includes("cancelled") || s.includes("failed") || s.includes("rto")) return "danger";
    if (s.includes("shipped") || s.includes("transit") || s.includes("out for delivery")) return "primary";
    if (s.includes("confirmed") || s.includes("processing")) return "warning";
    return "secondary";
  };
  const getStatusIcon = (s) => {
    s = s?.toLowerCase() || "";
    if (s.includes("delivered")) return <FaCheckCircle />;
    if (s.includes("shipped") || s.includes("transit")) return <FaTruck />;
    if (s.includes("cancelled") || s.includes("rto")) return <FaTimesCircle />;
    if (s.includes("out for delivery")) return <FaShippingFast />;
    if (s.includes("confirmed")) return <FaBox />;
    return <FaClock />;
  };
  const recentTimeline = (trackingTimeline || []).slice().reverse().slice(0, 3);
  return (
    <div className="pro-track-card-wrapper mb-2">
      <Card className="pro-track-card shadow-sm border-0">
        <Card.Header className="d-flex justify-content-between align-items-center py-3 border-bottom">
          <div>
            <h6 className="m-0 fw-bold text-dark"><FaBox className="text-primary me-2" />Shipment: {shipmentId}</h6>
            <small className="text-muted">Order: {orderInfo?.orderId} • {formatDate(orderInfo?.orderDate)}</small>
          </div>
          <Badge bg={getStatusColor(shipmentStatus)} className="px-3 py-2 rounded-pill">
            <span className="me-1 align-middle">{getStatusIcon(shipmentStatus)}</span>
            <span className="fw-bold align-middle">{shipmentStatus?.toUpperCase()}</span>
          </Badge>
        </Card.Header>
        <Card.Body className="p-3">
          <div className="pro-info-grid mb-3">
            <div className="pro-info-item">
              <small className="text-muted d-block mb-1">Expected Delivery</small>
              <span className="fw-bold text-dark fs-6">{expectedDelivery ? formatDate(expectedDelivery) : "TBD"}</span>
            </div>
            <div className="pro-info-item border-start">
              <small className="text-muted d-block mb-1">Courier Partner</small>
              <span className="fw-bold text-dark">{courier?.name || "Assigning..."}</span>
            </div>
            {courier?.awb && (
              <div className="pro-info-item border-start">
                <small className="text-muted d-block mb-1">AWB</small>
                <span className="fw-bold text-primary">{courier.awb}</span>
              </div>
            )}
          </div>
          <div className="pro-timeline-list">
            {recentTimeline.length > 0 ? recentTimeline.map((evt, idx) => (
              <div key={idx} className="pro-timeline-item">
                <div className="pro-timeline-marker bg-primary"></div>
                <div className="pro-timeline-content">
                  <div className="d-flex justify-content-between">
                    <span className="fw-bold small text-capitalize text-dark">{evt.status.replace(/_/g, " ")}</span>
                    <span className="text-muted" style={{ fontSize: 11 }}>{formatTime(evt.timestamp)}, {formatDate(evt.timestamp)}</span>
                  </div>
                  <small className="text-muted d-block mt-1">{evt.description || evt.courierStatus}</small>
                  {evt.location && <small className="text-primary mt-1 d-flex align-items-center gap-1"><FaMapMarkerAlt size={10} /> {evt.location}</small>}
                </div>
              </div>
            )) : <div className="text-center text-muted py-2 small">No updates yet.</div>}
          </div>
        </Card.Body>
      </Card>
      <div className="pro-product-mini-list mt-2">
        <small className="text-muted fw-bold mb-1 d-block">{products?.length} Item(s)</small>
        <div className="bg-white border rounded p-2 shadow-sm">
          {products?.slice(0, 2).map((p, i) => (
            <div key={i} className="d-flex align-items-center mb-2">
              <img src={p.image} alt={p.name} className="pro-prod-img" />
              <div className="ms-2 flex-grow-1">
                <div className="fw-bold small text-truncate" style={{ maxWidth: 180 }}>{p.name}</div>
                <small className="text-muted">Qty: {p.qty}</small>
              </div>
              <div className="fw-bold small text-dark">₹{formatCurrency(p.sellingPrice * p.qty)}</div>
            </div>
          ))}
          {products?.length > 2 && <div className="text-center text-primary small fw-bold mt-1">+{products.length - 2} more items</div>}
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════════════
   CHAT PRODUCT CARD
   ══════════════════════════════════════════════════════════════════════════ */
const ChatProductCard = ({ prod, selectedVariants, setSelectedVariants, addingToCart, handleAddToCart }) => {
  const [showOverlay, setShowOverlay] = useState(false);
  const [variantType, setVariantType] = useState("all");

  const vars       = Array.isArray(prod.variants) ? prod.variants : [];
  const hasVar     = vars.length > 0;
  const displayVar = selectedVariants[prod._id] || (hasVar ? (vars.find((v) => (v.stock ?? 0) > 0) || vars[0]) : null);
  const grouped    = groupVariantsByType(vars);
  const img        = displayVar?.images?.[0] || displayVar?.image || prod.images?.[0] || "/placeholder.png";
  const isAdding   = addingToCart[prod._id];
  const oos        = hasVar ? (displayVar?.stock ?? 0) <= 0 : (prod.stock ?? 0) <= 0;
  const isVarSel   = !!selectedVariants[prod._id];

  const price = displayVar?.displayPrice || displayVar?.discountedPrice || prod.price || 0;
  const orig  = displayVar?.originalPrice || displayVar?.mrp || prod.mrp || price;
  const disc  = orig > price;
  const pct   = disc ? Math.round(((orig - price) / orig) * 100) : 0;

  let btnText = "Add to Cart";
  if (isAdding) btnText = "Adding...";
  else if (hasVar && !isVarSel) btnText = "Select Variant";
  else if (oos) btnText = "Out of Stock";

  const disabled = isAdding || (isVarSel && oos) || (!hasVar && oos);

  const handleVariantSelect = (v) => {
    if ((v.stock ?? 0) <= 0) return;
    setSelectedVariants((p) => ({ ...p, [prod._id]: v }));
    setShowOverlay(false);
  };

  return (
    <div style={{
      width: "100%", background: "#fff", borderRadius: 14, border: "1px solid #f0f0f0",
      padding: 10, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", display: "flex",
      flexDirection: "column", height: "100%", boxSizing: "border-box",
    }}>
      {/* Image */}
      <div style={{ position: "relative" }}>
        <img src={img} alt={prod.name} style={{ width: "100%", height: 155, objectFit: "contain", borderRadius: 10, background: "#fafafa" }} />
        {disc && (
          <span style={{ position: "absolute", top: 6, left: 6, background: "#e53e3e", color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 20 }}>
            {pct}% OFF
          </span>
        )}
        {oos && (
          <span style={{ position: "absolute", top: 6, right: 6, background: "rgba(0,0,0,0.55)", color: "#fff", fontSize: 9, fontWeight: 600, padding: "2px 6px", borderRadius: 20 }}>
            Out of Stock
          </span>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: "8px 2px 0", display: "flex", flexDirection: "column", flex: 1 }}>
        <div style={{ fontSize: 10, color: "#bbb", fontWeight: 600, marginBottom: 2, textTransform: "uppercase", letterSpacing: "0.4px" }}>{getBrandName(prod)}</div>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#1a1a1a", lineHeight: "1.35", marginBottom: 6, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", flex: 1 }}>
          {prod.name}
        </div>

        {/* Variant Pill */}
        {hasVar && (
          <div onClick={() => setShowOverlay(true)} style={{ fontSize: 10, color: "#444", cursor: "pointer", marginBottom: 6, display: "inline-flex", alignItems: "center", gap: 4, background: "#f5f5f5", padding: "3px 9px", borderRadius: 20, width: "fit-content", border: "1px solid #eee" }}>
            {isVarSel ? (
              <>
                {displayVar?.hex && isValidHexColor(displayVar.hex) && (
                  <span style={{ width: 10, height: 10, borderRadius: "50%", background: displayVar.hex, border: "1px solid #ccc", display: "inline-block", flexShrink: 0 }} />
                )}
                <span style={{ color: "#111", fontWeight: 700, maxWidth: 80, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{getVariantDisplayText(displayVar)}</span>
              </>
            ) : (
              <span>{vars.length} Variants available</span>
            )}
            <FaChevronDown style={{ fontSize: 8, flexShrink: 0 }} />
          </div>
        )}

        {/* Price */}
        <div style={{ marginBottom: 8 }}>
          <span style={{ fontSize: 15, fontWeight: 800, color: "#111" }}>₹{price}</span>
          {disc && <span style={{ textDecoration: "line-through", color: "#ccc", fontSize: 11, marginLeft: 5 }}>₹{orig}</span>}
        </div>

        {/* Cart Button */}
        <button
          onClick={(e) => { e.stopPropagation(); if (hasVar && !isVarSel) setShowOverlay(true); else handleAddToCart(prod); }}
          disabled={disabled}
          style={{
            width: "100%", padding: "8px 0", borderRadius: 9,
            border: `1.5px solid ${oos && isVarSel ? "#ddd" : "#111"}`,
            background: isAdding ? "#111" : (oos && isVarSel) ? "#f7f7f7" : "#fff",
            color: isAdding ? "#fff" : (oos && isVarSel) ? "#bbb" : "#111",
            fontWeight: 700, fontSize: 11, cursor: disabled ? "not-allowed" : "pointer",
            transition: "all .2s", marginTop: "auto",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
          }}
        >
          {isAdding ? (
            <>
              <span style={{ width: 10, height: 10, border: "2px solid #fff", borderTop: "2px solid transparent", borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block" }} />
              Adding...
            </>
          ) : btnText}
        </button>
      </div>

      {/* Variant Overlay */}
      {showOverlay && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 99999, display: "flex", alignItems: "flex-end", justifyContent: "center" }} onClick={() => setShowOverlay(false)}>
          <div style={{ background: "#fff", borderTopLeftRadius: 20, borderTopRightRadius: 20, width: "100%", maxWidth: 480, maxHeight: "78vh", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 -6px 30px rgba(0,0,0,0.18)" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 0" }}>
              <div style={{ width: 36, height: 4, background: "#e0e0e0", borderRadius: 2 }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderBottom: "1px solid #f0f0f0" }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>Select Variant</div>
                <div style={{ fontSize: 11, color: "#aaa" }}>{vars.length} options</div>
              </div>
              <button onClick={() => setShowOverlay(false)} style={{ background: "#f5f5f5", border: "none", borderRadius: "50%", width: 30, height: 30, cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
            </div>
            {grouped.color.length > 0 && grouped.text.length > 0 && (
              <div style={{ display: "flex", borderBottom: "1px solid #f0f0f0" }}>
                {[["all", `All (${vars.length})`], ["color", `Colors (${grouped.color.length})`], ["text", `Sizes (${grouped.text.length})`]].map(([key, label]) => (
                  <button key={key} onClick={() => setVariantType(key)} style={{ flex: 1, padding: "9px 0", background: "none", border: "none", borderBottom: variantType === key ? "2.5px solid #111" : "2.5px solid transparent", fontWeight: variantType === key ? 700 : 400, fontSize: 12, cursor: "pointer" }}>
                    {label}
                  </button>
                ))}
              </div>
            )}
            <div style={{ overflowY: "auto", padding: "14px 16px", flex: 1 }}>
              {(variantType === "all" || variantType === "color") && grouped.color.length > 0 && (
                <>
                  {grouped.color.length > 0 && grouped.text.length > 0 && <div style={{ fontSize: 10, fontWeight: 700, color: "#aaa", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>Colors</div>}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
                    {grouped.color.map((v) => {
                      const sel = selectedVariants[prod._id] && getSku(selectedVariants[prod._id]) === getSku(v);
                      const oosV = (v.stock ?? 0) <= 0;
                      return (
                        <div key={getSku(v)} style={{ textAlign: "center", cursor: oosV ? "not-allowed" : "pointer", opacity: oosV ? 0.45 : 1 }} onClick={() => handleVariantSelect(v)}>
                          <div style={{ width: 36, height: 36, borderRadius: "22%", background: v.hex || "#ccc", margin: "0 auto 5px", border: sel ? "3px solid #111" : "1.5px solid #ddd", position: "relative", boxShadow: sel ? "0 0 0 2px #fff, 0 0 0 4px #111" : "none" }}>
                            {sel && <span style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", color: "#fff", fontWeight: "bold", fontSize: 14 }}>✓</span>}
                          </div>
                          <div style={{ fontSize: 9, maxWidth: 52, wordBreak: "break-word", lineHeight: "1.2" }}>{getVariantDisplayText(v)}</div>
                          {oosV && <div style={{ fontSize: 9, color: "#e53e3e" }}>OOS</div>}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
              {(variantType === "all" || variantType === "text") && grouped.text.length > 0 && (
                <>
                  {grouped.color.length > 0 && grouped.text.length > 0 && <div style={{ fontSize: 10, fontWeight: 700, color: "#aaa", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>Sizes</div>}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                    {grouped.text.map((v) => {
                      const sel = selectedVariants[prod._id] && getSku(selectedVariants[prod._id]) === getSku(v);
                      const oosV = (v.stock ?? 0) <= 0;
                      return (
                        <div key={getSku(v)} style={{ cursor: oosV ? "not-allowed" : "pointer", opacity: oosV ? 0.45 : 1 }} onClick={() => handleVariantSelect(v)}>
                          <div style={{ padding: "8px 4px", borderRadius: 8, textAlign: "center", fontSize: 11, fontWeight: sel ? 700 : 400, border: sel ? "2.5px solid #111" : "1.5px solid #ddd", background: sel ? "#111" : "#fff", color: sel ? "#fff" : "#333" }}>
                            {getVariantDisplayText(v)}
                          </div>
                          {oosV && <div style={{ fontSize: 9, color: "#e53e3e", textAlign: "center", marginTop: 2 }}>Out of Stock</div>}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════════════
   CATEGORY SELECTION SCREEN
   ══════════════════════════════════════════════════════════════════════════ */
const CategoryScreen = ({ trendingCategories, categoriesLoading, onSelectCategory, onSelectAll }) => (
  <div style={{ padding: "4px 0" }}>
    {/* Header */}
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: "#111", marginBottom: 2 }}>
        🛍️ Shop by Category
      </div>
      <div style={{ fontSize: 11, color: "#aaa" }}>Select a category to browse products</div>
    </div>

    {/* All Products button */}
    <button
      onClick={onSelectAll}
      style={{
        width: "100%", padding: "12px 16px", borderRadius: 12, border: "2px solid #111",
        background: "#111", color: "#fff", fontWeight: 700, fontSize: 13,
        cursor: "pointer", marginBottom: 10, display: "flex", alignItems: "center", gap: 10,
        transition: "all .2s",
      }}
    >
      <FaShoppingBag size={16} />
      <span>All Products</span>
      <span style={{ marginLeft: "auto", fontSize: 12, opacity: 0.7 }}>Browse everything →</span>
    </button>

    {/* Category Grid */}
    {categoriesLoading ? (
      <div style={{ textAlign: "center", padding: "24px 0", color: "#aaa" }}>
        <div style={{ width: 28, height: 28, border: "3px solid #eee", borderTop: "3px solid #111", borderRadius: "50%", animation: "spin 0.7s linear infinite", margin: "0 auto 8px" }} />
        <div style={{ fontSize: 12 }}>Loading categories...</div>
      </div>
    ) : trendingCategories.length === 0 ? (
      <div style={{ textAlign: "center", padding: "20px 0", color: "#ccc", fontSize: 12 }}>No categories available</div>
    ) : (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {trendingCategories.map((cat) => (
          <button
            key={cat.slug || cat._id}
            onClick={() => onSelectCategory(cat)}
            style={{
              padding: "12px 10px", borderRadius: 12, border: "1.5px solid #f0f0f0",
              background: "#fff", cursor: "pointer", textAlign: "left",
              transition: "all .18s", boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              display: "flex", flexDirection: "column", gap: 6,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#111"; e.currentTarget.style.background = "#fafafa"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#f0f0f0"; e.currentTarget.style.background = "#fff"; }}
          >
            {/* Category image or emoji */}
            {cat.image ? (
              <img
                src={cat.image}
                alt={cat.name}
                style={{ width: "100%", height: 70, objectFit: "cover", borderRadius: 8, background: "#f5f5f5" }}
                onError={(e) => { e.target.style.display = "none"; }}
              />
            ) : (
              <div style={{ width: "100%", height: 70, borderRadius: 8, background: "linear-gradient(135deg,#f8f9fa,#e9ecef)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>
                {getCategoryEmoji(cat.name)}
              </div>
            )}
            <div style={{ fontSize: 12, fontWeight: 700, color: "#1a1a1a", lineHeight: "1.3", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
              {cat.name}
            </div>
            {cat.productCount > 0 && (
              <div style={{ fontSize: 10, color: "#aaa" }}>{cat.productCount} products</div>
            )}
          </button>
        ))}
      </div>
    )}
  </div>
);

/* ══════════════════════════════════════════════════════════════════════════
   MAIN CHATBOT
   ══════════════════════════════════════════════════════════════════════════ */
const Chatbot = ({ onAddToCart }) => {
  const [open, setOpen]         = useState(false);
  const [messages, setMessages] = useState([]);
  const [stage, setStage]       = useState("main");
  const [loading, setLoading]   = useState(false);

  /* ── product states ── */
  const [products, setProducts]                     = useState([]);
  const [trendingCategories, setTrendingCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading]   = useState(false);
  /* "categories" sub-stage: "select" | "products" */
  const [productSubStage, setProductSubStage]       = useState("select");
  const [activeCategory, setActiveCategory]         = useState(null);
  const [selectedVariants, setSelectedVariants]     = useState({});
  const [addingToCart, setAddingToCart]             = useState({});
  const [productLoading, setProductLoading]         = useState(false);
  const [loadingMore, setLoadingMore]               = useState(false);
  const [hasMore, setHasMore]                       = useState(false);
  const [nextCursor, setNextCursor]                 = useState(null);

  /* ── tracking ── */
  const [trackingStage, setTrackingStage] = useState("check-auth");
  const [email, setEmail]                 = useState("");
  const [password, setPassword]           = useState("");
  const [shipmentId, setShipmentId]       = useState("");
  const [trackingData, setTrackingData]   = useState(null);
  const [isLoggedIn, setIsLoggedIn]       = useState(false);

  /* ── invoice ── */
  const [invoiceStage, setInvoiceStage]             = useState("check-auth");
  const [invoiceShipmentId, setInvoiceShipmentId]   = useState("");
  const [invoiceData, setInvoiceData]               = useState(null);
  const [showInvoicePopup, setShowInvoicePopup]     = useState(false);

  /* ── cancel ── */
  const [cancellationStage, setCancellationStage]   = useState("check-auth");
  const [orderIdToCancel, setOrderIdToCancel]       = useState("");
  const [showCancelPopup, setShowCancelPopup]       = useState(false);
  const [showSuccessPopup, setShowSuccessPopup]     = useState(false);
  const [selectedOrderForCancel, setSelectedOrderForCancel] = useState(null);
  const [refundMethods, setRefundMethods]           = useState([]);

  /* ── return ── */
  const [returnStage, setReturnStage]               = useState("check-auth");
  const [returnShipmentId, setReturnShipmentId]     = useState("");
  const [returnShipmentData, setReturnShipmentData] = useState(null);
  const [showReturnPopup, setShowReturnPopup]       = useState(false);

  /* ── gemini ── */
  const [geminiStage, setGeminiStage]   = useState(null);
  const [userQuestion, setUserQuestion] = useState("");
  const [aiThinking, setAiThinking]     = useState(false);

  const messagesRef = useRef();
  const { addToCart } = useContext(CartContext);

  const scroll = () => messagesRef.current?.scrollTo({ top: 999999, behavior: "smooth" });
  useEffect(() => scroll(), [messages, products, productSubStage]);
  useEffect(() => { if (open) checkAuthentication(); }, [open]);

  const checkAuthentication = async () => {
    try { await axios.get(PROFILE_API, { withCredentials: true }); setIsLoggedIn(true); }
    catch { setIsLoggedIn(false); }
  };

  const handleOpen = () => { setOpen(true); if (!messages.length) greet(); };
  const handleClose = () => { setOpen(false); resetAll(); };
  const greet = () => setMessages([{ from: "bot", text: "Hi! 👋 What can I help you with today?" }]);

  /* ── resets ── */
  const resetAll = () => {
    resetTrackingFlow(); resetCancellationFlow(); resetInvoiceFlow(); resetReturnFlow(); resetGeminiFlow();
    setProducts([]); setTrendingCategories([]); setActiveCategory(null);
    setProductSubStage("select"); setSelectedVariants({}); setAddingToCart({});
    setHasMore(false); setNextCursor(null);
  };
  const resetTrackingFlow     = () => { setTrackingStage("check-auth"); setEmail(""); setPassword(""); setShipmentId(""); setTrackingData(null); };
  const resetCancellationFlow = () => { setCancellationStage("check-auth"); setOrderIdToCancel(""); setSelectedOrderForCancel(null); setShowCancelPopup(false); setShowSuccessPopup(false); setRefundMethods([]); };
  const resetInvoiceFlow      = () => { setInvoiceStage("check-auth"); setInvoiceShipmentId(""); setInvoiceData(null); setShowInvoicePopup(false); };
  const resetReturnFlow       = () => { setReturnStage("check-auth"); setReturnShipmentId(""); setReturnShipmentData(null); setShowReturnPopup(false); };
  const resetGeminiFlow       = () => { setGeminiStage(null); setUserQuestion(""); setAiThinking(false); };

  /* ══════════════════════════════════════════════════════════════════════
     FETCH CATEGORIES (light call, no products)
     ══════════════════════════════════════════════════════════════════════ */
  const fetchCategories = useCallback(async () => {
    setCategoriesLoading(true);
    try {
      const { data } = await axios.get(`${PRODUCT_ALL_API}?limit=1`, { withCredentials: true });
      if (data.trendingCategories?.length) setTrendingCategories(data.trendingCategories);
    } catch (e) {
      console.error("fetchCategories error:", e);
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  /* ══════════════════════════════════════════════════════════════════════
     FETCH PRODUCTS
     ══════════════════════════════════════════════════════════════════════ */
  const fetchProductsForChat = useCallback(async (categorySlug = null, cursor = null, reset = false) => {
    try {
      if (reset) { setProductLoading(true); setProducts([]); setNextCursor(null); setHasMore(false); }
      else setLoadingMore(true);

      const params = new URLSearchParams();
      if (categorySlug) params.append("categoryIds", categorySlug);
      if (cursor) params.append("cursor", cursor);
      params.append("limit", "12");

      const { data } = await axios.get(`${PRODUCT_ALL_API}?${params.toString()}`, { withCredentials: true });

      /* save categories if not yet loaded */
      if (data.trendingCategories?.length && trendingCategories.length === 0) {
        setTrendingCategories(data.trendingCategories);
      }

      const prods = data.products || [];
      const pg    = data.pagination || {};

      setSelectedVariants((prev) => {
        const next = { ...prev };
        prods.forEach((prod) => {
          if (next[prod._id]) return;
          const vars = Array.isArray(prod.variants) ? prod.variants : [];
          if (vars.length > 0) next[prod._id] = vars.find((v) => (v.stock ?? 0) > 0) || vars[0];
        });
        return next;
      });

      if (reset) setProducts(prods);
      else       setProducts((prev) => [...prev, ...prods]);

      setHasMore(pg.hasMore || false);
      setNextCursor(pg.nextCursor || null);
    } catch (e) {
      console.error(e);
      toast.error("Failed to fetch products");
    } finally {
      setProductLoading(false);
      setLoadingMore(false);
    }
  }, [trendingCategories.length]);

  /* ── Category selected → go to products view ── */
  const handleSelectCategory = useCallback((cat) => {
    setActiveCategory(cat);
    setProductSubStage("products");
    setMessages((prev) => [...prev,
      { from: "user", text: `${getCategoryEmoji(cat.name)} ${cat.name}` },
      { from: "bot",  text: `Showing products in **${cat.name}** 🛍️` },
    ]);
    fetchProductsForChat(cat.slug, null, true);
  }, [fetchProductsForChat]);

  /* ── All Products ── */
  const handleSelectAllProducts = useCallback(() => {
    setActiveCategory(null);
    setProductSubStage("products");
    setMessages((prev) => [...prev,
      { from: "user", text: "All Products" },
      { from: "bot",  text: "Showing all products 🛍️" },
    ]);
    fetchProductsForChat(null, null, true);
  }, [fetchProductsForChat]);

  /* ── Back to category selection ── */
  const handleBackToCategories = useCallback(() => {
    setProductSubStage("select");
    setActiveCategory(null);
    setProducts([]);
    setHasMore(false);
    setNextCursor(null);
  }, []);

  /* ── enter products stage ── */
  const enterProductsStage = useCallback(() => {
    setStage("products");
    setProductSubStage("select");
    setProducts([]);
    setActiveCategory(null);
    fetchCategories();
  }, [fetchCategories]);

  /* ══════════════════════════════════════════════════════════════════════
     ADD TO CART
     ══════════════════════════════════════════════════════════════════════ */
  const handleAddToCart = async (prod) => {
    setAddingToCart((prev) => ({ ...prev, [prod._id]: true }));
    try {
      const vars   = Array.isArray(prod.variants) ? prod.variants : [];
      const hasVar = vars.length > 0;
      let payload;
      if (hasVar) {
        const sel = selectedVariants[prod._id];
        if (!sel || (sel.stock ?? 0) <= 0) { toast.error("Please select an in-stock variant."); return; }
        payload = { productId: prod._id, variants: [{ variantSku: getSku(sel), quantity: 1 }] };
      } else {
        if ((prod.stock ?? 0) <= 0) { toast.error("Product is out of stock."); return; }
        payload = { productId: prod._id, quantity: 1 };
      }
      const { data } = await axios.post(`${CART_API_BASE}/add`, payload, { withCredentials: true });
      if (!data.success) throw new Error(data.message || "Cart add failed");
      toast.success("Added to cart! 🛒");
      onAddToCart?.();
    } catch (e) {
      if (e.response?.status === 401) toast.error("Please login to add to cart");
      else toast.error(e.response?.data?.message || e.message || "Failed to add to cart");
    } finally {
      setAddingToCart((prev) => ({ ...prev, [prod._id]: false }));
    }
  };

  /* ══════════════════════════════════════════════════════════════════════
     MENU / ORDER / AI
     ══════════════════════════════════════════════════════════════════════ */
  const pickMain = (key, label) => {
    setMessages((prev) => [...prev, { from: "user", text: label }]);
    if (key === "products") {
      setMessages((prev) => [...prev, { from: "bot", text: "Choose a category or browse all products 👇" }]);
      enterProductsStage();
    } else if (key === "orders") {
      setMessages((prev) => [...prev, { from: "bot", text: "Select what you need help with:" }]);
      setStage("orders");
    } else if (key === "support") {
      setMessages((prev) => [...prev, { from: "bot", text: "📧 support@joyory.in\n📞 1800-XXX-XXXX\n⏰ Mon-Sat 9 AM – 6 PM" }]);
    } else if (key === "ask-ai") {
      handleAskAI();
    }
  };

  const pickOrderOption = (option) => {
    setMessages((prev) => [...prev, { from: "user", text: option.label }]);
    if (option.key === "track")        startOrderTracking();
    else if (option.key === "cancel")  startOrderCancellation();
    else if (option.key === "invoice") startInvoiceDownload();
    else if (option.key === "return")  startReturnFlow();
    else { setMessages((prev) => [...prev, { from: "bot", text: "Our support team will contact you within 24 hours." }]); setStage("main"); }
  };

  const handleAskAI = () => {
    setMessages((prev) => [...prev, { from: "bot", text: "🤖 Ask me anything about beauty, products, or tips!\n\nType your question:" }]);
    setGeminiStage("waiting-question");
    setStage("gemini-ai");
  };
  const handleGeminiQuestion = async () => {
    if (!userQuestion.trim()) { toast.error("Please type your question first"); return; }
    setMessages((prev) => [...prev, { from: "user", text: userQuestion }]);
    setAiThinking(true);
    try {
      const result = await model.generateContent(userQuestion);
      const response = await result.response;
      setMessages((prev) => [...prev, { from: "bot", text: response.text() + "\n\n💡 Ask more or go back to main menu." }]);
    } catch { setMessages((prev) => [...prev, { from: "bot", text: "Sorry, AI is unavailable. Please try again." }]); }
    finally { setAiThinking(false); setUserQuestion(""); setGeminiStage("response-received"); }
  };

  const fetchShipmentData = async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(`${SHIPMENT_API}/${id}`, { withCredentials: true });
      if (response.data?.success) return { success: true, data: response.data };
      throw new Error("Failed");
    } catch (error) {
      let msg = "❌ Unable to fetch details. ";
      if (error.response?.status === 401) { msg += "Session expired."; setIsLoggedIn(false); }
      else if (error.response?.status === 404) msg += "Not found.";
      else msg += error.response?.data?.message || error.message;
      return { success: false, error: msg };
    } finally { setLoading(false); }
  };

  const startOrderTracking = () => {
    resetTrackingFlow();
    if (isLoggedIn) { setMessages((prev) => [...prev, { from: "bot", text: "✅ Logged in!\n\nEnter your Shipment ID to track:" }]); setTrackingStage("order-id"); }
    else { setMessages((prev) => [...prev, { from: "bot", text: "🔐 Enter your Email Address:" }]); setTrackingStage("login-email"); }
    setStage("orders");
  };
  const handleEmailSubmit = (targetStage) => {
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) { toast.error("Please enter a valid email"); return; }
    setMessages((prev) => [...prev, { from: "user", text: email }, { from: "bot", text: "Enter your Password:" }]);
    if (targetStage === "tracking") setTrackingStage("login-password");
    else if (targetStage === "invoice") setInvoiceStage("login-password");
    else if (targetStage === "return") setReturnStage("login-password");
    else if (targetStage === "cancel") setCancellationStage("login-password");
  };
  const handleLogin = async (targetStage) => {
    if (!password) { toast.error("Enter password"); return; }
    setMessages((prev) => [...prev, { from: "user", text: "********" }]);
    try {
      setLoading(true);
      const res = await axios.post(LOGIN_API, { email: email.trim().toLowerCase(), password }, { withCredentials: true });
      if (res.status === 200 && res.data?.user) {
        setIsLoggedIn(true);
        setMessages((prev) => [...prev, { from: "bot", text: `✅ Welcome back, ${res.data.user.name || "User"}!` }]);
        if (targetStage === "tracking") { setMessages((prev) => [...prev, { from: "bot", text: "Enter Shipment ID to track:" }]); setTrackingStage("order-id"); }
        else if (targetStage === "invoice") { setMessages((prev) => [...prev, { from: "bot", text: "Enter Shipment ID for invoice:" }]); setInvoiceStage("shipment"); }
        else if (targetStage === "return") { setMessages((prev) => [...prev, { from: "bot", text: "Enter Shipment ID to return:" }]); setReturnStage("shipment-id"); }
        else if (targetStage === "cancel") { setMessages((prev) => [...prev, { from: "bot", text: "Enter Order ID to cancel:" }]); setCancellationStage("order-id"); }
      } else toast.error(res.data?.message || "Login failed");
    } catch (err) { toast.error(err.response?.data?.message || "Server error"); }
    finally { setLoading(false); }
  };
  const handleShipmentSubmit = async () => {
    if (!shipmentId.trim()) { toast.error("Enter Shipment ID"); return; }
    setMessages((prev) => [...prev, { from: "user", text: shipmentId }, { from: "bot", text: "🔍 Tracking..." }]);
    const result = await fetchShipmentData(shipmentId);
    if (result.success) {
      setTrackingData(result.data); setTrackingStage("result");
      setMessages((prev) => [...prev, { from: "bot", text: "Here are your shipment details:", data: { trackingCard: true, shipment: result.data } }]);
    } else setMessages((prev) => [...prev, { from: "bot", text: result.error }]);
  };
  const startInvoiceDownload = () => {
    resetInvoiceFlow();
    if (isLoggedIn) { setMessages((prev) => [...prev, { from: "bot", text: "Enter Shipment ID for invoice:" }]); setInvoiceStage("shipment"); }
    else { setMessages((prev) => [...prev, { from: "bot", text: "Please login. Enter Email:" }]); setInvoiceStage("login-email"); }
    setStage("invoice");
  };
  const handleInvoiceShipmentSubmit = async () => {
    if (!invoiceShipmentId.trim()) { toast.error("Enter Shipment ID"); return; }
    setLoading(true);
    const result = await fetchShipmentData(invoiceShipmentId);
    if (result.success) { setInvoiceData(result.data); setShowInvoicePopup(true); setMessages((prev) => [...prev, { from: "bot", text: `✅ Invoice ready for ${invoiceShipmentId}.` }]); }
    else setMessages((prev) => [...prev, { from: "bot", text: result.error }]);
  };
  const startOrderCancellation = () => {
    resetCancellationFlow();
    if (isLoggedIn) { setMessages((prev) => [...prev, { from: "bot", text: "Enter Order ID to cancel:" }]); setCancellationStage("order-id"); }
    else { setMessages((prev) => [...prev, { from: "bot", text: "Please login. Enter Email:" }]); setCancellationStage("login-email"); }
    setStage("cancellation");
  };
  const handleOrderIdSubmit = () => {
    if (!orderIdToCancel.trim()) return;
    setSelectedOrderForCancel({ _id: orderIdToCancel, paymentMethod: "Online" });
    setShowCancelPopup(true);
  };
  const handleCancelSuccess = (data) => {
    setRefundMethods(data.refundMethodsAvailable || []);
    setShowCancelPopup(false); setShowSuccessPopup(true);
    setMessages((prev) => [...prev, { from: "bot", text: "✅ Order cancelled successfully!" }]);
  };
  const startReturnFlow = () => {
    resetReturnFlow();
    if (isLoggedIn) { setMessages((prev) => [...prev, { from: "bot", text: "Enter Shipment ID to process a return:" }]); setReturnStage("shipment-id"); }
    else { setMessages((prev) => [...prev, { from: "bot", text: "Please login. Enter Email:" }]); setReturnStage("login-email"); }
    setStage("return");
  };
  const handleReturnShipmentSubmit = async () => {
    if (!returnShipmentId.trim()) { toast.error("Enter Shipment ID"); return; }
    setMessages((prev) => [...prev, { from: "user", text: returnShipmentId }]);
    setLoading(true);
    const result = await fetchShipmentData(returnShipmentId);
    if (result.success) { setReturnShipmentData(result.data); setShowReturnPopup(true); setMessages((prev) => [...prev, { from: "bot", text: "🔍 Shipment found. Select an item to return." }]); }
    else setMessages((prev) => [...prev, { from: "bot", text: result.error }]);
  };

  /* ── INPUT RENDERERS ── */
  const renderTrackingInputs = () => {
    if (trackingStage === "login-email") return (<div className="input-area"><input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="order-input" autoFocus /><button onClick={() => handleEmailSubmit("tracking")} className="send-btn" disabled={loading || !email}>Next</button></div>);
    if (trackingStage === "login-password") return (<div className="input-area"><input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="order-input" autoFocus onKeyPress={(e) => e.key === "Enter" && handleLogin("tracking")} /><button onClick={() => handleLogin("tracking")} className="send-btn" disabled={loading || !password}>{loading ? "..." : "Login"}</button></div>);
    if (trackingStage === "order-id") return (<div className="input-area"><input type="text" placeholder="Shipment ID (e.g. SHP123)" value={shipmentId} onChange={(e) => setShipmentId(e.target.value)} className="order-input" autoFocus onKeyPress={(e) => e.key === "Enter" && handleShipmentSubmit()} /><button onClick={handleShipmentSubmit} className="send-btn" disabled={loading || !shipmentId}>Track</button></div>);
    return null;
  };
  const renderReturnInputs = () => {
    if (returnStage === "login-email") return (<div className="input-area"><input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="order-input" autoFocus /><button onClick={() => handleEmailSubmit("return")} className="send-btn" disabled={loading || !email}>Next</button></div>);
    if (returnStage === "login-password") return (<div className="input-area"><input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="order-input" autoFocus onKeyPress={(e) => e.key === "Enter" && handleLogin("return")} /><button onClick={() => handleLogin("return")} className="send-btn" disabled={loading || !password}>{loading ? "..." : "Login"}</button></div>);
    if (returnStage === "shipment-id") return (<div className="input-area"><input type="text" placeholder="Shipment ID" value={returnShipmentId} onChange={(e) => setReturnShipmentId(e.target.value)} className="order-input" autoFocus onKeyPress={(e) => e.key === "Enter" && handleReturnShipmentSubmit()} /><button onClick={handleReturnShipmentSubmit} className="send-btn" disabled={loading || !returnShipmentId}>Next</button></div>);
    return null;
  };
  const renderGeminiInputs = () => {
    if (geminiStage === "waiting-question") return (<div className="input-area"><input type="text" placeholder="Type your question..." value={userQuestion} onChange={(e) => setUserQuestion(e.target.value)} className="order-input" autoFocus onKeyPress={(e) => e.key === "Enter" && handleGeminiQuestion()} /><button onClick={handleGeminiQuestion} className="send-btn" disabled={aiThinking || !userQuestion.trim()}>Ask</button></div>);
    if (geminiStage === "response-received") return (<div className="input-area"><input type="text" placeholder="Ask another question..." value={userQuestion} onChange={(e) => setUserQuestion(e.target.value)} className="order-input" onKeyPress={(e) => e.key === "Enter" && handleGeminiQuestion()} /><div style={{ display: "flex", gap: 8, marginTop: 8 }}><button onClick={handleGeminiQuestion} className="send-btn" disabled={aiThinking || !userQuestion.trim()} style={{ flex: 1 }}>{aiThinking ? "Thinking..." : "Ask"}</button><button onClick={() => { setStage("main"); resetGeminiFlow(); }} className="opt-btn back" style={{ flex: 0.5 }}>Back</button></div></div>);
    return null;
  };

  /* ══════════════════════════════════════════════════════════════════════
     PRODUCT SECTION (category select → then slider)
     ══════════════════════════════════════════════════════════════════════ */
  const renderProductSection = () => {
    /* ── STEP 1: Category Selection ── */
    if (productSubStage === "select") {
      return (
        <CategoryScreen
          trendingCategories={trendingCategories}
          categoriesLoading={categoriesLoading}
          onSelectCategory={handleSelectCategory}
          onSelectAll={handleSelectAllProducts}
        />
      );
    }

    /* ── STEP 2: Product Slider ── */
    return (
      <div style={{ padding: "0 0 4px" }}>
        {/* ── Top Bar: Back + Active Category ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <button
            onClick={handleBackToCategories}
            style={{
              display: "flex", alignItems: "center", gap: 5,
              padding: "6px 10px", borderRadius: 20, border: "1.5px solid #ddd",
              background: "#fff", fontSize: 11, fontWeight: 600, color: "#555",
              cursor: "pointer", flexShrink: 0,
            }}
          >
            <FaArrowLeft size={10} /> Categories
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#111", color: "#fff", padding: "6px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700, overflow: "hidden" }}>
            {activeCategory ? (
              <><span>{getCategoryEmoji(activeCategory.name)}</span><span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{activeCategory.name}</span></>
            ) : (
              <><FaShoppingBag size={10} /><span>All Products</span></>
            )}
          </div>
        </div>

        {/* ── Inline Category Filter Pills ── */}
        {trendingCategories.length > 0 && (
          <div style={{ marginBottom: 10, overflowX: "auto", whiteSpace: "nowrap", scrollbarWidth: "none", display: "flex", gap: 6, paddingBottom: 4 }}>
            <button
              onClick={handleSelectAllProducts}
              style={{ padding: "4px 11px", borderRadius: 16, fontSize: 10, fontWeight: activeCategory === null ? 700 : 500, background: activeCategory === null ? "#111" : "#f5f5f5", color: activeCategory === null ? "#fff" : "#666", border: activeCategory === null ? "1.5px solid #111" : "1.5px solid #e8e8e8", cursor: "pointer", flexShrink: 0 }}
            >All</button>
            {trendingCategories.map((cat) => {
              const isActive = activeCategory?.slug === cat.slug;
              return (
                <button
                  key={cat.slug}
                  onClick={() => handleSelectCategory(cat)}
                  style={{ padding: "4px 11px", borderRadius: 16, fontSize: 10, fontWeight: isActive ? 700 : 500, background: isActive ? "#111" : "#f5f5f5", color: isActive ? "#fff" : "#666", border: isActive ? "1.5px solid #111" : "1.5px solid #e8e8e8", cursor: "pointer", flexShrink: 0, transition: "all .15s" }}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        )}

        {/* ── Product count ── */}
        {!productLoading && products.length > 0 && (
          <div style={{ fontSize: 10, color: "#bbb", marginBottom: 8 }}>
            {products.length} product{products.length > 1 ? "s" : ""}{hasMore ? " (swipe →)" : " — all loaded"}
          </div>
        )}

        {/* ── Loading ── */}
        {productLoading ? (
          <div style={{ textAlign: "center", padding: "32px 0", color: "#bbb" }}>
            <div style={{ width: 30, height: 30, border: "3px solid #eee", borderTop: "3px solid #111", borderRadius: "50%", animation: "spin 0.7s linear infinite", margin: "0 auto 10px" }} />
            <div style={{ fontSize: 12 }}>Loading products...</div>
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: "center", padding: "32px 0", color: "#ccc" }}>
            <div style={{ fontSize: 30, marginBottom: 8 }}>🛍️</div>
            <div style={{ fontSize: 12 }}>No products found in this category</div>
            <button onClick={handleBackToCategories} style={{ marginTop: 12, padding: "7px 16px", borderRadius: 20, border: "1.5px solid #ddd", background: "#fff", fontSize: 11, cursor: "pointer" }}>← Try another category</button>
          </div>
        ) : (
          <>
            {/* ════ SWIPER SLIDER ════ */}
            <Swiper
              modules={[FreeMode, Pagination]}
              slidesPerView={1.25}
              spaceBetween={10}
              freeMode={true}
              pagination={{ clickable: true, dynamicBullets: true }}
              style={{ paddingBottom: 30 }}
              onReachEnd={() => {
                if (hasMore && !loadingMore) fetchProductsForChat(activeCategory?.slug || null, nextCursor, false);
              }}
            >
              {products.map((prod) => (
                <SwiperSlide key={prod._id} style={{ height: "auto" }}>
                  <ChatProductCard
                    prod={prod}
                    selectedVariants={selectedVariants}
                    setSelectedVariants={setSelectedVariants}
                    addingToCart={addingToCart}
                    handleAddToCart={handleAddToCart}
                  />
                </SwiperSlide>
              ))}

              {/* Sentinel slide */}
              {(hasMore || loadingMore) && (
                <SwiperSlide style={{ height: "auto" }}>
                  <div style={{ minHeight: 230, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#fafafa", borderRadius: 14, border: "1.5px dashed #e0e0e0", gap: 8 }}>
                    {loadingMore ? (
                      <>
                        <div style={{ width: 26, height: 26, border: "3px solid #eee", borderTop: "3px solid #111", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                        <div style={{ fontSize: 10, color: "#bbb" }}>Loading more...</div>
                      </>
                    ) : (
                      <>
                        <div style={{ fontSize: 22 }}>👉</div>
                        <div style={{ fontSize: 10, color: "#ccc", textAlign: "center" }}>Swipe to load<br />more</div>
                      </>
                    )}
                  </div>
                </SwiperSlide>
              )}
            </Swiper>

            {/* End */}
            {!hasMore && products.length > 0 && (
              <div style={{ textAlign: "center", padding: "6px 0 2px", fontSize: 10, color: "#ddd" }}>
                🎉 All {products.length} products loaded
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  /* ══════════════════════════════════════════════════════════════════════
     MAIN RENDER
     ══════════════════════════════════════════════════════════════════════ */
  return (
    <>
      {/* <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} /> */}
      {!open && <button className="chat-trigger" onClick={handleOpen}>💬</button>}

      {open && (
        <div className="chat-window">
          <div className="chat-header">
            <div><p>Joyory Assistant</p><small>Online</small></div>
            <button className="close-btn" onClick={handleClose}>✕</button>
          </div>

          <div className="chat-body" ref={messagesRef}>
            {messages.map((m, i) => (
              <div key={i} className={`msg ${m.from}`}>
                <div className="bubble">
                  {m.text && <div className="message-text" style={{ whiteSpace: "pre-line" }}>{m.text}</div>}
                  {m.data?.trackingCard && <ProfessionalTrackingCard shipmentData={m.data.shipment} />}
                </div>
              </div>
            ))}

            {/* ── PRODUCTS SECTION ── */}
            {stage === "products" && (
              <div style={{ padding: "4px 8px 8px" }}>
                {renderProductSection()}
              </div>
            )}

            {/* Global loader */}
            {loading && (
              <div className="loader">
                <div className="spinner"></div>
                {trackingStage === "order-id" ? "Tracking..." : trackingStage === "login-password" ? "Logging in..." : returnStage === "shipment-id" ? "Fetching..." : aiThinking ? "AI thinking..." : "Loading..."}
              </div>
            )}

            {/* Inputs */}
            {stage === "gemini-ai" && renderGeminiInputs()}
            {stage === "orders" && trackingStage !== "check-auth" && renderTrackingInputs()}
            {stage === "return" && renderReturnInputs()}

            {stage === "invoice" && (
              invoiceStage === "login-email" ? (<div className="input-area"><input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="order-input" autoFocus /><button onClick={() => handleEmailSubmit("invoice")} className="send-btn" disabled={loading || !email}>Next</button></div>)
              : invoiceStage === "login-password" ? (<div className="input-area"><input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="order-input" autoFocus onKeyPress={(e) => e.key === "Enter" && handleLogin("invoice")} /><button onClick={() => handleLogin("invoice")} className="send-btn" disabled={loading || !password}>{loading ? "..." : "Login"}</button></div>)
              : invoiceStage === "shipment" ? (<div className="input-area"><input type="text" placeholder="Shipment ID" value={invoiceShipmentId} onChange={(e) => setInvoiceShipmentId(e.target.value)} className="order-input" /><button onClick={handleInvoiceShipmentSubmit} className="send-btn" disabled={loading}>Get</button></div>)
              : null
            )}

            {stage === "cancellation" && (
              cancellationStage === "login-email" ? (<div className="input-area"><input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="order-input" autoFocus /><button onClick={() => handleEmailSubmit("cancel")} className="send-btn" disabled={loading || !email}>Next</button></div>)
              : cancellationStage === "login-password" ? (<div className="input-area"><input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="order-input" autoFocus onKeyPress={(e) => e.key === "Enter" && handleLogin("cancel")} /><button onClick={() => handleLogin("cancel")} className="send-btn" disabled={loading || !password}>{loading ? "..." : "Login"}</button></div>)
              : cancellationStage === "order-id" ? (<div className="input-area"><input type="text" placeholder="Order ID" value={orderIdToCancel} onChange={(e) => setOrderIdToCancel(e.target.value)} className="order-input" /><button onClick={handleOrderIdSubmit} className="send-btn" disabled={loading}>Next</button></div>)
              : null
            )}

            {/* Option Buttons */}
            <div className="options">
              {stage === "main" && MAIN_OPTIONS.map((opt) => (
                <button key={opt.key} className="opt-btn" onClick={() => pickMain(opt.key, opt.label)}>{opt.label}</button>
              ))}
              {stage === "orders" && trackingStage === "check-auth" && ORDER_OPTIONS.map((opt) => (
                <button key={opt.key} className="opt-btn" onClick={() => pickOrderOption(opt)}>{opt.label}</button>
              ))}
              {stage !== "main" && stage !== "gemini-ai" && (
                <button className="opt-btn back" onClick={() => { setStage("main"); resetAll(); setMessages((prev) => [...prev, { from: "bot", text: "Back to main menu 👋" }]); }}>
                  ← Back to Main
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <InvoiceDownloadPopup show={showInvoicePopup} handleClose={() => { setShowInvoicePopup(false); setStage("main"); resetInvoiceFlow(); }} shipmentData={invoiceData} />
      <CancelOrderPopup show={showCancelPopup} handleClose={() => { setShowCancelPopup(false); setStage("main"); resetCancellationFlow(); }} orderId={orderIdToCancel} paymentMethod={selectedOrderForCancel?.paymentMethod} onCancelSuccess={handleCancelSuccess} />
      <CancelSuccessPopup show={showSuccessPopup} handleClose={() => { setShowSuccessPopup(false); setStage("main"); resetCancellationFlow(); }} refundMethods={refundMethods} onConfirm={() => { setShowSuccessPopup(false); setStage("main"); resetCancellationFlow(); }} />
      <ReturnModal show={showReturnPopup} handleClose={() => { setShowReturnPopup(false); setStage("main"); resetReturnFlow(); }} shipmentData={returnShipmentData} />
    </>
  );
};

export default Chatbot;