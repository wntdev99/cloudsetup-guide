# 🧩 Component Specification — CloudSetup.guide

> 최종 수정: 2025.02.07
> 버전: v1.0

---

## 1. 컴포넌트 인벤토리

### 1.1 가이드 컴포넌트 (src/components/guide/)

| 컴포넌트 | 유형 | MDX 내 사용 | Props |
|---------|------|:---------:|-------|
| Step | 서버 | ✅ | number, title, estimatedMinutes? |
| Screenshot | 클라이언트 | ✅ | src, alt, highlight?, caption? |
| Callout | 서버 | ✅ | type: warning/info/danger/tip, children |
| CopyBlock | 클라이언트 | ✅ | code, language?, filename? |
| FreeTierInfo | 서버 | ✅ | service, limit, overage? |
| DevTip | 클라이언트 | ✅ | children |
| Checkpoint | 클라이언트 | ✅ | children |
| ProgressBar | 클라이언트 | ❌ | totalSteps, currentStep |
| TableOfContents | 클라이언트 | ❌ | steps: {number, title}[] |
| PrerequisiteCheck | 클라이언트 | ❌ | prerequisites: GuideMeta[] |
| GuideHeader | 서버 | ❌ | meta: GuideMeta, locale |
| GuideFooter | 서버 | ❌ | nextGuides: GuideMeta[], locale |
| GuideNavigation | 서버 | ❌ | prevStep?, nextStep?, totalSteps |
| GuideFeedback | 클라이언트 | ❌ | guideSlug |

### 1.2 공통 컴포넌트 (src/components/common/)

| 컴포넌트 | 유형 | Props |
|---------|------|-------|
| Header | 클라이언트 | locale |
| Footer | 서버 | locale |
| LanguageSwitcher | 클라이언트 | — |
| ThemeToggle | 클라이언트 | — |
| SearchBar | 클라이언트 | — |
| AdBanner | 클라이언트 | slot: string, format?: string |
| PlatformBadge | 서버 | platform: Platform |
| DifficultyBadge | 서버 | difficulty: Difficulty |
| FreeTierStatusBadge | 서버 | status: FreeTierStatus |

---

## 2. 가이드 MDX 컴포넌트 상세

### 2.1 Step

단계별 컨테이너. 앵커 ID를 자동 생성하여 목차와 연동.

```tsx
// src/components/guide/Step.tsx (서버 컴포넌트)

interface StepProps {
  number: number;
  title: string;
  estimatedMinutes?: number;
  children: React.ReactNode;
}

export function Step({ number, title, estimatedMinutes, children }: StepProps) {
  return (
    <section
      id={`step-${number}`}
      data-step={number}
      className="scroll-mt-24 border-b border-border pb-8 mb-8 last:border-b-0"
    >
      <div className="flex items-center gap-3 mb-4">
        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white
                         flex items-center justify-center text-sm font-bold">
          {number}
        </span>
        <h2 className="text-xl font-bold text-foreground">{title}</h2>
        {estimatedMinutes && (
          <span className="text-sm text-muted ml-auto">⏱ {estimatedMinutes}분</span>
        )}
      </div>
      <div className="pl-11 space-y-4">{children}</div>
    </section>
  );
}
```

### 2.2 Screenshot

스크린샷 + 빨간 하이라이트 오버레이. 모바일에서 탭 시 라이트박스 확대.

```tsx
// src/components/guide/Screenshot.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';

interface HighlightBox {
  x: number;      // % 기반 (0-100)
  y: number;
  width: number;
  height: number;
}

interface ScreenshotProps {
  src: string;           // 스크린샷 파일명 또는 Cloudinary URL
  alt: string;
  highlight?: HighlightBox;
  caption?: string;
}

export function Screenshot({ src, alt, highlight, caption }: ScreenshotProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Cloudinary URL 구성
  const imageUrl = src.startsWith('http')
    ? src
    : `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/f_auto,q_auto/${src}`;

  return (
    <>
      <figure className="my-4">
        <div
          className="relative rounded-lg border border-border overflow-hidden
                     cursor-pointer group"
          onClick={() => setIsOpen(true)}
        >
          <Image
            src={imageUrl}
            alt={alt}
            width={800}
            height={500}
            className="w-full h-auto"
            sizes="(max-width: 768px) 100vw, 720px"
          />

          {/* 하이라이트 오버레이 */}
          {highlight && (
            <div
              className="absolute border-2 border-danger rounded-sm
                         pointer-events-none animate-pulse"
              style={{
                left: `${highlight.x}%`,
                top: `${highlight.y}%`,
                width: `${highlight.width}%`,
                height: `${highlight.height}%`,
              }}
            />
          )}

          {/* 모바일 확대 힌트 */}
          <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs
                          px-2 py-1 rounded opacity-0 group-hover:opacity-100
                          md:hidden transition-opacity">
            탭하여 확대
          </div>
        </div>

        {caption && (
          <figcaption className="text-sm text-muted mt-2 text-center">
            {caption}
          </figcaption>
        )}
      </figure>

      {/* 라이트박스 모달 */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setIsOpen(false)}
        >
          <div className="relative max-w-full max-h-full overflow-auto">
            <Image
              src={imageUrl}
              alt={alt}
              width={1200}
              height={750}
              className="max-w-none"
              quality={90}
            />
            {highlight && (
              <div
                className="absolute border-3 border-danger rounded-sm pointer-events-none"
                style={{
                  left: `${highlight.x}%`,
                  top: `${highlight.y}%`,
                  width: `${highlight.width}%`,
                  height: `${highlight.height}%`,
                }}
              />
            )}
          </div>
          <button
            className="absolute top-4 right-4 text-white text-2xl
                       w-10 h-10 flex items-center justify-center
                       bg-black/50 rounded-full"
            onClick={() => setIsOpen(false)}
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
}
```

### 2.3 Callout

경고/정보/위험/팁 박스. 4가지 타입별 아이콘과 배경색.

```tsx
// src/components/guide/Callout.tsx (서버 컴포넌트)

import { AlertTriangle, Info, AlertCircle, Lightbulb } from 'lucide-react';

type CalloutType = 'warning' | 'info' | 'danger' | 'tip';

interface CalloutProps {
  type: CalloutType;
  children: React.ReactNode;
}

const config: Record<CalloutType, {
  icon: React.ElementType;
  bg: string;
  border: string;
  iconColor: string;
}> = {
  warning: {
    icon: AlertTriangle,
    bg: 'bg-warning-50',
    border: 'border-warning',
    iconColor: 'text-warning-600',
  },
  info: {
    icon: Info,
    bg: 'bg-primary-50',
    border: 'border-primary-300',
    iconColor: 'text-primary-500',
  },
  danger: {
    icon: AlertCircle,
    bg: 'bg-danger-50',
    border: 'border-danger',
    iconColor: 'text-danger-600',
  },
  tip: {
    icon: Lightbulb,
    bg: 'bg-success-50',
    border: 'border-success',
    iconColor: 'text-success-600',
  },
};

export function Callout({ type, children }: CalloutProps) {
  const { icon: Icon, bg, border, iconColor } = config[type];

  return (
    <div className={`${bg} ${border} border-l-4 rounded-r-lg p-4 my-4
                     flex items-start gap-3`}>
      <Icon className={`${iconColor} w-5 h-5 flex-shrink-0 mt-0.5`} />
      <div className="text-sm leading-relaxed">{children}</div>
    </div>
  );
}
```

### 2.4 CopyBlock

코드 복사 블록. 원클릭 복사 + "복사됨" 피드백.

```tsx
// src/components/guide/CopyBlock.tsx
'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyBlockProps {
  code: string;
  language?: string;
  filename?: string;
}

export function CopyBlock({ code, language = 'bash', filename }: CopyBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    // GA4 이벤트
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'code_copy', { code_type: language });
    }
  };

  return (
    <div className="relative group my-4 rounded-lg overflow-hidden border border-border">
      {/* 헤더 */}
      {(filename || language) && (
        <div className="flex items-center justify-between px-4 py-2
                        bg-gray-100 dark:bg-gray-800 border-b border-border">
          <span className="text-xs text-muted font-mono">
            {filename || language}
          </span>
        </div>
      )}

      {/* 코드 */}
      <pre className="p-4 overflow-x-auto bg-gray-50 dark:bg-gray-900">
        <code className={`text-sm font-mono language-${language}`}>
          {code}
        </code>
      </pre>

      {/* 복사 버튼 */}
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-2 rounded-md
                   bg-white/80 dark:bg-gray-700/80 border border-border
                   opacity-0 group-hover:opacity-100 transition-opacity
                   hover:bg-white dark:hover:bg-gray-700"
        aria-label={copied ? '복사됨' : '코드 복사'}
      >
        {copied ? (
          <Check className="w-4 h-4 text-success" />
        ) : (
          <Copy className="w-4 h-4 text-muted" />
        )}
      </button>
    </div>
  );
}
```

### 2.5 FreeTierInfo

무료 한도 정보 카드.

```tsx
// src/components/guide/FreeTierInfo.tsx (서버 컴포넌트)

interface FreeTierInfoProps {
  service: string;
  limit: string;
  overage?: string;
}

export function FreeTierInfo({ service, limit, overage }: FreeTierInfoProps) {
  return (
    <div className="flex items-center gap-3 p-3 my-3 rounded-lg
                    bg-success-50 border border-success/30">
      <span className="text-lg">💰</span>
      <div className="text-sm">
        <p className="font-medium">{service} 무료 한도: {limit}</p>
        {overage && (
          <p className="text-muted mt-0.5">초과 시: {overage}</p>
        )}
      </div>
    </div>
  );
}
```

### 2.6 DevTip

개발자용 추가 정보. 접힌 상태 기본.

```tsx
// src/components/guide/DevTip.tsx
'use client';

import { useState } from 'react';
import { Code, ChevronDown, ChevronRight } from 'lucide-react';

interface DevTipProps {
  children: React.ReactNode;
}

export function DevTip({ children }: DevTipProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="my-3 border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-2 px-4 py-2.5
                   text-sm font-medium text-muted hover:text-foreground
                   hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      >
        <Code className="w-4 h-4" />
        <span>개발자 팁</span>
        {isOpen ? (
          <ChevronDown className="w-4 h-4 ml-auto" />
        ) : (
          <ChevronRight className="w-4 h-4 ml-auto" />
        )}
      </button>

      {isOpen && (
        <div className="px-4 pb-3 pt-1 border-t border-border text-sm
                        bg-gray-50/50 dark:bg-gray-800/50">
          {children}
        </div>
      )}
    </div>
  );
}
```

### 2.7 Checkpoint

진행 확인. "네"/"안 됐어요" 분기.

```tsx
// src/components/guide/Checkpoint.tsx
'use client';

import { useState } from 'react';
import { CheckCircle, HelpCircle } from 'lucide-react';

interface CheckpointProps {
  children: React.ReactNode;
}

export function Checkpoint({ children }: CheckpointProps) {
  const [status, setStatus] = useState<'idle' | 'success' | 'stuck'>('idle');

  return (
    <div className="my-6 p-4 rounded-lg border-2 border-dashed border-primary/30
                    bg-primary-50/50">
      <p className="text-sm font-medium mb-3 flex items-center gap-2">
        <CheckCircle className="w-4 h-4 text-primary" />
        {children}
      </p>

      {status === 'idle' && (
        <div className="flex gap-2">
          <button
            onClick={() => setStatus('success')}
            className="px-4 py-2 text-sm font-medium rounded-md
                       bg-success text-white hover:bg-success-600 transition-colors"
          >
            ✅ 네, 다음으로
          </button>
          <button
            onClick={() => setStatus('stuck')}
            className="px-4 py-2 text-sm font-medium rounded-md
                       border border-border text-muted
                       hover:bg-gray-50 transition-colors"
          >
            😕 다르게 보여요
          </button>
        </div>
      )}

      {status === 'success' && (
        <p className="text-sm text-success font-medium">
          ✅ 잘 진행되고 있어요! 다음 단계로 넘어가세요.
        </p>
      )}

      {status === 'stuck' && (
        <div className="text-sm space-y-2 p-3 bg-warning-50 rounded-md">
          <p className="font-medium">😕 화면이 다를 수 있는 이유:</p>
          <ul className="list-disc list-inside space-y-1 text-muted">
            <li>GCP 콘솔 UI가 업데이트되었을 수 있습니다</li>
            <li>브라우저 언어 설정에 따라 다를 수 있습니다</li>
            <li>프로젝트 권한 설정이 다를 수 있습니다</li>
          </ul>
          <p className="mt-2">
            해결이 안 되면 하단 댓글에 질문을 남겨주세요.
          </p>
        </div>
      )}
    </div>
  );
}
```

### 2.8 ProgressBar

가이드 진행률 바. 스크롤 추적으로 현재 단계 자동 업데이트.

```tsx
// src/components/guide/ProgressBar.tsx
'use client';

import { useState, useEffect } from 'react';

interface ProgressBarProps {
  totalSteps: number;
}

export function ProgressBar({ totalSteps }: ProgressBarProps) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const step = Number(entry.target.getAttribute('data-step'));
            if (step) setCurrentStep(step);
          }
        });
      },
      { rootMargin: '-20% 0px -60% 0px' }
    );

    document.querySelectorAll('[data-step]').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const percent = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0;

  return (
    <div className="sticky top-16 z-40 bg-background/95 backdrop-blur-sm
                    border-b border-border py-2 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between text-xs text-muted mb-1">
          <span>진행률</span>
          <span>{currentStep}/{totalSteps} 단계</span>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${percent}%` }}
          />
        </div>
        {/* 단계 도트 */}
        <div className="flex justify-between mt-1.5">
          {Array.from({ length: totalSteps }, (_, i) => (
            <button
              key={i}
              onClick={() => {
                document.getElementById(`step-${i + 1}`)?.scrollIntoView({
                  behavior: 'smooth',
                });
              }}
              className={`w-2.5 h-2.5 rounded-full transition-colors
                ${i + 1 <= currentStep
                  ? 'bg-primary'
                  : i + 1 === currentStep + 1
                    ? 'bg-primary/40'
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
              aria-label={`Step ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
```

---

## 3. MDX 컴포넌트 매핑

```tsx
// src/lib/mdx-components.tsx

import { Step } from '@/components/guide/Step';
import { Screenshot } from '@/components/guide/Screenshot';
import { Callout } from '@/components/guide/Callout';
import { CopyBlock } from '@/components/guide/CopyBlock';
import { FreeTierInfo } from '@/components/guide/FreeTierInfo';
import { DevTip } from '@/components/guide/DevTip';
import { Checkpoint } from '@/components/guide/Checkpoint';

// MDX에서 사용할 수 있는 커스텀 컴포넌트 맵
export const mdxComponents = {
  Step,
  Screenshot,
  Callout,
  CopyBlock,
  FreeTierInfo,
  DevTip,
  Checkpoint,

  // 기본 HTML 요소 오버라이드
  h2: ({ children, ...props }: any) => (
    <h2 className="text-xl font-bold mt-8 mb-4" {...props}>{children}</h2>
  ),
  h3: ({ children, ...props }: any) => (
    <h3 className="text-lg font-semibold mt-6 mb-3" {...props}>{children}</h3>
  ),
  p: ({ children, ...props }: any) => (
    <p className="text-base leading-7 mb-4" {...props}>{children}</p>
  ),
  a: ({ children, href, ...props }: any) => {
    const isExternal = href?.startsWith('http');
    return (
      <a
        href={href}
        className="text-primary underline underline-offset-2 hover:text-primary-600"
        {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...props}
      >
        {children}
      </a>
    );
  },
  ol: ({ children, ...props }: any) => (
    <ol className="list-decimal list-inside space-y-2 mb-4 pl-1" {...props}>{children}</ol>
  ),
  ul: ({ children, ...props }: any) => (
    <ul className="list-disc list-inside space-y-2 mb-4 pl-1" {...props}>{children}</ul>
  ),
  strong: ({ children, ...props }: any) => (
    <strong className="font-semibold text-foreground" {...props}>{children}</strong>
  ),
  code: ({ children, ...props }: any) => (
    <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5
                     rounded text-sm font-mono" {...props}>
      {children}
    </code>
  ),
};
```

---

## 4. 페이지 컴포넌트 구조

### 4.1 가이드 상세 페이지

```tsx
// src/app/[locale]/guides/[slug]/page.tsx

import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getGuide, getPrerequisites, getNextGuides, getAllGuideSlugs } from '@/lib/guides';
import { mdxComponents } from '@/lib/mdx-components';
import { GuideHeader } from '@/components/guide/GuideHeader';
import { ProgressBar } from '@/components/guide/ProgressBar';
import { PrerequisiteCheck } from '@/components/guide/PrerequisiteCheck';
import { GuideFooter } from '@/components/guide/GuideFooter';
import { GuideFeedback } from '@/components/guide/GuideFeedback';
import { TableOfContents } from '@/components/guide/TableOfContents';
import { AdBanner } from '@/components/common/AdBanner';
import { generateHowToSchema, generateBreadcrumbSchema } from '@/lib/seo';

interface Props {
  params: { locale: string; slug: string };
}

export async function generateStaticParams() {
  const slugs = await getAllGuideSlugs();
  const locales = ['ko', 'en'];
  return locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug }))
  );
}

export async function generateMetadata({ params }: Props) {
  const guide = await getGuide(params.slug, params.locale);
  if (!guide) return {};

  const seo = guide.meta.seo[params.locale];
  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      languages: {
        ko: `/ko/guides/${params.slug}`,
        en: `/en/guides/${params.slug}`,
      },
    },
  };
}

export default async function GuidePage({ params }: Props) {
  const guide = await getGuide(params.slug, params.locale);
  if (!guide) notFound();

  const prerequisites = await getPrerequisites(params.slug);
  const nextGuides = await getNextGuides(params.slug);

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateHowToSchema(guide.meta, params.locale, [])),
        }}
      />

      <article className="max-w-7xl mx-auto px-4">
        <div className="lg:grid lg:grid-cols-[220px_1fr_300px] lg:gap-8">
          {/* 좌측 사이드바: 목차 */}
          <aside className="hidden lg:block">
            <TableOfContents
              steps={Array.from({ length: guide.meta.totalSteps }, (_, i) => ({
                number: i + 1,
                title: `Step ${i + 1}`,
              }))}
            />
          </aside>

          {/* 메인 콘텐츠 */}
          <main className="max-w-[720px]">
            <GuideHeader meta={guide.meta} locale={params.locale} />

            {prerequisites.length > 0 && (
              <PrerequisiteCheck prerequisites={prerequisites} />
            )}

            <ProgressBar totalSteps={guide.meta.totalSteps} />

            {/* MDX 본문 렌더링 */}
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <MDXRemote
                source={guide.mdxSource}
                components={mdxComponents}
              />
            </div>

            <GuideFeedback guideSlug={params.slug} />

            <AdBanner slot="guide-bottom" />

            <GuideFooter nextGuides={nextGuides} locale={params.locale} />
          </main>

          {/* 우측 사이드바: 광고 */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <AdBanner slot="sidebar" format="vertical" />
            </div>
          </aside>
        </div>
      </article>
    </>
  );
}
```

---

## 5. Hooks

```typescript
// src/hooks/useScrollSpy.ts
// 현재 보고 있는 섹션 ID를 추적

'use client';
import { useState, useEffect } from 'react';

export function useScrollSpy(ids: string[], offset = 100) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: `-${offset}px 0px -60% 0px` }
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [ids, offset]);

  return activeId;
}
```

```typescript
// src/hooks/useLocalProgress.ts
// 비로그인 사용자용 로컬 진행률 관리

'use client';
import { useState, useEffect } from 'react';

interface LocalProgress {
  currentStep: number;
  completedSteps: number[];
  timestamp: number;
}

export function useLocalProgress(guideSlug: string) {
  const key = `progress:${guideSlug}`;

  const [progress, setProgress] = useState<LocalProgress>({
    currentStep: 0,
    completedSteps: [],
    timestamp: Date.now(),
  });

  useEffect(() => {
    const stored = localStorage.getItem(key);
    if (stored) {
      setProgress(JSON.parse(stored));
    }
  }, [key]);

  const updateStep = (step: number) => {
    const updated = {
      ...progress,
      currentStep: step,
      completedSteps: [...new Set([...progress.completedSteps, step])],
      timestamp: Date.now(),
    };
    setProgress(updated);
    localStorage.setItem(key, JSON.stringify(updated));
  };

  const isStepCompleted = (step: number) => progress.completedSteps.includes(step);

  return { progress, updateStep, isStepCompleted };
}
```

---

*다음: [coding_conventions.md](./coding_conventions.md) — 코딩 컨벤션*
