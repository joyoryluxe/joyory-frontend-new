import { useState, useEffect, useCallback } from "react";

const CONSENT_KEY = "joyory_cookie_consent";
const SESSION_KEY = "joyory_session_id";
const CONSENT_EXPIRY_DAYS = 30;

// ─── Generate a random anonymous session ID ───────────────────────────────────
const generateSessionId = () => {
    return "sess_" + Math.random().toString(36).slice(2, 11) + "_" + Date.now();
};

// ─── Get or create persistent session ID ─────────────────────────────────────
const getOrCreateSessionId = () => {
    let id = localStorage.getItem(SESSION_KEY);
    if (!id) {
        id = generateSessionId();
        localStorage.setItem(SESSION_KEY, id);
    }
    return id;
};

// ─── Check if stored consent is still valid (within 30 days) ─────────────────
const getStoredConsent = () => {
    try {
        const raw = localStorage.getItem(CONSENT_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        const expiryTime = new Date(parsed.date).getTime() + CONSENT_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
        if (Date.now() > expiryTime) {
            localStorage.removeItem(CONSENT_KEY);
            return null;
        }
        return parsed;
    } catch {
        return null;    
    }
};

const API_BASE = "https://beauty.joyory.com/api/tracking";
const USER_PROFILE_API = "https://beauty.joyory.com/api/user/profile";

// Fetch user ID from backend using HttpOnly cookie credentials
const fetchAndStoreUserId = async () => {
    try {
        const res = await fetch(USER_PROFILE_API, {
            credentials: "include", // sends HttpOnly cookie automatically
        });
        if (res.ok) {
            const data = await res.json();
            if (data?.profile?._id) {
                localStorage.setItem("joyory_user_id", data.profile._id);
                return data.profile._id;
            }
        }
    } catch (e) {
        // Silently fail — user is not logged in
    }
    return null;
};

// ═══════════════════════════════════════════════════════════════════════════════
// useCookieConsent — manages cookie consent state and localStorage persistence
// ═══════════════════════════════════════════════════════════════════════════════
export const useCookieConsent = () => {
    const [consentState, setConsentState] = useState(null); // null = not decided, true = accepted, false = rejected
    const [showBanner, setShowBanner] = useState(false);
    const [sessionId, setSessionId] = useState("");

    useEffect(() => {
        const sid = getOrCreateSessionId();
        setSessionId(sid);

        const stored = getStoredConsent();
        if (stored !== null) {
            // User already decided before — no banner
            setConsentState(stored.accepted);
            setShowBanner(false);
        } else {
            // First visit or expired — show banner
            setShowBanner(true);
        }
    }, []);

    // ─── Accept cookies ───────────────────────────────────────────────────────
    const acceptCookies = useCallback(async () => {
        const sid = getOrCreateSessionId();
        const payload = { accepted: true, date: new Date().toISOString() };
        localStorage.setItem(CONSENT_KEY, JSON.stringify(payload));
        setConsentState(true);
        setShowBanner(false);

        // Fetch user ID if logged in (via cookie sent to correct server)
        let userId = localStorage.getItem("joyory_user_id");
        if (!userId) {
            userId = await fetchAndStoreUserId();
        }

        // Save to backend (fire and forget)
        try {
            await fetch(`${API_BASE}/consent`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include", // ✅ Send login cookies
                body: JSON.stringify({ sessionId: sid, consentGiven: true, userId }),
            });
        } catch { /* silent fail */ }
    }, []);

    // ─── Reject cookies ───────────────────────────────────────────────────────
    const rejectCookies = useCallback(async () => {
        const sid = getOrCreateSessionId();
        const payload = { accepted: false, date: new Date().toISOString() };
        localStorage.setItem(CONSENT_KEY, JSON.stringify(payload));
        setConsentState(false);
        setShowBanner(false);

        // Save to backend (fire and forget)
        try {
            await fetch(`${API_BASE}/consent`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include", // ✅ Send login cookies
                body: JSON.stringify({ sessionId: sid, consentGiven: false }),
            });
        } catch { /* silent fail */ }
    }, []);

    return {
        hasConsent: consentState === true,
        consentDecided: consentState !== null,
        showBanner,
        sessionId,
        acceptCookies,
        rejectCookies,
    };
};