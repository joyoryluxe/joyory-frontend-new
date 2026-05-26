// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import Header from "./Header";
// import Footer from "./Footer";
// import axios from "axios";
// import {
//   FaArrowLeft, FaBoxOpen, FaExchangeAlt, FaUndo, FaTruck,
//   FaCheckCircle, FaTimesCircle, FaClock, FaMapMarkerAlt,
//   FaDollarSign, FaInfoCircle, FaImage, FaUser, FaPhone,
//   FaEnvelope, FaHome, FaRoad, FaCity, FaFlag, FaTag
// } from "react-icons/fa";

// /* ---------- config ---------- */
// const API_BASE = "https://beauty.joyory.com/api/returns/details";

// /* ---------- helpers ---------- */
// const formatDate = (d) =>
//   d ? new Date(d).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" }) : "N/A";
// const formatDateTime = (d) =>
//   d
//     ? `${formatDate(d)} ${new Date(d).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}`
//     : "N/A";

// const statusBadge = (status) => {
//   const map = {
//     requested: { text: "Requested", color: "#ffc107", bg: "#fff3cd" },
//     approved: { text: "Approved", color: "#17a2b8", bg: "#d1ecf1" },
//     pickup_scheduled: { text: "Pickup Scheduled", color: "#007bff", bg: "#cce5ff" },
//     picked_up: { text: "Picked Up", color: "#6f42c1", bg: "#e2d9f3" },
//     in_transit: { text: "In Transit", color: "#fd7e14", bg: "#ffe4d1" },
//     delivered: { text: "Delivered", color: "#28a745", bg: "#d4edda" },
//     qc_done: { text: "QC Done", color: "#20c997", bg: "#d1f2e8" },
//     refund_initiated: { text: "Refund Initiated", color: "#6610f2", bg: "#e2d9f8" },
//     refunded: { text: "Refunded", color: "#28a745", bg: "#d4edda" },
//     cancelled: { text: "Cancelled", color: "#dc3545", bg: "#f8d7da" },
//   };
//   const s = map[status] || { text: status, color: "#6c757d", bg: "#e2e3e5" };
//   return (
//     <span
//       className="badge px-3 py-2 rounded-pill d-inline-flex align-items-center gap-2"
//       style={{ backgroundColor: s.bg, color: s.color, fontSize: 12, fontWeight: 600 }}
//     >
//       {s.text}
//     </span>
//   );
// };

// /* ---------- main component ---------- */
// const ReturnReplaceDetails = () => {
//   const navigate = useNavigate();
//   const { shipmentId, returnId } = useParams();

//   const [details, setDetails] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   /* ---- fetch single return / replace ---- */
//   const fetchDetails = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get(`${API_BASE}/${shipmentId}/${returnId}`, { withCredentials: true });
//       if (res.data?.success) setDetails(res.data.data);
//       else setError(res.data?.message || "Details not found");
//     } catch (err) {
//       console.error(err);
//       if (err.response?.status === 401) navigate("/login");
//       else setError(err.response?.data?.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDetails();
//   }, [shipmentId, returnId]);

//   /* ---------- empty states ---------- */
//   if (loading)
//     return (
//       <>
//         <Header />
//         <div className="container py-5 text-center" style={{ minHeight: "60vh" }}>
//           <div className="spinner-border text-primary" role="status" />
//           <p className="mt-2 text-muted">Loading details...</p>
//         </div>
//         <Footer />
//       </>
//     );

//   if (error)
//     return (
//       <>
//         <Header />
//         <div className="container py-5 text-center" style={{ minHeight: "60vh" }}>
//           <div className="alert alert-danger">{error}</div>
//           <button className="btn btn-primary" onClick={() => navigate(-1)}>Go Back</button>
//         </div>
//         <Footer />
//       </>
//     );

//   if (!details)
//     return (
//       <>
//         <Header />
//         <div className="container py-5 text-center" style={{ minHeight: "60vh" }}>
//           <div className="alert alert-info">No details available.</div>
//         </div>
//         <Footer />
//       </>
//     );

//   /* ---------- de-structure ---------- */
//   const r = details.return;
//   const item = r.items[0]; // we show first item only
//   const th = r.tracking_history || [];
//   const qc = r.qc || {};
//   const refund = r.refund || {};
//   const pickup = r.pickup_details || {};
//   const audit = r.audit_trail || [];

//   /* ---------- render ---------- */
//   return (
//     <>
//       <Header />
//       <div className="container mt-4 mb-5" style={{ minHeight: "60vh" }}>
//         {/* ---- header ---- */}
//         <div className="d-flex align-items-center mb-4">
//           <button className="btn btn-outline-secondary me-3" onClick={() => navigate(-1)}>
//             <FaArrowLeft />
//           </button>
//           <h4 className="mb-0 fw-bold">
//             {r.type === "replace" ? <FaExchangeAlt className="me-2" /> : <FaUndo className="me-2" />}
//             {r.type.toUpperCase()} Details
//           </h4>
//           <div className="ms-auto">{statusBadge(r.status)}</div>
//         </div>

//         {/* ---- general info row ---- */}
//         <div className="row g-4 mb-4">
//           <div className="col-md-3">
//             <div className="card border-0 shadow-sm h-100">
//               <div className="card-body text-center">
//                 <div className="text-muted mb-1">Shipment ID</div>
//                 <div className="fw-bold">{details.shipmentId}</div>
//               </div>
//             </div>
//           </div>
//           <div className="col-md-3">
//             <div className="card border-0 shadow-sm h-100">
//               <div className="card-body text-center">
//                 <div className="text-muted mb-1">Return ID</div>
//                 <div className="fw-bold">{details.returnId}</div>
//               </div>
//             </div>
//           </div>
//           <div className="col-md-3">
//             <div className="card border-0 shadow-sm h-100">
//               <div className="card-body text-center">
//                 <div className="text-muted mb-1">Courier</div>
//                 <div className="fw-bold">{r.courier_name || r.provider}</div>
//               </div>
//             </div>
//           </div>
//           <div className="col-md-3">
//             <div className="card border-0 shadow-sm h-100">
//               <div className="card-body text-center">
//                 <div className="text-muted mb-1">Waybill</div>
//                 <div className="fw-bold">{r.waybill || "—"}</div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* ---- main content ---- */}
//         <div className="row g-4">
//           {/* ---- left column ---- */}
//           <div className="col-lg-8">
//             {/* ---- item ---- */}
//             <div className="card shadow-sm mb-4">
//               <div className="card-header bg-white fw-bold">Item</div>
//               <div className="card-body d-flex gap-3">
//                 <img
//                   src={item.images?.[0] || "https://via.placeholder.com/100"}
//                   alt={item.variant.shadeName}
//                   className="rounded border"
//                   style={{ width: 100, height: 100, objectFit: "cover" }}
//                 />
//                 <div>
//                   <h6 className="mb-1 fw-bold">{item.variant.shadeName}</h6>
//                   <div className="text-muted">SKU: {item.variant.sku}</div>
//                   <div>Quantity: {item.quantity}</div>
//                   <div>Condition: {item.condition}</div>
//                   <div className="mt-1">
//                     <span className="fw-bold">Reason:</span> {item.reason}
//                     {item.reasonDescription && <span className="text-muted"> ({item.reasonDescription})</span>}
//                   </div>
//                 </div>
//               </div>
//               {/* proof images */}
//               {item.images?.length > 1 && (
//                 <div className="card-footer bg-light">
//                   <div className="text-muted mb-2">
//                     <FaImage className="me-1" /> Proof images
//                   </div>
//                   <div className="d-flex flex-wrap gap-2">
//                     {item.images.slice(1).map((img, i) => (
//                       <a key={i} href={img} target="_blank" rel="noreferrer">
//                         <img
//                           src={img}
//                           alt={`proof-${i}`}
//                           className="rounded border"
//                           style={{ width: 60, height: 60, objectFit: "cover" }}
//                         />
//                       </a>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* ---- tracking timeline ---- */}
//             {th.length > 0 && (
//               <div className="card shadow-sm mb-4">
//                 <div className="card-header bg-white fw-bold">Tracking Timeline</div>
//                 <div className="card-body">
//                   <ul className="list-unstyled border-start border-2 ps-3 ms-2">
//                     {[...th].reverse().map((t, i) => (
//                       <li key={i} className="mb-3 position-relative">
//                         <div
//                           className="position-absolute start-0 top-0 translate-middle rounded-circle bg-primary"
//                           style={{ width: 10, height: 10, marginLeft: "-17px", marginTop: "6px" }}
//                         />
//                         <div className="d-flex justify-content-between align-items-start">
//                           <div>
//                             <div className="fw-bold text-capitalize">{t.status.replace(/_/g, " ")}</div>
//                             <div className="text-muted small">{t.description}</div>
//                             {t.location && (
//                               <div className="text-muted small d-flex align-items-center gap-1">
//                                 <FaMapMarkerAlt size={10} /> {t.location}
//                               </div>
//                             )}
//                           </div>
//                           <div className="text-muted small text-nowrap ms-2">{formatDateTime(t.timestamp)}</div>
//                         </div>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               </div>
//             )}

//             {/* ---- QC ---- */}
//             {qc.status && (
//               <div className="card shadow-sm mb-4">
//                 <div className="card-header bg-white fw-bold">Quality Check</div>
//                 <div className="card-body">
//                   <div className="d-flex align-items-center gap-2 mb-2">
//                     <FaInfoCircle />
//                     <span className="text-capitalize fw-bold">{qc.status}</span>
//                   </div>
//                   {qc.notes && <div className="text-muted">{qc.notes}</div>}
//                   {qc.images?.length > 0 && (
//                     <div className="d-flex flex-wrap gap-2 mt-2">
//                       {qc.images.map((img, i) => (
//                         <a key={i} href={img} target="_blank" rel="noreferrer">
//                           <img
//                             src={img}
//                             alt={`qc-${i}`}
//                             className="rounded border"
//                             style={{ width: 60, height: 60, objectFit: "cover" }}
//                           />
//                         </a>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}

//             {/* ---- refund ---- */}
//             {refund.status && (
//               <div className="card shadow-sm mb-4">
//                 <div className="card-header bg-white fw-bold">Refund</div>
//                 <div className="card-body d-flex align-items-center gap-2">
//                   <FaDollarSign />
//                   <span className="text-capitalize fw-bold">{refund.status}</span>
//                   {refund.amount > 0 && <span className="text-muted">(₹{refund.amount})</span>}
//                 </div>
//               </div>
//             )}

//             {/* ---- audit trail ---- */}
//             {audit.length > 0 && (
//               <div className="card shadow-sm">
//                 <div className="card-header bg-white fw-bold">Audit Trail</div>
//                 <div className="card-body">
//                   <ul className="list-unstyled">
//                     {audit.map((a, i) => (
//                       <li key={i} className="d-flex justify-content-between align-items-start mb-2">
//                         <div>
//                           <div className="text-capitalize fw-bold">{a.action.replace(/_/g, " ")}</div>
//                           <div className="text-muted small">
//                             {a.performedByModel} · {formatDateTime(a.timestamp)}
//                           </div>
//                           {a.notes && <div className="text-muted fst-italic small">{a.notes}</div>}
//                         </div>
//                         <div className="text-muted small text-nowrap ms-2">{a.status}</div>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* ---- right column ---- */}
//           <div className="col-lg-4">
//             {/* ---- pickup address ---- */}
//             {pickup.name && (
//               <div className="card shadow-sm mb-4">
//                 <div className="card-header bg-white fw-bold">Pickup Address</div>
//                 <div className="card-body">
//                   <div className="d-flex align-items-center gap-2 mb-2">
//                     <FaUser />
//                     <span className="fw-bold">{pickup.name}</span>
//                   </div>
//                   <div className="text-muted small">
//                     <div className="d-flex align-items-center gap-2 mb-1">
//                       <FaHome /> {pickup.address}
//                     </div>
//                     <div className="d-flex align-items-center gap-2 mb-1">
//                       <FaRoad /> {pickup.city}, {pickup.state}
//                     </div>
//                     <div className="d-flex align-items-center gap-2 mb-1">
//                       <FaFlag /> {pickup.pincode}
//                     </div>
//                     <div className="d-flex align-items-center gap-2">
//                       <FaPhone /> {pickup.phone}
//                     </div>
//                     {pickup.email && (
//                       <div className="d-flex align-items-center gap-2">
//                         <FaEnvelope /> {pickup.email}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* ---- meta ---- */}
//             <div className="card shadow-sm">
//               <div className="card-header bg-white fw-bold">Meta</div>
//               <div className="card-body text-muted small">
//                 <div className="d-flex justify-content-between mb-1">
//                   <span>Created</span>
//                   <span>{formatDateTime(r.createdAt)}</span>
//                 </div>
//                 <div className="d-flex justify-content-between">
//                   <span>Last updated</span>
//                   <span>{formatDateTime(r.updatedAt)}</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default ReturnReplaceDetails;


























import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import axios from "axios";
import {
  FaArrowLeft, FaExchangeAlt, FaUndo, FaMapMarkerAlt,
  FaDollarSign, FaInfoCircle, FaImage, FaUser, FaPhone,
  FaEnvelope, FaHome, FaRoad, FaFlag,
  FaRupeeSign
} from "react-icons/fa";

/* ---------- config ---------- */
const API_BASE = "https://beauty.joyory.com/api/returns/details";

/* ---------- helpers ---------- */
const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" }) : "N/A";

const formatDateTime = (d) =>
  d
    ? `${formatDate(d)} ${new Date(d).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}`
    : "N/A";

const statusBadge = (status) => {
  const map = {
    requested: { text: "Requested", color: "#ffc107", bg: "#fff3cd" },
    approved: { text: "Approved", color: "#17a2b8", bg: "#d1ecf1" },
    pickup_scheduled: { text: "Pickup Scheduled", color: "#007bff", bg: "#cce5ff" },
    picked_up: { text: "Picked Up", color: "#6f42c1", bg: "#e2d9f3" },
    in_transit: { text: "In Transit", color: "#fd7e14", bg: "#ffe4d1" },
    delivered: { text: "Delivered", color: "#28a745", bg: "#d4edda" },
    qc_done: { text: "QC Done", color: "#20c997", bg: "#d1f2e8" },
    refund_initiated: { text: "Refund Initiated", color: "#6610f2", bg: "#e2d9f8" },
    refunded: { text: "Refunded", color: "#28a745", bg: "#d4edda" },
    cancelled: { text: "Cancelled", color: "#dc3545", bg: "#f8d7da" },
  };
  const s = map[status] || { text: status, color: "#6c757d", bg: "#e2e3e5" };
  return (
    <span
      className="badge px-3 py-2 rounded-pill d-inline-flex align-items-center gap-2"
      style={{ backgroundColor: s.bg, color: s.color, fontSize: 12, fontWeight: 600 }}
    >
      {s.text}
    </span>
  );
};

/* ---------- main component ---------- */
const ReturnReplaceDetails = () => {
  const navigate = useNavigate();
  const location = useLocation(); // To get data passed from List page
  const { shipmentId, returnId } = useParams();

  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ---- fetch single return / replace ---- */
  const fetchDetails = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/${shipmentId}/${returnId}`, { withCredentials: true });
      if (res.data?.success) {
        setDetails(res.data.data); // Matches JSON: { shipmentId, returnId, return: {...} }
      } else {
        setError(res.data?.message || "Details not found");
      }
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) navigate("/login");
      else setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Optimization: If we passed data from the list page, use it immediately
    if (location.state?.returnData) {
      setDetails({
        shipmentId: shipmentId, 
        returnId: returnId,
        return: location.state.returnData
      });
      setLoading(false);
    } else {
      // Otherwise fetch from API
      fetchDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shipmentId, returnId, location.state]);

  /* ---------- empty states ---------- */
  if (loading)
    return (
      <>
        <Header />
        <div className="container py-5 text-center" style={{ minHeight: "60vh" }}>
          <div className="spinner-border text-primary" role="status" />
          <p className="mt-2 text-muted">Loading details...</p>
        </div>
        <Footer />
      </>
    );

  if (error)
    return (
      <>
        <Header />
        <div className="container py-5 text-center" style={{ minHeight: "60vh" }}>
          <div className="alert alert-danger">{error}</div>
          <button className="btn btn-primary page-title-main-name" onClick={() => navigate(-1)}>Go Back</button>
        </div>
        <Footer />
      </>
    );

  if (!details) return null;

  /* ---------- MAPPING JSON DATA ---------- */
  // Based on your JSON: { data: { shipmentId, returnId, return: { ... } } }
  const r = details.return;
  const item = r.items && r.items.length > 0 ? r.items[0] : null;
  const th = r.tracking_history || [];
  const qc = r.qc || {};
  const refund = r.refund || {};
  const pickup = r.pickup_details || {};
  const audit = r.audit_trail || [];

  return (
    <>
      <Header />
      <div className="container mt-4 mb-5 page-title-main-name" style={{ minHeight: "60vh" }}>
        
        {/* ---- Header Section ---- */}
        <div className="d-lg-flex d-md-block align-items-center mb-4">
          <button className="btn btn-outline-secondary me-3" onClick={() => navigate(-1)}>
            <FaArrowLeft />
          </button>
          <h4 className="mb-0 fw-bold page-title-main-name mt-4 mt-lg-0">
            {r.type === "replace" ? <FaExchangeAlt className="me-2" /> : <FaUndo className="me-2" />}
            {r.type?.toUpperCase()} DETAILS
          <sup className="ms-3">{statusBadge(r.status)}</sup>
          </h4>
        </div>

        <div className="row page-title-main-name">
          <div className="col-md-3 col-sm-2 col-6 mb-5">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center">
                <div className="text-muted mb-1 small text-uppercase">Shipment ID</div>
                {/* JSON: details.shipmentId */}
                <div className="fw-bold text-truncate" title={details.shipmentId}>{details.shipmentId}</div>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-sm-2 col-6 mb-5">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center">
                <div className="text-muted mb-1 small text-uppercase">Return ID</div>
                {/* JSON: details.returnId */}
                <div className="fw-bold" title={details.returnId}>{details.returnId}</div>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-sm-2 col-6 mb-5">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center">
                <div className="text-muted mb-1 small text-uppercase">Courier</div>
                {/* JSON: details.return.courier_name or provider */}
                <div className="fw-bold">{r.courier_name || r.provider}</div>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-sm-2 col-6 mb-5">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center">
                <div className="text-muted mb-1 small text-uppercase">Waybill</div>
                {/* JSON: details.return.waybill */}
                <div className="fw-bold">{r.waybill || "—"}</div>
              </div>
            </div>
          </div>
        </div>
        {/* ---- General Info Cards ---- */}

        {/* ---- Main Content Area ---- */}
        <div className="row g-4 page-title-main-name">
          
          {/* ---- LEFT COLUMN (Item, Timeline, QC, Refund, Audit) ---- */}
          <div className="col-lg-8">
            
            {/* 1. Item Details */}
            {item && (
              <div className="card shadow-sm mb-4">
                <div className="card-header bg-white fw-bold">Product Details</div>
                <div className="card-body d-flex gap-3">
                  {/* JSON: item.images[0] */}
                  <img
                    src={item.images?.[0] || "https://via.placeholder.com/100"}
                    alt={item.variant?.shadeName || "Product"}
                    className="rounded border"
                    style={{ width: 100, height: 100, objectFit: "cover" }}
                  />
                  <div>
                    {/* JSON: item.variant.shadeName */}
                    <h6 className="mb-1 fw-bold">{item.variant?.shadeName || "Product Name"}</h6>
                    {/* JSON: item.variant.sku */}
                    <div className="text-muted small">SKU: {item.variant?.sku}</div>
                    <div className="small">Quantity: {item.quantity}</div>
                    {/* JSON: item.condition */}
                    <div className="small">Condition: {item.condition}</div>
                    
                    <div className="mt-2 p-2 bg-light rounded small">
                      <span className="fw-bold">Reason:</span> {item.reason}
                      {item.reasonDescription && <span className="text-muted"> - {item.reasonDescription}</span>}
                    </div>
                  </div>
                </div>
                
                {/* Proof Images (if more than 1) */}
                {item.images?.length > 1 && (
                  <div className="card-footer bg-light">
                    <div className="text-muted mb-2 small"><FaImage className="me-1" /> Additional Proof</div>
                    <div className="d-flex flex-wrap gap-2">
                      {item.images.slice(1).map((img, i) => (
                        <a key={i} href={img} target="_blank" rel="noreferrer">
                          <img src={img} alt={`proof-${i}`} className="rounded border" style={{ width: 60, height: 60, objectFit: "cover" }} />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 2. Tracking Timeline */}
            {th.length > 0 && (
              <div className="card shadow-sm mb-4">
                <div className="card-header bg-white fw-bold">Tracking History</div>
                <div className="card-body" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  <ul className="list-unstyled border-start border-2 ps-3 ms-2">
                    {/* Display latest first */}
                    {[...th].reverse().map((t, i) => (
                      <li key={t._id || i} className="mb-3 position-relative">
                        <div
                          className="position-absolute start-0 top-0 translate-middle rounded-circle bg-primary"
                          style={{ width: 10, height: 10, marginLeft: "-17px", marginTop: "6px" }}
                        />
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            {/* JSON: tracking_history[].status */}
                            <div className="fw-bold text-capitalize small">{t.status.replace(/_/g, " ")}</div>
                            {/* JSON: tracking_history[].description */}
                            <div className="text-muted small">{t.description}</div>
                            {/* JSON: tracking_history[].location */}
                            {t.location && (
                              <div className="text-muted small d-flex align-items-center gap-1" style={{fontSize: '0.8rem'}}>
                                <FaMapMarkerAlt size={10} /> {t.location}
                              </div>
                            )}
                          </div>
                          {/* JSON: tracking_history[].timestamp */}
                          <div className="text-muted small text-nowrap ms-2" style={{fontSize: '0.75rem'}}>
                            {formatDateTime(t.timestamp)}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* 3. QC Section (Only if exists) */}
            {qc.status && (
              <div className="card shadow-sm mb-4">
                <div className="card-header bg-white fw-bold">Quality Check</div>
                <div className="card-body">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <FaInfoCircle />
                    <span className="text-capitalize fw-bold">{qc.status}</span>
                  </div>
                  {qc.notes && <div className="text-muted small">{qc.notes}</div>}
                  {qc.images?.length > 0 && (
                    <div className="d-flex flex-wrap gap-2 mt-2">
                      {qc.images.map((img, i) => (
                        <a key={i} href={img} target="_blank" rel="noreferrer">
                          <img src={img} alt={`qc-${i}`} className="rounded border" style={{ width: 60, height: 60, objectFit: "cover" }} />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 4. Refund Section */}
            {refund.status && (
              <div className="card shadow-sm mb-4">
                <div className="card-header bg-white fw-bold">Refund Info</div>
                <div className="card-body d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-2">
                    <FaRupeeSign className="text-success"/>
                    <span className="fw-bold text-capitalize">Status: {refund.status}</span>
                  </div>
                  {refund.amount >= 0 && <span className="fw-bold text-success fs-5">₹{refund.amount}</span>}
                </div>
              </div>
            )}

            {/* 5. Audit Trail */}
            {audit.length > 0 && (
              <div className="card shadow-sm">
                <div className="card-header bg-white fw-bold">Audit Trail</div>
                <div className="card-body">
                  <ul className="list-unstyled mb-0">
                    {audit.map((a, i) => (
                      <li key={a._id || i} className="d-flex justify-content-between align-items-start mb-2 pb-2 border-bottom last-border-0">
                        <div>
                          {/* JSON: audit_trail[].action */}
                          <div className="text-capitalize fw-bold small">{a.action.replace(/_/g, " ")}</div>
                          <div className="text-muted small" style={{fontSize: '0.75rem'}}>
                            {/* JSON: audit_trail[].performedByModel */}
                            {a.performedByModel} · {formatDateTime(a.timestamp)}
                          </div>
                          {a.notes && <div className="text-muted fst-italic small mt-1">Note: {a.notes}</div>}
                        </div>
                        {/* JSON: audit_trail[].status */}
                        <div>
                            {a.status}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* ---- RIGHT COLUMN (Pickup Address, Timestamps) ---- */}
          <div className="col-lg-4">
            
            {/* Pickup Address Card */}
            {pickup.name && (
              <div className="card shadow-sm mb-4">
                <div className="card-header bg-white fw-bold">Pickup Address</div>
                <div className="card-body">
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <div className="bg-light rounded-circle p-2"><FaUser /></div>
                    <span className="fw-bold">{pickup.name}</span>
                  </div>
                  <div className="text-muted small d-flex flex-column gap-2">
                    <div className="d-flex align-items-start gap-2">
                      <FaHome className="mt-1 flex-shrink-0" /> 
                      <span>{pickup.address}</span>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <FaRoad /> {pickup.city}, {pickup.state}
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <FaFlag /> {pickup.pincode}
                    </div>
                    <hr className="my-2"/>
                    <div className="d-flex align-items-center gap-2">
                      <FaPhone /> {pickup.phone}
                    </div>
                    {pickup.email && (
                      <div className="d-flex align-items-center gap-2">
                        <FaEnvelope /> {pickup.email}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Meta Data Card */}
            <div className="card shadow-sm">
              <div className="card-header bg-white fw-bold">Request Info</div>
              <div className="card-body text-muted small">
                <div className="d-flex justify-content-between mb-2">
                  <span>Created</span>
                  <span className="fw-bold text-dark">{formatDateTime(r.createdAt)}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Last Updated</span>
                  <span className="fw-bold text-dark">{formatDateTime(r.updatedAt)}</span>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ReturnReplaceDetails;