import { COPY_ROUTING } from "../config/microcopy";

export type TechnicalRoutingReason =
  | "qwen_generation"
  | "social_bypass"
  | "system_error";

const REASON_MESSAGES: Record<TechnicalRoutingReason, string> = {
  qwen_generation: COPY_ROUTING.qwenGeneration,
  social_bypass: COPY_ROUTING.socialBypass,
  system_error: COPY_ROUTING.systemError
};

/**
 * Translates technical routing reason identifiers into clear, user-facing Italian explanations.
 */
export function getFriendlyRoutingReason(reason: string | undefined): string {
  if (!reason) return COPY_ROUTING.defaultReason;
  return REASON_MESSAGES[reason as TechnicalRoutingReason] || reason;
}
