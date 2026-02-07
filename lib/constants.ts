import type { Platform, Category } from '@/types';

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

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://cloudsetup.guide';
