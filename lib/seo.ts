import type { GuideMeta } from '@/types';
import { SITE_URL } from './constants';

export function generateGuideJsonLd(meta: GuideMeta, locale: 'ko' | 'en') {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: meta.seo[locale].title,
    description: meta.seo[locale].description,
    estimatedCost: {
      '@type': 'MonetaryAmount',
      currency: 'USD',
      value: '0',
    },
    totalTime: `PT${meta.estimatedMinutes}M`,
    step: Array.from({ length: meta.totalSteps }, (_, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: `Step ${i + 1}`,
    })),
  };
}

export function generateMetadata(
  meta: GuideMeta,
  locale: 'ko' | 'en',
  slug: string
) {
  return {
    title: meta.seo[locale].title,
    description: meta.seo[locale].description,
    keywords: meta.seo[locale].keywords,
    alternates: {
      canonical: `${SITE_URL}/${locale}/guides/${slug}`,
      languages: {
        ko: `${SITE_URL}/ko/guides/${slug}`,
        en: `${SITE_URL}/en/guides/${slug}`,
      },
    },
    openGraph: {
      title: meta.seo[locale].title,
      description: meta.seo[locale].description,
      url: `${SITE_URL}/${locale}/guides/${slug}`,
      siteName: 'CloudSetup.guide',
      locale: locale,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.seo[locale].title,
      description: meta.seo[locale].description,
    },
  };
}
