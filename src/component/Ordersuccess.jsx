// ======================================================================(Done-Code)Start====================================================

// import React, { useState, useEffect } from "react";
// import { useLocation, useNavigate, useParams } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { Modal, Button, Form, Alert, Spinner, Badge } from "react-bootstrap";
// import "../css/ordersuccess.css";
// import InvoiceGenerator from "./InvoiceGenerator";

// /* -------------------- Cancel Success Popup -------------------- */
// const CancelSuccessPopup = ({ show, handleClose, onConfirm, order }) => (
//     <Modal show={show} onHide={handleClose} centered>
//         <Modal.Body className="text-center p-4">
//             <div className="mb-3">
//                 <div className="d-flex justify-content-center mb-3">
//                     <div className="bg-danger text-white rounded-circle d-flex align-items-center justify-content-center"
//                         style={{ width: "60px", height: "60px" }}>
//                         <i className="bi bi-check-lg" style={{ fontSize: "24px" }}></i>
//                     </div>
//                 </div>
//                 <h5 className="fw-bold mb-3 text-success">Order Cancelled Successfully!</h5>
//                 <p className="text-muted small mb-3">
//                     {order?.payment?.paid ? "Refund will be processed within 3–5 business days." : "Order has been cancelled successfully."}
//                 </p>

//                 <div className="mb-3 border p-3 rounded">
//                     <p className="mb-1"><strong>Order ID:</strong> {order?.displayOrderId || order?.orderId}</p>
//                     <p className="mb-1"><strong>Status:</strong> <Badge bg="danger">Cancelled</Badge></p>
//                     {order?.cancellation?.reason && (
//                         <p className="mb-1"><strong>Cancellation Reason:</strong> {order.cancellation.reason}</p>
//                     )}
//                 </div>

//                 <Button
//                     onClick={() => {
//                         handleClose();
//                         onConfirm && onConfirm();
//                     }}
//                     className="w-100"
//                     style={{
//                         backgroundColor: "#4A90E2",
//                         border: "none",
//                         borderRadius: "8px",
//                         fontWeight: "500",
//                     }}
//                 >
//                     Okay
//                 </Button>
//             </div>
//         </Modal.Body>
//     </Modal>
// );

// /* -------------------- Cancel Order Popup -------------------- */
// const CancelOrderPopup = ({
//     show,
//     handleClose,
//     orderId,
//     order,
// }) => {
//     const navigate = useNavigate();
//     const [reason, setReason] = useState("");
//     const [otherDetails, setOtherDetails] = useState("");
//     const [loading, setLoading] = useState(false);
//     const [message, setMessage] = useState(null);
//     const [isAuthenticated, setIsAuthenticated] = useState(false);
//     const [debugInfo, setDebugInfo] = useState({});

//     const reasons = [
//         "Applicable discount/offer was not applied",
//         "Changed my mind. Don't need the product",
//         "Bought it from somewhere else",
//         "Wrong shade/size/colour ordered",
//         "Forgot to apply coupon/reward points",
//         "Wrong address/phone",
//         "Other",
//     ];

//     useEffect(() => {
//         checkAuthentication();
//         if (order) {
//             analyzeOrderStructure(order);
//         }
//     }, [order]);

//     const analyzeOrderStructure = (order) => {
//         const info = {
//             hasUnderscoreId: !!order?._id,
//             hasOrderId: !!order?.orderId,
//             hasDisplayOrderId: !!order?.displayOrderId,
//             orderIdValue: order?.orderId,
//             underscoreIdValue: order?._id,
//             displayOrderIdValue: order?.displayOrderId,
//             isUnderscoreIdMongoId: /^[0-9a-fA-F]{24}$/.test(order?._id || ""),
//             isOrderIdMongoId: /^[0-9a-fA-F]{24}$/.test(order?.orderId || ""),
//             orderStatus: order?.orderStatus || order?.status,
//             shipments: order?.shipments || order?.shipping?.shipments,
//             payment: order?.payment,
//         };
//         setDebugInfo(info);
//         console.log("🔍 Order Structure Analysis:", info);
//     };

//     const checkAuthentication = async () => {
//         try {
//             const token = localStorage.getItem('authToken');
//             const user = localStorage.getItem('adminUser');

//             if (token && user) {
//                 setIsAuthenticated(true);
//             } else {
//                 // Try to fetch user profile to verify token
//                 const response = await fetch(
//                     "https://beauty.joyory.com/api/user/profile",
//                     {
//                         method: "GET",
//                         credentials: "include",
//                         headers: {
//                             "Content-Type": "application/json",
//                         },
//                     }
//                 );

//                 if (response.ok) {
//                     setIsAuthenticated(true);
//                 } else {
//                     setIsAuthenticated(false);
//                 }
//             }
//         } catch (error) {
//             console.error("Auth check error:", error);
//             setIsAuthenticated(false);
//         }
//     };

//     const getCancellableOrderId = () => {
//         // Try different possible ID fields in priority order
//         const possibleIds = [
//             order?._id,        // MongoDB ObjectId
//             order?.orderId,    // Order ID field
//         ];

//         for (const id of possibleIds) {
//             if (id && /^[0-9a-fA-F]{24}$/.test(id)) {
//                 console.log(`✅ Using MongoDB ID: ${id}`);
//                 return id;
//             }
//         }

//         // If no valid MongoDB ID found, use whatever ID is available
//         const fallbackId = order?._id || order?.orderId;
//         console.log(`⚠️ Using fallback ID: ${fallbackId}`);
//         return fallbackId;
//     };

//     // const handleSubmit = async (e) => {
//     //     e.preventDefault();

//     //     const finalReason = reason === "Other" ? otherDetails.trim() : reason.trim();
//     //     if (!finalReason) {
//     //         setMessage({ type: "danger", text: "Cancellation reason is required" });
//     //         return;
//     //     }

//     //     if (!isAuthenticated) {
//     //         setMessage({ type: "warning", text: "Please login to cancel the order" });
//     //         return;
//     //     }

//     //     const mongoOrderId = getCancellableOrderId();
//     //     if (!mongoOrderId) {
//     //         setMessage({ type: "danger", text: "Order ID not found" });
//     //         return;
//     //     }

//     //     setLoading(true);
//     //     setMessage(null);

//     //     try {
//     //         // Get auth token
//     //         const token = localStorage.getItem('authToken');
//     //         console.log("🔑 Auth Token:", token ? "Present" : "Missing");

//     //         // Prepare request headers
//     //         const headers = {
//     //             "Content-Type": "application/json",
//     //         };

//     //         // Add authorization if token exists
//     //         if (token) {
//     //             headers["Authorization"] = `Bearer ${token}`;
//     //         }

//     //         // Log full request details
//     //         console.log("📤 Sending Cancellation Request:");
//     //         console.log("URL:", `https://beauty.joyory.com/api/user/cart/cancel/${mongoOrderId}`);
//     //         console.log("Headers:", headers);
//     //         console.log("Body:", { reason: finalReason });
//     //         console.log("Order ID being used:", mongoOrderId);

//     //         // Make the request
//     //         const res = await fetch(
//     //             `https://beauty.joyory.com/api/user/cart/cancel/${mongoOrderId}`,
//     //             {
//     //                 method: "POST",
//     //                 credentials: "include", // Include cookies for session
//     //                 headers: headers,
//     //                 body: JSON.stringify({ reason: finalReason })
//     //             }
//     //         );

//     //         console.log("📥 Response Status:", res.status);
//     //         console.log("Response Headers:", Object.fromEntries(res.headers.entries()));

//     //         let data;
//     //         const contentType = res.headers.get("content-type");

//     //         if (contentType && contentType.includes("application/json")) {
//     //             data = await res.json();
//     //             console.log("Response Data:", data);
//     //         } else {
//     //             const text = await res.text();
//     //             console.error("Non-JSON Response:", text.substring(0, 200));
//     //             throw new Error(`Server returned ${contentType || 'unknown format'}`);
//     //         }

//     //         if (!res.ok) {
//     //             throw new Error(data.message || `Request failed with status ${res.status}`);
//     //         }

//     //         // ✅ SUCCESS
//     //         setMessage({ type: "success", text: data.message || "Order cancelled successfully!" });

//     //         const updatedOrder = {
//     //             ...order,
//     //             orderStatus: "Cancelled",
//     //             status: "Cancelled",
//     //             cancellation: {
//     //                 reason: finalReason,
//     //                 cancelledBy: "Customer",
//     //                 requestedAt: new Date().toISOString()
//     //             }
//     //         };

//     //         // Update order in parent component
//     //         setTimeout(() => {
//     //             handleClose();
//     //             if (typeof window.handleCancelSuccess === 'function') {
//     //                 window.handleCancelSuccess({ order: updatedOrder });
//     //             }
//     //         }, 1500);

//     //     } catch (err) {
//     //         console.error("❌ Cancellation Error:", err);
//     //         console.error("Error details:", {
//     //             name: err.name,
//     //             message: err.message,
//     //             stack: err.stack
//     //         });

//     //         let errorMessage = err.message || "Something went wrong";

//     //         if (err.message.includes("Failed to fetch") || err.message.includes("Network Error")) {
//     //             errorMessage = "Network error. Please check your connection and try again.";
//     //         } else if (err.message.includes("401")) {
//     //             errorMessage = "Authentication required. Please login again.";
//     //             localStorage.removeItem('authToken');
//     //             localStorage.removeItem('adminUser');
//     //             setIsAuthenticated(false);
//     //         } else if (err.message.includes("404")) {
//     //             errorMessage = "Order not found. Please check the order ID.";
//     //         } else if (err.message.includes("403")) {
//     //             errorMessage = "You are not authorized to cancel this order.";
//     //         }

//     //         setMessage({
//     //             type: "danger",
//     //             text: errorMessage
//     //         });
//     //     } finally {
//     //         setLoading(false);
//     //     }
//     // };



//     const handleSubmit = async (e) => {
//   e.preventDefault();

//   const finalReason =
//     reason === "Other" ? otherDetails.trim() : reason.trim();

//   if (!finalReason) {
//     setMessage({ type: "danger", text: "Cancellation reason is required" });
//     return;
//   }

//   const token = localStorage.getItem("authToken");
//   if (!token) {
//     setMessage({ type: "warning", text: "Please login to cancel the order" });
//     return;
//   }

//   const mongoOrderId = getCancellableOrderId();
//   if (!mongoOrderId) {
//     setMessage({ type: "danger", text: "Order reference not found" });
//     return;
//   }

//   setLoading(true);
//   setMessage(null);

//   try {
//     const res = await fetch(
//       `https://beauty.joyory.com/api/user/cart/cancel/${mongoOrderId}`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${token}`, // ✅ REAL TOKEN
//         },
//         credentials: "include",
//         body: JSON.stringify({ reason: finalReason }),
//       }
//     );

//     const data = await res.json();

//     if (!res.ok) {
//       throw new Error(data.message || "Cancellation failed");
//     }

//     setMessage({ type: "success", text: data.message });

//     const updatedOrder = {
//       ...order,
//       orderStatus: "Cancelled",
//       status: "Cancelled",
//       cancellation: {
//         reason: finalReason,
//         cancelledBy: "Customer",
//         requestedAt: new Date().toISOString(),
//       },
//     };

//     setTimeout(() => {
//       handleClose();
//       window.handleCancelSuccess?.({ order: updatedOrder });
//     }, 1200);

//   } catch (err) {
//     if (err.message.includes("401")) {
//       localStorage.removeItem("authToken");
//       setIsAuthenticated(false);
//     }

//     setMessage({
//       type: "danger",
//       text: err.message || "Something went wrong",
//     });
//   } finally {
//     setLoading(false);
//   }
// };

//     const canCancel = () => {
//         if (!order) return false;

//         // Check if already cancelled
//         if (order.orderStatus === "Cancelled" || order.status === "Cancelled") {
//             return false;
//         }

//         // Get current status
//         const currentStatus = order.orderStatus || order.status;

//         // Define non-cancellable statuses
//         const nonCancellableStatuses = [
//             "Delivered", 
//             "Shipped", 
//             "Out for Delivery",
//             "Picked Up",
//             "In Transit"
//         ];

//         // Check main status
//         if (nonCancellableStatuses.includes(currentStatus)) {
//             return false;
//         }

//         // Check shipments if they exist
//         const shipments = order.shipments || order.shipping?.shipments;
//         if (shipments && shipments.length > 0) {
//             const blockedShipmentStatuses = [
//                 "Picked Up",
//                 "In Transit",
//                 "Out for Delivery",
//                 "Delivered"
//             ];

//             return !shipments.some(shipment => 
//                 blockedShipmentStatuses.includes(shipment.status)
//             );
//         }

//         return true;
//     };

//     const isCancellable = canCancel();

//     return (
//         <Modal show={show} onHide={handleClose} centered size="lg">
//             <Modal.Header closeButton>
//                 <Modal.Title>Cancel Order</Modal.Title>
//             </Modal.Header>
//             <Modal.Body>
//                 {message && (
//                     <Alert variant={message.type} onClose={() => setMessage(null)} dismissible>
//                         {message.text}
//                     </Alert>
//                 )}

//                 <div className="alert alert-info mb-3">
//                     <strong>Order Details:</strong><br />
//                     <strong>Display ID:</strong> {order?.displayOrderId || "N/A"}<br />
//                     <strong>MongoDB _id:</strong> {order?._id || "N/A"}<br />
//                     <strong>Order ID:</strong> {order?.orderId || "N/A"}<br />
//                     <strong>Status:</strong> {order?.status || order?.orderStatus || "N/A"}<br />
//                     <strong>Authentication:</strong> {isAuthenticated ?
//                         <span className="text-success">✓ Logged in</span> :
//                         <span className="text-danger">✗ Not logged in</span>
//                     }
//                 </div>

//                 {!isAuthenticated && (
//                     <Alert variant="warning" className="mb-3">
//                         <strong>Authentication Required!</strong>
//                         <p className="mb-2">You need to be logged in to cancel orders.</p>
//                         <Button
//                             variant="warning"
//                             size="sm"
//                             onClick={() => {
//                                 localStorage.setItem('redirectAfterLogin', window.location.pathname);
//                                 navigate('/login');
//                             }}
//                         >
//                             Log In Now
//                         </Button>
//                     </Alert>
//                 )}

//                 {!isCancellable && (
//                     <Alert variant="danger" className="mb-3">
//                         <strong>Cannot Cancel Order!</strong>
//                         <p className="mb-0">
//                             {order?.status === "Cancelled" ? "Order is already cancelled." :
//                             order?.status === "Delivered" ? "Order is already delivered." :
//                             order?.status === "Shipped" ? "Order is already shipped." :
//                             "Order cannot be cancelled at this stage."}
//                         </p>
//                     </Alert>
//                 )}

//                 <Form onSubmit={handleSubmit}>
//                     <Form.Group className="mb-3">
//                         <Form.Label>Reason for Cancellation*</Form.Label>
//                         <Form.Select
//                             required
//                             value={reason}
//                             onChange={(e) => setReason(e.target.value)}
//                             disabled={loading || !isAuthenticated || !isCancellable}
//                         >
//                             <option value="">Select a reason</option>
//                             {reasons.map((r, i) => (
//                                 <option key={i} value={r}>{r}</option>
//                             ))}
//                         </Form.Select>
//                     </Form.Group>

//                     {reason === "Other" && (
//                         <Form.Group className="mb-3">
//                             <Form.Label>Other Details*</Form.Label>
//                             <Form.Control
//                                 as="textarea"
//                                 rows={3}
//                                 maxLength={250}
//                                 placeholder="Please specify your reason..."
//                                 value={otherDetails}
//                                 onChange={(e) => setOtherDetails(e.target.value)}
//                                 required
//                                 disabled={loading || !isAuthenticated || !isCancellable}
//                             />
//                             <div className="text-end small text-muted mt-1">
//                                 {otherDetails.length}/250
//                             </div>
//                         </Form.Group>
//                     )}

//                     <div className="alert alert-warning small mb-3">
//                         <strong>Important Information:</strong>
//                         <ul className="mb-0 mt-1">
//                             <li>Orders with shipments already "Picked Up", "In Transit", or "Delivered" cannot be cancelled</li>
//                             <li>Refunds for paid orders take 3-5 business days</li>
//                             <li>You can only cancel your own orders</li>
//                             <li>Cancellation is irreversible</li>
//                         </ul>
//                     </div>

//                     <div className="d-flex gap-2">
//                         <Button
//                             variant="secondary"
//                             onClick={handleClose}
//                             className="w-50"
//                             disabled={loading}
//                         >
//                             Cancel
//                         </Button>
//                         <Button
//                             type="submit"
//                             className="w-50"
//                             disabled={loading || !isAuthenticated || !isCancellable}
//                             style={{
//                                 backgroundColor: !isAuthenticated || !isCancellable ? "#ccc" : "#1e88e5",
//                                 border: "none",
//                                 borderRadius: "8px",
//                                 padding: "10px",
//                                 fontWeight: "500",
//                             }}
//                         >
//                             {loading ? (
//                                 <>
//                                     <Spinner animation="border" size="sm" /> Processing...
//                                 </>
//                             ) : !isAuthenticated ? (
//                                 "Login Required"
//                             ) : !isCancellable ? (
//                                 "Cannot Cancel"
//                             ) : (
//                                 "Confirm Cancellation"
//                             )}
//                         </Button>
//                     </div>
//                 </Form>

//                 {/* Enhanced Debug Information */}
//                 <div className="mt-4 p-3 border rounded bg-light small">
//                     <h6 className="fw-bold">Debug Information:</h6>
//                     <div className="row">
//                         <div className="col-md-6">
//                             <div className="mb-1">
//                                 <strong>Order Structure:</strong>
//                                 <pre className="bg-white p-2 rounded mt-1" style={{ fontSize: '10px' }}>
//                                     {JSON.stringify(debugInfo, null, 2)}
//                                 </pre>
//                             </div>
//                         </div>
//                         <div className="col-md-6">
//                             <div className="mb-1">
//                                 <strong>Authentication Status:</strong><br/>
//                                 Token: {localStorage.getItem('authToken') ? "✅ Present" : "❌ Missing"}<br/>
//                                 User: {localStorage.getItem('adminUser') ? "✅ Present" : "❌ Missing"}
//                             </div>
//                             <div className="mb-1">
//                                 <strong>Cancellation Logic:</strong><br/>
//                                 Is Cancellable: {isCancellable ? "✅ Yes" : "❌ No"}<br/>
//                                 Can Cancel Check: {canCancel() ? "✅ Yes" : "❌ No"}
//                             </div>
//                             <div className="mb-1">
//                                 <strong>API Details:</strong><br/>
//                                 Endpoint: /api/user/cart/cancel/{getCancellableOrderId()}<br/>
//                                 Method: POST<br/>
//                                 Auth: {localStorage.getItem('authToken') ? "Bearer Token" : "Session Cookie"}
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </Modal.Body>
//         </Modal>
//     );
// };

// /* -------------------- Status Badge Component -------------------- */
// const StatusBadge = ({ status }) => {
//     const getBadgeProps = (status) => {
//         if (!status) return { bg: 'secondary', text: 'white' };

//         const statusLower = status.toLowerCase();
//         if (statusLower.includes('awaiting')) return { bg: 'warning', text: 'dark' };
//         if (statusLower.includes('confirmed')) return { bg: 'info', text: 'white' };
//         if (statusLower.includes('processing')) return { bg: 'primary', text: 'white' };
//         if (statusLower.includes('shipped')) return { bg: 'success', text: 'white' };
//         if (statusLower.includes('delivered')) return { bg: 'success', text: 'white' };
//         if (statusLower.includes('cancelled')) return { bg: 'danger', text: 'white' };
//         return { bg: 'secondary', text: 'white' };
//     };

//     const { bg, text } = getBadgeProps(status);

//     return <Badge bg={bg} text={text} className="px-3 py-2">{status}</Badge>;
// };

// /* -------------------- Next Steps Component -------------------- */
// const NextSteps = ({ steps }) => (
//     <div className="card shadow-sm mb-4 border-info">
//         <div className="card-header fw-bold bg-info text-white">
//             <i className="bi bi-info-circle me-2"></i>
//             What's Next?
//         </div>
//         <div className="card-body">
//             <ul className="list-unstyled mb-0">
//                 {steps?.map((step, index) => (
//                     <li key={index} className="mb-2 d-flex align-items-start">
//                         <i className="bi bi-check-circle-fill text-success me-2 mt-1"></i>
//                         <span>{step}</span>
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     </div>
// );

// /* -------------------- Main Component -------------------- */
// const OrderSuccess = () => {
//     const location = useLocation();
//     const navigate = useNavigate();
//     const { orderId } = useParams();

//     const [order, setOrder] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [showCancelPopup, setShowCancelPopup] = useState(false);
//     const [showSuccessPopup, setShowSuccessPopup] = useState(false);
//     const [cancelledOrder, setCancelledOrder] = useState(null);
//     const [debugData, setDebugData] = useState({});

//     // Fetch order data from API
//     const fetchOrderDetails = async (id) => {
//         try {
//             setLoading(true);
//             setError(null);

//             const orderIdToFetch = id || orderId;

//             console.log("🔍 Starting order fetch for:", orderIdToFetch);

//             if (orderIdToFetch) {
//                 // Try multiple endpoints if needed
//                 const endpoints = [
//                     `https://beauty.joyory.com/api/payment/success/${orderIdToFetch}`,
//                     `https://beauty.joyory.com/api/order/${orderIdToFetch}`,
//                     `https://beauty.joyory.com/api/user/orders/${orderIdToFetch}`
//                 ];

//                 let response = null;
//                 let lastError = null;

//                 for (const endpoint of endpoints) {
//                     try {
//                         console.log("Trying endpoint:", endpoint);
//                         response = await fetch(endpoint, {
//                             method: "GET",
//                             credentials: "include",
//                             headers: {
//                                 "Content-Type": "application/json",
//                                 "Accept": "application/json",
//                             },
//                         });

//                         if (response.ok) {
//                             console.log("✅ Success with endpoint:", endpoint);
//                             break;
//                         } else {
//                             console.log(`❌ Failed with endpoint ${endpoint}: ${response.status}`);
//                             lastError = `Failed with status ${response.status}`;
//                         }
//                     } catch (err) {
//                         console.log(`❌ Error with endpoint ${endpoint}:`, err.message);
//                         lastError = err.message;
//                         continue;
//                     }
//                 }

//                 if (!response || !response.ok) {
//                     throw new Error(`All endpoints failed. Last error: ${lastError}`);
//                 }

//                 const data = await response.json();
//                 console.log("📦 Order data received:", data);

//                 if (data.success || data.order) {
//                     const orderData = data.order || data;
//                     setOrder(orderData);

//                     // Store debug info
//                     setDebugData({
//                         fetchedAt: new Date().toISOString(),
//                         orderId: orderData.orderId,
//                         _id: orderData._id,
//                         displayOrderId: orderData.displayOrderId,
//                         status: orderData.status,
//                         orderStatus: orderData.orderStatus,
//                         isMongoId: /^[0-9a-fA-F]{24}$/.test(orderData._id || ""),
//                         hasShipments: !!(orderData.shipments || orderData.shipping?.shipments),
//                         paymentMethod: orderData.payment?.method,
//                         paymentStatus: orderData.payment?.status
//                     });
//                 } else {
//                     throw new Error(data.message || "Failed to load order");
//                 }
//             } else if (location.state?.backendResponse) {
//                 // Fallback to location state
//                 console.log("Using order data from location state");
//                 const orderData = location.state.backendResponse.order || location.state.backendResponse;
//                 setOrder(orderData);
//             } else {
//                 throw new Error("No order ID provided");
//             }
//         } catch (error) {
//             console.error("❌ Error fetching order:", error);
//             setError(error.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchOrderDetails();

//         // Handle cancellation success
//         window.handleCancelSuccess = (data) => {
//             console.log("🔄 Handling cancellation success:", data);
//             setCancelledOrder(data.order);
//             setOrder(data.order);
//             setShowSuccessPopup(true);

//             // Refresh the order details
//             if (data.order?.orderId || data.order?._id) {
//                 setTimeout(() => {
//                     fetchOrderDetails(data.order.orderId || data.order._id);
//                 }, 1500);
//             }
//         };

//         return () => {
//             delete window.handleCancelSuccess;
//         };
//     }, [orderId, location.state]);

//     // Add debug panel to check order structure
//     const DebugPanel = () => (
//         <div className="card shadow-sm mb-4 border-warning">
//             <div className="card-header fw-bold bg-warning text-dark">
//                 <i className="bi bi-bug me-2"></i>
//                 Debug Information
//             </div>
//             <div className="card-body">
//                 <div className="row">
//                     <div className="col-md-6">
//                         <h6>Order Structure:</h6>
//                         <pre className="bg-light p-2 rounded" style={{ fontSize: '12px' }}>
//                             {JSON.stringify({
//                                 _id: order?._id,
//                                 orderId: order?.orderId,
//                                 displayOrderId: order?.displayOrderId,
//                                 status: order?.status,
//                                 orderStatus: order?.orderStatus,
//                                 shipments: order?.shipments,
//                                 shipping: order?.shipping
//                             }, null, 2)}
//                         </pre>
//                     </div>
//                     <div className="col-md-6">
//                         <h6>Fetch Debug:</h6>
//                         <pre className="bg-light p-2 rounded" style={{ fontSize: '12px' }}>
//                             {JSON.stringify(debugData, null, 2)}
//                         </pre>
//                         <div className="mt-2">
//                             <Button
//                                 variant="outline-primary"
//                                 size="sm"
//                                 onClick={() => fetchOrderDetails()}
//                             >
//                                 Refresh Order
//                             </Button>
//                             <Button
//                                 variant="outline-danger"
//                                 size="sm"
//                                 className="ms-2"
//                                 onClick={() => console.log("Full order object:", order)}
//                             >
//                                 Log Full Order
//                             </Button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );

//     if (loading) {
//         return (
//             <div className="container py-5 text-center">
//                 <Spinner animation="border" variant="primary" />
//                 <p className="mt-3">Loading order details...</p>
//             </div>
//         );
//     }

//     if (error || !order) {
//         return (
//             <div className="container py-5">
//                 <div className="alert alert-danger">
//                     <h5>Failed to load order details</h5>
//                     <p>{error || "Order not found"}</p>
//                     <p className="small text-muted mb-3">
//                         Order ID used: {orderId}<br/>
//                         Please check if the order ID is correct and you have proper access.
//                     </p>
//                     <div className="mt-3">
//                         <Button variant="primary" onClick={() => navigate("/")} className="me-2">
//                             Go to Homepage
//                         </Button>
//                         <Button variant="outline-secondary" onClick={() => fetchOrderDetails()}>
//                             Retry
//                         </Button>
//                     </div>
//                 </div>
//             </div>
//         );
//     }

//     const isOrderCancelled = order?.status === "Cancelled" || order?.orderStatus === "Cancelled" || cancelledOrder;
//     const currentOrder = cancelledOrder || order;

//     // Debug info
//     console.log("📊 Current Order State:", {
//         orderId: currentOrder?.orderId,
//         _id: currentOrder?._id,
//         displayOrderId: currentOrder?.displayOrderId,
//         status: currentOrder?.status,
//         orderStatus: currentOrder?.orderStatus,
//         isOrderCancelled,
//         shipments: currentOrder?.shipments || currentOrder?.shipping?.shipments,
//         isMongoDBId: /^[0-9a-fA-F]{24}$/.test(currentOrder?._id || ""),
//         isOrderIdMongoDBId: /^[0-9a-fA-F]{24}$/.test(currentOrder?.orderId || "")
//     });

//     return (
//         <div className="container py-4">
//             {/* Debug Panel - Remove in production */}
//             <DebugPanel />

//             <div className="mb-3">
//                 <button
//                     className="btn btn-link text-decoration-none"
//                     onClick={() =>
//                         window.history.length > 1 ? navigate(-1) : navigate("/")
//                     }
//                 >
//                     <i className="bi bi-arrow-left me-1"></i> Back
//                 </button>
//             </div>

//             {/* Order Status Banner */}
//             <div className="mb-4">
//                 <div className={`alert ${isOrderCancelled ? 'alert-danger' : 'alert-success'} d-flex align-items-center`}>
//                     <div className="flex-grow-1">
//                         <div className="d-flex align-items-center justify-content-between">
//                             <div>
//                                 <h5 className="mb-1">
//                                     <i className={`bi ${isOrderCancelled ? 'bi-x-circle' : 'bi-check-circle'} me-2`}></i>
//                                     Order {isOrderCancelled ? 'Cancelled' : 'Confirmed'}!
//                                 </h5>
//                                 <p className="mb-0 small">
//                                     <strong>Order ID:</strong> {currentOrder?.displayOrderId || currentOrder?.orderId} |
//                                     <strong className="ms-2">Date:</strong> {new Date(currentOrder?.orderDate).toLocaleDateString('en-IN', {
//                                         day: 'numeric',
//                                         month: 'long',
//                                         year: 'numeric'
//                                     })}
//                                 </p>
//                             </div>
//                             <StatusBadge status={currentOrder?.status || currentOrder?.orderStatus} />
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="d-flex justify-content-between align-items-center mb-4">
//                 <div>
//                     {!isOrderCancelled && currentOrder?.status !== "Delivered" && currentOrder?.status !== "Shipped" && (
//                         <button
//                             className="btn btn-outline-danger btn-sm me-2"
//                             onClick={() => setShowCancelPopup(true)}
//                         >
//                             <i className="bi bi-x-circle me-1"></i> Cancel Order
//                         </button>
//                     )}
//                     {currentOrder?.shipping?.trackingAvailable && (
//                         <button className="btn btn-outline-primary btn-sm">
//                             <i className="bi bi-truck me-1"></i> Track Order
//                         </button>
//                     )}
//                 </div>

//                 <InvoiceGenerator
//                     order={currentOrder}
//                     items={currentOrder?.products || []}
//                     shippingAddress={currentOrder?.shipping?.address || {}}
//                     paymentMethod={currentOrder?.payment?.method}
//                     gstAmount={currentOrder?.amount?.gst}
//                     shippingCharge={currentOrder?.amount?.shipping}
//                     subtotal={currentOrder?.amount?.subtotal}
//                     discount={currentOrder?.amount?.discount}
//                     grandTotal={currentOrder?.amount?.grandTotal}
//                 />
//             </div>

//             {/* ... rest of the OrderSuccess component remains the same ... */}



//                  <div className="card shadow-sm mb-4">
//                  <div className="card-header fw-bold d-flex justify-content-between align-items-center">
//                      <span>Order Items ({currentOrder?.products?.length || 0})</span>
//                      {isOrderCancelled && (
//                         <Badge bg="danger">Cancelled</Badge>
//                     )}
//                 </div>
//                 <div className="card-body">
//                     {currentOrder?.products?.length > 0 ? (
//                         currentOrder.products.map((item, i) => (
//                             <div
//                                 key={i}
//                                 className="d-flex flex-column flex-md-row align-items-start gap-3 mb-3 pb-3 border-bottom"
//                             >
//                                 <div className="position-relative">
//                                     <img
//                                         src={item.image || "/placeholder.png"}
//                                         alt={item.name}
//                                         className="img-fluid rounded"
//                                         style={{ width: "100px", height: "100px", objectFit: "cover" }}
//                                     />
//                                     {item.variant?.discountPercent && (
//                                         <span className="position-absolute top-0 start-0 badge bg-danger">
//                                             -{item.variant.discountPercent}%
//                                         </span>
//                                     )}
//                                 </div>
//                                 <div className="flex-grow-1">
//                                     <h6 className="fw-bold mb-1">{item.name}</h6>

//                                     {item.variant && (
//                                         <div className="text-muted small mt-1">
//                                             {item.variant.shadeName && (
//                                                 <div className="d-flex align-items-center">
//                                                     <span>Shade: {item.variant.shadeName}</span>
//                                                     {item.variant.hex && (
//                                                         <span
//                                                             className="ms-2 d-inline-block rounded-circle"
//                                                             style={{
//                                                                 width: "12px",
//                                                                 height: "12px",
//                                                                 backgroundColor: item.variant.hex,
//                                                                 border: "1px solid #dee2e6"
//                                                             }}
//                                                         ></span>
//                                                     )}
//                                                 </div>
//                                             )}
//                                             {item.variant.sku && <div>SKU: {item.variant.sku}</div>}
//                                         </div>
//                                     )}

//                                     <div className="mt-2">
//                                         <div className="d-flex align-items-center">
//                                             <span className="text-muted me-2">Quantity:</span>
//                                             <span className="fw-bold">{item.quantity}</span>
//                                         </div>

//                                         <div className="d-flex align-items-center mt-1">
//                                             <span className="text-muted me-2">Price:</span>
//                                             {item.variant?.originalPrice && (
//                                                 <span className="text-decoration-line-through text-muted me-2">
//                                                     ₹{item.variant.originalPrice.toFixed(2)}
//                                                 </span>
//                                             )}
//                                             <span className="fw-bold text-primary">
//                                                 ₹{(item.price || item.variant?.discountedPrice || 0).toFixed(2)}
//                                             </span>
//                                         </div>

//                                         <div className="mt-2">
//                                             <strong>Total: </strong>
//                                             ₹{((item.quantity || 1) * (item.price || item.variant?.discountedPrice || 0)).toFixed(2)}
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         ))
//                     ) : (
//                         <div className="text-center py-4">
//                             <i className="bi bi-cart-x text-muted" style={{ fontSize: "48px" }}></i>
//                             <p className="text-muted mt-3">No items found in this order.</p>
//                         </div>
//                     )}
//                 </div>
//             </div>

//             {/* Next Steps */}
//             {currentOrder?.nextSteps && currentOrder.nextSteps.length > 0 && !isOrderCancelled && (
//                 <NextSteps steps={currentOrder.nextSteps} />
//             )}

//             {/* Payment Details */}
//             <div className="card shadow-sm mb-4">
//                 <div className="card-header fw-bold">Payment Details</div>
//                 <div className="card-body">
//                     <div className="d-flex justify-content-between mb-2">
//                         <span>Subtotal:</span>
//                         <span>₹{(currentOrder?.amount?.subtotal || 0).toFixed(2)}</span>
//                     </div>

//                     {(currentOrder?.amount?.discount || 0) > 0 && (
//                         <div className="d-flex justify-content-between mb-2 text-success">
//                             <span>Discount:</span>
//                             <span>-₹{(currentOrder?.amount?.discount || 0).toFixed(2)}</span>
//                         </div>
//                     )}

//                     {(currentOrder?.amount?.gst || 0) > 0 && (
//                         <div className="d-flex justify-content-between mb-2">
//                             <span>GST:</span>
//                             <span>₹{(currentOrder?.amount?.gst || 0).toFixed(2)}</span>
//                         </div>
//                     )}

//                     <div className="d-flex justify-content-between mb-2">
//                         <span>Shipping:</span>
//                         <span>
//                             {(currentOrder?.amount?.shipping || 0) === 0
//                                 ? "Free"
//                                 : `₹${(currentOrder?.amount?.shipping || 0).toFixed(2)}`}
//                         </span>
//                     </div>

//                     <hr />

//                     <div className="d-flex justify-content-between fw-bold fs-5">
//                         <span>Total Payable:</span>
//                         <span className="text-primary">₹{(currentOrder?.amount?.grandTotal || 0).toFixed(2)}</span>
//                     </div>

//                     <div className="mt-3">
//                         <div className="d-flex justify-content-between">
//                             <span className="text-muted">Payment Method:</span>
//                             <span className="fw-bold">{currentOrder?.payment?.method}</span>
//                         </div>
//                         <div className="d-flex justify-content-between mt-1">
//                             <span className="text-muted">Payment Status:</span>
//                             <Badge bg={currentOrder?.payment?.status === 'pending' ? 'warning' : 'success'}>
//                                 {currentOrder?.payment?.status?.toUpperCase()}
//                             </Badge>
//                         </div>
//                         {currentOrder?.payment?.transactionId && (
//                             <div className="d-flex justify-content-between mt-1">
//                                 <span className="text-muted">Transaction ID:</span>
//                                 <span className="text-muted small">{currentOrder.payment.transactionId}</span>
//                             </div>
//                         )}
//                     </div>

//                     {currentOrder?.payment?.note && (
//                         <div className="alert alert-info mt-3 mb-0 small">
//                             <i className="bi bi-info-circle me-1"></i>
//                             {currentOrder.payment.note}
//                         </div>
//                     )}
//                 </div>
//             </div>

//             {/* Delivery Address */}
//             <div className="card shadow-sm mb-4">
//                 <div className="card-header fw-bold">Delivery Address</div>
//                 <div className="card-body">
//                     <p className="mb-1 fw-bold">{currentOrder?.shipping?.address?.name}</p>
//                     <p className="mb-1">{currentOrder?.shipping?.address?.addressLine1}</p>
//                     <p className="mb-1">
//                         {currentOrder?.shipping?.address?.city}, {currentOrder?.shipping?.address?.state} -{" "}
//                         {currentOrder?.shipping?.address?.pincode}
//                     </p>
//                     <p className="mb-1">
//                         <i className="bi bi-telephone me-1"></i>
//                         {currentOrder?.shipping?.address?.phone}
//                     </p>
//                     {currentOrder?.shipping?.address?.email && (
//                         <p className="mb-0">
//                             <i className="bi bi-envelope me-1"></i>
//                             {currentOrder.shipping.address.email}
//                         </p>
//                     )}

//                     {currentOrder?.shipping?.expectedDelivery && (
//                         <div className="mt-3 pt-3 border-top">
//                             <p className="mb-1">
//                                 <i className="bi bi-calendar-check me-1"></i>
//                                 <strong>Expected Delivery:</strong> {new Date(currentOrder.shipping.expectedDelivery).toLocaleDateString('en-IN', {
//                                     weekday: 'long',
//                                     day: 'numeric',
//                                     month: 'long',
//                                     year: 'numeric'
//                                 })}
//                             </p>
//                         </div>
//                     )}
//                 </div>
//             </div>

//             {/* Cancellation Details */}
//             {isOrderCancelled && currentOrder?.cancellation && (
//                 <div className="card shadow-sm mb-4 border-danger">
//                     <div className="card-header fw-bold text-danger bg-danger bg-opacity-10">
//                         <i className="bi bi-x-circle me-2"></i>
//                         Cancellation Details
//                     </div>
//                     <div className="card-body">
//                         <p><strong>Reason:</strong> {currentOrder.cancellation.reason}</p>
//                         <p><strong>Cancelled By:</strong> {currentOrder.cancellation.cancelledBy}</p>
//                         <p><strong>Date:</strong> {new Date(currentOrder.cancellation.requestedAt).toLocaleDateString('en-IN', {
//                             day: 'numeric',
//                             month: 'long',
//                             year: 'numeric',
//                             hour: '2-digit',
//                             minute: '2-digit'
//                         })}</p>
//                     </div>
//                 </div>
//             )}

//             {/* Support Information */}
//             {currentOrder?.support && (
//                 <div className="card shadow-sm mb-4 border-info">
//                     <div className="card-header fw-bold bg-info text-white">
//                         <i className="bi bi-headset me-2"></i>
//                         Need Help?
//                     </div>
//                     <div className="card-body">
//                         <div className="row">
//                             {currentOrder.support.email && (
//                                 <div className="col-md-6 mb-2">
//                                     <i className="bi bi-envelope text-primary me-2"></i>
//                                     <strong>Email:</strong> {currentOrder.support.email}
//                                 </div>
//                             )}
//                             {currentOrder.support.phone && (
//                                 <div className="col-md-6 mb-2">
//                                     <i className="bi bi-telephone text-primary me-2"></i>
//                                     <strong>Phone:</strong> {currentOrder.support.phone}
//                                 </div>
//                             )}
//                             {currentOrder.support.hours && (
//                                 <div className="col-12">
//                                     <i className="bi bi-clock text-primary me-2"></i>
//                                     <strong>Hours:</strong> {currentOrder.support.hours}
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Continue Shopping */}
//             {currentOrder?.uiConfig?.showContinueShopping && (
//                 <div className="text-center mb-4">
//                     <Button
//                         variant="primary"
//                         size="lg"
//                         onClick={() => navigate("/products")}
//                         className="px-5"
//                     >
//                         <i className="bi bi-bag me-2"></i>
//                         Continue Shopping
//                     </Button>
//                 </div>
//             )}
//             {/* Order Items, Payment Details, Delivery Address, etc. */}

//             {/* Modals */}
//             <CancelOrderPopup
//                 show={showCancelPopup}
//                 handleClose={() => setShowCancelPopup(false)}
//                 orderId={currentOrder?.orderId}
//                 order={currentOrder}
//             />

//             <CancelSuccessPopup
//                 show={showSuccessPopup}
//                 handleClose={() => {
//                     setShowSuccessPopup(false);
//                     // Refresh order details
//                     if (currentOrder?.orderId || currentOrder?._id) {
//                         fetchOrderDetails(currentOrder.orderId || currentOrder._id);
//                     }
//                 }}
//                 order={currentOrder}
//                 onConfirm={() => {
//                     if (currentOrder?.orderId || currentOrder?._id) {
//                         fetchOrderDetails(currentOrder.orderId || currentOrder._id);
//                     }
//                 }}
//             />
//         </div>
//     );
// };

// export default OrderSuccess;


























// import React, { useState, useEffect } from "react";
// import { useLocation, useNavigate, useParams } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { Modal, Button, Form, Alert, Spinner, Badge } from "react-bootstrap";
// import "../css/ordersuccess.css";
// import InvoiceGenerator from "./InvoiceGenerator";

// /* -------------------- Cancel Success Popup -------------------- */
// const CancelSuccessPopup = ({ show, handleClose, onConfirm, order }) => (
//     <Modal show={show} onHide={handleClose} centered>
//         <Modal.Body className="text-center p-4">
//             <div className="mb-3">
//                 <div className="d-flex justify-content-center mb-3">
//                     <div className="bg-danger text-white rounded-circle d-flex align-items-center justify-content-center"
//                         style={{ width: "60px", height: "60px" }}>
//                         <i className="bi bi-check-lg" style={{ fontSize: "24px" }}></i>
//                     </div>
//                 </div>
//                 <h5 className="fw-bold mb-3 text-success">Order Cancelled Successfully!</h5>
//                 <p className="text-muted small mb-3">
//                     {order?.payment?.paid ? "Refund will be processed within 3–5 business days." : "Order has been cancelled successfully."}
//                 </p>

//                 <div className="mb-3 border p-3 rounded">
//                     <p className="mb-1"><strong>Order ID:</strong> {order?.displayOrderId || order?.orderId}</p>
//                     <p className="mb-1"><strong>Status:</strong> <Badge bg="danger">Cancelled</Badge></p>
//                     {order?.cancellation?.reason && (
//                         <p className="mb-1"><strong>Cancellation Reason:</strong> {order.cancellation.reason}</p>
//                     )}
//                 </div>

//                 <Button
//                     onClick={() => {
//                         handleClose();
//                         onConfirm && onConfirm();
//                     }}
//                     className="w-100"
//                     style={{
//                         backgroundColor: "#4A90E2",
//                         border: "none",
//                         borderRadius: "8px",
//                         fontWeight: "500",
//                     }}
//                 >
//                     Okay
//                 </Button>
//             </div>
//         </Modal.Body>
//     </Modal>
// );

// /* -------------------- Cancel Order Popup -------------------- */
// const CancelOrderPopup = ({
//     show,
//     handleClose,
//     orderId,
//     order,
// }) => {
//     const navigate = useNavigate();
//     const [reason, setReason] = useState("");
//     const [otherDetails, setOtherDetails] = useState("");
//     const [loading, setLoading] = useState(false);
//     const [message, setMessage] = useState(null);
//     const [isAuthenticated, setIsAuthenticated] = useState(false);
//     const [debugInfo, setDebugInfo] = useState({});

//     const reasons = [
//         "Applicable discount/offer was not applied",
//         "Changed my mind. Don't need the product",
//         "Bought it from somewhere else",
//         "Wrong shade/size/colour ordered",
//         "Forgot to apply coupon/reward points",
//         "Wrong address/phone",
//         "Other",
//     ];

//     useEffect(() => {
//         checkAuthentication();
//         if (order) {
//             analyzeOrderStructure(order);
//         }
//     }, [order]);

//     const analyzeOrderStructure = (order) => {
//         const info = {
//             hasUnderscoreId: !!order?._id,
//             hasOrderId: !!order?.orderId,
//             hasDisplayOrderId: !!order?.displayOrderId,
//             orderIdValue: order?.orderId,
//             underscoreIdValue: order?._id,
//             displayOrderIdValue: order?.displayOrderId,
//             isUnderscoreIdMongoId: /^[0-9a-fA-F]{24}$/.test(order?._id || ""),
//             isOrderIdMongoId: /^[0-9a-fA-F]{24}$/.test(order?.orderId || ""),
//             orderStatus: order?.orderStatus || order?.status,
//             shipments: order?.shipments || order?.shipping?.shipments,
//             payment: order?.payment,
//         };
//         setDebugInfo(info);
//         console.log("🔍 Order Structure Analysis:", info);
//     };

//     // ✅ Check authentication by making a simple API call to verify the cookie
//     const checkAuthentication = async () => {
//         try {
//             // Try to fetch user profile to verify if cookie is valid
//             const response = await fetch(
//                 "https://beauty.joyory.com/api/user/profile",
//                 {
//                     method: "GET",
//                     credentials: "include", // This sends the HTTP-only cookie
//                     headers: {
//                         "Content-Type": "application/json",
//                     },
//                 }
//             );

//             if (response.ok) {
//                 setIsAuthenticated(true);
//                 console.log("✅ User is authenticated (cookie is valid)");
//             } else {
//                 setIsAuthenticated(false);
//                 console.log("❌ User is not authenticated");
//             }
//         } catch (error) {
//             console.error("Auth check error:", error);
//             setIsAuthenticated(false);
//         }
//     };

//     const getCancellableOrderId = () => {
//         // Try different possible ID fields in priority order
//         const possibleIds = [
//             order?._id,        // MongoDB ObjectId
//             order?.orderId,    // Order ID field
//         ];

//         for (const id of possibleIds) {
//             if (id && /^[0-9a-fA-F]{24}$/.test(id)) {
//                 console.log(`✅ Using MongoDB ID: ${id}`);
//                 return id;
//             }
//         }

//         // If no valid MongoDB ID found, use whatever ID is available
//         const fallbackId = order?._id || order?.orderId;
//         console.log(`⚠️ Using fallback ID: ${fallbackId}`);
//         return fallbackId;
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         const finalReason = reason === "Other" ? otherDetails.trim() : reason.trim();
//         if (!finalReason) {
//             setMessage({ type: "danger", text: "Cancellation reason is required" });
//             return;
//         }

//         // Check authentication via API call (since we're using HTTP-only cookies)
//         try {
//             const authCheck = await fetch(
//                 "https://beauty.joyory.com/api/user/profile",
//                 {
//                     method: "GET",
//                     credentials: "include",
//                     headers: {
//                         "Content-Type": "application/json",
//                     },
//                 }
//             );

//             if (!authCheck.ok) {
//                 setMessage({ 
//                     type: "warning", 
//                     text: "Please login to cancel the order. Redirecting to login..." 
//                 });

//                 // Store current URL for redirect after login
//                 sessionStorage.setItem('redirectAfterLogin', window.location.pathname);

//                 setTimeout(() => {
//                     navigate('/login');
//                 }, 1500);
//                 return;
//             }
//         } catch (error) {
//             console.error("Auth check failed:", error);
//             setMessage({ 
//                 type: "danger", 
//                 text: "Unable to verify authentication. Please try again." 
//             });
//             return;
//         }

//         const mongoOrderId = getCancellableOrderId();
//         if (!mongoOrderId) {
//             setMessage({ type: "danger", text: "Order reference not found" });
//             return;
//         }

//         setLoading(true);
//         setMessage(null);

//         try {
//             const res = await fetch(
//                 `https://beauty.joyory.com/api/user/cart/cancel/${mongoOrderId}`,
//                 {
//                     method: "POST",
//                     credentials: "include", // This sends the HTTP-only cookie
//                     headers: {
//                         "Content-Type": "application/json",
//                     },
//                     body: JSON.stringify({ reason: finalReason }),
//                 }
//             );

//             const data = await res.json();

//             if (!res.ok) {
//                 throw new Error(data.message || "Cancellation failed");
//             }

//             setMessage({ type: "success", text: data.message });

//             const updatedOrder = {
//                 ...order,
//                 orderStatus: "Cancelled",
//                 status: "Cancelled",
//                 cancellation: {
//                     reason: finalReason,
//                     cancelledBy: "Customer",
//                     requestedAt: new Date().toISOString(),
//                 },
//             };

//             setTimeout(() => {
//                 handleClose();
//                 window.handleCancelSuccess?.({ order: updatedOrder });
//             }, 1200);

//         } catch (err) {
//             console.error("❌ Cancellation Error:", err);

//             if (err.message.includes("401") || err.message.includes("Unauthorized")) {
//                 // Session expired or invalid
//                 setMessage({
//                     type: "danger",
//                     text: "Session expired. Please login again.",
//                 });

//                 // Clear any client-side storage and redirect
//                 sessionStorage.setItem('redirectAfterLogin', window.location.pathname);

//                 setTimeout(() => {
//                     navigate('/login');
//                 }, 2000);
//             } else {
//                 setMessage({
//                     type: "danger",
//                     text: err.message || "Something went wrong",
//                 });
//             }
//         } finally {
//             setLoading(false);
//         }
//     };

//     const canCancel = () => {
//         if (!order) return false;

//         // Check if already cancelled
//         if (order.orderStatus === "Cancelled" || order.status === "Cancelled") {
//             return false;
//         }

//         // Get current status
//         const currentStatus = order.orderStatus || order.status;

//         // Define non-cancellable statuses
//         const nonCancellableStatuses = [
//             "Delivered", 
//             "Shipped", 
//             "Out for Delivery",
//             "Picked Up",
//             "In Transit"
//         ];

//         // Check main status
//         if (nonCancellableStatuses.includes(currentStatus)) {
//             return false;
//         }

//         // Check shipments if they exist
//         const shipments = order.shipments || order.shipping?.shipments;
//         if (shipments && shipments.length > 0) {
//             const blockedShipmentStatuses = [
//                 "Picked Up",
//                 "In Transit",
//                 "Out for Delivery",
//                 "Delivered"
//             ];

//             return !shipments.some(shipment => 
//                 blockedShipmentStatuses.includes(shipment.status)
//             );
//         }

//         return true;
//     };

//     const isCancellable = canCancel();

//     return (
//         <Modal show={show} onHide={handleClose} centered size="lg">
//             <Modal.Header closeButton>
//                 <Modal.Title>Cancel Order</Modal.Title>
//             </Modal.Header>
//             <Modal.Body>
//                 {message && (
//                     <Alert variant={message.type} onClose={() => setMessage(null)} dismissible>
//                         {message.text}
//                     </Alert>
//                 )}

//                 <div className="alert alert-info mb-3">
//                     <strong>Order Details:</strong><br />
//                     <strong>Display ID:</strong> {order?.displayOrderId || "N/A"}<br />
//                     <strong>MongoDB _id:</strong> {order?._id || "N/A"}<br />
//                     <strong>Order ID:</strong> {order?.orderId || "N/A"}<br />
//                     <strong>Status:</strong> {order?.status || order?.orderStatus || "N/A"}<br />
//                     <strong>Authentication:</strong> {isAuthenticated ?
//                         <span className="text-success">✓ Logged in (via cookie)</span> :
//                         <span className="text-danger">✗ Not logged in</span>
//                     }
//                 </div>

//                 {!isAuthenticated && (
//                     <Alert variant="warning" className="mb-3">
//                         <strong>Authentication Required!</strong>
//                         <p className="mb-2">You need to be logged in to cancel orders.</p>
//                         <Button
//                             variant="warning"
//                             size="sm"
//                             onClick={() => {
//                                 sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
//                                 navigate('/login');
//                             }}
//                         >
//                             Log In Now
//                         </Button>
//                     </Alert>
//                 )}

//                 {!isCancellable && (
//                     <Alert variant="danger" className="mb-3">
//                         <strong>Cannot Cancel Order!</strong>
//                         <p className="mb-0">
//                             {order?.status === "Cancelled" ? "Order is already cancelled." :
//                             order?.status === "Delivered" ? "Order is already delivered." :
//                             order?.status === "Shipped" ? "Order is already shipped." :
//                             "Order cannot be cancelled at this stage."}
//                         </p>
//                     </Alert>
//                 )}

//                 <Form onSubmit={handleSubmit}>
//                     <Form.Group className="mb-3">
//                         <Form.Label>Reason for Cancellation*</Form.Label>
//                         <Form.Select
//                             required
//                             value={reason}
//                             onChange={(e) => setReason(e.target.value)}
//                             disabled={loading || !isAuthenticated || !isCancellable}
//                         >
//                             <option value="">Select a reason</option>
//                             {reasons.map((r, i) => (
//                                 <option key={i} value={r}>{r}</option>
//                             ))}
//                         </Form.Select>
//                     </Form.Group>

//                     {reason === "Other" && (
//                         <Form.Group className="mb-3">
//                             <Form.Label>Other Details*</Form.Label>
//                             <Form.Control
//                                 as="textarea"
//                                 rows={3}
//                                 maxLength={250}
//                                 placeholder="Please specify your reason..."
//                                 value={otherDetails}
//                                 onChange={(e) => setOtherDetails(e.target.value)}
//                                 required
//                                 disabled={loading || !isAuthenticated || !isCancellable}
//                             />
//                             <div className="text-end small text-muted mt-1">
//                                 {otherDetails.length}/250
//                             </div>
//                         </Form.Group>
//                     )}

//                     <div className="alert alert-warning small mb-3">
//                         <strong>Important Information:</strong>
//                         <ul className="mb-0 mt-1">
//                             <li>Orders with shipments already "Picked Up", "In Transit", or "Delivered" cannot be cancelled</li>
//                             <li>Refunds for paid orders take 3-5 business days</li>
//                             <li>You can only cancel your own orders</li>
//                             <li>Cancellation is irreversible</li>
//                         </ul>
//                     </div>

//                     <div className="d-flex gap-2">
//                         <Button
//                             variant="secondary"
//                             onClick={handleClose}
//                             className="w-50"
//                             disabled={loading}
//                         >
//                             Cancel
//                         </Button>
//                         <Button
//                             type="submit"
//                             className="w-50"
//                             disabled={loading || !isAuthenticated || !isCancellable}
//                             style={{
//                                 backgroundColor: !isAuthenticated || !isCancellable ? "#ccc" : "#1e88e5",
//                                 border: "none",
//                                 borderRadius: "8px",
//                                 padding: "10px",
//                                 fontWeight: "500",
//                             }}
//                         >
//                             {loading ? (
//                                 <>
//                                     <Spinner animation="border" size="sm" /> Processing...
//                                 </>
//                             ) : !isAuthenticated ? (
//                                 "Login Required"
//                             ) : !isCancellable ? (
//                                 "Cannot Cancel"
//                             ) : (
//                                 "Confirm Cancellation"
//                             )}
//                         </Button>
//                     </div>
//                 </Form>

//                 {/* Enhanced Debug Information */}
//                 <div className="mt-4 p-3 border rounded bg-light small">
//                     <h6 className="fw-bold">Debug Information:</h6>
//                     <div className="row">
//                         <div className="col-md-6">
//                             <div className="mb-1">
//                                 <strong>Order Structure:</strong>
//                                 <pre className="bg-white p-2 rounded mt-1" style={{ fontSize: '10px' }}>
//                                     {JSON.stringify(debugInfo, null, 2)}
//                                 </pre>
//                             </div>
//                         </div>
//                         <div className="col-md-6">
//                             <div className="mb-1">
//                                 <strong>Authentication Status:</strong><br/>
//                                 Using: <span className="text-success">HTTP-only Cookies</span><br/>
//                                 Authentication Check: {isAuthenticated ? "✅ Authenticated" : "❌ Not authenticated"}
//                             </div>
//                             <div className="mb-1">
//                                 <strong>Cancellation Logic:</strong><br/>
//                                 Is Cancellable: {isCancellable ? "✅ Yes" : "❌ No"}<br/>
//                                 Can Cancel Check: {canCancel() ? "✅ Yes" : "❌ No"}
//                             </div>
//                             <div className="mb-1">
//                                 <strong>API Details:</strong><br/>
//                                 Endpoint: /api/user/cart/cancel/{getCancellableOrderId()}<br/>
//                                 Method: POST<br/>
//                                 Auth: HTTP-only Cookie (auto-sent with credentials: "include")
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </Modal.Body>
//         </Modal>
//     );
// };

// /* -------------------- Status Badge Component -------------------- */
// const StatusBadge = ({ status }) => {
//     const getBadgeProps = (status) => {
//         if (!status) return { bg: 'secondary', text: 'white' };

//         const statusLower = status.toLowerCase();
//         if (statusLower.includes('awaiting')) return { bg: 'warning', text: 'dark' };
//         if (statusLower.includes('confirmed')) return { bg: 'info', text: 'white' };
//         if (statusLower.includes('processing')) return { bg: 'primary', text: 'white' };
//         if (statusLower.includes('shipped')) return { bg: 'success', text: 'white' };
//         if (statusLower.includes('delivered')) return { bg: 'success', text: 'white' };
//         if (statusLower.includes('cancelled')) return { bg: 'danger', text: 'white' };
//         return { bg: 'secondary', text: 'white' };
//     };

//     const { bg, text } = getBadgeProps(status);

//     return <Badge bg={bg} text={text} className="px-3 py-2">{status}</Badge>;
// };

// /* -------------------- Next Steps Component -------------------- */
// const NextSteps = ({ steps }) => (
//     <div className="card shadow-sm mb-4 border-info">
//         <div className="card-header fw-bold bg-info text-white">
//             <i className="bi bi-info-circle me-2"></i>
//             What's Next?
//         </div>
//         <div className="card-body">
//             <ul className="list-unstyled mb-0">
//                 {steps?.map((step, index) => (
//                     <li key={index} className="mb-2 d-flex align-items-start">
//                         <i className="bi bi-check-circle-fill text-success me-2 mt-1"></i>
//                         <span>{step}</span>
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     </div>
// );

// /* -------------------- Main Component -------------------- */
// const OrderSuccess = () => {
//     const location = useLocation();
//     const navigate = useNavigate();
//     const { orderId } = useParams();

//     const [order, setOrder] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [showCancelPopup, setShowCancelPopup] = useState(false);
//     const [showSuccessPopup, setShowSuccessPopup] = useState(false);
//     const [cancelledOrder, setCancelledOrder] = useState(null);
//     const [debugData, setDebugData] = useState({});

//     // Check if user is authenticated via cookie
//     const checkAuthAndRedirect = async () => {
//         try {
//             const response = await fetch(
//                 "https://beauty.joyory.com/api/user/profile",
//                 {
//                     method: "GET",
//                     credentials: "include",
//                     headers: {
//                         "Content-Type": "application/json",
//                     },
//                 }
//             );

//             if (!response.ok) {
//                 // Store current URL for redirect after login
//                 sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
//                 navigate('/login');
//                 return false;
//             }
//             return true;
//         } catch (error) {
//             console.error("Auth check error:", error);
//             sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
//             navigate('/login');
//             return false;
//         }
//     };

//     // Fetch order data from API
//     const fetchOrderDetails = async (id) => {
//         try {
//             setLoading(true);
//             setError(null);

//             // Check authentication first
//             const isAuthenticated = await checkAuthAndRedirect();
//             if (!isAuthenticated) {
//                 setLoading(false);
//                 return;
//             }

//             const orderIdToFetch = id || orderId;

//             console.log("🔍 Starting order fetch for:", orderIdToFetch);

//             if (orderIdToFetch) {
//                 // Try multiple endpoints if needed
//                 const endpoints = [
//                     `https://beauty.joyory.com/api/payment/success/${orderIdToFetch}`,
//                     `https://beauty.joyory.com/api/order/${orderIdToFetch}`,
//                     `https://beauty.joyory.com/api/user/orders/${orderIdToFetch}`
//                 ];

//                 let response = null;
//                 let lastError = null;

//                 for (const endpoint of endpoints) {
//                     try {
//                         console.log("Trying endpoint:", endpoint);
//                         response = await fetch(endpoint, {
//                             method: "GET",
//                             credentials: "include", // This sends the HTTP-only cookie
//                             headers: {
//                                 "Content-Type": "application/json",
//                                 "Accept": "application/json",
//                             },
//                         });

//                         if (response.ok) {
//                             console.log("✅ Success with endpoint:", endpoint);
//                             break;
//                         } else {
//                             console.log(`❌ Failed with endpoint ${endpoint}: ${response.status}`);
//                             lastError = `Failed with status ${response.status}`;
//                         }
//                     } catch (err) {
//                         console.log(`❌ Error with endpoint ${endpoint}:`, err.message);
//                         lastError = err.message;
//                         continue;
//                     }
//                 }

//                 if (!response || !response.ok) {
//                     // If 401/403, redirect to login
//                     if (response?.status === 401 || response?.status === 403) {
//                         sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
//                         navigate('/login');
//                         return;
//                     }
//                     throw new Error(`All endpoints failed. Last error: ${lastError}`);
//                 }

//                 const data = await response.json();
//                 console.log("📦 Order data received:", data);

//                 if (data.success || data.order) {
//                     const orderData = data.order || data;
//                     setOrder(orderData);

//                     // Store debug info
//                     setDebugData({
//                         fetchedAt: new Date().toISOString(),
//                         orderId: orderData.orderId,
//                         _id: orderData._id,
//                         displayOrderId: orderData.displayOrderId,
//                         status: orderData.status,
//                         orderStatus: orderData.orderStatus,
//                         isMongoId: /^[0-9a-fA-F]{24}$/.test(orderData._id || ""),
//                         hasShipments: !!(orderData.shipments || orderData.shipping?.shipments),
//                         paymentMethod: orderData.payment?.method,
//                         paymentStatus: orderData.payment?.status
//                     });
//                 } else {
//                     throw new Error(data.message || "Failed to load order");
//                 }
//             } else if (location.state?.backendResponse) {
//                 // Fallback to location state
//                 console.log("Using order data from location state");
//                 const orderData = location.state.backendResponse.order || location.state.backendResponse;
//                 setOrder(orderData);
//             } else {
//                 throw new Error("No order ID provided");
//             }
//         } catch (error) {
//             console.error("❌ Error fetching order:", error);
//             setError(error.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchOrderDetails();

//         // Handle cancellation success
//         window.handleCancelSuccess = (data) => {
//             console.log("🔄 Handling cancellation success:", data);
//             setCancelledOrder(data.order);
//             setOrder(data.order);
//             setShowSuccessPopup(true);

//             // Refresh the order details
//             if (data.order?.orderId || data.order?._id) {
//                 setTimeout(() => {
//                     fetchOrderDetails(data.order.orderId || data.order._id);
//                 }, 1500);
//             }
//         };

//         return () => {
//             delete window.handleCancelSuccess;
//         };
//     }, [orderId, location.state]);

//     // Add debug panel to check order structure
//     const DebugPanel = () => (
//         <div className="card shadow-sm mb-4 border-warning">
//             <div className="card-header fw-bold bg-warning text-dark">
//                 <i className="bi bi-bug me-2"></i>
//                 Debug Information
//             </div>
//             <div className="card-body">
//                 <div className="row">
//                     <div className="col-md-6">
//                         <h6>Order Structure:</h6>
//                         <pre className="bg-light p-2 rounded" style={{ fontSize: '12px' }}>
//                             {JSON.stringify({
//                                 _id: order?._id,
//                                 orderId: order?.orderId,
//                                 displayOrderId: order?.displayOrderId,
//                                 status: order?.status,
//                                 orderStatus: order?.orderStatus,
//                                 shipments: order?.shipments,
//                                 shipping: order?.shipping
//                             }, null, 2)}
//                         </pre>
//                     </div>
//                     <div className="col-md-6">
//                         <h6>Authentication Status:</h6>
//                         <div className="bg-light p-2 rounded">
//                             <div><strong>Auth Method:</strong> HTTP-only Cookies</div>
//                             <div><strong>Session Cookie:</strong> {document.cookie.includes('token') || document.cookie.includes('session') ? '✅ Present' : '❌ Not detected'}</div>
//                             <div><strong>Current Path:</strong> {window.location.pathname}</div>
//                         </div>
//                         <div className="mt-2">
//                             <Button
//                                 variant="outline-primary"
//                                 size="sm"
//                                 onClick={() => fetchOrderDetails()}
//                             >
//                                 Refresh Order
//                             </Button>
//                             <Button
//                                 variant="outline-danger"
//                                 size="sm"
//                                 className="ms-2"
//                                 onClick={() => {
//                                     console.log("Full order object:", order);
//                                     console.log("Cookies:", document.cookie);
//                                 }}
//                             >
//                                 Log Debug Info
//                             </Button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );

//     if (loading) {
//         return (
//             <div className="container py-5 text-center">
//                 <Spinner animation="border" variant="primary" />
//                 <p className="mt-3">Loading order details...</p>
//             </div>
//         );
//     }

//     if (error || !order) {
//         return (
//             <div className="container py-5">
//                 <div className="alert alert-danger">
//                     <h5>Failed to load order details</h5>
//                     <p>{error || "Order not found"}</p>
//                     <p className="small text-muted mb-3">
//                         Order ID used: {orderId}<br/>
//                         Please check if the order ID is correct and you have proper access.
//                     </p>
//                     <div className="mt-3">
//                         <Button variant="primary" onClick={() => navigate("/")} className="me-2">
//                             Go to Homepage
//                         </Button>
//                         <Button variant="outline-secondary" onClick={() => fetchOrderDetails()}>
//                             Retry
//                         </Button>
//                     </div>
//                 </div>
//             </div>
//         );
//     }

//     const isOrderCancelled = order?.status === "Cancelled" || order?.orderStatus === "Cancelled" || cancelledOrder;
//     const currentOrder = cancelledOrder || order;

//     return (
//         <div className="container py-4">
//             {/* Debug Panel - Remove in production */}
//             {process.env.NODE_ENV === 'development' && <DebugPanel />}

//             <div className="mb-3">
//                 <button
//                     className="btn btn-link text-decoration-none"
//                     onClick={() =>
//                         window.history.length > 1 ? navigate(-1) : navigate("/")
//                     }
//                 >
//                     <i className="bi bi-arrow-left me-1"></i> Back
//                 </button>
//             </div>

//             {/* Order Status Banner */}
//             <div className="mb-4">
//                 <div className={`alert ${isOrderCancelled ? 'alert-danger' : 'alert-success'} d-flex align-items-center`}>
//                     <div className="flex-grow-1">
//                         <div className="d-flex align-items-center justify-content-between">
//                             <div>
//                                 <h5 className="mb-1">
//                                     <i className={`bi ${isOrderCancelled ? 'bi-x-circle' : 'bi-check-circle'} me-2`}></i>
//                                     Order {isOrderCancelled ? 'Cancelled' : 'Confirmed'}!
//                                 </h5>
//                                 <p className="mb-0 small">
//                                     <strong>Order ID:</strong> {currentOrder?.displayOrderId || currentOrder?.orderId} |
//                                     <strong className="ms-2">Date:</strong> {new Date(currentOrder?.orderDate).toLocaleDateString('en-IN', {
//                                         day: 'numeric',
//                                         month: 'long',
//                                         year: 'numeric'
//                                     })}
//                                 </p>
//                             </div>
//                             <StatusBadge status={currentOrder?.status || currentOrder?.orderStatus} />
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="d-flex justify-content-between align-items-center mb-4">
//                 <div>
//                     {!isOrderCancelled && currentOrder?.status !== "Delivered" && currentOrder?.status !== "Shipped" && (
//                         <button
//                             className="btn btn-outline-danger btn-sm me-2"
//                             onClick={() => setShowCancelPopup(true)}
//                         >
//                             <i className="bi bi-x-circle me-1"></i> Cancel Order
//                         </button>
//                     )}
//                     {currentOrder?.shipping?.trackingAvailable && (
//                         <button className="btn btn-outline-primary btn-sm">
//                             <i className="bi bi-truck me-1"></i> Track Order
//                         </button>
//                     )}
//                 </div>

//                 <InvoiceGenerator
//                     order={currentOrder}
//                     items={currentOrder?.products || []}
//                     shippingAddress={currentOrder?.shipping?.address || {}}
//                     paymentMethod={currentOrder?.payment?.method}
//                     gstAmount={currentOrder?.amount?.gst}
//                     shippingCharge={currentOrder?.amount?.shipping}
//                     subtotal={currentOrder?.amount?.subtotal}
//                     discount={currentOrder?.amount?.discount}
//                     grandTotal={currentOrder?.amount?.grandTotal}
//                 />
//             </div>

//             {/* Order Items */}
//             <div className="card shadow-sm mb-4">
//                 <div className="card-header fw-bold d-flex justify-content-between align-items-center">
//                     <span>Order Items ({currentOrder?.products?.length || 0})</span>
//                     {isOrderCancelled && (
//                         <Badge bg="danger">Cancelled</Badge>
//                     )}
//                 </div>
//                 <div className="card-body">
//                     {currentOrder?.products?.length > 0 ? (
//                         currentOrder.products.map((item, i) => (
//                             <div
//                                 key={i}
//                                 className="d-flex flex-column flex-md-row align-items-start gap-3 mb-3 pb-3 border-bottom"
//                             >
//                                 <div className="position-relative">
//                                     <img
//                                         src={item.image || "/placeholder.png"}
//                                         alt={item.name}
//                                         className="img-fluid rounded"
//                                         style={{ width: "100px", height: "100px", objectFit: "cover" }}
//                                     />
//                                     {item.variant?.discountPercent && (
//                                         <span className="position-absolute top-0 start-0 badge bg-danger">
//                                             -{item.variant.discountPercent}%
//                                         </span>
//                                     )}
//                                 </div>
//                                 <div className="flex-grow-1">
//                                     <h6 className="fw-bold mb-1">{item.name}</h6>

//                                     {item.variant && (
//                                         <div className="text-muted small mt-1">
//                                             {item.variant.shadeName && (
//                                                 <div className="d-flex align-items-center">
//                                                     <span>Shade: {item.variant.shadeName}</span>
//                                                     {item.variant.hex && (
//                                                         <span
//                                                             className="ms-2 d-inline-block rounded-circle"
//                                                             style={{
//                                                                 width: "12px",
//                                                                 height: "12px",
//                                                                 backgroundColor: item.variant.hex,
//                                                                 border: "1px solid #dee2e6"
//                                                             }}
//                                                         ></span>
//                                                     )}
//                                                 </div>
//                                             )}
//                                             {item.variant.sku && <div>SKU: {item.variant.sku}</div>}
//                                         </div>
//                                     )}

//                                     <div className="mt-2">
//                                         <div className="d-flex align-items-center">
//                                             <span className="text-muted me-2">Quantity:</span>
//                                             <span className="fw-bold">{item.quantity}</span>
//                                         </div>

//                                         <div className="d-flex align-items-center mt-1">
//                                             <span className="text-muted me-2">Price:</span>
//                                             {item.variant?.originalPrice && (
//                                                 <span className="text-decoration-line-through text-muted me-2">
//                                                     ₹{item.variant.originalPrice.toFixed(2)}
//                                                 </span>
//                                             )}
//                                             <span className="fw-bold text-primary">
//                                                 ₹{(item.price || item.variant?.discountedPrice || 0).toFixed(2)}
//                                             </span>
//                                         </div>

//                                         <div className="mt-2">
//                                             <strong>Total: </strong>
//                                             ₹{((item.quantity || 1) * (item.price || item.variant?.discountedPrice || 0)).toFixed(2)}
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         ))
//                     ) : (
//                         <div className="text-center py-4">
//                             <i className="bi bi-cart-x text-muted" style={{ fontSize: "48px" }}></i>
//                             <p className="text-muted mt-3">No items found in this order.</p>
//                         </div>
//                     )}
//                 </div>
//             </div>

//             {/* Next Steps */}
//             {currentOrder?.nextSteps && currentOrder.nextSteps.length > 0 && !isOrderCancelled && (
//                 <NextSteps steps={currentOrder.nextSteps} />
//             )}

//             {/* Payment Details */}
//             <div className="card shadow-sm mb-4">
//                 <div className="card-header fw-bold">Payment Details</div>
//                 <div className="card-body">
//                     <div className="d-flex justify-content-between mb-2">
//                         <span>Subtotal:</span>
//                         <span>₹{(currentOrder?.amount?.subtotal || 0).toFixed(2)}</span>
//                     </div>

//                     {(currentOrder?.amount?.discount || 0) > 0 && (
//                         <div className="d-flex justify-content-between mb-2 text-success">
//                             <span>Discount:</span>
//                             <span>-₹{(currentOrder?.amount?.discount || 0).toFixed(2)}</span>
//                         </div>
//                     )}

//                     {(currentOrder?.amount?.gst || 0) > 0 && (
//                         <div className="d-flex justify-content-between mb-2">
//                             <span>GST:</span>
//                             <span>₹{(currentOrder?.amount?.gst || 0).toFixed(2)}</span>
//                         </div>
//                     )}

//                     <div className="d-flex justify-content-between mb-2">
//                         <span>Shipping:</span>
//                         <span>
//                             {(currentOrder?.amount?.shipping || 0) === 0
//                                 ? "Free"
//                                 : `₹${(currentOrder?.amount?.shipping || 0).toFixed(2)}`}
//                         </span>
//                     </div>

//                     <hr />

//                     <div className="d-flex justify-content-between fw-bold fs-5">
//                         <span>Total Payable:</span>
//                         <span className="text-primary">₹{(currentOrder?.amount?.grandTotal || 0).toFixed(2)}</span>
//                     </div>

//                     <div className="mt-3">
//                         <div className="d-flex justify-content-between">
//                             <span className="text-muted">Payment Method:</span>
//                             <span className="fw-bold">{currentOrder?.payment?.method}</span>
//                         </div>
//                         <div className="d-flex justify-content-between mt-1">
//                             <span className="text-muted">Payment Status:</span>
//                             <Badge bg={currentOrder?.payment?.status === 'pending' ? 'warning' : 'success'}>
//                                 {currentOrder?.payment?.status?.toUpperCase()}
//                             </Badge>
//                         </div>
//                         {currentOrder?.payment?.transactionId && (
//                             <div className="d-flex justify-content-between mt-1">
//                                 <span className="text-muted">Transaction ID:</span>
//                                 <span className="text-muted small">{currentOrder.payment.transactionId}</span>
//                             </div>
//                         )}
//                     </div>

//                     {currentOrder?.payment?.note && (
//                         <div className="alert alert-info mt-3 mb-0 small">
//                             <i className="bi bi-info-circle me-1"></i>
//                             {currentOrder.payment.note}
//                         </div>
//                     )}
//                 </div>
//             </div>

//             {/* Delivery Address */}
//             <div className="card shadow-sm mb-4">
//                 <div className="card-header fw-bold">Delivery Address</div>
//                 <div className="card-body">
//                     <p className="mb-1 fw-bold">{currentOrder?.shipping?.address?.name}</p>
//                     <p className="mb-1">{currentOrder?.shipping?.address?.addressLine1}</p>
//                     <p className="mb-1">
//                         {currentOrder?.shipping?.address?.city}, {currentOrder?.shipping?.address?.state} -{" "}
//                         {currentOrder?.shipping?.address?.pincode}
//                     </p>
//                     <p className="mb-1">
//                         <i className="bi bi-telephone me-1"></i>
//                         {currentOrder?.shipping?.address?.phone}
//                     </p>
//                     {currentOrder?.shipping?.address?.email && (
//                         <p className="mb-0">
//                             <i className="bi bi-envelope me-1"></i>
//                             {currentOrder.shipping.address.email}
//                         </p>
//                     )}

//                     {currentOrder?.shipping?.expectedDelivery && (
//                         <div className="mt-3 pt-3 border-top">
//                             <p className="mb-1">
//                                 <i className="bi bi-calendar-check me-1"></i>
//                                 <strong>Expected Delivery:</strong> {new Date(currentOrder.shipping.expectedDelivery).toLocaleDateString('en-IN', {
//                                     weekday: 'long',
//                                     day: 'numeric',
//                                     month: 'long',
//                                     year: 'numeric'
//                                 })}
//                             </p>
//                         </div>
//                     )}
//                 </div>
//             </div>

//             {/* Cancellation Details */}
//             {isOrderCancelled && currentOrder?.cancellation && (
//                 <div className="card shadow-sm mb-4 border-danger">
//                     <div className="card-header fw-bold text-danger bg-danger bg-opacity-10">
//                         <i className="bi bi-x-circle me-2"></i>
//                         Cancellation Details
//                     </div>
//                     <div className="card-body">
//                         <p><strong>Reason:</strong> {currentOrder.cancellation.reason}</p>
//                         <p><strong>Cancelled By:</strong> {currentOrder.cancellation.cancelledBy}</p>
//                         <p><strong>Date:</strong> {new Date(currentOrder.cancellation.requestedAt).toLocaleDateString('en-IN', {
//                             day: 'numeric',
//                             month: 'long',
//                             year: 'numeric',
//                             hour: '2-digit',
//                             minute: '2-digit'
//                         })}</p>
//                     </div>
//                 </div>
//             )}

//             {/* Support Information */}
//             {currentOrder?.support && (
//                 <div className="card shadow-sm mb-4 border-info">
//                     <div className="card-header fw-bold bg-info text-white">
//                         <i className="bi bi-headset me-2"></i>
//                         Need Help?
//                     </div>
//                     <div className="card-body">
//                         <div className="row">
//                             {currentOrder.support.email && (
//                                 <div className="col-md-6 mb-2">
//                                     <i className="bi bi-envelope text-primary me-2"></i>
//                                     <strong>Email:</strong> {currentOrder.support.email}
//                                 </div>
//                             )}
//                             {currentOrder.support.phone && (
//                                 <div className="col-md-6 mb-2">
//                                     <i className="bi bi-telephone text-primary me-2"></i>
//                                     <strong>Phone:</strong> {currentOrder.support.phone}
//                                 </div>
//                             )}
//                             {currentOrder.support.hours && (
//                                 <div className="col-12">
//                                     <i className="bi bi-clock text-primary me-2"></i>
//                                     <strong>Hours:</strong> {currentOrder.support.hours}
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Continue Shopping */}
//             {currentOrder?.uiConfig?.showContinueShopping && (
//                 <div className="text-center mb-4">
//                     <Button
//                         variant="primary"
//                         size="lg"
//                         onClick={() => navigate("/products")}
//                         className="px-5"
//                     >
//                         <i className="bi bi-bag me-2"></i>
//                         Continue Shopping
//                     </Button>
//                 </div>
//             )}

//             {/* Modals */}
//             <CancelOrderPopup
//                 show={showCancelPopup}
//                 handleClose={() => setShowCancelPopup(false)}
//                 orderId={currentOrder?.orderId}
//                 order={currentOrder}
//             />

//             <CancelSuccessPopup
//                 show={showSuccessPopup}
//                 handleClose={() => {
//                     setShowSuccessPopup(false);
//                     // Refresh order details
//                     if (currentOrder?.orderId || currentOrder?._id) {
//                         fetchOrderDetails(currentOrder.orderId || currentOrder._id);
//                     }
//                 }}
//                 order={currentOrder}
//                 onConfirm={() => {
//                     if (currentOrder?.orderId || currentOrder?._id) {
//                         fetchOrderDetails(currentOrder.orderId || currentOrder._id);
//                     }
//                 }}
//             />
//         </div>
//     );
// };

// export default OrderSuccess;



















// import React, { useState, useEffect } from "react";
// import { useLocation, useNavigate, useParams } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { Modal, Button, Form, Alert, Spinner, Badge } from "react-bootstrap";
// import "../css/ordersuccess.css";
// import InvoiceGenerator from "./InvoiceGenerator";
// /* -------------------- Cancel Success Popup -------------------- */
// const CancelSuccessPopup = ({ show, handleClose, onConfirm, order }) => (
//     <Modal show={show} onHide={handleClose} centered>
//         <Modal.Body className="text-center p-4">
//             <div className="mb-3">
//                 <div className="d-flex justify-content-center mb-3">
//                     <div className="bg-danger text-white rounded-circle d-flex align-items-center justify-content-center"
//                         style={{ width: "60px", height: "60px" }}>
//                         <i className="bi bi-check-lg" style={{ fontSize: "24px" }}></i>
//                     </div>
//                 </div>
//                 <h5 className="fw-bold mb-3 text-success page-title-main-name">Order Cancelled Successfully!</h5>
//                 <p className="text-muted small mb-3 page-title-main-name">
//                     {order?.payment?.paid ? "Refund will be processed within 3–5 business days." : "Order has been cancelled successfully."}
//                 </p>
//                 <div className="mb-3 border p-3 rounded page-title-main-name">
//                     <p className="mb-1"><strong>Order ID:</strong> {order?.displayOrderId || order?.orderId}</p>
//                     <p className="mb-1"><strong>Status:</strong> <Badge bg="danger">Cancelled</Badge></p>
//                     {order?.cancellation?.reason && (
//                         <p className="mb-1"><strong>Cancellation Reason:</strong> {order.cancellation.reason}</p>
//                     )}
//                 </div>
//                 <Button
//                     onClick={() => {
//                         handleClose();
//                         onConfirm && onConfirm();
//                     }}
//                     className="w-100 page-title-main-name"
//                     style={{
//                         backgroundColor: "#4A90E2",
//                         border: "none",
//                         borderRadius: "8px",
//                         fontWeight: "500",
//                     }}
//                 >
//                     Okay
//                 </Button>
//             </div>
//         </Modal.Body>
//     </Modal>
// );
// /* -------------------- Cancel Order Popup -------------------- */
// const CancelOrderPopup = ({
//     show,
//     handleClose,
//     orderId,
//     order,
// }) => {
//     const navigate = useNavigate();
//     const [reason, setReason] = useState("");
//     const [otherDetails, setOtherDetails] = useState("");
//     const [loading, setLoading] = useState(false);
//     const [message, setMessage] = useState(null);
//     const [isAuthenticated, setIsAuthenticated] = useState(false);
//     const [debugInfo, setDebugInfo] = useState({});
//     const reasons = [
//         "Applicable discount/offer was not applied",
//         "Changed my mind. Don't need the product",
//         "Bought it from somewhere else",
//         "Wrong shade/size/colour ordered",
//         "Forgot to apply coupon/reward points",
//         "Wrong address/phone",
//         "Other",
//     ];
//     useEffect(() => {
//         checkAuthentication();
//         if (order) {
//             analyzeOrderStructure(order);
//         }
//     }, [order]);
//     const analyzeOrderStructure = (order) => {
//         const info = {
//             hasUnderscoreId: !!order?._id,
//             hasOrderId: !!order?.orderId,
//             hasDisplayOrderId: !!order?.displayOrderId,
//             orderIdValue: order?.orderId,
//             underscoreIdValue: order?._id,
//             displayOrderIdValue: order?.displayOrderId,
//             isUnderscoreIdMongoId: /^[0-9a-fA-F]{24}$/.test(order?._id || ""),
//             isOrderIdMongoId: /^[0-9a-fA-F]{24}$/.test(order?.orderId || ""),
//             orderStatus: order?.orderStatus || order?.status,
//             shipments: order?.shipments || order?.shipping?.shipments,
//             payment: order?.payment,
//         };
//         setDebugInfo(info);
//         console.log("🔍 Order Structure Analysis:", info);
//     };


//     const checkAuthentication = async () => {
//         try {
//             // Try to fetch user profile to verify if cookie is valid
//             const response = await fetch(
//                 "https://beauty.joyory.com/api/user/profile",
//                 {
//                     method: "GET",
//                     credentials: "include",
//                     headers: {
//                         "Content-Type": "application/json",
//                     },
//                 }
//             );

//             // Check content type
//             const contentType = response.headers.get("content-type");

//             if (response.ok && contentType && contentType.includes("application/json")) {
//                 setIsAuthenticated(true);
//                 console.log("✅ User is authenticated (cookie is valid)");
//                 return true;
//             } else {
//                 // If not JSON, try to read as text to debug
//                 if (!contentType || !contentType.includes("application/json")) {
//                     const text = await response.text();
//                     console.warn("⚠️ Auth check returned non-JSON:", text.substring(0, 200));

//                     if (text.includes("<!DOCTYPE") || text.includes("<html")) {
//                         console.log("❌ Server returned HTML - likely not authenticated");
//                         setIsAuthenticated(false);
//                         return false;
//                     }
//                 }

//                 setIsAuthenticated(false);
//                 console.log("❌ User is not authenticated or server error");
//                 return false;
//             }
//         } catch (error) {
//             console.error("Auth check error:", error);
//             setIsAuthenticated(false);
//             return false;
//         }
//     };





//     const getCancellableOrderId = () => {
//         // Try all possible ID formats
//         const possibleIds = [
//             order?._id,
//             order?.orderId,
//             order?.displayOrderId,
//         ];

//         for (const id of possibleIds) {
//             if (id) {
//                 console.log(`🔍 Testing ID: ${id}`);
//                 return id;
//             }
//         }

//         return null;
//     };





//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         const finalReason = reason === "Other" ? otherDetails.trim() : reason.trim();
//         if (!finalReason) {
//             setMessage({ type: "danger", text: "Cancellation reason is required" });
//             return;
//         }

//         // Check authentication
//         const isAuth = await checkAuthentication();
//         if (!isAuth) {
//             setMessage({
//                 type: "warning",
//                 text: "Please login to cancel the order."
//             });
//             sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
//             setTimeout(() => navigate('/login'), 1500);
//             return;
//         }

//         const orderIdToCancel = getCancellableOrderId();
//         if (!orderIdToCancel) {
//             setMessage({ type: "danger", text: "Order ID not found" });
//             return;
//         }

//         setLoading(true);
//         setMessage(null);

//         try {
//             // Try multiple possible endpoints
//             const endpoints = [
//                 `https://beauty.joyory.com/api/user/cart/cancel/${orderId}`,
//             ];

//             let lastResponse = null;
//             let lastError = null;

//             for (const endpoint of endpoints) {
//                 try {
//                     console.log(`🔄 Trying endpoint: ${endpoint}`);

//                     const res = await fetch(endpoint, {
//                         method: "PUT",
//                         credentials: "include",
//                         headers: {
//                             "Content-Type": "application/json",
//                         },
//                         body: JSON.stringify({ reason: finalReason }),
//                     });

//                     lastResponse = res;

//                     // Check content type
//                     const contentType = res.headers.get("content-type");
//                     if (!contentType || !contentType.includes("application/json")) {
//                         const text = await res.text();
//                         console.warn(`⚠️ Endpoint ${endpoint} returned non-JSON:`, text.substring(0, 200));
//                         continue; // Try next endpoint
//                     }

//                     const data = await res.json();

//                     if (res.ok) {
//                         // Success!
//                         setMessage({ type: "success", text: data.message });

//                         const updatedOrder = {
//                             ...order,
//                             orderStatus: "Cancelled",
//                             status: "Cancelled",
//                             cancellation: {
//                                 reason: finalReason,
//                                 cancelledBy: "Customer",
//                                 requestedAt: new Date().toISOString(),
//                             },
//                         };

//                         setTimeout(() => {
//                             handleClose();
//                             window.handleCancelSuccess?.({ order: updatedOrder });
//                         }, 1200);

//                         return; // Exit function on success
//                     } else {
//                         console.log(`❌ Endpoint ${endpoint} failed:`, data.message);
//                         lastError = data.message;
//                         continue; // Try next endpoint
//                     }
//                 } catch (err) {
//                     console.log(`❌ Endpoint ${endpoint} error:`, err.message);
//                     lastError = err.message;
//                     continue;
//                 }
//             }

//             // If we get here, all endpoints failed
//             if (lastResponse && lastResponse.status === 404) {
//                 throw new Error("Cancellation endpoint not found. Please contact support.");
//             } else {
//                 throw new Error(lastError || "All cancellation attempts failed");
//             }

//         } catch (err) {
//             console.error("❌ Final Cancellation Error:", err);

//             let userMessage = err.message;

//             if (err.message.includes("HTML")) {
//                 userMessage = "Server error. Please try again or contact support.";
//             } else if (err.message.includes("401") || err.message.includes("Unauthorized")) {
//                 userMessage = "Your session has expired. Please login again.";
//                 sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
//                 setTimeout(() => navigate('/login'), 2000);
//             } else if (err.message.includes("404")) {
//                 userMessage = "Order cancellation service is currently unavailable.";
//             }

//             setMessage({
//                 type: "danger",
//                 text: userMessage,
//             });
//         } finally {
//             setLoading(false);
//         }
//     };



//     const canCancel = () => {
//         if (!order) return false;
//         // Check if already cancelled
//         if (order.orderStatus === "Cancelled" || order.status === "Cancelled") {
//             return false;
//         }
//         // Get current status
//         const currentStatus = order.orderStatus || order.status;

//         // Define non-cancellable statuses
//         const nonCancellableStatuses = [
//             "Delivered",
//             "Shipped",
//             "Out for Delivery",
//             "Picked Up",
//             "In Transit"
//         ];
//         // Check main status
//         if (nonCancellableStatuses.includes(currentStatus)) {
//             return false;
//         }
//         // Check shipments if they exist
//         const shipments = order.shipments || order.shipping?.shipments;
//         if (shipments && shipments.length > 0) {
//             const blockedShipmentStatuses = [
//                 "Picked Up",
//                 "In Transit",
//                 "Out for Delivery",
//                 "Delivered"
//             ];

//             return !shipments.some(shipment =>
//                 blockedShipmentStatuses.includes(shipment.status)
//             );
//         }
//         return true;
//     };
//     const isCancellable = canCancel();
//     return (
//         <Modal show={show} onHide={handleClose} centered size="lg">
//             <Modal.Header closeButton>
//                 <Modal.Title>Cancel Order</Modal.Title>
//             </Modal.Header>
//             <Modal.Body>
//                 {message && (
//                     <Alert variant={message.type} onClose={() => setMessage(null)} dismissible>
//                         {message.text}
//                     </Alert>
//                 )}
//                 <div className="alert alert-info mb-3 page-title-main-name">
//                     <strong>Order Details:</strong><br />
//                     <strong>Display ID:</strong> {order?.displayOrderId || "N/A"}<br />
//                     <strong>MongoDB _id:</strong> {order?._id || "N/A"}<br />
//                     <strong>Order ID:</strong> {order?.orderId || "N/A"}<br />
//                     <strong>Status:</strong> {order?.status || order?.orderStatus || "N/A"}<br />
//                     <strong>Authentication:</strong> {isAuthenticated ?
//                         <span className="text-success">✓ Logged in (via cookie)</span> :
//                         <span className="text-danger">✗ Not logged in</span>
//                     }
//                 </div>
//                 {!isAuthenticated && (
//                     <Alert variant="warning" className="mb-3 page-title-main-name">
//                         <strong>Authentication Required!</strong>
//                         <p className="mb-2">You need to be logged in to cancel orders.</p>
//                         <Button
//                             variant="warning"
//                             size="sm"
//                             onClick={() => {
//                                 sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
//                                 navigate('/login');
//                             }}
//                         >
//                             Log In Now
//                         </Button>
//                     </Alert>
//                 )}
//                 {!isCancellable && (
//                     <Alert variant="danger" className="mb-3 page-title-main-name">
//                         <strong>Cannot Cancel Order!</strong>
//                         <p className="mb-0">
//                             {order?.status === "Cancelled" ? "Order is already cancelled." :
//                                 order?.status === "Delivered" ? "Order is already delivered." :
//                                     order?.status === "Shipped" ? "Order is already shipped." :
//                                         "Order cannot be cancelled at this stage."}
//                         </p>
//                     </Alert>
//                 )}
//                 <Form onSubmit={handleSubmit}>
//                     <Form.Group className="mb-3">
//                         <Form.Label>Reason for Cancellation*</Form.Label>
//                         <Form.Select
//                             required
//                             value={reason}
//                             onChange={(e) => setReason(e.target.value)}
//                             disabled={loading || !isAuthenticated || !isCancellable}
//                         >
//                             <option value="">Select a reason</option>
//                             {reasons.map((r, i) => (
//                                 <option key={i} value={r}>{r}</option>
//                             ))}
//                         </Form.Select>
//                     </Form.Group>
//                     {reason === "Other" && (
//                         <Form.Group className="mb-3">
//                             <Form.Label>Other Details*</Form.Label>
//                             <Form.Control
//                                 as="textarea"
//                                 rows={3}
//                                 maxLength={250}
//                                 placeholder="Please specify your reason..."
//                                 value={otherDetails}
//                                 onChange={(e) => setOtherDetails(e.target.value)}
//                                 required
//                                 disabled={loading || !isAuthenticated || !isCancellable}
//                             />
//                             <div className="text-end small text-muted mt-1">
//                                 {otherDetails.length}/250
//                             </div>
//                         </Form.Group>
//                     )}
//                     <div className="alert alert-warning small mb-3 page-title-main-name">
//                         <strong>Important Information:</strong>
//                         <ul className="mb-0 mt-1">
//                             <li>Orders with shipments already "Picked Up", "In Transit", or "Delivered" cannot be cancelled</li>
//                             <li>Refunds for paid orders take 3-5 business days</li>
//                             <li>You can only cancel your own orders</li>
//                             <li>Cancellation is irreversible</li>
//                         </ul>
//                     </div>
//                     <div className="d-flex gap-2">
//                         <Button
//                             variant="secondary"
//                             onClick={handleClose}
//                             className="w-50"
//                             disabled={loading}
//                         >
//                             Cancel
//                         </Button>
//                         <Button
//                             type="submit"
//                             className="w-50"
//                             disabled={loading || !isAuthenticated || !isCancellable}
//                             style={{
//                                 backgroundColor: !isAuthenticated || !isCancellable ? "#ccc" : "#1e88e5",
//                                 border: "none",
//                                 borderRadius: "8px",
//                                 padding: "10px",
//                                 fontWeight: "500",
//                             }}
//                         >
//                             {loading ? (
//                                 <>
//                                     <Spinner animation="border" size="sm" /> Processing...
//                                 </>
//                             ) : !isAuthenticated ? (
//                                 "Login Required"
//                             ) : !isCancellable ? (
//                                 "Cannot Cancel"
//                             ) : (
//                                 "Confirm Cancellation"
//                             )}
//                         </Button>
//                     </div>
//                 </Form>
//                 {/* Enhanced Debug Information */}
//                 <div className="mt-4 p-3 border rounded bg-light small">
//                     <h6 className="fw-bold">Debug Information:</h6>
//                     <div className="row">
//                         <div className="col-md-6">
//                             <div className="mb-1">
//                                 <strong className="page-title-main-name">Order Structure:</strong>
//                                 <pre className="bg-white p-2 rounded mt-1 page-title-main-name" style={{ fontSize: '10px' }}>
//                                     {JSON.stringify(debugInfo, null, 2)}
//                                 </pre>
//                             </div>
//                         </div>
//                         <div className="col-md-6">
//                             <div className="mb-1">
//                                 <strong className="page-title-main-name">Authentication Status:</strong><br />
//                                 Using: <span className="text-success page-title-main-name">HTTP-only Cookies</span><br />
//                                 Authentication Check: {isAuthenticated ? "✅ Authenticated" : "❌ Not authenticated"}
//                             </div>
//                             <div className="mb-1">
//                                 <strong className="page-title-main-name">Cancellation Logic:</strong><br />
//                                 Is Cancellable: {isCancellable ? "✅ Yes" : "❌ No"}<br />
//                                 Can Cancel Check: {canCancel() ? "✅ Yes" : "❌ No"}
//                             </div>
//                             <div className="mb-1">
//                                 <strong>API Details:</strong><br />
//                                 Endpoint: /api/user/cart/cancel/{getCancellableOrderId()}<br />
//                                 Method: POST<br />
//                                 Auth: HTTP-only Cookie (auto-sent with credentials: "include")
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </Modal.Body>
//         </Modal>
//     );
// };
// /* -------------------- Status Badge Component -------------------- */
// const StatusBadge = ({ status }) => {
//     const getBadgeProps = (status) => {
//         if (!status) return { bg: 'secondary', text: 'white' };
//         const statusLower = status.toLowerCase();
//         if (statusLower.includes('awaiting')) return { bg: 'warning', text: 'dark' };
//         if (statusLower.includes('confirmed')) return { bg: 'info', text: 'white' };
//         if (statusLower.includes('processing')) return { bg: 'primary', text: 'white' };
//         if (statusLower.includes('shipped')) return { bg: 'success', text: 'white' };
//         if (statusLower.includes('delivered')) return { bg: 'success', text: 'white' };
//         if (statusLower.includes('cancelled')) return { bg: 'danger', text: 'white' };
//         return { bg: 'secondary', text: 'white' };
//     };
//     const { bg, text } = getBadgeProps(status);
//     return <Badge bg={bg} text={text} className="px-3 py-2" style={{ marginTop: '-80px' }}>{status}</Badge>;
// };
// /* -------------------- Next Steps Component -------------------- */
// const NextSteps = ({ steps }) => (
//     <div className="card shadow-sm mb-4 border-info">
//         <div className="card-header fw-bold bg-info text-white">
//             <i className="bi bi-info-circle me-2"></i>
//             What's Next?
//         </div>
//         <div className="card-body">
//             <ul className="list-unstyled mb-0">
//                 {steps?.map((step, index) => (
//                     <li key={index} className="mb-2 d-flex align-items-start">
//                         <i className="bi bi-check-circle-fill text-success me-2 mt-1"></i>
//                         <span>{step}</span>
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     </div>
// );
// /* -------------------- Main Component -------------------- */
// const OrderSuccess = () => {
//     const location = useLocation();
//     const navigate = useNavigate();
//     const { orderId } = useParams();
//     const [order, setOrder] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [showCancelPopup, setShowCancelPopup] = useState(false);
//     const [showSuccessPopup, setShowSuccessPopup] = useState(false);
//     const [cancelledOrder, setCancelledOrder] = useState(null);
//     const [debugData, setDebugData] = useState({});
//     // Check if user is authenticated via cookie
//     const checkAuthAndRedirect = async () => {
//         try {
//             const response = await fetch(
//                 "https://beauty.joyory.com/api/user/profile",
//                 {
//                     method: "GET",
//                     credentials: "include",
//                     headers: {
//                         "Content-Type": "application/json",
//                     },
//                 }
//             );
//             if (!response.ok) {
//                 // Store current URL for redirect after login
//                 sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
//                 navigate('/login');
//                 return false;
//             }
//             return true;
//         } catch (error) {
//             console.error("Auth check error:", error);
//             sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
//             navigate('/login');
//             return false;
//         }
//     };
//     // Fetch order data from API
//     const fetchOrderDetails = async (id) => {
//         try {
//             setLoading(true);
//             setError(null);
//             // Check authentication first
//             const isAuthenticated = await checkAuthAndRedirect();
//             if (!isAuthenticated) {
//                 setLoading(false);
//                 return;
//             }
//             const orderIdToFetch = id || orderId;
//             console.log("🔍 Starting order fetch for:", orderIdToFetch);
//             if (orderIdToFetch) {
//                 // Try multiple endpoints if needed
//                 const endpoints = [
//                     `https://beauty.joyory.com/api/payment/success/${orderIdToFetch}`,
//                     `https://beauty.joyory.com/api/order/${orderIdToFetch}`,
//                     `https://beauty.joyory.com/api/user/orders/${orderIdToFetch}`
//                 ];
//                 let response = null;
//                 let lastError = null;
//                 for (const endpoint of endpoints) {
//                     try {
//                         console.log("Trying endpoint:", endpoint);
//                         response = await fetch(endpoint, {
//                             method: "GET",
//                             credentials: "include", // This sends the HTTP-only cookie
//                             headers: {
//                                 "Content-Type": "application/json",
//                                 "Accept": "application/json",
//                             },
//                         });
//                         if (response.ok) {
//                             console.log("✅ Success with endpoint:", endpoint);
//                             break;
//                         } else {
//                             console.log(`❌ Failed with endpoint ${endpoint}: ${response.status}`);
//                             lastError = `Failed with status ${response.status}`;
//                         }
//                     } catch (err) {
//                         console.log(`❌ Error with endpoint ${endpoint}:`, err.message);
//                         lastError = err.message;
//                         continue;
//                     }
//                 }
//                 if (!response || !response.ok) {
//                     // If 401/403, redirect to login
//                     if (response?.status === 401 || response?.status === 403) {
//                         sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
//                         navigate('/login');
//                         return;
//                     }
//                     throw new Error(`All endpoints failed. Last error: ${lastError}`);
//                 }
//                 const data = await response.json();
//                 console.log("📦 Order data received:", data);
//                 if (data.success || data.order) {
//                     const orderData = data.order || data;
//                     setOrder(orderData);

//                     // Store debug info
//                     setDebugData({
//                         fetchedAt: new Date().toISOString(),
//                         orderId: orderData.orderId,
//                         _id: orderData._id,
//                         displayOrderId: orderData.displayOrderId,
//                         status: orderData.status,
//                         orderStatus: orderData.orderStatus,
//                         isMongoId: /^[0-9a-fA-F]{24}$/.test(orderData._id || ""),
//                         hasShipments: !!(orderData.shipments || orderData.shipping?.shipments),
//                         paymentMethod: orderData.payment?.method,
//                         paymentStatus: orderData.payment?.status
//                     });
//                 } else {
//                     throw new Error(data.message || "Failed to load order");
//                 }
//             } else if (location.state?.backendResponse) {
//                 // Fallback to location state
//                 console.log("Using order data from location state");
//                 const orderData = location.state.backendResponse.order || location.state.backendResponse;
//                 setOrder(orderData);
//             } else {
//                 throw new Error("No order ID provided");
//             }
//         } catch (error) {
//             console.error("❌ Error fetching order:", error);
//             setError(error.message);
//         } finally {
//             setLoading(false);
//         }
//     };
//     useEffect(() => {
//         fetchOrderDetails();

//         // Handle cancellation success
//         window.handleCancelSuccess = (data) => {
//             console.log("🔄 Handling cancellation success:", data);
//             setCancelledOrder(data.order);
//             setOrder(data.order);
//             setShowSuccessPopup(true);
//             // Refresh the order details
//             if (data.order?.orderId || data.order?._id) {
//                 setTimeout(() => {
//                     fetchOrderDetails(data.order.orderId || data.order._id);
//                 }, 1500);
//             }
//         };
//         return () => {
//             delete window.handleCancelSuccess;
//         };
//     }, [orderId, location.state]);

//     if (loading) {
//         return (
//             <div className="container py-5 text-center">
//                 <Spinner animation="border" variant="primary" />
//                 <p className="mt-3">Loading order details...</p>
//             </div>
//         );
//     }
//     if (error || !order) {
//         return (
//             <div className="container py-5">
//                 <div className="alert alert-danger page-title-main-name">
//                     <h5>Failed to load order details</h5>
//                     <p>{error || "Order not found"}</p>
//                     <p className="small text-muted mb-3">
//                         Order ID used: {orderId}<br />
//                         Please check if the order ID is correct and you have proper access.
//                     </p>
//                     <div className="mt-3">
//                         <Button variant="primary" onClick={() => navigate("/")} className="me-2">
//                             Go to Homepage
//                         </Button>
//                         <Button variant="outline-secondary" onClick={() => fetchOrderDetails()}>
//                             Retry
//                         </Button>
//                     </div>
//                 </div>
//             </div>
//         );
//     }
//     const isOrderCancelled = order?.status === "Cancelled" || order?.orderStatus === "Cancelled" || cancelledOrder;
//     const currentOrder = cancelledOrder || order;
//     return (
//         <div className="container py-4">
//             {/* Debug Panel - Remove in production */}

//             <div className="mb-3">
//                 <button
//                     className="btn btn-link text-decoration-none"
//                     onClick={() =>
//                         window.history.length > 1 ? navigate(-1) : navigate("/")
//                     }
//                 >
//                     <i className="bi bi-arrow-left me-1"></i> Back
//                 </button>
//             </div>
//             {/* Order Status Banner */}
//             <div className="mb-4">
//                 <div className={`alert ${isOrderCancelled ? 'alert-danger' : 'alert-success'} d-flex align-items-center`}>
//                     <div className="flex-grow-1">
//                         <div className="d-flex align-items-center justify-content-between page-title-main-name">
//                             <div>
//                                 <h5 className="mb-1">
//                                     <i className={`bi ${isOrderCancelled ? 'bi-x-circle' : 'bi-check-circle'} me-2`}></i>
//                                     Order {isOrderCancelled ? 'Cancelled' : 'Confirmed'}!
//                                 </h5>
//                                 <p className="mb-0 small">
//                                     <strong>Order ID:</strong> {currentOrder?.displayOrderId || currentOrder?.orderId} |
//                                     <strong className="ms-2">Date:</strong> {new Date(currentOrder?.orderDate).toLocaleDateString('en-IN', {
//                                         day: 'numeric',
//                                         month: 'long',
//                                         year: 'numeric'
//                                     })}
//                                 </p>
//                             </div>
//                             <StatusBadge status={currentOrder?.status || currentOrder?.orderStatus} />
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             {/* Action Buttons */}
//             <div className="d-flex justify-content-between align-items-center mb-4">
//                 <div>
//                     {!isOrderCancelled && currentOrder?.status !== "Delivered" && currentOrder?.status !== "Shipped" && (
//                         <button
//                             className="btn btn-outline-danger btn-sm me-2"
//                             onClick={() => setShowCancelPopup(true)}
//                         >
//                             <i className="bi bi-x-circle me-1"></i> Cancel Order
//                         </button>
//                     )}
//                     {currentOrder?.shipping?.trackingAvailable && (
//                         <button className="btn btn-outline-primary btn-sm">
//                             <i className="bi bi-truck me-1"></i> Track Order
//                         </button>
//                     )}
//                 </div>
//                 <InvoiceGenerator
//                     order={currentOrder}
//                     items={currentOrder?.products || []}
//                     shippingAddress={currentOrder?.shipping?.address || {}}
//                     paymentMethod={currentOrder?.payment?.method}
//                     gstAmount={currentOrder?.amount?.gst}
//                     shippingCharge={currentOrder?.amount?.shipping}
//                     subtotal={currentOrder?.amount?.subtotal}
//                     discount={currentOrder?.amount?.discount}
//                     grandTotal={currentOrder?.amount?.grandTotal}
//                 />
//             </div>
//             {/* Order Items */}
//             <div className="card shadow-sm mb-4">
//                 <div className="card-header fw-bold d-flex justify-content-between align-items-center page-title-main-name">
//                     <span>Order Items ({currentOrder?.products?.length || 0})</span>
//                     {isOrderCancelled && (
//                         <Badge bg="danger" className="mt-1" style={{ marginLeft: '120px' }}>Cancelled</Badge>
//                     )}
//                 </div>
//                 <div className="card-body">
//                     {currentOrder?.products?.length > 0 ? (
//                         currentOrder.products.map((item, i) => (
//                             <div
//                                 key={i}
//                                 className="d-flex flex-column flex-md-row align-items-start gap-3 mb-3 pb-3 border-bottom"
//                             >
//                                 <div className="position-relative">
//                                     <img
//                                         src={item.image || "/placeholder.png"}
//                                         alt={item.name}
//                                         className="img-fluid rounded"
//                                         style={{ width: "100px", height: "100px", objectFit: "cover" }}
//                                     />

//                                 </div>
//                                 <div className="flex-grow-1 page-title-main-name">
//                                     <h6 className="fw-bold mb-1">{item.name} <sup>    {item.variant?.discountPercent && (
//                                         <span className="position-absolute top-0 start-0 badge bg-danger mt-1 ms-2" style={{fontSize:'14px'}}>
//                                             -{item.variant.discountPercent}%
//                                         </span>
//                                     )}</sup></h6>
//                                     {item.variant && (
//                                         <div className="text-muted small mt-1">
//                                             {item.variant.shadeName && (
//                                                 <div className="d-flex align-items-center">
//                                                     <span>Shade: {item.variant.shadeName}</span>
//                                                     {item.variant.hex && (
//                                                         <span
//                                                             className="ms-2 d-inline-block rounded-circle"
//                                                             style={{
//                                                                 width: "12px",
//                                                                 height: "12px",
//                                                                 backgroundColor: item.variant.hex,
//                                                                 border: "1px solid #dee2e6"
//                                                             }}
//                                                         ></span>
//                                                     )}
//                                                 </div>
//                                             )}
//                                             {item.variant.sku && <div>SKU: {item.variant.sku}</div>}
//                                         </div>
//                                     )}
//                                     <div className="mt-2">
//                                         <div className="d-flex align-items-center">
//                                             <span className="text-muted me-2">Quantity:</span>
//                                             <span className="fw-bold">{item.quantity}</span>
//                                         </div>
//                                         <div className="d-flex align-items-center mt-1">
//                                             <span className="text-muted me-2">Price:</span>
//                                             {item.variant?.originalPrice && (
//                                                 <span className="text-decoration-line-through text-muted me-2">
//                                                     ₹{item.variant.originalPrice.toFixed(2)}
//                                                 </span>
//                                             )}
//                                             <span className="fw-bold text-primary">
//                                                 ₹{(item.price || item.variant?.discountedPrice || 0).toFixed(2)}
//                                             </span>
//                                         </div>
//                                         <div className="mt-2">
//                                             <strong>Total: </strong>
//                                             ₹{((item.quantity || 1) * (item.price || item.variant?.discountedPrice || 0)).toFixed(2)}
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         ))
//                     ) : (
//                         <div className="text-center py-4 page-title-main-name">
//                             <i className="bi bi-cart-x text-muted" style={{ fontSize: "48px" }}></i>
//                             <p className="text-muted mt-3">No items found in this order.</p>
//                         </div>
//                     )}
//                 </div>
//             </div>
//             {/* Next Steps */}
//             {currentOrder?.nextSteps && currentOrder.nextSteps.length > 0 && !isOrderCancelled && (
//                 <NextSteps steps={currentOrder.nextSteps} />
//             )}
//             {/* Payment Details */}
//             <div className="card shadow-sm mb-4 page-title-main-name">
//                 <div className="card-header fw-bold">Payment Details</div>
//                 <div className="card-body">
//                     <div className="d-flex justify-content-between mb-2">
//                         <span>Subtotal:</span>
//                         <span>₹{(currentOrder?.amount?.subtotal || 0).toFixed(2)}</span>
//                     </div>
//                     {(currentOrder?.amount?.discount || 0) > 0 && (
//                         <div className="d-flex justify-content-between mb-2 text-success">
//                             <span>Discount:</span>
//                             <span>-₹{(currentOrder?.amount?.discount || 0).toFixed(2)}</span>
//                         </div>
//                     )}
//                     {(currentOrder?.amount?.gst || 0) > 0 && (
//                         <div className="d-flex justify-content-between mb-2">
//                             <span>GST:</span>
//                             <span>₹{(currentOrder?.amount?.gst || 0).toFixed(2)}</span>
//                         </div>
//                     )}
//                     <div className="d-flex justify-content-between mb-2">
//                         <span>Shipping:</span>
//                         <span>
//                             {(currentOrder?.amount?.shipping || 0) === 0
//                                 ? "Free"
//                                 : `₹${(currentOrder?.amount?.shipping || 0).toFixed(2)}`}
//                         </span>
//                     </div>
//                     <hr />
//                     <div className="d-flex justify-content-between fw-bold fs-5">
//                         <span>Total Payable:</span>
//                         <span className="text-primary">₹{(currentOrder?.amount?.grandTotal || 0).toFixed(2)}</span>
//                     </div>
//                     <div className="mt-3">
//                         <div className="d-flex justify-content-between">
//                             <span className="text-muted">Payment Method:</span>
//                             <span className="fw-bold">{currentOrder?.payment?.method}</span>
//                         </div>
//                         <div className="d-flex justify-content-between mt-1">
//                             <span className="text-muted">Payment Status:</span>
//                             <div className="" bg={currentOrder?.payment?.status === 'pending' ? 'warning' : 'success'}>
//                                 {currentOrder?.payment?.status?.toUpperCase()}
//                             </div>
//                         </div>
//                         {currentOrder?.payment?.transactionId && (
//                             <div className="d-flex justify-content-between mt-1">
//                                 <span className="text-muted">Transaction ID:</span>
//                                 <span className="text-muted small">{currentOrder.payment.transactionId}</span>
//                             </div>
//                         )}
//                     </div>
//                     {currentOrder?.payment?.note && (
//                         <div className="alert alert-info mt-3 mb-0 small page-title-main-name">
//                             <i className="bi bi-info-circle me-1"></i>
//                             {currentOrder.payment.note}
//                         </div>
//                     )}
//                 </div>
//             </div>
//             {/* Delivery Address */}
//             <div className="card shadow-sm mb-4 page-title-main-name">
//                 <div className="card-header fw-bold">Delivery Address</div>
//                 <div className="card-body">
//                     <p className="mb-1 fw-bold">{currentOrder?.shipping?.address?.name}</p>
//                     <p className="mb-1">{currentOrder?.shipping?.address?.addressLine1}</p>
//                     <p className="mb-1">
//                         {currentOrder?.shipping?.address?.city}, {currentOrder?.shipping?.address?.state} -{" "}
//                         {currentOrder?.shipping?.address?.pincode}
//                     </p>
//                     <p className="mb-1">
//                         <i className="bi bi-telephone me-1"></i>
//                         {currentOrder?.shipping?.address?.phone}
//                     </p>
//                     {currentOrder?.shipping?.address?.email && (
//                         <p className="mb-0">
//                             <i className="bi bi-envelope me-1"></i>
//                             {currentOrder.shipping.address.email}
//                         </p>
//                     )}
//                     {currentOrder?.shipping?.expectedDelivery && (
//                         <div className="mt-3 pt-3 border-top">
//                             <p className="mb-1">
//                                 <i className="bi bi-calendar-check me-1"></i>
//                                 <strong>Expected Delivery:</strong> {new Date(currentOrder.shipping.expectedDelivery).toLocaleDateString('en-IN', {
//                                     weekday: 'long',
//                                     day: 'numeric',
//                                     month: 'long',
//                                     year: 'numeric'
//                                 })}
//                             </p>
//                         </div>
//                     )}
//                 </div>
//             </div>
//             {/* Cancellation Details */}
//             {isOrderCancelled && currentOrder?.cancellation && (
//                 <div className="card shadow-sm mb-4 border-danger page-title-main-name page-title-main-name">
//                     <div className="card-header fw-bold text-danger bg-danger bg-opacity-10">
//                         <i className="bi bi-x-circle me-2"></i>
//                         Cancellation Details
//                     </div>
//                     <div className="card-body">
//                         <p><strong className="page-title-main-name">Reason:</strong> {currentOrder.cancellation.reason}</p>
//                         <p><strong className="page-title-main-name">Cancelled By:</strong> {currentOrder.cancellation.cancelledBy}</p>
//                         <p><strong className="page-title-main-name">Date:</strong> {new Date(currentOrder.cancellation.requestedAt).toLocaleDateString('en-IN', {
//                             day: 'numeric',
//                             month: 'long',
//                             year: 'numeric',
//                             hour: '2-digit',
//                             minute: '2-digit'
//                         })}</p>
//                     </div>
//                 </div>
//             )}
//             {/* Support Information */}
//             {currentOrder?.support && (
//                 <div className="card shadow-sm mb-4 border-info page-title-main-name">
//                     <div className="card-header fw-bold bg-info text-white">
//                         <i className="bi bi-headset me-2"></i>
//                         Need Help?
//                     </div>
//                     <div className="card-body">
//                         <div className="row">
//                             {currentOrder.support.email && (
//                                 <div className="col-md-6 mb-2">
//                                     <i className="bi bi-envelope text-primary me-2"></i>
//                                     <strong>Email:</strong> {currentOrder.support.email}
//                                 </div>
//                             )}
//                             {currentOrder.support.phone && (
//                                 <div className="col-md-6 mb-2">
//                                     <i className="bi bi-telephone text-primary me-2"></i>
//                                     <strong>Phone:</strong> {currentOrder.support.phone}
//                                 </div>
//                             )}
//                             {currentOrder.support.hours && (
//                                 <div className="col-12">
//                                     <i className="bi bi-clock text-primary me-2"></i>
//                                     <strong>Hours:</strong> {currentOrder.support.hours}
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             )}
//             {/* Continue Shopping */}
//             {currentOrder?.uiConfig?.showContinueShopping && (
//                 <div className="text-center mb-4">
//                     <Button
//                         variant="primary"
//                         size="lg"
//                         onClick={() => navigate("/products")}
//                         className="px-5 page-title-main-name"
//                     >
//                         <i className="bi bi-bag me-2"></i>
//                         Continue Shopping
//                     </Button>
//                 </div>
//             )}
//             {/* Modals */}
//             <CancelOrderPopup
//                 show={showCancelPopup}
//                 handleClose={() => setShowCancelPopup(false)}
//                 orderId={currentOrder?.orderId}
//                 order={currentOrder}
//             />
//             <CancelSuccessPopup
//                 show={showSuccessPopup}
//                 handleClose={() => {
//                     setShowSuccessPopup(false);
//                     // Refresh order details
//                     if (currentOrder?.orderId || currentOrder?._id) {
//                         fetchOrderDetails(currentOrder.orderId || currentOrder._id);
//                     }
//                 }}
//                 order={currentOrder}
//                 onConfirm={() => {
//                     if (currentOrder?.orderId || currentOrder?._id) {
//                         fetchOrderDetails(currentOrder.orderId || currentOrder._id);
//                     }
//                 }}
//             />
//         </div>
//     );
// };
// export default OrderSuccess;





















// import React, { useState, useEffect } from "react";
// import { useLocation, useNavigate, useParams } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { Modal, Button, Form, Alert, Spinner, Badge } from "react-bootstrap";
// import "../css/ordersuccess.css";
// import InvoiceGenerator from "./InvoiceGenerator";

// /* -------------------- Cancel Success Popup -------------------- */
// const CancelSuccessPopup = ({ show, handleClose, onConfirm, order }) => (
//   <Modal show={show} onHide={handleClose} centered>
//     <Modal.Body className="text-center p-4">
//       <div className="mb-3">
//         <div className="d-flex justify-content-center mb-3">
//           <div
//             className="bg-danger text-white rounded-circle d-flex align-items-center justify-content-center"
//             style={{ width: "60px", height: "60px" }}
//           >
//             <i className="bi bi-check-lg" style={{ fontSize: "24px" }}></i>
//           </div>
//         </div>
//         <h5 className="fw-bold mb-3 text-black page-title-main-name">
//           Order Cancelled Successfully!
//         </h5>
//         <p className="text-muted small mb-3 page-title-main-name">
//           {order?.payment?.paid
//             ? "Refund will be processed within 3–5 business days."
//             : "Order has been cancelled successfully."}
//         </p>
//         <div className="mb-3 border p-3 rounded page-title-main-name">
//           <p className="mb-1">
//             <strong>Order ID:</strong> {order?.displayOrderId || order?.orderId}
//           </p>
//           <p className="mb-1">
//             <strong>Status:</strong> <Badge bg="danger" className="mt-1 ms-2">Cancelled</Badge>
//           </p>
//           {order?.cancellation?.reason && (
//             <p className="mb-1">
//               <strong>Cancellation Reason:</strong> {order.cancellation.reason}
//             </p>
//           )}
//         </div>
//         {/* Add Refund Method Selection if order was paid */}
//         {order?.payment?.paid && order?.refund?.availableMethods?.length > 0 && (
//           <div className="mt-3">
//             <p className="text-info small mb-2">
//               <i className="bi bi-info-circle me-1"></i>
//               Please select your preferred refund method:
//             </p>
//             <Button
//               variant="outline-primary"
//               className="w-100"
//               onClick={() => {
//                 handleClose();
//                 // Navigate to CancelOrder page for refund method selection
//                 window.location.href = `/CancelOrder/${order._id || order.orderId}`;
//               }}
//             >
//               Select Refund Method
//             </Button>
//           </div>
//         )}
//         <Button
//           onClick={() => {
//             handleClose();
//             onConfirm && onConfirm();
//           }}
//           className="w-100 page-title-main-name mt-2"
//           style={{
//             backgroundColor: "#000",
//             border: "none",
//             borderRadius: "8px",
//             fontWeight: "500",
//           }}
//         >
//           Okay
//         </Button>
//       </div>
//     </Modal.Body>
//   </Modal>
// );

// /* -------------------- Cancel Order Popup -------------------- */
// const CancelOrderPopup = ({ show, handleClose, orderId, order }) => {
//   const navigate = useNavigate();
//   const [reason, setReason] = useState("");
//   const [otherDetails, setOtherDetails] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState(null);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [debugInfo, setDebugInfo] = useState({});

//   const reasons = [
//     "Applicable discount/offer was not applied",
//     "Changed my mind. Don't need the product",
//     "Bought it from somewhere else",
//     "Wrong shade/size/colour ordered",
//     "Forgot to apply coupon/reward points",
//     "Wrong address/phone",
//     "Other",
//   ];

//   useEffect(() => {
//     checkAuthentication();
//     if (order) {
//       analyzeOrderStructure(order);
//     }
//   }, [order]);

//   const analyzeOrderStructure = (order) => {
//     const info = {
//       hasUnderscoreId: !!order?._id,
//       hasOrderId: !!order?.orderId,
//       hasDisplayOrderId: !!order?.displayOrderId,
//       orderIdValue: order?.orderId,
//       underscoreIdValue: order?._id,
//       displayOrderIdValue: order?.displayOrderId,
//       isUnderscoreIdMongoId: /^[0-9a-fA-F]{24}$/.test(order?._id || ""),
//       isOrderIdMongoId: /^[0-9a-fA-F]{24}$/.test(order?.orderId || ""),
//       orderStatus: order?.orderStatus || order?.status,
//       shipments: order?.shipments || order?.shipping?.shipments,
//       payment: order?.payment,
//     };
//     setDebugInfo(info);
//     console.log("🔍 Order Structure Analysis:", info);
//   };

//   const checkAuthentication = async () => {
//     try {
//       const response = await fetch(
//         "https://beauty.joyory.com/api/user/profile",
//         {
//           method: "GET",
//           credentials: "include",
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       const contentType = response.headers.get("content-type");

//       if (response.ok && contentType && contentType.includes("application/json")) {
//         setIsAuthenticated(true);
//         console.log("✅ User is authenticated (cookie is valid)");
//         return true;
//       } else {
//         if (!contentType || !contentType.includes("application/json")) {
//           const text = await response.text();
//           console.warn("⚠️ Auth check returned non-JSON:", text.substring(0, 200));

//           if (text.includes("<!DOCTYPE") || text.includes("<html")) {
//             console.log("❌ Server returned HTML - likely not authenticated");
//             setIsAuthenticated(false);
//             return false;
//           }
//         }

//         setIsAuthenticated(false);
//         console.log("❌ User is not authenticated or server error");
//         return false;
//       }
//     } catch (error) {
//       console.error("Auth check error:", error);
//       setIsAuthenticated(false);
//       return false;
//     }
//   };

//   const getCancellableOrderId = () => {
//     // Try all possible ID formats
//     const possibleIds = [order?._id, order?.orderId, order?.displayOrderId];

//     for (const id of possibleIds) {
//       if (id) {
//         console.log(`🔍 Testing ID: ${id}`);
//         return id;
//       }
//     }
//     return null;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const finalReason = reason === "Other" ? otherDetails.trim() : reason.trim();
//     if (!finalReason) {
//       setMessage({ type: "danger", text: "Cancellation reason is required" });
//       return;
//     }

//     // Check authentication
//     const isAuth = await checkAuthentication();
//     if (!isAuth) {
//       setMessage({
//         type: "warning",
//         text: "Please login to cancel the order.",
//       });
//       sessionStorage.setItem("redirectAfterLogin", window.location.pathname);
//       setTimeout(() => navigate("/login"), 1500);
//       return;
//     }

//     const orderIdToCancel = getCancellableOrderId();
//     if (!orderIdToCancel) {
//       setMessage({ type: "danger", text: "Order ID not found" });
//       return;
//     }

//     setLoading(true);
//     setMessage(null);

//     try {
//       // Updated endpoint as per backend
//       const endpoint = `https://beauty.joyory.com/api/user/cart/cancel/${orderIdToCancel}`;

//       console.log(`🔄 Calling cancellation endpoint: ${endpoint}`);

//       const res = await fetch(endpoint, {
//         method: "PUT",
//         credentials: "include",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ reason: finalReason }),
//       });

//       // Check content type
//       const contentType = res.headers.get("content-type");
//       if (!contentType || !contentType.includes("application/json")) {
//         const text = await res.text();
//         console.warn(`⚠️ Endpoint returned non-JSON:`, text.substring(0, 200));
//         throw new Error("Server returned invalid response format");
//       }

//       const data = await res.json();
//       console.log("📦 Cancellation response:", data);

//       if (res.ok && data.success) {
//         // Success!
//         setMessage({ type: "success", text: data.message });

//         // Prepare updated order data
//         const updatedOrder = {
//           ...order,
//           orderStatus: "Cancelled",
//           status: "Cancelled",
//           cancellation: {
//             reason: finalReason,
//             cancelledBy: "Customer",
//             requestedAt: new Date().toISOString(),
//           },
//           // Preserve existing refund data or add new
//           refund: {
//             ...order?.refund,
//             applicable: order?.payment?.paid || false,
//             status: "requested",
//           },
//         };

//         // Store in sessionStorage for CancelOrder page
//         sessionStorage.setItem(
//           `cancelledOrder_${orderIdToCancel}`,
//           JSON.stringify(updatedOrder)
//         );

//         setTimeout(() => {
//           handleClose();
//           // Trigger success popup
//           window.handleCancelSuccess?.({ order: updatedOrder });

//           // If order was paid, redirect to CancelOrder page for refund method selection
//           if (order?.payment?.paid) {
//             navigate(`/CancelOrder/${orderIdToCancel}`, {
//               state: { order: updatedOrder },
//             });
//           }
//         }, 1200);

//         return;
//       } else {
//         throw new Error(data.message || "Cancellation failed");
//       }
//     } catch (err) {
//       console.error("❌ Final Cancellation Error:", err);

//       let userMessage = err.message;
//       if (err.message.includes("HTML")) {
//         userMessage = "Server error. Please try again or contact support.";
//       } else if (err.message.includes("401") || err.message.includes("Unauthorized")) {
//         userMessage = "Your session has expired. Please login again.";
//         sessionStorage.setItem("redirectAfterLogin", window.location.pathname);
//         setTimeout(() => navigate("/login"), 2000);
//       } else if (err.message.includes("404")) {
//         userMessage = "Order cancellation service is currently unavailable.";
//       }

//       setMessage({
//         type: "danger",
//         text: userMessage,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const canCancel = () => {
//     if (!order) return false;
//     // Check if already cancelled
//     if (order.orderStatus === "Cancelled" || order.status === "Cancelled") {
//       return false;
//     }
//     // Get current status
//     const currentStatus = order.orderStatus || order.status;

//     // Define non-cancellable statuses
//     const nonCancellableStatuses = [
//       "Delivered",
//       "Shipped",
//       "Out for Delivery",
//       "Picked Up",
//       "In Transit",
//     ];
//     // Check main status
//     if (nonCancellableStatuses.includes(currentStatus)) {
//       return false;
//     }
//     // Check shipments if they exist
//     const shipments = order.shipments || order.shipping?.shipments;
//     if (shipments && shipments.length > 0) {
//       const blockedShipmentStatuses = [
//         "Picked Up",
//         "In Transit",
//         "Out for Delivery",
//         "Delivered",
//       ];

//       return !shipments.some((shipment) =>
//         blockedShipmentStatuses.includes(shipment.status)
//       );
//     }
//     return true;
//   };

//   const isCancellable = canCancel();

//   return (
//     <Modal show={show} onHide={handleClose} centered size="lg">
//       {/* <Modal.Header   closeButton>
//         <Modal.Title>Cancel Order</Modal.Title>
//       </Modal.Header> */}

//       <Modal.Header className="d-flex justify-content-between align-items-center">
//         <Modal.Title>Cancel Order</Modal.Title>

//         <button
//           type="button"
//           className="btn"
//           onClick={handleClose}
//         >
//           ✖
//         </button>
//       </Modal.Header>
//       <Modal.Body>
//         {message && (
//           <Alert variant={message.type} onClose={() => setMessage(null)} dismissible>
//             {message.text}
//           </Alert>
//         )}
//         {/* <div className="alert alert-info mb-3 page-title-main-name">
//           <strong>Order Details:</strong>
//           <br />
//           <strong>Display ID:</strong> {order?.displayOrderId || "N/A"}
//           <br />
//           <strong>MongoDB _id:</strong> {order?._id || "N/A"}
//           <br />
//           <strong>Order ID:</strong> {order?.orderId || "N/A"}
//           <br />
//           <strong>Status:</strong> {order?.status || order?.orderStatus || "N/A"}
//           <br />
//           <strong>Authentication:</strong>{" "}
//           {isAuthenticated ? (
//             <span className="text-success">✓ Logged in (via cookie)</span>
//           ) : (
//             <span className="text-danger">✗ Not logged in</span>
//           )}
//         </div> */}
//         {!isAuthenticated && (
//           <Alert variant="warning" className="mb-3 page-title-main-name">
//             <strong>Authentication Required!</strong>
//             <p className="mb-2">You need to be logged in to cancel orders.</p>
//             <Button
//               variant="warning"
//               size="sm"
//               onClick={() => {
//                 sessionStorage.setItem("redirectAfterLogin", window.location.pathname);
//                 navigate("/login");
//               }}
//             >
//               Log In Now
//             </Button>
//           </Alert>
//         )}
//         {!isCancellable && (
//           <Alert variant="danger" className="mb-3 page-title-main-name">
//             <strong>Cannot Cancel Order!</strong>
//             <p className="mb-0">
//               {order?.status === "Cancelled"
//                 ? "Order is already cancelled."
//                 : order?.status === "Delivered"
//                   ? "Order is already delivered."
//                   : order?.status === "Shipped"
//                     ? "Order is already shipped."
//                     : "Order cannot be cancelled at this stage."}
//             </p>
//           </Alert>
//         )}
//         <Form onSubmit={handleSubmit}>
//           <Form.Group className="mb-3">
//             <Form.Label>Reason for Cancellation*</Form.Label>
//             {/* <Form.Select
//               required
//               className="custom-select-black"
//               value={reason}
//               onChange={(e) => setReason(e.target.value)}
//               disabled={loading || !isAuthenticated || !isCancellable}
//             >
//               <option value="">Select a reason</option>
//               {reasons.map((r, i) => (
//                 <option key={i} value={r}>
//                   {r}
//                 </option>
//               ))}
//             </Form.Select> */}


//             <Form.Select
//               className="custom-select-black"
//               required
//               value={reason}
//               onChange={(e) => setReason(e.target.value)}
//               disabled={loading || !isAuthenticated || !isCancellable}
//             >
//               <option value="">Select a reason</option>
//               {reasons.map((r, i) => (
//                 <option key={i} value={r}>
//                   {r}
//                 </option>
//               ))}
//             </Form.Select>
//           </Form.Group>
//           {reason === "Other" && (
//             <Form.Group className="mb-3">
//               <Form.Label>Other Details*</Form.Label>
//               <Form.Control
//                 as="textarea"
//                 rows={3}
//                 className="custom-select-black"
//                 maxLength={250}
//                 placeholder="Please specify your reason..."
//                 value={otherDetails}
//                 onChange={(e) => setOtherDetails(e.target.value)}
//                 required
//                 disabled={loading || !isAuthenticated || !isCancellable}
//               />
//               <div className="text-end small text-muted mt-1">
//                 {otherDetails.length}/250
//               </div>
//             </Form.Group>
//           )}
//           <div className="alert alert-warning small mb-3 bg-black page-title-main-name">
//             <strong className="text-white">Important Information:</strong>
//             <ul className="mb-0 mt-1 text-white">
//               <li>
//                 Orders with shipments already "Picked Up", "In Transit", or "Delivered"
//                 cannot be cancelled
//               </li>
//               <li>Refunds for paid orders take 3-5 business days</li>
//               <li>You can only cancel your own orders</li>
//               <li>Cancellation is irreversible</li>
//             </ul>
//           </div>
//           <div className="d-flex gap-2">
//             <Button
//               variant="secondary"
//               onClick={handleClose}
//               className="w-50 cancel-button-cencel-order"
//               disabled={loading}
//             // style={{
//             //   backgroundColor:
//             //     !isAuthenticated || !isCancellable ? "#ccc" : "#1e88e5",
//             //   border: "none",
//             //   borderRadius: "8px",
//             //   padding: "10px",
//             //   fontWeight: "500",
//             // }}
//             >
//               Cancel
//             </Button>
//             <Button
//               type="submit"
//               className="w-50 cancel-button-cencel-order mt-4"
//               disabled={loading || !isAuthenticated || !isCancellable}
//             >
//               {loading ? (
//                 <>
//                   <Spinner animation="border" size="sm" /> Processing...
//                 </>
//               ) : !isAuthenticated ? (
//                 "Login Required"
//               ) : !isCancellable ? (
//                 "Cannot Cancel"
//               ) : (
//                 "Confirm Cancellation"
//               )}
//             </Button>
//           </div>
//         </Form>
//       </Modal.Body>
//     </Modal>
//   );
// };

// /* -------------------- Status Badge Component -------------------- */
// const StatusBadge = ({ status }) => {
//   const getBadgeProps = (status) => {
//     if (!status) return { bg: "secondary", text: "white" };
//     const statusLower = status.toLowerCase();
//     if (statusLower.includes("awaiting")) return { bg: "warning", text: "dark" };
//     if (statusLower.includes("confirmed")) return { bg: "info", text: "white" };
//     if (statusLower.includes("processing")) return { bg: "primary", text: "white" };
//     if (statusLower.includes("shipped")) return { bg: "success", text: "white" };
//     if (statusLower.includes("delivered")) return { bg: "success", text: "white" };
//     if (statusLower.includes("cancelled")) return { bg: "danger", text: "white" };
//     return { bg: "secondary", text: "white" };
//   };
//   const { bg, text } = getBadgeProps(status);
//   return (
//     <Badge bg={bg} text={text} className="px-3 py-2 ms-0 mt-0">
//       {status}
//     </Badge>
//   );
// };

// /* -------------------- Next Steps Component -------------------- */
// const NextSteps = ({ steps }) => (
//   <div className="card shadow-sm mb-4 border-black">
//     <div className="card-header fw-bold bg-info text-white bg-black">
//       <i className="bi bi-info-circle me-2"></i>
//       What's Next?
//     </div>
//     <div className="card-body">
//       <ul className="list-unstyled mb-0">
//         {steps?.map((step, index) => (
//           <li key={index} className="mb-2 d-flex align-items-start ms-3 mt-2">
//             {/* <i className="bi bi-check-circle-fill text-success me-2 mt-1"></i> */}
//             <span>{step}</span>
//           </li>
//         ))}
//       </ul>
//     </div>
//   </div>
// );

// /* -------------------- Main OrderSuccess Component -------------------- */
// const OrderSuccess = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { orderId } = useParams();
//   const [order, setOrder] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [showCancelPopup, setShowCancelPopup] = useState(false);
//   const [showSuccessPopup, setShowSuccessPopup] = useState(false);
//   const [cancelledOrder, setCancelledOrder] = useState(null);
//   const [debugData, setDebugData] = useState({});

//   // Check if user is authenticated via cookie
//   const checkAuthAndRedirect = async () => {
//     try {
//       const response = await fetch(
//         "https://beauty.joyory.com/api/user/profile",
//         {
//           method: "GET",
//           credentials: "include",
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       if (!response.ok) {
//         sessionStorage.setItem("redirectAfterLogin", window.location.pathname);
//         navigate("/login");
//         return false;
//       }
//       return true;
//     } catch (error) {
//       console.error("Auth check error:", error);
//       sessionStorage.setItem("redirectAfterLogin", window.location.pathname);
//       navigate("/login");
//       return false;
//     }
//   };

//   // Fetch order data from API
//   const fetchOrderDetails = async (id) => {
//     try {
//       setLoading(true);
//       setError(null);
//       // Check authentication first
//       const isAuthenticated = await checkAuthAndRedirect();
//       if (!isAuthenticated) {
//         setLoading(false);
//         return;
//       }

//       const orderIdToFetch = id || orderId;
//       console.log("🔍 Starting order fetch for:", orderIdToFetch);

//       if (orderIdToFetch) {
//         // Try multiple endpoints
//         const endpoints = [
//           `https://beauty.joyory.com/api/payment/success/${orderIdToFetch}`,
//           `https://beauty.joyory.com/api/order/${orderIdToFetch}`,
//           `https://beauty.joyory.com/api/user/orders/${orderIdToFetch}`,
//         ];

//         let response = null;
//         let lastError = null;

//         for (const endpoint of endpoints) {
//           try {
//             console.log("Trying endpoint:", endpoint);
//             response = await fetch(endpoint, {
//               method: "GET",
//               credentials: "include",
//               headers: {
//                 "Content-Type": "application/json",
//                 Accept: "application/json",
//               },
//             });
//             if (response.ok) {
//               console.log("✅ Success with endpoint:", endpoint);
//               break;
//             } else {
//               console.log(`❌ Failed with endpoint ${endpoint}: ${response.status}`);
//               lastError = `Failed with status ${response.status}`;
//             }
//           } catch (err) {
//             console.log(`❌ Error with endpoint ${endpoint}:`, err.message);
//             lastError = err.message;
//             continue;
//           }
//         }

//         if (!response || !response.ok) {
//           if (response?.status === 401 || response?.status === 403) {
//             sessionStorage.setItem("redirectAfterLogin", window.location.pathname);
//             navigate("/login");
//             return;
//           }
//           throw new Error(`All endpoints failed. Last error: ${lastError}`);
//         }

//         const data = await response.json();
//         console.log("📦 Order data received:", data);

//         if (data.success || data.order) {
//           const orderData = data.order || data;
//           setOrder(orderData);

//           // Store debug info
//           setDebugData({
//             fetchedAt: new Date().toISOString(),
//             orderId: orderData.orderId,
//             _id: orderData._id,
//             displayOrderId: orderData.displayOrderId,
//             status: orderData.status,
//             orderStatus: orderData.orderStatus,
//             isMongoId: /^[0-9a-fA-F]{24}$/.test(orderData._id || ""),
//             hasShipments: !!(orderData.shipments || orderData.shipping?.shipments),
//             paymentMethod: orderData.payment?.method,
//             paymentStatus: orderData.payment?.status,
//           });
//         } else {
//           throw new Error(data.message || "Failed to load order");
//         }
//       } else if (location.state?.backendResponse) {
//         const orderData = location.state.backendResponse.order || location.state.backendResponse;
//         setOrder(orderData);
//       } else {
//         throw new Error("No order ID provided");
//       }
//     } catch (error) {
//       console.error("❌ Error fetching order:", error);
//       setError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOrderDetails();

//     // Handle cancellation success
//     window.handleCancelSuccess = (data) => {
//       console.log("🔄 Handling cancellation success:", data);
//       setCancelledOrder(data.order);
//       setOrder(data.order);
//       setShowSuccessPopup(true);

//       // Refresh the order details
//       if (data.order?.orderId || data.order?._id) {
//         setTimeout(() => {
//           fetchOrderDetails(data.order.orderId || data.order._id);
//         }, 1500);
//       }
//     };

//     return () => {
//       delete window.handleCancelSuccess;
//     };
//   }, [orderId, location.state]);

//   if (loading) {
//     return (
//       <div className="container py-5 text-center">
//         <Spinner animation="border" variant="primary" />
//         <p className="mt-3">Loading order details...</p>
//       </div>
//     );
//   }

//   if (error || !order) {
//     return (
//       <div className="container py-5">
//         <div className="alert alert-danger page-title-main-name">
//           <h5>Failed to load order details</h5>
//           <p>{error || "Order not found"}</p>
//           <p className="small text-muted mb-3">
//             Order ID used: {orderId}
//             <br />
//             Please check if the order ID is correct and you have proper access.
//           </p>
//           <div className="mt-3">
//             <Button variant="primary" onClick={() => navigate("/")} className="me-2">
//               Go to Homepage
//             </Button>
//             <Button variant="outline-secondary" onClick={() => fetchOrderDetails()}>
//               Retry
//             </Button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   const isOrderCancelled = order?.status === "Cancelled" || order?.orderStatus === "Cancelled" || cancelledOrder;
//   const currentOrder = cancelledOrder || order;

//   return (
//     <div className="container py-4">
//       {/* Back Button */}
//       <div className="mb-3">
//         <button
//           className="btn btn-link text-decoration-none"
//           onClick={() => (window.history.length > 1 ? navigate(-1) : navigate("/"))}
//         >
//           <i className="bi bi-arrow-left me-1"></i> Back
//         </button>
//       </div>

//       {/* Order Status Banner */}
//       <div className="mb-4">
//         <div
//           className={`alert ${isOrderCancelled ? "alert-danger" : "alert-success"
//             } d-flex align-items-center bg-black text-white`}
//         >
//           <div className="flex-grow-1">
//             <div className="d-flex align-items-center justify-content-between page-title-main-name">
//               <div>
//                 <StatusBadge status={currentOrder?.status || currentOrder?.orderStatus} />
//                 <h5 className="mb-1 mt-5">
//                   <i
//                     className={`bi ${isOrderCancelled ? "bi-x-circle" : "bi-check-circle"
//                       } me-2`}
//                   ></i>
//                   Order {isOrderCancelled ? "Cancelled" : "Confirmed"}!
//                 </h5>
//                 <p className="mb-0 small">
//                   <strong>Order ID:</strong>{" "}
//                   {currentOrder?.displayOrderId || currentOrder?.orderId} |
//                   <strong className="ms-2">Date:</strong>{" "}
//                   {new Date(currentOrder?.orderDate).toLocaleDateString("en-IN", {
//                     day: "numeric",
//                     month: "long",
//                     year: "numeric",
//                   })}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Action Buttons */}
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <div>
//           {!isOrderCancelled &&
//             currentOrder?.status !== "Delivered" &&
//             currentOrder?.status !== "Shipped" && (
//               <button
//                 className="btn btn-outline-danger btn-sm me-2"
//                 onClick={() => setShowCancelPopup(true)}
//               >
//                 <i className="bi bi-x-circle me-1"></i> Cancel Order
//               </button>
//             )}
//           {currentOrder?.shipping?.trackingAvailable && (
//             <button className="btn btn-outline-primary btn-sm">
//               <i className="bi bi-truck me-1"></i> Track Order
//             </button>
//           )}
//         </div>
//         {/* <InvoiceGenerator
//           order={currentOrder}
//           items={currentOrder?.products || []}
//           shippingAddress={currentOrder?.shipping?.address || {}}
//           paymentMethod={currentOrder?.payment?.method}
//           gstAmount={currentOrder?.amount?.gst}
//           shippingCharge={currentOrder?.amount?.shipping}
//           subtotal={currentOrder?.amount?.subtotal}
//           discount={currentOrder?.amount?.discount}
//           grandTotal={currentOrder?.amount?.grandTotal}
//         /> */}
//       </div>

//       {/* Order Items */}
//       <div className="card shadow-sm mb-4 height-section">
//         <div className="card-header fw-bold d-flex justify-content-between align-items-center page-title-main-name">
//           <span>Order Items ({currentOrder?.products?.length || 0})</span>
//           {isOrderCancelled && (
//             <Badge bg="danger" className="mt-1" style={{ marginLeft: "120px" }}>
//               Cancelled
//             </Badge>
//           )}
//         </div>
//         <div className="card-body">
//           {currentOrder?.products?.length > 0 ? (
//             currentOrder.products.map((item, i) => (
//               <div
//                 key={i}
//                 // className="d-flex flex-column flex-md-row align-items-start gap-3 mb-3 pb-3 border-bottom"
//                 className="d-flex align-items-center flex-md-row align-items-start gap-lg-5 gap-2 mb-3 pb-3 mt-lg-4 mt-3"
//               >
//                 <div className="position-relative">
//                   <img
//                     src={item.image || "/placeholder.png"}
//                     alt={item.name}
//                     className="img-fluid "
//                     style={{ width: "100%", height: "170px", objectFit: "cover" }}
//                   />
//                   {item.variant?.discountPercent && (
//                     <span
//                       className="position-absolute top-0 start-0 badge bg-danger mt-1 ms-2"
//                       style={{ fontSize: "14px" }}
//                     >
//                       -{item.variant.discountPercent}%
//                     </span>
//                   )}
//                 </div>
//                 <div className="flex-grow-1 page-title-main-name">
//                   <h6 className="fw-bold mb-1">
//                     {item.name}
//                   </h6>
//                   {item.variant && (
//                     <div className="text-muted small mt-1">
//                       {item.variant.shadeName && (
//                         <div className="d-lg-flex d-block align-items-center ">
//                           <span>Shade: {item.variant.shadeName}</span>
//                           {item.variant.hex && (
//                             <span
//                               className="ms-2 d-inline-block rounded-circle"
//                               style={{
//                                 width: "12px",
//                                 height: "12px",
//                                 backgroundColor: item.variant.hex,
//                                 border: "1px solid #dee2e6",
//                               }}
//                             ></span>
//                           )}
//                         </div>
//                       )}
//                       {item.variant.sku && <div>SKU: {item.variant.sku}</div>}
//                     </div>
//                   )}
//                   <div className="mt-2">
//                     <div className="d-flex align-items-center">
//                       <span className="text-muted me-2">Quantity:</span>
//                       <span className="fw-bold">{item.quantity}</span>
//                     </div>
//                     <div className="d-flex align-items-center mt-1">
//                       <span className="text-muted me-2">Price:</span>
//                       {item.variant?.originalPrice && (
//                         <span className="text-decoration-line-through text-muted me-2">
//                           ₹{item.variant.originalPrice.toFixed(2)}
//                         </span>
//                       )}
//                       <span className="fw-bold text-primary">
//                         ₹{(item.price || item.variant?.discountedPrice || 0).toFixed(2)}
//                       </span>
//                     </div>
//                     <div className="mt-2">
//                       <strong>Total: </strong>
//                       ₹{((item.quantity || 1) * (item.price || item.variant?.discountedPrice || 0)).toFixed(2)}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div className="text-center py-4 page-title-main-name">
//               <i className="bi bi-cart-x text-muted" style={{ fontSize: "48px" }}></i>
//               <p className="text-muted mt-3">No items found in this order.</p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Next Steps */}
//       {currentOrder?.nextSteps && currentOrder.nextSteps.length > 0 && !isOrderCancelled && (
//         <NextSteps steps={currentOrder.nextSteps} />
//       )}

//       {/* Payment Details */}
//       <div className="card shadow-sm mb-4 page-title-main-name">
//         <div className="card-header fw-bold">Payment Details</div>
//         <div className="card-body ps-3">
//           <div className="d-flex justify-content-between mb-2 ps-lg-3 ps-3 pe-3 pt-lg-3 pt-3">
//             <span>Subtotal:</span>
//             <span>₹{(currentOrder?.amount?.subtotal || 0).toFixed(2)}</span>
//           </div>
//           {(currentOrder?.amount?.discount || 0) > 0 && (
//             <div className="d-flex justify-content-between mb-2 text-success ps-lg-3 ps-3 pe-3">
//               <span>Discount:</span>
//               <span>-₹{(currentOrder?.amount?.discount || 0).toFixed(2)}</span>
//             </div>
//           )}
//           {(currentOrder?.amount?.gst || 0) > 0 && (
//             <div className="d-flex justify-content-between mb-2 ps-lg-3 ps-3 pe-3">
//               <span>GST:</span>
//               <span>₹{(currentOrder?.amount?.gst || 0).toFixed(2)}</span>
//             </div>
//           )}
//           <div className="d-flex justify-content-between mb-2 ps-lg-3 ps-3 pe-3">
//             <span>Shipping:</span>
//             <span>
//               {(currentOrder?.amount?.shipping || 0) === 0
//                 ? "Free"
//                 : `₹${(currentOrder?.amount?.shipping || 0).toFixed(2)}`}
//             </span>
//           </div>
//           <hr />
//           <div className="d-flex justify-content-between fw-bold fs-5 ps-lg-3 ps-3 pe-3">
//             <span className="mt-3">Total Payable :</span>
//             <span className="text-black mt-3">₹{(currentOrder?.amount?.grandTotal || 0).toFixed(2)}</span>
//           </div>
//           <div className="mt-3 ps-lg-3 ps-3 pe-3">
//             <div className="d-flex justify-content-between">
//               <span className="text-muted">Payment Method:</span>
//               <span className="fw-bold">{currentOrder?.payment?.method}</span>
//             </div>
//             <div className="d-flex justify-content-between mt-1">
//               <span className="text-muted">Payment Status:</span>
//               <div
//                 bg={currentOrder?.payment?.status === "pending" ? "warning" : "success"}
//               >
//                 {currentOrder?.payment?.status?.toUpperCase()}
//               </div>
//             </div>
//             {currentOrder?.payment?.transactionId && (
//               <div className="d-flex justify-content-between mt-1">
//                 <span className="text-muted">Transaction ID:</span>
//                 <span className="text-muted small">{currentOrder.payment.transactionId}</span>
//               </div>
//             )}
//           </div>
//           {currentOrder?.payment?.note && (
//             <div className="alert text-white mt-3 mb-0 small page-title-main-name bg-black">
//               <i className="bi bi-info-circle me-1"></i>
//               {currentOrder.payment.note}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Delivery Address */}
//       <div className="card shadow-sm mb-4 page-title-main-name">
//         <div className="card-header fw-bold">Delivery Address</div>
//         <div className="card-body">
//           <p className="mb-1 ps-3 mt-lg-3 mt-3 fw-bold">{currentOrder?.shipping?.address?.name}</p>
//           <p className="mb-1 ps-3">{currentOrder?.shipping?.address?.addressLine1}</p>
//           <p className="mb-1 ps-3">
//             {currentOrder?.shipping?.address?.city},{" "}
//             {currentOrder?.shipping?.address?.state} -{" "}
//             {currentOrder?.shipping?.address?.pincode}
//           </p>
//           <p className="mb-1 ps-3">
//             <i className="bi bi-telephone me-1"></i>
//             {currentOrder?.shipping?.address?.phone}
//           </p>
//           {currentOrder?.shipping?.address?.email && (
//             <p className="mb-0 ps-3">
//               <i className="bi bi-envelope me-1"></i>
//               {currentOrder.shipping.address.email}
//             </p>
//           )}
//           {currentOrder?.shipping?.expectedDelivery && (
//             <div className="mt-3 ps-3 pb-3">
//               <p className="mb-1">
//                 <i className="bi bi-calendar-check me-1"></i>
//                 <strong>Expected Delivery:</strong>{" "}
//                 {new Date(currentOrder.shipping.expectedDelivery).toLocaleDateString(
//                   "en-IN",
//                   {
//                     weekday: "long",
//                     day: "numeric",
//                     month: "long",
//                     year: "numeric",
//                   }
//                 )}
//               </p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Cancellation Details */}
//       {isOrderCancelled && currentOrder?.cancellation && (
//         <div className="card shadow-sm mb-4 border-danger page-title-main-name">
//           <div className="card-header fw-bold text-danger bg-danger bg-opacity-10">
//             <i className="bi bi-x-circle me-2"></i>
//             Cancellation Details
//           </div>
//           <div className="card-body ms-3">
//             <p className="mt-3">
//               <strong className="page-title-main-name">Reason:</strong>{" "}
//               {currentOrder.cancellation.reason}
//             </p>
//             <p>
//               <strong className="page-title-main-name">Cancelled By:</strong>{" "}
//               {currentOrder.cancellation.cancelledBy}
//             </p>
//             <p>
//               <strong className="page-title-main-name">Date:</strong>{" "}
//               {new Date(currentOrder.cancellation.requestedAt).toLocaleDateString(
//                 "en-IN",
//                 {
//                   day: "numeric",
//                   month: "long",
//                   year: "numeric",
//                   hour: "2-digit",
//                   minute: "2-digit",
//                 }
//               )}
//             </p>
//           </div>
//         </div>
//       )}

//       {/* Support Information */}
//       {currentOrder?.support && (
//         <div className="card shadow-sm mb-4 border-black page-title-main-name">
//           <div className="card-header fw-bold bg-info text-white bg-black">
//             <i className="bi bi-headset me-2"></i>
//             Need Help?
//           </div>
//           <div className="card-body">
//             <div className="row ps-3 pt-lg-3 pt-3">
//               {currentOrder.support.email && (
//                 <div className="col-md-6 mb-2 pt-lg-2 pt-2">
//                   <i className="bi bi-envelope text-black me-2"></i>
//                   <strong>Email:</strong> {currentOrder.support.email}
//                 </div>
//               )}
//               {currentOrder.support.phone && (
//                 <div className="col-md-6 mb-2 pt-lg-2 pt-2">
//                   <i className="bi bi-telephone text-black me-2"></i>
//                   <strong>Phone:</strong> {currentOrder.support.phone}
//                 </div>
//               )}
//               {currentOrder.support.hours && (
//                 <div className="col-12 pt-lg-2 pt-2 pb-4">
//                   <i className="bi bi-clock text-black me-2"></i>
//                   <strong>Hours:</strong> {currentOrder.support.hours}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Continue Shopping */}
//       {currentOrder?.uiConfig?.showContinueShopping && (
//         <div className="text-center mb-4">
//           <Button
//             variant="primary"
//             size="lg"
//             onClick={() => navigate("/products")}
//             className="px-5 page-title-main-name"
//           >
//             <i className="bi bi-bag me-2"></i>
//             Continue Shopping
//           </Button>
//         </div>
//       )}

//       {/* Modals */}
//       <CancelOrderPopup
//         show={showCancelPopup}
//         handleClose={() => setShowCancelPopup(false)}
//         orderId={currentOrder?.orderId}
//         order={currentOrder}
//       />
//       <CancelSuccessPopup
//         show={showSuccessPopup}
//         handleClose={() => {
//           setShowSuccessPopup(false);
//           if (currentOrder?.orderId || currentOrder?._id) {
//             fetchOrderDetails(currentOrder.orderId || currentOrder._id);
//           }
//         }}
//         order={currentOrder}
//         onConfirm={() => {
//           if (currentOrder?.orderId || currentOrder?._id) {
//             fetchOrderDetails(currentOrder.orderId || currentOrder._id);
//           }
//         }}
//       />
//     </div>
//   );
// };

// export default OrderSuccess;














import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button, Form, Alert, Spinner, Badge } from "react-bootstrap";
import "../css/ordersuccess.css";
import InvoiceGenerator from "./InvoiceGenerator";

/* -------------------- Cancel Success Popup -------------------- */
const CancelSuccessPopup = ({ show, handleClose, onConfirm, order }) => (
  <Modal show={show} onHide={handleClose} centered>
    <Modal.Body className="text-center p-4">
      <div className="mb-3">
        <div className="d-flex justify-content-center mb-3">
          <div
            className="bg-danger text-white rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: "60px", height: "60px" }}
          >
            <i className="bi bi-check-lg" style={{ fontSize: "24px" }}></i>
          </div>
        </div>
        <h5 className="fw-bold mb-3 text-black page-title-main-name">
          Order Cancelled Successfully!
        </h5>
        <p className="text-muted small mb-3 page-title-main-name">
          {order?.payment?.paid
            ? "Refund will be processed within 3–5 business days."
            : "Order has been cancelled successfully."}
        </p>
        <div className="mb-3 border p-3 rounded page-title-main-name">
          <p className="mb-1">
            <strong>Order ID:</strong> {order?.displayOrderId || order?.orderId}
          </p>
          <p className="mb-1">
            <strong>Status:</strong> <Badge bg="danger" className="mt-1 ms-2">Cancelled</Badge>
          </p>
          {order?.cancellation?.reason && (
            <p className="mb-1">
              <strong>Cancellation Reason:</strong> {order.cancellation.reason}
            </p>
          )}
        </div>
        {/* Add Refund Method Selection if order was paid */}
        {order?.payment?.paid && order?.refund?.availableMethods?.length > 0 && (
          <div className="mt-3">
            <p className="text-info small mb-2">
              <i className="bi bi-info-circle me-1"></i>
              Please select your preferred refund method:
            </p>
            <Button
              variant="outline-primary"
              className="w-100"
              onClick={() => {
                handleClose();
                // Navigate to CancelOrder page for refund method selection
                window.location.href = `/CancelOrder/${order._id || order.orderId}`;
              }}
            >
              Select Refund Method
            </Button>
          </div>
        )}
        <Button
          onClick={() => {
            handleClose();
            onConfirm && onConfirm();
          }}
          className="w-100 page-title-main-name mt-2"
          style={{
            backgroundColor: "#000",
            border: "none",
            borderRadius: "8px",
            fontWeight: "500",
          }}
        >
          Okay
        </Button>
      </div>
    </Modal.Body>
  </Modal>
);

/* -------------------- Cancel Order Popup -------------------- */
const CancelOrderPopup = ({ show, handleClose, orderId, order }) => {
  const navigate = useNavigate();
  const [reason, setReason] = useState("");
  const [otherDetails, setOtherDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [debugInfo, setDebugInfo] = useState({});

  const reasons = [
    "Applicable discount/offer was not applied",
    "Changed my mind. Don't need the product",
    "Bought it from somewhere else",
    "Wrong shade/size/colour ordered",
    "Forgot to apply coupon/reward points",
    "Wrong address/phone",
    "Other",
  ];

  useEffect(() => {
    checkAuthentication();
    if (order) {
      analyzeOrderStructure(order);
    }
  }, [order]);

  const analyzeOrderStructure = (order) => {
    const info = {
      hasUnderscoreId: !!order?._id,
      hasOrderId: !!order?.orderId,
      hasDisplayOrderId: !!order?.displayOrderId,
      orderIdValue: order?.orderId,
      underscoreIdValue: order?._id,
      displayOrderIdValue: order?.displayOrderId,
      isUnderscoreIdMongoId: /^[0-9a-fA-F]{24}$/.test(order?._id || ""),
      isOrderIdMongoId: /^[0-9a-fA-F]{24}$/.test(order?.orderId || ""),
      orderStatus: order?.orderStatus || order?.status,
      shipments: order?.shipments || order?.shipping?.shipments,
      payment: order?.payment,
    };
    setDebugInfo(info);
    console.log("🔍 Order Structure Analysis:", info);
  };

  const checkAuthentication = async () => {
    try {
      const response = await fetch(
        "https://beauty.joyory.com/api/user/profile",
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const contentType = response.headers.get("content-type");

      if (response.ok && contentType && contentType.includes("application/json")) {
        setIsAuthenticated(true);
        console.log("✅ User is authenticated (cookie is valid)");
        return true;
      } else {
        if (!contentType || !contentType.includes("application/json")) {
          const text = await response.text();
          console.warn("⚠️ Auth check returned non-JSON:", text.substring(0, 200));

          if (text.includes("<!DOCTYPE") || text.includes("<html")) {
            console.log("❌ Server returned HTML - likely not authenticated");
            setIsAuthenticated(false);
            return false;
          }
        }

        setIsAuthenticated(false);
        console.log("❌ User is not authenticated or server error");
        return false;
      }
    } catch (error) {
      console.error("Auth check error:", error);
      setIsAuthenticated(false);
      return false;
    }
  };

  const getCancellableOrderId = () => {
    // Try all possible ID formats
    const possibleIds = [order?._id, order?.orderId, order?.displayOrderId];

    for (const id of possibleIds) {
      if (id) {
        console.log(`🔍 Testing ID: ${id}`);
        return id;
      }
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalReason = reason === "Other" ? otherDetails.trim() : reason.trim();
    if (!finalReason) {
      setMessage({ type: "danger", text: "Cancellation reason is required" });
      return;
    }

    // Check authentication
    const isAuth = await checkAuthentication();
    if (!isAuth) {
      setMessage({
        type: "warning",
        text: "Please login to cancel the order.",
      });
      sessionStorage.setItem("redirectAfterLogin", window.location.pathname);
      setTimeout(() => navigate("/login"), 1500);
      return;
    }

    const orderIdToCancel = getCancellableOrderId();
    if (!orderIdToCancel) {
      setMessage({ type: "danger", text: "Order ID not found" });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      // Updated endpoint as per backend
      const endpoint = `https://beauty.joyory.com/api/user/cart/cancel/${orderIdToCancel}`;

      console.log(`🔄 Calling cancellation endpoint: ${endpoint}`);

      const res = await fetch(endpoint, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reason: finalReason }),
      });

      // Check content type
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await res.text();
        console.warn(`⚠️ Endpoint returned non-JSON:`, text.substring(0, 200));
        throw new Error("Server returned invalid response format");
      }

      const data = await res.json();
      console.log("📦 Cancellation response:", data);

      if (res.ok && data.success) {
        // Success!
        setMessage({ type: "success", text: data.message });

        // Prepare updated order data
        const updatedOrder = {
          ...order,
          orderStatus: "Cancelled",
          status: "Cancelled",
          cancellation: {
            reason: finalReason,
            cancelledBy: "Customer",
            requestedAt: new Date().toISOString(),
          },
          // Preserve existing refund data or add new
          refund: {
            ...order?.refund,
            applicable: order?.payment?.paid || false,
            status: "requested",
          },
        };

        // Store in sessionStorage for CancelOrder page
        sessionStorage.setItem(
          `cancelledOrder_${orderIdToCancel}`,
          JSON.stringify(updatedOrder)
        );

        setTimeout(() => {
          handleClose();
          // Trigger success popup
          window.handleCancelSuccess?.({ order: updatedOrder });

          // If order was paid, redirect to CancelOrder page for refund method selection
          if (order?.payment?.paid) {
            navigate(`/CancelOrder/${orderIdToCancel}`, {
              state: { order: updatedOrder },
            });
          }
        }, 1200);

        return;
      } else {
        throw new Error(data.message || "Cancellation failed");
      }
    } catch (err) {
      console.error("❌ Final Cancellation Error:", err);

      let userMessage = err.message;
      if (err.message.includes("HTML")) {
        userMessage = "Server error. Please try again or contact support.";
      } else if (err.message.includes("401") || err.message.includes("Unauthorized")) {
        userMessage = "Your session has expired. Please login again.";
        sessionStorage.setItem("redirectAfterLogin", window.location.pathname);
        setTimeout(() => navigate("/login"), 2000);
      } else if (err.message.includes("404")) {
        userMessage = "Order cancellation service is currently unavailable.";
      }

      setMessage({
        type: "danger",
        text: userMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const canCancel = () => {
    if (!order) return false;
    // Check if already cancelled
    if (order.orderStatus === "Cancelled" || order.status === "Cancelled") {
      return false;
    }
    // Get current status
    const currentStatus = order.orderStatus || order.status;

    // Define non-cancellable statuses
    const nonCancellableStatuses = [
      "Delivered",
      "Shipped",
      "Out for Delivery",
      "Picked Up",
      "In Transit",
    ];
    // Check main status
    if (nonCancellableStatuses.includes(currentStatus)) {
      return false;
    }
    // Check shipments if they exist
    const shipments = order.shipments || order.shipping?.shipments;
    if (shipments && shipments.length > 0) {
      const blockedShipmentStatuses = [
        "Picked Up",
        "In Transit",
        "Out for Delivery",
        "Delivered",
      ];

      return !shipments.some((shipment) =>
        blockedShipmentStatuses.includes(shipment.status)
      );
    }
    return true;
  };

  const isCancellable = canCancel();

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header className="d-flex justify-content-between align-items-center">
        <Modal.Title>Cancel Order</Modal.Title>

        <button
          type="button"
          className="btn"
          onClick={handleClose}
        >
          ✖
        </button>
      </Modal.Header>
      <Modal.Body>
        {message && (
          <Alert variant={message.type} onClose={() => setMessage(null)} dismissible>
            {message.text}
          </Alert>
        )}
        {!isAuthenticated && (
          <Alert variant="warning" className="mb-3 page-title-main-name">
            <strong>Authentication Required!</strong>
            <p className="mb-2">You need to be logged in to cancel orders.</p>
            <Button
              variant="warning"
              size="sm"
              onClick={() => {
                sessionStorage.setItem("redirectAfterLogin", window.location.pathname);
                navigate("/login");
              }}
            >
              Log In Now
            </Button>
          </Alert>
        )}
        {!isCancellable && (
          <Alert variant="danger" className="mb-3 page-title-main-name">
            <strong>Cannot Cancel Order!</strong>
            <p className="mb-0">
              {order?.status === "Cancelled"
                ? "Order is already cancelled."
                : order?.status === "Delivered"
                  ? "Order is already delivered."
                  : order?.status === "Shipped"
                    ? "Order is already shipped."
                    : "Order cannot be cancelled at this stage."}
            </p>
          </Alert>
        )}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Reason for Cancellation*</Form.Label>
            <Form.Select
              className="custom-select-black"
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={loading || !isAuthenticated || !isCancellable}
            >
              <option value="">Select a reason</option>
              {reasons.map((r, i) => (
                <option key={i} value={r}>
                  {r}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          {reason === "Other" && (
            <Form.Group className="mb-3">
              <Form.Label>Other Details*</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                className="custom-select-black"
                maxLength={250}
                placeholder="Please specify your reason..."
                value={otherDetails}
                onChange={(e) => setOtherDetails(e.target.value)}
                required
                disabled={loading || !isAuthenticated || !isCancellable}
              />
              <div className="text-end small text-muted mt-1">
                {otherDetails.length}/250
              </div>
            </Form.Group>
          )}
          <div className="alert alert-warning small mb-3 bg-black page-title-main-name">
            <strong className="text-white">Important Information:</strong>
            <ul className="mb-0 mt-1 text-white">
              <li>
                Orders with shipments already "Picked Up", "In Transit", or "Delivered"
                cannot be cancelled
              </li>
              <li>Refunds for paid orders take 3-5 business days</li>
              <li>You can only cancel your own orders</li>
              <li>Cancellation is irreversible</li>
            </ul>
          </div>
          <div className="d-flex gap-2">
            <Button
              variant="secondary"
              onClick={handleClose}
              className="w-50 cancel-button-cencel-order"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="w-50 cancel-button-cencel-order mt-4"
              disabled={loading || !isAuthenticated || !isCancellable}
            >
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" /> Processing...
                </>
              ) : !isAuthenticated ? (
                "Login Required"
              ) : !isCancellable ? (
                "Cannot Cancel"
              ) : (
                "Confirm Cancellation"
              )}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

/* -------------------- Navigation Block Modal -------------------- */
const NavigationBlockModal = ({ show, handleClose, handleConfirm }) => (
  <Modal show={show} onHide={handleClose} centered>
    <Modal.Body className="text-center p-4">
      <div className="mb-3">
        <div className="d-flex justify-content-center mb-3">
          <div
            className="bg-warning text-white rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: "60px", height: "60px" }}
          >
            <i className="bi bi-exclamation-triangle" style={{ fontSize: "24px" }}></i>
          </div>
        </div>
        <h5 className="fw-bold mb-3 text-black page-title-main-name">
          Leave This Page?
        </h5>
        <p className="text-muted mb-3 page-title-main-name">
          Your order has been placed successfully. If you go back, you'll be redirected to the homepage.
        </p>
        <div className="d-flex gap-2">
          <Button
            variant="secondary"
            onClick={handleClose}
            className="w-50"
          >
            Stay on Page
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            className="w-50"
            style={{
              backgroundColor: "#000",
              border: "none",
            }}
          >
            Go to Homepage
          </Button>
        </div>
      </div>
    </Modal.Body>
  </Modal>
);

/* -------------------- Status Badge Component -------------------- */
const StatusBadge = ({ status }) => {
  const getBadgeProps = (status) => {
    if (!status) return { bg: "secondary", text: "white" };
    const statusLower = status.toLowerCase();
    if (statusLower.includes("awaiting")) return { bg: "warning", text: "dark" };
    if (statusLower.includes("confirmed")) return { bg: "info", text: "white" };
    if (statusLower.includes("processing")) return { bg: "primary", text: "white" };
    if (statusLower.includes("shipped")) return { bg: "success", text: "white" };
    if (statusLower.includes("delivered")) return { bg: "success", text: "white" };
    if (statusLower.includes("cancelled")) return { bg: "danger", text: "white" };
    return { bg: "secondary", text: "white" };
  };
  const { bg, text } = getBadgeProps(status);
  return (
    <Badge bg={bg} text={text} className="px-3 py-2 ms-0 mt-0">
      {status}
    </Badge>
  );
};

/* -------------------- Next Steps Component -------------------- */
const NextSteps = ({ steps }) => (
  <div className="card shadow-sm mb-4 border-black">
    <div className="card-header fw-bold bg-info text-white bg-black">
      <i className="bi bi-info-circle me-2"></i>
      What's Next?
    </div>
    <div className="card-body">
      <ul className="list-unstyled mb-0">
        {steps?.map((step, index) => (
          <li key={index} className="mb-2 d-flex align-items-start ms-3 mt-2">
            <span>{step}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

/* -------------------- Main OrderSuccess Component -------------------- */
const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [cancelledOrder, setCancelledOrder] = useState(null);
  const [debugData, setDebugData] = useState({});
  const [showNavBlockModal, setShowNavBlockModal] = useState(false);
  const [isBlocking, setIsBlocking] = useState(false);

  // Check if user is authenticated via cookie
  const checkAuthAndRedirect = async () => {
    try {
      const response = await fetch(
        "https://beauty.joyory.com/api/user/profile",
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        sessionStorage.setItem("redirectAfterLogin", window.location.pathname);
        navigate("/login");
        return false;
      }
      return true;
    } catch (error) {
      console.error("Auth check error:", error);
      sessionStorage.setItem("redirectAfterLogin", window.location.pathname);
      navigate("/login");
      return false;
    }
  };

  // Fetch order data from API
  const fetchOrderDetails = async (id) => {
    try {
      setLoading(true);
      setError(null);
      // Check authentication first
      const isAuthenticated = await checkAuthAndRedirect();
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      const orderIdToFetch = id || orderId;
      console.log("🔍 Starting order fetch for:", orderIdToFetch);

      if (orderIdToFetch) {
        // Try multiple endpoints
        const endpoints = [
          `https://beauty.joyory.com/api/payment/success/${orderIdToFetch}`,
          `https://beauty.joyory.com/api/order/${orderIdToFetch}`,
          `https://beauty.joyory.com/api/user/orders/${orderIdToFetch}`,
        ];

        let response = null;
        let lastError = null;

        for (const endpoint of endpoints) {
          try {
            console.log("Trying endpoint:", endpoint);
            response = await fetch(endpoint, {
              method: "GET",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
            });
            if (response.ok) {
              console.log("✅ Success with endpoint:", endpoint);
              break;
            } else {
              console.log(`❌ Failed with endpoint ${endpoint}: ${response.status}`);
              lastError = `Failed with status ${response.status}`;
            }
          } catch (err) {
            console.log(`❌ Error with endpoint ${endpoint}:`, err.message);
            lastError = err.message;
            continue;
          }
        }

        if (!response || !response.ok) {
          if (response?.status === 401 || response?.status === 403) {
            sessionStorage.setItem("redirectAfterLogin", window.location.pathname);
            navigate("/login");
            return;
          }
          throw new Error(`All endpoints failed. Last error: ${lastError}`);
        }

        const data = await response.json();
        console.log("📦 Order data received:", data);

        if (data.success || data.order) {
          const orderData = data.order || data;
          setOrder(orderData);

          // Store debug info
          setDebugData({
            fetchedAt: new Date().toISOString(),
            orderId: orderData.orderId,
            _id: orderData._id,
            displayOrderId: orderData.displayOrderId,
            status: orderData.status,
            orderStatus: orderData.orderStatus,
            isMongoId: /^[0-9a-fA-F]{24}$/.test(orderData._id || ""),
            hasShipments: !!(orderData.shipments || orderData.shipping?.shipments),
            paymentMethod: orderData.payment?.method,
            paymentStatus: orderData.payment?.status,
          });
        } else {
          throw new Error(data.message || "Failed to load order");
        }
      } else if (location.state?.backendResponse) {
        const orderData = location.state.backendResponse.order || location.state.backendResponse;
        setOrder(orderData);
      } else {
        throw new Error("No order ID provided");
      }
    } catch (error) {
      console.error("❌ Error fetching order:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();

    // Handle cancellation success
    window.handleCancelSuccess = (data) => {
      console.log("🔄 Handling cancellation success:", data);
      setCancelledOrder(data.order);
      setOrder(data.order);
      setShowSuccessPopup(true);

      // Refresh the order details
      if (data.order?.orderId || data.order?._id) {
        setTimeout(() => {
          fetchOrderDetails(data.order.orderId || data.order._id);
        }, 1500);
      }
    };

    // ==================== BACK NAVIGATION PREVENTION LOGIC ====================
    const handleBackNavigation = (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (!isBlocking) {
        setIsBlocking(true);
        
        // Show navigation block modal
        setShowNavBlockModal(true);
      }
      
      return false;
    };

    // Push a dummy state to handle back button
    window.history.pushState(null, "", window.location.href);
    
    // Add event listener for popstate (back/forward navigation)
    window.addEventListener("popstate", handleBackNavigation);

    // Clean up
    return () => {
      delete window.handleCancelSuccess;
      window.removeEventListener("popstate", handleBackNavigation);
    };
  }, [orderId, location.state, isBlocking]);

  const handleNavBlockConfirm = () => {
    setShowNavBlockModal(false);
    setIsBlocking(false);
    
    // Remove the event listener to allow navigation
    window.removeEventListener("popstate", () => {});
    
    // Navigate to homepage
    navigate("/", { replace: true });
  };

  const handleNavBlockClose = () => {
    setShowNavBlockModal(false);
    setIsBlocking(false);
    
    // Push state again to maintain blocking
    window.history.pushState(null, "", window.location.href);
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading order details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger page-title-main-name">
          <h5>Failed to load order details</h5>
          <p>{error || "Order not found"}</p>
          <p className="small text-muted mb-3">
            Order ID used: {orderId}
            <br />
            Please check if the order ID is correct and you have proper access.
          </p>
          <div className="mt-3">
            <Button variant="primary" onClick={() => navigate("/")} className="me-2">
              Go to Homepage
            </Button>
            <Button variant="outline-secondary" onClick={() => fetchOrderDetails()}>
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const isOrderCancelled = order?.status === "Cancelled" || order?.orderStatus === "Cancelled" || cancelledOrder;
  const currentOrder = cancelledOrder || order;

  return (
    <div className="container py-4">
      {/* Modified Back Button - Goes to Home instead of back */}
      <div className="mb-3">
        <button
          className="btn btn-link text-decoration-none"
          onClick={() => {
            // Instead of going back, navigate to home
            navigate("/", { replace: true });
          }}
        >
          <i className="bi bi-house me-1"></i> Home
        </button>
      </div>

      {/* Order Status Banner */}
      <div className="mb-4">
        <div
          className={`alert ${isOrderCancelled ? "alert-danger" : "alert-success"
            } d-flex align-items-center bg-black text-white`}
        >
          <div className="flex-grow-1">
            <div className="d-flex align-items-center justify-content-between page-title-main-name">
              <div>
                <StatusBadge status={currentOrder?.status || currentOrder?.orderStatus} />
                <h5 className="mb-1 mt-5">
                  <i
                    className={`bi ${isOrderCancelled ? "bi-x-circle" : "bi-check-circle"
                      } me-2`}
                  ></i>
                  Order {isOrderCancelled ? "Cancelled" : "Confirmed"}!
                </h5>
                <p className="mb-0 small">
                  <strong>Order ID:</strong>{" "}
                  {currentOrder?.displayOrderId || currentOrder?.orderId} |
                  <strong className="ms-2">Date:</strong>{" "}
                  {new Date(currentOrder?.orderDate).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          {!isOrderCancelled &&
            currentOrder?.status !== "Delivered" &&
            currentOrder?.status !== "Shipped" && (
              <button
                className="btn btn-outline-danger btn-sm me-2"
                onClick={() => setShowCancelPopup(true)}
              >
                <i className="bi bi-x-circle me-1"></i> Cancel Order
              </button>
            )}
          {currentOrder?.shipping?.trackingAvailable && (
            <button className="btn btn-outline-primary btn-sm">
              <i className="bi bi-truck me-1"></i> Track Order
            </button>
          )}
        </div>
      </div>

      {/* Order Items */}
      <div className="card shadow-sm mb-4 height-section">
        <div className="card-header fw-bold d-flex justify-content-between align-items-center page-title-main-name">
          <span>Order Items ({currentOrder?.products?.length || 0})</span>
          {isOrderCancelled && (
            <Badge bg="danger" className="mt-1" style={{ marginLeft: "120px" }}>
              Cancelled
            </Badge>
          )}
        </div>
        <div className="card-body">
          {currentOrder?.products?.length > 0 ? (
            currentOrder.products.map((item, i) => (
              <div
                key={i}
                className="d-flex align-items-center flex-md-row align-items-start gap-lg-5 gap-2 mb-3 pb-3 mt-lg-4 mt-3"
              >
                <div className="position-relative">
                  <img
                    src={item.image || "/placeholder.png"}
                    alt={item.name}
                    className="img-fluid"
                    style={{ width: "100%", height: "170px", objectFit: "cover" }}
                  />
                  {item.variant?.discountPercent && (
                    <span
                      className="position-absolute top-0 start-0 badge bg-danger mt-1 ms-2"
                      style={{ fontSize: "14px" }}
                    >
                      -{item.variant.discountPercent}%
                    </span>
                  )}
                </div>
                <div className="flex-grow-1 page-title-main-name">
                  <h6 className="fw-bold mb-1">
                    {item.name}
                  </h6>
                  {item.variant && (
                    <div className="text-muted small mt-1">
                      {item.variant.shadeName && (
                        <div className="d-lg-flex d-block align-items-center">
                          <span>Shade: {item.variant.shadeName}</span>
                          {item.variant.hex && (
                            <span
                              className="ms-2 d-inline-block rounded-circle"
                              style={{
                                width: "12px",
                                height: "12px",
                                backgroundColor: item.variant.hex,
                                border: "1px solid #dee2e6",
                              }}
                            ></span>
                          )}
                        </div>
                      )}
                      {item.variant.sku && <div>SKU: {item.variant.sku}</div>}
                    </div>
                  )}
                  <div className="mt-2">
                    <div className="d-flex align-items-center">
                      <span className="text-muted me-2">Quantity:</span>
                      <span className="fw-bold">{item.quantity}</span>
                    </div>
                    <div className="d-flex align-items-center mt-1">
                      <span className="text-muted me-2">Price:</span>
                      {item.variant?.originalPrice && (
                        <span className="text-decoration-line-through text-muted me-2">
                          ₹{item.variant.originalPrice.toFixed(2)}
                        </span>
                      )}
                      <span className="fw-bold text-primary">
                        ₹{(item.price || item.variant?.discountedPrice || 0).toFixed(2)}
                      </span>
                    </div>
                    <div className="mt-2">
                      <strong>Total: </strong>
                      ₹{((item.quantity || 1) * (item.price || item.variant?.discountedPrice || 0)).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 page-title-main-name">
              <i className="bi bi-cart-x text-muted" style={{ fontSize: "48px" }}></i>
              <p className="text-muted mt-3">No items found in this order.</p>
            </div>
          )}
        </div>
      </div>

      {/* Next Steps */}
      {currentOrder?.nextSteps && currentOrder.nextSteps.length > 0 && !isOrderCancelled && (
        <NextSteps steps={currentOrder.nextSteps} />
      )}

      {/* Payment Details */}
      <div className="card shadow-sm mb-4 page-title-main-name">
        <div className="card-header fw-bold">Payment Details</div>
        <div className="card-body ps-3">
          <div className="d-flex justify-content-between mb-2 ps-lg-3 ps-3 pe-3 pt-lg-3 pt-3">
            <span>Subtotal:</span>
            <span>₹{(currentOrder?.amount?.subtotal || 0).toFixed(2)}</span>
          </div>
          {(currentOrder?.amount?.discount || 0) > 0 && (
            <div className="d-flex justify-content-between mb-2 text-success ps-lg-3 ps-3 pe-3">
              <span>Discount:</span>
              <span>-₹{(currentOrder?.amount?.discount || 0).toFixed(2)}</span>
            </div>
          )}
          {(currentOrder?.amount?.gst || 0) > 0 && (
            <div className="d-flex justify-content-between mb-2 ps-lg-3 ps-3 pe-3">
              <span>GST:</span>
              <span>₹{(currentOrder?.amount?.gst || 0).toFixed(2)}</span>
            </div>
          )}
          <div className="d-flex justify-content-between mb-2 ps-lg-3 ps-3 pe-3">
            <span>Shipping:</span>
            <span>
              {(currentOrder?.amount?.shipping || 0) === 0
                ? "Free"
                : `₹${(currentOrder?.amount?.shipping || 0).toFixed(2)}`}
            </span>
          </div>
          <hr />
          <div className="d-flex justify-content-between fw-bold fs-5 ps-lg-3 ps-3 pe-3">
            <span className="mt-3">Total Payable :</span>
            <span className="text-black mt-3">₹{(currentOrder?.amount?.grandTotal || 0).toFixed(2)}</span>
          </div>
          <div className="mt-3 ps-lg-3 ps-3 pe-3">
            <div className="d-flex justify-content-between">
              <span className="text-muted">Payment Method:</span>
              <span className="fw-bold">{currentOrder?.payment?.method}</span>
            </div>
            <div className="d-flex justify-content-between mt-1">
              <span className="text-muted">Payment Status:</span>
              <div
                bg={currentOrder?.payment?.status === "pending" ? "warning" : "success"}
              >
                {currentOrder?.payment?.status?.toUpperCase()}
              </div>
            </div>
            {currentOrder?.payment?.transactionId && (
              <div className="d-flex justify-content-between mt-1">
                <span className="text-muted">Transaction ID:</span>
                <span className="text-muted small">{currentOrder.payment.transactionId}</span>
              </div>
            )}
          </div>
          {currentOrder?.payment?.note && (
            <div className="alert text-white mt-3 mb-0 small page-title-main-name bg-black">
              <i className="bi bi-info-circle me-1"></i>
              {currentOrder.payment.note}
            </div>
          )}
        </div>
      </div>

      {/* Delivery Address */}
      <div className="card shadow-sm mb-4 page-title-main-name">
        <div className="card-header fw-bold">Delivery Address</div>
        <div className="card-body">
          <p className="mb-1 ps-3 mt-lg-3 mt-3 fw-bold">{currentOrder?.shipping?.address?.name}</p>
          <p className="mb-1 ps-3">{currentOrder?.shipping?.address?.addressLine1}</p>
          <p className="mb-1 ps-3">
            {currentOrder?.shipping?.address?.city},{" "}
            {currentOrder?.shipping?.address?.state} -{" "}
            {currentOrder?.shipping?.address?.pincode}
          </p>
          <p className="mb-1 ps-3">
            <i className="bi bi-telephone me-1"></i>
            {currentOrder?.shipping?.address?.phone}
          </p>
          {currentOrder?.shipping?.address?.email && (
            <p className="mb-0 ps-3">
              <i className="bi bi-envelope me-1"></i>
              {currentOrder.shipping.address.email}
            </p>
          )}
          {currentOrder?.shipping?.expectedDelivery && (
            <div className="mt-3 ps-3 pb-3">
              <p className="mb-1">
                <i className="bi bi-calendar-check me-1"></i>
                <strong>Expected Delivery:</strong>{" "}
                {new Date(currentOrder.shipping.expectedDelivery).toLocaleDateString(
                  "en-IN",
                  {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  }
                )}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Cancellation Details */}
      {isOrderCancelled && currentOrder?.cancellation && (
        <div className="card shadow-sm mb-4 border-danger page-title-main-name">
          <div className="card-header fw-bold text-danger bg-danger bg-opacity-10">
            <i className="bi bi-x-circle me-2"></i>
            Cancellation Details
          </div>
          <div className="card-body ms-3">
            <p className="mt-3">
              <strong className="page-title-main-name">Reason:</strong>{" "}
              {currentOrder.cancellation.reason}
            </p>
            <p>
              <strong className="page-title-main-name">Cancelled By:</strong>{" "}
              {currentOrder.cancellation.cancelledBy}
            </p>
            <p>
              <strong className="page-title-main-name">Date:</strong>{" "}
              {new Date(currentOrder.cancellation.requestedAt).toLocaleDateString(
                "en-IN",
                {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                }
              )}
            </p>
          </div>
        </div>
      )}

      {/* Support Information */}
      {currentOrder?.support && (
        <div className="card shadow-sm mb-4 border-black page-title-main-name">
          <div className="card-header fw-bold bg-info text-white bg-black">
            <i className="bi bi-headset me-2"></i>
            Need Help?
          </div>
          <div className="card-body">
            <div className="row ps-3 pt-lg-3 pt-3">
              {currentOrder.support.email && (
                <div className="col-md-6 mb-2 pt-lg-2 pt-2">
                  <i className="bi bi-envelope text-black me-2"></i>
                  <strong>Email:</strong> {currentOrder.support.email}
                </div>
              )}
              {currentOrder.support.phone && (
                <div className="col-md-6 mb-2 pt-lg-2 pt-2">
                  <i className="bi bi-telephone text-black me-2"></i>
                  <strong>Phone:</strong> {currentOrder.support.phone}
                </div>
              )}
              {currentOrder.support.hours && (
                <div className="col-12 pt-lg-2 pt-2 pb-4">
                  <i className="bi bi-clock text-black me-2"></i>
                  <strong>Hours:</strong> {currentOrder.support.hours}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Continue Shopping */}
      {currentOrder?.uiConfig?.showContinueShopping && (
        <div className="text-center mb-4">
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate("/products")}
            className="px-5 page-title-main-name"
          >
            <i className="bi bi-bag me-2"></i>
            Continue Shopping
          </Button>
        </div>
      )}

      {/* Modals */}
      <CancelOrderPopup
        show={showCancelPopup}
        handleClose={() => setShowCancelPopup(false)}
        orderId={currentOrder?.orderId}
        order={currentOrder}
      />
      <CancelSuccessPopup
        show={showSuccessPopup}
        handleClose={() => {
          setShowSuccessPopup(false);
          if (currentOrder?.orderId || currentOrder?._id) {
            fetchOrderDetails(currentOrder.orderId || currentOrder._id);
          }
        }}
        order={currentOrder}
        onConfirm={() => {
          if (currentOrder?.orderId || currentOrder?._id) {
            fetchOrderDetails(currentOrder.orderId || currentOrder._id);
          }
        }}
      />
      {/* Navigation Block Modal */}
      <NavigationBlockModal
        show={showNavBlockModal}
        handleClose={handleNavBlockClose}
        handleConfirm={handleNavBlockConfirm}
      />
    </div>
  );
};

export default OrderSuccess;



















// import React, { useState, useEffect } from "react";
// import { useLocation, useNavigate, useParams } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { Modal, Button, Form, Alert, Spinner, Badge } from "react-bootstrap";
// import "../css/ordersuccess.css";
// import InvoiceGenerator from "./InvoiceGenerator";

// /* -------------------- Cancel Success Popup -------------------- */
// const CancelSuccessPopup = ({ show, handleClose, onConfirm, order }) => (
//   <Modal show={show} onHide={handleClose} centered>
//     <Modal.Body className="text-center p-4">
//       <div className="mb-3">
//         <div className="d-flex justify-content-center mb-3">
//           <div
//             className="bg-danger text-white rounded-circle d-flex align-items-center justify-content-center"
//             style={{ width: "60px", height: "60px" }}
//           >
//             <i className="bi bi-check-lg" style={{ fontSize: "24px" }}></i>
//           </div>
//         </div>
//         <h5 className="fw-bold mb-3 text-black page-title-main-name">
//           Order Cancelled Successfully!
//         </h5>
//         <p className="text-muted small mb-3 page-title-main-name">
//           {order?.payment?.paid
//             ? "Refund will be processed within 3–5 business days."
//             : "Order has been cancelled successfully."}
//         </p>
//         <div className="mb-3 border p-3 rounded page-title-main-name">
//           <p className="mb-1">
//             <strong>Order ID:</strong> {order?.displayOrderId || order?.orderId}
//           </p>
//           <p className="mb-1">
//             <strong>Status:</strong> <Badge bg="danger" className="mt-1 ms-2">Cancelled</Badge>
//           </p>
//           {order?.cancellation?.reason && (
//             <p className="mb-1">
//               <strong>Cancellation Reason:</strong> {order.cancellation.reason}
//             </p>
//           )}
//         </div>
//         {order?.payment?.paid && order?.refund?.availableMethods?.length > 0 && (
//           <div className="mt-3">
//             <p className="text-info small mb-2">
//               <i className="bi bi-info-circle me-1"></i>
//               Please select your preferred refund method:
//             </p>
//             <Button
//               variant="outline-primary"
//               className="w-100"
//               onClick={() => {
//                 handleClose();
//                 window.location.href = `/CancelOrder/${order._id || order.orderId}`;
//               }}
//             >
//               Select Refund Method
//             </Button>
//           </div>
//         )}
//         <Button
//           onClick={() => {
//             handleClose();
//             onConfirm && onConfirm();
//           }}
//           className="w-100 page-title-main-name mt-2"
//           style={{
//             backgroundColor: "#000",
//             border: "none",
//             borderRadius: "8px",
//             fontWeight: "500",
//           }}
//         >
//           Okay
//         </Button>
//       </div>
//     </Modal.Body>
//   </Modal>
// );

// /* -------------------- Cancel Order Popup -------------------- */
// const CancelOrderPopup = ({ show, handleClose, orderId, order }) => {
//   const navigate = useNavigate();
//   const [reason, setReason] = useState("");
//   const [otherDetails, setOtherDetails] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState(null);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [debugInfo, setDebugInfo] = useState({});

//   const reasons = [
//     "Applicable discount/offer was not applied",
//     "Changed my mind. Don't need the product",
//     "Bought it from somewhere else",
//     "Wrong shade/size/colour ordered",
//     "Forgot to apply coupon/reward points",
//     "Wrong address/phone",
//     "Other",
//   ];

//   useEffect(() => {
//     checkAuthentication();
//     if (order) {
//       analyzeOrderStructure(order);
//     }
//   }, [order]);

//   const analyzeOrderStructure = (order) => {
//     const info = {
//       hasUnderscoreId: !!order?._id,
//       hasOrderId: !!order?.orderId,
//       hasDisplayOrderId: !!order?.displayOrderId,
//       orderIdValue: order?.orderId,
//       underscoreIdValue: order?._id,
//       displayOrderIdValue: order?.displayOrderId,
//       isUnderscoreIdMongoId: /^[0-9a-fA-F]{24}$/.test(order?._id || ""),
//       isOrderIdMongoId: /^[0-9a-fA-F]{24}$/.test(order?.orderId || ""),
//       orderStatus: order?.orderStatus || order?.status,
//       shipments: order?.shipments || order?.shipping?.shipments,
//       payment: order?.payment,
//     };
//     setDebugInfo(info);
//     console.log("🔍 Order Structure Analysis:", info);
//   };

//   const checkAuthentication = async () => {
//     try {
//       const response = await fetch(
//         "https://beauty.joyory.com/api/user/profile",
//         {
//           method: "GET",
//           credentials: "include",
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       const contentType = response.headers.get("content-type");

//       if (response.ok && contentType && contentType.includes("application/json")) {
//         setIsAuthenticated(true);
//         console.log("✅ User is authenticated (cookie is valid)");
//         return true;
//       } else {
//         if (!contentType || !contentType.includes("application/json")) {
//           const text = await response.text();
//           console.warn("⚠️ Auth check returned non-JSON:", text.substring(0, 200));

//           if (text.includes("<!DOCTYPE") || text.includes("<html")) {
//             console.log("❌ Server returned HTML - likely not authenticated");
//             setIsAuthenticated(false);
//             return false;
//           }
//         }

//         setIsAuthenticated(false);
//         console.log("❌ User is not authenticated or server error");
//         return false;
//       }
//     } catch (error) {
//       console.error("Auth check error:", error);
//       setIsAuthenticated(false);
//       return false;
//     }
//   };

//   const getCancellableOrderId = () => {
//     const possibleIds = [order?._id, order?.orderId, order?.displayOrderId];

//     for (const id of possibleIds) {
//       if (id) {
//         console.log(`🔍 Testing ID: ${id}`);
//         return id;
//       }
//     }
//     return null;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const finalReason = reason === "Other" ? otherDetails.trim() : reason.trim();
//     if (!finalReason) {
//       setMessage({ type: "danger", text: "Cancellation reason is required" });
//       return;
//     }

//     const isAuth = await checkAuthentication();
//     if (!isAuth) {
//       setMessage({
//         type: "warning",
//         text: "Please login to cancel the order.",
//       });
//       sessionStorage.setItem("redirectAfterLogin", window.location.pathname);
//       setTimeout(() => navigate("/login"), 1500);
//       return;
//     }

//     const orderIdToCancel = getCancellableOrderId();
//     if (!orderIdToCancel) {
//       setMessage({ type: "danger", text: "Order ID not found" });
//       return;
//     }

//     setLoading(true);
//     setMessage(null);

//     try {
//       const endpoint = `https://beauty.joyory.com/api/user/cart/cancel/${orderIdToCancel}`;

//       console.log(`🔄 Calling cancellation endpoint: ${endpoint}`);

//       const res = await fetch(endpoint, {
//         method: "PUT",
//         credentials: "include",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ reason: finalReason }),
//       });

//       const contentType = res.headers.get("content-type");
//       if (!contentType || !contentType.includes("application/json")) {
//         const text = await res.text();
//         console.warn(`⚠️ Endpoint returned non-JSON:`, text.substring(0, 200));
//         throw new Error("Server returned invalid response format");
//       }

//       const data = await res.json();
//       console.log("📦 Cancellation response:", data);

//       if (res.ok && data.success) {
//         setMessage({ type: "success", text: data.message });

//         const updatedOrder = {
//           ...order,
//           orderStatus: "Cancelled",
//           status: "Cancelled",
//           cancellation: {
//             reason: finalReason,
//             cancelledBy: "Customer",
//             requestedAt: new Date().toISOString(),
//           },
//           refund: {
//             ...order?.refund,
//             applicable: order?.payment?.paid || false,
//             status: "requested",
//           },
//         };

//         sessionStorage.setItem(
//           `cancelledOrder_${orderIdToCancel}`,
//           JSON.stringify(updatedOrder)
//         );

//         setTimeout(() => {
//           handleClose();
//           window.handleCancelSuccess?.({ order: updatedOrder });

//           if (order?.payment?.paid) {
//             navigate(`/CancelOrder/${orderIdToCancel}`, {
//               state: { order: updatedOrder },
//             });
//           }
//         }, 1200);

//         return;
//       } else {
//         throw new Error(data.message || "Cancellation failed");
//       }
//     } catch (err) {
//       console.error("❌ Final Cancellation Error:", err);

//       let userMessage = err.message;
//       if (err.message.includes("HTML")) {
//         userMessage = "Server error. Please try again or contact support.";
//       } else if (err.message.includes("401") || err.message.includes("Unauthorized")) {
//         userMessage = "Your session has expired. Please login again.";
//         sessionStorage.setItem("redirectAfterLogin", window.location.pathname);
//         setTimeout(() => navigate("/login"), 2000);
//       } else if (err.message.includes("404")) {
//         userMessage = "Order cancellation service is currently unavailable.";
//       }

//       setMessage({
//         type: "danger",
//         text: userMessage,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const canCancel = () => {
//     if (!order) return false;
//     if (order.orderStatus === "Cancelled" || order.status === "Cancelled") {
//       return false;
//     }
//     const currentStatus = order.orderStatus || order.status;

//     const nonCancellableStatuses = [
//       "Delivered",
//       "Shipped",
//       "Out for Delivery",
//       "Picked Up",
//       "In Transit",
//     ];
//     if (nonCancellableStatuses.includes(currentStatus)) {
//       return false;
//     }
//     const shipments = order.shipments || order.shipping?.shipments;
//     if (shipments && shipments.length > 0) {
//       const blockedShipmentStatuses = [
//         "Picked Up",
//         "In Transit",
//         "Out for Delivery",
//         "Delivered",
//       ];

//       return !shipments.some((shipment) =>
//         blockedShipmentStatuses.includes(shipment.status)
//       );
//     }
//     return true;
//   };

//   const isCancellable = canCancel();

//   return (
//     <Modal show={show} onHide={handleClose} centered size="lg">
//       <Modal.Header className="d-flex justify-content-between align-items-center">
//         <Modal.Title>Cancel Order</Modal.Title>
//         <button
//           type="button"
//           className="btn"
//           onClick={handleClose}
//         >
//           ✖
//         </button>
//       </Modal.Header>
//       <Modal.Body>
//         {message && (
//           <Alert variant={message.type} onClose={() => setMessage(null)} dismissible>
//             {message.text}
//           </Alert>
//         )}
//         {!isAuthenticated && (
//           <Alert variant="warning" className="mb-3 page-title-main-name">
//             <strong>Authentication Required!</strong>
//             <p className="mb-2">You need to be logged in to cancel orders.</p>
//             <Button
//               variant="warning"
//               size="sm"
//               onClick={() => {
//                 sessionStorage.setItem("redirectAfterLogin", window.location.pathname);
//                 navigate("/login");
//               }}
//             >
//               Log In Now
//             </Button>
//           </Alert>
//         )}
//         {!isCancellable && (
//           <Alert variant="danger" className="mb-3 page-title-main-name">
//             <strong>Cannot Cancel Order!</strong>
//             <p className="mb-0">
//               {order?.status === "Cancelled"
//                 ? "Order is already cancelled."
//                 : order?.status === "Delivered"
//                   ? "Order is already delivered."
//                   : order?.status === "Shipped"
//                     ? "Order is already shipped."
//                     : "Order cannot be cancelled at this stage."}
//             </p>
//           </Alert>
//         )}
//         <Form onSubmit={handleSubmit}>
//           <Form.Group className="mb-3">
//             <Form.Label>Reason for Cancellation*</Form.Label>
//             <Form.Select
//               className="custom-select-black"
//               required
//               value={reason}
//               onChange={(e) => setReason(e.target.value)}
//               disabled={loading || !isAuthenticated || !isCancellable}
//             >
//               <option value="">Select a reason</option>
//               {reasons.map((r, i) => (
//                 <option key={i} value={r}>
//                   {r}
//                 </option>
//               ))}
//             </Form.Select>
//           </Form.Group>
//           {reason === "Other" && (
//             <Form.Group className="mb-3">
//               <Form.Label>Other Details*</Form.Label>
//               <Form.Control
//                 as="textarea"
//                 rows={3}
//                 className="custom-select-black"
//                 maxLength={250}
//                 placeholder="Please specify your reason..."
//                 value={otherDetails}
//                 onChange={(e) => setOtherDetails(e.target.value)}
//                 required
//                 disabled={loading || !isAuthenticated || !isCancellable}
//               />
//               <div className="text-end small text-muted mt-1">
//                 {otherDetails.length}/250
//               </div>
//             </Form.Group>
//           )}
//           <div className="alert alert-warning small mb-3 bg-black page-title-main-name">
//             <strong className="text-white">Important Information:</strong>
//             <ul className="mb-0 mt-1 text-white">
//               <li>
//                 Orders with shipments already "Picked Up", "In Transit", or "Delivered"
//                 cannot be cancelled
//               </li>
//               <li>Refunds for paid orders take 3-5 business days</li>
//               <li>You can only cancel your own orders</li>
//               <li>Cancellation is irreversible</li>
//             </ul>
//           </div>
//           <div className="d-flex gap-2">
//             <Button
//               variant="secondary"
//               onClick={handleClose}
//               className="w-50 cancel-button-cencel-order"
//               disabled={loading}
//             >
//               Cancel
//             </Button>
//             <Button
//               type="submit"
//               className="w-50 cancel-button-cencel-order mt-4"
//               disabled={loading || !isAuthenticated || !isCancellable}
//             >
//               {loading ? (
//                 <>
//                   <Spinner animation="border" size="sm" /> Processing...
//                 </>
//               ) : !isAuthenticated ? (
//                 "Login Required"
//               ) : !isCancellable ? (
//                 "Cannot Cancel"
//               ) : (
//                 "Confirm Cancellation"
//               )}
//             </Button>
//           </div>
//         </Form>
//       </Modal.Body>
//     </Modal>
//   );
// };

// /* -------------------- Status Badge Component -------------------- */
// const StatusBadge = ({ status }) => {
//   const getBadgeProps = (status) => {
//     if (!status) return { bg: "secondary", text: "white" };
//     const statusLower = status.toLowerCase();
//     if (statusLower.includes("awaiting")) return { bg: "warning", text: "dark" };
//     if (statusLower.includes("confirmed")) return { bg: "info", text: "white" };
//     if (statusLower.includes("processing")) return { bg: "primary", text: "white" };
//     if (statusLower.includes("shipped")) return { bg: "success", text: "white" };
//     if (statusLower.includes("delivered")) return { bg: "success", text: "white" };
//     if (statusLower.includes("cancelled")) return { bg: "danger", text: "white" };
//     return { bg: "secondary", text: "white" };
//   };
//   const { bg, text } = getBadgeProps(status);
//   return (
//     <Badge bg={bg} text={text} className="px-3 py-2 ms-0 mt-0">
//       {status}
//     </Badge>
//   );
// };

// /* -------------------- Next Steps Component -------------------- */
// const NextSteps = ({ steps }) => (
//   <div className="card shadow-sm mb-4 border-black">
//     <div className="card-header fw-bold bg-info text-white bg-black">
//       <i className="bi bi-info-circle me-2"></i>
//       What's Next?
//     </div>
//     <div className="card-body">
//       <ul className="list-unstyled mb-0">
//         {steps?.map((step, index) => (
//           <li key={index} className="mb-2 d-flex align-items-start ms-3 mt-2">
//             <span>{step}</span>
//           </li>
//         ))}
//       </ul>
//     </div>
//   </div>
// );

// /* -------------------- Blocked Order Component -------------------- */
// const BlockedOrderMessage = ({ message, orderId, onRetry, onGoToOrders, onGoHome }) => (
//   <div className="container py-5">
//     <div className="row justify-content-center">
//       <div className="col-md-8 col-lg-6 text-center">
//         <div className="card shadow-sm border-0">
//           <div className="card-body p-5">
//             <div className="mb-4">
//               <div
//                 className="bg-info bg-opacity-10 text-info rounded-circle d-inline-flex align-items-center justify-content-center"
//                 style={{ width: "80px", height: "80px" }}
//               >
//                 <i className="bi bi-info-circle-fill" style={{ fontSize: "36px" }}></i>
//               </div>
//             </div>
//             <h4 className="fw-bold mb-3 page-title-main-name">Order Unavailable</h4>
//             <p className="text-muted mb-4 page-title-main-name">{message}</p>
            
//             {orderId && (
//               <div className="alert alert-light border mb-4">
//                 <small className="text-muted">Order ID: <strong>{orderId}</strong></small>
//               </div>
//             )}

//             <div className="d-flex flex-column gap-2">
//               <Button
//                 variant="dark"
//                 className="w-100 page-title-main-name"
//                 onClick={onGoToOrders}
//               >
//                 <i className="bi bi-box-seam me-2"></i>
//                 View My Orders
//               </Button>
//               <Button
//                 variant="outline-secondary"
//                 className="w-100 page-title-main-name"
//                 onClick={onRetry}
//               >
//                 <i className="bi bi-arrow-clockwise me-2"></i>
//                 Retry Loading
//               </Button>
//               <Button
//                 variant="link"
//                 className="w-100 text-decoration-none page-title-main-name"
//                 onClick={onGoHome}
//               >
//                 Continue Shopping
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
// );

// /* -------------------- Main OrderSuccess Component -------------------- */
// const OrderSuccess = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { orderId } = useParams();
//   const [order, setOrder] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [showCancelPopup, setShowCancelPopup] = useState(false);
//   const [showSuccessPopup, setShowSuccessPopup] = useState(false);
//   const [cancelledOrder, setCancelledOrder] = useState(null);
//   const [debugData, setDebugData] = useState({});
  
//   /* 🆕 NEW: Handle backend response with order: null */
//   const [blockedInfo, setBlockedInfo] = useState(null);

//   const checkAuthAndRedirect = async () => {
//     try {
//       const response = await fetch(
//         "https://beauty.joyory.com/api/user/profile",
//         {
//           method: "GET",
//           credentials: "include",
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       if (!response.ok) {
//         sessionStorage.setItem("redirectAfterLogin", window.location.pathname);
//         navigate("/login");
//         return false;
//       }
//       return true;
//     } catch (error) {
//       console.error("Auth check error:", error);
//       sessionStorage.setItem("redirectAfterLogin", window.location.pathname);
//       navigate("/login");
//       return false;
//     }
//   };

//   const fetchOrderDetails = async (id) => {
//     try {
//       setLoading(true);
//       setError(null);
//       setBlockedInfo(null);
      
//       const isAuthenticated = await checkAuthAndRedirect();
//       if (!isAuthenticated) {
//         setLoading(false);
//         return;
//       }

//       const orderIdToFetch = id || orderId;
//       console.log("🔍 Starting order fetch for:", orderIdToFetch);

//       if (orderIdToFetch) {
//         const endpoints = [
//           `https://beauty.joyory.com/api/payment/success/${orderIdToFetch}`,
//           `https://beauty.joyory.com/api/order/${orderIdToFetch}`,
//           `https://beauty.joyory.com/api/user/orders/${orderIdToFetch}`,
//         ];

//         let response = null;
//         let lastError = null;

//         for (const endpoint of endpoints) {
//           try {
//             console.log("Trying endpoint:", endpoint);
//             response = await fetch(endpoint, {
//               method: "GET",
//               credentials: "include",
//               headers: {
//                 "Content-Type": "application/json",
//                 Accept: "application/json",
//               },
//             });
//             if (response.ok) {
//               console.log("✅ Success with endpoint:", endpoint);
//               break;
//             } else {
//               console.log(`❌ Failed with endpoint ${endpoint}: ${response.status}`);
//               lastError = `Failed with status ${response.status}`;
//             }
//           } catch (err) {
//             console.log(`❌ Error with endpoint ${endpoint}:`, err.message);
//             lastError = err.message;
//             continue;
//           }
//         }

//         if (!response || !response.ok) {
//           if (response?.status === 401 || response?.status === 403) {
//             sessionStorage.setItem("redirectAfterLogin", window.location.pathname);
//             navigate("/login");
//             return;
//           }
//           throw new Error(`All endpoints failed. Last error: ${lastError}`);
//         }

//         const data = await response.json();
//         console.log("📦 Order data received:", data);

//         /* 🆕 NEW: Handle explicit order: null from backend */
//         if (data.success === true && data.order === null) {
//           console.log("🚫 Backend returned order: null — blocking OrderSuccess page");
//           setBlockedInfo({
//             message: data.message || "This order is not available.",
//             uiConfig: data.uiConfig || {},
//           });
//           setOrder(null);
//           setLoading(false);
//           return;
//         }

//         if (data.success && data.order) {
//           const orderData = data.order;
//           setOrder(orderData);

//           setDebugData({
//             fetchedAt: new Date().toISOString(),
//             orderId: orderData.orderId,
//             _id: orderData._id,
//             displayOrderId: orderData.displayOrderId,
//             status: orderData.status,
//             orderStatus: orderData.orderStatus,
//             isMongoId: /^[0-9a-fA-F]{24}$/.test(orderData._id || ""),
//             hasShipments: !!(orderData.shipments || orderData.shipping?.shipments),
//             paymentMethod: orderData.payment?.method,
//             paymentStatus: orderData.payment?.status,
//           });
//         } else {
//           throw new Error(data.message || "Failed to load order");
//         }
//       } else if (location.state?.backendResponse) {
//         const orderData = location.state.backendResponse.order || location.state.backendResponse;
//         setOrder(orderData);
//       } else {
//         throw new Error("No order ID provided");
//       }
//     } catch (error) {
//       console.error("❌ Error fetching order:", error);
//       setError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOrderDetails();

//     window.handleCancelSuccess = (data) => {
//       console.log("🔄 Handling cancellation success:", data);
//       setCancelledOrder(data.order);
//       setOrder(data.order);
//       setShowSuccessPopup(true);

//       if (data.order?.orderId || data.order?._id) {
//         setTimeout(() => {
//           fetchOrderDetails(data.order.orderId || data.order._id);
//         }, 1500);
//       }
//     };

//     return () => {
//       delete window.handleCancelSuccess;
//     };
//   }, [orderId, location.state]);

//   if (loading) {
//     return (
//       <div className="container py-5 text-center">
//         <Spinner animation="border" variant="primary" />
//         <p className="mt-3">Loading order details...</p>
//       </div>
//     );
//   }

//   /* 🆕 NEW: Block OrderSuccess when backend returns order: null */
//   if (blockedInfo) {
//     return (
//       <BlockedOrderMessage
//         message={blockedInfo.message}
//         orderId={orderId}
//         onRetry={() => fetchOrderDetails()}
//         onGoToOrders={() => navigate("/orders")}
//         onGoHome={() => navigate("/")}
//       />
//     );
//   }

//   if (error || !order) {
//     return (
//       <div className="container py-5">
//         <div className="alert alert-danger page-title-main-name">
//           <h5>Failed to load order details</h5>
//           <p>{error || "Order not found"}</p>
//           <p className="small text-muted mb-3">
//             Order ID used: {orderId}
//             <br />
//             Please check if the order ID is correct and you have proper access.
//           </p>
//           <div className="mt-3">
//             <Button variant="primary" onClick={() => navigate("/")} className="me-2">
//               Go to Homepage
//             </Button>
//             <Button variant="outline-secondary" onClick={() => fetchOrderDetails()}>
//               Retry
//             </Button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   const isOrderCancelled = order?.status === "Cancelled" || order?.orderStatus === "Cancelled" || cancelledOrder;
//   const currentOrder = cancelledOrder || order;

//   return (
//     <div className="container py-4">
//       {/* Back Button */}
//       <div className="mb-3">
//         <button
//           className="btn btn-link text-decoration-none"
//           onClick={() => (window.history.length > 1 ? navigate(-1) : navigate("/"))}
//         >
//           <i className="bi bi-arrow-left me-1"></i> Back
//         </button>
//       </div>

//       {/* Order Status Banner */}
//       <div className="mb-4">
//         <div
//           className={`alert ${isOrderCancelled ? "alert-danger" : "alert-success"
//             } d-flex align-items-center bg-black text-white`}
//         >
//           <div className="flex-grow-1">
//             <div className="d-flex align-items-center justify-content-between page-title-main-name">
//               <div>
//                 <StatusBadge status={currentOrder?.status || currentOrder?.orderStatus} />
//                 <h5 className="mb-1 mt-5">
//                   <i
//                     className={`bi ${isOrderCancelled ? "bi-x-circle" : "bi-check-circle"
//                       } me-2`}
//                   ></i>
//                   Order {isOrderCancelled ? "Cancelled" : "Confirmed"}!
//                 </h5>
//                 <p className="mb-0 small">
//                   <strong>Order ID:</strong>{" "}
//                   {currentOrder?.displayOrderId || currentOrder?.orderId} |
//                   <strong className="ms-2">Date:</strong>{" "}
//                   {new Date(currentOrder?.orderDate).toLocaleDateString("en-IN", {
//                     day: "numeric",
//                     month: "long",
//                     year: "numeric",
//                   })}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Action Buttons */}
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <div>
//           {!isOrderCancelled &&
//             currentOrder?.status !== "Delivered" &&
//             currentOrder?.status !== "Shipped" && (
//               <button
//                 className="btn btn-outline-danger btn-sm me-2"
//                 onClick={() => setShowCancelPopup(true)}
//               >
//                 <i className="bi bi-x-circle me-1"></i> Cancel Order
//               </button>
//             )}
//           {currentOrder?.shipping?.trackingAvailable && (
//             <button className="btn btn-outline-primary btn-sm">
//               <i className="bi bi-truck me-1"></i> Track Order
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Order Items */}
//       <div className="card shadow-sm mb-4">
//         <div className="card-header fw-bold d-flex justify-content-between align-items-center page-title-main-name">
//           <span>Order Items ({currentOrder?.products?.length || 0})</span>
//           {isOrderCancelled && (
//             <Badge bg="danger" className="mt-1" style={{ marginLeft: "120px" }}>
//               Cancelled
//             </Badge>
//           )}
//         </div>
//         <div className="card-body">
//           {currentOrder?.products?.length > 0 ? (
//             currentOrder.products.map((item, i) => (
//               <div
//                 key={i}
//                 className="d-flex align-items-center flex-md-row align-items-start gap-lg-5 gap-2 mb-3 pb-3 mt-lg-4 mt-3"
//               >
//                 <div className="position-relative">
//                   <img
//                     src={item.image || "/placeholder.png"}
//                     alt={item.name}
//                     className="img-fluid "
//                     style={{ width: "100%", height: "170px", objectFit: "cover" }}
//                   />
//                   {item.variant?.discountPercent && (
//                     <span
//                       className="position-absolute top-0 start-0 badge bg-danger mt-1 ms-2"
//                       style={{ fontSize: "14px" }}
//                     >
//                       -{item.variant.discountPercent}%
//                     </span>
//                   )}
//                 </div>
//                 <div className="flex-grow-1 page-title-main-name">
//                   <h6 className="fw-bold mb-1">
//                     {item.name}
//                   </h6>
//                   {item.variant && (
//                     <div className="text-muted small mt-1">
//                       {item.variant.shadeName && (
//                         <div className="d-lg-flex d-block align-items-center ">
//                           <span>Shade: {item.variant.shadeName}</span>
//                           {item.variant.hex && (
//                             <span
//                               className="ms-2 d-inline-block rounded-circle"
//                               style={{
//                                 width: "12px",
//                                 height: "12px",
//                                 backgroundColor: item.variant.hex,
//                                 border: "1px solid #dee2e6",
//                               }}
//                             ></span>
//                           )}
//                         </div>
//                       )}
//                       {item.variant.sku && <div>SKU: {item.variant.sku}</div>}
//                     </div>
//                   )}
//                   <div className="mt-2">
//                     <div className="d-flex align-items-center">
//                       <span className="text-muted me-2">Quantity:</span>
//                       <span className="fw-bold">{item.quantity}</span>
//                     </div>
//                     <div className="d-flex align-items-center mt-1">
//                       <span className="text-muted me-2">Price:</span>
//                       {item.variant?.originalPrice && (
//                         <span className="text-decoration-line-through text-muted me-2">
//                           ₹{item.variant.originalPrice.toFixed(2)}
//                         </span>
//                       )}
//                       <span className="fw-bold text-primary">
//                         ₹{(item.price || item.variant?.discountedPrice || 0).toFixed(2)}
//                       </span>
//                     </div>
//                     <div className="mt-2">
//                       <strong>Total: </strong>
//                       ₹{((item.quantity || 1) * (item.price || item.variant?.discountedPrice || 0)).toFixed(2)}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div className="text-center py-4 page-title-main-name">
//               <i className="bi bi-cart-x text-muted" style={{ fontSize: "48px" }}></i>
//               <p className="text-muted mt-3">No items found in this order.</p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Next Steps */}
//       {currentOrder?.nextSteps && currentOrder.nextSteps.length > 0 && !isOrderCancelled && (
//         <NextSteps steps={currentOrder.nextSteps} />
//       )}

//       {/* Payment Details */}
//       <div className="card shadow-sm mb-4 page-title-main-name">
//         <div className="card-header fw-bold">Payment Details</div>
//         <div className="card-body ps-3">
//           <div className="d-flex justify-content-between mb-2 ps-lg-3 ps-3 pe-3 pt-lg-3 pt-3">
//             <span>Subtotal:</span>
//             <span>₹{(currentOrder?.amount?.subtotal || 0).toFixed(2)}</span>
//           </div>
//           {(currentOrder?.amount?.discount || 0) > 0 && (
//             <div className="d-flex justify-content-between mb-2 text-success ps-lg-3 ps-3 pe-3">
//               <span>Discount:</span>
//               <span>-₹{(currentOrder?.amount?.discount || 0).toFixed(2)}</span>
//             </div>
//           )}
//           {(currentOrder?.amount?.gst || 0) > 0 && (
//             <div className="d-flex justify-content-between mb-2 ps-lg-3 ps-3 pe-3">
//               <span>GST:</span>
//               <span>₹{(currentOrder?.amount?.gst || 0).toFixed(2)}</span>
//             </div>
//           )}
//           <div className="d-flex justify-content-between mb-2 ps-lg-3 ps-3 pe-3">
//             <span>Shipping:</span>
//             <span>
//               {(currentOrder?.amount?.shipping || 0) === 0
//                 ? "Free"
//                 : `₹${(currentOrder?.amount?.shipping || 0).toFixed(2)}`}
//             </span>
//           </div>
//           <hr />
//           <div className="d-flex justify-content-between fw-bold fs-5 ps-lg-3 ps-3 pe-3">
//             <span className="mt-3">Total Payable :</span>
//             <span className="text-black mt-3">₹{(currentOrder?.amount?.grandTotal || 0).toFixed(2)}</span>
//           </div>
//           <div className="mt-3 ps-lg-3 ps-3 pe-3">
//             <div className="d-flex justify-content-between">
//               <span className="text-muted">Payment Method:</span>
//               <span className="fw-bold">{currentOrder?.payment?.method}</span>
//             </div>
//             <div className="d-flex justify-content-between mt-1">
//               <span className="text-muted">Payment Status:</span>
//               <div
//                 bg={currentOrder?.payment?.status === "pending" ? "warning" : "success"}
//               >
//                 {currentOrder?.payment?.status?.toUpperCase()}
//               </div>
//             </div>
//             {currentOrder?.payment?.transactionId && (
//               <div className="d-flex justify-content-between mt-1">
//                 <span className="text-muted">Transaction ID:</span>
//                 <span className="text-muted small">{currentOrder.payment.transactionId}</span>
//               </div>
//             )}
//           </div>
//           {currentOrder?.payment?.note && (
//             <div className="alert text-white mt-3 mb-0 small page-title-main-name bg-black">
//               <i className="bi bi-info-circle me-1"></i>
//               {currentOrder.payment.note}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Delivery Address */}
//       <div className="card shadow-sm mb-4 page-title-main-name">
//         <div className="card-header fw-bold">Delivery Address</div>
//         <div className="card-body">
//           <p className="mb-1 ps-3 mt-lg-3 mt-3 fw-bold">{currentOrder?.shipping?.address?.name}</p>
//           <p className="mb-1 ps-3">{currentOrder?.shipping?.address?.addressLine1}</p>
//           <p className="mb-1 ps-3">
//             {currentOrder?.shipping?.address?.city},{" "}
//             {currentOrder?.shipping?.address?.state} -{" "}
//             {currentOrder?.shipping?.address?.pincode}
//           </p>
//           <p className="mb-1 ps-3">
//             <i className="bi bi-telephone me-1"></i>
//             {currentOrder?.shipping?.address?.phone}
//           </p>
//           {currentOrder?.shipping?.address?.email && (
//             <p className="mb-0 ps-3">
//               <i className="bi bi-envelope me-1"></i>
//               {currentOrder.shipping.address.email}
//             </p>
//           )}
//           {currentOrder?.shipping?.expectedDelivery && (
//             <div className="mt-3 ps-3 pb-3">
//               <p className="mb-1">
//                 <i className="bi bi-calendar-check me-1"></i>
//                 <strong>Expected Delivery:</strong>{" "}
//                 {new Date(currentOrder.shipping.expectedDelivery).toLocaleDateString(
//                   "en-IN",
//                   {
//                     weekday: "long",
//                     day: "numeric",
//                     month: "long",
//                     year: "numeric",
//                   }
//                 )}
//               </p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Cancellation Details */}
//       {isOrderCancelled && currentOrder?.cancellation && (
//         <div className="card shadow-sm mb-4 border-danger page-title-main-name">
//           <div className="card-header fw-bold text-danger bg-danger bg-opacity-10">
//             <i className="bi bi-x-circle me-2"></i>
//             Cancellation Details
//           </div>
//           <div className="card-body ms-3">
//             <p className="mt-3">
//               <strong className="page-title-main-name">Reason:</strong>{" "}
//               {currentOrder.cancellation.reason}
//             </p>
//             <p>
//               <strong className="page-title-main-name">Cancelled By:</strong>{" "}
//               {currentOrder.cancellation.cancelledBy}
//             </p>
//             <p>
//               <strong className="page-title-main-name">Date:</strong>{" "}
//               {new Date(currentOrder.cancellation.requestedAt).toLocaleDateString(
//                 "en-IN",
//                 {
//                   day: "numeric",
//                   month: "long",
//                   year: "numeric",
//                   hour: "2-digit",
//                   minute: "2-digit",
//                 }
//               )}
//             </p>
//           </div>
//         </div>
//       )}

//       {/* Support Information */}
//       {currentOrder?.support && (
//         <div className="card shadow-sm mb-4 border-black page-title-main-name">
//           <div className="card-header fw-bold bg-info text-white bg-black">
//             <i className="bi bi-headset me-2"></i>
//             Need Help?
//           </div>
//           <div className="card-body">
//             <div className="row ps-3 pt-lg-3 pt-3">
//               {currentOrder.support.email && (
//                 <div className="col-md-6 mb-2 pt-lg-2 pt-2">
//                   <i className="bi bi-envelope text-black me-2"></i>
//                   <strong>Email:</strong> {currentOrder.support.email}
//                 </div>
//               )}
//               {currentOrder.support.phone && (
//                 <div className="col-md-6 mb-2 pt-lg-2 pt-2">
//                   <i className="bi bi-telephone text-black me-2"></i>
//                   <strong>Phone:</strong> {currentOrder.support.phone}
//                 </div>
//               )}
//               {currentOrder.support.hours && (
//                 <div className="col-12 pt-lg-2 pt-2 pb-4">
//                   <i className="bi bi-clock text-black me-2"></i>
//                   <strong>Hours:</strong> {currentOrder.support.hours}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Continue Shopping */}
//       {currentOrder?.uiConfig?.showContinueShopping && (
//         <div className="text-center mb-4">
//           <Button
//             variant="primary"
//             size="lg"
//             onClick={() => navigate("/products")}
//             className="px-5 page-title-main-name"
//           >
//             <i className="bi bi-bag me-2"></i>
//             Continue Shopping
//           </Button>
//         </div>
//       )}

//       {/* Modals */}
//       <CancelOrderPopup
//         show={showCancelPopup}
//         handleClose={() => setShowCancelPopup(false)}
//         orderId={currentOrder?.orderId}
//         order={currentOrder}
//       />
//       <CancelSuccessPopup
//         show={showSuccessPopup}
//         handleClose={() => {
//           setShowSuccessPopup(false);
//           if (currentOrder?.orderId || currentOrder?._id) {
//             fetchOrderDetails(currentOrder.orderId || currentOrder._id);
//           }
//         }}
//         order={currentOrder}
//         onConfirm={() => {
//           if (currentOrder?.orderId || currentOrder?._id) {
//             fetchOrderDetails(currentOrder.orderId || currentOrder._id);
//           }
//         }}
//       />
//     </div>
//   );
// };

// export default OrderSuccess;





// ======================================================================(Done-Code)Start====================================================


















