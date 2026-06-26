import { SettingsService } from "../services/settingsService";

export interface ProviderOptions {
  temperature?: number;
  systemPrompt?: string;
  timeout?: number;
}

export class PhiProvider {
  /**
   * Generates a completion from the local Phi model using Ollama.
   * Handles timeout and network/model presence errors.
   */
  static async generateWithPhi(
    messages: { role: string; content: string }[],
    options: ProviderOptions = {}
  ): Promise<{ text: string; durationMs: number }> {
    const settings = SettingsService.getSettings();
    const endpoint = settings.ollamaEndpoint;
    const model = settings.phiModel;
    const timeoutMs = options.timeout ?? settings.phiTimeout;
    const temp = options.temperature ?? 0.1;

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
          throw new Error(`MODEL_NOT_FOUND: Il modello Phi '${model}' non è installato in Ollama. Esegui 'ollama pull ${model}' nel terminale.`);
        }
        throw new Error(`API_ERROR: Risposta del server non valida (${response.status}): ${errorText}`);
      }

      const data = await response.json();
      const text = data.message?.content || "";
      return { text, durationMs };
    } catch (e: any) {
      clearTimeout(id);

      if (e.name === "AbortError") {
        throw new Error(`TIMEOUT: Richiesta a Phi interrotta dopo ${timeoutMs}ms.`);
      }

      if (e.message?.startsWith("MODEL_NOT_FOUND") || e.message?.startsWith("API_ERROR")) {
        throw e;
      }

      // Ollama service offline or CORS issues
      throw new Error(`OFFLINE: Impossibile connettersi a Ollama su ${endpoint}. Assicurati che l'applicazione Ollama sia in esecuzione.`);
    }
  }
}
