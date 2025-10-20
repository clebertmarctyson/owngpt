export const AI_MODELS = [
  { id: "1", value: "llama3:13b", name: "Llama 3 13B" },
  { id: "2", value: "llama3:8b", name: "Llama 3 8B" },
  { id: "3", value: "llama3:7b", name: "Llama 3 7B" },
] as const;

export const DEFAULT_MODEL = AI_MODELS[1].value;

export const APP_CONFIG = {
  name: "OwnGPT",
  recentConversationsLimit: 20,
} as const;

export const BASE_API_URL = "/api";

export const API_ENDPOINTS = {
  chat: `${BASE_API_URL}/chat`,
  conversations: `${BASE_API_URL}/conversations`,
} as const;
