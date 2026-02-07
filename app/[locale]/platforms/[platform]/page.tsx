import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { getGuidesByPlatform } from '@/lib/guides';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import platformsData from '@/data/platforms.json';
import type { Platform } from '@/types';

interface PlatformPageProps {
  params: {
    locale: 'ko' | 'en';
    platform: string;
  };
}

export async function generateStaticParams() {
  const platforms = platformsData.map((p) => p.id);
  const locales = ['ko', 'en'];

  return platforms.flatMap((platform) =>
    locales.map((locale) => ({ platform, locale }))
  );
}

export default async function PlatformPage({ params }: PlatformPageProps) {
  const { locale, platform } = params;
  setRequestLocale(locale);

  const platformData = platformsData.find((p) => p.id === platform);
  if (!platformData) {
    notFound();
  }

  const guides = await getGuidesByPlatform(platform as Platform, locale);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{platformData.name}</h1>
          <p className="text-xl text-muted-foreground mb-4">
            {platformData.description[locale]}
          </p>

          {platformData.freeCredit && (
            <div className="bg-muted p-4 rounded-lg inline-block">
              <div className="font-semibold text-primary">
                {platformData.freeCredit.amount}{' '}
                {locale === 'ko' ? '무료 크레딧' : 'Free Credit'}
              </div>
              <div className="text-sm text-muted-foreground">
                {platformData.freeCredit.duration}
              </div>
            </div>
          )}
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">
            {locale === 'ko' ? '사용 가능한 가이드' : 'Available Guides'}{' '}
            <span className="text-muted-foreground">({guides.length})</span>
          </h2>
        </div>

        {guides.length > 0 ? (
          <div className="space-y-4">
            {guides.map((guide) => (
              <Link key={guide.slug} href={`/${locale}/guides/${guide.slug}`}>
                <Card className="hover:border-primary transition-colors cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="mb-2">{guide.seo[locale].title}</CardTitle>
                        <CardDescription>{guide.seo[locale].description}</CardDescription>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Badge variant="secondary">{guide.difficulty}</Badge>
                        <Badge variant="outline">{guide.estimatedMinutes} min</Badge>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            {locale === 'ko'
              ? '아직 이 플랫폼의 가이드가 없습니다. 곧 추가될 예정입니다!'
              : 'No guides available for this platform yet. Coming soon!'}
          </div>
        )}
      </div>
    </main>
  );
}
