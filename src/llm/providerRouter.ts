import { SettingsService } from "../services/settingsService";
import { OllamaProvider } from "./ollamaProvider";
import { LlamaCppProvider } from "./llamaCppProvider";
import { ProviderOptions } from "../providers/qwenProvider";

export class ProviderRouter {
  /**
   * Router mapping to active provider config.
   */
  static async generate(
    messages: { role: string; content: string }[],
    options: ProviderOptions = {}
  ): Promise<{ text: string; durationMs: number; providerUsed: string }> {
    const settings = SettingsService.getSettings();
    const provider = settings.llmProvider || "ollama";

    if (provider === "llama.cpp") {
      console.log(`[ProviderRouter] Routing request to llama.cpp (${settings.llamaCppEndpoint})`);
      const res = await LlamaCppProvider.generateWithLlamaCpp(messages, options);
      return { ...res, providerUsed: "llama.cpp" };
    } else {
      console.log(`[ProviderRouter] Routing request to Ollama (${settings.ollamaEndpoint})`);
      const res = await OllamaProvider.generateWithOllama(messages, options);
      return { ...res, providerUsed: "ollama" };
    }
  }
}
