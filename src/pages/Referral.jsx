import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col } from "react-bootstrap";
import { Gift, Copy, Check, Sparkles, Award, MessageSquare, Mail } from "lucide-react";
import "../styles/Referral.css";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import Referrals from "../assets/Referral.png";
import gift from "../assets/gift.png";
import SectionError from "../components/common/SectionError";
import { getErrorMessage } from "../utils/errorHandler";
import { getReferralCode } from "../api/referralApi";

const Referral = () => {
  const [referralCode, setReferralCode] = useState("");
  const [rewards, setRewards] = useState(null);
  const [tiers, setTiers] = useState([]);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReferralData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getReferralCode();
      const data = res.data;
      setReferralCode(data.referralCode || "");
      setRewards(data.rewards || null);
      setTiers(data.tiers || []);
    } catch (err) {
      console.error("Error fetching referral data:", err);
      setError(getErrorMessage(err, "Failed to load referral details. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReferralData();
  }, []);

  const handleCopy = () => {
    if (!referralCode) return;
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Header />
      <div className="referral-page-container pt-xl-3">
        <Container className="pt-4 mt-0 pt-lg-4 pt-md-5">
          {error && !loading && (
            <div className="my-4">
              <SectionError message={error} onRetry={fetchReferralData} />
            </div>
          )}

          {/* Hero Banner Section */}
          <div className="referral-hero">
            <Row className="align-items-center">
              <Col lg={7} md={6} className="referral-hero-content">
                <div className="referral-badge">
                  <Sparkles size={16} className="me-2" />
                  REFERRAL PROGRAM
                </div>
                <h1 className="referral-title mt-2">
                  Share Joy, <br />
                  <span className="gradient-text">Earn ₹500</span> Each!
                </h1>
                <p className="referral-subtitle">
                  Invite your friends to the Joyory family. They get ₹500 off on their first purchase,
                  and you earn ₹500 in your Joyory Wallet!
                </p>

                {/* Referral Code Box */}
                <div className="referral-code-wrapper">
                  <span className="code-label">YOUR UNIQUE REFERRAL CODE</span>
                  <div className="referral-code-box">
                    <span className="code-text">{referralCode || "Generating..."}</span>
                    <button
                      className={`copy-btn ${copied ? "copied" : ""}`}
                      onClick={handleCopy}
                      disabled={!referralCode}
                    >
                      {copied ? (
                        <>
                          <Check size={18} /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy size={18} /> Copy Code
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Share Options */}
                <div className="share-buttons-container">
                  <span className="share-label">Quick Share:</span>
                  <div className="share-buttons">
                    <a
                      href={`https://api.whatsapp.com/send?text=Hey!%20Use%20my%20Joyory%20referral%20code%20*${referralCode}*%20to%20get%20%E2%82%B9500%20OFF%20your%20first%20order!%20Shop%20here:%20https://joyory.com`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="share-btn whatsapp"
                    >
                      <MessageSquare size={16} className="me-1" /> WhatsApp
                    </a>
                    <a
                      href={`mailto:?subject=Get ₹500 off at Joyory!&body=Hey! Use my referral code ${referralCode} to get ₹500 OFF on your first purchase at Joyory.`}
                      className="share-btn email"
                    >
                      <Mail size={16} className="me-1" /> Email
                    </a>
                  </div>
                </div>
              </Col>

              <Col lg={5} md={6} className="text-center">
                <div className="referral-hero-image-wrapper">
                  <img src={Referrals} alt="Joyory Gift Box" className="img-fluid referral-hero-img" />
                </div>
              </Col>
            </Row>
          </div>

          {/* How It Works Section */}
          <div className="how-it-works-section">
            <div className="section-header text-center">
              <h2 className="section-title">How It Works</h2>
              <p className="section-subtitle">Start earning in 3 simple steps</p>
            </div>

            <Row className="g-4 mt-2">
              <Col md={4}>
                <div className="step-card">
                  <div className="step-number">01</div>
                  <div className="step-icon-wrapper">
                    <Gift size={28} />
                  </div>
                  <h4 className="step-title">Send Invitation</h4>
                  <p className="step-desc">
                    Share your unique referral link or code with your friends and family across social media.
                  </p>
                </div>
              </Col>

              <Col md={4}>
                <div className="step-card">
                  <div className="step-number">02</div>
                  <div className="step-icon-wrapper">
                    <Sparkles size={28} />
                  </div>
                  <h4 className="step-title">Friends Place Order</h4>
                  <p className="step-desc">
                    Your friends register and use your code at checkout to get an instant ₹500 discount on their purchase.
                  </p>
                </div>
              </Col>

              <Col md={4}>
                <div className="step-card">
                  <div className="step-number">03</div>
                  <div className="step-icon-wrapper">
                    <Award size={28} />
                  </div>
                  <h4 className="step-title">You Get Rewarded</h4>
                  <p className="step-desc">
                    Once their order is successfully delivered, ₹500 is credited straight into your Joyory Wallet!
                  </p>
                </div>
              </Col>
            </Row>
          </div>

          {/* Rewards Summary Banner */}
          <div className="rewards-summary-banner">
            <div className="banner-content">
              <div className="banner-icon">
                <img src={gift} alt="Gift Icon" width={50} />
              </div>
              <div className="banner-text">
                <h3>No Limits on Referrals!</h3>
                <p>
                  The more friends you invite, the more you earn. Use your wallet balance to shop your favorite beauty products for free!
                </p>
              </div>
            </div>
          </div>
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default Referral;
