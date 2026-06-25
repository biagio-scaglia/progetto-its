import React, { useState, useRef, useEffect } from "react";
import { Messaggio } from "../types";
import { Button } from "../components/ui/Button";
import { ChatBubbleIcon, PaperPlaneIcon } from "@radix-ui/react-icons";

export interface AssistenteProps {
  messaggi: Messaggio[];
  onSendMessage: (testo: string) => void;
  onNavigate: (page: string) => void;
  onSelectPercorso: (id: string) => void;
}

export const Assistente: React.FC<AssistenteProps> = ({
  messaggi,
  onSendMessage,
  onNavigate,
  onSelectPercorso
}) => {
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - var(--topbar-height) - 2 * var(--space-lg))" }}>
      
      <div className="card-header" style={{ padding: "0 0 var(--space-md) 0", borderBottom: "1px solid var(--color-border)", marginBottom: "var(--space-md)" }}>
        <div>
          <h2 className="page-title" style={{ fontSize: "1.5rem", display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
            <ChatBubbleIcon style={{ color: "var(--color-primary)" }} /> Assistente per l'Orientamento
          </h2>
          <p className="page-subtitle">Digita le tue domande per capire quale servizio attivare, quali scadenze rispettare o come raccogliere i documenti necessari.</p>
        </div>
      </div>

      <div 
        className="card" 
        style={{ 
          flex: 1, 
          display: "flex", 
          flexDirection: "column", 
          overflow: "hidden", 
          backgroundColor: "var(--color-surface)" 
        }}
      >
        <div 
          className="assistant-messages" 
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
                className={`message-bubble ${isUser ? "user" : "assistant"}`}
                style={{
                  alignSelf: isUser ? "flex-end" : "flex-start",
                  maxWidth: "75%",
                  padding: "var(--space-md)",
                  borderRadius: "var(--radius-lg)",
                  backgroundColor: isUser ? "var(--color-primary)" : "var(--color-background)",
                  color: isUser ? "#ffffff" : "var(--color-text-primary)",
                  border: isUser ? "none" : "1px solid var(--color-border)",
                  borderBottomRightRadius: isUser ? "var(--radius-xs)" : "var(--radius-lg)",
                  borderBottomLeftRadius: isUser ? "var(--radius-lg)" : "var(--radius-xs)"
                }}
              >
                <div style={{ fontSize: "0.8rem", fontWeight: 700, color: isUser ? "rgba(255,255,255,0.8)" : "var(--color-text-secondary)", marginBottom: "2px" }}>
                  {isUser ? "Tu" : "Guida Digitale"} • {msg.timestamp}
                </div>
                {renderMessageText(msg)}
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
    </div>
  );
};
