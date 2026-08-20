import React, { useState, useEffect, useRef } from "react";
import "../../styles/Terms.css";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import {
  Scale,
  UserCheck,
  ShieldAlert,
  AlertOctagon,
  Tag,
  Store,
  Eye,
  ShoppingBag,
  CreditCard,
  Truck,
  XCircle,
  RefreshCw,
  MessageSquare,
  Gift,
  ShieldCheck,
  UserX,
  FileText,
  Mail,
  CloudLightning,
  MapPin,
  Phone,
  Search,
  ChevronDown,
  ChevronUp,
  ArrowUp,
  Info
} from "lucide-react";

const Terms = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState("introduction");
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // References to sections for scrolling
  const sectionRefs = useRef({});

  // Legal Sections Data
  const termsSections = [
    {
      id: "introduction",
      title: "1. Introduction",
      icon: <Info size={20} />,
      content: {
        paragraphs: [
          'Welcome to Joyory ("Company", "we", "our", "us"). We operate under Joyory Luxe Private Limited.',
          'These Terms and Conditions govern your use of our website, mobile application, products, services, and related platforms ("Platform").',
          'By accessing or using our Platform, you agree to be bound by these Terms. If you do not agree with any part of these Terms, please discontinue use of the Platform immediately.'
        ]
      }
    },
    {
      id: "eligibility",
      title: "2. Eligibility",
      icon: <UserCheck size={20} />,
      content: {
        paragraphs: [
          "By using our Platform, you represent and warrant that:",
          "You are at least 18 years of age or accessing the Platform under parental or legal guardian supervision.",
          "You have the legal capacity to enter into a binding agreement.",
          "All information provided during registration or checkout is accurate, complete, and current."
        ]
      }
    },
    {
      id: "user-account",
      title: "3. User Account & Security",
      icon: <ShieldAlert size={20} />,
      content: {
        paragraphs: [
          "To access certain services or place orders, you may be required to create a user account. You are solely responsible for:",
          "Maintaining the accuracy and confidentiality of your login credentials.",
          "Restricting access to your device to prevent unauthorized account access.",
          "Accepting responsibility for all activities and transactions that occur under your account."
        ],
        note: "We reserve the right to suspend, disable, or terminate accounts involved in fraudulent, unauthorized, or illegal activities at our sole discretion."
      }
    },
    {
      id: "account-termination",
      title: "4. Account Termination",
      icon: <UserX size={20} />,
      content: {
        paragraphs: [
          "We value a safe and fair shopping experience on our Platform. Joyory reserves the right, at its sole discretion, to suspend, restrict, or permanently terminate access to any account or revoke Platform access without prior notice.",
          "Accounts may be terminated due to: violation of these Terms, suspected fraudulent or illegal activities, abuse of promotional offers or discount coupons, misuse of return/refund policies, or any conduct that damages our reputation or operations."
        ]
      }
    },
    {
      id: "products-pricing",
      title: "5. Products and Pricing",
      icon: <Tag size={20} />,
      content: {
        paragraphs: [
          "We strive to ensure product descriptions, images, pricing, and availability on the Platform are as accurate as possible. However, please note that:",
          "Actual product packaging, formulations, colors, and designs may vary from the images shown.",
          "Prices and stock availability are subject to change without prior notice.",
          "Promotional offers, bundle discounts, and loyalty pricing may be modified or withdrawn at any time.",
          "Certain products may be available only in selected regions or for limited periods."
        ],
        note: "In the event of pricing errors or incorrect product details, we reserve the right to cancel any affected orders and refund any payments made."
      }
    },
    {
      id: "marketplace-limitation",
      title: "6. Marketplace Limitation",
      icon: <Store size={20} />,
      content: {
        paragraphs: [
          "Joyory acts as a curated online marketplace, authorized reseller, distributor, or seller for multiple beauty and cosmetic brands.",
          "Product-specific warranties, ingredient safety claims, allergy warnings, clinical trial results, and manufacturer guarantees are governed entirely by the terms and policies of the respective brand manufacturers.",
          "Joyory shall not be held liable or responsible for inaccuracies, misrepresentations, or side effects originating from brand-provided information, formulation sheets, or manufacturer claims."
        ]
      }
    },
    {
      id: "virtual-tryon-disclaimer",
      title: "7. AI Recommendations & Try-On Disclaimer",
      icon: <Eye size={20} />,
      content: {
        paragraphs: [
          "Our Platform features digital tools designed to assist you, including Virtual Try-On, Shade Finder, AI-powered skin analysis recommendations, and digital beauty advisory tools.",
          "These features are provided for informational and convenience purposes only. Actual product shades, textures, coverage, finishes, and results on your physical skin may vary significantly based on individual skin tone, lighting conditions, device camera settings, and screen color display profiles.",
          "Joyory does not guarantee exact shade matches, efficacy of recommended skincare regimens, or individual cosmetic outcomes. We strongly suggest cross-referencing shades and conducting research before buying."
        ]
      }
    },
    {
      id: "order-acceptance",
      title: "8. Order Acceptance",
      icon: <ShoppingBag size={20} />,
      content: {
        paragraphs: [
          "Placing an order on the Platform represents an offer to purchase and does not guarantee acceptance. An order is considered confirmed and legally accepted only after:",
          "Successful payment authorization and transaction clearance has been completed (for prepaid orders).",
          "Internal anti-fraud and logistics verification checks are completed successfully.",
          "Dispatch confirmation and tracking details are generated and shared from our warehouse."
        ],
        note: "We reserve the right to reject, refuse, or cancel any order due to product unavailability, sudden stock outages, errors in pricing/listings, detection of fraudulent activity, or violation of these Terms."
      }
    },
    {
      id: "payments",
      title: "9. Payments",
      icon: <CreditCard size={20} />,
      content: {
        paragraphs: [
          "We support various secure payment methods to make checkout seamless:",
          "UPI (Unified Payments Interface)",
          "Debit Cards and Credit Cards (Visa, Mastercard, RuPay, American Express, etc.)",
          "Net Banking with leading financial institutions",
          "Authorized Digital Wallets",
          "Cash on Delivery (where service is available and account is eligible)"
        ],
        note: "All payment transactions are processed through secure, industry-compliant, PCI-DSS certified third-party payment gateways. Joyory does not store complete credit/debit card details, CVVs, or payment credentials on its servers."
      }
    },
    {
      id: "shipping-delivery",
      title: "10. Shipping and Delivery",
      icon: <Truck size={20} />,
      content: {
        paragraphs: [
          "We aim to process and deliver orders within 7–10 business days. However, please note that delivery timelines are estimates and not strict guarantees.",
          "Timelines may vary based on your delivery address, public holidays, regional logistics bottlenecks, extreme weather conditions, natural disruptions, or other unforeseen operational limits of our shipping partners.",
          "Joyory Luxe Private Limited shall not be held liable for delivery delays or cargo damage caused by circumstances beyond our reasonable control (force majeure)."
        ]
      }
    },
    {
      id: "cancellation",
      title: "11. Cancellation Policy",
      icon: <XCircle size={20} />,
      content: {
        paragraphs: [
          "Customers may cancel orders before shipment confirmation directly via the Platform account section or by contacting our Customer Support team.",
          "Once an order is handed over to our logistics partner and shipment confirmation is generated, the order cannot be cancelled. In such cases, customers must wait for delivery and request returns, if eligible.",
          "We reserve the right to cancel any order due to product stockouts, platform system glitches, fraud prevention checks, or regulatory restrictions. Eligible refunds for cancelled orders will be credited back to the original payment source."
        ]
      }
    },
    {
      id: "return-refund",
      title: "12. Return, Replacement & Refund",
      icon: <RefreshCw size={20} />,
      content: {
        paragraphs: [
          "Eligible Returns: Products may be returned or replaced only if: they are damaged/tampered with upon delivery, the wrong item/shade is delivered, an expired product is received, or there is a verified manufacturing defect.",
          "Return Window: Customers must raise a return, replacement, or refund request within 7 days of delivery through the 'My Orders' section.",
          "Non-Returnable Products: For hygiene and safety reasons, beauty and personal care products are strictly non-returnable once opened, used, or their protective seals are broken. This includes skincare, haircare, personal hygiene products, cosmetics, makeup essentials, and gift vouchers.",
          "Refund Processing: Approved refunds are processed within 5–10 business days after the returned product reaches our warehouse and successfully passes our quality inspection checks. Final bank credit timelines vary depending on your bank and payment gateway."
        ]
      }
    },
    {
      id: "user-reviews",
      title: "13. User Reviews & Content",
      icon: <MessageSquare size={20} />,
      content: {
        paragraphs: [
          "Our Platform may allow users to post reviews, ratings, comments, photographs, and videos ('User Content').",
          "You represent and warrant that your User Content is authentic, accurate, and does not violate any copyright, trademark, privacy, or other proprietary rights.",
          "Joyory reserves the right (but does not assume the obligation) to monitor, edit, or remove any content that we deem misleading, defamatory, offensive, fraudulent, abusive, or in violation of applicable laws."
        ]
      }
    },
    {
      id: "promotions-coupons",
      title: "14. Promotions & Coupons",
      icon: <Gift size={20} />,
      content: {
        paragraphs: [
          "Promotional offers, discount coupons, wallet credits, referral rewards, and marketing campaigns are subject to individual terms, validity periods, and minimum purchase rules.",
          "Coupons cannot be combined with other offers unless explicitly stated. Joyory reserves the right to modify, suspend, or withdraw any discount scheme or credit program without prior notice.",
          "Abuse, duplicate account creation to claim referral benefits, or misuse of promotional programs will lead to cancellation of benefits, order rejections, and potential account suspension."
        ]
      }
    },
    {
      id: "anti-fraud",
      title: "15. Anti-Fraud & Policy Abuse",
      icon: <ShieldCheck size={20} />,
      content: {
        paragraphs: [
          "To protect our marketplace integrity, we actively monitor transaction patterns, returns, and customer histories.",
          "Joyory reserves the right to refuse service, restrict Cash on Delivery (COD) eligibility, reject orders, or permanently block accounts if we detect suspicious patterns, fraudulent transactions, payment chargebacks, policy abuse, or excessive/unjustified return activities."
        ]
      }
    },
    {
      id: "user-conduct",
      title: "16. User Conduct",
      icon: <AlertOctagon size={20} />,
      content: {
        paragraphs: [
          "As a user of our Platform, you agree not to:",
          "Provide false, inaccurate, or misleading information during account creation or checkout.",
          "Attempt unauthorized access to the Platform, servers, network systems, or user databases.",
          "Interfere with or disrupt the normal operations, performance, and security of the Platform.",
          "Upload or transmit viruses, trojans, malicious code, or files designed to damage software or hardware operations.",
          "Use the Platform, products, or services for any unlawful, illegal, or prohibited purposes."
        ],
        note: "Violations of this section may lead to immediate account suspension, access revocation, and appropriate legal action under the Information Technology Act and other relevant statutes."
      }
    },
    {
      id: "intellectual-property",
      title: "17. Intellectual Property",
      icon: <Scale size={20} />,
      content: {
        paragraphs: [
          "All contents of the Platform, including but not limited to logos, graphics, brand names, visual design elements, layouts, user interface flows, product descriptions, listings, texts, illustrations, audio/video clips, source code, and software, are owned by or licensed to Joyory Luxe Private Limited.",
          "These contents are protected under intellectual property laws in India and international copyright and trademark regulations.",
          "Any unauthorized copying, reproduction, distribution, modifications, scraping, or commercial exploitation of the Platform's assets is strictly prohibited and will result in legal proceedings."
        ]
      }
    },
    {
      id: "electronic-communication",
      title: "18. Electronic Communications",
      icon: <Mail size={20} />,
      content: {
        paragraphs: [
          "By accessing our Platform, creating an account, or placing an order, you explicitly consent to receive transactional and promotional communications from us.",
          "These communications may be sent via email, SMS, WhatsApp messages, push notifications, or other digital channels regarding your orders, account status, payment receipts, delivery alerts, customer support chats, promotional updates, and legal notices.",
          "You can opt-out of promotional communications at any time via the unsubscribe links provided or by contacting support, but transactional and security alerts will continue to be sent."
        ]
      }
    },
    {
      id: "limitation-liability",
      title: "19. Limitation of Liability",
      icon: <Scale size={20} />,
      content: {
        paragraphs: [
          "To the maximum extent permitted by applicable law, Joyory Luxe Private Limited and its directors, employees, affiliates, or partners shall not be held liable for:",
          "Indirect, incidental, punitive, special, or consequential damages.",
          "Loss of profits, revenue, data, goodwill, or business opportunities.",
          "Platform service interruptions, bugs, malware, server downtimes, or data losses.",
          "Actions, omissions, or conduct of third-party logistics partners, payment gateways, or brand manufacturers."
        ],
        note: "Our total cumulative liability for any claim arising out of or related to your use of the Platform or purchase of products shall not exceed the value of the specific order giving rise to the claim."
      }
    },
    {
      id: "force-majeure",
      title: "20. Force Majeure",
      icon: <CloudLightning size={20} />,
      content: {
        paragraphs: [
          "We shall not be held responsible or liable for delays, delivery failures, or performance lapses caused by events beyond our reasonable control.",
          "These events include, but are not limited to, natural disasters, fires, floods, strikes, labor disputes, lockouts, lockdowns, government regulations, changes in import/export policies, pandemic situations, civil unrest, war, cyber attacks, or widespread logistics and transport disruptions."
        ]
      }
    },
    {
      id: "governing-law",
      title: "21. Governing Law & Disputes",
      icon: <MapPin size={20} />,
      content: {
        paragraphs: [
          "These Terms and Conditions shall be governed by, interpreted, and construed in accordance with the laws of India.",
          "Any legal actions, claims, or disputes arising out of these Terms, your use of the Platform, or purchases made through the Platform shall be subject to the exclusive jurisdiction of the competent courts located in Ahmedabad, Gujarat, India."
        ]
      }
    },
    {
      id: "contact-info",
      title: "22. Contact Information",
      icon: <Phone size={20} />,
      content: {
        paragraphs: [
          "If you have any questions, require clarifications, or need support regarding these Terms and Conditions or the Platform, you can reach out to our Customer Support team:",
          "Joyory Luxe Private Limited",
          "Email: hello@joyory.com",
          "Phone: +91 9601177701",
          "Customer Support: 24×7 Available",
          "Registered Address: Joyory Luxe Private Limited, Ahmedabad, Gujarat, India."
        ]
      }
    }
  ];

  // Monitor scroll to show back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
      setShowScrollTop(scrollTop > 300);
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("scroll", handleScroll, true);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("scroll", handleScroll, true);
    };
  }, []);

  // IntersectionObserver ScrollSpy to update active section in sidebar
  useEffect(() => {
    const observerOptions = {
      root: null, // Viewport
      rootMargin: "-150px 0px -60% 0px", // Upper viewport focus region clearing header
      threshold: 0
    };

    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);

    termsSections.forEach((section) => {
      const element = sectionRefs.current[section.id];
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [searchQuery]);

  const handleNavClick = (id) => {
    setActiveSection(id);
    setIsMobileNavOpen(false);
    const element = sectionRefs.current[id];
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // Helper function to check if query matches text in section
  const sectionMatchesQuery = (section, query) => {
    if (!query) return true;
    const lowerQuery = query.toLowerCase();
    const titleMatch = section.title.toLowerCase().includes(lowerQuery);
    const idMatch = section.id.toLowerCase().includes(lowerQuery);
    
    // Check paragraphs
    const paragraphsMatch = section.content.paragraphs.some(p => 
      p.toLowerCase().includes(lowerQuery)
    );

    // Check note
    const noteMatch = section.content.note && section.content.note.toLowerCase().includes(lowerQuery);

    return titleMatch || idMatch || paragraphsMatch || noteMatch;
  };

  // Filtered sections based on search query
  const filteredSections = termsSections.filter(section => 
    sectionMatchesQuery(section, searchQuery)
  );

  // Helper to highlight matching text in paragraphs
  const highlightText = (text, highlight) => {
    if (!highlight.trim()) return text;
    
    const regex = new RegExp(`(${highlight.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, i) => 
      regex.test(part) ? <mark key={i} className="highlight-text">{part}</mark> : part
    );
  };

  // Find active section title for mobile nav indicator
  const currentActiveSectionTitle = termsSections.find(s => s.id === activeSection)?.title || "Select Section";

  return (
    <>
      <Header />
      <div className="non-hero-spacer"></div>

      <div className="terms-container">
        {/* Banner */}
        <header className="terms-header-banner">
          <h1>Terms & Conditions</h1>
          <p>
            Welcome to Joyory Luxe. Please read these terms carefully before accessing or shopping on our platform.
          </p>
          
        </header>

        {/* Search Panel */}
        <section className="terms-search-section">
          <div className="terms-search-wrapper">
            <Search className="terms-search-icon" size={20} />
            <input
              type="text"
              className="terms-search-input"
              placeholder="Search legal terms (e.g. refund, shade finder, payments)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                className="terms-clear-btn" 
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
              >
                <XCircle size={18} />
              </button>
            )}
          </div>
        </section>

        {/* Main Grid */}
        <div className="terms-main-layout">
          
          {/* Desktop Navigation Sidebar */}
          <aside className="terms-sidebar">
            <h3 className="terms-sidebar-title">Table of Contents</h3>
            <ul className="terms-nav-list">
              {termsSections.map((section) => {
                const isMatch = sectionMatchesQuery(section, searchQuery);
                return (
                  <li 
                    key={section.id} 
                    className={`terms-nav-item ${activeSection === section.id ? "active" : ""} ${!isMatch ? "opacity-25" : ""}`}
                  >
                    <button 
                      onClick={() => handleNavClick(section.id)}
                      disabled={!isMatch}
                    >
                      {section.title}
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>

          {/* Mobile Navigation Dropdown */}
          <div className="terms-mobile-nav px-3">
            <button 
              className="terms-mobile-nav-toggle" 
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
            >
              <span>{currentActiveSectionTitle}</span>
              {isMobileNavOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            {isMobileNavOpen && (
              <ul className="terms-mobile-nav-dropdown">
                {termsSections.map((section) => {
                  const isMatch = sectionMatchesQuery(section, searchQuery);
                  if (!isMatch) return null;
                  return (
                    <li 
                      key={section.id} 
                      className={activeSection === section.id ? "active" : ""}
                    >
                      <button onClick={() => handleNavClick(section.id)}>
                        {section.title}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Terms Content Pane */}
          <main className="terms-content-pane">
            {filteredSections.length > 0 ? (
              filteredSections.map((section) => (
                <article
                  key={section.id}
                  id={section.id}
                  ref={(el) => (sectionRefs.current[section.id] = el)}
                  className={`terms-section-card ${activeSection === section.id ? "highlighted-section" : ""}`}
                >
                  <header className="terms-section-header">
                    <div className="terms-section-icon-box">
                      {section.icon}
                    </div>
                    <h2>
                      {highlightText(section.title, searchQuery)}
                    </h2>
                  </header>
                  <div className="terms-section-body">
                    {section.content.paragraphs.map((p, idx) => (
                      <p key={idx}>
                        {highlightText(p, searchQuery)}
                      </p>
                    ))}
                    {section.content.note && (
                      <div className="terms-highlight-note">
                        <AlertOctagon size={20} />
                        <div>
                          <strong>Important Safeguard: </strong>
                          {highlightText(section.content.note, searchQuery)}
                        </div>
                      </div>
                    )}
                  </div>
                </article>
              ))
            ) : (
              <div className="terms-no-results">
                <Search className="terms-no-results-icon" size={48} />
                <h3>No Matches Found</h3>
                <p>
                  We couldn't find any terms matching "{searchQuery}". Try searching for other keywords like "refund", "payments", "conduct", or "delivery".
                </p>
                <button 
                  className="terms-reset-btn" 
                  onClick={() => setSearchQuery("")}
                >
                  Reset Search Filter
                </button>
              </div>
            )}
          </main>
        </div>

        {/* Floating Scroll Top Trigger */}
        {showScrollTop && (
          <button 
            className="terms-back-to-top" 
            onClick={scrollToTop}
            aria-label="Scroll to top"
          >
            <ArrowUp size={22} />
          </button>
        )}
      </div>

      <Footer />
    </>
  );
};

export default Terms;
