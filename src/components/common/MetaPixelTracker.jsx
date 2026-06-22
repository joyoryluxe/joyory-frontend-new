import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function MetaPixelTracker() {
  const location = useLocation();
  const pixelId = import.meta.env.VITE_META_PIXEL_ID;

  // Initialize once
  useEffect(() => {
    if (pixelId && window.fbq) {
      window.fbq('init', pixelId);
    }
  }, [pixelId]);

  // Track page view on route/path transition
  useEffect(() => {
    if (pixelId && window.fbq) {
      // Strip any query parameters (like tokens, referral IDs, or session keys) for privacy on production
      const sanitizedLocation = window.location.origin + window.location.pathname;

      window.fbq('track', 'PageView', {
        page_path: location.pathname,
        page_location: sanitizedLocation
      });

      // Track InitiateCheckout on checkout pages
      if (location.pathname === '/AddressSelection' || location.pathname === '/PaymentPage') {
        window.fbq('track', 'InitiateCheckout');
      }
    }
  }, [location, pixelId]);

  return null;
}
