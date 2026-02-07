# 🔧 Technical Architecture — CloudSetup.guide

> 최종 수정: 2025.02.07
> 버전: v1.0

---

## 1. 기술 스택 개요

```
┌─────────────────────────────────────────────────────┐
│                    프론트엔드                         │
│  Next.js 14+ (App Router) + Tailwind CSS + shadcn/ui │
├─────────────────────────────────────────────────────┤
│                   콘텐츠 관리                         │
│  MDX (마크다운 + React 컴포넌트) + next-mdx-remote    │
├─────────────────────────────────────────────────────┤
│                    다국어                             │
│  next-intl (App Router 호환)                         │
├─────────────────────────────────────────────────────┤
│                    검색                              │
│  Pagefind (Phase 1) → Algolia (Phase 3+)            │
├─────────────────────────────────────────────────────┤
│                   데이터베이스                        │
│  Supabase (PostgreSQL) — Phase 3부터 활성화          │
├─────────────────────────────────────────────────────┤
│                    이미지                             │
│  Cloudinary (CDN + 자동 최적화) + next/image          │
├─────────────────────────────────────────────────────┤
│                    배포                              │
│  Vercel (무료 → Pro)                                │
├─────────────────────────────────────────────────────┤
│                    분석                              │
│  Google Analytics 4 + Search Console                │
├─────────────────────────────────────────────────────┤
│                    광고                              │
│  Google AdSense                                     │
└─────────────────────────────────────────────────────┘
```

---

## 2. 기술 선택 근거

### 2.1 Next.js 14+ (App Router)

**선택 이유:**
- **SEO가 생명인 사이트** → SSG(Static Site Generation)가 필수 → Next.js가 업계 표준
- **App Router**: 레이아웃 시스템, 서버 컴포넌트, 스트리밍 SSR 지원
- **MDX 네이티브 지원**: @next/mdx 또는 next-mdx-remote로 콘텐츠 관리
- **i18n 지원**: next-intl과 조합으로 한/영 라우팅
- **Vercel 최적화**: 배포, CDN, ISR(Incremental Static Regeneration) 최적

**대안 비교:**

| 프레임워크 | SEO | MDX | i18n | 배포 | 결론 |
|-----------|-----|-----|------|------|------|
| Next.js 14+ | ⭐⭐⭐ SSG/SSR | ⭐⭐⭐ 네이티브 | ⭐⭐⭐ next-intl | ⭐⭐⭐ Vercel | ✅ 선택 |
| Astro | ⭐⭐⭐ SSG | ⭐⭐⭐ 네이티브 | ⭐⭐ 가능 | ⭐⭐ 다양 | 커뮤니티 작음 |
| Nuxt 3 | ⭐⭐⭐ SSG/SSR | ⭐⭐ 플러그인 | ⭐⭐⭐ i18n | ⭐⭐ Netlify | Vue 생태계 제한 |
| Gatsby | ⭐⭐⭐ SSG | ⭐⭐⭐ 네이티브 | ⭐⭐ 플러그인 | ⭐⭐ 다양 | 빌드 느림, 쇠퇴 |

### 2.2 Tailwind CSS + shadcn/ui

**선택 이유:**
- Tailwind: 유틸리티 우선, 빠른 개발, 퍼포먼스 최적화 (미사용 CSS 제거)
- shadcn/ui: 복사-붙여넣기 기반 (npm 의존성 아님), 완전 커스터마이즈 가능
- 조합: 일관된 디자인 시스템을 빠르게 구축

### 2.3 MDX + next-mdx-remote

**선택 이유:**
- 마크다운의 편의성 + React 컴포넌트의 표현력
- Git으로 버전 관리 가능 (DB 불필요)
- 오픈소스 기여에 적합 (PR로 가이드 수정/추가)
- next-mdx-remote: 동적 MDX 로딩, 컴포넌트 매핑

### 2.4 Supabase

**선택 이유:**
- PostgreSQL 기반 (범용, 강력)
- Auth 내장 (Google, GitHub 소셜 로그인)
- 무료 티어 넉넉: 500MB DB, 5만 MAU, 1GB 파일
- 실시간 구독 지원 (댓글 알림에 활용 가능)
- Phase 1에서는 사용하지 않음 → Phase 3부터 활성화

### 2.5 Vercel

**선택 이유:**
- Next.js 개발사가 운영 → 최적화 보장
- 무료 티어: 100GB 대역폭, 커스텀 도메인, HTTPS
- 글로벌 Edge Network (CDN)
- Preview Deployments (PR별 미리보기)
- 자동 CI/CD (Git push → 자동 배포)

---

## 3. 프로젝트 구조

```
cloudsetup-guide/
│
├── app/                              # Next.js App Router
│   ├── [locale]/                     # 다국어 라우팅 (ko, en)
│   │   ├── layout.tsx                # 전역 레이아웃 (헤더, 푸터)
│   │   ├── page.tsx                  # 홈페이지
│   │   ├── platforms/
│   │   │   ├── page.tsx              # 플랫폼 목록
│   │   │   └── [platform]/
│   │   │       └── page.tsx          # 개별 플랫폼 (GCP, AWS...)
│   │   ├── guides/
│   │   │   ├── page.tsx              # 가이드 목록 + 필터
│   │   │   └── [slug]/
│   │   │       └── page.tsx          # 개별 가이드 ★핵심
│   │   ├── use-cases/
│   │   │   └── [slug]/
│   │   │       └── page.tsx          # 활용 시나리오
│   │   ├── compare/
│   │   │   └── [slug]/
│   │   │       └── page.tsx          # 비교 페이지
│   │   ├── tools/
│   │   │   ├── free-tier-dashboard/
│   │   │   │   └── page.tsx          # 무료 한도 대시보드
│   │   │   └── free-tier-calculator/
│   │   │       └── page.tsx          # 무료 한도 계산기
│   │   └── blog/
│   │       └── [slug]/
│   │           └── page.tsx          # 블로그 포스트
│   ├── api/                          # API Routes (Phase 3)
│   │   ├── feedback/
│   │   │   └── route.ts              # 피드백 수집
│   │   └── comments/
│   │       └── route.ts              # 댓글 CRUD
│   ├── sitemap.ts                    # 동적 사이트맵
│   └── robots.ts                     # robots.txt
│
├── components/
│   ├── guide/                        # 가이드 전용 컴포넌트
│   │   ├── Step.tsx                  # 단계 컨테이너
│   │   ├── Screenshot.tsx            # 스크린샷 + 하이라이트
│   │   ├── Callout.tsx               # 알림 박스 (warning, info, danger, tip)
│   │   ├── CopyBlock.tsx             # 코드 복사 블록
│   │   ├── FreeTierInfo.tsx          # 무료 한도 배지
│   │   ├── DevTip.tsx                # 개발자 팁 (접힌 상태)
│   │   ├── Checkpoint.tsx            # 진행 확인
│   │   ├── ProgressBar.tsx           # 진행률 바
│   │   ├── TableOfContents.tsx       # 목차 (사이드바)
│   │   ├── PrerequisiteCheck.tsx     # 선행 가이드 체크
│   │   ├── GuideHeader.tsx           # 가이드 상단 메타
│   │   ├── GuideFooter.tsx           # 완료 + 다음 추천
│   │   ├── GuideNavigation.tsx       # 이전/다음 버튼
│   │   └── GuideFeedback.tsx         # 피드백 위젯
│   │
│   ├── platform/
│   │   ├── PlatformCard.tsx          # 플랫폼 카드
│   │   ├── PlatformGrid.tsx          # 카드 그리드
│   │   └── ApiCard.tsx               # API 개별 카드
│   │
│   ├── explore/
│   │   ├── SearchBar.tsx             # 검색바
│   │   ├── FilterBar.tsx             # 필터 바
│   │   ├── PurposeGrid.tsx           # 목적별 탐색
│   │   └── GuideList.tsx             # 가이드 리스트
│   │
│   ├── tools/
│   │   ├── FreeTierDashboard.tsx     # 무료 한도 대시보드
│   │   └── FreeTierCalculator.tsx    # 계산기
│   │
│   ├── common/
│   │   ├── Header.tsx                # 글로벌 헤더
│   │   ├── Footer.tsx                # 글로벌 푸터
│   │   ├── LanguageSwitcher.tsx      # 한/영 전환
│   │   ├── ThemeToggle.tsx           # 다크모드 토글
│   │   ├── AdBanner.tsx              # 광고 래퍼
│   │   └── Badge.tsx                 # 범용 배지
│   │
│   └── ui/                           # shadcn/ui 컴포넌트
│       ├── button.tsx
│       ├── card.tsx
│       ├── select.tsx
│       ├── dialog.tsx
│       ├── progress.tsx
│       └── ...
│
├── content/                          # MDX 콘텐츠
│   ├── guides/
│   │   ├── gcp-account-setup/
│   │   │   ├── ko.mdx
│   │   │   ├── en.mdx
│   │   │   ├── meta.json
│   │   │   └── screenshots/
│   │   │       ├── step1-ko.png
│   │   │       └── step1-en.png
│   │   ├── gcp-vision-api-setup/
│   │   │   ├── ko.mdx
│   │   │   ├── en.mdx
│   │   │   ├── meta.json
│   │   │   └── screenshots/
│   │   └── ...
│   ├── platforms/
│   │   ├── gcp.json
│   │   ├── aws.json
│   │   └── ...
│   └── use-cases/
│
├── data/
│   ├── free-tiers.json              # 무료 한도 데이터 (정적)
│   ├── platforms.json                # 플랫폼 메타데이터
│   └── categories.json              # 카테고리 정의
│
├── lib/
│   ├── mdx.ts                       # MDX 파싱/렌더링 유틸
│   ├── guides.ts                    # 가이드 데이터 로직
│   ├── platforms.ts                 # 플랫폼 데이터 로직
│   ├── free-tiers.ts                # 무료 한도 데이터 로직
│   ├── i18n.ts                      # next-intl 설정
│   ├── supabase.ts                  # Supabase 클라이언트 (Phase 3)
│   ├── analytics.ts                 # GA4 이벤트 트래킹
│   └── seo.ts                       # SEO 헬퍼 (JSON-LD 등)
│
├── messages/                         # UI 번역 파일
│   ├── ko.json                      # 한국어 UI 문구
│   └── en.json                      # 영어 UI 문구
│
├── public/
│   ├── images/
│   │   ├── platforms/               # 플랫폼 로고
│   │   └── og/                      # Open Graph 이미지
│   ├── fonts/                       # 웹 폰트
│   └── favicon.ico
│
├── styles/
│   └── globals.css                  # Tailwind 글로벌 + 커스텀
│
├── scripts/
│   ├── generate-sitemap.ts          # 사이트맵 생성
│   ├── validate-guides.ts           # 가이드 meta.json 유효성 검사
│   └── check-screenshots.ts         # 스크린샷 검증일 체크
│
├── next.config.mjs                  # Next.js 설정
├── tailwind.config.ts               # Tailwind 설정
├── tsconfig.json                    # TypeScript 설정
├── package.json
└── README.md
```

---

## 4. 핵심 데이터 모델

### 4.1 가이드 (Guide) — 정적 파일 기반

```typescript
// lib/guides.ts

interface GuideMeta {
  slug: string;
  platform: 'gcp' | 'aws' | 'azure' | 'supabase' | 'vercel' | 'cloudflare' | 'firebase';
  service: string;
  category: 'ai-ml' | 'compute' | 'database' | 'storage' | 'auth' | 'maps' | 'cdn' | 'monitoring';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedMinutes: number;
  totalSteps: number;
  freeTier: {
    limit: string;
    period: 'monthly' | 'daily' | 'yearly' | 'permanent';
    amount: number;
    unit: string;
    overagePrice?: string;
    conditions?: string[];
    status: 'generous' | 'moderate' | 'limited';
  };
  prerequisites: string[];     // 선행 가이드 slug 배열
  nextGuides: string[];        // 후행 가이드 slug 배열
  tags: string[];
  seo: {
    [locale: string]: {
      title: string;
      description: string;
    };
  };
  lastVerified: string;        // ISO date
  author: string;
  createdAt: string;
  updatedAt: string;
}

// 가이드 데이터 로드 함수
async function getGuide(slug: string, locale: string): Promise<{
  meta: GuideMeta;
  content: MDXRemoteSerializeResult;
}>;

async function getAllGuides(): Promise<GuideMeta[]>;

async function getGuidesByPlatform(platform: string): Promise<GuideMeta[]>;

async function getGuidesByCategory(category: string): Promise<GuideMeta[]>;
```

### 4.2 플랫폼 (Platform) — 정적 JSON

```typescript
interface Platform {
  id: string;
  name: string;
  logo: string;
  color: string;
  description: {
    ko: string;
    en: string;
  };
  freeCredits?: {
    amount: string;
    duration: string;
  };
  guideCount: number;
  officialUrl: string;
  pricingUrl: string;
}
```

### 4.3 무료 한도 (FreeTier) — 정적 JSON

```typescript
interface FreeTierEntry {
  platform: string;
  service: string;
  category: string;
  freeLimit: string;
  freeLimitValue: {
    amount: number;
    unit: string;
    period: string;
  };
  overagePrice?: string;
  conditions?: string[];
  status: 'generous' | 'moderate' | 'limited';
  guideSlug?: string;
  officialUrl: string;
  lastVerified: string;
}
```

### 4.4 DB 스키마 (Phase 3 — Supabase)

```sql
-- 사용자 프로필
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  display_name TEXT,
  avatar_url TEXT,
  locale TEXT DEFAULT 'ko',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 가이드 진행률
CREATE TABLE guide_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  guide_slug TEXT NOT NULL,
  current_step INT DEFAULT 0,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, guide_slug)
);

-- 댓글
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  guide_slug TEXT NOT NULL,
  step_number INT,
  content TEXT NOT NULL,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 피드백
CREATE TABLE feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guide_slug TEXT NOT NULL,
  helpful BOOLEAN NOT NULL,
  issue_type TEXT,
  message TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS 정책
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE guide_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- 자기 데이터만 접근 가능
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can manage own progress"
  ON guide_progress FOR ALL USING (auth.uid() = user_id);

-- 댓글은 모두 읽기 가능, 쓰기는 인증 필요
CREATE POLICY "Anyone can read comments"
  ON comments FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Authenticated users can write comments"
  ON comments FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
```

---

## 5. 빌드 및 배포 파이프라인

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  개발자   │ →  │  GitHub   │ →  │  Vercel   │ →  │  CDN     │
│          │    │          │    │  빌드     │    │  (Edge)  │
│ MDX 작성 │    │ PR/Push  │    │ SSG 생성  │    │  배포    │
│ 코드 수정│    │          │    │ Pagefind  │    │          │
└──────────┘    └──────────┘    └──────────┘    └──────────┘

CI/CD 단계:
1. Push to GitHub (main branch)
2. Vercel 자동 감지 → 빌드 시작
3. next build → 정적 페이지 생성
4. Pagefind 인덱스 생성 (post-build)
5. 가이드 meta.json 유효성 검사
6. Preview 배포 (PR) 또는 Production 배포 (main)
7. 검색 인덱스 업로드
8. 캐시 무효화 (변경된 페이지만)
```

### 5.1 빌드 스크립트

```json
// package.json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build && npm run postbuild",
    "postbuild": "npx pagefind --site .next/server/app && npm run validate",
    "validate": "tsx scripts/validate-guides.ts",
    "check-screenshots": "tsx scripts/check-screenshots.ts",
    "start": "next start",
    "lint": "next lint"
  }
}
```

---

## 6. 성능 최적화 전략

### 6.1 Core Web Vitals 목표

| 지표 | 목표 | 전략 |
|------|------|------|
| LCP | < 2.5s | SSG + CDN + next/image |
| FID | < 100ms | 최소 클라이언트 JS |
| CLS | < 0.1 | 이미지 크기 예약 + 광고 영역 고정 |

### 6.2 이미지 최적화

```
스크린샷 파이프라인:
원본 PNG → Cloudinary 업로드 → 자동 WebP 변환 → 반응형 크기 제공

next/image 설정:
- sizes: "(max-width: 768px) 100vw, 800px"
- priority: 첫 스크린샷만 true
- placeholder: "blur" (blurDataURL 자동 생성)
- quality: 80
```

### 6.3 JavaScript 최적화

```
전략:
1. 서버 컴포넌트 최대 활용 (클라이언트 JS 최소화)
2. 동적 임포트: 검색, 계산기 등은 lazy load
3. 코드 스플리팅: 가이드 MDX 콘텐츠는 페이지별 분리
4. AdSense 지연 로딩: IntersectionObserver로 뷰포트 진입 시 로드
```

---

## 7. 모니터링 & 로깅

```
Vercel Analytics (무료):
- Web Vitals 모니터링
- 페이지별 로딩 성능

GA4:
- 사용자 행동 분석
- 가이드 완료율 추적
- 검색어 분석

Vercel Logs:
- 빌드 로그
- 에러 트래킹

Uptime 모니터링:
- UptimeRobot (무료, 5분 간격)
```

---

## 8. 보안 고려사항

| 영역 | 조치 |
|------|------|
| HTTPS | Vercel 자동 SSL |
| CSP 헤더 | script-src, img-src 제한 |
| XSS | MDX 렌더링 시 sanitize |
| CSRF | Supabase RLS + API 라우트 인증 (Phase 3) |
| Rate Limiting | API 라우트에 적용 (Phase 3) |
| 환경 변수 | Vercel Environment Variables (비밀 키 분리) |
| 의존성 | Dependabot 자동 업데이트 |

---

*다음 문서: [roadmap.md](./roadmap.md) — 개발 로드맵*
