// Type definitions for Pagefind static search library
// https://pagefind.app/

export interface PagefindSearchResult {
  id: string;
  score: number;
  data: () => Promise<PagefindResultData>;
}

export interface PagefindResultData {
  url: string;
  excerpt: string;
  content: string;
  word_count: number;
  filters: Record<string, string[]>;
  meta?: {
    title?: string;
    description?: string;
    image?: string;
    [key: string]: string | undefined;
  };
  anchors?: Array<{
    id: string;
    text: string;
    location: number;
  }>;
  weighted_locations?: Array<{
    weight: number;
    location: number;
    balanced_score: number;
  }>;
}

export interface PagefindSearchResults {
  results: PagefindSearchResult[];
  unfilteredResultCount: number;
  filters: Record<string, Record<string, number>>;
  totalFilters: Record<string, Record<string, number>>;
  timings: {
    preload: number;
    search: number;
    total: number;
  };
}

export interface PagefindInstance {
  search: (query: string, options?: PagefindSearchOptions) => Promise<PagefindSearchResults>;
  filters: () => Promise<Record<string, Record<string, number>>>;
  init: () => Promise<void>;
  destroy: () => void;
}

export interface PagefindSearchOptions {
  filters?: Record<string, string | string[]>;
  sort?: Record<string, 'asc' | 'desc'>;
  verbose?: boolean;
}
