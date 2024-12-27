import { BaseProvider } from '~/lib/modules/llm/base-provider';
import type { ModelInfo } from '~/lib/modules/llm/types';
import type { IProviderSetting } from '~/types/model';
import type { LanguageModelV1 } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

export default class OpenAIProvider extends BaseProvider {
  name = 'Jarvis';
  getApiKeyLink = 'https://platform.openai.com/api-keys';

  config = {
    baseUrlKey: 'JARVIS_BASE_URL',
    apiTokenKey:'JARVIS_API_KEY',
  };

  staticModels: ModelInfo[] = [
    { name: 'jarvis-coder', label: 'jarvis-coder', provider: 'Jarvis', maxTokenAllowed: 8000 },
  ];

  getModelInstance(options: {
    model: string;
    serverEnv: Env;
    apiKeys?: Record<string, string>;
    providerSettings?: Record<string, IProviderSetting>;
  }): LanguageModelV1 {

    const { model, serverEnv, apiKeys, providerSettings } = options;


    const { baseUrl, apiKey } = this.getProviderBaseUrlAndKey({
      apiKeys,
      providerSettings: providerSettings?.[this.name],
      serverEnv: serverEnv as any,
      defaultBaseUrlKey: this.config.baseUrlKey,
      defaultApiTokenKey: this.config.apiTokenKey,
    });

    if (!apiKey) {
      throw new Error(`Missing API key for ${this.name} provider`);
    }

    const openai = createOpenAI({
      baseURL: baseUrl,
      apiKey,
    });

    return openai(model);
  }
}
