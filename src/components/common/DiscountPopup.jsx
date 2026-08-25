import React, { useState, useEffect, useRef } from 'react';

const DiscountPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const [arrowDirection, setArrowDirection] = useState('down');
  const [arrowLeft, setArrowLeft] = useState(0);
  const popupRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    const handleShow = (e) => {
      if (e.detail && e.detail.message && e.detail.targetEl) {
        setMessage(e.detail.message);
        triggerRef.current = e.detail.targetEl;
        setIsOpen(true);
      }
    };

    window.addEventListener('show-discount-popup', handleShow);
    return () => {
      window.removeEventListener('show-discount-popup', handleShow);
    };
  }, []);

  useEffect(() => {
    if (isOpen && triggerRef.current && popupRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const popupEl = popupRef.current;

      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const scrollX = window.scrollX || document.documentElement.scrollLeft;

      const bubbleWidth = Math.min(280, window.innerWidth - 40);
      popupEl.style.width = bubbleWidth + 'px';

      // Horizontal positioning
      let left = rect.left + rect.width / 2 - bubbleWidth / 2 + scrollX;
      if (left < 10) left = 10;
      if (left + bubbleWidth > window.innerWidth - 10) {
        left = window.innerWidth - bubbleWidth - 10;
      }

      // Vertical positioning
      let direction = 'down';
      let top = rect.top - popupEl.offsetHeight - 8 + scrollY;
      
      // If there's no room above, position below instead
      if (rect.top - popupEl.offsetHeight - 12 < 0) {
        top = rect.bottom + 8 + scrollY;
        direction = 'up';
      }

      // Arrow horizontal center alignment
      const targetCenterOnPage = rect.left + rect.width / 2 + scrollX;
      const computedArrowLeft = targetCenterOnPage - left - 7; // 7 is half of outer arrow width (14px total)

      setCoords({ top, left });
      setArrowDirection(direction);
      setArrowLeft(computedArrowLeft);
    }
  }, [isOpen, message]);

  // Click outside to dismiss
  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (e) => {
      if (
        popupRef.current && 
        !popupRef.current.contains(e.target) && 
        triggerRef.current && 
        !triggerRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };

    const timer = setTimeout(() => {
      document.addEventListener('click', handleOutsideClick);
    }, 50);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [isOpen]);

  // Dismiss on any scroll event (window or nested scrollable containers)
  useEffect(() => {
    if (!isOpen) return;

    const handleScroll = () => {
      setIsOpen(false);
    };

    window.addEventListener('scroll', handleScroll, true);
    return () => {
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={popupRef}
      className="discount-popup-bubble discount-bubble-active"
      style={{
        position: 'absolute',
        top: `${coords.top}px`,
        left: `${coords.left}px`,
        zIndex: 999
      }}
      onClick={() => setIsOpen(false)}
    >
      {/* <div
        className={`discount-bubble-arrow arrow-${arrowDirection}`}
        style={{ left: `${arrowLeft}px` }}
      /> */}
      <div className="discount-bubble-content">
        <span className="discount-bubble-emoji">🎉</span>
        <span className="discount-bubble-text">{message}</span>
      </div>
    </div>
  );
};

export default DiscountPopup;
