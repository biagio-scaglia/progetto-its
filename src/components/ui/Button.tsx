import React from "react";
import { ArrowLeftIcon } from "@radix-ui/react-icons";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "tertiary" | "danger" | "back";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  isLoading = false,
  leftIcon,
  rightIcon,
  className = "",
  disabled,
  ...props
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case "secondary":
        return "btn-secondary";
      case "tertiary":
        return "btn-tertiary";
      case "danger":
        return "btn-danger";
      case "back":
        return "btn-back";
      case "primary":
      default:
        return "btn-primary";
    }
  };

  return (
    <button
      className={`btn ${getVariantClass()} ${className}`}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading && (
        <span className="spinner" aria-hidden="true" style={{
          width: "14px",
          height: "14px",
          border: "2px solid currentColor",
          borderTopColor: "transparent",
          borderRadius: "50%",
          display: "inline-block",
          animation: "spin 0.8s linear infinite",
          marginRight: "4px"
        }} />
      )}
      {!isLoading && variant === "back" && <ArrowLeftIcon aria-hidden="true" />}
      {!isLoading && leftIcon && <span style={{ display: "inline-flex", marginRight: "4px" }}>{leftIcon}</span>}
      {children}
      {!isLoading && rightIcon && <span style={{ display: "inline-flex", marginLeft: "4px" }}>{rightIcon}</span>}
    </button>
  );
};
