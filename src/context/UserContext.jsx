//=============================================================Finall-Code(One)End===================================================
import React, { createContext, useState, useEffect, useCallback } from "react";
import axiosInstance from "../utils/axiosInstance.js";
import { toast } from "react-toastify";

export const UserContext = createContext();

// ─── 7-Day Auto Logout Constants ───────────────────────────────────────────
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds (604,800,000 ms)
const SESSION_EXPIRY_KEY = "joyory_session_expiry";
const USER_DATA_KEY = "joyory_user_data";

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logoutUser = useCallback(async (options = {}) => {
    try {
      await axiosInstance.post("/api/user/logout");
    } catch {}

    // Clear local storage session & profile keys
    try {
      localStorage.removeItem(SESSION_EXPIRY_KEY);
      localStorage.removeItem(USER_DATA_KEY);
      localStorage.removeItem("joyory_user_id");
    } catch {}

    // Clear client-accessible cookies
    try {
      document.cookie.split(";").forEach(
        (c) =>
          (document.cookie = c.replace(/^ +/, "").replace(
            /=.*/,
            "=;expires=" + new Date(0).toUTCString() + ";path=/"
          ))
      );
    } catch {}

    setUser({ guest: true });

    if (options?.sessionExpired) {
      toast.info("Your session has expired after 7 days. Please log in again.", {
        toastId: "joyory-session-expired",
      });
    }
  }, []);

  const loginUser = useCallback((data) => {
    if (!data || data.guest) {
      logoutUser();
      return;
    }

    const expiresAt = Date.now() + SEVEN_DAYS_MS;
    try {
      localStorage.setItem(SESSION_EXPIRY_KEY, expiresAt.toString());
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(data));
    } catch {}

    // Set client-accessible fallback cookie for 7 days
    try {
      const expiryDate = new Date(expiresAt);
      document.cookie = `token=1; path=/; expires=${expiryDate.toUTCString()}; SameSite=Lax`;
    } catch {}

    setUser({ ...data, authenticated: true });
  }, [logoutUser]);

  const checkAuth = useCallback(() => {
    try {
      const expiryStr = localStorage.getItem(SESSION_EXPIRY_KEY);
      const storedUser = localStorage.getItem(USER_DATA_KEY);

      // 1. Proactive 7-day expiration check
      if (expiryStr) {
        const expiryTime = Number(expiryStr);
        if (!isNaN(expiryTime) && Date.now() >= expiryTime) {
          console.warn("⏳ User session has exceeded 7 days. Auto-logging out...");
          logoutUser({ sessionExpired: true });
          setLoading(false);
          return;
        }
      }

      // 2. Cookie check
      const cookies = document.cookie.split("; ");
      const hasTokenCookie = cookies.some((c) => c.startsWith("token="));
      const hasSessionCookie = cookies.some((c) => c.startsWith("session="));

      if (hasTokenCookie || hasSessionCookie || expiryStr) {
        // Backfill expiry key if existing cookie session had none
        if (!expiryStr && (hasTokenCookie || hasSessionCookie)) {
          localStorage.setItem(SESSION_EXPIRY_KEY, (Date.now() + SEVEN_DAYS_MS).toString());
        }

        let parsedUser = { authenticated: true };
        if (storedUser) {
          try {
            parsedUser = { ...JSON.parse(storedUser), authenticated: true };
          } catch {}
        }
        setUser(parsedUser);
      } else {
        setUser({ guest: true });
      }
    } catch {
      setUser({ guest: true });
    } finally {
      setLoading(false);
    }
  }, [logoutUser]);

  useEffect(() => {
    // Initial verification
    checkAuth();

    // Re-verify when window gains focus or tab becomes visible (e.g. user resumes device after sleep)
    const handleVisibilityOrFocus = () => {
      checkAuth();
    };

    window.addEventListener("focus", handleVisibilityOrFocus);
    document.addEventListener("visibilitychange", handleVisibilityOrFocus);

    // Active real-time interval timer (checks every 60 seconds if 7 days have passed)
    const intervalId = setInterval(() => {
      checkAuth();
    }, 60 * 1000);

    // Global listener for 401 session expiration from API interceptor
    const handleExpiredEvent = (e) => {
      console.warn("🔔 Received auth expired event, triggering auto-logout...");
      logoutUser({ sessionExpired: true });
    };
    window.addEventListener("joyory:session-expired", handleExpiredEvent);

    return () => {
      window.removeEventListener("focus", handleVisibilityOrFocus);
      document.removeEventListener("visibilitychange", handleVisibilityOrFocus);
      clearInterval(intervalId);
      window.removeEventListener("joyory:session-expired", handleExpiredEvent);
    };
  }, [checkAuth, logoutUser]);

  return (
    <UserContext.Provider value={{ user, loginUser, logoutUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};
