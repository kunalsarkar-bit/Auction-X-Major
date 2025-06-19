import React, { useState } from "react";

const ProgressBar = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const stepLabels = [
    "Order Confirmed",
    "Shipped",
    "Out for delivery",
    "Delivered",
  ];

  const handleStepChange = (direction) => {
    if (direction === "next" && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else if (direction === "prev" && currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progressWidth = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="w-full max-w-[95vw] bg-white shadow-md rounded-lg p-4 sm:p-6 flex flex-col items-center mb-10">
      <div className="w-full flex justify-between relative">
        {[...Array(totalSteps)].map((_, index) => (
          <div
            key={index}
            className="flex flex-col items-center w-1/4 relative"
          >
            <span
              className={`w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 flex items-center justify-center border-2 rounded-full text-lg sm:text-xl font-semibold transition-all duration-200 z-10 bg-white ${
                currentStep > index
                  ? "border-purple-500 text-purple-500"
                  : "border-gray-300 text-gray-500"
              }`}
            >
              {index + 1}
            </span>
            <span className="mt-2 sm:mt-4 text-xs sm:text-sm md:text-base text-gray-700 text-center w-full">
              {stepLabels[index]}
            </span>
          </div>
        ))}
        <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-full h-2 sm:h-3 bg-gray-300 z-0">
          <div
            className="h-full bg-purple-500 transition-all duration-300"
            style={{ width: `${progressWidth}%` }}
          ></div>
        </div>
      </div>
      {/* Uncomment the buttons if needed */}
      {/* <div className="mt-6 flex items-center justify-center gap-4 sm:gap-12">
        <button
          className={`px-6 py-2 sm:px-10 sm:py-4 text-sm sm:text-xl rounded-md font-semibold text-white transition-all duration-200 ${
            currentStep === 1
              ? "bg-purple-300 cursor-not-allowed"
              : "bg-purple-500 hover:bg-purple-700"
          }`}
          onClick={() => handleStepChange("prev")}
          disabled={currentStep === 1}
        >
          Prev
        </button>
        <button
          className={`px-6 py-2 sm:px-10 sm:py-4 text-sm sm:text-xl rounded-md font-semibold text-white transition-all duration-200 ${
            currentStep === totalSteps
              ? "bg-purple-300 cursor-not-allowed"
              : "bg-purple-500 hover:bg-purple-700"
          }`}
          onClick={() => handleStepChange("next")}
          disabled={currentStep === totalSteps}
        >
          Next
        </button>
      </div> */}
    </div>
  );
};

export default ProgressBar;
