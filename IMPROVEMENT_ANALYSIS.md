# 🔍 CloudSetup.guide - 개선사항 및 잠재적 문제 분석

**분석 날짜**: 2026-02-08
**분석 대상**: Phase 1 MVP 코드베이스
**분석자**: Claude Code

---

## 📋 목차

1. [🚨 심각한 문제 (즉시 수정 필요)](#심각한-문제)
2. [⚠️ 중요한 문제 (단기 개선)](#중요한-문제)
3. [💡 개선 권장사항 (중기)](#개선-권장사항)
4. [🔮 미래 고려사항 (장기)](#미래-고려사항)
5. [✅ 우선순위별 액션 플랜](#액션-플랜)

---

## 🚨 심각한 문제 (즉시 수정 필요)

### 1. **XSS 보안 취약점** - SearchBar.tsx
**위치**: `components/common/SearchBar.tsx:55`

```tsx
<div
  className="text-sm text-muted-foreground line-clamp-2"
  dangerouslySetInnerHTML={{ __html: result.excerpt }}
/>
```

**문제점**:
- Pagefind에서 반환된 `excerpt`를 직접 HTML로 렌더링
- 악의적인 스크립트가 검색 결과에 포함될 경우 XSS 공격 가능
- 특히 사용자가 생성한 콘텐츠가 검색 대상일 경우 위험

**해결방안**:
```tsx
// 옵션 1: DOMPurify 라이브러리 사용
import DOMPurify from 'isomorphic-dompurify';
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(result.excerpt) }} />

// 옵션 2: 하이라이트 없이 일반 텍스트로 표시
<div className="text-sm text-muted-foreground line-clamp-2">
  {result.excerpt.replace(/<[^>]*>/g, '')}
</div>
```

**우선순위**: ⭐⭐⭐⭐⭐ (즉시)

---

### 2. **MDX 컴포넌트가 렌더링되지 않음**
**위치**: `app/[locale]/guides/[slug]/page.tsx:64`

```tsx
<MDXRemote source={guide.content} />
```

**문제점**:
- `MDXRemote`에 `components` prop이 전달되지 않음
- `lib/mdx-components.tsx`에서 정의한 커스텀 컴포넌트들이 작동하지 않음
- MDX 파일에서 `<Step>`, `<Screenshot>` 등을 사용해도 기본 HTML로만 렌더링됨

**해결방안**:
```tsx
import { useMDXComponents } from '@/lib/mdx-components';

export default async function GuidePage({ params }: GuidePageProps) {
  // ...
  const components = useMDXComponents({});

  return (
    <MDXRemote source={guide.content} components={components} />
  );
}
```

**우선순위**: ⭐⭐⭐⭐⭐ (즉시)

---

### 3. **에러 바운더리 및 에러 처리 누락**
**위치**: 전역

**문제점**:
- `app/[locale]/error.tsx` 파일이 없음
- `app/[locale]/guides/[slug]/error.tsx` 파일이 없음
- 런타임 에러 발생 시 사용자에게 빈 화면만 표시됨
- 에러 로깅 메커니즘 없음

**해결방안**:
```tsx
// app/[locale]/error.tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global error:', error);
    // TODO: Send to error tracking service (Sentry, etc.)
  }, [error]);

  return (
    <div className="container py-20 text-center">
      <h2 className="text-2xl font-bold mb-4">문제가 발생했습니다</h2>
      <p className="text-muted-foreground mb-8">{error.message}</p>
      <Button onClick={reset}>다시 시도</Button>
    </div>
  );
}
```

**우선순위**: ⭐⭐⭐⭐⭐ (즉시)

---

### 4. **lib/guides.ts - 에러 처리가 모호함**
**위치**: `lib/guides.ts` (모든 함수)

```tsx
export async function getGuideMeta(slug: string): Promise<GuideMeta | null> {
  try {
    const metaPath = path.join(GUIDES_DIR, slug, 'meta.json');
    const metaContent = await fs.readFile(metaPath, 'utf-8');
    const meta = JSON.parse(metaContent) as GuideMeta;
    return meta.published ? meta : null;
  } catch (error) {
    return null;  // 👈 모든 에러를 null로 처리
  }
}
```

**문제점**:
- 파일이 없는 경우 vs JSON 파싱 오류 vs 권한 문제를 구분 불가
- 디버깅이 어려움
- 빌드 타임 에러를 숨겨버림

**해결방안**:
```tsx
export async function getGuideMeta(slug: string): Promise<GuideMeta | null> {
  try {
    const metaPath = path.join(GUIDES_DIR, slug, 'meta.json');
    const metaContent = await fs.readFile(metaPath, 'utf-8');
    const meta = JSON.parse(metaContent) as GuideMeta;

    if (!meta.published) {
      console.warn(`Guide ${slug} is not published`);
      return null;
    }

    return meta;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      // 파일이 없는 경우 - 정상 (가이드가 없을 수 있음)
      return null;
    }
    // JSON 파싱 오류나 기타 에러는 로그 출력
    console.error(`Error loading guide meta for ${slug}:`, error);
    throw error; // 빌드 타임에는 에러를 던져야 함
  }
}
```

**우선순위**: ⭐⭐⭐⭐ (단기)

---

## ⚠️ 중요한 문제 (단기 개선)

### 5. **성능 문제 - 스크롤 이벤트 최적화 부족**
**위치**:
- `components/guide/ProgressBar.tsx:27`
- `components/guide/TableOfContents.tsx:39`

```tsx
useEffect(() => {
  const handleScroll = () => {
    // 스크롤할 때마다 모든 요소를 쿼리하고 계산
    const steps = document.querySelectorAll('[id^="step-"]');
    // ...
  };

  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);
```

**문제점**:
- 스크롤 이벤트가 초당 수십~수백 번 발생
- Throttle/Debounce 없음
- 매번 DOM 쿼리 실행 (비효율)
- IntersectionObserver API를 사용하지 않음

**해결방안**:
```tsx
import { useEffect, useState, useRef } from 'react';

export function ProgressBar({ totalSteps }: ProgressBarProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '-50% 0px -50% 0px', // 화면 중앙 기준
      threshold: 0,
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const stepNumber = parseInt(entry.target.id.replace('step-', ''));
          setCurrentStep(stepNumber);
        }
      });
    }, options);

    const steps = document.querySelectorAll('[id^="step-"]');
    steps.forEach((step) => observerRef.current?.observe(step));

    return () => {
      steps.forEach((step) => observerRef.current?.unobserve(step));
      observerRef.current?.disconnect();
    };
  }, []);

  // ... rest of component
}
```

**우선순위**: ⭐⭐⭐⭐ (단기)

---

### 6. **i18n 누락 - CopyBlock 하드코딩**
**위치**: `components/guide/CopyBlock.tsx:31`

```tsx
{copied ? '복사됨!' : '복사'}
```

**문제점**:
- 한국어가 하드코딩되어 있음
- 영어 페이지에서도 한국어로 표시됨
- `next-intl`을 사용하지 않음

**해결방안**:
```tsx
import { useTranslations } from 'next-intl';

export function CopyBlock({ code, language = 'bash' }: CopyBlockProps) {
  const t = useTranslations('guide');
  const [copied, setCopied] = useState(false);

  return (
    // ...
    <Button>
      {copied ? t('copied') : t('copy')}
    </Button>
  );
}
```

```json
// messages/ko.json
{
  "guide": {
    "copy": "복사",
    "copied": "복사됨!"
  }
}

// messages/en.json
{
  "guide": {
    "copy": "Copy",
    "copied": "Copied!"
  }
}
```

**우선순위**: ⭐⭐⭐⭐ (단기)

---

### 7. **Clipboard API 에러 처리 부족**
**위치**: `components/guide/CopyBlock.tsx:14-18`

```tsx
const handleCopy = async () => {
  await navigator.clipboard.writeText(code);  // 에러 처리 없음
  setCopied(true);
  setTimeout(() => setCopied(false), 2000);
};
```

**문제점**:
- HTTPS가 아닌 환경에서는 clipboard API가 작동하지 않음
- 권한이 거부된 경우 에러 처리 없음
- 실패 시 사용자에게 피드백 없음

**해결방안**:
```tsx
const [copyError, setCopyError] = useState(false);

const handleCopy = async () => {
  try {
    if (!navigator.clipboard) {
      // Fallback for older browsers or non-HTTPS
      const textArea = document.createElement('textarea');
      textArea.value = code;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    } else {
      await navigator.clipboard.writeText(code);
    }
    setCopied(true);
    setCopyError(false);
    setTimeout(() => setCopied(false), 2000);
  } catch (error) {
    console.error('Copy failed:', error);
    setCopyError(true);
    setTimeout(() => setCopyError(false), 2000);
  }
};

return (
  <Button>
    {copied ? t('copied') : copyError ? t('copyFailed') : t('copy')}
  </Button>
);
```

**우선순위**: ⭐⭐⭐ (단기)

---

### 8. **CSP (Content Security Policy) 헤더 누락**
**위치**: `next.config.mjs:15-35`

**문제점**:
- CSP 헤더가 없어 XSS 공격에 취약
- Inline script 실행 제한이 없음
- 외부 리소스 로드 제한이 없음

**해결방안**:
```javascript
async headers() {
  return [
    {
      source: '/:path*',
      headers: [
        {
          key: 'Content-Security-Policy',
          value: [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://pagead2.googlesyndication.com",
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' data: https: blob:",
            "font-src 'self' data:",
            "connect-src 'self' https://www.google-analytics.com",
            "frame-ancestors 'none'",
          ].join('; '),
        },
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin',
        },
        {
          key: 'Permissions-Policy',
          value: 'camera=(), microphone=(), geolocation=()',
        },
        // ... existing headers
      ],
    },
  ];
}
```

**우선순위**: ⭐⭐⭐⭐ (단기)

---

### 9. **로딩 상태 없음**
**위치**: `app/[locale]/loading.tsx` (파일 자체가 없음)

**문제점**:
- 페이지 로딩 중 빈 화면만 표시됨
- 사용자 경험 저하
- 네트워크가 느린 환경에서 문제

**해결방안**:
```tsx
// app/[locale]/loading.tsx
export default function Loading() {
  return (
    <div className="container py-20">
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="h-10 bg-muted rounded animate-pulse" />
        <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
        <div className="h-4 bg-muted rounded w-1/2 animate-pulse" />
        <div className="space-y-2 pt-8">
          <div className="h-32 bg-muted rounded animate-pulse" />
          <div className="h-32 bg-muted rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}

// app/[locale]/guides/[slug]/loading.tsx
// 가이드 페이지용 스켈레톤
```

**우선순위**: ⭐⭐⭐ (단기)

---

### 10. **커스텀 404 페이지 없음**
**위치**: `app/[locale]/not-found.tsx` (파일 자체가 없음)

**문제점**:
- 가이드가 없을 때 기본 Next.js 404 페이지 표시
- 브랜딩 일관성 부족
- 사용자를 다른 페이지로 유도할 수 없음

**해결방안**:
```tsx
// app/[locale]/not-found.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="container py-20 text-center">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-4">가이드를 찾을 수 없습니다</h2>
      <p className="text-muted-foreground mb-8">
        요청하신 가이드가 존재하지 않거나 아직 작성되지 않았습니다.
      </p>
      <div className="flex gap-4 justify-center">
        <Link href="/ko">
          <Button>홈으로 돌아가기</Button>
        </Link>
        <Link href="/ko/guides">
          <Button variant="outline">가이드 목록 보기</Button>
        </Link>
      </div>
    </div>
  );
}
```

**우선순위**: ⭐⭐⭐ (단기)

---

## 💡 개선 권장사항 (중기)

### 11. **locale 파라미터 미사용**
**위치**: `lib/guides.ts:47,53,61`

```tsx
export async function getAllGuides(locale: 'ko' | 'en'): Promise<GuideMeta[]> {
  const slugs = await getAllGuideSlugs();
  const guides = await Promise.all(slugs.map((slug) => getGuideMeta(slug)));
  return guides.filter((guide): guide is GuideMeta => guide !== null);
  // 👆 locale을 받지만 사용하지 않음
}
```

**문제점**:
- `locale`을 파라미터로 받지만 실제로는 사용하지 않음
- API 설계가 모호함
- 미래에 locale별 필터링이 필요할 경우 혼란

**해결방안**:
```tsx
// 옵션 1: locale 파라미터 제거 (meta.json은 언어 독립적이므로)
export async function getAllGuides(): Promise<GuideMeta[]> {
  const slugs = await getAllGuideSlugs();
  const guides = await Promise.all(slugs.map((slug) => getGuideMeta(slug)));
  return guides.filter((guide): guide is GuideMeta => guide !== null);
}

// 옵션 2: locale 검증 추가 (향후 locale별 published 상태 지원)
export async function getAllGuides(locale: 'ko' | 'en'): Promise<GuideMeta[]> {
  const slugs = await getAllGuideSlugs();
  const guides = await Promise.all(
    slugs.map(async (slug) => {
      const meta = await getGuideMeta(slug);
      if (!meta) return null;

      // 해당 locale의 MDX 파일이 있는지 확인
      const contentPath = path.join(GUIDES_DIR, slug, `${locale}.mdx`);
      const exists = await fs.access(contentPath).then(() => true).catch(() => false);
      return exists ? meta : null;
    })
  );
  return guides.filter((guide): guide is GuideMeta => guide !== null);
}
```

**우선순위**: ⭐⭐⭐ (중기)

---

### 12. **캐싱 메커니즘 없음**
**위치**: `lib/guides.ts` (전체)

**문제점**:
- 매번 파일시스템을 읽음
- 개발 서버에서 불필요한 I/O
- 빌드 시간 증가 (가이드가 많아질수록)

**해결방안**:
```tsx
// lib/guides.ts
const guideCache = new Map<string, GuideMeta | null>();
const contentCache = new Map<string, Guide | null>();

export async function getGuideMeta(slug: string): Promise<GuideMeta | null> {
  // 개발 모드에서는 캐싱 비활성화 (HMR 지원)
  if (process.env.NODE_ENV === 'development') {
    return loadGuideMetaFromDisk(slug);
  }

  if (guideCache.has(slug)) {
    return guideCache.get(slug) || null;
  }

  const meta = await loadGuideMetaFromDisk(slug);
  guideCache.set(slug, meta);
  return meta;
}

function loadGuideMetaFromDisk(slug: string): Promise<GuideMeta | null> {
  // 기존 로직
}

// 빌드 시 모든 가이드를 미리 캐싱
export async function preloadAllGuides() {
  const slugs = await getAllGuideSlugs();
  await Promise.all(slugs.map((slug) => getGuideMeta(slug)));
}
```

**우선순위**: ⭐⭐⭐ (중기)

---

### 13. **GuideNavigation 로직 개선**
**위치**: `app/[locale]/guides/[slug]/page.tsx:68-70`

```tsx
<GuideNavigation
  prevSlug={guide.meta.prerequisites?.[0]}  // 첫 번째만 사용
  nextSlug={guide.meta.nextGuides?.[0]}     // 첫 번째만 사용
  locale={locale}
/>
```

**문제점**:
- prerequisites나 nextGuides가 여러 개 있을 경우 나머지는 무시됨
- 사용자가 연관 가이드를 발견하기 어려움

**해결방안**:
```tsx
// 옵션 1: 모든 연관 가이드 표시
<GuideNavigation
  prevGuides={guide.meta.prerequisites || []}
  nextGuides={guide.meta.nextGuides || []}
  locale={locale}
/>

// 옵션 2: 별도 섹션으로 분리
<RelatedGuides
  prerequisites={guide.meta.prerequisites}
  nextGuides={guide.meta.nextGuides}
  locale={locale}
/>
```

**우선순위**: ⭐⭐⭐ (중기)

---

### 14. **SearchBar onBlur 취약한 패턴**
**위치**: `components/common/SearchBar.tsx:40`

```tsx
onBlur={() => setTimeout(() => setShowResults(false), 200)}
```

**문제점**:
- 200ms 타이머는 신뢰할 수 없음
- 사용자가 빠르게 클릭하면 결과가 사라질 수 있음
- 접근성 문제 (키보드 네비게이션)

**해결방안**:
```tsx
export function SearchBar() {
  const [showResults, setShowResults] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="w-full max-w-2xl relative">
      {/* ... */}
    </div>
  );
}
```

**우선순위**: ⭐⭐⭐ (중기)

---

### 15. **lib/pagefind.ts - any 타입 남용**
**위치**: `lib/pagefind.ts:1,9,31`

```tsx
let pagefind: any = null;  // 👈 any

// @ts-ignore
pagefind = await import(/* webpackIgnore: true */ '/pagefind/pagefind.js');
```

**문제점**:
- 타입 안전성 부족
- IDE 자동완성 없음
- 런타임 에러 가능성

**해결방안**:
```tsx
// types/pagefind.d.ts
interface PagefindResult {
  results: PagefindSearchResult[];
}

interface PagefindSearchResult {
  id: string;
  data: () => Promise<PagefindData>;
}

interface PagefindData {
  url: string;
  excerpt: string;
  meta?: {
    title?: string;
  };
}

interface PagefindInstance {
  search: (query: string) => Promise<PagefindResult>;
}

// lib/pagefind.ts
let pagefind: PagefindInstance | null = null;

export async function initPagefind(): Promise<PagefindInstance | null> {
  if (typeof window === 'undefined') return null;
  if (pagefind) return pagefind;

  try {
    pagefind = (await import(
      /* webpackIgnore: true */ '/pagefind/pagefind.js'
    )) as unknown as PagefindInstance;
    return pagefind;
  } catch (error) {
    console.warn('Pagefind not loaded:', error);
    return null;
  }
}
```

**우선순위**: ⭐⭐ (중기)

---

### 16. **환경변수 검증 부족**
**위치**: `.env.example` 및 실행 시점

**문제점**:
- `NEXT_PUBLIC_SITE_URL`이 필수인데 검증하지 않음
- 잘못된 환경변수로 SEO 문제 발생 가능
- 빌드 시점에 잡히지 않음

**해결방안**:
```tsx
// lib/env.ts
function validateEnv() {
  const requiredEnvs = ['NEXT_PUBLIC_SITE_URL'] as const;

  const missing = requiredEnvs.filter(
    (env) => !process.env[env]
  );

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check .env.example and create .env.local'
    );
  }

  // URL 검증
  try {
    new URL(process.env.NEXT_PUBLIC_SITE_URL!);
  } catch {
    throw new Error('NEXT_PUBLIC_SITE_URL must be a valid URL');
  }
}

if (process.env.NODE_ENV !== 'test') {
  validateEnv();
}

export const env = {
  SITE_URL: process.env.NEXT_PUBLIC_SITE_URL!,
  GA_ID: process.env.NEXT_PUBLIC_GA_ID,
  ADSENSE_ID: process.env.NEXT_PUBLIC_ADSENSE_ID,
} as const;
```

**우선순위**: ⭐⭐ (중기)

---

## 🔮 미래 고려사항 (장기)

### 17. **가이드 데이터 검증 시스템**
**현재 상태**: `npm run validate`가 placeholder

**필요한 기능**:
```typescript
// scripts/validate-guides.ts
interface ValidationResult {
  slug: string;
  errors: string[];
  warnings: string[];
}

async function validateGuide(slug: string): Promise<ValidationResult> {
  const errors: string[] = [];
  const warnings: string[] = [];

  // 1. meta.json 검증
  const meta = await getGuideMeta(slug);
  if (!meta) {
    errors.push('meta.json not found or invalid');
    return { slug, errors, warnings };
  }

  // 2. 필수 필드 검증
  const requiredFields = ['slug', 'platform', 'service', 'category', 'difficulty'];
  for (const field of requiredFields) {
    if (!meta[field]) {
      errors.push(`Missing required field: ${field}`);
    }
  }

  // 3. MDX 파일 존재 검증
  for (const locale of ['ko', 'en']) {
    const mdxPath = `content/guides/${slug}/${locale}.mdx`;
    if (!fs.existsSync(mdxPath)) {
      errors.push(`Missing ${locale}.mdx file`);
    }
  }

  // 4. 스크린샷 검증
  if (meta.totalSteps > 0) {
    const screenshotDir = `content/guides/${slug}/screenshots`;
    if (!fs.existsSync(screenshotDir)) {
      warnings.push('screenshots directory not found');
    }
  }

  // 5. prerequisites 검증 (순환 참조 체크)
  if (meta.prerequisites) {
    for (const prereq of meta.prerequisites) {
      const prereqMeta = await getGuideMeta(prereq);
      if (!prereqMeta) {
        errors.push(`Invalid prerequisite: ${prereq} not found`);
      }
    }
  }

  // 6. lastVerified 날짜 검증 (6개월 이상 경과 시 경고)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  if (new Date(meta.lastVerified) < sixMonthsAgo) {
    warnings.push('Guide not verified in the last 6 months');
  }

  return { slug, errors, warnings };
}
```

**우선순위**: ⭐⭐⭐ (장기)

---

### 18. **이미지 최적화 및 CDN 전략**
**현재 상태**: Cloudinary 설정만 있음

**개선 방안**:
- 로컬 이미지 자동 Cloudinary 업로드 스크립트
- 이미지 리사이징 자동화
- WebP/AVIF 자동 변환
- 이미지 메타데이터 관리

```typescript
// scripts/optimize-images.ts
import cloudinary from 'cloudinary';

async function uploadScreenshot(
  guidSlug: string,
  step: number,
  locale: 'ko' | 'en',
  localPath: string
) {
  const publicId = `cloudsetup-guide/${guideSlug}/step${step}-${locale}`;

  const result = await cloudinary.v2.uploader.upload(localPath, {
    public_id: publicId,
    folder: 'cloudsetup-guide',
    transformation: [
      { width: 1200, crop: 'limit' },
      { quality: 'auto', fetch_format: 'auto' },
    ],
  });

  return result.secure_url;
}
```

**우선순위**: ⭐⭐ (장기)

---

### 19. **성능 모니터링 및 Analytics**
**현재 상태**: GA ID만 설정 가능, 실제 통합 없음

**필요한 기능**:
- Core Web Vitals 측정
- 가이드별 완독률 추적
- 검색 쿼리 분석
- 에러 추적 (Sentry 등)

```tsx
// lib/analytics.ts
export function trackGuideProgress(slug: string, step: number, totalSteps: number) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'guide_progress', {
      guide_slug: slug,
      step: step,
      total_steps: totalSteps,
      progress_percent: Math.round((step / totalSteps) * 100),
    });
  }
}

export function trackGuideCompletion(slug: string, timeSpent: number) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'guide_completed', {
      guide_slug: slug,
      time_spent_seconds: timeSpent,
    });
  }
}
```

**우선순위**: ⭐⭐ (장기)

---

### 20. **Phase 3 준비 - Supabase 스키마 설계**
**현재 상태**: Supabase 언급만 있음

**필요한 테이블**:
```sql
-- users (Supabase Auth 사용)

-- guide_progress
CREATE TABLE guide_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  guide_slug TEXT NOT NULL,
  completed_steps INTEGER[] DEFAULT '{}',
  last_accessed_at TIMESTAMPTZ DEFAULT NOW(),
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, guide_slug)
);

-- guide_feedback
CREATE TABLE guide_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guide_slug TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  helpful BOOLEAN,
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- guide_comments
CREATE TABLE guide_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guide_slug TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  step_number INTEGER,
  content TEXT NOT NULL,
  parent_id UUID REFERENCES guide_comments(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS policies
ALTER TABLE guide_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own progress" ON guide_progress
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own progress" ON guide_progress
  FOR UPDATE USING (auth.uid() = user_id);
```

**우선순위**: ⭐ (Phase 3 시작 시)

---

## ✅ 액션 플랜

### Phase 0: 즉시 수정 (1-2일)

| 우선순위 | 항목 | 예상 시간 | 파일 |
|---------|------|----------|------|
| P0 | XSS 취약점 수정 | 30분 | SearchBar.tsx |
| P0 | MDX 컴포넌트 연결 | 15분 | page.tsx |
| P0 | 에러 바운더리 추가 | 1시간 | error.tsx (3개) |
| P0 | lib/guides.ts 에러 처리 개선 | 1시간 | guides.ts |

**총 예상 시간**: 3시간

---

### Phase 1: 단기 개선 (1주)

| 우선순위 | 항목 | 예상 시간 | 파일 |
|---------|------|----------|------|
| P1 | 스크롤 성능 최적화 (IntersectionObserver) | 2시간 | ProgressBar.tsx, TableOfContents.tsx |
| P1 | CopyBlock i18n 적용 | 30분 | CopyBlock.tsx, messages/*.json |
| P1 | Clipboard API 에러 처리 | 1시간 | CopyBlock.tsx |
| P1 | CSP 헤더 추가 | 1시간 | next.config.mjs |
| P1 | 로딩 상태 추가 | 1시간 | loading.tsx (2개) |
| P1 | 커스텀 404 페이지 | 30분 | not-found.tsx |

**총 예상 시간**: 6시간

---

### Phase 2: 중기 개선 (2주)

| 우선순위 | 항목 | 예상 시간 |
|---------|------|----------|
| P2 | locale 파라미터 정리 | 1시간 |
| P2 | 캐싱 메커니즘 구현 | 2시간 |
| P2 | GuideNavigation 개선 | 1시간 |
| P2 | SearchBar 패턴 개선 | 1시간 |
| P2 | Pagefind 타입 정의 | 1시간 |
| P2 | 환경변수 검증 | 1시간 |

**총 예상 시간**: 7시간

---

### Phase 3: 장기 개선 (1개월+)

| 우선순위 | 항목 | 예상 시간 |
|---------|------|----------|
| P3 | 가이드 검증 시스템 | 4시간 |
| P3 | 이미지 최적화 자동화 | 4시간 |
| P3 | Analytics 통합 | 3시간 |
| P3 | Supabase 스키마 설계 | 2시간 |

**총 예상 시간**: 13시간

---

## 📊 요약

### 심각도별 통계

| 심각도 | 개수 | 예상 수정 시간 |
|--------|------|---------------|
| 🚨 심각 (P0) | 4개 | 3시간 |
| ⚠️ 중요 (P1) | 6개 | 6시간 |
| 💡 권장 (P2) | 6개 | 7시간 |
| 🔮 장기 (P3) | 4개 | 13시간 |
| **합계** | **20개** | **29시간** |

### 카테고리별 분류

- **보안**: 3개 (XSS, CSP, 에러 처리)
- **성능**: 3개 (스크롤 최적화, 캐싱, 이미지)
- **UX**: 4개 (로딩, 404, i18n, 네비게이션)
- **코드 품질**: 5개 (타입, 에러 처리, 검증)
- **미래 대비**: 5개 (Analytics, Supabase, 검증 시스템)

---

## 🎯 권장 실행 순서

1. **이번 주 내로** (P0): XSS 수정, MDX 연결, 에러 바운더리
2. **다음 주** (P1): 성능 최적화, CSP, 로딩/404 페이지
3. **실제 가이드 작성 전** (P2): 캐싱, 환경변수 검증
4. **Phase 2 배포 전** (P3): Analytics, 검증 시스템
5. **Phase 3 준비** (P3): Supabase 스키마

---

**다음 액션**: 이 문서를 검토하고 우선순위에 동의하면 P0 항목부터 수정 시작 🚀
