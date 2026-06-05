import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Card, Row, Col } from "react-bootstrap";
import "../css/Referral.css";
import Header from "./Header";
import Footer from "./Footer";
import Referrals from "../assets/Referral.png";
import gift from "../assets/gift.png";

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
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Header />
      <div className="container py-4 page-title-main-name mt-lg-5 pt-lg-5 mt-md-0 pt-md-5 ">
        {/* Header Banner */}
        <img src={gift} alt="Referral Banner" className="img-fluid img-postion" />
        <Card className="mb-4 text-center referral-banner cards">
          <Card.Body>
            <h5 className="mb-2">Exclusive Rewards Just For You</h5>
            <p className="mb-0">Earn up to 1,000 points just by referring</p>
          </Card.Body>
        </Card>

        {/* Rewards Info */}
        <div className="mb-4">
          <Col md={12}>
            <Card className="p-3 text-center d-flex main-card border-top cards">
              <h6>Your Reward</h6>
              <div className="detilas">
                <p className="mb-0">
                  {rewards ? rewards.yourReward : "Loading..."}
                </p>
                <small>
                  {rewards
                    ? `when your referee buys for ₹${rewards.minOrderAmount} or more the first time`
                    : ""}
                </small>
              </div>
            </Card>
          </Col>
          <Col md={12}>
            <Card className="p-3 text-center d-flex main-card border-bottom cards">
              <h6>
                Your Friend’s <br /> Reward
              </h6>
              <div className="detilas">
                <p className="mb-0">
                  {rewards ? rewards.friendReward : "Loading..."}
                </p>
                <small>
                  {rewards
                    ? `when your referee buys for ₹${rewards.minOrderAmount} or more the first time`
                    : ""}
                </small>
              </div>
            </Card>
          </Col>
        </div>

        {/* Refer & Earn + Unlock Perks */}
        <Row className="">
          <Col lg={6} className="mb-3">
            <Card className="p-3 text-center Refer-cards ">
              <h6>Refer & Earn</h6>
              <p>
                Get ₹50 extra when your referral signs up via your shared
                Instagram/WhatsApp link.
              </p>

              {/* ✅ Custom Referral Code Box */}
              <div className="referral-box" onClick={handleCopy}>
                <i className="bi bi-clipboard me-2"></i>
                <span>{referralCode}</span>
                {copied && <small className="copied-msg">Copied!</small>}
              </div>
            </Card>


            <div className="Loyalty">
              <Card className="p-3 cards">
                <h6 className="fw-bold mb-3">Luxe Loyalty Tiers</h6>
                <div className="Loyalty-box">
                  <p>
                    Each referral unlocks a new reward tier when your friend makes their
                    first purchase!
                  </p>
                </div>
                <Row>
                  {tiers.map((tier, index) => (
                    <Col lg={12} key={index} className="mb-2 w-75 margin-left">
                      <Card className="p-3 pb-2 pt-2 text-center tier-card">
                        <strong>{tier.milestone} Friend(s)</strong>
                        <p className="mb-0">{tier.reward}</p>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Card>
            </div>



          </Col>

          <Col lg={6}>
            <Card className="p-3 text-center unlock-perks exclusive-pack exclusive-pack ">
              <h6>Unlock <br /> Exclusive perks</h6>
              <div className="">
                <img src={Referrals} alt="Referral Banner" className="img-fluid" />
              </div>
              <small>
                For Exclusive deals, limited drops, and bonus samples every
                month
              </small>
            </Card>
          </Col>
        </Row>       
      </div>

      <Footer />
    </>
  );
};

export default Referral;
