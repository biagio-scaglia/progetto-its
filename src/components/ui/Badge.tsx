import React from "react";

export interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "info" | "success" | "warning" | "danger";
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className = "",
  variant = "default",
}) => {
  const getBadgeClass = () => {
    switch (variant) {
      case "info":
        return "badge-bozza";
      case "success":
        return "badge-completata";
      case "warning":
        return "badge-in-corso";
      case "danger":
        return "badge-scaduta";
      case "default":
      default:
        return "badge-default";
    }
  };

  return (
    <span className={`badge ${getBadgeClass()} ${className}`}>
      {children}
    </span>
  );
};
