// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Header from "./Header";
// import Footer from "./Footer";
// import axios from "axios";
// import {
//   FaArrowLeft,
//   FaBoxOpen,
//   FaExchangeAlt,
//   FaUndo,
//   FaTruck,
//   FaCheckCircle,
//   FaTimesCircle,
//   FaClock,
//   FaMapMarkerAlt
// } from "react-icons/fa";

// // API Endpoint
// const RETURNS_API = "https://beauty.joyory.com/api/returns/my";

// /* --- Helper Functions --- */
// const formatDate = (dateStr) => {
//   if (!dateStr) return "N/A";
//   const d = new Date(dateStr);
//   return d.toLocaleDateString("en-IN", {
//     year: "numeric",
//     month: "short",
//     day: "numeric",
//   });
// };

// const formatDateTime = (dateStr) => {
//   if (!dateStr) return "N/A";
//   const d = new Date(dateStr);
//   return `${formatDate(dateStr)} ${d.toLocaleTimeString("en-IN", {
//     hour: "2-digit",
//     minute: "2-digit",
//   })}`;
// };

// const getStatusBadge = (status) => {
//   switch (status?.toLowerCase()) {
//     case "requested": return "bg-warning text-dark";
//     case "approved": return "bg-info text-white";
//     case "pickup_scheduled": return "bg-primary text-white";
//     case "picked_up": return "bg-primary text-white";
//     case "in_transit": return "bg-info text-white";
//     case "delivered":
//     case "refunded":
//     case "replaced": return "bg-success text-white";
//     case "cancelled":
//     case "rejected": return "bg-danger text-white";
//     default: return "bg-secondary text-white";
//   }
// };

// const getStatusIcon = (status) => {
//   switch (status?.toLowerCase()) {
//     case "requested": return <FaClock />;
//     case "picked_up": return <FaTruck />;
//     case "in_transit": return <FaTruck />;
//     case "delivered":
//     case "refunded": return <FaCheckCircle />;
//     case "cancelled": return <FaTimesCircle />;
//     default: return <FaBoxOpen />;
//   }
// };

// const ReturnReplace = () => {
//   const navigate = useNavigate();
//   const [requestList, setRequestList] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     fetchReturns();
//   }, []);

//   const fetchReturns = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get(RETURNS_API, { withCredentials: true });
//       if (res.data?.success) {
//         // The API returns an array of objects where data is inside a "return" key
//         setRequestList(res.data.data || []);
//       } else {
//         setError("Failed to load return requests.");
//       }
//     } catch (err) {
//       console.error(err);
//       if (err.response?.status === 401) navigate("/login");
//       else setError("Something went wrong while fetching data.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading)
//     return (
//       <>
//         <Header />
//         <div className="container py-5 text-center" style={{ minHeight: "60vh" }}>
//           <div className="spinner-border text-primary" role="status"></div>
//           <p className="mt-2 text-muted">Loading your requests...</p>
//         </div>
//         <Footer />
//       </>
//     );

//   return (
//     <>
//       <Header />
//       <div className="container mt-4 mb-5" style={{ minHeight: "60vh" }}>

//         {/* Page Header */}
//         <div className="d-flex align-items-center mb-4">
//           <button className="btn btn-outline-secondary me-3" onClick={() => navigate("/profile")}>
//             <FaArrowLeft />
//           </button>
//           <h4 className="mb-0 fw-bold">My Returns & Replacements</h4>
//         </div>

//         {error && <div className="alert alert-danger">{error}</div>}

//         {requestList.length === 0 && !error ? (
//           <div className="text-center py-5 border rounded bg-light">
//             <FaBoxOpen size={50} className="text-muted mb-3" />
//             <h5>No requests found</h5>
//             <p className="text-muted">You haven't requested any returns or replacements yet.</p>
//             <button className="btn btn-primary" onClick={() => navigate("/orders")}>
//               Go to Orders
//             </button>
//           </div>
//         ) : (
//           <div className="row">
//             {requestList.map((entry, index) => {
//               // Extract the actual return object from the wrapper
//               const data = entry.return;
//               const isReplace = data.type === "replace";

//               return (
//                 <div key={data._id || index} className="col-12 mb-4">
//                   <div className="card shadow-sm border-0">

//                     {/* --- Card Header --- */}
//                     <div className="card-header bg-white border-bottom py-3 d-flex flex-column flex-md-row justify-content-between align-items-md-center">
//                       <div className="d-flex align-items-center gap-2 mb-2 mb-md-0">
//                         {isReplace ? (
//                           <span className="badge bg-primary p-2"><FaExchangeAlt /> Replacement</span>
//                         ) : (
//                           <span className="badge bg-warning text-dark p-2"><FaUndo /> Return</span>
//                         )}
//                         <span className="text-muted small">ID: {data._id}</span>
//                       </div>

//                       <div className="d-flex align-items-center gap-2">
//                         <span className="text-muted small me-2">Requested: {formatDate(data.createdAt)}</span>
//                         <span className={`badge ${getStatusBadge(data.status)} d-flex align-items-center gap-1 px-3 py-2 rounded-pill`}>
//                           {getStatusIcon(data.status)}
//                           <span className="text-capitalize">{data.status.replace("_", " ")}</span>
//                         </span>
//                       </div>
//                     </div>

//                     <div className="card-body">
//                       <div className="row g-4">

//                         {/* --- Product Details Section --- */}
//                         <div className="col-lg-7 border-end-lg">
//                           <h6 className="fw-bold mb-3 text-secondary">Items Included</h6>
//                           {data.items.map((item, idx) => (
//                             <div key={idx} className="d-flex gap-3 mb-3 p-2 border rounded bg-light">
//                               {/* Product Image */}
//                               <div style={{width: '70px', height: '70px', flexShrink: 0}}>
//                                 {data.items[0]?.images?.length > 0 ? (
//                                    // Assuming first image in return request is product reference, 
//                                    // OR you might need to fetch product details separately if image isn't in 'items'.
//                                    // Based on your JSON, 'images' inside item are proof images.
//                                    // If you store product image in DB, use that. Here using a placeholder or proof image.
//                                    <img 
//                                      src={item.images[0] || "https://via.placeholder.com/70"} 
//                                      alt="Product" 
//                                      className="w-100 h-100 object-fit-cover rounded border"
//                                    />
//                                 ) : (
//                                   <div className="w-100 h-100 bg-secondary bg-opacity-25 rounded d-flex align-items-center justify-content-center">
//                                     <FaBoxOpen className="text-muted"/>
//                                   </div>
//                                 )}
//                               </div>

//                               <div className="flex-grow-1">
//                                 <div className="d-flex justify-content-between">
//                                   <h6 className="mb-1 fw-bold">Product ID: <span className="text-primary">{item.productId}</span></h6>
//                                   <span className="badge bg-secondary">Qty: {item.quantity}</span>
//                                 </div>
//                                 <p className="mb-1 small text-muted">
//                                   Variant: {item.variant?.shadeName || item.variant?.sku || "N/A"}
//                                 </p>
//                                 <div className="small">
//                                   <span className="fw-bold">Reason:</span> {item.reason}
//                                   {item.reasonDescription && <span className="text-muted"> ({item.reasonDescription})</span>}
//                                 </div>
//                               </div>
//                             </div>
//                           ))}

//                           {/* Logistics Info */}
//                           {data.waybill && (
//                             <div className="mt-3 p-3 bg-info bg-opacity-10 rounded border border-info">
//                               <div className="d-flex justify-content-between align-items-center">
//                                 <div>
//                                   <span className="fw-bold d-block text-dark">Courier: {data.courier_name || data.provider}</span>
//                                   <span className="small text-muted">Waybill: {data.waybill}</span>
//                                 </div>
//                                 {data.tracking_url && (
//                                   <a href={data.tracking_url} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-info">
//                                     Track Courier
//                                   </a>
//                                 )}
//                               </div>
//                             </div>
//                           )}
//                         </div>

//                         {/* --- Tracking Timeline Section --- */}
//                         <div className="col-lg-5">
//                           <h6 className="fw-bold mb-3 text-secondary">Tracking Status</h6>

//                           <div className="tracking-timeline" style={{maxHeight: '300px', overflowY: 'auto'}}>
//                             {data.tracking_history && data.tracking_history.length > 0 ? (
//                               <ul className="list-unstyled border-start ms-2 ps-3 border-2">
//                                 {/* Reverse to show latest first */}
//                                 {[...data.tracking_history].reverse().map((event, tIdx) => (
//                                   <li key={tIdx} className="mb-3 position-relative">
//                                     <div className="position-absolute start-0 top-0 translate-middle rounded-circle bg-primary" 
//                                          style={{width: '10px', height: '10px', left: '-17px', marginTop: '6px'}}></div>

//                                     <p className="mb-0 fw-bold text-capitalize small">{event.status.replace(/_/g, " ")}</p>
//                                     <p className="mb-0 text-muted small" style={{fontSize: '0.85rem'}}>{event.description}</p>
//                                     <small className="text-muted d-flex align-items-center gap-1" style={{fontSize: '0.75rem'}}>
//                                       <FaClock size={10}/> {formatDateTime(event.timestamp)}
//                                       {event.location && (
//                                         <>
//                                           <span className="mx-1">|</span>
//                                           <FaMapMarkerAlt size={10}/> {event.location}
//                                         </>
//                                       )}
//                                     </small>
//                                   </li>
//                                 ))}
//                               </ul>
//                             ) : (
//                               <div className="text-center text-muted py-4 small">
//                                 <p className="mb-0">Processing request...</p>
//                                 {data.status === 'cancelled' && <p className="text-danger">Request Cancelled</p>}
//                               </div>
//                             )}
//                           </div>

//                           {/* Pickup Details Summary */}
//                           {data.pickup_details && (
//                             <div className="mt-3 pt-3 border-top">
//                               <small className="text-uppercase text-muted fw-bold" style={{fontSize: '0.7rem'}}>Pickup Address</small>
//                               <p className="mb-0 small fw-bold">{data.pickup_details.name}</p>
//                               <p className="mb-0 small text-muted text-truncate">
//                                 {data.pickup_details.address}, {data.pickup_details.city} - {data.pickup_details.pincode}
//                               </p>
//                             </div>
//                           )}
//                         </div>

//                       </div>
//                     </div>

//                     {/* --- Card Footer --- */}
//                     {data.audit_trail && data.audit_trail.length > 0 && (
//                       <div className="card-footer bg-light text-muted small">
//                         Last update: {formatDateTime(data.updatedAt)} • 
//                         <span className="ms-1 fst-italic">
//                            Latest note: {data.audit_trail[data.audit_trail.length-1]?.notes || "Status updated"}
//                         </span>
//                       </div>
//                     )}

//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default ReturnReplace;


































// // Updated ReturnReplace.jsx
// // Changes:
// // - Added "View Details" button in each card header
// // - Navigation to /return-details/:shipmentId/:returnId
// // - Note: The list API JSON you provided does not include shipmentId. 
// //   In real implementation, it should be available in entry.shipmentId or entry.return.shipmentId.
// //   Here, we use a placeholder - replace with actual field when available.

// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Header from "./Header";
// import Footer from "./Footer";
// import axios from "axios";
// import {
//   FaArrowLeft,
//   FaBoxOpen,
//   FaExchangeAlt,
//   FaUndo,
//   FaTruck,
//   FaCheckCircle,
//   FaTimesCircle,
//   FaClock,
//   FaMapMarkerAlt,
//   FaEye
// } from "react-icons/fa";

// // API Endpoint
// const RETURNS_API = "https://beauty.joyory.com/api/returns/my";

// /* --- Helper Functions --- */
// const formatDate = (dateStr) => {
//   if (!dateStr) return "N/A";
//   const d = new Date(dateStr);
//   return d.toLocaleDateString("en-IN", {
//     year: "numeric",
//     month: "short",
//     day: "numeric",
//   });
// };

// const formatDateTime = (dateStr) => {
//   if (!dateStr) return "N/A";
//   const d = new Date(dateStr);
//   return `${formatDate(dateStr)} ${d.toLocaleTimeString("en-IN", {
//     hour: "2-digit",
//     minute: "2-digit",
//   })}`;
// };

// const getStatusBadge = (status) => {
//   switch (status?.toLowerCase()) {
//     case "requested": return "bg-warning text-dark";
//     case "approved": return "bg-info text-white";
//     case "pickup_scheduled": return "bg-primary text-white";
//     case "picked_up": return "bg-primary text-white";
//     case "in_transit": return "bg-info text-white";
//     case "delivered":
//     case "refunded":
//     case "replaced": return "bg-success text-white";
//     case "cancelled":
//     case "rejected": return "bg-danger text-white";
//     default: return "bg-secondary text-white";
//   }
// };

// const getStatusIcon = (status) => {
//   switch (status?.toLowerCase()) {
//     case "requested": return <FaClock />;
//     case "picked_up": return <FaTruck />;
//     case "in_transit": return <FaTruck />;
//     case "delivered":
//     case "refunded": return <FaCheckCircle />;
//     case "cancelled": return <FaTimesCircle />;
//     default: return <FaBoxOpen />;
//   }
// };

// const ReturnReplace = () => {
//   const navigate = useNavigate();
//   const [requestList, setRequestList] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     fetchReturns();
//   }, []);

//   const fetchReturns = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get(RETURNS_API, { withCredentials: true });
//       if (res.data?.success) {
//         setRequestList(res.data.data || []);
//       } else {
//         setError("Failed to load return requests.");
//       }
//     } catch (err) {
//       console.error(err);
//       if (err.response?.status === 401) navigate("/login");
//       else setError("Something went wrong while fetching data.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading)
//     return (
//       <>
//         <Header />
//         <div className="container py-5 text-center" style={{ minHeight: "60vh" }}>
//           <div className="spinner-border text-primary" role="status"></div>
//           <p className="mt-2 text-muted">Loading your requests...</p>
//         </div>
//         <Footer />
//       </>
//     );

//   return (
//     <>
//       <Header />
//       <div className="container mt-4 mb-5" style={{ minHeight: "60vh" }}>
//         {/* Page Header */}
//         <div className="d-flex align-items-center mb-4">
//           <button className="btn btn-outline-secondary me-3" onClick={() => navigate(-1)}>
//             <FaArrowLeft />
//           </button>
//           <h4 className="mb-0 fw-bold">My Returns & Replacements</h4>
//         </div>

//         {error && <div className="alert alert-danger">{error}</div>}

//         {requestList.length === 0 && !error ? (
//           <div className="text-center py-5 border rounded bg-light">
//             <FaBoxOpen size={50} className="text-muted mb-3" />
//             <h5>No requests found</h5>
//             <p className="text-muted">You haven't requested any returns or replacements yet.</p>
//             <button className="btn btn-primary" onClick={() => navigate("/orders")}>
//               Go to Orders
//             </button>
//           </div>
//         ) : (
//           <div className="row g-4">
//             {requestList.map((entry, index) => {
//               const data = entry.return;
//               const isReplace = data.type === "replace";

//               // TODO: Get shipmentId from response if available
//               // Example: const shipmentId = entry.shipmentId || data.shipmentId || "unknown";
//               const shipmentId = "placeholder"; // Replace with actual shipmentId when available in API response

//               return (
//                 <div key={data._id || index} className="col-12">
//                   <div className="card shadow-sm border-0 h-100">
//                     {/* Card Header */}
//                     <div className="card-header bg-white border-bottom py-3 d-flex flex-column flex-md-row justify-content-between align-items-md-center">
//                       <div className="d-flex align-items-center gap-2 mb-2 mb-md-0">
//                         {isReplace ? (
//                           <span className="badge bg-primary p-2"><FaExchangeAlt /> Replacement</span>
//                         ) : (
//                           <span className="badge bg-warning text-dark p-2"><FaUndo /> Return</span>
//                         )}
//                         <span className="text-muted small">ID: {data._id}</span>
//                       </div>
//                       <div className="d-flex align-items-center gap-2">
//                         <span className="text-muted small me-2">Requested: {formatDate(data.createdAt)}</span>
//                         <span className={`badge ${getStatusBadge(data.status)} d-flex align-items-center gap-1 px-3 py-2 rounded-pill`}>
//                           {getStatusIcon(data.status)}
//                           <span className="text-capitalize">{data.status.replace("_", " ")}</span>
//                         </span>
//                         <button 
//                           className="btn btn-sm btn-outline-primary ms-2"
//                           onClick={() => navigate(`/ReturnReplaceDetails/${shipmentId}/${data._id}`)}
//                         >
//                           <FaEye className="me-1" /> View Details
//                         </button>
//                       </div>
//                     </div>

//                     {/* Rest of the card remains the same as your original */}
//                     <div className="card-body">
//                       <div className="row g-4">
//                         <div className="col-lg-7 border-end-lg">
//                           <h6 className="fw-bold mb-3 text-secondary">Items Included</h6>
//                           {data.items.map((item, idx) => (
//                             <div key={idx} className="d-flex gap-3 mb-3 p-2 border rounded bg-light">
//                               <div style={{width: '70px', height: '70px', flexShrink: 0}}>
//                                 <img
//                                   src={item.images[0] || "https://via.placeholder.com/70"}
//                                   alt="Proof"
//                                   className="w-100 h-100 object-fit-cover rounded border"
//                                 />
//                               </div>
//                               <div className="flex-grow-1">
//                                 <div className="d-flex justify-content-between">
//                                   <h6 className="mb-1 fw-bold">Product ID: <span className="text-primary">{item.productId}</span></h6>
//                                   <span className="badge bg-secondary">Qty: {item.quantity}</span>
//                                 </div>
//                                 <p className="mb-1 small text-muted">
//                                   Variant: {item.variant?.shadeName || item.variant?.sku || "N/A"}
//                                 </p>
//                                 <div className="small">
//                                   <span className="fw-bold">Reason:</span> {item.reason.replace("_", " ")}
//                                   {item.reasonDescription && <span className="text-muted"> ({item.reasonDescription})</span>}
//                                 </div>
//                               </div>
//                             </div>
//                           ))}

//                           {data.waybill && (
//                             <div className="mt-3 p-3 bg-info bg-opacity-10 rounded border border-info">
//                               <div className="d-flex justify-content-between align-items-center">
//                                 <div>
//                                   <span className="fw-bold d-block text-dark">Courier: {data.courier_name || data.provider}</span>
//                                   <span className="small text-muted">Waybill: {data.waybill}</span>
//                                 </div>
//                                 {data.tracking_url && (
//                                   <a href={data.tracking_url} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-info">
//                                     Track Courier
//                                   </a>
//                                 )}
//                               </div>
//                             </div>
//                           )}
//                         </div>

//                         <div className="col-lg-5">
//                           <h6 className="fw-bold mb-3 text-secondary">Tracking Status</h6>
//                           <div className="tracking-timeline" style={{maxHeight: '300px', overflowY: 'auto'}}>
//                             {data.tracking_history && data.tracking_history.length > 0 ? (
//                               <ul className="list-unstyled border-start ms-2 ps-3 border-2">
//                                 {[...data.tracking_history].reverse().map((event, tIdx) => (
//                                   <li key={tIdx} className="mb-3 position-relative">
//                                     <div className="position-absolute start-0 top-0 translate-middle rounded-circle bg-primary" 
//                                          style={{width: '10px', height: '10px', left: '-17px', marginTop: '6px'}}></div>
//                                     <p className="mb-0 fw-bold text-capitalize small">{event.status.replace(/_/g, " ")}</p>
//                                     <p className="mb-0 text-muted small" style={{fontSize: '0.85rem'}}>{event.description}</p>
//                                     <small className="text-muted d-flex align-items-center gap-1" style={{fontSize: '0.75rem'}}>
//                                       <FaClock size={10}/> {formatDateTime(event.timestamp)}
//                                       {event.location && (
//                                         <>
//                                           <span className="mx-1">|</span>
//                                           <FaMapMarkerAlt size={10}/> {event.location}
//                                         </>
//                                       )}
//                                     </small>
//                                   </li>
//                                 ))}
//                               </ul>
//                             ) : (
//                               <div className="text-center text-muted py-4 small">
//                                 <p className="mb-0">Processing request...</p>
//                                 {data.status === 'cancelled' && <p className="text-danger">Request Cancelled</p>}
//                               </div>
//                             )}
//                           </div>

//                           {data.pickup_details && (
//                             <div className="mt-3 pt-3 border-top">
//                               <small className="text-uppercase text-muted fw-bold" style={{fontSize: '0.7rem'}}>Pickup Address</small>
//                               <p className="mb-0 small fw-bold">{data.pickup_details.name}</p>
//                               <p className="mb-0 small text-muted text-truncate">
//                                 {data.pickup_details.address}, {data.pickup_details.city} - {data.pickup_details.pincode}
//                               </p>
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     </div>

//                     {data.audit_trail && data.audit_trail.length > 0 && (
//                       <div className="card-footer bg-light text-muted small">
//                         Last update: {formatDateTime(data.updatedAt)} •
//                         <span className="ms-1 fst-italic">
//                            Latest note: {data.audit_trail[data.audit_trail.length-1]?.notes || "Status updated"}
//                         </span>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default ReturnReplace;
































import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import axios from "axios";
import {
  FaArrowLeft, FaBoxOpen, FaExchangeAlt, FaUndo, FaTruck,
  FaCheckCircle, FaTimesCircle, FaClock, FaEye
} from "react-icons/fa";

// API Endpoint
const RETURNS_API = "https://beauty.joyory.com/api/returns/my";

/* --- Helper Functions --- */
const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
};

const getStatusBadge = (status) => {
  switch (status?.toLowerCase()) {
    case "requested": return "bg-warning text-dark";
    case "approved": return "bg-info text-white";
    case "pickup_scheduled": return "bg-primary text-white";
    case "picked_up": return "bg-primary text-white";
    case "in_transit": return "bg-info text-white";
    case "delivered": case "refunded": case "replaced": return "bg-success text-white";
    case "cancelled": case "rejected": return "bg-danger text-white";
    default: return "bg-secondary text-white";
  }
};

const getStatusIcon = (status) => {
  switch (status?.toLowerCase()) {
    case "requested": return <FaClock />;
    case "picked_up": case "in_transit": return <FaTruck />;
    case "delivered": case "refunded": return <FaCheckCircle />;
    case "cancelled": return <FaTimesCircle />;
    default: return <FaBoxOpen />;
  }
};

const ReturnReplace = () => {
  const navigate = useNavigate();
  const [requestList, setRequestList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReturns();
  }, []);

  const fetchReturns = async () => {
    setLoading(true);
    try {
      const res = await axios.get(RETURNS_API, { withCredentials: true });
      if (res.data?.success) {
        // Your backend returns { success: true, data: flattenedArray }
        setRequestList(res.data.data || []);
      } else {
        setError("Failed to load return requests.");
      }
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) navigate("/login");
      else setError("Something went wrong while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  /* --- NAVIGATION FUNCTION --- */
  // entry contains: { shipmentId, returnId, return: { ... } }
  const handleViewDetails = (entry) => {
    const shipmentId = entry.shipmentId;
    const returnId = entry.returnId;
    const returnData = entry.return;

    // Navigate to details page and pass the data in state to avoid re-fetching
    navigate(`/ReturnReplaceDetails/${shipmentId}/${returnId}`, {
      state: { returnData: returnData }
    });
  };

  if (loading)
    return (
      <>
        <Header />
        <div className="container py-5 text-center" style={{ minHeight: "60vh" }}>
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-2 text-muted">Loading your requests...</p>
        </div>
        <Footer />
      </>
    );

  return (
    <>
      <Header />
      <div className="container mt-4 mb-5" style={{ minHeight: "60vh" }}>
        <div className="d-flex align-items-center mb-4">
          <button className="btn btn-outline-secondary me-3" onClick={() => navigate("/profile")}>
            <FaArrowLeft />
          </button>
          <h4 className="mb-0 fw-bold page-title-main-name">My Returns & Replacements</h4>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        {requestList.length === 0 && !error ? (
          <div className="text-center py-5 border rounded bg-light page-title-main-name">
            <FaBoxOpen size={50} className="text-muted mb-3" />
            <h5>No requests found</h5>
            <button className="btn btn-primary page-title-main-name" onClick={() => navigate("/orders")}>Go to Orders</button>
          </div>
        ) : (
          <div className="row">
            {requestList.map((entry, index) => {
              // DIRECT MAPPING TO YOUR BACKEND RESPONSE
              const returnData = entry.return;
              const isReplace = returnData.type === "replace";

              return (
                <div key={entry.returnId || index} className="col-12 mb-4">
                  <div className="card shadow-sm border-0">
                    <div className="card-header bg-white border-bottom py-3 d-flex flex-column flex-md-row justify-content-between align-items-md-center">


                        <div className="ms-lg-4 ms-0 ms-md-4 mb-5 mt-4 mt-md-4 ">
                          {isReplace ? (
                            <span className="badge bg-primary p-2 page-title-main-name"><FaExchangeAlt /> Replacement ID: {returnData._id}</span>
                          ) : (
                            <span className="badge bg-warning text-dark p-2 page-title-main-name mt-1"><FaUndo /> Return ID: {returnData._id}</span>
                          )}
                        </div>



                      <div className="d-flex align-items-center gap-2 mt-2 mt-lg-0 justify-content-start justify-md-content-end">
                        <span className={`${getStatusBadge(returnData.status)} d-flex align-items-center gap-1 px-3 py-2 rounded-pill`}>
                          {getStatusIcon(returnData.status)}
                          <span className="text-capitalize page-title-main-name">{returnData.status.replace("_", " ")}</span>
                        </span>

                        {/* --- VIEW DETAILS BUTTON --- */}
                        {/* We pass the whole 'entry' object which contains shipmentId */}
                      </div>

                    </div>

                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-8">
                          <h6 className="fw-bold text-secondary page-title-main-name">Items</h6>
                          {/* Display first item as preview */}
                          {returnData.items.slice(0, 1).map((item, i) => (
                            <div key={i} className="d-flex gap-2 align-items-center">
                              <img
                                src={item.images?.[0] || "https://via.placeholder.com/50"}
                                alt="Product"
                                style={{ width: 50, height: 50, objectFit: "cover" }}
                                className="rounded border"
                              />
                              <div>
                                <div className="small fw-bold page-title-main-name">Product ID: {item.productId}</div>
                                <div className="small text-muted page-title-main-name">Reason: {item.reason}</div>
                              </div>
                            </div>
                          ))}
                          {returnData.items.length > 1 && (
                            <small className="text-muted ms-1 page-title-main-name">
                              +{returnData.items.length - 1} more items
                            </small>
                          )}
                        </div>
                        <div className="col-md-4 text-md-end mt-3 mt-md-0">
                          <div className="small text-muted page-title-main-name">Created Date :- {formatDate(returnData.createdAt)}</div>
                          <div className="fw-bold page-title-main-name"></div>
                          {/* Display Shipment ID from the root entry object */}
                          <div className="small text-muted mt-2 page-title-main-name">Shipment Ref :- {entry.shipmentId}</div>
                          {/* <div className="text-monospace small page-title-main-name">{entry.shipmentId}</div> */}


                          <button
                            className="btn btn-sm btn-outline-primary ms-2 mt-3"
                            onClick={() => handleViewDetails(entry)}
                          >
                            <FaEye className="me-1" /> View Details
                          </button>


                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default ReturnReplace;