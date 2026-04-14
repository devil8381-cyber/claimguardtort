# Worklog — ClaimGuard Pro Shared Code Extraction

## Task: Extract shared code from monolithic page.tsx into lib files

### Date: 2025-07-15

### Files Created

#### 1. `/home/z/my-project/src/lib/constants.ts` (~1,800 lines)

All shared data constants, types, context, and utility functions extracted from page.tsx.

**Exports:**

**Context & Types:**
- `DEFAULT_COMPANY_SETTINGS` — default company config object
- `CompanySettingsContext` — React context for company settings
- `useCompanySettings()` — hook to consume company settings
- `CompanySettings` — TypeScript type

**Navigation & Hero:**
- `NAV_LINKS` — main navigation link array (10 items)
- `HERO_HEADLINES` — rotating hero text array (4 items)
- `PARTICLE_POSITIONS` — hero background particle positions (20 items)

**Case & Service Data:**
- `CASE_TYPES` — list of 20 mass tort case types
- `TRUST_BADGES` — 12 trust indicators
- `HOW_IT_WORKS_STEPS` — 5-step process with lucide-react icons
- `SERVICES_DATA` — 6 service cards with icons and details
- `STATS_DATA` — dynamically generated stats (IIFE with date seed)
- `STATS_TOOLTIP_DATA` — tooltip text for stat cards

**Testimonials & FAQ:**
- `TESTIMONIALS_DATA` — 6 testimonial objects
- `FAQ_DATA` — 10 FAQ items

**Case Studies & Success Stories:**
- `CASE_STUDIES` — 3 detailed case study objects
- `SUCCESS_STORIES` — 12 success story objects with full details

**Team & Pipeline:**
- `TEAM_MEMBERS` — 6 team member profiles
- `PIPELINE_STAGES` — 5 claim pipeline stages
- `DOC_CHECKLIST` — 5 document checklist items with icons

**Case Type Details:**
- `CASE_TYPE_DETAILS` — 20 detailed case type objects with icons, descriptions, statuses

**Comparison & Trust:**
- `COMPARISON_DATA` — 7 comparison rows (us vs others)
- `LAW_FIRMS` — 12 law firm objects
- `TRUST_STATS` — 4 trust statistics
- `MEDIA_LOGOS` — 8 media outlet names

**Settlement Calculator:**
- `SETTLEMENT_RANGES` — settlement range data for 24 case types

**Case Colors:**
- `CASE_COLORS` — Tailwind color classes for 12 case types

**Filing Deadlines:**
- `FILING_DEADLINES` — 8 deadline entries with icons

**Blog & News:**
- `BLOG_ARTICLES` — 15 full blog article objects with content
- `NEWS_HEADLINES` — 8 news headline strings

**Form Data:**
- `US_STATES` — 50 US state names
- `CLAIM_FORM_CASE_TYPES` — 21 case types for claim forms
- `SETTLEMENT_DATA` — 12 settlement tracker entries with icons
- `VIDEO_TESTIMONIALS` — 6 video testimonial objects

**Mobile Nav:**
- `MOBILE_NAV_ITEMS` — 5 bottom nav items with lucide-react icons

**Legal Text Generators:**
- `getPrivacyPolicyText(settings)` — generates privacy policy text
- `getTermsOfServiceText(settings)` — generates terms of service text
- `DISCLAIMER_TEXT` — legal disclaimer string

**Social Proof Generator:**
- `SP_FIRST_NAMES` — 100 first names
- `SP_LAST_INITIALS` — 26 last initials
- `SP_CITIES` — 200+ US city/state pairs
- `SP_ACTIONS` — 29 social proof actions
- `SP_CASE_TYPES` — 25 case type strings
- `SP_TIME_PHRASES` — 30 time phrases
- `shuffleArray(arr)` — Fisher-Yates shuffle
- `hashString(str)` — deterministic hash function
- `generateSocialProofPool()` — generates 10,000 unique social proof notifications

**Track Claim Helpers:**
- `getStatusConfig(status)` — returns badge/icon config for claim status
- `getStageIndex(status)` — returns pipeline stage index

**Admin Constants:**
- `ADMIN_AUTH_TOKEN` — admin authentication token
- `STATUS_COLORS` — badge color map for 10 statuses
- `STATUS_DOT_COLORS` — dot color map for 10 statuses
- `VALID_STATUSES` — array of 10 valid claim statuses

**Shared Interfaces:**
- `ClaimantRecord` — admin claimant record interface
- `AdminStats` — admin dashboard stats interface
- `ClaimResult` — track claim result interface
- `QuizAnswers` — eligibility quiz answers interface
- `UploadedFile` — file upload interface
- `ChatMessage` — chat message interface

**Icon Dependencies:** All lucide-react icons used in data arrays are imported directly in constants.ts.

---

#### 2. `/home/z/my-project/src/lib/hooks.tsx` (~165 lines)

All custom hooks, animation variants, and small reusable components.

**Exports:**

**Hooks:**
- `useInView(threshold)` — IntersectionObserver hook, returns `{ ref, inView }`
- `useCounter(target, inView, duration)` — animated counter hook
- `useScrollSpy()` — active section detection based on scroll position
- `useCountdown(targetDate)` — countdown timer, returns `{ days, hours, minutes }`
- `useAnimatedCounter(target, duration)` — cubic ease-out animated counter

**Utilities:**
- `announce(message, priority)` — screen reader live region announcer

**Animation Variants:**
- `fadeInUp` — fade + slide up variant
- `staggerContainer` — stagger children variant
- `scaleIn` — scale-in variant

**Components:**
- `CountUpNumber({ value })` — renders animated count-up number

**Dependencies:** Imports `NAV_LINKS` from `@/lib/constants` (used by `useScrollSpy`).

---

### Verification

- ✅ ESLint passes with zero errors
- ✅ Dev server responds with HTTP 200
- ✅ All icon references in data arrays have corresponding lucide-react imports
- ✅ All React hooks use correct imports from 'react'
- ✅ Type annotations preserved for all interfaces and types
- ✅ No modifications made to page.tsx

### Notes

- `hooks.ts` was renamed to `hooks.tsx` because it contains JSX (the `CountUpNumber` component uses a React fragment).
- The `STATS_DATA` constant uses an IIFE with date-based seeding — this is preserved exactly as-is.
- The `generateSocialProofPool` function uses `sessionStorage` and `window` — kept in constants.ts since it's a data-generation utility, not a React hook.
