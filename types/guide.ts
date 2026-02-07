export type Platform =
  | 'gcp'
  | 'aws'
  | 'azure'
  | 'supabase'
  | 'vercel'
  | 'cloudflare'
  | 'firebase';

export type Category =
  | 'ai-ml'
  | 'compute'
  | 'database'
  | 'storage'
  | 'auth'
  | 'maps'
  | 'cdn'
  | 'monitoring'
  | 'general';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export type FreeTierStatus = 'generous' | 'moderate' | 'limited' | 'none';

export interface FreeTierInfo {
  service: string;
  limit: string;
  period: 'month' | 'year' | 'forever' | 'trial';
  amount?: string;
  status: FreeTierStatus;
  conditions?: string[];
}

export interface GuideSEO {
  title: string;
  description: string;
  keywords: string[];
}

export interface GuideMeta {
  slug: string;
  platform: Platform;
  service: string;
  category: Category;
  difficulty: Difficulty;
  estimatedMinutes: number;
  totalSteps: number;
  freeTier?: FreeTierInfo;
  prerequisites?: string[];
  nextGuides?: string[];
  seo: {
    ko: GuideSEO;
    en: GuideSEO;
  };
  createdAt: string;
  updatedAt: string;
  lastVerified: string;
  published: boolean;
}

export interface Guide {
  meta: GuideMeta;
  content: string;
  locale: 'ko' | 'en';
}

export interface GuideProgress {
  guideSlug: string;
  completedSteps: number[];
  lastAccessedAt: string;
  completed: boolean;
}
