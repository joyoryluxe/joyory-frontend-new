import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import instagram from "../../assets/instagram.svg";
import facebook from "../../assets/facebook.svg";
import linkedin from "../../assets/linkedin.svg";
import { FaInstagram, FaFacebookF, FaLinkedinIn } from "react-icons/fa";
import "../../styles/ComingSoon.css";

function pad2(n) {
  return String(n).padStart(2, "0");
}

function getTimeLeft(targetDate) {
  const target = new Date(targetDate).getTime();
  const now = Date.now();
  let diff = Math.max(0, target - now);

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  diff -= days * (1000 * 60 * 60 * 24);

  const hours = Math.floor(diff / (1000 * 60 * 60));
  diff -= hours * (1000 * 60 * 60);

  const minutes = Math.floor(diff / (1000 * 60));
  diff -= minutes * (1000 * 60);

  const seconds = Math.floor(diff / 1000);

  return { days, hours, minutes, seconds };
}

export default function ComingSoon() {
  const brandName = "Joyory";
  const tagline = "Launching Soon";
  const launchAt = "2026-07-15T12:00:00";
  const contactEmail = "hello@joyory.com";

  const social = useMemo(
    () => [
      { label: "Instagram", href: "#", icon: <FaInstagram /> },
      { label: "Facebook", href: "#", icon: <FaFacebookF /> },
      { label: "LinkedIn", href: "#", icon: <FaLinkedinIn /> },
    ],
    []
  );

  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(launchAt));
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    const t = setInterval(() => setTimeLeft(getTimeLeft(launchAt)), 1000);
    return () => clearInterval(t);
  }, [launchAt]);

  const year = new Date().getFullYear();

  function onSubmit(e) {
    e.preventDefault();
    setStatus("saved");
    setTimeout(() => setStatus("idle"), 1400);
  }

  return (
    <div className="cs-root light">
      <main className="cs-wrap">
        <section className="cs-shell one">
          <div className="cs-panel cs-single">
            <div className="cs-topbar">
              <div className="cs-brand">
                <span className="cs-brandName">{brandName}</span>
              </div>
              <div className="cs-pill">{tagline}</div>
            </div>

            <h1 className="cs-h1">
              Beauty, Refined.
              <br />
              We're Launching Soon.
            </h1>

            <p className="cs-sub">
              Discover a new destination for premium beauty, skincare, and
              self-care essentials. At Joyory, we blend luxury, quality, and
              modern elegance to help you look and feel your absolute best every
              day.
            </p>

            {/* COUNTDOWN (full row) */}
            <div className="cs-countdownRow">
              <div className="cs-pill cs-inline">Launch countdown</div>

              <div className="cs-countdown" role="timer" aria-label="Countdown">
                <div className="cs-tile">
                  <p className="cs-num">{timeLeft.days}</p>
                  <p className="cs-lbl">Days</p>
                </div>
                <div className="cs-tile">
                  <p className="cs-num">{pad2(timeLeft.hours)}</p>
                  <p className="cs-lbl">Hours</p>
                </div>
                <div className="cs-tile">
                  <p className="cs-num">{pad2(timeLeft.minutes)}</p>
                  <p className="cs-lbl">Minutes</p>
                </div>
                <div className="cs-tile">
                  <p className="cs-num">{pad2(timeLeft.seconds)}</p>
                  <p className="cs-lbl">Seconds</p>
                </div>
              </div>

              <div className="cs-social" aria-label="Social links">
                {/* {social.map((s) => (
                  <a
                    key={s.label}
                    className="cs-iconBtn"
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                    title={s.label}
                  >
                    {s.icon}
                  </a>
                ))} */}

               <div className="social-media">

            <Link to="https://www.instagram.com/joyory_luxe/"  className="cs-iconBtn"><img src={instagram} alt="Image Not Found" /></Link>
            <Link to="https://www.facebook.com/61578381750346/?locale=en_GB" className="cs-iconBtn"><img src={facebook} alt="Image Not Found" /></Link>
            <Link to="https://www.linkedin.com/company/joyory-luxe-pvt-ltd" className="cs-iconBtn"><img src={linkedin} alt="Image Not Found" /></Link>

          </div>

              </div>
            </div>

            <div className="cs-featureRow" aria-label="Highlights">
              <span className="cs-tag">New Arrivals</span>
              <span className="cs-tag">Premium Formulas</span>
              <span className="cs-tag">Curated Collections</span>
              <span className="cs-tag">Exclusive Launch Offers</span>
            </div>

            <div className="cs-formCard">
              <p className="cs-formTitle">
                Get Early Access & Special Launch Benefits
              </p>

              <form className="cs-form" onSubmit={onSubmit}>
                <label className="sr-only" htmlFor="email">
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />

                <button type="submit" disabled={status === "saved"}>
                  {status === "saved" ? "Saved" : "Notify me"}
                </button>
              </form>
            </div>


            <div className="cs-hr" />

            <div className="cs-foot">
              <div>
               © 2025. All Rights Are Reserved by Joyory
              </div>
              <div className="cs-small">
                Need help? <span>{contactEmail}</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}