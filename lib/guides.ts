import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import type { GuideMeta, Guide } from '@/types';

const GUIDES_DIR = path.join(process.cwd(), 'content/guides');

// In-memory cache for build-time performance
// Disabled in development mode for HMR support
const guideMetaCache = new Map<string, GuideMeta | null>();
const guideContentCache = new Map<string, Guide | null>();
const isDevelopment = process.env.NODE_ENV === 'development';

export async function getAllGuideSlugs(): Promise<string[]> {
  try {
    const entries = await fs.readdir(GUIDES_DIR, { withFileTypes: true });
    return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
  } catch (error) {
    return [];
  }
}

export async function getGuideMeta(slug: string): Promise<GuideMeta | null> {
  // Check cache first (disabled in development for HMR)
  if (!isDevelopment && guideMetaCache.has(slug)) {
    return guideMetaCache.get(slug) || null;
  }

  try {
    const metaPath = path.join(GUIDES_DIR, slug, 'meta.json');
    const metaContent = await fs.readFile(metaPath, 'utf-8');
    const meta = JSON.parse(metaContent) as GuideMeta;

    if (!meta.published) {
      if (isDevelopment) {
        console.warn(`[Guides] Guide "${slug}" exists but is not published`);
      }
      guideMetaCache.set(slug, null);
      return null;
    }

    // Cache the result
    if (!isDevelopment) {
      guideMetaCache.set(slug, meta);
    }

    return meta;
  } catch (error) {
    const nodeError = error as NodeJS.ErrnoException;

    // File not found is expected - guide might not exist
    if (nodeError.code === 'ENOENT') {
      if (!isDevelopment) {
        guideMetaCache.set(slug, null);
      }
      return null;
    }

    // JSON parsing errors or other issues should be logged
    console.error(`[Guides] Error loading meta for "${slug}":`, error);

    // In production, return null to prevent build failures
    // In development, throw to help debugging
    if (isDevelopment) {
      throw error;
    }
    return null;
  }
}

export async function getGuide(slug: string, locale: 'ko' | 'en'): Promise<Guide | null> {
  const cacheKey = `${slug}-${locale}`;

  // Check cache first (disabled in development for HMR)
  if (!isDevelopment && guideContentCache.has(cacheKey)) {
    return guideContentCache.get(cacheKey) || null;
  }

  try {
    const meta = await getGuideMeta(slug);
    if (!meta) {
      if (!isDevelopment) {
        guideContentCache.set(cacheKey, null);
      }
      return null;
    }

    const contentPath = path.join(GUIDES_DIR, slug, `${locale}.mdx`);
    const fileContent = await fs.readFile(contentPath, 'utf-8');
    const { content } = matter(fileContent);

    const guide: Guide = {
      meta,
      content,
      locale,
    };

    // Cache the result
    if (!isDevelopment) {
      guideContentCache.set(cacheKey, guide);
    }

    return guide;
  } catch (error) {
    const nodeError = error as NodeJS.ErrnoException;

    // MDX file not found for this locale
    if (nodeError.code === 'ENOENT') {
      console.warn(`[Guides] MDX file not found for "${slug}" (${locale})`);
      if (!isDevelopment) {
        guideContentCache.set(cacheKey, null);
      }
      return null;
    }

    // Other errors (parsing, etc.)
    console.error(`[Guides] Error loading guide "${slug}" (${locale}):`, error);

    if (isDevelopment) {
      throw error;
    }
    return null;
  }
}

export async function getAllGuides(locale: 'ko' | 'en'): Promise<GuideMeta[]> {
  const slugs = await getAllGuideSlugs();
  const guides = await Promise.all(slugs.map((slug) => getGuideMeta(slug)));
  return guides.filter((guide): guide is GuideMeta => guide !== null);
}

export async function getGuidesByPlatform(
  platform: string,
  locale: 'ko' | 'en'
): Promise<GuideMeta[]> {
  const guides = await getAllGuides(locale);
  return guides.filter((guide) => guide.platform === platform);
}

export async function getGuidesByCategory(
  category: string,
  locale: 'ko' | 'en'
): Promise<GuideMeta[]> {
  const guides = await getAllGuides(locale);
  return guides.filter((guide) => guide.category === category);
}
