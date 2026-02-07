import { MetadataRoute } from 'next';
import { getAllGuideSlugs } from '@/lib/guides';
import { SITE_URL } from '@/lib/constants';
import platformsData from '@/data/platforms.json';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const guideSlugs = await getAllGuideSlugs();
  const locales = ['ko', 'en'];

  // Home pages
  const homePages = locales.map((locale) => ({
    url: `${SITE_URL}/${locale}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 1,
  }));

  // Guide pages
  const guidePages = guideSlugs.flatMap((slug) =>
    locales.map((locale) => ({
      url: `${SITE_URL}/${locale}/guides/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  );

  // Platform pages
  const platformPages = platformsData.flatMap((platform) =>
    locales.map((locale) => ({
      url: `${SITE_URL}/${locale}/platforms/${platform.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))
  );

  return [...homePages, ...guidePages, ...platformPages];
}
