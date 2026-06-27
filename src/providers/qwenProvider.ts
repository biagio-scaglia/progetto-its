import { SettingsService } from "../services/settingsService";
import { COPY_ERRORS } from "../config/microcopy";

export interface ProviderOptions {
  temperature?: number;
  systemPrompt?: string;
  timeout?: number;
}

export class QwenProvider {
  /**
   * Generates a completion from the local Qwen model using Ollama.
   * Handles timeout and network/model presence errors.
   */
  static async generateWithQwen(
    messages: { role: string; content: string }[],
    options: ProviderOptions = {}
  ): Promise<{ text: string; durationMs: number }> {
    const settings = SettingsService.getSettings();
    const endpoint = settings.ollamaEndpoint;
    const model = settings.qwenModel;
    const timeoutMs = options.timeout ?? settings.qwenTimeout;
    const temp = options.temperature ?? 0.2; // slightly higher temp for Qwen to allow richer synthesis

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);

    const formattedMessages = [...messages];
    if (options.systemPrompt) {
      formattedMessages.unshift({ role: "system", content: options.systemPrompt });
    }

    const startTime = Date.now();

    try {
      const response = await fetch(`${endpoint}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages: formattedMessages,
          stream: false,
          options: {
            temperature: temp,
          },
        }),
        signal: controller.signal,
      });

      clearTimeout(id);
      const durationMs = Date.now() - startTime;

      if (!response.ok) {
        const errorText = await response.text();
        if (response.status === 404 || errorText.includes("not found")) {
          throw new Error(COPY_ERRORS.modelNotFound(model));
        }
        throw new Error(COPY_ERRORS.apiError(response.status));
      }

      const data = await response.json();
      const text = data.message?.content || "";
      return { text, durationMs };
    } catch (e: any) {
      clearTimeout(id);

      if (e.name === "AbortError") {
        throw new Error(COPY_ERRORS.timeout);
      }

      if (e.message?.startsWith("Il motore di risposta")) {
        throw e;
      }

      // Ollama service offline or CORS issues
      throw new Error(COPY_ERRORS.offline);
    }
  }
}
