import { Badge } from '@/components/ui/badge';
import type { GuideMeta } from '@/types';

interface GuideHeaderProps {
  meta: GuideMeta;
  locale: 'ko' | 'en';
}

export function GuideHeader({ meta, locale }: GuideHeaderProps) {
  const difficultyLabels = {
    beginner: locale === 'ko' ? '초급' : 'Beginner',
    intermediate: locale === 'ko' ? '중급' : 'Intermediate',
    advanced: locale === 'ko' ? '고급' : 'Advanced',
  };

  return (
    <div className="mb-8 pb-8 border-b">
      <div className="flex items-center gap-2 mb-4">
        <Badge variant="outline">{meta.platform.toUpperCase()}</Badge>
        <Badge variant="secondary">{meta.category}</Badge>
        <Badge>{difficultyLabels[meta.difficulty]}</Badge>
      </div>

      <h1 className="text-4xl font-bold mb-4">{meta.seo[locale].title}</h1>
      <p className="text-xl text-muted-foreground mb-6">{meta.seo[locale].description}</p>

      <div className="flex flex-wrap gap-6 text-sm">
        <div>
          <span className="text-muted-foreground">
            {locale === 'ko' ? '예상 시간' : 'Estimated Time'}:
          </span>{' '}
          <span className="font-semibold">{meta.estimatedMinutes} {locale === 'ko' ? '분' : 'min'}</span>
        </div>
        <div>
          <span className="text-muted-foreground">
            {locale === 'ko' ? '총 단계' : 'Total Steps'}:
          </span>{' '}
          <span className="font-semibold">{meta.totalSteps}</span>
        </div>
        <div>
          <span className="text-muted-foreground">
            {locale === 'ko' ? '마지막 검증' : 'Last Verified'}:
          </span>{' '}
          <span className="font-semibold">
            {new Date(meta.lastVerified).toLocaleDateString(locale)}
          </span>
        </div>
      </div>
    </div>
  );
}
