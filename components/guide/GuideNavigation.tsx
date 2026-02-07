import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface GuideNavigationProps {
  prevSlug?: string;
  nextSlug?: string;
  locale: 'ko' | 'en';
}

export function GuideNavigation({ prevSlug, nextSlug, locale }: GuideNavigationProps) {
  return (
    <div className="flex justify-between items-center py-8 border-t">
      <div>
        {prevSlug && (
          <Link href={`/${locale}/guides/${prevSlug}`}>
            <Button variant="outline">
              ← {locale === 'ko' ? '이전 가이드' : 'Previous Guide'}
            </Button>
          </Link>
        )}
      </div>
      <div>
        {nextSlug && (
          <Link href={`/${locale}/guides/${nextSlug}`}>
            <Button>
              {locale === 'ko' ? '다음 가이드' : 'Next Guide'} →
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
