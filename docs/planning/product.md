# 🎨 Product Design — CloudSetup.guide

> 최종 수정: 2025.02.07
> 버전: v1.0

---

## 1. 제품 비전

**"클라우드 API 세팅에 대한 불안을 0으로 만드는 가이드 플랫폼"**

사용자가 "나도 할 수 있겠다"는 자신감을 느끼며, 15분 만에 원하는 API를 세팅하고, 무료 한도 안에서 안심하고 활용할 수 있게 하는 것이 핵심 가치입니다.

---

## 2. 제품 원칙 (Design Principles)

| 번호 | 원칙 | 의미 |
|------|------|------|
| 1 | Show Every Click | 모든 단계에 스크린샷 + 빨간 하이라이트 |
| 2 | Kill the Billing Fear | 무료 한도를 반복 명시, 예산 알림 필수 포함 |
| 3 | Show the Starting Point | 선행/후행 관계 시각화, 건너뛰기 가능 |
| 4 | Prove It's Fresh | 검증일 표시, 6개월 미검증 시 경고 |
| 5 | One-Stop | 외부 이동 최소화, 모든 정보를 한 곳에 |

---

## 3. 정보 아키텍처 (IA)

### 3.1 사이트맵

```
cloudsetup.guide/[ko|en]/
├── / ............................ 홈 (검색, 목적별 바로가기, 인기 가이드)
├── /platforms/ .................. 플랫폼 목록
│   └── /platforms/[platform]/ .. 개별 플랫폼 (GCP, AWS, Azure, Supabase...)
├── /guides/ ..................... 가이드 목록 + 필터
│   └── /guides/[slug]/ ......... 개별 세팅 가이드 ★핵심
├── /use-cases/ .................. 활용 시나리오 (목적별 가이드 조합)
├── /compare/ .................... 비교 페이지 (GCP vs AWS 등)
├── /tools/ ...................... 유틸리티 (무료 한도 계산기 등)
├── /blog/ ....................... 블로그 (업데이트, 뉴스)
└── /about/ ...................... 소개
```

### 3.2 URL 패턴

```
/guides/{platform}-{service}-{action}/
예시:
  gcp-vision-api-setup
  aws-lambda-deploy
  supabase-auth-setup
  vercel-nextjs-deploy
```

---

## 4. 핵심 페이지 설계

### 4.1 홈페이지

**구성 요소:**
1. 히어로 영역: 슬로건 + 검색바 + 인기 태그
2. 목적별 바로가기: 이미지 분석, 웹호스팅, DB, 지도, 인증, 저장소 등 아이콘 카드
3. 인기 가이드 Top 8: 카드형 리스트 (소요시간, 난이도, 무료한도 표시)
4. 플랫폼별 그리드: GCP (15 APIs), AWS (12 APIs), Azure (10 APIs), Supabase, Vercel...
5. 최근 업데이트: 새로 작성/검증된 가이드
6. CTA: "처음이세요? GCP 계정 만들기부터 시작하세요"

**SEO 메타:**
- Title: "CloudSetup.guide — 무료 클라우드 API 세팅 가이드"
- Description: "GCP, AWS, Azure의 무료 API를 비개발자도 따라할 수 있는 스크린샷 기반 가이드. 세팅부터 활용까지 한번에."

### 4.2 플랫폼 페이지 (/platforms/gcp/)

**구성 요소:**
1. 플랫폼 소개: 한 문단 요약 + 무료 크레딧 정보
2. 무료 API 목록: 카테고리별 그리드
3. 무료 한도 요약 테이블: 서비스명, 한도, 상태 (넉넉/보통/제한)
4. "처음 시작하기" 로드맵: 계정 → 결제 → 프로젝트 → API 선택
5. 주의사항: 리전 선택, 예산 알림 등

### 4.3 가이드 페이지 (/guides/[slug]/) — ★ 가장 중요

**가이드 페이지 구조:**

```
┌─ 헤더 ──────────────────────────────────────────┐
│  [플랫폼 뱃지] [카테고리 뱃지]                     │
│  제목: Google Cloud Vision API 설정 가이드         │
│  메타: ⏱ 15분 | ⭐ 초급 | 💰 월 1,000회 무료     │
│  검증일: ✅ 2025.01.15                            │
├─ 선행 체크 ─────────────────────────────────────┤
│  이 가이드를 시작하기 전에:                        │
│  ☑ GCP 계정 [있음/만들기]                         │
│  ☑ 결제 계정 [있음/만들기]                        │
│  ☑ 프로젝트 [있음/만들기]                         │
├─ 진행률 바 ─────────────────────────────────────┤
│  ████████░░░░░░░ 4/7 단계                       │
├─ 본문 (MDX) ────────────────────────────────────┤
│                                                  │
│  Step 1: [제목]                                  │
│  [스크린샷 + 하이라이트]                           │
│  [설명 텍스트]                                    │
│  [💡 개발자 팁 — 접힌 상태]                       │
│  [⚠️ 주의사항 콜아웃]                             │
│  [💰 무료 한도 정보]                              │
│  [✅ 확인 체크포인트]                             │
│                                                  │
│  ... (Step 2-N 반복)                             │
│                                                  │
├─ 완료 ──────────────────────────────────────────┤
│  🎉 완료! 요약 정보 + 다음 추천 가이드             │
├─ 피드백 ────────────────────────────────────────┤
│  이 가이드가 도움이 되었나요? [👍] [👎]            │
│  [화면이 달라요] [설명이 부족해요] [에러 발생]      │
├─ 📢 광고 ───────────────────────────────────────┤
├─ 관련 콘텐츠 ───────────────────────────────────┤
│  다음으로 추천: [활용 가이드] [관련 API] [비교]     │
├─ 📢 제휴 링크 ──────────────────────────────────┤
│  더 깊이 배우고 싶다면: [Udemy] [Coursera]        │
└─────────────────────────────────────────────────┘
│ 사이드바 (데스크톱):                              │
│  목차 (현재 단계 하이라이트)                       │
│  📢 사이드바 광고 (sticky)                        │
```

**MDX 컴포넌트 시스템:**

```jsx
// Step 컴포넌트
<Step number={1} title="프로젝트 만들기" estimatedMinutes={2}>
  <Screenshot src="step1.png" highlight={{x:120, y:340, w:200, h:40}} />
  <p>GCP 콘솔 상단의 "프로젝트 선택"을 클릭하세요.</p>
  <Callout type="warning">프로젝트 ID는 변경 불가!</Callout>
  <DevTip>CLI: gcloud projects create my-project</DevTip>
  <FreeTierInfo service="Vision API" limit="월 1,000 Units" />
  <Checkpoint>프로젝트가 생성되었나요?</Checkpoint>
</Step>

// 사용 가능한 컴포넌트:
- <Step>: 단계별 컨테이너
- <Screenshot>: 스크린샷 + 하이라이트
- <Callout type="warning|info|danger|tip">: 알림 박스
- <DevTip>: 개발자용 추가 정보 (접힌 상태)
- <FreeTierInfo>: 무료 한도 배지
- <Checkpoint>: 진행 확인 ("다르게 보이나요?" 링크 포함)
- <CopyBlock>: 코드/명령어 복사 블록
- <ApiResponse>: API 응답 예시
```

### 4.4 비교 페이지 (/compare/gcp-vs-aws-free-tier/)

**구성 요소:**
1. 요약 비교표: 핵심 차이점 3-5개
2. 상세 비교: 카테고리별 (컴퓨팅, DB, AI, 스토리지 등)
3. "이런 경우에는 이걸 선택하세요" 추천
4. 각 서비스의 세팅 가이드 링크

### 4.5 유틸리티 — 무료 한도 대시보드 (/tools/free-tier-dashboard/)

```
┌─────────────────────────────────────────────────┐
│  ☁️ 클라우드 무료 티어 한눈에 보기                  │
│                                                  │
│  [전체] [GCP] [AWS] [Azure] [Supabase] [기타]     │
│                                                  │
│  카테고리: [전체] [AI/ML] [컴퓨팅] [DB] [스토리지]  │
│                                                  │
│  ┌──────────────────────────────────────────────┐│
│  │ 서비스          │ 무료 한도     │ 상태  │ 가이드 ││
│  ├──────────────────────────────────────────────┤│
│  │ GCP Vision API  │ 월 1,000회   │ 🟡 보통│ [→]  ││
│  │ GCP Translation │ 월 50만자    │ 🟢 넉넉│ [→]  ││
│  │ GCP Cloud Run   │ 월 200만 요청│ 🟢 넉넉│ [→]  ││
│  │ AWS Lambda      │ 월 100만 요청│ 🟢 넉넉│ [→]  ││
│  │ AWS S3          │ 5GB          │ 🟡 보통│ [→]  ││
│  │ Supabase DB     │ 500MB        │ 🟢 넉넉│ [→]  ││
│  └──────────────────────────────────────────────┘│
│                                                  │
│  마지막 업데이트: 2025.02.01                       │
│  출처: 각 플랫폼 공식 문서 [링크]                   │
└─────────────────────────────────────────────────┘
```

### 4.6 유틸리티 — 무료 한도 계산기 (/tools/free-tier-calculator/)

```
┌─────────────────────────────────────────────────┐
│  🧮 내 프로젝트에 무료로 충분할까?                   │
│                                                  │
│  예상 사용량을 입력하세요:                          │
│                                                  │
│  API 호출:    [___1,000___] 회/월                 │
│  파일 저장:   [_____2_____] GB                    │
│  DB 읽기:    [____10,000__] 회/일                 │
│  웹 트래픽:  [_____5,000__] 방문자/월              │
│                                                  │
│  [계산하기]                                       │
│                                                  │
│  📊 결과:                                        │
│  ┌──────────────────────────────────────────┐   │
│  │ GCP: ✅ 무료로 충분 (한도의 23% 사용)       │   │
│  │ AWS: ✅ 무료로 충분 (한도의 18% 사용)       │   │
│  │ Supabase: ⚠️ DB 용량 주의 (한도의 80%)    │   │
│  └──────────────────────────────────────────┘   │
│                                                  │
│  추천 조합: GCP (API) + Supabase (DB) + Vercel   │
│  예상 월 비용: $0                                 │
│  [이 조합으로 시작하기 →]                          │
└─────────────────────────────────────────────────┘
```

---

## 5. 디자인 시스템

### 5.1 컬러 팔레트

```
Primary:     #1A4B8C (Deep Blue) — 신뢰, 전문성
Secondary:   #10B981 (Emerald) — 성공, 무료, 안전
Warning:     #F59E0B (Amber) — 주의
Danger:      #EF4444 (Red) — 과금 경고, 스크린샷 하이라이트
Background:  #FAFAF8 (Warm White)
Surface:     #FFFFFF
Text:        #1C1917 (Almost Black)
Muted:       #78716C (Warm Gray)
Border:      #E8E5E0 (Light Warm Gray)
```

### 5.2 타이포그래피

```
한국어:  Pretendard (본문), Pretendard Bold (제목)
영어:    DM Sans (본문), DM Sans Bold (제목)
코드:    JetBrains Mono
숫자:    Tabular Lining (고정폭 숫자)

크기 체계:
  H1: 32px / 2rem (가이드 제목)
  H2: 24px / 1.5rem (섹션 제목)
  H3: 18px / 1.125rem (단계 제목)
  Body: 16px / 1rem (본문)
  Small: 14px / 0.875rem (메타 정보)
  Caption: 12px / 0.75rem (배지, 날짜)
```

### 5.3 컴포넌트 라이브러리

| 컴포넌트 | 용도 | 기반 |
|---------|------|------|
| GuideCard | 가이드 목록에서 카드 표시 | shadcn Card |
| PlatformBadge | GCP, AWS 등 플랫폼 배지 | 커스텀 |
| DifficultyBadge | 초급/중급/고급 표시 | 커스텀 |
| FreeTierBadge | 무료 한도 표시 | 커스텀 |
| Screenshot | 스크린샷 + 하이라이트 | 커스텀 |
| StepContainer | 단계별 컨테이너 | 커스텀 |
| ProgressBar | 가이드 진행률 | shadcn Progress |
| Callout | 경고/정보 박스 | 커스텀 |
| CopyBlock | 코드 복사 블록 | 커스텀 |
| SearchBar | 전역 검색 | 커스텀 |
| FilterBar | 가이드 필터 | shadcn Select 조합 |
| LanguageSwitcher | 한/영 전환 | 커스텀 |
| AdBanner | 광고 영역 | 커스텀 wrapper |
| FeedbackWidget | 가이드 피드백 | 커스텀 |

### 5.4 반응형 전략

```
Mobile First:
  - 320px-767px: 1컬럼, 사이드바 숨김, 햄버거 메뉴
  - 768px-1023px: 2컬럼 그리드, 사이드바 선택적
  - 1024px+: 3컬럼 그리드, 사이드바 표시 (목차 + 광고)

가이드 페이지 특수 처리:
  - 모바일: 본문만 풀폭, 목차는 상단 접힌 상태
  - 태블릿: 본문 + 좌측 목차
  - 데스크톱: 본문 + 좌측 목차 + 우측 사이드바(광고)
```

---

## 6. 콘텐츠 관리 시스템

### 6.1 콘텐츠 스키마 (meta.json)

```json
{
  "slug": "gcp-vision-api-setup",
  "platform": "gcp",
  "service": "Cloud Vision API",
  "category": "ai-ml",
  "difficulty": "beginner",
  "estimatedMinutes": 15,
  "totalSteps": 7,
  "freeTier": {
    "limit": "월 1,000 Units",
    "period": "monthly",
    "amount": 1000,
    "unit": "units",
    "overagePrice": "$1.50/1000 units",
    "conditions": ["결제 계정 필수"],
    "status": "moderate"
  },
  "prerequisites": [
    "gcp-account-setup",
    "gcp-billing-setup",
    "gcp-project-create"
  ],
  "nextGuides": [
    "gcp-vision-api-ocr-usage",
    "gcp-vision-api-label-usage",
    "gcp-translation-api-setup"
  ],
  "tags": ["ocr", "image", "ai", "vision", "text-extraction"],
  "seo": {
    "ko": {
      "title": "Google Cloud Vision API 설정 가이드 (무료, 스크린샷 포함)",
      "description": "비개발자도 15분만에 따라할 수 있는 GCP Vision API 세팅 가이드. 매 단계 스크린샷 포함. 월 1,000회 무료."
    },
    "en": {
      "title": "Google Cloud Vision API Setup Guide (Free, Step-by-Step)",
      "description": "Set up GCP Vision API in 15 minutes with screenshot-based guide. 1,000 free units/month. No coding required."
    }
  },
  "lastVerified": "2025-01-15",
  "author": "cloudsetup-team",
  "createdAt": "2025-01-10",
  "updatedAt": "2025-01-15"
}
```

### 6.2 콘텐츠 작성 워크플로우

```
1. 신규 가이드 작성:
   ├── meta.json 작성 (메타데이터)
   ├── ko.mdx 작성 (한국어 본문)
   ├── en.mdx 작성 (영어 본문)
   ├── 스크린샷 촬영 + 하이라이트 추가
   ├── 로컬 프리뷰 확인
   ├── PR 생성 → 리뷰 → 머지
   └── 자동 배포 (Vercel)

2. 스크린샷 업데이트:
   ├── 분기별 검증 체크
   ├── UI 변경 감지 시 스크린샷 재촬영
   ├── lastVerified 날짜 업데이트
   └── PR → 머지 → 배포

3. 커뮤니티 제보 대응:
   ├── "화면이 달라요" 피드백 수신
   ├── GitHub Issue 자동 생성
   ├── 확인 후 스크린샷 업데이트
   └── 제보자에게 감사 표시
```

### 6.3 스크린샷 관리 규칙

```
파일명 규칙: step{N}-{description}-{locale}.png
예: step3-enable-api-ko.png, step3-enable-api-en.png

하이라이트 규칙:
- 빨간 테두리 (2px, #EF4444): 클릭해야 할 위치
- 빨간 화살표: 시선 유도
- 번호 원형 배지: 순서가 있는 경우
- 흐림 처리: 민감 정보 (이메일, 프로젝트 ID 등)

크기 규칙:
- 최대 너비: 800px
- 형식: PNG (UI), WebP (변환 후 제공)
- 용량: 100KB 이하 (Cloudinary 자동 최적화)
```

---

## 7. 접근성 (Accessibility)

### 7.1 기본 요구사항

- WCAG 2.1 Level AA 준수
- 모든 스크린샷에 대체 텍스트(alt) 제공
- 키보드 네비게이션 지원
- 색상 대비 4.5:1 이상
- 폰트 크기 최소 14px
- 다크 모드 지원

### 7.2 가이드 특수 접근성

- 스크린샷 하이라이트 영역을 텍스트로도 설명
- 코드 블록에 aria-label 추가
- 진행률 바에 aria-valuenow 추가
- 단계 이동 시 포커스 자동 이동

---

## 8. 성능 요구사항

| 지표 | 목표 | 방법 |
|------|------|------|
| LCP (Largest Contentful Paint) | < 2.5s | SSG + 이미지 최적화 |
| FID (First Input Delay) | < 100ms | 최소 JS, 코드 스플리팅 |
| CLS (Cumulative Layout Shift) | < 0.1 | 이미지 크기 예약, 광고 영역 예약 |
| TTI (Time to Interactive) | < 3s | SSG + 지연 로딩 |
| 페이지 크기 | < 500KB (초기 로드) | 이미지 lazy loading, 코드 스플리팅 |

---

*다음 문서: [features.md](./features.md) — 기능 상세 명세*
