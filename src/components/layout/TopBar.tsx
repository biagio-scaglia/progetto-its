import React from "react";
import { BellIcon } from "@radix-ui/react-icons";

export interface TopBarProps {
  title: string;
  subtitle?: string;
  onOpenAssistant?: () => void;
  showAssistantToggle?: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  title,
  subtitle = "Repubblica Italiana",
  onOpenAssistant,
  showAssistantToggle = true
}) => {
  return (
    <header className="app-topbar">
      <div className="topbar-left">
        <div className="topbar-title-section">
          <span className="topbar-subtitle" aria-hidden="true">{subtitle}</span>
          <h1 className="topbar-title">{title}</h1>
        </div>
      </div>
      
      <div className="topbar-right">
        {showAssistantToggle && onOpenAssistant && (
          <button 
            className="btn btn-secondary" 
            onClick={onOpenAssistant}
            style={{ padding: "6px 12px", fontSize: "0.85rem" }}
            aria-label="Apri Assistente Digitale"
          >
            Chiedi all'Assistente
          </button>
        )}
        
        <button className="btn-icon" aria-label="Notifiche" style={{ position: "relative" }}>
          <BellIcon />
          <span style={{
            position: "absolute",
            top: "6px",
            right: "6px",
            width: "8px",
            height: "8px",
            backgroundColor: "var(--color-danger)",
            borderRadius: "50%"
          }} />
        </button>

        <div className="user-profile-badge" aria-label="Profilo Cittadino: Biagio Scaglia">
          <div className="user-avatar-initials" aria-hidden="true">BS</div>
          <span className="sr-only">Accesso effettuato come</span>
          <span style={{ color: "var(--color-text-primary)" }}>Biagio Scaglia</span>
        </div>
      </div>
    </header>
  );
};
