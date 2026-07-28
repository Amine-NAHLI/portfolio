---
name: Tonal Sophistication
colors:
  surface: '#10141a'
  surface-dim: '#10141a'
  surface-bright: '#353940'
  surface-container-lowest: '#0a0e14'
  surface-container-low: '#181c22'
  surface-container: '#1c2026'
  surface-container-high: '#262a31'
  surface-container-highest: '#31353c'
  on-surface: '#dfe2eb'
  on-surface-variant: '#bac9cc'
  inverse-surface: '#dfe2eb'
  inverse-on-surface: '#2d3137'
  outline: '#849396'
  outline-variant: '#3b494c'
  surface-tint: '#00daf3'
  primary: '#c3f5ff'
  on-primary: '#00363d'
  primary-container: '#00e5ff'
  on-primary-container: '#00626e'
  inverse-primary: '#006875'
  secondary: '#7bd2f4'
  on-secondary: '#003544'
  secondary-container: '#007998'
  on-secondary-container: '#e7f7ff'
  tertiary: '#e5edfa'
  on-tertiary: '#29313a'
  tertiary-container: '#c9d1dd'
  on-tertiary-container: '#525a64'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#9cf0ff'
  primary-fixed-dim: '#00daf3'
  on-primary-fixed: '#001f24'
  on-primary-fixed-variant: '#004f58'
  secondary-fixed: '#baeaff'
  secondary-fixed-dim: '#7bd2f4'
  on-secondary-fixed: '#001f29'
  on-secondary-fixed-variant: '#004d62'
  tertiary-fixed: '#dbe3ef'
  tertiary-fixed-dim: '#bfc7d3'
  on-tertiary-fixed: '#141c25'
  on-tertiary-fixed-variant: '#404751'
  background: '#10141a'
  on-background: '#dfe2eb'
  surface-variant: '#31353c'
typography:
  headline-lg:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: '1.2'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
  container-max: 1280px
---

## Brand & Style

The design system is rooted in the concept of **Technical Elegance**. It bridges the gap between high-end architectural documentation and advanced digital interfaces. The brand personality is precise, intellectual, and intentionally atmospheric, avoiding the sterility of generic flat design in favor of rich, temperature-aware surfaces.

The design style is a hybrid of **Minimalism** and **Tactile Modernism**. It prioritizes heavy white space and structured layouts, but treats surfaces as physical materials—paper in the light mode and deep mineral glass in the dark mode. The goal is to evoke a sense of "quiet power," where the UI feels like a high-performance instrument rather than a consumer app.

Targeting an audience of specialists, engineers, and creators, the system emphasizes "ink-on-paper" readability and "bioluminescent" technical precision.

## Colors

This design system utilizes a temperature-shifted neutral palette to define its environment.

### Dark Theme: Deep Obsidian & Slate
The dark mode moves away from neutral gray into **Deep Indigo-Teal**.
- **Background**: `#0D1117`. A deep, desaturated midnight that provides infinite depth.
- **Surface**: `#161B22`. Shifted toward a cooler slate to provide structural separation through hue.
- **Accents**: **Mineral Cyan** (`#00E5FF`) serves as the high-energy focal point, supported by a **Bioluminescent Teal** (`#007A99`) for secondary interactions and depth-layering.

### Light Theme: Premium Architectural Paper
The light mode avoids pure white to reduce eye strain and feel more "physical."
- **Background**: `#FBF9F6` (Gallery White). A warm, sophisticated base.
- **Surface**: `#F5F2ED` (Architectural Vellum). A slightly deeper, clay-tinted tone for cards and secondary navigation.
- **Typography**: Ink-like deep charcoals rather than absolute black to maintain the editorial feel.

### Technical Charting Palette
A 6-color harmonious palette for data visualization: 
`#00E5FF` (Cyan), `#79C0FF` (Blue), `#D2A8FF` (Purple), `#FF7B72` (Coral), `#FFA657` (Amber), `#7EE787` (Green).

## Typography

The typography system follows a "Technical Editorial" hierarchy. 

**Headlines** use **Geist** for its clean, geometric precision and tight kerning, providing a contemporary, developer-tool aesthetic. **Body** text relies on **Inter** for its exceptional legibility and neutral systematic feel, ensuring long-form content remains readable. **Labels and Metadata** utilize **JetBrains Mono** to inject a sense of "source code" authenticity and mechanical precision.

- **Contrast**: In the light theme, use deep charcoal (`#1A1D21`) for primary text to simulate high-quality ink.
- **Rhythm**: Maintain tight line-heights for headlines to create visual impact, and generous line-heights (1.5-1.6) for body text to ensure a comfortable reading experience on vellum-like backgrounds.

## Layout & Spacing

This design system uses a **Fluid Grid** model with a strict 4px baseline rhythm.

- **Desktop**: A 12-column grid with 24px gutters. Large horizontal margins (64px) are used to create a "gallery" effect, framing content like an architectural plan.
- **Mobile**: A 4-column grid with 16px gutters and 20px margins. 
- **Spacing Philosophy**: Use generous padding inside containers to emphasize the "tonal richness" of the surfaces. Elements should feel uncrowded, allowing the subtle background gradients to breathe. 
- **Reflow**: On tablet transitions, columns should collapse from 12 to 8, with primary navigation moving from a sidebar to a bottom bar or top-collapsed menu to maximize content width.

## Elevation & Depth

Hierarchy is established through **Tonal Layering** and **Atmospheric Gradients** rather than aggressive shadows.

1.  **Background Atmosphere**: In dark mode, use extremely soft, low-opacity radial gradients (e.g., 2% opacity Cyan at 800px radius) positioned behind primary content blocks to create a sense of deep space.
2.  **Tonal Stacking**:
    - **Level 0 (Base)**: Primary background color.
    - **Level 1 (Cards/Panels)**: Surface color with a 1px low-contrast border (10% white in dark mode, 10% charcoal in light mode).
    - **Level 2 (Popovers/Modals)**: Surface color with a multi-layered, soft shadow.
3.  **Shadow Character**: Shadows are diffused and tinted. For dark mode, use a deep Indigo tint in the shadow; for light mode, use a warm Umber tint.
    - *Example Shadow*: `0px 10px 30px -5px rgba(0, 0, 0, 0.3), 0px 4px 10px -2px rgba(0, 0, 0, 0.1)`.

## Shapes

The shape language is **Soft and Structural**. 

A `0.25rem` (4px) base radius is applied to most components to maintain a "technical" feel while avoiding the harshness of sharp corners. This subtle rounding mimics the precision-machined edges of premium hardware.

- **Small Components (Buttons, Inputs)**: 4px radius.
- **Large Components (Cards, Modals)**: 8px (rounded-lg) to 12px (rounded-xl) radius.
- **Icons**: Use a 1.5pt or 2pt stroke weight with slightly rounded caps to match the typography's technical weight.

## Components

### Buttons
- **Primary**: Solid Mineral Cyan with dark slate text. No gradients.
- **Secondary**: Transparent background with a 1px border of the primary color.
- **Interaction**: On hover, buttons should have a "mechanical" shift—move 1px up with a slightly crisper shadow and a 10% brightness increase.

### Input Fields
- Use the "Vellum" or "Slate" surface color for the field background. 
- Understated 1px bottom border that glows Mineral Cyan on focus. 
- Labels use JetBrains Mono in all-caps, 12px.

### Cards
- No heavy borders. Use the tonal shift between the background and surface colors to define boundaries.
- Include a subtle 1px inner stroke (highlight) on the top edge to simulate light hitting a physical object.

### Chips & Tags
- Pill-shaped but with minimal vertical padding.
- Use the secondary "Bioluminescent" teal with low-opacity backgrounds (15%) for a muted, technical look.

### Lists
- Separated by thin, low-contrast "ink" lines.
- Hover states use a subtle horizontal slide (2px) and a change in background tint to the secondary surface color.