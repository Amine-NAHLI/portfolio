---
name: Technical Editorial
colors:
  surface: '#0d1516'
  surface-dim: '#0d1516'
  surface-bright: '#333a3c'
  surface-container-lowest: '#080f11'
  surface-container-low: '#151d1e'
  surface-container: '#192122'
  surface-container-high: '#242b2d'
  surface-container-highest: '#2e3638'
  on-surface: '#dce4e5'
  on-surface-variant: '#bac9cc'
  inverse-surface: '#dce4e5'
  inverse-on-surface: '#2a3233'
  outline: '#849396'
  outline-variant: '#3b494c'
  surface-tint: '#00daf3'
  primary: '#c3f5ff'
  on-primary: '#00363d'
  primary-container: '#00e5ff'
  on-primary-container: '#00626e'
  inverse-primary: '#006875'
  secondary: '#ffd799'
  on-secondary: '#432c00'
  secondary-container: '#feb300'
  on-secondary-container: '#6a4800'
  tertiary: '#ffeac0'
  on-tertiary: '#3e2e00'
  tertiary-container: '#fec931'
  on-tertiary-container: '#6f5500'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#9cf0ff'
  primary-fixed-dim: '#00daf3'
  on-primary-fixed: '#001f24'
  on-primary-fixed-variant: '#004f58'
  secondary-fixed: '#ffdeac'
  secondary-fixed-dim: '#ffba38'
  on-secondary-fixed: '#281900'
  on-secondary-fixed-variant: '#604100'
  tertiary-fixed: '#ffdf96'
  tertiary-fixed-dim: '#f3bf26'
  on-tertiary-fixed: '#251a00'
  on-tertiary-fixed-variant: '#594400'
  background: '#0d1516'
  on-background: '#dce4e5'
  surface-variant: '#2e3638'
typography:
  display:
    fontFamily: Space Grotesk
    fontSize: 64px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 20px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: '0'
  body-md:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: '0'
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
  gutter: 24px
  margin: 32px
---

## Brand & Style
The design system embodies a high-fidelity "Technical Editorial" aesthetic, merging the precision of developer tools with the sophisticated layout of modern architectural journals. It targets a highly literate, technical audience that values information density without sacrificing clarity or aesthetic polish.

The style is a hybrid of **Minimalism** and **Glassmorphism**, characterized by a strict structural grid, expansive whitespace, and light-reactive surfaces. The emotional response is one of "calm authority"—the interface feels like an expensive, well-calibrated instrument. High-performance utility is conveyed through ultra-thin linework and sharp typographic hierarchies.

## Colors
The palette is engineered for high-performance reading environments.

**Dark Mode (Primary):** The "Deep Graphite" foundation provides a low-strain background for prolonged technical work. Surfaces use "Mineral Cyan" for primary actions, creating a luminous, holographic effect against the dark base. "Technical Amber" is reserved strictly for high-priority semantic warnings to maintain color economy.

**Light Mode:** Designed for high-clarity architectural viewing. It replaces pure white with a "Gray-White" to reduce glare. Borders are crisp and structural, while the cyan is deepened to ensure AAA accessibility on light backgrounds.

**State Tokens:**
- **Focus:** A glowing 2px outer stroke using the Primary Accent with 40% opacity.
- **Loading:** A shimmering skeleton state utilizing a linear gradient moving from surface color to `semantic.loading`.

## Typography
The typographic system relies on the tension between the geometric, technical character of **Space Grotesk** and the neutral, systematic clarity of **Inter**. 

Headlines must utilize tight tracking (negative letter-spacing) to create a "locked-in" editorial feel. Body text is optimized for legibility with generous line heights. Use `label-sm` for metadata and technical specs, always in uppercase with slight tracking increases to evoke a blueprint or schematic feel.

## Layout & Spacing
The layout follows a strict **12-column fluid grid** for desktop and a **4-column grid** for mobile. The spacing rhythm is strictly derived from a 4px/8px base scale to ensure mathematical alignment.

Internal component padding should favor the horizontal axis to emphasize the "editorial" flow. High-level layout sections should be separated by `xl` (48px) spacing to allow the design to breathe, reinforcing the premium, minimalist aesthetic.

## Elevation & Depth
Depth is conveyed through **Glassmorphism** and ultra-fine linework rather than traditional shadows.

1.  **Surfaces:** Use backdrop blurs (12px - 20px) on semi-transparent panels to create a sense of layered glass. 
2.  **Borders:** All containers and interactive elements use an **0.5px hair-line border**. In dark mode, this is a light-gray at 8% opacity; in light mode, it is a crisp slate.
3.  **Z-Axis:** Instead of heavy shadows, higher elevation levels are indicated by a slightly lighter surface fill and a subtle increase in border opacity.

## Shapes
This design system utilizes **Soft** roundedness (0.25rem / 4px) to maintain a disciplined, architectural feel. This slight softening prevents the UI from feeling "aggressive" or purely "brutalist" while remaining much sharper than consumer-grade apps. Pills (fully rounded) are reserved strictly for status indicators (Success/Loading) and never for primary structural containers.

## Components
- **Buttons:** Primary buttons use a solid Mineral Cyan fill with black text in dark mode. Secondary buttons use the 0.5px border and a subtle background hover tint.
- **Input Fields:** Use a 0.5px bottom-border only by default, transitioning to a full 0.5px frame on focus. Backgrounds should be 2% lighter than the parent surface.
- **Cards:** No shadows. Use 0.5px borders and a subtle 4px corner radius. For "hover" states, increase the border opacity and apply a very slight backdrop brightness shift.
- **Chips:** Small, rectangular with `rounded-sm`. Used for technical tags. Backgrounds should be low-contrast (Surface + 5%).
- **Lists:** Separated by 0.5px horizontal rules. Use `label-sm` for list headers to maintain the "editorial index" look.
- **Success/Focus States:** Success states use a vibrant green micro-border. Focus states must be highly visible, utilizing a cyan glow that feels like a backlit display.