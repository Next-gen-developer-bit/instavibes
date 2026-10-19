import { createAdminClient } from '@/lib/supabase/admin'
import type { Database } from '@/types/database'

export type Reel = Database['public']['Tables']['reels']['Row']
export type ReelInsert = Database['public']['Tables']['reels']['Insert']

export const APIFY_ACTOR_ID = 'apify/instagram-scraper'

export const NICHE_CONFIG: Record<string, { hashtag: string; fallbackKeywords: string[] }> = {
  tech: { hashtag: 'techreels', fallbackKeywords: ['ai', 'tech', 'coding'] },
  finance: { hashtag: 'financereels', fallbackKeywords: ['finance', 'money', 'investing'] },
  fitness: { hashtag: 'fitnessreels', fallbackKeywords: ['fitness', 'workout', 'gym'] },
  lifestyle: { hashtag: 'lifestylereels', fallbackKeywords: ['lifestyle', 'vlog', 'productivity'] },
  comedy: { hashtag: 'comedyreels', fallbackKeywords: ['comedy', 'relatable', 'memes'] },
  'e-commerce': { hashtag: 'ecommercetips', fallbackKeywords: ['ecommerce', 'dropshipping', 'business'] },
  travel: { hashtag: 'travelreels', fallbackKeywords: ['travel', 'wanderlust', 'vacation'] },
  food: { hashtag: 'foodreels', fallbackKeywords: ['foodie', 'recipe', 'cooking'] },
}

export const ALL_NICHES = Object.keys(NICHE_CONFIG)

function getApifyToken(): string {
  const token = process.env.APIFY_API_TOKEN
  if (!token) throw new Error('APIFY_API_TOKEN not configured')
  return token
}

/** Resolve the Apify actor's numeric or URL-safe ID. */
async function resolveActorId(slug: string): Promise<string> {
  const token = getApifyToken()
  const res = await fetch(
    `https://api.apify.com/v2/acts/${encodeURIComponent(slug)}`,
    { headers: { Authorization: `Bearer ${token}` } }
  )
  if (!res.ok) {
    const errorText = await res.text()
    throw new Error(`Apify actor lookup failed (${res.status}): ${errorText.slice(0, 200)}`)
  }
  const { data } = await res.json()
  return data.id
}

/**
 * Execute an Apify actor run and wait for its dataset items.
 */
export async function runApifyActor<T = any>(
  actorId: string,
  input: object,
  timeoutMs = 90_000
): Promise<{ items: T[]; runId?: string }> {
  const token = getApifyToken()
  const id = await resolveActorId(actorId)

  // 1. Create run
  const runRes = await fetch(`https://api.apify.com/v2/acts/${id}/runs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(input),
  })

  if (!runRes.ok) {
    const text = await runRes.text()
    let errorMsg = `Apify run creation failed (${runRes.status})`
    try {
      const parsed = JSON.parse(text)
      if (parsed.error?.message) {
        errorMsg += `: ${parsed.error.message}`
      }
    } catch {
      errorMsg += `: ${text.slice(0, 250)}`
    }
    throw new Error(errorMsg)
  }

  const { data: run } = await runRes.json()
  const runId = run.id
  const datasetId = run.defaultDatasetId

  // 2. Poll until the run finishes
  const deadline = Date.now() + timeoutMs
  while (Date.now() < deadline) {
    await new Promise((r) => setTimeout(r, 2000))
    const statusRes = await fetch(`https://api.apify.com/v2/actor-runs/${runId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!statusRes.ok) {
      const text = await statusRes.text()
      throw new Error(`Apify run status check failed (${statusRes.status}): ${text.slice(0, 250)}`)
    }

    const { data: runStatus } = await statusRes.json()
    if (runStatus.status === 'SUCCEEDED') break
    if (runStatus.status === 'FAILED') {
      throw new Error(`Apify run failed: ${runStatus.statusMessage || 'unknown actor failure'}`)
    }
    if (runStatus.status === 'TIMED_OUT' || runStatus.status === 'ABORTED') {
      throw new Error(`Apify run ended with status: ${runStatus.status}`)
    }
  }

  // 3. Fetch dataset items
  const itemsRes = await fetch(`https://api.apify.com/v2/datasets/${datasetId}/items?limit=50`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!itemsRes.ok) {
    const text = await itemsRes.text()
    throw new Error(`Apify dataset fetch failed (${itemsRes.status}): ${text.slice(0, 250)}`)
  }

  const items = await itemsRes.json()
  return {
    items: Array.isArray(items) ? items : [],
    runId,
  }
}

/**
 * Normalizes an Apify result into our Supabase `reels` row shape.
 */
export function normalizeScrapedReel(item: any, niche: string): ReelInsert {
  const shortCode = item.shortCode || item.code || item.platform_id || `reel_${Math.random().toString(36).slice(2, 9)}`
  const views = Number(item.videoViewCount ?? item.videoPlayCount ?? item.viewCount ?? item.playCount ?? 0)
  const likes = Number(item.likesCount ?? item.likeCount ?? item.likes ?? 0)
  const comments = Number(item.commentsCount ?? item.commentCount ?? item.comments ?? 0)
  const shares = Number(item.shareCount ?? item.shares ?? 0)
  const engagement = views + likes + comments > 0
    ? Number(((likes + comments) / Math.max(views, 1)).toFixed(4))
    : 0

  return {
    platform: 'instagram',
    platform_id: shortCode,
    url: item.url || item.reelUrl || `https://www.instagram.com/reel/${shortCode}/`,
    creator_handle: item.ownerUsername || item.creatorHandle || item.owner?.username || 'creator',
    creator_name: item.ownerFullName || item.creatorName || item.owner?.full_name || null,
    creator_profile_pic: item.ownerProfilePic || item.creatorProfilePic || item.owner?.profile_pic_url || null,
    caption: item.caption || item.text || null,
    transcript: item.transcript || null,
    thumbnail_url: item.displayUrl || item.thumbnailUrl || item.imageUrl || null,
    video_url: item.videoUrl || null,
    view_count: views,
    like_count: likes,
    comment_count: comments,
    share_count: shares,
    engagement_rate: engagement,
    duration_seconds: item.videoDuration ? Math.round(Number(item.videoDuration)) : null,
    audio_name: item.musicInfo?.song_name || item.audioName || null,
    hashtags: Array.isArray(item.hashtags) ? item.hashtags : [],
    niche,
    hook_text: item.caption ? item.caption.slice(0, 120) : null,
    hook_category: null,
    posted_at: item.timestamp || item.postedAt || new Date().toISOString(),
    scraped_at: new Date().toISOString(),
  }
}

/**
 * Scrapes trending reels for a single niche and upserts into Supabase.
 */
export async function scrapeTrendingReelsForNiche(
  niche: string,
  limit = 5
): Promise<{ success: boolean; upserted: number; error?: string }> {
  const config = NICHE_CONFIG[niche]
  if (!config) {
    return { success: false, upserted: 0, error: `Unknown niche: ${niche}` }
  }

  const supabase = createAdminClient()

  try {
    const { items } = await runApifyActor(APIFY_ACTOR_ID, {
      search: `#${config.hashtag}`,
      searchType: 'hashtag',
      resultsType: 'posts',
      resultsLimit: limit,
    })

    if (!items || items.length === 0) {
      return { success: true, upserted: 0 }
    }

    const reelsToUpsert = items.map((item) => normalizeScrapedReel(item, niche))

    const { error: upsertErr } = await supabase.from('reels').upsert(reelsToUpsert, {
      onConflict: 'platform,platform_id',
    })

    if (upsertErr) {
      throw new Error(`Database upsert error: ${upsertErr.message}`)
    }

    return { success: true, upserted: reelsToUpsert.length }
  } catch (err: any) {
    return { success: false, upserted: 0, error: err.message || 'Scrape failed' }
  }
}

/**
 * Main 24-hour periodic job runner.
 * Iterates through niches, calls Apify, upserts to Supabase, and logs to `scraper_jobs`.
 * Gracefully preserves existing cached reels if Apify fails or credits are exhausted.
 */
export async function runDailyTrendingScrape(options?: {
  niches?: string[]
  limitPerNiche?: number
}): Promise<{
  jobId: string
  success: boolean
  totalUpserted: number
  nicheResults: Record<string, { success: boolean; count: number; error?: string }>
  error?: string
}> {
  const supabase = createAdminClient()
  const targetNiches = options?.niches && options.niches.length > 0 ? options.niches : ALL_NICHES
  const limitPerNiche = options?.limitPerNiche || 5

  // 1. Create job entry in `scraper_jobs` table
  const { data: job, error: jobCreateErr } = await supabase
    .from('scraper_jobs')
    .insert({
      job_type: 'niche_discovery',
      status: 'running',
      started_at: new Date().toISOString(),
      input_data: { niches: targetNiches, limitPerNiche, schedule: '24h_cron' },
    })
    .select()
    .single()

  const jobId = job?.id || 'untracked'

  const nicheResults: Record<string, { success: boolean; count: number; error?: string }> = {}
  let totalUpserted = 0
  let firstFatalError: string | null = null

  // 2. Iterate through niches sequentially to respect Apify concurrency and memory limits
  for (const niche of targetNiches) {
    const result = await scrapeTrendingReelsForNiche(niche, limitPerNiche)
    nicheResults[niche] = {
      success: result.success,
      count: result.upserted,
      error: result.error,
    }

    if (result.success) {
      totalUpserted += result.upserted
    } else if (!firstFatalError && result.error) {
      firstFatalError = result.error
      // If error is hard credit exhaustion, stop loop early to avoid wasted retries
      if (result.error.includes('Monthly usage hard limit') || result.error.includes('403')) {
        break
      }
    }
  }

  const overallSuccess = totalUpserted > 0 || !firstFatalError

  // 3. Update job completion status in `scraper_jobs`
  if (job?.id) {
    await supabase
      .from('scraper_jobs')
      .update({
        status: overallSuccess ? 'succeeded' : 'failed',
        result_count: totalUpserted,
        error_message: firstFatalError || null,
        completed_at: new Date().toISOString(),
      })
      .eq('id', job.id)
  }

  return {
    jobId,
    success: overallSuccess,
    totalUpserted,
    nicheResults,
    error: firstFatalError || undefined,
  }
}
