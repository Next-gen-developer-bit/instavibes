# 🔧 Technical Requirement Document (TRD)

## InstaVibes — Technical Specification

---

> **Version:** 1.0  
> **Date:** October 16, 2026  
> **Status:** Draft  
> **Author:** InstaVibes Engineering Team

---

## 1. Technology Stack Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        TECHNOLOGY STACK                             │
├─────────────────────────────────────────────────────────────────────┤
│  Frontend        │  Next.js 16 (App Router, RSC, Server Actions)   │
│  Runtime         │  React 19, Turbopack                            │
│  Styling         │  Tailwind CSS v4, CSS Variables                 │
│  UI Components   │  shadcn/ui, Radix UI primitives                 │
│  Animations      │  Framer Motion, CSS animations                  │
│  Icons           │  Lucide React                                   │
│  Typography      │  Geist Sans (variable font)                     │
├─────────────────────────────────────────────────────────────────────┤
│  Backend / BaaS  │  Supabase (PostgreSQL, Auth, Storage, Edge Fn)  │
│  Scraping        │  Apify Actors (Instagram Scraper, Reels Scraper)│
│  AI / LLM        │  OpenAI GPT-4o / Anthropic Claude (via API)     │
│  Payments        │  Stripe API (subscriptions, webhooks)           │
│  Email           │  Resend (transactional emails)                  │
├─────────────────────────────────────────────────────────────────────┤
│  Deployment      │  Vercel (Edge Runtime, Serverless Functions)    │
│  CDN             │  Vercel Edge Network                            │
│  Monitoring      │  Vercel Analytics, Sentry                       │
│  CI/CD           │  GitHub Actions → Vercel auto-deploy            │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. Next.js 16 Configuration

### 2.1 Project Structure

```
instavibes/
├── src/
│   ├── app/                          # App Router pages
│   │   ├── (marketing)/              # Public marketing pages (grouped layout)
│   │   │   ├── layout.tsx            # Marketing layout (nav + footer)
│   │   │   ├── page.tsx              # Landing page (/)
│   │   │   ├── tools/
│   │   │   │   └── page.tsx
│   │   │   ├── terms/
│   │   │   │   └── page.tsx
│   │   │   ├── privacy/
│   │   │   │   └── page.tsx
│   │   │   └── contact/
│   │   │       └── page.tsx
│   │   ├── (auth)/                   # Auth pages (grouped layout)
│   │   │   ├── layout.tsx            # Minimal auth layout
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── sign-up/
│   │   │   │   └── page.tsx
│   │   │   └── auth/
│   │   │       └── callback/
│   │   │           └── route.ts      # OAuth callback handler
│   │   ├── (dashboard)/              # Protected dashboard (grouped layout)
│   │   │   ├── layout.tsx            # Dashboard layout (sidebar + topbar)
│   │   │   └── dashboard/
│   │   │       ├── page.tsx          # Dashboard home (redirect to studio)
│   │   │       ├── studio/
│   │   │       │   └── page.tsx
│   │   │       ├── inspiration/
│   │   │       │   └── page.tsx
│   │   │       ├── watchlist/
│   │   │       │   └── page.tsx
│   │   │       ├── calendar/
│   │   │       │   └── page.tsx
│   │   │       ├── library/
│   │   │       │   └── page.tsx
│   │   │       ├── brain/
│   │   │       │   └── page.tsx
│   │   │       └── settings/
│   │   │           └── page.tsx
│   │   ├── api/                      # API routes
│   │   │   ├── webhooks/
│   │   │   │   └── stripe/
│   │   │   │       └── route.ts
│   │   │   ├── apify/
│   │   │   │   ├── scrape-profile/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── scrape-reel/
│   │   │   │   │   └── route.ts
│   │   │   │   └── webhook/
│   │   │   │       └── route.ts
│   │   │   └── ai/
│   │   │       ├── generate-script/
│   │   │       │   └── route.ts
│   │   │       └── analyze-voice/
│   │   │           └── route.ts
│   │   ├── layout.tsx                # Root layout
│   │   ├── not-found.tsx             # Custom 404 page
│   │   └── globals.css               # Global styles + Tailwind
│   ├── components/
│   │   ├── ui/                       # shadcn/ui components
│   │   ├── marketing/                # Landing page components
│   │   │   ├── Navbar.tsx
│   │   │   ├── LaunchBar.tsx
│   │   │   ├── Hero.tsx
│   │   │   ├── Spotlight.tsx
│   │   │   ├── HowItWorks.tsx
│   │   │   ├── ExplainerVideo.tsx
│   │   │   ├── FeaturesGrid.tsx
│   │   │   ├── LanguageSection.tsx
│   │   │   ├── Pricing.tsx
│   │   │   ├── FAQ.tsx
│   │   │   ├── FinalCTA.tsx
│   │   │   └── Footer.tsx
│   │   ├── dashboard/                # Dashboard components
│   │   │   ├── Sidebar.tsx
│   │   │   ├── TopBar.tsx
│   │   │   ├── ReelCard.tsx
│   │   │   ├── ScriptEditor.tsx
│   │   │   ├── CalendarView.tsx
│   │   │   ├── BrainProfile.tsx
│   │   │   └── WatchlistCard.tsx
│   │   └── shared/                   # Shared components
│   │       ├── CountdownTimer.tsx
│   │       ├── VideoPlayer.tsx
│   │       ├── PlatformIcon.tsx
│   │       └── GlowEffect.tsx
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts             # Browser Supabase client
│   │   │   ├── server.ts             # Server Supabase client
│   │   │   ├── middleware.ts          # Auth middleware helper
│   │   │   └── admin.ts              # Service role client
│   │   ├── apify/
│   │   │   ├── client.ts             # Apify API client
│   │   │   ├── actors.ts             # Actor run helpers
│   │   │   └── parsers.ts            # Response parsers
│   │   ├── ai/
│   │   │   ├── openai.ts             # OpenAI client
│   │   │   ├── prompts.ts            # Prompt templates
│   │   │   └── voice-analyzer.ts     # Voice profile analysis
│   │   ├── stripe/
│   │   │   ├── client.ts             # Stripe client
│   │   │   ├── plans.ts              # Plan definitions
│   │   │   └── webhooks.ts           # Webhook handlers
│   │   ├── utils/
│   │   │   ├── url.ts                # URL parsing/validation
│   │   │   ├── format.ts             # Number/date formatters
│   │   │   └── constants.ts          # App constants
│   │   └── hooks/
│   │       ├── useUser.ts
│   │       ├── useSubscription.ts
│   │       └── useReels.ts
│   ├── actions/                      # Server Actions
│   │   ├── auth.ts
│   │   ├── scripts.ts
│   │   ├── reels.ts
│   │   ├── watchlist.ts
│   │   ├── calendar.ts
│   │   └── brain.ts
│   └── types/
│       ├── database.ts               # Supabase generated types
│       ├── apify.ts                  # Apify response types
│       └── index.ts                  # App-wide types
├── public/
│   ├── logo/
│   ├── images/
│   ├── videos/
│   └── fonts/
├── supabase/
│   ├── migrations/                   # SQL migration files
│   ├── functions/                    # Edge Functions
│   │   ├── scrape-scheduled/         # Cron-based scraping
│   │   └── process-apify-webhook/    # Apify webhook handler
│   └── seed.sql                      # Seed data
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── .env.local
```

### 2.2 Next.js Configuration

```typescript
// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    // Next.js 16 features
    ppr: true,                    // Partial Prerendering
    reactCompiler: true,          // React Compiler (auto-memoization)
    dynamicIO: true,              // Dynamic IO for streaming
    serverActions: {
      bodySizeLimit: '10mb',      // For video uploads
    },
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.cdninstagram.com' },
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'i.ytimg.com' },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  turbopack: {},                   // Enable Turbopack (default in Next.js 16)
};

export default nextConfig;
```

### 2.3 Key Dependencies

```json
{
  "dependencies": {
    "next": "^16.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@supabase/supabase-js": "^2.50.0",
    "@supabase/ssr": "^0.6.0",
    "apify-client": "^2.10.0",
    "openai": "^5.0.0",
    "stripe": "^17.0.0",
    "@stripe/stripe-js": "^5.0.0",
    "framer-motion": "^12.0.0",
    "lucide-react": "^0.500.0",
    "@radix-ui/react-accordion": "^1.2.0",
    "@radix-ui/react-dialog": "^1.1.0",
    "@radix-ui/react-tabs": "^1.1.0",
    "@radix-ui/react-tooltip": "^1.1.0",
    "date-fns": "^4.0.0",
    "zod": "^3.24.0",
    "resend": "^4.0.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^3.0.0"
  },
  "devDependencies": {
    "typescript": "^5.7.0",
    "@types/react": "^19.0.0",
    "@types/node": "^22.0.0",
    "tailwindcss": "^4.0.0",
    "supabase": "^2.0.0",
    "eslint": "^9.0.0",
    "prettier": "^3.4.0"
  }
}
```

---

## 3. Supabase Configuration

### 3.1 Database Schema

```sql
-- ============================================
-- USERS & AUTHENTICATION
-- ============================================

-- Extends Supabase auth.users
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  instagram_handle TEXT,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SUBSCRIPTIONS & BILLING
-- ============================================

CREATE TYPE subscription_status AS ENUM (
  'trialing', 'active', 'canceled', 'past_due', 'incomplete'
);

CREATE TYPE billing_interval AS ENUM ('month', 'year');

CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  status subscription_status NOT NULL DEFAULT 'trialing',
  billing_interval billing_interval DEFAULT 'month',
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  trial_end TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '3 days'),
  cancel_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ============================================
-- CONTENT BRAIN (Voice Profile)
-- ============================================

CREATE TABLE public.content_brains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  tone JSONB DEFAULT '[]',           -- ["witty", "authoritative", "casual"]
  topics JSONB DEFAULT '[]',          -- ["finance", "investing", "budgeting"]
  hooks_style JSONB DEFAULT '[]',     -- ["question", "shock", "curiosity"]
  audience TEXT,                      -- "young professionals 22-35"
  offers TEXT,                        -- "courses, consulting"
  storytelling_patterns JSONB DEFAULT '[]',
  language_preference TEXT DEFAULT 'english', -- english | hindi | hinglish
  raw_analysis JSONB,                -- Full AI analysis output
  last_analyzed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ============================================
-- SCRAPED REELS (from Apify)
-- ============================================

CREATE TABLE public.reels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL DEFAULT 'instagram' CHECK (platform = 'instagram'),
  platform_id TEXT NOT NULL,          -- Instagram reel shortcode / ID
  url TEXT NOT NULL,
  creator_handle TEXT,
  creator_name TEXT,
  creator_profile_pic TEXT,
  caption TEXT,
  transcript TEXT,                    -- Extracted audio transcript
  thumbnail_url TEXT,
  video_url TEXT,
  view_count BIGINT DEFAULT 0,
  like_count BIGINT DEFAULT 0,
  comment_count BIGINT DEFAULT 0,
  share_count BIGINT DEFAULT 0,
  engagement_rate DECIMAL(5,4),       -- e.g., 0.0425 = 4.25%
  duration_seconds INTEGER,
  audio_name TEXT,
  hashtags JSONB DEFAULT '[]',
  niche TEXT,                         -- AI-categorized niche
  hook_text TEXT,                     -- First 3 seconds transcript
  hook_category TEXT,                 -- curiosity_gap | negative | authority | question | shock
  posted_at TIMESTAMPTZ,
  scraped_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(platform, platform_id)
);

-- Index for fast feed queries
CREATE INDEX idx_reels_niche_views ON public.reels(niche, view_count DESC);
CREATE INDEX idx_reels_posted_at ON public.reels(posted_at DESC);
CREATE INDEX idx_reels_creator ON public.reels(creator_handle);
CREATE INDEX idx_reels_engagement ON public.reels(engagement_rate DESC);

-- ============================================
-- USER SCRIPTS (Generated Content)
-- ============================================

CREATE TYPE script_status AS ENUM (
  'idea', 'hook', 'script', 'filming', 'ready', 'posted'
);

CREATE TABLE public.scripts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  source_reel_id UUID REFERENCES public.reels(id),
  source_url TEXT,                    -- Original URL pasted by user
  title TEXT,
  idea TEXT,                          -- Generated idea
  hook TEXT,                          -- Generated hook
  script_body TEXT,                   -- Full generated script
  on_screen_text TEXT,                -- Suggested on-screen text
  language TEXT DEFAULT 'english',    -- english | hindi | hinglish
  status script_status DEFAULT 'idea',
  scheduled_date DATE,
  tags JSONB DEFAULT '[]',
  is_saved BOOLEAN DEFAULT FALSE,     -- Saved to library
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_scripts_user_status ON public.scripts(user_id, status);
CREATE INDEX idx_scripts_user_date ON public.scripts(user_id, scheduled_date);

-- ============================================
-- WATCHLIST (Creator Following)
-- ============================================

CREATE TABLE public.watchlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  creator_handle TEXT NOT NULL,
  creator_name TEXT,
  creator_profile_pic TEXT,
  creator_avg_views BIGINT DEFAULT 0,  -- Rolling average for breakout detection
  creator_avg_likes BIGINT DEFAULT 0,
  last_scraped_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, creator_handle)
);

-- ============================================
-- COLLECTIONS (Swipe Files)
-- ============================================

CREATE TABLE public.collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#8B5CF6',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.collection_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID NOT NULL REFERENCES public.collections(id) ON DELETE CASCADE,
  reel_id UUID REFERENCES public.reels(id),
  script_id UUID REFERENCES public.scripts(id),
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CHECK (reel_id IS NOT NULL OR script_id IS NOT NULL)
);

-- ============================================
-- APIFY SCRAPER JOBS
-- ============================================

CREATE TYPE scraper_job_status AS ENUM (
  'pending', 'running', 'succeeded', 'failed'
);

CREATE TABLE public.scraper_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id),
  job_type TEXT NOT NULL,              -- 'profile_scrape' | 'reel_scrape' | 'watchlist_sync' | 'niche_discovery'
  apify_run_id TEXT,
  input_data JSONB NOT NULL,           -- Actor input parameters
  status scraper_job_status DEFAULT 'pending',
  result_count INTEGER DEFAULT 0,
  error_message TEXT,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_brains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watchlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scraper_jobs ENABLE ROW LEVEL SECURITY;

-- Users can only read/write their own data
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can view own subscription"
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own brain"
  ON public.content_brains FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own scripts"
  ON public.scripts FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own watchlist"
  ON public.watchlist FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own collections"
  ON public.collections FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own collection items"
  ON public.collection_items FOR ALL
  USING (
    collection_id IN (
      SELECT id FROM public.collections WHERE user_id = auth.uid()
    )
  );

-- Reels are publicly readable (scraped content)
ALTER TABLE public.reels ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Reels are readable by authenticated users"
  ON public.reels FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can view own scraper jobs"
  ON public.scraper_jobs FOR SELECT
  USING (auth.uid() = user_id);

-- ============================================
-- DATABASE FUNCTIONS
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER content_brains_updated_at
  BEFORE UPDATE ON public.content_brains
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER scripts_updated_at
  BEFORE UPDATE ON public.scripts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.raw_user_meta_data ->> 'avatar_url'
  );

  INSERT INTO public.subscriptions (user_id)
  VALUES (NEW.id);

  INSERT INTO public.content_brains (user_id)
  VALUES (NEW.id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

### 3.2 Supabase Auth Configuration

```typescript
// src/lib/supabase/server.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/types/database';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );
}
```

```typescript
// src/middleware.ts
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Protect dashboard routes
  if (request.nextUrl.pathname.startsWith('/dashboard') && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from auth pages
  if ((request.nextUrl.pathname === '/login' || 
       request.nextUrl.pathname === '/sign-up') && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/sign-up'],
};
```

### 3.3 Auth Providers

| Provider | Configuration |
|----------|-------------|
| Email/Password | Enabled, email confirmation required |
| Google OAuth | Enabled via Google Cloud Console |
| Magic Link | Enabled for password reset |

---

## 4. Apify Integration

### 4.1 Actors Used

| Actor | Purpose | Schedule |
|-------|---------|----------|
| `apify/instagram-scraper` | Scrape creator profiles & posts | On-demand + daily cron |
| `apify/instagram-reel-scraper` | Scrape individual reel data | On-demand |
| `apify/instagram-hashtag-scraper` | Discover trending reels by hashtag | Every 6 hours |
| `apify/instagram-profile-scraper` | Scrape profile metadata | On-demand |

### 4.2 Apify Client

```typescript
// src/lib/apify/client.ts
import { ApifyClient } from 'apify-client';

const apifyClient = new ApifyClient({
  token: process.env.APIFY_API_TOKEN!,
});

export async function scrapeInstagramProfile(handle: string) {
  const run = await apifyClient.actor('apify/instagram-scraper').call({
    directUrls: [`https://www.instagram.com/${handle}/`],
    resultsType: 'posts',
    resultsLimit: 30,
    addParentData: true,
  });

  const { items } = await apifyClient.dataset(run.defaultDatasetId).listItems();
  return items;
}

export async function scrapeInstagramReel(reelUrl: string) {
  const run = await apifyClient.actor('apify/instagram-reel-scraper').call({
    directUrls: [reelUrl],
    resultsLimit: 1,
  });

  const { items } = await apifyClient.dataset(run.defaultDatasetId).listItems();
  return items[0];
}

export async function discoverNicheReels(hashtags: string[], limit = 50) {
  const run = await apifyClient.actor('apify/instagram-hashtag-scraper').call({
    hashtags,
    resultsLimit: limit,
    sortBy: 'recent',
  });

  const { items } = await apifyClient.dataset(run.defaultDatasetId).listItems();
  return items;
}
```

### 4.3 Apify Webhook Integration

```typescript
// src/app/api/apify/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { parseApifyReelData } from '@/lib/apify/parsers';

export async function POST(request: NextRequest) {
  const payload = await request.json();
  
  // Verify webhook signature
  const signature = request.headers.get('x-apify-webhook-signature');
  if (!verifyApifySignature(signature, payload)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const supabase = createAdminClient();
  const { eventType, resource } = payload;

  if (eventType === 'ACTOR.RUN.SUCCEEDED') {
    // Update job status
    await supabase
      .from('scraper_jobs')
      .update({ 
        status: 'succeeded', 
        completed_at: new Date().toISOString() 
      })
      .eq('apify_run_id', resource.id);

    // Fetch and store results
    const items = await fetchApifyDataset(resource.defaultDatasetId);
    const reels = items.map(parseApifyReelData);

    await supabase.from('reels').upsert(reels, {
      onConflict: 'platform,platform_id',
      ignoreDuplicates: false,
    });
  }

  return NextResponse.json({ ok: true });
}
```

### 4.4 Scheduled Scraping (Supabase Edge Function)

```typescript
// supabase/functions/scrape-scheduled/index.ts
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async () => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  // 1. Get all active watchlist entries that need scraping
  const { data: watchlistItems } = await supabase
    .from('watchlist')
    .select('*')
    .eq('is_active', true)
    .or(`last_scraped_at.is.null,last_scraped_at.lt.${new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()}`);

  // 2. Batch scrape via Apify
  for (const item of watchlistItems || []) {
    await fetch(`${Deno.env.get('APP_URL')}/api/apify/scrape-profile`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('INTERNAL_API_KEY')}` 
      },
      body: JSON.stringify({ handle: item.creator_handle }),
    });
  }

  return new Response(JSON.stringify({ processed: watchlistItems?.length || 0 }));
});
```

---

## 5. AI Integration

### 5.1 Voice Analysis Pipeline

```typescript
// src/lib/ai/voice-analyzer.ts
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function analyzeCreatorVoice(
  reels: Array<{ caption: string; transcript?: string }>
) {
  const content = reels
    .map((r, i) => `Reel ${i + 1}:\nCaption: ${r.caption}\nTranscript: ${r.transcript || 'N/A'}`)
    .join('\n\n---\n\n');

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content: `You are a content strategist. Analyze these Instagram reels and extract the creator's unique voice profile. Return JSON with: tone (array), topics (array), hooks_style (array), audience (string), offers (string), storytelling_patterns (array), language_preference (string: english/hindi/hinglish).`,
      },
      { role: 'user', content },
    ],
  });

  return JSON.parse(response.choices[0].message.content!);
}
```

### 5.2 Script Generation Pipeline

```typescript
// src/lib/ai/prompts.ts
export function buildScriptPrompt(params: {
  sourceTranscript: string;
  voiceProfile: VoiceProfile;
  language: 'english' | 'hindi' | 'hinglish';
}) {
  return `You are a viral content scriptwriter. Your job is to write a new, original script inspired by the SOURCE VIDEO below, but completely rewritten in the CREATOR'S VOICE.

## SOURCE VIDEO TRANSCRIPT:
${params.sourceTranscript}

## CREATOR'S VOICE PROFILE:
- Tone: ${params.voiceProfile.tone.join(', ')}
- Topics: ${params.voiceProfile.topics.join(', ')}
- Hook Style: ${params.voiceProfile.hooks_style.join(', ')}
- Audience: ${params.voiceProfile.audience}
- Storytelling: ${params.voiceProfile.storytelling_patterns.join(', ')}

## OUTPUT LANGUAGE: ${params.language}
${params.language === 'hinglish' ? 'Write natively in Hinglish (mix of Hindi and English as spoken casually). Do NOT translate from English.' : ''}
${params.language === 'hindi' ? 'Write natively in Hindi. Do NOT translate from English.' : ''}

## RULES:
1. NEVER copy the original wording. Only take patterns, structure, hooks, pacing, format.
2. Write the script in the creator's natural voice.
3. The hook must grab attention in the first 3 seconds.

## OUTPUT (JSON):
{
  "idea": "One-line content idea",
  "hook": "The opening hook (first 3 seconds)",
  "script": "Full speaking script with [PAUSE], [CUT], [B-ROLL] markers",
  "on_screen_text": "Suggested text overlays"
}`;
}
```

---

## 6. Stripe Integration

### 6.1 Plan Configuration

```typescript
// src/lib/stripe/plans.ts
export const PLANS = {
  monthly: {
    name: 'InstaVibes Monthly',
    priceId: process.env.STRIPE_MONTHLY_PRICE_ID!,
    price: 2000, // $20.00 in cents
    interval: 'month' as const,
    trialDays: 3,
  },
  annual: {
    name: 'InstaVibes Annual',
    priceId: process.env.STRIPE_ANNUAL_PRICE_ID!,
    price: 20000, // $200.00 in cents
    interval: 'year' as const,
    trialDays: 3,
  },
} as const;
```

### 6.2 Webhook Handler

```typescript
// src/app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createAdminClient } from '@/lib/supabase/admin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature')!;
  
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const supabase = createAdminClient();

  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription;
      await supabase.from('subscriptions').update({
        status: subscription.status as any,
        stripe_subscription_id: subscription.id,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      }).eq('stripe_customer_id', subscription.customer as string);
      break;
    }
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      await supabase.from('subscriptions').update({
        status: 'canceled',
      }).eq('stripe_subscription_id', subscription.id);
      break;
    }
  }

  return NextResponse.json({ received: true });
}
```

---

## 7. Environment Variables

```bash
# .env.local

# ---- Supabase ----
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# ---- Apify ----
APIFY_API_TOKEN=apify_api_xxxxxxxxxxxxxxxx
APIFY_WEBHOOK_SECRET=whk_xxxxxxxxxxxxxxxx

# ---- OpenAI ----
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxx

# ---- Stripe ----
STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxx
STRIPE_MONTHLY_PRICE_ID=price_xxxxxxxxxxxxxxxx
STRIPE_ANNUAL_PRICE_ID=price_xxxxxxxxxxxxxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxxxxxx

# ---- App ----
NEXT_PUBLIC_APP_URL=https://www.instavibes.com
INTERNAL_API_KEY=xxxxxxxxxxxxxxxx

# ---- Email ----
RESEND_API_KEY=re_xxxxxxxxxxxxxxxx
```

---

## 8. API Routes Summary

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/apify/scrape-profile` | Protected | Scrape an Instagram profile |
| POST | `/api/apify/scrape-reel` | Protected | Scrape a single reel by URL |
| POST | `/api/apify/webhook` | API Key | Apify webhook callback |
| POST | `/api/ai/generate-script` | Protected | Generate script from source |
| POST | `/api/ai/analyze-voice` | Protected | Analyze creator voice profile |
| POST | `/api/webhooks/stripe` | Stripe Sig | Stripe webhook handler |
| GET | `/api/reels` | Protected | List/filter reels feed |
| GET | `/api/scripts` | Protected | List user's scripts |

---

## 9. Server Actions

```typescript
// src/actions/scripts.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { generateScript } from '@/lib/ai/prompts';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const GenerateScriptSchema = z.object({
  sourceUrl: z.string().url(),
  language: z.enum(['english', 'hindi', 'hinglish']),
});

export async function generateScriptAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const input = GenerateScriptSchema.parse({
    sourceUrl: formData.get('sourceUrl'),
    language: formData.get('language'),
  });

  // 1. Scrape the source reel
  const reelData = await scrapeReelByUrl(input.sourceUrl);

  // 2. Get user's voice profile
  const { data: brain } = await supabase
    .from('content_brains')
    .select('*')
    .eq('user_id', user.id)
    .single();

  // 3. Generate script via AI
  const result = await generateScript({
    sourceTranscript: reelData.transcript,
    voiceProfile: brain,
    language: input.language,
  });

  // 4. Save to database
  const { data: script } = await supabase.from('scripts').insert({
    user_id: user.id,
    source_url: input.sourceUrl,
    source_reel_id: reelData.id,
    title: result.idea,
    idea: result.idea,
    hook: result.hook,
    script_body: result.script,
    on_screen_text: result.on_screen_text,
    language: input.language,
    status: 'script',
  }).select().single();

  revalidatePath('/dashboard/studio');
  revalidatePath('/dashboard/library');
  return script;
}
```

---

## 10. Performance Optimizations

| Strategy | Implementation |
|----------|---------------|
| **Partial Prerendering (PPR)** | Static marketing shell with dynamic pricing/countdown |
| **React Server Components** | Default RSC for all pages; client components only when needed |
| **Image Optimization** | Next.js Image with AVIF/WebP, responsive sizes, blur placeholders |
| **Font Optimization** | Geist Sans variable font via `next/font/local` |
| **Route Prefetching** | Automatic prefetch on link hover (Next.js default) |
| **Database Queries** | Indexed columns, pagination cursors, connection pooling |
| **Edge Caching** | ISR for marketing pages (revalidate: 3600) |
| **Bundle Splitting** | Turbopack automatic code splitting |
| **Streaming** | React Suspense boundaries for async dashboard components |

---

## 11. Monitoring & Observability

| Tool | Purpose |
|------|---------|
| **Vercel Analytics** | Web Vitals, page performance |
| **Sentry** | Error tracking, performance monitoring |
| **Supabase Dashboard** | Database metrics, auth analytics |
| **Apify Console** | Actor run monitoring, usage tracking |
| **Stripe Dashboard** | Revenue, subscription metrics |

---

*This document provides the complete technical blueprint for implementing InstaVibes. All code samples are illustrative and should be adapted during implementation.*
