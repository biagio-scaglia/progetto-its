import React from "react";
import { Badge } from "./Badge";
import { StatoPercorso } from "../../types";
import { 
  CheckCircledIcon, 
  ClockIcon, 
  ExclamationTriangleIcon, 
  FileTextIcon, 
  CrossCircledIcon 
} from "@radix-ui/react-icons";

export interface StatusBadgeProps {
  stato: StatoPercorso | string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ stato, className = "" }) => {
  const getBadgeConfig = () => {
    switch (stato) {
      case "bozza":
        return {
          label: "Bozza",
          variant: "info" as const,
          icon: <FileTextIcon aria-hidden="true" />,
        };
      case "in_corso":
        return {
          label: "In corso",
          variant: "warning" as const,
          icon: <ClockIcon aria-hidden="true" />,
        };
      case "completato":
      case "completata":
        return {
          label: "Completato",
          variant: "success" as const,
          icon: <CheckCircledIcon aria-hidden="true" />,
        };
      case "da_verificare":
        return {
          label: "Da verificare",
          variant: "warning" as const,
          icon: <ExclamationTriangleIcon aria-hidden="true" />,
        };
      case "scaduto":
      case "scaduta":
        return {
          label: "Scaduto",
          variant: "danger" as const,
          icon: <CrossCircledIcon aria-hidden="true" />,
        };
      default:
        return {
          label: stato.charAt(0).toUpperCase() + stato.slice(1),
          variant: "default" as const,
          icon: null,
        };
    }
  };

  const config = getBadgeConfig();

  return (
    <Badge variant={config.variant} className={className}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
        {config.icon}
        <span>{config.label}</span>
      </span>
    </Badge>
  );
};
