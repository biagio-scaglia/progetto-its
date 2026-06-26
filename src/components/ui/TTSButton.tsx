import React, { useState, useEffect } from "react";
import { PlayIcon, StopIcon } from "@radix-ui/react-icons";

export interface TTSButtonProps {
  text: string;
  ariaLabel?: string;
  variant?: "primary" | "secondary" | "icon";
  size?: "sm" | "md";
}

/**
 * Bottone per la sintesi vocale (Text-To-Speech) che legge il testo fornito in lingua italiana.
 * Offre controlli per avviare e interrompere la lettura vocale in modo accessibile.
 */
export const TTSButton: React.FC<TTSButtonProps> = ({
  text,
  ariaLabel = "Leggi testo ad alta voce",
  variant = "secondary",
  size = "md"
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEnabled, setIsEnabled] = useState(() => localStorage.getItem("pref-enable-tts") !== "false");

  useEffect(() => {
    // Sincronizza lo stato all'avvio del componente
    setIsEnabled(localStorage.getItem("pref-enable-tts") !== "false");
  }, []);

  useEffect(() => {
    // Interrompe la riproduzione all'unmount del componente per evitare voci orfane
    return () => {
      if (isPlaying) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isPlaying]);

  if (!isEnabled) {
    return null;
  }

  const handleTogglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      window.speechSynthesis.cancel();
      
      // Rimuove tag HTML per evitare la lettura di elementi di markup
      const cleanText = text.replace(/<[^>]*>/g, "");
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = "it-IT";
      
      utterance.onend = () => {
        setIsPlaying(false);
      };
      utterance.onerror = () => {
        setIsPlaying(false);
      };
      
      setIsPlaying(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const buttonStyle = variant === "icon" 
    ? {
        background: "none",
        border: "none",
        color: isPlaying ? "var(--color-primary)" : "var(--color-text-secondary)",
        cursor: "pointer",
        padding: "6px",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "32px",
        minWidth: "32px",
        backgroundColor: isPlaying ? "var(--color-primary-light)" : "transparent",
        transition: "all var(--transition-fast)"
      }
    : {
        fontSize: size === "sm" ? "0.8rem" : "0.9rem",
        padding: size === "sm" ? "4px 8px" : "6px 12px",
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        cursor: "pointer"
      };

  return (
    <button
      type="button"
      onClick={handleTogglePlay}
      className={variant !== "icon" ? `btn btn-${variant}` : ""}
      style={buttonStyle}
      aria-label={isPlaying ? "Ferma lettura vocale" : ariaLabel}
      title={isPlaying ? "Ferma" : ariaLabel}
    >
      {isPlaying ? (
        <>
          <StopIcon style={{ width: "16px", height: "16px" }} />
          {variant !== "icon" && <span>Ferma</span>}
        </>
      ) : (
        <>
          <PlayIcon style={{ width: "16px", height: "16px" }} />
          {variant !== "icon" && <span>Leggi ad alta voce</span>}
        </>
      )}
    </button>
  );
};
