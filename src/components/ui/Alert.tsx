import React from "react";
import { 
  InfoCircledIcon, 
  CheckCircledIcon, 
  ExclamationTriangleIcon, 
  CrossCircledIcon 
} from "@radix-ui/react-icons";

export interface AlertProps {
  variant?: "info" | "success" | "warning" | "error";
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  variant = "info",
  title,
  children,
  className = "",
}) => {
  const getAlertClass = () => {
    switch (variant) {
      case "success":
        return "alert-success";
      case "warning":
        return "alert-warning";
      case "error":
        return "alert-error";
      case "info":
      default:
        return "alert-info";
    }
  };

  const getIcon = () => {
    switch (variant) {
      case "success":
        return <CheckCircledIcon className="alert-icon" aria-hidden="true" />;
      case "warning":
        return <ExclamationTriangleIcon className="alert-icon" aria-hidden="true" />;
      case "error":
        return <CrossCircledIcon className="alert-icon" aria-hidden="true" />;
      case "info":
      default:
        return <InfoCircledIcon className="alert-icon" aria-hidden="true" />;
    }
  };

  return (
    <div className={`alert ${getAlertClass()} ${className}`} role="alert">
      {getIcon()}
      <div className="alert-content">
        <h4 className="alert-title">{title}</h4>
        <div className="alert-description">{children}</div>
      </div>
    </div>
  );
};
