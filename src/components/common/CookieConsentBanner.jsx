import { useEffect, useState, useContext } from "react";
import { useCookieConsent } from "../../hooks/useCookieConsent";
import { usePageTracker } from "../../hooks/usePageTracker";
import { FaShieldAlt } from "react-icons/fa";
import { UserContext } from "../../context/UserContext";

// ─── Premium Luxury Styles (pure CSS-in-JS) ──────────────────────────────────

const styles = {
    overlay: {
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 99999,
        display: "flex",
        pointerEvents: "none",
    },

    banner: {
        pointerEvents: "all",
        background: "#ffffff",
        border: "1px solid #EAEAEA",
        borderRadius: "4px",
        boxShadow: "0 10px 40px rgba(0,0,0,0.06), 0 2px 4px rgba(0,0,0,0.02)",
        padding: "24px",
        maxWidth: "410px",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "18px",
        fontFamily: "'Outfit', 'Inter', 'Segoe UI', sans-serif",
    },

    header: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
    },

    iconWrap: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#0077b6",
        flexShrink: 0,
    },

    title: {
        margin: 0,
        fontSize: "14px",
        fontWeight: 600,
        color: "#111111",
        letterSpacing: "2px",
        textTransform: "uppercase",
    },

    description: {
        margin: 0,
        fontSize: "13px",
        lineHeight: "1.6",
        color: "#000",
        fontWeight: 400,
    },

    privacyLink: {
        color: "#000",
        textDecoration: "none",
        fontWeight: 500,
        borderBottom: "1px solid #000",
        paddingBottom: "1px",
    },

    actions: {
        display: "flex",
        gap: "12px",
        width: "100%",
    },

    btnAccept: {
        flex: 1,
        padding: "13px 20px",
        borderRadius: "2px",
        border: "none",
        cursor: "pointer",
        fontSize: "11px",
        fontWeight: 600,
        letterSpacing: "2px",
        textTransform: "uppercase",
        background: "#111111",
        color: "#ffffff",
        transition: "background-color 0.25s, transform 0.15s, box-shadow 0.25s",
    },

    btnReject: {
        flex: 1,
        padding: "12px 20px",
        borderRadius: "2px",
        border: "1px solid #000",
        cursor: "pointer",
        fontSize: "11px",
        fontWeight: 500,
        letterSpacing: "2px",
        textTransform: "uppercase",
        background: "transparent",
        color: "#000",
        transition: "background-color 0.25s, color 0.25s, transform 0.15s",
    },

    // ── Reconsider screen styles ──────────────────────────────────────────────
    reconBanner: {
        pointerEvents: "all",
        background: "#FAFAF9",
        border: "1px solid #EAEAEA",
        borderRadius: "4px",
        boxShadow: "0 10px 40px rgba(0,0,0,0.06), 0 2px 4px rgba(0,0,0,0.02)",
        padding: "28px 24px",
        maxWidth: "410px",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "18px",
        fontFamily: "'Outfit', 'Inter', 'Segoe UI', sans-serif",
    },

    benefitRow: {
        display: "flex",
        alignItems: "flex-start",
        gap: "12px",
    },

    benefitIcon: {
        flexShrink: 0,
        width: "30px",
        height: "30px",
        borderRadius: "50%",
        background: "#0076b612",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#0077b6",
        fontSize: "14px",
    },

    benefitText: {
        display: "flex",
        flexDirection: "column",
        gap: "2px",
    },

    benefitTitle: {
        margin: 0,
        fontSize: "12px",
        fontWeight: 600,
        color: "#111111",
        letterSpacing: "0.5px",
    },

    benefitSub: {
        margin: 0,
        fontSize: "12px",
        color: "#333",
        fontWeight: 300,
    },

    skipLink: {
        textAlign: "center",
        margin: 0,
        fontSize: "11px",
        color: "#000",
        letterSpacing: "0.5px",
        cursor: "pointer",
        border: "none",
        background: "none",
        padding: 0,
        fontFamily: "'Outfit', 'Inter', 'Segoe UI', sans-serif",
        textDecoration: "underline",
        textDecorationColor: "#000",
        width: "100%",
    },
};

// ─── Keyframe and Hover styles injection ─────────────────────────────────────
const injectKeyframes = () => {
    if (document.getElementById("joyory-cookie-kf")) return;
    const style = document.createElement("style");
    style.id = "joyory-cookie-kf";
    style.textContent = `
        @keyframes cookieSlideUp {
            from { opacity: 0; transform: translateY(30px); }
            to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes cookieSlideDown {
            from { opacity: 1; transform: translateY(0); }
            to   { opacity: 0; transform: translateY(30px); }
        }
        @keyframes cookieFadeIn {
            from { opacity: 0; transform: scale(0.98); }
            to   { opacity: 1; transform: scale(1); }
        }
        .joyory-btn-accept:hover {
            background-color: #2D2D2D !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.12) !important;
            transform: translateY(-1px);
        }
        .joyory-btn-accept:active { transform: translateY(0); }
        .joyory-btn-reject:hover {
            color: #555555 !important;
            border-color: #BBBBBB !important;
            transform: translateY(-1px);
        }
        .joyory-btn-reject:active { transform: translateY(0); }
        .joyory-cookie-privacy-link:hover {
            border-bottom-color: #C5A880 !important;
        }
        .joyory-recon-accept:hover {
            background-color: #2D2D2D !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.12) !important;
            transform: translateY(-1px);
        }
        .joyory-recon-accept:active { transform: translateY(0); }
        .joyory-skip-link:hover {
            color: #777777 !important;
        }
        .joyory-reconsent-btn:hover {
            transform: scale(1.1) !important;
            box-shadow: 0 6px 20px rgba(0,0,0,0.13) !important;
        }
        @media (max-width: 640px) {
            .joyory-cookie-overlay {
                bottom: 0 !important;
                right: 0 !important;
                left: 0 !important;
                padding: 0 !important;
            }
            .joyory-cookie-banner, .joyory-recon-banner {
                max-width: 100% !important;
                border-left: none !important;
                border-right: none !important;
                border-bottom: none !important;
                border-radius: 16px 16px 0 0 !important;
                padding: 28px 20px 24px !important;
            }
        }
    `;
    document.head.appendChild(style);
};

// ═══════════════════════════════════════════════════════════════════════════════
// CookieConsentBanner — Main Component
// SCREENS:
//   "consent"    → initial banner (Accept / Reject)
//   "reconsider" → shown when user clicks Reject, nudges them to accept
//   "closed"     → fully hidden
// ═══════════════════════════════════════════════════════════════════════════════
const CookieConsentBanner = () => {
    const { user } = useContext(UserContext);
    const { showBanner, hasConsent, consentDecided, acceptCookies, rejectCookies } = useCookieConsent();
    const [screen, setScreen] = useState("closed"); // "closed" | "consent" | "reconsider"
    const [isClosing, setIsClosing] = useState(false);
    const [showReconsentTrigger, setShowReconsentTrigger] = useState(false);

    // Page tracker — starts automatically when hasConsent = true
    usePageTracker(hasConsent);

    useEffect(() => {
        injectKeyframes();

        // Developer tool to reset cookie consent state (for testing)
        window.resetCookieConsent = () => {
            localStorage.removeItem("joyory_cookie_consent");
            window.location.reload();
        };

        const handleKeyDown = (e) => {
            // Pressing Shift + Alt + C will clear consent and reload
            if (e.shiftKey && e.altKey && e.code === "KeyC") {
                localStorage.removeItem("joyory_cookie_consent");
                window.location.reload();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    // Show banner on first visit / after 30 days only if user is logged in
    useEffect(() => {
        if (showBanner && user?.authenticated) {
            const t = setTimeout(() => setScreen("consent"), 1200);
            return () => clearTimeout(t);
        }
    }, [showBanner, user?.authenticated]);

    // Show floating trigger if user has previously rejected and is logged in
    useEffect(() => {
        if (consentDecided && !hasConsent && user?.authenticated) {
            const t = setTimeout(() => setShowReconsentTrigger(true), 2000);
            return () => clearTimeout(t);
        } else {
            setShowReconsentTrigger(false);
        }
    }, [consentDecided, hasConsent, user?.authenticated]);

    // Do not display anything if user is not logged in
    if (!user?.authenticated) {
        return null;
    }

    // ── Handlers ──────────────────────────────────────────────────────────────
    const handleAccept = () => {
        setIsClosing(true);
        setTimeout(() => {
            acceptCookies();
            setScreen("closed");
            setShowReconsentTrigger(false);
            setIsClosing(false);
        }, 350);
    };

    // Clicking Reject → flip to "reconsider" screen instead of closing
    const handleRejectClick = () => {
        setScreen("reconsider");
    };

    // Confirm final rejection from reconsider screen
    const handleConfirmReject = () => {
        setIsClosing(true);
        setTimeout(() => {
            rejectCookies();
            setScreen("closed");
            setIsClosing(false);
            setTimeout(() => setShowReconsentTrigger(true), 800);
        }, 350);
    };

    // Reopen the banner from the floating trigger
    const handleReopenBanner = () => {
        setShowReconsentTrigger(false);
        setIsClosing(false);
        setScreen("consent");
    };

    const overlayStyle = {
        ...styles.overlay,
        animation: isClosing
            ? "cookieSlideDown 0.35s cubic-bezier(0.4, 0, 1, 1) forwards"
            : "cookieSlideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
    };

    return (
        <>
            {/* ── Screen 1: Main Consent Banner ────────────────────────────── */}
            {screen === "consent" && (
                <div
                    style={overlayStyle}
                    className="joyory-cookie-overlay"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Cookie consent"
                >
                    <div style={styles.banner} className="joyory-cookie-banner">
                        {/* Header */}
                        <div style={styles.header}>
                            <div style={styles.iconWrap}>
                                <FaShieldAlt size={20} />
                            </div>
                            <h3 style={styles.title}>Cookie Settings</h3>
                        </div>

                        {/* Description */}
                        <p style={styles.description}>
                            We use cookies to enhance your shopping experience, personalize product recommendations,
                            and understand how you interact with Joyory Luxe.{" "}
                            <a href="/privacy-policy" style={styles.privacyLink} className="joyory-cookie-privacy-link" aria-label="Privacy Policy">
                                Privacy Policy
                            </a>
                        </p>

                        {/* Actions */}
                        <div style={styles.actions}>
                            <button
                                id="joyory-cookie-reject-btn"
                                onClick={handleRejectClick}
                                style={styles.btnReject}
                                className="joyory-btn-reject"
                                aria-label="Reject cookies"
                            >
                                Reject
                            </button>
                            <button
                                id="joyory-cookie-accept-btn"
                                onClick={handleAccept}
                                style={styles.btnAccept}
                                className="joyory-btn-accept"
                                aria-label="Accept all cookies"
                            >
                                Accept All
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Screen 2: Reconsider / Nudge Screen ──────────────────────── */}
            {screen === "reconsider" && (
                <div
                    style={{ ...styles.overlay, animation: "cookieFadeIn 0.3s ease forwards" }}
                    className="joyory-cookie-overlay"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Cookie preferences"
                >
                    <div style={styles.reconBanner} className="joyory-recon-banner">
                        {/* Header */}
                        <div style={styles.header}>
                            <div style={styles.iconWrap}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="M12 8v4M12 16h.01" />
                                </svg>
                            </div>
                            <h3 style={{ ...styles.title, fontSize: "12px" }}>Before You Decide</h3>
                        </div>

                        {/* Persuasion text */}
                        <p style={{ ...styles.description, fontSize: "13px" }}>
                            Cookies help us give you a <strong style={{ color: "#111111", fontWeight: 500 }}>personalized luxury experience</strong> — from product picks to smooth checkout. Here's what you'd be missing:
                        </p>

                        {/* Benefits list */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                            <div style={styles.benefitRow}>
                                <div style={styles.benefitIcon}>✦</div>
                                <div style={styles.benefitText}>
                                    <p style={styles.benefitTitle}>Personalized Picks</p>
                                    <p style={styles.benefitSub}>Products curated just for your skin type & preferences</p>
                                </div>
                            </div>
                            <div style={styles.benefitRow}>
                                <div style={styles.benefitIcon}>◈</div>
                                <div style={styles.benefitText}>
                                    <p style={styles.benefitTitle}>Seamless Cart & Wishlist</p>
                                    <p style={styles.benefitSub}>Your selections saved across sessions, never lost</p>
                                </div>
                            </div>
                            <div style={styles.benefitRow}>
                                <div style={styles.benefitIcon}>◇</div>
                                <div style={styles.benefitText}>
                                    <p style={styles.benefitTitle}>Exclusive Offers</p>
                                    <p style={styles.benefitSub}>Early access to sales & personalized discount codes</p>
                                </div>
                            </div>
                        </div>

                        {/* Primary CTA */}
                        <button
                            id="joyory-recon-accept-btn"
                            onClick={handleAccept}
                            style={{
                                ...styles.btnAccept,
                                flex: "unset",
                                width: "100%",
                                padding: "15px 20px",
                                fontSize: "11px",
                            }}
                            className="joyory-recon-accept"
                            aria-label="Accept all cookies"
                        >
                            Accept & Unlock Full Experience
                        </button>

                        {/* Skip link */}
                        <button
                            id="joyory-cookie-skip-btn"
                            onClick={handleConfirmReject}
                            style={styles.skipLink}
                            className="joyory-skip-link"
                            aria-label="Continue without cookies"
                        >
                            Continue without personalization
                        </button>
                    </div>
                </div>
            )}

            {/* ── Floating Re-consent Trigger (after reject) ───────────────── */}
            {showReconsentTrigger && (
                <button
                    id="joyory-cookie-reconsent-btn"
                    onClick={handleReopenBanner}
                    aria-label="Open cookie preferences"
                    title="Manage cookie preferences"
                    style={{
                        position: "fixed",
                        bottom: "80px",
                        left: "10px",
                        zIndex: 99998,
                        width: "40px",
                        height: "40px",
                        minHeight: "40px",
                        borderRadius: "50%",
                        border: "1px solid #EAEAEA",
                        background: "#ffffff",
                        boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 0,
                        transition: "transform 0.2s, box-shadow 0.2s",
                        animation: "cookieSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards",
                        color: "#0077b6",
                    }}
                    className="joyory-reconsent-btn"
                >
                    <FaShieldAlt size={18} />
                </button>
            )}
        </>
    );
};

export default CookieConsentBanner;