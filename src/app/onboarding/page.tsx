'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Sparkles,
  Zap,
  Check,
  ArrowRight,
  HelpCircle,
  LogOut,
  ChevronLeft,
  Loader2,
  Instagram,
  Mic,
  User,
  Calendar,
  Rocket,
  CheckCircle2,
  X,
  RotateCw
} from 'lucide-react'
import { completeOnboarding } from '@/actions/onboarding'
import { signOut } from '@/actions/auth'

const STEPS = [
  {
    id: 1,
    title: 'Find your content',
    desc: 'Your handle, so we can read your niche and your hooks from what is already public.',
  },
  {
    id: 2,
    title: 'Match your voice',
    desc: 'How you sound, and the language we write in.',
  },
  {
    id: 3,
    title: 'About you',
    desc: 'Who you are, what you are working towards, and how you show up on camera.',
  },
  {
    id: 4,
    title: 'Plan your content',
    desc: 'The formats you want to make and the themes you want to be known for.',
  },
  {
    id: 5,
    title: 'Launch your workspace',
    desc: 'Look over your Content Brain, then start your free trial.',
  },
]

const TONE_OPTIONS = [
  { id: 'Conversational', label: 'Conversational & Casual', desc: 'Friendly, relatable, direct' },
  { id: 'Bold', label: 'Bold & Provocative', desc: 'Strong opinions, scroll-stopping' },
  { id: 'Educational', label: 'Educational & Actionable', desc: 'Clear step-by-step breakdowns' },
  { id: 'Energetic', label: 'Energetic & Hyped', desc: 'Fast-paced, vibrant, captivating' },
  { id: 'Storyteller', label: 'Storyteller', desc: 'Relatable anecdotes, problem to solution' },
  { id: 'Raw', label: 'Raw & Unfiltered', desc: 'Authentic, no-BS reality' },
]

const HOOK_STYLES = [
  'Scroll-stopping question',
  'Shocking / Contrarian statement',
  '"Stop doing X" warning',
  'Personal confession / failure',
  'Before vs After breakdown',
]

const AUDIENCE_OPTIONS = [
  'Creators & Freelancers',
  'Founders & Entrepreneurs',
  'Fitness & Health Enthusiasts',
  'Tech & AI Professionals',
  'Students & Early Career',
  'General Broad Audience',
]

const OFFER_OPTIONS = [
  'Digital Products & Courses',
  'Coaching / Consulting Services',
  'Agency & Client Services',
  'Brand Sponsorships',
  'Growing Personal Brand / Authority',
]

const TOPIC_OPTIONS = [
  'AI & Future Tech',
  'Productivity & Habits',
  'Personal Finance & Wealth',
  'Fitness & Nutrition',
  'Business & Marketing',
  'Coding & Development',
  'Lifestyle & Mindset',
  'Relatable Comedy & POV',
]

const FORMAT_OPTIONS = [
  'Talking head with text cues',
  'POV skits & storytelling',
  'Green screen reaction & breakdown',
  'Aesthetic B-roll + voiceover',
]

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [subStep1, setSubStep1] = useState<'hook' | 'handle' | 'analyzing'>('hook')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [checkoutCanceled, setCheckoutCanceled] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      if (params.get('canceled') === 'true') {
        setCheckoutCanceled(true)
        setCurrentStep(5)
      }
    }
  }, [])

  // Form State
  const [handle, setHandle] = useState('')
  const [tones, setTones] = useState<string[]>(['Conversational', 'Bold'])
  const [language, setLanguage] = useState<'english' | 'hindi' | 'hinglish'>('english')
  const [hookStyle, setHookStyle] = useState<string[]>(['Scroll-stopping question', 'Shocking / Contrarian statement'])
  const [audience, setAudience] = useState('Creators & Freelancers')
  const [offers, setOffers] = useState('Digital Products & Courses')
  const [topics, setTopics] = useState<string[]>(['AI & Future Tech', 'Productivity & Habits'])
  const [formats, setFormats] = useState<string[]>(['Talking head with text cues'])

  function toggleTone(id: string) {
    setTones(prev => prev.includes(id) ? (prev.length > 1 ? prev.filter(t => t !== id) : prev) : [...prev, id])
  }

  function toggleHook(item: string) {
    setHookStyle(prev => prev.includes(item) ? (prev.length > 1 ? prev.filter(h => h !== item) : prev) : [...prev, item])
  }

  function toggleTopic(item: string) {
    setTopics(prev => prev.includes(item) ? (prev.length > 1 ? prev.filter(t => t !== item) : prev) : [...prev, item])
  }

  function toggleFormat(item: string) {
    setFormats(prev => prev.includes(item) ? (prev.length > 1 ? prev.filter(f => f !== item) : prev) : [...prev, item])
  }

  function handleStartAnalyze() {
    setSubStep1('analyzing')
    setTimeout(() => {
      setCurrentStep(2)
    }, 2800)
  }

  async function handleFinish() {
    setIsSubmitting(true)
    setError(null)
    try {
      const res = await completeOnboarding({
        instagramHandle: handle ? handle.replace(/^@/, '') : undefined,
        tone: tones,
        language,
        hookStyle,
        audience,
        offers,
        topics,
        formats,
      })

      if (res?.error) {
        setError(res.error)
        setIsSubmitting(false)
        return
      }

      router.push('/checkout')
    } catch {
      setError('Failed to finish setup. Please try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#FAFAF9] text-[#111827]">
      {/* =========================================================================
          LEFT SIDEBAR: STEPPER
      ========================================================================== */}
      <aside className="w-full md:w-[360px] lg:w-[400px] shrink-0 border-b md:border-b-0 md:border-r border-[#E5E7EB] bg-white flex flex-col justify-between p-6 sm:p-8 lg:p-10 min-h-full">
        <div>
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#FF5A36] to-[#FF8C36] text-white shadow-md shadow-[#FF5A36]/25">
              <Zap className="h-5 w-5 fill-white stroke-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-[#111827]">instavibes</span>
          </Link>

          <p className="mt-6 text-xs font-medium text-[#6B7280]">
            A few quick steps and your Content Brain is ready
          </p>

          {/* Stepper items */}
          <div className="mt-8 relative space-y-7">
            {/* Connecting line */}
            <div className="absolute left-[11px] top-4 bottom-4 w-0.5 bg-[#E5E7EB] -z-0" />

            {STEPS.map((s) => {
              const isCurrent = currentStep === s.id
              const isPassed = currentStep > s.id

              return (
                <div key={s.id} className="relative z-10 flex items-start gap-3.5">
                  <div className="shrink-0 mt-0.5">
                    {isPassed ? (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FF5A36] text-white shadow-sm">
                        <Check className="h-3.5 w-3.5 stroke-[3]" />
                      </div>
                    ) : isCurrent ? (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#FF5A36] bg-white shadow-sm">
                        <div className="h-2 w-2 rounded-full bg-[#FF5A36]" />
                      </div>
                    ) : (
                      <div className="h-6 w-6 rounded-full border-2 border-[#D1D5DB] bg-white" />
                    )}
                  </div>
                  <div>
                    <p
                      className={`text-sm font-semibold transition-colors ${
                        isCurrent
                          ? 'text-[#111827]'
                          : isPassed
                          ? 'text-[#374151]'
                          : 'text-[#9CA3AF]'
                      }`}
                    >
                      {s.title}
                    </p>
                    <p
                      className={`mt-0.5 text-xs leading-relaxed transition-colors ${
                        isCurrent
                          ? 'text-[#4B5563]'
                          : isPassed
                          ? 'text-[#6B7280]'
                          : 'text-[#9CA3AF]'
                      }`}
                    >
                      {s.desc}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="mt-10 pt-6 border-t border-[#E5E7EB] flex items-center justify-between text-xs font-semibold text-[#6B7280]">
          <a
            href="mailto:support@instavibes.com"
            className="flex items-center gap-1.5 hover:text-[#111827] transition"
          >
            <HelpCircle className="h-4 w-4" />
            Help
          </a>
          <button
            onClick={() => signOut()}
            className="flex items-center gap-1.5 hover:text-red-500 transition"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </div>
      </aside>

      {/* =========================================================================
          RIGHT MAIN CONTENT
      ========================================================================== */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 lg:p-16 relative overflow-y-auto">
        {/* Glow backdrop */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-[460px] w-[460px] rounded-full bg-[#FF5A36]/5 blur-3xl" />
        </div>

        {/* STEP 1: FIND YOUR CONTENT */}
        {currentStep === 1 && (
          <div className="relative z-10 w-full max-w-xl text-center">
            {subStep1 === 'hook' && (
              <div className="flex flex-col items-center animate-in fade-in zoom-in-95 duration-300">
                {/* Custom SVG Illustration: Before (234 views & -5 followers) -> Curved Arrow -> After InstaVibes (121k views & 5k followers) */}
                <div className="relative w-full max-w-[540px] aspect-[540/260] mb-8">
                  <svg
                    viewBox="0 0 540 260"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full drop-shadow-sm"
                  >
                    {/* Radial glows */}
                    <defs>
                      <radialGradient id="glowLeft" cx="0.5" cy="0.5" r="0.5">
                        <stop offset="0%" stopColor="#FF5A36" stopOpacity="0.14" />
                        <stop offset="100%" stopColor="#FF5A36" stopOpacity="0" />
                      </radialGradient>
                      <radialGradient id="greenGlow" cx="0.5" cy="0.5" r="0.5">
                        <stop offset="0%" stopColor="#10B981" stopOpacity="0.15" />
                        <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                      </radialGradient>
                      <marker id="arrowhead" markerWidth="9" markerHeight="9" refX="7" refY="3.5" orient="auto">
                        <polygon points="0 0, 8 3.5, 0 7" fill="#FF5A36" />
                      </marker>
                    </defs>

                    {/* Ambient glows */}
                    <ellipse cx="215" cy="140" rx="120" ry="100" fill="url(#glowLeft)" />
                    <ellipse cx="455" cy="130" rx="100" ry="85" fill="url(#greenGlow)" />

                    {/* Ground line */}
                    <line x1="50" y1="225" x2="140" y2="225" stroke="#1F2937" strokeWidth="2.5" strokeLinecap="round" />

                    {/* ================= LEFT: SAD CREATOR ================= */}
                    {/* Head */}
                    <circle cx="95" cy="95" r="20" stroke="#1F2937" strokeWidth="2.5" fill="white" />
                    {/* Sad eyebrows and eyes */}
                    <path d="M 85 88 L 92 91" stroke="#1F2937" strokeWidth="1.8" strokeLinecap="round" />
                    <path d="M 105 91 L 98 88" stroke="#1F2937" strokeWidth="1.8" strokeLinecap="round" />
                    <circle cx="89" cy="95" r="1.8" fill="#1F2937" />
                    <circle cx="101" cy="95" r="1.8" fill="#1F2937" />
                    {/* Frown mouth */}
                    <path d="M 89 108 Q 95 102 101 108" stroke="#1F2937" strokeWidth="2" strokeLinecap="round" fill="none" />

                    {/* Body */}
                    <line x1="95" y1="115" x2="95" y2="175" stroke="#1F2937" strokeWidth="2.5" strokeLinecap="round" />
                    {/* Left arm (pointing at phone) */}
                    <path d="M 95 132 Q 125 136 158 140" stroke="#1F2937" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                    {/* Right arm (hanging sad) */}
                    <line x1="95" y1="132" x2="80" y2="168" stroke="#1F2937" strokeWidth="2.5" strokeLinecap="round" />
                    {/* Legs */}
                    <line x1="95" y1="175" x2="74" y2="225" stroke="#1F2937" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="95" y1="175" x2="114" y2="225" stroke="#1F2937" strokeWidth="2.5" strokeLinecap="round" />

                    {/* ================= PHONE FRAME ================= */}
                    <rect x="162" y="60" width="118" height="172" rx="18" stroke="#1F2937" strokeWidth="2.8" fill="white" />
                    <rect x="198" y="67" width="46" height="3.5" rx="1.75" fill="#D1D5DB" />
                    {/* Screen with peach tone */}
                    <rect x="168" y="76" width="106" height="150" rx="12" fill="#FEEAE5" />

                    {/* Inside Phone: Smiling Stick Figure Video */}
                    <circle cx="221" cy="114" r="12" stroke="#1F2937" strokeWidth="2" fill="white" />
                    <circle cx="217" cy="112" r="1.3" fill="#1F2937" />
                    <circle cx="225" cy="112" r="1.3" fill="#1F2937" />
                    <path d="M 217 118 Q 221 122 225 118" stroke="#1F2937" strokeWidth="1.6" strokeLinecap="round" fill="none" />
                    <line x1="221" y1="126" x2="221" y2="162" stroke="#1F2937" strokeWidth="2" strokeLinecap="round" />
                    <path d="M 209 138 Q 221 130 233 138" stroke="#1F2937" strokeWidth="2" strokeLinecap="round" fill="none" />
                    <line x1="221" y1="162" x2="212" y2="188" stroke="#1F2937" strokeWidth="2" strokeLinecap="round" />
                    <line x1="221" y1="162" x2="230" y2="188" stroke="#1F2937" strokeWidth="2" strokeLinecap="round" />

                    {/* Floating Pill: 234 views */}
                    <g transform="translate(142, 175)">
                      <rect width="96" height="32" rx="16" fill="white" stroke="#E5E7EB" strokeWidth="1.5" />
                      {/* Eye icon */}
                      <path d="M 14 16 Q 21 10 28 16 Q 21 22 14 16 Z" stroke="#4B5563" strokeWidth="1.5" fill="none" />
                      <circle cx="21" cy="16" r="2.6" fill="#4B5563" />
                      {/* Text: 234 views */}
                      <text x="35" y="21" fontFamily="sans-serif" fontSize="12" fontWeight="bold" fill="#111827">234</text>
                      <text x="63" y="20" fontFamily="sans-serif" fontSize="8.5" fontWeight="500" fill="#6B7280">views</text>
                    </g>

                    {/* Floating Red Badge: -5 followers */}
                    <g transform="translate(236, 170) rotate(5)">
                      <rect width="68" height="38" rx="10" fill="#FF4B4B" />
                      <text x="34" y="19" fontFamily="sans-serif" fontSize="16" fontWeight="bold" fill="white" textAnchor="middle">-5</text>
                      <text x="34" y="30" fontFamily="sans-serif" fontSize="8.5" fontWeight="600" fill="white" opacity="0.95" textAnchor="middle">followers</text>
                    </g>

                    {/* ================= CURVED ARROW ================= */}
                    <path
                      d="M 314 162 C 348 152 358 102 376 78"
                      stroke="#FF5A36"
                      strokeWidth="2.5"
                      strokeDasharray="5 3"
                      strokeLinecap="round"
                      fill="none"
                      markerEnd="url(#arrowhead)"
                    />
                    <text
                      x="346"
                      y="118"
                      fontFamily="sans-serif"
                      fontSize="9.5"
                      fontWeight="700"
                      fill="#FF5A36"
                      textAnchor="middle"
                    >
                      Growth
                    </text>

                    {/* Decorative Sparkles */}
                    <g transform="translate(498, 30)">
                      <path d="M 6 0 Q 6 6 0 6 Q 6 6 6 12 Q 6 6 12 6 Q 6 6 6 0 Z" fill="#F59E0B" />
                    </g>
                    <g transform="translate(376, 40)">
                      <path d="M 4 0 Q 4 4 0 4 Q 4 4 4 8 Q 4 4 8 4 Q 4 4 4 0 Z" fill="#FF5A36" />
                    </g>

                    {/* ================= RIGHT: AFTER INSTAVIBES ================= */}
                    <g transform="translate(385, 45)">
                      {/* Card background with shadow */}
                      <rect width="144" height="170" rx="16" fill="white" stroke="#E5E7EB" strokeWidth="1.5" />

                      {/* Header label: after using instavibes */}
                      <rect x="10" y="12" width="124" height="24" rx="12" fill="#FFF5F2" stroke="#FFE4DE" strokeWidth="1" />
                      <text x="72" y="28" fontFamily="sans-serif" fontSize="8.5" fontWeight="700" fill="#FF5A36" textAnchor="middle">
                        after using instavibes ✨
                      </text>

                      {/* Metric 1: 121k views */}
                      <g transform="translate(10, 44)">
                        <rect width="124" height="50" rx="10" fill="#F0FDF4" stroke="#BBF7D0" strokeWidth="1" />
                        {/* Trending upward chart icon */}
                        <circle cx="18" cy="25" r="9" fill="#DCFCE7" />
                        <path d="M 13 28 L 17 23 L 20 25 L 23 21" stroke="#16A34A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                        <polyline points="21 21 23 21 23 23" stroke="#16A34A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                        <text x="34" y="25" fontFamily="sans-serif" fontSize="15" fontWeight="800" fill="#15803D">121k</text>
                        <text x="34" y="39" fontFamily="sans-serif" fontSize="9.5" fontWeight="600" fill="#16A34A">views 🔥</text>
                      </g>

                      {/* Metric 2: 5k followers */}
                      <g transform="translate(10, 102)">
                        <rect width="124" height="54" rx="10" fill="#10B981" />
                        {/* Follower user icon */}
                        <circle cx="20" cy="24" r="4.5" stroke="white" strokeWidth="1.6" fill="none" />
                        <path d="M 13 36 C 13 31 16 29 20 29 C 24 29 27 31 27 36" stroke="white" strokeWidth="1.6" strokeLinecap="round" fill="none" />
                        <text x="34" y="26" fontFamily="sans-serif" fontSize="15" fontWeight="800" fill="white">5k</text>
                        <text x="34" y="40" fontFamily="sans-serif" fontSize="9.5" fontWeight="700" fill="white" fillOpacity="0.95">followers 🚀</text>
                      </g>
                    </g>
                  </svg>
                </div>

                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#111827] max-w-lg leading-tight">
                  You spent hours creating for 234 views
                </h1>
                <p className="mt-4 text-sm sm:text-base text-[#6B7280] max-w-lg leading-relaxed">
                  Days spent researching hooks, scripting, and filming retakes—only to lose 5 followers and get buried. It wasn&apos;t your timing or audio. InstaVibes turns that exact creative energy into 121k views and exponential growth.
                </p>

                <div className="mt-8 flex items-center justify-center gap-4">
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="px-5 py-2.5 text-sm font-semibold text-[#6B7280] hover:text-[#111827] transition"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setSubStep1('handle')}
                    className="rounded-xl bg-[#111827] px-7 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-black"
                  >
                    Help me fix it
                  </button>
                </div>
              </div>
            )}

            {subStep1 === 'handle' && (
              <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FF5A36]/10 text-[#FF5A36] mb-6">
                  <Instagram className="h-7 w-7" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111827]">
                  What&apos;s your Instagram handle?
                </h2>
                <p className="mt-2 text-sm text-[#6B7280] max-w-md">
                  We will scan your public profile to analyze your niche, top hooks, and audience patterns.
                </p>

                <div className="mt-8 w-full max-w-md">
                  <div className="relative flex items-center">
                    <span className="absolute left-4 text-base font-bold text-[#9CA3AF]">@</span>
                    <input
                      type="text"
                      value={handle}
                      onChange={(e) => setHandle(e.target.value.replace(/^@/, ''))}
                      placeholder="your_handle"
                      onKeyDown={(e) => e.key === 'Enter' && handleStartAnalyze()}
                      className="w-full rounded-2xl border border-[#D1D5DB] bg-white py-3.5 pl-10 pr-4 text-base font-semibold text-[#111827] placeholder-[#9CA3AF] shadow-sm outline-none transition focus:border-[#FF5A36] focus:ring-2 focus:ring-[#FF5A36]/20"
                    />
                  </div>

                  <div className="mt-6 flex flex-col gap-3">
                    <button
                      onClick={handleStartAnalyze}
                      className="w-full rounded-xl bg-[#111827] py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-black"
                    >
                      {handle ? 'Analyze my content' : 'Continue'}
                    </button>
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="text-xs font-semibold text-[#6B7280] hover:text-[#111827] transition"
                    >
                      Skip for now →
                    </button>
                  </div>
                </div>
              </div>
            )}

            {subStep1 === 'analyzing' && (
              <div className="flex flex-col items-center py-12 animate-in fade-in duration-300">
                <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-[#FF5A36]/10 text-[#FF5A36]">
                  <Loader2 className="h-10 w-10 animate-spin text-[#FF5A36]" />
                </div>
                <h3 className="text-xl font-bold text-[#111827]">Analyzing your creator profile…</h3>
                <p className="mt-2 text-sm text-[#6B7280]">
                  Identifying top viral hooks, audience tone, and breakout video styles.
                </p>
                <div className="mt-6 space-y-2 text-xs font-medium text-[#6B7280] text-left">
                  <p className="flex items-center gap-2 text-emerald-600">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Found public profile: @{handle || 'creator'}
                  </p>
                  <p className="flex items-center gap-2 text-emerald-600">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Extracted hook categories and pacing
                  </p>
                  <p className="flex items-center gap-2 text-[#FF5A36] animate-pulse">
                    <Sparkles className="h-3.5 w-3.5" /> Initializing Content Brain voice matrix…
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: MATCH YOUR VOICE */}
        {currentStep === 2 && (
          <div className="relative z-10 w-full max-w-xl animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111827]">
                How does your voice sound?
              </h2>
              <p className="mt-2 text-sm text-[#6B7280]">
                Choose the vibes that sound most like you when talking to camera.
              </p>
            </div>

            <div className="space-y-6">
              {/* Tone chips */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6B7280] mb-3">
                  Tone & Energy (Pick 2 or more)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {TONE_OPTIONS.map((t) => {
                    const active = tones.includes(t.id)
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => toggleTone(t.id)}
                        className={`text-left p-3.5 rounded-xl border transition-all ${
                          active
                            ? 'border-[#FF5A36] bg-[#FF5A36]/5 text-[#111827] shadow-sm'
                            : 'border-[#E5E7EB] bg-white text-[#4B5563] hover:border-gray-300'
                        }`}
                      >
                        <p className={`text-sm font-semibold ${active ? 'text-[#FF5A36]' : 'text-[#111827]'}`}>
                          {t.label}
                        </p>
                        <p className="text-xs text-[#6B7280] mt-0.5">{t.desc}</p>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Language Preference */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6B7280] mb-3">
                  Primary Script Language
                </label>
                <div className="flex gap-2">
                  {(['english', 'hindi', 'hinglish'] as const).map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setLanguage(l)}
                      className={`flex-1 py-2.5 rounded-xl border text-xs font-semibold capitalize transition ${
                        language === l
                          ? 'border-[#FF5A36] bg-[#FF5A36] text-white'
                          : 'border-[#E5E7EB] bg-white text-[#4B5563] hover:border-gray-300'
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hook Style */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6B7280] mb-3">
                  Your Signature Hook Style
                </label>
                <div className="flex flex-wrap gap-2">
                  {HOOK_STYLES.map((h) => {
                    const active = hookStyle.includes(h)
                    return (
                      <button
                        key={h}
                        type="button"
                        onClick={() => toggleHook(h)}
                        className={`rounded-full px-3.5 py-1.5 text-xs font-semibold border transition ${
                          active
                            ? 'border-[#111827] bg-[#111827] text-white'
                            : 'border-[#E5E7EB] bg-white text-[#4B5563] hover:border-gray-300'
                        }`}
                      >
                        {h}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Nav Buttons */}
              <div className="pt-4 flex items-center justify-between border-t border-[#E5E7EB]">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2 text-sm font-semibold text-[#6B7280] hover:text-[#111827] transition"
                >
                  Back
                </button>
                <button
                  onClick={() => setCurrentStep(3)}
                  className="rounded-xl bg-[#111827] px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-black transition flex items-center gap-1.5"
                >
                  Next: About you
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: ABOUT YOU */}
        {currentStep === 3 && (
          <div className="relative z-10 w-full max-w-xl animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111827]">
                Who are you speaking to?
              </h2>
              <p className="mt-2 text-sm text-[#6B7280]">
                This helps scripts connect emotionally with your ideal followers.
              </p>
            </div>

            <div className="space-y-6">
              {/* Target Audience */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6B7280] mb-3">
                  Target Audience
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {AUDIENCE_OPTIONS.map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => setAudience(a)}
                      className={`p-3 rounded-xl border text-left text-xs font-semibold transition ${
                        audience === a
                          ? 'border-[#FF5A36] bg-[#FF5A36]/5 text-[#FF5A36]'
                          : 'border-[#E5E7EB] bg-white text-[#4B5563] hover:border-gray-300'
                      }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              {/* Offers / What you monetize */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6B7280] mb-3">
                  What Do You Offer or Monetize?
                </label>
                <div className="space-y-2">
                  {OFFER_OPTIONS.map((o) => (
                    <button
                      key={o}
                      type="button"
                      onClick={() => setOffers(o)}
                      className={`w-full p-3 rounded-xl border text-left text-xs font-semibold transition ${
                        offers === o
                          ? 'border-[#111827] bg-[#111827] text-white'
                          : 'border-[#E5E7EB] bg-white text-[#4B5563] hover:border-gray-300'
                      }`}
                    >
                      {o}
                    </button>
                  ))}
                </div>
              </div>

              {/* Nav Buttons */}
              <div className="pt-4 flex items-center justify-between border-t border-[#E5E7EB]">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2 text-sm font-semibold text-[#6B7280] hover:text-[#111827] transition"
                >
                  Back
                </button>
                <button
                  onClick={() => setCurrentStep(4)}
                  className="rounded-xl bg-[#111827] px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-black transition flex items-center gap-1.5"
                >
                  Next: Plan content
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: PLAN YOUR CONTENT */}
        {currentStep === 4 && (
          <div className="relative z-10 w-full max-w-xl animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111827]">
                What themes do you cover?
              </h2>
              <p className="mt-2 text-sm text-[#6B7280]">
                Select the pillars you want to be known for.
              </p>
            </div>

            <div className="space-y-6">
              {/* Content Pillars */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6B7280] mb-3">
                  Core Topics (Pick 2–4)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {TOPIC_OPTIONS.map((tp) => {
                    const active = topics.includes(tp)
                    return (
                      <button
                        key={tp}
                        type="button"
                        onClick={() => toggleTopic(tp)}
                        className={`p-3 rounded-xl border text-center text-xs font-semibold transition ${
                          active
                            ? 'border-[#FF5A36] bg-[#FF5A36]/5 text-[#FF5A36]'
                            : 'border-[#E5E7EB] bg-white text-[#4B5563] hover:border-gray-300'
                        }`}
                      >
                        {tp}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Formats */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6B7280] mb-3">
                  Reel Formats You Like
                </label>
                <div className="space-y-2">
                  {FORMAT_OPTIONS.map((f) => {
                    const active = formats.includes(f)
                    return (
                      <button
                        key={f}
                        type="button"
                        onClick={() => toggleFormat(f)}
                        className={`w-full p-3 rounded-xl border text-left text-xs font-semibold transition flex items-center justify-between ${
                          active
                            ? 'border-[#111827] bg-[#111827] text-white'
                            : 'border-[#E5E7EB] bg-white text-[#4B5563] hover:border-gray-300'
                        }`}
                      >
                        <span>{f}</span>
                        {active && <Check className="h-4 w-4" />}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Nav Buttons */}
              <div className="pt-4 flex items-center justify-between border-t border-[#E5E7EB]">
                <button
                  onClick={() => setCurrentStep(3)}
                  className="px-4 py-2 text-sm font-semibold text-[#6B7280] hover:text-[#111827] transition"
                >
                  Back
                </button>
                <button
                  onClick={() => setCurrentStep(5)}
                  className="rounded-xl bg-[#111827] px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-black transition flex items-center gap-1.5"
                >
                  Generate Content Brain
                  <Sparkles className="h-4 w-4 text-[#FF5A36]" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: LAUNCH WORKSPACE OR CHECKOUT CANCELLED */}
        {currentStep === 5 && (
          <div className="relative z-10 w-full max-w-xl text-center animate-in fade-in zoom-in-95 duration-300">
            {checkoutCanceled ? (
              <div className="flex flex-col items-center">
                <p className="text-sm font-semibold text-[#FF5A36] mb-8">
                  Step 5 of 5
                </p>

                {/* Cancel X Icon Container */}
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F3F4F6] border border-gray-100 text-[#4B5563] mb-6 shadow-sm">
                  <X className="h-7 w-7 stroke-[2.5]" />
                </div>

                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#111827]">
                  Checkout cancelled
                </h2>
                <p className="mt-3 text-sm sm:text-base text-[#6B7280] max-w-md leading-relaxed">
                  No problem. Nothing was charged and your trial hasn&apos;t started. Everything you&apos;ve set up is saved.
                </p>

                <div className="mt-8">
                  <button
                    onClick={() => router.push('/checkout')}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#111827] px-8 py-3.5 text-sm font-bold text-white shadow-md hover:bg-black transition cursor-pointer"
                  >
                    <RotateCw className="h-4 w-4" />
                    <span>Try again</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setCheckoutCanceled(false)}
                  className="mt-4 text-xs sm:text-sm font-semibold text-[#4B5563] hover:text-[#111827] transition underline underline-offset-4 cursor-pointer"
                >
                  Choose a different plan
                </button>

                <p className="mt-10 text-xs text-[#9CA3AF]">
                  Need help?{' '}
                  <a
                    href="mailto:support@instavibes.com"
                    className="font-semibold text-[#111827] hover:underline"
                  >
                    support@instavibes.com
                  </a>
                </p>
              </div>
            ) : (
              <>
                <div className="inline-flex items-center gap-2 rounded-full bg-[#FF5A36]/10 px-3.5 py-1 text-xs font-bold text-[#FF5A36] mb-4">
                  <Sparkles className="h-3.5 w-3.5" />
                  Content Brain Ready
                </div>

                <h2 className="text-3xl font-extrabold tracking-tight text-[#111827]">
                  Your Creator Blueprint is Live
                </h2>
                <p className="mt-2 text-sm text-[#6B7280] max-w-md mx-auto">
                  We configured your AI script engine with your authentic tone, audience hook patterns, and core pillars.
                </p>

                {/* Blueprint Summary Card */}
                <div className="mt-8 rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm text-left space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#F3F4F6]">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">Creator Profile</p>
                      <p className="text-sm font-bold text-[#111827]">@{handle || 'creator'}</p>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-600">
                      Ready to script
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <p className="text-[#9CA3AF] font-medium">Tone & Voice</p>
                      <p className="font-semibold text-[#111827] mt-0.5">{tones.join(', ')}</p>
                    </div>
                    <div>
                      <p className="text-[#9CA3AF] font-medium">Language</p>
                      <p className="font-semibold text-[#111827] mt-0.5 capitalize">{language}</p>
                    </div>
                    <div>
                      <p className="text-[#9CA3AF] font-medium">Target Audience</p>
                      <p className="font-semibold text-[#111827] mt-0.5">{audience}</p>
                    </div>
                    <div>
                      <p className="text-[#9CA3AF] font-medium">Main Offering</p>
                      <p className="font-semibold text-[#111827] mt-0.5">{offers}</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#F3F4F6]">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] mb-1.5">Core Content Pillars</p>
                    <div className="flex flex-wrap gap-1.5">
                      {topics.map((tp) => (
                        <span key={tp} className="rounded-md bg-[#F3F4F6] px-2 py-0.5 text-[11px] font-medium text-[#4B5563]">
                          #{tp}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {error && (
                  <p className="mt-4 text-xs font-semibold text-red-500">{error}</p>
                )}

                {/* Launch CTA */}
                <div className="mt-8 flex items-center justify-center gap-4">
                  <button
                    onClick={() => setCurrentStep(4)}
                    disabled={isSubmitting}
                    className="px-5 py-2.5 text-sm font-semibold text-[#6B7280] hover:text-[#111827] transition"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleFinish}
                    disabled={isSubmitting}
                    className="rounded-xl bg-[#111827] px-8 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-black disabled:opacity-50 flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Launching workspace…
                      </>
                    ) : (
                      <>
                        Launch my workspace
                        <Rocket className="h-4 w-4 text-[#FF5A36]" />
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
