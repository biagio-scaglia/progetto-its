import { SettingsService, AISettings } from "../services/settingsService";

export class RuntimeSettings {
  /**
   * Helper class to easily read runtime configuration values.
   */
  static getSettings(): AISettings {
    return SettingsService.getSettings();
  }

  static isCacheEnabled(): boolean {
    const settings = this.getSettings();
    return settings.enableExactCache || settings.enableSemanticCache;
  }
}
