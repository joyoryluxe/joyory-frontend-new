import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView, trackDuration, getDurationBeaconUrl } from "../api/trackingApi";
import { getProfile } from "../api/userApi";

const SESSION_KEY = "joyory_session_id";

// ─── Get session ID from localStorage ────────────────────────────────────────
const getSessionId = () => localStorage.getItem(SESSION_KEY) || "";

// Fetch user ID from backend using HttpOnly cookie credentials
const fetchAndStoreUserId = async () => {
    try {
        const res = await getProfile();
        if (res.data?.profile?._id) {
            localStorage.setItem("joyory_user_id", res.data.profile._id);
            return res.data.profile._id;
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
                    trackDuration({
                        sessionId,
                        page: prevPageRef.current,
                        duration,
                    }).catch(() => {}); // Silent fail
                }
            }

            // ── Step 2: Log the current page view ────────────────────────────────
            const currentPage = location.pathname + location.search;
            const pageTitle = document.title || "";
            const referrer = prevPageRef.current || document.referrer || "";

            trackPageView({
                sessionId,
                userId, // ✅ Explicitly pass the resolved userId
                page: currentPage,
                pageTitle,
                referrer,
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

            const durationUrl = getDurationBeaconUrl();

            if (navigator.sendBeacon) {
                const blob = new Blob([payload], { type: "application/json" });
                navigator.sendBeacon(durationUrl, blob);
            } else {
                // Fallback for older browsers
                trackDuration({
                    sessionId,
                    page: prevPageRef.current,
                    duration,
                }).catch(() => {});
            }
        };

        window.addEventListener("beforeunload", handleUnload);
        return () => window.removeEventListener("beforeunload", handleUnload);
    }, [hasConsent]);
};