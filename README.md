# InstaVibes ⚡

> **AI Viral Script Generator & Content Planner for Instagram Creators.**  
> Turn viral Instagram reels into high-converting scripts written in your authentic voice — in English, Hindi, and Hinglish.

---

## 🚀 Features

- **🎙️ Script Studio**: Paste any Instagram Reel link and instantly get a rewritten script with an attention-grabbing 3-second hook, body, and on-screen text.
- **🧠 Content Brain**: Calibrates to your niche, audience, and storytelling style so scripts always sound like you.
- **🔥 Trending Outlier Radar**: Scrapes viral reels across niches (Tech, Finance, Fitness, E-commerce, Lifestyle) to find breakout hooks.
- **📅 Interactive Content Calendar**: Plan shooting dates, track video production status (`Scripted`, `To Film`, `Ready to Post`, `Published`), and organize your content cadence.
- **📚 Creator Library & Reel Vault**: Search, filter, and review all your generated scripts and analyzed reel inspiration in one centralized archive.
- **💳 Monetization with Creem**: Native Merchant of Record integration with 3-day free trials, monthly/annual billing, and webhooks.
- **🛡️ Enterprise-Grade Security**: In-memory rate limiting, Supabase Row-Level Security (RLS), and zero-leakage architecture.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router & Turbopack)
- **Frontend**: React 19, Tailwind CSS, Lucide Icons, Framer Motion
- **Database & Auth**: Supabase (PostgreSQL with Row Level Security)
- **AI Engine**: OpenRouter / Claude Sonnet / OpenAI
- **Reel Scraping**: Apify Instagram Scraper API
- **Checkout & Subscriptions**: Creem.io (Merchant of Record)

---

## ⚙️ Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Apify (Instagram Scraper)
APIFY_API_TOKEN=your-apify-token

# AI Generation (OpenRouter / Claude / OpenAI)
OPENROUTER_API_KEY=your-openrouter-key
OPENROUTER_MODEL=anthropic/claude-sonnet-4.6

# Cron Secret for Scheduled Scrapers
CRON_SECRET=your-secure-random-secret

# Creem Checkout & Webhooks
NEXT_PUBLIC_CREEM_CHECKOUT_URL=https://checkout.creem.io/your-product-id
# CREEM_API_KEY=your-creem-api-key
# CREEM_WEBHOOK_SECRET=your-creem-webhook-secret
```

---

## 📦 Getting Started Locally

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚢 Deployment

### Frontend (Vercel)
1. Import this repository into [Vercel](https://vercel.com).
2. Add your environment variables in **Project Settings &rarr; Environment Variables**.
3. Deploy! Vercel will automatically build with Next.js and register the cron job defined in `vercel.json`.

### Backend & Database (Supabase / Railway)
1. In your [Supabase](https://supabase.com) dashboard, open the **SQL Editor**.
2. Run the migration script in `supabase/migrations/001_initial_schema.sql` to create all tables, enums, indexes, and RLS policies.
3. Configure your webhook URL in Creem: `https://your-domain.com/api/webhooks/creem`.

---

## 📄 License

Proprietary © InstaVibes. All rights reserved.
