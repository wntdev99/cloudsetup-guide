import type { Platform, Category } from '@/types';
import { env } from './env';

export const PLATFORMS: Platform[] = [
  'gcp',
  'aws',
  'azure',
  'supabase',
  'vercel',
  'cloudflare',
  'firebase',
];

export const CATEGORIES: Category[] = [
  'ai-ml',
  'compute',
  'database',
  'storage',
  'auth',
  'maps',
  'cdn',
  'monitoring',
  'general',
];

export const LOCALES = ['ko', 'en'] as const;
export const DEFAULT_LOCALE = 'ko';

// Use validated environment variable from env.ts
export const SITE_URL = env.SITE_URL;
