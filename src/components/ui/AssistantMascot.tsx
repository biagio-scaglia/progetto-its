import React from "react";

interface AssistantMascotProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  ariaLabel?: string;
}

export const AssistantMascot: React.FC<AssistantMascotProps> = ({
  size = "md",
  className = "",
  ariaLabel = "Mascotte Guida SDIT",
}) => {
  // Map sizes to pixel values
  const sizeMap = {
    sm: 32,
    md: 48,
    lg: 120,
  };

  const pixelSize = sizeMap[size];

  return (
    <svg
      width={pixelSize}
      height={pixelSize}
      viewBox="0 0 100 110"
      className={className}
      role="img"
      aria-label={ariaLabel}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer Shield (Blu Istituzionale) */}
      <path
        d="M 15 15 L 85 15 Q 85 60 50 95 Q 15 60 15 15 Z"
        fill="#0055b3"
        stroke="#003d82"
        strokeWidth="2"
      />

      {/* Inner Shield (Light background) */}
      <path
        d="M 22 22 L 78 22 Q 78 57 50 87 Q 22 57 22 22 Z"
        fill="#f4f8fd"
      />

      {/* Eyes (Modern, Minimalist arches or dots - let's use circles with a slight friendly sparkle) */}
      <circle cx="38" cy="42" r="5" fill="#0055b3" />
      <circle cx="62" cy="42" r="5" fill="#0055b3" />
      
      {/* Sparkles in eyes */}
      <circle cx="39.5" cy="40.5" r="1.5" fill="#ffffff" />
      <circle cx="63.5" cy="40.5" r="1.5" fill="#ffffff" />

      {/* Friendly, subtle smile (accennato e sobrio) */}
      <path
        d="M 42 56 Q 50 62 58 56"
        fill="none"
        stroke="#0055b3"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      {/* Tricolore details at the bottom of the inner shield */}
      {/* Green Dot */}
      <circle cx="42" cy="74" r="3" fill="#008F46" />
      {/* White Dot */}
      <circle cx="50" cy="74" r="3" fill="#ffffff" stroke="#c0c0c0" strokeWidth="0.5" />
      {/* Red Dot */}
      <circle cx="58" cy="74" r="3" fill="#C8102E" />
    </svg>
  );
};
