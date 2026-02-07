# CloudSetup.guide

Step-by-step guides for cloud API setup with screenshots.

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
api_tutor/
├── app/                    # Next.js App Router pages
│   └── [locale]/          # Internationalized routes (ko, en)
│       ├── guides/        # Guide pages
│       └── layout.tsx     # Root layout with Header/Footer
├── components/
│   ├── guide/            # Guide-specific components
│   ├── common/           # Shared components (Header, Footer)
│   └── ui/               # shadcn/ui components
├── content/
│   └── guides/           # MDX guide content
│       └── [slug]/
│           ├── meta.json # Guide metadata
│           ├── ko.mdx    # Korean content
│           └── en.mdx    # English content
├── lib/                  # Utility functions
├── types/                # TypeScript type definitions
├── data/                 # Static JSON data (platforms, categories)
├── messages/             # i18n translations (ko.json, en.json)
└── docs/                 # Project documentation
```

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Content**: MDX (Markdown + React components)
- **i18n**: next-intl
- **Deployment**: Vercel

## 📝 Development Status

### ✅ Completed (Phase 1 - Foundation)
- [x] Next.js 14 project setup
- [x] TypeScript configuration
- [x] Tailwind CSS + shadcn/ui
- [x] next-intl i18n setup (ko/en)
- [x] MDX rendering pipeline
- [x] Guide components (Step, Screenshot, CopyBlock, Callout, FreeTierInfo)
- [x] Common layout (Header, Footer)
- [x] Git repository initialization
- [x] Static site generation (SSG)

### 🔄 In Progress
- [ ] Homepage with platform cards
- [ ] Platform pages
- [ ] Pagefind search integration
- [ ] SEO optimization (meta tags, JSON-LD, sitemap)
- [ ] Google Analytics 4
- [ ] AdSense integration

### 📅 Planned (Phase 2+)
- [ ] GCP guides (10 guides)
- [ ] AWS guides
- [ ] Supabase guides
- [ ] Free tier dashboard
- [ ] Guide filtering
- [ ] Feedback system
- [ ] Progress tracking
- [ ] Comments (Phase 3)

## 📖 Adding a New Guide

1. Create directory: `content/guides/your-guide-slug/`
2. Add `meta.json` with guide metadata
3. Create `ko.mdx` and `en.mdx` with content
4. Add screenshots to `screenshots/` subdirectory
5. Build and test: `npm run build`

Example `meta.json`:
```json
{
  "slug": "your-guide-slug",
  "platform": "gcp",
  "service": "Your Service",
  "category": "general",
  "difficulty": "beginner",
  "estimatedMinutes": 10,
  "totalSteps": 3,
  "seo": {
    "ko": { "title": "제목", "description": "설명", "keywords": [] },
    "en": { "title": "Title", "description": "Description", "keywords": [] }
  },
  "published": true
}
```

## 🌐 Internationalization

- Supported locales: Korean (ko), English (en)
- Default locale: Korean (ko)
- All routes are prefixed with locale: `/ko/guides/...`, `/en/guides/...`
- UI translations in `messages/{locale}.json`
- Guide content in separate MDX files per locale

## 🔧 Available Scripts

- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run type-check` - TypeScript type checking
- `npm run validate` - Validate guide metadata

## 📄 License

All rights reserved.

## 📚 Documentation

See `docs/` directory for detailed documentation:
- Planning: `docs/planning/`
- Design: `docs/design/`
- Development: `docs/development/`
- `CLAUDE.md` - Instructions for Claude Code assistant

---

**Status**: Phase 1 Foundation - Complete ✅
**Next**: Add content and expand features
