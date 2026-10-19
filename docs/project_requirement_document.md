# 📋 Project Requirement Document (PRD)

## InstaVibes — AI-Powered Instagram Content Engine

---

> **Version:** 1.0  
> **Date:** October 16, 2026  
> **Status:** Draft  
> **Author:** InstaVibes Engineering Team

---

## 1. Executive Summary

InstaVibes is a SaaS platform that helps Instagram creators, marketers, and agencies grow and monetize their audience faster. The platform learns a creator's unique voice by analyzing their existing content, discovers viral reels across niches, and generates AI-powered scripts in the creator's own tone — in English, Hindi, or Hinglish.

InstaVibes is a functional replica of [AlgroHack](https://www.algrohack.com/), rebuilt from the ground up using a modern tech stack: **Next.js 16**, **Apify Actors**, and **Supabase**.

---

## 2. Problem Statement

Content creators face three recurring challenges:

1. **Idea Drought** — "What should I post next?" is the #1 blocker for consistent growth.
2. **Voice Inconsistency** — AI tools generate generic scripts that don't sound like the creator.
3. **Tool Sprawl** — Creators juggle 5–10 tools for research, scripting, scheduling, and analytics.

InstaVibes solves all three by combining viral reel discovery, AI script generation (in the creator's voice), and a content calendar into one workflow.

---

## 3. Target Audience

| Segment | Description | Pain Point |
|---------|------------|------------|
| **Solo Creators** | Instagram content creators and reel makers (10K–500K followers) | Can't post consistently; run out of ideas |
| **Content Marketers** | Brand marketers managing social media for companies | Need data-driven content strategies |
| **Social Media Agencies** | Agencies managing 5–50+ client accounts | Need scalable content pipelines |

---

## 4. Product Vision

> *"Never run out of what to post."*

One link → AI learns your voice → Discovers viral patterns → Generates scripts in your voice → Plans them on your calendar.

---

## 5. Core Features

### 5.1 Content Brain (Voice Learning Engine)

- User provides their Instagram handle on signup.
- System scrapes the user's recent public reels via **Apify Instagram Scraper Actors**.
- AI analyzes tone, hooks, topics, storytelling patterns, audience, and offers.
- Creates a persistent "Content Brain" profile per user.
- Users can view and edit what the system knows about them at any time.
- Voice profile improves over time as more content is analyzed.

### 5.2 Content Studio (Script Generator)

- **Input Methods:**
  - Paste any Instagram reel URL.
  - Upload a video file directly.
  - Browse from the Inspiration feed and select a reel.
- **Output Pipeline:** Source Video → Idea → Hook → Full Script.
- **Script Features:**
  - Written in the creator's voice (powered by Content Brain).
  - Includes: Hook text, on-screen text suggestions, full speaking script.
  - Available in **English**, **Hindi**, and **Hinglish** (native writing, not translated).
- **Actions:** Edit script, save to library, schedule to calendar, regenerate.

### 5.3 Inspiration Feed (Viral Reel Discovery)

- Curated feed of reels performing well in the user's niche **right now**.
- Reels are matched to what the user actually posts, not generic trending content.
- **Filtering Capabilities:**
  - By niche/category (Finance, Fitness, Tech, Lifestyle, Comedy, E-commerce, etc.)
  - By engagement metrics (views, likes, engagement rate)
  - By time period (Last 24h, 7 days, 30 days)
  - By audio/trending sounds
- **Reel Card Data:** Thumbnail, view count, like count, engagement rate, platform icon (IG/YT/FB), creator handle.
- **Card Actions:** Preview video, generate script from it, save to library.

### 5.4 Creator Watchlist (Competitor Tracking)

- Follow specific creator Instagram handles.
- Apify Actors scrape their content on a scheduled basis.
- **Intelligent Surfacing:** Only surfaces a reel when it beats the creator's own usual performance numbers (e.g., "3.2x their average views").
- Prevents big accounts' ordinary posts from crowding out smaller creators' breakout content.

### 5.5 Content Calendar

- Visual calendar view (monthly/weekly) for planned content.
- Every script generated drops into the calendar with a suggested post date.
- Drag-and-drop to reschedule.
- Status tracking: Idea → Script → Filming → Ready → Posted.
- "Always know what you're filming next."

### 5.6 Library & Swipe Files

- Save winning reels, hooks, scripts, and audio references.
- Organize into custom collections/folders with tags.
- Search and filter saved content.
- Quick access for content planning sessions.

---

## 6. Landing Page Sections (Marketing Site)

The public marketing website replicates AlgroHack's high-converting SaaS landing page:

### 6.1 Launch Offer Bar
- Sticky top bar with countdown timer.
- Shows original price crossed out, launch price highlighted.
- Links to pricing section.

### 6.2 Navigation
- **Links:** How it works, Features, Pricing, FAQ, Free tools.
- **CTAs:** Login button (ghost/pill style), primary CTA.
- Sticky navigation with glass-morphism effect on scroll.
- Mobile hamburger menu.

### 6.3 Hero Section
- **Badge:** "New — Idea → hook → script from any viral reel"
- **Headline:** "Grow and monetize your *Instagram audience*, fast"
- **Subheadline:** "instavibes learns how you talk, turns any viral reel into your next script, and writes it in English, Hindi, or Hinglish."
- **Primary CTA:** "Try free for 3 days" → `/sign-up`
- **Hero Visual:** Animated phone mockup with live video playing, floating engagement metric cards (IG/YT/FB icons with view/like counts).
- **Social Proof:** "50M+ views, 10M+ likes and counting"

### 6.4 Spotlight / Case Study Section
- Highlight a real success story (e.g., "Yashika hit 2.7M views from just one video").
- Video embed with view count badge overlay.
- CTA: "Try free for 3 days"

### 6.5 How It Works (4 Steps)
- **Step 1:** "Enter your Instagram link" — InstaVibes reads your content to learn your style.
- **Step 2:** "Get ideas and scripts from viral videos" — Paste or browse viral reels, get scripts in your voice.
- **Step 3:** "Fill up your calendar" — Scripts drop into your content calendar.
- **Step 4:** "Know what you're shooting next" — Calendar always has the next script ready.
- Zigzag card layout with dashed SVG connecting paths on desktop.
- Numbered gradient badges, hover scale animations.

### 6.6 Explainer Video
- "See it in action — instavibes in 70 seconds"
- Video player with poster image, play button overlay.
- Responsive video (720p mobile, 1080p desktop).

### 6.7 Features Grid (Bento Layout)
- **"Turn Any Viral Reel Into Yours"** — Paste any Instagram reel, get it rewritten in your voice.
- **"From Idea to Finished Script"** — Ideas → Hooks → Scripts → Calendar.
- **"Your Voice, Remembered"** — Content Brain learns audience, tone, offers, storytelling style.
- **"Content Calendar"** — Always know what you're filming next.
- **"Keep An Eye On Your Inspiration"** — Watchlist with breakout detection.
- Grid: 2 large cards (3-col), 3 medium cards (2-col each).
- Each card has image + title + description.

### 6.8 Language Section
- "Written natively, not translated"
- Side-by-side comparison: "Translated" (crossed out) vs "Native Hinglish" (highlighted).
- English, Hindi, Hinglish.

### 6.9 Pricing Section
- **Launch Offer:** Countdown timer with days/hours/mins/secs.
- **Billing Toggle:** Monthly / Annual (with "2 months free" badge).
- **Single Plan Card** (two-column layout):
  - **Left panel** (dark): Plan name, original price crossed out ($20), launch price ($10/mo), billing info, CTA.
  - **Right panel** (white): Feature checklist organized by category:
    - AI Persona & Voice: Voice learning, editable creator profile.
    - Script Studio: Instagram reel input, script generation.
    - Outlier Radar: Niche-matched feed, creator watchlist.
    - Workflow & Vault: Content calendar, saved library.
  - Footer: Language support note.
- Monthly: $10/mo (launch, regular $20) | Annual: $100/yr (launch, regular $200) — "2 months free"

### 6.10 FAQ Section
- Accordion-style dropdowns.
- Questions: What is InstaVibes? Does it copy content? Getting started? Reel selection logic? Languages? Existing scripts needed? How to start?
- Contact email footer.

### 6.11 Final CTA Section
- "Ready When You Are" — Recap + CTA + hero image.

### 6.12 Footer
- Logo + tagline: "Your content, in your voice."
- Social media icons: Instagram, X.
- Links: Free tools, Terms, Privacy, Refunds, Contact, Email.
- Copyright notice.

---

## 7. Authentication & User Management

| Feature | Details |
|---------|---------|
| **Sign Up** | Email/password + Google OAuth via Supabase Auth |
| **Login** | Email/password + Google OAuth |
| **Free Trial** | 3-day free trial, no credit card required |
| **Password Reset** | Email-based magic link via Supabase |
| **Session Management** | JWT tokens via Supabase, refresh token rotation |
| **Protected Routes** | Dashboard and all `/dashboard/*` routes require authentication |

---

## 8. Subscription & Billing

| Feature | Details |
|---------|---------|
| **Payment Provider** | Stripe (integrated via Supabase) or Razorpay (for India) |
| **Plans** | Monthly ($20/mo launch), Annual ($200/yr launch) |
| **Free Trial** | 3 days, full access |
| **Billing Management** | Upgrade/downgrade/cancel from settings |
| **Webhook Sync** | Stripe webhooks update Supabase subscription status |

---

## 9. Non-Functional Requirements

### 9.1 Performance
- First Contentful Paint (FCP): < 1.2s
- Largest Contentful Paint (LCP): < 2.5s
- Time to Interactive (TTI): < 3.5s
- API Response Times: < 200ms for reads, < 2s for AI generation.

### 9.2 Security
- Row Level Security (RLS) on all Supabase tables.
- CSRF protection on all mutations.
- Rate limiting on API routes.
- Input sanitization for all user-provided URLs.
- HTTPS everywhere.

### 9.3 SEO
- Server-side rendering for all public pages.
- Structured data (JSON-LD): Organization, WebSite, SoftwareApplication, FAQPage.
- Meta tags: title, description, OG tags, Twitter cards.
- Canonical URLs, sitemap.xml, robots.txt.

---

## 10. Pages & Routes

### Public (Marketing)
| Route | Page |
|-------|------|
| `/` | Landing page |
| `/tools` | Free tools page |
| `/terms` | Terms of service |
| `/privacy` | Privacy policy |
| `/contact` | Contact page |
| `/login` | Login page |
| `/sign-up` | Signup page |

### Protected (Dashboard)
| Route | Page |
|-------|------|
| `/dashboard` | Main dashboard |
| `/dashboard/studio` | Content Studio — script generation |
| `/dashboard/inspiration` | Viral reels discovery feed |
| `/dashboard/watchlist` | Creator watchlist & competitor tracking |
| `/dashboard/calendar` | Content calendar |
| `/dashboard/library` | Saved scripts, reels, and collections |
| `/dashboard/brain` | Content Brain — view/edit voice profile |
| `/dashboard/settings` | Account, subscription, API keys |

---

## 11. Milestones & Timeline

| Phase | Duration | Deliverables |
|-------|----------|-------------|
| **Phase 1: Foundation** | 2 weeks | Project setup, auth, database schema, landing page |
| **Phase 2: Core Features** | 4 weeks | Content Studio, Inspiration Feed, Content Brain |
| **Phase 3: Engagement** | 3 weeks | Calendar, Library, Watchlist, Apify integrations |
| **Phase 4: Monetization** | 2 weeks | Stripe/Razorpay integration, subscription management |
| **Phase 5: Polish & Launch** | 2 weeks | Performance optimization, testing, SEO, launch |

**Total estimated timeline: 13 weeks**

---

## 12. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Instagram API rate limiting | High | Apify actors with proxy rotation; request queuing |
| AI script quality | Medium | Prompt engineering with voice profiles; feedback loops |
| Apify costs at scale | Medium | Cache results; batch processing; tiered limits |
| Content moderation | Medium | Content filtering; user reporting |
| Supabase connection limits | Low | Connection pooling; Edge Functions |

---

## 13. Out of Scope (v1)

- Direct posting to Instagram.
- Team collaboration / multi-seat access.
- Mobile app (responsive web only).
- Video editing or generation capabilities.

---

*This document serves as the source of truth for all product decisions in InstaVibes v1.*
