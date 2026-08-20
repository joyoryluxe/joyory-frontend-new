// PaymentProcess.jsx – Modularized with subcomponents
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Modal } from "react-bootstrap";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import "../../styles/PaymentProcess.css";

import {
  getPaymentMethods,
  setPaymentMethod as apiSetPaymentMethod,
  processCodPayment,
  confirmCodPayment,
  createRazorpayOrder,
  verifyRazorpayPayment,
  processWalletPayment,
  processGiftCardPayment,
} from "../../api/paymentApi";

import PaymentMethodList from "../../components/sections/cart/PaymentMethodList";
import PaymentOrderSummary from "../../components/sections/cart/PaymentOrderSummary";

const RAZORPAY_KEY_ID = "rzp_live_V7ncMRhIoJhW2N";

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
  const priceDetails = location.state?.priceDetails || {};

  const {
    gstRate = "0%",
    gstAmount = 0,
    gstMessage = "",
  } = priceDetails;

  const pointsDiscount = priceDetails.pointsDiscount || priceDetails.referralPointsDiscount || 0;

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
        const res = await getPaymentMethods();
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
      await apiSetPaymentMethod({
        orderId,
        paymentMethod: methodKey.toUpperCase(),
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

      const codRes = await processCodPayment(payload);
      const codData = codRes.data;
      if (!codData?.success) throw new Error(codData?.message || "COD failed.");

      const confirmRes = await confirmCodPayment(payload);
      const confirmData = confirmRes.data;
      if (!confirmData?.success)
        throw new Error(confirmData?.message || "COD confirmation failed.");

      navigate(`/ordersuccess/${orderId}`, {
        replace: true,
        state: {
          paymentResponse: confirmData,
          backendResponse: confirmData,
          shippingCharge: priceDetails.shipping || 0,
          discountDetails: {
            bagDiscount: priceDetails.bagDiscount || 0,
            couponDiscount: priceDetails.couponDiscount || 0,
            pointsDiscount: pointsDiscount,
          },
          totalDiscount:
            (priceDetails.bagDiscount || 0) +
            (priceDetails.couponDiscount || 0) +
            pointsDiscount,
          payable: priceDetails.payable || 0,
          bagMrp: priceDetails.bagMrp || 0,
          gstRate,
          gstAmount,
          gstMessage,
        },
      });
    } catch (err) {
      console.error("COD Exception:", err);
      showAlert(err.message || "COD process failed.", "COD Error", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRazorpayPayment = async () => {
    try {
      setIsProcessing(true);
      await apiSetPaymentMethod({ orderId, paymentMethod: "ONLINE" });

      const loaded = await loadRazorpayScript();
      if (!loaded || !window.Razorpay)
        return showAlert("Razorpay SDK failed to load.", "SDK Error", "error");

      const orderRes = await createRazorpayOrder({ orderId });
      const orderData = orderRes.data;
      if (!orderData?.success || !orderData.razorpayOrderId)
        return showAlert(orderData?.message || "Failed to create Razorpay order.", "Order Error", "error");

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

          const verifyRes = await verifyRazorpayPayment(payload);
          const verifyData = verifyRes.data;
          if (!verifyData?.success)
            return showAlert(verifyData?.message || "Payment verification failed.", "Payment Verification", "error");

          navigate(`/ordersuccess/${orderId}`, {
            replace: true,
            state: {
              paymentResponse: response,
              backendResponse: verifyData,
              shippingCharge: priceDetails.shipping || 0,
              discountDetails: {
                bagDiscount: priceDetails.bagDiscount || 0,
                couponDiscount: priceDetails.couponDiscount || 0,
                pointsDiscount: pointsDiscount,
              },
              totalDiscount:
                (priceDetails.bagDiscount || 0) +
                (priceDetails.couponDiscount || 0) +
                pointsDiscount,
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

      const res = await processWalletPayment(payload);
      const data = res.data;

      if (!data?.success)
        throw new Error(data?.message || "Wallet payment failed.");

      navigate(`/ordersuccess/${orderId}`, {
        replace: true,
        state: {
          paymentResponse: data,
          backendResponse: data,
          shippingCharge: priceDetails.shipping || 0,
          discountDetails: {
            bagDiscount: priceDetails.bagDiscount || 0,
            couponDiscount: priceDetails.couponDiscount || 0,
            pointsDiscount: pointsDiscount,
          },
          totalDiscount:
            (priceDetails.bagDiscount || 0) +
            (priceDetails.couponDiscount || 0) +
            pointsDiscount,
          payable: priceDetails.payable || 0,
          bagMrp: priceDetails.bagMrp || 0,
          gstRate,
          gstAmount,
          gstMessage,
        },
      });
    } catch (err) {
      console.error("Wallet payment error:", err);
      showAlert(err.message || "Wallet payment failed.", "Payment Failed", "error");
    } finally {
      setIsProcessing(false);
    }
  };

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

      const res = await processGiftCardPayment(payload);
      const data = res.data;

      if (!data?.success)
        throw new Error(data?.message || "Gift Card payment failed.");

      navigate(`/ordersuccess/${orderId}`, {
        replace: true,
        state: {
          paymentResponse: data,
          backendResponse: data,
          shippingCharge: priceDetails.shipping || 0,
          discountDetails: {
            bagDiscount: priceDetails.bagDiscount || 0,
            couponDiscount: priceDetails.couponDiscount || 0,
            pointsDiscount: pointsDiscount,
          },
          totalDiscount:
            (priceDetails.bagDiscount || 0) +
            (priceDetails.couponDiscount || 0) +
            pointsDiscount,
          payable: priceDetails.payable || 0,
          bagMrp: priceDetails.bagMrp || 0,
          gstRate,
          gstAmount,
          gstMessage,
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

            <div className="payment-container">
              <div className="row g-4">
                <div className="d-lg-flex gap-4">
                  {/* Payment Gateways List */}
                  <PaymentMethodList
                    methods={methods}
                    activeTab={activeTab}
                    onSelectMethod={handleSelectMethod}
                    onCashOnDelivery={handleCashOnDelivery}
                    onWalletPayment={handleWalletPayment}
                    onGiftCardPayment={handleGiftCardPayment}
                    onRazorpayPayment={handleRazorpayPayment}
                    isProcessing={isProcessing}
                  />

                  {/* Order Price Summary */}
                  <PaymentOrderSummary
                    priceDetails={priceDetails}
                    pointsDiscount={pointsDiscount}
                    gstRate={gstRate}
                    gstAmount={gstAmount}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Alert Modal */}
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
