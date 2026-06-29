// src/pages/AddressSelection.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/AddressSelection.css";
import Header from "../components/common/Header";
import { Spinner, Modal } from "react-bootstrap";
import { FaPhoneAlt, FaEnvelope } from "react-icons/fa";

const PROFILE_API = "https://beauty.joyory.com/api/user/profile";
const CART_API = "https://beauty.joyory.com/api/user/cart/summary";

const AddressSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [profile, setProfile] = useState({});
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [newAddress, setNewAddress] = useState({
    name: "",
    phone: "",
    email: "",
    addressLine1: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [cartData, setCartData] = useState([]);
  const [priceDetails, setPriceDetails] = useState({
    bagMrp: 0,
    bagDiscount: 0,
    autoDiscount: 0,
    couponDiscount: 0,
    pointsDiscount: 0,
    pointsUsed: 0,
    referralPointsUsed: 0,
    shipping: 0,
    taxableAmount: 0,
    gstRate: "0%",
    gstAmount: 0,
    gstMessage: "",
    payable: 0,
    totalSavings: 0,
    savingsMessage: "",
    shippingMessage: "",
    appliedCoupon: null,
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState("");
  const [showProcessingModal, setShowProcessingModal] = useState(false);

  // Optional state for inline error message
  const [addressError, setAddressError] = useState("");

  useEffect(() => {
    if (location.state?.priceDetails) {
      setPriceDetails({
        bagMrp: location.state.priceDetails.bagMrp || 0,
        bagDiscount: location.state.priceDetails.bagDiscount || 0,
        autoDiscount: location.state.priceDetails.autoDiscount || 0,
        couponDiscount: location.state.priceDetails.couponDiscount || 0,
        pointsDiscount: location.state.priceDetails.pointsDiscount || 0,
        pointsUsed: location.state.priceDetails.pointsUsed || 0,
        referralPointsUsed: location.state.priceDetails.referralPointsUsed || 0,
        shipping: location.state.priceDetails.shipping || 0,
        taxableAmount: location.state.priceDetails.taxableAmount || 0,
        gstRate: location.state.priceDetails.gstRate || "0%",
        gstAmount: location.state.priceDetails.gstAmount || 0,
        gstMessage: location.state.priceDetails.gstMessage || "",
        payable: location.state.priceDetails.payable || 0,
        totalSavings: location.state.priceDetails.totalSavings || 0,
        savingsMessage: location.state.priceDetails.savingsMessage || "",
        shippingMessage: location.state.priceDetails.shippingMessage || "",
        appliedCoupon: location.state.priceDetails.appliedCoupon || null,
      });
      setCartData(location.state.cartItems || []);
      console.log("🟢 Loaded price details from CartPage:", location.state.priceDetails);
    } else {
      loadCart();
    }

    loadProfileAndAddresses();
  }, []);

  const loadProfileAndAddresses = async () => {
    try {
      setProcessingMessage("Loading profile...");
      const res = await fetch(PROFILE_API, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch profile");
      const data = await res.json();

      const prof = data.profile || {};
      setProfile(prof);

      setNewAddress({
        name: prof.name || "",
        phone: prof.phone || "",
        email: prof.email || "",
        addressLine1: "",
        city: "",
        state: "",
        pincode: "",
      });

      const addressesWithProfile = (data.addresses || []).map((addr) => ({
        ...addr,
        name: addr.name || prof.name || "",
        phone: addr.phone || prof.phone || "",
        email: addr.email || prof.email || "",
      }));

      // setAddresses(addressesWithProfile);
      setAddresses(addressesWithProfile);

      // ✅ Auto-select first address if available
      if (addressesWithProfile.length > 0) {
        setSelectedAddressId(addressesWithProfile[0]._id);
      }
    } catch (err) {
      console.error(err.message);
      alert("Failed to load profile and addresses");
    }
  };

  const loadCart = async () => {
    try {
      setProcessingMessage("Loading cart data...");
      const queryParams = new URLSearchParams();
      
      const wantPoints = localStorage.getItem("useRewardPoints") === "true";
      if (wantPoints) {
        const savedAmount = localStorage.getItem("rewardPointsAmount");
        const pointsToUse = savedAmount ? Number(savedAmount) : 99999999;
        queryParams.append("pointsToUse", String(pointsToUse));
      } else {
        queryParams.append("pointsToUse", "0");
      }

      const savedCoupon = localStorage.getItem("appliedCoupon");
      if (savedCoupon) {
        queryParams.append("discount", savedCoupon);
      }

      const queryString = queryParams.toString();
      const url = queryString ? `${CART_API}?${queryString}` : CART_API;

      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch cart");
      const data = await res.json();

      setCartData(data.cart || data.items || []);

      const priceDetailsData = data.priceDetails || {};
      setPriceDetails({
        bagMrp: priceDetailsData.bagMrp || 0,
        bagDiscount: priceDetailsData.bagDiscount || 0,
        autoDiscount: priceDetailsData.autoDiscount || 0,
        couponDiscount: priceDetailsData.couponDiscount || 0,
        pointsDiscount: data.wallet?.pointsDiscount || 0,
        pointsUsed: data.wallet?.pointsUsed || 0,
        referralPointsUsed: data.wallet?.pointsUsed || 0,
        shipping: priceDetailsData.shippingCharge || 0,
        taxableAmount: priceDetailsData.taxableAmount || 0,
        gstRate: priceDetailsData.gstRate || "0%",
        gstAmount: priceDetailsData.gstAmount || 0,
        gstMessage: priceDetailsData.gstMessage || "",
        payable: priceDetailsData.payable || 0,
        totalSavings: priceDetailsData.totalSavings || priceDetailsData.bagDiscount || 0,
        savingsMessage: priceDetailsData.savingsMessage || "",
        shippingMessage: priceDetailsData.shippingMessage || "",
        appliedCoupon: data.appliedCoupon || null,
      });
    } catch (err) {
      console.error(err.message);
      alert("Failed to load cart data");
    }
  };

  const saveAddress = async () => {
    const { name, phone, email, addressLine1, city, state, pincode } = newAddress;

    if (!name || !phone || !email || !addressLine1 || !city || !state || !pincode) {
      return alert("Please fill all required fields");
    }
    if (!/^\d{10}$/.test(phone)) return alert("Phone number must be 10 digits");
    if (!/^\S+@\S+\.\S+$/.test(email)) return alert("Please enter a valid email");
    if (!/^\d{6}$/.test(pincode)) return alert("Please enter a valid 6-digit pincode");

    const isDuplicate = addresses.some((addr) => {
      if (editingAddressId && addr._id === editingAddressId) return false;
      return (
        addr.addressLine1.trim().toLowerCase() === addressLine1.trim().toLowerCase() &&
        addr.city.trim().toLowerCase() === city.trim().toLowerCase() &&
        addr.state.trim().toLowerCase() === state.trim().toLowerCase() &&
        String(addr.pincode).trim() === String(pincode).trim()
      );
    });

    if (isDuplicate) {
      return alert("This address already exists. Please use or edit the existing one.");
    }

    console.log("📤 Sending to backend:", newAddress);

    try {
      let res;
      if (editingAddressId) {
        res = await fetch(`${PROFILE_API}/address/${editingAddressId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(newAddress),
        });
      } else {
        res = await fetch(`${PROFILE_API}/address`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(newAddress),
        });
      }

      const data = await res.json();
      console.log("📥 Response:", data);

      if (!res.ok) {
        if (data.message) {
          alert(data.message);
          return;
        }
        throw new Error("Failed to save address");
      }

      await loadProfileAndAddresses();

      setEditingAddressId(null);
      setShowForm(false);
      setNewAddress({
        name: profile.name || "",
        phone: profile.phone || "",
        email: profile.email || "",
        addressLine1: "",
        city: "",
        state: "",
        pincode: "",
      });

    } catch (err) {
      console.error("❌ Error saving address:", err);
      alert(err.message || "Failed to save address");
    }
  };

  const editAddress = (addr) => {
    setEditingAddressId(addr._id);
    setNewAddress({
      name: addr.name || "",
      phone: addr.phone || "",
      email: addr.email || "",
      addressLine1: addr.addressLine1 || "",
      city: addr.city || "",
      state: addr.state || "",
      pincode: addr.pincode || "",
    });
    setShowForm(true);
  };

  const deleteAddressHandler = async (id) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    try {
      const res = await fetch(`${PROFILE_API}/address/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete address");
      const data = await res.json();
      console.log("📥 DELETE Response:", data);
      await loadProfileAndAddresses();
      if (selectedAddressId === id) setSelectedAddressId(null);
    } catch (err) {
      console.error(err.message);
      alert("Failed to delete address");
    }
  };

  // Modified proceedToPayment to show alert if no address selected
  const proceedToPayment = async () => {
    if (!selectedAddressId) {
      // Show alert popup as requested
      alert("Please select a delivery address before proceeding.");
      setAddressError("Please select a delivery address."); // Optional inline error
      return;
    }
    setAddressError(""); // Clear any previous error

    const selectedAddress = addresses.find((a) => a._id === selectedAddressId);

    try {
      setIsProcessing(true);
      setShowProcessingModal(true);
      setProcessingMessage("Preparing your order...");

      const payload = {
        discountCode: priceDetails?.appliedCoupon?.code || null,
        pointsToUse: priceDetails?.pointsUsed || priceDetails?.referralPointsUsed || 0,
        giftCardCode: priceDetails?.giftCard?.code || null,
        giftCardPin: priceDetails?.giftCard?.pin || null,
        giftCardAmount: priceDetails?.giftCard?.amount || 0,
        payable: priceDetails?.payable || 0,
        taxableAmount: priceDetails?.taxableAmount || 0,
        gstAmount: priceDetails?.gstAmount || 0,
        gstRate: priceDetails?.gstRate || "0%",
      };

      console.log("📦 Sending Initiate Order Payload:", payload);

      setProcessingMessage("Validating payment details...");
      await new Promise(resolve => setTimeout(resolve, 800));

      setProcessingMessage("Creating your order...");

      const initiateRes = await fetch(
        "https://beauty.joyory.com/api/user/cart/order/initiate",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        }
      );

      const contentType = initiateRes.headers.get("content-type");
      let initiateData;

      if (contentType && contentType.includes("application/json")) {
        initiateData = await initiateRes.json();
      } else {
        const text = await initiateRes.text();
        console.error("❌ Non-JSON response:", text.substring(0, 200));
        throw new Error(`Server error: Received ${contentType || 'HTML'} instead of JSON`);
      }

      console.log("🧾 initiateData from backend:", initiateData);

      const orderId =
        initiateData.orderId ||
        initiateData.order_id ||
        initiateData.data?.orderId ||
        initiateData.data?.id ||
        initiateData.order?._id ||
        null;

      if (!initiateRes.ok || !orderId) {
        throw new Error(initiateData.message || "Failed to initiate order");
      }

      console.log("✅ Using orderId:", orderId);
      console.log("💰 Final Payable Amount:", priceDetails?.payable);

      setProcessingMessage("Order created successfully!");

      setTimeout(() => {
        setIsProcessing(false);
        setShowProcessingModal(false);

        navigate("/PaymentProcess", {
          state: {
            orderId,
            selectedAddress,
            cartItems: cartData,
            priceDetails: {
              ...priceDetails,
              taxableAmount: priceDetails?.taxableAmount || 0,
              gstRate: priceDetails?.gstRate || "0%",
              gstAmount: priceDetails?.gstAmount || 0,
              gstMessage: priceDetails?.gstMessage || "",
              payable: priceDetails?.payable || 0,
              bagDiscount: priceDetails?.bagDiscount || 0,
              couponDiscount: priceDetails?.couponDiscount || 0,
              pointsDiscount: priceDetails?.pointsDiscount || 0,
              pointsUsed: priceDetails?.pointsUsed || 0,
              referralPointsUsed: priceDetails?.referralPointsUsed || 0,
              shipping: priceDetails?.shipping || 0,
              totalSavings: priceDetails?.totalSavings || 0,
              savingsMessage: priceDetails?.savingsMessage || "",
              appliedCoupon: priceDetails?.appliedCoupon || null,
            },
          },
        });
      }, 500);

    } catch (error) {
      console.error("❌ Order initiation failed:", error);

      setProcessingMessage(`Error: ${error.message || "Could not start payment process"}`);

      setTimeout(() => {
        setIsProcessing(false);
        setShowProcessingModal(false);
        setProcessingMessage("");
        alert(error.message || "Could not start payment process. Please try again.");
      }, 2000);
    }
  };

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return "0.00";
    return parseFloat(amount).toFixed(2);
  };

  const getStepStatus = (stepIndex) => {
    const isError = processingMessage.startsWith("Error");

    if (isError) {
      if (processingMessage.includes("Preparing")) return stepIndex === 1 ? "error" : (stepIndex > 1 ? "pending" : "completed");
      if (processingMessage.includes("Validating") || processingMessage.includes("payment")) return stepIndex === 2 ? "error" : (stepIndex === 1 ? "completed" : "pending");
      if (processingMessage.includes("Creating") || processingMessage.includes("order")) return stepIndex === 3 ? "error" : (stepIndex < 3 ? "completed" : "pending");
      return "error";
    }

    if (processingMessage === "Preparing your order...") {
      if (stepIndex === 1) return "active";
      if (stepIndex > 1) return "pending";
    }
    if (processingMessage === "Validating payment details...") {
      if (stepIndex < 2) return "completed";
      if (stepIndex === 2) return "active";
      if (stepIndex > 2) return "pending";
    }
    if (processingMessage === "Creating your order...") {
      if (stepIndex < 3) return "completed";
      if (stepIndex === 3) return "active";
      if (stepIndex > 3) return "pending";
    }
    if (processingMessage === "Order created successfully!") {
      return "completed";
    }

    if (stepIndex === 1) return "active";
    return "pending";
  };

  const ProcessingOverlay = () => {
    const steps = [
      { id: 1, title: "Verifying order info", desc: "Syncing bag items and pricing details" },
      { id: 2, title: "Securing gateway", desc: "Establishing secure transaction handshake" },
      { id: 3, title: "Finalizing order", desc: "Registering order details with inventory" },
    ];

    const isSuccess = processingMessage === "Order created successfully!";
    const isError = processingMessage.startsWith("Error");

    return (
      <Modal
        show={showProcessingModal}
        backdrop="static"
        keyboard={false}
        centered
        dialogClassName="checkout-processing-modal"
      >
        <Modal.Body className="p-4 p-md-5">
          <div className="text-center mb-4">
            <div className="checkout-badge-icon mb-3">
              {isSuccess ? (
                <svg className="success-checkmark-svg" viewBox="0 0 52 52">
                  <circle className="success-checkmark-circle" cx="26" cy="26" r="25" fill="none" />
                  <path className="success-checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                </svg>
              ) : isError ? (
                <div className="error-alert-icon">⚠️</div>
              ) : (
                <div className="secure-lock-container">
                  <svg className="secure-lock-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </div>
              )}
            </div>
            <h4 className="checkout-modal-title">
              {isSuccess ? "Order Confirmed!" : isError ? "Checkout Failed" : "Secure Checkout"}
            </h4>
            <p className="checkout-modal-subtitle text-muted">
              {isSuccess
                ? "Your order has been created successfully."
                : isError
                  ? "Please review details and try again."
                  : "We are finalizing your payment process securely."}
            </p>
          </div>

          {!isError && (
            <div className="checkout-steps-list">
              {steps.map((step, idx) => {
                const status = getStepStatus(step.id);
                return (
                  <div key={step.id} className={`checkout-step-item status-${status}`}>
                    <div className="checkout-step-indicator">
                      {status === "completed" ? (
                        <div className="indicator-icon completed">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </div>
                      ) : status === "active" ? (
                        <div className="indicator-icon active">
                          <span className="pulse-dot"></span>
                        </div>
                      ) : (
                        <div className="indicator-icon pending">
                          <span className="pending-dot"></span>
                        </div>
                      )}
                      {idx < steps.length - 1 && (
                        <div className={`indicator-line status-${status === "completed" ? "completed" : "pending"}`} />
                      )}
                    </div>
                    <div className="checkout-step-content">
                      <div className="checkout-step-title">{step.title}</div>
                      <div className="checkout-step-desc">{step.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {isError && (
            <div className="checkout-error-box py-3 px-4 mb-3 text-center">
              <p className="error-message-text mb-0">{processingMessage}</p>
            </div>
          )}

          <div className="checkout-modal-footer text-center mt-4 pt-3 border-top">
            <span className="text-muted small d-inline-flex align-items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              PCI-DSS Compliant • 256-bit SSL Encryption
            </span>
          </div>
        </Modal.Body>
      </Modal>
    );
  };

  return (
    <>
      <Header />
      <ProcessingOverlay />

      <div className="address-selection-container mt-lg-5 pt-lg-5 page-title-main-name">
        {/* Stepper */}
        <div className="stepper-wrapper pt-lg-5 mt-lg-4 mt-5 pt-4">
          <div className="step step-active page-title-main-name">Cart</div>
          <div className="dividers"></div>
          <div className="step step-active page-title-main-name">Address</div>
          <div className="dividers"></div>
          <div className="step page-title-main-name">Payment</div>
        </div>

        <div className="main-content">
          {/* Left Column */}
          <div className="left-column">
            <h3 className="section-title page-title-main-name title-page-title">Select Delivery Address</h3>

            {!showForm ? (
              <div
                className="add-card"
                onClick={() => {
                  setNewAddress({
                    name: profile.name || "",
                    phone: profile.phone || "",
                    email: profile.email || "",
                    addressLine1: "",
                    city: "",
                    state: "",
                    pincode: "",
                  });
                  setShowForm(true);
                }}
              >
                <span className="add-card-icon">+</span>
                <p className="add-card-text">Add New Address</p>
              </div>
            ) : (
              <div className="form-card">
                <input
                  className="form-input page-title-main-name"
                  type="text"
                  placeholder="Full Name"
                  value={newAddress.name}
                  onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                />
                <input
                  className="form-input page-title-main-name"
                  type="text"
                  placeholder="Phone Number"
                  value={newAddress.phone}
                  onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                />
                <input
                  className="form-input page-title-main-name"
                  type="email"
                  placeholder="Email"
                  value={newAddress.email}
                  onChange={(e) => setNewAddress({ ...newAddress, email: e.target.value })}
                />
                <textarea
                  className="form-input page-title-main-name textarea-input"
                  placeholder="Address Line"
                  value={newAddress.addressLine1}
                  onChange={(e) => setNewAddress({ ...newAddress, addressLine1: e.target.value })}
                />
                <input
                  className="form-input page-title-main-name"
                  type="text"
                  placeholder="City"
                  value={newAddress.city}
                  onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                />
                <input
                  className="form-input page-title-main-name"
                  type="text"
                  placeholder="State"
                  value={newAddress.state}
                  onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                />
                <input
                  className="form-input page-title-main-name"
                  type="text"
                  placeholder="Pincode"
                  value={newAddress.pincode}
                  onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                />
                <div className="button-group">
                  <button className="save-btn page-title-main-name" onClick={saveAddress} disabled={isProcessing}>
                    {isProcessing ? "Saving..." : (editingAddressId ? "Update" : "Save")}
                  </button>
                  <button
                    className="cancel-btn page-title-main-name"
                    onClick={() => {
                      setShowForm(false);
                      setEditingAddressId(null);
                    }}
                    disabled={isProcessing}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {addresses.map((addr) => (
              <div
                key={addr._id}
                className={`address-card ${selectedAddressId === addr._id ? 'address-card-selected' : ''}`}
              >
                <div
                  className="address-content"
                  onClick={() => {
                    setSelectedAddressId(addr._id);
                    setAddressError(""); // Clear error when an address is selected
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
                    <strong className="address-name">{addr.name}</strong>
                    {selectedAddressId === addr._id && (
                      <span className="selected-badge">✓ Selected</span>
                    )}
                  </div>
                  <p className="address-info">
                    {addr.addressLine1}, {addr.city}, {addr.state} - {addr.pincode}
                  </p>
                  <div className="address-contact" style={{ display: "flex", alignItems: "center", gap: "15px", flexWrap: "wrap" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                      <FaPhoneAlt style={{ color: "#6b7280" }} /> {addr.phone || "-"}
                    </span>
                    {addr.email && (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                        <FaEnvelope style={{ color: "#6b7280" }} /> {addr.email}
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ display: "flex", gap: "5px", flexShrink: 0 }}>
                  <button className="edit-btn" onClick={() => editAddress(addr)} disabled={isProcessing}>
                    {isProcessing ? "..." : "Edit"}
                  </button>
                  <button className="delete-btn" onClick={() => deleteAddressHandler(addr._id)} disabled={isProcessing}>
                    {isProcessing ? "..." : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column */}
          <div className="right-column">
            <h4 className="order-summary-title">
              Order Summary ({cartData.length} {cartData.length === 1 ? 'item' : 'items'})
            </h4>

            <div className="price-row">
              <span>Bag MRP:</span>
              <span>₹{formatCurrency(priceDetails.bagMrp)}</span>
            </div>

            {priceDetails.bagDiscount > 0 && (
              <div className="price-row">
                <span>Bag Discount:</span>
                <span className="discount-amount">-₹{formatCurrency(priceDetails.bagDiscount)}</span>
              </div>
            )}

            <div className="price-row">
              <span>Shipping:</span>
              <span>
                {priceDetails.shipping === 0 ? (
                  <span className="free-shipping">Free Shipping</span>
                ) : (
                  <>
                    ₹{formatCurrency(priceDetails.shipping)}
                    {priceDetails.shippingMessage && (
                      <span style={{ color: "#1976d2", fontSize: 12, marginLeft: 6 }}>
                        ({priceDetails.shippingMessage})
                      </span>
                    )}
                  </>
                )}
              </span>
            </div>

            {priceDetails.couponDiscount > 0 && (
              <div className="price-row">
                <span>Coupon Discount:</span>
                <span className="discount-amount">-₹{formatCurrency(priceDetails.couponDiscount)}</span>
              </div>
            )}

            {priceDetails.pointsDiscount > 0 && (
              <div className="price-row">
                <span>Points Discount:</span>
                <span className="discount-amount">-₹{formatCurrency(priceDetails.pointsDiscount)}</span>
              </div>
            )}

            <div className="price-row taxable-amount-row">
              <span>Taxable Amount:</span>
              <span>₹{formatCurrency(priceDetails.taxableAmount)}</span>
            </div>

            <div className="price-row">
              <span>GST ({priceDetails.gstRate || "0%"})</span>
              <span>+₹{formatCurrency(priceDetails.gstAmount)}</span>
            </div>

            {/* {priceDetails.gstMessage && (
              <div className="gst-message">
                <span className="gst-note">💡 Note:</span> {priceDetails.gstMessage}
              </div>
            )} */}

            <hr className="section-divider" />

            <div className="price-row total-payable-row bg-white p-0">
              <span>Total Payable:</span>
              <span>₹{formatCurrency(priceDetails.payable)}</span>
            </div>

            {priceDetails.totalSavings > 0 && (
              <div className="savings-card m-0">
                {/* <div className="savings-amount">
                  🎉 You saved ₹{formatCurrency(priceDetails.totalSavings)}
                </div> */}
                {priceDetails.savingsMessage && (
                  <div className="savings-message m-0">
                    {priceDetails.savingsMessage}
                  </div>
                )}
              </div>
            )}

            {priceDetails.appliedCoupon?.code && (
              <div className="coupon-card">
                <span>
                  <strong>Applied Coupon:</strong> {priceDetails.appliedCoupon.code}
                  {priceDetails.appliedCoupon.discount && (
                    <span style={{ marginLeft: "10px" }}>- ₹{priceDetails.appliedCoupon.discount} off</span>
                  )}
                </span>
              </div>
            )}

            {/* Button is always clickable (disabled only during processing) */}
            <button
              className={`pay-btn ${isProcessing ? 'pay-btn-disabled' : ''}`}
              onClick={proceedToPayment}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Spinner
                    animation="border"
                    size="sm"
                    className="me-2"
                    style={{ width: '1rem', height: '1rem' }}
                  />
                  {processingMessage || "Processing..."}
                </>
              ) : (
                `Proceed to Pay ₹${formatCurrency(priceDetails.payable)}`
              )}
            </button>

            {/* Optional inline error message */}
            {addressError && (
              <div className="address-error-message">
                ⚠️ {addressError}
              </div>
            )}

            <div className="payment-note">
              <span className="secure-badge">✓</span>
              <span>GST Invoice Available • Secure Payment</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddressSelection;




//==============================================================Done-Code========================================================== 