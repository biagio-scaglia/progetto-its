import React from "react";
import { BRAND } from "../../config/branding";

export interface TopBarProps {
  title: string;
  subtitle?: string;
  onOpenAssistant?: () => void;
  showAssistantToggle?: boolean;
  userName?: string;
}

export const TopBar: React.FC<TopBarProps> = ({
  title,
  subtitle = BRAND.tagline,
  onOpenAssistant,
  showAssistantToggle = true,
  userName
}) => {
  const getInitials = (nameStr: string) => {
    const parts = nameStr.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    if (parts.length === 1 && parts[0]) {
      return parts[0].slice(0, 2).toUpperCase();
    }
    return "UL";
  };

  const displayName = userName || "Utente locale";
  const initials = getInitials(displayName);

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
            aria-label={`Apri ${BRAND.assistantName}`}
          >
            Chiedi a {BRAND.assistantName}
          </button>
        )}

        <div className="user-profile-badge" aria-label={`Profilo Cittadino: ${displayName}`}>
          <div className="user-avatar-initials" aria-hidden="true">{initials}</div>
          <span className="sr-only">Accesso effettuato come</span>
          <span style={{ color: "var(--color-text-primary)" }}>{displayName}</span>
        </div>
      </div>
    </header>
  );
};
