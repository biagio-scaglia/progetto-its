export interface AISettings {
  ollamaEndpoint: string;
  phiModel: string;
  qwenModel: string;
  phiTimeout: number;
  qwenTimeout: number;
  useQwenComplex: boolean;
  useQwenRewriting: boolean;
  modelMode: "auto" | "phi" | "qwen";
  // Nuove impostazioni di sicurezza AI
  safeMode: boolean;
  protectionLevel: "standard" | "strict";
  useQwenSecondOpinion: boolean;
}

const STORAGE_KEY = "sdit_ai_settings";

const DEFAULT_SETTINGS: AISettings = {
  ollamaEndpoint: "http://localhost:11434",
  phiModel: "phi3.5-mini-ita",
  qwenModel: "qwen2-7b",
  phiTimeout: 15000,
  qwenTimeout: 30000,
  useQwenComplex: true,
  useQwenRewriting: true,
  modelMode: "auto",
  safeMode: true,
  protectionLevel: "standard",
  useQwenSecondOpinion: true,
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
