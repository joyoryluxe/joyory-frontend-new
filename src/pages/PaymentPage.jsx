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
                replace: true,
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
