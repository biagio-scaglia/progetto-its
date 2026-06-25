import React from "react";
import { 
  HomeIcon, 
  FileTextIcon, 
  GridIcon, 
  ArchiveIcon, 
  ChatBubbleIcon, 
  ClockIcon, 
  GearIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
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
  onNavigate,
  isCollapsed,
  onToggleCollapse
}) => {
  const menuItems = [
    { id: "dashboard", label: "Home", icon: <HomeIcon className="sidebar-nav-item-icon" /> },
    { id: "pratiche", label: "I miei Percorsi", icon: <FileTextIcon className="sidebar-nav-item-icon" /> },
    { id: "servizi", label: "Servizi Pubblici", icon: <GridIcon className="sidebar-nav-item-icon" /> },
    { id: "documenti", label: "I miei Documenti", icon: <ArchiveIcon className="sidebar-nav-item-icon" /> },
    { id: "assistente", label: "Chiedi Guida", icon: <ChatBubbleIcon className="sidebar-nav-item-icon" /> },
    { id: "scadenze", label: "Scadenze", icon: <ClockIcon className="sidebar-nav-item-icon" /> },
    { id: "profilo", label: "Profilo Digitale", icon: <PersonIcon className="sidebar-nav-item-icon" /> },
    { id: "impostazioni", label: "Impostazioni", icon: <GearIcon className="sidebar-nav-item-icon" /> },
  ];

  return (
    <aside className={`app-sidebar ${isCollapsed ? "collapsed" : ""}`} aria-label="Navigazione principale">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon" aria-hidden="true">IT</div>
          {!isCollapsed && <span style={{ marginLeft: "4px" }}>Servizi Digitali</span>}
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
              title={isCollapsed ? item.label : undefined}
              aria-current={isActive ? "page" : undefined}
            >
              {item.icon}
              {!isCollapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <button
          onClick={onToggleCollapse}
          className="sidebar-toggle-btn"
          aria-label={isCollapsed ? "Espandi barra laterale" : "Riduci barra laterale"}
          title={isCollapsed ? "Espandi navigazione" : "Comprimi navigazione"}
        >
          {isCollapsed ? <DoubleArrowRightIcon /> : <DoubleArrowLeftIcon />}
        </button>
      </div>
    </aside>
  );
};
