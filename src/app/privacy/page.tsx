import Link from 'next/link'
import { Zap, ShieldCheck, ArrowLeft, Mail, Lock } from 'lucide-react'

export const metadata = {
  title: 'Privacy Policy | InstaVibes',
  description: 'Learn how InstaVibes protects your creator data, scripts, and privacy.',
}

export default function PrivacyPage() {
  const lastUpdated = 'October 19, 2026'

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-[#111827]">
      {/* Header */}
      <header className="border-b border-black/8 bg-white/80 backdrop-blur-md sticky top-0 z-40">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FF5A36] text-white shadow-sm">
              <Zap className="h-4 w-4 fill-white text-white" />
            </div>
            <span className="text-base font-bold tracking-tight text-[#111827]">instavibes</span>
          </Link>
          <div className="flex items-center gap-4 text-xs font-semibold text-[#6B7280]">
            <Link href="/" className="hover:text-[#111827] transition flex items-center gap-1">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Home
            </Link>
            <span className="text-gray-300">•</span>
            <Link href="/terms" className="hover:text-[#111827] transition">
              Terms
            </Link>
            <span className="text-gray-300">•</span>
            <Link href="/contact" className="hover:text-[#111827] transition">
              Contact
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-6 py-12 sm:py-16">
        <div className="mb-10">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 mb-3">
            <ShieldCheck className="h-3.5 w-3.5" />
            Data Protection & Privacy
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#111827]">
            Privacy Policy
          </h1>
          <p className="mt-2 text-sm text-[#6B7280]">
            Effective Date & Last Updated: {lastUpdated}
          </p>
        </div>

        <div className="space-y-10 text-sm leading-relaxed text-[#374151]">
          {/* Section 1: Overview */}
          <section className="bg-white p-6 sm:p-8 rounded-2xl border border-black/8 shadow-sm">
            <h2 className="text-lg font-bold text-[#111827] mb-3">1. Commitment to Creator Privacy</h2>
            <p>
              At InstaVibes (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), we respect your privacy and are committed to safeguarding
              the personal information and creative assets of our users (&quot;you&quot; or &quot;creator&quot;). This Privacy Policy explains
              what information we collect, how it is used to generate your personalized creator scripts, and how your data is protected.
            </p>
          </section>

          {/* Section 2: Information We Collect */}
          <section className="bg-white p-6 sm:p-8 rounded-2xl border border-black/8 shadow-sm">
            <h2 className="text-lg font-bold text-[#111827] mb-3">2. Information We Collect</h2>
            <div className="space-y-4 text-xs sm:text-sm">
              <div>
                <p className="font-bold text-[#111827]">2.1 Account & Identity Information</p>
                <p className="mt-1 text-[#4B5563]">
                  When you register for an account or sign in with email or Google OAuth, we collect your email address,
                  name (if provided), and authentication identifiers.
                </p>
              </div>

              <div>
                <p className="font-bold text-[#111827]">2.2 Creator Voice & Preference Data</p>
                <p className="mt-1 text-[#4B5563]">
                  During onboarding and platform use, you may provide your public Instagram handle, selected tone styles
                  (e.g., conversational, bold), target audience description, primary script language (English, Hindi, or Hinglish),
                  and content pillar topics. This information is stored in your private Content Brain profile.
                </p>
              </div>

              <div>
                <p className="font-bold text-[#111827]">2.3 Script Generation Inputs & Saved Content</p>
                <p className="mt-1 text-[#4B5563]">
                  We store the video URLs you input for structure breakdown, the prompts you write, and the generated scripts
                  you save to your Script Studio or Posting Calendar so you can view, edit, and shoot them later.
                </p>
              </div>

              <div>
                <p className="font-bold text-[#111827]">2.4 Payment & Billing Information</p>
                <p className="mt-1 text-[#4B5563]">
                  All payments and financial transactions are securely processed by our Merchant of Record, <strong>Creem</strong> (creem.io).
                  InstaVibes does not store or process your full credit card number, CVV, or banking credentials on our servers.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: AI Data Usage */}
          <section className="bg-white p-6 sm:p-8 rounded-2xl border border-black/8 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Lock className="h-5 w-5 text-emerald-600" />
              <h2 className="text-lg font-bold text-[#111827]">3. How We Use AI & Your Content</h2>
            </div>
            <p>
              Your content and prompt inputs are used strictly to provide and improve the script-generation service:
            </p>
            <ul className="mt-3 space-y-2 list-disc list-inside text-xs sm:text-sm text-[#4B5563]">
              <li>
                We do <strong>NOT</strong> sell your personal data or your private creative scripts to third-party data brokers
                or advertisers.
              </li>
              <li>
                We do <strong>NOT</strong> use your private personal scripts to train public generative models.
              </li>
              <li>
                Inputs and outputs are processed through enterprise API tiers with strict zero-data-retention for training guarantees.
              </li>
            </ul>
          </section>

          {/* Section 4: Third-Party Service Providers */}
          <section className="bg-white p-6 sm:p-8 rounded-2xl border border-black/8 shadow-sm">
            <h2 className="text-lg font-bold text-[#111827] mb-3">4. Third-Party Service Providers (Sub-Processors)</h2>
            <p>
              We partner with trusted, industry-leading infrastructure providers to deliver our platform:
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-3 text-xs">
              <div className="rounded-xl border border-gray-200 p-3 bg-gray-50/50">
                <p className="font-bold text-[#111827]">Creem (creem.io)</p>
                <p className="text-[#6B7280] mt-1">Merchant of Record, payment security, tax compliance, and order fulfillment.</p>
              </div>
              <div className="rounded-xl border border-gray-200 p-3 bg-gray-50/50">
                <p className="font-bold text-[#111827]">Supabase</p>
                <p className="text-[#6B7280] mt-1">Encrypted database storage, user authentication, and secure session management.</p>
              </div>
              <div className="rounded-xl border border-gray-200 p-3 bg-gray-50/50">
                <p className="font-bold text-[#111827]">Vercel</p>
                <p className="text-[#6B7280] mt-1">Global edge hosting, web traffic routing, and DDoS / security rate-limiting.</p>
              </div>
            </div>
          </section>

          {/* Section 5: Your Rights & Account Deletion */}
          <section className="bg-white p-6 sm:p-8 rounded-2xl border border-black/8 shadow-sm">
            <h2 className="text-lg font-bold text-[#111827] mb-3">5. Your Rights (GDPR & CCPA)</h2>
            <p>
              Regardless of where you reside, you have full control over your data:
            </p>
            <ul className="mt-3 space-y-2 list-disc list-inside text-xs sm:text-sm text-[#4B5563]">
              <li><strong>Access & Export:</strong> You can request a copy of all personal information and scripts associated with your account.</li>
              <li><strong>Correction:</strong> You can update your creator profile, Instagram handle, and preferences anytime in Settings.</li>
              <li><strong>Deletion:</strong> You can delete your account and all associated scripts at any time by contacting us. Upon request, all personal data is permanently deleted from our primary databases within 30 days.</li>
            </ul>
          </section>

          {/* Section 6: Contact for Privacy */}
          <section className="bg-white p-6 sm:p-8 rounded-2xl border border-black/8 shadow-sm">
            <h2 className="text-lg font-bold text-[#111827] mb-3">6. Privacy Inquiries & Contact</h2>
            <p>
              If you have any questions or data requests regarding this Privacy Policy, please email our privacy team at:
            </p>
            <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 text-xs sm:text-sm">
              <a
                href="mailto:support@instavibes.com"
                className="inline-flex items-center gap-2 rounded-xl bg-[#111827] px-4 py-2.5 font-semibold text-white hover:bg-black transition"
              >
                <Mail className="h-4 w-4" />
                support@instavibes.com
              </a>
              <Link href="/contact" className="text-[#FF5A36] font-semibold hover:underline">
                Contact Page →
              </Link>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-black/8 bg-white py-8 px-6 text-center text-xs text-[#6B7280]">
        <div className="mx-auto max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} InstaVibes. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="hover:text-[#111827]">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-[#111827] font-semibold">Privacy Policy</Link>
            <Link href="/contact" className="hover:text-[#111827]">Contact Us</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
