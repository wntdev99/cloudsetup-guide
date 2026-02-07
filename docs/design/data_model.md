# 🗄️ Data Model — CloudSetup.guide

> 최종 수정: 2025.02.07
> 버전: v1.0

---

## 1. 데이터 아키텍처 개요

CloudSetup.guide는 **하이브리드 데이터 아키텍처**를 사용합니다.

```
┌─────────────────────────────────────────────────────┐
│                  데이터 계층                          │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Layer 1: 정적 파일 (Git 관리)     ← Phase 1 핵심    │
│  ├── MDX 콘텐츠 (가이드 본문)                        │
│  ├── JSON 데이터 (메타데이터, 무료한도)               │
│  └── 이미지 (스크린샷)                               │
│                                                     │
│  Layer 2: Supabase DB              ← Phase 3부터     │
│  ├── 사용자 프로필                                    │
│  ├── 가이드 진행률                                    │
│  ├── 댓글/질문                                       │
│  └── 피드백                                          │
│                                                     │
│  Layer 3: 외부 서비스                                 │
│  ├── Cloudinary (이미지 CDN)                         │
│  ├── Google Analytics (분석 데이터)                   │
│  └── Pagefind/Algolia (검색 인덱스)                   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 2. Layer 1: 정적 데이터 모델 (파일 기반)

### 2.1 가이드 메타데이터 (meta.json)

가이드의 모든 구조적 정보를 담습니다. MDX 본문과 분리하여 프로그래밍적 접근이 용이합니다.

```typescript
// types/guide.ts

type Platform = 'gcp' | 'aws' | 'azure' | 'supabase' | 'vercel' | 'cloudflare' | 'firebase';

type Category = 'ai-ml' | 'compute' | 'database' | 'storage' | 'auth' | 'maps' | 'cdn' | 'monitoring' | 'general';

type Difficulty = 'beginner' | 'intermediate' | 'advanced';

type FreeTierStatus = 'generous' | 'moderate' | 'limited';

type FreeTierPeriod = 'monthly' | 'daily' | 'yearly' | 'permanent' | 'trial';

interface FreeTierInfo {
  limit: string;                     // 사람이 읽을 수 있는 한도 "월 1,000 Units"
  period: FreeTierPeriod;
  amount: number;                    // 수치 1000
  unit: string;                      // 단위 "units"
  overagePrice?: string;             // 초과 시 가격 "$1.50/1000 units"
  conditions?: string[];             // 조건 ["US 리전만", "결제 계정 필수"]
  status: FreeTierStatus;            // 넉넉/보통/제한
  trialDuration?: string;            // 체험 기간 "12개월" (trial인 경우)
}

interface GuideSEO {
  title: string;                     // 메타 타이틀
  description: string;               // 메타 디스크립션
  keywords?: string[];               // 추가 키워드
}

interface GuideMeta {
  // 식별
  slug: string;                      // URL 슬러그 (유일키)
  
  // 분류
  platform: Platform;
  service: string;                   // "Cloud Vision API"
  category: Category;
  tags: string[];                    // ["ocr", "image", "ai", "vision"]
  
  // 난이도/시간
  difficulty: Difficulty;
  estimatedMinutes: number;
  totalSteps: number;
  
  // 무료 한도
  freeTier: FreeTierInfo;
  
  // 관계
  prerequisites: string[];           // 선행 가이드 slug[]
  nextGuides: string[];              // 후행 가이드 slug[]
  relatedGuides?: string[];          // 관련 가이드 slug[]
  
  // SEO
  seo: {
    ko: GuideSEO;
    en: GuideSEO;
  };
  
  // 상태
  lastVerified: string;              // ISO date "2025-01-15"
  status: 'published' | 'draft' | 'outdated';
  
  // 관리
  author: string;
  contributors?: string[];
  createdAt: string;
  updatedAt: string;
}
```

**예시: `content/guides/gcp-vision-api-setup/meta.json`**

```json
{
  "slug": "gcp-vision-api-setup",
  "platform": "gcp",
  "service": "Cloud Vision API",
  "category": "ai-ml",
  "tags": ["ocr", "image", "ai", "vision", "text-extraction", "label-detection"],
  "difficulty": "beginner",
  "estimatedMinutes": 15,
  "totalSteps": 7,
  "freeTier": {
    "limit": "월 1,000 Units",
    "period": "monthly",
    "amount": 1000,
    "unit": "units",
    "overagePrice": "$1.50 / 1,000 units",
    "conditions": ["결제 계정 필수"],
    "status": "moderate"
  },
  "prerequisites": [
    "gcp-account-setup",
    "gcp-billing-setup",
    "gcp-project-create"
  ],
  "nextGuides": [
    "gcp-vision-ocr-usage",
    "gcp-vision-label-usage"
  ],
  "relatedGuides": [
    "aws-rekognition-setup",
    "gcp-translation-api-setup"
  ],
  "seo": {
    "ko": {
      "title": "Google Cloud Vision API 설정 가이드 (무료, 스크린샷 포함)",
      "description": "비개발자도 15분만에 따라할 수 있는 GCP Vision API 세팅 가이드. 매 단계 스크린샷 포함. 월 1,000회 무료.",
      "keywords": ["구글 비전 API", "GCP Vision API 사용법", "이미지 분석 API 무료"]
    },
    "en": {
      "title": "Google Cloud Vision API Setup Guide (Free, Step-by-Step)",
      "description": "Set up GCP Vision API in 15 minutes. Screenshot-based guide. 1,000 free units/month.",
      "keywords": ["google vision api tutorial", "gcp vision api free", "image analysis api setup"]
    }
  },
  "lastVerified": "2025-01-15",
  "status": "published",
  "author": "cloudsetup-team",
  "contributors": [],
  "createdAt": "2025-01-10",
  "updatedAt": "2025-01-15"
}
```

---

### 2.2 플랫폼 데이터 (platforms.json)

```typescript
// types/platform.ts

interface PlatformFreeCredit {
  amount: string;                // "$300"
  duration: string;              // "90일"
  conditions?: string[];
}

interface PlatformData {
  id: Platform;
  name: string;
  shortName: string;             // 축약 "GCP"
  logo: string;                  // 로고 이미지 경로
  color: string;                 // 브랜드 컬러 "#4285F4"
  bgColor: string;               // 배경 컬러 (연한) "#EBF3FF"
  description: {
    ko: string;
    en: string;
  };
  freeCredit?: PlatformFreeCredit;
  officialUrl: string;
  pricingUrl: string;
  consoleUrl: string;            // 콘솔 URL
  docsUrl: string;               // 문서 URL
  categories: Category[];        // 이 플랫폼이 커버하는 카테고리
  guideCount: number;            // 자동 계산 또는 수동
  order: number;                 // 표시 순서
}
```

**예시: `data/platforms.json`**

```json
[
  {
    "id": "gcp",
    "name": "Google Cloud Platform",
    "shortName": "GCP",
    "logo": "/images/platforms/gcp.svg",
    "color": "#4285F4",
    "bgColor": "#EBF3FF",
    "description": {
      "ko": "구글의 클라우드 플랫폼. $300 무료 크레딧과 다양한 평생 무료(Always Free) API를 제공합니다.",
      "en": "Google's cloud platform. Offers $300 free credits and various Always Free tier APIs."
    },
    "freeCredit": {
      "amount": "$300",
      "duration": "90일",
      "conditions": ["신규 가입자만", "신용카드 등록 필수"]
    },
    "officialUrl": "https://cloud.google.com",
    "pricingUrl": "https://cloud.google.com/pricing",
    "consoleUrl": "https://console.cloud.google.com",
    "docsUrl": "https://cloud.google.com/docs",
    "categories": ["ai-ml", "compute", "database", "storage", "maps", "monitoring"],
    "guideCount": 10,
    "order": 1
  }
]
```

---

### 2.3 무료 한도 데이터 (free-tiers.json)

무료 한도 대시보드 및 계산기에서 사용하는 중앙 데이터입니다.

```typescript
// types/free-tier.ts

interface FreeTierEntry {
  id: string;                       // "gcp-vision-api"
  platform: Platform;
  service: string;                  // "Cloud Vision API"
  category: Category;
  
  // 무료 한도
  freeLimit: string;                // 사람이 읽을 수 있는 형태
  freeLimitValue: {
    amount: number;
    unit: string;                   // "requests", "gb", "minutes", "characters"
    period: FreeTierPeriod;
  };
  
  // 초과 시
  overagePrice?: string;
  
  // 조건
  conditions?: string[];
  regionRestriction?: string[];     // ["us-west1", "us-central1", "us-east1"]
  
  // 상태
  status: FreeTierStatus;
  
  // 연결
  guideSlug?: string;               // 세팅 가이드 링크
  officialUrl: string;              // 공식 가격 페이지
  
  // 관리
  lastVerified: string;
  notes?: string;                   // 특이사항
}
```

**예시: `data/free-tiers.json` (일부)**

```json
[
  {
    "id": "gcp-cloud-run",
    "platform": "gcp",
    "service": "Cloud Run",
    "category": "compute",
    "freeLimit": "월 200만 요청 + 360,000 GB-초 메모리",
    "freeLimitValue": { "amount": 2000000, "unit": "requests", "period": "monthly" },
    "overagePrice": "$0.40 / 100만 요청",
    "conditions": ["결제 계정 필수"],
    "status": "generous",
    "guideSlug": "gcp-cloud-run-deploy",
    "officialUrl": "https://cloud.google.com/run/pricing",
    "lastVerified": "2025-01-15"
  },
  {
    "id": "gcp-vision-api",
    "platform": "gcp",
    "service": "Cloud Vision API",
    "category": "ai-ml",
    "freeLimit": "월 1,000 Units",
    "freeLimitValue": { "amount": 1000, "unit": "units", "period": "monthly" },
    "overagePrice": "$1.50 / 1,000 units",
    "conditions": ["결제 계정 필수"],
    "status": "moderate",
    "guideSlug": "gcp-vision-api-setup",
    "officialUrl": "https://cloud.google.com/vision/pricing",
    "lastVerified": "2025-01-15"
  },
  {
    "id": "aws-lambda",
    "platform": "aws",
    "service": "Lambda",
    "category": "compute",
    "freeLimit": "월 100만 요청 + 400,000 GB-초",
    "freeLimitValue": { "amount": 1000000, "unit": "requests", "period": "monthly" },
    "status": "generous",
    "guideSlug": "aws-lambda-setup",
    "officialUrl": "https://aws.amazon.com/lambda/pricing/",
    "lastVerified": "2025-01-20"
  },
  {
    "id": "supabase-database",
    "platform": "supabase",
    "service": "Database (PostgreSQL)",
    "category": "database",
    "freeLimit": "500MB 저장, API 무제한",
    "freeLimitValue": { "amount": 500, "unit": "mb", "period": "permanent" },
    "conditions": ["프로젝트 2개까지"],
    "status": "generous",
    "guideSlug": "supabase-database-setup",
    "officialUrl": "https://supabase.com/pricing",
    "lastVerified": "2025-01-22"
  }
]
```

---

### 2.4 카테고리 데이터 (categories.json)

```json
[
  {
    "id": "ai-ml",
    "name": { "ko": "AI / 머신러닝", "en": "AI / Machine Learning" },
    "icon": "🖼️",
    "description": { "ko": "이미지 분석, 번역, 음성 인식 등", "en": "Image analysis, translation, speech recognition" },
    "order": 1
  },
  {
    "id": "compute",
    "name": { "ko": "컴퓨팅 / 서버리스", "en": "Compute / Serverless" },
    "icon": "⚡",
    "description": { "ko": "서버, 함수, 컨테이너 실행", "en": "Servers, functions, containers" },
    "order": 2
  },
  {
    "id": "database",
    "name": { "ko": "데이터베이스", "en": "Database" },
    "icon": "💾",
    "description": { "ko": "NoSQL, SQL, 실시간 DB", "en": "NoSQL, SQL, real-time DB" },
    "order": 3
  },
  {
    "id": "storage",
    "name": { "ko": "스토리지", "en": "Storage" },
    "icon": "📦",
    "description": { "ko": "파일, 이미지, 객체 저장", "en": "Files, images, object storage" },
    "order": 4
  },
  {
    "id": "auth",
    "name": { "ko": "인증", "en": "Authentication" },
    "icon": "🔐",
    "description": { "ko": "사용자 로그인, 소셜 인증", "en": "User login, social auth" },
    "order": 5
  },
  {
    "id": "maps",
    "name": { "ko": "지도 서비스", "en": "Maps" },
    "icon": "🗺️",
    "description": { "ko": "지도, 경로, 장소 검색", "en": "Maps, routing, places" },
    "order": 6
  },
  {
    "id": "cdn",
    "name": { "ko": "CDN / 배포", "en": "CDN / Deployment" },
    "icon": "🌐",
    "description": { "ko": "웹 배포, CDN, 도메인", "en": "Web deployment, CDN, domains" },
    "order": 7
  },
  {
    "id": "monitoring",
    "name": { "ko": "모니터링 / 로깅", "en": "Monitoring / Logging" },
    "icon": "📊",
    "description": { "ko": "로그 수집, 알림, 대시보드", "en": "Logs, alerts, dashboards" },
    "order": 8
  }
]
```

---

### 2.5 MDX 콘텐츠 구조

```
content/guides/gcp-vision-api-setup/
├── meta.json              ← 구조적 메타데이터 (위 2.1)
├── ko.mdx                 ← 한국어 본문
├── en.mdx                 ← 영어 본문
└── screenshots/
    ├── step1-console-ko.png
    ├── step1-console-en.png
    ├── step2-api-library-ko.png
    ├── step2-api-library-en.png
    ├── step3-enable-api-ko.png
    ├── step3-enable-api-en.png
    ├── step4-credentials-ko.png
    ├── step4-credentials-en.png
    └── ...
```

**MDX 본문 구조 (ko.mdx):**

```mdx
<Step number={1} title="GCP 콘솔에서 프로젝트 선택">

<Screenshot 
  src="step1-console-ko.png" 
  alt="GCP 콘솔 상단 프로젝트 선택 영역"
  highlight={{ x: 120, y: 30, width: 200, height: 35 }}
  caption="상단의 프로젝트 이름을 클릭하세요"
/>

1. [Google Cloud Console](https://console.cloud.google.com)에 접속하세요.
2. 상단의 **프로젝트 이름**을 클릭하세요 (빨간 박스 부분).
3. Vision API를 사용할 프로젝트를 선택하세요.

<Callout type="info">
프로젝트가 없다면 먼저 프로젝트를 만들어야 합니다.
[GCP 프로젝트 만들기 가이드](/ko/guides/gcp-project-create/)를 참고하세요.
</Callout>

<Checkpoint>프로젝트가 선택되었나요?</Checkpoint>

</Step>

<Step number={2} title="Vision API 활성화">

<Screenshot 
  src="step2-api-library-ko.png" 
  alt="API 라이브러리에서 Vision API 검색"
  highlight={{ x: 300, y: 180, width: 250, height: 40 }}
  caption="검색창에 Vision을 입력하고 결과를 클릭하세요"
/>

1. 좌측 메뉴에서 **API 및 서비스** → **라이브러리**를 클릭합니다.
2. 검색창에 `Vision`을 입력합니다.
3. **Cloud Vision API**를 클릭합니다.
4. **사용** 버튼을 클릭합니다.

<FreeTierInfo 
  service="Cloud Vision API"
  limit="월 1,000 Units"
  overage="1,001번째부터 $1.50/1,000 units"
/>

<Callout type="warning">
API를 활성화해도 사용하지 않으면 비용이 발생하지 않습니다.
무료 한도(월 1,000회) 안에서 사용하면 0원입니다.
</Callout>

<DevTip>
CLI로 활성화: `gcloud services enable vision.googleapis.com`
</DevTip>

<Checkpoint>사용 버튼이 "관리"로 바뀌었나요?</Checkpoint>

</Step>
```

---

## 3. Layer 2: Supabase 데이터베이스 (Phase 3+)

### 3.1 ERD (Entity Relationship Diagram)

```
┌──────────────┐       ┌──────────────────┐
│   profiles   │       │  guide_progress  │
├──────────────┤       ├──────────────────┤
│ id (PK, FK)  │──┐    │ id (PK)          │
│ display_name │  │    │ user_id (FK) ────│──┐
│ avatar_url   │  │    │ guide_slug       │  │
│ locale       │  │    │ current_step     │  │
│ created_at   │  │    │ completed        │  │
└──────────────┘  │    │ completed_at     │  │
                  │    │ created_at       │  │
                  │    │ updated_at       │  │
                  │    └──────────────────┘  │
                  │                          │
                  │    ┌──────────────────┐  │
                  │    │    comments      │  │
                  │    ├──────────────────┤  │
                  │    │ id (PK)          │  │
                  ├───→│ user_id (FK)     │←─┘
                  │    │ guide_slug       │
                  │    │ step_number      │
                  │    │ content          │
                  │    │ parent_id (FK) ──│──→ comments.id (자기참조)
                  │    │ created_at       │
                  │    │ updated_at       │
                  │    └──────────────────┘
                  │
                  │    ┌──────────────────┐
                  │    │    feedback      │
                  │    ├──────────────────┤
                  │    │ id (PK)          │
                  │    │ guide_slug       │
                  │    │ step_number      │   (선택적, 특정 단계 피드백)
                  │    │ helpful          │
                  │    │ issue_type       │
                  │    │ message          │
                  │    │ user_agent       │
                  │    │ locale           │
                  │    │ created_at       │
                  │    └──────────────────┘
                  │
                  │    ┌──────────────────┐
                  │    │  newsletter_subs │
                  │    ├──────────────────┤
                  │    │ id (PK)          │
                  │    │ email            │
                  │    │ locale           │
                  │    │ subscribed       │
                  │    │ created_at       │
                  │    │ unsubscribed_at  │
                  │    └──────────────────┘
```

### 3.2 테이블 DDL

```sql
-- ============================================
-- 1. Profiles (auth.users 확장)
-- ============================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  locale TEXT NOT NULL DEFAULT 'ko' CHECK (locale IN ('ko', 'en')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 신규 사용자 자동 프로필 생성
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 2. Guide Progress (가이드 진행률)
-- ============================================
CREATE TABLE public.guide_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  guide_slug TEXT NOT NULL,
  current_step INTEGER NOT NULL DEFAULT 0 CHECK (current_step >= 0),
  completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, guide_slug)
);

CREATE INDEX idx_guide_progress_user ON public.guide_progress(user_id);
CREATE INDEX idx_guide_progress_slug ON public.guide_progress(guide_slug);

-- ============================================
-- 3. Comments (댓글/질문)
-- ============================================
CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  guide_slug TEXT NOT NULL,
  step_number INTEGER,                          -- NULL = 가이드 전체에 대한 댓글
  content TEXT NOT NULL CHECK (char_length(content) <= 5000),
  parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,  -- 대댓글
  is_resolved BOOLEAN NOT NULL DEFAULT false,    -- 질문 해결 여부
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_comments_guide ON public.comments(guide_slug, step_number);
CREATE INDEX idx_comments_user ON public.comments(user_id);
CREATE INDEX idx_comments_parent ON public.comments(parent_id);

-- ============================================
-- 4. Feedback (가이드 피드백 — 비로그인 가능)
-- ============================================
CREATE TABLE public.feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guide_slug TEXT NOT NULL,
  step_number INTEGER,
  helpful BOOLEAN NOT NULL,
  issue_type TEXT CHECK (issue_type IN (
    'outdated_screenshot',
    'unclear_instruction',
    'error_occurred',
    'missing_info',
    'other'
  )),
  message TEXT CHECK (char_length(message) <= 2000),
  user_agent TEXT,
  locale TEXT DEFAULT 'ko',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_feedback_guide ON public.feedback(guide_slug);
CREATE INDEX idx_feedback_created ON public.feedback(created_at DESC);

-- ============================================
-- 5. Newsletter Subscriptions
-- ============================================
CREATE TABLE public.newsletter_subs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  locale TEXT NOT NULL DEFAULT 'ko',
  subscribed BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  unsubscribed_at TIMESTAMPTZ
);

-- ============================================
-- Row Level Security (RLS)
-- ============================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guide_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subs ENABLE ROW LEVEL SECURITY;

-- Profiles: 읽기 공개, 쓰기 본인만
CREATE POLICY "Profiles: public read"
  ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Profiles: self update"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Guide Progress: 본인만 CRUD
CREATE POLICY "Progress: self access"
  ON public.guide_progress FOR ALL USING (auth.uid() = user_id);

-- Comments: 읽기 공개, 쓰기 인증, 삭제 본인만
CREATE POLICY "Comments: public read"
  ON public.comments FOR SELECT USING (true);
CREATE POLICY "Comments: auth insert"
  ON public.comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Comments: self update"
  ON public.comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Comments: self delete"
  ON public.comments FOR DELETE USING (auth.uid() = user_id);

-- Feedback: 누구나 쓰기, 읽기는 관리자만 (서비스 키)
CREATE POLICY "Feedback: anyone insert"
  ON public.feedback FOR INSERT WITH CHECK (true);

-- Newsletter: 본인 이메일만
CREATE POLICY "Newsletter: self manage"
  ON public.newsletter_subs FOR ALL USING (true);  -- 서비스 키로만 접근
```

---

## 4. 데이터 흐름 (Data Flow)

### 4.1 빌드 시 데이터 흐름

```
빌드 시 (next build):

content/guides/*/meta.json ──→ getAllGuides() ──→ 가이드 목록 페이지 SSG
                                    │
                                    ├──→ 플랫폼별 그룹핑 ──→ 플랫폼 페이지 SSG
                                    │
                                    ├──→ sitemap.xml 생성
                                    │
                                    └──→ Pagefind 인덱스 생성

content/guides/*/ko.mdx ────→ MDX 컴파일 ──→ 가이드 상세 페이지 SSG
content/guides/*/en.mdx ────→ MDX 컴파일 ──→ 가이드 상세 페이지 SSG

data/free-tiers.json ───────→ 무료 한도 대시보드 SSG
data/platforms.json ────────→ 홈페이지, 플랫폼 페이지 SSG
data/categories.json ───────→ 필터, 목적별 탐색 SSG
```

### 4.2 런타임 데이터 흐름 (Phase 3)

```
클라이언트 브라우저
    │
    ├─ [읽기] 가이드 상세 ──→ SSG 정적 HTML (CDN)
    │
    ├─ [읽기] 진행률 ──→ Supabase REST API → guide_progress
    │   (로그인 시)
    │
    ├─ [쓰기] 진행률 업데이트 ──→ Supabase REST API → guide_progress
    │   (단계 완료 시)
    │
    ├─ [읽기] 댓글 목록 ──→ Supabase REST API → comments
    │
    ├─ [쓰기] 댓글 작성 ──→ Supabase REST API → comments
    │   (로그인 필수)
    │
    ├─ [쓰기] 피드백 ──→ Next.js API Route → feedback
    │   (비로그인 가능)
    │
    └─ [쓰기] 뉴스레터 구독 ──→ Next.js API Route → newsletter_subs
        (이메일만)
```

---

## 5. 검색 인덱스 모델

### 5.1 Pagefind 인덱스 구조 (Phase 1)

Pagefind는 빌드 시 자동으로 HTML을 인덱싱합니다. 추가 메타데이터를 `data-pagefind-meta` 속성으로 제공합니다.

```html
<!-- 가이드 상세 페이지 렌더링 시 -->
<article 
  data-pagefind-body
  data-pagefind-meta="platform:gcp, category:ai-ml, difficulty:beginner"
  data-pagefind-filter="platform:GCP, category:AI/ML, difficulty:초급"
>
  <h1 data-pagefind-meta="title">Google Cloud Vision API 설정 가이드</h1>
  ...
</article>
```

### 5.2 Algolia 인덱스 구조 (Phase 3+ 대안)

```typescript
interface AlgoliaGuideRecord {
  objectID: string;              // slug
  title: string;
  description: string;
  platform: string;
  category: string;
  difficulty: string;
  estimatedMinutes: number;
  freeTierLimit: string;
  freeTierStatus: string;
  tags: string[];
  locale: string;
  url: string;
  lastVerified: string;
}
```

---

## 6. 캐싱 전략

| 데이터 유형 | 캐시 레벨 | TTL | 무효화 |
|------------|----------|-----|--------|
| 가이드 HTML (SSG) | CDN (Vercel Edge) | 영구 (빌드 시 갱신) | 재빌드 시 자동 |
| 스크린샷 | CDN (Cloudinary) | 1년 | URL 변경 |
| 무료 한도 JSON | SSG 빌드 | 영구 (빌드 시 갱신) | 재빌드 시 |
| 사용자 진행률 | 없음 (실시간) | — | — |
| 댓글 | SWR (client) | 60초 stale | 새 댓글 작성 시 revalidate |
| 검색 인덱스 | CDN | 빌드 시 갱신 | 재빌드 시 |

---

*다음 문서: [task_flow.md](./task_flow.md) — 태스크 플로우*
