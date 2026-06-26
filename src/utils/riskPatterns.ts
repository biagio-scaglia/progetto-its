/**
 * Risk patterns used to detect prompt injection, jailbreaks, prompt leaking, and spoofing.
 */
export const INJECTION_PATTERNS = [
  // System Prompt Override / Disregard rules
  /ignore\s+(?:previous|prior|above|system)\s+instructions/i,
  /disregard\s+(?:all\s+)?safety\s+(?:rules|guidelines|policies)/i,
  /ignore\s+the\s+preceding\s+rules/i,
  /clear\s+your\s+memory/i,
  /reset\s+(?:your\s+)?instructions/i,
  /delete\s+(?:all\s+)?previous\s+messages/i,
  /override\s+(?:system\s+)?prompt/i,

  // Role spoofing / System identity takeover
  /you\s+are\s+now\s+(?:a|an|the)\s+(?:system|developer|administrator|admin|root|ai\s+without\s+rules)/i,
  /act\s+as\s+(?:a|an|the)\s+(?:developer|administrator|admin|ai\s+unlocked|jailbroken)/i,
  /new\s+role\s*:/i,
  /switch\s+to\s+developer\s+mode/i,
  /developer\s+override\s+active/i,

  // Prompt leaking / Prompt extraction
  /reveal\s+(?:your\s+)?(?:system\s+)?prompt/i,
  /show\s+(?:your\s+)?(?:hidden|internal|system|initial)\s+instructions/i,
  /output\s+the\s+system\s+prompt/i,
  /print\s+everything\s+above/i,
  /what\s+are\s+your\s+instructions\?/i,
  /translate\s+the\s+system\s+prompt/i,
  /leak\s+(?:your\s+)?system\s+instructions/i,

  // LLM template spoofing (ChatML / tags)
  /<\|im_start\|>\s*system/i,
  /<\|im_end\|>/i,
  /<\/s>/i,
  /\[system\s+message\]/i,
  /\[developer\s+note\]/i,
  /system\s*:/i,
  /admin\s*:/i
];

/**
 * Key phrases that represent medium to high risk when present in user queries or RAG chunks.
 */
export const SUSPICIOUS_PHRASES = [
  "ignore previous instructions",
  "you are now system",
  "reveal your prompt",
  "show hidden instructions",
  "act as developer",
  "disregard safety rules",
  "system message:",
  "developer message:",
  "ignore the preceding rules",
  "developer mode active",
  "jailbreak"
];
