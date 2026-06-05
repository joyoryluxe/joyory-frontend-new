import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/Wallet.css";
import Sidebarcomon from "./Sidebarcomon";
import Header from "./Header";
import Footer from "./Footer";
import wallets from "../assets/wallet.svg";
import refunds from "../assets/refunds.png";
import Payment from "../assets/Payment.png";
import Disount from "../assets/Disount.png";

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
          <h2 className="wallet-title">Joyory Wallet</h2>
          <p className="wallet-subtitle">Swipe, shine, slay – all in one tap</p>

          <div className="wallet-balance-card">
            <div>
              <h4 className="balance-label">Wallet Balance</h4>
              <h2 className="balance-amount">₹ {wallet?.walletBalance || 0}</h2>
              <p className="balance-details">
                Joyory Cash: <span>₹ {wallet?.joyoryCash || 0}</span>
              </p>
              <p className="balance-details">
                Reward Points: <span>{wallet?.rewardPoints || 0}</span>
              </p>

              <div className="amount-options mt-4">
                {[ 200 ,500, 1000, 2000, 3000].map((amt) => (
                  <button
                    key={amt}
                    className={`amount-btn ${selectedAmount === amt ? "selected" : ""
                      }`}
                    onClick={() => setSelectedAmount(amt)}
                  >
                    ₹{amt}
                  </button>
                ))}
              </div>
            </div>


            <div className="wallet-actions">
              {/* ✅ New: Amount selection */}

              <button className="add-money-btn" onClick={handleAddMoney}>
                + Add Money
              </button>
              <br />
              <br />
              <img src={wallets} alt="Wallet" className="img-fluid w-50" />
            </div>
          </div>

          <h3 className="wallet-benefits-title">JOYORY WALLET BENEFITS</h3>
          <div className="wallet-benefits">
            <div className="benefit-item">
              <img src={refunds} alt="Wallet" className="img-fluid w-50" />
              <p>Quick Refunds</p>
            </div>
            <div className="benefit-item">
              <img src={Payment} alt="Wallet" className="img-fluid w-50" />
              <p>One-Tap Payment</p>
            </div>
            <div className="benefit-item">
              <img src={Disount} alt="Wallet" className="img-fluid w-50" />
              <p>Special Discounts</p>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </>
  );
};

export default WalletPage;
