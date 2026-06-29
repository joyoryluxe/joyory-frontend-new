// PaymentProcess.jsx  –  GST added, Bootstrap-5 only, zero breaking changes
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
    type: "info", // "success" | "error" | "warning" | "info"
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

  // NEW – read GST fields passed from cart / backend
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
            return showAlert("Payment verification failed.", "Payment Verification", "error");

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
                        {pointsDiscount > 0 && (
                          <div className="summary-row p-0">
                            <span className="summary-header-left fw-normal">Points Discount</span>
                            <span className="summary-value">Rs {pointsDiscount}/-</span>
                          </div>
                        )}

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
          {/* <h4 className="premium-alert-title mb-2">{customAlert.title}</h4> */}
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


//=========================================================Done-Code(End)=========================================================

