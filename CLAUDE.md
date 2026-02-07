# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CloudSetup.guide is a static-first documentation site that provides step-by-step guides for setting up cloud APIs with screenshots. Built with Next.js 14+ App Router, the site uses MDX for content, supports Korean and English, and follows a phased rollout (Phase 1: Static SSG, Phase 2: Minimal APIs, Phase 3: Dynamic features with Supabase).

## Development Commands

### Core Commands
```bash
# Development
npm run dev                    # Start development server

# Build
npm run build                  # Build site + run post-build tasks (Pagefind index, validation)
npm run postbuild              # Generate Pagefind search index + validate guides

# Validation
npm run validate               # Run guide meta.json validation
npm run check-screenshots      # Check if screenshots need updating (>6 months)

# Code Quality
npm run lint                   # Run ESLint
npm run format                 # Format code with Prettier
npm run type-check             # TypeScript type checking (no emit)

# Deployment
vercel --prod                  # Deploy to production
```

## Architecture Overview

### Data Flow
The project uses a **hybrid data architecture**:

1. **Layer 1: Static Files (Git-managed)** - Primary data source (Phase 1)
   - MDX content: Guide content in `content/guides/*/ko.mdx` and `en.mdx`
   - JSON metadata: `content/guides/*/meta.json` with all guide metadata
   - Static data: `data/platforms.json`, `data/free-tiers.json`, `data/categories.json`

2. **Layer 2: Supabase DB** - Dynamic data (Phase 3+)
   - User profiles, guide progress, comments, feedback
   - Accessed directly via Supabase Client SDK (not through API Routes)
   - Security enforced by Row Level Security (RLS)

3. **Layer 3: External Services**
   - Cloudinary: Image CDN with automatic WebP/AVIF conversion
   - Pagefind: Client-side static search (Phase 1-2)
   - Google Analytics 4: Analytics tracking

### Build-Time vs Runtime
- **Build time**: All guide content is generated as static HTML (SSG)
- **Runtime**: Only dynamic features use client-side JavaScript (progress tracking, comments in Phase 3)
- **CDN-first**: Static HTML served from Vercel Edge Network for optimal performance

### Server vs Client Components
- **Server Components** (default): Use for static rendering, data fetching, pure display
- **Client Components** (`'use client'`): Required for:
  - `useState`, `useEffect`, event handlers
  - Browser APIs (localStorage, clipboard, IntersectionObserver)
  - Interactive features (ProgressBar, CopyBlock, Checkpoint)

## Content Structure

### Guide Content Organization
Each guide lives in `content/guides/<slug>/`:
```
content/guides/gcp-vision-api-setup/
├── meta.json              # Metadata (platform, difficulty, SEO, etc.)
├── ko.mdx                 # Korean content
├── en.mdx                 # English content
└── screenshots/           # Step screenshots (step1-*-ko.png, step1-*-en.png)
```

### Guide Metadata (meta.json)
Critical fields in `meta.json`:
- `slug`: Unique identifier (URL slug)
- `platform`: One of: gcp, aws, azure, supabase, vercel, cloudflare, firebase
- `service`: Service name (e.g., "Cloud Vision API")
- `category`: One of: ai-ml, compute, database, storage, auth, maps, cdn, monitoring
- `difficulty`: beginner | intermediate | advanced
- `estimatedMinutes`: Expected completion time
- `totalSteps`: Number of steps in guide
- `freeTier`: Free tier information with limit, period, amount, status
- `prerequisites`: Array of prerequisite guide slugs
- `nextGuides`: Array of recommended next guide slugs
- `seo`: SEO metadata for both locales (ko, en)
- `lastVerified`: ISO date of last verification

### MDX Component Mapping
MDX files use custom React components (mapped in `lib/mdx-components.tsx`):
- `<Step>`: Step container with number and title
- `<Screenshot>`: Image with optional highlight overlay
- `<Callout>`: Alert boxes (info, warning, danger, tip)
- `<CopyBlock>`: Code block with copy button
- `<FreeTierInfo>`: Free tier badge/info
- `<DevTip>`: Collapsible developer tip
- `<Checkpoint>`: User verification checkpoint

## Key Technical Patterns

### File Naming Conventions
- Components: PascalCase.tsx (`GuideHeader.tsx`)
- Hooks: camelCase.ts with `use` prefix (`useScrollSpy.ts`)
- Utils/Libs: kebab-case.ts or camelCase.ts (`guides.ts`, `free-tiers.ts`)
- Types: kebab-case.ts (`guide.ts`, `platform.ts`)
- Guide slugs: kebab-case with pattern `platform-service-action` (`gcp-vision-api-setup`)

### Data Access Patterns
**Build-time functions** (in `lib/` directory):
- `getAllGuides()`: Returns all published guide metadata
- `getGuide(slug, locale)`: Returns specific guide with MDX content
- `getGuidesByPlatform(platform)`: Filter guides by platform
- `getGuidesByCategory(category)`: Filter guides by category

**Client-side functions** (Phase 3):
- Direct Supabase access via `@supabase/ssr` client
- No API Routes for user data (RLS handles security)
- LocalStorage fallback for non-authenticated progress tracking

### Component Organization
```
components/
├── guide/          # Guide-specific (Step, Screenshot, Checkpoint, etc.)
├── platform/       # Platform cards and grids
├── explore/        # Search and filtering
├── tools/          # Free tier dashboard and calculator
├── common/         # Global components (Header, Footer, etc.)
└── ui/             # shadcn/ui components (button, card, dialog, etc.)
```

### TypeScript Usage
- Use interfaces for data shapes and Props (extensible)
- Use type aliases for unions, utilities, and simple types
- Never use `any` - use `unknown` with type guards if needed
- No inline types for Props - define explicit interfaces
- Avoid non-null assertions (`!`) - use guard clauses

### Performance Optimization
1. **Images**: Always use `next/image` with:
   - `priority={true}` only for first screenshot
   - `loading="lazy"` for others
   - Cloudinary URLs for automatic WebP/AVIF conversion

2. **Code Splitting**:
   - Server components by default (minimal client JS)
   - Dynamic imports for heavy features: `const Heavy = dynamic(() => import('./Heavy'))`
   - AdSense loaded on viewport entry with IntersectionObserver

3. **Bundle Size Goals**:
   - Core bundle: ~40KB
   - Guide page bundle: ~30KB
   - Lazy-loaded features: Pagefind (~15KB), AdSense (~20KB)

## Git Workflow

### Commit Message Format
```
<type>(<scope>): <description>

Types:
  feat     - New feature
  fix      - Bug fix
  content  - Guide/content addition or update
  style    - UI/style changes
  refactor - Code refactoring
  perf     - Performance improvement
  docs     - Documentation
  test     - Tests
  chore    - Build/config changes

Scopes: guide, platform, search, i18n, seo, auth, comment, feedback

Examples:
  feat(guide): add CopyBlock component with clipboard support
  content(guide): add gcp-vision-api-setup guide (ko/en)
  fix(search): fix pagefind index not updating on build
```

### Branch Strategy
```
main              # Production (auto-deploy to Vercel)
  ├── feat/*      # Feature branches
  ├── content/*   # Content addition branches
  ├── fix/*       # Bug fix branches
  └── chore/*     # Maintenance branches
```

## Common Workflows

### Adding a New Guide
1. Create directory: `content/guides/<slug>/`
2. Add `meta.json` with all required fields
3. Create `ko.mdx` and `en.mdx` with guide content
4. Add screenshots to `screenshots/` subdirectory
5. Naming: `step{N}-{description}-{locale}.png`
6. Upload screenshots to Cloudinary
7. Run `npm run validate` to check metadata
8. Run `npm run build` to verify build succeeds
9. Test locally with `npm run dev`

### Updating Existing Guide
1. Update MDX content or screenshots
2. Update `meta.json` with new `updatedAt` and `lastVerified` dates
3. If screenshots changed, update Cloudinary URLs
4. Run validation and build

### Adding a Component
1. Determine if server or client component
2. Server: No `'use client'`, async data fetching OK
3. Client: Add `'use client'` at top, use hooks/events
4. Use named exports, not default (except page.tsx)
5. Define Props interface explicitly
6. Follow component structure: imports → types → constants → component

### Localization
- UI strings: Add to `messages/ko.json` and `messages/en.json`
- Content: Create separate `ko.mdx` and `en.mdx` files
- Access translations: `useTranslations()` hook from next-intl
- Route structure: All pages under `[locale]` directory

## Important Constraints

### Phase-Specific Features
- **Phase 1** (Current MVP): Static only, no auth, no dynamic data
- **Phase 2**: Add feedback API (`/api/feedback`) and newsletter (`/api/newsletter`)
- **Phase 3**: Add Supabase auth, progress tracking, comments
- Don't implement Phase 2/3 features unless explicitly requested

### Security
- Never commit `.env.local` (contains secrets)
- Supabase: Use anon key on client, service key only in API Routes
- Images: Only allow Cloudinary domain in next/image
- CSP headers configured in next.config.mjs
- Phase 3: RLS policies on all Supabase tables

### SEO Requirements
- All pages must have unique meta title and description
- Use JSON-LD schema for guides (HowTo schema)
- Generate sitemap dynamically from guide metadata
- Core Web Vitals targets: LCP < 2.5s, FID < 100ms, CLS < 0.1

### Content Guidelines
- Screenshots must include locale suffix: `-ko.png` or `-en.png`
- Verify screenshots every 6 months (run `npm run check-screenshots`)
- Free tier info must include: limit, period, status, conditions
- Prerequisites must reference existing guide slugs
- All guide slugs must be unique and follow `platform-service-action` pattern

## Development Tips

- The site is designed for non-developers to follow guides, so clarity is paramount
- Every step should have a screenshot with visual confirmation
- Use `<Checkpoint>` to verify users are on the right track
- Keep instructions action-oriented (start with verbs)
- Test guides in both Korean and English before committing
- Validate all metadata before pushing: `npm run validate`
- Build succeeds but Pagefind index creation happens in postbuild

## External Dependencies

- **Next.js 14+**: App Router, Server Components, Static Site Generation
- **Tailwind CSS**: Utility-first styling
- **shadcn/ui**: Copy-paste component library (not npm dependency)
- **MDX**: Markdown + React components via next-mdx-remote
- **next-intl**: i18n with file-based routing
- **Pagefind**: Client-side search (generated at build time)
- **Supabase** (Phase 3): Auth + PostgreSQL with RLS
- **Cloudinary**: Image CDN with automatic optimization
- **Vercel**: Hosting, CDN, serverless functions

## Related Documentation

All project documentation is in `docs/`:
- `docs/planning/`: Product planning, personas, roadmap
- `docs/design/`: Architecture, data model, API design, UI/UX
- `docs/development/`: Setup guide, coding conventions, component specs
