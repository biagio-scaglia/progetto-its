import { QwenProvider } from "../providers/qwenProvider";
import { ProviderOptions } from "../providers/qwenProvider";

export class OllamaProvider {
  /**
   * Wrapper around existing Qwen/Ollama provider.
   */
  static async generateWithOllama(
    messages: { role: string; content: string }[],
    options: ProviderOptions = {}
  ): Promise<{ text: string; durationMs: number }> {
    return QwenProvider.generateWithQwen(messages, options);
  }
}
