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
      window.fbq('track', 'PageView');

      // Track InitiateCheckout on checkout pages
      if (location.pathname === '/AddressSelection' || location.pathname === '/PaymentPage') {
        window.fbq('track', 'InitiateCheckout');
      }
    }
  }, [location, pixelId]);

  return null;
}
