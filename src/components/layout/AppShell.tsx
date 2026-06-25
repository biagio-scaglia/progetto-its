import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

export interface AppShellProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  pageTitle: string;
  pageSubtitle?: string;
  children: React.ReactNode;
  lateralPanel?: React.ReactNode;
  userName?: string;
}

export const AppShell: React.FC<AppShellProps> = ({
  currentPage,
  onNavigate,
  pageTitle,
  pageSubtitle,
  children,
  lateralPanel,
  userName
}) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="app-shell">
      <Sidebar
        currentPage={currentPage}
        onNavigate={onNavigate}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={toggleSidebar}
      />
      
      <div className="app-main">
        <TopBar
          title={pageTitle}
          subtitle={pageSubtitle}
          onOpenAssistant={currentPage !== "assistente" ? () => onNavigate("assistente") : undefined}
          showAssistantToggle={currentPage !== "assistente"}
          userName={userName}
        />
        
        <div className="app-content-wrapper">
          <main className="app-content" id="main-content" tabIndex={-1}>
            {children}
          </main>
          
          {lateralPanel && (
            <div className="lateral-panel" aria-label="Pannello di dettaglio secondario">
              {lateralPanel}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
