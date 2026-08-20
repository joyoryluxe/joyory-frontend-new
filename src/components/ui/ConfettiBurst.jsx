// src/components/ui/ConfettiBurst.jsx
// Extracted from CartPage.jsx — reusable particle burst animation.
// Triggers when `active` prop changes to true; auto-clears after 4s.
//
// Usage:
//   const [showConfetti, setShowConfetti] = useState(false);
//   <ConfettiBurst active={showConfetti} />

import React, { useState, useEffect } from 'react';

const CONFETTI_COLORS = ['#D4AF37', '#FFD700', '#FFA500', '#FF6347', '#4CAF50', '#2196F3', '#9C27B0'];

/**
 * ConfettiBurst — animated particle explosion overlay.
 *
 * @param {object}  props
 * @param {boolean} props.active  - When true, generates and shows particles
 */
const ConfettiBurst = ({ active }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (active) {
      const newParticles = Array.from({ length: 40 }).map((_, i) => ({
        id: i,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        borderRadius: Math.random() > 0.5 ? '50%' : '2px',
        width: `${Math.random() * 8 + 6}px`,
        height: `${Math.random() * 8 + 6}px`,
        left: `${Math.random() * 80 + 10}%`,
        top: `${Math.random() * 40 + 20}%`,
        delay: `${Math.random() * 0.2}s`,
        duration: `${Math.random() * 1.5 + 2.5}s`,
        shootX: `${(Math.random() - 0.5) * 400}px`,
        shootY: `${-(Math.random() * 300 + 150)}px`,
        rotateDeg: `${(Math.random() - 0.5) * 720}deg`,
      }));
      setParticles(newParticles);

      const timer = setTimeout(() => setParticles([]), 4000);
      return () => clearTimeout(timer);
    } else {
      setParticles([]);
    }
  }, [active]);

  if (particles.length === 0) return null;

  return (
    <div className="confetti-container">
      {particles.map((p) => (
        <span
          key={p.id}
          className="confetti-particle"
          style={{
            backgroundColor: p.color,
            borderRadius: p.borderRadius,
            width: p.width,
            height: p.height,
            left: p.left,
            top: p.top,
            animationDelay: p.delay,
            animationDuration: p.duration,
            '--shoot-x': p.shootX,
            '--shoot-y': p.shootY,
            '--rotate-deg': p.rotateDeg,
          }}
        />
      ))}
    </div>
  );
};

export default ConfettiBurst;
