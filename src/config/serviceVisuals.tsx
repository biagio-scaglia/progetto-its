import React from "react";
import {
  PersonIcon,
  IdCardIcon,
  LockClosedIcon,
  QuestionMarkCircledIcon,
  HomeIcon,
  BackpackIcon,
  LightningBoltIcon,
  MixIcon,
  ExclamationTriangleIcon,
  GearIcon,
} from "@radix-ui/react-icons";

// ─────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RadixIcon = React.ForwardRefExoticComponent<any>;

export interface ServiceVisual {
  /** Radix Icon component for the service */
  icon: RadixIcon;
  /** Accessible label for the icon */
  iconLabel: string;
  /** Category icon (used in category tabs/badges) */
  categoryIcon: RadixIcon;
  /** Inline SVG thumbnail rendered as React component */
  Thumbnail: React.FC<{ className?: string; style?: React.CSSProperties }>;
  /** Color accent for the thumbnail background (CSS variable or hex) */
  accentColor: string;
  /** Light variant of the accent for backgrounds */
  accentBg: string;
}

// ─────────────────────────────────────────────────────────
// Inline SVG Thumbnails
// Clean, institutional-style vector illustrations.
// NOT official logos — custom neutral visuals inspired by context.
// ─────────────────────────────────────────────────────────

const ThumbnailSPID: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className, style }) => (
  <svg className={className} style={style} viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img">
    <rect width="120" height="80" rx="8" fill="#EEF2FF" />
    {/* Shield shape representing digital identity protection */}
    <path d="M60 14 L82 24 L82 44 C82 56 72 66 60 70 C48 66 38 56 38 44 L38 24 Z" fill="#4F6AE8" opacity="0.15" />
    <path d="M60 18 L78 26 L78 43 C78 53 70 62 60 66 C50 62 42 53 42 43 L42 26 Z" fill="none" stroke="#4F6AE8" strokeWidth="2" />
    {/* Person silhouette inside shield */}
    <circle cx="60" cy="36" r="6" fill="#4F6AE8" opacity="0.6" />
    <path d="M50 52 C50 46 54 43 60 43 C66 43 70 46 70 52" fill="#4F6AE8" opacity="0.4" />
    {/* Key icon at bottom-right */}
    <circle cx="88" cy="58" r="6" fill="none" stroke="#4F6AE8" strokeWidth="1.5" opacity="0.5" />
    <line x1="94" y1="58" x2="104" y2="58" stroke="#4F6AE8" strokeWidth="1.5" opacity="0.5" />
    <line x1="100" y1="58" x2="100" y2="63" stroke="#4F6AE8" strokeWidth="1.5" opacity="0.5" />
    <line x1="104" y1="58" x2="104" y2="63" stroke="#4F6AE8" strokeWidth="1.5" opacity="0.5" />
  </svg>
);

const ThumbnailCIE: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className, style }) => (
  <svg className={className} style={style} viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img">
    <rect width="120" height="80" rx="8" fill="#F0F7FF" />
    {/* Card shape */}
    <rect x="20" y="16" width="80" height="50" rx="6" fill="white" stroke="#2563EB" strokeWidth="1.5" />
    {/* Chip (NFC contact pad) */}
    <rect x="28" y="24" width="16" height="12" rx="2" fill="#EAB308" opacity="0.6" />
    <line x1="32" y1="24" x2="32" y2="36" stroke="#EAB308" strokeWidth="0.5" opacity="0.8" />
    <line x1="36" y1="24" x2="36" y2="36" stroke="#EAB308" strokeWidth="0.5" opacity="0.8" />
    <line x1="40" y1="24" x2="40" y2="36" stroke="#EAB308" strokeWidth="0.5" opacity="0.8" />
    {/* Photo placeholder */}
    <rect x="28" y="42" width="14" height="18" rx="2" fill="#2563EB" opacity="0.12" />
    <circle cx="35" cy="48" r="3" fill="#2563EB" opacity="0.25" />
    <path d="M29 56 C29 53 31 51 35 51 C39 51 41 53 41 56" fill="#2563EB" opacity="0.2" />
    {/* Text lines */}
    <rect x="48" y="44" width="44" height="3" rx="1.5" fill="#2563EB" opacity="0.2" />
    <rect x="48" y="50" width="32" height="3" rx="1.5" fill="#2563EB" opacity="0.15" />
    <rect x="48" y="56" width="38" height="2" rx="1" fill="#2563EB" opacity="0.1" />
    {/* NFC waves icon */}
    <path d="M96 22 C100 26 100 32 96 36" fill="none" stroke="#2563EB" strokeWidth="1.2" opacity="0.3" />
    <path d="M92 24 C95 27 95 31 92 34" fill="none" stroke="#2563EB" strokeWidth="1.2" opacity="0.4" />
    {/* Italian tricolor stripe at bottom of card */}
    <rect x="20" y="60" width="27" height="6" fill="#009246" opacity="0.4" />
    <rect x="47" y="60" width="27" height="6" fill="#F0F7FF" opacity="0.4" />
    <rect x="74" y="60" width="26" height="6" fill="#CE2B37" opacity="0.4" />
  </svg>
);

const ThumbnailResidenza: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className, style }) => (
  <svg className={className} style={style} viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img">
    <rect width="120" height="80" rx="8" fill="#F0FDF4" />
    {/* House shape */}
    <path d="M60 18 L88 38 L84 38 L84 62 L36 62 L36 38 L32 38 Z" fill="#16A34A" opacity="0.1" />
    <path d="M60 22 L84 38 L84 58 L36 58 L36 38 Z" fill="none" stroke="#16A34A" strokeWidth="1.5" />
    <path d="M60 22 L32 40" fill="none" stroke="#16A34A" strokeWidth="1.5" />
    <path d="M60 22 L88 40" fill="none" stroke="#16A34A" strokeWidth="1.5" />
    {/* Door */}
    <rect x="54" y="44" width="12" height="14" rx="1" fill="#16A34A" opacity="0.25" />
    <circle cx="63" cy="52" r="1" fill="#16A34A" opacity="0.5" />
    {/* Windows */}
    <rect x="42" y="42" width="8" height="8" rx="1" fill="#16A34A" opacity="0.15" stroke="#16A34A" strokeWidth="0.8" />
    <rect x="70" y="42" width="8" height="8" rx="1" fill="#16A34A" opacity="0.15" stroke="#16A34A" strokeWidth="0.8" />
    {/* Arrow indicating change/movement */}
    <path d="M14 50 L26 50" stroke="#16A34A" strokeWidth="2" opacity="0.4" />
    <path d="M22 46 L26 50 L22 54" fill="none" stroke="#16A34A" strokeWidth="2" opacity="0.4" />
    {/* Pin marker */}
    <circle cx="100" cy="28" r="6" fill="#16A34A" opacity="0.2" stroke="#16A34A" strokeWidth="1" />
    <circle cx="100" cy="28" r="2" fill="#16A34A" opacity="0.5" />
    <path d="M100 34 L100 42" stroke="#16A34A" strokeWidth="1" opacity="0.3" />
  </svg>
);

const ThumbnailINPS: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className, style }) => (
  <svg className={className} style={style} viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img">
    <rect width="120" height="80" rx="8" fill="#FFF7ED" />
    {/* Family/people group */}
    <circle cx="48" cy="30" r="7" fill="#EA580C" opacity="0.15" />
    <circle cx="48" cy="26" r="4" fill="#EA580C" opacity="0.3" />
    <path d="M38 40 C38 34 42 31 48 31 C54 31 58 34 58 40" fill="#EA580C" opacity="0.15" />
    {/* Child */}
    <circle cx="68" cy="32" r="5" fill="#EA580C" opacity="0.15" />
    <circle cx="68" cy="29" r="3" fill="#EA580C" opacity="0.25" />
    <path d="M61 38 C61 34 64 32 68 32 C72 32 75 34 75 38" fill="#EA580C" opacity="0.12" />
    {/* Euro coin */}
    <circle cx="58" cy="56" r="12" fill="#EA580C" opacity="0.1" stroke="#EA580C" strokeWidth="1.5" />
    <text x="54" y="61" fontSize="14" fill="#EA580C" opacity="0.5" fontFamily="serif" fontWeight="bold">E</text>
    {/* Document/form */}
    <rect x="82" y="20" width="24" height="30" rx="2" fill="white" stroke="#EA580C" strokeWidth="1" opacity="0.4" />
    <rect x="86" y="26" width="16" height="2" rx="1" fill="#EA580C" opacity="0.2" />
    <rect x="86" y="31" width="12" height="2" rx="1" fill="#EA580C" opacity="0.15" />
    <rect x="86" y="36" width="14" height="2" rx="1" fill="#EA580C" opacity="0.15" />
    <rect x="86" y="41" width="10" height="2" rx="1" fill="#EA580C" opacity="0.1" />
  </svg>
);

const ThumbnailBonusNido: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className, style }) => (
  <svg className={className} style={style} viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img">
    <rect width="120" height="80" rx="8" fill="#FDF4FF" />
    {/* Building/school shape */}
    <rect x="30" y="28" width="60" height="36" rx="3" fill="#9333EA" opacity="0.08" stroke="#9333EA" strokeWidth="1.2" />
    {/* Roof */}
    <path d="M26 28 L60 14 L94 28" fill="none" stroke="#9333EA" strokeWidth="1.5" opacity="0.3" />
    {/* Windows */}
    <rect x="38" y="36" width="8" height="8" rx="1" fill="#9333EA" opacity="0.15" />
    <rect x="56" y="36" width="8" height="8" rx="1" fill="#9333EA" opacity="0.15" />
    <rect x="74" y="36" width="8" height="8" rx="1" fill="#9333EA" opacity="0.15" />
    {/* Door */}
    <rect x="54" y="50" width="12" height="14" rx="1" fill="#9333EA" opacity="0.2" />
    {/* Small child icon */}
    <circle cx="60" cy="22" r="3" fill="#9333EA" opacity="0.25" />
    {/* Coin/money with checkmark */}
    <circle cx="100" cy="60" r="8" fill="#9333EA" opacity="0.1" stroke="#9333EA" strokeWidth="1" />
    <path d="M96 60 L99 63 L105 57" fill="none" stroke="#9333EA" strokeWidth="1.5" opacity="0.5" />
  </svg>
);

const ThumbnailDifferenze: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className, style }) => (
  <svg className={className} style={style} viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img">
    <rect width="120" height="80" rx="8" fill="#F5F3FF" />
    {/* Left: Shield (SPID) */}
    <path d="M36 20 L50 26 L50 38 C50 46 44 50 36 54 C28 50 22 46 22 38 L22 26 Z" fill="#4F6AE8" opacity="0.15" stroke="#4F6AE8" strokeWidth="1.2" />
    <circle cx="36" cy="34" r="3" fill="#4F6AE8" opacity="0.4" />
    <path d="M30 42 C30 39 32 37 36 37 C40 37 42 39 42 42" fill="#4F6AE8" opacity="0.25" />
    {/* Right: Card (CIE) */}
    <rect x="68" y="22" width="34" height="22" rx="3" fill="#2563EB" opacity="0.1" stroke="#2563EB" strokeWidth="1.2" />
    <rect x="72" y="27" width="8" height="6" rx="1" fill="#EAB308" opacity="0.4" />
    <rect x="84" y="28" width="14" height="2" rx="1" fill="#2563EB" opacity="0.2" />
    <rect x="84" y="33" width="10" height="2" rx="1" fill="#2563EB" opacity="0.15" />
    {/* VS / comparison arrows */}
    <path d="M52 40 L68 40" stroke="#6D28D9" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.4" />
    <path d="M56 36 L52 40 L56 44" fill="none" stroke="#6D28D9" strokeWidth="1.2" opacity="0.4" />
    <path d="M64 36 L68 40 L64 44" fill="none" stroke="#6D28D9" strokeWidth="1.2" opacity="0.4" />
    {/* Checklist at bottom */}
    <rect x="30" y="58" width="60" height="14" rx="2" fill="#6D28D9" opacity="0.06" />
    <rect x="36" y="62" width="20" height="2" rx="1" fill="#6D28D9" opacity="0.2" />
    <rect x="36" y="67" width="14" height="2" rx="1" fill="#6D28D9" opacity="0.15" />
    <path d="M76 62 L79 65 L84 60" fill="none" stroke="#6D28D9" strokeWidth="1.5" opacity="0.4" />
  </svg>
);

const ThumbnailProblemiSPID: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className, style }) => (
  <svg className={className} style={style} viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img">
    <rect width="120" height="80" rx="8" fill="#FEF2F2" />
    {/* Shield with warning */}
    <path d="M60 14 L80 24 L80 40 C80 52 72 60 60 64 C48 60 40 52 40 40 L40 24 Z" fill="#DC2626" opacity="0.08" stroke="#DC2626" strokeWidth="1.5" />
    {/* Exclamation mark */}
    <rect x="58" y="28" width="4" height="16" rx="2" fill="#DC2626" opacity="0.5" />
    <circle cx="60" cy="50" r="2.5" fill="#DC2626" opacity="0.5" />
    {/* Wrench/tool */}
    <circle cx="92" cy="24" r="6" fill="none" stroke="#DC2626" strokeWidth="1.2" opacity="0.3" />
    <line x1="96" y1="28" x2="104" y2="36" stroke="#DC2626" strokeWidth="1.5" opacity="0.3" />
    {/* Checkmark indicating resolution */}
    <circle cx="92" cy="60" r="8" fill="#16A34A" opacity="0.1" stroke="#16A34A" strokeWidth="1.2" />
    <path d="M88 60 L91 63 L97 57" fill="none" stroke="#16A34A" strokeWidth="1.5" opacity="0.5" />
  </svg>
);

const ThumbnailProblemiCIE: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className, style }) => (
  <svg className={className} style={style} viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img">
    <rect width="120" height="80" rx="8" fill="#FFF7ED" />
    {/* Card with warning overlay */}
    <rect x="24" y="20" width="50" height="32" rx="4" fill="#EA580C" opacity="0.08" stroke="#EA580C" strokeWidth="1.2" />
    <rect x="30" y="26" width="10" height="7" rx="1" fill="#EAB308" opacity="0.4" />
    <rect x="44" y="27" width="22" height="2" rx="1" fill="#EA580C" opacity="0.2" />
    <rect x="44" y="32" width="16" height="2" rx="1" fill="#EA580C" opacity="0.15" />
    {/* Warning triangle */}
    <path d="M60 44 L70 60 L50 60 Z" fill="#EA580C" opacity="0.15" stroke="#EA580C" strokeWidth="1.2" />
    <line x1="60" y1="49" x2="60" y2="55" stroke="#EA580C" strokeWidth="1.5" opacity="0.5" />
    <circle cx="60" cy="57" r="1" fill="#EA580C" opacity="0.5" />
    {/* NFC waves */}
    <path d="M88 28 C92 32 92 38 88 42" fill="none" stroke="#EA580C" strokeWidth="1.2" opacity="0.3" />
    <path d="M84 30 C87 33 87 37 84 40" fill="none" stroke="#EA580C" strokeWidth="1.2" opacity="0.3" />
    {/* Checkmark indicating resolution */}
    <circle cx="97" cy="55" r="8" fill="#16A34A" opacity="0.08" />
    <path d="M93 55 L96 58 L102 52" fill="none" stroke="#16A34A" strokeWidth="1.5" opacity="0.4" />
  </svg>
);

const ThumbnailRequisiti: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className, style }) => (
  <svg className={className} style={style} viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img">
    <rect width="120" height="80" rx="8" fill="#F0F9FF" />
    {/* Laptop */}
    <rect x="24" y="18" width="42" height="28" rx="3" fill="#0284C7" opacity="0.08" stroke="#0284C7" strokeWidth="1.2" />
    <rect x="28" y="22" width="34" height="20" rx="1" fill="#0284C7" opacity="0.05" />
    <rect x="16" y="46" width="58" height="4" rx="2" fill="#0284C7" opacity="0.15" />
    {/* Screen content - checkmarks */}
    <path d="M34 28 L37 31 L42 26" fill="none" stroke="#0284C7" strokeWidth="1.5" opacity="0.4" />
    <path d="M34 34 L37 37 L42 32" fill="none" stroke="#0284C7" strokeWidth="1.5" opacity="0.4" />
    {/* Smartphone */}
    <rect x="80" y="22" width="22" height="36" rx="3" fill="#0284C7" opacity="0.08" stroke="#0284C7" strokeWidth="1.2" />
    <rect x="84" y="28" width="14" height="22" rx="1" fill="#0284C7" opacity="0.05" />
    <circle cx="91" cy="54" r="2" fill="#0284C7" opacity="0.15" />
    {/* WiFi/connection */}
    <path d="M52 60 C58 56 64 56 70 60" fill="none" stroke="#0284C7" strokeWidth="1.2" opacity="0.3" />
    <path d="M56 64 C60 62 62 62 66 64" fill="none" stroke="#0284C7" strokeWidth="1.2" opacity="0.3" />
    <circle cx="61" cy="68" r="2" fill="#0284C7" opacity="0.3" />
  </svg>
);

// ─────────────────────────────────────────────────────────
// Fallback / Default Thumbnail
// ─────────────────────────────────────────────────────────

const ThumbnailDefault: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className, style }) => (
  <svg className={className} style={style} viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img">
    <rect width="120" height="80" rx="8" fill="#F8FAFC" />
    {/* Generic document */}
    <rect x="36" y="14" width="48" height="52" rx="3" fill="#64748B" opacity="0.06" stroke="#64748B" strokeWidth="1.2" />
    <rect x="42" y="22" width="28" height="3" rx="1.5" fill="#64748B" opacity="0.15" />
    <rect x="42" y="30" width="36" height="2" rx="1" fill="#64748B" opacity="0.1" />
    <rect x="42" y="36" width="32" height="2" rx="1" fill="#64748B" opacity="0.08" />
    <rect x="42" y="42" width="36" height="2" rx="1" fill="#64748B" opacity="0.08" />
    <rect x="42" y="48" width="24" height="2" rx="1" fill="#64748B" opacity="0.06" />
    <path d="M46 56 L49 59 L55 53" fill="none" stroke="#64748B" strokeWidth="1.5" opacity="0.2" />
  </svg>
);

// ─────────────────────────────────────────────────────────
// Category Icon Map
// ─────────────────────────────────────────────────────────

const CATEGORY_ICON_MAP: Record<string, RadixIcon> = {
  "Identità Digitale": LockClosedIcon,
  "Anagrafe e Stato Civile": HomeIcon,
  "Previdenza e Sostegno": BackpackIcon,
  "Assistenza e Supporto": QuestionMarkCircledIcon,
};

// ─────────────────────────────────────────────────────────
// Service Visual Map
// Maps each service ID to its visual configuration
// ─────────────────────────────────────────────────────────

const SERVICE_VISUAL_MAP: Record<string, ServiceVisual> = {
  // ── Cambio di Residenza ──
  "srv-1": {
    icon: HomeIcon,
    iconLabel: "Cambio di residenza",
    categoryIcon: HomeIcon,
    Thumbnail: ThumbnailResidenza,
    accentColor: "#16A34A",
    accentBg: "#F0FDF4",
  },
  // ── Carta d'Identità Elettronica (richiesta) ──
  "srv-2": {
    icon: IdCardIcon,
    iconLabel: "Carta d'identità elettronica",
    categoryIcon: HomeIcon,
    Thumbnail: ThumbnailCIE,
    accentColor: "#2563EB",
    accentBg: "#F0F7FF",
  },
  // ── Assegno Unico Figli ──
  "srv-3": {
    icon: BackpackIcon,
    iconLabel: "Assegno unico figli a carico",
    categoryIcon: BackpackIcon,
    Thumbnail: ThumbnailINPS,
    accentColor: "#EA580C",
    accentBg: "#FFF7ED",
  },
  // ── Bonus Asilo Nido ──
  "srv-4": {
    icon: BackpackIcon,
    iconLabel: "Bonus asilo nido",
    categoryIcon: BackpackIcon,
    Thumbnail: ThumbnailBonusNido,
    accentColor: "#9333EA",
    accentBg: "#FDF4FF",
  },
  // ── Guida a SPID ──
  "srv-spid": {
    icon: PersonIcon,
    iconLabel: "Identità digitale SPID",
    categoryIcon: LockClosedIcon,
    Thumbnail: ThumbnailSPID,
    accentColor: "#4F6AE8",
    accentBg: "#EEF2FF",
  },
  // ── Guida alla CIE ──
  "srv-cie-digitale": {
    icon: IdCardIcon,
    iconLabel: "Carta d'identità elettronica digitale",
    categoryIcon: LockClosedIcon,
    Thumbnail: ThumbnailCIE,
    accentColor: "#2563EB",
    accentBg: "#F0F7FF",
  },
  // ── Differenze SPID / CIE ──
  "srv-spid-cie-diff": {
    icon: MixIcon,
    iconLabel: "Confronto SPID e CIE",
    categoryIcon: LockClosedIcon,
    Thumbnail: ThumbnailDifferenze,
    accentColor: "#6D28D9",
    accentBg: "#F5F3FF",
  },
  // ── Problemi frequenti SPID ──
  "srv-problemi-spid": {
    icon: ExclamationTriangleIcon,
    iconLabel: "Risoluzione problemi SPID",
    categoryIcon: QuestionMarkCircledIcon,
    Thumbnail: ThumbnailProblemiSPID,
    accentColor: "#DC2626",
    accentBg: "#FEF2F2",
  },
  // ── Problemi frequenti CIE ──
  "srv-problemi-cie": {
    icon: ExclamationTriangleIcon,
    iconLabel: "Risoluzione problemi CIE",
    categoryIcon: QuestionMarkCircledIcon,
    Thumbnail: ThumbnailProblemiCIE,
    accentColor: "#EA580C",
    accentBg: "#FFF7ED",
  },
  // ── Requisiti per SPID/CIE ──
  "srv-servizi-online-req": {
    icon: GearIcon,
    iconLabel: "Requisiti tecnici per i servizi online",
    categoryIcon: LockClosedIcon,
    Thumbnail: ThumbnailRequisiti,
    accentColor: "#0284C7",
    accentBg: "#F0F9FF",
  },
};

// ─────────────────────────────────────────────────────────
// Default fallback visual
// ─────────────────────────────────────────────────────────

const DEFAULT_VISUAL: ServiceVisual = {
  icon: LightningBoltIcon,
  iconLabel: "Servizio pubblico",
  categoryIcon: LightningBoltIcon,
  Thumbnail: ThumbnailDefault,
  accentColor: "#64748B",
  accentBg: "#F8FAFC",
};

// ─────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────

/**
 * Returns the visual configuration (icon, thumbnail, accent colors)
 * for a given service ID. Falls back to a neutral default if the ID
 * is not mapped.
 */
export function getServiceVisual(serviceId: string): ServiceVisual {
  return SERVICE_VISUAL_MAP[serviceId] ?? DEFAULT_VISUAL;
}

/**
 * Returns the appropriate category icon for a given category string.
 */
export function getCategoryIcon(category: string): RadixIcon {
  return CATEGORY_ICON_MAP[category] ?? LightningBoltIcon;
}

// Also map percorso IDs to service IDs for the PaginaGuida view
const PERCORSO_TO_SERVICE_MAP: Record<string, string> = {
  "percorso-1": "srv-2",        // CIE
  "percorso-2": "srv-3",        // Assegno Unico
  "percorso-3": "srv-1",        // Cambio Residenza
  "percorso-spid": "srv-spid",  // SPID
  "percorso-cie": "srv-cie-digitale", // CIE digitale
};

/**
 * Returns the visual configuration for a Percorso ID by mapping it
 * to the corresponding service visual.
 */
export function getPercorsoVisual(percorsoId: string): ServiceVisual {
  const serviceId = PERCORSO_TO_SERVICE_MAP[percorsoId];
  if (serviceId) {
    return getServiceVisual(serviceId);
  }
  return DEFAULT_VISUAL;
}
