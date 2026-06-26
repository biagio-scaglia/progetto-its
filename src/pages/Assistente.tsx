import React, { useState, useRef, useEffect } from "react";
import { Messaggio } from "../types";
import { Button } from "../components/ui/Button";
import { PaperPlaneIcon, TrashIcon } from "@radix-ui/react-icons";
import { TTSButton } from "../components/ui/TTSButton";
import { BRAND } from "../config/branding";
import { AssistantMascot } from "../components/ui/AssistantMascot";
import { SettingsService, AISettings } from "../services/settingsService";

import { getFriendlyRoutingReason } from "../utils/routingReason";

export interface AssistenteProps {
  messaggi: Messaggio[];
  onSendMessage: (testo: string) => void;
  onNavigate: (page: string) => void;
  onSelectPercorso: (id: string) => void;
  onClearChat: () => void;
  onDeleteMessage: (id: string) => void;
  modelMode?: "auto" | "phi" | "qwen";
  onUpdateModelMode?: (mode: "auto" | "phi" | "qwen") => void;
  isAiLoading?: boolean;
}

export const Assistente: React.FC<AssistenteProps> = ({
  messaggi,
  onSendMessage,
  onNavigate,
  onSelectPercorso,
  onClearChat,
  onDeleteMessage,
  modelMode = "auto",
  onUpdateModelMode,
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
      
      <div className="card-header" style={{ padding: "0 0 var(--space-md) 0", borderBottom: "1px solid var(--color-border)", marginBottom: "var(--space-md)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "var(--space-sm)" }}>
        <div style={{ flex: 1, minWidth: "250px" }}>
          <h2 className="page-title" style={{ fontSize: "1.5rem", display: "flex", alignItems: "center", gap: "var(--space-sm)", marginBottom: "4px" }}>
            <AssistantMascot size="md" /> {BRAND.assistantName}
          </h2>
          <p className="page-subtitle" style={{ margin: 0 }}>Digita le tue domande per capire quale servizio attivare, quali scadenze rispettare o come raccogliere i documenti necessari.</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-xs)" }}>
            <label htmlFor="model-select" style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--color-text-secondary)", whiteSpace: "nowrap" }}>
              Motore AI:
            </label>
            <select
              id="model-select"
              value={modelMode}
              onChange={(e) => onUpdateModelMode?.(e.target.value as any)}
              className="form-input"
              style={{ 
                padding: "6px 12px", 
                fontSize: "0.85rem", 
                width: "auto", 
                minHeight: "36px",
                borderColor: "var(--color-border)",
                borderRadius: "var(--radius-sm)",
                backgroundColor: "var(--color-surface)",
                cursor: "pointer"
              }}
            >
              <option value="auto">Automatico (Consigliato)</option>
              <option value="phi">Solo Phi (Veloce)</option>
              <option value="qwen">Solo Qwen (Avanzato)</option>
            </select>
          </div>

          {/* Safety Settings Dashboard */}
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)", padding: "4px 10px", backgroundColor: "var(--color-surface)", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", minHeight: "36px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <input 
                id="safe-mode-toggle"
                type="checkbox"
                checked={safetyConfig.safeMode}
                onChange={e => handleSafetyChange("safeMode", e.target.checked)}
                style={{ width: "16px", height: "16px", cursor: "pointer", accentColor: "var(--color-primary)" }}
              />
              <label htmlFor="safe-mode-toggle" style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--color-text-primary)", cursor: "pointer", userSelect: "none" }}>
                Safe Mode
              </label>
            </div>

            {safetyConfig.safeMode && (
              <>
                <span style={{ color: "var(--color-border)" }}>|</span>
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
                    cursor: "pointer"
                  }}
                  aria-label="Livello di Protezione"
                >
                  <option value="standard">Standard</option>
                  <option value="strict">Strict</option>
                </select>

                <span style={{ color: "var(--color-border)" }}>|</span>
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
                    backgroundColor: showDebug ? "var(--color-primary-light)" : "transparent"
                  }}
                >
                  Debug {showDebug ? "ON" : "OFF"}
                </button>
              </>
            )}
          </div>

          <Button 
            variant="secondary" 
            onClick={() => setShowConfirmClear(true)}
            style={{ 
              borderColor: "var(--color-danger)", 
              color: "var(--color-danger)", 
              fontSize: "0.85rem", 
              padding: "8px 16px",
              minHeight: "36px"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--color-danger-bg)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            Cancella cronologia chat
          </Button>
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
            padding: "var(--space-lg)",
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-md)"
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
                            backgroundColor: msg.modelloUsato === "phi" ? "var(--color-primary-light)" : msg.modelloUsato === "qwen" ? "rgba(124, 58, 237, 0.1)" : "var(--color-danger-bg)",
                            color: msg.modelloUsato === "phi" ? "var(--color-primary)" : msg.modelloUsato === "qwen" ? "rgb(124, 58, 237)" : "var(--color-danger)",
                            border: `1px solid ${msg.modelloUsato === "phi" ? "rgba(0, 85, 179, 0.15)" : msg.modelloUsato === "qwen" ? "rgba(124, 58, 237, 0.15)" : "var(--color-danger-border)"}`
                          }}
                        >
                          Generato con {msg.modelloUsato === "phi" ? "Phi (Veloce)" : msg.modelloUsato === "qwen" ? "Qwen (Avanzato)" : "Errore"}
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
                          RAG locale attivo
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
                          title="RAG Guard ha rimosso e messo in quarantena chunk non sicuri contenenti tentativi di override."
                        >
                          Contenuto sospetto filtrato ({msg.quarantinedChunksCount} chunk)
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
                          Blocco sicurezza attivo
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
                        DIAGNOSTICA SICUREZZA AI LOCALE
                      </div>
                      <div>Modello Usato: <strong style={{ color: "var(--color-text-primary)" }}>{msg.modelloUsato || "Non specificato"}</strong></div>
                      <div>Motivo Routing: <span style={{ color: "var(--color-text-primary)" }}>{msg.motivoRouting || "Non specificato"}</span></div>
                      <div>Rischio Prompt Injection: <span style={{ color: msg.inputRiskScore && msg.inputRiskScore >= 0.4 ? "var(--color-danger)" : "var(--color-success)" }}>{msg.inputRiskScore !== undefined ? `${(msg.inputRiskScore * 100).toFixed(0)}%` : "0%"}</span></div>
                      <div>RAG Chunks Quarantined: <span style={{ color: msg.quarantinedChunksCount && msg.quarantinedChunksCount > 0 ? "var(--color-warning)" : "var(--color-text-primary)" }}>{msg.quarantinedChunksCount || 0} chunk</span></div>
                      <div>RAG Risk Score: <span>{msg.ragRiskScore !== undefined ? `${(msg.ragRiskScore * 100).toFixed(0)}%` : "0%"}</span></div>
                      <div>Output Bloccato: <strong style={{ color: msg.outputBlocked ? "var(--color-danger)" : "var(--color-success)" }}>{msg.outputBlocked ? "SÌ" : "NO"}</strong></div>
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
                  {BRAND.assistantName} sta pensando...
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
              placeholder="Chiedi spiegazioni o indica cosa devi fare..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              aria-label="Messaggio per l'assistente di guida"
            />
            <Button type="submit" disabled={!inputText.trim()} style={{ padding: "10px 20px" }}>
              Invia <PaperPlaneIcon />
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
              Cancellazione cronologia chat
            </h3>
            
            <p 
              id="clear-dialog-desc" 
              style={{ color: "var(--color-text-secondary)", fontSize: "0.95rem", lineHeight: "1.5", margin: "0 0 var(--space-lg) 0" }}
            >
              Sei sicuro di voler cancellare l'intera cronologia di questa conversazione? Questa azione rimuoverà tutti i messaggi scambiati e non potrai più recuperarli.
            </p>
            
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--space-sm)" }}>
              <button 
                ref={cancelClearBtnRef}
                className="btn btn-secondary" 
                onClick={() => setShowConfirmClear(false)}
                style={{ minHeight: "38px", padding: "8px 16px", fontSize: "0.9rem" }}
              >
                Annulla
              </button>
              <button 
                className="btn btn-danger" 
                onClick={handleConfirmClear}
                style={{ minHeight: "38px", padding: "8px 16px", fontSize: "0.9rem", backgroundColor: "var(--color-danger)" }}
              >
                Cancella cronologia
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
