// PaymentProcess.jsx – Luxury Beauty Checkout with Coupons & COD Rules
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { Modal } from "react-bootstrap";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import "../styles/PaymentProcess.css";
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
const COUPONS_API =
  "https://beauty.joyory.com/api/payment/coupons";
const APPLY_COUPON_API =
  "https://beauty.joyory.com/api/payment/apply-coupon";
const REMOVE_COUPON_API =
  "https://beauty.joyory.com/api/payment/remove-coupon";
const RAZORPAY_KEY_ID = "rzp_live_V7ncMRhIoJhW2N";

// ─── Celebratory Confetti Burst Component ─────────────────────────────────────
const ConfettiBurst = ({ active }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (active) {
      const colors = [
        "#f1c40f",
        "#e74c3c",
        "#3498db",
        "#2ecc71",
        "#9b59b6",
        "#e67e22",
        "#1abc9c",
        "#ff7675",
        "#74b9ff",
        "#d4af37",
        "#e84393",
        "#b8860b",
      ];
      const shapes = ["50%", "0%"];
      const newParticles = Array.from({ length: 120 }).map((_, i) => {
        const angle = Math.random() * Math.PI * 2;
        const distance = 100 + Math.random() * 420;
        const shootX = Math.cos(angle) * distance;
        const shootY = -150 - Math.random() * 500;

        return {
          id: i,
          color: colors[Math.floor(Math.random() * colors.length)],
          borderRadius: shapes[Math.floor(Math.random() * shapes.length)],
          shootX: `${shootX}px`,
          shootY: `${shootY}px`,
          rotateDeg: `${Math.random() * 1080 - 540}deg`,
          width: `${6 + Math.random() * 8}px`,
          height: `${6 + Math.random() * 12}px`,
          delay: `${Math.random() * 0.2}s`,
          duration: `${2.2 + Math.random() * 1.5}s`,
          left: `${40 + Math.random() * 20}vw`,
          top: `85vh`,
        };
      });
      setParticles(newParticles);

      const timer = setTimeout(() => {
        setParticles([]);
      }, 3800);
      return () => clearTimeout(timer);
    } else {
      setParticles([]);
    }
  }, [active]);

  if (particles.length === 0) return null;

  return (
    <div className="confetti-container" style={{ pointerEvents: "none", zIndex: 99999 }}>
      {particles.map((p) => (
        <span
          key={p.id}
          className="confetti-particle"
          style={{
            backgroundColor: p.color,
            borderRadius: p.borderRadius,
            width: p.width,
            height: p.height,
            left: p.left,
            top: p.top,
            animationDelay: p.delay,
            animationDuration: p.duration,
            "--shoot-x": p.shootX,
            "--shoot-y": p.shootY,
            "--rotate-deg": p.rotateDeg,
          }}
        />
      ))}
    </div>
  );
};

const PaymentProcess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [methods, setMethods] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const [customAlert, setCustomAlert] = useState({
    show: false,
    title: "Notification",
    message: "",
    type: "info",
    onClose: null,
  });

  const showAlert = (message, title = "Notification", type = "info", onClose = null) => {
    setCustomAlert({
      show: true,
      title,
      message,
      type,
      onClose,
    });
  };

  const handleCloseAlert = () => {
    const cb = customAlert.onClose;
    setCustomAlert((prev) => ({ ...prev, show: false, onClose: null }));
    if (cb) cb();
  };

  const orderId = location.state?.orderId;
  const cartItems = location.state?.cartItems || [];
  const selectedAddress = location.state?.selectedAddress;
  const initialPriceDetails = location.state?.priceDetails || {};

  const [livePriceDetails, setLivePriceDetails] = useState({
    bagMrp: initialPriceDetails.bagMrp || 0,
    bagDiscount: initialPriceDetails.bagDiscount || 0,
    couponDiscount: initialPriceDetails.couponDiscount || 0,
    pointsDiscount: initialPriceDetails.pointsDiscount || initialPriceDetails.referralPointsDiscount || 0,
    pointsUsed: initialPriceDetails.pointsUsed || 0,
    shipping: initialPriceDetails.shipping || 0,
    taxableAmount: initialPriceDetails.taxableAmount || 0,
    gstRate: initialPriceDetails.gstRate || "0%",
    gstAmount: initialPriceDetails.gstAmount || 0,
    gstMessage: initialPriceDetails.gstMessage || "",
    codCharge: initialPriceDetails.codCharge || 0,
    payable: initialPriceDetails.payable || 0,
    totalSavings: initialPriceDetails.totalSavings || 0,
    savingsMessage: initialPriceDetails.savingsMessage || "",
  });

  const [appliedCoupon, setAppliedCoupon] = useState(
    initialPriceDetails.couponDiscount > 0
      ? {
          code: location.state?.discountCode || localStorage.getItem("appliedCoupon") || "OFFER",
          discount: initialPriceDetails.couponDiscount,
        }
      : null
  );

  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [inapplicableCoupons, setInapplicableCoupons] = useState([]);
  const [couponsLoading, setCouponsLoading] = useState(false);
  const [isCouponDropdownOpen, setIsCouponDropdownOpen] = useState(true);
  const [activeCouponTab, setActiveCouponTab] = useState("available");
  const [manualCouponCode, setManualCouponCode] = useState("");
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [couponToast, setCouponToast] = useState({ show: false, message: "", type: "success" });

  // ─── Base calculation & COD availability rules ──────────────────────────────
  // Base payable: amount before any COD charge
  const basePayableAmount = Math.max(
    0,
    Number(livePriceDetails.payable || 0) - (activeTab === "cod" ? 50 : 0)
  );

  // Condition 1: If user applies any offer/coupon, COD is strictly NOT allowed!
  const hasCouponApplied = Boolean(
    appliedCoupon?.code || Number(livePriceDetails.couponDiscount) > 0
  );

  // Condition 2: Orders must be ₹499 or above BEFORE adding the ₹50 COD fee
  const isCodAllowed = !hasCouponApplied && basePayableAmount >= 499;

  useEffect(() => {
    if (!isCodAllowed && activeTab === "cod") {
      setActiveTab(null);
    }
  }, [isCodAllowed, activeTab]);

  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  // Fetch available payment methods
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

  // Fetch coupons for current order
  useEffect(() => {
    if (!orderId) return;
    const fetchOrderCoupons = async () => {
      try {
        setCouponsLoading(true);
        const res = await axios.get(`${COUPONS_API}/${orderId}`, {
          withCredentials: true,
        });
        if (res.data?.success) {
          setAvailableCoupons(res.data.applicableCoupons || []);
          setInapplicableCoupons(res.data.inapplicableCoupons || []);
          if (res.data.appliedCoupon) {
            setAppliedCoupon(res.data.appliedCoupon);
          }
          if (res.data.orderSummary) {
            const s = res.data.orderSummary;
            setLivePriceDetails((prev) => ({
              ...prev,
              bagMrp: s.subtotal || prev.bagMrp,
              couponDiscount: s.couponDiscount || 0,
              pointsDiscount: s.pointsDiscount || prev.pointsDiscount,
              giftCardDiscount: s.giftCardDiscount || 0,
              shipping: s.shippingCharge || prev.shipping,
              codCharge: s.codCharge || 0,
              payable: s.payable || prev.payable,
              gstAmount: s.gstAmount || prev.gstAmount,
              gstRate: s.gstRate || prev.gstRate,
            }));
          }
        }
      } catch (err) {
        console.warn("Could not fetch coupons for order:", err);
      } finally {
        setCouponsLoading(false);
      }
    };
    fetchOrderCoupons();
  }, [orderId]);

  // Handle coupon application
  const handleApplyCoupon = async (codeToApply) => {
    const code = (codeToApply || manualCouponCode || "").trim();
    if (!code) {
      setCouponToast({ show: true, message: "Please enter a valid coupon code.", type: "warning" });
      setTimeout(() => setCouponToast((t) => ({ ...t, show: false })), 3500);
      return;
    }

    if (!orderId) {
      showAlert("Order details not found. Please return to cart.", "Error", "error");
      return;
    }

    try {
      setApplyingCoupon(true);
      const res = await axios.post(
        APPLY_COUPON_API,
        { orderId, couponCode: code },
        { withCredentials: true }
      );

      if (res.data?.success) {
        setAppliedCoupon(res.data.appliedCoupon);
        if (res.data.priceDetails) {
          setLivePriceDetails(res.data.priceDetails);
        }

        // Trigger celebratory special effect
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 4000);

        // If user had selected COD, switch away and notify
        if (activeTab === "cod" || res.data.switchedFromCod) {
          setActiveTab(null);
          showAlert(
            `🎉 Coupon "${code}" applied! Note: Cash on Delivery is unavailable with coupons and offers. Switched to online payment options.`,
            "Offer Applied",
            "info"
          );
        } else {
          setCouponToast({
            show: true,
            message: `🎉 Offer applied! Saved ₹${res.data.appliedCoupon?.discount || ""}`,
            type: "success",
          });
          setTimeout(() => setCouponToast((t) => ({ ...t, show: false })), 4000);
        }

        setManualCouponCode("");
      } else {
        showAlert(res.data?.message || "Failed to apply coupon.", "Coupon Error", "error");
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to apply coupon.";
      setCouponToast({ show: true, message: msg, type: "error" });
      setTimeout(() => setCouponToast((t) => ({ ...t, show: false })), 4000);
    } finally {
      setApplyingCoupon(false);
    }
  };

  // Handle coupon removal
  const handleRemoveCoupon = async () => {
    if (!orderId) return;
    try {
      setApplyingCoupon(true);
      const res = await axios.post(
        REMOVE_COUPON_API,
        { orderId },
        { withCredentials: true }
      );

      if (res.data?.success) {
        setAppliedCoupon(null);
        if (res.data.priceDetails) {
          setLivePriceDetails(res.data.priceDetails);
        }
        setCouponToast({
          show: true,
          message: "Coupon removed.",
          type: "info",
        });
        setTimeout(() => setCouponToast((t) => ({ ...t, show: false })), 3000);
      } else {
        showAlert(res.data?.message || "Failed to remove coupon.", "Error", "error");
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to remove coupon.";
      showAlert(msg, "Error", "error");
    } finally {
      setApplyingCoupon(false);
    }
  };

  // Handle payment method selection
  const handleSelectMethod = async (methodKey) => {
    if (methodKey === "cod") {
      if (hasCouponApplied) {
        showAlert(
          "Cash on Delivery is unavailable when coupons or offers are applied. Please remove the coupon to choose COD, or select an online payment method.",
          "COD Unavailable with Offers",
          "warning"
        );
        return;
      }
      if (basePayableAmount < 499) {
        showAlert(
          "Cash on Delivery is available only on orders of ₹499 and above. Please choose an online payment method.",
          "COD Minimum Order Required",
          "warning"
        );
        return;
      }
    }

    const prevTab = activeTab;
    setActiveTab(methodKey);

    // Update live price display for COD handling charge
    if (methodKey === "cod" && prevTab !== "cod") {
      setLivePriceDetails((prev) => ({
        ...prev,
        codCharge: 50,
        payable: basePayableAmount + 50,
      }));
    } else if (methodKey !== "cod" && prevTab === "cod") {
      setLivePriceDetails((prev) => ({
        ...prev,
        codCharge: 0,
        payable: basePayableAmount,
      }));
    }

    if (!orderId) return;
    try {
      const normalizedMethod =
        methodKey === "card" || methodKey === "upi"
          ? "ONLINE"
          : methodKey.toUpperCase();

      const res = await fetch(SET_PAYMENT_METHOD_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          orderId,
          paymentMethod: normalizedMethod,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        if (data?.message) {
          showAlert(data.message, "Payment Method Notice", "warning");
          setActiveTab(prevTab);
        }
      } else if (data.payable !== undefined) {
        setLivePriceDetails((prev) => ({
          ...prev,
          codCharge: data.codCharge || 0,
          payable: data.payable,
        }));
      }
    } catch (err) {
      console.error("Error updating payment method:", err);
    }
  };

  // Handle COD confirmation
  const handleCashOnDelivery = async () => {
    if (!isCodAllowed) {
      if (hasCouponApplied) {
        showAlert(
          "Cash on Delivery is unavailable when coupons or offers are applied. Please remove the coupon to choose COD, or select an online payment method.",
          "COD Unavailable with Offers",
          "warning"
        );
      } else {
        showAlert(
          "Cash on Delivery is available only on orders of ₹499 and above. Please choose an online payment method.",
          "COD Unavailable",
          "warning"
        );
      }
      return;
    }

    if (!orderId) {
      showAlert("Order ID is missing. Please return to your cart.", "Order Error", "error");
      return;
    }

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

      // Set COD on backend
      await fetch(SET_PAYMENT_METHOD_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          orderId,
          paymentMethod: "COD",
        }),
      }).catch(console.warn);

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
      if (!codRes.ok || !codData.success) throw new Error(codData?.message || "COD failed.");

      const confirmRes = await fetch(COD_CONFIRM_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const confirmData = await confirmRes.json();
      if (!confirmRes.ok || !confirmData.success)
        throw new Error(confirmData?.message || "COD confirmation failed.");

      navigate(`/ordersuccess/${orderId}`, {
        replace: true,
        state: {
          paymentResponse: confirmData,
          backendResponse: confirmData,
          shippingCharge: livePriceDetails.shipping || 0,
          codCharge: 50,
          discountDetails: {
            bagDiscount: livePriceDetails.bagDiscount || 0,
            couponDiscount: livePriceDetails.couponDiscount || 0,
            pointsDiscount: livePriceDetails.pointsDiscount || 0,
          },
          totalDiscount:
            (livePriceDetails.bagDiscount || 0) +
            (livePriceDetails.couponDiscount || 0) +
            (livePriceDetails.pointsDiscount || 0),
          payable: livePriceDetails.payable || 0,
          bagMrp: livePriceDetails.bagMrp || 0,
          gstRate: livePriceDetails.gstRate,
          gstAmount: livePriceDetails.gstAmount,
          gstMessage: livePriceDetails.gstMessage,
        },
      });
    } catch (err) {
      console.error("COD Exception:", err);
      showAlert(err.message || "COD process failed.", "COD Error", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle Razorpay prepaid checkout
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
        return showAlert("Razorpay SDK failed to load.", "SDK Error", "error");

      const orderRes = await fetch(RAZORPAY_ORDER_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ orderId }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.success || !orderData.razorpayOrderId)
        return showAlert(orderData.message || "Failed to create Razorpay order.", "Order Error", "error");

      const finalAmountToPay = Math.round(
        (livePriceDetails.payable || orderData.amount) * 100
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
            return showAlert("Payment verification failed.", "Payment Verification", "error");

          navigate(`/ordersuccess/${orderId}`, {
            replace: true,
            state: {
              paymentResponse: response,
              backendResponse: verifyData,
              shippingCharge: livePriceDetails.shipping || 0,
              discountDetails: {
                bagDiscount: livePriceDetails.bagDiscount || 0,
                couponDiscount: livePriceDetails.couponDiscount || 0,
                pointsDiscount: livePriceDetails.pointsDiscount || 0,
              },
              totalDiscount:
                (livePriceDetails.bagDiscount || 0) +
                (livePriceDetails.couponDiscount || 0) +
                (livePriceDetails.pointsDiscount || 0),
              payable: livePriceDetails.payable || 0,
              bagMrp: livePriceDetails.bagMrp || 0,
              gstRate: livePriceDetails.gstRate,
              gstAmount: livePriceDetails.gstAmount,
              gstMessage: livePriceDetails.gstMessage,
            },
          });
        },
        modal: {
          ondismiss: () => {
            showAlert("Payment popup closed.", "Payment Cancelled", "warning", () => {
              navigate("/cartpage");
            });
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (response) => {
        showAlert("Payment Failed: " + response.error.description, "Payment Failed", "error", () => {
          navigate("/cartpage");
        });
      });
      rzp.open();
    } catch (error) {
      console.error("Error starting Razorpay:", error);
      showAlert("Failed to open Razorpay.", "Error", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle Wallet payment
  const handleWalletPayment = async () => {
    if (!orderId || !selectedAddress) {
      showAlert("Missing order ID or shipping address.", "Missing Info", "warning");
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

      navigate(`/ordersuccess/${orderId}`, {
        replace: true,
        state: {
          paymentResponse: data,
          backendResponse: data,
          shippingCharge: livePriceDetails.shipping || 0,
          discountDetails: {
            bagDiscount: livePriceDetails.bagDiscount || 0,
            couponDiscount: livePriceDetails.couponDiscount || 0,
            pointsDiscount: livePriceDetails.pointsDiscount || 0,
          },
          totalDiscount:
            (livePriceDetails.bagDiscount || 0) +
            (livePriceDetails.couponDiscount || 0) +
            (livePriceDetails.pointsDiscount || 0),
          payable: livePriceDetails.payable || 0,
          bagMrp: livePriceDetails.bagMrp || 0,
          gstRate: livePriceDetails.gstRate,
          gstAmount: livePriceDetails.gstAmount,
          gstMessage: livePriceDetails.gstMessage,
        },
      });
    } catch (err) {
      console.error("Wallet payment error:", err);
      showAlert(err.message || "Wallet payment failed.", "Payment Failed", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle Gift Card payment
  const handleGiftCardPayment = async (giftCardCode, giftCardPin) => {
    if (!orderId || !selectedAddress) {
      showAlert("Missing order ID or shipping address.", "Missing Info", "warning");
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
        replace: true,
        state: {
          paymentResponse: data,
          backendResponse: data,
          shippingCharge: livePriceDetails.shipping || 0,
          discountDetails: {
            bagDiscount: livePriceDetails.bagDiscount || 0,
            couponDiscount: livePriceDetails.couponDiscount || 0,
            pointsDiscount: livePriceDetails.pointsDiscount || 0,
          },
          totalDiscount:
            (livePriceDetails.bagDiscount || 0) +
            (livePriceDetails.couponDiscount || 0) +
            (livePriceDetails.pointsDiscount || 0),
          payable: livePriceDetails.payable || 0,
          bagMrp: livePriceDetails.bagMrp || 0,
          gstRate: livePriceDetails.gstRate,
          gstAmount: livePriceDetails.gstAmount,
          gstMessage: livePriceDetails.gstMessage,
        },
      });
    } catch (err) {
      console.error("Gift Card payment error:", err);
      showAlert(err.message || "Gift Card payment failed.", "Payment Failed", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Header />
      <ConfettiBurst active={showCelebration} />

      <div className="container my-4 page-title-main-name">
        <div className="stepper-wrapper margin-top-in-payment">
          <div className="step step-active page-title-main-name">Cart</div>
          <div className="dividers"></div>
          <div className="step step-active page-title-main-name">Address</div>
          <div className="dividers"></div>
          <div className="step step-active page-title-main-name">Payment</div>
        </div>

        {loading ? (
          <div className="text-center page-title-main-name py-5">
            <div className="spinner-border text-secondary mb-3" role="status"></div>
            <div>Loading payment options...</div>
          </div>
        ) : (
          <>
            <h3 className="mb-3 text-start page-title-main-name margin-top-in-payments">
              Select Payment Method
            </h3>

            <div className="payment-container">
              <div className="row g-4">
                <div className="d-lg-flex gap-4">
                  {/* ==================== LEFT COLUMN: PAYMENT METHODS ==================== */}
                  <div className="flex-grow-1 col-lg-5">
                    <div className="payment-method-card shadow-sm">
                      {methods.map((m) => {
                        const isCodMethod = m.key === "cod";
                        const isMethodDisabled = isCodMethod && !isCodAllowed;

                        return (
                          <div
                            key={m.key}
                            onClick={() => {
                              if (isMethodDisabled) {
                                if (hasCouponApplied) {
                                  showAlert(
                                    "Cash on Delivery is unavailable when coupons or offers are applied. Please remove the coupon to choose COD, or select an online payment method.",
                                    "COD Unavailable with Offers",
                                    "warning"
                                  );
                                } else {
                                  showAlert(
                                    "Cash on Delivery is available only on orders of ₹499 and above. Please choose an online payment method.",
                                    "COD Unavailable",
                                    "warning"
                                  );
                                }
                                return;
                              }
                              handleSelectMethod(m.key);
                            }}
                            className={`payment-method-item ${
                              activeTab === m.key ? "active" : ""
                            } ${isMethodDisabled ? "disabled-payment-method" : ""}`}
                          >
                            <div className="d-flex align-items-center">
                              {/* Payment Icon */}
                              <div
                                className="payment-method-icon me-3 d-flex align-items-center"
                                style={
                                  isMethodDisabled
                                    ? { opacity: 0.45, filter: "grayscale(100%)" }
                                    : {}
                                }
                              >
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
                                <div className="d-flex align-items-center justify-content-between">
                                  <h5
                                    className="mb-1 fw-normal page-title-main-name"
                                    style={isMethodDisabled ? { color: "#6c757d" } : {}}
                                  >
                                    {m.name}
                                  </h5>

                                  {isCodMethod && hasCouponApplied && (
                                    <span className="badge-cod-disabled">
                                      Unavailable with Offers
                                    </span>
                                  )}
                                  {isCodMethod && !hasCouponApplied && basePayableAmount < 499 && (
                                    <span className="badge-cod-disabled">
                                      Min ₹499 Required
                                    </span>
                                  )}
                                </div>

                                <p className="mb-0 text-muted small">{m.description}</p>

                                {isCodMethod && hasCouponApplied && (
                                  <div className="cod-unavailable-notice">
                                    <i className="bi bi-info-circle-fill"></i>
                                    <span>COD unavailable when coupons or offers are applied</span>
                                  </div>
                                )}
                                {isCodMethod && !hasCouponApplied && basePayableAmount < 499 && (
                                  <div className="cod-unavailable-notice">
                                    <i className="bi bi-info-circle-fill"></i>
                                    <span>COD available only on orders above ₹499</span>
                                  </div>
                                )}
                                {isCodMethod && isCodAllowed && (
                                  <div className="text-muted small mt-1" style={{ fontSize: "11px" }}>
                                    <span className="badge-cod-fee me-1">+₹50</span>
                                    <span>Cash on Delivery handling charge applies</span>
                                  </div>
                                )}
                              </div>

                              {/* Checkmark for active method */}
                              {activeTab === m.key && !isMethodDisabled && (
                                <i className="bi bi-check-circle-fill text-success fs-4 ms-3"></i>
                              )}
                            </div>

                            {/* ==================== ACTION BUTTONS & EXTRA INPUTS ==================== */}
                            {activeTab === m.key && !isMethodDisabled && (
                              <div className="mt-3">
                                {m.key === "cod" ? (
                                  <>
                                    <div className="alert alert-warning py-2 px-3 small mb-2 d-flex align-items-center gap-2">
                                      <i className="bi bi-cash-stack fs-5"></i>
                                      <span>
                                        An extra <strong>₹50 handling charge</strong> is added for Cash on Delivery.
                                      </span>
                                    </div>
                                    <button
                                      className="btn btn-dark w-100 py-3 fw-semibold page-title-main-name"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleCashOnDelivery();
                                      }}
                                      disabled={isProcessing}
                                    >
                                      {isProcessing ? "Processing..." : `Confirm Order (COD) • Rs ${livePriceDetails.payable}`}
                                    </button>
                                  </>
                                ) : m.key === "wallet" ? (
                                  <button
                                    className="btn btn-dark w-100 py-3 fw-semibold page-title-main-name"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleWalletPayment();
                                    }}
                                    disabled={isProcessing}
                                  >
                                    {isProcessing ? "Processing..." : `Pay with Wallet • Rs ${livePriceDetails.payable}`}
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
                                        type="password"
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
                                  <button
                                    className="pay-now-btn btn btn-primary w-100 py-3 fw-semibold page-title-main-name"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleRazorpayPayment();
                                    }}
                                    disabled={isProcessing}
                                  >
                                    {isProcessing ? "Processing..." : `Pay Now • Rs ${livePriceDetails.payable}`}
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* ==================== RIGHT COLUMN: COUPONS & ORDER SUMMARY ==================== */}
                  <div className="col-lg-7 col-md-12 mt-lg-0 mt-4 order-1 order-lg-2">
                    {/* ── 1. LUXURY COUPONS & BANK OFFERS ACCORDION ── */}
                    <div className="coupons-offers-wrapper">
                      <div className="coupons-card">
                        <div
                          className="coupons-header"
                          onClick={() => setIsCouponDropdownOpen((prev) => !prev)}
                        >
                          <div className="coupons-header-title">
                            <span className="coupons-header-icon">
                              <i className="bi bi-tag-fill"></i>
                            </span>
                            <span>Coupons & Bank Offers</span>
                            {appliedCoupon && (
                              <span className="badge-applied-pill">
                                <i className="bi bi-check2"></i> 1 Applied
                              </span>
                            )}
                          </div>
                          <i
                            className={`bi bi-chevron-down coupons-collapse-icon ${
                              isCouponDropdownOpen ? "open" : ""
                            }`}
                          ></i>
                        </div>

                        {isCouponDropdownOpen && (
                          <div className="coupons-body">
                            {/* Applied Coupon Card */}
                            {appliedCoupon && (
                              <div className="applied-coupon-banner">
                                <div className="applied-coupon-left">
                                  <div className="applied-coupon-icon">
                                    <i className="bi bi-check-lg"></i>
                                  </div>
                                  <div>
                                    <div className="applied-coupon-code">
                                      {appliedCoupon.code}
                                    </div>
                                    <p className="applied-coupon-savings">
                                      🎉 You are saving ₹{appliedCoupon.discount} on this order!
                                    </p>
                                  </div>
                                </div>
                                <button
                                  className="btn-remove-coupon"
                                  onClick={handleRemoveCoupon}
                                  disabled={applyingCoupon}
                                >
                                  {applyingCoupon ? "..." : "Remove"}
                                </button>
                              </div>
                            )}

                            {/* Manual Coupon Input Field */}
                            <div className="coupon-input-group">
                              <input
                                type="text"
                                className="coupon-input-field"
                                placeholder="ENTER COUPON CODE"
                                value={manualCouponCode}
                                onChange={(e) => setManualCouponCode(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault();
                                    handleApplyCoupon();
                                  }
                                }}
                              />
                              <button
                                className="coupon-apply-btn"
                                onClick={() => handleApplyCoupon()}
                                disabled={applyingCoupon || !manualCouponCode.trim()}
                              >
                                {applyingCoupon ? (
                                  <>
                                    <span className="spinner-border spinner-border-sm me-1"></span>
                                    Applying...
                                  </>
                                ) : (
                                  "Apply"
                                )}
                              </button>
                            </div>

                            {/* Available & Inapplicable Tabs */}
                            <div className="coupon-tab-row">
                              <button
                                className={`coupon-tab-btn ${
                                  activeCouponTab === "available" ? "active" : ""
                                }`}
                                onClick={() => setActiveCouponTab("available")}
                              >
                                Available Offers ({availableCoupons.length})
                              </button>
                              <button
                                className={`coupon-tab-btn ${
                                  activeCouponTab === "inapplicable" ? "active" : ""
                                }`}
                                onClick={() => setActiveCouponTab("inapplicable")}
                              >
                                Other Offers ({inapplicableCoupons.length})
                              </button>
                            </div>

                            {/* Tickets List */}
                            {couponsLoading ? (
                              <div className="text-center py-3 text-muted small">
                                <span className="spinner-border spinner-border-sm me-2"></span>
                                Loading offers...
                              </div>
                            ) : (
                              <div className="coupons-tickets-list">
                                {(activeCouponTab === "available"
                                  ? availableCoupons
                                  : inapplicableCoupons
                                ).length === 0 ? (
                                  <div className="text-center py-3 text-muted small">
                                    No {activeCouponTab === "available" ? "applicable" : "other"} offers available right now.
                                  </div>
                                ) : (
                                  (activeCouponTab === "available"
                                    ? availableCoupons
                                    : inapplicableCoupons
                                  ).map((c) => {
                                    const isThisApplied =
                                      appliedCoupon?.code &&
                                      appliedCoupon.code.trim().toLowerCase() ===
                                        c.code.trim().toLowerCase();

                                    return (
                                      <div
                                        key={c.discountId || c.code}
                                        className={`luxury-ticket ${
                                          activeCouponTab === "inapplicable"
                                            ? "inapplicable"
                                            : ""
                                        }`}
                                      >
                                        <div className="ticket-notch-strip">
                                          <span className="ticket-notch-dot"></span>
                                          <span className="ticket-notch-dot"></span>
                                          <span className="ticket-notch-dot"></span>
                                        </div>
                                        <div className="ticket-main">
                                          <div className="ticket-info">
                                            <span className="ticket-code-tag">{c.code}</span>
                                            <h6 className="ticket-title">{c.label || c.code}</h6>
                                            <p className="ticket-subtitle">
                                              {c.message || c.description || "Special beauty discount"}
                                            </p>
                                          </div>
                                          {activeCouponTab === "available" && (
                                            <button
                                              className={`ticket-action-btn ${
                                                isThisApplied ? "applied" : ""
                                              }`}
                                              onClick={() => {
                                                if (isThisApplied) return;
                                                handleApplyCoupon(c.code);
                                              }}
                                              disabled={applyingCoupon || isThisApplied}
                                            >
                                              {isThisApplied ? "Applied ✓" : "Apply"}
                                            </button>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })
                                )}
                              </div>
                            )}

                            {/* COD Incompatibility Note */}
                            <div className="coupon-disclaimer-note">
                              <i className="bi bi-info-circle-fill"></i>
                              <span>
                                <strong>Note:</strong> Applying any coupon or bank offer disables Cash on Delivery (COD). All online payment options remain available.
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* ── 2. ORDER SUMMARY CARD ── */}
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
                          <span className="summary-value">Rs {livePriceDetails.bagMrp}/-</span>
                        </div>
                        <div className="summary-row p-0">
                          <span className="summary-header-left fw-normal">Bag Discount</span>
                          <span className="summary-value">Rs {livePriceDetails.bagDiscount || 0}/-</span>
                        </div>
                        <div className="summary-row p-0">
                          <span className="summary-header-left fw-normal">Coupon Discount</span>
                          <span
                            className={`summary-value ${
                              (livePriceDetails.couponDiscount || 0) > 0 ? "text-success fw-bold" : ""
                            }`}
                          >
                            {(livePriceDetails.couponDiscount || 0) > 0
                              ? `- Rs ${livePriceDetails.couponDiscount}/-`
                              : `Rs 0/-`}
                          </span>
                        </div>

                        {(livePriceDetails.pointsDiscount || 0) > 0 && (
                          <div className="summary-row p-0">
                            <span className="summary-header-left fw-normal">Points Discount</span>
                            <span className="summary-value text-success">
                              - Rs {livePriceDetails.pointsDiscount}/-
                            </span>
                          </div>
                        )}

                        {/* Extra COD handling fee row */}
                        {activeTab === "cod" && (
                          <div className="summary-row p-0 cod-charge-row">
                            <span className="summary-header-left fw-normal d-flex align-items-center">
                              Cash on Delivery Fee
                              <span className="badge-cod-fee ms-2">+₹50</span>
                            </span>
                            <span className="summary-value" style={{ color: "#d97706" }}>
                              Rs 50/-
                            </span>
                          </div>
                        )}

                        <div className="taxable-section p-0">
                          <div className="summary-row p-0">
                            <span className="summary-header-left fw-normal">
                              GST {livePriceDetails.gstRate}
                            </span>
                            <span className="summary-value">Rs {livePriceDetails.gstAmount}/-</span>
                          </div>
                          <div className="summary-row p-0">
                            <span className="summary-header-left fw-normal">Shipping</span>
                            <span className="summary-value">
                              {livePriceDetails.shipping > 0
                                ? `Rs ${livePriceDetails.shipping}/-`
                                : "Free"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Footer - Total Payable */}
                      <div className="summary-footer">
                        <div className="total-label">Total Payable</div>
                        <div className="total-value">Rs {livePriceDetails.payable}</div>
                      </div>
                    </div>

                    {/* Savings Message */}
                    {livePriceDetails.savingsMessage && (
                      <p className="savings-message mt-3">
                        {livePriceDetails.savingsMessage}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Floating Animated Coupon Toast */}
      {couponToast.show && (
        <div className="coupon-toast-container">
          <div className={`coupon-toast ${couponToast.type}`}>
            <span className="fs-5">
              {couponToast.type === "success" && <i className="bi bi-check-circle-fill text-success"></i>}
              {couponToast.type === "error" && <i className="bi bi-x-circle-fill text-danger"></i>}
              {couponToast.type === "warning" && <i className="bi bi-exclamation-circle-fill text-warning"></i>}
              {couponToast.type === "info" && <i className="bi bi-info-circle-fill text-info"></i>}
            </span>
            <div className="coupon-toast-content">{couponToast.message}</div>
          </div>
        </div>
      )}

      {/* Premium Alert Modal */}
      <Modal
        show={customAlert.show}
        onHide={handleCloseAlert}
        centered
        dialogClassName="premium-alert-dialog"
        contentClassName="premium-alert-content"
        backdrop="static"
        keyboard={false}
      >
        <Modal.Body className="text-center p-4">
          <div className={`alert-icon-wrapper ${customAlert.type} mb-3`}>
            {customAlert.type === "success" && <i className="bi bi-check-lg" style={{ fontSize: "2rem" }}></i>}
            {customAlert.type === "error" && <i className="bi bi-exclamation-triangle" style={{ fontSize: "2rem" }}></i>}
            {customAlert.type === "warning" && <i className="bi bi-exclamation-circle" style={{ fontSize: "2rem" }}></i>}
            {customAlert.type === "info" && <i className="bi bi-info-lg" style={{ fontSize: "2rem" }}></i>}
          </div>
          <p className="premium-alert-message mb-4">{customAlert.message}</p>
          <button className="premium-alert-btn px-4 py-2" onClick={handleCloseAlert}>
            OK
          </button>
        </Modal.Body>
      </Modal>

      <Footer />
    </>
  );
};

export default PaymentProcess;
