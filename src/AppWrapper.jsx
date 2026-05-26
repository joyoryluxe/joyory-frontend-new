import React, { useEffect, useState } from "react";

function AppWrapper({ children }) {
  const [showMessage, setShowMessage] = useState(false);
  const [devToolsOpened, setDevToolsOpened] = useState(false);

  useEffect(() => {
    // Disable right-click
    const handleRightClick = (e) => {
      const allowedTags = ["INPUT", "TEXTAREA", "SELECT"];
      if (allowedTags.includes(e.target.tagName) || e.target.classList.contains("allow-right-click")) return;
      e.preventDefault();
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 1500);
    };

    // Disable DevTools shortcuts
    const handleKeyDown = (e) => {
      if (e.key === "F12") e.preventDefault();
      if (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key.toUpperCase())) e.preventDefault();
      if (e.ctrlKey && e.key.toUpperCase() === "U") e.preventDefault();
    };

    // Detect DevTools open using window dimensions
    const detectDevTools = () => {
      const threshold = 160; // pixels
      const widthDiff = window.outerWidth - window.innerWidth > threshold;
      const heightDiff = window.outerHeight - window.innerHeight > threshold;
      if (widthDiff || heightDiff) {
        setDevToolsOpened(true);
      } else {
        setDevToolsOpened(false);
      }
    };

    document.addEventListener("contextmenu", handleRightClick);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", detectDevTools);

    // Initial check
    detectDevTools();

    return () => {
      document.removeEventListener("contextmenu", handleRightClick);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", detectDevTools);
    };
  }, []);

  // If DevTools is detected, hide content
  if (devToolsOpened) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#000",
          color: "#fff",
          fontSize: "20px",
          textAlign: "center",
          padding: "20px",
        }}
      >
        Access Denied: DevTools detected
      </div>
    );
  }

  return (
    <>
      {showMessage && (
        <div
          style={{
            position: "fixed",
            top: "10px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(0,0,0,0.7)",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: "5px",
            zIndex: 9999,
          }}
        >
          Right-click and DevTools shortcuts are disabled
        </div>
      )}
      {children}
    </>
  );
}

export default AppWrapper;
