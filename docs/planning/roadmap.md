# 🗓️ Development Roadmap — CloudSetup.guide

> 최종 수정: 2025.02.07
> 버전: v1.0

---

## 1. 로드맵 개요

```
2025.02 ─── 2025.04 ─── 2025.06 ─── 2025.08 ─── 2025.10 ─── 2026.01
  │            │            │            │            │            │
  ▼            ▼            ▼            ▼            ▼            ▼
┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
│Phase 1 │ │Phase 1 │ │Phase 2 │ │Phase 2 │ │Phase 3 │ │Phase 4 │
│Setup   │ │Content │ │Expand  │ │Tools   │ │Community│ │Premium │
│+ MVP   │ │Launch  │ │Platform│ │+ SEO   │ │Features│ │(선택적) │
└────────┘ └────────┘ └────────┘ └────────┘ └────────┘ └────────┘
```

---

## 2. Phase 1: MVP (Month 1-2) — 2025.02 ~ 2025.03

### 2.1 목표
- Next.js 프로젝트 초기 세팅 완료
- GCP 핵심 가이드 10개 작성 (한/영)
- 사이트 공개 + AdSense 신청
- Search Console 등록 + 색인 시작

### 2.2 Sprint 1: 프로젝트 초기 세팅 (Week 1-2)

| 태스크 | 예상 시간 | 완료 기준 |
|--------|----------|----------|
| Next.js 14 프로젝트 생성 (App Router) | 2h | 로컬 dev 서버 실행 |
| Tailwind CSS + shadcn/ui 세팅 | 2h | 컴포넌트 렌더링 확인 |
| next-intl 다국어 설정 (/ko, /en) | 4h | 두 언어 라우팅 동작 |
| MDX 렌더링 파이프라인 구축 | 6h | 샘플 MDX → 페이지 렌더링 |
| 콘텐츠 디렉토리 구조 생성 | 2h | content/guides/ 구조 확립 |
| 기본 레이아웃 (헤더, 푸터, 네비게이션) | 6h | 반응형 레이아웃 완성 |
| Git 저장소 + Vercel 연동 | 1h | push → 자동 배포 |
| 도메인 구매 + DNS 설정 | 1h | cloudsetup.guide 접속 가능 |
| **소계** | **24h** | |

### 2.3 Sprint 2: 가이드 컴포넌트 개발 (Week 3-4)

| 태스크 | 예상 시간 | 완료 기준 |
|--------|----------|----------|
| Step 컴포넌트 | 3h | 번호, 제목, 시간 표시 |
| Screenshot 컴포넌트 (하이라이트 오버레이) | 5h | 빨간 박스 오버레이 동작 |
| Callout 컴포넌트 (4가지 타입) | 2h | warning, info, danger, tip |
| CopyBlock 컴포넌트 | 2h | 원클릭 복사 + 피드백 |
| FreeTierInfo 컴포넌트 | 1h | 무료 한도 배지 |
| DevTip 컴포넌트 (접힘/펼침) | 2h | 클릭으로 토글 |
| Checkpoint 컴포넌트 | 2h | 확인/문제 버튼 |
| ProgressBar 컴포넌트 | 2h | sticky 진행률 바 |
| PrerequisiteCheck 컴포넌트 | 3h | 선행 가이드 체크리스트 |
| GuideHeader 컴포넌트 | 2h | 메타 정보 표시 |
| GuideFooter 컴포넌트 | 2h | 완료 + 다음 추천 |
| GuideNavigation (이전/다음) | 1h | 버튼 네비게이션 |
| **소계** | **27h** | |

### 2.4 Sprint 3: 콘텐츠 작성 — GCP 기초 (Week 5-6)

| 가이드 | 난이도 | 예상 시간 | 스크린샷 수 |
|--------|--------|----------|-----------|
| GCP 계정 만들기 ($300 크레딧) | 초급 | 4h | 8-10 |
| GCP 결제 계정 설정 (+ 예산 알림) | 초급 | 3h | 6-8 |
| GCP 프로젝트 만들기 | 초급 | 2h | 4-5 |
| Vision API 세팅 + 테스트 | 초급 | 5h | 10-12 |
| Translation API 세팅 + 테스트 | 초급 | 4h | 8-10 |
| Speech-to-Text API 세팅 | 초급 | 4h | 8-10 |
| Text-to-Speech API 세팅 | 초급 | 4h | 8-10 |
| Cloud Run 첫 배포 | 중급 | 6h | 12-15 |
| Cloud Storage 버킷 세팅 | 초급 | 3h | 6-8 |
| Firestore DB 세팅 | 초급 | 4h | 8-10 |
| **소계 (한국어)** | | **39h** | **~100** |
| **영어 번역 (10개)** | | **20h** | 동일 (번역 + 영어 스크린샷) |

### 2.5 Sprint 4: 탐색 + SEO + 출시 (Week 7-8)

| 태스크 | 예상 시간 | 완료 기준 |
|--------|----------|----------|
| 홈페이지 디자인 + 구현 | 8h | 히어로, 인기 가이드, 플랫폼 카드 |
| 플랫폼 페이지 (GCP) | 4h | API 목록 + 카테고리별 정렬 |
| 가이드 목록 페이지 | 4h | 카드 그리드 + 기본 정렬 |
| SearchBar 컴포넌트 + Pagefind 연동 | 4h | 검색 동작 확인 |
| SEO: 메타 태그, JSON-LD, sitemap | 4h | Lighthouse SEO 90+ |
| AdSense 코드 삽입 + AdBanner 컴포넌트 | 3h | 광고 슬롯 렌더링 |
| GA4 연동 + 이벤트 트래킹 | 3h | 기본 이벤트 수집 |
| Search Console 등록 + 사이트맵 제출 | 1h | 색인 요청 완료 |
| 최종 QA + 버그 수정 | 4h | 크로스 브라우저 테스트 |
| **소계** | **35h** | |

### 2.6 Phase 1 총 정리

| 항목 | 수치 |
|------|------|
| 총 예상 시간 | ~145 시간 (주 18시간 × 8주) |
| 완성 가이드 | 10개 (한/영 각각) |
| 스크린샷 | ~200개 |
| 배포 상태 | Production (cloudsetup.guide) |
| AdSense 상태 | 신청 완료 (승인 대기 2-4주) |
| SEO 상태 | 색인 시작 (결과까지 1-3개월) |

### 2.7 Phase 1 완료 마일스톤 ✅

- [ ] cloudsetup.guide 접속 가능
- [ ] GCP 가이드 10개 한/영 완성
- [ ] 검색 기능 동작
- [ ] AdSense 신청 완료
- [ ] GA4 이벤트 수집 시작
- [ ] Search Console 색인 시작

---

## 3. Phase 2: 콘텐츠 확장 + 도구 (Month 3-4) — 2025.04 ~ 2025.05

### 3.1 목표
- 플랫폼 확장: AWS, Supabase, Vercel 가이드 추가
- 차별화 도구: 무료 한도 대시보드, 비교 페이지
- SEO 본격화: 롱테일 키워드 확보, 백링크 구축 시작

### 3.2 콘텐츠 확장

| 플랫폼 | 가이드 수 | 우선순위 가이드 |
|--------|----------|-------------|
| AWS | 8개 | 계정 만들기, Lambda, S3, DynamoDB, Rekognition, Translate, EC2, CloudFront |
| Supabase | 5개 | 프로젝트 생성, DB 세팅, Auth 세팅, Storage, Edge Functions |
| Vercel | 3개 | 계정+배포, 환경변수, 도메인 연결 |
| Firebase | 4개 | 프로젝트 생성, Auth, Firestore, Hosting |
| **합계** | **20개** | |

### 3.3 도구 개발

| 도구 | 예상 시간 | 설명 |
|------|----------|------|
| 무료 한도 대시보드 | 12h | 전체 플랫폼 무료 한도 비교표 |
| 무료 한도 계산기 | 8h | 사용량 입력 → 플랫폼 추천 |
| 비교 페이지 템플릿 | 6h | A vs B 비교 레이아웃 |
| GCP vs AWS 비교 | 4h | 첫 번째 비교 콘텐츠 |
| Supabase vs Firebase 비교 | 4h | |
| 필터 시스템 | 6h | 플랫폼/카테고리/난이도 필터 |
| 피드백 시스템 | 4h | 👍/👎 + Google Forms 연동 |

### 3.4 SEO 활동

| 활동 | 목표 |
|------|------|
| 주 1-2개 새 가이드 발행 | 인덱스 페이지 수 증가 |
| 개발 커뮤니티 공유 (Reddit, HackerNews, 디스코드) | 초기 트래픽 + 백링크 |
| 한국 커뮤니티 공유 (velog, 개발자 카페) | 한국어 트래픽 |
| 비교 페이지로 높은 검색량 키워드 공략 | 주요 키워드 진입 |

### 3.5 Phase 2 완료 마일스톤 ✅

- [ ] 가이드 총 30개 (4개 플랫폼)
- [ ] 무료 한도 대시보드 라이브
- [ ] 비교 페이지 2개 이상
- [ ] 무료 한도 계산기 라이브
- [ ] 월 5-10만 PV (목표)
- [ ] AdSense 월 10만원+ 수익

---

## 4. Phase 3: 커뮤니티 (Month 5-6) — 2025.06 ~ 2025.07

### 4.1 목표
- 사용자 참여 기능 추가 (로그인, 진행률, 댓글)
- 제휴 마케팅 시작
- 콘텐츠 50개 달성

### 4.2 기능 개발

| 기능 | 예상 시간 | 설명 |
|------|----------|------|
| Supabase Auth 연동 | 8h | Google, GitHub 소셜 로그인 |
| 사용자 프로필 | 4h | 이름, 완료한 가이드 목록 |
| 가이드 진행률 저장 | 6h | 서버 저장 (로그인) + 로컬 저장 (비로그인) |
| 댓글 시스템 | 12h | 단계별 댓글, 대댓글 |
| 뉴스레터 구독 | 4h | 이메일 수집 (Buttondown 무료) |
| 오픈소스 기여 가이드 | 4h | CONTRIBUTING.md + "GitHub에서 수정" 링크 |
| 가이드 로드맵 시각화 | 8h | 선행/후행 의존성 트리 |

### 4.3 콘텐츠 확장

| 플랫폼 | 추가 가이드 수 |
|--------|-------------|
| Azure | 5개 (계정, Functions, Blob Storage, Cosmos DB, Cognitive Services) |
| Cloudflare | 3개 (계정, Workers, R2, Pages) |
| GCP 활용 가이드 | 5개 (Vision OCR 활용, Translation 활용, 등) |
| AWS 활용 가이드 | 2개 |
| **합계** | **15개** (누적 45개) |

### 4.4 수익 확장

| 활동 | 목표 |
|------|------|
| 제휴 마케팅 시작 (Udemy, Coursera) | 월 10-30만원 추가 |
| 고CPC 키워드 페이지 최적화 | RPM 향상 |
| 영어 콘텐츠 비중 확대 (50%) | 영어 RPM 활용 |

### 4.5 Phase 3 완료 마일스톤 ✅

- [ ] 가이드 총 45-50개
- [ ] 소셜 로그인 + 진행률 추적 라이브
- [ ] 댓글 시스템 라이브
- [ ] 뉴스레터 구독자 500+ 명
- [ ] 월 15-30만 PV
- [ ] 월 총 수익 100만원+

---

## 5. Phase 4: 성숙 + 프리미엄 (Month 7+) — 2025.08+

### 5.1 목표
- 수익 안정화 및 극대화
- 선택적 프리미엄 기능 검토
- 커뮤니티 자체 성장 궤도

### 5.2 콘텐츠 목표

| 시점 | 누적 가이드 | 커버 플랫폼 |
|------|-----------|-----------|
| 8개월 | 60개 | 7개 |
| 10개월 | 75개 | 8개 |
| 12개월 | 90-100개 | 8+ |

### 5.3 프리미엄 검토 기준

프리미엄 기능은 다음 조건을 모두 만족할 때만 개발합니다:

```
조건 1: 월 PV 20만+ 달성
조건 2: 커뮤니티 댓글/질문이 활성화됨
조건 3: "자동 세팅"이나 "템플릿"에 대한 사용자 요청이 반복됨
조건 4: 무료 모델만으로 월 200만원+ 수익 안정화
```

### 5.4 프리미엄 후보 (우선순위순)

| 순위 | 기능 | 가격안 | 개발 난이도 |
|------|------|--------|----------|
| 1 | 광고 제거 | 월 $2.99 | 낮음 |
| 2 | 프로젝트 템플릿 ("AI 챗봇 만들기") | 개당 $4.99 | 중간 |
| 3 | 자동 세팅 도구 (Terraform 래핑) | 월 $9.99 | 높음 |
| 4 | 1:1 세팅 도움 (채팅) | 건당 $19.99 | 높음 (인력) |

---

## 6. 콘텐츠 로드맵 상세

### 6.1 가이드 발행 순서 (처음 50개)

**Batch 1: GCP 기초 (Phase 1, 10개)**
```
01. gcp-account-setup          — GCP 계정 만들기
02. gcp-billing-setup          — 결제 계정 + 예산 알림
03. gcp-project-create         — 프로젝트 만들기
04. gcp-vision-api-setup       — Vision API 세팅
05. gcp-translation-api-setup  — Translation API 세팅
06. gcp-speech-to-text-setup   — Speech-to-Text 세팅
07. gcp-text-to-speech-setup   — Text-to-Speech 세팅
08. gcp-cloud-run-deploy       — Cloud Run 배포
09. gcp-cloud-storage-setup    — Cloud Storage 세팅
10. gcp-firestore-setup        — Firestore 세팅
```

**Batch 2: AWS 기초 (Phase 2, 8개)**
```
11. aws-account-setup          — AWS 계정 만들기
12. aws-billing-alarm          — 결제 알림 설정
13. aws-lambda-setup           — Lambda 세팅
14. aws-s3-setup               — S3 버킷 세팅
15. aws-dynamodb-setup         — DynamoDB 세팅
16. aws-rekognition-setup      — Rekognition 세팅
17. aws-translate-setup        — Translate 세팅
18. aws-ec2-free-tier          — EC2 프리티어 세팅
```

**Batch 3: 모던 플랫폼 (Phase 2, 12개)**
```
19. supabase-project-setup     — Supabase 시작하기
20. supabase-database-setup    — Supabase DB 세팅
21. supabase-auth-setup        — Supabase Auth 세팅
22. supabase-storage-setup     — Supabase Storage
23. supabase-edge-functions    — Edge Functions
24. vercel-account-deploy      — Vercel 배포
25. vercel-env-variables       — 환경변수 설정
26. vercel-custom-domain       — 커스텀 도메인
27. firebase-project-setup     — Firebase 시작하기
28. firebase-auth-setup        — Firebase Auth
29. firebase-firestore-setup   — Firestore (Firebase 버전)
30. firebase-hosting-deploy    — Firebase Hosting
```

**Batch 4: 활용 가이드 (Phase 2-3, 10개)**
```
31. gcp-vision-ocr-usage       — Vision API로 이미지 텍스트 추출
32. gcp-translation-usage      — Translation API 실전 활용
33. gcp-cloud-run-nextjs       — Cloud Run에 Next.js 배포
34. aws-lambda-api-gateway     — Lambda + API Gateway 조합
35. supabase-react-crud        — Supabase + React CRUD 앱
36. vercel-nextjs-supabase     — Vercel + Next.js + Supabase 스택
37. free-website-hosting       — 무료 웹사이트 만들기 종합 가이드
38. free-ai-api-comparison     — 무료 AI API 비교 가이드
39. free-database-comparison   — 무료 DB 비교 가이드
40. gcp-maps-api-setup         — Google Maps API 세팅
```

**Batch 5: 확장 (Phase 3, 10개)**
```
41. azure-account-setup        — Azure 계정 만들기
42. azure-functions-setup      — Azure Functions
43. azure-blob-storage-setup   — Blob Storage
44. azure-cognitive-setup      — Cognitive Services
45. azure-cosmos-db-setup      — Cosmos DB
46. cloudflare-account-setup   — Cloudflare 시작하기
47. cloudflare-workers-setup   — Workers
48. cloudflare-r2-setup        — R2 Storage
49. cloudflare-pages-deploy    — Pages 배포
50. gcp-gemini-api-setup       — Gemini API 세팅
```

---

## 7. 주요 의존성 & 리스크

### 7.1 크리티컬 패스

```
도메인 구매 → Vercel 배포 → AdSense 신청 → AdSense 승인 (2-4주 대기)
                                                        ↑
                          콘텐츠 10개 완성 필수 ──────────┘
```

**AdSense 승인이 가장 큰 의존성입니다.** 최소 10개 이상의 고품질 콘텐츠가 있어야 승인됩니다.

### 7.2 리스크 & 완화

| 리스크 | 확률 | 완화 |
|--------|------|------|
| AdSense 승인 지연/거부 | 중간 | 콘텐츠 20개까지 늘린 후 재신청. About, Privacy Policy 필수 |
| 스크린샷 촬영 시간 과다 | 높음 | 브라우저 자동화(Playwright) 도입 검토 |
| SEO 색인 지연 | 중간 | Search Console에서 수동 색인 요청. 사이트맵 제출. |
| 1인 개발 번아웃 | 높음 | 주 15시간 상한, 2주 단위 스프린트, 휴식 주기 설정 |
| 영어 콘텐츠 품질 | 중간 | AI 보조 번역 + 네이티브 검수 (Phase 3에서 커뮤니티 기여) |

---

## 8. 성공 기준 체크리스트

### Month 2 (Phase 1 완료)
- [ ] 사이트 라이브 + 10개 가이드
- [ ] AdSense 승인
- [ ] GA4 이벤트 수집 정상 동작
- [ ] 첫 유기 검색 유입 확인

### Month 4 (Phase 2 완료)
- [ ] 30개 가이드 (4개 플랫폼)
- [ ] 무료 한도 대시보드 라이브
- [ ] 월 5만+ PV
- [ ] 월 수익 10만원+

### Month 6 (Phase 3 완료)
- [ ] 50개 가이드
- [ ] 커뮤니티 기능 라이브
- [ ] 월 20만+ PV
- [ ] 월 수익 100만원+
- [ ] 뉴스레터 구독자 500+

### Month 12
- [ ] 100개 가이드
- [ ] 월 30-50만 PV
- [ ] 월 수익 200-300만원
- [ ] 오픈소스 기여자 5명+
- [ ] "클라우드 API 세팅" 검색 시 1페이지

---

*이것으로 전체 설계 문서가 완료되었습니다.*

**문서 목록:**
1. [idea.md](./idea.md) — 아이디어
2. [market.md](./market.md) — 시장 분석
3. [persona.md](./persona.md) — 사용자 페르소나
4. [user_journey.md](./user_journey.md) — 사용자 여정
5. [business_model.md](./business_model.md) — 비즈니스 모델
6. [product.md](./product.md) — 제품 설계
7. [features.md](./features.md) — 기능 명세
8. [tech.md](./tech.md) — 기술 설계
9. [roadmap.md](./roadmap.md) — 개발 로드맵
