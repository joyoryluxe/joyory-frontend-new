import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/UserAccount.css";
import Sidebarcomon from "../components/common/SidebarCommon";
import Footer from "../components/common/Footer";
import Header from "../components/common/Header";
import {
  FaQuestionCircle,
  FaPhone,
  FaEnvelope,
  FaClock,
  FaBoxOpen,
  FaTruck,
  FaUndo,
  FaShieldAlt,
  FaCreditCard,
  FaChevronDown,
  FaChevronUp,
  FaWhatsapp,
} from "react-icons/fa";

const Help = () => {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      q: "What is Joyory?",
      a: "Joyory is an online beauty store where you can buy makeup, skincare, haircare, and self-care products.",
      icon: <FaQuestionCircle />,
    },
    {
      q: "Are the products genuine?",
      a: "Yes, everything on Joyory is 100% original and sourced from trusted brands.",
      icon: <FaShieldAlt />,
    },
    {
      q: "How do I place an order?",
      a: "Just select a product, add it to your cart, and checkout.",
      icon: <FaBoxOpen />,
    },
    {
      q: "Do I need an account to order?",
      a: "Yes, creating an account helps you track orders and save addresses.",
      icon: <FaQuestionCircle />,
    },
    {
      q: "How long does delivery take?",
      a: "Usually 2–7 working days, depending on your location.",
      icon: <FaClock />,
    },
    {
      q: "How do I track my order?",
      a: "You will get a tracking link on SMS/email after the order is shipped.",
      icon: <FaTruck />,
    },
    {
      q: "What payment methods do you accept?",
      a: "UPI, cards, net banking, wallets, and Cash on Delivery (selected areas).",
      icon: <FaCreditCard />,
    },
    {
      q: "My payment failed. What do I do?",
      a: "Don’t worry—money usually comes back in 3–5 days automatically.",
      icon: <FaQuestionCircle />,
    },
    {
      q: "Can I return a product?",
      a: "Yes, if it is unused and in original packaging. Return within 7 days.",
      icon: <FaUndo />,
    },
    {
      q: "How do I request a return?",
      a: 'Go to "My Orders" → Choose the product → Click "Return."',
      icon: <FaBoxOpen />,
    },
    {
      q: "When will I get my refund?",
      a: "Refunds take 5–7 working days after we receive the returned item.",
      icon: <FaClock />,
    },
    {
      q: "What if the product I want is out of stock?",
      a: "Click the “Notify Me” button. We’ll alert you when it’s back.",
      icon: <FaEnvelope />,
    },
    {
      q: "Where can I see product details?",
      a: "Every product page shows ingredients, usage directions, and benefits.",
      icon: <FaQuestionCircle />,
    },
    {
      q: "Is my personal information safe?",
      a: "Yes. Your data is protected and never shared with anyone.",
      icon: <FaShieldAlt />,
    },
    {
      q: "How can I contact Joyory support?",
      a: (
        <div>
          <strong>Call or WhatsApp:</strong>{" "}
          <a href="tel:9601177701" className="text-black fw-bold text-decoration-none">
            9601177701
          </a>
          <br />
          <strong>Email:</strong>{" "}
          <a href="mailto:support@joyory.com" className="text-black text-decoration-none">
            support@joyory.com
          </a>
        </div>
      ),
      icon: <FaPhone />,
    },
  ];

  return (
    <>
      <Header />

      <div className="container-fluid ua-page page-title-main-name mt-lg-5 pt-lg-5 mt-md-0 pt-md-5">
        <section className="Heading-Name mt-lg-5 mt-md-0 pt-md-0">
          <h3 className="ua-title ms-4">Help & FAQ</h3>
          <Sidebarcomon />
        </section>

        <main className="ua-content mt-lg-5 pt-lg-2 mt-md-0 pt-md-5 overflow-hidden">
          <section className="ua-card">
            {/* Hero Section */}
            <div className="text-center mb-5 py-5 bg-black text-white rounded">
              <h1 className="display-5 fw-bold mb-3">How Can We Help You?</h1>
              <p className="lead">Find answers to frequently asked questions</p>
            </div>

            {/* FAQ Accordion */}
            <div className="faq-accordion mx-auto" style={{ maxWidth: "900px" }}>
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="faq-item mb-3 border rounded overflow-hidden shadow-sm"
                  style={{
                    backgroundColor: "#fff",
                    transition: "all 0.3s ease",
                  }}
                >
                  <button
                    className="faq-question w-100 text-start p-4 d-flex justify-content-between align-items-center bg-white hover-bg-light"
                    onClick={() => toggleFAQ(index)}
                    style={{
                      border: "none",
                      outline: "none",
                      cursor: "pointer",
                      fontSize: "1.1rem",
                      fontWeight: "600",
                    }}
                  >
                    <span className="d-flex align-items-center">
                      <span className="me-3 text-black fs-5">{faq.icon}</span>
                      {faq.q}
                    </span>
                    {openIndex === index ? (
                      <FaChevronUp className="text-black" />
                    ) : (
                      <FaChevronDown className="text-muted" />
                    )}
                  </button>

                  {/* Answer - Collapsible */}
                  <div
                    className="faq-answer px-4"
                    style={{
                      maxHeight: openIndex === index ? "300px" : "0",
                      overflow: "hidden",
                      transition: "max-height 0.4s ease, padding 0.4s ease",
                      padding: openIndex === index ? "20px" : "0 20px",
                      backgroundColor: "#f8f9fa",
                      borderTop: openIndex === index ? "1px solid #dee2e6" : "none",
                    }}
                  >
                    <div className="ps-4 ms-1 text-muted">{faq.a}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Contact Support */}
            <div className="text-center my-5 p-5 bg-black text-white rounded shadow">
              <h3 className="fw-bold mb-3">Still Have Questions?</h3>
              <p className="mb-4">Our support team is available 24/7</p>
              <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
                <a
                  href="tel:9601177701"
                  className="btn btn-light btn-lg px-5"
                >
                  <FaPhone className="me-2 mb-2" /> <br></br>Call 9601177701
                </a>
                <a
                  href="https://wa.me/919601177701"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-light btn-lg px-5 d-flex flex-column justify-content-center"
                >
                  <FaWhatsapp className="me-2 mb-2" /> WhatsApp Now
                </a>
                <a
                  href="mailto:support@joyory.com"
                  className="btn btn-light btn-lg px-5 d-flex flex-column justify-content-center"
                >
                  <FaEnvelope className="me-2 mb-2" /> Email Us
                </a>
              </div>
            </div>

            {/* Back Button */}
            <div className="text-center mt-4">
              <button
                className="btn btn-outline-secondary px-4"
                onClick={() => navigate(-1)}
              >
                ← Go Back
              </button>
            </div>
          </section>
        </main>
      </div>

      <Footer />
    </>
  );
};

export default Help;