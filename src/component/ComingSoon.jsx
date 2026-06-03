// // ComingSoon.jsx
// import React, { useState, useEffect } from "react";
// import { Container, Row, Col, Form, Button, Alert, Spinner } from "react-bootstrap";
// import { 
//   FaFacebookF, 
//   FaTwitter, 
//   FaInstagram, 
//   FaLinkedinIn, 
//   FaYoutube,
//   FaEnvelope,
//   FaMapMarkerAlt,
//   FaPhone,
//   FaClock
// } from "react-icons/fa";
// import "../css/ComingSoon.css";

// const ComingSoon = () => {
//   const [email, setEmail] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState({ type: "", text: "" });
//   const [timeLeft, setTimeLeft] = useState({
//     days: 0,
//     hours: 0,
//     minutes: 0,
//     seconds: 0
//   });
//   const [isLaunched, setIsLaunched] = useState(false);

//   // Set your launch date here - Change this to your actual launch date
//   // Format: "YYYY-MM-DDTHH:MM:SS"
//   const launchDate = new Date("2026-06-01T00:00:00").getTime();

//   useEffect(() => {
//     const calculateTimeLeft = () => {
//       const now = new Date().getTime();
//       const distance = launchDate - now;

//       if (distance < 0) {
//         setIsLaunched(true);
//         setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
//         return;
//       }

//       setIsLaunched(false);
//       setTimeLeft({
//         days: Math.floor(distance / (1000 * 60 * 60 * 24)),
//         hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
//         minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
//         seconds: Math.floor((distance % (1000 * 60)) / 1000)
//       });
//     };

//     // Calculate immediately
//     calculateTimeLeft();

//     // Update every second
//     const timer = setInterval(calculateTimeLeft, 1000);

//     return () => clearInterval(timer);
//   }, [launchDate]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!email || !email.includes('@')) {
//       setMessage({ type: "danger", text: "Please enter a valid email address" });
//       return;
//     }

//     setLoading(true);

//     // Simulate API call - Replace with your actual API endpoint
//     try {
//       // const response = await axios.post('/api/subscribe', { email });

//       // Simulate network delay
//       await new Promise(resolve => setTimeout(resolve, 1500));

//       setMessage({ 
//         type: "success", 
//         text: "Thank you for subscribing! We'll notify you when we launch." 
//       });
//       setEmail("");
//     } catch (error) {
//       setMessage({ 
//         type: "danger", 
//         text: "Something went wrong. Please try again." 
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Format number to always show 2 digits
//   const formatNumber = (num) => {
//     return num.toString().padStart(2, '0');
//   };

//   return (
//     <div className="coming-soon-wrapper">
//       {/* Animated Background */}
//       <div className="animated-bg">
//         <div className="gradient-bg"></div>
//         <div className="particles">
//           {[...Array(20)].map((_, i) => (
//             <div key={i} className="particle" style={{
//               '--delay': `${Math.random() * 5}s`,
//               '--size': `${Math.random() * 10 + 5}px`,
//               '--left': `${Math.random() * 100}%`,
//               '--duration': `${Math.random() * 10 + 10}s`
//             }}></div>
//           ))}
//         </div>
//       </div>

//       {/* Main Content */}
//       <Container fluid className="coming-soon-content">
//         <Row className="justify-content-center align-items-center min-vh-100">
//           <Col lg={8} md={10} className="text-center">
//             {/* Logo/Brand */}
//             <div className="brand-section mb-5">
//               <h1 className="brand-name">
//                 <span className="gradient-text">Beauty</span>
//                 <span className="text-white">Joyory</span>
//               </h1>
//               <div className="brand-tagline">
//                 {isLaunched ? "Now Launched!" : "Coming Soon"}
//               </div>
//             </div>

//             {/* Main Heading */}
//             <div className="content-section mb-5">
//               {!isLaunched ? (
//                 <>
//                   <h2 className="main-heading text-white mb-4">
//                     Something <span className="gradient-text">Amazing</span> is
//                     <br />
//                     Coming Your Way
//                   </h2>
//                   <p className="sub-heading text-white-50 mb-5">
//                     We're working hard to bring you an extraordinary beauty experience.
//                     <br />
//                     Stay tuned for our grand launch!
//                   </p>
//                 </>
//               ) : (
//                 <>
//                   <h2 className="main-heading text-white mb-4">
//                     We're <span className="gradient-text">Live!</span>
//                   </h2>
//                   <p className="sub-heading text-white-50 mb-5">
//                     Thank you for your patience. Explore our amazing beauty products now!
//                   </p>
//                   <Button 
//                     variant="primary" 
//                     size="lg" 
//                     className="launch-btn"
//                     onClick={() => window.location.href = '/'}
//                   >
//                     Shop Now
//                   </Button>
//                 </>
//               )}
//             </div>

//             {/* Countdown Timer */}
//             {!isLaunched && (
//               <div className="countdown-section mb-5">
//                 <Row className="g-4 justify-content-center">
//                   <Col xs={6} sm={3}>
//                     <div className="countdown-item">
//                       <div className="countdown-number">{formatNumber(timeLeft.days)}</div>
//                       <div className="countdown-label">Days</div>
//                     </div>
//                   </Col>
//                   <Col xs={6} sm={3}>
//                     <div className="countdown-item">
//                       <div className="countdown-number">{formatNumber(timeLeft.hours)}</div>
//                       <div className="countdown-label">Hours</div>
//                     </div>
//                   </Col>
//                   <Col xs={6} sm={3}>
//                     <div className="countdown-item">
//                       <div className="countdown-number">{formatNumber(timeLeft.minutes)}</div>
//                       <div className="countdown-label">Minutes</div>
//                     </div>
//                   </Col>
//                   <Col xs={6} sm={3}>
//                     <div className="countdown-item">
//                       <div className="countdown-number">{formatNumber(timeLeft.seconds)}</div>
//                       <div className="countdown-label">Seconds</div>
//                     </div>
//                   </Col>
//                 </Row>

//                 {/* Launch Date Display */}
//                 <div className="launch-date mt-4">
//                   <p className="text-white-50 mb-0">
//                     <FaClock className="me-2" />
//                     Launching on {new Date(launchDate).toLocaleDateString('en-US', { 
//                       weekday: 'long',
//                       year: 'numeric', 
//                       month: 'long', 
//                       day: 'numeric' 
//                     })}
//                   </p>
//                 </div>
//               </div>
//             )}

//             {/* Newsletter Subscription */}
//             {!isLaunched && (
//               <div className="newsletter-section mb-5">
//                 <h3 className="text-white mb-4">Get Notified When We Launch</h3>

//                 {message.text && (
//                   <Alert 
//                     variant={message.type} 
//                     onClose={() => setMessage({ type: "", text: "" })} 
//                     dismissible
//                     className="mx-auto"
//                     style={{ maxWidth: "500px" }}
//                   >
//                     {message.text}
//                   </Alert>
//                 )}

//                 <Form onSubmit={handleSubmit} className="subscribe-form">
//                   <div className="form-wrapper">
//                     <Form.Control
//                       type="email"
//                       placeholder="Enter your email address"
//                       value={email}
//                       onChange={(e) => setEmail(e.target.value)}
//                       className="email-input"
//                       disabled={loading}
//                     />
//                     <Button 
//                       type="submit" 
//                       className="subscribe-btn"
//                       disabled={loading}
//                     >
//                       {loading ? (
//                         <>
//                           <Spinner animation="border" size="sm" className="me-2" />
//                           Subscribing...
//                         </>
//                       ) : (
//                         <>
//                           <FaEnvelope className="me-2" />
//                           Notify Me
//                         </>
//                       )}
//                     </Button>
//                   </div>
//                 </Form>
//                 <p className="privacy-text text-white-50 mt-3">
//                   We respect your privacy. Unsubscribe at any time.
//                 </p>
//               </div>
//             )}

//             {/* Social Links */}
//             <div className="social-section">
//               <a href="#" className="social-link" target="_blank" rel="noopener noreferrer">
//                 <FaFacebookF />
//               </a>
//               <a href="#" className="social-link" target="_blank" rel="noopener noreferrer">
//                 <FaTwitter />
//               </a>
//               <a href="#" className="social-link" target="_blank" rel="noopener noreferrer">
//                 <FaInstagram />
//               </a>
//               <a href="#" className="social-link" target="_blank" rel="noopener noreferrer">
//                 <FaLinkedinIn />
//               </a>
//               <a href="#" className="social-link" target="_blank" rel="noopener noreferrer">
//                 <FaYoutube />
//               </a>
//             </div>

//             {/* Footer */}
//             <div className="footer-section mt-5">
//               <p className="text-white-50 mb-0">
//                 © 2026 Beauty Joyory. All rights reserved.
//               </p>
//             </div>
//           </Col>
//         </Row>
//       </Container>
//     </div>
//   );
// };

// export default ComingSoon;


// import React, { useEffect, useMemo, useState } from "react";
// import { FaInstagram, FaFacebookF, FaLinkedinIn } from "react-icons/fa";
// import "../css/ComingSoon.css";

// function pad2(n) {
//   return String(n).padStart(2, "0");
// }

// function getTimeLeft(targetDate) {
//   const target = new Date(targetDate).getTime();
//   const now = Date.now();
//   let diff = Math.max(0, target - now);

//   const days = Math.floor(diff / (1000 * 60 * 60 * 24));
//   diff -= days * (1000 * 60 * 60 * 24);

//   const hours = Math.floor(diff / (1000 * 60 * 60));
//   diff -= hours * (1000 * 60 * 60);

//   const minutes = Math.floor(diff / (1000 * 60));
//   diff -= minutes * (1000 * 60);

//   const seconds = Math.floor(diff / 1000);

//   return { days, hours, minutes, seconds };
// }

// export default function ComingSoon() {
//   // ====== EDIT SETTINGS ======
//   const brandName = "Joyory";
//   const tagline = "Launching Soon";
//   const launchAt = "2026-07-15T12:00:00"; // change this
//   const contactEmail = "hello@joyory.com"; // change this

//   const social = useMemo(
//     () => [
//       { label: "Instagram", href: "#", icon: <FaInstagram /> },
//       { label: "Facebook", href: "#", icon: <FaFacebookF /> },
//       { label: "LinkedIn", href: "#", icon: <FaLinkedinIn /> },
//     ],
//     []
//   );
//   // ===========================

//   const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(launchAt));
//   const [email, setEmail] = useState("");
//   const [status, setStatus] = useState("idle"); // idle | saved

//   useEffect(() => {
//     const t = setInterval(() => setTimeLeft(getTimeLeft(launchAt)), 1000);
//     return () => clearInterval(t);
//   }, [launchAt]);

//   const year = new Date().getFullYear();

//   function onSubmit(e) {
//     e.preventDefault();
//     setStatus("saved");
//     setTimeout(() => setStatus("idle"), 1400);
//   }

//   return (
//     <div className="cs-root light">
//       <main className="cs-wrap">
//         <section className="cs-shell">
//           {/* LEFT */}
//           <div className="cs-panel cs-left">
//             <div className="cs-topbar">
//               <div className="cs-brand">

//                 <span className="cs-brandName">{brandName}</span>
//               </div>
//               <div className="cs-pill">{tagline}</div>
//             </div>

//             <h1 className="cs-h1">
//               Beauty, Refined.
//               <br />
//               We're Launching Soon.
//             </h1>

//             <p className="cs-sub">
//               Discover a new destination for premium beauty, skincare, and self-care essentials. At Joyory, we blend luxury, quality, and modern elegance to help you look and feel your absolute best every day.
//             </p>

//             <div className="cs-featureRow" aria-label="Highlights">
//               <span className="cs-tag">New Arrivals</span>
//               <span className="cs-tag">Premium Formulas</span>
//               <span className="cs-tag">Curated Collections</span>
//               <span className="cs-tag">Exclusive Launch Offers</span>
//             </div>

//             <div className="cs-formCard">
//               <p className="cs-formTitle">Get Early Access & Special Launch Benefits</p>

//               <form className="cs-form" onSubmit={onSubmit}>
//                 <label className="sr-only" htmlFor="email">
//                   Email
//                 </label>

//                 <input
//                   id="email"
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   placeholder="Enter your email"
//                   required
//                 />

//                 <button type="submit" disabled={status === "saved"}>
//                   {status === "saved" ? "Saved" : "Notify me"}
//                 </button>
//               </form>

//             </div>

//             <div className="cs-hr" />

//             <div className="cs-foot">
//               <div>
//                 © {year} {brandName}
//               </div>
//               <div className="cs-small">
//                 Need help? <span>{contactEmail}</span>
//               </div>
//             </div>
//           </div>

//           {/* RIGHT */}
//           <div className="cs-panel cs-right">
//             <div className="cs-hero">
//               <div className="cs-bubbles" aria-hidden="true">
//                 <div className="cs-bubble b1" />
//                 <div className="cs-bubble b2" />
//                 <div className="cs-bubble b3" />
//               </div>

//               <div>
//                 <div className="cs-pill cs-inline">Launch countdown</div>

//                 <div
//                   className="cs-countdown"
//                   role="timer"
//                   aria-label="Countdown"
//                 >
//                   <div className="cs-tile">
//                     <p className="cs-num">{timeLeft.days}</p>
//                     <p className="cs-lbl">Days</p>
//                   </div>
//                   <div className="cs-tile">
//                     <p className="cs-num">{pad2(timeLeft.hours)}</p>
//                     <p className="cs-lbl">Hours</p>
//                   </div>
//                   <div className="cs-tile">
//                     <p className="cs-num">{pad2(timeLeft.minutes)}</p>
//                     <p className="cs-lbl">Minutes</p>
//                   </div>
//                   <div className="cs-tile">
//                     <p className="cs-num">{pad2(timeLeft.seconds)}</p>
//                     <p className="cs-lbl">Seconds</p>
//                   </div>
//                 </div>
//               </div>

//               <div className="cs-social" aria-label="Social links">
//                 {social.map((s) => (
//                   <a
//                     key={s.label}
//                     className="cs-iconBtn"
//                     href={s.href}
//                     target="_blank"
//                     rel="noreferrer"
//                     aria-label={s.label}
//                     title={s.label}
//                   >
//                     {s.icon}
//                   </a>
//                 ))}
//               </div>
//             </div>

//             <div className="cs-formCard">
//               <p className="cs-formTitle">About Joyory</p>
//               <p className="cs-sub cs-m0">
//                 Joyory is a modern beauty destination dedicated to premium cosmetics, skincare, and self-care products. We believe beauty should feel effortless, empowering, and accessible. Every product is thoughtfully selected to deliver quality, confidence, and a touch of everyday luxury.

//                 Our mission is to inspire self-expression through beauty while creating a seamless and enjoyable shopping experience for every customer.
//               </p>
//             </div>
//           </div>
//         </section>
//       </main>
//     </div>
//   );
// }






import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import instagram from "../assets/instagram.svg";
import facebook from "../assets/facebook.svg";
import linkedin from "../assets/linkedin.svg";
import { FaInstagram, FaFacebookF, FaLinkedinIn } from "react-icons/fa";
import "../css/ComingSoon.css";

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