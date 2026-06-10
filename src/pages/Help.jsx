import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/UserAccount.css";
import "../styles/Help.css";
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
  FaWhatsapp,
  FaUserCircle,
  FaShoppingBag,
  FaBoxes,
  FaTags,
  FaHeadset,
} from "react-icons/fa";

const Help = () => {
  const navigate = useNavigate();
  const { categoryId } = useParams(); // Reads help/category/:categoryId route parameter
  const [openQuestion, setOpenQuestion] = useState(null);

  const categories = [
    {
      id: "GENERAL",
      label: "General Queries",
      icon: <FaHeadset />,
    },
    {
      id: "ACCOUNT",
      label: "Manage Your Account",
      icon: <FaUserCircle />,
    },
    {
      id: "SHOPPING",
      label: "Shopping",
      icon: <FaShoppingBag />,
    },
    {
      id: "ORDER",
      label: "Order Status",
      icon: <FaBoxes />,
    },
    {
      id: "CANCELLATION",
      label: "Cancellations And Refunds",
      icon: <FaUndo />,
    },
    {
      id: "PAYMENTS",
      label: "Payments",
      icon: <FaCreditCard />,
    },
    {
      id: "RETURNS",
      label: "Returns And Refunds",
      icon: <FaBoxOpen />,
    },
    {
      id: "OFFERS",
      label: "Offers And Promotions",
      icon: <FaTags />,
    },
    {
      id: "AUTHENTICITY",
      label: "Authenticity and Genuineness",
      icon: <FaShieldAlt />,
    },
    {
      id: "WRITE",
      label: "Write To Us",
      icon: <FaEnvelope />,
    },
    {
      id: "FRAUD",
      label: "Fraud Prevention",
      icon: <FaQuestionCircle />,
    },
    {
      id: "TRACKING",
      label: "Track Order",
      icon: <FaTruck />,
    },
  ];

  const faqs = [
    // --- GENERAL (5 FAQs) ---
    {
      q: "What is Joyory?",
      a: "Joyory is a premium online beauty store offering curated makeup, skincare, bath and body, and self-care products from top trusted brands.",
      icon: <FaQuestionCircle />,
      category: "GENERAL",
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
          <a href="mailto:hello@joyory.com" className="text-black text-decoration-none">
            hello@joyory.com
          </a>
        </div>
      ),
      icon: <FaPhone />,
      category: "GENERAL",
    },
    {
      q: "Where can I see product details?",
      a: "Every product page features comprehensive descriptions, complete ingredient lists, usage guides, and benefits to help you make an informed choice.",
      icon: <FaQuestionCircle />,
      category: "GENERAL",
    },
    {
      q: "Is my personal information safe?",
      a: "Yes, your personal data is protected using high-level industry encryption standards and is never shared with third parties without your consent.",
      icon: <FaShieldAlt />,
      category: "GENERAL",
    },
    {
      q: "How can I provide feedback or submit suggestions?",
      a: "We would love to hear from you! Please write to us at hello@joyory.com or send a WhatsApp message to our customer care team.",
      icon: <FaEnvelope />,
      category: "GENERAL",
    },

    // --- ACCOUNT (5 FAQs) ---
    {
      q: "Do I need an account to place an order?",
      a: "Yes, creating an account helps you track order status in real time, view order history, and save shipping addresses for faster future checkouts.",
      icon: <FaUserCircle />,
      category: "ACCOUNT",
    },
    {
      q: "How do I reset my password?",
      a: "Go to the Login page, click the 'Forgot Password' link, enter your email, and follow the instructions sent to reset your credentials.",
      icon: <FaQuestionCircle />,
      category: "ACCOUNT",
    },
    {
      q: "Can I change my registered email or phone number?",
      a: "Yes, you can edit your profile information, including contact details and default shipping addresses, under the Profile section of your dashboard.",
      icon: <FaUserCircle />,
      category: "ACCOUNT",
    },
    {
      q: "How do I deactivate or delete my Joyory account?",
      a: "If you wish to delete your account, please send a request email to hello@joyory.com from your registered email address.",
      icon: <FaShieldAlt />,
      category: "ACCOUNT",
    },
    {
      q: "How can I save multiple shipping addresses?",
      a: "Navigate to the Address Book in your account dashboard. You can add, edit, and designate a default address for quick shipping selections.",
      icon: <FaBoxOpen />,
      category: "ACCOUNT",
    },

    // --- SHOPPING (5 FAQs) ---
    {
      q: "How do I place an order?",
      a: "Simply browse our catalogue, select your desired items, choose shade options (if applicable), click 'Add to Cart', and proceed to secure checkout.",
      icon: <FaBoxOpen />,
      category: "SHOPPING",
    },
    {
      q: "What if the product I want is out of stock?",
      a: "Click the 'Notify Me' button on the product page. We will send you an automated email/SMS alert as soon as the item is restocked.",
      icon: <FaEnvelope />,
      category: "SHOPPING",
    },
    {
      q: "How do I find the correct foundation shade online?",
      a: "Use our interactive 'Shade Finder' tool. You can match with your existing foundation brands or take our shade questionnaire to find your perfect fit.",
      icon: <FaQuestionCircle />,
      category: "SHOPPING",
    },
    {
      q: "Can I save products to buy later?",
      a: "Yes! Click the heart icon (Wishlist) on any product card or detail page. You can access and manage saved items under the 'Wishlist' section.",
      icon: <FaQuestionCircle />,
      category: "SHOPPING",
    },
    {
      q: "Is there a limit on purchase quantity?",
      a: "Generally, you can purchase as many items as you want. However, bulk limits may apply to promotional items or high-demand products.",
      icon: <FaBoxOpen />,
      category: "SHOPPING",
    },

    // --- ORDER (5 FAQs) ---
    {
      q: "How long does delivery take?",
      a: "Standard delivery typically takes 2–7 business days, depending on your geographic location and courier service availability.",
      icon: <FaClock />,
      category: "ORDER",
    },
    {
      q: "Can I modify my shipping address after placing an order?",
      a: "We process orders quickly. Address updates are only possible if the order has not been dispatched. Contact support immediately for assistance.",
      icon: <FaUserCircle />,
      category: "ORDER",
    },
    {
      q: "Where can I view my order history?",
      a: "Log in to your account and click the 'My Orders' section in the sidebar. You will see a detailed history of all past and current orders.",
      icon: <FaBoxes />,
      category: "ORDER",
    },
    {
      q: "What do the different order statuses mean?",
      a: "Pending: payment processing; Processing: packing and verification; Shipped: handed over to courier; Delivered: package received.",
      icon: <FaQuestionCircle />,
      category: "ORDER",
    },
    {
      q: "My order shows delivered but I haven't received it?",
      a: "Please verify with family members, neighbors, or building security first. If still unfound, contact us within 24 hours so we can investigate.",
      icon: <FaTruck />,
      category: "ORDER",
    },

    // --- CANCELLATION (5 FAQs) ---
    {
      q: "Can I cancel my order?",
      a: "Yes, you can cancel your order at any time before it has been shipped. Once shipped, the cancel option will be disabled.",
      icon: <FaUndo />,
      category: "CANCELLATION",
    },
    {
      q: "How do I cancel my order?",
      a: "Go to your dashboard, open 'My Orders', click on the active order you wish to cancel, and click the 'Cancel Order' button.",
      icon: <FaBoxOpen />,
      category: "CANCELLATION",
    },
    {
      q: "Is there a fee for cancelling an order?",
      a: "No, cancellations made prior to shipment are completely free and eligible for a full refund.",
      icon: <FaCreditCard />,
      category: "CANCELLATION",
    },
    {
      q: "How long does a cancellation refund take?",
      a: "Once cancelled, refunds are initiated immediately and usually reflect in your original payment mode within 5–7 business days.",
      icon: <FaClock />,
      category: "CANCELLATION",
    },
    {
      q: "Can I cancel a part of my order?",
      a: "Partial cancellations are not supported. If you want to change items, you must cancel the full order and place a new one.",
      icon: <FaUndo />,
      category: "CANCELLATION",
    },

    // --- PAYMENTS (5 FAQs) ---
    {
      q: "What payment methods do you accept?",
      a: "We accept UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards, Net Banking, and Cash on Delivery (COD) for eligible pincodes.",
      icon: <FaCreditCard />,
      category: "PAYMENTS",
    },
    {
      q: "My payment failed but my money was debited. What should I do?",
      a: "Do not worry. Failed payments are automatically reversed by banks and usually return to your source account in 3–5 working days.",
      icon: <FaQuestionCircle />,
      category: "PAYMENTS",
    },
    {
      q: "Is Cash on Delivery (COD) available for my area?",
      a: "We offer COD for most domestic pincodes. Pincode eligibility is automatically checked and displayed during the checkout payment step.",
      icon: <FaTruck />,
      category: "PAYMENTS",
    },
    {
      q: "Are there any hidden costs or taxes?",
      a: "No, all product prices are fully inclusive of applicable taxes. Shipping charges, if applicable, are shown transparently at checkout.",
      icon: <FaCreditCard />,
      category: "PAYMENTS",
    },
    {
      q: "Can I pay using two different cards or UPI ids?",
      a: "Currently, our system only supports a single payment method per order transaction.",
      icon: <FaCreditCard />,
      category: "PAYMENTS",
    },

    // --- RETURNS (5 FAQs) ---
    {
      q: "Can I return a product?",
      a: "Yes, returns are accepted within 7 days of delivery. The item must be unused, sealed, and in its original intact packaging.",
      icon: <FaUndo />,
      category: "RETURNS",
    },
    {
      q: "How do I request a return?",
      a: "Navigate to your 'My Orders' history, select the eligible order, and click 'Request Return' to begin the review process.",
      icon: <FaBoxOpen />,
      category: "RETURNS",
    },
    {
      q: "Do you arrange reverse pick-ups?",
      a: "Yes, once your return request is approved, our shipping partner will collect the product from your default address.",
      icon: <FaTruck />,
      category: "RETURNS",
    },
    {
      q: "Are hygiene products eligible for return?",
      a: "To maintain hygiene, items like opened lipsticks, mascaras, eyeliners, and personal care products are strictly non-returnable.",
      icon: <FaShieldAlt />,
      category: "RETURNS",
    },
    {
      q: "What if I receive a damaged or broken product?",
      a: "Please contact us immediately with clear opening photos or videos within 24 hours of delivery so we can issue a replacement.",
      icon: <FaBoxOpen />,
      category: "RETURNS",
    },

    // --- OFFERS (5 FAQs) ---
    {
      q: "What are your offers and promotions?",
      a: "We run seasonal sales, discount coupon codes, and bundle buy offers. Check out the 'Offers' landing page in our header for details.",
      icon: <FaTags />,
      category: "OFFERS",
    },
    {
      q: "How do I apply a coupon code?",
      a: "Type or paste the coupon code into the promo box at the Cart/Checkout page and click 'Apply' to adjust your total.",
      icon: <FaCreditCard />,
      category: "OFFERS",
    },
    {
      q: "Can I apply multiple coupon codes?",
      a: "No, only one promotional coupon code can be applied per order. Coupons cannot be stacked.",
      icon: <FaTags />,
      category: "OFFERS",
    },
    {
      q: "Do you offer free gifts with purchases?",
      a: "Yes, select brands and promotional bundles offer free items. Eligible free gifts are auto-added to your cart during checkout.",
      icon: <FaBoxOpen />,
      category: "OFFERS",
    },
    {
      q: "How do I get notifications for new sales?",
      a: "Sign up for our email newsletters or allow push notifications to get early access to sales events and exclusive promos.",
      icon: <FaEnvelope />,
      category: "OFFERS",
    },

    // --- AUTHENTICITY (5 FAQs) ---
    {
      q: "Are all the products sold on Joyory genuine?",
      a: "Absolutely. Authenticity is our highest priority. All products are sourced directly from brands, verified importers, or authorized distributors.",
      icon: <FaShieldAlt />,
      category: "AUTHENTICITY",
    },
    {
      q: "How can I verify if my product is authentic?",
      a: "All items feature brand labels, standard barcodes, batch codes, and holographic seals. You can verify batch details on manufacturer portals.",
      icon: <FaShieldAlt />,
      category: "AUTHENTICITY",
    },
    {
      q: "Do you sell expired or near-expiry products?",
      a: "No, we strictly monitor stock levels. All items shipped are guaranteed to have a long shelf life, typically between 12 to 24 months.",
      icon: <FaClock />,
      category: "AUTHENTICITY",
    },
    {
      q: "Can you provide certificates of authenticity?",
      a: "We can provide invoice details and authorization credentials if requested for verification verification.",
      icon: <FaShieldAlt />,
      category: "AUTHENTICITY",
    },
    {
      q: "How are products stored to prevent degradation?",
      a: "Products are stored in temperature-controlled warehouses to ensure they remain fresh and retain their formulation quality.",
      icon: <FaShieldAlt />,
      category: "AUTHENTICITY",
    },

    // --- WRITE (5 FAQs) ---
    {
      q: "How can I write to Joyory?",
      a: "You can email our customer care team at hello@joyory.com or fill out the contact form under our website support page.",
      icon: <FaEnvelope />,
      category: "WRITE",
    },
    {
      q: "What is your typical response time?",
      a: "Our customer team works round the clock. We typically respond to all customer emails and queries within 12–24 business hours.",
      icon: <FaClock />,
      category: "WRITE",
    },
    {
      q: "How can brands contact Joyory for vendor partnerships?",
      a: "If you are a brand or verified distributor, please email our merchandising team at brands@joyory.com.",
      icon: <FaEnvelope />,
      category: "WRITE",
    },
    {
      q: "How do I submit product reviews on your website?",
      a: "Go to the page of the product you bought, scroll to reviews, and click 'Write Review' to submit your rating and comments.",
      icon: <FaQuestionCircle />,
      category: "WRITE",
    },
    {
      q: "Can I write or pitch blogs for the Joyory community?",
      a: "Yes, beauty writers and content creators can pitch article outlines to content@joyory.com for review.",
      icon: <FaEnvelope />,
      category: "WRITE",
    },

    // --- FRAUD (5 FAQs) ---
    {
      q: "How do you protect my payments against fraud?",
      a: "We work with top-tier PCI-DSS compliant payment processors using 3D secure gateways to verify all transactions safely.",
      icon: <FaShieldAlt />,
      category: "FRAUD",
    },
    {
      q: "What should I do if I receive a suspicious call claiming to be Joyory?",
      a: "Joyory will never call you asking for OTPs, bank credentials, or cash prizes. Please hang up and report it to hello@joyory.com.",
      icon: <FaQuestionCircle />,
      category: "FRAUD",
    },
    {
      q: "Are my card credentials stored on your servers?",
      a: "No, we do not save sensitive card numbers or CVVs on our databases. All transaction processing is completed securely by tokenized gateways.",
      icon: <FaCreditCard />,
      category: "FRAUD",
    },
    {
      q: "How do I report a suspected fraudulent transaction?",
      a: "Notify your bank immediately to block the card, and email us at alerts@joyory.com so we can flag the order on our side.",
      icon: <FaShieldAlt />,
      category: "FRAUD",
    },
    {
      q: "What measures do you take to avoid duplicate shipping fraud?",
      a: "Our system matches order delivery updates, AWBs, and tracking links to prevent unauthorized parcel redirects or double charges.",
      icon: <FaTruck />,
      category: "FRAUD",
    },

    // --- TRACKING (5 FAQs) ---
    {
      q: "How do I track my order?",
      a: "Once shipped, you can track it via the link in your email/SMS or go to 'My Orders' and click 'Track Order'.",
      icon: <FaTruck />,
      category: "TRACKING",
    },
    {
      q: "Why is my tracking link showing invalid or not updated?",
      a: "Couriers take up to 12–24 hours from dispatch to update tracking records on their tracking systems. Please check again later.",
      icon: <FaClock />,
      category: "TRACKING",
    },
    {
      q: "Which courier partners do you use for shipping?",
      a: "We ship orders through trusted national logistics partners like BlueDart, Delhivery, Shadowfax, and Expressbees.",
      icon: <FaTruck />,
      category: "TRACKING",
    },
    {
      q: "Can I schedule my delivery date or time?",
      a: "You can request special delivery instructions directly with the courier executive when they call you prior to delivery.",
      icon: <FaClock />,
      category: "TRACKING",
    },
    {
      q: "What if the tracking status says my order is returned to origin (RTO)?",
      a: "Orders return to us if couriers fail to deliver after multiple contact attempts. We will automatically cancel it and issue a full refund.",
      icon: <FaUndo />,
      category: "TRACKING",
    },
  ];

  const filteredFaqs = useMemo(
    () => faqs.filter((faq) => faq.category === categoryId),
    [categoryId, faqs]
  );

  const toggleFAQ = (questionText) => {
    setOpenQuestion(openQuestion === questionText ? null : questionText);
  };

  return (
    <>
      <Header />

      <div className="container-fluid ua-page page-title-main-name mt-lg-5 pt-lg-5 mt-md-0 pt-md-5">
        <section className="Heading-Name mt-lg-5 mt-md-0 pt-md-0">
          <h3 className="ua-title ms-4">Help & FAQ</h3>
          <Sidebarcomon />
        </section>

        <main className="ua-content help-redesign-content mt-lg-5 pt-lg-2 mt-md-0 pt-md-5 overflow-hidden">
          <section className="ua-card">
            
            {/* Conditional Layout Display depending on active route param categoryId */}
            {!categoryId ? (
              /* ================= GRID CATEGORY VIEW ================= */
              <>
                <div className="help-hero-banner">
                  <h1 className="help-hero-title">HOW CAN WE HELP YOU?</h1>
                  <p className="help-hero-subtitle">
                    Joyory Customer Support & FAQ Hub
                  </p>
                </div>

                <div className="help-category-grid">
                  {categories.map((category, index) => (
                    <button
                      key={category.id}
                      className="help-category-card"
                      style={{ "--i": index }}
                      onClick={() => navigate(`/Help/category/${category.id}`)}
                    >
                      <span className="help-category-icon">{category.icon}</span>
                      <span className="help-category-label">{category.label}</span>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              /* ================= FAQS ACCORDION DETAIL VIEW ================= */
              <div className="help-faq-section">
                <div className="help-faq-section-header">
                  <h2>{categories.find((c) => c.id === categoryId)?.label}</h2>
                  <p>Tap a question to expand the answer</p>
                </div>

                <div className="help-faq-wrapper">
                  {filteredFaqs.length > 0 ? (
                    filteredFaqs.map((faq, index) => {
                      const isOpen = openQuestion === faq.q;
                      return (
                        <div
                          key={index}
                          className={`help-faq-card ${isOpen ? "is-open" : ""}`}
                          style={{ "--i": index }}
                        >
                          <button
                            className="help-faq-trigger"
                            onClick={() => toggleFAQ(faq.q)}
                            aria-expanded={isOpen}
                          >
                            <span className="help-faq-question">
                              <span className="help-faq-icon">{faq.icon}</span>
                              {faq.q}
                            </span>
                            <FaChevronDown
                              className="help-faq-chevron"
                              style={{
                                transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                              }}
                            />
                          </button>

                          <div
                            className="help-faq-collapse"
                            style={{ maxHeight: isOpen ? "220px" : "0px" }}
                          >
                            <div className="help-faq-body">{faq.a}</div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="help-faq-empty">
                      <div className="help-faq-empty-icon">🔍</div>
                      <h4>No FAQs Available</h4>
                    </div>
                  )}
                </div>

                <div className="help-actions-bar">
                  <button className="help-back-btn" onClick={() => navigate("/Help")}>
                    ← Back to Categories
                  </button>
                </div>
              </div>
            )}

            {/* Support section shown on default grid page */}
            {!categoryId && (
              <div className="help-support-section">
                <div className="help-support-header">
                  <h3>STILL HAVE QUESTIONS?</h3>
                  <p>Contact our concierge team directly. We are always here to assist you.</p>
                </div>

                <div className="help-support-grid">
                  <a href="tel:9601177701" className="help-support-card">
                    <div className="help-support-icon-wrapper">
                      <FaPhone />
                    </div>
                    <h4>Call Us</h4>
                    <p>Talk to our beauty advisors over phone support</p>
                    <span className="help-support-value">9601177701</span>
                  </a>

                  <a
                    href="https://wa.me/919601177701"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="help-support-card"
                  >
                    <div className="help-support-icon-wrapper">
                      <FaWhatsapp />
                    </div>
                    <h4>WhatsApp</h4>
                    <p>Send a direct message for instant live assistance</p>
                    <span className="help-support-value">WhatsApp Chat</span>
                  </a>

                  <a href="mailto:hello@joyory.com" className="help-support-card">
                    <div className="help-support-icon-wrapper">
                      <FaEnvelope />
                    </div>
                    <h4>Email Us</h4>
                    <p>Send your feedback, request, or issues anytime</p>
                    <span className="help-support-value">hello@joyory.com</span>
                  </a>
                </div>
              </div>
            )}

            {/* General back button if not in detail view */}
            {!categoryId && (
              <div className="help-actions-bar">
                <button className="help-back-btn" onClick={() => navigate('/useraccount')}>
                  ← Go Back
                </button>
              </div>
            )}

          </section>
        </main>
      </div>

      <Footer />
    </>
  );
};

export default Help;