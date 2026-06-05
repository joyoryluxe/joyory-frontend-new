// src/pages/AddressSelection.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../css/AddressSelection.css";
import Header from "./Header";
import { Spinner, Modal } from "react-bootstrap";

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
      const res = await fetch(CART_API, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch cart");
      const data = await res.json();

      setCartData(data.cart || data.items || []);

      const priceDetailsData = data.priceDetails || {};
      setPriceDetails({
        bagMrp: priceDetailsData.bagMrp || 0,
        bagDiscount: priceDetailsData.bagDiscount || 0,
        autoDiscount: priceDetailsData.autoDiscount || 0,
        couponDiscount: priceDetailsData.couponDiscount || 0,
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
        pointsToUse: priceDetails?.referralPointsUsed || 0,
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

  const ProcessingOverlay = () => (
    <Modal show={showProcessingModal} backdrop="static" keyboard={false} centered>
      <Modal.Body className="text-center py-5">
        <Spinner animation="border" role="status" variant="primary" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Processing...</span>
        </Spinner>
        <div className="mt-3">
          <h5 className="mb-2">{processingMessage || "Processing your order..."}</h5>
          <p className="text-muted mb-0">Please wait while we prepare your payment</p>
        </div>
      </Modal.Body>
    </Modal>
  );

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
                  <div className="address-contact">
                    <span>📱 {addr.phone || "-"}</span>
                    {addr.email && <span style={{ marginLeft: "15px" }}>✉️ {addr.email}</span>}
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

            <div className="price-row taxable-amount-row">
              <span>Taxable Amount:</span>
              <span>₹{formatCurrency(priceDetails.taxableAmount)}</span>
            </div>

            <div className="price-row">
              <span>GST ({priceDetails.gstRate || "0%"})</span>
              <span>+₹{formatCurrency(priceDetails.gstAmount)}</span>
            </div>

            {priceDetails.gstMessage && (
              <div className="gst-message">
                <span className="gst-note">💡 Note:</span> {priceDetails.gstMessage}
              </div>
            )}

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