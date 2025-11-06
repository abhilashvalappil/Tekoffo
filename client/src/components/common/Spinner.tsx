import React from "react";

const Spinner: React.FC = () => {
  return (
    <div style={overlayStyle}>
      <div style={spinnerStyle}></div>
    </div>
  );
};

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  backgroundColor: "rgba(255, 255, 255, 0.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 50,
};

const spinnerStyle: React.CSSProperties = {
  width: "48px",
  height: "48px",
  border: "6px solid #d1d5db", // light gray
  borderTop: "6px solid #2563eb", // blue-600
  borderRadius: "50%",
  animation: "spin 1s linear infinite",
};

// Inject keyframes manually
const styleSheet = document.styleSheets[0];
const keyframes = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}`;
styleSheet.insertRule(keyframes, styleSheet.cssRules.length);

export default Spinner;
