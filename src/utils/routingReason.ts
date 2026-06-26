export type TechnicalRoutingReason =
  | "user_forced_phi"
  | "user_forced_qwen"
  | "phi_default_fast_path"
  | "complexity_routed_qwen"
  | "rag_query_rewrite_qwen"
  | "phi_failed_qwen_fallback"
  | "qwen_unavailable_phi_retry"
  | "system_error";

const REASON_MESSAGES: Record<TechnicalRoutingReason, string> = {
  user_forced_phi: "Hai forzato manualmente l'uso di Phi (motore locale leggero e veloce).",
  user_forced_qwen: "Hai forzato manualmente l'uso di Qwen (motore locale avanzato ad alta qualità).",
  phi_default_fast_path: "Scelta automatica: query semplice elaborata sul canale veloce (Phi).",
  complexity_routed_qwen: "Scelta automatica: instradato su Qwen per via della complessità del prompt.",
  rag_query_rewrite_qwen: "Scelta automatica: instradato su Qwen per query rewriting o sintesi incrociata di documenti.",
  phi_failed_qwen_fallback: "Ripristino di sicurezza: Phi ha riscontrato un errore o timeout; elaborato da Qwen.",
  qwen_unavailable_phi_retry: "Ripristino di sicurezza: Qwen non è disponibile; elaborato sul canale Phi.",
  system_error: "Errore di sistema: nessun modello locale ha risposto. Assicurati che Ollama sia avviato."
};

/**
 * Translates technical routing reason identifiers into clear, user-facing Italian explanations.
 */
export function getFriendlyRoutingReason(reason: string | undefined): string {
  if (!reason) return "Selezione del modello automatica.";
  return REASON_MESSAGES[reason as TechnicalRoutingReason] || reason;
}
