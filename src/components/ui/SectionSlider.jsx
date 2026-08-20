// src/components/ui/SectionSlider.jsx
// Shared product section slider (Swiper-based) — extracted from inline definitions in
// CategoryLandingPage.jsx and OfferLanding.jsx.
// The two versions had slightly different breakpoints and nav button styles;
// this unified version supports both via the `showNavButtons` and `defaultBreakpoints` props.
//
// Usage:
//   <SectionSlider slidesPerView={4} showNavButtons>
//     {items.map(item => <SwiperSlide key={item._id}>...</SwiperSlide>)}
//   </SectionSlider>

import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

/**
 * SectionSlider — a responsive Swiper wrapper used for product / content carousels.
 *
 * @param {object}  props
 * @param {React.ReactNode} props.children        - SwiperSlide children
 * @param {number}  [props.slidesPerView=4]        - Slides visible at desktop
 * @param {number}  [props.spaceBetween=20]        - Gap between slides (px)
 * @param {object}  [props.breakpoints={}]         - Override/extend default responsive breakpoints
 * @param {boolean} [props.showNavButtons=false]   - Show prev/next arrow buttons (OfferLanding style)
 * @param {string}  [props.className='']           - Additional CSS class on the wrapper div
 * @param {string}  [props.swiperClassName='']     - Additional CSS class on the Swiper element
 */
const SectionSlider = ({
  children,
  slidesPerView = 4,
  spaceBetween = 20,
  breakpoints = {},
  showNavButtons = false,
  className = '',
  swiperClassName = '',
}) => {
  const swiperRef = useRef(null);

  // Default responsive breakpoints — mirrors CategoryLandingPage (more comprehensive)
  const defaultBreakpoints = {
    320: { slidesPerView: 2, spaceBetween: 10 },
    576: { slidesPerView: 3, spaceBetween: 15 },
    768: { slidesPerView: Math.min(slidesPerView, 3), spaceBetween: 20 },
    1200: { slidesPerView: Math.min(slidesPerView, 4), spaceBetween: 20 },
    1600: { slidesPerView: Math.min(slidesPerView + 1, 5), spaceBetween: 24 },
    1920: { slidesPerView: Math.min(slidesPerView + 2, 6), spaceBetween: 24 },
    2560: { slidesPerView: Math.min(slidesPerView + 4, 8), spaceBetween: 30 },
    3840: { slidesPerView: Math.min(slidesPerView + 6, 10), spaceBetween: 30 },
  };

  const baseBreakpoints = { ...defaultBreakpoints, ...breakpoints };
  const finalBreakpoints = {};

  Object.keys(baseBreakpoints).forEach((key) => {
    const width = parseInt(key, 10);
    const bp = baseBreakpoints[key];
    if (width >= 992) {
      finalBreakpoints[key] = { ...bp, slidesPerView: slidesPerView };
    } else {
      finalBreakpoints[key] = { ...bp, slidesPerView: Math.min(bp.slidesPerView, slidesPerView) };
    }
  });

  const navButtonStyle = {
    width: '40px',
    height: '40px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    border: '1px solid #dee2e6',
  };

  return (
    <div className={`position-relative margintop-sss${showNavButtons ? ' py-2' : ''} ${className}`.trim()}>
      {showNavButtons && (
        <button
          onClick={() => swiperRef.current?.swiper?.slidePrev()}
          className="btn btn-light rounded-circle position-absolute start-0 top-50 translate-middle-y z-3 d-none d-md-flex align-items-center justify-content-center p-0"
          style={navButtonStyle}
          aria-label="Previous slide"
        >
          <FaChevronLeft size={16} />
        </button>
      )}

      {showNavButtons && (
        <button
          onClick={() => swiperRef.current?.swiper?.slideNext()}
          className="btn btn-light rounded-circle position-absolute end-0 top-50 translate-middle-y z-3 d-none d-md-flex align-items-center justify-content-center p-0"
          style={navButtonStyle}
          aria-label="Next slide"
        >
          <FaChevronRight size={16} />
        </button>
      )}

      <Swiper
        ref={swiperRef}
        slidesPerView={1}
        spaceBetween={spaceBetween}
        breakpoints={finalBreakpoints}
        navigation={false}
        className={`section-slider${showNavButtons ? ' px-1' : ''} ${swiperClassName}`.trim()}
      >
        {children}
      </Swiper>
    </div>
  );
};

export default SectionSlider;
