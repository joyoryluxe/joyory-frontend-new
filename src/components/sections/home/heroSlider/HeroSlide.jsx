/**
 * HeroSlide.jsx
 * ─────────────────────────────────────────────────────────────
 * Sub-component for rendering an individual Hero Slide (image or video).
 * ─────────────────────────────────────────────────────────────
 */

import React from "react";

const HeroSlide = ({ item, onClick }) => {
  if (!item) return null;

  return (
    <div
      className="slide-wrapper position-relative mt-xl-0 padding-left-rightss"
      onClick={onClick}
      style={{
        cursor: item.buttonLink ? "pointer" : "default",
      }}
    >
      {item.type === "image" ? (
        <img
          src={item.url}
          alt={item.title || "Joyory"}
          className="slide-media hero-slider-image-responsive"
        />
      ) : (
        <video
          className="slide-media slide-video mt-5"
          src={item.url}
          muted
          playsInline
          loop
          preload="auto"
        />
      )}
    </div>
  );
};

export default HeroSlide;
