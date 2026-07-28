# Stitch redesign analysis — Amine Nahli Engineering Dossier

## Scope and source of truth

- Stitch project: `Amine Nahli Engineering Dossier` (`13734299867192170104`), private, desktop text-to-UI project.
- The canonical implementation reference is the project-level **Technical Editorial** system and asset `assets/7cc876741f5d44d1b9942df6a9a83e2e` (version 1). A second Technical Editorial asset, `assets/46d9b1f5035b47a58481d04338307849`, is an earlier/alternate dark variant and must not override the canonical values below.
- Stitch supplies design tokens, screen dimensions, screenshots for the major pages, and generated HTML download references. It does not expose runtime interaction specifications. Interaction and animation details below are therefore an implementation strategy consistent with its visual system, not a claim about generated runtime code.

## Screens analyzed

| Screen | ID | Reference value |
| --- | --- | --- |
| Home \| Amine Nahli Portfolio | `7c9dd10013dc4e3da2dc6ab76f8ae221` | Primary dark desktop reference; 2560 × 14962. |
| Home \| Amine Nahli (Ultra Premium) | `ba5f7e3833134a2da5a9669fc8f2e4ad` | Compact premium dark desktop variation; 2560 × 7610. |
| Home Light \| Amine Nahli Portfolio | `dd15e381877a47fcbb412cec32f5bc82` | Light desktop variation; 2560 × 8030. |
| Home Mobile \| Amine Nahli Portfolio | `37953ff69b624a99b662d0662cf3efc6` | Mobile composition reference; 780 × 8478 raster / 390px canvas instance. |
| Admin Dashboard \| System Control | `f3a1327adc184c34a4affd8783ebc3f9` | Administrative visual direction; 2560 × 3084. |
| Amine Nahli Monogram | `a791f60747ea4a9685b2783bbd164794` | Brand mark reference; 1024 × 1024. |
| Shader | `62e1416235964ec1b3db76140106cf81` | Supporting shader artifact; 512 × 512. |
| Shader | `4dc9448bbdfa45039720c5329140ebf1` | Second supporting shader artifact; 512 × 512. |
| Three.js | `df57b1ac24e64d2d8ccd9990ec20f409` | Supporting graphics/interaction artifact; 512 × 512. |

The three supporting generated-code screens are useful as an intent signal for an ambient visual layer. They do not include screenshots in the Stitch response, so they must not be treated as a requirement for a heavy WebGL/Three.js implementation.

## Extracted design system

### Visual language

Technical Editorial is a calm, high-end engineering dossier: asymmetric editorial composition, disciplined whitespace, technical annotations, coordinate-like labels, hairline connection rules, and restrained glass surfaces. It deliberately avoids conventional elevated cards and heavy shadows. The desired feeling is an accurate instrument or architectural journal rather than a generic SaaS dashboard.

### Typography

| Role | Font | Size / leading / weight |
| --- | --- | --- |
| Display desktop | Space Grotesk | 72px / 1.1 / 700 / -0.02em |
| Display mobile | Space Grotesk | 40px / 1.2 / 700 |
| Section headline | Space Grotesk | 32px / 1.3 / 600 |
| Body large | Geist | 18px / 1.6 / 400 |
| Body | Geist | 16px / 1.5 / 400 |
| Caption | Geist | 14px / 1.4 / 400 |
| System label | JetBrains Mono | 12px / 1.2 / 500 / 0.1em |

Use Space Grotesk only for hierarchy; keep long reading in Geist; reserve JetBrains Mono for metadata, coordinates, tags, project indices, status, and numeric values. Do not use the mono face for paragraphs.

### Canonical dark theme

| Token | Value | Intended use |
| --- | --- | --- |
| Background / surface | `#121416` | Application canvas and base surface |
| Surface lowest | `#0c0e10` | Deep recesses / code / graphic field |
| Surface low | `#1a1c1e` | Subtle section surface |
| Surface container | `#1e2022` | Cards, panels, data rows |
| Surface high / highest | `#282a2c` / `#333537` | Hover or raised layer |
| Primary | `#c3f5ff` | Cyan foreground / soft emphasis |
| Primary container | `#00e5ff` | Primary actions and active indicators |
| Primary fixed dim | `#00daf3` | Focus glow and active accents |
| Secondary | `#ffd799` | Amber foreground / technical emphasis |
| Secondary container | `#feb300` | Sparse amber labels or annotation markers |
| Text primary | `#e2e2e5` | Heading and high-emphasis text |
| Text secondary | `#bac9cc` | Body and supporting text |
| Outline / outline variant | `#849396` / `#3b494c` | Hairlines, rules and inactive borders |
| Error | `#ffb4ab` | Error foreground |

Dark layers: use `#121416` as the canvas; use a 1px `rgb(255 255 255 / 0.06–0.10)` or outline-variant hairline; use translucent surface layers with 12–20px blur only where a panel overlaps moving/background content. Cyan is an active signal, not a decorative wash. Amber is rarer still.

### Final light theme

Stitch provides a named light desktop screen, but no independent light token asset. These are the implementation tokens to keep the same editorial system while meeting contrast requirements; they are not presented as a pixel-extracted color palette from the inaccessible raster.

| Token | Value | Intended use |
| --- | --- | --- |
| Background | `#f7f9f9` | Canvas |
| Surface / lowest | `#ffffff` / `#f1f4f4` | Panels / recessed regions |
| Surface high | `#e6ebeb` | Hover and dense data strips |
| Text primary / secondary | `#182022` / `#4b5a5e` | High and normal emphasis |
| Outline / subtle outline | `#809094` / `#c8d1d3` | Rules and inactive borders |
| Cyan action / hover | `#007c88` / `#006a74` | Accessible primary action states |
| Cyan tint | `#c9f4f6` | Non-text active surface |
| Amber action / tint | `#985d00` / `#ffe3b0` | Sparse technical annotations |
| Error | `#b3261e` | Error foreground |

Light mode is not a simple color inversion: retain hairlines, sharp editorial rhythm, off-white canvas, near-black text, and low-contrast cyan glass. Avoid pale cyan text on white.

### Spacing, shape, and layout

- Base unit: 4px; compose gaps as 4, 8, 12, 16, 24, 32, 48, 64, 96, 160.
- Canonical gutters: 32px desktop; 24px mobile. Current 80px desktop outer margin is a valid maximum-width composition choice and should become fluid rather than fixed.
- Major editorial section rhythm: 120–160px desktop; 72–96px tablet; 56–72px mobile.
- Desktop: a 12-column fluid grid. Use intentional asymmetry: a 7-column visual or project field with a 3-column narrative/metadata field, leaving annotation space rather than filling every column.
- Mobile: 4-column grid; stack all asymmetrical layouts in document order; no horizontal pinned annotation rail.
- Default control radius: 4px. Use 0–2px for technical chips and dividers, 6–8px only for practical drawers/dialogs; remove the current pill-first language.
- Borders: 0.5–1px, not shadows. Do not use large rounded 16–24px cards as the default.

### Components and content patterns

- **Navigation:** thin, floating/sticky glass header; monogram at the left; compact technical nav; active location shown through an underline, indexed marker, or quiet surface—not a filled pill.
- **Hero:** oversized display type, mono identity/status line, clear primary/secondary actions, asymmetric negative space, hairline geometry, and a purely decorative ambient field. The hero should be readable and useful without any background effect.
- **System labels:** uppercase/letter-spaced mono text for page indices, coordinates, dates, technology tags, and status. They are semantic supplementary information, not the only carrier of meaning.
- **Project entries:** frameless system-map units with a media/visual field, project index, architectural summary, technologies, and a directional link. On desktop they may alternate alignment; on mobile they remain a single vertical narrative.
- **Cards:** replace generic gradient cards with `TechnicalFrame` patterns: transparent or tonal surface, hairline rule, 4px radius, optional corner coordinates/nodes, and stronger border on hover/focus. Dense admin cards can retain a modest surface fill for scanability.
- **Inputs:** low-contrast field or underline at rest, clear 2px cyan focus ring plus a frame at focus. Keep labels visible; placeholders never replace labels.
- **Tables and admin:** monochrome, high-density tables with mono header labels, subtle zebra/row hover, outlined action controls, and clear semantic status colors. Preserve existing protected routes and data operations.
- **Monogram:** use the Stitch mark as the basis for a compact, accessible `AN` brand mark; keep a text alternative in the accessible name.

## Interaction, animation, background, and shader strategy

### Recommendation: CSS first; do not add Motion or Framer Motion

The codebase already uses Tailwind/CSS transitions, has a global `prefers-reduced-motion` safeguard, and deliberately has no animation dependency. CSS transitions and keyframes are lighter, server-component friendly, and fully adequate for this dossier. Framer Motion would add client JavaScript and hydration for effects that do not need gesture physics or layout animation.

Use a small client component only where JavaScript is intrinsically needed: persisted theme preference and, optionally, a CSS custom-property update for a pointer-reactive ambient glow. No animation library and no Three.js dependency are recommended for the first redesign.

### Animation policy

- Use opacity, transform, border-color, color, and background-color only; never animate layout properties, box-shadow, filters, width, height, or large background images.
- Standard transition: 160–220ms, `cubic-bezier(0.16, 1, 0.3, 1)`. Use 280–360ms only for a mobile drawer or a large but low-frequency reveal.
- Use a single low-amplitude CSS keyframe for an optional ambient gradient drift; pause it when reduced motion is requested and on non-hover/touch-first devices if it consumes meaningful paint time.
- Prefer native `scroll-behavior`, `:focus-visible`, and CSS transitions. Do not add scroll-linked JavaScript. If content reveals are later desired, use a tiny `IntersectionObserver` that adds a class once, with content visible by default and no motion under `prefers-reduced-motion`.

### Hover, keyboard, and pointer behavior

- Desktop project frames: border opacity increases, inner surface brightens slightly, directional icon translates 2px. Never make a link discoverable only through hover.
- Buttons: cyan fill changes by color only plus a 1px translate on active; keep target size at least 44 × 44px.
- Header and nav: underline/marker transition, no shifting layout.
- Pointer glow: optional, decorative-only CSS radial gradient driven by throttled `pointermove` into CSS variables; disable for coarse pointers, reduced motion, and when `saveData` is true. It must use `pointer-events: none` and never block text contrast.
- Mouse/parallax: do not implement parallax. It harms motion-sensitive users and does not justify its paint/input cost.

### Background effects

- Retain and refine the existing faint grid into a tokenized technical grid plus radial cyan glow.
- Use at most two pseudo-elements or fixed decorative layers per page, `aria-hidden`, with static fallbacks.
- Do not ship a 3D canvas in the initial redesign. The Stitch Shader/Three.js screens are inspiration for a later, optional, dynamically imported enhancement only after measuring mobile and low-end-device performance.

## Responsive rules

| Breakpoint | Rule |
| --- | --- |
| 320–479px | One column; 20–24px page gutters; 40px display; nav via existing accessible dialog; no pointer glow; controls remain 44px minimum. |
| 480–767px | Four-column composition; stacked project visual/narrative; 24px gutters; compact metadata wraps before overflowing. |
| 768–1023px | Two-column internal layouts only where text remains at least 45–70 characters wide; 32px gutters; header may still use a menu. |
| 1024–1279px | Desktop grid begins; asymmetric layouts may use 7/5 or 8/4 spans; preserve 48px minimum outer margin. |
| 1280px+ | Full 12-column editorial layout; 64–80px fluid margins; large negative space and annotation rails are allowed. |

Use CSS Grid, `minmax(0, …)`, `clamp()`, and logical properties. Do not duplicate desktop/mobile markup for visual-only changes. Preserve the existing no-horizontal-overflow test range from 320px through 1920px.

## Mapping to the current Next.js application

### Architecture compatibility

The existing implementation is a good foundation: Next.js 15 App Router, React 19, TypeScript, Tailwind 4, server-rendered public routes, local client state only for filters/navigation/forms, and existing bilingual and accessibility testing. Content comes from server data/fallback content and should stay unchanged. The redesign is a presentation-layer migration; it must not touch Supabase, authentication, APIs, contact submission, Groq/Resend integration, or admin data logic.

| Existing implementation | Stitch mapping / change |
| --- | --- |
| `src/app/globals.css` tokens and component classes | Replace the teal/rounded product-style tokens with Technical Editorial dark/light token layers, 4px radii, hairlines, grid/ambient utilities, and reduced-motion-safe effects. |
| `SiteHeader` / `SiteFooter` | Convert to monogram-led, editorial navigation and technical footer. Keep locale switching, resume, search, dialog behavior, analytics attributes, and accessible names. |
| Home page | Recompose into the primary dark dossier: hero, proof/status rail, asymmetric featured projects, expertise map, certification/testimonial evidence, and contact CTA. Preserve data and links. |
| `ProjectSummaryCard` / `ProjectExplorer` | Turn generic rounded cards and filters into framed project records and compact technical controls. Preserve search, sorting, category logic, live result status, and links. |
| Project detail | Use an indexed case-study/article layout with hairline dividers and a sticky technical metadata rail. Preserve JSON-LD and project data. |
| Journey, skills, certification, contact, search pages | Apply the same grid, section-index, technical-frame, form, and list primitives; retain all current route behavior. |
| `AdminShell`, dashboard, workspace | Apply the System Control visual language only. Preserve authentication checks, server actions, resource API calls, editors, dialogs, tables, and moderation logic. |
| `LocaleDocumentAttributes` | Extend it to apply a stored/system theme without an initial visible flash; do not affect locale behavior. |
| `next.config.ts` | Keep CSP as-is unless a locally hosted font or optional same-origin asset requires a narrowly scoped update. No third-party font CDN or remote shader host is needed. |

## Accessibility requirements

- Maintain the existing skip links, visible `:focus-visible` style, semantic headings, labels, native dialog behavior, keyboard-close behavior, and `aria-live` project result count.
- Meet WCAG 2.2 AA text contrast in both themes; validate cyan and amber text separately because decorative values are not always text-safe.
- Keep all information conveyed by cyan/amber also in text, shape, position, or icon; status never relies on color alone.
- Preserve 44 × 44px interactive targets, dialog focus management, and mobile keyboard navigation.
- Respect `prefers-reduced-motion` globally and remove pointer/ambient animation under that preference. Do not auto-play WebGL/canvas visuals.
- Decorative grids, monograms, connection lines, and ambient glows must be `aria-hidden`/CSS decoration. Functional images need meaningful alternative text.
- Ensure the light-theme switch has a clear accessible label and state. Theme choice must not be the only way to achieve readable contrast.

## Performance requirements

- Preserve server components for public pages; do not turn page-level routes into client components for decorative effects.
- Font-load only the three required families/weights, use `next/font` or locally bundled font assets, and set stable fallbacks to avoid layout shift.
- Keep background work in CSS. No default Three.js, WebGL, canvas, or large video/image hero.
- If a future enhancement is approved, load it with `next/dynamic`, only after user activation or an idle/eligible pointer check, and do not render it on reduced-motion/coarse-pointer paths.
- Animate compositor-friendly properties only. Use `will-change` briefly and locally, never on an entire page or card grid.
- Keep CSS effects to a small number of pseudo-elements and avoid broad `backdrop-filter` coverage on mobile. Glass belongs to the header, dialogs, and occasional overlays—not every card.
- Preserve direct imports, parallel server fetching already present in the home page, and the existing Playwright/Axe/Lighthouse quality gates.

## Implementation plan

1. Introduce canonical dark/light CSS tokens, font loading, shape/border primitives, and static background utilities; retain accessibility defaults and add theme persistence without a flash.
2. Rebuild shared visual primitives (`Container`, buttons, badges, page/section intros, technical frame) and migrate header/footer while keeping all routing, locale, search, and resume behavior.
3. Recompose the public home, projects, project-detail, journey, skills, certifications, search, and contact presentations around the editorial grid; do not change data queries or content models.
4. Restyle the protected admin shell, dashboard, workspace tables, and dialogs as System Control without changing authentication, server actions, API calls, form submission, or moderation behavior.
5. Add CSS-only hover/focus effects and optional guarded pointer ambience. Do not add Framer Motion, Motion, or Three.js.
6. Update social image colors and expand existing Playwright/Axe coverage to test both themes, reduced motion, theme control, keyboard navigation, and the current responsive-width suite; run type check, lint, E2E accessibility, and Lighthouse before acceptance.

## Exact files for the implementation phase

### Modify

- `src/app/layout.tsx`
- `src/app/globals.css`
- `src/app/[locale]/layout.tsx`
- `src/components/layout/LocaleDocumentAttributes.tsx`
- `src/components/layout/SiteHeader.tsx`
- `src/components/layout/SiteFooter.tsx`
- `src/components/ui/Container.tsx`
- `src/components/ui/ButtonLink.tsx`
- `src/components/ui/Badge.tsx`
- `src/components/ui/PageIntro.tsx`
- `src/components/ui/SectionHeading.tsx`
- `src/components/projects/ProjectSummaryCard.tsx`
- `src/components/projects/ProjectExplorer.tsx`
- `src/app/[locale]/page.tsx`
- `src/app/[locale]/projects/page.tsx`
- `src/app/[locale]/projects/[slug]/page.tsx`
- `src/app/[locale]/journey/page.tsx`
- `src/app/[locale]/skills/page.tsx`
- `src/app/[locale]/certifications/page.tsx`
- `src/app/[locale]/contact/page.tsx`
- `src/app/[locale]/search/page.tsx`
- `src/components/contact/ContactForm.tsx`
- `src/components/search/GlobalSearch.tsx`
- `src/components/admin/AdminShell.tsx`
- `src/components/admin/AdminWorkspace.tsx`
- `src/app/admin/(protected)/dashboard/page.tsx`
- `src/app/[locale]/opengraph-image.tsx`
- `tests/e2e/accessibility.spec.ts`
- `tests/e2e/public-journeys.spec.ts`

### Add

- `src/components/layout/ThemeToggle.tsx` — small client control for explicit light/dark choice and persisted preference.
- `src/components/ui/TechnicalFrame.tsx` — shared presentational frame for hairline cards, indexed sections, and technical annotations.

No files in `src/app/api`, `src/lib/supabase`, `src/lib/auth`, `src/features/contact`, `src/features/projects`, `src/features/portfolio`, `supabase`, or email/Groq/Resend integrations are to be changed for this redesign.

## Readiness

Yes. Stitch provides enough information to begin the redesign: the final design-system tokens, type scale, layout rules, primary dark/light/mobile/admin references, and supporting visual intent are all available. A pixel-identical recreation of the three shader/Three.js artifacts would require their generated assets to be previewed separately, but that is not required for the recommended CSS-first, accessible, high-performance redesign.
