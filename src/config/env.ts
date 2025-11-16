import {API_BASE_URL as ENV_API_BASE_URL} from '@env';

if (!ENV_API_BASE_URL) {
  console.warn('⚠️ API_BASE_URL not found');
}
export const API_BASE_URL = ENV_API_BASE_URL || '';
