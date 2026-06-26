import React from "react";
import { 
  HomeIcon, 
  FileTextIcon, 
  GridIcon, 
  ArchiveIcon, 
  ChatBubbleIcon, 
  ClockIcon, 
  GearIcon,
  PersonIcon
} from "@radix-ui/react-icons";

export interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate
}) => {
  const menuItems = [
    { id: "dashboard", label: "Home", icon: <HomeIcon className="sidebar-nav-item-icon" /> },
    { id: "pratiche", label: "I miei Percorsi", icon: <FileTextIcon className="sidebar-nav-item-icon" /> },
    { id: "servizi", label: "Servizi Pubblici", icon: <GridIcon className="sidebar-nav-item-icon" /> },
    { id: "documenti", label: "I miei Documenti", icon: <ArchiveIcon className="sidebar-nav-item-icon" /> },
    { id: "assistente", label: "Chiedi Guida", icon: <ChatBubbleIcon className="sidebar-nav-item-icon" /> },
    { id: "scadenze", label: "Scadenze", icon: <ClockIcon className="sidebar-nav-item-icon" /> },
    { id: "profilo", label: "Profilo Utente", icon: <PersonIcon className="sidebar-nav-item-icon" /> },
    { id: "impostazioni", label: "Impostazioni", icon: <GearIcon className="sidebar-nav-item-icon" /> },
  ];

  return (
    <aside className="app-sidebar" aria-label="Navigazione principale">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon" aria-hidden="true">IT</div>
          <span style={{ marginLeft: "4px" }}>Servizi Digitali</span>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const isActive = currentPage === item.id || (item.id === "pratiche" && currentPage === "dettaglio-pratica");
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`sidebar-nav-item ${isActive ? "active" : ""}`}
              aria-current={isActive ? "page" : undefined}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer" style={{ padding: "var(--space-md)", borderTop: "1px solid rgba(255, 255, 255, 0.1)", fontSize: "0.85rem", color: "rgba(255, 255, 255, 0.75)" }}>
        <p style={{ fontWeight: 600, marginBottom: "6px", color: "#ffffff" }}>Tasti di scelta rapida:</p>
        <p style={{ lineHeight: "1.3" }}>
          Premi <kbd style={{ background: "rgba(255, 255, 255, 0.2)", padding: "2px 4px", borderRadius: "3px", fontFamily: "monospace" }}>Alt</kbd> + numero (da 1 a 8) per cambiare pagina.
        </p>
        <p style={{ marginTop: "4px", lineHeight: "1.3" }}>
          Premi <kbd style={{ background: "rgba(255, 255, 255, 0.2)", padding: "2px 4px", borderRadius: "3px", fontFamily: "monospace" }}>Esc</kbd> per tornare indietro.
        </p>
      </div>
    </aside>
  );
};
