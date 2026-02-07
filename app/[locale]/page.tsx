import { setRequestLocale } from 'next-intl/server';
import { SearchBar } from '@/components/common/SearchBar';
import { PlatformCard } from '@/components/platform/PlatformCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import platformsData from '@/data/platforms.json';

export default function HomePage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);

  return (
    <main>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-background to-muted/20 py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">
              {locale === 'ko' ? '클라우드 API 세팅, 이제 쉽게' : 'Cloud API Setup Made Easy'}
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              {locale === 'ko'
                ? '스크린샷과 함께 따라하는 단계별 가이드. GCP, AWS, Supabase 등 무료로 시작하세요.'
                : 'Step-by-step guides with screenshots. Start free with GCP, AWS, Supabase, and more.'}
            </p>
            <div className="mb-8">
              <SearchBar />
            </div>
            <div className="flex gap-4 justify-center">
              <Link href={`/${locale}/guides`}>
                <Button size="lg">{locale === 'ko' ? '가이드 둘러보기' : 'Browse Guides'}</Button>
              </Link>
              <Link href={`/${locale}/platforms`}>
                <Button size="lg" variant="outline">
                  {locale === 'ko' ? '플랫폼 보기' : 'View Platforms'}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Platforms Section */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              {locale === 'ko' ? '지원하는 플랫폼' : 'Supported Platforms'}
            </h2>
            <p className="text-muted-foreground">
              {locale === 'ko'
                ? '주요 클라우드 플랫폼의 API 세팅 가이드를 제공합니다'
                : 'We provide API setup guides for major cloud platforms'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {platformsData.map((platform) => (
              <PlatformCard key={platform.id} platform={platform as any} locale={locale as 'ko' | 'en'} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/20">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="text-4xl mb-4">📸</div>
              <h3 className="font-semibold mb-2">
                {locale === 'ko' ? '스크린샷으로 쉽게' : 'Easy with Screenshots'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {locale === 'ko'
                  ? '모든 단계마다 실제 화면을 보여드립니다'
                  : 'Every step includes actual screenshots'}
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="font-semibold mb-2">
                {locale === 'ko' ? '무료 한도 정보' : 'Free Tier Info'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {locale === 'ko'
                  ? '각 서비스의 무료 한도를 명확하게 안내합니다'
                  : 'Clear information about free tier limits'}
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🌏</div>
              <h3 className="font-semibold mb-2">
                {locale === 'ko' ? '한국어 지원' : 'Korean Support'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {locale === 'ko'
                  ? '한국어와 영어로 제공됩니다'
                  : 'Available in Korean and English'}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
