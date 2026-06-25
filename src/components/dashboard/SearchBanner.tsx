import React from "react";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

interface SearchBannerProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

/**
 * Componente per la barra di ricerca centrale per trovare guide e orientamento ai servizi pubblici.
 */
export const SearchBanner: React.FC<SearchBannerProps> = ({
  searchQuery,
  setSearchQuery,
  onSubmit
}) => {
  return (
    <div className="card w-full mb-lg" style={{ padding: "var(--space-lg)", backgroundColor: "var(--color-primary-light)", border: "1px solid var(--color-info-border)" }}>
      <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--color-primary)", marginBottom: "var(--space-sm)" }}>
        Quale servizio o adempimento devi svolgere?
      </h3>
      <form onSubmit={onSubmit} className="search-wrapper" style={{ maxWidth: "600px" }}>
        <label htmlFor="search-home" className="sr-only">Cerca servizi o guide</label>
        <MagnifyingGlassIcon className="search-icon-inside" aria-hidden="true" />
        <input
          id="search-home"
          type="text"
          className="search-input"
          style={{ backgroundColor: "var(--color-surface)" }}
          placeholder="Es. Rinnovo Carta d'Identità, Cambio di Residenza, Assegno Unico..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </form>
      <p style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)", marginTop: "var(--space-sm)" }}>
        Digita una parola chiave per trovare la pagina guida corretta con i requisiti, i documenti necessari e i link ai portali ufficiali.
      </p>
    </div>
  );
};
