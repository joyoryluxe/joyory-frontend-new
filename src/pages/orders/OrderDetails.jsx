import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import Loader from "../../components/common/Loader";
import SectionError from "../../components/common/SectionError";
import "../../styles/OrderDetails.css";
import {
  FaBox, FaArrowLeft, FaUndo, FaExchangeAlt, FaDownload
} from "react-icons/fa";
import { getShipmentDetails, getInvoice } from "../../api/orderApi";
import { requestReturn } from "../../api/returnsApi";
import ShipmentStatusTracker, {
  getStatusIcon,
  getStatusColor,
} from "../../components/sections/orders/ShipmentStatusTracker";
import ReturnRequestForm, {
  RETURN_REASON_RULES,
  RETURN_REASON_OPTIONS,
} from "../../components/sections/orders/ReturnRequestForm";
import ShipmentPriceBreakdown from "../../components/sections/orders/ShipmentPriceBreakdown";

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
      const res = await getShipmentDetails(shipmentId);
      if (res.data?.success) {
        setShipmentData(res.data);
      } else setError(res.data?.message || "Failed to fetch shipment details");
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) navigate("/login");
      else setError(err);
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
      const response = await getInvoice(invoiceId, {
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
      const res = await requestReturn(shipmentId, body);
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

    if (activeReturn && activeReturn.status) {
      return {
        status: activeReturn.status,
        statusLabel: activeReturn.statusLabel || "Return Requested",
        type: activeReturn.type || "return"
      };
    }

    const returnWithTracking = returns.find(r => r.trackingTimeline?.length > 0);
    if (returnWithTracking) {
      return {
        status: returnWithTracking.status,
        statusLabel: returnWithTracking.statusLabel || returnWithTracking.status,
        type: returnWithTracking.type
      };
    }

    return {
      status: shipmentData?.shipmentStatus,
      statusLabel: shipmentData?.shipmentStatus,
      type: "shipment"
    };
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
      <div className="container my-5 py-5">
        <SectionError
          error={error}
          message="Failed to load shipment details."
          variant="full"
          onRetry={fetchShipmentDetails}
        />
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

  const effectiveStatus = getEffectiveStatus();
  const displayStatus = effectiveStatus.statusLabel || effectiveStatus.status;
  const isReturnActive = effectiveStatus.type === "return" || effectiveStatus.type === "replace";

  return (
    <div className="order-details-page">
      <Header />
      <div className="container py-4 mt-lg-5 pt-lg-3 mt-3 pt-0">

        {/* Navigation / Back Button */}
        <div className="mb-3">
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
            <ShipmentStatusTracker
              shipmentData={shipmentData}
              orderInfo={orderInfo}
              courier={courier}
              trackingTimeline={trackingTimeline}
              returns={returns}
              formatDate={formatDate}
              formatDateTime={formatDateTime}
              getWaybill={getWaybill}
            />

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
                        <ReturnRequestForm
                          idx={idx}
                          form={form}
                          returning={returning}
                          onClose={closeReturnForm}
                          onQuantityChange={handleReturnQuantity}
                          onReasonChange={(i, val) => setReturnForms(prev => ({ ...prev, [i]: { ...prev[i], reason: val } }))}
                          onDescriptionChange={(i, val) => setReturnForms(prev => ({ ...prev, [i]: { ...prev[i], description: val } }))}
                          onImagesChange={handleReturnImages}
                          onRemoveImage={removeReturnImage}
                          onSubmit={submitReturn}
                        />
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
          <ShipmentPriceBreakdown
            priceDetails={priceDetails}
            shipmentData={shipmentData}
            formatCurrency={formatCurrency}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OrderDetails;
