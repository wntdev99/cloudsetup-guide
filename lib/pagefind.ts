let pagefind: any = null;

export async function initPagefind() {
  if (typeof window === 'undefined') return null;
  if (pagefind) return pagefind;

  try {
    // @ts-ignore
    pagefind = await import(/* webpackIgnore: true */ '/pagefind/pagefind.js');
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
    const search = await pf.search(query);
    const results = await Promise.all(
      search.results.slice(0, 10).map(async (r: any) => {
        const data = await r.data();
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
