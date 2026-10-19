-- ============================================
-- INSTAVIBES — SUPABASE DATABASE SCHEMA
-- Run this SQL in the Supabase SQL Editor
-- ============================================

-- ============================================
-- 1. CUSTOM TYPES (ENUMS)
-- ============================================

CREATE TYPE subscription_status AS ENUM (
  'trialing', 'active', 'canceled', 'past_due', 'incomplete'
);

CREATE TYPE billing_interval AS ENUM ('month', 'year');

CREATE TYPE script_status AS ENUM (
  'idea', 'hook', 'script', 'filming', 'ready', 'posted'
);

CREATE TYPE scraper_job_status AS ENUM (
  'pending', 'running', 'succeeded', 'failed'
);

-- ============================================
-- 2. PROFILES (extends auth.users)
-- ============================================

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

COMMENT ON TABLE public.profiles IS 'User profiles extending Supabase auth.users';

-- ============================================
-- 3. SUBSCRIPTIONS & BILLING
-- ============================================

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

COMMENT ON TABLE public.subscriptions IS 'Stripe subscription tracking per user';

-- ============================================
-- 4. CONTENT BRAIN (Voice Profile)
-- ============================================

CREATE TABLE public.content_brains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  tone JSONB DEFAULT '[]'::jsonb,
  topics JSONB DEFAULT '[]'::jsonb,
  hooks_style JSONB DEFAULT '[]'::jsonb,
  audience TEXT,
  offers TEXT,
  storytelling_patterns JSONB DEFAULT '[]'::jsonb,
  language_preference TEXT DEFAULT 'english' CHECK (language_preference IN ('english', 'hindi', 'hinglish')),
  raw_analysis JSONB,
  last_analyzed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

COMMENT ON TABLE public.content_brains IS 'AI-generated voice profile for each creator';

-- ============================================
-- 5. SCRAPED REELS (from Apify)
-- ============================================

CREATE TABLE public.reels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL DEFAULT 'instagram' CHECK (platform = 'instagram'),
  platform_id TEXT NOT NULL,
  url TEXT NOT NULL,
  creator_handle TEXT,
  creator_name TEXT,
  creator_profile_pic TEXT,
  caption TEXT,
  transcript TEXT,
  thumbnail_url TEXT,
  video_url TEXT,
  view_count BIGINT DEFAULT 0,
  like_count BIGINT DEFAULT 0,
  comment_count BIGINT DEFAULT 0,
  share_count BIGINT DEFAULT 0,
  engagement_rate DECIMAL(8,6) DEFAULT 0,
  duration_seconds INTEGER,
  audio_name TEXT,
  hashtags JSONB DEFAULT '[]'::jsonb,
  niche TEXT,
  hook_text TEXT,
  hook_category TEXT CHECK (hook_category IN ('curiosity_gap', 'negative', 'authority', 'question', 'shock', 'story', 'statistic', NULL)),
  posted_at TIMESTAMPTZ,
  scraped_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(platform, platform_id)
);

COMMENT ON TABLE public.reels IS 'Instagram reels and video content scraped via Apify actors';

-- Indexes for fast feed queries
CREATE INDEX idx_reels_niche_views ON public.reels(niche, view_count DESC);
CREATE INDEX idx_reels_posted_at ON public.reels(posted_at DESC);
CREATE INDEX idx_reels_creator ON public.reels(creator_handle);
CREATE INDEX idx_reels_engagement ON public.reels(engagement_rate DESC);
CREATE INDEX idx_reels_platform ON public.reels(platform);

-- ============================================
-- 6. USER SCRIPTS (Generated Content)
-- ============================================

CREATE TABLE public.scripts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  source_reel_id UUID REFERENCES public.reels(id) ON DELETE SET NULL,
  source_url TEXT,
  title TEXT,
  idea TEXT,
  hook TEXT,
  script_body TEXT,
  on_screen_text TEXT,
  language TEXT DEFAULT 'english' CHECK (language IN ('english', 'hindi', 'hinglish')),
  status script_status DEFAULT 'idea',
  scheduled_date DATE,
  tags JSONB DEFAULT '[]'::jsonb,
  is_saved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.scripts IS 'AI-generated scripts for each user';

CREATE INDEX idx_scripts_user_status ON public.scripts(user_id, status);
CREATE INDEX idx_scripts_user_date ON public.scripts(user_id, scheduled_date);
CREATE INDEX idx_scripts_user_saved ON public.scripts(user_id, is_saved) WHERE is_saved = TRUE;

-- ============================================
-- 7. WATCHLIST (Creator Following)
-- ============================================

CREATE TABLE public.watchlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  creator_handle TEXT NOT NULL,
  creator_name TEXT,
  creator_profile_pic TEXT,
  creator_followers BIGINT DEFAULT 0,
  creator_avg_views BIGINT DEFAULT 0,
  creator_avg_likes BIGINT DEFAULT 0,
  last_scraped_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, creator_handle)
);

COMMENT ON TABLE public.watchlist IS 'Creators that users follow for breakout reel detection';

CREATE INDEX idx_watchlist_user ON public.watchlist(user_id, is_active);

-- ============================================
-- 8. COLLECTIONS (Swipe Files)
-- ============================================

CREATE TABLE public.collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#FF5A4E',
  icon TEXT DEFAULT 'folder',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.collections IS 'User-created folders for organizing saved content';

CREATE INDEX idx_collections_user ON public.collections(user_id);

CREATE TABLE public.collection_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID NOT NULL REFERENCES public.collections(id) ON DELETE CASCADE,
  reel_id UUID REFERENCES public.reels(id) ON DELETE CASCADE,
  script_id UUID REFERENCES public.scripts(id) ON DELETE CASCADE,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CHECK (reel_id IS NOT NULL OR script_id IS NOT NULL)
);

COMMENT ON TABLE public.collection_items IS 'Items saved in collections (reels or scripts)';

CREATE INDEX idx_collection_items_collection ON public.collection_items(collection_id);

-- ============================================
-- 9. SCRAPER JOBS (Apify Actor Runs)
-- ============================================

CREATE TABLE public.scraper_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  job_type TEXT NOT NULL CHECK (job_type IN ('profile_scrape', 'reel_scrape', 'watchlist_sync', 'niche_discovery', 'voice_analysis')),
  apify_run_id TEXT,
  input_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  status scraper_job_status DEFAULT 'pending',
  result_count INTEGER DEFAULT 0,
  error_message TEXT,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.scraper_jobs IS 'Tracking table for Apify actor runs';

CREATE INDEX idx_scraper_jobs_user ON public.scraper_jobs(user_id, status);
CREATE INDEX idx_scraper_jobs_apify ON public.scraper_jobs(apify_run_id);

-- ============================================
-- 10. ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_brains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watchlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scraper_jobs ENABLE ROW LEVEL SECURITY;

-- PROFILES: Users can read and update their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- SUBSCRIPTIONS: Users can only read their own subscription
CREATE POLICY "Users can view own subscription"
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- CONTENT BRAINS: Full CRUD on own brain
CREATE POLICY "Users can view own brain"
  ON public.content_brains FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own brain"
  ON public.content_brains FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- REELS: All authenticated users can read (public scraped content)
CREATE POLICY "Reels are readable by authenticated users"
  ON public.reels FOR SELECT
  TO authenticated
  USING (true);

-- SCRIPTS: Full CRUD on own scripts
CREATE POLICY "Users can view own scripts"
  ON public.scripts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create scripts"
  ON public.scripts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own scripts"
  ON public.scripts FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own scripts"
  ON public.scripts FOR DELETE
  USING (auth.uid() = user_id);

-- WATCHLIST: Full CRUD on own watchlist
CREATE POLICY "Users can view own watchlist"
  ON public.watchlist FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create watchlist entries"
  ON public.watchlist FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own watchlist"
  ON public.watchlist FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own watchlist entries"
  ON public.watchlist FOR DELETE
  USING (auth.uid() = user_id);

-- COLLECTIONS: Full CRUD on own collections
CREATE POLICY "Users can view own collections"
  ON public.collections FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create collections"
  ON public.collections FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own collections"
  ON public.collections FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own collections"
  ON public.collections FOR DELETE
  USING (auth.uid() = user_id);

-- COLLECTION ITEMS: Managed via collection ownership
CREATE POLICY "Users can view own collection items"
  ON public.collection_items FOR SELECT
  USING (
    collection_id IN (
      SELECT id FROM public.collections WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create collection items"
  ON public.collection_items FOR INSERT
  WITH CHECK (
    collection_id IN (
      SELECT id FROM public.collections WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own collection items"
  ON public.collection_items FOR DELETE
  USING (
    collection_id IN (
      SELECT id FROM public.collections WHERE user_id = auth.uid()
    )
  );

-- SCRAPER JOBS: Users can view their own jobs
CREATE POLICY "Users can view own scraper jobs"
  ON public.scraper_jobs FOR SELECT
  USING (auth.uid() = user_id);

-- ============================================
-- 11. DATABASE FUNCTIONS & TRIGGERS
-- ============================================

-- Auto-update updated_at column
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER content_brains_updated_at
  BEFORE UPDATE ON public.content_brains
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER scripts_updated_at
  BEFORE UPDATE ON public.scripts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER collections_updated_at
  BEFORE UPDATE ON public.collections
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================
-- 12. AUTO-CREATE PROFILE ON SIGNUP
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create profile
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'avatar_url', NEW.raw_user_meta_data ->> 'picture', '')
  );

  -- Create default subscription (3-day trial)
  INSERT INTO public.subscriptions (user_id, status, trial_end)
  VALUES (NEW.id, 'trialing', NOW() + INTERVAL '3 days');

  -- Create empty content brain
  INSERT INTO public.content_brains (user_id)
  VALUES (NEW.id);

  -- Create default collection
  INSERT INTO public.collections (user_id, name, description, icon)
  VALUES (NEW.id, 'Saved', 'Your saved reels and scripts', 'bookmark');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 13. HELPER VIEWS
-- ============================================

-- View: User with subscription status (for quick auth checks)
CREATE OR REPLACE VIEW public.user_with_subscription AS
SELECT
  p.id,
  p.email,
  p.full_name,
  p.avatar_url,
  p.instagram_handle,
  p.onboarding_completed,
  s.status AS subscription_status,
  s.billing_interval,
  s.trial_end,
  s.current_period_end,
  CASE
    WHEN s.status IN ('trialing', 'active') AND (s.current_period_end IS NULL OR s.current_period_end > NOW()) THEN TRUE
    WHEN s.status = 'trialing' AND s.trial_end > NOW() THEN TRUE
    ELSE FALSE
  END AS is_subscribed
FROM public.profiles p
LEFT JOIN public.subscriptions s ON s.user_id = p.id;

-- ============================================
-- DONE! ✅
-- ============================================
-- Tables created: 9
-- Enums created: 4
-- Indexes created: 12
-- RLS policies: 18
-- Triggers: 6
-- Functions: 2
-- Views: 1
-- ============================================
