import React from "react";

interface SDITLogoProps {
  variant?: "compact" | "full";
  theme?: "light" | "dark" | "currentColor";
  className?: string;
  size?: number;
}

export const SDITLogo: React.FC<SDITLogoProps> = ({
  variant = "full",
  theme = "dark",
  className = "",
  size = 28,
}) => {
  // Determine colors based on theme
  const getColors = () => {
    switch (theme) {
      case "light":
        return {
          bg: "#0055b3",
          text: "#ffffff",
          textColor: "#0055b3",
          subTextColor: "#2d3748",
        };
      case "dark":
        return {
          bg: "#ffffff",
          text: "#001a4d",
          textColor: "#ffffff",
          subTextColor: "rgba(255, 255, 255, 0.75)",
        };
      case "currentColor":
      default:
        return {
          bg: "currentColor",
          text: "var(--color-surface, #ffffff)",
          textColor: "currentColor",
          subTextColor: "currentColor",
        };
    }
  };

  const colors = getColors();

  // Badge/Icon style (rounded rect with SDIT emblem inside)
  const renderIcon = () => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className="sdit-logo-icon-svg"
      role="img"
      aria-label="Logo SDIT"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0 }}
    >
      {/* Background shape - rounded square with shield curve at bottom */}
      <path
        d="M 10 10 L 90 10 Q 90 60 50 90 Q 10 60 10 10 Z"
        fill={colors.bg}
      />
      {/* Text inside emblem */}
      <text
        x="50"
        y="60"
        fontFamily="'Titillium Web', -apple-system, sans-serif"
        fontWeight="900"
        fontSize="34"
        fill={colors.text}
        textAnchor="middle"
        letterSpacing="-1"
      >
        SD
      </text>
    </svg>
  );

  if (variant === "compact") {
    return <div className={`sdit-logo ${className}`}>{renderIcon()}</div>;
  }

  return (
    <div
      className={`sdit-logo ${className}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "10px",
      }}
    >
      {renderIcon()}
      <div
        className="sdit-logo-text"
        style={{
          display: "flex",
          flexDirection: "column",
          lineHeight: "1.1",
        }}
      >
        <span
          className="sdit-logo-title"
          style={{
            fontWeight: 800,
            fontSize: "1.1rem",
            letterSpacing: "0.5px",
            color: colors.textColor,
          }}
        >
          SDIT
        </span>
        <span
          className="sdit-logo-subtitle"
          style={{
            fontSize: "0.72rem",
            fontWeight: 500,
            color: colors.subTextColor,
            whiteSpace: "nowrap",
          }}
        >
          Servizi Digitali Italiani
        </span>
      </div>
    </div>
  );
};
