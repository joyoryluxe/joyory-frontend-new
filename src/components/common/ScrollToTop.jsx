import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) return; // Allow hash section scrolling handler to control scroll position

    const performScroll = () => {
      try {
        window.scrollTo(0, 0);
        if (document.documentElement) {
          document.documentElement.scrollTo({ top: 0, left: 0, behavior: "instant" });
          document.documentElement.scrollTop = 0;
        }
        if (document.body) {
          document.body.scrollTo({ top: 0, left: 0, behavior: "instant" });
          document.body.scrollTop = 0;
        }
      } catch (err) {
        console.warn("ScrollToTop failed", err);
      }
    };

    // 1. Scroll immediately on route change
    performScroll();

    // 2. Scroll again after 50ms and 150ms to override browser scroll restoration
    const timer1 = setTimeout(performScroll, 50);
    const timer2 = setTimeout(performScroll, 150);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [location.pathname, location.search]);

  return null;
};

export default ScrollToTop;
