import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col } from "react-bootstrap";
import { Gift, Copy, Check, Sparkles, Award, MessageSquare, Mail } from "lucide-react";
import "../../styles/Referral.css";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import Referrals from "../../assets/Referral.png";
import gift from "../../assets/gift.png";

const Referral = () => {
  const [referralCode, setReferralCode] = useState("");
  const [rewards, setRewards] = useState(null);
  const [tiers, setTiers] = useState([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchReferralData = async () => {
      try {
        const res = await fetch(
          "https://beauty.joyory.com/api/referral/code",
          {
            method: "GET",
            credentials: "include", // ✅ important: sends cookies with request
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) {
          throw new Error(`Failed with status ${res.status}`);
        }

        const data = await res.json();
        setReferralCode(data.referralCode || "");
        setRewards(data.rewards || null);
        setTiers(data.tiers || []);
      } catch (err) {
        console.error("Error fetching referral data:", err);
      }
    };

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
          {/* Hero Banner Section */}
          <div className="referral-hero">
            <Row className="w-100 align-items-center">
              <Col lg={7} className="mb-4 mb-lg-0 text-start">
                <div className="referral-hero-content">
                  <span className="referral-hero-badge">Joyory Circle</span>
                  <h1 className="referral-hero-title">
                    Share the Luxe,<br />Spread the Beauty
                  </h1>
                  <p className="referral-hero-subtitle">
                    Invite your inner circle to experience the premium world of Joyory.
                    Gift them a special welcome, and unlock exquisite point rewards for yourself.
                  </p>
                </div>
              </Col>
              <Col lg={5} className="referral-hero-img-col">
                <img src={gift} alt="Referral Gift Banner" className="img-fluid referral-hero-img" />
              </Col>
            </Row>
          </div>

          {/* Value Dual Voucher Cards */}
          <div className="rewards-voucher-grid">
            <div className="voucher-card">
              <div className="voucher-icon-wrapper">
                <Gift size={24} />
              </div>
              <span className="voucher-label">Your Exclusive Reward</span>
              <h3 className="voucher-reward">
                {rewards ? rewards.yourReward : "Loading..."}
              </h3>
              <p className="voucher-reward-sub">
                {rewards
                  ? `Earned when your referred friend makes their first purchase of ₹${rewards.minOrderAmount} or more.`
                  : "Fetching your tier benefits..."}
              </p>
            </div>

            <div className="voucher-card">
              <div className="voucher-icon-wrapper">
                <Sparkles size={24} />
              </div>
              <span className="voucher-label">Your Friend's Welcome Gift</span>
              <h3 className="voucher-reward">
                {rewards ? rewards.friendReward : "Loading..."}
              </h3>
              <p className="voucher-reward-sub">
                {rewards
                  ? `Sent to your friend to use on their first purchase of ₹${rewards.minOrderAmount} or more.`
                  : "Fetching new member perks..."}
              </p>
            </div>
          </div>

          {/* Referral Code Dashboard + Loyalty Tiers */}
          <Row className="referral-dashboard-row">
            {/* Share Widget & VIP Benefits Column */}
            <Col lg={6} className="mb-4 mb-lg-0">
              <div className="referral-card-wrapper d-flex flex-column gap-4">
                {/* Sharing Dashboard */}
                <div className="referral-luxe-card">
                  <h3 className="referral-card-title text-start">Spread Your Invite</h3>
                  <p className="referral-card-desc text-start">
                    Unlock a bonus ₹50 credit whenever a friend completes registration via your code. Copy your code or share it directly below.
                  </p>

                  <div className="sharing-widget-container">
                    <div className="sharing-label">Your Personal Code</div>
                    <div className="referral-code-display" onClick={handleCopy} title="Click to copy code">
                      <span className="referral-code-text">{referralCode || "GETTING CODE..."}</span>
                      <button className={`copy-badge-btn ${copied ? "copied" : ""}`}>
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                        {copied ? "Copied" : "Copy Code"}
                      </button>
                    </div>

                    <div className="sharing-label">Quick Share</div>
                    <div className="social-share-group">
                      <a
                        href={`https://api.whatsapp.com/send?text=Hey! Discover premium cosmetics and skincare at Joyory. Use my invite code *${referralCode}* to get a special reward on your first order! Join here: https://joyory.com/login?ref=${referralCode}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-share-btn share-whatsapp"
                      >
                        <MessageSquare size={16} /> WhatsApp
                      </a>
                      <a
                        href={`mailto:?subject=Exclusive Invitation to Joyory Luxe&body=Hey! I'd love to invite you to join Joyory, my go-to store for luxury beauty products. Sign up using my referral code *${referralCode}* to unlock a special welcome discount on your first order of items. Join here: https://beauty.joyory.com/signup?ref=${referralCode}`}
                        className="social-share-btn share-email"
                      >
                        <Mail size={16} /> Send Email
                      </a>
                    </div>
                  </div>
                </div>

                {/* VIP Perks Highlight */}

              </div>
            </Col>

            {/* Loyalty Milestone Tiers Column */}
            <Col lg={6}>
              <div className="referral-luxe-card">
                <h3 className="referral-card-title text-start">Luxe Loyalty Milestones</h3>
                <p className="referral-card-desc text-start">
                  The more friends you invite, the more benefits you unlock. Track your milestone goals and luxury rewards.
                </p>

                <div className="loyalty-tiers-container">
                  {tiers.length > 0 ? (
                    tiers.map((tier, index) => (
                      <div className="tier-milestone-item" key={index}>
                        <div className="tier-milestone-left">
                          <div className="tier-milestone-badge">
                            {tier.milestone}
                          </div>
                          <div className="tier-milestone-info">
                            <div className="tier-milestone-title">
                              {tier.milestone} Successful Friend{tier.milestone > 1 ? "s" : ""}
                            </div>
                            <div className="tier-milestone-reward">
                              {tier.reward}
                            </div>
                          </div>
                        </div>
                        <div className="tier-milestone-status">
                          <Award size={14} className="me-1" /> Tier Goal
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-5 text-muted">
                      No tiers defined yet. Start inviting to build your Luxe loyalty score!
                    </div>
                  )}
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default Referral;
