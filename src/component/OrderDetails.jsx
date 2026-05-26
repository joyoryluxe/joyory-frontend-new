// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate, useLocation } from "react-router-dom";
// import Header from "./Header";
// import Footer from "./Footer";
// import InvoiceGenerator from "./InvoiceGenerator";
// import {
//   FaCheckCircle, FaBox, FaTruck, FaTimesCircle, FaClock,
//   FaArrowLeft, FaShippingFast, FaInfoCircle, FaBan, FaExclamationTriangle,
//   FaCamera, FaTrash, FaUndo, FaExchangeAlt
// } from "react-icons/fa";
// import axios from "axios";

// /* ---------- backend rule map ---------- */
// export const RETURN_REASON_RULES = {
//   DAMAGED: { imagesRequired: true },
//   WRONG_ITEM: { imagesRequired: true },
//   EXPIRED: { imagesRequired: true },
//   QUALITY_ISSUE: { imagesRequired: true },
//   SIZE_ISSUE: { imagesRequired: false },
//   NO_LONGER_NEEDED: { imagesRequired: false }
// };

// /* ---------- helpers ---------- */
// const formatDate = (d) => {
//   if (!d) return "N/A";
//   const dt = new Date(d);
//   return `${String(dt.getDate()).padStart(2, "0")}-${String(dt.getMonth() + 1).padStart(2, "0")}-${dt.getFullYear()}`;
// };
// const formatDateTime = (d) => {
//   if (!d) return "N/A";
//   const dt = new Date(d);
//   return `${formatDate(d)} ${String(dt.getHours()).padStart(2, "0")}:${String(dt.getMinutes()).padStart(2, "0")}`;
// };
// const formatCurrency = (n) => (n ? Number(n).toFixed(2) : "0.00");
// const getWaybill = (s) => s?.waybill || s?.awb || s?.courier?.awb || null;

// /* ---------- component ---------- */
// const OrderDetails = () => {
//   const { shipmentId } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const selectedProduct = location.state?.selectedProduct;

//   /* ---- state ---- */
//   const [shipmentData, setShipmentData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   /* cancellation */
//   const [cancelling, setCancelling] = useState(false);
//   const [showCancelModal, setShowCancelModal] = useState(false);
//   const [cancelReason, setCancelReason] = useState("");

//   /* return / replace */
//   const [returnForms, setReturnForms] = useState({}); // key = product index
//   const [returning, setReturning] = useState(false);

//   /* ---- data fetch ---- */
//   const fetchShipmentDetails = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await axios.get(
//         `https://beauty.joyory.com/api/user/cart/shipment/${shipmentId}`,
//         { withCredentials: true }
//       );
//       if (res.data?.success) {
//         let d = { ...res.data };
//         const wb = getWaybill(d);
//         if (wb) {
//           if (!d.waybill) d.waybill = wb;
//           if (!d.awb) d.awb = wb;
//         }
//         setShipmentData(d);
//       } else setError("Failed to fetch shipment details");
//     } catch (err) {
//       console.error(err);
//       if (err.response?.status === 401) navigate("/login");
//       else setError(err.response?.data?.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchShipmentDetails();
//     // eslint-disable-next-line
//   }, [shipmentId]);

//   /* ---- cancellation logic ---- */
//   const isCancellable = (st) => {
//     if (!st) return false;
//     const blocked = ["picked up", "in transit", "out for delivery", "delivered", "cancelled"];
//     return !blocked.includes(st.toLowerCase());
//   };
//   const initiateCancellation = () => {
//     setCancelReason("");
//     setShowCancelModal(true);
//   };
//   const handleConfirmCancel = async () => {
//     if (!cancelReason.trim()) return alert("Reason required");
//     if (cancelling) return;
//     const orderId = shipmentData?.orderInfo?._id;
//     const waybill = getWaybill(shipmentData);
//     if (!orderId) return alert("Order ID missing");
//     if (!waybill) return alert("Waybill not assigned yet");
//     setCancelling(true);
//     try {
//       const res = await axios.put(
//         `https://beauty.joyory.com/api/user/cart/shipment/cancel/${shipmentId}`,
//         { orderId, reason: cancelReason.trim() },
//         { withCredentials: true }
//       );
//       if (res.data?.success) {
//         alert(res.data.message || "Cancelled");
//         setShowCancelModal(false);
//         fetchShipmentDetails();
//       } else alert(res.data?.message || "Failed");
//     } catch (e) {
//       alert(e.response?.data?.message || "Error");
//     } finally {
//       setCancelling(false);
//     }
//   };

//   /* ---------- RETURN / REPLACE ---------- */
//   const RETURN_REASONS = {
//     return: Object.keys(RETURN_REASON_RULES),
//     replace: Object.keys(RETURN_REASON_RULES)
//   };

//   /* open form for one item */
//   const openReturnForm = (idx, type) => {
//     setReturnForms((prev) => ({
//       ...prev,
//       [idx]: { type, reason: "", description: "", images: [] }
//     }));
//   };
//   const closeReturnForm = (idx) => {
//     setReturnForms((prev) => {
//       const copy = { ...prev };
//       delete copy[idx];
//       return copy;
//     });
//   };

//   /* handle file upload */
//   const handleReturnImages = (idx, files) => {
//     if (!files || !files.length) return;
//     const form = returnForms[idx];
//     if (!form) return;
//     const total = form.images.length + files.length;
//     if (total > 5) return alert("Max 5 images allowed");
//     const newImgs = Array.from(files).map((file) =>
//       Object.assign(file, { preview: URL.createObjectURL(file) })
//     );
//     setReturnForms((prev) => ({
//       ...prev,
//       [idx]: { ...form, images: [...form.images, ...newImgs] }
//     }));
//   };
//   const removeReturnImage = (idx, i) => {
//     const form = returnForms[idx];
//     if (!form) return;
//     const copy = { ...form, images: form.images.filter((_, k) => k !== i) };
//     setReturnForms((prev) => ({ ...prev, [idx]: copy }));
//   };

//   /* submit return / replace */
//   // const submitReturn = async (idx) => {
//   //   const form = returnForms[idx];
//   //   if (!form) return;
//   //   if (!form.reason) return alert("Please select a reason");

//   //   /* ---- image enforcement ---- */
//   //   const rule = RETURN_REASON_RULES[form.reason];
//   //   if (rule?.imagesRequired && form.images.length === 0) {
//   //     return alert(`Images are required for reason: ${form.reason}`);
//   //   }

//   //   const product = shipmentData.products[idx];
//   //   if (!product) return;

//   //   const body = new FormData();
//   //   body.append("type", form.type);
//   //   body.append("reason", form.reason);
//   //   body.append("reasonDescription", form.description.trim());
//   //   // body.append(
//   //   //   "items",
//   //   //   JSON.stringify([
//   //   //     {
//   //   //       productId: product.productId || product._id,
//   //   //       quantity: product.qty,
//   //   //       variant: product.variant
//   //   //         ? { sku: product.variant.sku, name: product.variant.name }
//   //   //         : undefined
//   //   //     }
//   //   //   ])
//   //   // );


//   //   body.append(
//   //     "items",
//   //     JSON.stringify([
//   //       {
//   //         productId: product.productId || product._id,
//   //         quantity: product.qty,
//   //         variant: product.variant
//   //           ? {
//   //             sku: product.variant.sku || product.variant, // fallback to string
//   //             name: product.variant.name || product.variant
//   //           }
//   //           : undefined
//   //       }
//   //     ])
//   //   );
//   //   form.images.forEach((file) => body.append(`images_${product.productId || product._id}`, file));

//   //   setReturning(true);
//   //   try {
//   //     const res = await axios.post(
//   //       `https://beauty.joyory.com/api/returns/request/${shipmentId}`,
//   //       body,
//   //       { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } }
//   //     );
//   //     if (res.data?.success) {
//   //       alert(res.data.message);
//   //       closeReturnForm(idx);
//   //       fetchShipmentDetails();
//   //     } else alert(res.data?.message || "Failed");
//   //   } catch (e) {
//   //     alert(e.response?.data?.message || "Error");
//   //   } finally {
//   //     setReturning(false);
//   //   }
//   // };








//       const submitReturn = async (idx) => {
//   console.group(`🟡 RETURN / REPLACE FLOW — ITEM INDEX: ${idx}`);

//   try {
//     /* =======================
//        1️⃣ BASIC FORM CHECK
//     ======================= */
//     const form = returnForms[idx];
//     console.log("📋 Form Data:", form);

//     if (!form) {
//       console.error("❌ Form not found for index:", idx);
//       return;
//     }

//     if (!form.reason) {
//       console.warn("⚠️ Reason not selected");
//       alert("Please select a reason");
//       return;
//     }

//     /* =======================
//        2️⃣ IMAGE RULE CHECK
//     ======================= */
//     const rule = RETURN_REASON_RULES[form.reason];
//     console.log("📏 Reason Rule:", rule);

//     if (rule?.imagesRequired && form.images.length === 0) {
//       console.error("❌ Images required but none provided");
//       alert(`Images are required for reason: ${form.reason}`);
//       return;
//     }

//     /* =======================
//        3️⃣ PRODUCT VALIDATION
//     ======================= */
//     const product = shipmentData?.products?.[idx];

//     if (!product) {
//       console.error("❌ Product not found at index:", idx);
//       return;
//     }

//     const productId = product.productId || product._id;
//     const rawVariant = product.variant;

//     const normalizedVariant = rawVariant
//       ? {
//           sku: rawVariant?.sku || rawVariant,
//           name: rawVariant?.name || rawVariant
//         }
//       : null;

//     console.log("🛍️ Product Name:", product.name);
//     console.log("🆔 Product ID:", productId);
//     console.log("📦 Quantity:", product.qty);
//     console.log("🎨 Raw Variant:", rawVariant);
//     console.log("🔖 Normalized Variant:", normalizedVariant);
//     console.log("🔁 Request Type:", form.type);

//     if (!productId) {
//       console.error("❌ Product ID is missing");
//       alert("Product ID missing. Cannot proceed.");
//       return;
//     }

//     /* =======================
//        4️⃣ BUILD FORMDATA
//     ======================= */
//     const body = new FormData();

//     body.append("type", form.type);
//     body.append("reason", form.reason);
//     body.append("reasonDescription", form.description?.trim() || "");

//     const itemsPayload = [
//       {
//         productId,
//         quantity: product.qty,
//         variant: normalizedVariant
//       }
//     ];

//     body.append("items", JSON.stringify(itemsPayload));

//     console.log("📦 Items Payload (JSON):", itemsPayload);

//     /* =======================
//        5️⃣ IMAGE ATTACHMENT
//     ======================= */
//     console.log(`🖼️ Attaching ${form.images.length} image(s)`);

//     form.images.forEach((file, i) => {
//       console.log(`📎 Image ${i + 1}:`, {
//         name: file.name,
//         size: file.size,
//         type: file.type
//       });

//       body.append(`images_${productId}`, file);
//     });

//     /* =======================
//        6️⃣ FINAL FORMDATA DUMP
//     ======================= */
//     console.group("📤 FINAL FORMDATA PAYLOAD");
//     for (let pair of body.entries()) {
//       console.log(pair[0], "➡️", pair[1]);
//     }
//     console.groupEnd();

//     /* =======================
//        7️⃣ API CALL
//     ======================= */
//     setReturning(true);

//     console.group("🚀 RETURN / REPLACE API CALL");
//     console.log("🌐 Endpoint:", `/api/returns/request/${shipmentId}`);
//     console.log("📦 Shipment ID:", shipmentId);
//     console.groupEnd();

//     const res = await axios.post(
//       `https://beauty.joyory.com/api/returns/request/${shipmentId}`,
//       body,
//       {
//         withCredentials: true,
//         headers: { "Content-Type": "multipart/form-data" }
//       }
//     );

//     console.log("✅ API Response:", res.data);

//     if (res.data?.success) {
//       alert(res.data.message);
//       closeReturnForm(idx);
//       fetchShipmentDetails();
//     } else {
//       console.error("❌ API Failure:", res.data);
//       alert(res.data?.message || "Failed");
//     }

//   } catch (error) {
//     console.error("🔥 RETURN / REPLACE ERROR:", error);
//     alert(error.response?.data?.message || "Something went wrong");
//   } finally {
//     setReturning(false);
//     console.groupEnd(); // END MAIN GROUP
//   }
// };







//   /* check if item already has an active return */
//   const hasActiveReturn = (p) => {
//     const returns = shipmentData?.returns || [];
//     return returns.some(
//       (r) =>
//         ["requested", "pickup_scheduled", "in_transit", "pickup_pending"].includes(r.status) &&
//         r.items.some((i) => i.productId.toString() === (p.productId || p._id).toString())
//     );
//   };

//   /* ---------- UI helpers ---------- */
//   const getStatusIcon = (st) => {
//     switch (st?.toLowerCase()) {
//       case "delivered": return <FaTruck className="status-icon delivered" />;
//       case "shipped":
//       case "in transit": return <FaShippingFast className="status-icon shipped" />;
//       case "confirmed": return <FaCheckCircle className="status-icon confirmed" />;
//       case "cancelled": return <FaTimesCircle className="status-icon cancelled" />;
//       default: return <FaClock className="status-icon pending" />;
//     }
//   };
//   const getStatusColor = (st) => {
//     switch (st?.toLowerCase()) {
//       case "delivered": return "success";
//       case "shipped":
//       case "in transit": return "info";
//       case "confirmed": return "warning";
//       case "cancelled": return "danger";
//       default: return "secondary";
//     }
//   };
//   const getTrackingStatusIcon = (st) => {
//     switch (st?.toLowerCase()) {
//       case "delivered": return <FaTruck className="text-success" />;
//       case "in transit": return <FaShippingFast className="text-info" />;
//       case "cancelled": return <FaTimesCircle className="text-danger" />;
//       case "pickup scheduled": return <FaClock className="text-warning" />;
//       case "shipment created": return <FaBox className="text-primary" />;
//       default: return <FaInfoCircle className="text-secondary" />;
//     }
//   };
//   const isSelectedProduct = (p) => selectedProduct && p.name === selectedProduct.name;

//   /* ---------- render ---------- */
//   if (loading)
//     return (
//       <>
//         <Header />
//         <div className="container mt-4 text-center py-5">
//           <div className="spinner-border text-primary" />
//           <p className="mt-2">Loading Shipment...</p>
//         </div>
//         <Footer />
//       </>
//     );

//   if (error || !shipmentData)
//     return (
//       <>
//         <Header />
//         <div className="container mt-4 text-center py-5">
//           <div className="alert alert-danger">{error || "No data available"}</div>
//           <button className="btn btn-primary" onClick={() => navigate(-1)}>Go Back</button>
//         </div>
//         <Footer />
//       </>
//     );

//   const priceDetails = shipmentData.priceDetails || {};
//   const orderInfo = shipmentData.orderInfo || {};
//   const courier = shipmentData.courier || {};
//   const trackingTimeline = shipmentData.trackingTimeline || [];

//   return (
//     <>
//       <Header />
//       <div className="container mt-4 mb-5 position-relative">
//         {/* ---------- header ---------- */}
//         <button className="btn btn-outline-secondary mb-4" onClick={() => navigate(-1)}>
//           <FaArrowLeft className="me-2" /> Back to Orders
//         </button>

//         <div className="card mb-4 border-0 shadow-sm">
//           <div className="card-header bg-primary text-white d-flex flex-column flex-md-row justify-content-between align-items-md-center">
//             <div>
//               <h5 className="mb-0">Order Details</h5>
//               <small className="text-white-50">Order ID: {orderInfo.orderId}</small>
//             </div>
//             <div className="d-flex gap-2 mt-2 mt-md-0 align-items-center flex-wrap">
//               {isCancellable(shipmentData.shipmentStatus) && getWaybill(shipmentData) && (
//                 <button className="btn btn-danger btn-sm" onClick={initiateCancellation}>
//                   <FaBan /> Cancel Shipment
//                 </button>
//               )}
//               <InvoiceGenerator
//                 order={{ ...shipmentData, totalDiscount: parseFloat(priceDetails.youSaved) }}
//                 items={shipmentData.products?.map((p) => ({
//                   productId: { name: p.name, variant: p.variant, images: [p.image] },
//                   quantity: p.qty,
//                   price: p.sellingPrice,
//                   mrp: p.mrp,
//                   total: p.total
//                 }))}
//                 shippingAddress={shipmentData.shippingAddress}
//                 paymentMethod={shipmentData.paymentMethod || "Online"}
//               />
//               <div className="bg-white bg-opacity-25 px-3 py-1 rounded-pill d-flex align-items-center gap-2">
//                 {getStatusIcon(shipmentData.shipmentStatus)}
//                 <span className="fw-bold">{shipmentData.shipmentStatus}</span>
//               </div>
//             </div>
//           </div>

//           <div className="card-body">
//             <div className="row">
//               <div className="col-md-6 mb-3 border-end">
//                 <p className="mb-1"><strong>Shipment ID:</strong> <span className="text-muted">{shipmentData.shipmentId}</span></p>
//                 <p className="mb-1"><strong>Order Date:</strong> <span className="text-muted">{formatDate(orderInfo.orderDate)}</span></p>
//                 <p className="mb-0"><strong>Status:</strong> <span className={`text-${getStatusColor(shipmentData.shipmentStatus)} fw-bold`}>{shipmentData.shipmentStatus}</span></p>
//               </div>
//               <div className="col-md-6">
//                 <p className="mb-1"><strong>Expected Delivery:</strong> <span className="text-success">{shipmentData.expectedDelivery ? formatDate(shipmentData.expectedDelivery) : "TBD"}</span></p>
//                 <p className="mb-1"><strong>Courier:</strong> <span className="text-muted">{courier.name || "Assigning..."}</span></p>
//                 {getWaybill(shipmentData) && (
//                   <p className="mb-0">
//                     <strong>Waybill/AWB:</strong>
//                     <span className="badge bg-warning text-dark border">{getWaybill(shipmentData)}</span>
//                   </p>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* ---------- content ---------- */}
//         <div className="row">
//           <div className="col-lg-8">
//             {/* items list */}
//             <div className="card mb-4 border-0 shadow-sm">
//               <div className="card-header bg-light fw-bold">Items in Shipment</div>
//               <div className="card-body">
//                 {shipmentData.products?.map((p, idx) => {
//                   const form = returnForms[idx];
//                   const activeReturn = hasActiveReturn(p);
//                   const canOpenReturn =
//                     shipmentData.shipmentStatus === "Delivered" && !activeReturn;

//                   return (
//                     <div
//                       key={idx}
//                       className={`row mb-3 pb-3 border-bottom ${isSelectedProduct(p) ? "bg-light border border-primary rounded p-2" : ""}`}
//                     >
//                       <div className="col-2">
//                         <img src={p.image} className="img-fluid rounded border" alt={p.name} />
//                       </div>
//                       <div className="col-6">
//                         <h6 className="mb-0 fw-bold">{p.name}</h6>
//                         <small className="text-muted">Variant: {p.variant} | Qty: {p.qty}</small>

//                         {/* ===== RETURN / REPLACE SECTION ===== */}
//                         {canOpenReturn && !form && (
//                           <div className="mt-2">
//                             <button
//                               className="btn btn-sm btn-outline-primary me-2"
//                               onClick={() => openReturnForm(idx, "return")}
//                             >
//                               <FaUndo /> Return
//                             </button>
//                             <button
//                               className="btn btn-sm btn-outline-secondary"
//                               onClick={() => openReturnForm(idx, "replace")}
//                             >
//                               <FaExchangeAlt /> Replace
//                             </button>
//                           </div>
//                         )}

//                         {activeReturn && (
//                           <div className="mt-2">
//                             <span className="badge bg-warning text-dark">Return/Replace already requested</span>
//                           </div>
//                         )}

//                         {form && (
//                           <div className="mt-3 border rounded p-3 bg-white">
//                             <div className="d-flex justify-content-between align-items-center mb-2">
//                               <h6 className="mb-0 text-capitalize">{form.type} Item</h6>
//                               <button className="btn btn-sm btn-link" onClick={() => closeReturnForm(idx)}>
//                                 <FaTimesCircle />
//                               </button>
//                             </div>

//                             <div className="mb-2">
//                               <label className="form-label fw-bold">Reason</label>
//                               <select
//                                 className="form-select form-select-sm"
//                                 value={form.reason}
//                                 onChange={(e) =>
//                                   setReturnForms((prev) => ({
//                                     ...prev,
//                                     [idx]: { ...prev[idx], reason: e.target.value }
//                                   }))
//                                 }
//                               >
//                                 <option value="">-- Select --</option>
//                                 {RETURN_REASONS[form.type].map((r) => (
//                                   <option key={r} value={r}>{r}</option>
//                                 ))}
//                               </select>
//                             </div>

//                             <div className="mb-2">
//                               <label className="form-label fw-bold">Description (optional)</label>
//                               <textarea
//                                 className="form-control form-control-sm"
//                                 rows="2"
//                                 value={form.description}
//                                 onChange={(e) =>
//                                   setReturnForms((prev) => ({
//                                     ...prev,
//                                     [idx]: { ...prev[idx], description: e.target.value }
//                                   }))
//                                 }
//                                 placeholder="e.g. broken seal, wrong colour..."
//                               />
//                             </div>

//                             <div className="mb-2">
//                               <label className="form-label fw-bold">Images (max 5)</label>
//                               <div
//                                 className="border rounded p-2 text-center cursor-pointer"
//                                 onClick={() => document.getElementById(`ret-img-${idx}`).click()}
//                               >
//                                 <FaCamera className="mb-1" /> Click or drop images here
//                               </div>
//                               <input
//                                 id={`ret-img-${idx}`}
//                                 type="file"
//                                 multiple
//                                 accept="image/*"
//                                 className="d-none"
//                                 onChange={(e) => handleReturnImages(idx, e.target.files)}
//                               />
//                               <div className="d-flex flex-wrap gap-2 mt-2">
//                                 {form.images.map((img, i) => (
//                                   <div key={i} className="position-relative">
//                                     <img
//                                       src={img.preview}
//                                       alt=""
//                                       className="rounded border"
//                                       style={{ width: 60, height: 60, objectFit: "cover" }}
//                                     />
//                                     <button
//                                       className="btn btn-danger btn-xs position-absolute top-0 end-0"
//                                       onClick={() => removeReturnImage(idx, i)}
//                                     >
//                                       <FaTrash />
//                                     </button>
//                                   </div>
//                                 ))}
//                               </div>
//                             </div>

//                             <button
//                               className="btn btn-sm btn-success"
//                               disabled={returning || !form.reason}
//                               onClick={() => submitReturn(idx)}
//                             >
//                               {returning ? "Processing..." : "Submit Request"}
//                             </button>
//                           </div>
//                         )}
//                       </div>

//                       <div className="col-4 text-end">
//                         <div className="fw-bold">₹{formatCurrency(p.sellingPrice)}</div>
//                         <s className="text-muted small">₹{formatCurrency(p.mrp)}</s>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>

//             {/* tracking history */}
//             {trackingTimeline.length > 0 && (
//               <div className="card mb-4 border-0 shadow-sm">
//                 <div className="card-header bg-light fw-bold">Tracking History</div>
//                 <div className="card-body">
//                   <div className="timeline">
//                     {trackingTimeline.slice().reverse().map((evt, i) => (
//                       <div key={i} className="timeline-item mb-4 d-flex gap-3">
//                         <div className="timeline-marker" style={{ minWidth: 20 }}>
//                           {getTrackingStatusIcon(evt.status)}
//                         </div>
//                         <div className="timeline-content">
//                           <h6 className="mb-0 fw-bold text-capitalize">{evt.status}</h6>
//                           <small className="text-muted d-block">{evt.description}</small>
//                           <small className="text-muted" style={{ fontSize: 11 }}>
//                             {formatDateTime(evt.timestamp)} | {evt.location || "N/A"}
//                           </small>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* ---------- price + address ---------- */}
//           <div className="col-lg-4">
//             <div className="card mb-4 border-0 shadow-sm">
//               <div className="card-header bg-light fw-bold">Price Summary</div>
//               <div className="card-body">
//                 <div className="d-flex justify-content-between mb-2"><span>Total MRP</span><span>₹{formatCurrency(priceDetails.totalMRP)}</span></div>
//                 <div className="d-flex justify-content-between mb-2"><span>Discounted Price</span><span>₹{formatCurrency(priceDetails.discountedTotalMRP)}</span></div>
//                 <div className="d-flex justify-content-between mb-2"><span>GST</span><span className="text-info">+₹{formatCurrency(priceDetails.otherCharges)}</span></div>
//                 <div className="d-flex justify-content-between mb-3"><span>Offers</span><span className="text-success">{priceDetails.otherDiscounts}</span></div>
//                 <hr />
//                 <div className="d-flex justify-content-between fw-bold fs-5"><span>Total Paid</span><span className="text-primary">₹{formatCurrency(priceDetails.orderTotal)}</span></div>
//               </div>
//             </div>

//             <div className="card border-0 shadow-sm">
//               <div className="card-header bg-light fw-bold">Shipping Address</div>
//               <div className="card-body small">
//                 <div className="fw-bold">{shipmentData.shippingAddress?.name}</div>
//                 <div>{shipmentData.shippingAddress?.addressLine1}</div>
//                 <div>
//                   {shipmentData.shippingAddress?.city}, {shipmentData.shippingAddress?.state} - {shipmentData.shippingAddress?.pincode}
//                 </div>
//                 <div className="mt-2 fw-bold">Phone: {shipmentData.shippingAddress?.phone}</div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* ---------- cancellation modal ---------- */}
//         {showCancelModal && (
//           <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,.5)" }}>
//             <div className="modal-dialog modal-dialog-centered">
//               <div className="modal-content">
//                 <div className="modal-header bg-danger text-white">
//                   <h5 className="modal-title"><FaExclamationTriangle className="me-2" />Cancel Shipment</h5>
//                   <button className="btn-close btn-close-white" onClick={() => setShowCancelModal(false)} />
//                 </div>
//                 <div className="modal-body">
//                   <p>Are you sure you want to cancel this shipment? This action cannot be undone.</p>
//                   <div className="mb-2">
//                     <label className="fw-bold">Reason for Cancellation <span className="text-danger">*</span></label>
//                     <textarea
//                       className="form-control"
//                       rows="3"
//                       value={cancelReason}
//                       onChange={(e) => setCancelReason(e.target.value)}
//                       placeholder="e.g. Found a better price, Change of mind..."
//                     />
//                   </div>
//                 </div>
//                 <div className="modal-footer">
//                   <button className="btn btn-secondary" onClick={() => setShowCancelModal(false)}>Close</button>
//                   <button className="btn btn-danger" onClick={handleConfirmCancel} disabled={cancelling}>
//                     {cancelling ? "Processing..." : "Confirm Cancellation"}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default OrderDetails;



























// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate, useLocation } from "react-router-dom";
// import Header from "./Header";
// import Footer from "./Footer";
// import InvoiceGenerator from "./InvoiceGenerator";
// import {
//   FaCheckCircle, FaBox, FaTruck, FaTimesCircle, FaClock,
//   FaArrowLeft, FaShippingFast, FaInfoCircle, FaBan, FaExclamationTriangle,
//   FaCamera, FaTrash, FaUndo, FaExchangeAlt
// } from "react-icons/fa";
// import axios from "axios";

// /* ---------- constants ---------- */
// const SHIPMENT_API = "https://beauty.joyory.com/api/user/cart/shipment";
// const RETURN_API = "https://beauty.joyory.com/api/returns/request";

// /* ---------- backend rule map ---------- */
// const RETURN_REASON_RULES = {
//   DAMAGED: { imagesRequired: true },
//   WRONG_ITEM: { imagesRequired: true },
//   EXPIRED: { imagesRequired: true },
//   QUALITY_ISSUE: { imagesRequired: true },
//   SIZE_ISSUE: { imagesRequired: false },
//   NO_LONGER_NEEDED: { imagesRequired: false }
// };

// /* ---------- user-friendly reason options ---------- */
// const RETURN_REASON_OPTIONS = {
//   return: [
//     { value: "DAMAGED", label: "Defective / Damaged product" },
//     { value: "WRONG_ITEM", label: "Wrong item received" },
//     { value: "EXPIRED", label: "Expired product" },
//     { value: "QUALITY_ISSUE", label: "Quality issue" },
//     { value: "SIZE_ISSUE", label: "Size / Fit issue" },
//     { value: "NO_LONGER_NEEDED", label: "No longer needed / Change of mind" }
//   ],
//   replace: [
//     { value: "DAMAGED", label: "Defective / Damaged product" },
//     { value: "WRONG_ITEM", label: "Wrong item received" },
//     { value: "QUALITY_ISSUE", label: "Quality issue" },
//     { value: "SIZE_ISSUE", label: "Size / Fit issue" }
//   ]
// };

// /* ---------- helpers ---------- */
// const formatDate = (d) => {
//   if (!d) return "N/A";
//   const dt = new Date(d);
//   return `${String(dt.getDate()).padStart(2, "0")}-${String(dt.getMonth() + 1).padStart(2, "0")}-${dt.getFullYear()}`;
// };
// const formatDateTime = (d) => {
//   if (!d) return "N/A";
//   const dt = new Date(d);
//   return `${formatDate(d)} ${String(dt.getHours()).padStart(2, "0")}:${String(dt.getMinutes()).padStart(2, "0")}`;
// };
// const formatCurrency = (n) => (n ? Number(n).toFixed(2) : "0.00");
// const getWaybill = (s) => s?.waybill || s?.awb || s?.courier?.awb || null;

// /* ---------- component ---------- */
// const OrderDetails = () => {
//   const { shipmentId } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const selectedProduct = location.state?.selectedProduct;

//   /* ---- state ---- */
//   const [shipmentData, setShipmentData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   /* cancellation */
//   const [cancelling, setCancelling] = useState(false);
//   const [showCancelModal, setShowCancelModal] = useState(false);
//   const [cancelReason, setCancelReason] = useState("");

//   /* return / replace */
//   const [returnForms, setReturnForms] = useState({}); // key = product index
//   const [returning, setReturning] = useState(false);

//   /* ---- data fetch ---- */
//   const fetchShipmentDetails = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await axios.get(`${SHIPMENT_API}/${shipmentId}`, { withCredentials: true });
//       if (res.data?.success) {
//         let d = { ...res.data };
//         const wb = getWaybill(d);
//         if (wb) {
//           if (!d.waybill) d.waybill = wb;
//           if (!d.awb) d.awb = wb;
//         }
//         setShipmentData(d);
//       } else setError("Failed to fetch shipment details");
//     } catch (err) {
//       console.error(err);
//       if (err.response?.status === 401) navigate("/login");
//       else setError(err.response?.data?.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchShipmentDetails();
//   }, [shipmentId]);

//   /* ---- cancellation logic ---- */
//   const isCancellable = (st) => {
//     if (!st) return false;
//     const blocked = ["picked up", "in transit", "out for delivery", "delivered", "cancelled"];
//     return !blocked.includes(st.toLowerCase());
//   };

//   const initiateCancellation = () => {
//     setCancelReason("");
//     setShowCancelModal(true);
//   };

//   const handleConfirmCancel = async () => {
//     if (!cancelReason.trim()) return alert("Reason required");
//     if (cancelling) return;
//     const orderId = shipmentData?.orderInfo?._id;
//     const waybill = getWaybill(shipmentData);
//     if (!orderId) return alert("Order ID missing");
//     if (!waybill) return alert("Waybill not assigned yet");
//     setCancelling(true);
//     try {
//       const res = await axios.put(
//         `${SHIPMENT_API}/cancel/${shipmentId}`,
//         { orderId, reason: cancelReason.trim() },
//         { withCredentials: true }
//       );
//       if (res.data?.success) {
//         alert(res.data.message || "Cancelled");
//         setShowCancelModal(false);
//         fetchShipmentDetails();
//       } else alert(res.data?.message || "Failed");
//     } catch (e) {
//       alert(e.response?.data?.message || "Error");
//     } finally {
//       setCancelling(false);
//     }
//   };

//   /* ---------- RETURN / REPLACE ---------- */
//   /* open form for one item */
//   const openReturnForm = (idx, type) => {
//     const product = shipmentData.products[idx];
//     setReturnForms((prev) => ({
//       ...prev,
//       [idx]: {
//         type,
//         reason: "",
//         description: "",
//         images: [],
//         quantity: 1,
//         maxQuantity: product.qty
//       }
//     }));
//   };

//   const closeReturnForm = (idx) => {
//     setReturnForms((prev) => {
//       const copy = { ...prev };
//       delete copy[idx];
//       return copy;
//     });
//   };

//   /* handle quantity change */
//   const handleReturnQuantity = (idx, delta) => {
//     setReturnForms((prev) => {
//       const form = prev[idx];
//       if (!form) return prev;
//       let newQty = form.quantity + delta;
//       newQty = Math.max(1, Math.min(newQty, form.maxQuantity));
//       return { ...prev, [idx]: { ...form, quantity: newQty } };
//     });
//   };

//   /* handle file upload */
//   const handleReturnImages = (idx, files) => {
//     if (!files || !files.length) return;
//     const form = returnForms[idx];
//     if (!form) return;
//     const total = form.images.length + files.length;
//     if (total > 5) return alert("Max 5 images allowed");
//     const newImgs = Array.from(files).map((file) =>
//       Object.assign(file, { preview: URL.createObjectURL(file) })
//     );
//     setReturnForms((prev) => ({
//       ...prev,
//       [idx]: { ...form, images: [...form.images, ...newImgs] }
//     }));
//   };

//   const removeReturnImage = (idx, i) => {
//     const form = returnForms[idx];
//     if (!form) return;
//     const copy = { ...form, images: form.images.filter((_, k) => k !== i) };
//     setReturnForms((prev) => ({ ...prev, [idx]: copy }));
//   };

//   /* submit return / replace - fixed for variant handling */
//   const submitReturn = async (idx) => {
//     const form = returnForms[idx];
//     if (!form) return;
//     if (!form.reason) return alert("Please select a reason");

//     const rule = RETURN_REASON_RULES[form.reason];
//     if (rule?.imagesRequired && form.images.length === 0) {
//       return alert(`Images are required for reason: ${form.reason}`);
//     }

//     const product = shipmentData.products[idx];
//     if (!product) return;

//     const productId = product.productId || product._id;

//     // Extract SKU only if variant is an object with sku
//     let variantPayload = undefined;
//     if (product.variant && typeof product.variant === "object" && product.variant.sku) {
//       variantPayload = { sku: product.variant.sku };
//     }
//     // If variant is string or missing, omit variant - backend matches on productId only

//     const body = new FormData();
//     body.append("type", form.type);
//     body.append("reason", form.reason);
//     body.append("reasonDescription", form.description.trim());

//     const itemsPayload = [
//       {
//         productId,
//         quantity: form.quantity,
//         ...(variantPayload ? { variant: variantPayload } : {})
//       }
//     ];

//     body.append("items", JSON.stringify(itemsPayload));

//     form.images.forEach((file) => {
//       body.append(`images_${productId}`, file);
//     });

//     setReturning(true);
//     try {
//       const res = await axios.post(`${RETURN_API}/${shipmentId}`, body, {
//         withCredentials: true,
//         headers: { "Content-Type": "multipart/form-data" }
//       });
//       if (res.data?.success) {
//         alert(res.data.message || "Request submitted successfully");
//         closeReturnForm(idx);
//         fetchShipmentDetails();
//       } else {
//         alert(res.data?.message || "Request failed");
//       }
//     } catch (e) {
//       console.error("Return Error:", e);
//       alert(e.response?.data?.message || "Something went wrong");
//     } finally {
//       setReturning(false);
//     }
//   };

//   /* check if item already has an active return */
//   const hasActiveReturn = (p) => {
//     const returns = shipmentData?.returns || [];
//     return returns.some(
//       (r) =>
//         ["requested", "pickup_scheduled", "in_transit", "pickup_pending"].includes(r.status) &&
//         r.items.some((i) => i.productId.toString() === (p.productId || p._id).toString())
//     );
//   };

//   /* ---------- UI helpers ---------- */
//   const getStatusIcon = (st) => {
//     switch (st?.toLowerCase()) {
//       case "delivered": return <FaTruck className="status-icon delivered" />;
//       case "shipped":
//       case "in transit": return <FaShippingFast className="status-icon shipped" />;
//       case "confirmed": return <FaCheckCircle className="status-icon confirmed" />;
//       case "cancelled": return <FaTimesCircle className="status-icon cancelled" />;
//       default: return <FaClock className="status-icon pending" />;
//     }
//   };
//   const getStatusColor = (st) => {
//     switch (st?.toLowerCase()) {
//       case "delivered": return "success";
//       case "shipped":
//       case "in transit": return "info";
//       case "confirmed": return "warning";
//       case "cancelled": return "danger";
//       default: return "secondary";
//     }
//   };
//   const getTrackingStatusIcon = (st) => {
//     switch (st?.toLowerCase()) {
//       case "delivered": return <FaTruck className="text-success" />;
//       case "in transit": return <FaShippingFast className="text-info" />;
//       case "cancelled": return <FaTimesCircle className="text-danger" />;
//       case "pickup scheduled": return <FaClock className="text-warning" />;
//       case "shipment created": return <FaBox className="text-primary" />;
//       default: return <FaInfoCircle className="text-secondary" />;
//     }
//   };
//   const isSelectedProduct = (p) => selectedProduct && p.name === selectedProduct.name;

//   /* ---------- render ---------- */
//   if (loading) return (
//     <>
//       <Header />
//       <div className="container mt-4 text-center py-5">
//         <div className="spinner-border text-primary" />
//         <p className="mt-2">Loading Shipment...</p>
//       </div>
//       <Footer />
//     </>
//   );

//   if (error || !shipmentData) return (
//     <>
//       <Header />
//       <div className="container mt-4 text-center py-5">
//         <div className="alert alert-danger">{error || "No data available"}</div>
//         <button className="btn btn-primary" onClick={() => navigate(-1)}>Go Back</button>
//       </div>
//       <Footer />
//     </>
//   );

//   const priceDetails = shipmentData.priceDetails || {};
//   const orderInfo = shipmentData.orderInfo || {};
//   const courier = shipmentData.courier || {};
//   const trackingTimeline = shipmentData.trackingTimeline || [];

//   return (
//     <>
//       <Header />
//       <div className="container mt-4 mb-5 position-relative">
//         {/* Header */}
//         <button className="btn btn-outline-secondary mb-4" onClick={() => navigate(-1)}>
//           <FaArrowLeft className="me-2" /> Back to Orders
//         </button>

//         <div className="card mb-4 border-0 shadow-sm">
//           <div className="card-header bg-primary text-white d-flex flex-column flex-md-row justify-content-between align-items-md-center">
//             <div>
//               <h5 className="mb-0">Order Details</h5>
//               <small className="text-white-50">Order ID: {orderInfo.orderId}</small>
//             </div>
//             <div className="d-flex gap-2 mt-2 mt-md-0 align-items-center flex-wrap">
//               {isCancellable(shipmentData.shipmentStatus) && getWaybill(shipmentData) && (
//                 <button className="btn btn-danger btn-sm" onClick={initiateCancellation}>
//                   <FaBan /> Cancel Shipment
//                 </button>
//               )}
//               <InvoiceGenerator
//                 order={{ ...shipmentData, totalDiscount: parseFloat(priceDetails.youSaved || 0) }}
//                 items={shipmentData.products?.map((p) => ({
//                   productId: { name: p.name, variant: p.variant, images: [p.image] },
//                   quantity: p.qty,
//                   price: p.sellingPrice,
//                   mrp: p.mrp,
//                   total: p.total
//                 }))}
//                 shippingAddress={shipmentData.shippingAddress}
//                 paymentMethod={shipmentData.paymentMethod || "Online"}
//               />
//               <div className="bg-white bg-opacity-25 px-3 py-1 rounded-pill d-flex align-items-center gap-2">
//                 {getStatusIcon(shipmentData.shipmentStatus)}
//                 <span className="fw-bold">{shipmentData.shipmentStatus}</span>
//               </div>
//             </div>
//           </div>

//           <div className="card-body">
//             <div className="row">
//               <div className="col-md-6 mb-3 border-end">
//                 <p className="mb-1"><strong>Shipment ID:</strong> <span className="text-muted">{shipmentData.shipmentId}</span></p>
//                 <p className="mb-1"><strong>Order Date:</strong> <span className="text-muted">{formatDate(orderInfo.orderDate)}</span></p>
//                 <p className="mb-0"><strong>Status:</strong> <span className={`text-${getStatusColor(shipmentData.shipmentStatus)} fw-bold`}>{shipmentData.shipmentStatus}</span></p>
//               </div>
//               <div className="col-md-6">
//                 <p className="mb-1"><strong>Expected Delivery:</strong> <span className="text-success">{shipmentData.expectedDelivery ? formatDate(shipmentData.expectedDelivery) : "TBD"}</span></p>
//                 <p className="mb-1"><strong>Courier:</strong> <span className="text-muted">{courier.name || "Assigning..."}</span></p>
//                 {getWaybill(shipmentData) && (
//                   <p className="mb-0">
//                     <strong>Waybill/AWB:</strong>
//                     <span className="badge bg-warning text-dark border">{getWaybill(shipmentData)}</span>
//                   </p>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Content */}
//         <div className="row">
//           <div className="col-lg-8">
//             <div className="card mb-4 border-0 shadow-sm">
//               <div className="card-header bg-light fw-bold">Items in Shipment</div>
//               <div className="card-body">
//                 {shipmentData.products?.map((p, idx) => {
//                   const form = returnForms[idx];
//                   const activeReturn = hasActiveReturn(p);
//                   const canOpenReturn = shipmentData.shipmentStatus === "Delivered" && !activeReturn;

//                   // Variant display
//                   const variantDisplay = typeof p.variant === "object" 
//                     ? (p.variant?.shadeName || p.variant?.sku || "N/A")
//                     : (p.variant || "N/A");
//                   const skuDisplay = typeof p.variant === "object" 
//                     ? (p.variant?.sku || "N/A")
//                     : (p.variant || "N/A");

//                   return (
//                     <div key={idx} className={`row mb-3 pb-3 border-bottom ${isSelectedProduct(p) ? "bg-light border border-primary rounded p-2" : ""}`}>
//                       <div className="col-2">
//                         <img src={p.image} className="img-fluid rounded border" alt={p.name} />
//                       </div>
//                       <div className="col-6">
//                         <h6 className="mb-0 fw-bold">{p.name}</h6>
//                         <small className="text-muted">
//                           Variant: {variantDisplay} (SKU: {skuDisplay}) | Qty: {p.qty}
//                         </small>

//                         {/* Return/Replace Buttons */}
//                         {canOpenReturn && !form && (
//                           <div className="mt-2">
//                             <button className="btn btn-sm btn-outline-primary me-2" onClick={() => openReturnForm(idx, "return")}>
//                               <FaUndo /> Return
//                             </button>
//                             <button className="btn btn-sm btn-outline-secondary" onClick={() => openReturnForm(idx, "replace")}>
//                               <FaExchangeAlt /> Replace
//                             </button>
//                           </div>
//                         )}

//                         {activeReturn && (
//                           <div className="mt-2">
//                             <span className="badge bg-warning text-dark">Return/Replace already requested</span>
//                           </div>
//                         )}

//                         {/* Return Form */}
//                         {form && (
//                           <div className="mt-3 border rounded p-3 bg-white">
//                             <div className="d-flex justify-content-between align-items-center mb-2">
//                               <h6 className="mb-0 text-capitalize">{form.type} Item</h6>
//                               <button className="btn btn-sm btn-link text-danger" onClick={() => closeReturnForm(idx)}>
//                                 <FaTimesCircle />
//                               </button>
//                             </div>

//                             {/* Quantity */}
//                             <div className="mb-2">
//                               <label className="form-label fw-bold">Quantity to {form.type} (max {form.maxQuantity})</label>
//                               <div className="d-flex align-items-center gap-2">
//                                 <button className="btn btn-sm btn-outline-secondary" onClick={() => handleReturnQuantity(idx, -1)} disabled={form.quantity <= 1}>-</button>
//                                 <span className="fw-bold px-3">{form.quantity}</span>
//                                 <button className="btn btn-sm btn-outline-secondary" onClick={() => handleReturnQuantity(idx, 1)} disabled={form.quantity >= form.maxQuantity}>+</button>
//                               </div>
//                             </div>

//                             {/* Reason */}
//                             <div className="mb-2">
//                               <label className="form-label fw-bold">Reason <span className="text-danger">*</span></label>
//                               <select
//                                 className="form-select form-select-sm"
//                                 value={form.reason}
//                                 onChange={(e) => setReturnForms(prev => ({ ...prev, [idx]: { ...prev[idx], reason: e.target.value } }))}
//                               >
//                                 <option value="">-- Select Reason --</option>
//                                 {RETURN_REASON_OPTIONS[form.type].map(opt => (
//                                   <option key={opt.value} value={opt.value}>{opt.label}</option>
//                                 ))}
//                               </select>
//                             </div>

//                             {/* Description */}
//                             <div className="mb-2">
//                               <label className="form-label fw-bold">Description (optional)</label>
//                               <textarea
//                                 className="form-control form-control-sm"
//                                 rows="2"
//                                 value={form.description}
//                                 onChange={(e) => setReturnForms(prev => ({ ...prev, [idx]: { ...prev[idx], description: e.target.value } }))}
//                                 placeholder="Additional details..."
//                               />
//                             </div>

//                             {/* Images */}
//                             <div className="mb-3">
//                               <label className="form-label fw-bold">
//                                 Images (max 5){RETURN_REASON_RULES[form.reason]?.imagesRequired ? " *" : ""}
//                               </label>
//                               <div
//                                 className="border rounded p-3 text-center bg-light cursor-pointer"
//                                 onClick={() => document.getElementById(`ret-img-${idx}`).click()}
//                               >
//                                 <FaCamera size={24} className="mb-2 text-muted" />
//                                 <p className="mb-0 small text-muted">Click to upload images</p>
//                               </div>
//                               <input
//                                 id={`ret-img-${idx}`}
//                                 type="file"
//                                 multiple
//                                 accept="image/*"
//                                 className="d-none"
//                                 onChange={(e) => handleReturnImages(idx, e.target.files)}
//                               />
//                               <div className="d-flex flex-wrap gap-2 mt-3">
//                                 {form.images.map((img, i) => (
//                                   <div key={i} className="position-relative">
//                                     <img
//                                       src={img.preview}
//                                       alt={`Preview ${i + 1}`}
//                                       className="rounded border"
//                                       style={{ width: 80, height: 80, objectFit: "cover" }}
//                                     />
//                                     <button
//                                       className="btn btn-danger btn-sm position-absolute top-0 end-0 rounded-circle"
//                                       onClick={() => removeReturnImage(idx, i)}
//                                       style={{ width: 24, height: 24, padding: 0 }}
//                                     >
//                                       <FaTrash size={12} />
//                                     </button>
//                                   </div>
//                                 ))}
//                               </div>
//                               {form.images.length > 0 && <small className="text-muted d-block mt-1">{form.images.length}/5 uploaded</small>}
//                             </div>

//                             {/* Submit */}
//                             <button
//                               className="btn btn-success w-100"
//                               disabled={returning || !form.reason || (RETURN_REASON_RULES[form.reason]?.imagesRequired && form.images.length === 0)}
//                               onClick={() => submitReturn(idx)}
//                             >
//                               {returning ? "Submitting..." : `Submit ${form.type.charAt(0).toUpperCase() + form.type.slice(1)} Request`}
//                             </button>
//                           </div>
//                         )}
//                       </div>

//                       <div className="col-4 text-end">
//                         <div className="fw-bold">₹{formatCurrency(p.sellingPrice * p.qty)}</div>
//                         {p.mrp > p.sellingPrice && <s className="text-muted small">₹{formatCurrency(p.mrp * p.qty)}</s>}
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>

//             {/* Tracking History */}
//             {trackingTimeline.length > 0 && (
//               <div className="card mb-4 border-0 shadow-sm">
//                 <div className="card-header bg-light fw-bold">Tracking History</div>
//                 <div className="card-body">
//                   <div className="timeline">
//                     {trackingTimeline.slice().reverse().map((evt, i) => (
//                       <div key={i} className="timeline-item mb-4 d-flex gap-3">
//                         <div className="timeline-marker" style={{ minWidth: 20 }}>
//                           {getTrackingStatusIcon(evt.status)}
//                         </div>
//                         <div className="timeline-content">
//                           <h6 className="mb-0 fw-bold text-capitalize">{evt.status}</h6>
//                           <small className="text-muted d-block">{evt.description || evt.courierStatus}</small>
//                           <small className="text-muted" style={{ fontSize: 11 }}>
//                             {formatDateTime(evt.timestamp)} | {evt.location || "N/A"}
//                           </small>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Price Summary & Address */}
//           <div className="col-lg-4">
//             <div className="card mb-4 border-0 shadow-sm">
//               <div className="card-header bg-light fw-bold">Price Summary</div>
//               <div className="card-body">
//                 <div className="d-flex justify-content-between mb-2"><span>Total MRP</span><span>₹{formatCurrency(priceDetails.totalMRP)}</span></div>
//                 <div className="d-flex justify-content-between mb-2"><span>Discounted Price</span><span>₹{formatCurrency(priceDetails.discountedTotalMRP)}</span></div>
//                 <div className="d-flex justify-content-between mb-2"><span>GST</span><span className="text-info">+₹{formatCurrency(priceDetails.otherCharges)}</span></div>
//                 <div className="d-flex justify-content-between mb-3"><span>Offers</span><span className="text-success">-₹{formatCurrency(priceDetails.otherDiscounts || 0)}</span></div>
//                 <hr />
//                 <div className="d-flex justify-content-between fw-bold fs-5"><span>Total Paid</span><span className="text-primary">₹{formatCurrency(priceDetails.orderTotal)}</span></div>
//                 {priceDetails.youSaved > 0 && (
//                   <div className="text-success mt-2 text-center">
//                     <strong>You Saved ₹{formatCurrency(priceDetails.youSaved)}</strong>
//                   </div>
//                 )}
//               </div>
//             </div>

//             <div className="card border-0 shadow-sm">
//               <div className="card-header bg-light fw-bold">Shipping Address</div>
//               <div className="card-body small">
//                 <div className="fw-bold">{shipmentData.shippingAddress?.name}</div>
//                 <div>{shipmentData.shippingAddress?.addressLine1}</div>
//                 {shipmentData.shippingAddress?.addressLine2 && <div>{shipmentData.shippingAddress.addressLine2}</div>}
//                 <div>{shipmentData.shippingAddress?.city}, {shipmentData.shippingAddress?.state} - {shipmentData.shippingAddress?.pincode}</div>
//                 <div className="mt-2 fw-bold">Phone: {shipmentData.shippingAddress?.phone}</div>
//                 <div>Email: {shipmentData.shippingAddress?.email}</div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Cancellation Modal */}
//         {showCancelModal && (
//           <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
//             <div className="modal-dialog modal-dialog-centered">
//               <div className="modal-content">
//                 <div className="modal-header bg-danger text-white">
//                   <h5 className="modal-title"><FaExclamationTriangle className="me-2" />Cancel Shipment</h5>
//                   <button type="button" className="btn-close btn-close-white" onClick={() => setShowCancelModal(false)}></button>
//                 </div>
//                 <div className="modal-body">
//                   <p className="mb-2">Are you sure? This action cannot be undone.</p>
//                   <div className="form-group">
//                     <label className="fw-bold mb-1">Reason <span className="text-danger">*</span></label>
//                     <textarea
//                       className="form-control"
//                       rows="3"
//                       value={cancelReason}
//                       onChange={(e) => setCancelReason(e.target.value)}
//                       placeholder="e.g., Changed mind, found better deal..."
//                     ></textarea>
//                   </div>
//                 </div>
//                 <div className="modal-footer">
//                   <button type="button" className="btn btn-secondary" onClick={() => setShowCancelModal(false)}>Close</button>
//                   <button
//                     type="button"
//                     className="btn btn-danger"
//                     onClick={handleConfirmCancel}
//                     disabled={cancelling}
//                   >
//                     {cancelling ? "Processing..." : "Confirm Cancellation"}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default OrderDetails;
























// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate, useLocation } from "react-router-dom";
// import Header from "./Header";
// import Footer from "./Footer";
// import {
//   FaCheckCircle, FaBox, FaTruck, FaTimesCircle, FaClock,
//   FaArrowLeft, FaShippingFast, FaInfoCircle, FaBan, FaExclamationTriangle,
//   FaCamera, FaTrash, FaUndo, FaExchangeAlt, FaDownload
// } from "react-icons/fa";
// import axios from "axios";

// /* ---------- constants ---------- */
// const SHIPMENT_API = "https://beauty.joyory.com/api/user/cart/shipment";
// const RETURN_API = "https://beauty.joyory.com/api/returns/request";
// const INVOICE_BASE_URL = "https://beauty.joyory.com/api/user/cart/invoice";

// /* ---------- backend rule map ---------- */
// const RETURN_REASON_RULES = {
//   DAMAGED: { imagesRequired: true },
//   WRONG_ITEM: { imagesRequired: true },
//   EXPIRED: { imagesRequired: true },
//   QUALITY_ISSUE: { imagesRequired: true },
//   SIZE_ISSUE: { imagesRequired: false },
//   NO_LONGER_NEEDED: { imagesRequired: false }
// };

// /* ---------- user-friendly reason options ---------- */
// const RETURN_REASON_OPTIONS = {
//   return: [
//     { value: "DAMAGED", label: "Defective / Damaged product" },
//     { value: "WRONG_ITEM", label: "Wrong item received" },
//     { value: "EXPIRED", label: "Expired product" },
//     { value: "QUALITY_ISSUE", label: "Quality issue" },
//     { value: "SIZE_ISSUE", label: "Size / Fit issue" },
//     { value: "NO_LONGER_NEEDED", label: "No longer needed / Change of mind" }
//   ],
//   replace: [
//     { value: "DAMAGED", label: "Defective / Damaged product" },
//     { value: "WRONG_ITEM", label: "Wrong item received" },
//     { value: "QUALITY_ISSUE", label: "Quality issue" },
//     { value: "SIZE_ISSUE", label: "Size / Fit issue" }
//   ]
// };

// /* ---------- helpers ---------- */
// const formatDate = (d) => {
//   if (!d) return "N/A";
//   const dt = new Date(d);
//   return `${String(dt.getDate()).padStart(2, "0")}-${String(dt.getMonth() + 1).padStart(2, "0")}-${dt.getFullYear()}`;
// };
// const formatDateTime = (d) => {
//   if (!d) return "N/A";
//   const dt = new Date(d);
//   return `${formatDate(d)} ${String(dt.getHours()).padStart(2, "0")}:${String(dt.getMinutes()).padStart(2, "0")}`;
// };
// const formatCurrency = (n) => (n ? Number(n).toFixed(2) : "0.00");
// const getWaybill = (s) => s?.waybill || s?.awb || s?.courier?.awb || null;

// /* ---------- component ---------- */
// const OrderDetails = () => {
//   const { shipmentId } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const selectedProduct = location.state?.selectedProduct;

//   /* ---- state ---- */
//   const [shipmentData, setShipmentData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   /* cancellation */
//   const [cancelling, setCancelling] = useState(false);
//   const [showCancelModal, setShowCancelModal] = useState(false);
//   const [cancelReason, setCancelReason] = useState("");

//   /* return / replace */
//   const [returnForms, setReturnForms] = useState({});
//   const [returning, setReturning] = useState(false);

//   /* invoice download */
//   const [downloadingInvoice, setDownloadingInvoice] = useState(false);

//   /* ---- data fetch ---- */
//   const fetchShipmentDetails = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await axios.get(`${SHIPMENT_API}/${shipmentId}`, { withCredentials: true });
//       if (res.data?.success) {
//         let d = { ...res.data };
//         const wb = getWaybill(d);
//         if (wb) {
//           if (!d.waybill) d.waybill = wb;
//           if (!d.awb) d.awb = wb;
//         }
//         setShipmentData(d);
//       } else setError("Failed to fetch shipment details");
//     } catch (err) {
//       console.error(err);
//       if (err.response?.status === 401) navigate("/login");
//       else setError(err.response?.data?.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchShipmentDetails();
//   }, [shipmentId]);

//   /* ---------- NEW INVOICE DOWNLOAD LOGIC ---------- */
//   const handleDownloadInvoice = async () => {
//     // Attempt to find the invoice ID from the shipment response
//     const invoiceId = shipmentData?.orderInfo?.invoice || shipmentData?.invoiceId;

//     if (!invoiceId) {
//       alert("Invoice ID not found. The invoice might not be generated yet.");
//       return;
//     }

//     setDownloadingInvoice(true);
//     try {
//       const response = await axios.get(`${INVOICE_BASE_URL}/${invoiceId}`, {
//         withCredentials: true,
//         responseType: "blob", // Important for receiving PDF files
//       });

//       // Create a blob URL and trigger download
//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement("a");
//       link.href = url;
//       link.setAttribute("download", `Invoice_${shipmentData?.orderInfo?.orderId || "Order"}.pdf`);
//       document.body.appendChild(link);
//       link.click();

//       // Cleanup
//       link.parentNode.removeChild(link);
//       window.URL.revokeObjectURL(url);
//     } catch (err) {
//       console.error("Download Error:", err);
//       alert(err.response?.data?.message || "Failed to download invoice");
//     } finally {
//       setDownloadingInvoice(false);
//     }
//   };

//   /* ---- cancellation logic ---- */
//   const isCancellable = (st) => {
//     if (!st) return false;
//     const blocked = ["picked up", "in transit", "out for delivery", "delivered", "cancelled"];
//     return !blocked.includes(st.toLowerCase());
//   };

//   const initiateCancellation = () => {
//     setCancelReason("");
//     setShowCancelModal(true);
//   };

//   const handleConfirmCancel = async () => {
//     if (!cancelReason.trim()) return alert("Reason required");
//     if (cancelling) return;
//     const orderId = shipmentData?.orderInfo?._id;
//     const waybill = getWaybill(shipmentData);
//     if (!orderId) return alert("Order ID missing");
//     if (!waybill) return alert("Waybill not assigned yet");
//     setCancelling(true);
//     try {
//       const res = await axios.put(
//         `${SHIPMENT_API}/cancel/${shipmentId}`,
//         { orderId, reason: cancelReason.trim() },
//         { withCredentials: true }
//       );
//       if (res.data?.success) {
//         alert(res.data.message || "Cancelled");
//         setShowCancelModal(false);
//         fetchShipmentDetails();
//       } else alert(res.data?.message || "Failed");
//     } catch (e) {
//       alert(e.response?.data?.message || "Error");
//     } finally {
//       setCancelling(false);
//     }
//   };

//   /* ---------- RETURN / REPLACE ---------- */
//   const openReturnForm = (idx, type) => {
//     const product = shipmentData.products[idx];
//     setReturnForms((prev) => ({
//       ...prev,
//       [idx]: {
//         type,
//         reason: "",
//         description: "",
//         images: [],
//         quantity: 1,
//         maxQuantity: product.qty
//       }
//     }));
//   };

//   const closeReturnForm = (idx) => {
//     setReturnForms((prev) => {
//       const copy = { ...prev };
//       delete copy[idx];
//       return copy;
//     });
//   };

//   const handleReturnQuantity = (idx, delta) => {
//     setReturnForms((prev) => {
//       const form = prev[idx];
//       if (!form) return prev;
//       let newQty = form.quantity + delta;
//       newQty = Math.max(1, Math.min(newQty, form.maxQuantity));
//       return { ...prev, [idx]: { ...form, quantity: newQty } };
//     });
//   };

//   const handleReturnImages = (idx, files) => {
//     if (!files || !files.length) return;
//     const form = returnForms[idx];
//     if (!form) return;
//     const total = form.images.length + files.length;
//     if (total > 5) return alert("Max 5 images allowed");
//     const newImgs = Array.from(files).map((file) =>
//       Object.assign(file, { preview: URL.createObjectURL(file) })
//     );
//     setReturnForms((prev) => ({
//       ...prev,
//       [idx]: { ...form, images: [...form.images, ...newImgs] }
//     }));
//   };

//   const removeReturnImage = (idx, i) => {
//     const form = returnForms[idx];
//     if (!form) return;
//     const copy = { ...form, images: form.images.filter((_, k) => k !== i) };
//     setReturnForms((prev) => ({ ...prev, [idx]: copy }));
//   };

//   const submitReturn = async (idx) => {
//     const form = returnForms[idx];
//     if (!form) return;
//     if (!form.reason) return alert("Please select a reason");

//     const rule = RETURN_REASON_RULES[form.reason];
//     if (rule?.imagesRequired && form.images.length === 0) {
//       return alert(`Images are required for reason: ${form.reason}`);
//     }

//     const product = shipmentData.products[idx];
//     if (!product) return;

//     const productId = product.productId || product._id;
//     let variantPayload = undefined;
//     if (product.variant && typeof product.variant === "object" && product.variant.sku) {
//       variantPayload = { sku: product.variant.sku };
//     }

//     const body = new FormData();
//     body.append("type", form.type);
//     body.append("reason", form.reason);
//     body.append("reasonDescription", form.description.trim());

//     const itemsPayload = [
//       {
//         productId,
//         quantity: form.quantity,
//         ...(variantPayload ? { variant: variantPayload } : {})
//       }
//     ];

//     body.append("items", JSON.stringify(itemsPayload));

//     form.images.forEach((file) => {
//       body.append(`images_${productId}`, file);
//     });

//     setReturning(true);
//     try {
//       const res = await axios.post(`${RETURN_API}/${shipmentId}`, body, {
//         withCredentials: true,
//         headers: { "Content-Type": "multipart/form-data" }
//       });
//       if (res.data?.success) {
//         alert(res.data.message || "Request submitted successfully");
//         closeReturnForm(idx);
//         fetchShipmentDetails();
//       } else {
//         alert(res.data?.message || "Request failed");
//       }
//     } catch (e) {
//       console.error("Return Error:", e);
//       alert(e.response?.data?.message || "Something went wrong");
//     } finally {
//       setReturning(false);
//     }
//   };

//   const hasActiveReturn = (p) => {
//     const returns = shipmentData?.returns || [];
//     return returns.some(
//       (r) =>
//         ["requested", "pickup_scheduled", "in_transit", "pickup_pending"].includes(r.status) &&
//         r.items.some((i) => i.productId.toString() === (p.productId || p._id).toString())
//     );
//   };

//   const getStatusIcon = (st) => {
//     switch (st?.toLowerCase()) {
//       case "delivered": return <FaTruck className="status-icon delivered" />;
//       case "shipped":
//       case "in transit": return <FaShippingFast className="status-icon shipped" />;
//       case "confirmed": return <FaCheckCircle className="status-icon confirmed" />;
//       case "cancelled": return <FaTimesCircle className="status-icon cancelled" />;
//       default: return <FaClock className="status-icon pending" />;
//     }
//   };
//   const getStatusColor = (st) => {
//     switch (st?.toLowerCase()) {
//       case "delivered": return "success";
//       case "shipped":
//       case "in transit": return "info";
//       case "confirmed": return "warning";
//       case "cancelled": return "danger";
//       default: return "secondary";
//     }
//   };
//   const getTrackingStatusIcon = (st) => {
//     switch (st?.toLowerCase()) {
//       case "delivered": return <FaTruck className="text-success" />;
//       case "in transit": return <FaShippingFast className="text-info" />;
//       case "cancelled": return <FaTimesCircle className="text-danger" />;
//       case "pickup scheduled": return <FaClock className="text-warning" />;
//       case "shipment created": return <FaBox className="text-primary" />;
//       default: return <FaInfoCircle className="text-secondary" />;
//     }
//   };
//   const isSelectedProduct = (p) => selectedProduct && p.name === selectedProduct.name;

//   /* ---------- render ---------- */
//   if (loading) return (
//     <>
//       <Header />
//       <div className="container mt-4 text-center py-5">
//         <div className="spinner-border text-primary" />
//         <p className="mt-2">Loading Shipment...</p>
//       </div>
//       <Footer />
//     </>
//   );

//   if (error || !shipmentData) return (
//     <>
//       <Header />
//       <div className="container mt-4 text-center py-5">
//         <div className="alert alert-danger">{error || "No data available"}</div>
//         <button className="btn btn-primary" onClick={() => navigate(-1)}>Go Back</button>
//       </div>
//       <Footer />
//     </>
//   );

//   const priceDetails = shipmentData.priceDetails || {};
//   const orderInfo = shipmentData.orderInfo || {};
//   const courier = shipmentData.courier || {};
//   const trackingTimeline = shipmentData.trackingTimeline || [];

//   return (
//     <>
//       <Header />
//       <div className="container mt-4 mb-5 position-relative">
//         <button className="btn btn-outline-secondary mb-4" onClick={() => navigate(-1)}>
//           <FaArrowLeft className="me-2" /> Back to Orders
//         </button>

//         <div className="card mb-4 border-0 shadow-sm">
//           <div className="card-header bg-primary text-white d-flex flex-column flex-md-row justify-content-between align-items-md-center">
//             <div>
//               <h5 className="mb-0">Order Details</h5>
//               <small className="text-white-50">Order ID: {orderInfo.orderId}</small>
//             </div>
//             <div className="d-flex gap-2 mt-2 mt-md-0 align-items-center flex-wrap">
//               {isCancellable(shipmentData.shipmentStatus) && getWaybill(shipmentData) && (
//                 <button className="btn btn-danger btn-sm" onClick={initiateCancellation}>
//                   <FaBan /> Cancel Shipment
//                 </button>
//               )}

//               {/* NEW DOWNLOAD INVOICE BUTTON REPLACING OLD GENERATOR */}
//               <button 
//                 className="btn btn-light btn-sm text-primary fw-bold" 
//                 onClick={handleDownloadInvoice}
//                 disabled={downloadingInvoice}
//               >
//                 {downloadingInvoice ? (
//                    <span className="spinner-border spinner-border-sm me-1"></span>
//                 ) : (
//                    <FaDownload className="me-1" />
//                 )}
//                 {downloadingInvoice ? "Generating..." : "Download Invoice"}
//               </button>

//               <div className="bg-white bg-opacity-25 px-3 py-1 rounded-pill d-flex align-items-center gap-2">
//                 {getStatusIcon(shipmentData.shipmentStatus)}
//                 <span className="fw-bold">{shipmentData.shipmentStatus}</span>
//               </div>
//             </div>
//           </div>

//           <div className="card-body">
//             <div className="row">
//               <div className="col-md-6 mb-3 border-end">
//                 <p className="mb-1"><strong>Shipment ID:</strong> <span className="text-muted">{shipmentData.shipmentId}</span></p>
//                 <p className="mb-1"><strong>Order Date:</strong> <span className="text-muted">{formatDate(orderInfo.orderDate)}</span></p>
//                 <p className="mb-0"><strong>Status:</strong> <span className={`text-${getStatusColor(shipmentData.shipmentStatus)} fw-bold`}>{shipmentData.shipmentStatus}</span></p>
//               </div>
//               <div className="col-md-6">
//                 <p className="mb-1"><strong>Expected Delivery:</strong> <span className="text-success">{shipmentData.expectedDelivery ? formatDate(shipmentData.expectedDelivery) : "TBD"}</span></p>
//                 <p className="mb-1"><strong>Courier:</strong> <span className="text-muted">{courier.name || "Assigning..."}</span></p>
//                 {getWaybill(shipmentData) && (
//                   <p className="mb-0">
//                     <strong>Waybill/AWB:</strong>
//                     <span className="badge bg-warning text-dark border">{getWaybill(shipmentData)}</span>
//                   </p>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Remaining sections like Products, Tracking Timeline, and Address stay the same */}
//         <div className="row">
//           <div className="col-lg-8">
//             <div className="card mb-4 border-0 shadow-sm">
//               <div className="card-header bg-light fw-bold">Items in Shipment</div>
//               <div className="card-body">
//                 {shipmentData.products?.map((p, idx) => {
//                   const form = returnForms[idx];
//                   const activeReturn = hasActiveReturn(p);
//                   const canOpenReturn = shipmentData.shipmentStatus === "Delivered" && !activeReturn;

//                   const variantDisplay = typeof p.variant === "object" 
//                     ? (p.variant?.shadeName || p.variant?.sku || "N/A")
//                     : (p.variant || "N/A");
//                   const skuDisplay = typeof p.variant === "object" 
//                     ? (p.variant?.sku || "N/A")
//                     : (p.variant || "N/A");

//                   return (
//                     <div key={idx} className={`row mb-3 pb-3 border-bottom ${isSelectedProduct(p) ? "bg-light border border-primary rounded p-2" : ""}`}>
//                       <div className="col-2">
//                         <img src={p.image} className="img-fluid rounded border" alt={p.name} />
//                       </div>
//                       <div className="col-6">
//                         <h6 className="mb-0 fw-bold">{p.name}</h6>
//                         <small className="text-muted">
//                           Variant: {variantDisplay} (SKU: {skuDisplay}) | Qty: {p.qty}
//                         </small>

//                         {canOpenReturn && !form && (
//                           <div className="mt-2">
//                             <button className="btn btn-sm btn-outline-primary me-2" onClick={() => openReturnForm(idx, "return")}>
//                               <FaUndo /> Return
//                             </button>
//                             <button className="btn btn-sm btn-outline-secondary" onClick={() => openReturnForm(idx, "replace")}>
//                               <FaExchangeAlt /> Replace
//                             </button>
//                           </div>
//                         )}

//                         {activeReturn && (
//                           <div className="mt-2">
//                             <span className="badge bg-warning text-dark">Return/Replace already requested</span>
//                           </div>
//                         )}

//                         {form && (
//                           <div className="mt-3 border rounded p-3 bg-white">
//                             <div className="d-flex justify-content-between align-items-center mb-2">
//                               <h6 className="mb-0 text-capitalize">{form.type} Item</h6>
//                               <button className="btn btn-sm btn-link text-danger" onClick={() => closeReturnForm(idx)}>
//                                 <FaTimesCircle />
//                               </button>
//                             </div>

//                             <div className="mb-2">
//                               <label className="form-label fw-bold">Quantity to {form.type} (max {form.maxQuantity})</label>
//                               <div className="d-flex align-items-center gap-2">
//                                 <button className="btn btn-sm btn-outline-secondary" onClick={() => handleReturnQuantity(idx, -1)} disabled={form.quantity <= 1}>-</button>
//                                 <span className="fw-bold px-3">{form.quantity}</span>
//                                 <button className="btn btn-sm btn-outline-secondary" onClick={() => handleReturnQuantity(idx, 1)} disabled={form.quantity >= form.maxQuantity}>+</button>
//                               </div>
//                             </div>

//                             <div className="mb-2">
//                               <label className="form-label fw-bold">Reason <span className="text-danger">*</span></label>
//                               <select
//                                 className="form-select form-select-sm"
//                                 value={form.reason}
//                                 onChange={(e) => setReturnForms(prev => ({ ...prev, [idx]: { ...prev[idx], reason: e.target.value } }))}
//                               >
//                                 <option value="">-- Select Reason --</option>
//                                 {RETURN_REASON_OPTIONS[form.type].map(opt => (
//                                   <option key={opt.value} value={opt.value}>{opt.label}</option>
//                                 ))}
//                               </select>
//                             </div>

//                             <div className="mb-2">
//                               <label className="form-label fw-bold">Description (optional)</label>
//                               <textarea
//                                 className="form-control form-control-sm"
//                                 rows="2"
//                                 value={form.description}
//                                 onChange={(e) => setReturnForms(prev => ({ ...prev, [idx]: { ...prev[idx], description: e.target.value } }))}
//                                 placeholder="Additional details..."
//                               />
//                             </div>

//                             <div className="mb-3">
//                               <label className="form-label fw-bold">
//                                 Images (max 5){RETURN_REASON_RULES[form.reason]?.imagesRequired ? " *" : ""}
//                               </label>
//                               <div
//                                 className="border rounded p-3 text-center bg-light cursor-pointer"
//                                 onClick={() => document.getElementById(`ret-img-${idx}`).click()}
//                               >
//                                 <FaCamera size={24} className="mb-2 text-muted" />
//                                 <p className="mb-0 small text-muted">Click to upload images</p>
//                               </div>
//                               <input
//                                 id={`ret-img-${idx}`}
//                                 type="file"
//                                 multiple
//                                 accept="image/*"
//                                 className="d-none"
//                                 onChange={(e) => handleReturnImages(idx, e.target.files)}
//                               />
//                               <div className="d-flex flex-wrap gap-2 mt-3">
//                                 {form.images.map((img, i) => (
//                                   <div key={i} className="position-relative">
//                                     <img
//                                       src={img.preview}
//                                       alt={`Preview ${i + 1}`}
//                                       className="rounded border"
//                                       style={{ width: 80, height: 80, objectFit: "cover" }}
//                                     />
//                                     <button
//                                       className="btn btn-danger btn-sm position-absolute top-0 end-0 rounded-circle"
//                                       onClick={() => removeReturnImage(idx, i)}
//                                       style={{ width: 24, height: 24, padding: 0 }}
//                                     >
//                                       <FaTrash size={12} />
//                                     </button>
//                                   </div>
//                                 ))}
//                               </div>
//                             </div>

//                             <button
//                               className="btn btn-success w-100"
//                               disabled={returning || !form.reason || (RETURN_REASON_RULES[form.reason]?.imagesRequired && form.images.length === 0)}
//                               onClick={() => submitReturn(idx)}
//                             >
//                               {returning ? "Submitting..." : `Submit ${form.type.charAt(0).toUpperCase() + form.type.slice(1)} Request`}
//                             </button>
//                           </div>
//                         )}
//                       </div>

//                       <div className="col-4 text-end">
//                         <div className="fw-bold">₹{formatCurrency(p.sellingPrice * p.qty)}</div>
//                         {p.mrp > p.sellingPrice && <s className="text-muted small">₹{formatCurrency(p.mrp * p.qty)}</s>}
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>

//             {trackingTimeline.length > 0 && (
//               <div className="card mb-4 border-0 shadow-sm">
//                 <div className="card-header bg-light fw-bold">Tracking History</div>
//                 <div className="card-body">
//                   <div className="timeline">
//                     {trackingTimeline.slice().reverse().map((evt, i) => (
//                       <div key={i} className="timeline-item mb-4 d-flex gap-3">
//                         <div className="timeline-marker" style={{ minWidth: 20 }}>
//                           {getTrackingStatusIcon(evt.status)}
//                         </div>
//                         <div className="timeline-content">
//                           <h6 className="mb-0 fw-bold text-capitalize">{evt.status}</h6>
//                           <small className="text-muted d-block">{evt.description || evt.courierStatus}</small>
//                           <small className="text-muted" style={{ fontSize: 11 }}>
//                             {formatDateTime(evt.timestamp)} | {evt.location || "N/A"}
//                           </small>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>

//           <div className="col-lg-4">
//             <div className="card mb-4 border-0 shadow-sm">
//               <div className="card-header bg-light fw-bold">Price Summary</div>
//               <div className="card-body">
//                 <div className="d-flex justify-content-between mb-2"><span>Total MRP</span><span>₹{formatCurrency(priceDetails.totalMRP)}</span></div>
//                 <div className="d-flex justify-content-between mb-2"><span>Discounted Price</span><span>₹{formatCurrency(priceDetails.discountedTotalMRP)}</span></div>
//                 <div className="d-flex justify-content-between mb-2"><span>GST</span><span className="text-info">+₹{formatCurrency(priceDetails.otherCharges)}</span></div>
//                 <div className="d-flex justify-content-between mb-3"><span>Offers</span><span className="text-success">-₹{formatCurrency(priceDetails.otherDiscounts || 0)}</span></div>
//                 <hr />
//                 <div className="d-flex justify-content-between fw-bold fs-5"><span>Total Paid</span><span className="text-primary">₹{formatCurrency(priceDetails.orderTotal)}</span></div>
//                 {priceDetails.youSaved > 0 && (
//                   <div className="text-success mt-2 text-center">
//                     <strong>You Saved ₹{formatCurrency(priceDetails.youSaved)}</strong>
//                   </div>
//                 )}
//               </div>
//             </div>

//             <div className="card border-0 shadow-sm">
//               <div className="card-header bg-light fw-bold">Shipping Address</div>
//               <div className="card-body small">
//                 <div className="fw-bold">{shipmentData.shippingAddress?.name}</div>
//                 <div>{shipmentData.shippingAddress?.addressLine1}</div>
//                 {shipmentData.shippingAddress?.addressLine2 && <div>{shipmentData.shippingAddress.addressLine2}</div>}
//                 <div>{shipmentData.shippingAddress?.city}, {shipmentData.shippingAddress?.state} - {shipmentData.shippingAddress?.pincode}</div>
//                 <div className="mt-2 fw-bold">Phone: {shipmentData.shippingAddress?.phone}</div>
//                 <div>Email: {shipmentData.shippingAddress?.email}</div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Cancellation Modal stays same */}
//         {showCancelModal && (
//           <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
//             <div className="modal-dialog modal-dialog-centered">
//               <div className="modal-content">
//                 <div className="modal-header bg-danger text-white">
//                   <h5 className="modal-title"><FaExclamationTriangle className="me-2" />Cancel Shipment</h5>
//                   <button type="button" className="btn-close btn-close-white" onClick={() => setShowCancelModal(false)}></button>
//                 </div>
//                 <div className="modal-body">
//                   <p className="mb-2">Are you sure? This action cannot be undone.</p>
//                   <div className="form-group">
//                     <label className="fw-bold mb-1">Reason <span className="text-danger">*</span></label>
//                     <textarea
//                       className="form-control"
//                       rows="3"
//                       value={cancelReason}
//                       onChange={(e) => setCancelReason(e.target.value)}
//                       placeholder="e.g., Changed mind, found better deal..."
//                     ></textarea>
//                   </div>
//                 </div>
//                 <div className="modal-footer">
//                   <button type="button" className="btn btn-secondary" onClick={() => setShowCancelModal(false)}>Close</button>
//                   <button
//                     type="button"
//                     className="btn btn-danger"
//                     onClick={handleConfirmCancel}
//                     disabled={cancelling}
//                   >
//                     {cancelling ? "Processing..." : "Confirm Cancellation"}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default OrderDetails;


















// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate, useLocation } from "react-router-dom";
// import Header from "./Header";
// import Footer from "./Footer";
// import {
//   FaCheckCircle, FaBox, FaTruck, FaTimesCircle, FaClock,
//   FaArrowLeft, FaShippingFast, FaInfoCircle, FaBan, FaExclamationTriangle,
//   FaCamera, FaTrash, FaUndo, FaExchangeAlt, FaDownload
// } from "react-icons/fa";
// import axios from "axios";

// /* ---------- constants ---------- */
// const SHIPMENT_API = "https://beauty.joyory.com/api/user/cart/shipment";
// const RETURN_API = "https://beauty.joyory.com/api/returns/request";
// const INVOICE_BASE_URL = "https://beauty.joyory.com/api/user/cart/invoice";

// /* ---------- backend rule map ---------- */
// const RETURN_REASON_RULES = {
//   DAMAGED: { imagesRequired: true },
//   WRONG_ITEM: { imagesRequired: true },
//   EXPIRED: { imagesRequired: true },
//   QUALITY_ISSUE: { imagesRequired: true },
//   SIZE_ISSUE: { imagesRequired: false },
//   NO_LONGER_NEEDED: { imagesRequired: false }
// };

// /* ---------- user-friendly reason options ---------- */
// const RETURN_REASON_OPTIONS = {
//   return: [
//     { value: "DAMAGED", label: "Defective / Damaged product" },
//     { value: "WRONG_ITEM", label: "Wrong item received" },
//     { value: "EXPIRED", label: "Expired product" },
//     { value: "QUALITY_ISSUE", label: "Quality issue" },
//     { value: "SIZE_ISSUE", label: "Size / Fit issue" },
//     { value: "NO_LONGER_NEEDED", label: "No longer needed / Change of mind" }
//   ],
//   replace: [
//     { value: "DAMAGED", label: "Defective / Damaged product" },
//     { value: "WRONG_ITEM", label: "Wrong item received" },
//     { value: "QUALITY_ISSUE", label: "Quality issue" },
//     { value: "SIZE_ISSUE", label: "Size / Fit issue" }
//   ]
// };

// /* ---------- helpers ---------- */
// const formatDate = (d) => {
//   if (!d) return "N/A";
//   const dt = new Date(d);
//   return `${String(dt.getDate()).padStart(2, "0")}-${String(dt.getMonth() + 1).padStart(2, "0")}-${dt.getFullYear()}`;
// };
// const formatDateTime = (d) => {
//   if (!d) return "N/A";
//   const dt = new Date(d);
//   return `${formatDate(d)} ${String(dt.getHours()).padStart(2, "0")}:${String(dt.getMinutes()).padStart(2, "0")}`;
// };
// const formatCurrency = (n) => (n ? Number(n).toFixed(2) : "0.00");
// const getWaybill = (s) => s?.waybill || s?.awb || s?.courier?.awb || null;

// const OrderDetails = () => {
//   const { shipmentId } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const selectedProduct = location.state?.selectedProduct;

//   /* ---- state ---- */
//   const [shipmentData, setShipmentData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   /* cancellation */
//   const [cancelling, setCancelling] = useState(false);
//   const [showCancelModal, setShowCancelModal] = useState(false);
//   const [cancelReason, setCancelReason] = useState("");

//   /* return / replace */
//   const [returnForms, setReturnForms] = useState({});
//   const [returning, setReturning] = useState(false);

//   /* invoice download */
//   const [downloadingInvoice, setDownloadingInvoice] = useState(false);

//   /* ---- data fetch ---- */
//   const fetchShipmentDetails = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await axios.get(`${SHIPMENT_API}/${shipmentId}`, { withCredentials: true });
//       if (res.data?.success) {
//         let d = { ...res.data };
//         const wb = getWaybill(d);
//         if (wb) {
//           if (!d.waybill) d.waybill = wb;
//           if (!d.awb) d.awb = wb;
//         }
//         setShipmentData(d);
//       } else setError("Failed to fetch shipment details");
//     } catch (err) {
//       console.error(err);
//       if (err.response?.status === 401) navigate("/login");
//       else setError(err.response?.data?.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchShipmentDetails();
//   }, [shipmentId]);

//   /* ---------- FIXED INVOICE DOWNLOAD LOGIC ---------- */
//   const handleDownloadInvoice = async () => {
//     // FIXED PATH: According to your JSON, it's inside shipmentData.invoice.invoiceId
//     const invoiceId = shipmentData?.invoice?.invoiceId;
//     const invoiceNumber = shipmentData?.invoice?.invoiceNumber || "Invoice";

//     if (!invoiceId) {
//       alert("Invoice ID not found. The invoice might not be generated yet.");
//       return;
//     }

//     setDownloadingInvoice(true);
//     try {
//       const response = await axios.get(`${INVOICE_BASE_URL}/${invoiceId}`, {
//         withCredentials: true,
//         responseType: "blob", // Important for PDF stream
//       });

//       // Create a blob and link for downloading
//       const blob = new Blob([response.data], { type: "application/pdf" });
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement("a");
//       link.href = url;
//       link.setAttribute("download", `${invoiceNumber}.pdf`);
//       document.body.appendChild(link);
//       link.click();

//       // Cleanup
//       link.parentNode.removeChild(link);
//       window.URL.revokeObjectURL(url);
//     } catch (err) {
//       console.error("Download Error:", err);

//       // Since responseType is 'blob', the error message is also a blob.
//       // We must read it to show the alert.
//       if (err.response && err.response.data instanceof Blob) {
//           const reader = new FileReader();
//           reader.onload = () => {
//               const res = JSON.parse(reader.result);
//               alert(res.message || "Failed to download invoice");
//           };
//           reader.readAsText(err.response.data);
//       } else {
//           alert("An error occurred while downloading the invoice.");
//       }
//     } finally {
//       setDownloadingInvoice(false);
//     }
//   };

//   /* ---- cancellation logic ---- */
//   const isCancellable = (st) => {
//     if (!st) return false;
//     const blocked = ["picked up", "in transit", "out for delivery", "delivered", "cancelled"];
//     return !blocked.includes(st.toLowerCase());
//   };

//   const initiateCancellation = () => {
//     setCancelReason("");
//     setShowCancelModal(true);
//   };

//   const handleConfirmCancel = async () => {
//     if (!cancelReason.trim()) return alert("Reason required");
//     if (cancelling) return;
//     const orderId = shipmentData?.orderInfo?._id;
//     const waybill = getWaybill(shipmentData);
//     if (!orderId) return alert("Order ID missing");
//     if (!waybill) return alert("Waybill not assigned yet");
//     setCancelling(true);
//     try {
//       const res = await axios.put(
//         `${SHIPMENT_API}/cancel/${shipmentId}`,
//         { orderId, reason: cancelReason.trim() },
//         { withCredentials: true }
//       );
//       if (res.data?.success) {
//         alert(res.data.message || "Cancelled");
//         setShowCancelModal(false);
//         fetchShipmentDetails();
//       } else alert(res.data?.message || "Failed");
//     } catch (e) {
//       alert(e.response?.data?.message || "Error");
//     } finally {
//       setCancelling(false);
//     }
//   };

//   /* ---------- RETURN / REPLACE ---------- */
//   const openReturnForm = (idx, type) => {
//     const product = shipmentData.products[idx];
//     setReturnForms((prev) => ({
//       ...prev,
//       [idx]: {
//         type,
//         reason: "",
//         description: "",
//         images: [],
//         quantity: 1,
//         maxQuantity: product.qty
//       }
//     }));
//   };

//   const closeReturnForm = (idx) => {
//     setReturnForms((prev) => {
//       const copy = { ...prev };
//       delete copy[idx];
//       return copy;
//     });
//   };

//   const handleReturnQuantity = (idx, delta) => {
//     setReturnForms((prev) => {
//       const form = prev[idx];
//       if (!form) return prev;
//       let newQty = form.quantity + delta;
//       newQty = Math.max(1, Math.min(newQty, form.maxQuantity));
//       return { ...prev, [idx]: { ...form, quantity: newQty } };
//     });
//   };

//   const handleReturnImages = (idx, files) => {
//     if (!files || !files.length) return;
//     const form = returnForms[idx];
//     if (!form) return;
//     const total = form.images.length + files.length;
//     if (total > 5) return alert("Max 5 images allowed");
//     const newImgs = Array.from(files).map((file) =>
//       Object.assign(file, { preview: URL.createObjectURL(file) })
//     );
//     setReturnForms((prev) => ({
//       ...prev,
//       [idx]: { ...form, images: [...form.images, ...newImgs] }
//     }));
//   };

//   const removeReturnImage = (idx, i) => {
//     const form = returnForms[idx];
//     if (!form) return;
//     const copy = { ...form, images: form.images.filter((_, k) => k !== i) };
//     setReturnForms((prev) => ({ ...prev, [idx]: copy }));
//   };

//   const submitReturn = async (idx) => {
//     const form = returnForms[idx];
//     if (!form) return;
//     if (!form.reason) return alert("Please select a reason");

//     const rule = RETURN_REASON_RULES[form.reason];
//     if (rule?.imagesRequired && form.images.length === 0) {
//       return alert(`Images are required for reason: ${form.reason}`);
//     }

//     const product = shipmentData.products[idx];
//     if (!product) return;

//     const productId = product.productId || product._id;
//     let variantPayload = undefined;
//     if (product.variant && typeof product.variant === "object" && product.variant.sku) {
//       variantPayload = { sku: product.variant.sku };
//     }

//     const body = new FormData();
//     body.append("type", form.type);
//     body.append("reason", form.reason);
//     body.append("reasonDescription", form.description.trim());

//     const itemsPayload = [
//       {
//         productId,
//         quantity: form.quantity,
//         ...(variantPayload ? { variant: variantPayload } : {})
//       }
//     ];

//     body.append("items", JSON.stringify(itemsPayload));

//     form.images.forEach((file) => {
//       body.append(`images_${productId}`, file);
//     });

//     setReturning(true);
//     try {
//       const res = await axios.post(`${RETURN_API}/${shipmentId}`, body, {
//         withCredentials: true,
//         headers: { "Content-Type": "multipart/form-data" }
//       });
//       if (res.data?.success) {
//         alert(res.data.message || "Request submitted successfully");
//         closeReturnForm(idx);
//         fetchShipmentDetails();
//       } else {
//         alert(res.data?.message || "Request failed");
//       }
//     } catch (e) {
//       console.error("Return Error:", e);
//       alert(e.response?.data?.message || "Something went wrong");
//     } finally {
//       setReturning(false);
//     }
//   };

//   const hasActiveReturn = (p) => {
//     const returns = shipmentData?.returns || [];
//     return returns.some(
//       (r) =>
//         ["requested", "pickup_scheduled", "in_transit", "pickup_pending"].includes(r.status) &&
//         r.items.some((i) => i.productId.toString() === (p.productId || p._id).toString())
//     );
//   };

//   const getStatusIcon = (st) => {
//     switch (st?.toLowerCase()) {
//       case "delivered": return <FaTruck className="status-icon delivered" />;
//       case "shipped":
//       case "in transit": return <FaShippingFast className="status-icon shipped" />;
//       case "confirmed": return <FaCheckCircle className="status-icon confirmed" />;
//       case "cancelled": return <FaTimesCircle className="status-icon cancelled" />;
//       default: return <FaClock className="status-icon pending" />;
//     }
//   };
//   const getStatusColor = (st) => {
//     switch (st?.toLowerCase()) {
//       case "delivered": return "success";
//       case "shipped":
//       case "in transit": return "info";
//       case "confirmed": return "warning";
//       case "cancelled": return "danger";
//       default: return "secondary";
//     }
//   };
//   const getTrackingStatusIcon = (st) => {
//     switch (st?.toLowerCase()) {
//       case "delivered": return <FaTruck className="text-success" />;
//       case "in transit": return <FaShippingFast className="text-info" />;
//       case "cancelled": return <FaTimesCircle className="text-danger" />;
//       case "pickup scheduled": return <FaClock className="text-warning" />;
//       case "shipment created": return <FaBox className="text-primary" />;
//       default: return <FaInfoCircle className="text-secondary" />;
//     }
//   };
//   const isSelectedProduct = (p) => selectedProduct && p.name === selectedProduct.name;

//   /* ---------- render ---------- */
//   if (loading) return (
//     <>
//       <Header />
//       <div className="container mt-4 text-center py-5">
//         <div className="spinner-border text-primary" />
//         <p className="mt-2">Loading Shipment...</p>
//       </div>
//       <Footer />
//     </>
//   );

//   if (error || !shipmentData) return (
//     <>
//       <Header />
//       <div className="container mt-4 text-center py-5">
//         <div className="alert alert-danger">{error || "No data available"}</div>
//         <button className="btn btn-primary" onClick={() => navigate(-1)}>Go Back</button>
//       </div>
//       <Footer />
//     </>
//   );

//   const priceDetails = shipmentData.priceDetails || {};
//   const orderInfo = shipmentData.orderInfo || {};
//   const courier = shipmentData.courier || {};
//   const trackingTimeline = shipmentData.trackingTimeline || [];

//   return (
//     <>
//       <Header />
//       <div className="container mt-4 mb-5 position-relative">
//         <button className="btn btn-outline-secondary mb-4" onClick={() => navigate(-1)}>
//           <FaArrowLeft className="me-2" /> Back to Orders
//         </button>

//         <div className="card mb-4 border-0 shadow-sm">
//           <div className="card-header bg-primary text-white d-flex flex-column flex-md-row justify-content-between align-items-md-center">
//             <div>
//               <h5 className="mb-0">Order Details</h5>
//               <small className="text-white-50">Order ID: {orderInfo.orderId}</small>
//             </div>
//             <div className="d-flex gap-2 mt-2 mt-md-0 align-items-center flex-wrap">
//               {isCancellable(shipmentData.shipmentStatus) && getWaybill(shipmentData) && (
//                 <button className="btn btn-danger btn-sm" onClick={initiateCancellation}>
//                   <FaBan /> Cancel Shipment
//                 </button>
//               )}

//               <button 
//                 className="btn btn-light btn-sm text-primary fw-bold" 
//                 onClick={handleDownloadInvoice}
//                 disabled={downloadingInvoice}
//               >
//                 {downloadingInvoice ? (
//                    <span className="spinner-border spinner-border-sm me-1"></span>
//                 ) : (
//                    <FaDownload className="me-1" />
//                 )}
//                 {downloadingInvoice ? "Generating..." : "Download Invoice"}
//               </button>

//               <div className="bg-white bg-opacity-25 px-3 py-1 rounded-pill d-flex align-items-center gap-2">
//                 {getStatusIcon(shipmentData.shipmentStatus)}
//                 <span className="fw-bold">{shipmentData.shipmentStatus}</span>
//               </div>
//             </div>
//           </div>

//           <div className="card-body">
//             <div className="row">
//               <div className="col-md-6 mb-3 border-end">
//                 <p className="mb-1"><strong>Shipment ID:</strong> <span className="text-muted">{shipmentData.shipmentId}</span></p>
//                 <p className="mb-1"><strong>Order Date:</strong> <span className="text-muted">{formatDate(orderInfo.orderDate)}</span></p>
//                 <p className="mb-0"><strong>Status:</strong> <span className={`text-${getStatusColor(shipmentData.shipmentStatus)} fw-bold`}>{shipmentData.shipmentStatus}</span></p>
//               </div>
//               <div className="col-md-6">
//                 <p className="mb-1"><strong>Expected Delivery:</strong> <span className="text-success">{shipmentData.expectedDelivery ? formatDate(shipmentData.expectedDelivery) : "TBD"}</span></p>
//                 <p className="mb-1"><strong>Courier:</strong> <span className="text-muted">{courier.name || "Assigning..."}</span></p>
//                 {getWaybill(shipmentData) && (
//                   <p className="mb-0">
//                     <strong>Waybill/AWB:</strong>
//                     <span className="badge bg-warning text-dark border ms-1">{getWaybill(shipmentData)}</span>
//                   </p>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="row">
//           <div className="col-lg-8">
//             <div className="card mb-4 border-0 shadow-sm">
//               <div className="card-header bg-light fw-bold">Items in Shipment</div>
//               <div className="card-body">
//                 {shipmentData.products?.map((p, idx) => {
//                   const form = returnForms[idx];
//                   const activeReturn = hasActiveReturn(p);
//                   const canOpenReturn = shipmentData.shipmentStatus === "Delivered" && !activeReturn;

//                   const variantDisplay = typeof p.variant === "object" 
//                     ? (p.variant?.shadeName || p.variant?.sku || "N/A")
//                     : (p.variant || "N/A");
//                   const skuDisplay = typeof p.variant === "object" 
//                     ? (p.variant?.sku || "N/A")
//                     : (p.variant || "N/A");

//                   return (
//                     <div key={idx} className={`row mb-3 pb-3 border-bottom ${isSelectedProduct(p) ? "bg-light border border-primary rounded p-2" : ""}`}>
//                       <div className="col-2">
//                         <img src={p.image} className="img-fluid rounded border" alt={p.name} />
//                       </div>
//                       <div className="col-6">
//                         <h6 className="mb-0 fw-bold">{p.name}</h6>
//                         <small className="text-muted">
//                           Variant: {variantDisplay} (SKU: {skuDisplay}) | Qty: {p.qty}
//                         </small>

//                         {canOpenReturn && !form && (
//                           <div className="mt-2">
//                             <button className="btn btn-sm btn-outline-primary me-2" onClick={() => openReturnForm(idx, "return")}>
//                               <FaUndo /> Return
//                             </button>
//                             <button className="btn btn-sm btn-outline-secondary" onClick={() => openReturnForm(idx, "replace")}>
//                               <FaExchangeAlt /> Replace
//                             </button>
//                           </div>
//                         )}

//                         {activeReturn && (
//                           <div className="mt-2">
//                             <span className="badge bg-warning text-dark">Return/Replace requested</span>
//                           </div>
//                         )}

//                         {form && (
//                           <div className="mt-3 border rounded p-3 bg-white shadow-sm">
//                             <div className="d-flex justify-content-between align-items-center mb-2">
//                               <h6 className="mb-0 text-capitalize">{form.type} Item</h6>
//                               <button className="btn btn-sm btn-link text-danger" onClick={() => closeReturnForm(idx)}>
//                                 <FaTimesCircle />
//                               </button>
//                             </div>

//                             <div className="mb-2">
//                               <label className="form-label fw-bold">Quantity to {form.type}</label>
//                               <div className="d-flex align-items-center gap-2">
//                                 <button className="btn btn-sm btn-outline-secondary" onClick={() => handleReturnQuantity(idx, -1)} disabled={form.quantity <= 1}>-</button>
//                                 <span className="fw-bold px-3">{form.quantity}</span>
//                                 <button className="btn btn-sm btn-outline-secondary" onClick={() => handleReturnQuantity(idx, 1)} disabled={form.quantity >= form.maxQuantity}>+</button>
//                               </div>
//                             </div>

//                             <div className="mb-2">
//                               <label className="form-label fw-bold">Reason <span className="text-danger">*</span></label>
//                               <select
//                                 className="form-select form-select-sm"
//                                 value={form.reason}
//                                 onChange={(e) => setReturnForms(prev => ({ ...prev, [idx]: { ...prev[idx], reason: e.target.value } }))}
//                               >
//                                 <option value="">-- Select Reason --</option>
//                                 {RETURN_REASON_OPTIONS[form.type].map(opt => (
//                                   <option key={opt.value} value={opt.value}>{opt.label}</option>
//                                 ))}
//                               </select>
//                             </div>

//                             <div className="mb-2">
//                               <label className="form-label fw-bold">Description</label>
//                               <textarea
//                                 className="form-control form-control-sm"
//                                 rows="2"
//                                 value={form.description}
//                                 onChange={(e) => setReturnForms(prev => ({ ...prev, [idx]: { ...prev[idx], description: e.target.value } }))}
//                                 placeholder="Additional details..."
//                               />
//                             </div>

//                             <div className="mb-3">
//                               <label className="form-label fw-bold">
//                                 Images{RETURN_REASON_RULES[form.reason]?.imagesRequired ? " *" : ""}
//                               </label>
//                               <div
//                                 className="border rounded p-3 text-center bg-light cursor-pointer"
//                                 onClick={() => document.getElementById(`ret-img-${idx}`).click()}
//                               >
//                                 <FaCamera size={24} className="mb-2 text-muted" />
//                                 <p className="mb-0 small text-muted">Upload Photo</p>
//                               </div>
//                               <input id={`ret-img-${idx}`} type="file" multiple accept="image/*" className="d-none" onChange={(e) => handleReturnImages(idx, e.target.files)} />
//                               <div className="d-flex flex-wrap gap-2 mt-3">
//                                 {form.images.map((img, i) => (
//                                   <div key={i} className="position-relative">
//                                     <img src={img.preview} alt="prev" className="rounded border" style={{ width: 60, height: 60, objectFit: "cover" }} />
//                                     <button className="btn btn-danger btn-sm position-absolute top-0 end-0 rounded-circle p-0" onClick={() => removeReturnImage(idx, i)} style={{ width: 18, height: 18 }}>
//                                       <FaTrash size={10} />
//                                     </button>
//                                   </div>
//                                 ))}
//                               </div>
//                             </div>

//                             <button
//                               className="btn btn-success w-100 btn-sm"
//                               disabled={returning || !form.reason || (RETURN_REASON_RULES[form.reason]?.imagesRequired && form.images.length === 0)}
//                               onClick={() => submitReturn(idx)}
//                             >
//                               {returning ? "Submitting..." : `Submit ${form.type}`}
//                             </button>
//                           </div>
//                         )}
//                       </div>
//                       <div className="col-4 text-end">
//                         <div className="fw-bold">₹{formatCurrency(p.sellingPrice * p.qty)}</div>
//                         {p.mrp > p.sellingPrice && <s className="text-muted small">₹{formatCurrency(p.mrp * p.qty)}</s>}
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>

//             {trackingTimeline.length > 0 && (
//               <div className="card mb-4 border-0 shadow-sm">
//                 <div className="card-header bg-light fw-bold">Tracking History</div>
//                 <div className="card-body">
//                   <div className="timeline">
//                     {trackingTimeline.slice().reverse().map((evt, i) => (
//                       <div key={i} className="timeline-item mb-4 d-flex gap-3">
//                         <div className="timeline-marker">{getTrackingStatusIcon(evt.status)}</div>
//                         <div className="timeline-content">
//                           <h6 className="mb-0 fw-bold text-capitalize">{evt.status}</h6>
//                           <small className="text-muted d-block">{evt.description || evt.courierStatus}</small>
//                           <small className="text-muted" style={{ fontSize: 11 }}>
//                             {formatDateTime(evt.timestamp)} | {evt.location || "N/A"}
//                           </small>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>

//           <div className="col-lg-4">
//             <div className="card mb-4 border-0 shadow-sm">
//               <div className="card-header bg-light fw-bold">Price Summary</div>
//               <div className="card-body">
//                 <div className="d-flex justify-content-between mb-2"><span>Total MRP</span><span>₹{formatCurrency(priceDetails.totalMRP)}</span></div>
//                 <div className="d-flex justify-content-between mb-2"><span>Discounted Price</span><span>₹{formatCurrency(priceDetails.discountedTotalMRP)}</span></div>
//                 <div className="d-flex justify-content-between mb-2"><span>GST</span><span className="text-info">+₹{formatCurrency(priceDetails.otherCharges)}</span></div>
//                 <div className="d-flex justify-content-between mb-3"><span>Offers</span><span className="text-success">-₹{formatCurrency(priceDetails.otherDiscounts || 0)}</span></div>
//                 <hr />
//                 <div className="d-flex justify-content-between fw-bold fs-5"><span>Total Paid</span><span className="text-primary">₹{formatCurrency(priceDetails.orderTotal)}</span></div>
//                 {priceDetails.youSaved > 0 && (
//                   <div className="text-success mt-2 text-center"><strong>You Saved ₹{formatCurrency(priceDetails.youSaved)}</strong></div>
//                 )}
//               </div>
//             </div>

//             <div className="card border-0 shadow-sm">
//               <div className="card-header bg-light fw-bold">Shipping Address</div>
//               <div className="card-body small">
//                 <div className="fw-bold">{shipmentData.shippingAddress?.name}</div>
//                 <div>{shipmentData.shippingAddress?.addressLine1}</div>
//                 {shipmentData.shippingAddress?.addressLine2 && <div>{shipmentData.shippingAddress.addressLine2}</div>}
//                 <div>{shipmentData.shippingAddress?.city}, {shipmentData.shippingAddress?.state} - {shipmentData.shippingAddress?.pincode}</div>
//                 <div className="mt-2 fw-bold">Phone: {shipmentData.shippingAddress?.phone}</div>
//                 <div>Email: {shipmentData.shippingAddress?.email}</div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {showCancelModal && (
//           <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
//             <div className="modal-dialog modal-dialog-centered">
//               <div className="modal-content">
//                 <div className="modal-header bg-danger text-white">
//                   <h5 className="modal-title"><FaExclamationTriangle className="me-2" />Cancel Shipment</h5>
//                   <button type="button" className="btn-close btn-close-white" onClick={() => setShowCancelModal(false)}></button>
//                 </div>
//                 <div className="modal-body">
//                   <p className="mb-2">Are you sure? This action cannot be undone.</p>
//                   <div className="form-group">
//                     <label className="fw-bold mb-1">Reason <span className="text-danger">*</span></label>
//                     <textarea className="form-control" rows="3" value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} placeholder="Reason for cancellation..."></textarea>
//                   </div>
//                 </div>
//                 <div className="modal-footer">
//                   <button type="button" className="btn btn-secondary" onClick={() => setShowCancelModal(false)}>Close</button>
//                   <button type="button" className="btn btn-danger" onClick={handleConfirmCancel} disabled={cancelling}>{cancelling ? "Processing..." : "Confirm Cancellation"}</button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default OrderDetails;
























// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate, useLocation } from "react-router-dom";
// import Header from "./Header";
// import Footer from "./Footer";
// import "../css/orderdetails.css";
// import {
//   FaCheckCircle, FaBox, FaTruck, FaTimesCircle, FaClock,
//   FaArrowLeft, FaShippingFast, FaInfoCircle, FaBan, FaExclamationTriangle,
//   FaCamera, FaTrash, FaUndo, FaExchangeAlt, FaDownload, FaExternalLinkAlt
// } from "react-icons/fa";
// import axios from "axios";

// /* ---------- constants ---------- */
// const SHIPMENT_API = "https://beauty.joyory.com/api/user/cart/shipment";
// const RETURN_API = "https://beauty.joyory.com/api/returns/request";
// const INVOICE_BASE_URL = "https://beauty.joyory.com/api/user/cart/invoice";

// /* ---------- backend rule map ---------- */
// const RETURN_REASON_RULES = {
//   DAMAGED: { imagesRequired: true },
//   WRONG_ITEM: { imagesRequired: true },
//   EXPIRED: { imagesRequired: true },
//   QUALITY_ISSUE: { imagesRequired: true },
//   SIZE_ISSUE: { imagesRequired: false },
//   NO_LONGER_NEEDED: { imagesRequired: false }
// };

// /* ---------- user-friendly reason options ---------- */
// const RETURN_REASON_OPTIONS = {
//   return: [
//     { value: "DAMAGED", label: "Defective / Damaged product" },
//     { value: "WRONG_ITEM", label: "Wrong item received" },
//     { value: "EXPIRED", label: "Expired product" },
//     { value: "QUALITY_ISSUE", label: "Quality issue" },
//     { value: "SIZE_ISSUE", label: "Size / Fit issue" },
//     { value: "NO_LONGER_NEEDED", label: "No longer needed / Change of mind" }
//   ],
//   replace: [
//     { value: "DAMAGED", label: "Defective / Damaged product" },
//     { value: "WRONG_ITEM", label: "Wrong item received" },
//     { value: "QUALITY_ISSUE", label: "Quality issue" },
//     { value: "SIZE_ISSUE", label: "Size / Fit issue" }
//   ]
// };

// /* ---------- helpers ---------- */
// const formatDate = (d) => {
//   if (!d) return "N/A";
//   const dt = new Date(d);
//   return `${String(dt.getDate()).padStart(2, "0")}-${String(dt.getMonth() + 1).padStart(2, "0")}-${dt.getFullYear()}`;
// };
// const formatDateTime = (d) => {
//   if (!d) return "N/A";
//   const dt = new Date(d);
//   return `${formatDate(d)} ${String(dt.getHours()).padStart(2, "0")}:${String(dt.getMinutes()).padStart(2, "0")}`;
// };
// const formatCurrency = (n) => (n ? Number(n).toFixed(2) : "0.00");
// const getWaybill = (s) => s?.courier?.awb || s?.waybill || s?.awb || s?.orderInfo?.awb || null;

// const OrderDetails = () => {
//   const { shipmentId } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const selectedProduct = location.state?.selectedProduct;

//   /* ---- state ---- */
//   const [shipmentData, setShipmentData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   /* cancellation */
//   const [cancelling, setCancelling] = useState(false);
//   const [showCancelModal, setShowCancelModal] = useState(false);
//   const [cancelReason, setCancelReason] = useState("");

//   /* return / replace */
//   const [returnForms, setReturnForms] = useState({});
//   const [returning, setReturning] = useState(false);

//   /* invoice download */
//   const [downloadingInvoice, setDownloadingInvoice] = useState(false);

//   /* ---- data fetch ---- */
//   const fetchShipmentDetails = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await axios.get(`${SHIPMENT_API}/${shipmentId}`, { withCredentials: true });
//       if (res.data?.success) {
//         setShipmentData(res.data);
//       } else setError("Failed to fetch shipment details");
//     } catch (err) {
//       console.error(err);
//       if (err.response?.status === 401) navigate("/login");
//       else setError(err.response?.data?.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchShipmentDetails();
//   }, [shipmentId]);

//   /* ---------- INVOICE DOWNLOAD LOGIC ---------- */
//   // const handleDownloadInvoice = async () => {
//   //   const invoiceId = shipmentData?.invoice?.invoiceId;
//   //   const invoiceNumber = shipmentData?.invoice?.invoiceNumber || "Invoice";

//   //   if (!invoiceId) {
//   //     alert("Invoice ID not found. The invoice might not be generated yet.");
//   //     return;
//   //   }

//   //   setDownloadingInvoice(true);
//   //   try {
//   //     const response = await axios.get(`${INVOICE_BASE_URL}/${invoiceId}`, {
//   //       withCredentials: true,
//   //       responseType: "blob",
//   //     });

//   //     const blob = new Blob([response.data], { type: "application/pdf" });
//   //     const url = window.URL.createObjectURL(blob);
//   //     const link = document.createElement("a");
//   //     link.href = url;
//   //     link.setAttribute("download", `${invoiceNumber}.pdf`);
//   //     document.body.appendChild(link);
//   //     link.click();

//   //     link.parentNode.removeChild(link);
//   //     window.URL.revokeObjectURL(url);
//   //   } catch (err) {
//   //     console.error("Download Error:", err);

//   //     if (err.response && err.response.data instanceof Blob) {
//   //       const reader = new FileReader();
//   //       reader.onload = () => {
//   //         try {
//   //           const res = JSON.parse(reader.result);
//   //           alert(res.message || "Failed to download invoice");
//   //         } catch {
//   //           alert("Failed to download invoice");
//   //         }
//   //       };
//   //       reader.readAsText(err.response.data);
//   //     } else {
//   //       alert("An error occurred while downloading the invoice.");
//   //     }
//   //   } finally {
//   //     setDownloadingInvoice(false);
//   //   }
//   // };




//   const handleDownloadInvoice = async () => {
//     const invoiceId = shipmentData?.invoice?.invoiceId;

//     if (!invoiceId) {
//       alert("Invoice not available yet.");
//       return;
//     }

//     setDownloadingInvoice(true);

//     try {
//       const response = await axios.get(`${INVOICE_BASE_URL}/${invoiceId}`, {
//         withCredentials: true,
//         responseType: "blob", // IMPORTANT for PDF
//       });

//       /* ---------------- Extract filename from backend ---------------- */
//       let fileName = "Invoice.pdf";

//       const contentDisposition = response.headers["content-disposition"];
//       if (contentDisposition) {
//         const match = contentDisposition.match(/filename="(.+)"/);
//         if (match?.[1]) {
//           fileName = match[1];
//         }
//       }

//       /* ---------------- Create download ---------------- */
//       const blob = new Blob([response.data], {
//         type: "application/pdf",
//       });

//       const url = window.URL.createObjectURL(blob);

//       const link = document.createElement("a");
//       link.href = url;
//       link.download = fileName;

//       document.body.appendChild(link);
//       link.click();

//       link.remove();
//       window.URL.revokeObjectURL(url);

//     } catch (err) {
//       console.error("Invoice Download Error:", err);

//       // Handle backend JSON error (blob response)
//       if (err.response?.data instanceof Blob) {
//         const text = await err.response.data.text();
//         try {
//           const json = JSON.parse(text);
//           alert(json.message || "Failed to download invoice");
//         } catch {
//           alert("Failed to download invoice");
//         }
//       } else {
//         alert("Something went wrong while downloading invoice");
//       }

//     } finally {
//       setDownloadingInvoice(false);
//     }
//   };



//   /* ---- cancellation logic ---- */
//   const isCancellable = (st) => {
//     if (!st) return false;
//     const blocked = ["picked up", "in transit", "out for delivery", "delivered", "cancelled"];
//     return !blocked.includes(st.toLowerCase());
//   };

//   const initiateCancellation = () => {
//     setCancelReason("");
//     setShowCancelModal(true);
//   };

//   const handleConfirmCancel = async () => {
//     if (!cancelReason.trim()) return alert("Reason required");
//     if (cancelling) return;
//     const orderId = shipmentData?.orderInfo?._id;
//     const waybill = getWaybill(shipmentData);
//     if (!orderId) return alert("Order ID missing");
//     if (!waybill) return alert("Waybill not assigned yet");
//     setCancelling(true);
//     try {
//       const res = await axios.put(
//         `${SHIPMENT_API}/cancel/${shipmentId}`,
//         { orderId, reason: cancelReason.trim() },
//         { withCredentials: true }
//       );
//       if (res.data?.success) {
//         alert(res.data.message || "Cancelled");
//         setShowCancelModal(false);
//         fetchShipmentDetails();
//       } else alert(res.data?.message || "Failed");
//     } catch (e) {
//       alert(e.response?.data?.message || "Error");
//     } finally {
//       setCancelling(false);
//     }
//   };

//   /* ---------- RETURN / REPLACE ---------- */
//   const openReturnForm = (idx, type) => {
//     const product = shipmentData.products[idx];
//     setReturnForms((prev) => ({
//       ...prev,
//       [idx]: {
//         type,
//         reason: "",
//         description: "",
//         images: [],
//         quantity: 1,
//         maxQuantity: product.qty
//       }
//     }));
//   };

//   const closeReturnForm = (idx) => {
//     setReturnForms((prev) => {
//       const copy = { ...prev };
//       delete copy[idx];
//       return copy;
//     });
//   };

//   const handleReturnQuantity = (idx, delta) => {
//     setReturnForms((prev) => {
//       const form = prev[idx];
//       if (!form) return prev;
//       let newQty = form.quantity + delta;
//       newQty = Math.max(1, Math.min(newQty, form.maxQuantity));
//       return { ...prev, [idx]: { ...form, quantity: newQty } };
//     });
//   };

//   const handleReturnImages = (idx, files) => {
//     if (!files || !files.length) return;
//     const form = returnForms[idx];
//     if (!form) return;
//     const total = form.images.length + files.length;
//     if (total > 5) return alert("Max 5 images allowed");
//     const newImgs = Array.from(files).map((file) =>
//       Object.assign(file, { preview: URL.createObjectURL(file) })
//     );
//     setReturnForms((prev) => ({
//       ...prev,
//       [idx]: { ...form, images: [...form.images, ...newImgs] }
//     }));
//   };

//   const removeReturnImage = (idx, i) => {
//     const form = returnForms[idx];
//     if (!form) return;
//     const copy = { ...form, images: form.images.filter((_, k) => k !== i) };
//     setReturnForms((prev) => ({ ...prev, [idx]: copy }));
//   };

//   const submitReturn = async (idx) => {
//     const form = returnForms[idx];
//     if (!form) return;
//     if (!form.reason) return alert("Please select a reason");

//     const rule = RETURN_REASON_RULES[form.reason];
//     if (rule?.imagesRequired && form.images.length === 0) {
//       return alert(`Images are required for reason: ${form.reason}`);
//     }

//     const product = shipmentData.products[idx];
//     if (!product) return;

//     const productId = product.productId || product._id;
//     let variantPayload = undefined;
//     if (product.variant && typeof product.variant === "object" && product.variant.sku) {
//       variantPayload = { sku: product.variant.sku };
//     }

//     const body = new FormData();
//     body.append("type", form.type);
//     body.append("reason", form.reason);
//     body.append("reasonDescription", form.description.trim());

//     const itemsPayload = [
//       {
//         productId,
//         quantity: form.quantity,
//         ...(variantPayload ? { variant: variantPayload } : {})
//       }
//     ];

//     body.append("items", JSON.stringify(itemsPayload));

//     form.images.forEach((file) => {
//       body.append(`images_${productId}`, file);
//     });

//     setReturning(true);
//     try {
//       const res = await axios.post(`${RETURN_API}/${shipmentId}`, body, {
//         withCredentials: true,
//         headers: { "Content-Type": "multipart/form-data" }
//       });
//       if (res.data?.success) {
//         alert(res.data.message || "Request submitted successfully");
//         closeReturnForm(idx);
//         fetchShipmentDetails();
//       } else {
//         alert(res.data?.message || "Request failed");
//       }
//     } catch (e) {
//       console.error("Return Error:", e);
//       alert(e.response?.data?.message || "Something went wrong");
//     } finally {
//       setReturning(false);
//     }
//   };

//   const hasActiveReturn = (p) => {
//     const returns = shipmentData?.returns || [];
//     return returns.some(
//       (r) =>
//         ["requested", "pickup_scheduled", "in_transit", "pickup_pending", "qc_passed", "qc_failed"].includes(r.status) &&
//         r.items.some((i) => i.productId.toString() === (p.productId || p._id).toString())
//     );
//   };

//   const getReturnForProduct = (p) => {
//     const returns = shipmentData?.returns || [];
//     return returns.find(
//       (r) => r.items.some((i) => i.productId.toString() === (p.productId || p._id).toString())
//     );
//   };

//   const getStatusIcon = (st) => {
//     switch (st?.toLowerCase()) {
//       case "delivered": return <FaTruck className="status-icon delivered" />;
//       case "shipped":
//       case "in transit": return <FaShippingFast className="status-icon shipped" />;
//       case "confirmed": return <FaCheckCircle className="status-icon confirmed" />;
//       case "cancelled": return <FaTimesCircle className="status-icon cancelled" />;
//       default: return <FaClock className="status-icon pending" />;
//     }
//   };
//   const getStatusColor = (st) => {
//     switch (st?.toLowerCase()) {
//       case "delivered": return "success";
//       case "shipped":
//       case "in transit": return "info";
//       case "confirmed": return "warning";
//       case "cancelled": return "danger";
//       default: return "secondary";
//     }
//   };
//   const getTrackingStatusIcon = (st) => {
//     switch (st?.toLowerCase()) {
//       case "delivered": return <FaTruck className="text-success" />;
//       case "in transit": return <FaShippingFast className="text-info" />;
//       case "cancelled": return <FaTimesCircle className="text-danger" />;
//       case "pickup scheduled": return <FaClock className="text-warning" />;
//       case "shipment created": return <FaBox className="text-primary" />;
//       default: return <FaInfoCircle className="text-secondary" />;
//     }
//   };
//   const isSelectedProduct = (p) => selectedProduct && p.name === selectedProduct.name;

//   /* ---------- render ---------- */
//   if (loading) return (
//     <>
//       <Header />
//       <div className="container mt-4 text-center py-5">
//         <div className="spinner-border text-primary" />
//         <p className="mt-2">Loading Shipment...</p>
//       </div>
//       <Footer />
//     </>
//   );

//   if (error || !shipmentData) return (
//     <>
//       <Header />
//       <div className="container mt-4 text-center py-5">
//         <div className="alert alert-danger">{error || "No data available"}</div>
//         <button className="btn btn-primary" onClick={() => navigate(-1)}>Go Back</button>
//       </div>
//       <Footer />
//     </>
//   );

//   const priceDetails = shipmentData.priceDetails || {};
//   const orderInfo = shipmentData.orderInfo || {};
//   const courier = shipmentData.courier || {};
//   const trackingTimeline = shipmentData.trackingTimeline || [];
//   const returns = shipmentData.returns || [];
//   const otherItems = shipmentData.otherItems || [];
//   const invoice = shipmentData.invoice || {};

//   return (
//     <>
//       <Header />
//       <div className="container mt-4 mb-5 position-relative mt-lg-5 pt-lg-5 mt-md-5 page-title-main-name">
//         <div className="mt-lg-4 mt-md-5">

//           <button className="btn btn-outline-secondary mb-4 mt-5" onClick={() => navigate(-1)}>
//             <FaArrowLeft className="me-2" /> Back to Orders
//           </button>
//         </div>

//         <div className="card mb-4 border-0 shadow-sm">
//           <div className="card-header bg-black text-white d-flex flex-column flex-md-row justify-content-between align-items-md-center">
//             <div>
//               <h5 className="ms-1 mb-0">Order Details</h5>
//               <small className="ms-1 text-white">Order ID: {orderInfo.orderId}</small>
//             </div>
//             <div className="d-flex gap-2 mt-2 mt-md-0 align-items-center flex-wrap">
//               {isCancellable(shipmentData.shipmentStatus) && getWaybill(shipmentData) && (
//                 <button className="btn btn-danger btn-sm" onClick={initiateCancellation}>
//                   <FaBan /> Cancel Shipment
//                 </button>
//               )}



//               <div className="border bg-opacity-75 px-3 py-1  d-flex align-items-center gap-2">
//                 {getStatusIcon(shipmentData.shipmentStatus)}
//                 <span className="fw-bold">{shipmentData.shipmentStatus}</span>
//               </div>



//               <button
//                 className="btn btn-download-btns text-white btn-sm text-primary fw-bold" 
//                 onClick={handleDownloadInvoice}
//                 disabled={downloadingInvoice || !invoice.invoiceId}
//               >
//                 {downloadingInvoice ? (
//                   <span className="spinner-border spinner-border-sm me-1"></span>
//                 ) : (
//                   <FaDownload className="me-1" />
//                 )}
//                 {downloadingInvoice ? "Generating..." : "Download Invoice"}
//               </button>

//             </div>
//           </div>

//           <div className="card-body">
//             <div className="row mt-3 ps-3">
//               <div className="col-md-6 mb-3 border-end">
//                 <p className="mb-1"><strong>Shipment ID :</strong> <span className="text-muted">{shipmentData.shipmentId}</span></p>
//                 <p className="mb-1"><strong>Order Date :</strong> <span className="text-muted">{formatDate(orderInfo.orderDate)}</span></p>
//                 <p className="mb-0"><strong>Status :</strong> <span className={`text-${getStatusColor(shipmentData.shipmentStatus)} fw-bold`}>{shipmentData.shipmentStatus}</span></p>
//               </div>
//               <div className="col-md-6">
//                 <p className="mb-1"><strong>Expected Delivery :</strong> <span className="text-success">{shipmentData.expectedDelivery ? formatDate(shipmentData.expectedDelivery) : "TBD"}</span></p>
//                 <p className="mb-1"><strong>Courier :</strong> <span className="text-muted">{courier.name || "Assigning..."}</span></p>
//                 {getWaybill(shipmentData) && (
//                   <p className="mb-0">
//                     <strong>Waybill/AWB :</strong>
//                     <span className="badge bg-warning text-dark border ms-2 mt-1">{getWaybill(shipmentData)}</span>
//                     {courier.trackingUrl && (
//                       <a
//                         href={courier.trackingUrl}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="ms-2 btn btn-sm btn-outline-light"
//                       >
//                         <FaExternalLinkAlt size={12} /> Track
//                       </a>
//                     )}
//                   </p>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="row">
//           <div className="col-lg-8">
//             {/* Products in Shipment */}
//             <div className="card mb-4 border-0 shadow-sm">
//               <div className="card-header bg-light fw-bold">Items in Shipment</div>
//               <div className="card-body">
//                 {shipmentData.products?.map((p, idx) => {
//                   const form = returnForms[idx];
//                   const activeReturn = hasActiveReturn(p);
//                   const returnInfo = getReturnForProduct(p);
//                   const canOpenReturn = shipmentData.shipmentStatus === "Delivered" && !activeReturn;

//                   const variantDisplay = typeof p.variant === "object"
//                     ? (p.variant?.shadeName || p.variant?.sku || "N/A")
//                     : (p.variant || "N/A");
//                   const skuDisplay = typeof p.variant === "object"
//                     ? (p.variant?.sku || "N/A")
//                     : (p.variant || "N/A");

//                   return (
//                     <div key={idx} className={`row justify-content-md-center mb-3 pb-3 align-items-center w-100 ms-0 ${isSelectedProduct(p) ? "bg-light border border-primary  p-2" : ""}`}>
//                       <div className="col-lg-2 col-4">
//                         <img src={p.image} className="img-fluid rounded border responsive-design-mobile" alt={p.name} />
//                       </div>
//                       <div className="col-lg-6 col-8">
//                         <h6 className="mb-0 fw-bold">{p.name}</h6>
//                         <small className="text-muted">
//                           Variant: {variantDisplay} (SKU: {skuDisplay}) | Qty: {p.qty}
//                         </small>

//                         {canOpenReturn && !form && (
//                           <div className="mt-2">
//                             <button className="btn btn-sm bg-black btn-outline-primary text-white me-2" onClick={() => openReturnForm(idx, "return")}>
//                               <FaUndo /> Return
//                             </button>
//                             <button className="btn bg-white btn-sm btn-outline-secondary" onClick={() => openReturnForm(idx, "replace")}>
//                               <FaExchangeAlt /> Replace
//                             </button>
//                           </div>
//                         )}

//                         {activeReturn && returnInfo && (
//                           <div className="mt-2">
//                             <span className="badge bg-warning text-dark">{returnInfo.statusLabel || returnInfo.status}</span>
//                             {returnInfo.courier?.waybill && (
//                               <small className="d-block text-muted mt-1">
//                                 Return AWB: {returnInfo.courier.waybill}
//                               </small>
//                             )}
//                           </div>
//                         )}

//                         {form && (
//                           <div className="mt-3 border rounded p-3 bg-white shadow-sm">
//                             <div className="d-flex justify-content-between align-items-center mb-2">
//                               <h6 className="mb-0 text-capitalize">{form.type} Item</h6>
//                               <button className="btn btn-sm btn-link text-danger" onClick={() => closeReturnForm(idx)}>
//                                 <FaTimesCircle />
//                               </button>
//                             </div>

//                             <div className="mb-2">
//                               <label className="form-label fw-bold">Quantity to {form.type}</label>
//                               <div className="d-flex align-items-center gap-2">
//                                 <button className="btn btn-sm btn-outline-secondary" onClick={() => handleReturnQuantity(idx, -1)} disabled={form.quantity <= 1}>-</button>
//                                 <span className="fw-bold px-3">{form.quantity}</span>
//                                 <button className="btn btn-sm btn-outline-secondary" onClick={() => handleReturnQuantity(idx, 1)} disabled={form.quantity >= form.maxQuantity}>+</button>
//                               </div>
//                             </div>

//                             <div className="mb-2">
//                               <label className="form-label fw-bold">Reason <span className="text-danger">*</span></label>
//                               <select
//                                 className="form-select form-select-sm"
//                                 value={form.reason}
//                                 onChange={(e) => setReturnForms(prev => ({ ...prev, [idx]: { ...prev[idx], reason: e.target.value } }))}
//                               >
//                                 <option value="">-- Select Reason --</option>
//                                 {RETURN_REASON_OPTIONS[form.type].map(opt => (
//                                   <option key={opt.value} value={opt.value}>{opt.label}</option>
//                                 ))}
//                               </select>
//                             </div>

//                             <div className="mb-2">
//                               <label className="form-label fw-bold">Description</label>
//                               <textarea
//                                 className="custom-textarea  form-control-sm"
//                                 rows="2"
//                                 value={form.description}
//                                 onChange={(e) => setReturnForms(prev => ({ ...prev, [idx]: { ...prev[idx], description: e.target.value } }))}
//                                 placeholder="Additional details..."
//                               />
//                             </div>

//                             <div className="mb-3">
//                               <label className="form-label fw-bold">
//                                 Images{RETURN_REASON_RULES[form.reason]?.imagesRequired ? " *" : ""}
//                               </label>
//                               <div
//                                 className="border rounded p-3 text-center bg-light cursor-pointer"
//                                 onClick={() => document.getElementById(`ret-img-${idx}`).click()}
//                               >
//                                 <FaCamera size={24} className="mb-2 text-muted" />
//                                 <p className="mb-0 small text-muted">Upload Photo</p>
//                               </div>
//                               <input id={`ret-img-${idx}`} type="file" multiple accept="image/*" className="d-none" onChange={(e) => handleReturnImages(idx, e.target.files)} />
//                               <div className="d-flex flex-wrap gap-2 mt-3">
//                                 {form.images.map((img, i) => (
//                                   <div key={i} className="position-relative">
//                                     <img src={img.preview} alt="prev" className="rounded border" style={{ width: 60, height: 60, objectFit: "cover" }} />
//                                     <button className="btn btn-danger btn-sm position-absolute top-0 end-0 rounded-circle p-0" onClick={() => removeReturnImage(idx, i)} style={{ width: 18, height: 18 }}>
//                                       <FaTrash size={10} />
//                                     </button>
//                                   </div>
//                                 ))}
//                               </div>
//                             </div>

//                             <button
//                               className="btn btn-success w-100 btn-sm"
//                               disabled={returning || !form.reason || (RETURN_REASON_RULES[form.reason]?.imagesRequired && form.images.length === 0)}
//                               onClick={() => submitReturn(idx)}
//                             >
//                               {returning ? "Submitting..." : `Submit ${form.type}`}
//                             </button>
//                           </div>
//                         )}
//                       </div>
//                       <div className="col-lg-4 col-4 text-lg-end text-start mt-lg-0 mt-3">
//                         <div className="fw-bold">₹{formatCurrency(p.sellingPrice * p.qty)}</div>
//                         {p.mrp > p.sellingPrice && <s className="text-muted small">₹{formatCurrency(p.mrp * p.qty)}</s>}
//                       </div>
//                     </div>
//                   );
//                 })}

//                 {/* Other Items Section */}
//                 {otherItems.length > 0 && (
//                   <>
//                     {/* <hr className="my-4" /> */}
//                     <h6 className="text-muted mb-3 ms-lg-3 ms-2">Other Items in this Order (Different Shipment)</h6>
//                     {otherItems.map((p, idx) => (
//                       <div key={`other-${idx}`} className="row mb-3 pb-1 opacity-75 w-100 ms-0 align-items-center">
//                         <div className="col-lg-2 col-4 mt-2">
//                           <img src={p.image} className="img-fluid rounded border" alt={p.name} />
//                         </div>
//                         <div className="col-lg-8 col-8">
//                           <span className="badge bg-secondary ms-1">In another shipment</span>
//                           <h6 className="mb-0 fw-bold mt-lg-2 mt-4 font-size-in-responsive">{p.name}</h6>
//                           <small className="text-muted">
//                             Variant: {typeof p.variant === "object"
//                               ? (p.variant?.shadeName || p.variant?.sku || "N/A")
//                               : (p.variant || "N/A")}
//                           </small>
//                         </div>
//                       </div>
//                     ))}
//                   </>
//                 )}
//               </div>
//             </div>

//             {/* Returns Section */}
//             {returns.length > 0 && (
//               <div className="card mb-4 border-0 shadow-sm">
//                 <div className="card-header bg-light fw-bold">Returns & Replacements</div>
//                 <div className="card-body">
//                   {returns.map((ret, idx) => (
//                     <div key={idx} className="rounded p-3 mb-3">
//                       <div className="d-flex justify-content-between align-items-start mb-2">
//                         <div className="ms-lg-3 mt-lg-2">
//                           <span className="badge bg-info text-dark me-2 text-capitalize">{ret.type}</span>
//                           <span className="badge bg-warning text-dark">{ret.statusLabel || ret.status}</span>
//                         </div>
//                         <small className="text-muted">{formatDateTime(ret.createdAt)}</small>
//                       </div>

//                       {ret.courier?.name && (
//                         <p className="mb-1 small">
//                           <strong>Courier:</strong> {ret.courier.name}
//                           {ret.courier.waybill && (
//                             <span className="ms-2 badge bg-light text-dark border mt-lg-1 mt-2">AWB: {ret.courier.waybill}</span>
//                           )}
//                         </p>
//                       )}

//                       {ret.refund && (
//                         <p className="mb-1 mt-2 small">
//                           <strong>Refund:</strong> ₹{formatCurrency(ret.refund.amount)} -
//                           <span className={`badge ms-2 mt-lg-0 mt-2 bg-${ret.refund.status === 'completed' ? 'success' : ret.refund.status === 'failed' ? 'danger' : 'warning'}`}>
//                             {ret.refund.status}
//                           </span>
//                           {ret.refund.refundedAt && (
//                             <span className="text-muted ms-1">({formatDateTime(ret.refund.refundedAt)})</span>
//                           )}
//                         </p>
//                       )}

//                       {ret.qc?.status && (
//                         <p className="mb-1 small">
//                           <strong>QC Check:</strong> {ret.qc.status}
//                           {ret.qc.notes && <span className="text-muted"> - {ret.qc.notes}</span>}
//                         </p>
//                       )}

//                       <div className="mt-2">
//                         {ret.items.map((item, i) => (
//                           <div key={i} className="small pt-2 mt-2">
//                             <strong>Reason:</strong> {RETURN_REASON_OPTIONS.return.find(r => r.value === item.reason)?.label || item.reason}
//                             {item.reasonDescription && <span className="text-muted"> - {item.reasonDescription}</span>}
//                             <div className="mt-1">
//                               <strong>Condition:</strong> {item.condition} | <strong>Qty:</strong> {item.quantity}
//                               {item.images?.length > 0 && (
//                                 <div className="d-flex gap-2 mt-1">
//                                   {item.images.map((img, imgIdx) => (
//                                     <img key={imgIdx} src={img} alt="return" style={{ width: 50, height: 50, objectFit: "cover" }} className="rounded border" />
//                                   ))}
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         ))}
//                       </div>

//                       {ret.trackingTimeline?.length > 0 && (
//                         <div className="mt-3 small pt-2">
//                           <strong>Return Tracking:</strong>
//                           <div className="mt-2">
//                             {ret.trackingTimeline.slice().reverse().map((evt, i) => (
//                               <div key={i} className="d-flex gap-2 mb-2">
//                                 <div>{getTrackingStatusIcon(evt.status)}</div>
//                                 <div className="ms-lg-3">
//                                   <div className="fw-bold text-capitalize">{evt.status.replace(/_/g, ' ')}</div>
//                                   <div className="text-muted">{evt.description}</div>
//                                   <div className="text-muted" style={{ fontSize: 11 }}>{formatDateTime(evt.timestamp)} | {evt.location}</div>
//                                 </div>
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Tracking Timeline */}
//             {trackingTimeline.length > 0 && (
//               <div className="card mb-4 border-0 shadow-sm">
//                 <div className="card-header bg-light fw-bold">Tracking History</div>
//                 <div className="card-body">
//                   <div className="timeline">
//                     {trackingTimeline.slice().reverse().map((evt, i) => (
//                       <div key={i} className="timeline-item mb-4 d-flex gap-3">
//                         <div className="timeline-marker">{getTrackingStatusIcon(evt.status)}</div>
//                         <div className="timeline-content">
//                           <h6 className="mb-0 fw-bold text-capitalize">{evt.status}</h6>
//                           <small className="text-muted d-block">{evt.description || evt.courierStatus}</small>
//                           <small className="text-muted" style={{ fontSize: 11 }}>
//                             {formatDateTime(evt.timestamp)} | {evt.location || "N/A"}
//                           </small>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>

//           <div className="col-lg-4">
//             {/* Price Summary */}
//             <div className="card mb-4 border-0 shadow-sm">
//               <div className="card-header bg-light fw-bold">Price Summary</div>
//               <div className="card-body ms-3 mt-3 me-lg-3 me-3">
//                 <div className="d-flex justify-content-between mb-2">
//                   <span>Total MRP</span>
//                   <span>₹{formatCurrency(priceDetails.totalMRP)}</span>
//                 </div>

//                 {priceDetails.totalDiscount > 0 && (
//                   <div className="d-flex justify-content-between mb-2">
//                     <span>Total Discount</span>
//                     <span className="text-success">-₹{formatCurrency(priceDetails.totalDiscount)}</span>
//                   </div>
//                 )}

//                 {priceDetails.breakdown?.productDiscount > 0 && (
//                   <div className="d-flex justify-content-between mb-2">
//                     <span>Product Discount</span>
//                     <span className="text-success">-₹{formatCurrency(priceDetails.breakdown.productDiscount)}</span>
//                   </div>
//                 )}

//                 <div className="d-flex justify-content-between mb-2">
//                   <span>Subtotal</span>
//                   <span>₹{formatCurrency(priceDetails.breakdown?.sellingPrice || priceDetails.shipmentTotal - priceDetails.otherCharges)}</span>
//                 </div>

//                 {!priceDetails.isFreeShipping && priceDetails.breakdown?.shippingCharge > 0 && (
//                   <div className="d-flex justify-content-between mb-2">
//                     <span>Shipping</span>
//                     <span className="text-info">+₹{formatCurrency(priceDetails.breakdown.shippingCharge)}</span>
//                   </div>
//                 )}

//                 {priceDetails.breakdown?.gst > 0 && (
//                   <div className="d-flex justify-content-between mb-2">
//                     <span>GST</span>
//                     <span className="text-black">+₹{formatCurrency(priceDetails.breakdown.gst)}</span>
//                   </div>
//                 )}

//                 {priceDetails.breakdown?.couponDiscount > 0 && (
//                   <div className="d-flex justify-content-between mb-2">
//                     <span>Coupon Discount</span>
//                     <span className="text-success">-₹{formatCurrency(priceDetails.breakdown.couponDiscount)}</span>
//                   </div>
//                 )}

//                 {priceDetails.breakdown?.pointsDiscount > 0 && (
//                   <div className="d-flex justify-content-between mb-2">
//                     <span>Points Discount</span>
//                     <span className="text-success">-₹{formatCurrency(priceDetails.breakdown.pointsDiscount)}</span>
//                   </div>
//                 )}

//                 {priceDetails.breakdown?.giftCardDiscount > 0 && (
//                   <div className="d-flex justify-content-between mb-2">
//                     <span>Gift Card Discount</span>
//                     <span className="text-success">-₹{formatCurrency(priceDetails.breakdown.giftCardDiscount)}</span>
//                   </div>
//                 )}

//                 {/* <hr /> */}
//                 <div className="d-flex justify-content-between fw-bold fs-5">
//                   <span>Shipment Total</span>
//                   <span className="text-black">₹{formatCurrency(priceDetails.shipmentTotal)}</span>
//                 </div>

//                 {priceDetails.totalShipments > 1 && (
//                   <div className="d-flex justify-content-between mt-2 small text-muted">
//                     <span>Order Total ({priceDetails.totalShipments} shipments)</span>
//                     <span>₹{formatCurrency(priceDetails.orderTotal)}</span>
//                   </div>
//                 )}

//                 {priceDetails.youSaved > 0 && (
//                   <div className="text-success mt-2 text-start">
//                     <strong>You Saved ₹{formatCurrency(priceDetails.youSaved)}</strong>
//                   </div>
//                 )}

//                 <div className="mt-3 pt-3 mb-4 small text-muted">
//                   <div className="d-flex justify-content-between">
//                     <span>Payment Mode:</span>
//                     <span className="fw-bold">{priceDetails.paymentMode || shipmentData.paymentMethod}</span>
//                   </div>
//                   <div className="d-flex justify-content-between">
//                     <span>Order Type:</span>
//                     <span>{shipmentData.orderType}</span>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Shipping Address */}
//             <div className="card border-0 shadow-sm">
//               <div className="card-header bg-light fw-bold">Shipping Address</div>
//               <div className="small ps-lg-3 ps-3 pb-lg-3 pb-4">
//                 <div className="fw-bold mt-lg-2 mt-2">{shipmentData.shippingAddress?.name}</div>
//                 <div className="mt-lg-2 mt-2">{shipmentData.shippingAddress?.addressLine1}</div>
//                 {shipmentData.shippingAddress?.addressLine2 && <div>{shipmentData.shippingAddress.addressLine2}</div>}
//                 <div className="mt-lg-2 mt-2">{shipmentData.shippingAddress?.city}, {shipmentData.shippingAddress?.state} - {shipmentData.shippingAddress?.pincode}</div>
//                 <div className="mt-lg-2 mt-2 fw-bold">Phone: {shipmentData.shippingAddress?.phone}</div>
//                 <div className="mt-lg-2 mt-2">Email: {shipmentData.shippingAddress?.email}</div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {showCancelModal && (
//           <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
//             <div className="modal-dialog modal-dialog-centered">
//               <div className="modal-content">
//                 <div className="modal-header bg-danger text-white">
//                   <h5 className="modal-title"><FaExclamationTriangle className="me-2" />Cancel Shipment</h5>
//                   <button type="button" className="btn-close btn-close-white" onClick={() => setShowCancelModal(false)}></button>
//                 </div>
//                 <div className="modal-body">
//                   <p className="mb-2">Are you sure? This action cannot be undone.</p>
//                   <div className="form-group">
//                     <label className="fw-bold mb-1">Reason <span className="text-danger">*</span></label>
//                     <textarea className="form-control" rows="3" value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} placeholder="Reason for cancellation..."></textarea>
//                   </div>
//                 </div>
//                 <div className="modal-footer">
//                   <button type="button" className="btn btn-secondary" onClick={() => setShowCancelModal(false)}>Close</button>
//                   <button type="button" className="btn btn-danger" onClick={handleConfirmCancel} disabled={cancelling}>{cancelling ? "Processing..." : "Confirm Cancellation"}</button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default OrderDetails;




















// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate, useLocation } from "react-router-dom";
// import Header from "./Header";
// import Footer from "./Footer";
// import "../css/orderdetails.css";
// import {
//   FaCheckCircle, FaBox, FaTruck, FaTimesCircle, FaClock,
//   FaArrowLeft, FaShippingFast, FaInfoCircle, FaBan, FaExclamationTriangle,
//   FaCamera, FaTrash, FaUndo, FaExchangeAlt, FaDownload, FaExternalLinkAlt
// } from "react-icons/fa";
// import axios from "axios";

// /* ---------- constants ---------- */
// const SHIPMENT_API = "https://beauty.joyory.com/api/user/cart/shipment";
// const RETURN_API = "https://beauty.joyory.com/api/returns/request";
// const INVOICE_BASE_URL = "https://beauty.joyory.com/api/user/cart/invoice";

// /* ---------- backend rule map ---------- */
// const RETURN_REASON_RULES = {
//   DAMAGED: { imagesRequired: true },
//   WRONG_ITEM: { imagesRequired: true },
//   EXPIRED: { imagesRequired: true },
//   QUALITY_ISSUE: { imagesRequired: true },
//   SIZE_ISSUE: { imagesRequired: false },
//   NO_LONGER_NEEDED: { imagesRequired: false }
// };

// /* ---------- user-friendly reason options ---------- */
// const RETURN_REASON_OPTIONS = {
//   return: [
//     { value: "DAMAGED", label: "Defective / Damaged product" },
//     { value: "WRONG_ITEM", label: "Wrong item received" },
//     { value: "EXPIRED", label: "Expired product" },
//     { value: "QUALITY_ISSUE", label: "Quality issue" },
//     { value: "SIZE_ISSUE", label: "Size / Fit issue" },
//     { value: "NO_LONGER_NEEDED", label: "No longer needed / Change of mind" }
//   ],
//   replace: [
//     { value: "DAMAGED", label: "Defective / Damaged product" },
//     { value: "WRONG_ITEM", label: "Wrong item received" },
//     { value: "QUALITY_ISSUE", label: "Quality issue" },
//     { value: "SIZE_ISSUE", label: "Size / Fit issue" }
//   ]
// };

// /* ---------- helpers ---------- */
// const formatDate = (d) => {
//   if (!d) return "N/A";
//   const dt = new Date(d);
//   return `${String(dt.getDate()).padStart(2, "0")}-${String(dt.getMonth() + 1).padStart(2, "0")}-${dt.getFullYear()}`;
// };
// const formatDateTime = (d) => {
//   if (!d) return "N/A";
//   const dt = new Date(d);
//   return `${formatDate(d)} ${String(dt.getHours()).padStart(2, "0")}:${String(dt.getMinutes()).padStart(2, "0")}`;
// };
// const formatCurrency = (n) => (n ? Number(n).toFixed(2) : "0.00");
// const getWaybill = (s) => s?.courier?.awb || s?.waybill || s?.awb || s?.orderInfo?.awb || null;

// const OrderDetails = () => {
//   const { shipmentId } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const selectedProduct = location.state?.selectedProduct;

//   /* ---- state ---- */
//   const [shipmentData, setShipmentData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   /* cancellation */
//   const [cancelling, setCancelling] = useState(false);
//   const [showCancelModal, setShowCancelModal] = useState(false);
//   const [cancelReason, setCancelReason] = useState("");

//   /* return / replace */
//   const [returnForms, setReturnForms] = useState({});
//   const [returning, setReturning] = useState(false);

//   /* invoice download */
//   const [downloadingInvoice, setDownloadingInvoice] = useState(false);

//   /* ---- data fetch ---- */
//   const fetchShipmentDetails = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await axios.get(`${SHIPMENT_API}/${shipmentId}`, { withCredentials: true });
//       if (res.data?.success) {
//         setShipmentData(res.data);
//       } else setError("Failed to fetch shipment details");
//     } catch (err) {
//       console.error(err);
//       if (err.response?.status === 401) navigate("/login");
//       else setError(err.response?.data?.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchShipmentDetails();
//   }, [shipmentId]);

//   /* ---------- INVOICE DOWNLOAD LOGIC ---------- */
//   const handleDownloadInvoice = async () => {
//     const invoiceId = shipmentData?.invoice?.invoiceId;

//     if (!invoiceId) {
//       alert("Invoice not available yet.");
//       return;
//     }

//     setDownloadingInvoice(true);

//     try {
//       const response = await axios.get(`${INVOICE_BASE_URL}/${invoiceId}`, {
//         withCredentials: true,
//         responseType: "blob",
//       });

//       let fileName = "Invoice.pdf";
//       const contentDisposition = response.headers["content-disposition"];
//       if (contentDisposition) {
//         const match = contentDisposition.match(/filename="(.+)"/);
//         if (match?.[1]) fileName = match[1];
//       }

//       const blob = new Blob([response.data], { type: "application/pdf" });
//       const url = window.URL.createObjectURL(blob);

//       const link = document.createElement("a");
//       link.href = url;
//       link.download = fileName;

//       document.body.appendChild(link);
//       link.click();

//       link.remove();
//       window.URL.revokeObjectURL(url);

//     } catch (err) {
//       console.error("Invoice Download Error:", err);

//       if (err.response?.data instanceof Blob) {
//         const text = await err.response.data.text();
//         try {
//           const json = JSON.parse(text);
//           alert(json.message || "Failed to download invoice");
//         } catch {
//           alert("Failed to download invoice");
//         }
//       } else {
//         alert("Something went wrong while downloading invoice");
//       }

//     } finally {
//       setDownloadingInvoice(false);
//     }
//   };

//   /* ---- cancellation logic ---- */
//   const isCancellable = (st) => {
//     if (!st) return false;
//     const blocked = ["picked up", "in transit", "out for delivery", "delivered", "cancelled"];
//     return !blocked.includes(st.toLowerCase());
//   };

//   const initiateCancellation = () => {
//     setCancelReason("");
//     setShowCancelModal(true);
//   };

//   const handleConfirmCancel = async () => {
//     if (!cancelReason.trim()) return alert("Reason required");
//     if (cancelling) return;
//     const orderId = shipmentData?.orderInfo?._id;
//     const waybill = getWaybill(shipmentData);
//     if (!orderId) return alert("Order ID missing");
//     if (!waybill) return alert("Waybill not assigned yet");
//     setCancelling(true);
//     try {
//       const res = await axios.put(
//         `${SHIPMENT_API}/cancel/${shipmentId}`,
//         { orderId, reason: cancelReason.trim() },
//         { withCredentials: true }
//       );
//       if (res.data?.success) {
//         alert(res.data.message || "Cancelled");
//         setShowCancelModal(false);
//         fetchShipmentDetails();
//       } else alert(res.data?.message || "Failed");
//     } catch (e) {
//       alert(e.response?.data?.message || "Error");
//     } finally {
//       setCancelling(false);
//     }
//   };

//   /* ---------- RETURN / REPLACE ---------- */
//   const openReturnForm = (idx, type) => {
//     const product = shipmentData.products[idx];
//     setReturnForms((prev) => ({
//       ...prev,
//       [idx]: {
//         type,
//         reason: "",
//         description: "",
//         images: [],
//         quantity: 1,
//         maxQuantity: product.qty
//       }
//     }));
//   };

//   const closeReturnForm = (idx) => {
//     setReturnForms((prev) => {
//       const copy = { ...prev };
//       delete copy[idx];
//       return copy;
//     });
//   };

//   const handleReturnQuantity = (idx, delta) => {
//     setReturnForms((prev) => {
//       const form = prev[idx];
//       if (!form) return prev;
//       let newQty = form.quantity + delta;
//       newQty = Math.max(1, Math.min(newQty, form.maxQuantity));
//       return { ...prev, [idx]: { ...form, quantity: newQty } };
//     });
//   };

//   const handleReturnImages = (idx, files) => {
//     if (!files || !files.length) return;
//     const form = returnForms[idx];
//     if (!form) return;
//     const total = form.images.length + files.length;
//     if (total > 5) return alert("Max 5 images allowed");
//     const newImgs = Array.from(files).map((file) =>
//       Object.assign(file, { preview: URL.createObjectURL(file) })
//     );
//     setReturnForms((prev) => ({
//       ...prev,
//       [idx]: { ...form, images: [...form.images, ...newImgs] }
//     }));
//   };

//   const removeReturnImage = (idx, i) => {
//     const form = returnForms[idx];
//     if (!form) return;
//     const copy = { ...form, images: form.images.filter((_, k) => k !== i) };
//     setReturnForms((prev) => ({ ...prev, [idx]: copy }));
//   };

//   const submitReturn = async (idx) => {
//     const form = returnForms[idx];
//     if (!form) return;
//     if (!form.reason) return alert("Please select a reason");

//     const rule = RETURN_REASON_RULES[form.reason];
//     if (rule?.imagesRequired && form.images.length === 0) {
//       return alert(`Images are required for reason: ${form.reason}`);
//     }

//     const product = shipmentData.products[idx];
//     if (!product) return;

//     const productId = product.productId || product._id;
//     let variantPayload = undefined;
//     if (product.variant && typeof product.variant === "object" && product.variant.sku) {
//       variantPayload = { sku: product.variant.sku };
//     }

//     const body = new FormData();
//     body.append("type", form.type);
//     body.append("reason", form.reason);
//     body.append("reasonDescription", form.description.trim());

//     const itemsPayload = [
//       {
//         productId,
//         quantity: form.quantity,
//         ...(variantPayload ? { variant: variantPayload } : {})
//       }
//     ];

//     body.append("items", JSON.stringify(itemsPayload));

//     form.images.forEach((file) => {
//       body.append(`images_${productId}`, file);
//     });

//     setReturning(true);
//     try {
//       const res = await axios.post(`${RETURN_API}/${shipmentId}`, body, {
//         withCredentials: true,
//         headers: { "Content-Type": "multipart/form-data" }
//       });
//       if (res.data?.success) {
//         alert(res.data.message || "Request submitted successfully");
//         closeReturnForm(idx);
//         fetchShipmentDetails();
//       } else {
//         alert(res.data?.message || "Request failed");
//       }
//     } catch (e) {
//       console.error("Return Error:", e);
//       alert(e.response?.data?.message || "Something went wrong");
//     } finally {
//       setReturning(false);
//     }
//   };

//   const hasActiveReturn = (p) => {
//     const returns = shipmentData?.returns || [];
//     return returns.some(
//       (r) =>
//         ["requested", "pickup_scheduled", "in_transit", "pickup_pending", "qc_passed", "qc_failed"].includes(r.status) &&
//         r.items.some((i) => i.productId.toString() === (p.productId || p._id).toString())
//     );
//   };

//   const getReturnForProduct = (p) => {
//     const returns = shipmentData?.returns || [];
//     return returns.find(
//       (r) => r.items.some((i) => i.productId.toString() === (p.productId || p._id).toString())
//     );
//   };

//   const getStatusIcon = (st) => {
//     switch (st?.toLowerCase()) {
//       case "delivered": return <FaTruck className="status-icon delivered" />;
//       case "shipped":
//       case "in transit": return <FaShippingFast className="status-icon shipped" />;
//       case "confirmed": return <FaCheckCircle className="status-icon confirmed" />;
//       case "cancelled": return <FaTimesCircle className="status-icon cancelled" />;
//       default: return <FaClock className="status-icon pending" />;
//     }
//   };
//   const getStatusColor = (st) => {
//     switch (st?.toLowerCase()) {
//       case "delivered": return "success";
//       case "shipped":
//       case "in transit": return "info";
//       case "confirmed": return "warning";
//       case "cancelled": return "danger";
//       default: return "secondary";
//     }
//   };
//   const getTrackingStatusIcon = (st) => {
//     switch (st?.toLowerCase()) {
//       case "delivered": return <FaTruck className="text-success" />;
//       case "in transit": return <FaShippingFast className="text-info" />;
//       case "cancelled": return <FaTimesCircle className="text-danger" />;
//       case "pickup scheduled": return <FaClock className="text-warning" />;
//       case "shipment created": return <FaBox className="text-primary" />;
//       default: return <FaInfoCircle className="text-secondary" />;
//     }
//   };
//   const isSelectedProduct = (p) => selectedProduct && p.name === selectedProduct.name;

//   /* ---------- render ---------- */
//   if (loading) return (
//     <>
//       <Header />
//       <div className="container mt-4 text-center py-5">
//         <div className="spinner-border text-primary" />
//         <p className="mt-2">Loading Shipment...</p>
//       </div>
//       <Footer />
//     </>
//   );

//   if (error || !shipmentData) return (
//     <>
//       <Header />
//       <div className="container mt-4 text-center py-5">
//         <div className="alert alert-danger">{error || "No data available"}</div>
//         <button className="btn btn-primary" onClick={() => navigate(-1)}>Go Back</button>
//       </div>
//       <Footer />
//     </>
//   );

//   const priceDetails = shipmentData.priceDetails || {};
//   const orderInfo = shipmentData.orderInfo || {};
//   const courier = shipmentData.courier || {};
//   const trackingTimeline = shipmentData.trackingTimeline || [];
//   const returns = shipmentData.returns || [];
//   const otherItems = shipmentData.otherItems || [];
//   const invoice = shipmentData.invoice || {};

//   return (
//     <>
//       <Header />
//       <div className="container mt-4 mb-5 position-relative mt-lg-5 pt-lg-5 mt-md-5 page-title-main-name">
//         <div className="mt-lg-4 mt-md-5">

//           <button className="btn btn-outline-secondary mb-4 mt-5" onClick={() => navigate(-1)}>
//             <FaArrowLeft className="me-2" /> Back to Orders
//           </button>
//         </div>

//         <div className="card mb-4 border-0 shadow-sm">
//           <div className="card-header bg-black text-white d-flex flex-column flex-md-row justify-content-between align-items-md-center">
//             <div>
//               <h5 className="ms-1 mb-0">Order Details</h5>
//               <small className="ms-1 text-white">Order ID: {orderInfo.orderId}</small>
//             </div>
//             <div className="d-flex gap-2 mt-2 mt-md-0 align-items-center flex-wrap">
//               {isCancellable(shipmentData.shipmentStatus) && getWaybill(shipmentData) && (
//                 <button className="btn btn-danger btn-sm" onClick={initiateCancellation}>
//                   <FaBan /> Cancel Shipment
//                 </button>
//               )}

//               <div className="border bg-opacity-75 px-3 py-1  d-flex align-items-center gap-2">
//                 {getStatusIcon(shipmentData.shipmentStatus)}
//                 <span className="fw-bold">{shipmentData.shipmentStatus}</span>
//               </div>

//               <button
//                 className="btn btn-download-btns text-white btn-sm text-primary fw-bold"
//                 onClick={handleDownloadInvoice}
//                 disabled={downloadingInvoice || !invoice.invoiceId}
//               >
//                 {downloadingInvoice ? (
//                   <span className="spinner-border spinner-border-sm me-1"></span>
//                 ) : (
//                   <FaDownload className="me-1" />
//                 )}
//                 {downloadingInvoice ? "Generating..." : "Download Invoice"}
//               </button>

//             </div>
//           </div>

//           <div className="card-body">
//             <div className="row mt-3 ps-3">
//               <div className="col-md-6 mb-3 border-end">
//                 <p className="mb-1"><strong>Shipment ID :</strong> <span className="text-muted">{shipmentData.shipmentId}</span></p>
//                 <p className="mb-1"><strong>Order Date :</strong> <span className="text-muted">{formatDate(orderInfo.orderDate)}</span></p>
//                 <p className="mb-0"><strong>Status :</strong> <span className={`text-${getStatusColor(shipmentData.shipmentStatus)} fw-bold`}>{shipmentData.shipmentStatus}</span></p>
//               </div>
//               <div className="col-md-6">
//                 <p className="mb-1"><strong>Expected Delivery :</strong> <span className="text-success">{shipmentData.expectedDelivery ? formatDate(shipmentData.expectedDelivery) : "TBD"}</span></p>
//                 <p className="mb-1"><strong>Courier :</strong> <span className="text-muted">{courier.name || "Assigning..."}</span></p>
//                 {getWaybill(shipmentData) && (
//                   <p className="mb-0">
//                     <strong>Waybill/AWB :</strong>
//                     <span className="badge bg-warning text-dark border ms-2 mt-1">{getWaybill(shipmentData)}</span>
//                     {courier.trackingUrl && (
//                       <a
//                         href={courier.trackingUrl}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="ms-2 btn btn-sm btn-outline-light"
//                       >
//                         <FaExternalLinkAlt size={12} /> Track
//                       </a>
//                     )}
//                   </p>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="row">
//           <div className="col-lg-8">
//             {/* Products in Shipment */}
//             <div className="card mb-4 border-0 shadow-sm">
//               <div className="card-header bg-light fw-bold">Items in Shipment</div>
//               <div className="card-body">
//                 {shipmentData.products?.map((p, idx) => {
//                   const form = returnForms[idx];
//                   const activeReturn = hasActiveReturn(p);
//                   const returnInfo = getReturnForProduct(p);
//                   const canOpenReturn = shipmentData.shipmentStatus === "Delivered" && !activeReturn;

//                   const variantDisplay = typeof p.variant === "object"
//                     ? (p.variant?.shadeName || p.variant?.sku || "N/A")
//                     : (p.variant || "N/A");
//                   const skuDisplay = typeof p.variant === "object"
//                     ? (p.variant?.sku || "N/A")
//                     : (p.variant || "N/A");

//                   return (
//                     <div key={idx} className={`row justify-content-md-center mb-3 pb-3 align-items-center w-100 ms-0 ${isSelectedProduct(p) ? "bg-light border border-primary  p-2" : ""}`}>
//                       <div className="col-lg-2 col-4">
//                         <img src={p.image} className="img-fluid rounded border responsive-design-mobile" alt={p.name} />
//                       </div>
//                       <div className="col-lg-6 col-8">
//                         <h6 className="mb-0 fw-bold">{p.name}</h6>
//                         <small className="text-muted">
//                           Variant: {variantDisplay} (SKU: {skuDisplay}) | Qty: {p.qty}
//                         </small>

//                         {canOpenReturn && !form && (
//                           <div className="mt-2">
//                             <button className="btn btn-sm bg-black btn-outline-primary text-white me-2" onClick={() => openReturnForm(idx, "return")}>
//                               <FaUndo /> Return
//                             </button>
//                             <button className="btn bg-white btn-sm btn-outline-secondary" onClick={() => openReturnForm(idx, "replace")}>
//                               <FaExchangeAlt /> Replace
//                             </button>
//                           </div>
//                         )}

//                         {activeReturn && returnInfo && (
//                           <div className="mt-2">
//                             <span className="badge bg-warning text-dark">{returnInfo.statusLabel || returnInfo.status}</span>
//                             {returnInfo.courier?.waybill && (
//                               <small className="d-block text-muted mt-1">
//                                 Return AWB: {returnInfo.courier.waybill}
//                               </small>
//                             )}
//                           </div>
//                         )}

//                         {form && (
//                           <div className="mt-3 border rounded p-3 bg-white shadow-sm">
//                             <div className="d-flex justify-content-between align-items-center mb-2">
//                               <h6 className="mb-0 text-capitalize">{form.type} Item</h6>
//                               <button className="btn btn-sm btn-link text-danger" onClick={() => closeReturnForm(idx)}>
//                                 <FaTimesCircle />
//                               </button>
//                             </div>

//                             <div className="mb-2">
//                               <label className="form-label fw-bold">Quantity to {form.type}</label>
//                               <div className="d-flex align-items-center gap-2">
//                                 <button className="btn btn-sm btn-outline-secondary" onClick={() => handleReturnQuantity(idx, -1)} disabled={form.quantity <= 1}>-</button>
//                                 <span className="fw-bold px-3">{form.quantity}</span>
//                                 <button className="btn btn-sm btn-outline-secondary" onClick={() => handleReturnQuantity(idx, 1)} disabled={form.quantity >= form.maxQuantity}>+</button>
//                               </div>
//                             </div>

//                             <div className="mb-2">
//                               <label className="form-label fw-bold">Reason <span className="text-danger">*</span></label>
//                               <select
//                                 className="form-select form-select-sm"
//                                 value={form.reason}
//                                 onChange={(e) => setReturnForms(prev => ({ ...prev, [idx]: { ...prev[idx], reason: e.target.value } }))}
//                               >
//                                 <option value="">-- Select Reason --</option>
//                                 {RETURN_REASON_OPTIONS[form.type].map(opt => (
//                                   <option key={opt.value} value={opt.value}>{opt.label}</option>
//                                 ))}
//                               </select>
//                             </div>

//                             <div className="mb-2">
//                               <label className="form-label fw-bold">Description</label>
//                               <textarea
//                                 className="custom-textarea  form-control-sm"
//                                 rows="2"
//                                 value={form.description}
//                                 onChange={(e) => setReturnForms(prev => ({ ...prev, [idx]: { ...prev[idx], description: e.target.value } }))}
//                                 placeholder="Additional details..."
//                               />
//                             </div>

//                             <div className="mb-3">
//                               <label className="form-label fw-bold">
//                                 Images{RETURN_REASON_RULES[form.reason]?.imagesRequired ? " *" : ""}
//                               </label>
//                               <div
//                                 className="border rounded p-3 text-center bg-light cursor-pointer"
//                                 onClick={() => document.getElementById(`ret-img-${idx}`).click()}
//                               >
//                                 <FaCamera size={24} className="mb-2 text-muted" />
//                                 <p className="mb-0 small text-muted">Upload Photo</p>
//                               </div>
//                               <input id={`ret-img-${idx}`} type="file" multiple accept="image/*" className="d-none" onChange={(e) => handleReturnImages(idx, e.target.files)} />
//                               <div className="d-flex flex-wrap gap-2 mt-3">
//                                 {form.images.map((img, i) => (
//                                   <div key={i} className="position-relative">
//                                     <img src={img.preview} alt="prev" className="rounded border" style={{ width: 60, height: 60, objectFit: "cover" }} />
//                                     <button className="btn btn-danger btn-sm position-absolute top-0 end-0 rounded-circle p-0" onClick={() => removeReturnImage(idx, i)} style={{ width: 18, height: 18 }}>
//                                       <FaTrash size={10} />
//                                     </button>
//                                   </div>
//                                 ))}
//                               </div>
//                             </div>

//                             <button
//                               className="btn btn-success w-100 btn-sm"
//                               disabled={returning || !form.reason || (RETURN_REASON_RULES[form.reason]?.imagesRequired && form.images.length === 0)}
//                               onClick={() => submitReturn(idx)}
//                             >
//                               {returning ? "Submitting..." : `Submit ${form.type}`}
//                             </button>
//                           </div>
//                         )}
//                       </div>
//                       <div className="col-lg-4 col-4 text-lg-end text-start mt-lg-0 mt-3">
//                         <div className="fw-bold">₹{formatCurrency(p.sellingPrice * p.qty)}</div>
//                         {p.mrp > p.sellingPrice && <s className="text-muted small">₹{formatCurrency(p.mrp * p.qty)}</s>}
//                       </div>
//                     </div>
//                   );
//                 })}

//                 {/* Other Items Section */}
//                 {otherItems.length > 0 && (
//                   <>
//                     <h6 className="text-muted mb-3 ms-lg-3 ms-2">Other Items in this Order (Different Shipment)</h6>
//                     {otherItems.map((p, idx) => (
//                       <div key={`other-${idx}`} className="row mb-3 pb-1 opacity-75 w-100 ms-0 align-items-center">
//                         <div className="col-lg-2 col-4 mt-2">
//                           <img src={p.image} className="img-fluid rounded border" alt={p.name} />
//                         </div>
//                         <div className="col-lg-8 col-8">
//                           <span className="badge bg-secondary ms-1">In another shipment</span>
//                           <h6 className="mb-0 fw-bold mt-lg-2 mt-4 font-size-in-responsive">{p.name}</h6>
//                           <small className="text-muted">
//                             Variant: {typeof p.variant === "object"
//                               ? (p.variant?.shadeName || p.variant?.sku || "N/A")
//                               : (p.variant || "N/A")}
//                           </small>
//                         </div>
//                       </div>
//                     ))}
//                   </>
//                 )}
//               </div>
//             </div>

//             {/* Returns Section */}
//             {returns.length > 0 && (
//               <div className="card mb-4 border-0 shadow-sm">
//                 <div className="card-header bg-light fw-bold">Returns & Replacements</div>
//                 <div className="card-body">
//                   {returns.map((ret, idx) => (
//                     <div key={idx} className="rounded p-3 mb-3">
//                       <div className="d-flex justify-content-between align-items-start mb-2">
//                         <div className="ms-lg-3 mt-lg-2">
//                           <span className="badge bg-info text-dark me-2 text-capitalize">{ret.type}</span>
//                           <span className="badge bg-warning text-dark">{ret.statusLabel || ret.status}</span>
//                         </div>
//                         <small className="text-muted">{formatDateTime(ret.createdAt)}</small>
//                       </div>

//                       {ret.courier?.name && (
//                         <p className="mb-1 small">
//                           <strong>Courier:</strong> {ret.courier.name}
//                           {ret.courier.waybill && (
//                             <span className="ms-2 badge bg-light text-dark border mt-lg-1 mt-2">AWB: {ret.courier.waybill}</span>
//                           )}
//                         </p>
//                       )}

//                       {ret.refund && (
//                         <p className="mb-1 mt-2 small">
//                           <strong>Refund:</strong> ₹{formatCurrency(ret.refund.amount)} -
//                           <span className={`badge ms-2 mt-lg-0 mt-2 bg-${ret.refund.status === 'completed' ? 'success' : ret.refund.status === 'failed' ? 'danger' : 'warning'}`}>
//                             {ret.refund.status}
//                           </span>
//                           {ret.refund.refundedAt && (
//                             <span className="text-muted ms-1">({formatDateTime(ret.refund.refundedAt)})</span>
//                           )}
//                         </p>
//                       )}

//                       {ret.qc?.status && (
//                         <p className="mb-1 small">
//                           <strong>QC Check:</strong> {ret.qc.status}
//                           {ret.qc.notes && <span className="text-muted"> - {ret.qc.notes}</span>}
//                         </p>
//                       )}

//                       <div className="mt-2">
//                         {ret.items.map((item, i) => (
//                           <div key={i} className="small pt-2 mt-2">
//                             <strong>Reason:</strong> {RETURN_REASON_OPTIONS.return.find(r => r.value === item.reason)?.label || item.reason}
//                             {item.reasonDescription && <span className="text-muted"> - {item.reasonDescription}</span>}
//                             <div className="mt-1">
//                               <strong>Condition:</strong> {item.condition} | <strong>Qty:</strong> {item.quantity}
//                               {item.images?.length > 0 && (
//                                 <div className="d-flex gap-2 mt-1">
//                                   {item.images.map((img, imgIdx) => (
//                                     <img key={imgIdx} src={img} alt="return" style={{ width: 50, height: 50, objectFit: "cover" }} className="rounded border" />
//                                   ))}
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Merged Tracking History — Shipment + Return tracking with fixed height & scroll */}
//             {(trackingTimeline.length > 0 || returns.some(r => r.trackingTimeline?.length > 0)) && (
//               <div className="card mb-4 border-0 shadow-sm">
//                 <div className="card-header bg-light fw-bold">Tracking History</div>
//                 <div className="card-body" style={{ maxHeight: "450px", overflowY: "auto" }}>
//                   <div className="timeline">
//                     {/* Shipment tracking events */}
//                     {trackingTimeline.slice().reverse().map((evt, i) => (
//                       <div key={`ship-${i}`} className="timeline-item mb-4 d-flex gap-3">
//                         <div className="timeline-marker">{getTrackingStatusIcon(evt.status)}</div>
//                         <div className="timeline-content">
//                           <h6 className="mb-0 fw-bold text-capitalize">{evt.status}</h6>
//                           <small className="text-muted d-block">{evt.description || evt.courierStatus}</small>
//                           <small className="text-muted" style={{ fontSize: 11 }}>
//                             {formatDateTime(evt.timestamp)} | {evt.location || "N/A"}
//                           </small>
//                         </div>
//                       </div>
//                     ))}

//                     {/* Return tracking events */}
//                     {returns.map((ret, retIdx) => (
//                       ret.trackingTimeline?.length > 0 && (
//                         <React.Fragment key={`ret-${retIdx}`}>
//                           <div className="mb-3 mt-2 px-2 py-1 bg-light rounded">
//                             <small className="fw-bold text-uppercase text-muted" style={{ fontSize: 11 }}>
//                               {ret.type} Tracking — {ret.statusLabel || ret.status}
//                             </small>
//                           </div>
//                           {ret.trackingTimeline.slice().reverse().map((evt, i) => (
//                             <div key={`ret-${retIdx}-${i}`} className="timeline-item mb-4 d-flex gap-3">
//                               <div className="timeline-marker">{getTrackingStatusIcon(evt.status)}</div>
//                               <div className="timeline-content">
//                                 <h6 className="mb-0 fw-bold text-capitalize">{evt.status.replace(/_/g, ' ')}</h6>
//                                 <small className="text-muted d-block">{evt.description}</small>
//                                 <small className="text-muted" style={{ fontSize: 11 }}>
//                                   {formatDateTime(evt.timestamp)} | {evt.location}
//                                 </small>
//                               </div>
//                             </div>
//                           ))}
//                         </React.Fragment>
//                       )
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>

//           <div className="col-lg-4">
//             {/* Price Summary */}
//             <div className="card mb-4 border-0 shadow-sm">
//               <div className="card-header bg-light fw-bold">Price Summary</div>
//               <div className="card-body ms-3 mt-3 me-lg-3 me-3">
//                 <div className="d-flex justify-content-between mb-2">
//                   <span>Total MRP</span>
//                   <span>₹{formatCurrency(priceDetails.totalMRP)}</span>
//                 </div>

//                 {priceDetails.totalDiscount > 0 && (
//                   <div className="d-flex justify-content-between mb-2">
//                     <span>Total Discount</span>
//                     <span className="text-success">-₹{formatCurrency(priceDetails.totalDiscount)}</span>
//                   </div>
//                 )}

//                 {/* {priceDetails.breakdown?.productDiscount > 0 && (
//                   <div className="d-flex justify-content-between mb-2">
//                     <span>Product Discount</span>
//                     <span className="text-success">-₹{formatCurrency(priceDetails.breakdown.productDiscount)}</span>
//                   </div>
//                 )} */}

//                 <div className="d-flex justify-content-between mb-2">
//                   <span>Subtotal</span>
//                   <span>₹{formatCurrency(priceDetails.breakdown?.sellingPrice || priceDetails.shipmentTotal - priceDetails.otherCharges)}</span>
//                 </div>

//                 {priceDetails.breakdown?.gst > 0 && (
//                   <div className="d-flex justify-content-between mb-2">
//                     <span>GST</span>
//                     <span className="text-black">+₹{formatCurrency(priceDetails.breakdown.gst)}</span>
//                   </div>
//                 )}


//                                   {/* {!priceDetails.isFreeShipping && priceDetails.breakdown?.shippingCharge > 0 && (
//                   <div className="d-flex justify-content-between mb-2">
//                     <span>Shipping</span>
//                     <span className="text-info">+₹{formatCurrency(priceDetails.breakdown.shippingCharge)}</span>
//                   </div>
//                 )} */}

//                 <div className="d-flex justify-content-between mb-2">
//                   <span>Shipping</span>

//                   {priceDetails.isFreeShipping || Number(priceDetails.breakdown?.shippingCharge) === 0 ? (
//                     <span className="text-success fw-bold">FREE</span>
//                   ) : (
//                     <span className="text-info">
//                       +₹{formatCurrency(priceDetails.breakdown?.shippingCharge)}
//                     </span>
//                   )}
//                 </div>

//                 {priceDetails.breakdown?.couponDiscount > 0 && (
//                   <div className="d-flex justify-content-between mb-2">
//                     <span>Coupon Discount</span>
//                     <span className="text-success">-₹{formatCurrency(priceDetails.breakdown.couponDiscount)}</span>
//                   </div>
//                 )}

//                 {priceDetails.breakdown?.pointsDiscount > 0 && (
//                   <div className="d-flex justify-content-between mb-2">
//                     <span>Points Discount</span>
//                     <span className="text-success">-₹{formatCurrency(priceDetails.breakdown.pointsDiscount)}</span>
//                   </div>
//                 )}

//                 {priceDetails.breakdown?.giftCardDiscount > 0 && (
//                   <div className="d-flex justify-content-between mb-2">
//                     <span>Gift Card Discount</span>
//                     <span className="text-success">-₹{formatCurrency(priceDetails.breakdown.giftCardDiscount)}</span>
//                   </div>
//                 )}

//                 <div className="d-flex justify-content-between fw-bold fs-5">
//                   <span>Shipment Total</span>
//                   <span className="text-black">₹{formatCurrency(priceDetails.shipmentTotal)}</span>
//                 </div>

//                 {priceDetails.totalShipments > 1 && (
//                   <div className="d-flex justify-content-between mt-2 small text-muted">
//                     <span>Order Total ({priceDetails.totalShipments} shipments)</span>
//                     <span>₹{formatCurrency(priceDetails.orderTotal)}</span>
//                   </div>
//                 )}

//                 {priceDetails.youSaved > 0 && (
//                   <div className="text-success mt-2 text-start">
//                     <strong>You Saved ₹{formatCurrency(priceDetails.youSaved)}</strong>
//                   </div>
//                 )}

//                 <div className="mt-3 pt-3 mb-4 small text-muted">
//                   <div className="d-flex justify-content-between">
//                     <span>Payment Mode:</span>
//                     <span className="fw-bold">{priceDetails.paymentMode || shipmentData.paymentMethod}</span>
//                   </div>
//                   <div className="d-flex justify-content-between">
//                     <span>Order Type:</span>
//                     <span>{shipmentData.orderType}</span>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Shipping Address */}
//             <div className="card border-0 shadow-sm">
//               <div className="card-header bg-light fw-bold">Shipping Address</div>
//               <div className="small ps-lg-3 ps-3 pb-lg-3 pb-4">
//                 <div className="fw-bold mt-lg-2 mt-2">{shipmentData.shippingAddress?.name}</div>
//                 <div className="mt-lg-2 mt-2">{shipmentData.shippingAddress?.addressLine1}</div>
//                 {shipmentData.shippingAddress?.addressLine2 && <div>{shipmentData.shippingAddress.addressLine2}</div>}
//                 <div className="mt-lg-2 mt-2">{shipmentData.shippingAddress?.city}, {shipmentData.shippingAddress?.state} - {shipmentData.shippingAddress?.pincode}</div>
//                 <div className="mt-lg-2 mt-2 fw-bold">Phone: {shipmentData.shippingAddress?.phone}</div>
//                 <div className="mt-lg-2 mt-2">Email: {shipmentData.shippingAddress?.email}</div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {showCancelModal && (
//           <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
//             <div className="modal-dialog modal-dialog-centered">
//               <div className="modal-content">
//                 <div className="modal-header bg-danger text-white">
//                   <h5 className="modal-title"><FaExclamationTriangle className="me-2" />Cancel Shipment</h5>
//                   <button type="button" className="btn-close btn-close-white" onClick={() => setShowCancelModal(false)}></button>
//                 </div>
//                 <div className="modal-body">
//                   <p className="mb-2">Are you sure? This action cannot be undone.</p>
//                   <div className="form-group">
//                     <label className="fw-bold mb-1">Reason <span className="text-danger">*</span></label>
//                     <textarea className="form-control" rows="3" value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} placeholder="Reason for cancellation..."></textarea>
//                   </div>
//                 </div>
//                 <div className="modal-footer">
//                   <button type="button" className="btn btn-secondary" onClick={() => setShowCancelModal(false)}>Close</button>
//                   <button type="button" className="btn btn-danger" onClick={handleConfirmCancel} disabled={cancelling}>{cancelling ? "Processing..." : "Confirm Cancellation"}</button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default OrderDetails;














import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import "../css/orderdetails.css";
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

  /* cancellation */
  const [cancelling, setCancelling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

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

  /* ---- cancellation logic ---- */
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
      <div className="container mt-4 text-center py-5">
        <div className="spinner-border text-primary" />
        <p className="mt-2">Loading Shipment...</p>
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
    <>
      <Header />
      <div className="container mt-4 mb-5 position-relative mt-lg-5 pt-lg-5 mt-md-5 page-title-main-name">
        <div className="mt-lg-4 mt-md-5">

         <button
  className="btn btn-outline-secondary mb-4 mt-5 back-btn"
  onClick={() => navigate(-1)}
>
  <FaArrowLeft className="me-2" /> Back to Orders
</button>
        </div>

        <div className="card mb-4 border-0 shadow-sm">
          <div className="card-header bg-black text-white d-flex flex-column flex-md-row justify-content-between align-items-md-center">
            <div>
              <h5 className="ms-1 mb-0">Order Details</h5>
              <small className="ms-1 text-white">Order ID: {orderInfo.orderId}</small>
            </div>
            <div className="d-flex gap-2 mt-2 mt-md-0 align-items-center flex-wrap">
              {isCancellable(shipmentData.shipmentStatus) && getWaybill(shipmentData) && !isReturnActive && (
                <button className="btn btn-danger btn-sm" onClick={initiateCancellation}>
                  <FaBan /> Cancel Shipment
                </button>
              )}

              {/* Status badge - Shows Return Status when active, otherwise Shipment Status */}
              <div className={`border bg-opacity-75 px-3 py-1 d-flex align-items-center gap-2 rounded bg-${getStatusColor(effectiveStatus.status, effectiveStatus.type)}`}>
                {getStatusIcon(effectiveStatus.status, effectiveStatus.type)}
                <span className="fw-bold text-white">
                  {isReturnActive && (
                    <small className="text-white-50 me-1" style={{ fontSize: "10px" }}>
                      {effectiveStatus.type === "return" ? "Return:" : "Replace:"}
                    </small>
                  )}
                  {displayStatus || "Pending"}
                </span>
              </div>

              <button
                className="btn btn-download-btns text-white btn-sm text-primary fw-bold"
                onClick={handleDownloadInvoice}
                disabled={downloadingInvoice || !invoice?.invoiceId}
              >
                {downloadingInvoice ? (
                  <span className="spinner-border spinner-border-sm me-1"></span>
                ) : (
                  <FaDownload className="me-1" />
                )}
                {downloadingInvoice ? "Generating..." : "Download Invoice"}
              </button>

            </div>
          </div>

          <div className="card-body">
            <div className="row mt-3 ps-3">
              <div className="col-md-6 mb-3 border-end">
                <p className="mb-1"><strong>Shipment ID :</strong> <span className="text-muted">{shipmentData.shipmentId}</span></p>
                <p className="mb-1"><strong>Order Date :</strong> <span className="text-muted">{formatDate(orderInfo.orderDate)}</span></p>
                <p className="mb-0">
                  <strong>Status :</strong> 
                  <span className={`text-${getStatusColor(effectiveStatus.status, effectiveStatus.type)} fw-bold ms-1`}>
                    {isReturnActive && (
                      <small className="text-muted" style={{ fontSize: "11px" }}>
                        {effectiveStatus.type === "return" ? "Return " : "Replace "}
                      </small>
                    )}
                    {displayStatus || "Pending"}
                  </span>
                  {/* Show original shipment status when return is active */}
                  {isReturnActive && shipmentData.shipmentStatus && (
                    <small className="text-muted d-block mt-1" style={{ fontSize: "11px" }}>
                      (Original: {shipmentData.shipmentStatus})
                    </small>
                  )}
                </p>
              </div>
              <div className="col-md-6">
                <p className="mb-1"><strong>Expected Delivery :</strong> <span className="text-success">{shipmentData.expectedDelivery ? formatDate(shipmentData.expectedDelivery) : "TBD"}</span></p>
                <p className="mb-1"><strong>Courier :</strong> <span className="text-muted">{courier.name || "Assigning..."}</span></p>
                {getWaybill(shipmentData) && (
                  <p className="mb-0">
                    <strong>Waybill/AWB :</strong>
                    <span className="badge bg-warning text-dark border ms-2 mt-1">{getWaybill(shipmentData)}</span>
                    {courier.trackingUrl && (
                      <a
                        href={courier.trackingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ms-2 btn btn-sm btn-outline-light"
                      >
                        <FaExternalLinkAlt size={12} /> Track
                      </a>
                    )}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-8">
            {/* Products in Shipment */}
            <div className="card mb-4 border-0 shadow-sm">
              <div className="card-header bg-light fw-bold">Items in Shipment</div>
              <div className="card-body">
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
                    <div key={idx} className={`row justify-content-md-center mb-3 pb-3 align-items-center w-100 ms-0 ${isSelectedProduct(p) ? "bg-light border border-primary  p-2" : ""}`}>
                      <div className="col-lg-2 col-4">
                        <img src={p.image} className="img-fluid rounded border responsive-design-mobile" alt={p.name} />
                      </div>
                      <div className="col-lg-6 col-8">
                        <h6 className="mb-0 fw-bold">{p.name}</h6>
                        <small className="text-muted">
                          Variant: {variantDisplay} (SKU: {skuDisplay}) | Qty: {p.qty}
                        </small>

                        {canOpenReturn && !form && (
                          <div className="mt-2">
                            <button className="btn btn-sm bg-black btn-outline-primary text-white me-2" onClick={() => openReturnForm(idx, "return")}>
                              <FaUndo /> Return
                            </button>
                            <button className="btn bg-white btn-sm btn-outline-secondary" onClick={() => openReturnForm(idx, "replace")}>
                              <FaExchangeAlt /> Replace
                            </button>
                          </div>
                        )}

                        {activeReturn && returnInfo && (
                          <div className="mt-2">
                            <span className="badge bg-warning text-dark">{returnInfo.statusLabel || returnInfo.status}</span>
                            {returnInfo.courier?.waybill && (
                              <small className="d-block text-muted mt-1">
                                Return AWB: {returnInfo.courier.waybill}
                              </small>
                            )}
                          </div>
                        )}

                        {form && (
                          <div className="mt-3 border rounded p-3 bg-white shadow-sm">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <h6 className="mb-0 text-capitalize">{form.type} Item</h6>
                              <button className="btn btn-sm btn-link text-danger" onClick={() => closeReturnForm(idx)}>
                                <FaTimesCircle />
                              </button>
                            </div>

                            <div className="mb-2">
                              <label className="form-label fw-bold">Quantity to {form.type}</label>
                              <div className="d-flex align-items-center gap-2">
                                <button className="btn btn-sm btn-outline-secondary" onClick={() => handleReturnQuantity(idx, -1)} disabled={form.quantity <= 1}>-</button>
                                <span className="fw-bold px-3">{form.quantity}</span>
                                <button className="btn btn-sm btn-outline-secondary" onClick={() => handleReturnQuantity(idx, 1)} disabled={form.quantity >= form.maxQuantity}>+</button>
                              </div>
                            </div>

                            <div className="mb-2">
                              <label className="form-label fw-bold">Reason <span className="text-danger">*</span></label>
                              <select
                                className="form-select form-select-sm"
                                value={form.reason}
                                onChange={(e) => setReturnForms(prev => ({ ...prev, [idx]: { ...prev[idx], reason: e.target.value } }))}
                              >
                                <option value="">-- Select Reason --</option>
                                {RETURN_REASON_OPTIONS[form.type].map(opt => (
                                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                              </select>
                            </div>

                            <div className="mb-2">
                              <label className="form-label fw-bold">Description</label>
                              <textarea
                                className="custom-textarea  form-control-sm"
                                rows="2"
                                value={form.description}
                                onChange={(e) => setReturnForms(prev => ({ ...prev, [idx]: { ...prev[idx], description: e.target.value } }))}
                                placeholder="Additional details..."
                              />
                            </div>

                            <div className="mb-3">
                              <label className="form-label fw-bold">
                                Images{RETURN_REASON_RULES[form.reason]?.imagesRequired ? " *" : ""}
                              </label>
                              <div
                                className="border rounded p-3 text-center bg-light cursor-pointer"
                                onClick={() => document.getElementById(`ret-img-${idx}`).click()}
                              >
                                <FaCamera size={24} className="mb-2 text-muted" />
                                <p className="mb-0 small text-muted">Upload Photo</p>
                              </div>
                              <input id={`ret-img-${idx}`} type="file" multiple accept="image/*" className="d-none" onChange={(e) => handleReturnImages(idx, e.target.files)} />
                              <div className="d-flex flex-wrap gap-2 mt-3">
                                {form.images.map((img, i) => (
                                  <div key={i} className="position-relative">
                                    <img src={img.preview} alt="prev" className="rounded border" style={{ width: 60, height: 60, objectFit: "cover" }} />
                                    <button className="btn btn-danger btn-sm position-absolute top-0 end-0 rounded-circle p-0" onClick={() => removeReturnImage(idx, i)} style={{ width: 18, height: 18 }}>
                                      <FaTrash size={10} />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <button
                              className="btn btn-success w-100 btn-sm"
                              disabled={returning || !form.reason || (RETURN_REASON_RULES[form.reason]?.imagesRequired && form.images.length === 0)}
                              onClick={() => submitReturn(idx)}
                            >
                              {returning ? "Submitting..." : `Submit ${form.type}`}
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="col-lg-4 col-4 text-lg-end text-start mt-lg-0 mt-3">
                        <div className="fw-bold">₹{formatCurrency(p.sellingPrice * p.qty)}</div>
                        {p.mrp > p.sellingPrice && <s className="text-muted small">₹{formatCurrency(p.mrp * p.qty)}</s>}
                      </div>
                    </div>
                  );
                })}

                {/* Other Items Section */}
                {otherItems.length > 0 && (
                  <>
                    <h6 className="text-muted mb-3 ms-lg-3 ms-2">Other Items in this Order (Different Shipment)</h6>
                    {otherItems.map((p, idx) => (
                      <div key={`other-${idx}`} className="row mb-3 pb-1 opacity-75 w-100 ms-0 align-items-center">
                        <div className="col-lg-2 col-4 mt-2">
                          <img src={p.image} className="img-fluid rounded border" alt={p.name} />
                        </div>
                        <div className="col-lg-8 col-8">
                          <span className="badge bg-secondary ms-1">In another shipment</span>
                          <h6 className="mb-0 fw-bold mt-lg-2 mt-4 font-size-in-responsive">{p.name}</h6>
                          <small className="text-muted">
                            Variant: {typeof p.variant === "object"
                              ? (p.variant?.shadeName || p.variant?.sku || "N/A")
                              : (p.variant || "N/A")}
                          </small>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>

            {/* Returns Section */}
            {returns.length > 0 && (
              <div className="card mb-4 border-0 shadow-sm">
                <div className="card-header bg-light fw-bold">Returns & Replacements</div>
                <div className="card-body" style={{ maxHeight: "500px", overflowY: "auto" }}>
                  {returns.map((ret, idx) => (
                    <div key={idx} className="rounded p-3 mb-3">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div className="ms-lg-3 mt-lg-2">
                          <span className="badge bg-info text-dark me-2 text-capitalize">{ret.type}</span>
                          <span className="badge bg-warning text-dark">{ret.statusLabel || ret.status}</span>
                        </div>
                        <small className="text-muted">{formatDateTime(ret.createdAt)}</small>
                      </div>

                      {ret.courier?.name && (
                        <p className="mb-1 small">
                          <strong>Courier:</strong> {ret.courier.name}
                          {ret.courier.waybill && (
                            <span className="ms-2 badge bg-light text-dark border mt-lg-1 mt-2">AWB: {ret.courier.waybill}</span>
                          )}
                        </p>
                      )}

                      {ret.refund && (
                        <p className="mb-1 mt-2 small">
                          <strong>Refund:</strong> ₹{formatCurrency(ret.refund.amount)} -
                          <span className={`badge ms-2 mt-lg-0 mt-2 bg-${ret.refund.status === 'completed' ? 'success' : ret.refund.status === 'failed' ? 'danger' : 'warning'}`}>
                            {ret.refund.status}
                          </span>
                          {ret.refund.refundedAt && (
                            <span className="text-muted ms-1">({formatDateTime(ret.refund.refundedAt)})</span>
                          )}
                        </p>
                      )}

                      {ret.qc?.status && (
                        <p className="mb-1 small">
                          <strong>QC Check:</strong> {ret.qc.status}
                          {ret.qc.notes && <span className="text-muted"> - {ret.qc.notes}</span>}
                        </p>
                      )}

                      <div className="mt-2">
                        {ret.items.map((item, i) => (
                          <div key={i} className="small pt-2 mt-2">
                            <strong>Reason:</strong> {RETURN_REASON_OPTIONS.return.find(r => r.value === item.reason)?.label || item.reason}
                            {item.reasonDescription && <span className="text-muted"> - {item.reasonDescription}</span>}
                            <div className="mt-1">
                              <strong>Condition:</strong> {item.condition} | <strong>Qty:</strong> {item.quantity}
                              {item.images?.length > 0 && (
                                <div className="d-flex gap-2 mt-1">
                                  {item.images.map((img, imgIdx) => (
                                    <img key={imgIdx} src={img} alt="return" style={{ width: 50, height: 50, objectFit: "cover" }} className="rounded border" />
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

            {/* Merged Tracking History — Shipment + Return tracking with fixed height & scroll */}
            {(trackingTimeline.length > 0 || returns.some(r => r.trackingTimeline?.length > 0)) && (
              <div className="card mb-4 border-0 shadow-sm">
                <div className="card-header bg-light fw-bold">Tracking History</div>
                <div className="card-body" style={{ maxHeight: "450px", overflowY: "auto" }}>
                  <div className="timeline">
                    {/* Shipment tracking events - reversed to show newest first */}
                    {trackingTimeline.slice().reverse().map((evt, i) => (
                      <div key={`ship-${i}`} className="timeline-item mb-4 d-flex gap-3">
                        <div className="timeline-marker">{getTrackingStatusIcon(evt.status)}</div>
                        <div className="timeline-content">
                          <h6 className="mb-0 fw-bold text-capitalize">{evt.status}</h6>
                          <small className="text-muted d-block">{evt.description || evt.courierStatus}</small>
                          <small className="text-muted" style={{ fontSize: 11 }}>
                            {formatDateTime(evt.timestamp)} | {evt.location || "N/A"}
                          </small>
                        </div>
                      </div>
                    ))}

                    {/* Return tracking events */}
                    {returns.map((ret, retIdx) => (
                      ret.trackingTimeline?.length > 0 && (
                        <React.Fragment key={`ret-${retIdx}`}>
                          <div className="mb-3 mt-2 px-2 py-1 bg-light rounded">
                            <small className="fw-bold text-uppercase text-muted" style={{ fontSize: 11 }}>
                              {ret.type} Tracking — {ret.statusLabel || ret.status}
                            </small>
                          </div>
                          {ret.trackingTimeline.slice().reverse().map((evt, i) => (
                            <div key={`ret-${retIdx}-${i}`} className="timeline-item mb-4 d-flex gap-3">
                              <div className="timeline-marker">{getTrackingStatusIcon(evt.status)}</div>
                              <div className="timeline-content">
                                <h6 className="mb-0 fw-bold text-capitalize">{evt.status.replace(/_/g, ' ')}</h6>
                                <small className="text-muted d-block">{evt.description}</small>
                                <small className="text-muted" style={{ fontSize: 11 }}>
                                  {formatDateTime(evt.timestamp)} | {evt.location}
                                </small>
                              </div>
                            </div>
                          ))}
                        </React.Fragment>
                      )
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="col-lg-4">
            {/* Price Summary */}
            <div className="card mb-4 border-0 shadow-sm">
              <div className="card-header bg-light fw-bold">Price Summary</div>
              <div className="card-body ms-3 mt-3 me-lg-3 me-3">
                <div className="d-flex justify-content-between mb-2">
                  <span>Total MRP</span>
                  <span>₹{formatCurrency(priceDetails.totalMRP)}</span>
                </div>

                {Number(priceDetails.totalDiscount) > 0 && (
                  <div className="d-flex justify-content-between mb-2">
                    <span>Total Discount</span>
                    <span className="text-success">-₹{formatCurrency(priceDetails.totalDiscount)}</span>
                  </div>
                )}

                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal</span>
                  <span>₹{formatCurrency(priceDetails.breakdown?.sellingPrice || priceDetails.shipmentTotal - priceDetails.otherCharges)}</span>
                </div>

                {/* Shipping Charge - Always visible */}
                {priceDetails.breakdown?.shippingCharge !== undefined && Number(priceDetails.breakdown?.shippingCharge) >= 0 && (
                  <div className="d-flex justify-content-between mb-2">
                    <span>Shipping</span>
                    {priceDetails.isFreeShipping || Number(priceDetails.breakdown?.shippingCharge) === 0 ? (
                      <span className="text-success fw-bold">FREE</span>
                    ) : (
                      <span className="text-info">+₹{formatCurrency(priceDetails.breakdown.shippingCharge)}</span>
                    )}
                  </div>
                )}

                {Number(priceDetails.breakdown?.gst) > 0 && (
                  <div className="d-flex justify-content-between mb-2">
                    <span>GST</span>
                    <span className="text-black">+₹{formatCurrency(priceDetails.breakdown.gst)}</span>
                  </div>
                )}

                {Number(priceDetails.breakdown?.couponDiscount) > 0 && (
                  <div className="d-flex justify-content-between mb-2">
                    <span>Coupon Discount</span>
                    <span className="text-success">-₹{formatCurrency(priceDetails.breakdown.couponDiscount)}</span>
                  </div>
                )}

                {Number(priceDetails.breakdown?.pointsDiscount) > 0 && (
                  <div className="d-flex justify-content-between mb-2">
                    <span>Points Discount</span>
                    <span className="text-success">-₹{formatCurrency(priceDetails.breakdown.pointsDiscount)}</span>
                  </div>
                )}

                {Number(priceDetails.breakdown?.giftCardDiscount) > 0 && (
                  <div className="d-flex justify-content-between mb-2">
                    <span>Gift Card Discount</span>
                    <span className="text-success">-₹{formatCurrency(priceDetails.breakdown.giftCardDiscount)}</span>
                  </div>
                )}

                <div className="d-flex justify-content-between fw-bold fs-5">
                  <span>Shipment Total</span>
                  <span className="text-black">₹{formatCurrency(priceDetails.shipmentTotal)}</span>
                </div>

                {priceDetails.totalShipments > 1 && (
                  <div className="d-flex justify-content-between mt-2 small text-muted">
                    <span>Order Total ({priceDetails.totalShipments} shipments)</span>
                    <span>₹{formatCurrency(priceDetails.orderTotal)}</span>
                  </div>
                )}

                {Number(priceDetails.youSaved) > 0 && (
                  <div className="text-success mt-2 text-start">
                    <strong>You Saved ₹{formatCurrency(priceDetails.youSaved)}</strong>
                  </div>
                )}

                <div className="mt-3 pt-3 mb-4 small text-muted">
                  <div className="d-flex justify-content-between">
                    <span>Payment Mode:</span>
                    <span className="fw-bold">{priceDetails.paymentMode || shipmentData.paymentMethod || "N/A"}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>Order Type:</span>
                    <span>{shipmentData.orderType || "N/A"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-light fw-bold">Shipping Address</div>
              <div className="small ps-lg-3 ps-3 pb-lg-3 pb-4">
                <div className="fw-bold mt-lg-2 mt-2">{shipmentData.shippingAddress?.name || "N/A"}</div>
                <div className="mt-lg-2 mt-2">{shipmentData.shippingAddress?.addressLine1 || "N/A"}</div>
                {shipmentData.shippingAddress?.addressLine2 && <div>{shipmentData.shippingAddress.addressLine2}</div>}
                <div className="mt-lg-2 mt-2">{shipmentData.shippingAddress?.city}, {shipmentData.shippingAddress?.state} - {shipmentData.shippingAddress?.pincode}</div>
                <div className="mt-lg-2 mt-2 fw-bold">Phone: {shipmentData.shippingAddress?.phone || "N/A"}</div>
                <div className="mt-lg-2 mt-2">Email: {shipmentData.shippingAddress?.email || "N/A"}</div>
              </div>
            </div>
          </div>
        </div>

        {showCancelModal && (
          <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header bg-danger text-white">
                  <h5 className="modal-title"><FaExclamationTriangle className="me-2" />Cancel Shipment</h5>
                  <button type="button" className="btn-close btn-close-white" onClick={() => setShowCancelModal(false)}></button>
                </div>
                <div className="modal-body">
                  <p className="mb-2">Are you sure? This action cannot be undone.</p>
                  <div className="form-group">
                    <label className="fw-bold mb-1">Reason <span className="text-danger">*</span></label>
                    <textarea className="custom-textarea" rows="3" value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} placeholder="Reason for cancellation..."></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowCancelModal(false)}>Close</button>
                  <button type="button" className="btn btn-danger" onClick={handleConfirmCancel} disabled={cancelling}>{cancelling ? "Processing..." : "Confirm Cancellation"}</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default OrderDetails;