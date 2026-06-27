export interface AISettings {
  ollamaEndpoint: string;
  qwenModel: string;
  qwenTimeout: number;
  embeddingModel: string;
  useQwenRewriting: boolean;
  // Nuove impostazioni di sicurezza AI
  safeMode: boolean;
  protectionLevel: "standard" | "strict";
  // Nuove impostazioni per Llama.cpp e Caching
  llmProvider: "ollama" | "llama.cpp";
  llamaCppEndpoint: string;
  enableExactCache: boolean;
  enableSemanticCache: boolean;
  semanticSimilarityThreshold: number;
  cacheTtlMs: number;
}

const STORAGE_KEY = "sdit_ai_settings";

const DEFAULT_SETTINGS: AISettings = {
  ollamaEndpoint: "http://localhost:11434",
  qwenModel: "qwen2-7b",
  qwenTimeout: 90000,
  embeddingModel: "bge-m3",
  useQwenRewriting: true,
  safeMode: true,
  protectionLevel: "standard",
  llmProvider: "ollama",
  llamaCppEndpoint: "http://localhost:8080",
  enableExactCache: true,
  enableSemanticCache: true,
  semanticSimilarityThreshold: 0.85,
  cacheTtlMs: 24 * 60 * 60 * 1000, // 24 ore
};

export class SettingsService {
  static getSettings(): AISettings {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS));
        return DEFAULT_SETTINGS;
      }
      
      const parsed = JSON.parse(stored);
      // Migrate old 30s timeout to 90s to prevent local execution timeouts
      if (parsed.qwenTimeout === 30000 || !parsed.qwenTimeout) {
        parsed.qwenTimeout = 90000;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
      }
      
      // Merge with defaults to ensure compatibility if fields are missing
      return {
        ...DEFAULT_SETTINGS,
        ...parsed,
      };
    } catch (e) {
      console.error("Error reading AI settings:", e);
      return DEFAULT_SETTINGS;
    }
  }

  static saveSettings(settings: Partial<AISettings>): AISettings {
    try {
      const current = this.getSettings();
      const updated = {
        ...current,
        ...settings,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error("Error saving AI settings:", e);
      return { ...DEFAULT_SETTINGS, ...settings };
    }
  }

  static resetSettings(): AISettings {
    this.saveSettings(DEFAULT_SETTINGS);
    return DEFAULT_SETTINGS;
  }
}
