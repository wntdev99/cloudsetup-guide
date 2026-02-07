import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';

export default function HomePage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const t = useTranslations('common');

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">CloudSetup.guide</h1>
        <p className="text-muted-foreground">Step-by-step guides for cloud API setup</p>
        <div className="mt-4 flex gap-4 justify-center">
          <a href="/ko" className="text-primary hover:underline">
            한국어
          </a>
          <a href="/en" className="text-primary hover:underline">
            English
          </a>
        </div>
      </div>
    </main>
  );
}
