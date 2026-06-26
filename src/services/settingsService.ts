export interface AISettings {
  ollamaEndpoint: string;
  qwenModel: string;
  qwenTimeout: number;
  useQwenRewriting: boolean;
  // Nuove impostazioni di sicurezza AI
  safeMode: boolean;
  protectionLevel: "standard" | "strict";
}

const STORAGE_KEY = "sdit_ai_settings";

const DEFAULT_SETTINGS: AISettings = {
  ollamaEndpoint: "http://localhost:11434",
  qwenModel: "qwen2-7b",
  qwenTimeout: 30000,
  useQwenRewriting: true,
  safeMode: true,
  protectionLevel: "standard",
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
