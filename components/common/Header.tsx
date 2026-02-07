import Link from 'next/link';
import { useTranslations } from 'next-intl';

export function Header({ locale }: { locale: string }) {
  const t = useTranslations('common');

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href={`/${locale}`} className="font-bold text-xl">
          CloudSetup.guide
        </Link>

        <nav className="flex items-center gap-6">
          <Link href={`/${locale}/guides`} className="text-sm font-medium hover:underline">
            {t('guides')}
          </Link>
          <Link href={`/${locale}/platforms`} className="text-sm font-medium hover:underline">
            {t('platforms')}
          </Link>

          <div className="flex gap-2">
            <Link
              href={`/ko${typeof window !== 'undefined' ? window.location.pathname.substring(3) : ''}`}
              className={`text-sm px-2 py-1 rounded ${locale === 'ko' ? 'bg-primary text-primary-foreground' : ''}`}
            >
              KO
            </Link>
            <Link
              href={`/en${typeof window !== 'undefined' ? window.location.pathname.substring(3) : ''}`}
              className={`text-sm px-2 py-1 rounded ${locale === 'en' ? 'bg-primary text-primary-foreground' : ''}`}
            >
              EN
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
