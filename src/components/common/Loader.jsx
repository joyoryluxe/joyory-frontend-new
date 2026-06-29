import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const Loader = ({
  fullScreen = false,
  text = "Please wait while we prepare the best products for you...",
  height = 200,
  className = "",
  style = {}
}) => {
  if (fullScreen) {
    return (
      <div
        className={`fullscreen-loader page-title-main-name ${className}`}
        style={{
          minHeight: "100vh",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          ...style
        }}
      >
        <div className="text-center">
          <DotLottieReact
            className="loader-responsive"
            src="https://lottie.host/73673e65-df58-41a5-87e7-b837c5d00fe8/dJVGVbJuYJ.lottie"
            loop
            autoplay
          />
          {text && (
            <p className="text-black mb-0 width-loader-content">
              {text}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Inline / Section loader
  return (
    <div
      className={`text-center py-4 ${className}`}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        ...style
      }}
    >
      <DotLottieReact
        src="https://lottie.host/73673e65-df58-41a5-87e7-b837c5d00fe8/dJVGVbJuYJ.lottie"
        loop
        autoplay
        style={{ height: height, width: "auto" }}
      />
      {text && (
        <p className="text-muted mt-2 mb-0" style={{ fontSize: "14px" }}>
          {text}
        </p>
      )}
    </div>
  );
};

export default Loader;
