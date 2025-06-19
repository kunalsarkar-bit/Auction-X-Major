// src/components/FirstLoadLoader.jsx
import React, { useState, useEffect } from "react";

const FirstLoadLoader = ({ onFinish }) => {
  const [animationStage, setAnimationStage] = useState(0); // 0: initial, 1: pulse, 2: zoom

  useEffect(() => {
    const stage1Timer = setTimeout(() => {
      setAnimationStage(1);
    }, 1500); // Show "Auction X" pulse for 1.5s

    const stage2Timer = setTimeout(() => {
      setAnimationStage(2);
    }, 3000); // Start letter animation at 3s

    const finishTimer = setTimeout(() => {
      onFinish();
    }, 4500); // Total duration 4.5s

    return () => {
      clearTimeout(stage1Timer);
      clearTimeout(stage2Timer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <div className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center bg-white overflow-hidden z-50">
      {/* Initial "Auction X" (always visible but animated differently) */}
      <div className={`flex gap-3 ${animationStage >= 2 ? "hidden" : ""}`}>
        <div
          className={`text-7xl font-bold text-black ${
            animationStage === 0 ? "animate-pulse" : "opacity-0"
          }`}
        >
          Auction X
        </div>
      </div>

      {/* Letter-by-letter animation */}
      {animationStage >= 2 && (
        <div className="flex gap-3">
          {["A", "u", "c", "t", "i", "o", "n", " ", "X"].map(
            (letter, index) => (
              <div
                key={index}
                className="text-7xl font-bold text-black zoom-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {letter}
              </div>
            )
          )}
        </div>
      )}

      {/* Inline CSS */}
      <style>
        {`
          @keyframes pulse {
            0% {
              opacity: 1;
            }
            50% {
              opacity: 0.3;
            }
            100% {
              opacity: 1;
            }
          }

          @keyframes zoomIn {
            0% {
              transform: scale(0);
              opacity: 0;
            }
            100% {
              transform: scale(1.5);
              opacity: 1;
            }
          }

          .animate-pulse {
            animation: pulse 1.5s infinite ease-in-out;
          }

          .zoom-in {
            animation: zoomIn 0.5s ease-out forwards;
            transform-origin: center;
          }
        `}
      </style>
    </div>
  );
};

export default FirstLoadLoader;
