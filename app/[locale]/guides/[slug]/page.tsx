import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { setRequestLocale } from 'next-intl/server';
import { getGuide, getAllGuideSlugs } from '@/lib/guides';
import { routing } from '@/i18n/routing';

interface GuidePageProps {
  params: {
    locale: 'ko' | 'en';
    slug: string;
  };
}

export async function generateStaticParams() {
  const slugs = await getAllGuideSlugs();

  return slugs.flatMap((slug) =>
    routing.locales.map((locale) => ({ slug, locale }))
  );
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { locale, slug } = params;
  setRequestLocale(locale);

  const guide = await getGuide(slug, locale);

  if (!guide) {
    notFound();
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <article className="prose prose-slate lg:prose-lg dark:prose-invert max-w-none">
        <h1>{guide.meta.seo[locale].title}</h1>
        <div className="flex gap-2 mb-8 not-prose">
          <span className="text-sm text-muted-foreground">
            {guide.meta.platform.toUpperCase()} • {guide.meta.difficulty}
          </span>
          <span className="text-sm text-muted-foreground">•</span>
          <span className="text-sm text-muted-foreground">
            {guide.meta.estimatedMinutes} {locale === 'ko' ? '분' : 'min'}
          </span>
        </div>

        <MDXRemote source={guide.content} />
      </article>
    </main>
  );
}
