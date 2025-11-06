 import React, { CSSProperties } from "react";
import { FadeLoader } from "react-spinners";

const overrider: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "transparent",
};

const Loader: React.FC = () => {
  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-white">
      <FadeLoader
        // color="#ee8800"
        color="#0A142F"
        loading={true}
        cssOverride={overrider}
        speedMultiplier={1.5}
        aria-label="Loading Spinner"
        data-testid="Loader"
      />
    </div>
  );
};

export default Loader;
