# 🔌 API Design — CloudSetup.guide

> 최종 수정: 2025.02.07
> 버전: v1.0

---

## 1. API 아키텍처 개요

CloudSetup.guide는 **대부분 정적 사이트(SSG)**이므로 API 의존도가 낮습니다. API는 Phase 2-3의 동적 기능에만 사용됩니다.

```
┌─────────────────────────────────────────────────┐
│                    API 계층                       │
├─────────────────────────────────────────────────┤
│                                                 │
│  [Phase 1] 빌드 타임 데이터 함수 (lib/)           │
│  └── 정적 파일 읽기, API Route 없음              │
│                                                 │
│  [Phase 2] Next.js API Routes                   │
│  ├── POST /api/feedback                         │
│  └── POST /api/newsletter                       │
│                                                 │
│  [Phase 3] Supabase Client SDK (직접 접근)       │
│  ├── Auth (signIn, signOut, getUser)            │
│  ├── guide_progress (CRUD)                      │
│  └── comments (CRUD)                            │
│                                                 │
│  [External] Pagefind (클라이언트 검색)            │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## 2. Phase 1: 빌드 타임 데이터 함수

API Route가 아닌 서버 사이드 유틸 함수들입니다. `generateStaticParams`와 서버 컴포넌트에서 호출됩니다.

### 2.1 가이드 데이터 함수 (lib/guides.ts)

```typescript
// ──────────────────────────────────────────────
// getAllGuides(): GuideMeta[]
// 모든 published 가이드의 메타데이터 반환
// ──────────────────────────────────────────────
// 용도: 가이드 목록, 사이트맵, 검색 인덱스
// 호출: 빌드 타임
// 캐싱: 빌드 시 1회 실행, 결과 메모이제이션
//
export async function getAllGuides(): Promise<GuideMeta[]>;

// ──────────────────────────────────────────────
// getGuide(slug, locale): { meta, mdxSource } | null
// 특정 가이드의 메타 + MDX 소스 반환
// ──────────────────────────────────────────────
// 용도: 가이드 상세 페이지 SSG
// 파라미터:
//   slug: "gcp-vision-api-setup"
//   locale: "ko" | "en"
// 반환: null이면 404
//
export async function getGuide(
  slug: string,
  locale: string
): Promise<{ meta: GuideMeta; mdxSource: string } | null>;

// ──────────────────────────────────────────────
// getGuidesByPlatform(platform): GuideMeta[]
// 플랫폼별 가이드 필터링
// ──────────────────────────────────────────────
export async function getGuidesByPlatform(platform: string): Promise<GuideMeta[]>;

// ──────────────────────────────────────────────
// getGuidesByCategory(category): GuideMeta[]
// 카테고리별 가이드 필터링
// ──────────────────────────────────────────────
export async function getGuidesByCategory(category: string): Promise<GuideMeta[]>;

// ──────────────────────────────────────────────
// getPrerequisites(slug): GuideMeta[]
// 선행 가이드 목록 (메타데이터 포함)
// ──────────────────────────────────────────────
export async function getPrerequisites(slug: string): Promise<GuideMeta[]>;

// ──────────────────────────────────────────────
// getNextGuides(slug): GuideMeta[]
// 추천 다음 가이드 목록
// ──────────────────────────────────────────────
export async function getNextGuides(slug: string): Promise<GuideMeta[]>;

// ──────────────────────────────────────────────
// getAllGuideSlugs(): string[]
// generateStaticParams용 전체 slug 목록
// ──────────────────────────────────────────────
export async function getAllGuideSlugs(): Promise<string[]>;
```

### 2.2 무료 한도 함수 (lib/free-tiers.ts)

```typescript
export function getAllFreeTiers(): FreeTierEntry[];
export function getFreeTiersByPlatform(platform: string): FreeTierEntry[];
export function getFreeTiersByCategory(category: string): FreeTierEntry[];

// 계산기용: 사용량 대비 무료 한도 분석
export function calculateFreeTierUsage(
  entries: FreeTierEntry[],
  usage: Record<string, number>
): FreeTierAnalysisResult[];
```

### 2.3 플랫폼 함수 (lib/platforms.ts)

```typescript
export function getAllPlatforms(): PlatformData[];
export function getPlatform(id: string): PlatformData | undefined;
```

---

## 3. Phase 2: Next.js API Routes

### 3.1 POST /api/feedback

**피드백 수집.** 비로그인 사용자도 제출 가능.

| 항목 | 값 |
|------|-----|
| Method | POST |
| Auth | 불필요 |
| Rate Limit | 10회/분/IP |
| Phase | 2 |

**Request:**

```typescript
interface FeedbackRequest {
  guide_slug: string;                // 필수. 가이드 slug
  step_number?: number;              // 선택. 특정 단계 피드백
  helpful: boolean;                  // 필수. 도움됨 여부
  issue_type?: IssueType;           // 선택. 부정 피드백 시 이유
  message?: string;                  // 선택. 상세 메시지 (max 2000자)
}

type IssueType = 
  | 'outdated_screenshot'    // 스크린샷이 현재와 다름
  | 'unclear_instruction'    // 설명이 불명확
  | 'error_occurred'         // 에러 발생
  | 'missing_info'           // 정보 누락
  | 'other';                 // 기타
```

**Response:**

```typescript
// 성공 (201)
{ "success": true }

// 유효성 에러 (400)
{ "error": "guide_slug and helpful are required" }

// Rate Limit (429)
{ "error": "Too many requests. Try again in 60 seconds." }

// 서버 에러 (500)
{ "error": "Failed to save feedback" }
```

**구현 핵심:**

```typescript
// app/api/feedback/route.ts
export async function POST(req: NextRequest) {
  // 1. Rate limiting (IP 기반, 메모리 Map)
  // 2. JSON 파싱 + 유효성 검사
  // 3. Supabase 서비스키로 INSERT
  // 4. 응답 반환
}
```

**유효성 규칙:**

| 필드 | 규칙 |
|------|------|
| guide_slug | 필수, 1-200자, 영문+숫자+하이픈만 |
| step_number | 선택, 0 이상 정수 |
| helpful | 필수, boolean |
| issue_type | 선택, enum 값만 허용 |
| message | 선택, 최대 2000자 |

---

### 3.2 POST /api/newsletter

**뉴스레터 구독.** 이메일만 수집.

| 항목 | 값 |
|------|-----|
| Method | POST |
| Auth | 불필요 |
| Rate Limit | 5회/분/IP |
| Phase | 2-3 |

**Request:**

```typescript
interface NewsletterRequest {
  email: string;       // 필수. 이메일 주소
  locale: string;      // 필수. "ko" | "en"
}
```

**Response:**

```typescript
// 성공 (201)
{ "success": true, "message": "구독이 완료되었습니다." }

// 이미 구독 (200)
{ "success": true, "message": "이미 구독 중입니다." }

// 유효성 에러 (400)
{ "error": "Valid email is required" }

// Rate Limit (429)
{ "error": "Too many requests" }
```

**구현 핵심:**

```typescript
// app/api/newsletter/route.ts
export async function POST(req: NextRequest) {
  // 1. Rate limiting
  // 2. 이메일 형식 검증 (정규식)
  // 3. Supabase UPSERT (이미 존재하면 subscribed=true로 업데이트)
  // 4. (선택) 환영 이메일 발송 트리거
}
```

---

### 3.3 DELETE /api/newsletter

**뉴스레터 구독 취소.**

| 항목 | 값 |
|------|-----|
| Method | DELETE |
| Auth | 토큰 기반 (이메일 내 링크) |
| Phase | 3 |

**Request:**

```typescript
// URL: /api/newsletter?token=UNSUBSCRIBE_TOKEN
// token은 이메일 주소의 HMAC 해시
```

**Response:**

```typescript
// 성공 (200)
{ "success": true, "message": "구독이 취소되었습니다." }

// 유효하지 않은 토큰 (400)
{ "error": "Invalid or expired token" }
```

---

## 4. Phase 3: Supabase Client SDK

Phase 3의 동적 기능은 **Next.js API Route를 거치지 않고** Supabase Client SDK로 직접 접근합니다. RLS(Row Level Security)가 보안을 담당합니다.

### 4.1 인증 (Auth)

```typescript
// lib/supabase.ts
import { createBrowserClient } from '@supabase/ssr';

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

```typescript
// hooks/useAuth.ts

// 소셜 로그인 (Google)
async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
}

// 소셜 로그인 (GitHub)
async function signInWithGithub() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
}

// 로그아웃
async function signOut() {
  await supabase.auth.signOut();
}

// 현재 사용자 확인
async function getUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// 세션 변경 리스너
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    // 로컬 진행률 → DB 동기화
    syncLocalProgressToServer(session.user.id);
  }
});
```

### 4.2 가이드 진행률 (guide_progress)

```typescript
// lib/progress.ts

interface ProgressData {
  guide_slug: string;
  current_step: number;
  completed: boolean;
}

// ──────────── 읽기 ────────────

// 특정 가이드의 진행률 조회
async function getProgress(guideSlug: string): Promise<ProgressData | null> {
  const { data } = await supabase
    .from('guide_progress')
    .select('guide_slug, current_step, completed')
    .eq('guide_slug', guideSlug)
    .single();
  return data;
}

// 사용자의 모든 진행률 조회 (프로필 페이지용)
async function getAllProgress(): Promise<ProgressData[]> {
  const { data } = await supabase
    .from('guide_progress')
    .select('guide_slug, current_step, completed')
    .order('updated_at', { ascending: false });
  return data || [];
}

// ──────────── 쓰기 ────────────

// 진행률 업데이트 (UPSERT)
async function updateProgress(
  guideSlug: string,
  currentStep: number,
  totalSteps: number
): Promise<void> {
  const completed = currentStep >= totalSteps;

  await supabase
    .from('guide_progress')
    .upsert({
      user_id: (await supabase.auth.getUser()).data.user!.id,
      guide_slug: guideSlug,
      current_step: currentStep,
      completed,
      completed_at: completed ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'user_id,guide_slug',
    });
}

// ──────────── 로컬 폴백 ────────────

// 비로그인 사용자용 localStorage
function getLocalProgress(guideSlug: string): ProgressData | null {
  const stored = localStorage.getItem(`progress:${guideSlug}`);
  return stored ? JSON.parse(stored) : null;
}

function setLocalProgress(guideSlug: string, data: ProgressData): void {
  localStorage.setItem(`progress:${guideSlug}`, JSON.stringify({
    ...data,
    timestamp: Date.now(),
  }));
}

// 로그인 시 로컬 → 서버 동기화
async function syncLocalProgressToServer(userId: string): Promise<void> {
  const keys = Object.keys(localStorage).filter(k => k.startsWith('progress:'));

  for (const key of keys) {
    const slug = key.replace('progress:', '');
    const local = JSON.parse(localStorage.getItem(key)!);

    // 서버에 없거나, 로컬이 더 최신이면 업로드
    const { data: server } = await supabase
      .from('guide_progress')
      .select('updated_at')
      .eq('guide_slug', slug)
      .single();

    if (!server || new Date(local.timestamp) > new Date(server.updated_at)) {
      await supabase.from('guide_progress').upsert({
        user_id: userId,
        guide_slug: slug,
        current_step: local.current_step,
        completed: local.completed,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id,guide_slug' });
    }

    localStorage.removeItem(key);
  }
}
```

### 4.3 댓글 (comments)

```typescript
// lib/comments.ts

interface Comment {
  id: string;
  user_id: string;
  guide_slug: string;
  step_number: number | null;
  content: string;
  parent_id: string | null;
  is_resolved: boolean;
  created_at: string;
  updated_at: string;
  // JOIN
  profiles: {
    display_name: string;
    avatar_url: string;
  };
  // 재귀
  replies?: Comment[];
}

// ──────────── 읽기 ────────────

// 가이드의 댓글 목록 (대댓글 포함)
async function getComments(
  guideSlug: string,
  stepNumber?: number
): Promise<Comment[]> {
  let query = supabase
    .from('comments')
    .select(`
      *,
      profiles (display_name, avatar_url)
    `)
    .eq('guide_slug', guideSlug)
    .is('parent_id', null)         // 최상위 댓글만
    .order('created_at', { ascending: true });

  if (stepNumber !== undefined) {
    query = query.eq('step_number', stepNumber);
  }

  const { data: topLevel } = await query;

  // 대댓글 로드
  if (topLevel && topLevel.length > 0) {
    const { data: replies } = await supabase
      .from('comments')
      .select(`*, profiles (display_name, avatar_url)`)
      .eq('guide_slug', guideSlug)
      .in('parent_id', topLevel.map(c => c.id))
      .order('created_at', { ascending: true });

    // 대댓글 매핑
    return topLevel.map(comment => ({
      ...comment,
      replies: (replies || []).filter(r => r.parent_id === comment.id),
    }));
  }

  return topLevel || [];
}

// ──────────── 쓰기 ────────────

// 댓글 작성
async function createComment(
  guideSlug: string,
  content: string,
  stepNumber?: number,
  parentId?: string
): Promise<Comment | null> {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error('Authentication required');

  // 유효성 검사
  if (!content.trim()) throw new Error('Content is required');
  if (content.length > 5000) throw new Error('Content too long (max 5000)');

  const { data, error } = await supabase
    .from('comments')
    .insert({
      user_id: user.id,
      guide_slug: guideSlug,
      step_number: stepNumber || null,
      content: content.trim(),
      parent_id: parentId || null,
    })
    .select(`*, profiles (display_name, avatar_url)`)
    .single();

  if (error) throw error;
  return data;
}

// 댓글 수정 (본인만)
async function updateComment(
  commentId: string,
  content: string
): Promise<void> {
  if (!content.trim()) throw new Error('Content is required');
  if (content.length > 5000) throw new Error('Content too long');

  const { error } = await supabase
    .from('comments')
    .update({
      content: content.trim(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', commentId);

  if (error) throw error;
}

// 댓글 삭제 (본인만)
async function deleteComment(commentId: string): Promise<void> {
  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId);

  if (error) throw error;
}
```

---

## 5. 클라이언트 사이드 API: 검색 (Pagefind)

```typescript
// lib/search.ts

interface SearchResult {
  url: string;
  title: string;
  excerpt: string;
  meta: {
    platform: string;
    category: string;
    difficulty: string;
  };
}

let pagefind: any = null;

async function initPagefind() {
  if (!pagefind) {
    pagefind = await import(/* webpackIgnore: true */ '/pagefind/pagefind.js');
    await pagefind.init();
  }
  return pagefind;
}

async function search(query: string): Promise<SearchResult[]> {
  const pf = await initPagefind();
  const results = await pf.search(query);

  const detailed = await Promise.all(
    results.results.slice(0, 10).map((r: any) => r.data())
  );

  return detailed.map((item: any) => ({
    url: item.url,
    title: item.meta.title,
    excerpt: item.excerpt,
    meta: {
      platform: item.filters.platform?.[0] || '',
      category: item.filters.category?.[0] || '',
      difficulty: item.filters.difficulty?.[0] || '',
    },
  }));
}

// 필터 포함 검색
async function searchWithFilters(
  query: string,
  filters: { platform?: string; category?: string; difficulty?: string }
): Promise<SearchResult[]> {
  const pf = await initPagefind();
  const results = await pf.search(query, { filters });

  const detailed = await Promise.all(
    results.results.slice(0, 10).map((r: any) => r.data())
  );

  return detailed.map((item: any) => ({
    url: item.url,
    title: item.meta.title,
    excerpt: item.excerpt,
    meta: {
      platform: item.filters.platform?.[0] || '',
      category: item.filters.category?.[0] || '',
      difficulty: item.filters.difficulty?.[0] || '',
    },
  }));
}
```

---

## 6. 클라이언트 사이드 API: Analytics

```typescript
// lib/analytics.ts

type EventName =
  | 'page_view'
  | 'guide_start'
  | 'guide_step'
  | 'guide_step_complete'
  | 'guide_stuck'
  | 'guide_complete'
  | 'guide_feedback'
  | 'code_copy'
  | 'search'
  | 'filter_use'
  | 'outbound_click'
  | 'newsletter_subscribe';

interface EventParams {
  guide_start: { slug: string; platform: string; category: string; difficulty: string };
  guide_step: { slug: string; step_number: number };
  guide_step_complete: { slug: string; step_number: number };
  guide_stuck: { slug: string; step_number: number };
  guide_complete: { slug: string; platform: string; total_time_seconds: number };
  guide_feedback: { slug: string; helpful: boolean; issue_type?: string };
  code_copy: { slug: string; step_number: number; code_type: string };
  search: { query: string; results_count: number; selected_result?: string };
  filter_use: { filter_type: string; filter_value: string };
  outbound_click: { url: string; context: string };
  newsletter_subscribe: { locale: string };
}

function trackEvent<T extends EventName>(
  name: T,
  params: T extends keyof EventParams ? EventParams[T] : Record<string, never>
) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', name, params);
  }
}

// 사용 예시
trackEvent('guide_start', {
  slug: 'gcp-vision-api-setup',
  platform: 'gcp',
  category: 'ai-ml',
  difficulty: 'beginner',
});

trackEvent('code_copy', {
  slug: 'gcp-vision-api-setup',
  step_number: 3,
  code_type: 'cli_command',
});
```

---

## 7. SEO 관련 API (빌드 타임)

### 7.1 sitemap.ts

```typescript
// app/sitemap.ts

import { MetadataRoute } from 'next';
import { getAllGuides } from '@/lib/guides';
import { getAllPlatforms } from '@/lib/platforms';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const guides = await getAllGuides();
  const platforms = getAllPlatforms();
  const locales = ['ko', 'en'];
  const baseUrl = 'https://cloudsetup.guide';

  const entries: MetadataRoute.Sitemap = [];

  // 홈
  for (const locale of locales) {
    entries.push({
      url: `${baseUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    });
  }

  // 가이드
  for (const guide of guides) {
    for (const locale of locales) {
      entries.push({
        url: `${baseUrl}/${locale}/guides/${guide.slug}`,
        lastModified: new Date(guide.updatedAt),
        changeFrequency: 'monthly',
        priority: 0.9,
      });
    }
  }

  // 플랫폼
  for (const platform of platforms) {
    for (const locale of locales) {
      entries.push({
        url: `${baseUrl}/${locale}/platforms/${platform.id}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    }
  }

  // 도구
  for (const locale of locales) {
    entries.push({
      url: `${baseUrl}/${locale}/tools/free-tier-dashboard`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    });
    entries.push({
      url: `${baseUrl}/${locale}/tools/free-tier-calculator`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    });
  }

  return entries;
}
```

### 7.2 JSON-LD 생성 (lib/seo.ts)

```typescript
// lib/seo.ts

import type { GuideMeta } from '@/types/guide';

// HowTo Schema (가이드 페이지용)
export function generateHowToSchema(
  guide: GuideMeta,
  locale: string,
  steps: Array<{ title: string; text: string; image?: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: guide.seo[locale].title,
    description: guide.seo[locale].description,
    totalTime: `PT${guide.estimatedMinutes}M`,
    tool: [{ '@type': 'HowToTool', name: 'Web Browser' }],
    step: steps.map((step, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: step.title,
      text: step.text,
      ...(step.image ? { image: step.image } : {}),
    })),
  };
}

// BreadcrumbList Schema
export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
```

---

## 8. API 요약표

| 엔드포인트/함수 | 유형 | Phase | Auth | 설명 |
|----------------|------|-------|------|------|
| `getAllGuides()` | 빌드 함수 | 1 | — | 전체 가이드 목록 |
| `getGuide(slug, locale)` | 빌드 함수 | 1 | — | 개별 가이드 콘텐츠 |
| `getGuidesByPlatform()` | 빌드 함수 | 1 | — | 플랫폼별 필터 |
| `getAllFreeTiers()` | 빌드 함수 | 1 | — | 무료 한도 데이터 |
| `calculateFreeTierUsage()` | 클라이언트 함수 | 2 | — | 한도 계산기 |
| Pagefind `search()` | 클라이언트 | 1 | — | 정적 검색 |
| `POST /api/feedback` | API Route | 2 | 불필요 | 피드백 수집 |
| `POST /api/newsletter` | API Route | 2 | 불필요 | 뉴스레터 구독 |
| `DELETE /api/newsletter` | API Route | 3 | 토큰 | 구독 취소 |
| `supabase.auth.signInWithOAuth()` | SDK | 3 | — | 소셜 로그인 |
| `supabase.from('guide_progress')` | SDK | 3 | RLS | 진행률 CRUD |
| `supabase.from('comments')` | SDK | 3 | RLS | 댓글 CRUD |
| `trackEvent()` | 클라이언트 | 1 | — | GA4 이벤트 |
| `sitemap()` | 빌드 | 1 | — | 사이트맵 생성 |

---

## 9. 에러 코드 정의

| HTTP | 코드 | 의미 | 대응 |
|------|------|------|------|
| 200 | OK | 성공 | — |
| 201 | CREATED | 리소스 생성 성공 | — |
| 400 | BAD_REQUEST | 유효성 검사 실패 | 에러 메시지 표시 |
| 401 | UNAUTHORIZED | 인증 필요 | 로그인 모달 표시 |
| 403 | FORBIDDEN | 권한 없음 (다른 사용자 데이터) | "권한이 없습니다" |
| 404 | NOT_FOUND | 리소스 없음 | 404 페이지 표시 |
| 429 | RATE_LIMITED | 요청 과다 | "잠시 후 다시 시도해주세요" |
| 500 | SERVER_ERROR | 서버 오류 | "오류가 발생했습니다. 나중에 시도해주세요" |

---

## 10. 환경 변수

```bash
# .env.local

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...       # 공개키 (RLS 적용)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...             # 비밀키 (API Routes에서만 사용)

# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# AdSense
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXX

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=cloudsetup

# Site
NEXT_PUBLIC_SITE_URL=https://cloudsetup.guide
```

---

*다음 문서: [architecture.md](./architecture.md) — 시스템 아키텍처*
