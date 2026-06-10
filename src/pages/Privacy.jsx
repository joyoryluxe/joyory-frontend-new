import React, { useState, useEffect, useRef } from "react";
import "../styles/Privacy.css";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import {
  Shield,
  Database,
  Mail,
  Sliders,
  Share2,
  Lock,
  Hourglass,
  UserCheck,
  ExternalLink,
  Users,
  AlertTriangle,
  UserCheck2,
  FileText,
  Search,
  ChevronDown,
  ChevronUp,
  ArrowUp,
  Info
} from "lucide-react";

const Privacy = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState("introduction");
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const sectionRefs = useRef({});

  // Privacy Policy Sections Data
  const privacySections = [
    {
      id: "introduction",
      title: "1. Introduction & Scope",
      icon: <Info size={20} />,
      content: {
        paragraphs: [
          'This Privacy Policy explains how Joyory Luxe Private Limited ("Joyory", "Company", "we", "our", "us") collects, uses, stores, shares, and protects your personal information when you access or use our website, mobile application, products, services, and related platforms ("Platform").',
          "We value your privacy and are committed to protecting your personal data in accordance with applicable laws. By accessing the Platform, you consent to the collection and use of your data as outlined in this policy.",
          "This Privacy Policy is intended to comply with applicable provisions of Indian data protection and information technology laws, including the Information Technology Act, 2000, and the rules and regulations framed thereunder, as amended from time to time."
        ]
      }
    },
    {
      id: "information-collected",
      title: "2. Information We Collect",
      icon: <Database size={20} />,
      content: {
        paragraphs: [
          "We collect various types of information to serve you better, which includes:",
          "Personal Identifiable Information: Full Name, email address, mobile/phone number, shipping address, and billing address.",
          "Account Information: Profile username, and account password (securely hashed and encrypted on our servers).",
          "Transaction & Purchase Information: Order history, products viewed, wishlists, shopping cart details, payment authorization reference numbers, refund history, and return/replacement requests.",
          "Technical & Device Information: Device model, operating system, unique device identifiers, browser type, IP address, geographical location, and browser cookies.",
          "Beauty Profile & AI Try-On Data: Makeup shade selections, skin concern profiles, beauty preferences, wishlist actions, interactions with AI skin-analysis tools, Shade Finder queries, and Virtual Try-On snapshots. We process this data to personalize suggestions and matching accuracy."
        ]
      }
    },
    {
      id: "marketing-consent",
      title: "3. Marketing Communications",
      icon: <Mail size={20} />,
      content: {
        paragraphs: [
          "By creating an account, subscribing to our newsletters, participating in brand promotional campaigns, or providing contact information at checkout, you consent to receive communications from us.",
          "These communications include transactional alerts, security updates, delivery tracking messages, promotional newsletters, discount codes, and marketing materials.",
          "Communications may be delivered via email, SMS messages, push notifications, or WhatsApp chat. You can opt-out of promotional marketing at any time through your Account Settings or the 'Unsubscribe' links provided."
        ]
      }
    },
    {
      id: "information-usage",
      title: "4. How We Use Information",
      icon: <Sliders size={20} />,
      content: {
        paragraphs: [
          "We process your personal information under appropriate legal bases for the following business purposes:",
          "To process, verify, fulfill, ship, and deliver your product orders.",
          "To provide active customer support, process replacement requests, and resolve refund claims.",
          "To secure payments, verify transaction authorizations, and prevent card-present or card-not-present fraud.",
          "To run analytics, optimize our Platform performance, resolve system glitches, and enhance search recommendation systems.",
          "To comply with statutory legal, audit, taxation, and regulatory reporting obligations under Indian law."
        ],
        note: "We may use automated and manual fraud detection systems to identify suspicious transactions, account misuse, high-risk payment attempts, excessive return abuse, or violations of Platform policies."
      }
    },
    {
      id: "cookies-analytics",
      title: "5. Cookies & Analytics",
      icon: <Shield size={20} />,
      content: {
        paragraphs: [
          "We use cookies, web beacons, tracking pixels, and local storage mechanisms to improve Platform usability, secure accounts, and custom-tailor advertisements.",
          "Cookies allow us to: keep you logged in, save your shopping bag status, recognize your device settings, and suggest relevant brand offers.",
          "We integrate third-party analytics and advertising technologies (such as Google Analytics, Meta Pixel, Microsoft Clarity, Google Ads, and Facebook Ads) to study platform traffic, user paths, campaign performance, and deliver personalized product advertisements.",
          "These third-party platforms use cookies and device identifiers in compliance with their respective privacy standards. You can manage, block, or clear cookies via your device's browser settings, but doing so may limit platform utilities."
        ]
      }
    },
    {
      id: "information-sharing",
      title: "6. Sharing of Information",
      icon: <Share2 size={20} />,
      content: {
        paragraphs: [
          "We do not sell, rent, or trade your personal information to third-party brokers or advertisers. We share details with trusted operators who assist in business actions:",
          "Logistics Partners: Third-party courier networks (such as Delhivery, BlueDart, etc.) to ship, route, and track your physical orders.",
          "Payment Services: PCI-DSS compliant payment gateways (such as Razorpay) to handle UPI, credit cards, net banking, or wallet transactions.",
          "Tech infrastructure: Secure cloud hosting providers (like AWS), database management servers, CDN routers (like Cloudflare), and customer support platforms.",
          "Legal & Law Enforcement: Judicial bodies, taxation authorities, or government investigators when legally required to protect copyrights, safety, or prevent cyber frauds."
        ],
        note: "Information may be processed and stored on secure database servers operated by our providers in India or other jurisdictions that implement robust safety and encryption measures."
      }
    },
    {
      id: "data-security",
      title: "7. Data Security Safeguards",
      icon: <Lock size={20} />,
      content: {
        paragraphs: [
          "We implement technical, physical, and administrative safeguards to secure your personal data from unauthorized access, loss, misuse, or alteration.",
          "Security measures include: HTTPS/SSL encryption for data in transit, AES encryption for stored passwords, firewall protections, and restricted database entry controls.",
          "Security Incidents: In the event of a security breach or incident affecting personal information, Joyory will take immediate steps to investigate, mitigate damage, patch vulnerabilities, and provide necessary notifications to affected users and regulators under applicable laws.",
          "While we implement commercially reasonable safeguards and industry-standard security practices, no internet transmission or electronic storage system can be guaranteed to be completely secure. We cannot assure complete prevention of malicious hacks."
        ]
      }
    },
    {
      id: "data-retention",
      title: "8. Data Retention Policy",
      icon: <Hourglass size={20} />,
      content: {
        paragraphs: [
          "We retain your personal information only for as long as necessary to satisfy the business purposes outlined in this policy.",
          "Data retention parameters depend on: the lifetime of active customer accounts, compliance with tax audits, addressing warranty/dispute claims, or enforcing legal agreements.",
          "Once the retention window closes, or upon receiving a verified deletion request, we either permanently purge the records from our active databases or safely anonymize the files so you cannot be identified."
        ]
      }
    },
    {
      id: "user-rights",
      title: "9. Your User Rights",
      icon: <UserCheck size={20} />,
      content: {
        paragraphs: [
          "Subject to applicable Indian statutes, you hold the following rights regarding your personal records:",
          "Right of Access: You may request details of the personal data we hold about you.",
          "Right of Rectification: You can update, correct, or complete inaccurate personal information directly via your account settings page.",
          "Right of Deletion: You can request account closure and permanent erasure of your personal data.",
          "Right to Opt-Out: You can withdraw consent for newsletters, marketing communications, SMS campaigns, or phone advisories."
        ],
        note: "Verified account deletion requests are generally processed and completed within 30 days, subject to legal recordkeeping, tax audits, fraud investigations, and dispute resolution requirements."
      }
    },
    {
      id: "third-party-links",
      title: "10. Third-Party Links",
      icon: <ExternalLink size={20} />,
      content: {
        paragraphs: [
          "Our Platform may host hyperlinks to external sites, brand manufacturer websites, or affiliate portals for your convenience.",
          "We do not control, endorse, or verify the privacy practices or contents of third-party portals. We encourage you to review their independent privacy notices before sharing details."
        ]
      }
    },
    {
      id: "children-privacy",
      title: "11. Children's Privacy",
      icon: <Users size={20} />,
      content: {
        paragraphs: [
          "Our Platform, beauty products, and advisory recommendation systems are directed to individuals who are at least 18 years of age.",
          "We do not knowingly collect personal data from children under 18. If we identify that a minor has provided information without parental consent, we will purge that data immediately."
        ]
      }
    },
    {
      id: "user-generated-content",
      title: "12. User-Generated Content",
      icon: <FileText size={20} />,
      content: {
        paragraphs: [
          "Our Platform allows users to post product ratings, reviews, questions, comments, and media files (e.g. photos/videos of cosmetic results).",
          "Please note that any content you voluntarily publish becomes publicly visible on our Platform. We strongly advise users to avoid disclosing sensitive personal info, health details, or bank credentials in public content sections."
        ]
      }
    },
    {
      id: "grievance-officer",
      title: "13. Grievance Officer & Contact",
      icon: <AlertTriangle size={20} />,
      content: {
        paragraphs: [
          "If you have queries, complaints, security reports, or data deletion requests, you can reach out directly to our designated Grievance Officer:"
        ]
      }
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);

      // ScrollSpy: track which section is currently in view
      const scrollPosition = window.scrollY + 200;
      for (const section of privacySections) {
        const element = sectionRefs.current[section.id];
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (id) => {
    setActiveSection(id);
    setIsMobileNavOpen(false);
    const element = sectionRefs.current[id];
    if (element) {
      const offset = 140; // Account for fixed header
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
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
  const filteredSections = privacySections.filter(section => 
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
  const currentActiveSectionTitle = privacySections.find(s => s.id === activeSection)?.title || "Select Section";

  return (
    <>
      <Header />
      <div className="non-hero-spacer"></div>

      <div className="privacy-container">
        {/* Banner */}
        <header className="privacy-header-banner">
          <h1>Privacy Policy</h1>
          <p>
            Your trust is our priority. Learn how we collect, protect, and process your beauty and shopping information.
          </p>
         
        </header>

        {/* Search Panel */}
        <section className="privacy-search-section">
          <div className="privacy-search-wrapper">
            <Search className="privacy-search-icon" size={20} />
            <input
              type="text"
              className="privacy-search-input"
              placeholder="Search privacy details (e.g. cookies, try-on, deletion)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                className="privacy-clear-btn" 
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
              >
                <ChevronDown size={18} style={{ transform: "rotate(45deg)" }} />
              </button>
            )}
          </div>
        </section>

        {/* Main Grid */}
        <div className="privacy-main-layout">
          
          {/* Desktop Navigation Sidebar */}
          <aside className="privacy-sidebar">
            <h3 className="privacy-sidebar-title">Privacy Sections</h3>
            <ul className="privacy-nav-list">
              {privacySections.map((section) => {
                const isMatch = sectionMatchesQuery(section, searchQuery);
                return (
                  <li 
                    key={section.id} 
                    className={`privacy-nav-item ${activeSection === section.id ? "active" : ""} ${!isMatch ? "opacity-25" : ""}`}
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
          <div className="privacy-mobile-nav px-3">
            <button 
              className="privacy-mobile-nav-toggle" 
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
            >
              <span>{currentActiveSectionTitle}</span>
              {isMobileNavOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            {isMobileNavOpen && (
              <ul className="privacy-mobile-nav-dropdown">
                {privacySections.map((section) => {
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

          {/* Privacy Content Pane */}
          <main className="privacy-content-pane">
            {filteredSections.length > 0 ? (
              filteredSections.map((section) => (
                <article
                  key={section.id}
                  id={section.id}
                  ref={(el) => (sectionRefs.current[section.id] = el)}
                  className={`privacy-section-card ${activeSection === section.id ? "highlighted-section" : ""}`}
                >
                  <header className="privacy-section-header">
                    <div className="privacy-section-icon-box">
                      {section.icon}
                    </div>
                    <h2>
                      {highlightText(section.title, searchQuery)}
                    </h2>
                  </header>
                  <div className="privacy-section-body">
                    {section.content.paragraphs.map((p, idx) => (
                      <p key={idx}>
                        {highlightText(p, searchQuery)}
                      </p>
                    ))}
                    
                    {/* Render Grievance Officer details specifically inside the grievance section */}
                    {section.id === "grievance-officer" && (
                      <div className="privacy-grievance-box">
                        <div className="privacy-grievance-title">
                          <UserCheck2 size={22} />
                          <span>Grievance Officer Information</span>
                        </div>
                        <div className="privacy-grievance-grid">
                          <div className="privacy-grievance-label">Designation:</div>
                          <div className="privacy-grievance-value">Grievance Officer</div>
                          
                          <div className="privacy-grievance-label">Office:</div>
                          <div className="privacy-grievance-value">Joyory Privacy & Compliance Office</div>

                          <div className="privacy-grievance-label">Email:</div>
                          <div className="privacy-grievance-value">
                            <a href="mailto:grievance@joyory.com">grievance@joyory.com</a>
                          </div>

                          <div className="privacy-grievance-label">Phone:</div>
                          <div className="privacy-grievance-value">
                            <a href="tel:+919601177701">+91 9601177701</a>
                          </div>

                          <div className="privacy-grievance-label">Hours:</div>
                          <div className="privacy-grievance-value">Mon – Sat (10:00 AM – 6:00 PM IST)</div>

                          <div className="privacy-grievance-label">Address:</div>
                          <div className="privacy-grievance-value">Joyory Luxe Private Limited, Ahmedabad, Gujarat, India.</div>
                        </div>
                        <div className="mt-3 text-muted" style={{ fontSize: "0.85rem", lineHeight: "1.4" }}>
                          *We aim to acknowledge privacy grievances within 48 hours and completely resolve them within the timelines prescribed under Indian IT laws.
                        </div>
                      </div>
                    )}

                    {section.content.note && (
                      <div className="privacy-highlight-note">
                        <Sliders size={20} />
                        <div>
                          <strong>Important Protection: </strong>
                          {highlightText(section.content.note, searchQuery)}
                        </div>
                      </div>
                    )}
                  </div>
                </article>
              ))
            ) : (
              <div className="privacy-no-results">
                <Search className="privacy-no-results-icon" size={48} />
                <h3>No Matches Found</h3>
                <p>
                  We couldn't find any information matching "{searchQuery}". Try other search terms like "cookies", "Grievance", "deletion", or "analytics".
                </p>
                <button 
                  className="privacy-reset-btn" 
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
            className="privacy-back-to-top" 
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

export default Privacy;
