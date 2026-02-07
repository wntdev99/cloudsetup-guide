import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import type { GuideMeta, Guide } from '@/types';

const GUIDES_DIR = path.join(process.cwd(), 'content/guides');

export async function getAllGuideSlugs(): Promise<string[]> {
  try {
    const entries = await fs.readdir(GUIDES_DIR, { withFileTypes: true });
    return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
  } catch (error) {
    return [];
  }
}

export async function getGuideMeta(slug: string): Promise<GuideMeta | null> {
  try {
    const metaPath = path.join(GUIDES_DIR, slug, 'meta.json');
    const metaContent = await fs.readFile(metaPath, 'utf-8');
    const meta = JSON.parse(metaContent) as GuideMeta;
    return meta.published ? meta : null;
  } catch (error) {
    return null;
  }
}

export async function getGuide(slug: string, locale: 'ko' | 'en'): Promise<Guide | null> {
  try {
    const meta = await getGuideMeta(slug);
    if (!meta) return null;

    const contentPath = path.join(GUIDES_DIR, slug, `${locale}.mdx`);
    const fileContent = await fs.readFile(contentPath, 'utf-8');
    const { content } = matter(fileContent);

    return {
      meta,
      content,
      locale,
    };
  } catch (error) {
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
