import OpenAI from 'openai';
import {
  OPEN_ROUTER_KEY,
  FRONTEND_URL,
  OPEN_ROUTER_BASE_URL,
  OPEN_ROUTER_APP_TITLE,
} from './env.config.js';

// Global OpenRouter client instance
export const openRouterClient = new OpenAI({
  baseURL: OPEN_ROUTER_BASE_URL,
  apiKey: OPEN_ROUTER_KEY,
  defaultHeaders: {
    'HTTP-Referer': FRONTEND_URL,
    'X-Title': OPEN_ROUTER_APP_TITLE,
  },
});
