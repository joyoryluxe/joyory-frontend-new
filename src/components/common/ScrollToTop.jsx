import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll instantly to top of page on route change to prevent layout jumping
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
