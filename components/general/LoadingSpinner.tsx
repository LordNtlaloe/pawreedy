import React from "react";
import { BeatLoader } from "react-spinners";

const LoadingSpinner = () => {
  return (
    <div className="flex items-center w-full h-[200px] justify-center flex-col">
      <BeatLoader color="#1946fa" />
    </div>
  );
};

export default LoadingSpinner;