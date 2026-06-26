/**
 * Text sanitization utilities for inputs and retrieved RAG chunks.
 */

/**
 * Removes dangerous HTML-like tags, system control tokens, and template boundaries.
 */
export function sanitizeText(text: string): string {
  if (!text) return "";

  let sanitized = text;

  // 1. Remove Ollama / LLM control tokens (ChatML, Llama, etc.)
  sanitized = sanitized.replace(/<\|im_start\|>/g, "");
  sanitized = sanitized.replace(/<\|im_end\|>/g, "");
  sanitized = sanitized.replace(/<\|system\|>/g, "");
  sanitized = sanitized.replace(/<\|user\|>/g, "");
  sanitized = sanitized.replace(/<\|assistant\|>/g, "");
  sanitized = sanitized.replace(/<\|end\|>/g, "");
  sanitized = sanitized.replace(/<\/s>/g, "");
  sanitized = sanitized.replace(/<s>/g, "");

  // 2. Strip standard HTML tags (prevents tag spoofing like <system> or <admin>)
  sanitized = sanitized.replace(/<\/?[a-zA-Z0-9]+(?:\s+[^>]*)*>/g, "");

  // 3. Normalize multiple whitespaces and control newlines
  sanitized = sanitized.replace(/\s+/g, " ");

  return sanitized.trim();
}
