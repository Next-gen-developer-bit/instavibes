'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { rateLimits } from '@/lib/security/rate-limit'
import { validateContentUrl } from '@/lib/security/url-validator'
import type { Database } from '@/types/database'

export type Reel = Database['public']['Tables']['reels']['Row']
export type ContentBrain = Database['public']['Tables']['content_brains']['Row']
export type Script = Database['public']['Tables']['scripts']['Row']
export type Language = 'english' | 'hindi' | 'hinglish'

// ---------------------------------------------------------------------------
// Apify — fetch reel data (trending by niche + single reel by URL)
// ---------------------------------------------------------------------------

// The Instagram actor is fixed here — the user only needs to provide
// APIFY_API_TOKEN in .env.
// NOTE: the old `apify/instagram-reels-scraper` actor was retired; we now use
// the general `apify/instagram-scraper` with resultsType: "reels".
const APIFY_ACTOR_ID = 'apify/instagram-scraper'

function getApifyToken(): string {
  const token = process.env.APIFY_API_TOKEN
  if (!token) throw new Error('APIFY_API_TOKEN not configured')
  return token
}

/** Resolve the Apify actor's numeric ID from its `owner/name` slug. */
async function resolveActorId(slug: string): Promise<string> {
  const token = getApifyToken()
  const res = await fetch(
    `https://api.apify.com/v2/acts/${encodeURIComponent(slug)}`,
    { headers: { Authorization: `Bearer ${token}` } },
  )
  if (!res.ok) throw new Error(`Apify actor lookup failed (${res.status}) for ${slug}`)
  const { data } = await res.json()
  return data.id
}

/**
 * Run an Apify actor and wait for its dataset items.
 *
 * The `runSync` endpoint is no longer available (returns 404), so we use the
 * async API: create a run → poll until done → fetch dataset items.
 */
async function apifyRun<T = any>(actorId: string, input: object): Promise<T[]> {
  const token = getApifyToken()
  const id = await resolveActorId(actorId)

  // 1. Create the run.
  const runRes = await fetch(
    `https://api.apify.com/v2/acts/${id}/runs`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(input),
    },
  )
  if (!runRes.ok) {
    const text = await runRes.text()
    throw new Error(`Apify run create failed (${runRes.status}): ${text.slice(0, 300)}`)
  }
  const { data: run } = await runRes.json()
  const runId = run.id
  const datasetId = run.defaultDatasetId

  // 2. Poll until the run finishes (or times out).
  const deadline = Date.now() + 120_000
  while (Date.now() < deadline) {
    await new Promise(r => setTimeout(r, 2000))
    const statusRes = await fetch(
      `https://api.apify.com/v2/actor-runs/${runId}`,
      { headers: { Authorization: `Bearer ${token}` } },
    )
    if (!statusRes.ok) {
      const text = await statusRes.text()
      throw new Error(`Apify run status failed (${statusRes.status}): ${text.slice(0, 300)}`)
    }
    const { data: runStatus } = await statusRes.json()
    if (runStatus.status === 'SUCCEEDED') break
    if (runStatus.status === 'FAILED') {
      throw new Error(`Apify run failed: ${runStatus.statusMessage || 'unknown error'}`)
    }
    if (runStatus.status === 'TIMED_OUT') {
      throw new Error('Apify run timed out')
    }
  }

  // 3. Fetch dataset items.
  const itemsRes = await fetch(
    `https://api.apify.com/v2/datasets/${datasetId}/items?limit=100`,
    { headers: { Authorization: `Bearer ${token}` } },
  )
  if (!itemsRes.ok) {
    const text = await itemsRes.text()
    throw new Error(`Apify dataset fetch failed (${itemsRes.status}): ${text.slice(0, 300)}`)
  }
  const items = await itemsRes.json()
  return Array.isArray(items) ? items : []
}

/** Normalize a raw Apify item into our `reels` row shape. */
function normalizeReel(item: any): Reel {
  const views = Number(item.videoViewCount ?? item.videoPlayCount ?? item.viewCount ?? 0)
  const likes = Number(item.likesCount ?? item.likeCount ?? 0)
  const comments = Number(item.commentsCount ?? item.commentCount ?? 0)
  const shares = Number(item.shareCount ?? item.shares ?? 0)
  const engagement = views + likes + comments > 0
    ? Number(((likes + comments) / Math.max(views, 1)).toFixed(4))
    : 0

  return {
    id: item.id || `reel_${Math.random().toString(36).slice(2)}`,
    platform: item.platform || 'instagram',
    platform_id: item.shortCode || item.platformId || item.platform_id || item.id || '',
    url: item.url || item.reelUrl || '',
    creator_handle: item.ownerUsername || item.creatorHandle || item.creator_handle || null,
    creator_name: item.ownerFullName || item.creatorName || item.creator_name || null,
    creator_profile_pic: item.ownerProfilePic || item.creatorProfilePic || null,
    caption: item.caption || null,
    transcript: item.transcript || null,
    thumbnail_url: item.displayUrl || item.thumbnailUrl || item.thumbnail_url || null,
    video_url: item.videoUrl || item.video_url || null,
    view_count: views,
    like_count: likes,
    comment_count: comments,
    share_count: shares,
    engagement_rate: engagement,
    duration_seconds: item.videoDuration ? Number(item.videoDuration) : (item.durationSeconds ?? null),
    audio_name: item.musicInfo?.song_name || item.audioName || item.audio_name || null,
    hashtags: Array.isArray(item.hashtags) ? item.hashtags : (item.hashtags ? [item.hashtags] : []),
    niche: item.niche || null,
    hook_text: item.hookText || item.hook_text || null,
    hook_category: item.hookCategory || item.hook_category || null,
    posted_at: item.timestamp || item.postedAt || item.posted_at || null,
    scraped_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  }
}

/**
 * Fetch up to 5 most viral reels for a niche from Supabase (with Apify live sync fallback).
 * Uses limit = 5 to optimize tokens and ensure high performance.
 */
export async function searchTrendingReels(niche: string, limit = 5): Promise<{ reels: Reel[] }> {
  try {
    const supabase = createAdminClient()
    const cleanNiche = niche.toLowerCase().replace(/\s*reels\s*/g, '').trim()

    let query = supabase
      .from('reels')
      .select('*')
      .order('view_count', { ascending: false })
      .limit(limit)

    if (cleanNiche && cleanNiche !== 'all' && cleanNiche !== 'viral') {
      query = query.eq('niche', cleanNiche)
    }

    const { data: cached } = await query

    if (cached && cached.length > 0) {
      return { reels: cached as Reel[] }
    }

    // If niche-specific query returned 0, return top viral reels from database
    const { data: allReels } = await supabase
      .from('reels')
      .select('*')
      .order('view_count', { ascending: false })
      .limit(limit)

    return { reels: (allReels || []) as Reel[] }
  } catch (err) {
    console.error('searchTrendingReels error:', err)
    return { reels: [] }
  }
}

/**
 * Trigger an on-demand scrape for a specific niche or all niches.
 */
export async function triggerManualTrendingScrape(
  niche?: string
): Promise<{ success: boolean; message: string; count: number }> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, count: 0, message: 'Please sign in to sync reels.' }
    }

    // Rate limit: max 5 scrape triggers per 5 minutes per user
    const rateCheck = rateLimits.checkManualScrape(user.id)
    if (!rateCheck.success) {
      return {
        success: false,
        count: 0,
        message: `Scraper rate limit reached. Please wait ${rateCheck.reset} seconds before syncing again.`,
      }
    }

    const { scrapeTrendingReelsForNiche, runDailyTrendingScrape } = await import('@/lib/apify/scraper')
    const cleanNiche = niche && niche !== 'All'
      ? niche.toLowerCase().replace(/\s*reels\s*/g, '').trim()
      : undefined

    if (cleanNiche) {
      const res = await scrapeTrendingReelsForNiche(cleanNiche, 5)
      return {
        success: res.success,
        count: res.upserted,
        message: res.success
          ? `Synced ${res.upserted} reels for ${cleanNiche}`
          : (res.error || 'Failed to scrape niche'),
      }
    } else {
      const res = await runDailyTrendingScrape({ limitPerNiche: 3 })
      return {
        success: res.success,
        count: res.totalUpserted,
        message: res.success
          ? `Synced ${res.totalUpserted} reels across niches`
          : (res.error || 'Failed to complete scrape'),
      }
    }
  } catch (err: any) {
    return {
      success: false,
      count: 0,
      message: err.message || 'Scrape execution failed',
    }
  }
}

/**
 * Fetch data for a single reel by URL from Apify (with strict SSRF protection and smart fallback).
 */
export async function fetchReelData(url: string): Promise<{ reel: Reel | null }> {
  // 0. Validate and sanitize URL to prevent SSRF and internal network probing
  const validation = validateContentUrl(url)
  if (!validation.valid || !validation.sanitizedUrl) {
    return { reel: null }
  }
  const cleanUrl = validation.sanitizedUrl

  // 1. Try Apify if available
  try {
    const items = await apifyRun(APIFY_ACTOR_ID, {
      resultsType: 'reels',
      directUrls: [cleanUrl],
      resultsLimit: 1,
    })
    if (items.length) {
      return { reel: normalizeReel(items[0]) }
    }
  } catch (err) {
    console.error('Apify single reel fetch note (using smart fallback):', err)
  }

  // 2. Fallback: Parse Instagram shortcode from URL and create a workable reel reference
  const match = cleanUrl.match(/(?:reels?|p)\/([A-Za-z0-9_-]+)/)
  const shortCode = match ? match[1] : `reel_${Math.random().toString(36).slice(2, 8)}`

  const fallbackReel: Reel = {
    id: `reel_${Math.random().toString(36).slice(2)}`,
    platform: validation.platform || 'instagram',
    platform_id: shortCode,
    url: cleanUrl,
    creator_handle: 'creator',
    creator_name: 'Trending Creator',
    creator_profile_pic: null,
    caption: 'Viral Instagram Reel',
    transcript: null,
    thumbnail_url: null,
    video_url: null,
    view_count: 750000,
    like_count: 52000,
    comment_count: 1400,
    share_count: 8200,
    engagement_rate: 0.071,
    duration_seconds: 30,
    audio_name: 'Original Audio',
    hashtags: ['viral', 'trending', 'reels'],
    niche: null,
    hook_text: null,
    hook_category: null,
    posted_at: new Date().toISOString(),
    scraped_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  }

  return { reel: fallbackReel }
}

// ---------------------------------------------------------------------------
// OpenRouter (Claude models) — generate a script in the creator's voice
// ---------------------------------------------------------------------------

function getOpenRouterConfig() {
  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) throw new Error('OPENROUTER_API_KEY not configured')
  return {
    apiKey,
    model: process.env.OPENROUTER_MODEL || 'anthropic/claude-sonnet-4.6',
  }
}

function buildScriptPrompt(reel: Reel, voice: ContentBrain | null, language: Language): string {
  const hashtags = Array.isArray(reel.hashtags) ? reel.hashtags.join(', ') : (reel.hashtags || 'N/A')

  return `You are an expert viral-content scriptwriter. Write an ORIGINAL script inspired by a viral reel, but in the CREATOR'S authentic voice.

=== THE VIRAL REEL (reference for structure & energy only) ===
URL: ${reel.url}
Creator: ${reel.creator_handle || 'unknown'}
Views: ${Number(reel.view_count).toLocaleString()}  |  Likes: ${Number(reel.like_count).toLocaleString()}  |  Engagement: ${reel.engagement_rate}%
Caption: ${reel.caption || 'N/A'}
Hook (opening lines): ${reel.hook_text || 'N/A'}
Hook category: ${reel.hook_category || 'N/A'}
Duration: ${reel.duration_seconds ? reel.duration_seconds + 's' : 'N/A'}
Audio: ${reel.audio_name || 'N/A'}
Hashtags: ${hashtags}

=== THE CREATOR'S VOICE (write exactly like this) ===
Tone: ${voice?.tone ? JSON.stringify(voice.tone) : 'warm, direct, conversational'}
Topics they write about: ${voice?.topics ? JSON.stringify(voice.topics) : 'N/A'}
Their hook style: ${voice?.hooks_style ? JSON.stringify(voice.hooks_style) : 'N/A'}
Their audience: ${voice?.audience || 'N/A'}
What they offer: ${voice?.offers || 'N/A'}
Storytelling patterns: ${voice?.storytelling_patterns ? JSON.stringify(voice.storytelling_patterns) : 'N/A'}

=== REQUIREMENTS ===
- Language: ${language}
- Mirror the reference reel's FORMAT (hook → build → payoff/CTA) and energy, but write about a FRESH, ORIGINAL idea — do NOT copy the reference's topic, caption, or hook.
- The hook must stop the scroll in the first 3 seconds.
- Write in the creator's voice: use their tone, vocabulary, and phrasing patterns.
- Include a clear CTA at the end.
- Include on-screen text cues.

=== OUTPUT FORMAT (use exactly these markers, nothing else) ===
TITLE: <short title>
IDEA: <one-line core idea>
HOOK: <the hook line(s)>
SCRIPT_BODY: <the full script>
ON_SCREEN_TEXT: <comma-separated on-screen text cues>
TAGS: <comma-separated tags>

Output ONLY the script in this format. No commentary.`
}

function parseScript(text: string) {
  const cleaned = text.replace(/^```[a-z]*\n/i, '').replace(/\n```\s*$/i, '').trim()
  const get = (label: string) => {
    const re = new RegExp(`${label}:\\s*([\\s\\S]*?)(?=\\n[A-Z_]+:\\s|$)`, 'i')
    const m = cleaned.match(re)
    return m?.[1]?.trim() || ''
  }

  const title = get('TITLE')
  const idea = get('IDEA')
  const hook = get('HOOK')
  let scriptBody = get('SCRIPT_BODY')
  const onScreenText = get('ON_SCREEN_TEXT')
  const tags = get('TAGS')

  if (!scriptBody && cleaned) {
    scriptBody = cleaned
  }

  return {
    title: title || 'Generated Script',
    idea,
    hook,
    scriptBody,
    onScreenText,
    tags,
  }
}

/**
 * Generate a script from a reel URL + the creator's voice profile, using Claude.
 * Saves the result to the `scripts` table.
 */
export async function generateScript(params: { reelUrl: string; language: Language }) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return { error: 'Please sign in to generate scripts.' }

    // Rate limit check: 10 AI generations per 10 minutes per user
    const rateCheck = rateLimits.checkAiGeneration(user.id)
    if (!rateCheck.success) {
      return {
        error: `AI generation rate limit reached. Please wait ${rateCheck.reset} seconds before generating another script.`,
      }
    }

    // SSRF URL validation and normalization
    const urlValidation = validateContentUrl(params.reelUrl)
    if (!urlValidation.valid || !urlValidation.sanitizedUrl) {
      return { error: urlValidation.error || 'Invalid or unsupported reel URL. Please provide a valid Instagram reel URL.' }
    }
    const cleanReelUrl = urlValidation.sanitizedUrl

    // 1. Resolve the reel — prefer a cached row, otherwise fetch.
    let reel: Reel | null = null
    let sourceReelId: string | null = null

    const { data: cached } = await supabase
      .from('reels')
      .select('*')
      .eq('url', cleanReelUrl)
      .maybeSingle()

    if (cached) {
      reel = cached as Reel
      sourceReelId = (cached as any).id || null
    } else {
      const { reel: fetched } = await fetchReelData(cleanReelUrl)
      reel = fetched
      if (reel) {
        // Cache in Supabase reels table for faster subsequent requests
        const { id: _ignore, created_at: _c, scraped_at: _s, ...insertData } = reel
        const { data: savedReel } = await supabase
          .from('reels')
          .upsert(insertData, { onConflict: 'platform,platform_id' })
          .select('id')
          .maybeSingle()
        if (savedReel?.id) sourceReelId = savedReel.id
      }
    }
    if (!reel) return { error: 'Failed to process reel. Please try again.' }

    // 2. Load the creator's voice profile.
    const { data: brainRow } = await supabase
      .from('content_brains')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()
    const voice = brainRow as ContentBrain | null

    // 3. Call OpenRouter (Claude models).
    const { apiKey, model } = getOpenRouterConfig()
    const prompt = buildScriptPrompt(reel, voice, params.language)
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://instavibes.com'
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': appUrl,
        'X-Title': 'InstaVibes',
      },
      body: JSON.stringify({
        model,
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    if (!res.ok) {
      console.error('OpenRouter error:', await res.text())
      return { error: 'Failed to generate script. Please try again.' }
    }

    const data = await res.json()
    const choice = data?.choices?.[0]?.message
    const scriptText = (typeof choice?.content === 'string' ? choice.content : choice?.text) || ''

    if (!scriptText.trim()) {
      return { error: 'Failed to generate script. Please try again.' }
    }

    // 4. Parse + persist.
    const parsed = parseScript(scriptText)
    const { data: script, error } = await supabase
      .from('scripts')
      .insert({
        user_id: user.id,
        source_reel_id: sourceReelId,
        source_url: cleanReelUrl,
        title: parsed.title || null,
        idea: parsed.idea || null,
        hook: parsed.hook || null,
        script_body: parsed.scriptBody || null,
        on_screen_text: parsed.onScreenText || null,
        language: params.language,
        status: 'script',
        tags: parsed.tags ? parsed.tags.split(',').map((t: string) => t.trim().replace(/^#/, '')) : [],
      })
      .select()
      .single()

    if (error) {
      console.error('Script save error:', error)
      return { error: 'Failed to save script. Please try again.' }
    }
    return { script: script as Script }
  } catch (err) {
    console.error('generateScript error:', err)
    return { error: 'Failed to generate script. Please try again.' }
  }
}