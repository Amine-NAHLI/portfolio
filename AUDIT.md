# PORTFOLIO AUDIT — Phase 0
**Project:** Amine Nahli Portfolio  
**Stack:** Next.js 16.2.4 · React 19 · TypeScript · Tailwind v4 · Framer Motion · Three.js · Lenis  
**Audit Date:** 2026-05-04  
**Auditor:** Claude Code (Phase 0 of premium overhaul)

---

## SCORING SUMMARY

| Category | Current Score | Target |
|---|---|---|
| Visual Quality | 6 / 10 | 9.5 / 10 |
| Performance | 5 / 10 | 9.5 / 10 |
| Accessibility | 3 / 10 | 10 / 10 |
| Code Consistency | 5 / 10 | 9 / 10 |
| Mobile Responsiveness | 6 / 10 | 9.5 / 10 |

---

## 1. VISUAL PROBLEMS

### Hero Section (`src/components/sections/Hero.tsx`)

| # | Problem | Severity | Details |
|---|---|---|---|
| V1 | **Height unit** | Medium | Uses `min-h-screen` (100vh), not `100svh` — on iOS Safari the browser chrome is not accounted for; content may be cut off |
| V2 | **Heading overflow risk** | Medium | `text-8xl` at lg breakpoint with no clamp or fluid scaling — at exactly 768-1024px breakpoints the heading may overflow on narrower viewports |
| V3 | **Typing cursor blink rate** | Low | `animate-pulse` blinks at ~2Hz (Tailwind default); spec requires exactly 1Hz |
| V4 | **Scroll indicator** | Low | Simple `ChevronDown` bounce is dated. No line animation, no scroll-fade-out — disappears from sight on scroll but element stays mounted |
| V5 | **Status badge** | Low | Uppercase text is `font-bold` but visually should be `font-medium` mono — too heavy at 12px |
| V6 | **3D scene opacity** | Low | Wireframe shapes have `opacity-25` — near invisible on mobile; adds render cost for near-zero visual contribution |
| V7 | **CTA button spacing** | Low | GitHub icon button and "Get in Touch" text button have identical border radius/style but different visual weight — mismatched hierarchy |
| V8 | **Bio text double-line** | Low | `<br className="hidden md:block" />` breaks prose flow — stat line below feels tacked on rather than integrated |

### Navbar (`src/components/ui/Navbar.tsx`)

| # | Problem | Severity | Details |
|---|---|---|---|
| V9 | **Full-width bar** | High | A rectangular full-width navbar reads as generic/corporate. Floating pill design would instantly elevate perceived quality (Linear, Vercel pattern) |
| V10 | **No scroll-position active state** | Medium | Active nav link is only shown on hover — no indication of current section while reading. No `layoutId` underline animation |
| V11 | **Progress bar height** | Low | `h-[2px]` — per spec should be `1.5px` for premium precision |
| V12 | **Download CV button** | Low | Cyan text on dark bg with cyan border — hover state (cyan fill, dark text) is good, but initial state contrast ratio may be borderline for some users |

### About Section (`src/components/sections/About.tsx`)

| # | Problem | Severity | Details |
|---|---|---|---|
| V13 | **Traffic light colors hardcoded** | Low | `#ff5f56`, `#ffbd2e`, `#27c93f` are not in the design system — should use CSS variables |
| V14 | **Terminal window** | Medium | Grid columns are 50/50 (equal split); spec calls for 60/40 asymmetric — currently feels balanced but flat, not dynamic |
| V15 | **Stat cards — no gradient heading** | Low | Numbers are `text-accent-cyan` but all four stat cards use the same color — no visual differentiation between stats |
| V16 | **"❯" and "▋" fallback** | Low | JetBrains Mono renders these correctly, but if font fails to load, characters render as boxes |

### Projects (`src/components/sections/Projects.tsx`)

| # | Problem | Severity | Details |
|---|---|---|---|
| V17 | **No section heading/subheading** | High | Section only has a label (`// 03 ─ WORK`) — missing the large `<h2>` heading and intro paragraph that every other section has |
| V18 | **Filter tab active state** | Medium | Active tab uses `style={{ color: '#06b6d4' }}` — hardcoded inline style, bypasses design system |
| V19 | **Empty state styling** | Medium | "No projects in this category" is plain text, no visual treatment, no CTA to clear filter |
| V20 | **Card aspect ratio** | Medium | Cards are variable height based on content — creates inconsistent grid rhythm |
| V21 | **Tags limited to 4** | Low | Tags sliced to `slice(0, 4)` with no `+N more` indicator |

### Stack Section (`src/components/sections/Stack.tsx`)

| # | Problem | Severity | Details |
|---|---|---|---|
| V22 | **Progress bars** | High | A single "Proficiency" bar per skill category is overly simplistic — the bar AND the percentage label are redundant and neither is accurate (% values come from README parsing, not real measurement) |
| V23 | **Tech tags too small** | Medium | `text-[10px]` tags are difficult to read — below comfortable reading size on all platforms |
| V24 | **No section heading** | Medium | Same as Projects — only a label, no `<h2>` or intro |
| V25 | **Grid structure** | Low | 3-column grid for 4 skill categories results in one card spanning full width on some breakpoints — looks accidental |

### Timeline (`src/components/sections/Timeline.tsx`)

| # | Problem | Severity | Details |
|---|---|---|---|
| V26 | **Year badge ambiguity** | High | Year shows only last 2 digits (`event.year.slice(-2)`) — "24" for 2024 is unclear and easily confused with other numbers |
| V27 | **Mobile layout** | Medium | On mobile, all events are left-aligned (pl-14) — the alternating left/right layout collapses to single column but the zigzag line remains centered, creating visual asymmetry |
| V28 | **No section heading** | Low | Same as Stack/Projects |

### Contact Section (`src/components/sections/Contact.tsx`)

| # | Problem | Severity | Details |
|---|---|---|---|
| V29 | **Fake form submission** | Critical | `handleSubmit` uses `setTimeout(() => ..., 1500)` — there is no actual backend. Users who fill out the form receive a "success" that sends nothing |
| V30 | **Blockquote size** | Medium | `text-3xl` for the pull quote is smaller than what the spec calls for (60-72px). Does not make enough visual impact |
| V31 | **Success toast position** | Low | Toast overlaps form content at `top-4` — could occlude important form fields on smaller screens |

### Footer (`src/components/ui/Footer.tsx`)

| # | Problem | Severity | Details |
|---|---|---|---|
| V32 | **Tagline opacity** | Medium | `opacity-30` at rest makes "BUILT WITH INTENTION." almost invisible — the dramatic tagline loses its impact; hover to 80% feels like an easter egg rather than a statement |
| V33 | **"All systems operational"** | Low | `text-emerald-500/50` (50% opacity) — this text fails WCAG contrast on dark background; also `italic` which reduces legibility |
| V34 | **No "Currently" / "Now" column** | Low | Footer is a single-row nav link list — misses opportunity for the dynamic "last commit", "current focus" content |

---

## 2. PERFORMANCE ISSUES

| # | Problem | Severity | File | Details |
|---|---|---|---|---|
| P1 | **Three.js continuous render** | High | `HeroScene.tsx` | Canvas renders at 60fps even when the user has scrolled past the hero and it's off-screen. Should use `frameloop="demand"` + IntersectionObserver to pause when not visible |
| P2 | **Typing animation timer** | Medium | `Hero.tsx:L58-72` | `setTimeout` fires every 40-80ms for the lifetime of the component — drains battery on mobile, especially during long sessions. The unmount cleanup is correct but the active timer frequency is too aggressive |
| P3 | **TerminalEasterEgg always running** | Medium | `Footer.tsx:L57-87` | Typing animation runs from mount with no IntersectionObserver — starts consuming CPU before user scrolls to footer. Does pause on unmount correctly, but should pause when not in viewport |
| P4 | **LCP impact — HeroScene** | Medium | `Hero.tsx:L10-13` | `dynamic()` import helps but Three.js still loads eagerly in the background and competes with LCP resources (heading text, fonts) |
| P5 | **No prefers-reduced-motion** | Medium | `SmoothScroll.tsx`, multiple | Lenis smooth scroll and all Framer Motion animations run unconditionally. Users who have `prefers-reduced-motion: reduce` set will experience motion sickness without any accommodation |
| P6 | **useScroll firing every frame** | Low | `Navbar.tsx:L22-27` | `useScroll` + `useSpring` runs a scroll handler every frame — acceptable but combined with Lenis scroll callbacks this means the scroll event is processed twice per frame |
| P7 | **Color map objects recreated** | Low | `Stack.tsx:L8-27` | `accentBgColors`, `textAccentColors`, `stripeColors` are plain objects but redeclared inside module scope on every hot-reload (fine in prod, but pattern should use `const` maps outside component) |
| P8 | **No image optimization** | Low | `layout.tsx` / GitHub API | GitHub avatar URLs are used as raw `<img>` src — missing `next/image` with proper `sizes` prop, no lazy loading, no blur placeholder |
| P9 | **No loading skeleton** | Medium | `page.tsx` | Server component fetches from GitHub API with no Suspense boundary — if API is slow, the entire page waits. No skeleton screen shown during ISR revalidation |

---

## 3. ACCESSIBILITY ISSUES

### Critical (WCAG Violations)

| # | Problem | WCAG Criterion | File | Details |
|---|---|---|---|---|
| A1 | **Form inputs have no labels** | 1.3.1 / 4.1.2 | `Contact.tsx:L141-163` | All four form inputs use `placeholder` only — no `<label>` elements. Placeholder text disappears when typing, fails screen reader association, fails WCAG AA |
| A2 | **Skill progress bars are not semantic** | 4.1.2 | `Stack.tsx:L45-54` | Progress bars use `div` with visual width — missing `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax` |
| A3 | **Lenis ignores prefers-reduced-motion** | 2.3.3 | `SmoothScroll.tsx` | Smooth scroll runs regardless of OS accessibility setting. Should check `window.matchMedia('(prefers-reduced-motion: reduce)')` before initializing |

### High Priority

| # | Problem | WCAG Criterion | File | Details |
|---|---|---|---|---|
| A4 | **No skip-to-content link** | 2.4.1 | `layout.tsx` | No mechanism to skip navbar — keyboard users must tab through all nav links on every page load |
| A5 | **ProjectCard keyboard inaccessible** | 2.1.1 | `ProjectCard.tsx` | 3D tilt, hover links, and interactions are mouse-only — no keyboard alternative. Card cannot be focused or activated via keyboard |
| A6 | **Filter tabs not keyboard navigable** | 2.1.1 | `Projects.tsx` | Filter buttons receive focus (they're `<button>`) but there's no arrow-key navigation between them — tabbing through 5+ filters is poor UX |
| A7 | **Timeline has no semantic structure** | 1.3.1 | `Timeline.tsx` | Timeline events are plain `<div>` elements — should be `<ol>` with `<li>` items to convey ordered sequence to screen readers |
| A8 | **Typing animation is confusing to AT** | 1.3.1 | `Hero.tsx:L124-128` | The typing text (`{displayText}`) updates every 40-80ms — screen readers will attempt to read each character change. Should be wrapped in `aria-live="off"` and have a static `aria-label` for the full phrase |

### Medium Priority

| # | Problem | Details |
|---|---|---|
| A9 | **"All systems operational" contrast** | `text-emerald-500/50` on `#030712` — estimated contrast ratio ~2.1:1, fails WCAG AA (4.5:1 required for small text) |
| A10 | **Focus rings missing** | Navbar links, project cards, filter buttons — while they have hover styles, focus rings (`:focus-visible`) are not explicitly styled; browser default blue ring clashes with dark theme |
| A11 | **Icon-only buttons** | Navbar mobile toggle has `aria-label` ✓. Footer social icons have `aria-label` ✓. But ProjectCard GitHub/Live links have no `aria-label` |
| A12 | **Counter animations** | `Counter` component in About animates 0→N in 2s — screen readers will announce every intermediate number. Should use `aria-live="polite"` only for final value |
| A13 | **No heading hierarchy in sections** | Multiple sections (Stack, Projects, Timeline) have no `<h2>` — only a stylized `<span>` label. Heading outline is broken for AT users |
| A14 | **Color-only information** | Skill category colors (cyan=Security, indigo=Full-Stack) convey information through color alone — no text label in the category dot |

---

## 4. CODE INCONSISTENCIES

### Color System

| # | Problem | Locations |
|---|---|---|
| C1 | **Hardcoded hex values** | `global-error.tsx`: `#030712`, `#06b6d4` · `not-found.tsx`: hardcoded gradient hex · `Timeline.tsx:L114`: gradient uses hex instead of `var(--color-accent-*)` |
| C2 | **Inline style props for colors** | `Projects.tsx:L73`: `style={{ color: '#06b6d4' }}` — bypasses design system entirely |
| C3 | **CSS variables not used in globals.css** | `globals.css:L67-70`: `html, body { background: #030712; color: #f1f5f9 }` — uses raw hex instead of `var(--color-bg)` |
| C4 | **No `--ease-out-expo` variable defined** | Easing `[0.16, 1, 0.3, 1]` appears in at least 3 files as a raw array — not centralized |

### Component Duplication

| # | Problem | Files |
|---|---|---|
| C5 | **`GithubIcon` defined 3 times** | `Hero.tsx:L15-20` · `Contact.tsx:L8-13` · `Footer.tsx:L8-22` |
| C6 | **`LinkedinIcon` defined 2 times** | `Contact.tsx:L15-21` · `Footer.tsx:L24-39` |
| C7 | **`navLinks` array defined 2 times** | `Navbar.tsx:L9-16` · `Footer.tsx:L41-48` |
| C8 | **Typing animation logic duplicated** | `Hero.tsx:L49-72` · `Footer.tsx:L53-87` — same useEffect/setTimeout pattern with no shared abstraction |

### Spacing & Typography

| # | Problem | Details |
|---|---|---|
| C9 | **No consistent section header pattern** | About has a label only. Projects has a label only. Stack has a label + subtitle. Hero has its own unique layout. No shared `<SectionHeader>` component |
| C10 | **Section label inconsistency** | About: `// 02 ─ ABOUT` · Contact: `// 06 ─ OPEN TRANSMISSION` — "Open Transmission" is thematic but breaks the pattern; makes navigation by number unreliable |
| C11 | **Animation duration inconsistency** | `0.8s` (Navbar entrance), `0.5s` (card entries), `0.6s` (timeline), `1.5s` (timeout submission delay) — no shared duration scale |
| C12 | **No shared `easing` constants** | `[0.16, 1, 0.3, 1]` appears in Navbar, Hero, About — identical value, no shared constant |

### Missing Features (Production Gaps)

| # | Gap | Impact |
|---|---|---|
| G1 | **No `/api/contact` route** | Contact form does not send email — users think they contacted you but haven't |
| G2 | **No `robots.txt`** | Search engines have no guidance — may crawl unintended paths |
| G3 | **No `sitemap.xml`** | SEO impact — Google cannot discover pages efficiently |
| G4 | **No favicon configured** | `layout.tsx` metadata has no `icons` field — browser shows generic icon |
| G5 | **No Open Graph image** | OG image not generated — social shares show no preview image |
| G6 | **No error boundary** | `page.tsx` has no error boundary — GitHub API failure renders a blank page (or triggers global-error.tsx with no UX) |
| G7 | **No `vercel.json`** | No deployment config — headers, rewrites, function regions not configured |
| G8 | **`TerminalBoot.tsx` is an empty file** | `src/components/three/TerminalBoot.tsx` exists with 0 bytes — dead file should be deleted |
| G9 | **GITHUB_TOKEN not validated** | `github.ts` uses `process.env.GITHUB_TOKEN` but there's no warning when it's undefined (causes silent rate-limiting at 60 req/hr instead of 5000) |
| G10 | **No `prefers-color-scheme` handling** | Site is dark-only — no light mode support and no system preference detection |

---

## 5. RESPONSIVENESS GAPS

| Breakpoint | Issue |
|---|---|
| **320px** | Hero heading (`text-8xl` at lg) — verified: `text-5xl` at base is fine. But typing text at `text-xl` may wrap awkwardly at 320px. CTA buttons stack vertically (correct) |
| **375px** | About section: terminal window has `px-8 md:px-8` — on 375px the inner padding creates very little content width. Prose may feel cramped |
| **768px** | Timeline switches from mobile (single column, left-offset) to desktop (zigzag) — at exactly 768px the transition is abrupt |
| **1024-1280px** | Stack grid: `md:grid-cols-2 lg:grid-cols-3` — at 1024px the 2-column layout with 4 cards results in an orphaned card |
| **1920px+** | All sections use `max-w-7xl` (1280px) — fine, but hero heading at large screens could feel undersized relative to viewport |

---

## PRIORITIZED FIX LIST

### 🔴 Critical — Block Deployment
1. **[G1]** `/api/contact` route — form sends no email  
2. **[A1]** Form labels — WCAG violation  
3. **[P5]** prefers-reduced-motion — accessibility + legal risk  
4. **[A3]** Lenis ignores motion preference  

### 🟠 High Priority — Before Phase 2+
5. **[V9]** Navbar: rectangular → floating pill  
6. **[V1]** Hero: `min-h-screen` → `min-h-[100svh]`  
7. **[V17]** Projects: missing `<h2>` and intro  
8. **[V29]** Contact: fake submission  
9. **[P1]** Three.js: pause when off-screen  
10. **[C5–C8]** Deduplicate icons and navLinks  

### 🟡 Medium — Polish Pass
11. **[V26]** Timeline year: full year not 2-digit  
12. **[A4]** Skip-to-content link  
13. **[A8]** Typing animation aria handling  
14. **[A13]** Missing `<h2>` headings in sections  
15. **[C9]** Create shared `<SectionHeader>` component  
16. **[G8]** Delete empty `TerminalBoot.tsx`  

### 🟢 Low — Nice to Have
17. **[V3]** Cursor blink at 1Hz exactly  
18. **[G2, G3]** robots.txt + sitemap.xml  
19. **[G4]** Favicon  
20. **[G5]** Open Graph image  

---

## DESIGN SYSTEM DELTA (what globals.css is missing vs. spec)

```css
/* Currently missing from globals.css: */

/* Background raised scale */
--color-bg-raised: #0a0a14;
--color-bg-overlay: #14141f;
--color-bg-highest: #1f1f2e;

/* Border scale */
--border-subtle: rgba(255,255,255,0.06);
--border-default: rgba(255,255,255,0.10);
--border-accent: rgba(99,102,241,0.30);

/* Text faint */
--color-text-faint: #475569;

/* Semantic colors */
--color-success: #22c55e;
--color-warning: #f59e0b;
--color-danger: #ef4444;

/* Easing variables */
--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
--ease-out-quart: cubic-bezier(0.32, 0.72, 0, 1);

/* Duration scale */
--duration-instant: 150ms;
--duration-default: 250ms;
--duration-smooth: 400ms;
--duration-dramatic: 700ms;

/* Blur scale */
--blur-sm: 8px;
--blur-md: 16px;
--blur-lg: 24px;
--blur-xl: 40px;
```

---

*End of Phase 0 Audit. Ready to proceed to Phase 1 on approval.*
