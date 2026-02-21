# PJAZZA — Next.js App Router Structure

## Folder Tree

```
pjazza-nextjs/
├── app/
│   └── pjazza/
│       ├── layout.tsx              # Shared layout: TopBar + BottomNav + pjazza.css import
│       ├── page.tsx                # Portal landing page (/)
│       ├── discover/
│       │   └── page.tsx            # Discover marketplace feed
│       ├── live-shop/
│       │   ├── page.tsx            # Live Shop store listing
│       │   └── [storeId]/
│       │       └── page.tsx        # Live shopping video session (dynamic route)
│       ├── how-it-works/
│       │   └── page.tsx            # How It Works (buyer + seller flows, escrow, FAQ)
│       ├── sectors/
│       │   └── page.tsx            # All 12 Sectors directory
│       ├── people/
│       │   └── page.tsx            # People / freelancers directory
│       ├── business/
│       │   ├── onboard/
│       │   │   └── page.tsx        # Business onboarding pitch page
│       │   ├── dashboard/
│       │   │   └── page.tsx        # Seller analytics dashboard
│       │   └── stream/
│       │       └── page.tsx        # Recording studio (live + upload)
├── components/
│   ├── TopBar.tsx                  # Sticky frosted nav with desktop links
│   ├── BottomNav.tsx               # Mobile bottom tab bar (hidden ≥1024px)
│   ├── ScrollReveal.tsx            # Intersection Observer scroll animations
│   └── BrandMarquee.tsx            # Infinite horizontal marquee
├── styles/
│   └── pjazza.css                  # Complete design system (831 lines, unchanged)
├── public/
│   └── pjazza/
│       └── images/                 # All image assets (hero, thumbnails, stores, people)
│           ├── hero-malta.jpg
│           ├── hero-discover.jpg
│           ├── thumb-*.jpg         # Category thumbnails (5)
│           ├── stores/             # Store images (12) + salesperson images (2)
│           └── people/             # Professional profile images (20)
├── STRUCTURE.md                    # This file
└── DEPENDENCIES.md                 # npm packages required
```

## Route Mapping

| URL Path                          | File                                      | Description                           |
|-----------------------------------|-------------------------------------------|---------------------------------------|
| `/pjazza`                         | `app/pjazza/page.tsx`                     | Portal landing page                   |
| `/pjazza/discover`                | `app/pjazza/discover/page.tsx`            | Marketplace discovery feed            |
| `/pjazza/live-shop`               | `app/pjazza/live-shop/page.tsx`           | Store listing with search & filters   |
| `/pjazza/live-shop/[storeId]`     | `app/pjazza/live-shop/[storeId]/page.tsx` | Live video shopping session           |
| `/pjazza/how-it-works`            | `app/pjazza/how-it-works/page.tsx`        | Buyer/seller flows + escrow + FAQ     |
| `/pjazza/sectors`                 | `app/pjazza/sectors/page.tsx`             | All 12 industry sectors               |
| `/pjazza/people`                  | `app/pjazza/people/page.tsx`              | Freelancer & professional directory   |
| `/pjazza/business/onboard`        | `app/pjazza/business/onboard/page.tsx`    | Business pitch & pricing page         |
| `/pjazza/business/dashboard`      | `app/pjazza/business/dashboard/page.tsx`  | Seller analytics dashboard            |
| `/pjazza/business/stream`         | `app/pjazza/business/stream/page.tsx`     | Live streaming recording studio       |

## Component Purpose

| Component         | Purpose                                                                    |
|-------------------|----------------------------------------------------------------------------|
| `TopBar`          | Sticky frosted-glass navigation. Logo, desktop nav links, search, bell.    |
| `BottomNav`       | Mobile-only (hidden ≥1024px) tab bar: Home, Sectors, LIVE, People, Biz.    |
| `ScrollReveal`    | IntersectionObserver wrapper for scroll-triggered fade-in animations.      |
| `RevealGroup`     | Staggered children reveal (exported from ScrollReveal).                    |
| `BrandMarquee`    | Infinite horizontal scrolling marquee of sector keywords.                  |

## Design Tokens (from pjazza.css)

| Token              | Value       | Usage                     |
|--------------------|-------------|---------------------------|
| `--pj-black`       | `#000000`   | True black backgrounds    |
| `--pj-red`         | `#E11D48`   | Primary accent (rose-red) |
| `--pj-gold`        | `#D4A574`   | Premium gold accent       |
| `--pj-green`       | `#22C55E`   | Trust / success signals   |
| `--pj-font`        | Inter        | Single typeface           |

## Conversion Notes (Wouter → Next.js)

- `useLocation()` → `useRouter()` from `next/navigation` for `navigate()`, `usePathname()` for current path
- `useRoute('/pjazza/live-shop/:storeId')` → `useParams()` from `next/navigation`
- `Link` from `wouter` → `Link` from `next/link`
- All interactive components have `"use client"` directive
- Image imports (`../assets/...`) → static paths (`/pjazza/images/...`)
