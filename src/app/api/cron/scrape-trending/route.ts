import { NextRequest, NextResponse } from 'next/server'
import { runDailyTrendingScrape, ALL_NICHES, NICHE_CONFIG } from '@/lib/apify/scraper'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'
export const maxDuration = 300 // Max execution time for scheduled tasks on Pro/serverless

async function handleScrape(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  const urlSecret = request.nextUrl.searchParams.get('secret')
  const isDev = process.env.NODE_ENV === 'development'

  // Security check: in production, strictly require matching CRON_SECRET
  if (!isDev) {
    if (!cronSecret || (authHeader !== `Bearer ${cronSecret}` && urlSecret !== cronSecret)) {
      return NextResponse.json(
        { error: 'Unauthorized: Invalid or missing cron secret' },
        { status: 401 }
      )
    }
  }

  // Parse optional query params (e.g. to test single niche or custom limit)
  const singleNiche = request.nextUrl.searchParams.get('niche')?.toLowerCase()
  const customLimit = Number(request.nextUrl.searchParams.get('limit')) || 5

  const targetNiches = singleNiche && NICHE_CONFIG[singleNiche]
    ? [singleNiche]
    : ALL_NICHES

  const startTime = Date.now()

  try {
    const scrapeResult = await runDailyTrendingScrape({
      niches: targetNiches,
      limitPerNiche: customLimit,
    })

    const supabase = createAdminClient()
    const { count: totalCachedReels } = await supabase
      .from('reels')
      .select('*', { count: 'exact', head: true })

    const durationSeconds = Number(((Date.now() - startTime) / 1000).toFixed(2))

    return NextResponse.json({
      success: scrapeResult.success,
      timestamp: new Date().toISOString(),
      schedule: '24h',
      durationSeconds,
      jobId: scrapeResult.jobId,
      totalUpserted: scrapeResult.totalUpserted,
      totalCachedReels: totalCachedReels || 0,
      nichesAttempted: targetNiches,
      nicheBreakdown: scrapeResult.nicheResults,
      notice: scrapeResult.error
        ? `Note: ${scrapeResult.error}. Existing cached reels remain safely preserved for user visits.`
        : 'All targeted niches successfully scraped and updated in cache.',
    })
  } catch (err: any) {
    console.error('Cron scrape-trending unexpected fatal error:', err)
    return NextResponse.json(
      {
        success: false,
        error: err.message || 'Unexpected scraper error',
        timestamp: new Date().toISOString(),
        notice: 'Existing cached reels in Supabase are safely preserved.',
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  return handleScrape(request)
}

export async function POST(request: NextRequest) {
  return handleScrape(request)
}
