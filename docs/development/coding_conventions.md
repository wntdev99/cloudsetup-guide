# 📏 Coding Conventions — CloudSetup.guide

> 최종 수정: 2025.02.07
> 버전: v1.0

---

## 1. 파일 & 디렉토리 네이밍

| 대상 | 규칙 | 예시 |
|------|------|------|
| 컴포넌트 파일 | PascalCase.tsx | `GuideHeader.tsx`, `CopyBlock.tsx` |
| 훅 파일 | camelCase.ts (use 접두사) | `useScrollSpy.ts`, `useLocalProgress.ts` |
| 유틸/라이브러리 | kebab-case.ts 또는 camelCase.ts | `guides.ts`, `free-tiers.ts`, `mdx-components.tsx` |
| 타입 파일 | kebab-case.ts | `guide.ts`, `platform.ts`, `free-tier.ts` |
| 페이지 파일 | page.tsx (Next.js 규칙) | `app/[locale]/guides/[slug]/page.tsx` |
| 레이아웃 파일 | layout.tsx (Next.js 규칙) | `app/[locale]/layout.tsx` |
| MDX 콘텐츠 | 로케일.mdx | `ko.mdx`, `en.mdx` |
| JSON 데이터 | kebab-case.json | `free-tiers.json`, `platforms.json` |
| 디렉토리 | kebab-case | `guide/`, `free-tier-dashboard/` |
| 가이드 slug | kebab-case (플랫폼-서비스-행동) | `gcp-vision-api-setup` |

---

## 2. TypeScript 규칙

### 2.1 타입 정의

```typescript
// ✅ 인터페이스: 데이터 모양 정의 (확장 가능)
interface GuideMeta {
  slug: string;
  platform: Platform;
  // ...
}

// ✅ 타입 별칭: 유니온, 유틸리티, 단순 타입
type Platform = 'gcp' | 'aws' | 'azure' | 'supabase' | 'vercel' | 'cloudflare' | 'firebase';
type Difficulty = 'beginner' | 'intermediate' | 'advanced';

// ✅ Props는 인터페이스로
interface StepProps {
  number: number;
  title: string;
  estimatedMinutes?: number;
  children: React.ReactNode;
}

// ❌ any 사용 금지
function processData(data: any) { } // BAD
function processData(data: unknown) { } // GOOD (필요 시 타입 가드)

// ❌ 인라인 타입 대신 명시적 정의
function foo({ a, b }: { a: string; b: number }) { } // BAD (간단한 경우 제외)
```

### 2.2 타입 파일 구조

```
src/types/
├── guide.ts         # GuideMeta, GuideSEO, FreeTierInfo 등
├── platform.ts      # PlatformData, PlatformFreeCredit
├── free-tier.ts     # FreeTierEntry, FreeTierAnalysisResult
├── feedback.ts      # FeedbackRequest, IssueType
├── comment.ts       # Comment, CreateCommentInput (Phase 3)
└── index.ts         # 전체 re-export
```

### 2.3 Non-null Assertion 최소화

```typescript
// ❌ ! 연산자 남용
const user = getUser()!;

// ✅ 가드 절 사용
const user = getUser();
if (!user) throw new Error('User not found');
```

---

## 3. React 컴포넌트 규칙

### 3.1 서버 vs 클라이언트 구분

```tsx
// ✅ 서버 컴포넌트 (기본, 'use client' 없음)
// - 데이터 페칭, 렌더링만 하는 경우
// - 이벤트 핸들러, useState, useEffect 없음
export function GuideHeader({ meta, locale }: GuideHeaderProps) {
  return <div>{meta.service}</div>;
}

// ✅ 클라이언트 컴포넌트 (명시적 'use client')
// - useState, useEffect, 이벤트 핸들러 사용 시
// - 브라우저 API (localStorage, clipboard 등) 사용 시
'use client';
export function CopyBlock({ code }: CopyBlockProps) {
  const [copied, setCopied] = useState(false);
  // ...
}
```

**판단 기준:**

| 기능 필요 | → 컴포넌트 유형 |
|----------|----------------|
| useState, useEffect | 클라이언트 |
| onClick, onChange 등 이벤트 | 클라이언트 |
| localStorage, clipboard API | 클라이언트 |
| IntersectionObserver | 클라이언트 |
| 순수 렌더링 (조건부 포함) | 서버 |
| async 데이터 페칭 | 서버 |
| 외부 패키지 (서버 호환) | 서버 |

### 3.2 컴포넌트 구조 순서

```tsx
// 1. 'use client' (필요 시)
'use client';

// 2. imports
import { useState } from 'react';
import { SomeIcon } from 'lucide-react';
import type { SomeType } from '@/types';

// 3. 타입 정의
interface Props {
  // ...
}

// 4. 상수 (컴포넌트 외부)
const CONFIG = { /* ... */ };

// 5. 컴포넌트 (named export)
export function ComponentName({ prop1, prop2 }: Props) {
  // 5a. hooks
  const [state, setState] = useState();

  // 5b. 파생 값 (useMemo 또는 일반 계산)
  const derived = prop1 + prop2;

  // 5c. 이벤트 핸들러
  const handleClick = () => { /* ... */ };

  // 5d. 이펙트
  useEffect(() => { /* ... */ }, []);

  // 5e. 조기 반환 (가드)
  if (!prop1) return null;

  // 5f. 렌더링
  return <div>...</div>;
}
```

### 3.3 named export 사용

```tsx
// ✅ named export
export function GuideHeader() { }

// ❌ default export (페이지 컴포넌트 제외)
export default function GuideHeader() { }

// 예외: Next.js 페이지/레이아웃은 default export 필수
export default function GuidePage() { } // page.tsx에서만
```

---

## 4. CSS / Tailwind 규칙

### 4.1 클래스 순서

```
레이아웃 → 크기 → 여백/패딩 → 배경 → 텍스트 → 테두리 → 기타 → 반응형 → 상태

className="flex items-center gap-3       // 레이아웃
           w-full h-10                    // 크기
           p-4 mx-auto                    // 여백
           bg-primary                     // 배경
           text-white text-sm font-bold   // 텍스트
           border border-border rounded-lg // 테두리
           transition-colors              // 기타
           md:w-auto                      // 반응형
           hover:bg-primary-600           // 상태
           dark:bg-primary-400"           // 다크모드
```

### 4.2 커스텀 유틸리티 클래스

```css
/* src/styles/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 40 10% 98%;
    --foreground: 20 14% 10%;
    /* shadcn/ui CSS 변수 */
  }
  .dark {
    --background: 20 10% 6%;
    --foreground: 60 10% 96%;
  }
}

@layer utilities {
  /* 스크롤 시 헤더 높이만큼 오프셋 */
  .scroll-mt-header {
    scroll-margin-top: 5rem;
  }
}
```

### 4.3 반응형 브레이크포인트

```
sm: 640px   — 거의 사용 안 함
md: 768px   — 태블릿 전환점 (핵심)
lg: 1024px  — 데스크톱 전환점 (핵심, 사이드바 표시)
xl: 1280px  — 와이드 데스크톱
2xl: 1536px — 거의 사용 안 함

패턴:
모바일 기본 → md: 태블릿 → lg: 데스크톱

예:
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
className="hidden lg:block"              // 데스크톱에서만 표시
className="block lg:hidden"              // 모바일/태블릿에서만 표시
```

---

## 5. 데이터 페칭 규칙

### 5.1 서버 사이드 (빌드 타임)

```tsx
// ✅ 서버 컴포넌트에서 직접 호출
export default async function GuidePage({ params }: Props) {
  const guide = await getGuide(params.slug, params.locale);
  if (!guide) notFound();

  return <div>{guide.meta.title}</div>;
}

// ✅ 정적 경로 생성
export async function generateStaticParams() {
  const slugs = await getAllGuideSlugs();
  return slugs.map((slug) => ({ slug }));
}
```

### 5.2 클라이언트 사이드

```tsx
// ✅ 간단한 fetch
'use client';
const handleFeedback = async (helpful: boolean) => {
  try {
    const res = await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ guide_slug: slug, helpful }),
    });
    if (!res.ok) throw new Error('Failed');
    setSubmitted(true);
  } catch (err) {
    setError('피드백 제출에 실패했습니다.');
  }
};

// ✅ Supabase 접근 (Phase 3)
const { data, error } = await supabase
  .from('comments')
  .select('*, profiles(display_name, avatar_url)')
  .eq('guide_slug', slug)
  .order('created_at');
```

---

## 6. MDX 작성 규칙

### 6.1 가이드 MDX 구조

```mdx
{/* 가이드는 항상 Step으로 시작 */}

<Step number={1} title="명확한 단계 제목">

<Screenshot
  src="step1-descriptive-name-ko.png"
  alt="화면에 대한 설명 (접근성)"
  highlight={{ x: 15, y: 30, width: 20, height: 5 }}
  caption="빨간 박스 부분을 클릭하세요"
/>

1. 첫 번째 행동 (동사로 시작)
2. 두 번째 행동
3. 세 번째 행동

<Callout type="info">
부연 설명이 필요한 경우 (1-2문장)
</Callout>

<FreeTierInfo
  service="서비스명"
  limit="월 1,000회"
  overage="초과 시 $1.50/1,000회"
/>

<DevTip>
CLI 명령어: `gcloud services enable vision.googleapis.com`
</DevTip>

<Checkpoint>기대하는 결과가 보이나요?</Checkpoint>

</Step>
```

### 6.2 스크린샷 네이밍

```
패턴: step{N}-{설명}-{locale}.png

예시:
step1-gcp-console-top-ko.png
step1-gcp-console-top-en.png
step2-api-library-search-ko.png
step3-enable-button-ko.png
step4-credentials-page-ko.png
```

### 6.3 하이라이트 좌표 (% 기반)

```
x: 왼쪽 경계 (0% = 좌측 끝, 100% = 우측 끝)
y: 상단 경계
width: 박스 너비
height: 박스 높이

예: 화면 중앙에 가로 20%, 세로 5% 크기의 버튼
{ x: 40, y: 50, width: 20, height: 5 }
```

---

## 7. Git 커밋 컨벤션

### 7.1 커밋 메시지 형식

```
<type>(<scope>): <description>

type:
  feat     — 새 기능
  fix      — 버그 수정
  content  — 가이드/콘텐츠 추가/수정
  style    — UI/스타일 변경
  refactor — 리팩토링
  perf     — 성능 개선
  docs     — 문서 변경
  test     — 테스트
  chore    — 빌드/설정 변경

scope (선택):
  guide, platform, search, i18n, seo, auth, comment, feedback, ad

예시:
feat(guide): add CopyBlock component with clipboard support
content(guide): add gcp-vision-api-setup guide (ko/en)
fix(search): fix pagefind index not updating on build
style(guide): improve screenshot highlight visibility
perf(image): add blur placeholder for screenshots
chore: upgrade next to 14.2.0
```

### 7.2 브랜치 전략

```
main ─────────────────────── 프로덕션 (자동 배포)
  │
  ├── feat/component-name ── 기능 개발 브랜치
  ├── content/guide-slug ─── 콘텐츠 추가 브랜치
  ├── fix/issue-description ─ 버그 수정 브랜치
  └── chore/description ──── 유지보수 브랜치

흐름:
1. main에서 브랜치 생성
2. 작업 후 PR 생성 (Vercel Preview 자동 배포)
3. 리뷰 후 main에 머지 (Vercel Production 자동 배포)
```

---

## 8. 에러 처리 패턴

```typescript
// ✅ API Route 에러 처리
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // 유효성 검사
    if (!body.guide_slug) {
      return NextResponse.json({ error: 'guide_slug required' }, { status: 400 });
    }
    // 로직
    const { error } = await supabase.from('feedback').insert(body);
    if (error) throw error;
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error('Feedback error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

// ✅ 클라이언트 에러 처리
const handleSubmit = async () => {
  setLoading(true);
  setError(null);
  try {
    const res = await fetch('/api/feedback', { /* ... */ });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Unknown error');
    }
    setSuccess(true);
  } catch (err) {
    setError(err instanceof Error ? err.message : '오류가 발생했습니다.');
  } finally {
    setLoading(false);
  }
};
```

---

## 9. 성능 규칙

```
1. 이미지는 반드시 next/image 사용 (자동 최적화)
2. 첫 스크린샷만 priority={true}, 나머지는 lazy
3. 클라이언트 컴포넌트 최소화 (서버 컴포넌트 우선)
4. 무거운 라이브러리는 dynamic import: const Heavy = dynamic(() => import('./Heavy'))
5. AdSense는 IntersectionObserver로 뷰포트 진입 시 로드
6. 폰트는 next/font로 자동 최적화
7. 외부 스크립트는 next/script strategy="lazyOnload"
```

---

*다음: [file_tree.md](./file_tree.md) — 전체 파일 트리*
