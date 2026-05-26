// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate, useLocation } from "react-router-dom";
// import Header from "./Header";
// import Footer from "./Footer";
// import "../css/PaymentProcess.css";

// const PAYMENT_METHODS_API =
//   "https://beauty.joyory.com/api/payment/methods";
// const RAZORPAY_ORDER_API =
//   "https://beauty.joyory.com/api/payment/razorpay/order";
// const VERIFY_PAYMENT_API =
//   "https://beauty.joyory.com/api/payment/razorpay/verify";
// const COD_API = "https://beauty.joyory.com/api/payment/cod";
// const COD_CONFIRM_API =
//   "https://beauty.joyory.com/api/payment/cod/confirm";
// const SET_PAYMENT_METHOD_API =
//   "https://beauty.joyory.com/api/payment/set-payment-method";
// const WALLET_API = "https://beauty.joyory.com/api/payment/wallet";
// const GIFTCARD_API =
//   "https://beauty.joyory.com/api/payment/giftcard";
// // const RAZORPAY_KEY_ID = "rzp_test_RHpYsCY6tqQ3TW";
// const RAZORPAY_KEY_ID = "rzp_live_V7ncMRhIoJhW2N";

// const PaymentProcess = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [methods, setMethods] = useState([]);
//   const [activeTab, setActiveTab] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isProcessing, setIsProcessing] = useState(false);

//   const orderId = location.state?.orderId;
//   const cartItems = location.state?.cartItems || [];
//   const selectedAddress = location.state?.selectedAddress;
//   const priceDetails = location.state?.priceDetails || {};

//   const loadRazorpayScript = () =>
//     new Promise((resolve) => {
//       if (window.Razorpay) return resolve(true);
//       const script = document.createElement("script");
//       script.src = "https://checkout.razorpay.com/v1/checkout.js";
//       script.onload = () => resolve(true);
//       script.onerror = () => resolve(false);
//       document.body.appendChild(script);
//     });

//   useEffect(() => {
//     const fetchMethods = async () => {
//       try {
//         const res = await axios.get(PAYMENT_METHODS_API, {
//           withCredentials: true,
//         });
//         const backendMethods = res.data.methods || [];
//         const hasCOD = backendMethods.some((m) => m.key === "cod");
//         setMethods(
//           hasCOD
//             ? backendMethods
//             : [...backendMethods, { key: "cod", name: "Cash on Delivery" }]
//         );
//       } catch {
//         setMethods([
//           { key: "card", name: "Credit / Debit Card" },
//           { key: "upi", name: "UPI" },
//           { key: "cod", name: "Cash on Delivery" },
//           { key: "wallet", name: "Wallet" },
//           { key: "giftcard", name: "Gift Card" },
//         ]);
//       } finally {
//         setLoading(false);
//         loadRazorpayScript();
//       }
//     };
//     fetchMethods();
//   }, []);

//   const handleSelectMethod = async (methodKey) => {
//     setActiveTab(methodKey);
//     if (!orderId) return;
//     try {
//       await fetch(SET_PAYMENT_METHOD_API, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify({
//           orderId,
//           paymentMethod: methodKey.toUpperCase(),
//         }),
//       });
//     } catch (err) {
//       console.error("Error updating payment method:", err);
//     }
//   };

//   const handleCashOnDelivery = async () => {
//     try {
//       setIsProcessing(true);
//       const cleanAddress = {
//         name: selectedAddress?.name || "",
//         phone: selectedAddress?.phone || "",
//         email: selectedAddress?.email || "",
//         addressLine1: selectedAddress?.addressLine1 || "",
//         city: selectedAddress?.city || "",
//         state: selectedAddress?.state || "",
//         pincode: String(selectedAddress?.pincode || "").trim(),
//       };
//       const payload = {
//         orderId,
//         orderType: "cod",
//         shippingAddress: cleanAddress,
//       };

//       const codRes = await fetch(COD_API, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify(payload),
//       });
//       const codData = await codRes.json();
//       if (!codRes.ok || !codData.success) throw new Error("COD failed.");

//       const confirmRes = await fetch(COD_CONFIRM_API, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify(payload),
//       });
//       const confirmData = await confirmRes.json();
//       if (!confirmRes.ok || !confirmData.success)
//         throw new Error("COD confirmation failed.");

//       navigate("/ordersuccess", {
//         state: {
//           paymentResponse: confirmData,
//           backendResponse: confirmData,
//           shippingCharge: priceDetails.shipping || 0,
//           discountDetails: {
//             bagDiscount: priceDetails.bagDiscount || 0,
//             autoDiscount: priceDetails.autoDiscount || 0,
//             couponDiscount: priceDetails.couponDiscount || 0,
//           },
//           totalDiscount:
//             (priceDetails.bagDiscount || 0) +
//             (priceDetails.autoDiscount || 0) +
//             (priceDetails.couponDiscount || 0),
//           payable: priceDetails.payable || 0,
//           bagMrp: priceDetails.bagMrp || 0, // ✅ Added this line
//         },
//       });
//     } catch (err) {
//       console.error("COD Exception:", err);
//       alert(err.message || "COD process failed.");
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const handleRazorpayPayment = async () => {
//     try {
//       setIsProcessing(true);
//       await fetch(SET_PAYMENT_METHOD_API, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify({ orderId, paymentMethod: "ONLINE" }),
//       });

//       const loaded = await loadRazorpayScript();
//       if (!loaded || !window.Razorpay)
//         return alert("Razorpay SDK failed to load.");

//       const orderRes = await fetch(RAZORPAY_ORDER_API, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify({ orderId }),
//       });
//       const orderData = await orderRes.json();
//       if (!orderRes.ok || !orderData.success || !orderData.razorpayOrderId)
//         return alert(orderData.message || "Failed to create Razorpay order.");

//       const finalAmountToPay = Math.round(
//         (priceDetails.payable || orderData.amount) * 100
//       );

//       const options = {
//         key: RAZORPAY_KEY_ID,
//         amount: finalAmountToPay,
//         currency: "INR",
//         name: "Joyory E-Commerce",
//         description: "Order Payment",
//         order_id: orderData.razorpayOrderId,
//         prefill: {
//           name: selectedAddress?.name || "User",
//           email: selectedAddress?.email || "user@example.com",
//           contact: selectedAddress?.phone || "",
//         },
//         notes: {
//           address: `${selectedAddress?.addressLine1}, ${selectedAddress?.city}, ${selectedAddress?.state} - ${selectedAddress?.pincode}`,
//         },
//         theme: { color: "#F37254" },
//         handler: async (response) => {
//           const payload = {
//             razorpay_order_id: response.razorpay_order_id,
//             razorpay_payment_id: response.razorpay_payment_id,
//             razorpay_signature: response.razorpay_signature,
//             orderId,
//             shippingAddress: selectedAddress,
//             cart: cartItems.map((item) => ({
//               productId: item.productId || item._id || item.product?._id,
//               name: item.name || item.product?.name || "Unnamed Product",
//               quantity: item.quantity,
//               price: item.price || item.product?.price || 0,
//             })),
//           };

//           const verifyRes = await fetch(VERIFY_PAYMENT_API, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             credentials: "include",
//             body: JSON.stringify(payload),
//           });
//           const verifyData = await verifyRes.json();
//           if (!verifyRes.ok || !verifyData.success)
//             return alert("Payment verification failed.");

//           navigate("/ordersuccess", {
//             state: {
//               paymentResponse: response,
//               backendResponse: verifyData,
//               shippingCharge: priceDetails.shipping || 0,
//               discountDetails: {
//                 bagDiscount: priceDetails.bagDiscount || 0,
//                 autoDiscount: priceDetails.autoDiscount || 0,
//                 couponDiscount: priceDetails.couponDiscount || 0,
//               },
//               totalDiscount:
//                 (priceDetails.bagDiscount || 0) +
//                 (priceDetails.autoDiscount || 0) +
//                 (priceDetails.couponDiscount || 0),
//               payable: priceDetails.payable || 0,
//               bagMrp: priceDetails.bagMrp || 0, // ✅ Added here too
//             },
//           });
//         },
//         modal: {
//           ondismiss: () => {
//             alert("Payment popup closed.");
//             navigate("/cartpage");
//           },
//         },
//       };

//       const rzp = new window.Razorpay(options);
//       rzp.on("payment.failed", (response) => {
//         alert("Payment Failed: " + response.error.description);
//         navigate("/cartpage");
//       });
//       rzp.open();
//     } catch (error) {
//       console.error("Error starting Razorpay:", error);
//       alert("Failed to open Razorpay.");
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const handleWalletPayment = async () => {
//     if (!orderId || !selectedAddress) {
//       alert("Missing order ID or shipping address.");
//       return;
//     }

//     try {
//       setIsProcessing(true);

//       const payload = {
//         orderId,
//         shippingAddress: {
//           name: selectedAddress.name || "",
//           addressLine1: selectedAddress.addressLine1 || "",
//           city: selectedAddress.city || "",
//           state: selectedAddress.state || "",
//           pincode: String(selectedAddress.pincode || "").trim(),
//           phone: selectedAddress.phone || "",
//           email: selectedAddress.email || "",
//         },
//       };

//       const res = await fetch(WALLET_API, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify(payload),
//       });

//       const data = await res.json();

//       if (!res.ok || !data.success)
//         throw new Error(data.message || "Wallet payment failed.");

//       // Navigate to order success page
//       navigate("/ordersuccess", {
//         state: {
//           paymentResponse: data,
//           backendResponse: data,
//           shippingCharge: priceDetails.shipping || 0,
//           discountDetails: {
//             bagDiscount: priceDetails.bagDiscount || 0,
//             autoDiscount: priceDetails.autoDiscount || 0,
//             couponDiscount: priceDetails.couponDiscount || 0,
//           },
//           totalDiscount:
//             (priceDetails.bagDiscount || 0) +
//             (priceDetails.autoDiscount || 0) +
//             (priceDetails.couponDiscount || 0),
//           payable: priceDetails.payable || 0,
//           bagMrp: priceDetails.bagMrp || 0,
//         },
//       });
//     } catch (err) {
//       console.error("Wallet payment error:", err);
//       alert(err.message || "Wallet payment failed.");
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const handleGiftCardPayment = async (giftCardCode, giftCardPin) => {
//     if (!orderId || !selectedAddress) {
//       alert("Missing order ID or shipping address.");
//       return;
//     }

//     try {
//       setIsProcessing(true);

//       const payload = {
//         orderId,
//         giftCardCode,
//         giftCardPin,
//         shippingAddress: {
//           name: selectedAddress.name || "",
//           addressLine1: selectedAddress.addressLine1 || "",
//           city: selectedAddress.city || "",
//           state: selectedAddress.state || "",
//           pincode: String(selectedAddress.pincode || "").trim(),
//           phone: selectedAddress.phone || "",
//           email: selectedAddress.email || "",
//         },
//       };

//       const res = await fetch(GIFTCARD_API, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify(payload),
//       });

//       const data = await res.json();

//       if (!res.ok || !data.success)
//         throw new Error(data.message || "Gift Card payment failed.");

//       // Navigate to order success page
//       navigate("/ordersuccess", {
//         state: {
//           paymentResponse: data,
//           backendResponse: data,
//           shippingCharge: priceDetails.shipping || 0,
//           discountDetails: {
//             bagDiscount: priceDetails.bagDiscount || 0,
//             autoDiscount: priceDetails.autoDiscount || 0,
//             couponDiscount: priceDetails.couponDiscount || 0,
//           },
//           totalDiscount:
//             (priceDetails.bagDiscount || 0) +
//             (priceDetails.autoDiscount || 0) +
//             (priceDetails.couponDiscount || 0),
//           payable: priceDetails.payable || 0,
//           bagMrp: priceDetails.bagMrp || 0,
//         },
//       });
//     } catch (err) {
//       console.error("Gift Card payment error:", err);
//       alert(err.message || "Gift Card payment failed.");
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   return (
//     <>
//       <Header />
//       <div className="container my-4">
//         {loading ? (
//           <div className="text-center">Loading payment options...</div>
//         ) : (
//           <>
//             <h3 className="mb-3 text-center">Select Payment Method</h3>
//             <div className="list-group mb-4">
//               {methods.map((m) => (
//                 <button
//                   key={m.key}
//                   onClick={() => handleSelectMethod(m.key)}
//                   className={`list-group-item list-group-item-action ${
//                     activeTab === m.key ? "active" : ""
//                   }`}
//                 >
//                   {m.name}
//                 </button>
//               ))}
//             </div>

//             {activeTab && (
//               <div className="text-center mb-4">
//                 {activeTab === "cod" ? (
//                   <>
//                     <h5>Pay with Cash on Delivery</h5>
//                     <button
//                       className="btn btn-warning mt-3"
//                       onClick={handleCashOnDelivery}
//                       disabled={isProcessing}
//                     >
//                       {isProcessing ? "Processing..." : "Confirm Order (COD)"}
//                     </button>
//                   </>
//                 ) : activeTab === "wallet" ? (
//                   <>
//                     <h5>Pay via Wallet</h5>
//                     <button
//                       className="btn btn-info mt-3"
//                       onClick={handleWalletPayment}
//                       disabled={isProcessing}
//                     >
//                       {isProcessing ? "Processing..." : "Pay with Wallet"}
//                     </button>
//                   </>
//                 ) : activeTab === "giftcard" ? (
//                   <>
//                     <h5>Pay via Gift Card</h5>
//                     <input
//                       type="text"
//                       placeholder="Gift Card Code"
//                       id="giftCardCode"
//                       className="form-control my-2"
//                     />
//                     <input
//                       type="text"
//                       placeholder="Gift Card PIN"
//                       id="giftCardPin"
//                       className="form-control my-2"
//                     />
//                     <button
//                       className="btn btn-success mt-3"
//                       onClick={() => {
//                         const code =
//                           document.getElementById("giftCardCode").value;
//                         const pin =
//                           document.getElementById("giftCardPin").value;
//                         handleGiftCardPayment(code, pin);
//                       }}
//                       disabled={isProcessing}
//                     >
//                       {isProcessing ? "Processing..." : "Pay with Gift Card"}
//                     </button>
//                   </>
//                 ) : (
//                   <>
//                     <h5>Pay Securely</h5>
//                     <button
//                       className="btn btn-primary mt-3"
//                       onClick={handleRazorpayPayment}
//                       disabled={isProcessing}
//                     >
//                       {isProcessing ? "Proceed to Pay..." : "Proceed to Pay"}
//                     </button>
//                   </>
//                 )}
//               </div>
//             )}
//             {!activeTab && (
//               <div className="text-center text-muted">
//                 Please select a payment method to continue.
//               </div>
//             )}

//             <div className="card mt-4 shadow-sm p-3">
//               <h4 className="mb-3">Order Summary</h4>
//               <h6>Price Details</h6>
//               <div className="d-flex justify-content-between">
//                 <span>Bag MRP:</span>
//                 <span>₹{priceDetails.bagMrp}</span>
//               </div>
//               <div className="d-flex justify-content-between text-success">
//                 <span>Discount:</span>
//                 <span>
//                   -₹
//                   {priceDetails.bagDiscount +
//                     priceDetails.autoDiscount +
//                     priceDetails.couponDiscount}
//                 </span>
//               </div>
//               <div className="d-flex justify-content-between">
//                 <span>Shipping:</span>
//                 <span>
//                   {priceDetails.shipping === 0
//                     ? "Free"
//                     : `₹${priceDetails.shipping}`}
//                 </span>
//               </div>
//               <hr />
//               <div className="d-flex justify-content-between fw-bold">
//                 <span>Total Payable:</span>
//                 <span>₹{priceDetails.payable}</span>
//               </div>
//               {priceDetails.savingsMessage && (
//                 <p className="text-success mt-2">
//                   {priceDetails.savingsMessage}
//                 </p>
//               )}
//             </div>
//           </>
//         )}
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default PaymentProcess;







// PaymentProcess.jsx  –  GST added, Bootstrap-5 only, zero breaking changes
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import "../css/PaymentProcess.css";
import creditcard from "../assets/creditcard.svg";
import BhimUPI from "../assets/BhimUPI.svg";
import cash from "../assets/cash.svg";
import reminder from "../assets/reminder.svg";
import giftcard from "../assets/gift-card.svg";


const PAYMENT_METHODS_API =
  "https://beauty.joyory.com/api/payment/methods";
const RAZORPAY_ORDER_API =
  "https://beauty.joyory.com/api/payment/razorpay/order";
const VERIFY_PAYMENT_API =
  "https://beauty.joyory.com/api/payment/razorpay/verify";
const COD_API = "https://beauty.joyory.com/api/payment/cod";
const COD_CONFIRM_API =
  "https://beauty.joyory.com/api/payment/cod/confirm";
const SET_PAYMENT_METHOD_API =
  "https://beauty.joyory.com/api/payment/set-payment-method";
const WALLET_API = "https://beauty.joyory.com/api/payment/wallet";
const GIFTCARD_API =
  "https://beauty.joyory.com/api/payment/giftcard";
const RAZORPAY_KEY_ID = "rzp_live_V7ncMRhIoJhW2N";

const PaymentProcess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [methods, setMethods] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const orderId = location.state?.orderId;
  const cartItems = location.state?.cartItems || [];
  const selectedAddress = location.state?.selectedAddress;
  const priceDetails = location.state?.priceDetails || {};

  // NEW – read GST fields passed from cart / backend
  const {
    gstRate = "0%",
    gstAmount = 0,
    gstMessage = "",
  } = priceDetails;

  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  useEffect(() => {
    const fetchMethods = async () => {
      try {
        const res = await axios.get(PAYMENT_METHODS_API, {
          withCredentials: true,
        });
        const backendMethods = res.data.methods || [];
        const hasCOD = backendMethods.some((m) => m.key === "cod");
        setMethods(
          hasCOD
            ? backendMethods
            : [...backendMethods, { key: "cod", name: "Cash on Delivery" }]
        );
      } catch {
        setMethods([
          { key: "card", name: "Credit / Debit Card" },
          { key: "upi", name: "UPI" },
          { key: "cod", name: "Cash on Delivery" },
          { key: "wallet", name: "Wallet" },
          { key: "giftcard", name: "Gift Card" },
        ]);
      } finally {
        setLoading(false);
        loadRazorpayScript();
      }
    };
    fetchMethods();
  }, []);

  const handleSelectMethod = async (methodKey) => {
    setActiveTab(methodKey);
    if (!orderId) return;
    try {
      await fetch(SET_PAYMENT_METHOD_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          orderId,
          paymentMethod: methodKey.toUpperCase(),
        }),
      });
    } catch (err) {
      console.error("Error updating payment method:", err);
    }
  };

  const handleCashOnDelivery = async () => {
    try {
      setIsProcessing(true);
      const cleanAddress = {
        name: selectedAddress?.name || "",
        phone: selectedAddress?.phone || "",
        email: selectedAddress?.email || "",
        addressLine1: selectedAddress?.addressLine1 || "",
        city: selectedAddress?.city || "",
        state: selectedAddress?.state || "",
        pincode: String(selectedAddress?.pincode || "").trim(),
      };
      const payload = {
        orderId,
        orderType: "cod",
        shippingAddress: cleanAddress,
      };

      const codRes = await fetch(COD_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const codData = await codRes.json();
      if (!codRes.ok || !codData.success) throw new Error("COD failed.");

      const confirmRes = await fetch(COD_CONFIRM_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const confirmData = await confirmRes.json();
      if (!confirmRes.ok || !confirmData.success)
        throw new Error("COD confirmation failed.");

      navigate(`/ordersuccess/${orderId}`, {
        state: {
          paymentResponse: confirmData,
          backendResponse: confirmData,
          shippingCharge: priceDetails.shipping || 0,
          discountDetails: {
            bagDiscount: priceDetails.bagDiscount || 0,
            // autoDiscount: priceDetails.autoDiscount || 0,
            couponDiscount: priceDetails.couponDiscount || 0,
          },
          totalDiscount:
            (priceDetails.bagDiscount || 0) +
            // (priceDetails.autoDiscount || 0) +
            (priceDetails.couponDiscount || 0),
          payable: priceDetails.payable || 0,
          bagMrp: priceDetails.bagMrp || 0,
          gstRate,
          gstAmount,
          gstMessage,
        },
      });
    } catch (err) {
      console.error("COD Exception:", err);
      alert(err.message || "COD process failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRazorpayPayment = async () => {
    try {
      setIsProcessing(true);
      await fetch(SET_PAYMENT_METHOD_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ orderId, paymentMethod: "ONLINE" }),
      });

      const loaded = await loadRazorpayScript();
      if (!loaded || !window.Razorpay)
        return alert("Razorpay SDK failed to load.");

      const orderRes = await fetch(RAZORPAY_ORDER_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ orderId }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.success || !orderData.razorpayOrderId)
        return alert(orderData.message || "Failed to create Razorpay order.");

      const finalAmountToPay = Math.round(
        (priceDetails.payable || orderData.amount) * 100
      );

      const options = {
        key: RAZORPAY_KEY_ID,
        amount: finalAmountToPay,
        currency: "INR",
        name: "Joyory E-Commerce",
        description: "Order Payment",
        order_id: orderData.razorpayOrderId,
        prefill: {
          name: selectedAddress?.name || "User",
          email: selectedAddress?.email || "user@example.com",
          contact: selectedAddress?.phone || "",
        },
        notes: {
          address: `${selectedAddress?.addressLine1}, ${selectedAddress?.city}, ${selectedAddress?.state} - ${selectedAddress?.pincode}`,
        },
        theme: { color: "#F37254" },
        handler: async (response) => {
          const payload = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            orderId,
            shippingAddress: selectedAddress,
            cart: cartItems.map((item) => ({
              productId: item.productId || item._id || item.product?._id,
              name: item.name || item.product?.name || "Unnamed Product",
              quantity: item.quantity,
              price: item.price || item.product?.price || 0,
            })),
          };

          const verifyRes = await fetch(VERIFY_PAYMENT_API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(payload),
          });
          const verifyData = await verifyRes.json();
          if (!verifyRes.ok || !verifyData.success)
            return alert("Payment verification failed.");

          navigate(`/ordersuccess/${orderId}`, {
            state: {
              paymentResponse: response,
              backendResponse: verifyData,
              shippingCharge: priceDetails.shipping || 0,
              discountDetails: {
                bagDiscount: priceDetails.bagDiscount || 0,
                // autoDiscount: priceDetails.autoDiscount || 0,
                couponDiscount: priceDetails.couponDiscount || 0,
              },
              totalDiscount:
                (priceDetails.bagDiscount || 0) +
                // (priceDetails.autoDiscount || 0) +
                (priceDetails.couponDiscount || 0),
              payable: priceDetails.payable || 0,
              bagMrp: priceDetails.bagMrp || 0,
              gstRate,
              gstAmount,
              gstMessage,
            },
          });
        },
        modal: {
          ondismiss: () => {
            alert("Payment popup closed.");
            navigate("/cartpage");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (response) => {
        alert("Payment Failed: " + response.error.description);
        navigate("/cartpage");
      });
      rzp.open();
    } catch (error) {
      console.error("Error starting Razorpay:", error);
      alert("Failed to open Razorpay.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleWalletPayment = async () => {
    if (!orderId || !selectedAddress) {
      alert("Missing order ID or shipping address.");
      return;
    }

    try {
      setIsProcessing(true);

      const payload = {
        orderId,
        shippingAddress: {
          name: selectedAddress.name || "",
          addressLine1: selectedAddress.addressLine1 || "",
          city: selectedAddress.city || "",
          state: selectedAddress.state || "",
          pincode: String(selectedAddress.pincode || "").trim(),
          phone: selectedAddress.phone || "",
          email: selectedAddress.email || "",
        },
      };

      const res = await fetch(WALLET_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success)
        throw new Error(data.message || "Wallet payment failed.");

      // navigate("/ordersuccess", {
      navigate(`/ordersuccess/${orderId}`, {
        state: {
          paymentResponse: data,
          backendResponse: data,
          shippingCharge: priceDetails.shipping || 0,
          discountDetails: {
            bagDiscount: priceDetails.bagDiscount || 0,
            // autoDiscount: priceDetails.autoDiscount || 0,
            couponDiscount: priceDetails.couponDiscount || 0,
          },
          totalDiscount:
            (priceDetails.bagDiscount || 0) +
            // (priceDetails.autoDiscount || 0) +
            (priceDetails.couponDiscount || 0),
          payable: priceDetails.payable || 0,
          bagMrp: priceDetails.bagMrp || 0,
          gstRate,
          gstAmount,
          gstMessage,
        },
      });
    } catch (err) {
      console.error("Wallet payment error:", err);
      alert(err.message || "Wallet payment failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGiftCardPayment = async (giftCardCode, giftCardPin) => {
    if (!orderId || !selectedAddress) {
      alert("Missing order ID or shipping address.");
      return;
    }

    try {
      setIsProcessing(true);

      const payload = {
        orderId,
        giftCardCode,
        giftCardPin,
        shippingAddress: {
          name: selectedAddress.name || "",
          addressLine1: selectedAddress.addressLine1 || "",
          city: selectedAddress.city || "",
          state: selectedAddress.state || "",
          pincode: String(selectedAddress.pincode || "").trim(),
          phone: selectedAddress.phone || "",
          email: selectedAddress.email || "",
        },
      };

      const res = await fetch(GIFTCARD_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success)
        throw new Error(data.message || "Gift Card payment failed.");

      navigate(`/ordersuccess/${orderId}`, {
        state: {
          paymentResponse: data,
          backendResponse: data,
          shippingCharge: priceDetails.shipping || 0,
          discountDetails: {
            bagDiscount: priceDetails.bagDiscount || 0,
            // autoDiscount: priceDetails.autoDiscount || 0,
            couponDiscount: priceDetails.couponDiscount || 0,
          },
          totalDiscount:
            (priceDetails.bagDiscount || 0) +
            // (priceDetails.autoDiscount || 0) +
            (priceDetails.couponDiscount || 0),
          payable: priceDetails.payable || 0,
          bagMrp: priceDetails.bagMrp || 0,
          gstRate,
          gstAmount,
          gstMessage,
        },
      });
    } catch (err) {
      console.error("Gift Card payment error:", err);
      alert(err.message || "Gift Card payment failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Header />
      <div className="container my-4 page-title-main-name">


        <div className="stepper-wrapper margin-top-in-payment">
          <div className="step step-active page-title-main-name">Cart</div>
          <div className="dividers"></div>
          <div className="step step-active page-title-main-name">Address</div>
          <div className="dividers"></div>
          <div className="step step-active page-title-main-name">Payment</div>
        </div>


        {loading ? (
          <div className="text-center page-title-main-name">Loading payment options...</div>
        ) : (
          <>
            <h3 className="mb-3 text-start page-title-main-name margin-top-in-payments">Select Payment Method</h3>

            {/* <div className="d-lg-flex d-md-block align-items-center justify-content-between">
              <div className="list-group mb-4 w-100">
                {methods.map((m) => (
                  <button
                    key={m.key}
                    onClick={() => handleSelectMethod(m.key)}
                    className={`list-group-item list-group-items list-group-item-action page-title-main-name ${activeTab === m.key ? "active" : ""
                      }`}
                  >
                    {m.name}
                  </button>
                ))}
              </div>

              {activeTab && (
                <div className="text-center mb-4 w-100">
                  {activeTab === "cod" ? (
                    <>
                      <h5 className="page-title-main-name">Pay with Cash on Delivery</h5>
                      <button
                        className="btn mt-3 cod-btn-for-payment-page page-title-main-name"
                        onClick={handleCashOnDelivery}
                        disabled={isProcessing}
                      >
                        {isProcessing ? "Processing..." : "Confirm Order (COD)"}
                      </button>
                    </>
                  ) : activeTab === "wallet" ? (
                    <>
                      <h5 className="page-title-main-name">Pay via Wallet</h5>
                      <button
                        className="btn btn-info mt-3 walllet-btn-for-payment-page page-title-main-name"
                        onClick={handleWalletPayment}
                        disabled={isProcessing}
                      >
                        {isProcessing ? "Processing..." : "Pay with Wallet"}
                      </button>
                    </>
                  ) : activeTab === "giftcard" ? (
                    <>
                      <h5 className="page-title-main-name">Pay via Gift Card</h5>
                      <input
                        type="text"
                        placeholder="Gift Card Code"
                        id="giftCardCode"
                        className="form-control gift-cards-payment-input pt-2 page-title-main-name text-black"
                      />
                      <input
                        type="text"
                        placeholder="Gift Card PIN"
                        id="giftCardPin"
                        className="form-control gift-cards-payment-input pt-2 page-title-main-name text-black"
                      />
                      <button
                        className="btn btn-success mt-3 gift-card-btn-for-payment-page page-title-main-name"
                        onClick={() => {
                          const code =
                            document.getElementById("giftCardCode").value;
                          const pin =
                            document.getElementById("giftCardPin").value;
                          handleGiftCardPayment(code, pin);
                        }}
                        disabled={isProcessing}
                      >
                        {isProcessing ? "Processing..." : "Pay with Gift Card"}
                      </button>
                    </>
                  ) : (
                    <>
                      <h5 className="page-title-main-name">Pay Securely</h5>
                      <button
                        className="btn btn-primary mt-3 pay-btn-for-the-btns page-title-main-name"
                        onClick={handleRazorpayPayment}
                        disabled={isProcessing}
                      >
                        {isProcessing ? "Proceed to Pay..." : "Proceed to Pay"}
                      </button>
                    </>
                  )}
                </div>
              )}
              {!activeTab && (
                <div className="text-center text-muted w-100 page-title-main-name">
                  Please select a payment method to continue.
                </div>
              )}

              {----------  Order Summary  ---------- }
              <div className="card w-100 shadow-sm p-3">
                <h4 className="mb-3 page-title-main-name">Order Summary</h4>
                <h6 className="page-title-main-name">Price Details</h6>
                <div className="d-flex justify-content-between page-title-main-name">
                  <span>Bag MRP:</span>
                  <span>₹{priceDetails.bagMrp}</span>
                </div>
                <div className="d-flex justify-content-between text-success page-title-main-name">
                  <span>Discount:</span>
                  <span>
                    -₹
                    {priceDetails.bagDiscount +
                      // priceDetails.autoDiscount +
                      priceDetails.couponDiscount}
                  </span>
                </div>

                {NEW – GST row }
                {gstAmount > 0 && (
                  <div className="d-flex justify-content-between page-title-main-name">
                    <span>GST ({gstRate}):</span>
                    <span>₹{gstAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="d-flex justify-content-between page-title-main-name">
                  <span>Shipping:</span>
                  <span>
                    {priceDetails.shipping === 0
                      ? "Free"
                      : `₹${priceDetails.shipping}`}
                  </span>
                </div>
                <hr />
                <div className="d-flex justify-content-between fw-bold page-title-main-name">
                  <span>Total Payable:</span>
                  <span>₹{priceDetails.payable}</span>
                </div>
                {gstMessage && (
                  <p className="text-info mt-2 page-title-main-name">{gstMessage}</p>
                )}
                {priceDetails.savingsMessage && (
                  <p className="text-success mt-2 page-title-main-name">
                    {priceDetails.savingsMessage}
                  </p>
                )}
              </div>

            </div> */}




            <div className="payment-container">
              <div className="row g-4">
                {/* Left Side: Payment Methods */}
                {/* <div className="col-lg-5">
                  <div className="payment-method-card shadow-sm">
                    {methods.map((m) => (
                      <div
                        key={m.key}
                        onClick={() => handleSelectMethod(m.key)}
                        className={`payment-method-item ${activeTab === m.key ? "active" : ""
                          }`}
                      >
                        <div className="d-flex align-items-center">
                          <div className="payment-method-icon me-3">
                            {m.key === "upi" ? (
                              <div className="d-flex flex-column align-items-center">
                                <span style={{ fontSize: '8px', fontWeight: 'bold' }}>BHIM</span>
                                <span style={{ fontSize: '10px', fontWeight: 'bold', borderTop: '1px solid #000' }}>UPI</span>
                              </div>
                            ) : (
                              m.icon
                            )}
                          </div>




                          <div className="payment-method-icon me-3 d-flex align-items-center">
                            {m.key === "upi" ? (
                              <img
                                src={BhimUPI}   // ← Put your image here
                                alt="BHIM UPI"
                                className="img-fluid"
                                style={{ width: "42px", height: "auto" }}
                              />
                            ) : m.key === "card" ? (
                              <img
                                src={creditcard}
                                alt="Credit/Debit Card"
                                className="img-fluid"
                                style={{ width: "42px", height: "auto" }}
                              />
                            ) : m.key === "cod" ? (
                              <img
                                src={cash}
                                alt="Cash on Delivery"
                                className="img-fluid"
                                style={{ width: "42px", height: "auto" }}
                              />
                            ) : m.key === "wallet" ? (
                              <img
                                src={reminder}
                                alt="Wallet"
                                className="img-fluid"
                                style={{ width: "42px", height: "auto" }}
                              />
                            ) : m.key === "giftcard" ? (
                              <img
                                src={giftcard}
                                alt="Gift Card"
                                className="img-fluid"
                                style={{ width: "42px", height: "auto" }}
                              />
                            ) : (
                              m.icon   // fallback if any
                            )}
                          </div>





                          <div className="flex-grow-1">
                            <h5 className="mb-0 fw-normal">{m.name}</h5>
                            <p className="mb-0 text-muted small">{m.description}</p>
                          </div>
                          {m.key === "upi" && activeTab === "upi" && (
                            <div className="ms-auto">
                            </div>
                          )}
                        </div>
                        {activeTab === m.key && (
                          <div className="mt-2">
                            <button 
                              className="pay-now-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePayment();
                              }}
                              disabled={isProcessing}
                            >
                              {isProcessing ? "Processing..." : "Pay Now"}
                            </button>

                            {m.key === "giftcard" && (
                              <div className="mt-3">
                                <input
                                  type="text"
                                  placeholder="Gift Card Code"
                                  className="form-control mb-2 gift-card-inputs"
                                />
                                <input
                                  type="text"
                                  placeholder="Gift Card PIN"
                                  className="form-control gift-card-inputs"
                                />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div> */}


                <div className="d-lg-flex gap-4">

                  {/* ==================== PAYMENT METHODS ==================== */}
                  <div className="flex-grow-1 col-lg-5">
                    <div className="payment-method-card shadow-sm">
                      {methods.map((m) => (
                        <div
                          key={m.key}
                          onClick={() => handleSelectMethod(m.key)}
                          className={`payment-method-item ${activeTab === m.key ? "active" : ""}`}
                        >
                          <div className="d-flex align-items-center">

                            {/* Payment Icon */}
                            <div className="payment-method-icon me-3 d-flex align-items-center">
                              {m.key === "upi" ? (
                                <img
                                  src={BhimUPI}
                                  alt="BHIM UPI"
                                  className="img-fluid"
                                  style={{ width: "45px", height: "auto" }}
                                />
                              ) : m.key === "card" ? (
                                <img
                                  src={creditcard}
                                  alt="Credit/Debit Card"
                                  className="img-fluid"
                                  style={{ width: "45px", height: "auto" }}
                                />
                              ) : m.key === "cod" ? (
                                <img
                                  src={cash}
                                  alt="Cash on Delivery"
                                  className="img-fluid"
                                  style={{ width: "45px", height: "auto" }}
                                />
                              ) : m.key === "wallet" ? (
                                <img
                                  src={reminder}
                                  alt="Wallet"
                                  className="img-fluid"
                                  style={{ width: "45px", height: "auto" }}
                                />
                              ) : m.key === "giftcard" ? (
                                <img
                                  src={giftcard}
                                  alt="Gift Card"
                                  className="img-fluid"
                                  style={{ width: "45px", height: "auto" }}
                                />
                              ) : (
                                m.icon
                              )}
                            </div>

                            {/* Payment Method Details */}
                            <div className="flex-grow-1 payment-method-font-size">
                              <h5 className="mb-1 fw-normal page-title-main-name">{m.name}</h5>
                              <p className="mb-0 text-muted small">{m.description}</p>
                            </div>

                            {/* Checkmark for active method */}
                            {activeTab === m.key && (
                              <i className="bi bi-check-circle-fill text-success fs-4 ms-3"></i>
                            )}
                          </div>

                          {/* ==================== SHOW BUTTON + EXTRA FIELDS ONLY WHEN ACTIVE ==================== */}
                          {activeTab === m.key && (
                            <div className="">
                              {m.key === "cod" ? (
                                <button
                                  className="btn btn-dark w-100 py-3 fw-semibold page-title-main-name mt-3"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCashOnDelivery();
                                  }}
                                  disabled={isProcessing}
                                >
                                  {isProcessing ? "Processing..." : "Confirm Order (COD)"}
                                </button>
                              ) : m.key === "wallet" ? (
                                <button
                                  className="btn btn-dark w-100 py-3 fw-semibold page-title-main-name mt-3"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleWalletPayment();
                                  }}
                                  disabled={isProcessing}
                                >
                                  {isProcessing ? "Processing..." : "Pay with Wallet"}
                                </button>
                              ) : m.key === "giftcard" ? (
                                <>
                                  <div className="mt-2">
                                    <input
                                      type="text"
                                      placeholder="Gift Card Code"
                                      id="giftCardCode"
                                      className="form-control mb-2 gift-card-inputs"
                                    />
                                    <input
                                      type="text"
                                      placeholder="Gift Card PIN"
                                      id="giftCardPin"
                                      className="form-control mb-3 gift-card-inputs"
                                    />
                                  </div>
                                  <button
                                    className="btn btn-dark w-100 py-3 fw-semibold page-title-main-name"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const code = document.getElementById("giftCardCode").value;
                                      const pin = document.getElementById("giftCardPin").value;
                                      handleGiftCardPayment(code, pin);
                                    }}
                                    disabled={isProcessing}
                                  >
                                    {isProcessing ? "Processing..." : "Pay with Gift Card"}
                                  </button>
                                </>
                              ) : (
                                /* Default for UPI, Card, etc. */
                                <button
                                  className="pay-now-btn btn btn-primary w-100 py-3 fw-semibold page-title-main-name"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRazorpayPayment();   // or your handlePayment()
                                  }}
                                  disabled={isProcessing}
                                >
                                  {isProcessing ? "Processing..." : "Pay Now"}
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* <div className="col-lg-7 mt-lg-0 mt-5">
                    <div className="summary-card shadow-sm">
                      <div className="summary-header">
                        <div className="summary-header-col flex-grow-1 border-end text-start ms-2">Order Summary</div>
                        <div className="summary-header-col" style={{ width: '140px' }}>Total</div>
                      </div>

                      <div className="summary-body py-3">
                        <div className="summary-row">
                          <span className="summary-label">Bag MRP</span>
                          <span className="summary-value">Rs {priceDetails.bagMrp}/-</span>
                        </div>
                        <div className="summary-row">
                          <span className="summary-label">Bag Discount</span>
                          <span className="summary-value" style={{ width: '140px' }}>Rs {priceDetails.bagDiscount}/-</span>
                        </div>
                        <div className="summary-row">
                          <span className="summary-label">Coupon Discount</span>
                          <span className="summary-value" style={{ width: '140px' }}>Rs {priceDetails.couponDiscount}/-</span>
                        </div>

                        <h4 className="taxable-summary-title">Taxable Summary</h4>

                        <div className="summary-row">
                          <span className="summary-label">GST {gstRate}</span>
                          <span className="summary-value" style={{ width: '140px' }}>Rs {gstAmount}/-</span>
                        </div>
                        <div className="summary-row">
                          <span className="summary-label">{gstMessage}</span>
                          <span className="summary-value" style={{ width: '140px' }}>Rs {gstAmount}/-</span>
                        </div>
                        <div className="summary-row">
                          <span className="summary-label">Shipping</span>
                          <span className="summary-value" style={{ width: '140px' }}>Rs {priceDetails.shipping}/-</span>
                        </div>
                      </div>

                      <div className="total-payable-row ">
                        <div className="total-payable-label border-end">Total Payable</div>
                        <div className="total-payable-value">Rs {priceDetails.payable}</div>
                      </div>
                    </div>

                    {priceDetails.savingsMessage && (
                      <p className="text-success mt-3 text-center fw-medium">
                        {priceDetails.savingsMessage}
                      </p>
                    )}
                  </div> */}





                   <div className="col-lg-7 col-md-12 mt-lg-0 mt-4 order-1 order-lg-2">
            <div className="summary-card">
              {/* Header */}
              <div className="summary-header">
                <div className="summary-header-left">Order Summary</div>
                <div className="summary-header-right">Total</div>
              </div>

              {/* Body */}
              <div className="summary-body">
                <div className="summary-row p-0">
                  <span className="summary-header-left fw-normal">Bag MRP</span>
                  <span className="summary-value">Rs {priceDetails.bagMrp}/-</span>
                </div>
                <div className="summary-row p-0">
                  <span className="summary-header-left fw-normal">Bag Discount</span>
                  <span className="summary-value">Rs {priceDetails.bagDiscount}/-</span>
                </div>
                <div className="summary-row p-0">
                  <span className="summary-header-left fw-normal">Coupon Discount</span>
                  <span className="summary-value">Rs {priceDetails.couponDiscount}/-</span>
                </div>

                <div className="taxable-section p-0">
                  {/* <h4 className="summary-header-left fw-normal">Taxable Summary</h4> */}
                  
                  <div className="summary-row p-0">
                    <span className="summary-header-left fw-normal">GST {gstRate}</span>
                    <span className="summary-value">Rs {gstAmount}/-</span>
                  </div>
                  {/* <div className="summary-row p-0">
                    <span className="summary-header-left fw-normal">{gstMessage}</span>
                    <span className="summary-value">Rs {gstAmount}/-</span>
                  </div> */}
                  <div className="summary-row p-0">
                    <span className="summary-header-left fw-normal">Shipping</span>
                    <span className="summary-value">Rs {priceDetails.shipping}/-</span>
                  </div>
                </div>
              </div>

              {/* Footer - Total Payable */}
              <div className="summary-footer">
                <div className="total-label">Total Payable</div>
                <div className="total-value">Rs {priceDetails.payable}</div>
              </div>
            </div>

            {/* Savings Message */}
            {priceDetails.savingsMessage && (
              <p className="savings-message">
                {priceDetails.savingsMessage}
              </p>
            )}
          </div>

                </div>

                {/* Right Side: Order Summary */}

              </div>
            </div>
          </>
        )}
      </div>
      <Footer />
    </>
  );
};

export default PaymentProcess;


//=========================================================Done-Code(End)=========================================================

