import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const SESSION_KEY = "joyory_session_id";
const API_BASE = "https://beauty.joyory.com/api/tracking";
const USER_PROFILE_API = "https://beauty.joyory.com/api/user/profile";

// ─── Get session ID from localStorage ────────────────────────────────────────
const getSessionId = () => localStorage.getItem(SESSION_KEY) || "";

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
// usePageTracker
// Tracks page visits automatically on every route change.
// Only fires if hasConsent = true.
// Also records how long the user was on the previous page.
// ═══════════════════════════════════════════════════════════════════════════════
export const usePageTracker = (hasConsent) => {
    const location = useLocation();

    // Track current page data so we can compute duration on next navigation
    const prevPageRef = useRef(null);
    const entryTimeRef = useRef(null);

    useEffect(() => {
        if (!hasConsent) return; // Don't track if consent not given

        const sessionId = getSessionId();
        if (!sessionId) return;

        // ── Check Login Status ───────────────────────────────────────────────
        // NOTE: We do NOT check document.cookie because the auth token is HttpOnly
        // (set by backend) and JavaScript cannot read HttpOnly cookies.
        // Instead, we let fetchAndStoreUserId() determine login state via API call.

        const runTracker = async () => {
            let userId = localStorage.getItem("joyory_user_id");
            if (!userId) {
                userId = await fetchAndStoreUserId();
            }

            // Only track logged-in users
            if (!userId) return;

            const now = Date.now();

            // ── Step 1: Send duration of PREVIOUS page before navigating away ────
            if (prevPageRef.current && entryTimeRef.current) {
                const duration = Math.round((now - entryTimeRef.current) / 1000); // in seconds
                if (duration > 0) {
                    // Fire and forget — don't block navigation
                    fetch(`${API_BASE}/duration`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include", // ✅ Send login cookies
                        body: JSON.stringify({
                            sessionId,
                            page: prevPageRef.current,
                            duration,
                        }),
                    }).catch(() => {}); // Silent fail
                }
            }

            // ── Step 2: Log the current page view ────────────────────────────────
            const currentPage = location.pathname + location.search;
            const pageTitle = document.title || "";
            const referrer = prevPageRef.current || document.referrer || "";

            fetch(`${API_BASE}/pageview`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include", // ✅ Send login cookies
                body: JSON.stringify({
                    sessionId,
                    userId, // ✅ Explicitly pass the resolved userId
                    page: currentPage,
                    pageTitle,
                    referrer,
                }),
            }).catch(() => {}); // Silent fail

            // ── Step 3: Update refs for next navigation ───────────────────────────
            prevPageRef.current = currentPage;
            entryTimeRef.current = now;
        };

        runTracker();

    }, [location.pathname, location.search, hasConsent]);

    // ── On tab close / page unload — send final duration ─────────────────────
    useEffect(() => {
        if (!hasConsent) return;

        const handleUnload = () => {
            const sessionId = getSessionId();
            if (!sessionId || !prevPageRef.current || !entryTimeRef.current) return;

            const duration = Math.round((Date.now() - entryTimeRef.current) / 1000);
            if (duration <= 0) return;

            // Use sendBeacon for reliable unload-time requests
            const payload = JSON.stringify({
                sessionId,
                page: prevPageRef.current,
                duration,
            });

            if (navigator.sendBeacon) {
                const blob = new Blob([payload], { type: "application/json" });
                navigator.sendBeacon(`${API_BASE}/duration`, blob);
            } else {
                // Fallback for older browsers
                fetch(`${API_BASE}/duration`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: payload,
                    keepalive: true,
                }).catch(() => {});
            }
        };

        window.addEventListener("beforeunload", handleUnload);
        return () => window.removeEventListener("beforeunload", handleUnload);
    }, [hasConsent]);
};