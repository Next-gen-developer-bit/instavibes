# 🎨 Design Document

## InstaVibes — UI/UX Design Specification

---

> **Version:** 1.0  
> **Date:** October 16, 2026  
> **Status:** Draft  
> **Author:** InstaVibes Design Team

---

## 1. Design Philosophy

InstaVibes follows a **clean, modern, premium SaaS aesthetic** inspired directly by AlgroHack. The design prioritizes:

- **Clarity** — Every element serves a purpose. No visual noise.
- **Warmth** — Warm coral/orange accents create energy and urgency without feeling corporate.
- **Trust** — Clean typography, generous whitespace, and social proof build confidence.
- **Delight** — Micro-animations and glassmorphism effects create a premium feel.

The landing page uses a **light theme** (warm white background) with vivid coral/orange accent colors. The dashboard can extend to a **dark theme** option for long working sessions.

---

## 2. Color System

### 2.1 Marketing Site (Light Theme)

```css
:root {
  /* Background */
  --background: #FAFAF9;           /* Warm off-white */
  --surface: #F5F5F3;              /* Slightly darker surface for cards */

  /* Text */
  --text: #121211;                 /* Near-black, warm undertone */
  --muted: #51515A;                /* Secondary/body text */

  /* Accents */
  --accent: #FF5A4E;               /* Coral red — primary accent */
  --accent-2: #FF8C42;             /* Warm orange — secondary accent */
  
  /* Gradient Accents */
  --gradient-accent: linear-gradient(135deg, #FF5A4E 0%, #FF8C42 100%);

  /* Borders */
  --border: rgba(0, 0, 0, 0.08);  /* Subtle hairline borders */
  --border-hover: rgba(0, 0, 0, 0.16);

  /* Buttons */
  --button: #121211;               /* Dark button background */
  --button-text: #FFFFFF;

  /* Status */
  --success: #10B981;              /* Emerald green */
  --warning: #F59E0B;              /* Amber */
  --error: #EF4444;                /* Red */
}
```

### 2.2 Dashboard (Dark Theme Option)

```css
[data-theme="dark"] {
  --background: #09090B;
  --surface: #18181B;
  --text: #FAFAFA;
  --muted: #A1A1AA;
  --border: rgba(255, 255, 255, 0.08);
  --border-hover: rgba(255, 255, 255, 0.16);
  --button: #FAFAFA;
  --button-text: #09090B;
}
```

### 2.3 Glow Effects

```css
.glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  pointer-events: none;
  z-index: 0;
}

.glow-coral {
  background: radial-gradient(circle, rgba(255, 90, 78, 0.35) 0%, transparent 70%);
}

.glow-orange {
  background: radial-gradient(circle, rgba(255, 140, 66, 0.25) 0%, transparent 70%);
}
```

---

## 3. Typography

### 3.1 Font Family

| Usage | Font | Weight | Fallback |
|-------|------|--------|----------|
| **Primary** | Geist Sans (Variable) | 400–700 | system-ui, -apple-system, sans-serif |
| **Monospace** | Geist Mono | 400–500 | ui-monospace, monospace |

Geist Sans is loaded as a variable font via `next/font/local` for optimal performance.

### 3.2 Type Scale

| Element | Size | Weight | Line Height | Tracking |
|---------|------|--------|-------------|----------|
| Hero Title (Desktop) | `clamp(48px, 8vw, 80px)` | 600 (Semibold) | 0.965 | -0.02em (tight) |
| Hero Title (Mobile) | `clamp(36px, 8vw, 48px)` | 600 | 0.965 | -0.02em |
| Section Heading (H2) | 48px / 40px mobile | 600 | 1.05 | -0.02em |
| Card Heading (H3) | 24px / 20px mobile | 600 | 1.0 | -0.02em |
| Body Text | 18px / 15px mobile | 400 | 1.6 | normal |
| Caption / Small | 14px | 500 | 1.5 | normal |
| Badge Text | 12px–13px | 600 | 1.2 | 0.05em (wide) |
| Button Text | 15px | 600 | 1.0 | normal |
| Nav Links | 14px | 500 | 1.0 | normal |

### 3.3 Special Typography Treatments

- **Hero "Instagram audience"** — Italic style for emphasis.
- **Step Numbers (01, 02, 03, 04)** — Extrabold, gradient text (`bg-clip-text`, coral→orange gradient).
- **Price Display** — 60px, semibold, tabular numerals for alignment.
- **Strikethrough Prices** — `line-through` with muted color.

---

## 4. Layout System

### 4.1 Grid & Spacing

| Property | Value |
|----------|-------|
| **Max Content Width** | 1152px (`max-w-6xl`) |
| **Page Padding** | 24px (mobile), 24px (desktop) |
| **Section Spacing** | 56px (mobile), 112px (desktop) vertical padding |
| **Card Gap** | 24px |
| **Base Spacing Unit** | 4px (Tailwind default) |

### 4.2 Responsive Breakpoints

| Breakpoint | Width | Description |
|------------|-------|-------------|
| `sm` | ≥640px | Small tablets |
| `md` | ≥768px | Tablets |
| `lg` | ≥1024px | Laptops |
| `xl` | ≥1280px | Desktops |
| `2xl` | ≥1536px | Large screens |

### 4.3 Features Grid Layout

The features section uses a **bento grid**:

```
Desktop (lg):
┌───────────────┬───────────────┐
│   3 cols      │   3 cols      │  Row 1: Two large cards
├─────┬─────┬───┴───────────────┤
│2col │2col │     2 cols        │  Row 2: Three medium cards
└─────┴─────┴───────────────────┘

Mobile:
┌───────────────────────────────┐
│         Full width            │  All cards stack vertically
└───────────────────────────────┘
```

---

## 5. Component Design Specifications

### 5.1 Launch Offer Bar

```
┌─────────────────────────────────────────────────────────────────┐
│ ● Launch offer is live: $20 → $10/mo · --d --h --m --s  Claim ›│
└─────────────────────────────────────────────────────────────────┘
```

- Height: 40px
- Background: `white/45` with `backdrop-blur-md`, bottom border `white/60`
- Pulsing dot: `animate-pulse` coral accent
- Entire bar is a clickable link to `#pricing`
- Countdown uses `tabular-nums` for stable layout

### 5.2 Navigation Bar

```
┌─────────────────────────────────────────────────────────────────┐
│ [Logo]                How it works  Features  Pricing  FAQ  [Login] │
└─────────────────────────────────────────────────────────────────┘
```

- Position: `fixed`, `z-50`
- Background: Transparent initially, glass-morphism on scroll (`backdrop-blur`, semi-transparent white)
- The nav uses a "liquid glass distortion" SVG filter effect on scroll
- Logo: Height 48px, auto width
- Login: Pill button (rounded-full, border, ghost style)
- Mobile: Hamburger menu icon, slides out full-screen nav

### 5.3 Hero Section

```
                     [New] Idea → hook → script from any viral reel

              Grow and monetize your
                Instagram audience, fast

     instavibes learns how you talk, turns any viral reel into
     your next script, and writes it in English, Hindi, or Hinglish.

                   [ Try free for 3 days ]

     ┌─────────────────────────┐
     │                         │   ← Phone mockup (9:16)
     │    Video Auto-playing   │      with glassmorphism border
     │                         │
     │                         │   [IG 1.1M views, 16.6K likes] ← Floating cards
     │                         │   [YT 300K views, 3.4K likes]
     │                         │   [FB 97K views, 7.8K likes]
     └─────────────────────────┘

            50M+ views, 10M+ likes and counting
```

- Background: Hero image (`hero-back.webp`) with gradient overlay (white/5 → white/20 → white)
- Glow effects: Coral center-top, orange right
- Badge: Rounded-full, `bg-surface`, with "New" tag (coral accent background)
- CTA button: Rounded-full, `bg-button` (dark), white text, hover opacity
- Phone mockup: `aspect-9/16`, max-w-80, rounded-4xl, glassmorphism border, auto-playing muted video
- Floating metric cards: Glassmorphism (white/90, backdrop-blur), platform icons (IG pink, YT red, FB blue), positioned absolutely on desktop, flex-wrap on mobile
- Entrance animations: `opacity: 0; transform: translateY(24px)` → animated in with stagger

### 5.4 How It Works Cards

```
    ┌────────────┐                    ┌────────────┐
    │    ⚗️       │  ╌╌╌╌╌╌╌╌╌╌╌╌╌▶  │    ⚗️       │
    │  ┌────────┐ │                    │  ┌────────┐ │
    │  │ 01     │ │                    │  │ 02     │ │
    │  │ Enter  │ │                    │  │ Get    │ │
    │  │ your IG│ │                    │  │ ideas  │ │
    │  │ link   │ │                    │  │ & scrip│ │
    │  └────────┘ │                    │  └────────┘ │
    └────────────┘                    └────────────┘
         rotate(6°)                      rotate(-6°)
```

- Cards: `rounded-[25px]`, white background, `p-2`, shadow
- Inner card: `rounded-[15px]`, colored border, colored background tint (`bg-accent/8`)
- Step numbers: `text-4xl font-extrabold`, gradient text
- Alternating rotation: ±6° on desktop
- Connected by dashed SVG path (`stroke-dasharray: 8 6`)
- Hover: `scale(1.05)` with z-index boost
- Desktop: Absolutely positioned in zigzag pattern
- Mobile: Vertical stack, no rotation

### 5.5 Feature Cards

- Container: `rounded-3xl`, `bg-surface`, hairline border, subtle shadow
- Image area: Top portion, aspect ratio 16:10 (large) or 4:3 (medium), `object-cover`
- Content area: `p-8 pt-6`
- Title: 24px semibold
- Description: 14px muted, relaxed line-height

### 5.6 Pricing Card

```
┌──────────────────┬──────────────────────┐
│  DARK PANEL       │  WHITE PANEL          │
│                   │                       │
│  instavibes pro   │  All tools included   │
│  [Founder deal]   │                       │
│                   │  ✦ AI Persona & Voice │
│  $20 (struck)     │    ✓ Replicates voice │
│  $10 /month       │    ✓ Tuneable profile │
│                   │                       │
│  Billed monthly   │  ✦ Script Studio      │
│  Cancel anytime   │    ✓ Multi-platform   │
│                   │    ✓ Viral scripts    │
│  [Start trial]    │                       │
│  Zero risk        │  ✦ Outlier Radar      │
│  for 3 days       │    ✓ Niche feed       │
│                   │    ✓ Creator alerts   │
│                   │                       │
│                   │  ✦ Workflow & Vault   │
│                   │    ✓ Content calendar │
│                   │    ✓ Asset library    │
│                   │                       │
│                   │  🌐 English, Hindi,   │
│                   │     Hinglish          │
└──────────────────┴──────────────────────┘
```

- Outer container: `rounded-[28px]`, white bg, large shadow
- Left panel: `bg-button` (dark), radial gradient accent glow, white text
- Price animation: `opacity: 0; transform: translateY(8px)` → revealed
- Right panel: 2-column grid of feature categories
- Feature icons: 28px rounded-lg, `bg-accent/10`, accent icon
- Check marks: Small accent-colored check icons
- Billing toggle: Rounded-full pill with active state

### 5.7 FAQ Accordion

```
┌─────────────────────────────────────────────────────┐
│ What is InstaVibes, exactly?                    [+] │
├─────────────────────────────────────────────────────┤
│ A content engine for creators...                    │
└─────────────────────────────────────────────────────┘
```

- Container: `rounded-2xl`, `bg-surface`, hairline border
- Question: 16px semibold, full-width button
- Toggle icon: "+" that rotates 45° (to "×") when expanded
- Answer: 14px muted, relaxed line-height
- Animation: `grid-rows-[0fr]` → `grid-rows-[1fr]` with cubic-bezier easing

### 5.8 Footer

```
┌─────────────────────────────────────────────────────┐
│ [Logo]                              [IG] [YT] [LI] [X] │
│ Your content, in your voice.                         │
│─────────────────────────────────────────────────────│
│ © 2026 instavibes. All rights reserved.              │
│ Free tools · Terms · Privacy · Refunds · Contact     │
└─────────────────────────────────────────────────────┘
```

- Social icons: 36px circles, hairline border, white bg, hover: darker border + text color
- Links: 12px font-semibold, muted color, hover → text color
- Divider: Top border, `border-border`

---

## 6. Interactive Elements & Micro-Animations

### 6.1 Entrance Animations

All sections use a staggered fade-in-up pattern:

```css
/* Initial state (set inline) */
.animate-enter {
  opacity: 0;
  transform: translateY(24px);
}

/* Animated state (via Framer Motion / Intersection Observer) */
.animate-enter.visible {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
```

- Trigger: Intersection Observer at 10% threshold
- Stagger: 100–150ms between sibling elements
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out-expo)

### 6.2 Hover Effects

| Element | Effect |
|---------|--------|
| How It Works cards | `scale(1.05)` + z-index boost |
| CTA buttons | `opacity: 0.9` |
| Nav links | Color transition to `--text` |
| Social icons | Border darkens + text color change |
| Feature cards | Subtle shadow lift |
| FAQ items | None (click interaction only) |

### 6.3 Video Auto-Play

- All showcase videos: `muted`, `loop`, `playsInline`
- No autoplay attribute — triggered by Intersection Observer
- Poster images for the explainer video (lazy-loaded)
- Play button overlay for explainer (not for hero/spotlight)

### 6.4 Countdown Timer

- Updates every second via `setInterval`
- Uses `tabular-nums` font feature for stable digit widths
- Four digit boxes: days, hours, mins, secs
- Box style: `rounded-xl`, white bg, `ring-1 ring-border`
- Digit: 20px bold, label: 10px uppercase tracking-wider

### 6.5 Billing Toggle

- Rounded-full pill container with `ring-1 ring-border`
- Active tab: `bg-button` (dark) with white text, absolute positioned background
- Inactive tab: Muted text, hover → text color
- Annual tab shows "2 months free" badge in accent color

### 6.6 Scroll-Based Navigation

- Nav background transitions from transparent to glass on scroll
- Uses CSS custom property `--p` (0 → 1) driven by scroll position
- Glass effect: `backdrop-blur-md` + semi-transparent background
- SVG filter for "liquid glass distortion" effect (fractalNoise + displacement map)

---

## 7. Dashboard Design (Protected App)

### 7.1 Layout Structure

```
┌─────────────────────────────────────────────────────┐
│ [TopBar: Search | User Avatar | Settings]           │
├──────────┬──────────────────────────────────────────┤
│          │                                          │
│ Sidebar  │          Main Content Area               │
│          │                                          │
│ 🎬 Studio│                                          │
│ ✨ Inspire│                                          │
│ 👁 Watch  │                                          │
│ 📅 Calendar│                                         │
│ 📚 Library│                                          │
│ 🧠 Brain  │                                          │
│ ⚙ Settings│                                         │
│          │                                          │
└──────────┴──────────────────────────────────────────┘
```

- Sidebar: 240px width, collapsible to icon-only (64px) on mobile
- TopBar: 64px height, fixed
- Content area: Scrollable, max-width constrained

### 7.2 Reel Card (Inspiration Feed)

```
┌──────────────────────┐
│ [Thumbnail]          │
│                      │
│ ┌──┐ @creator_name   │
│ │IG│ 1.2M views      │
│ └──┘ 4.5% engagement │
│                      │
│ [Generate] [Save] [▶]│
└──────────────────────┘
```

- Card: `rounded-2xl`, white/surface bg, hairline border
- Thumbnail: `aspect-9/16` or `aspect-video`
- Platform badge: Small icon with platform color
- Action buttons: Icon-only with tooltips

### 7.3 Script Editor

```
┌─────────────────────────────────────────────────────┐
│ Source: [Video Thumbnail]  @creator · 1.2M views    │
├─────────────────────────────────────────────────────┤
│ 💡 IDEA                                              │
│ ┌─────────────────────────────────────────────────┐ │
│ │ One-line idea text here...                      │ │
│ └─────────────────────────────────────────────────┘ │
│                                                     │
│ 🪝 HOOK                                              │
│ ┌─────────────────────────────────────────────────┐ │
│ │ Opening hook text (first 3 seconds)...          │ │
│ └─────────────────────────────────────────────────┘ │
│                                                     │
│ 📝 SCRIPT                                            │
│ ┌─────────────────────────────────────────────────┐ │
│ │ Full script body with [PAUSE] and [CUT] marks.. │ │
│ │ ...                                              │ │
│ └─────────────────────────────────────────────────┘ │
│                                                     │
│ [📅 Schedule] [💾 Save to Library] [🔄 Regenerate]    │
└─────────────────────────────────────────────────────┘
```

### 7.4 Content Calendar

- Monthly grid view (default) with weekly option
- Each day cell shows script cards (truncated title + status badge)
- Drag-and-drop between dates
- Status colors: Idea (gray), Script (blue), Filming (orange), Ready (green), Posted (accent)
- Click to expand script details in a slide-over panel

---

## 8. Iconography

| Icon Set | Usage |
|----------|-------|
| **Lucide React** | Primary icon set for UI elements |
| **Custom SVG / Lucide** | Platform icons (Instagram) |
| **Tabler Icons** | Step icons (filled pin/funnel icon) |

### Platform Icons & Colors

| Platform | Icon | Color |
|----------|------|-------|
| Instagram | Custom SVG / Lucide | `#E1306C` |

---

## 9. Image & Media Guidelines

### 9.1 Images

| Usage | Format | Quality | Lazy Load |
|-------|--------|---------|-----------|
| Hero background | WebP | 75 | No (preload) |
| Feature card images | WebP/PNG | 75 | Yes |
| Creator avatars | WebP | 75 | Yes |
| Logo | WebP | 75 | No (preload) |
| OG Image | PNG | 100 | N/A |

### 9.2 Videos

| Usage | Format | Resolution | Autoplay |
|-------|--------|-----------|----------|
| Hero showcase | MP4 | 1080p | Yes (muted, loop) |
| Spotlight case study | MP4 | 1080p | Yes (muted, loop) |
| Explainer video | MP4 | 720p (mobile), 1080p (desktop) | No (click to play) |

### 9.3 Blur Placeholders

All images use inline base64 blur placeholders (10px wide WebP) for progressive loading, matching AlgroHack's implementation.

---

## 10. Glassmorphism & Surface Effects

### 10.1 Hairline Border

```css
.hairline {
  border: 1px solid var(--border);
}
```

Used on: Cards, accordions, social icons, nav on scroll, metric badges.

### 10.2 Glassmorphism Cards

```css
.glass-card {
  background: rgba(255, 255, 255, 0.90);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}
```

Used on: Floating metric badges, nav on scroll, engagement overlays.

### 10.3 Liquid Glass Navigation

```css
/* SVG filter for glass distortion effect */
<filter id="glass-distortion">
  <feTurbulence type="fractalNoise" baseFrequency="0.001 0.005" numOctaves="1" />
  <feGaussianBlur stdDeviation="3" />
  <feSpecularLighting surfaceScale="5" specularConstant="1" specularExponent="100">
    <fePointLight x="-200" y="-200" z="300" />
  </feSpecularLighting>
  <feDisplacementMap in="SourceGraphic" scale="60" xChannelSelector="R" yChannelSelector="G" />
</filter>
```

Applied to nav background with scroll-driven opacity.

---

## 11. Shadow System

| Token | Value | Usage |
|-------|-------|-------|
| `shadow-sm` | `0 1px 3px rgba(0,0,0,0.04)` | Feature cards |
| `shadow-md` | `0 6px 16px rgba(0,0,0,0.06)` | Metric badges (mobile) |
| `shadow-lg` | `0 10px 30px rgba(0,0,0,0.08)` | How It Works cards, glass cards |
| `shadow-xl` | `0 20px 60px rgba(0,0,0,0.12)` | Phone mockup |
| `shadow-2xl` | `0 40px 80px -40px rgba(15,17,21,0.25)` | Pricing card |
| `shadow-accent` | `0 10px 30px rgba(255,90,78,0.35)` | Accent CTA button (spotlight) |

---

## 12. Accessibility Requirements

| Requirement | Implementation |
|-------------|---------------|
| Color contrast | All text meets WCAG AA (4.5:1 normal, 3:1 large) |
| Focus indicators | Visible focus rings on all interactive elements |
| Keyboard navigation | Tab order follows visual layout |
| Screen readers | `aria-label` on icon buttons, `aria-expanded` on accordions, `role="tab"` on toggles |
| Reduced motion | `prefers-reduced-motion` disables entrance animations and glow effects |
| Semantic HTML | `<main>`, `<nav>`, `<section>`, `<footer>`, `<h1>`–`<h3>` hierarchy |
| Image alt text | Descriptive alt text on all content images, `aria-hidden` on decorative |
| Video a11y | `aria-label` on video elements, play button labels |

---

## 13. SEO & Structured Data

### 13.1 Meta Tags (per AlgroHack)

```html
<title>AI Script Writer for Instagram Reels & Shorts | InstaVibes</title>
<meta name="description" content="Turn any viral reel into your next script, in your own voice. Find what's working in your niche and plan it on a calendar. English, Hindi & Hinglish." />
<meta property="og:title" content="InstaVibes: Never Run Out of What to Post" />
<meta property="og:description" content="Turn any viral reel into your next script, in your own voice." />
<meta property="og:image" content="/opengraph-image.png" />
<meta property="og:type" content="website" />
<meta name="twitter:card" content="summary_large_image" />
```

### 13.2 JSON-LD Structured Data

- **Organization** schema with social profiles
- **WebSite** schema
- **SoftwareApplication** schema with pricing offers
- **FAQPage** schema with all Q&A pairs

### 13.3 404 Page

Custom branded 404 with:
- Large gradient "404" text
- "This page went off-script." heading
- Links to dashboard and home
- Contact email for reporting issues
- Background glow effects matching site style

---

*This design document provides the complete visual specification for implementing InstaVibes. All measurements, colors, and components are derived from analysis of AlgroHack's production implementation.*
