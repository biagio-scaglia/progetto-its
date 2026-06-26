export type TechnicalRoutingReason =
  | "qwen_generation"
  | "social_bypass"
  | "system_error";

const REASON_MESSAGES: Record<TechnicalRoutingReason, string> = {
  qwen_generation: "Risposta generata localmente dal modello Qwen (2-7b).",
  social_bypass: "Risposta rapida conversazionale (senza modello generativo).",
  system_error: "Errore di sistema: il modello locale Qwen non ha risposto. Assicurati che Ollama sia avviato."
};

/**
 * Translates technical routing reason identifiers into clear, user-facing Italian explanations.
 */
export function getFriendlyRoutingReason(reason: string | undefined): string {
  if (!reason) return "Selezione del modello automatica.";
  return REASON_MESSAGES[reason as TechnicalRoutingReason] || reason;
}
