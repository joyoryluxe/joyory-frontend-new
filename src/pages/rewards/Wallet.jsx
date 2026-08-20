import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/Wallet.css";
import Sidebarcomon from "../../components/common/SidebarCommon";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import wallets from "../../assets/wallet.svg";
import refunds from "../../assets/refunds.png";
import Payment from "../../assets/Payment.png";
import Disount from "../../assets/Disount.png";
import logo from "../../assets/logo.png";
import { FaWallet, FaStar } from "react-icons/fa";

const WalletPage = () => {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("wallet");

  // ✅ New: state for selected amount
  const [selectedAmount, setSelectedAmount] = useState(null);

  const API_BASE = "https://beauty.joyory.com/api/user/wallet";

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const fetchWallet = async () => {
    try {
      const res = await axios.get(API_BASE, {
        withCredentials: true, // ✅ sends cookies to backend
      });
      setWallet(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching wallet:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  // ✅ Modified: use selectedAmount instead of fixed 100
  const handleAddMoney = async () => {
    if (!selectedAmount) {
      alert("Please select an amount before proceeding.");
      return;
    }

    try {
      const orderRes = await axios.post(
        `${API_BASE}/create-order`,
        { amount: selectedAmount },
        {
          withCredentials: true, // ✅ send cookie for auth
        }
      );

      const { order } = orderRes.data;

      const options = {
        key: "rzp_live_V7ncMRhIoJhW2N", // your Razorpay key
        amount: order.amount,
        currency: order.currency,
        name: "Joyory Wallet",
        description: `Add ₹${selectedAmount} to Wallet`,
        order_id: order.id,
        handler: async function (response) {
          try {
            await axios.post(
              `${API_BASE}/verify-payment`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                amount: selectedAmount, // ✅ use selected amount
              },
              { withCredentials: true } // ✅ send cookie here too
            );
            alert(`Wallet top-up of ₹${selectedAmount} successful 🎉`);
            setSelectedAmount(null); // reset selection
            fetchWallet();
          } catch (err) {
            console.error("Payment verification failed:", err);
            alert("Payment verification failed ❌");
          }
        },
        theme: { color: "#3399cc" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Error adding money:", err);
    }
  };

  const handleAmountChange = (e) => {
    const val = e.target.value;
    if (val === "") {
      setSelectedAmount(null);
    } else {
      setSelectedAmount(parseInt(val, 10));
    }
  };

  const handleLogout = () => {
    axios
      .post(
        "https://beauty.joyory.com/api/user/logout",
        {},
        { withCredentials: true }
      )
      .then(() => {
        navigate("/login");
      })
      .catch((err) => {
        console.error("Logout failed:", err);
        navigate("/login");
      });
  };

  if (loading) return <p className="page-title-main-name text-center">Loading Wallet...</p>;

  return (
    <>
      <Header />

      <div className="wallet-page page-title-main-name">
        <div className="main-sidebar">
          <h2 className="wallet-title ms-4">Joyory Wallet</h2>
          <Sidebarcomon />
        </div>

        <main className="wallet-content">
          <div className="wallet-header-section">
            <h2 className="wallet-title">Joyory Wallet</h2>
            <p className="wallet-subtitle">Swipe, shine, slay – all in one tap</p>
          </div>

          <div className="wallet-dashboard-grid">
            {/* Left Side: Premium Digital Card & breakdown */}
            <div className="wallet-left-column">
              <div className="joyory-digital-card">
                <div className="card-overlay-shine"></div>
                <div className="card-header">
                  <span className="card-brand">JOYORY WALLET</span>
                  <div className="card-chip">
                    <div className="chip-line"></div>
                    <div className="chip-line"></div>
                    <div className="chip-line"></div>
                  </div>
                </div>
                <div className="card-body">
                  <span className="card-balance-label">Total Balance</span>
                  <h2 className="card-balance-val">₹ {wallet?.walletBalance || 0}</h2>
                </div>
                <div className="card-footer">
                  <span className="card-holder">PREMIUM MEMBER</span>
                  <span className="card-logo-symbol">
                    <img src={logo} alt="Joyory" className="card-logo-img" />
                  </span>
                </div>
              </div>

              <div className="balance-breakdown-row">
                <div className="breakdown-card cash-card">
                  <div className="breakdown-icon-wrap">
                    <FaWallet style={{ color: '#000', fontSize: '20px' }} />
                  </div>
                  <div className="breakdown-info">
                    <span className="breakdown-label">Joyory Cash</span>
                    <h4 className="breakdown-value">₹ {wallet?.joyoryCash || 0}</h4>
                  </div>
                </div>
                <div className="breakdown-card points-card">
                  <div className="breakdown-icon-wrap">
                    <FaStar style={{ color: '#000', fontSize: '20px' }} />
                  </div>
                  <div className="breakdown-info">
                    <span className="breakdown-label">Reward Points</span>
                    <h4 className="breakdown-value">{wallet?.rewardPoints || 0}</h4>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Action top up controls */}
            <div className="wallet-right-column">
              <div className="topup-panel">
                <h4 className="topup-title">Top Up Wallet</h4>
                <p className="topup-subtitle">Add funds instantly to your account</p>

                <div className="custom-amount-input-wrap">
                  <span className="currency-symbol">₹</span>
                  <input
                    type="number"
                    className="custom-amount-input"
                    placeholder="Enter amount to add"
                    value={selectedAmount || ""}
                    onChange={handleAmountChange}
                    min="1"
                  />
                </div>

                <div className="quick-amount-options">
                  {[200, 500, 1000, 2000, 3000].map((amt) => (
                    <button
                      key={amt}
                      className={`quick-amount-btn ${selectedAmount === amt ? "active" : ""}`}
                      onClick={() => setSelectedAmount(amt)}
                    >
                      + ₹{amt}
                    </button>
                  ))}
                </div>

                <button className="add-money-cta-btn" onClick={handleAddMoney}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  Confirm & Add Money
                </button>
              </div>
            </div>
          </div>

          <h3 className="wallet-benefits-title">Joyory Wallet Benefits</h3>
          <div className="wallet-benefits-grid">
            <div className="benefit-card">
              <div className="benefit-image-wrap">
                <img src={refunds} alt="Quick Refunds" />
              </div>
              <h4>Quick Refunds</h4>
              <p>Instant refunds directly credited to your Joyory wallet for fast and easy shopping.</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-image-wrap">
                <img src={Payment} alt="One-Tap Payment" />
              </div>
              <h4>One-Tap Payment</h4>
              <p>Skip the OTP and payment gateway steps. Checkout with a single tap using your balance.</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-image-wrap">
                <img src={Disount} alt="Special Discounts" />
              </div>
              <h4>Special Discounts</h4>
              <p>Gain access to wallet-exclusive coupons, cashback promotions, and beauty deals.</p>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </>
  );
};

export default WalletPage;
