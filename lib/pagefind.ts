import type { PagefindInstance, PagefindSearchResult } from '@/types/pagefind';

let pagefind: PagefindInstance | null = null;

export async function initPagefind(): Promise<PagefindInstance | null> {
  if (typeof window === 'undefined') return null;
  if (pagefind) return pagefind;

  try {
    // Dynamic import of Pagefind library
    // Pagefind is generated at build time and not available during type checking
    // @ts-ignore - webpackIgnore tells webpack to not try to bundle this
    pagefind = (await import(/* webpackIgnore: true */ '/pagefind/pagefind.js')) as unknown as PagefindInstance;
    return pagefind;
  } catch (error) {
    console.warn('Pagefind not loaded:', error);
    return null;
  }
}

export interface SearchResult {
  id: string;
  url: string;
  title: string;
  excerpt: string;
}

export async function search(query: string): Promise<SearchResult[]> {
  const pf = await initPagefind();
  if (!pf) return [];

  try {
    const searchResults = await pf.search(query);
    const results = await Promise.all(
      searchResults.results.slice(0, 10).map(async (result: PagefindSearchResult) => {
        const data = await result.data();
        return {
          id: data.url,
          url: data.url,
          title: data.meta?.title || data.url,
          excerpt: data.excerpt || '',
        };
      })
    );
    return results;
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
}
