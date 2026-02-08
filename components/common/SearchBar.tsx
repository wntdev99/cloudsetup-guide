'use client';

import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { search, type SearchResult } from '@/lib/pagefind';
import Link from 'next/link';

// Remove HTML tags from search excerpts to prevent XSS
function stripHtmlTags(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Handle search with debounce
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (query.length >= 2) {
        setIsSearching(true);
        const searchResults = await search(query);
        setResults(searchResults);
        setIsSearching(false);
        setShowResults(true);
      } else {
        setResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  // Handle clicks outside to close results
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="w-full max-w-2xl relative">
      <Input
        type="search"
        placeholder="Search guides... (e.g., 'GCP Vision API')"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => query.length >= 2 && setShowResults(true)}
        className="h-12 text-lg"
      />

      {showResults && (
        <Card className="absolute top-full mt-2 w-full max-h-96 overflow-y-auto z-50">
          {isSearching ? (
            <div className="p-4 text-center text-muted-foreground">Searching...</div>
          ) : results.length > 0 ? (
            <div className="divide-y">
              {results.map((result) => (
                <Link key={result.id} href={result.url} className="block p-4 hover:bg-muted">
                  <div className="font-semibold mb-1">{result.title}</div>
                  <div className="text-sm text-muted-foreground line-clamp-2">
                    {stripHtmlTags(result.excerpt)}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-muted-foreground">No results found</div>
          )}
        </Card>
      )}
    </div>
  );
}
