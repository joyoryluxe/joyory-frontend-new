// import React, { useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";

// const RAZORPAY_KEY_ID = "rzp_test_YK2tGGnqcok3dj"; // Test key

// const PaymentPage = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const razorpayData = location.state?.razorpayData;
//   const selectedAddress = location.state?.selectedAddress;

//   useEffect(() => {
//     if (!razorpayData || !selectedAddress) {
//       alert("Missing payment data. Redirecting to cart.");
//       navigate("/cartpage");
//       return;
//     }

//     const loadRazorpay = () => {
//       return new Promise((resolve) => {
//         if (document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
//           resolve(true);
//           return;
//         }
//         const script = document.createElement("script");
//         script.src = "https://checkout.razorpay.com/v1/checkout.js";
//         script.onload = () => resolve(true);
//         script.onerror = () => resolve(false);
//         document.body.appendChild(script);
//       });
//     };

//     const startPayment = async () => {
//       const loaded = await loadRazorpay();
//       if (!loaded) {
//         alert("Razorpay SDK failed to load. Try again later.");
//         return;
//       }

//       // ✅ Always amount in paise
//       const amountInPaise = Math.round(razorpayData.amount * 100);

//       const options = {
//         key: RAZORPAY_KEY_ID,
//         amount: amountInPaise,
//         currency: razorpayData.currency || "INR",
//         name: "Joyory E-Commerce",
//         description: "Order Payment",
//         order_id: razorpayData.razorpayOrderId, // ✅ backend's Razorpay orderId
//         prefill: {
//           name: selectedAddress.name || "Customer",
//           email: selectedAddress.email || "",
//           contact: selectedAddress.phone || "",
//         },
//         notes: {
//           address: `${selectedAddress.addressLine1}, ${selectedAddress.city}, ${selectedAddress.state} - ${selectedAddress.pincode}`,
//         },
//         theme: { color: "#F37254" },

//         handler: async function (response) {
//           const paymentPayload = {
//             orderId: razorpayData.orderId, // ✅ your backend Order _id
//             razorpay_order_id: response.razorpay_order_id,
//             razorpay_payment_id: response.razorpay_payment_id,
//             razorpay_signature: response.razorpay_signature,
//             shippingAddress: selectedAddress,
//           };

//           try {
//             const res = await fetch(
//               "https://beauty.joyory.com/api/payment/razorpay/verify",
//               {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify(paymentPayload),
//               }
//             );
//             const data = await res.json();

//             navigate("/ordersuccess", {
//               state: { paymentResponse: response, backendResponse: data },
//             });
//           } catch (err) {
//             console.error("Error saving payment info:", err);
//             alert("Payment succeeded but saving info failed.");
//           }
//         },

//         modal: {
//           ondismiss: function () {
//             alert("Payment popup closed. Payment not completed.");
//             navigate("/cartpage");
//           },
//         },
//       };

//       const rzp = new window.Razorpay(options);

//       rzp.on("payment.failed", function (response) {
//         console.error("Payment Failed:", response.error);
//         alert("Payment Failed: " + response.error.description);
//         navigate("/cartpage");
//       });

//       rzp.open();
//     };

//     startPayment();
//   }, [razorpayData, selectedAddress, navigate]);

//   return (
//     <div style={{ textAlign: "center", padding: "50px" }}>
//       <h2>Redirecting to Razorpay Checkout...</h2>
//       <p>Do not refresh this page.</p>
//     </div>
//   );
// };

// export default PaymentPage;







// import React, { useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";

// const RAZORPAY_KEY_ID = "rzp_test_YK2tGGnqcok3dj"; // ✅ Replace with Live key later

// const PaymentPage = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const razorpayData = location.state?.razorpayData;
//   const selectedAddress = location.state?.selectedAddress;

//   useEffect(() => {
//     if (!razorpayData || !selectedAddress) {
//       alert("⚠️ Missing payment data. Redirecting to cart.");
//       navigate("/cartpage");
//       return;
//     }

//     // Load Razorpay SDK dynamically
//     const loadRazorpay = () => {
//       return new Promise((resolve) => {
//         if (document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
//           resolve(true);
//           return;
//         }
//         const script = document.createElement("script");
//         script.src = "https://checkout.razorpay.com/v1/checkout.js";
//         script.onload = () => resolve(true);
//         script.onerror = () => resolve(false);
//         document.body.appendChild(script);
//       });
//     };

//     const startPayment = async () => {
//       const loaded = await loadRazorpay();
//       if (!loaded) {
//         alert("❌ Razorpay SDK failed to load. Try again later.");
//         return;
//       }

//       // Always send amount in paise
//       const amountInPaise = Math.round(razorpayData.amount * 100);

//       const options = {
//         key: RAZORPAY_KEY_ID,
//         amount: amountInPaise,
//         currency: razorpayData.currency || "INR",
//         name: "Joyory E-Commerce",
//         description: "Order Payment",
//         order_id: razorpayData.razorpayOrderId, // ✅ Razorpay orderId from backend
//         prefill: {
//           name: selectedAddress.name || "Customer",
//           email: selectedAddress.email || "",
//           contact: selectedAddress.phone || "",
//         },
//         notes: {
//           address: `${selectedAddress.addressLine1}, ${selectedAddress.city}, ${selectedAddress.state} - ${selectedAddress.pincode}`,
//         },
//         theme: { color: "#F37254" },

//         // ✅ Razorpay handler on success
//         handler: async function (response) {
//           const paymentPayload = {
//             orderId: razorpayData.orderId, // ✅ MongoDB Order _id
//             razorpay_order_id: response.razorpay_order_id,
//             razorpay_payment_id: response.razorpay_payment_id,
//             razorpay_signature: response.razorpay_signature,
//             shippingAddress: selectedAddress,
//           };

//           try {
//             const res = await fetch(
//               "https://beauty.joyory.com/api/payment/razorpay/verify",
//               {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify(paymentPayload),
//                   Authorization: `Bearer ${localStorage.getItem("token")}`, // 👈 add this if required

//               }
//             );

//             const data = await res.json();

//             if (!res.ok || !data.success) {
//               alert("⚠️ Payment verified but backend error: " + (data.message || "Unknown error"));
//               return navigate("/cartpage");
//             }

//             // ✅ Redirect to order success page
//             navigate("/ordersuccess", {
//               state: { paymentResponse: response, backendResponse: data },
//             });
//           } catch (err) {
//             console.error("🔥 Error saving payment info:", err);
//             alert("Payment succeeded but saving info failed.");
//             navigate("/cartpage");
//           }
//         },

//         modal: {
//           ondismiss: function () {
//             alert("❌ Payment popup closed. Payment not completed.");
//             navigate("/cartpage");
//           },
//         },
//       };

//       const rzp = new window.Razorpay(options);

//       // ✅ Handle failure case
//       rzp.on("payment.failed", function (response) {
//         console.error("Payment Failed:", response.error);
//         alert("❌ Payment Failed: " + response.error.description);
//         navigate("/cartpage");
//       });

//       rzp.open();
//     };

//     startPayment();
//   }, [razorpayData, selectedAddress, navigate]);

//   return (
//     <div style={{ textAlign: "center", padding: "50px" }}>
//       <h2>Redirecting to Razorpay Checkout...</h2>
//       <p>🚀 Please do not refresh this page.</p>
//     </div>
//   );
// };

// export default PaymentPage;













// import React, { useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";

// const RAZORPAY_KEY_ID = "rzp_test_YK2tGGnqcok3dj"; // ✅ Replace with Live key later

// const PaymentPage = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const razorpayData = location.state?.razorpayData;
//   const selectedAddress = location.state?.selectedAddress;

//   useEffect(() => {
//     if (!razorpayData || !selectedAddress) {
//       alert("⚠ Missing payment data. Redirecting to cart.");
//       navigate("/cartpage");
//       return;
//     }

//     // ✅ Load Razorpay SDK dynamically and ensure it's ready
//     const loadRazorpay = () => {
//       return new Promise((resolve, reject) => {
//         if (window.Razorpay) {
//           resolve(true);
//           return;
//         }

//         const script = document.createElement("script");
//         script.src = "https://checkout.razorpay.com/v1/checkout.js";
//         script.async = true;
//         script.onload = () => {
//           if (window.Razorpay) {
//             resolve(true);
//           } else {
//             reject(new Error("Razorpay SDK not available after load"));
//           }
//         };
//         script.onerror = () =>
//           reject(new Error("Failed to load Razorpay SDK"));
//         document.body.appendChild(script);
//       });
//     };

//     const startPayment = async () => {
//       try {
//         const loaded = await loadRazorpay();
//         if (!loaded) {
//           alert("❌ Razorpay SDK failed to load. Try again later.");
//           return;
//         }

//         if (!window.Razorpay || typeof window.Razorpay !== "function") {
//           alert("⚠ Razorpay SDK not initialized properly.");
//           return;
//         }

//         const amountInPaise = Math.round(razorpayData.amount * 100);

//         const options = {
//           key: RAZORPAY_KEY_ID,
//           amount: amountInPaise,
//           currency: razorpayData.currency || "INR",
//           name: "Joyory E-Commerce",
//           description: "Order Payment",
//           order_id: razorpayData.razorpayOrderId,
//           prefill: {
//             name: selectedAddress.name || "Customer",
//             email: selectedAddress.email || "",
//             contact: selectedAddress.phone || "",
//           },
//           notes: {
//             address: `${selectedAddress.addressLine1}, ${selectedAddress.city}, ${selectedAddress.state} - ${selectedAddress.pincode}`,
//           },
//           theme: { color: "#F37254" },

//           handler: async function (response) {
//             const paymentPayload = {
//               orderId: razorpayData.orderId, // MongoDB Order _id
//               razorpay_order_id: response.razorpay_order_id,
//               razorpay_payment_id: response.razorpay_payment_id,
//               razorpay_signature: response.razorpay_signature,
//               shippingAddress: selectedAddress,
//             };

//             try {
//               const res = await fetch(
//                 "https://beauty.joyory.com/api/payment/razorpay/verify",
//                 {
//                   method: "POST",
//                   headers: {
//                     "Content-Type": "application/json",
//                     Authorization: `Bearer ${localStorage.getItem("token")}`, // ✅ Correct placement
//                   },
//                   body: JSON.stringify(paymentPayload),
//                 }
//               );

//               const data = await res.json();

//               if (!res.ok || !data.success) {
//                 alert(
//                   "⚠ Payment verified but backend error: " +
//                     (data.message || "Unknown error")
//                 );
//                 return navigate("/cartpage");
//               }

//               navigate("/ordersuccess", {
//                 state: { paymentResponse: response, backendResponse: data },
//               });
//             } catch (err) {
//               console.error("🔥 Error saving payment info:", err);
//               alert("Payment succeeded but saving info failed.");
//               navigate("/cartpage");
//             }
//           },

//           modal: {
//             ondismiss: function () {
//               alert("❌ Payment popup closed. Payment not completed.");
//               navigate("/cartpage");
//             },
//           },
//         };

//         const rzp = new window.Razorpay(options);

//         rzp.on("payment.failed", function (response) {
//           console.error("Payment Failed:", response.error);
//           alert("❌ Payment Failed: " + response.error.description);
//           navigate("/cartpage");
//         });

//         rzp.open();
//       } catch (error) {
//         console.error("🔥 Error loading Razorpay:", error);
//         alert("❌ Could not initialize Razorpay. Please refresh and try again.");
//       }
//     };

//     startPayment();
//   }, [razorpayData, selectedAddress, navigate]);

//   return (
//     <div style={{ textAlign: "center", padding: "50px" }}>
//       <h2>Redirecting to Razorpay Checkout...</h2>
//       <p>🚀 Please do not refresh this page.</p>
//     </div>
//   );
// };

// export default PaymentPage;

























// //payment
// import React, { useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";

// const RAZORPAY_KEY_ID = "rzp_test_YK2tGGnqcok3dj"; // ✅ Replace with Live key later

// const PaymentPage = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const razorpayData = location.state?.razorpayData;
//   const selectedAddress = location.state?.selectedAddress;

//   useEffect(() => {
//     if (!razorpayData || !selectedAddress) {
//       alert("⚠ Missing payment data. Redirecting to cart.");
//       navigate("/cartpage");
//       return;
//     }

//     const loadRazorpay = () => {
//       return new Promise((resolve, reject) => {
//         if (window.Razorpay) {
//           resolve(true);
//           return;
//         }
//         const script = document.createElement("script");
//         script.src = "https://checkout.razorpay.com/v1/checkout.js";
//         script.async = true;
//         script.onload = () => {
//           if (window.Razorpay) {
//             resolve(true);
//           } else {
//             reject(new Error("Razorpay SDK not available after load"));
//           }
//         };
//         script.onerror = () => reject(new Error("Failed to load Razorpay SDK"));
//         document.body.appendChild(script);
//       });
//     };

//     const startPayment = async () => {
//       try {
//         const loaded = await loadRazorpay();
//         if (!loaded) {
//           alert("❌ Razorpay SDK failed to load. Try again later.");
//           return;
//         }

//         if (!window.Razorpay || typeof window.Razorpay !== "function") {
//           alert("⚠ Razorpay SDK not initialized properly.");
//           return;
//         }

//         const amountInPaise = Math.round(razorpayData.amount * 100);

//         const options = {
//           key: RAZORPAY_KEY_ID,
//           amount: amountInPaise,
//           currency: razorpayData.currency || "INR",
//           name: "Joyory E-Commerce",
//           description: "Order Payment",
//           order_id: razorpayData.razorpayOrderId,
//           prefill: {
//             name: selectedAddress.name || "Customer",
//             email: selectedAddress.email || "",
//             contact: selectedAddress.phone || "",
//           },
//           notes: {
//             address: `${selectedAddress.addressLine1}, ${selectedAddress.city}, ${selectedAddress.state} - ${selectedAddress.pincode}`,
//           },
//           theme: { color: "#F37254" },

//           handler: async function (response) {
//             const paymentPayload = {
//               orderId: razorpayData.orderId,
//               razorpay_order_id: response.razorpay_order_id,
//               razorpay_payment_id: response.razorpay_payment_id,
//               razorpay_signature: response.razorpay_signature,
//               shippingAddress: selectedAddress,
//             };

//             try {
//               const res = await fetch(
//                 "https://beauty.joyory.com/api/payment/razorpay/verify",
//                 {
//                   method: "POST",
//                   headers: {
//                     "Content-Type": "application/json",
//                     Authorization: `Bearer ${localStorage.getItem("token")}`,
//                   },
//                   body: JSON.stringify(paymentPayload),
//                 }
//               );

//               const data = await res.json();

//               if (!res.ok || !data.success) {
//                 alert(
//                   "⚠ Payment verified but backend error: " +
//                     (data.message || "Unknown error")
//                 );
//                 return navigate("/cartpage");
//               }

//               navigate("/ordersuccess", {
//                 state: { paymentResponse: response, backendResponse: data },
//               });
//             } catch (err) {
//               console.error("🔥 Error saving payment info:", err);
//               alert("Payment succeeded but saving info failed.");
//               navigate("/cartpage");
//             }
//           },

//           modal: {
//             ondismiss: function () {
//               alert("❌ Payment popup closed. Payment not completed.");
//               navigate("/cartpage");
//             },
//           },
//         };

//         const rzp = new window.Razorpay(options);

//         rzp.on("payment.failed", function (response) {
//           console.error("Payment Failed:", response.error);
//           alert("❌ Payment Failed: " + response.error.description);
//           navigate("/cartpage");
//         });

//         rzp.open();
//       } catch (error) {
//         console.error("🔥 Error loading Razorpay:", error);
//         alert("❌ Could not initialize Razorpay. Please refresh and try again.");
//       }
//     };

//     startPayment();
//   }, [razorpayData, selectedAddress, navigate]);

//   return (
//     <div style={{ textAlign: "center", padding: "50px" }}>
//       <h2>Redirecting to Razorpay Checkout...</h2>
//       <p>🚀 Please do not refresh this page.</p>
//     </div>
//   );
// };

// export default PaymentPage;























// // src/pages/PaymentPage.jsx
// import React, { useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";

// const RAZORPAY_KEY_ID = "rzp_test_YK2tGGnqcok3dj"; 
// // ✅ Use env variable, not hardcoded

// const PaymentPage = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const razorpayData = location.state?.razorpayData;
//   const selectedAddress = location.state?.selectedAddress;

//   useEffect(() => {
//     if (!razorpayData || !selectedAddress) {
//       alert("⚠ Missing payment data. Redirecting to cart.");
//       navigate("/cartpage");
//       return;
//     }

//     const loadRazorpay = () => {
//       return new Promise((resolve, reject) => {
//         if (window.Razorpay) {
//           resolve(true);
//           return;
//         }
//         const script = document.createElement("script");
//         script.src = "https://checkout.razorpay.com/v1/checkout.js";
//         script.async = true;
//         script.onload = () => (window.Razorpay ? resolve(true) : reject(new Error("Razorpay SDK not available")));
//         script.onerror = () => reject(new Error("Failed to load Razorpay SDK"));
//         document.body.appendChild(script);
//       });
//     };

//     const startPayment = async () => {
//       try {
//         const loaded = await loadRazorpay();
//         if (!loaded) {
//           alert("❌ Razorpay SDK failed to load. Try again later.");
//           return;
//         }

//         const options = {
//           key: RAZORPAY_KEY_ID,
//           amount: Math.round(razorpayData.amount * 100), // paise
//           currency: razorpayData.currency || "INR",
//           name: "Joyory E-Commerce",
//           description: "Order Payment",
//           order_id: razorpayData.razorpayOrderId, // must match backend-created order_id
//           prefill: {
//             name: selectedAddress.name || "Customer",
//             email: selectedAddress.email || "",
//             contact: selectedAddress.phone || "",
//           },
//           notes: {
//             address: `${selectedAddress.addressLine1}, ${selectedAddress.city}, ${selectedAddress.state} - ${selectedAddress.pincode}`,
//           },
//           theme: { color: "#F37254" },

//           handler: async function (response) {
//             try {
//               const res = await fetch(
//                 "https://beauty.joyory.com/api/payment/razorpay/verify",
//                 {
//                   method: "POST",
//                   headers: {
//                     "Content-Type": "application/json",
//                     Authorization: `Bearer ${sessionStorage.getItem("token")}`, 
//                     // ✅ use sessionStorage for security
//                   },
//                   body: JSON.stringify({
//                     razorpay_order_id: response.razorpay_order_id,
//                     razorpay_payment_id: response.razorpay_payment_id,
//                     razorpay_signature: response.razorpay_signature,
//                     shippingAddress: selectedAddress,
//                   }),
//                   credentials: "include", // ✅ ensures secure cookie/JWT
//                 }
//               );

//               const data = await res.json();

//               if (!res.ok || !data.success) {
//                 alert("⚠ Payment verified but backend rejected: " + (data.message || "Verification failed"));
//                 return navigate("/cartpage");
//               }

//               navigate("/ordersuccess", {
//                 state: { paymentResponse: response, backendResponse: data },
//               });
//             } catch (err) {
//               console.error("🔥 Error saving payment info:", err);
//               alert("Payment succeeded but saving info failed.");
//               navigate("/cartpage");
//             }
//           },

//           modal: {
//             ondismiss: function () {
//               alert("❌ Payment popup closed. Payment not completed.");
//               navigate("/cartpage");
//             },
//           },
//         };

//         const rzp = new window.Razorpay(options);

//         rzp.on("payment.failed", function (response) {
//           console.error("Payment Failed:", response.error);
//           alert("❌ Payment Failed: " + response.error.description);
//           navigate("/cartpage");
//         });

//         rzp.open();
//       } catch (error) {
//         console.error("🔥 Error loading Razorpay:", error);
//         alert("❌ Could not initialize Razorpay. Please refresh and try again.");
//       }
//     };

//     startPayment();
//   }, [razorpayData, selectedAddress, navigate]);

//   return (
//     <div style={{ textAlign: "center", padding: "50px" }}>
//       <h2>Redirecting to Razorpay Checkout...</h2>
//       <p>🚀 Please do not refresh this page.</p>
//     </div>
//   );
// };

// export default PaymentPage;

























// // src/pages/PaymentPage.jsx
// import React, { useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";

// // ⚠ Move to .env in production, as you've noted!
// const RAZORPAY_KEY_ID = "rzp_test_YK2tGGnqcok3dj"; 

// const PaymentPage = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const razorpayData = location.state?.razorpayData;
//   const selectedAddress = location.state?.selectedAddress;

//   useEffect(() => {
//     if (!razorpayData || !selectedAddress) {
//       alert("⚠ Missing payment data. Redirecting to cart.");
//       navigate("/cartpage");
//       return;
//     }

//     const loadRazorpay = () =>
//       new Promise((resolve, reject) => {
//         if (window.Razorpay) {
//           resolve(true);
//           return;
//         }
//         const script = document.createElement("script");
//         script.src = "https://checkout.razorpay.com/v1/checkout.js";
//         script.async = true;
//         script.onload = () =>
//           window.Razorpay ? resolve(true) : reject(new Error("Razorpay SDK not available"));
//         script.onerror = () => reject(new Error("Failed to load Razorpay SDK"));
//         document.body.appendChild(script);
//       });

//     const startPayment = async () => {
//       try {
//         const loaded = await loadRazorpay();
//         if (!loaded) {
//           alert("❌ Razorpay SDK failed to load.");
//           return;
//         }

//         const options = {
//           key: RAZORPAY_KEY_ID,
//           amount: Math.round(razorpayData.amount * 100),
//           currency: razorpayData.currency || "INR",
//           name: "Joyory E-Commerce",
//           description: "Order Payment",
//           order_id: razorpayData.razorpayOrderId,
//           prefill: {
//             name: selectedAddress.name || "Customer",
//             email: selectedAddress.email || "",
//             contact: selectedAddress.phone || "",
//           },
//           notes: {
//             address: `${selectedAddress.addressLine1}, ${selectedAddress.city}, ${selectedAddress.state} - ${selectedAddress.pincode}`,
//           },
//           theme: { color: "#F37254" },

//           handler: async function (response) {
//             try {
//               const res = await fetch(
//                 "https://beauty.joyory.com/api/payment/razorpay/verify",
//                 {
//                   method: "POST",
//                   headers: {
//                     "Content-Type": "application/json",
//                     // ⚙️ The only change: from sessionStorage to localStorage
//                     Authorization: `Bearer ${localStorage.getItem("token")}`, 
//                   },
//                   body: JSON.stringify({
//                     razorpay_order_id: response.razorpay_order_id,
//                     razorpay_payment_id: response.razorpay_payment_id,
//                     razorpay_signature: response.razorpay_signature,
//                     orderId: razorpayData.orderId,
//                     shippingAddress: selectedAddress,
//                   }),
//                 }
//               );

//               const data = await res.json();

//               if (!res.ok || !data.success) {
//                 console.error("❌ Backend verification failed:", data);
//                 alert(
//                   "⚠ Payment verified but backend rejected: " +
//                     (data.message || "Verification failed")
//                 );
//                 return navigate("/cartpage");
//               }

//               navigate("/ordersuccess", {
//                 state: { paymentResponse: response, backendResponse: data },
//               });
//             } catch (err) {
//               console.error("🔥 Error saving payment info:", err);
//               alert("Payment succeeded but saving info failed.");
//               navigate("/cartpage");
//             }
//           },

//           modal: {
//             ondismiss: function () {
//               alert("❌ Payment popup closed. Payment not completed.");
//               navigate("/cartpage");
//             },
//           },
//         };

//         const rzp = new window.Razorpay(options);

//         rzp.on("payment.failed", function (response) {
//           console.error("Payment Failed:", response.error);
//           alert("❌ Payment Failed: " + response.error.description);
//           navigate("/cartpage");
//         });

//         rzp.open();
//       } catch (error) {
//         console.error("🔥 Error loading Razorpay:", error);
//         alert("❌ Could not initialize Razorpay.");
//       }
//     };

//     startPayment();
//   }, [razorpayData, selectedAddress, navigate]);

//   return (
//     <div style={{ textAlign: "center", padding: "50px" }}>
//       <h2>Redirecting to Razorpay Checkout...</h2>
//       <p>🚀 Please do not refresh this page.</p>
//     </div>
//   );
// };

// export default PaymentPage;











// // src/pages/PaymentPage.jsx
// import React, { useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";

// const RAZORPAY_KEY_ID = "rzp_live_V7ncMRhIoJhW2N";

// const PaymentPage = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const razorpayData = location.state?.razorpayData;
//   const selectedAddress = location.state?.selectedAddress;
//   const cartItems = location.state?.cartItems; // ✅ get cart items from location.state

//   useEffect(() => {
//     if (!razorpayData || !selectedAddress || !cartItems) {
//       alert("⚠ Missing payment/cart data. Redirecting to cart.");
//       navigate("/cartpage");
//       return;
//     }

//     const loadRazorpay = () =>
//       new Promise((resolve, reject) => {
//         if (window.Razorpay) {
//           resolve(true);
//           return;
//         }
//         const script = document.createElement("script");
//         script.src = "https://checkout.razorpay.com/v1/checkout.js";
//         script.async = true;
//         script.onload = () =>
//           window.Razorpay ? resolve(true) : reject(new Error("Razorpay SDK not available"));
//         script.onerror = () => reject(new Error("Failed to load Razorpay SDK"));
//         document.body.appendChild(script);
//       });

//     const startPayment = async () => {
//       try {
//         const loaded = await loadRazorpay();
//         if (!loaded) {
//           alert("❌ Razorpay SDK failed to load.");
//           return;
//         }

//         const options = {
//           key: RAZORPAY_KEY_ID,
//           amount: Math.round(razorpayData.amount * 100),
//           currency: razorpayData.currency || "INR",
//           name: "Joyory E-Commerce",
//           description: "Order Payment",
//           order_id: razorpayData.razorpayOrderId,
//           prefill: {
//             name: selectedAddress.name || "Customer",
//             email: selectedAddress.email || "",
//             contact: selectedAddress.phone || "",
//           },
//           notes: {
//             address: `${selectedAddress.addressLine1}, ${selectedAddress.city}, ${selectedAddress.state} - ${selectedAddress.pincode}`,
//           },
//           theme: { color: "#F37254" },

//           handler: async function (response) {
//             // ✅ Build final payload with fallback for brand
//             const payload = {
//               razorpay_order_id: response.razorpay_order_id,
//               razorpay_payment_id: response.razorpay_payment_id,
//               razorpay_signature: response.razorpay_signature,
//               orderId: razorpayData.orderId,
//               shippingAddress: selectedAddress,
//               cart: cartItems.map(item => ({
//                 productId: item.productId || item._id || item.product?._id, // fallback
//                 name: item.name || item.product?.name || "Unnamed Product",
//                 brand: item.brand || item.product?.brand || "Default Brand", // ✅ ensures brand always exists
//                 shade: item.shade || item.product?.shade || "N/A",
//                 quantity: item.quantity,
//                 price: item.price || item.product?.price || 0,
//               })),

//             };

//             console.log("🚀 Final payload sent to backend:", payload);

//             try {
//               const res = await fetch(
//                 "https://beauty.joyory.com/api/payment/razorpay/verify",
//                 {
//                   method: "POST",
//                   headers: {
//                     "Content-Type": "application/json",
//                     Authorization: `Bearer ${localStorage.getItem("token")}`,
//                   },
//                   body: JSON.stringify(payload),
//                 }
//               );

//               const data = await res.json();

//               if (!res.ok || !data.success) {
//                 console.error("❌ Backend verification failed:", data);
//                 alert(
//                   "⚠ Payment verified but backend rejected: " +
//                   (data.message || "Verification failed")
//                 );
//                 return navigate("/cartpage");
//               }

//               navigate("/ordersuccess", {
//                 state: { paymentResponse: response, backendResponse: data },
//               });
//             } catch (err) {
//               console.error("🔥 Error saving payment info:", err);
//               alert("Payment succeeded but saving info failed.");
//               navigate("/cartpage");
//             }
//           },

//           modal: {
//             ondismiss: function () {
//               alert("❌ Payment popup closed. Payment not completed.");
//               navigate("/cartpage");
//             },
//           },
//         };

//         const rzp = new window.Razorpay(options);

//         rzp.on("payment.failed", function (response) {
//           console.error("Payment Failed:", response.error);
//           alert("❌ Payment Failed: " + response.error.description);
//           navigate("/cartpage");
//         });

//         rzp.open();
//       } catch (error) {
//         console.error("🔥 Error loading Razorpay:", error);
//         alert("❌ Could not initialize Razorpay.");
//       }
//     };

//     startPayment();
//   }, [razorpayData, selectedAddress, cartItems, navigate]);

//   return (
//     <div style={{ textAlign: "center", padding: "50px" }}>
//       <h2>Redirecting to Razorpay Checkout...</h2>
//       <p>🚀 Please do not refresh this page.</p>
//     </div>
//   );
// };

// export default PaymentPage;





















// // src/pages/PaymentPage.jsx
// import React, { useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";

// const RAZORPAY_KEY_ID = "rzp_live_V7ncMRhIoJhW2N"; // Use test key in dev if needed

// const PaymentPage = () => {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const razorpayData = location.state?.razorpayData;
//   const selectedAddress = location.state?.selectedAddress;
//   const cartItems = location.state?.cartItems;
//   const priceDetails = location.state?.priceDetails;

//   useEffect(() => {
//     if (!razorpayData || !selectedAddress || !cartItems) {
//       alert("⚠ Missing payment/cart data. Redirecting to cart.");
//       navigate("/cartpage");
//       return;
//     }

//     // ✅ Load Razorpay SDK dynamically
//     const loadRazorpay = () =>
//       new Promise((resolve, reject) => {
//         if (window.Razorpay) return resolve(true);
//         const script = document.createElement("script");
//         script.src = "https://checkout.razorpay.com/v1/checkout.js";
//         script.async = true;
//         script.onload = () => (window.Razorpay ? resolve(true) : reject(new Error("Razorpay SDK not available")));
//         script.onerror = () => reject(new Error("Failed to load Razorpay SDK"));
//         document.body.appendChild(script);
//       });

//     const startPayment = async () => {
//       try {
//         const loaded = await loadRazorpay();
//         if (!loaded) {
//           alert("❌ Razorpay SDK failed to load.");
//           return;
//         }

//         // ✅ Setup Razorpay options
//         const options = {
//           key: RAZORPAY_KEY_ID,
//           amount: Math.round(razorpayData.amount * 100), // Convert ₹ to paise
//           currency: razorpayData.currency || "INR",
//           name: "Joyory E-Commerce",
//           description: "Order Payment",
//           // order_id: razorpayData.razorpayOrderId, // from backend
//           order_id: razorpayData.razorpayOrderId || razorpayData.orderId,
//           prefill: {
//             name: selectedAddress.name || "Customer",
//             email: selectedAddress.email || "",
//             contact: selectedAddress.phone || "",
//           },
//           notes: {
//             address: `${selectedAddress.addressLine1}, ${selectedAddress.city}, ${selectedAddress.state} - ${selectedAddress.pincode}`,
//           },
//           theme: { color: "#F37254" },

//           // ✅ On payment success
//           handler: async function (response) {
//             const payload = {
//               razorpay_order_id: response.razorpay_order_id,
//               razorpay_payment_id: response.razorpay_payment_id,
//               razorpay_signature: response.razorpay_signature,
//               orderId: razorpayData.orderId,
//               shippingAddress: selectedAddress,
//               cart: cartItems.map(item => ({
//                 productId: item.productId || item._id || item.product?._id,
//                 name: item.name || item.product?.name || "Unnamed Product",
//                 brand: item.brand || item.product?.brand || "Default Brand",
//                 shade: item.shade || item.product?.shade || "N/A",
//                 quantity: item.quantity,
//                 price: item.price || item.product?.price || 0,
//               })),
//               totalAmount: priceDetails?.payable || razorpayData.amount,
//             };

//             console.log("🚀 Sending payment verification payload:", payload);

//             try {
//               const res = await fetch("https://beauty.joyory.com/api/payment/razorpay/verify", {
//                 method: "POST",
//                 headers: {
//                   "Content-Type": "application/json",
//                   Authorization: `Bearer ${localStorage.getItem("token")}`,
//                 },
//                 body: JSON.stringify(payload),
//               });

//               const data = await res.json();

//               if (!res.ok || !data.success) {
//                 console.error("❌ Backend verification failed:", data);
//                 alert("⚠ Payment verified but backend rejected. " + (data.message || "Verification failed"));
//                 return navigate("/cartpage");
//               }

//               // ✅ Navigate to order success page
//               navigate("/ordersuccess", {
//                 state: { paymentResponse: response, backendResponse: data },
//               });
//             } catch (err) {
//               console.error("🔥 Error saving payment info:", err);
//               alert("Payment succeeded but saving info failed.");
//               navigate("/cartpage");
//             }
//           },

//           modal: {
//             ondismiss: function () {
//               alert("❌ Payment popup closed. Payment not completed.");
//               navigate("/cartpage");
//             },
//           },
//         };

//         const rzp = new window.Razorpay(options);

//         // ✅ Handle payment failure
//         rzp.on("payment.failed", function (response) {
//           console.error("Payment Failed:", response.error);
//           alert("❌ Payment Failed: " + response.error.description);
//           navigate("/cartpage");
//         });

//         // ✅ Open Razorpay checkout
//         rzp.open();
//       } catch (error) {
//         console.error("🔥 Error initializing Razorpay:", error);
//         alert("❌ Could not initialize Razorpay.");
//         navigate("/cartpage");
//       }
//     };

//     startPayment();
//   }, [razorpayData, selectedAddress, cartItems, navigate, priceDetails]);

//   return (
//     <div style={{ textAlign: "center", padding: "50px" }}>
//       <h2>Redirecting to Razorpay Checkout...</h2>
//       <p>🚀 Please do not refresh or close this page.</p>
//     </div>
//   );
// };

// export default PaymentPage;







// // src/pages/PaymentPage.jsx
// import React, { useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";

// const RAZORPAY_KEY_ID = "rzp_live_V7ncMRhIoJhW2N";

// const PaymentPage = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const razorpayData = location.state?.razorpayData;
//   const selectedAddress = location.state?.selectedAddress;
//   const cartItems = location.state?.cartItems;

//   useEffect(() => {
//     if (!razorpayData || !selectedAddress || !cartItems) {
//       alert("⚠ Missing payment/cart data. Redirecting to cart.");
//       navigate("/cartpage");
//       return;
//     }

//     const loadRazorpayScript = () =>
//       new Promise((resolve, reject) => {
//         if (window.Razorpay) return resolve(true);
//         const script = document.createElement("script");
//         script.src = "https://checkout.razorpay.com/v1/checkout.js";
//         script.async = true;
//         script.onload = () => (window.Razorpay ? resolve(true) : reject(false));
//         script.onerror = () => reject(false);
//         document.body.appendChild(script);
//       });

//     const startPayment = async () => {
//       try {
//         const loaded = await loadRazorpayScript();
//         if (!loaded) {
//           alert("❌ Razorpay SDK failed to load.");
//           return;
//         }

//         // const options = {
//         //   key: RAZORPAY_KEY_ID,
//         //   amount: razorpayData.amount, // Already in paise from server
//         //   currency: razorpayData.currency,
//         //   name: "Joyory E-Commerce",
//         //   description: "Order Payment",
//         //   order_id: razorpayData.razorpayOrderId, // server-generated
//         //   prefill: {
//         //     name: selectedAddress.name || "Customer",
//         //     email: selectedAddress.email || "",
//         //     contact: selectedAddress.phone || "",
//         //   },
//         //   notes: {
//         //     address: `${selectedAddress.addressLine1}, ${selectedAddress.city}, ${selectedAddress.state} - ${selectedAddress.pincode}`,
//         //   },
//         //   theme: { color: "#F37254" },



//         const options = {
//           key: RAZORPAY_KEY_ID,
//           amount: razorpayData.amount,
//           currency: razorpayData.currency,
//           name: "Joyory E-Commerce",
//           description: "Order Payment",
//           order_id: razorpayData.razorpayOrderId,
//           prefill: {
//             name: selectedAddress.name,
//             email: selectedAddress.email,
//             contact: selectedAddress.phone,
//           },
//           notes: {
//             address: `${selectedAddress.addressLine1}, ${selectedAddress.city}, ${selectedAddress.state} - ${selectedAddress.pincode}`,
//           },
//           theme: { color: "#F37254" },
//           handler: async function (response) {
//             const payload = {
//               razorpay_order_id: response.razorpay_order_id,
//               razorpay_payment_id: response.razorpay_payment_id,
//               razorpay_signature: response.razorpay_signature,
//               orderId: razorpayData.orderId,
//               shippingAddress: selectedAddress,
//               cart: cartItems.map(item => ({
//                 productId: item.productId || item._id || item.product?._id,
//                 name: item.name || item.product?.name || "Unnamed Product",
//                 brand: item.brand || item.product?.brand || "Default Brand",
//                 shade: item.shade || item.product?.shade || "N/A",
//                 quantity: item.quantity,
//                 price: item.price || item.product?.price || 0,
//               })),
//             };

//             // try {
//             //   const res = await fetch(
//             //     "https://beauty.joyory.com/api/payment/razorpay/verify",
//             //     {
//             //       method: "POST",
//             //       headers: {
//             //         "Content-Type": "application/json",
//             //         Authorization: `Bearer ${localStorage.getItem("token")}`,
//             //       },
//             //       body: JSON.stringify(payload),
//             //     }
//             //   );


//             try {
//               const res = await fetch(
//                 "https://beauty.joyory.com/api/payment/razorpay/verify",
//                 {
//                   method: "POST",
//                   headers: {
//                     "Content-Type": "application/json",
//                   },
//                   credentials: "include", // <--- this sends HTTP-only cookies
//                   body: JSON.stringify(payload),
//                 }
//               );

//               const data = await res.json();

//               if (!res.ok || !data.success) {
//                 alert("⚠ Payment verified but backend rejected: " + (data.message || "Verification failed"));
//                 return navigate("/cartpage");
//               }

//               navigate("/ordersuccess", {
//                 state: { paymentResponse: response, backendResponse: data },
//               });
//             } catch (err) {
//               console.error("🔥 Error saving payment info:", err);
//               alert("Payment succeeded but saving info failed.");
//               navigate("/cartpage");
//             }
//           },
//           modal: {
//             ondismiss: function () {
//               alert("❌ Payment popup closed. Payment not completed.");
//               navigate("/cartpage");
//             },
//           },
//         };

//         const rzp = new window.Razorpay(options);

//         rzp.on("payment.failed", function (response) {
//           console.error("Payment Failed:", response.error);
//           alert("❌ Payment Failed: " + response.error.description);
//           navigate("/cartpage");
//         });

//         rzp.open();
//       } catch (error) {
//         console.error("🔥 Error loading Razorpay:", error);
//         alert("❌ Could not initialize Razorpay.");
//       }
//     };

//     startPayment();
//   }, [razorpayData, selectedAddress, cartItems, navigate]);

//   return (
//     <div style={{ textAlign: "center", padding: "50px" }}>
//       <h2>Redirecting to Razorpay Checkout...</h2>
//       <p>🚀 Please do not refresh this page.</p>
//     </div>
//   );
// };

// export default PaymentPage;












// src/pages/PaymentPage.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const RAZORPAY_KEY_ID = "rzp_test_RHpYsCY6tqQ3TW";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const razorpayData = location.state?.razorpayData;
  const selectedAddress = location.state?.selectedAddress;
  const cartItems = location.state?.cartItems;

  useEffect(() => {
    if (!razorpayData || !selectedAddress || !cartItems) {
      alert("⚠ Missing payment/cart data. Redirecting to cart.");
      navigate("/cartpage");
      return;
    }

    const loadRazorpayScript = () =>
      new Promise((resolve, reject) => {
        if (window.Razorpay) return resolve(true);
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        script.onload = () => (window.Razorpay ? resolve(true) : reject(false));
        script.onerror = () => reject(false);
        document.body.appendChild(script);
      });

    const startPayment = async () => {
      try {
        const loaded = await loadRazorpayScript();
        if (!loaded) {
          alert("❌ Razorpay SDK failed to load.");
          return;
        }

        // ✅ Call backend to create Razorpay order
        const res = await fetch(
          "https://beauty.joyory.com/api/payment/razorpay/order",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ orderId: razorpayData.orderId }),
          }
        );

        // Check if response is JSON
        let data;
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          data = await res.json();
        } else {
          const text = await res.text();
          console.error("⚠ Backend did not return JSON:", text);
          alert("❌ Failed to create Razorpay order. Backend error.");
          return navigate("/cartpage");
        }

        if (!res.ok || !data.success) {
          alert("❌ Failed to create Razorpay order: " + (data.message || ""));
          return navigate("/cartpage");
        }

        const razorpayOrderId = data.razorpayOrderId;
        const amountInPaise = Math.round(data.amount * 100);

        const options = {
          key: RAZORPAY_KEY_ID,
          amount: amountInPaise,
          currency: "INR",
          name: "Joyory E-Commerce",
          description: "Order Payment",
          order_id: razorpayOrderId,
          prefill: {
            name: selectedAddress.name,
            email: selectedAddress.email,
            contact: selectedAddress.phone,
          },
          notes: {
            address: `${selectedAddress.addressLine1}, ${selectedAddress.city}, ${selectedAddress.state} - ${selectedAddress.pincode}`,
          },
          theme: { color: "#F37254" },
          handler: async (response) => {
            const payload = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: razorpayData.orderId,
              shippingAddress: selectedAddress,
              cart: cartItems.map((item) => ({
                productId: item.productId || item._id || item.product?._id,
                name: item.name || item.product?.name || "Unnamed Product",
                quantity: item.quantity,
                price: item.price || item.product?.price || 0,
              })),
            };

            try {
              const verifyRes = await fetch(
                "https://beauty.joyory.com/api/payment/razorpay/verify",
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  credentials: "include",
                  body: JSON.stringify(payload),
                }
              );

              let verifyData;
              const contentType = verifyRes.headers.get("content-type");
              if (contentType && contentType.includes("application/json")) {
                verifyData = await verifyRes.json();
              } else {
                const text = await verifyRes.text();
                console.error("⚠ Backend did not return JSON:", text);
                alert("⚠ Payment verification failed. Backend error.");
                return navigate("/cartpage");
              }

              if (!verifyRes.ok || !verifyData.success) {
                alert(
                  "⚠ Payment verified but backend rejected: " +
                    (verifyData.message || "Verification failed")
                );
                return navigate("/cartpage");
              }

              navigate("/ordersuccess", {
                state: { paymentResponse: response, backendResponse: verifyData },
              });
            } catch (err) {
              console.error("🔥 Error saving payment info:", err);
              alert("Payment succeeded but saving info failed.");
              navigate("/cartpage");
            }
          },
          modal: {
            ondismiss: function () {
              alert("❌ Payment popup closed. Payment not completed.");
              navigate("/cartpage");
            },
          },
        };

        const rzp = new window.Razorpay(options);

        rzp.on("payment.failed", function (response) {
          console.error("Payment Failed:", response.error);
          alert("❌ Payment Failed: " + response.error.description);
          navigate("/cartpage");
        });

        rzp.open();
      } catch (error) {
        console.error("🔥 Error loading Razorpay:", error);
        alert("❌ Could not initialize Razorpay.");
      } finally {
        setLoading(false);
      }
    };

    startPayment();
  }, [razorpayData, selectedAddress, cartItems, navigate]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <h2>Redirecting to Razorpay Checkout...</h2>
        <p>🚀 Please do not refresh this page.</p>
      </div>
    );
  }

  return null;
};

export default PaymentPage;
