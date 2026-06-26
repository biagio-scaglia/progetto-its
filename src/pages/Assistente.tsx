import React, { useState, useRef, useEffect } from "react";
import { Messaggio } from "../types";
import { Button } from "../components/ui/Button";
import { ChatBubbleIcon, PaperPlaneIcon, TrashIcon } from "@radix-ui/react-icons";
import { TTSButton } from "../components/ui/TTSButton";

export interface AssistenteProps {
  messaggi: Messaggio[];
  onSendMessage: (testo: string) => void;
  onNavigate: (page: string) => void;
  onSelectPercorso: (id: string) => void;
  onClearChat: () => void;
  onDeleteMessage: (id: string) => void;
}

export const Assistente: React.FC<AssistenteProps> = ({
  messaggi,
  onSendMessage,
  onNavigate,
  onSelectPercorso,
  onClearChat,
  onDeleteMessage
}) => {
  const [inputText, setInputText] = useState("");
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
            <ChatBubbleIcon style={{ color: "var(--color-primary)" }} /> Assistente per l'Orientamento
          </h2>
          <p className="page-subtitle" style={{ margin: 0 }}>Digita le tue domande per capire quale servizio attivare, quali scadenze rispettare o come raccogliere i documenti necessari.</p>
        </div>
        <div>
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
                  flexDirection: isUser ? "row" : "row-reverse",
                  maxWidth: "85%"
                }}
              >
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
                    {isUser ? "Tu" : "Guida Digitale"} • {msg.timestamp}
                  </div>
                  {renderMessageText(msg)}
                </div>
              </div>
            );
          })}
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
