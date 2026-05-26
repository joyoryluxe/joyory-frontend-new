// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// const ORDERS_API = "https://beauty.joyory.com/api/user/cart/orders";

// const formatDate = (dateStr) => {
//   if (!dateStr) return "N/A";
//   const d = new Date(dateStr);
//   return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;
// };

// const Myorders = () => {
//   const navigate = useNavigate();
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) return navigate("/login");
//     fetchOrders(token);
//   }, [navigate]);

//   const fetchOrders = async (token) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await fetch(ORDERS_API, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) throw new Error(`Failed to fetch orders (${res.status})`);
//       const data = await res.json();
//       setOrders(data.orders || []);
//     } catch (err) {
//       console.error(err);
//       setError(err.message || "Something went wrong while fetching orders");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) return <p className="text-center mt-6">⏳ Loading your orders...</p>;
//   if (error) return <p className="text-center text-red-500 mt-6">{error}</p>;
//   if (orders.length === 0) return <p className="text-center mt-6">You have no orders yet.</p>;

//   return (
//     <div className="container mx-auto p-6">
//       <h2 className="text-2xl font-bold mb-6">🛒 My Orders</h2>

//       {orders.map((order) => (
//         <div key={order.orderId} className="border rounded-lg p-4 mb-6 shadow hover:shadow-lg transition">
//           <div className="flex justify-between mb-2">
//             <p className="font-semibold">Order #: {order.orderNumber}</p>
//             <p className="text-gray-600">{formatDate(order.date)}</p>
//           </div>

//           <div className="flex flex-wrap gap-2 mb-2">
//             <span className={`px-2 py-1 rounded text-white ${order.status === "Pending" ? "bg-orange-500" : "bg-green-500"}`}>
//               {order.status}
//             </span>
//             <span className="px-2 py-1 rounded bg-blue-500 text-white">{order.shipmentStatus}</span>
//           </div>

//           <p className="mb-2">💰 Total: ₹{order.amount} | Discount: ₹{order.discountAmount}</p>
//           <p className="mb-2">📦 Payment: {order.payment.method} ({order.payment.status})</p>
//           <p className="mb-2">🚚 Expected Delivery: {formatDate(order.expectedDelivery)}</p>

//           <div>
//             <h4 className="font-semibold mb-2">Products:</h4>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {order.products.map((prod) => (
//                 <div key={prod.productId} className="flex border p-2 rounded gap-4 items-center">
//                   <img src={prod.image} alt={prod.name} className="w-20 h-20 object-cover rounded" />
//                   <div>
//                     <p className="font-semibold">{prod.name}</p>
//                     <p>Variant: {prod.variant}</p>
//                     <p>Quantity: {prod.quantity}</p>
//                     <p>Price: ₹{prod.price}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Myorders;















// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../css/Myorders.css"; // Import custom CSS

// const ORDERS_API = "https://beauty.joyory.com/api/user/cart/orders";

// const formatDate = (dateStr) => {
//   if (!dateStr) return "N/A";
//   const d = new Date(dateStr);
//   return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;
// };

// const Myorders = () => {
//   const navigate = useNavigate();
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) return navigate("/login");
//     fetchOrders(token);
//   }, [navigate]);

//   const fetchOrders = async (token) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await fetch(ORDERS_API, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) throw new Error(`Failed to fetch orders (${res.status})`);
//       const data = await res.json();
//       setOrders(data.orders || []);
//     } catch (err) {
//       console.error(err);
//       setError(err.message || "Something went wrong while fetching orders");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading)
//     return <p className="text-center mt-6 text-gray-600">⏳ Loading your orders...</p>;
//   if (error)
//     return <p className="text-center text-red-500 mt-6">{error}</p>;
//   if (orders.length === 0)
//     return (
//       <p className="text-center mt-6 text-gray-600">
//         You have no orders yet. 🛍️
//       </p>
//     );

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h2 className="text-3xl font-bold mb-8 text-gray-800">My Orders</h2>

//       <div className="space-y-6">
//         {orders.map((order) => (
//           <div
//             key={order.orderId}
//             className="border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition bg-white"
//           >
//             {/* Order Header */}
//             <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-6 py-4 border-b border-gray-100">
//               <div>
//                 <p className="text-sm text-gray-500">Order Number</p>
//                 <p className="font-semibold text-lg">{order.orderNumber}</p>
//               </div>
//               <div className="mt-2 md:mt-0 text-sm text-gray-500">
//                 Placed on {formatDate(order.date)}
//               </div>
//             </div>

//             {/* Order Info */}
//             <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div>
//                 <p className="text-sm text-gray-500 mb-1">Status</p>
//                 <span
//                   className={`px-3 py-1 rounded-full text-xs font-medium ${
//                     order.status === "Pending"
//                       ? "bg-yellow-100 text-yellow-700"
//                       : order.status === "Delivered"
//                       ? "bg-green-100 text-green-700"
//                       : "bg-blue-100 text-blue-700"
//                   }`}
//                 >
//                   {order.status}
//                 </span>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500 mb-1">Payment</p>
//                 <span className="text-sm font-medium">
//                   {order.payment.method} ({order.payment.status})
//                 </span>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500 mb-1">Expected Delivery</p>
//                 <span className="text-sm font-medium">
//                   {formatDate(order.expectedDelivery)}
//                 </span>
//               </div>
//             </div>

//             {/* Products */}
//             <div className="px-6 pb-4">
//               <h4 className="font-semibold mb-3 text-gray-700">Products</h4>
//               <div className="space-y-3">
//                 {order.products.map((prod) => (
//                   <div
//                     key={prod.productId}
//                     className="flex items-center gap-4 border rounded-lg p-3 bg-gray-50"
//                   >
//                     <img
//                       src={prod.image}
//                       alt={prod.name}
//                       className="w-20 h-20 object-cover rounded-lg border"
//                     />
//                     <div className="flex-1">
//                       <p className="font-medium text-gray-800">{prod.name}</p>
//                       <p className="text-sm text-gray-500">Variant: {prod.variant}</p>
//                       <p className="text-sm text-gray-500">
//                         Quantity: {prod.quantity}
//                       </p>
//                       <p className="text-sm font-semibold text-gray-700">
//                         ₹{prod.price}
//                       </p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Order Footer */}
//             <div className="px-6 py-4 border-t border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
//               <p className="font-medium text-gray-700">
//                 Total: ₹{order.amount}{" "}
//                 <span className="text-sm text-gray-500">
//                   (Discount: ₹{order.discountAmount})
//                 </span>
//               </p>
//               <div className="flex gap-3">
//                 <button
//                   onClick={() => navigate(`/orders/${order.orderId}`)}
//                   className="px-4 py-2 text-sm font-medium border rounded-lg hover:bg-gray-100"
//                 >
//                   View Details
//                 </button>
//                 <button
//                   onClick={() => navigate(`/track/${order.orderId}`)}
//                   className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//                 >
//                   Track Order
//                 </button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Myorders;









// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../css/Myorders.css"; // Import custom CSS
// import Header from "./Header";
// import Footer from "./Footer";

// const ORDERS_API = "https://beauty.joyory.com/api/user/cart/orders";

// const formatDate = (dateStr) => {
//   if (!dateStr) return "N/A";
//   const d = new Date(dateStr);
//   return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;
// };

// const Myorders = () => {
//   const navigate = useNavigate();
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) return navigate("/login");
//     fetchOrders(token);
//   }, [navigate]);

//   const fetchOrders = async (token) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await fetch(ORDERS_API, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) throw new Error(`Failed to fetch orders (${res.status})`);
//       const data = await res.json();
//       setOrders(data.orders || []);
//     } catch (err) {
//       console.error(err);
//       setError(err.message || "Something went wrong while fetching orders");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) return <p className="loading-text">⏳ Loading your orders...</p>;
//   if (error) return <p className="error-text">{error}</p>;
//   if (orders.length === 0) return <p className="empty-text">You have no orders yet.</p>;

//   return (


//     <>

//     <Header />




//     <div className="orders-container">
//       <h2 className="orders-title">🛒 My Orders</h2>

//       {orders.map((order) => (
//         <div key={order.orderId} className="order-card">
//           <div className="order-header">
//             <p className="order-id">Order #: <span>{order.orderNumber}</span></p>
//             <p className="order-date">{formatDate(order.date)}</p>
//           </div>

//           <div className="order-status">
//             <span className={`status-pill ${order.status.toLowerCase()}`}>
//               {order.status}
//             </span>
//             <span className="status-pill shipped">{order.shipmentStatus}</span>
//           </div>

//           <div className="order-info">
//             <p>💰 <span>Total:</span> ₹{order.amount}</p>
//             <p>🎁 <span>Discount:</span> ₹{order.discountAmount}</p>
//             <p>📦 <span>Payment:</span> {order.payment.method} ({order.payment.status})</p>
//             <p>🚚 <span>Expected Delivery:</span> {formatDate(order.expectedDelivery)}</p>
//           </div>

//           <div className="order-products">
//             <h4>Products</h4>
//             <div className="products-grid">
//               {order.products.map((prod) => (
//                 <div key={prod.productId} className="product-card">
//                   <img src={prod.image} alt={prod.name} className="product-img" />
//                   <div>
//                     <p className="product-name">{prod.name}</p>
//                     <p>Variant: {prod.variant}</p>
//                     <p>Quantity: {prod.quantity}</p>
//                     <p className="product-price">₹{prod.price}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>


//     <Footer />

//      </>
//   );
// };

// export default Myorders;












// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../css/Myorders.css"; // Make sure to update CSS accordingly
// import Header from "./Header";
// import Footer from "./Footer";
// import Sidebarcomon from "./Sidebarcomon";

// import write from "../assets/write.png"

// const ORDERS_API = "https://beauty.joyory.com/api/user/cart/orders";

// const formatDate = (dateStr) => {
//   if (!dateStr) return "N/A";
//   const d = new Date(dateStr);
//   return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;
// };

// const Myorders = () => {
//   const navigate = useNavigate();
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) return navigate("/login");
//     fetchOrders(token);
//   }, [navigate]);

//   const fetchOrders = async (token) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await fetch(ORDERS_API, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) throw new Error(`Failed to fetch orders (${res.status})`);
//       const data = await res.json();
//       setOrders(data.orders || []);
//     } catch (err) {
//       console.error(err);
//       setError(err.message || "Something went wrong while fetching orders");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) return <p className="loading-text">⏳ Loading your orders...</p>;
//   if (error) return <p className="error-text">{error}</p>;
//   if (orders.length === 0) return <p className="empty-text">You have no orders yet.</p>;

//   return (
//     <>
//       <Header />

//       {/* <div className="orders-container d-flex"> */}

//  <h2 className="orders-title text-center mt-4">🛒 My Orders</h2>

//         <div className="orders-container">
//         {orders.map((order) => (
//           <div key={order.orderId} className="order-card">
//             {/* Header */}
//             <div className="order-header">
//               <p className="order-id">
//                 Order Id : <span>{order.orderNumber}</span>
//               </p>
//               <p className="order-date">On {formatDate(order.date)}</p>
//               <span className={`order-confirmed ${order.status === "Confirmed" ? "confirmed" : ""}`}>
//                <img src={write} alt="Wallet" className="img-fluid w-25" /> {order.status}
//               </span>
//             </div>

//             {/* Products */}
//             <div className="order-products">
//               {order.products.map((prod) => (
//                 <div key={prod.productId} className="product-card">
//                   <img src={prod.image} alt={prod.name} className="product-img" />
//                   <div className="product-details">
//                     <p className="product-name">{prod.name}</p>
//                     <p>{prod.variant}</p>
//                     <p>Quantity: {prod.quantity}</p>
//                     <p className="product-price">MRP: ₹{prod.price}</p>
//                   </div>
//                   <span className="product-arrow">➡️</span>
//                 </div>
//               ))}
//             </div>

//             {/* Delivery Info */}
//             <div className="order-delivery">
//               <span className="delivery-icon">🚚</span>
//               <p>Arriving by {formatDate(order.expectedDelivery)}</p>
//             </div>
//           </div>
//         ))}
//       </div>
//       {/* </div> */}

//       <Footer />
//     </>
//   );
// };

// export default Myorders;


















// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../css/Myorders.css";
// import Header from "./Header";
// import Footer from "./Footer";
// import rightside from "../assets/rightside.png";

// import {
//   FaCheckCircle, // Confirmed
//   FaBox,         // Shipped
//   FaTruck,       // Delivered
//   FaTimesCircle, // Cancelled
//   FaClock        // Pending
// } from "react-icons/fa";

// const ORDERS_API = "https://beauty.joyory.com/api/user/cart/orders";

// const formatDate = (dateStr) => {
//   if (!dateStr) return "N/A";
//   const d = new Date(dateStr);
//   return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;
// };

// const Myorders = () => {
//   const navigate = useNavigate();
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) return navigate("/login");
//     fetchOrders(token);
//   }, [navigate]);

//   const fetchOrders = async (token) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await fetch(ORDERS_API, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) throw new Error(`Failed to fetch orders (${res.status})`);
//       const data = await res.json();
//       setOrders(data.orders || []);
//     } catch (err) {
//       console.error(err);
//       setError(err.message || "Something went wrong while fetching orders");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getStatusIcon = (status) => {
//     switch (status?.toLowerCase()) {
//       case "confirmed":
//         return <FaCheckCircle className="status-icon confirmed" />;
//       case "shipped":
//         return <FaBox className="status-icon shipped" />;
//       case "delivered":
//         return <FaTruck className="status-icon delivered" />;
//       case "cancelled":
//         return <FaTimesCircle className="status-icon cancelled" />;
//       default:
//         return <FaClock className="status-icon pending" />;
//     }
//   };

//   if (loading) return <p className="loading-text">⏳ Loading your orders...</p>;
//   if (error) return <p className="error-text">{error}</p>;
//   if (orders.length === 0) return <p className="empty-text">You have no orders yet.</p>;

//   return (
//     <>
//       <Header />

//       <h2 className="orders-title text-center mt-4">🛒 My Orders</h2>

//       <div className="orders-container">
//         {orders.map((order) => (
//           <div key={order.orderId} className="order-card">
//             {/* Header */}
//             <div className="order-header">
//               <p className="order-id">
//                 Order Id : <br></br><span>{order.orderNumber}</span>
//               </p>

//               <div className="">
//               <span className={`order-status-pill ${order.status.toLowerCase()}`}>
//                 {getStatusIcon(order.status)}
//                 {order.status}
//               </span>
//               <p className="order-date text-justify">On {formatDate(order.date)}</p>
//               </div>
//             </div>

//               <div className="order-products-border"></div>

//             {/* Products */}
//             <div className="order-products">
//               {order.products.map((prod) => (
//                 <div key={prod.productId} className="product-card product-cards">
//                   <img src={prod.image} alt={prod.name} className="product-imgs" />
//                   <div className="product-details">
//                     <p className="product-names">{prod.name}</p>
//                     <div className="d-flex gap-2">
//                     <p className="mll">{prod.variant}</p>
//                     <p className="mll">Quantity: {prod.quantity}</p>
//                     </div>
//                     <p className="product-price">MRP: ₹{prod.price}</p>
//                   </div>
//                   <span className="product-arrow"><img src={rightside} alt="Right Arrow" className="arrow-icon Right-Arrows" /></span>
//                 </div>
//               ))}
//             </div>

//             {/* Delivery Info */}
//             <div className="order-delivery order-delivery">
//               <span className="delivery-icon">🚚</span>
//               <p>Arriving by {formatDate(order.expectedDelivery)}</p>
//             </div>
//           </div>
//         ))}
//       </div>

//       <Footer />
//     </>
//   );
// };

// export default Myorders;












// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../css/Myorders.css";
// import Header from "./Header";
// import Footer from "./Footer";
// import rightside from "../assets/rightside.png";

// import {
//   FaCheckCircle, // Confirmed
//   FaBox,         // Shipped
//   FaTruck,       // Delivered
//   FaTimesCircle, // Cancelled
//   FaClock        // Pending
// } from "react-icons/fa";

// const ORDERS_API = "https://beauty.joyory.com/api/user/cart/orders";

// const formatDate = (dateStr) => {
//   if (!dateStr) return "N/A";
//   const d = new Date(dateStr);
//   return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;
// };

// const Myorders = () => {
//   const navigate = useNavigate();
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [showPopup, setShowPopup] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState(null);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) return navigate("/login");
//     fetchOrders(token);
//   }, [navigate]);

//   const fetchOrders = async (token) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await fetch(ORDERS_API, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) throw new Error(`Failed to fetch orders (${res.status})`);
//       const data = await res.json();
//       setOrders(data.orders || []);
//     } catch (err) {
//       console.error(err);
//       setError(err.message || "Something went wrong while fetching orders");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getStatusIcon = (status) => {
//     switch (status?.toLowerCase()) {
//       case "confirmed":
//         return <FaCheckCircle className="status-icon confirmed" />;
//       case "shipped":
//         return <FaBox className="status-icon shipped" />;
//       case "delivered":
//         return <FaTruck className="status-icon delivered" />;
//       case "cancelled":
//         return <FaTimesCircle className="status-icon cancelled" />;
//       default:
//         return <FaClock className="status-icon pending" />;
//     }
//   };

//   const openPopup = (prod) => {
//     setSelectedProduct(prod);
//     setShowPopup(true);
//   };

//   const closePopup = () => {
//     setSelectedProduct(null);
//     setShowPopup(false);
//   };

//   if (loading) return <p className="loading-text">⏳ Loading your orders...</p>;
//   if (error) return <p className="error-text">{error}</p>;
//   if (orders.length === 0) return <p className="empty-text">You have no orders yet.</p>;

//   return (
//     <>
//       <Header />

//       <h2 className="orders-title text-center mt-4">🛒 My Orders</h2>

//       <div className="orders-container">
//         {orders.map((order) => (
//           <div key={order.orderId} className="order-card">
//             {/* Header */}
//             <div className="order-header">
//               <p className="order-id">
//                 Order Id : <br /><span>{order.orderNumber}</span>
//               </p>

//               <div>
//                 <span className={`order-status-pill ${order.status.toLowerCase()}`}>
//                   {getStatusIcon(order.status)}
//                   {order.status}
//                 </span>
//                 <p className="order-date text-justify">
//                   On {formatDate(order.date)}
//                 </p>
//               </div>
//             </div>

//             <div className="order-products-border"></div>

//             {/* Products */}
//             <div className="order-products">
//               {order.products.map((prod) => (
//                 <div key={prod.productId} className="product-card product-cards">
//                   <img src={prod.image} alt={prod.name} className="product-imgs" />

//                   <div className="flex-for-small-screen ">

//                     <div className="product-details">
//                       <p className="product-names">{prod.name}</p>
//                       <div className="d-sm-flex gap-2">
//                         <p className="mll">{prod.variant}</p>
//                         <p className="mll">Quantity: {prod.quantity}</p>
//                       </div>
//                       <p className="product-price">MRP: ₹{prod.price}</p>
//                     </div>
//                     <span
//                       className="product-arrow"
//                       onClick={() => openPopup(prod)}
//                       role="button"
//                     >
//                       <img
//                         src={rightside}
//                         alt="Right Arrow"
//                         className="arrow-icon Right-Arrows"
//                       />
//                     </span>

//                   </div>


//                 </div>
//               ))}
//             </div>

//             {/* Delivery Info */}
//             <div className="order-delivery">
//               <span className="delivery-icon">🚚</span>
//               <p>Arriving by {formatDate(order.expectedDelivery)}</p>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* ✅ Popup */}
//       {showPopup && selectedProduct && (
//         <div className="popup-overlay" onClick={closePopup}>
//           <div className="popup-content" onClick={(e) => e.stopPropagation()}>
//             <button className="close-btn" onClick={closePopup}>✖</button>
//             <img
//               src={selectedProduct.image}
//               alt={selectedProduct.name}
//               className="popup-product-img"
//             />
//             <h3>{selectedProduct.name}</h3>
//             <p>Variant: {selectedProduct.variant}</p>
//             <p>Quantity: {selectedProduct.quantity}</p>
//             <p>Price: ₹{selectedProduct.price}</p>
//           </div>
//         </div>
//       )}

//       <Footer />
//     </>
//   );
// };

// export default Myorders;

































// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../css/Myorders.css";
// import Header from "./Header";
// import Footer from "./Footer";
// import rightside from "../assets/rightside.png";

// import {
//   FaCheckCircle, // Confirmed
//   FaBox,         // Shipped
//   FaTruck,       // Delivered
//   FaTimesCircle, // Cancelled
//   FaClock        // Pending
// } from "react-icons/fa";

// import axios from "axios";

// const ORDERS_API = "https://beauty.joyory.com/api/user/cart/orders";

// const formatDate = (dateStr) => {
//   if (!dateStr) return "N/A";
//   const d = new Date(dateStr);
//   return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;
// };

// const Myorders = () => {
//   const navigate = useNavigate();
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [showPopup, setShowPopup] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState(null);

//   useEffect(() => {
//     fetchOrders();
//   }, [navigate]);

//   // ✅ Fetch orders using HTTP-only cookie
//   const fetchOrders = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await axios.get(ORDERS_API, { withCredentials: true });
//       if (res.data?.orders) {
//         setOrders(res.data.orders);
//       } else {
//         setOrders([]);
//       }
//     } catch (err) {
//       console.error(err);
//       if (err.response && err.response.status === 401) {
//         navigate("/login");
//       } else {
//         setError(err.message || "Something went wrong while fetching orders");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getStatusIcon = (status) => {
//     switch (status?.toLowerCase()) {
//       case "confirmed":
//         return <FaCheckCircle className="status-icon confirmed" />;
//       case "shipped":
//         return <FaBox className="status-icon shipped" />;
//       case "delivered":
//         return <FaTruck className="status-icon delivered" />;
//       case "cancelled":
//         return <FaTimesCircle className="status-icon cancelled" />;
//       default:
//         return <FaClock className="status-icon pending" />;
//     }
//   };

//   const openPopup = (prod) => {
//     setSelectedProduct(prod);
//     setShowPopup(true);
//   };

//   const closePopup = () => {
//     setSelectedProduct(null);
//     setShowPopup(false);
//   };

//   if (loading) return <p className="loading-text">⏳ Loading your orders...</p>;
//   if (error) return <p className="error-text">{error}</p>;
//   if (orders.length === 0) return <p className="empty-text">You have no orders yet.</p>;

//   return (
//     <>
//       <Header />

//       <h2 className="orders-title text-center mt-4">🛒 My Orders</h2>

//       <div className="orders-container">
//         {orders.map((order) => (
//           <div key={order.orderId} className="order-card">
//             {/* Header */}
//             <div className="order-header">
//               <p className="order-id">
//                 Order Id : <br /><span>{order.orderNumber}</span>
//               </p>

//               <div>
//                 <span className={`order-status-pill ${order.status.toLowerCase()}`}>
//                   {getStatusIcon(order.status)}
//                   {order.status}
//                 </span>
//                 <p className="order-date text-justify">
//                   On {formatDate(order.date)}
//                 </p>
//               </div>
//             </div>

//             <div className="order-products-border"></div>

//             {/* Products */}
//             <div className="order-products">
//               {order.products.map((prod) => (
//                 <div key={prod.productId} className="product-card product-cardss">
//                   <img src={prod.image} alt={prod.name} style={{height:"auto"}} className="product-imgs" />

//                   <div className="flex-for-small-screen ">
//                     <div className="product-details">
//                       <p className="product-names">{prod.name}</p>
//                       <div className="d-sm-flex gap-2">
//                         <p className="mll">{prod.variant}</p>
//                         <p className="mll">Quantity: {prod.quantity}</p>
//                       </div>
//                       <p className="product-price">MRP: ₹{prod.price}</p>
//                     </div>
//                     <span
//                       className="product-arrow"
//                       onClick={() => openPopup(prod)}
//                       role="button"
//                     >
//                       <img
//                         src={rightside}
//                         alt="Right Arrow"
//                         className="arrow-icon Right-Arrows"
//                       />
//                     </span>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Delivery Info */}
//             <div className="order-delivery">
//               <span className="delivery-icon">🚚</span>
//               <p>Arriving by {formatDate(order.expectedDelivery)}</p>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* ✅ Popup */}
//       {showPopup && selectedProduct && (
//         <div className="popup-overlay" onClick={closePopup}>
//           <div className="popup-content" onClick={(e) => e.stopPropagation()}>
//             <button className="close-btn" onClick={closePopup}>✖</button>
//             <img
//               src={selectedProduct.image}
//               alt={selectedProduct.name}
//               className="popup-product-img"
//             />
//             <h3>{selectedProduct.name}</h3>
//             <p>Variant: {selectedProduct.variant}</p>
//             <p>Quantity: {selectedProduct.quantity}</p>
//             <p>Price: ₹{selectedProduct.price}</p>
//           </div>
//         </div>
//       )}

//       <Footer />
//     </>
//   );
// };

// export default Myorders;




























// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../css/Myorders.css";
// import Header from "./Header";
// import Footer from "./Footer";
// import rightside from "../assets/rightside.png";

// import {
//   FaCheckCircle, // Confirmed
//   FaBox,         // Shipped
//   FaTruck,       // Delivered
//   FaTimesCircle, // Cancelled
//   FaClock        // Pending
// } from "react-icons/fa";

// import axios from "axios";

// const ORDERS_API = "https://beauty.joyory.com/api/user/cart/orders";

// const formatDate = (dateStr) => {
//   if (!dateStr) return "N/A";
//   const d = new Date(dateStr);
//   return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;
// };

// const Myorders = () => {
//   const navigate = useNavigate();
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [showPopup, setShowPopup] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState(null);

//   useEffect(() => {
//     fetchOrders();
//   }, [navigate]);

//   // ✅ Fetch orders using HTTP-only cookie
//   const fetchOrders = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await axios.get(ORDERS_API, { withCredentials: true });
//       if (res.data?.orders) {
//         setOrders(res.data.orders);
//       } else {
//         setOrders([]);
//       }
//     } catch (err) {
//       console.error(err);
//       if (err.response && err.response.status === 401) {
//         navigate("/login");
//       } else {
//         setError(err.message || "Something went wrong while fetching orders");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getStatusIcon = (status) => {
//     switch (status?.toLowerCase()) {
//       case "confirmed":
//         return <FaCheckCircle className="status-icon confirmed" />;
//       case "shipped":
//         return <FaBox className="status-icon shipped" />;
//       case "delivered":
//         return <FaTruck className="status-icon delivered" />;
//       case "cancelled":
//         return <FaTimesCircle className="status-icon cancelled" />;
//       default:
//         return <FaClock className="status-icon pending" />;
//     }
//   };

//   const openPopup = (prod) => {
//     setSelectedProduct(prod);
//     setShowPopup(true);
//   };

//   const closePopup = () => {
//     setSelectedProduct(null);
//     setShowPopup(false);
//   };

//   if (loading) return <p className="loading-text">⏳ Loading your orders...</p>;
//   if (error) return <p className="error-text">{error}</p>;
//   if (orders.length === 0) return <p className="empty-text">You have no orders yet.</p>;

//   return (
//     <>
//       <Header />

//       <h2 className="orders-title text-center mt-4">🛒 My Orders</h2>

//       <div className="orders-container">
//         {orders.map((order) => (
//           <div key={order.orderId} className="order-card">
//             {/* Header */}
//             <div className="order-header">
//               <p className="order-id">
//                 Order Id : <br /><span>{order.orderNumber}</span>
//               </p>

//               <div>
//                 <span className={`order-status-pill ${order.status.toLowerCase()}`}>
//                   {getStatusIcon(order.status)}
//                   {order.status}
//                 </span>
//                 <p className="order-date text-justify">
//                   On {formatDate(order.date)}
//                 </p>
//               </div>
//             </div>

//             <div className="order-products-border"></div>

//             {/* Products */}
//             <div className="order-products">
//               {/* {order.products.map((prod) => (
//                 <div key={prod.productId} className="product-card product-cardss">
//                   <img
//                     src={prod.image}
//                     alt={prod.name}
//                     style={{ height: "auto" }}
//                     className="product-imgs"
//                   />

//                   <div className="flex-for-small-screen">
//                     <div className="product-details">
//                       <p className="product-names">{prod.name}</p>
//                       <div className="d-sm-flex gap-2">
//                         <p className="mll">{prod.variant}</p>
//                         <p className="mll">Quantity: {prod.quantity}</p>
//                       </div>
//                       <p className="product-price">MRP: ₹{prod.price}</p>
//                     </div>
//                   </div>
//                 </div>
//               ))} */}


//               {order.products.map((prod) => (
//                 <div key={prod.productId} className="product-card product-cardss">
//                   <img
//                     src={prod.variant?.image || prod.image || "/placeholder.png"}
//                     alt={prod.name}
//                     style={{ height: "auto" }}
//                     className="product-imgs"
//                   />

//                   <div className="flex-for-small-screen">
//                     <div className="product-details">
//                       <p className="product-names">{prod.name}</p>
//                       <div className="d-sm-flex gap-2">
//                         <p className="mll">{prod.variant?.shadeName || "Default Variant"}</p>
//                         <p className="mll">Quantity: {prod.quantity}</p>
//                       </div>
//                       <p className="product-price">MRP: ₹{prod.price}</p>
//                     </div>
//                   </div>
//                 </div>
//               ))}

//               {/* Delivery Info */}
//               {order.shippingAddress ? (
//                 <div className="order-delivery">
//                   <span className="delivery-icon">🚚</span>
//                   <p>
//                     Arriving by {formatDate(order.expectedDelivery)} <br />
//                     {order.shippingAddress.addressLine1}, {order.shippingAddress.city}
//                   </p>
//                 </div>
//               ) : (
//                 <div className="order-delivery text-muted">
//                   No shipping address available
//                 </div>
//               )}

//             </div>

//             {/* Delivery Info */}
//             <div className="order-delivery">
//               <span className="delivery-icon">🚚</span>
//               <p>Arriving by {formatDate(order.expectedDelivery)}</p>
//             </div>

//             {/* ✅ Track Order Button */}
//             {order.status.toLowerCase() !== "cancelled" && (
//               <div className="text-end mt-2 mb-2 me-3">
//                 <button
//                   className="btn btn-primary btn-sm"
//                   onClick={() =>
//                     navigate("/trackorder", { state: { orderId: order._id } })
//                   }
//                   style={{
//                     borderRadius: "8px",
//                     fontWeight: "500",
//                     padding: "6px 14px",
//                     backgroundColor: "#007bff",
//                     border: "none",
//                   }}
//                 >
//                   🚚 Track Order
//                 </button>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>

//       {/* ✅ Popup */}
//       {showPopup && selectedProduct && (
//         <div className="popup-overlay" onClick={closePopup}>
//           <div className="popup-content" onClick={(e) => e.stopPropagation()}>
//             <button className="close-btn" onClick={closePopup}>✖</button>
//             <img
//               src={selectedProduct.image}
//               alt={selectedProduct.name}
//               className="popup-product-img"
//             />
//             <h3>{selectedProduct.name}</h3>
//             <p>Variant: {selectedProduct.variant}</p>
//             <p>Quantity: {selectedProduct.quantity}</p>
//             <p>Price: ₹{selectedProduct.price}</p>
//           </div>
//         </div>
//       )}

//       <Footer />
//     </>
//   );
// };

// export default Myorders;































// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../css/Myorders.css";
// import Header from "./Header";
// import Footer from "./Footer";

// import {
//   FaCheckCircle,
//   FaBox,
//   FaTruck,
//   FaTimesCircle,
//   FaClock
// } from "react-icons/fa";

// import axios from "axios";

// const ORDERS_API = "https://beauty.joyory.com/api/user/cart/orders";

// // Format date as DD-MM-YYYY
// const formatDate = (dateStr) => {
//   if (!dateStr) return "N/A";
//   const d = new Date(dateStr);
//   return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;
// };

// const Myorders = () => {
//   const navigate = useNavigate();
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [showPopup, setShowPopup] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState(null);

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const fetchOrders = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await axios.get(ORDERS_API, { withCredentials: true });
//       if (res.data?.orders) {
//         setOrders(res.data.orders);
//       } else {
//         setOrders([]);
//       }
//     } catch (err) {
//       console.error(err);
//       if (err.response && err.response.status === 401) {
//         navigate("/login");
//       } else {
//         setError(err.message || "Something went wrong while fetching orders");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getStatusIcon = (status) => {
//     switch (status?.toLowerCase()) {
//       case "confirmed":
//         return <FaCheckCircle className="status-icon confirmed" />;
//       case "shipped":
//         return <FaBox className="status-icon shipped" />;
//       case "delivered":
//         return <FaTruck className="status-icon delivered" />;
//       case "cancelled":
//         return <FaTimesCircle className="status-icon cancelled" />;
//       default:
//         return <FaClock className="status-icon pending" />;
//     }
//   };

//   const openPopup = (prod) => {
//     setSelectedProduct(prod);
//     setShowPopup(true);
//   };

//   const closePopup = () => {
//     setSelectedProduct(null);
//     setShowPopup(false);
//   };

//   if (loading) return <p className="loading-text">⏳ Loading your orders...</p>;
//   if (error) return <p className="error-text">{error}</p>;
//   if (orders.length === 0) return <p className="empty-text">You have no orders yet.</p>;

//   return (
//     <>
//       <Header />
//       <h2 className="orders-title text-center mt-4">🛒 My Orders</h2>

//       <div className="orders-container">
//         {orders.map((order) => (
//           <div key={order._id} className="order-card">
//             {/* Header */}
//             <div className="order-header">
//               <p className="order-id">
//                 Order Id : <br /><span>{order.orderNumber}</span>
//               </p>
//               <div>
//                 <span className={`order-status-pill ${order.status.toLowerCase()}`}>
//                   {getStatusIcon(order.status)}
//                   {order.status}
//                 </span>
//                 <p className="order-date text-justify">
//                   On {formatDate(order.date)}
//                 </p>
//               </div>
//             </div>

//             <div className="order-products-border"></div>

//             {/* Products */}
//             <div className="order-products">
//               {order.products.map((prod) => (
//                 <div key={prod.productId} className="product-card product-cardss" onClick={() => openPopup(prod)}>
//                   <img
//                     src={prod.variant?.image || prod.image || "/placeholder.png"}
//                     alt={prod.name}
//                     style={{ height: "auto" }}
//                     className="product-imgs w-25"
//                   />
//                   <div className="flex-for-small-screen">
//                     <div className="product-details">
//                       <p className="product-names">{prod.name}</p>
//                       <div className="d-sm-flex gap-2">
//                         <p className="mll">{prod.variant?.shadeName || "Default Variant"}</p>
//                         <p className="mll">Quantity: {prod.quantity}</p>
//                       </div>
//                       <p className="product-price">MRP: ₹{prod.price}</p>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Delivery Info */}
//             {order.shippingAddress ? (
//               <div className="order-delivery">
//                 <span className="delivery-icon">🚚</span>
//                 <p>
//                   Arriving by {formatDate(order.expectedDelivery)} <br />
//                   {order.shippingAddress.addressLine1}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
//                 </p>
//               </div>
//             ) : (
//               <div className="order-delivery text-muted">
//                 No shipping address available
//               </div>
//             )}

//             {/* Track Order Button */}
//             {order.status.toLowerCase() !== "cancelled" && (
//               <div className="text-end mt-2 mb-2 me-3">
//                 <button
//                   className="btn btn-primary btn-sm"
//                   onClick={() =>
//                     navigate("/trackorder", { state: { orderId: order._id } })
//                   }
//                   style={{
//                     borderRadius: "8px",
//                     fontWeight: "500",
//                     padding: "6px 14px",
//                     backgroundColor: "#007bff",
//                     border: "none",
//                   }}
//                 >
//                   🚚 Track Order
//                 </button>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>

//       {/* Popup */}
//       {showPopup && selectedProduct && (
//         <div className="popup-overlay" onClick={closePopup}>
//           <div className="popup-content" onClick={(e) => e.stopPropagation()}>
//             <button className="close-btn" onClick={closePopup}>✖</button>
//             <img
//               src={selectedProduct.variant?.image || selectedProduct.image || "/placeholder.png"}
//               alt={selectedProduct.name}
//               className="popup-product-img"
//             />
//             <h3>{selectedProduct.name}</h3>
//             <p>Variant: {selectedProduct.variant?.shadeName || "Default Variant"}</p>
//             <p>Quantity: {selectedProduct.quantity}</p>
//             <p>Price: ₹{selectedProduct.price}</p>
//           </div>
//         </div>
//       )}

//       <Footer />
//     </>
//   );
// };

// export default Myorders;








































// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../css/Myorders.css";
// import Header from "./Header";
// import Footer from "./Footer";

// import {
//   FaCheckCircle,
//   FaBox,
//   FaTruck,
//   FaTimesCircle,
//   FaClock
// } from "react-icons/fa";

// import axios from "axios";

// const ORDERS_API = "https://beauty.joyory.com/api/user/cart/orders";

// // Format date as DD-MM-YYYY
// const formatDate = (dateStr) => {
//   if (!dateStr) return "N/A";
//   const d = new Date(dateStr);
//   return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;
// };

// const Myorders = () => {
//   const navigate = useNavigate();
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [showPopup, setShowPopup] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState(null);

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const fetchOrders = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await axios.get(ORDERS_API, { withCredentials: true });
//       if (res.data?.orders) {
//         setOrders(res.data.orders);
//       } else {
//         setOrders([]);
//       }
//     } catch (err) {
//       console.error(err);
//       if (err.response && err.response.status === 401) {
//         navigate("/login");
//       } else {
//         setError(err.message || "Something went wrong while fetching orders");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getStatusIcon = (status) => {
//     switch (status?.toLowerCase()) {
//       case "confirmed":
//         return <FaCheckCircle className="status-icon confirmed" />;
//       case "shipped":
//         return <FaBox className="status-icon shipped" />;
//       case "delivered":
//         return <FaTruck className="status-icon delivered" />;
//       case "cancelled":
//         return <FaTimesCircle className="status-icon cancelled" />;
//       default:
//         return <FaClock className="status-icon pending" />;
//     }
//   };

//   const getShipmentStatusIcon = (status) => {
//     switch (status?.toLowerCase()) {
//       case "shipped":
//         return <FaTruck className="status-icon shipped" />;
//       case "confirmed":
//         return <FaCheckCircle className="status-icon confirmed" />;
//       case "delivered":
//         return <FaCheckCircle className="status-icon delivered" />;
//       case "cancelled":
//         return <FaTimesCircle className="status-icon cancelled" />;
//       default:
//         return <FaClock className="status-icon pending" />;
//     }
//   };

//   const openPopup = (prod) => {
//     setSelectedProduct(prod);
//     setShowPopup(true);
//   };

//   const closePopup = () => {
//     setSelectedProduct(null);
//     setShowPopup(false);
//   };

//   // Helper function to get all products from all shipments
//   const getAllProductsFromOrder = (order) => {
//     const allProducts = [];
//     if (order.shipments && Array.isArray(order.shipments)) {
//       order.shipments.forEach(shipment => {
//         if (shipment.products && Array.isArray(shipment.products)) {
//           shipment.products.forEach(product => {
//             allProducts.push({
//               ...product,
//               shipmentStatus: shipment.status,
//               shipmentLabel: shipment.label,
//               shipmentDate: shipment.date
//             });
//           });
//         }
//       });
//     }
//     return allProducts;
//   };

//   if (loading) return <p className="loading-text">⏳ Loading your orders...</p>;
//   if (error) return <p className="error-text">{error}</p>;
//   if (orders.length === 0) return <p className="empty-text">You have no orders yet.</p>;

//   return (
//     <>
//       <Header />
//       <h2 className="orders-title text-center mt-4">🛒 My Orders</h2>

//       <div className="orders-container">
//         {orders.map((order) => (
//           <div key={order._id} className="order-card">
//             {/* Header */}
//             <div className="order-header">
//               <p className="order-id">
//                 Order Id : <br /><span>{order.orderNumber || order.orderId}</span>
//               </p>
//               <div>
//                 <span className={`order-status-pill ${order.status.toLowerCase()}`}>
//                   {getStatusIcon(order.status)}
//                   {order.status}
//                 </span>
//                 <p className="order-date text-justify">
//                   On {formatDate(order.date)}
//                 </p>
//               </div>
//             </div>

//             <div className="order-products-border"></div>

//             {/* Order Amount */}
//             <div className="order-amount-section">
//               <p className="order-amount">Total Amount: ₹{order.amount}</p>
//             </div>

//             {/* Shipments */}
//             {order.shipments && order.shipments.length > 0 ? (
//               <div className="order-shipments">
//                 <h5 className="shipments-title">Shipments</h5>
//                 {order.shipments.map((shipment) => (
//                   <div key={shipment.shipment_id} className="shipment-card">
//                     <div className="shipment-header">
//                       <div className="shipment-info">
//                         <span className="shipment-label">{shipment.label}</span>
//                         <span className="shipment-id">ID: {shipment.shipment_id}</span>
//                       </div>
//                       <span className={`shipment-status-pill ${shipment.status.toLowerCase()}`}>
//                         {getShipmentStatusIcon(shipment.status)}
//                         {shipment.status}
//                       </span>
//                     </div>

//                     <p className="shipment-date">
//                       {shipment.status.toLowerCase() === 'shipped' ? 'Shipped on' : 'Created on'}: {formatDate(shipment.date)}
//                     </p>

//                     {/* Products in this shipment */}
//                     <div className="shipment-products">
//                       {shipment.products && shipment.products.map((product, index) => (
//                         <div key={index} className="product-card product-cardss" onClick={() => openPopup(product)}>
//                           <img
//                             src={product.image || "/placeholder.png"}
//                             alt={product.name}
//                             className="product-imgs w-25"
//                           />
//                           <div className="flex-for-small-screen">
//                             <div className="product-details">
//                               <p className="product-names">{product.name}</p>
//                               <div className="d-sm-flex gap-2">
//                                 <p className="mll">{product.variant || "Default Variant"}</p>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               // Fallback: Show all products without shipment grouping (for backward compatibility)
//               <div className="order-products">
//                 {getAllProductsFromOrder(order).map((product, index) => (
//                   <div key={index} className="product-card product-cardss" onClick={() => openPopup(product)}>
//                     <img
//                       src={product.image || "/placeholder.png"}
//                       alt={product.name}
//                       className="product-imgs w-25"
//                     />
//                     <div className="flex-for-small-screen">
//                       <div className="product-details">
//                         <p className="product-names">{product.name}</p>
//                         <div className="d-sm-flex gap-2">
//                           <p className="mll">{product.variant || "Default Variant"}</p>
//                           {product.shipmentLabel && (
//                             <p className="mll shipment-badge">From: {product.shipmentLabel}</p>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}

//             {/* Delivery Info */}
//             {order.expectedDelivery && (
//               <div className="order-delivery">
//                 <span className="delivery-icon">🚚</span>
//                 <p>
//                   Expected Delivery: {formatDate(order.expectedDelivery)}
//                 </p>
//               </div>
//             )}

//             {/* Track Order Button */}
//             {order.status.toLowerCase() !== "cancelled" && (
//               <div className="text-end mt-2 mb-2 me-3">
//                 <button
//                   className="btn btn-primary btn-sm"
//                   onClick={() =>
//                     navigate("/trackorder", { state: { orderId: order._id } })
//                   }
//                   style={{
//                     borderRadius: "8px",
//                     fontWeight: "500",
//                     padding: "6px 14px",
//                     backgroundColor: "#007bff",
//                     border: "none",
//                   }}
//                 >
//                   🚚 Track Order
//                 </button>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>

//       {/* Popup */}
//       {showPopup && selectedProduct && (
//         <div className="popup-overlay" onClick={closePopup}>
//           <div className="popup-content" onClick={(e) => e.stopPropagation()}>
//             <button className="close-btn" onClick={closePopup}>✖</button>
//             <img
//               src={selectedProduct.image || "/placeholder.png"}
//               alt={selectedProduct.name}
//               className="popup-product-img"
//             />
//             <h3>{selectedProduct.name}</h3>
//             <p>Variant: {selectedProduct.variant || "Default Variant"}</p>
//             {selectedProduct.shipmentLabel && (
//               <p>Shipment: {selectedProduct.shipmentLabel}</p>
//             )}
//             {selectedProduct.shipmentStatus && (
//               <p>Shipment Status: {selectedProduct.shipmentStatus}</p>
//             )}
//           </div>
//         </div>
//       )}

//       <Footer />
//     </>
//   );
// };

// export default Myorders;






























// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../css/Myorders.css";
// import Header from "./Header";
// import Footer from "./Footer";

// import {
//   FaCheckCircle,
//   FaBox,
//   FaTruck,
//   FaTimesCircle,
//   FaClock,
//   FaArrowRight
// } from "react-icons/fa";

// import axios from "axios";

// const ORDERS_API = "https://beauty.joyory.com/api/user/cart/orders";

// // Format date as DD-MM-YYYY
// const formatDate = (dateStr) => {
//   if (!dateStr) return "N/A";
//   const d = new Date(dateStr);
//   return `${d.getDate().toString().padStart(2, '0')}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getFullYear()}`;
// };

// const Myorders = () => {
//   const navigate = useNavigate();
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const fetchOrders = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await axios.get(ORDERS_API, { withCredentials: true });
//       if (res.data?.orders) {
//         setOrders(res.data.orders);
//       } else {
//         setOrders([]);
//       }
//     } catch (err) {
//       console.error(err);
//       if (err.response && err.response.status === 401) {
//         navigate("/login");
//       } else {
//         setError(err.message || "Something went wrong while fetching orders");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getStatusIcon = (status) => {
//     switch (status?.toLowerCase()) {
//       case "confirmed":
//         return <FaCheckCircle className="status-icon confirmed" />;
//       case "shipped":
//         return <FaBox className="status-icon shipped" />;
//       case "delivered":
//         return <FaTruck className="status-icon delivered" />;
//       case "cancelled":
//         return <FaTimesCircle className="status-icon cancelled" />;
//       default:
//         return <FaClock className="status-icon pending" />;
//     }
//   };

//   const handleOrderClick = (order) => {
//     // Navigate to order details with the first shipment or order data
//     if (order.shipments && order.shipments.length > 0) {
//       navigate(`/order-details/${order.shipments[0].shipment_id}`, { 
//         state: { order }
//       });
//     } else {
//       navigate(`/order-details/${order._id}`, { 
//         state: { order }
//       });
//     }
//   };

//   const handleProductClick = (order, shipment, product, e) => {
//     e.stopPropagation(); // Prevent order click from triggering
//     if (shipment && shipment.shipment_id) {
//       navigate(`/order-details/${shipment.shipment_id}`, { 
//         state: { 
//           order,
//           selectedProduct: product,
//           selectedShipment: shipment
//         }
//       });
//     }
//   };

//   // Helper function to find which shipment contains a specific product
//   const findProductShipment = (order, productName, productVariant) => {
//     if (!order.shipments) return null;

//     for (const shipment of order.shipments) {
//       if (shipment.products && Array.isArray(shipment.products)) {
//         const foundProduct = shipment.products.find(
//           prod => prod.name === productName && prod.variant === productVariant
//         );
//         if (foundProduct) {
//           return shipment;
//         }
//       }
//     }
//     return null;
//   };

//   if (loading) return <p className="loading-text">⏳ Loading your orders...</p>;
//   if (error) return <p className="error-text">{error}</p>;
//   if (orders.length === 0) return <p className="empty-text">You have no orders yet.</p>;

//   return (
//     <>
//       <Header />
//       <h2 className="orders-title text-center mt-4">🛒 My Orders</h2>

//       <div className="orders-container">
//         {orders.map((order) => (
//           <div 
//             key={order._id} 
//             className="order-card clickable-order"
//             onClick={() => handleOrderClick(order)}
//           >
//             {/* Header */}
//             <div className="order-header">
//               <p className="order-id">
//                 Order Id : <br /><span>{order.orderNumber || order.orderId}</span>
//               </p>
//               <div>
//                 <span className={`order-status-pill ${order.status.toLowerCase()}`}>
//                   {getStatusIcon(order.status)}
//                   {order.status}
//                 </span>
//                 <p className="order-date text-justify">
//                   On {formatDate(order.date)}
//                 </p>
//               </div>
//             </div>

//             <div className="order-products-border"></div>

//             {/* Order Amount */}
//             <div className="order-amount-section">
//               <p className="order-amount">Total Amount: ₹{order.amount}</p>
//             </div>

//             {/* Shipments */}
//             {order.shipments && order.shipments.length > 0 ? (
//               <div className="order-shipments">
//                 <h5 className="shipments-title">Shipments</h5>
//                 {order.shipments.map((shipment) => (
//                   <div key={shipment.shipment_id} className="shipment-card">
//                     <div className="shipment-header">
//                       <div className="shipment-info">
//                         <span className="shipment-label">{shipment.label}</span>
//                         <span className="shipment-id">ID: {shipment.shipment_id}</span>
//                       </div>
//                       <span className={`shipment-status-pill ${shipment.status.toLowerCase()}`}>
//                         {getStatusIcon(shipment.status)}
//                         {shipment.status}
//                       </span>
//                     </div>

//                     <p className="shipment-date">
//                       {shipment.status.toLowerCase() === 'shipped' ? 'Shipped on' : 'Created on'}: {formatDate(shipment.date)}
//                     </p>

//                     {/* Products in this shipment */}
//                     <div className="shipment-products">
//                       {shipment.products && shipment.products.map((product, index) => (
//                         <div 
//                           key={index} 
//                           className="product-card product-cardss clickable-product"
//                           onClick={(e) => handleProductClick(order, shipment, product, e)}
//                         >
//                           <img
//                             src={product.image || "/placeholder.png"}
//                             alt={product.name}
//                             className="product-imgs w-25"
//                           />
//                           <div className="flex-for-small-screen">
//                             <div className="product-details">
//                               <p className="product-names">{product.name}</p>
//                               <div className="d-sm-flex gap-2">
//                                 <p className="mll">{product.variant || "Default Variant"}</p>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               // Fallback: Show all products without shipment grouping
//               <div className="order-products">
//                 {(() => {
//                   const allProducts = [];
//                   if (order.shipments && Array.isArray(order.shipments)) {
//                     order.shipments.forEach(shipment => {
//                       if (shipment.products && Array.isArray(shipment.products)) {
//                         shipment.products.forEach(product => {
//                           allProducts.push({
//                             ...product,
//                             shipmentStatus: shipment.status,
//                             shipmentLabel: shipment.label,
//                             shipmentDate: shipment.date,
//                             shipment: shipment
//                           });
//                         });
//                       }
//                     });
//                   }
//                   return allProducts;
//                 })().map((product, index) => (
//                   <div 
//                     key={index} 
//                     className="product-card product-cardss clickable-product"
//                     onClick={(e) => handleProductClick(order, product.shipment, product, e)}
//                   >
//                     <img
//                       src={product.image || "/placeholder.png"}
//                       alt={product.name}
//                       className="product-imgs w-25"
//                     />
//                     <div className="flex-for-small-screen">
//                       <div className="product-details">
//                         <p className="product-names">{product.name}</p>
//                         <div className="d-sm-flex gap-2">
//                           <p className="mll">{product.variant || "Default Variant"}</p>
//                           {product.shipmentLabel && (
//                             <p className="mll shipment-badge">From: {product.shipmentLabel}</p>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}

//             {/* Delivery Info */}
//             {order.expectedDelivery && (
//               <div className="order-delivery">
//                 <span className="delivery-icon">🚚</span>
//                 <p>
//                   Expected Delivery: {formatDate(order.expectedDelivery)}
//                 </p>
//               </div>
//             )}

//             {/* View Details Button */}
//             <div className="text-end mt-2 mb-2 me-3">
//               <button
//                 className="btn btn-outline-primary btn-sm view-details-btn"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   handleOrderClick(order);
//                 }}
//               >
//                 View Details <FaArrowRight className="ms-1" />
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       <Footer />
//     </>
//   );
// };

// export default Myorders;




















// // Myorders.jsx
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../css/Myorders.css";
// import Header from "./Header";
// import Footer from "./Footer";

// import {
//   FaCheckCircle,
//   FaBox,
//   FaTruck,
//   FaTimesCircle,
//   FaClock,
//   FaArrowRight
// } from "react-icons/fa";

// import axios from "axios";

// const ORDERS_API = "https://beauty.joyory.com/api/user/cart/orders";

// // Format date as DD-MM-YYYY
// const formatDate = (dateStr) => {
//   if (!dateStr) return "N/A";
//   const d = new Date(dateStr);
//   return `${d.getDate().toString().padStart(2, '0')}-${(d.getMonth() + 1)
//     .toString()
//     .padStart(2, '0')}-${d.getFullYear()}`;
// };

// const Myorders = () => {
//   const navigate = useNavigate();
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const fetchOrders = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await axios.get(ORDERS_API, { withCredentials: true });
//       if (res.data?.orders) {
//         setOrders(res.data.orders);
//       } else {
//         setOrders([]);
//       }
//     } catch (err) {
//       console.error(err);
//       if (err.response && err.response.status === 401) {
//         navigate("/login");
//       } else {
//         setError(err.response?.data?.message || err.message || "Something went wrong while fetching orders");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getStatusIcon = (status) => {
//     switch (status?.toLowerCase()) {
//       case "confirmed":
//         return <FaCheckCircle className="status-icon confirmed" />;
//       case "shipped":
//         return <FaBox className="status-icon shipped" />;
//       case "delivered":
//         return <FaTruck className="status-icon delivered" />;
//       case "cancelled":
//         return <FaTimesCircle className="status-icon cancelled" />;
//       default:
//         return <FaClock className="status-icon pending" />;
//     }
//   };

//   const handleOrderClick = (order) => {
//     if (order.shipments && order.shipments.length > 0) {
//       navigate(`/order-details/${order.shipments[0].shipment_id}`, { state: { order } });
//     } else {
//       navigate(`/order-details/${order._id}`, { state: { order } });
//     }
//   };

//   const handleProductClick = (order, shipment, product, e) => {
//     e.stopPropagation();
//     if (shipment && shipment.shipment_id) {
//       navigate(`/order-details/${shipment.shipment_id}`, {
//         state: { order, selectedProduct: product, selectedShipment: shipment }
//       });
//     }
//   };

//   if (loading) return <p className="loading-text">⏳ Loading your orders...</p>;
//   if (error) return <p className="error-text">{error}</p>;
//   if (orders.length === 0) return <p className="empty-text">You have no orders yet.</p>;

//   return (
//     <>
//       <Header />
//       <h2 className="orders-title text-center mt-4">🛒 My Orders</h2>

//       <div className="orders-container">
//         {orders.map((order) => (
//           <div
//             key={order._id}
//             className="order-card clickable-order"
//             onClick={() => handleOrderClick(order)}
//           >
//             {/* ======  UPDATED HEADER  ====== */}
//             <div className="order-header">
//               <p className="order-id">
//                 <strong>Order ID:</strong> {order.orderId}
//               </p>
//               <div>
//                 {/* <span className={`order-status-pill ${order.status.toLowerCase()}`}>
//                   {getStatusIcon(order.status)}
//                   {order.status}
//                 </span> */}
//                 <p className="order-date text-justify">On {formatDate(order.date)}</p>
//               </div>
//             </div>
//             {/* =================================== */}

//             <div className="order-products-border"></div>

//             {/* <div className="order-amount-section">
//               <p className="order-amount">Total Amount: ₹{order.amount}</p>
//             </div> */}

//             {/* Shipments */}
//             {order.shipments && order.shipments.length > 0 ? (
//               <div className="order-shipments">
//                 <h5 className="shipments-title">Shipments</h5>
//                 {order.shipments.map((shipment) => (
//                   <div key={shipment.shipment_id} className="shipment-card">
//                     <div className="shipment-header">
//                       <div className="shipment-info">
//                         <span className="shipment-label">{shipment.label}</span>
//                         <span className="shipment-id">ID: {shipment.shipment_id}</span>
//                       </div>
//                       <span className={`shipment-status-pill ${shipment.status.toLowerCase()}`}>
//                         {getStatusIcon(shipment.status)}
//                         {shipment.status}
//                       </span>
//                     </div>

//                     {/* <p className="shipment-date">
//                       {shipment.status.toLowerCase() === "shipped"
//                         ? "Shipped on"
//                         : "Created on"
//                         }
//                       : {formatDate(shipment.date)}
//                     </p> */}

//                     <div className="shipment-products">
//                       {shipment.products &&
//                         shipment.products.map((product, idx) => (
//                           <div
//                             key={idx}
//                             className="product-card product-cardss clickable-product"
//                             onClick={(e) => handleProductClick(order, shipment, product, e)}
//                           >
//                             <img
//                               src={product.image || "/placeholder.png"}
//                               alt={product.name}
//                               className="product-imgs w-25"
//                             />
//                             <div className="flex-for-small-screen">
//                               <div className="product-details">
//                                 <p className="product-names">{product.name}</p>
//                                 <div className="d-sm-flex gap-2">
//                                   <p className="mll">{product.variant || "Default Variant"}</p>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         ))}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               /* fallback – no shipment grouping */
//               <div className="order-products">
//                 {(() => {
//                   const allProducts = [];
//                   if (order.shipments && Array.isArray(order.shipments)) {
//                     order.shipments.forEach((shipment) => {
//                       if (shipment.products && Array.isArray(shipment.products)) {
//                         shipment.products.forEach((product) => {
//                           allProducts.push({
//                             ...product,
//                             shipmentStatus: shipment.status,
//                             shipmentLabel: shipment.label,
//                             shipmentDate: shipment.date,
//                             shipment: shipment
//                           });
//                         });
//                       }
//                     });
//                   }
//                   return allProducts;
//                 })().map((product, idx) => (
//                   <div
//                     key={idx}
//                     className="product-card product-cardss clickable-product"
//                     onClick={(e) => handleProductClick(order, product.shipment, product, e)}
//                   >
//                     <img
//                       src={product.image || "/placeholder.png"}
//                       alt={product.name}
//                       className="product-imgs w-25"
//                     />
//                     <div className="flex-for-small-screen">
//                       <div className="product-details">
//                         <p className="product-names">{product.name}</p>
//                         <div className="d-sm-flex gap-2">
//                           <p className="mll">{product.variant || "Default Variant"}</p>
//                           {product.shipmentLabel && (
//                             <p className="mll shipment-badge">From: {product.shipmentLabel}</p>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}

//             {/* {order.expectedDelivery && (
//               <div className="order-delivery">
//                 <span className="delivery-icon">🚚</span>
//                 <p>Expected Delivery: {formatDate(order.expectedDelivery)}</p>
//               </div>
//             )} */}

//             {/* <div className="text-end mt-2 mb-2 me-3">
//               <button
//                 className="btn btn-outline-primary btn-sm view-details-btn"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   handleOrderClick(order);
//                 }}
//               >
//                 View Details <FaArrowRight className="ms-1" />
//               </button>
//             </div> */}
//           </div>
//         ))}
//       </div>

//       <Footer />
//     </>
//   );
// };

// export default Myorders;




















// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../css/Myorders.css";
// import Header from "./Header";
// import Footer from "./Footer";
// import axios from "axios";

// import {
//   FaCheckCircle,
//   FaBox,
//   FaTruck,
//   FaTimesCircle,
//   FaClock,
//   FaChevronRight
// } from "react-icons/fa";

// const ORDERS_API = "https://beauty.joyory.com/api/user/cart/orders";

// // Format date as DD-MM-YYYY
// const formatDate = (dateStr) => {
//   if (!dateStr) return "N/A";
//   const d = new Date(dateStr);
//   return `${d.getDate().toString().padStart(2, '0')}-${(d.getMonth() + 1)
//     .toString()
//     .padStart(2, '0')}-${d.getFullYear()}`;
// };

// const Myorders = () => {
//   const navigate = useNavigate();
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const fetchOrders = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await axios.get(ORDERS_API, { withCredentials: true });
//       if (res.data?.success && res.data?.orders) {
//         setOrders(res.data.orders);
//       } else {
//         setOrders([]);
//       }
//     } catch (err) {
//       console.error("Fetch Orders Error:", err);
//       if (err.response && err.response.status === 401) {
//         navigate("/login");
//       } else {
//         setError(err.response?.data?.message || "Failed to load orders");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getStatusIcon = (status) => {
//     switch (status?.toLowerCase()) {
//       case "confirmed":
//       case "placed":
//         return <FaCheckCircle className="status-icon confirmed" />;
//       case "shipped":
//         return <FaBox className="status-icon shipped" />;
//       case "delivered":
//         return <FaTruck className="status-icon delivered" />;
//       case "cancelled":
//         return <FaTimesCircle className="status-icon cancelled" />;
//       default:
//         return <FaClock className="status-icon pending" />;
//     }
//   };

//   const handleOrderClick = (order, shipmentId) => {
//     // Navigate to details using the shipment_id from your JSON
//     navigate(`/order-details/${shipmentId}`, { state: { order } });
//   };

//   const handleProductClick = (order, shipment, product, e) => {
//     e.stopPropagation();
//     navigate(`/order-details/${shipment.shipment_id}`, {
//       state: { order, selectedProduct: product, selectedShipment: shipment }
//     });
//   };

//   if (loading) return (
//    <>
//     <Header />

//    </>
//   );

//   // if (error) return (
//     //   <div className="error-container">
//     //     <Header />
//     //     <p className="error-text text-center mt-5 text-danger">{error}</p>
//     //   </div>
//     // );

//     return (
//     <>
//       <Header />
//       <div className="orders-page-wrapper bg-white pb-5 page-title-main-name mt-lg-5 pt-lg-5 mt-md-5 pt-md-5">

//         <div className="container orders-container">
//         <h2 className="orders-title py-4 page-title-main-name mt-lg-5 pt-lg-4 mt-md-0 pt-md-0">My Orders</h2>
//           {orders.length === 0 ? (
//             <div className="empty-orders text-center p-5 bg-white shadow-sm rounded">
//               <p className="empty-text fs-4 page-title-main-name">You have no orders yet.</p>
//               <button className="btn btn-dark mt-3 page-title-main-name" onClick={() => navigate("/")}>Start Shopping</button>
//             </div>
//           ) : (
//             orders.map((order) => (
//               <div key={order._id} className="order-main-card mb-4 shadow-sm bg-white rounded overflow-hidden">

//                 {/* Order Summary Header */}
//                 <div className="order-header d-flex justify-content-between align-items-center p-3 bg-white">
//                   <div>
//                     <p className="order-id-label mb-0 text-muted small text-uppercase fw-bold">Order ID</p>
//                     <p className="order-id-value mb-0 fw-normal">{order.orderId}</p>
//                   </div>
//                   <div className="text-end">
//                     <p className="order-date-label mb-0 text-muted small text-uppercase fw-bold">Placed On</p>
//                     <p className="order-date-value mb-0">{formatDate(order.date)}</p>
//                   </div>
//                 </div>

//                 {/* Iterate Shipments from Backend JSON */}
//                 {order.shipments && order.shipments.map((shipment) => (
//                   <div 
//                     key={shipment.shipment_id} 
//                     className="shipment-wrapper border-bottom p-3 clickable-shipment"
//                     onClick={() => handleOrderClick(order, shipment.shipment_id)}
//                   >
//                     <div className="shipment-meta d-flex justify-content-between align-items-center mb-3">
//                       <div className="d-flex align-items-center">
//                         <span className="shipment-badge bg-dark text-white px-2 py-1 rounded small me-2">
//                           {shipment.label}
//                         </span>
//                         <span className="text-muted small">ID: {shipment.shipment_id}</span>
//                       </div>
//                       <div className={`status-pill status-${shipment.status.toLowerCase()} d-flex align-items-center gap-2 fw-bold`}>
//                         {getStatusIcon(shipment.status)}
//                         {shipment.status}
//                       </div>
//                     </div>

//                     {/* Shipment Products */}
//                     <div className="shipment-products-list">
//                       {shipment.products.map((product, idx) => (
//                         <div 
//                           key={idx} 
//                           className="product-row d-flex align-items-center gap-3 mb-2"
//                           onClick={(e) => handleProductClick(order, shipment, product, e)}
//                         >
//                           <div className="product-img-box">
//                             <img
//                               src={product.image || "/placeholder.png"}
//                               alt={product.name}
//                               className="rounded border"
//                               style={{ width: "70px", height: "70px", objectFit: "cover" }}
//                             />
//                           </div>
//                           <div className="product-info flex-grow-1">
//                             <h6 className="product-name-text mb-1 fw-bold">{product.name}</h6>
//                             <p className="product-variant-text text-muted mb-0 small">
//                               Variant: {product.variant || "Standard"}
//                             </p>
//                           </div>
//                           <div className="view-arrow text-muted">
//                             <FaChevronRight />
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 ))}

//                 {/* Order Footer */}
//                 <div className="order-footer p-3 bg-white d-flex justify-content-between align-items-center">
//                   <div className="order-total">
//                     <span className="text-muted small">Total Amount: </span>
//                     <span className="fw-bold text-dark">₹{order.amount}</span>
//                   </div>
//                   <button 
//                     className="btn btn-sm btn-outline-dark fw-bold"
//                     onClick={() => handleOrderClick(order, order.shipments[0]?.shipment_id || order._id)}
//                   >
//                     View Details
//                   </button>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default Myorders;


















// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../css/Myorders.css";
// import Header from "./Header";
// import { DotLottieReact } from '@lottiefiles/dotlottie-react';
// import Footer from "./Footer";
// import axios from "axios";

// import {
//   FaCheckCircle,
//   FaBox,
//   FaTruck,
//   FaTimesCircle,
//   FaClock,
//   FaChevronRight
// } from "react-icons/fa";

// const ORDERS_API = "https://beauty.joyory.com/api/user/cart/orders";

// // Format date as DD-MM-YYYY
// const formatDate = (dateStr) => {
//   if (!dateStr) return "N/A";
//   const d = new Date(dateStr);
//   return `${d.getDate().toString().padStart(2, '0')}-${(d.getMonth() + 1)
//     .toString()
//     .padStart(2, '0')}-${d.getFullYear()}`;
// };

// const Myorders = () => {
//   const navigate = useNavigate();
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const fetchOrders = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await axios.get(ORDERS_API, { withCredentials: true });
//       if (res.data?.success && res.data?.orders) {
//         setOrders(res.data.orders);
//       } else {
//         setOrders([]);
//       }
//     } catch (err) {
//       console.error("Fetch Orders Error:", err);
//       if (err.response && err.response.status === 401) {
//         navigate("/login");
//       } else {
//         setError(err.response?.data?.message || "Failed to load orders");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getStatusIcon = (status) => {
//     switch (status?.toLowerCase()) {
//       case "confirmed":
//       case "placed":
//         return <FaCheckCircle className="status-icon confirmed" />;
//       case "shipped":
//         return <FaBox className="status-icon shipped" />;
//       case "delivered":
//         return <FaTruck className="status-icon delivered" />;
//       case "cancelled":
//         return <FaTimesCircle className="status-icon cancelled" />;
//       default:
//         return <FaClock className="status-icon pending" />;
//     }
//   };

//   // ==================== SMART NAVIGATION HANDLER ====================
//   const handleOrderClick = (order, shipmentId) => {
//     // Check if shipmentId exists and is not empty
//     if (shipmentId && shipmentId.trim() !== "") {
//       // Shipment ID is available → Navigate to OrderDetails page
//       navigate(`/order-details/${shipmentId}`, { state: { order } });
//     } else {
//       // Shipment ID is empty/missing → Navigate to OrderSuccess page with order ID
//       navigate(`/ordersuccess/${order._id || order.orderId}`, {
//         state: {
//           order,
//           orderId: order._id || order.orderId,
//           message: "Shipment details are not yet available. Tracking will be updated soon."
//         }
//       });
//     }
//   };

//   const handleProductClick = (order, shipment, product, e) => {
//     e.stopPropagation();

//     // Check if shipment_id exists and is not empty
//     const shipmentId = shipment.shipment_id;

//     if (shipmentId && shipmentId.trim() !== "") {
//       // Shipment ID is available → Navigate to OrderDetails page
//       navigate(`/order-details/${shipmentId}`, {
//         state: { order, selectedProduct: product, selectedShipment: shipment }
//       });
//     } else {
//       // Shipment ID is empty/missing → Navigate to OrderSuccess page with order ID
//       navigate(`/ordersuccess/${order._id || order.orderId}`, {
//         state: {
//           order,
//           orderId: order._id || order.orderId,
//           selectedProduct: product,
//           message: "Shipment details are not yet available. Tracking will be updated soon."
//         }
//       });
//     }
//   };

//   // ==================== VIEW DETAILS BUTTON HANDLER ====================
//   const handleViewDetails = (order) => {
//     // Get the first available shipment with a valid shipment_id
//     const validShipment = order.shipments?.find(
//       s => s.shipment_id && s.shipment_id.trim() !== ""
//     );

//     if (validShipment) {
//       // Valid shipment found → Navigate to OrderDetails page
//       navigate(`/order-details/${validShipment.shipment_id}`, { state: { order } });
//     } else {
//       // No valid shipment → Navigate to OrderSuccess page
//       navigate(`/ordersuccess/${order._id || order.orderId}`, {
//         state: {
//           order,
//           orderId: order._id || order.orderId,
//           message: "Shipment details are not yet available. Tracking will be updated soon."
//         }
//       });
//     }
//   };

//   if (loading) return (
//     <>
//       <Header />
//       {/* <div className="container mt-4 text-center py-5">
//       <div className="spinner-border text-primary" />
//       <p className="mt-2">Loading Orders...</p>
//     </div> */}



//       <div
//         className="fullscreen-loader page-title-main-name"
//         style={{
//           minHeight: "100vh",
//           width: "100%",
//         }}
//       >
//         <div className="text-center">
//           <DotLottieReact className="foryoulanding-css"
//             src="https:lottie.host/73673e65-df58-41a5-87e7-b837c5d00fe8/dJVGVbJuYJ.lottie"
//             loop
//             autoplay
//           />


//           <p className="text-muted mb-0">
//             Please wait while we prepare the best products for you...
//           </p>
//         </div>
//       </div>




//       <Footer />
//     </>
//   );

//   if (error) return (
//     <>
//       <Header />
//       <div className="container mt-4 text-center py-5">
//         <div className="alert alert-danger">{error}</div>
//         <button className="btn btn-primary" onClick={fetchOrders}>Retry</button>
//       </div>
//       <Footer />
//     </>
//   );

//   return (
//     <>
//       <Header />
//       <div className="orders-page-wrapper bg-white pb-5 page-title-main-name mt-lg-5 pt-lg-5 mt-md-5 pt-md-5">

//         <div className="container orders-container">
//           <h2 className="orders-title py-4 page-title-main-name mt-lg-5 pt-lg-4 mt-md-0 pt-md-0">My Orders</h2>
//           {orders.length === 0 ? (
//             <div className="empty-orders text-center p-5 bg-white shadow-sm rounded">
//               <p className="empty-text fs-4 page-title-main-name">You have no orders yet.</p>
//               <button className="btn btn-dark mt-3 page-title-main-name" onClick={() => navigate("/")}>Start Shopping</button>
//             </div>
//           ) : (
//             orders.map((order) => (
//               <div key={order._id} className="order-main-card mb-4 shadow-sm bg-white rounded overflow-y-scroll" style={{height:'350px'}}>

//                 {/* Order Summary Header */}
//                 <div className="order-header d-flex justify-content-between align-items-center p-3 bg-white">
//                   <div>
//                     <p className="order-id-label mb-0 text-muted small text-uppercase fw-bold">Order ID</p>
//                     <p className="order-id-value mb-0 fw-normal">{order.orderId}</p>
//                   </div>
//                   <div className="text-end">
//                     <p className="order-date-label mb-0 text-muted small text-uppercase fw-bold">Placed On</p>
//                     <p className="order-date-value mb-0">{formatDate(order.date)}</p>
//                   </div>
//                 </div>

//                 {/* Iterate Shipments from Backend JSON */}
//                 {order.shipments && order.shipments.map((shipment) => (
//                   <div
//                     key={shipment.shipment_id || `shipment-${Math.random()}`}
//                     className="shipment-wrapper border-bottom p-3 clickable-shipment"
//                     onClick={() => handleOrderClick(order, shipment.shipment_id)}
//                   >
//                     <div className="shipment-meta d-flex justify-content-between align-items-center mb-3">
//                       <div className="d-flex align-items-center">
//                         <span className="shipment-badge bg-dark text-white px-2 py-1 rounded small me-2">
//                           {shipment.label}
//                         </span>
//                         {/* Show shipment ID if available, otherwise show "Pending" */}
//                         <span className="text-muted small">
//                           {shipment.shipment_id ? (
//                             <>ID: {shipment.shipment_id}</>
//                           ) : (
//                             <span className="text-warning">Shipment Pending</span>
//                           )}
//                         </span>
//                       </div>
//                       <div className={`status-pill status-${shipment.status?.toLowerCase() || 'pending'} d-flex align-items-center gap-2 fw-bold`}>
//                         {getStatusIcon(shipment.status)}
//                         {shipment.status || "Pending"}
//                       </div>
//                     </div>

//                     {/* Shipment Products */}
//                     <div className="shipment-products-list">
//                       {shipment.products.map((product, idx) => (
//                         <div
//                           key={idx}
//                           className="product-row d-flex align-items-center gap-3 mb-2"
//                           onClick={(e) => handleProductClick(order, shipment, product, e)}
//                         >
//                           <div className="product-img-box">
//                             <img
//                               src={product.image || "/placeholder.png"}
//                               alt={product.name}
//                               className="rounded border"
//                               style={{ width: "70px", height: "70px", objectFit: "cover" }}
//                             />
//                           </div>
//                           <div className="product-info flex-grow-1">
//                             <h6 className="product-name-text mb-1 fw-bold">{product.name}</h6>
//                             <p className="product-variant-text text-muted mb-0 small">
//                               Variant: {product.variant || "Standard"}
//                             </p>
//                           </div>
//                           <div className="view-arrow text-muted">
//                             <FaChevronRight />
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 ))}

//                 {/* Order Footer */}
//                 <div className="order-footer p-3 bg-white d-flex justify-content-between align-items-center">
//                   <div className="order-total">
//                     <span className="text-muted small">Total Amount: </span>
//                     <span className="fw-bold text-dark">₹{order.amount}</span>
//                   </div>
//                   <button
//                     className="btn btn-sm btn-outline-dark fw-bold"
//                     onClick={() => handleViewDetails(order)}
//                   >
//                     View Details
//                   </button>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default Myorders;
















import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Myorders.css";
import Header from "./Header";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import Footer from "./Footer";
import axios from "axios";

import {
  FaCheckCircle,
  FaBox,
  FaTruck,
  FaTimesCircle,
  FaClock,
  FaChevronRight
} from "react-icons/fa";

const ORDERS_API = "https://beauty.joyory.com/api/user/cart/orders";

// Format date as DD-MM-YYYY
const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  const d = new Date(dateStr);
  return `${d.getDate().toString().padStart(2, '0')}-${(d.getMonth() + 1)
    .toString()
    .padStart(2, '0')}-${d.getFullYear()}`;
};

const Myorders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(ORDERS_API, { withCredentials: true });
      if (res.data?.success && res.data?.orders) {
        setOrders(res.data.orders);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error("Fetch Orders Error:", err);
      if (err.response && err.response.status === 401) {
        navigate("/login");
      } else {
        setError(err.response?.data?.message || "Failed to load orders");
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ Helper: check cancelled
  const isShipmentCancelled = (shipment) => {
    return shipment?.status?.toLowerCase() === "cancelled";
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
      case "placed":
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

  // ==================== ORDER CLICK ====================
  const handleOrderClick = (order, shipmentId, shipment) => {
    if (isShipmentCancelled(shipment)) {
      alert("This order has already been cancelled.");
      return;
    }

    if (shipmentId && shipmentId.trim() !== "") {
      navigate(`/order-details/${shipmentId}`, { state: { order } });
    } else {
      navigate(`/ordersuccess/${order._id || order.orderId}`, {
        state: {
          order,
          orderId: order._id || order.orderId,
          message: "Shipment details are not yet available. Tracking will be updated soon."
        }
      });
    }
  };

  // ==================== PRODUCT CLICK ====================
  const handleProductClick = (order, shipment, product, e) => {
    e.stopPropagation();

    if (isShipmentCancelled(shipment)) {
      alert("This order has already been cancelled.");
      return;
    }

    const shipmentId = shipment.shipment_id;

    if (shipmentId && shipmentId.trim() !== "") {
      navigate(`/order-details/${shipmentId}`, {
        state: { order, selectedProduct: product, selectedShipment: shipment }
      });
    } else {
      navigate(`/ordersuccess/${order._id || order.orderId}`, {
        state: {
          order,
          orderId: order._id || order.orderId,
          selectedProduct: product,
          message: "Shipment details are not yet available. Tracking will be updated soon."
        }
      });
    }
  };

  // ==================== VIEW DETAILS ====================
  const handleViewDetails = (order) => {
    const validShipment = order.shipments?.find(
      s => s.shipment_id && s.shipment_id.trim() !== ""
    );

    if (validShipment && isShipmentCancelled(validShipment)) {
      alert("This order has already been cancelled.");
      return;
    }

    if (validShipment) {
      navigate(`/order-details/${validShipment.shipment_id}`, { state: { order } });
    } else {
      navigate(`/ordersuccess/${order._id || order.orderId}`, {
        state: {
          order,
          orderId: order._id || order.orderId,
          message: "Shipment details are not yet available. Tracking will be updated soon."
        }
      });
    }
  };

  // ==================== LOADING ====================
  if (loading) return (
    <>
      <Header />
      <div className="fullscreen-loader page-title-main-name" style={{ minHeight: "100vh", width: "100%" }}>
        <div className="text-center">
          <DotLottieReact
            className="foryoulanding-css"
            src="https://lottie.host/73673e65-df58-41a5-87e7-b837c5d00fe8/dJVGVbJuYJ.lottie"
            loop
            autoplay
          />
          <p className="text-muted mb-0">
            Please wait while we prepare the best products for you...
          </p>
        </div>
      </div>
      <Footer />
    </>
  );

  // ==================== ERROR ====================
  if (error) return (
    <>
      <Header />
      <div className="container mt-4 text-center py-5">
        <div className="alert alert-danger">{error}</div>
        <button className="btn btn-primary" onClick={fetchOrders}>Retry</button>
      </div>
      <Footer />
    </>
  );

  return (
    <>
      <Header />
      <div className="orders-page-wrapper bg-white pb-5 page-title-main-name mt-lg-5 pt-lg-5 mt-md-5 pt-md-5">
        <div className="container orders-container">
          <h2 className="orders-title py-4 page-title-main-name mt-lg-5 pt-lg-4 mt-md-0 pt-md-0">
            My Orders
          </h2>

          {orders.length === 0 ? (
            <div className="empty-orders text-center p-5 bg-white shadow-sm rounded">
              <p className="empty-text fs-4 page-title-main-name">
                You have no orders yet.
              </p>
              <button className="btn btn-dark mt-3 page-title-main-name" onClick={() => navigate("/")}>
                Start Shopping
              </button>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order._id}
                className="order-main-card mb-4 shadow-sm bg-white rounded overflow-y-scroll"
                style={order.shipments && order.shipments.length >= 2 ? { height: "350px" } : {}}
              >
                {/* Header */}
                <div className="order-header d-flex justify-content-between align-items-center p-3 bg-white position-sticky top-0">
                  <div>
                    <p className="order-id-label mb-0 text-muted small text-uppercase fw-bold">Order ID</p>
                    <p className="order-id-value mb-0 fw-normal">{order.orderId}</p>
                  </div>
                  <div className="text-end">
                    <p className="order-date-label mb-0 text-muted small text-uppercase fw-bold">Placed On</p>
                    <p className="order-date-value mb-0">{formatDate(order.date)}</p>
                  </div>
                </div>

                {/* Shipments */}
                {order.shipments && order.shipments.map((shipment) => (
                  <div
                    key={shipment.shipment_id || `shipment-${Math.random()}`}
                    className="shipment-wrapper border-bottom p-3 clickable-shipment"
                    onClick={() => handleOrderClick(order, shipment.shipment_id, shipment)}
                  >
                    <div className="shipment-meta d-lg-flex justify-content-between align-items-center mb-3">
                      <div className="d-flex align-items-center">
                        <span className="shipment-badge bg-dark text-white px-2 py-1 rounded small me-2">
                          {shipment.label}
                        </span>
                        <span className="text-muted small">
                          {shipment.shipment_id ? (
                            <>ID: {shipment.shipment_id}</>
                          ) : (
                            <span className="text-warning">Shipment Pending</span>
                          )}
                        </span>
                      </div>
                      <div className={`status-pill status-${shipment.status?.toLowerCase() || 'pending'} d-flex align-items-center gap-2 fw-bold mt-lg-0 mt-4`}>
                        {getStatusIcon(shipment.status)}
                        {shipment.status || "Pending"}
                      </div>
                    </div>

                    {/* Products */}
                    <div className="shipment-products-list">
                      {shipment.products.map((product, idx) => (
                        <div
                          key={idx}
                          className="product-row d-flex align-items-center gap-3 mb-2"
                          onClick={(e) => handleProductClick(order, shipment, product, e)}
                        >
                          <img
                            src={product.image || "/placeholder.png"}
                            alt={product.name}
                            className="rounded border"
                            style={{ width: "70px", height: "70px", objectFit: "cover" }}
                          />
                          <div className="flex-grow-1">
                            <h6 className="mb-1 fw-bold">{product.name}</h6>
                            <p className="text-muted mb-0 small">
                              Variant: {product.variant || "Standard"}
                            </p>
                          </div>
                          <FaChevronRight />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Footer */}
                <div className="order-footer p-3 bg-white d-flex justify-content-between align-items-center position-sticky bottom-0">
                  <div>
                    <span className="text-muted small">Total Amount: </span>
                    <span className="fw-bold text-dark">₹{order.amount}</span>
                  </div>
                  <button
                    className="btn btn-sm btn-outline-dark fw-bold"
                    onClick={() => handleViewDetails(order)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Myorders;