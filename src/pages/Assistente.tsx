import React, { useState, useRef, useEffect } from "react";
import { Messaggio } from "../types";
import { Button } from "../components/ui/Button";
import { PaperPlaneIcon, TrashIcon } from "@radix-ui/react-icons";
import { TTSButton } from "../components/ui/TTSButton";
import { BRAND } from "../config/branding";
import { AssistantMascot } from "../components/ui/AssistantMascot";
import { SettingsService, AISettings } from "../services/settingsService";
import { COPY_ASSISTANT, COPY_DEBUG } from "../config/microcopy";

import { getFriendlyRoutingReason } from "../utils/routingReason";

export interface AssistenteProps {
  messaggi: Messaggio[];
  onSendMessage: (testo: string) => void;
  onNavigate: (page: string) => void;
  onSelectPercorso: (id: string) => void;
  onClearChat: () => void;
  onDeleteMessage: (id: string) => void;
  isAiLoading?: boolean;
}

export const Assistente: React.FC<AssistenteProps> = ({
  messaggi,
  onSendMessage,
  onNavigate,
  onSelectPercorso,
  onClearChat,
  onDeleteMessage,
  isAiLoading = false
}) => {
  const [inputText, setInputText] = useState("");
  const [safetyConfig, setSafetyConfig] = useState<AISettings>(() => SettingsService.getSettings());
  const [showDebug, setShowDebug] = useState(false);

  const handleSafetyChange = (key: keyof AISettings, value: any) => {
    const updated = SettingsService.saveSettings({ [key]: value });
    setSafetyConfig(updated);
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  const previousFocusRef = useRef<HTMLElement | null>(null);
  const cancelClearBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (showConfirmClear) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      const focusCancel = () => {
        cancelClearBtnRef.current?.focus();
      };
      const timer = setTimeout(focusCancel, 50);
      return () => clearTimeout(timer);
    } else {
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
        previousFocusRef.current = null;
      }
    }
  }, [showConfirmClear]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showConfirmClear) {
        setShowConfirmClear(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showConfirmClear]);

  const handleConfirmClear = () => {
    onClearChat();
    setShowConfirmClear(false);
  };

  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messaggi]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText("");
  };

  const handleSuggestionClick = (suggestion: string) => {
    onSendMessage(suggestion);
  };

  const renderMessageText = (msg: Messaggio) => {
    return (
      <div>
        <p style={{ whiteSpace: "pre-line" }}>{msg.testo}</p>
        {msg.linkInterno && msg.linkTesto && (
          <div style={{ marginTop: "var(--space-sm)" }}>
            <Button
              variant="secondary"
              onClick={() => {
                if (msg.linkInterno?.startsWith("percorso-")) {
                  onSelectPercorso(msg.linkInterno);
                } else {
                  onNavigate(msg.linkInterno || "dashboard");
                }
              }}
              style={{ fontSize: "0.85rem", padding: "6px 12px" }}
            >
              {msg.linkTesto} →
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      height: "100%",
      minHeight: 0,
      maxWidth: "1000px",
      margin: "0 auto",
      width: "100%"
    }}>
      
      <div className="card-header" style={{ padding: "0 0 var(--space-sm) 0", borderBottom: "1px solid var(--color-border)", marginBottom: "var(--space-sm)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "var(--space-sm)" }}>
        <div style={{ flex: 1, minWidth: "250px" }}>
          <h2 className="page-title" style={{ fontSize: "1.25rem", display: "flex", alignItems: "center", gap: "var(--space-sm)", marginBottom: "2px" }}>
            <AssistantMascot size="sm" /> {BRAND.assistantName}
          </h2>
          <p className="page-subtitle" style={{ margin: 0, fontSize: "0.8rem", color: "var(--color-text-secondary)" }}>Digita le tue domande per capire quale servizio attivare, quali scadenze rispettare o come raccogliere i documenti necessari.</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-xs)", flexWrap: "wrap" }}>
          {/* Engine Status */}
          <div style={{ height: "34px", display: "flex", alignItems: "center", gap: "6px", padding: "0 12px", backgroundColor: "var(--color-surface)", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)" }}>
            <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--color-text-secondary)" }}>
              {COPY_ASSISTANT.engineLabel}
            </span>
            <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--color-primary)" }}>
              {COPY_ASSISTANT.engineValue}
            </span>
          </div>

          {/* Safety Settings Dashboard */}
          <div style={{ height: "34px", display: "flex", alignItems: "center", gap: "10px", padding: "0 12px", backgroundColor: "var(--color-surface)", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <input 
                id="safe-mode-toggle"
                type="checkbox"
                checked={safetyConfig.safeMode}
                onChange={e => handleSafetyChange("safeMode", e.target.checked)}
                style={{ width: "14px", height: "14px", cursor: "pointer", accentColor: "var(--color-primary)" }}
              />
              <label htmlFor="safe-mode-toggle" style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--color-text-primary)", cursor: "pointer", userSelect: "none" }}>
                {COPY_ASSISTANT.protectionToggleLabel}
              </label>
            </div>

            {safetyConfig.safeMode && (
              <>
                <span style={{ color: "var(--color-border)", fontSize: "0.8rem" }}>|</span>
                <select
                  value={safetyConfig.protectionLevel}
                  onChange={e => handleSafetyChange("protectionLevel", e.target.value)}
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    padding: "2px 6px",
                    border: "1px solid var(--color-border)",
                    borderRadius: "4px",
                    backgroundColor: "var(--color-surface)",
                    cursor: "pointer",
                    height: "22px"
                  }}
                  aria-label="Livello di Protezione"
                >
                  <option value="standard">{COPY_ASSISTANT.protectionLevelNormal}</option>
                  <option value="strict">{COPY_ASSISTANT.protectionLevelMax}</option>
                </select>

                <span style={{ color: "var(--color-border)", fontSize: "0.8rem" }}>|</span>
                <button
                  type="button"
                  onClick={() => setShowDebug(!showDebug)}
                  style={{
                    background: "none",
                    border: "none",
                    color: showDebug ? "var(--color-primary)" : "var(--color-text-secondary)",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    backgroundColor: showDebug ? "var(--color-primary-light)" : "transparent",
                    height: "22px"
                  }}
                >
                  {COPY_ASSISTANT.debugToggleLabel} {showDebug ? "ON" : "OFF"}
                </button>
              </>
            )}
          </div>

          <button 
            type="button"
            onClick={() => setShowConfirmClear(true)}
            style={{ 
              height: "34px",
              padding: "0 16px",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--color-danger-border)",
              backgroundColor: "transparent",
              color: "var(--color-danger)",
              fontSize: "0.8rem", 
              fontWeight: 600,
              cursor: "pointer",
              transition: "all var(--transition-fast)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--color-danger-bg)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            {COPY_ASSISTANT.clearButton}
          </button>
        </div>
      </div>

       <div 
        className="card" 
        style={{ 
          flex: 1, 
          display: "flex", 
          flexDirection: "column", 
          overflow: "hidden", 
          backgroundColor: "var(--color-surface)",
          minHeight: 0
        }}
      >
        <div 
          className="assistant-messages" 
          ref={messagesContainerRef}
          style={{ 
            flex: 1, 
            overflowY: "auto",
            padding: "var(--space-md)",
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-sm)"
          }}
        >
          {messaggi.map((msg) => {
            const isUser = msg.mittente === "utente";
            return (
              <div 
                key={msg.id}
                style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "var(--space-sm)", 
                  alignSelf: isUser ? "flex-end" : "flex-start",
                  flexDirection: "row",
                  maxWidth: "85%"
                }}
              >
                {!isUser && (
                  <div style={{ alignSelf: "flex-end", marginBottom: "4px" }}>
                    <AssistantMascot size="sm" />
                  </div>
                )}

                {isUser && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <TTSButton 
                      text={msg.testo} 
                      variant="icon" 
                      ariaLabel="Ascolta messaggio" 
                    />
                    <button
                      onClick={() => onDeleteMessage(msg.id)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "var(--color-text-secondary)",
                        cursor: "pointer",
                        padding: "6px",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all var(--transition-fast)",
                        opacity: 0.4,
                        minHeight: "32px",
                        minWidth: "32px"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = "1";
                        e.currentTarget.style.color = "var(--color-danger)";
                        e.currentTarget.style.backgroundColor = "var(--color-danger-bg)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = "0.4";
                        e.currentTarget.style.color = "var(--color-text-secondary)";
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                      title="Elimina questo messaggio"
                      aria-label="Elimina messaggio"
                    >
                      <TrashIcon style={{ width: "16px", height: "16px" }} />
                    </button>
                  </div>
                )}

                <div 
                  className={`message-bubble ${isUser ? "user" : "assistant"}`}
                  style={{
                    flex: 1,
                    padding: "var(--space-md)",
                    borderRadius: "var(--radius-lg)",
                    backgroundColor: isUser ? "var(--color-primary)" : "var(--color-background)",
                    color: isUser ? "#ffffff" : "var(--color-text-primary)",
                    border: isUser ? "none" : "1px solid var(--color-border)",
                    borderBottomRightRadius: isUser ? "var(--radius-xs)" : "var(--radius-lg)",
                    borderBottomLeftRadius: isUser ? "var(--radius-lg)" : "var(--radius-xs)"
                  }}
                >
                  <div style={{ fontSize: "0.8rem", fontWeight: 600, color: isUser ? "rgba(255,255,255,0.8)" : "var(--color-text-secondary)", marginBottom: "2px" }}>
                    {isUser ? "Tu" : BRAND.assistantName} • {msg.timestamp}
                  </div>
                  {renderMessageText(msg)}

                  {/* Fonti utilizzate in questa risposta */}
                  {msg.fontiUsate && msg.fontiUsate.length > 0 && (
                    <div style={{
                      marginTop: "var(--space-md)",
                      paddingTop: "var(--space-sm)",
                      borderTop: "1px solid var(--color-border)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "var(--space-xs)"
                    }}>
                      <span style={{
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        color: "var(--color-text-secondary)",
                        display: "block",
                        marginBottom: "2px"
                      }}>
                        📄 Fonti utilizzate:
                      </span>
                      <div style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "var(--space-xs)"
                      }}>
                        {msg.fontiUsate.map((source: any) => (
                          <span
                            key={source.visualId}
                            title={`[Fonte ${source.visualId}] ${source.fileName} - ${source.section}\n\nEstratto:\n"${source.fullText}"`}
                            style={{
                              fontSize: "0.72rem",
                              fontWeight: 600,
                              padding: "4px 8px",
                              borderRadius: "var(--radius-sm)",
                              backgroundColor: "var(--color-primary-light)",
                              color: "var(--color-primary)",
                              border: "1px solid var(--color-border)",
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center"
                            }}
                            onClick={() => {
                              alert(`[Fonte ${source.visualId}] ${source.fileName}\nSezione: ${source.section}\n\nEstratto dai tuoi documenti:\n"${source.fullText}"`);
                            }}
                          >
                            [{source.visualId}] {source.fileName}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* AI Observation Metadata Badges */}
                  {!isUser && (msg.modelloUsato || msg.quarantinedChunksCount || msg.outputBlocked) && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "8px", alignItems: "center" }}>
                      {msg.modelloUsato && (
                        <span 
                          style={{
                            fontSize: "0.7rem",
                            fontWeight: 600,
                            padding: "2px 6px",
                            borderRadius: "var(--radius-sm)",
                            backgroundColor: msg.modelloUsato === "qwen" ? "rgba(124, 58, 237, 0.1)" : "var(--color-danger-bg)",
                            color: msg.modelloUsato === "qwen" ? "rgb(124, 58, 237)" : "var(--color-danger)",
                            border: `1px solid ${msg.modelloUsato === "qwen" ? "rgba(124, 58, 237, 0.15)" : "var(--color-danger-border)"}`
                          }}
                        >
                          {COPY_ASSISTANT.badgeLocalModel}
                        </span>
                      )}

                      {msg.ragAttivo && (
                        <span 
                          style={{
                            fontSize: "0.7rem",
                            fontWeight: 600,
                            padding: "2px 6px",
                            borderRadius: "var(--radius-sm)",
                            backgroundColor: "var(--color-success-bg)",
                            color: "var(--color-success)",
                            border: "1px solid var(--color-success-border)"
                          }}
                        >
                          {COPY_ASSISTANT.badgeDocumentsUsed}
                        </span>
                      )}

                      {msg.quarantinedChunksCount && msg.quarantinedChunksCount > 0 ? (
                        <span 
                          style={{
                            fontSize: "0.7rem",
                            fontWeight: 600,
                            padding: "2px 6px",
                            borderRadius: "var(--radius-sm)",
                            backgroundColor: "rgba(245, 158, 11, 0.1)",
                            color: "rgb(245, 158, 11)",
                            border: "1px solid rgba(245, 158, 11, 0.2)"
                          }}
                          title={COPY_ASSISTANT.tooltipSuspiciousDetail}
                        >
                          {COPY_ASSISTANT.badgeSuspiciousFiltered}
                        </span>
                      ) : null}

                      {msg.outputBlocked && (
                        <span 
                          style={{
                            fontSize: "0.7rem",
                            fontWeight: 600,
                            padding: "2px 6px",
                            borderRadius: "var(--radius-sm)",
                            backgroundColor: "var(--color-danger-bg)",
                            color: "var(--color-danger)",
                            border: "1px solid var(--color-danger-border)"
                          }}
                        >
                          {COPY_ASSISTANT.badgeSecurityBlock}
                        </span>
                      )}

                      {msg.motivoRouting && (
                        <span 
                          title={`${getFriendlyRoutingReason(msg.motivoRouting)}${msg.durataMs ? ` (elaborato in ${(msg.durataMs / 1000).toFixed(1)}s)` : ""}`}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "help",
                            width: "16px",
                            height: "16px",
                            borderRadius: "50%",
                            backgroundColor: "var(--color-gray-badge-bg)",
                            color: "var(--color-text-secondary)",
                            fontSize: "0.7rem",
                            fontWeight: "bold",
                            border: "1px solid var(--color-border)"
                          }}
                        >
                          ?
                        </span>
                      )}
                    </div>
                  )}

                  {/* AI Safety Debug Panel */}
                  {showDebug && !isUser && (
                    <div style={{
                      marginTop: "12px",
                      padding: "10px",
                      backgroundColor: "var(--color-surface)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "var(--radius-sm)",
                      fontSize: "0.75rem",
                      fontFamily: "monospace",
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px",
                      color: "var(--color-text-secondary)"
                    }}>
                      <div style={{ fontWeight: "bold", borderBottom: "1px solid var(--color-border)", paddingBottom: "4px", marginBottom: "4px", color: "var(--color-dark-blue)" }}>
                        {COPY_DEBUG.panelTitle}
                      </div>
                      <div>{COPY_DEBUG.engineUsed} <strong style={{ color: "var(--color-text-primary)" }}>{msg.modelloUsato === "qwen" ? COPY_ASSISTANT.engineValue : (msg.modelloUsato || COPY_DEBUG.notSpecified)}</strong></div>
                      <div>{COPY_DEBUG.routingCriteria} <span style={{ color: "var(--color-text-primary)" }}>{msg.motivoRouting ? getFriendlyRoutingReason(msg.motivoRouting) : COPY_DEBUG.notSpecified}</span></div>
                      <div>{COPY_DEBUG.inputRisk} <span style={{ color: msg.inputRiskScore && msg.inputRiskScore >= 0.4 ? "var(--color-danger)" : "var(--color-success)" }}>{msg.inputRiskScore !== undefined ? `${(msg.inputRiskScore * 100).toFixed(0)}%` : "0%"}</span></div>
                      <div>{COPY_DEBUG.docsExcluded} <span style={{ color: msg.quarantinedChunksCount && msg.quarantinedChunksCount > 0 ? "var(--color-warning)" : "var(--color-text-primary)" }}>{msg.quarantinedChunksCount || 0}</span></div>
                      <div>{COPY_DEBUG.docsRisk} <span>{msg.ragRiskScore !== undefined ? `${(msg.ragRiskScore * 100).toFixed(0)}%` : "0%"}</span></div>
                      <div>{COPY_DEBUG.outputBlocked} <strong style={{ color: msg.outputBlocked ? "var(--color-danger)" : "var(--color-success)" }}>{msg.outputBlocked ? COPY_DEBUG.yes : COPY_DEBUG.no}</strong></div>
                    </div>
                  )}
                </div>

                {!isUser && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <TTSButton 
                      text={msg.testo} 
                      variant="icon" 
                      ariaLabel="Ascolta messaggio" 
                    />
                    <button
                      onClick={() => onDeleteMessage(msg.id)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "var(--color-text-secondary)",
                        cursor: "pointer",
                        padding: "6px",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all var(--transition-fast)",
                        opacity: 0.4,
                        minHeight: "32px",
                        minWidth: "32px"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = "1";
                        e.currentTarget.style.color = "var(--color-danger)";
                        e.currentTarget.style.backgroundColor = "var(--color-danger-bg)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = "0.4";
                        e.currentTarget.style.color = "var(--color-text-secondary)";
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                      title="Elimina questo messaggio"
                      aria-label="Elimina messaggio"
                    >
                      <TrashIcon style={{ width: "16px", height: "16px" }} />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
          {/* Loading Indicator for AI response */}
          {isAiLoading && (
            <div 
              style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "var(--space-sm)", 
                alignSelf: "flex-start",
                flexDirection: "row",
                maxWidth: "85%"
              }}
            >
              <div style={{ alignSelf: "flex-end", marginBottom: "4px" }}>
                <AssistantMascot size="sm" />
              </div>
              <div 
                className="message-bubble assistant"
                style={{
                  padding: "var(--space-md)",
                  borderRadius: "var(--radius-lg)",
                  backgroundColor: "var(--color-background)",
                  color: "var(--color-text-secondary)",
                  border: "1px solid var(--color-border)",
                  borderBottomLeftRadius: "var(--radius-xs)"
                }}
              >
                <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: "4px" }}>
                  {BRAND.assistantName} {COPY_ASSISTANT.thinkingLabel}
                </div>
                <div style={{ display: "flex", gap: "4px", padding: "4px 0" }}>
                  <span className="dot-loading" style={{ width: "8px", height: "8px", backgroundColor: "var(--color-primary)", borderRadius: "50%", display: "inline-block", animation: "bounce 1.4s infinite ease-in-out both" }}></span>
                  <span className="dot-loading" style={{ width: "8px", height: "8px", backgroundColor: "var(--color-primary)", borderRadius: "50%", display: "inline-block", animation: "bounce 1.4s infinite ease-in-out both 0.2s" }}></span>
                  <span className="dot-loading" style={{ width: "8px", height: "8px", backgroundColor: "var(--color-primary)", borderRadius: "50%", display: "inline-block", animation: "bounce 1.4s infinite ease-in-out both 0.4s" }}></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="assistant-input-area">
          {messaggi.length > 0 && messaggi[messaggi.length - 1].mittente === "assistente" && messaggi[messaggi.length - 1].suggerimenti && (
            <div className="assistant-suggestions">
              {messaggi[messaggi.length - 1].suggerimenti?.map((suggerimento, i) => (
                <button
                  key={i}
                  className="suggestion-btn"
                  onClick={() => handleSuggestionClick(suggerimento)}
                >
                  {suggerimento}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit} className="assistant-form">
            <input
              type="text"
              className="assistant-form-input"
              placeholder={COPY_ASSISTANT.inputPlaceholder}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              aria-label={COPY_ASSISTANT.inputAriaLabel}
            />
            <Button 
              type="submit" 
              disabled={!inputText.trim()} 
              style={{ 
                height: "44px", 
                padding: "0 20px", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                gap: "8px" 
              }}
            >
              {COPY_ASSISTANT.sendButton} <PaperPlaneIcon />
            </Button>
          </form>
        </div>
      </div>

      {/* Modal di conferma cancellazione chat */}
      {showConfirmClear && (
        <div 
          className="modal-overlay no-print"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 26, 77, 0.4)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            animation: "fadeIn 0.15s ease-out"
          }}
          onClick={() => setShowConfirmClear(false)}
        >
          <div 
            className="modal-content"
            role="dialog"
            aria-modal="true"
            aria-labelledby="clear-dialog-title"
            aria-describedby="clear-dialog-desc"
            style={{
              backgroundColor: "var(--color-surface)",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--color-border)",
              boxShadow: "var(--shadow-lg)",
              width: "90%",
              maxWidth: "480px",
              padding: "var(--space-lg)",
              animation: "slideUp 0.2s ease-out",
              position: "relative"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 
              id="clear-dialog-title" 
              style={{ fontSize: "1.25rem", fontWeight: 600, color: "var(--color-dark-blue)", margin: "0 0 var(--space-sm) 0" }}
            >
              {COPY_ASSISTANT.clearDialogTitle}
            </h3>
            
            <p 
              id="clear-dialog-desc" 
              style={{ color: "var(--color-text-secondary)", fontSize: "0.95rem", lineHeight: "1.5", margin: "0 0 var(--space-lg) 0" }}
            >
              {COPY_ASSISTANT.clearDialogDesc}
            </p>
            
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--space-sm)" }}>
              <button 
                ref={cancelClearBtnRef}
                className="btn btn-secondary" 
                onClick={() => setShowConfirmClear(false)}
                style={{ minHeight: "38px", padding: "8px 16px", fontSize: "0.9rem" }}
              >
                {COPY_ASSISTANT.clearCancel}
              </button>
              <button 
                className="btn btn-danger" 
                onClick={handleConfirmClear}
                style={{ minHeight: "38px", padding: "8px 16px", fontSize: "0.9rem", backgroundColor: "var(--color-danger)" }}
              >
                {COPY_ASSISTANT.clearConfirm}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
