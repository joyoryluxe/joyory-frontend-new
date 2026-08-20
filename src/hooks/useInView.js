// src/hooks/useInView.js
// Extracted from AboutUs.jsx — reusable IntersectionObserver hook for scroll animations.
//
// Usage:
//   const [ref, isVisible] = useInView(0.1);
//   <div ref={ref} className={isVisible ? 'visible' : ''}>...</div>

import { useRef, useState, useEffect } from 'react';

/**
 * useInView — fires once when element enters the viewport.
 *
 * @param {number} [threshold=0.1] - How much of the element must be visible (0–1)
 * @returns {[React.RefObject, boolean]} [ref, isVisible]
 */
const useInView = (threshold = 0.1) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold }
    );

    if (ref.current) obs.observe(ref.current);

    return () => obs.disconnect();
  }, [threshold]);

  return [ref, visible];
};

export { useInView };
export default useInView;
