'use client';

import { useEffect, useState, useRef } from 'react';

interface TocItem {
  id: string;
  title: string;
  step: number;
}

export function TableOfContents() {
  const [toc, setToc] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState('');
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const headings = document.querySelectorAll('h2[id^="step-"]');
    const items: TocItem[] = [];

    headings.forEach((heading) => {
      const id = heading.id;
      const title = heading.textContent || '';
      const step = parseInt(id.replace('step-', ''), 10);
      if (!isNaN(step)) {
        items.push({ id, title, step });
      }
    });

    setToc(items);

    // Use IntersectionObserver for better performance
    const options: IntersectionObserverInit = {
      root: null,
      rootMargin: '-20% 0px -35% 0px', // Trigger when heading is in upper third of viewport
      threshold: 0,
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    }, options);

    // Observe all headings
    headings.forEach((heading) => {
      observerRef.current?.observe(heading);
    });

    // Cleanup
    return () => {
      if (observerRef.current) {
        headings.forEach((heading) => {
          observerRef.current?.unobserve(heading);
        });
        observerRef.current.disconnect();
      }
    };
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const top = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  if (toc.length === 0) return null;

  return (
    <nav className="hidden lg:block sticky top-32 h-fit">
      <h3 className="font-semibold mb-4">목차</h3>
      <ul className="space-y-2">
        {toc.map((item) => (
          <li key={item.id}>
            <button
              onClick={() => scrollToSection(item.id)}
              className={`text-sm text-left w-full hover:text-primary transition-colors ${
                activeId === item.id ? 'text-primary font-medium' : 'text-muted-foreground'
              }`}
            >
              {item.step}. {item.title}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
