/**
 * PageLoader.jsx
 * ─────────────────────────────────────────────────────────────
 * Reusable full-screen loading component with Lottie animation.
 * Extracted from Home.jsx inline loader for cross-page reuse.
 * ─────────────────────────────────────────────────────────────
 * Props:
 *   message {string} — loading status text below the animation
 * ─────────────────────────────────────────────────────────────
 */

import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const PageLoader = ({
  message = "Please wait while we prepare the best products for you...",
}) => {
  return (
    <div
      className="fullscreen-loader page-title-main-name"
      style={{
        minHeight: "100vh",
        width: "100%",
      }}
    >
      <div className="text-center">
        <DotLottieReact
          className="loader-responsive"
          src="https://lottie.host/73673e65-df58-41a5-87e7-b837c5d00fe8/dJVGVbJuYJ.lottie"
          loop
          autoplay
        />
        {message && (
          <p className="text-black mb-0 width-loader-content">{message}</p>
        )}
      </div>
    </div>
  );
};

export default PageLoader;
