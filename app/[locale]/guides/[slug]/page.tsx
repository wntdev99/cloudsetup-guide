import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { setRequestLocale } from 'next-intl/server';
import { getGuide, getAllGuideSlugs } from '@/lib/guides';
import { routing } from '@/i18n/routing';
import { GuideHeader } from '@/components/guide/GuideHeader';
import { ProgressBar } from '@/components/guide/ProgressBar';
import { TableOfContents } from '@/components/guide/TableOfContents';
import { GuideNavigation } from '@/components/guide/GuideNavigation';
import { generateMetadata as genMeta, generateGuideJsonLd } from '@/lib/seo';

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

export async function generateMetadata({ params }: GuidePageProps) {
  const { locale, slug } = params;
  const guide = await getGuide(slug, locale);

  if (!guide) {
    return {};
  }

  return genMeta(guide.meta, locale, slug);
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { locale, slug } = params;
  setRequestLocale(locale);

  const guide = await getGuide(slug, locale);

  if (!guide) {
    notFound();
  }

  const jsonLd = generateGuideJsonLd(guide.meta, locale);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ProgressBar totalSteps={guide.meta.totalSteps} />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_250px] gap-8 max-w-7xl mx-auto">
          <main>
            <article className="prose prose-slate lg:prose-lg dark:prose-invert max-w-none">
              <GuideHeader meta={guide.meta} locale={locale} />
              <MDXRemote source={guide.content} />
            </article>

            <GuideNavigation
              prevSlug={guide.meta.prerequisites?.[0]}
              nextSlug={guide.meta.nextGuides?.[0]}
              locale={locale}
            />
          </main>

          <aside>
            <TableOfContents />
          </aside>
        </div>
      </div>
    </>
  );
}
