# 🚀 Project Setup Guide — CloudSetup.guide

> 최종 수정: 2025.02.07
> 버전: v1.0

---

## 1. 프로젝트 초기화

### 1.1 Next.js 프로젝트 생성

```bash
npx create-next-app@latest cloudsetup-guide \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"

cd cloudsetup-guide
```

### 1.2 핵심 의존성 설치

```bash
# UI
npm install @radix-ui/react-slot class-variance-authority clsx tailwind-merge
npm install lucide-react

# MDX
npm install next-mdx-remote gray-matter reading-time
npm install rehype-slug rehype-autolink-headings
npm install remark-gfm

# 다국어
npm install next-intl

# 검색
npm install pagefind

# 분석
npm install @next/third-parties

# Supabase (Phase 3, 미리 설치해도 무방)
npm install @supabase/supabase-js @supabase/ssr

# 개발 도구
npm install -D @types/node prettier eslint-config-prettier
npm install -D cross-env
```

### 1.3 shadcn/ui 초기화

```bash
npx shadcn-ui@latest init

# 필요 컴포넌트 설치
npx shadcn-ui@latest add button card badge dialog progress select
npx shadcn-ui@latest add dropdown-menu sheet tabs tooltip separator
```

---

## 2. 디렉토리 구조 생성

```bash
mkdir -p src/app/\[locale\]
mkdir -p src/app/\[locale\]/platforms/\[platform\]
mkdir -p src/app/\[locale\]/guides/\[slug\]
mkdir -p src/app/\[locale\]/compare/\[slug\]
mkdir -p src/app/\[locale\]/tools/free-tier-dashboard
mkdir -p src/app/\[locale\]/tools/free-tier-calculator
mkdir -p src/app/\[locale\]/use-cases/\[slug\]
mkdir -p src/app/\[locale\]/blog/\[slug\]
mkdir -p src/app/api/feedback
mkdir -p src/app/api/newsletter

mkdir -p src/components/guide
mkdir -p src/components/platform
mkdir -p src/components/explore
mkdir -p src/components/tools
mkdir -p src/components/common
mkdir -p src/components/ui

mkdir -p src/lib
mkdir -p src/types
mkdir -p src/hooks
mkdir -p src/styles

mkdir -p content/guides
mkdir -p content/platforms
mkdir -p content/use-cases
mkdir -p content/compare

mkdir -p data
mkdir -p messages
mkdir -p public/images/platforms
mkdir -p public/images/og
mkdir -p scripts
```

---

## 3. 설정 파일

### 3.1 next.config.mjs

```javascript
// next.config.mjs
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/cloudsetup/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },

  // 정적 내보내기 (Phase 1에서는 SSG 100%)
  // output: 'export', // 필요 시 활성화

  // 헤더 보안
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' *.googletagmanager.com *.google-analytics.com *.googlesyndication.com pagead2.googlesyndication.com",
              "style-src 'self' 'unsafe-inline' fonts.googleapis.com",
              "img-src 'self' data: res.cloudinary.com *.googleusercontent.com *.supabase.co",
              "font-src 'self' fonts.gstatic.com",
              "connect-src 'self' *.supabase.co *.google-analytics.com",
              "frame-src *.googlesyndication.com",
            ].join('; '),
          },
        ],
      },
    ];
  },

  // 리다이렉트
  async redirects() {
    return [
      {
        source: '/',
        destination: '/ko',
        permanent: false,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
```

### 3.2 tailwind.config.ts

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/**/*.{ts,tsx,mdx}',
    './content/**/*.mdx',
  ],
  theme: {
    extend: {
      colors: {
        // 브랜드 컬러
        primary: {
          DEFAULT: '#1A4B8C',
          50: '#EBF3FF',
          100: '#D0E2FF',
          200: '#A3C4FF',
          300: '#6FA1FF',
          400: '#4080E0',
          500: '#1A4B8C',
          600: '#143C70',
          700: '#0E2D55',
          800: '#091E3A',
          900: '#040F1F',
        },
        success: {
          DEFAULT: '#10B981',
          50: '#ECFDF5',
          500: '#10B981',
          600: '#059669',
        },
        warning: {
          DEFAULT: '#F59E0B',
          50: '#FFFBEB',
          500: '#F59E0B',
          600: '#D97706',
        },
        danger: {
          DEFAULT: '#EF4444',
          50: '#FEF2F2',
          500: '#EF4444',
          600: '#DC2626',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          dark: '#1C1B1A',
        },
        muted: {
          DEFAULT: '#78716C',
          dark: '#A8A29E',
        },
        border: {
          DEFAULT: '#E8E5E0',
          dark: '#2E2D2B',
        },
        background: {
          DEFAULT: '#FAFAF8',
          dark: '#0F0F0E',
        },

        // 플랫폼 컬러
        gcp: '#4285F4',
        aws: '#FF9900',
        azure: '#0078D4',
        supabase: '#3ECF8E',
        vercel: '#000000',
        cloudflare: '#F6821F',
        firebase: '#FFCA28',
      },
      fontFamily: {
        sans: ['Pretendard', 'DM Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '720px',
            img: {
              borderRadius: '0.5rem',
              border: '1px solid var(--tw-prose-td-borders)',
            },
            code: {
              backgroundColor: '#F5F4F2',
              padding: '0.15rem 0.4rem',
              borderRadius: '0.25rem',
              fontWeight: '400',
            },
            'code::before': { content: '""' },
            'code::after': { content: '""' },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

export default config;
```

### 3.3 TypeScript 설정

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "es2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"],
      "@/content/*": ["./content/*"],
      "@/data/*": ["./data/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### 3.4 ESLint + Prettier

```json
// .eslintrc.json
{
  "extends": [
    "next/core-web-vitals",
    "prettier"
  ],
  "rules": {
    "react/no-unescaped-entities": "off",
    "@next/next/no-img-element": "off"
  }
}
```

```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "tabWidth": 2,
  "printWidth": 100
}
```

### 3.5 환경 변수

```bash
# .env.local
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=CloudSetup.guide

# Supabase (Phase 3에서 활성화)
# NEXT_PUBLIC_SUPABASE_URL=
# NEXT_PUBLIC_SUPABASE_ANON_KEY=
# SUPABASE_SERVICE_ROLE_KEY=

# Analytics (Phase 1 후반)
# NEXT_PUBLIC_GA_MEASUREMENT_ID=

# AdSense (Phase 1 후반)
# NEXT_PUBLIC_ADSENSE_CLIENT_ID=

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=cloudsetup
```

```bash
# .env.example (커밋용)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=CloudSetup.guide
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_GA_MEASUREMENT_ID=
NEXT_PUBLIC_ADSENSE_CLIENT_ID=
```

### 3.6 package.json scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build && npm run postbuild",
    "postbuild": "npx pagefind --site .next/server/app --output-path public/pagefind",
    "start": "next start",
    "lint": "next lint",
    "format": "prettier --write 'src/**/*.{ts,tsx,mdx}'",
    "validate": "tsx scripts/validate-guides.ts",
    "check-screenshots": "tsx scripts/check-screenshots.ts",
    "type-check": "tsc --noEmit"
  }
}
```

---

## 4. 다국어(i18n) 설정

### 4.1 next-intl 설정

```typescript
// src/i18n/request.ts
import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

const locales = ['ko', 'en'] as const;
type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as Locale)) notFound();

  return {
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
```

```typescript
// src/i18n/config.ts
export const locales = ['ko', 'en'] as const;
export const defaultLocale = 'ko' as const;
export type Locale = (typeof locales)[number];
```

```typescript
// src/middleware.ts
import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n/config';

export default createMiddleware({
  locales,
  defaultLocale,
  localeDetection: true,
  localePrefix: 'always',
});

export const config = {
  matcher: ['/', '/(ko|en)/:path*'],
};
```

### 4.2 메시지 파일

```json
// messages/ko.json
{
  "common": {
    "siteName": "CloudSetup.guide",
    "tagline": "무료로 쓸 수 있는 클라우드 API, 세팅부터 활용까지 한번에.",
    "search": "검색",
    "searchPlaceholder": "무엇을 만들고 싶으세요?",
    "allGuides": "모든 가이드 보기",
    "allPlatforms": "모든 플랫폼 보기",
    "language": "한국어",
    "darkMode": "다크 모드",
    "lightMode": "라이트 모드"
  },
  "nav": {
    "platforms": "플랫폼",
    "guides": "가이드",
    "tools": "도구",
    "blog": "블로그",
    "freeTierDashboard": "무료 한도 대시보드",
    "freeTierCalculator": "무료 한도 계산기",
    "compare": "플랫폼 비교"
  },
  "guide": {
    "estimatedTime": "예상 소요시간",
    "difficulty": "난이도",
    "freeTier": "무료 한도",
    "lastVerified": "마지막 검증일",
    "minutes": "분",
    "beginner": "초급",
    "intermediate": "중급",
    "advanced": "고급",
    "prerequisites": "먼저 해야 할 것",
    "prerequisiteComplete": "이미 완료했어요",
    "prerequisiteNeeded": "아직이에요",
    "progress": "진행률",
    "step": "단계",
    "previousStep": "이전 단계",
    "nextStep": "다음 단계",
    "checkpoint": "이 화면이 보이시나요?",
    "checkpointYes": "네, 다음으로",
    "checkpointNo": "다르게 보여요",
    "complete": "축하합니다! 가이드를 완료했습니다.",
    "nextRecommended": "다음으로 추천",
    "copied": "복사됨",
    "copyCode": "코드 복사",
    "devTip": "개발자 팁",
    "feedbackTitle": "이 가이드가 도움이 되었나요?",
    "feedbackHelpful": "도움됨",
    "feedbackNotHelpful": "어려웠어요",
    "feedbackThanks": "소중한 피드백 감사합니다!",
    "outdatedWarning": "이 가이드는 {days}일 이상 검증되지 않았습니다. 화면이 달라질 수 있습니다.",
    "billingNotice": "이 단계에서는 과금되지 않습니다."
  },
  "platform": {
    "guideCount": "{count}개 가이드",
    "freeCredit": "무료 크레딧",
    "viewGuides": "가이드 보기"
  },
  "tools": {
    "dashboardTitle": "클라우드 무료 티어 한눈에 보기",
    "dashboardDescription": "모든 클라우드 플랫폼의 무료 한도를 한 곳에서 비교하세요.",
    "calculatorTitle": "내 프로젝트, 무료로 충분할까?",
    "calculatorDescription": "예상 사용량을 입력하면 어떤 플랫폼이 맞는지 알려드립니다.",
    "calculate": "계산하기",
    "result": "분석 결과",
    "recommendation": "추천 조합",
    "startWithThis": "이 조합으로 시작하기",
    "generous": "넉넉",
    "moderate": "보통",
    "limited": "제한"
  },
  "footer": {
    "about": "소개",
    "privacy": "개인정보 처리방침",
    "contact": "문의",
    "copyright": "© {year} CloudSetup.guide. All rights reserved."
  }
}
```

```json
// messages/en.json
{
  "common": {
    "siteName": "CloudSetup.guide",
    "tagline": "Free cloud API setup guides, from zero to deployed.",
    "search": "Search",
    "searchPlaceholder": "What do you want to build?",
    "allGuides": "View all guides",
    "allPlatforms": "View all platforms",
    "language": "English",
    "darkMode": "Dark mode",
    "lightMode": "Light mode"
  },
  "nav": {
    "platforms": "Platforms",
    "guides": "Guides",
    "tools": "Tools",
    "blog": "Blog",
    "freeTierDashboard": "Free Tier Dashboard",
    "freeTierCalculator": "Free Tier Calculator",
    "compare": "Compare Platforms"
  },
  "guide": {
    "estimatedTime": "Estimated time",
    "difficulty": "Difficulty",
    "freeTier": "Free tier",
    "lastVerified": "Last verified",
    "minutes": "min",
    "beginner": "Beginner",
    "intermediate": "Intermediate",
    "advanced": "Advanced",
    "prerequisites": "Before you start",
    "prerequisiteComplete": "Already done",
    "prerequisiteNeeded": "Not yet",
    "progress": "Progress",
    "step": "Step",
    "previousStep": "Previous step",
    "nextStep": "Next step",
    "checkpoint": "Does your screen look like this?",
    "checkpointYes": "Yes, continue",
    "checkpointNo": "Mine looks different",
    "complete": "Congratulations! You've completed this guide.",
    "nextRecommended": "Recommended next",
    "copied": "Copied",
    "copyCode": "Copy code",
    "devTip": "Developer tip",
    "feedbackTitle": "Was this guide helpful?",
    "feedbackHelpful": "Helpful",
    "feedbackNotHelpful": "Needs improvement",
    "feedbackThanks": "Thank you for your feedback!",
    "outdatedWarning": "This guide hasn't been verified in {days}+ days. Screenshots may be outdated.",
    "billingNotice": "No charges will occur in this step."
  },
  "platform": {
    "guideCount": "{count} guides",
    "freeCredit": "Free credits",
    "viewGuides": "View guides"
  },
  "tools": {
    "dashboardTitle": "Cloud Free Tiers at a Glance",
    "dashboardDescription": "Compare free tier limits across all cloud platforms in one place.",
    "calculatorTitle": "Is free tier enough for my project?",
    "calculatorDescription": "Enter your expected usage and find the right platform.",
    "calculate": "Calculate",
    "result": "Analysis Result",
    "recommendation": "Recommended Stack",
    "startWithThis": "Start with this stack",
    "generous": "Generous",
    "moderate": "Moderate",
    "limited": "Limited"
  },
  "footer": {
    "about": "About",
    "privacy": "Privacy Policy",
    "contact": "Contact",
    "copyright": "© {year} CloudSetup.guide. All rights reserved."
  }
}
```

---

## 5. Git 설정

### 5.1 .gitignore

```
# .gitignore
node_modules/
.next/
out/
.env.local
.env*.local
*.tsbuildinfo
next-env.d.ts

# Pagefind 빌드 결과 (빌드 시 생성)
public/pagefind/

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
```

### 5.2 초기 커밋

```bash
git init
git add .
git commit -m "feat: initial project setup with Next.js 14, Tailwind, next-intl, MDX"
```

---

## 6. Vercel 배포 설정

```bash
# Vercel CLI 설치 및 연결
npm i -g vercel
vercel link

# 환경변수 설정 (Vercel 대시보드에서도 가능)
vercel env add NEXT_PUBLIC_SITE_URL
vercel env add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

# 배포
vercel --prod
```

---

*다음: [component_spec.md](./component_spec.md) — 컴포넌트 상세 명세*
