import type { Platform } from './guide';

export interface PlatformFreeCredit {
  amount: string;
  duration: string;
  conditions: string[];
}

export interface PlatformData {
  id: Platform;
  name: string;
  logo: string;
  description: {
    ko: string;
    en: string;
  };
  freeCredit?: PlatformFreeCredit;
  website: string;
  docsUrl: string;
  guideCount: number;
}

export interface CategoryData {
  id: string;
  name: {
    ko: string;
    en: string;
  };
  description: {
    ko: string;
    en: string;
  };
  icon: string;
}
