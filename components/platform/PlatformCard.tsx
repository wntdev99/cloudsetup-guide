import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { PlatformData } from '@/types';

interface PlatformCardProps {
  platform: PlatformData;
  locale: 'ko' | 'en';
}

export function PlatformCard({ platform, locale }: PlatformCardProps) {
  return (
    <Link href={`/${locale}/platforms/${platform.id}`}>
      <Card className="h-full hover:border-primary transition-colors cursor-pointer">
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <CardTitle className="text-xl">{platform.name}</CardTitle>
            {platform.guideCount > 0 && (
              <Badge variant="secondary">{platform.guideCount} guides</Badge>
            )}
          </div>
          <CardDescription>{platform.description[locale]}</CardDescription>
        </CardHeader>
        {platform.freeCredit && (
          <CardContent>
            <div className="text-sm bg-muted p-3 rounded-lg">
              <div className="font-semibold text-primary">{platform.freeCredit.amount} {locale === 'ko' ? '무료 크레딧' : 'Free Credit'}</div>
              <div className="text-muted-foreground">{platform.freeCredit.duration}</div>
            </div>
          </CardContent>
        )}
      </Card>
    </Link>
  );
}
