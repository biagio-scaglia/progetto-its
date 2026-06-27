import { SettingsService } from "../services/settingsService";
import { COPY_ERRORS } from "../config/microcopy";
import { ProviderOptions } from "../providers/qwenProvider";

export class LlamaCppProvider {
  /**
   * Generates a completion using a local llama.cpp server.
   * Leverages prompt caching ("cache_prompt": true).
   */
  static async generateWithLlamaCpp(
    messages: { role: string; content: string }[],
    options: ProviderOptions = {}
  ): Promise<{ text: string; durationMs: number }> {
    const settings = SettingsService.getSettings();
    const endpoint = settings.llamaCppEndpoint || "http://localhost:8080";
    const timeoutMs = options.timeout ?? settings.qwenTimeout;
    const temp = options.temperature ?? 0.2;

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);

    const formattedMessages = [...messages];
    if (options.systemPrompt) {
      formattedMessages.unshift({ role: "system", content: options.systemPrompt });
    }

    const startTime = Date.now();

    try {
      const response = await fetch(`${endpoint}/v1/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: formattedMessages,
          temperature: temp,
          cache_prompt: true, // Tell llama.cpp to reuse KV cache
        }),
        signal: controller.signal,
      });

      clearTimeout(id);
      const durationMs = Date.now() - startTime;

      if (!response.ok) {
        throw new Error(COPY_ERRORS.apiError(response.status));
      }

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content || "";
      return { text, durationMs };
    } catch (e: any) {
      clearTimeout(id);

      if (e.name === "AbortError") {
        throw new Error(COPY_ERRORS.timeout);
      }

      throw new Error(COPY_ERRORS.offline);
    }
  }
}
