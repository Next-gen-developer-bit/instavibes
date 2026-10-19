import Link from 'next/link'
import { Zap, ShieldAlert, ArrowLeft, Mail, FileText, CheckCircle2 } from 'lucide-react'

export const metadata = {
  title: 'Terms of Service | InstaVibes',
  description: 'Terms of Service, Billing Terms, and AI Acceptable Use Policy for InstaVibes.',
}

export default function TermsPage() {
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
            <Link href="/privacy" className="hover:text-[#111827] transition">
              Privacy
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
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#FF5A36]/10 px-3 py-1 text-xs font-semibold text-[#FF5A36] mb-3">
            <FileText className="h-3.5 w-3.5" />
            Legal Agreement
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#111827]">
            Terms of Service & AI Acceptable Use Policy
          </h1>
          <p className="mt-2 text-sm text-[#6B7280]">
            Effective Date & Last Updated: {lastUpdated}
          </p>
        </div>

        <div className="space-y-10 text-sm leading-relaxed text-[#374151]">
          {/* Section 1: Introduction */}
          <section className="bg-white p-6 sm:p-8 rounded-2xl border border-black/8 shadow-sm">
            <h2 className="text-lg font-bold text-[#111827] mb-3">1. Agreement to Terms</h2>
            <p>
              These Terms of Service (&quot;Terms&quot;) constitute a legally binding agreement between you
              (&quot;User&quot;, &quot;you&quot;, or &quot;your&quot;) and InstaVibes (&quot;Company&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;),
              governing your access to and use of the InstaVibes website, web applications, content analysis tools,
              and AI script-generation platform located at{' '}
              <Link href="/" className="text-[#FF5A36] font-medium underline">
                instavibes.com
              </Link>{' '}
              and related subdomains (collectively, the &quot;Service&quot;).
            </p>
            <p className="mt-3">
              By registering an account, starting a free trial, purchasing a subscription, or using our AI script-generation
              services, you confirm that you are at least 18 years old and agree to be bound by these Terms. If you do not
              agree, do not access or use the Service.
            </p>
          </section>

          {/* Section 2: AI Acceptable Use Policy (CRITICAL FOR COMPLIANCE) */}
          <section className="bg-white p-6 sm:p-8 rounded-2xl border-2 border-red-500/30 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-500 to-[#FF5A36]" />
            <div className="flex items-center gap-2 mb-3">
              <ShieldAlert className="h-5 w-5 text-red-600" />
              <h2 className="text-lg font-bold text-[#111827]">
                2. AI Script Generation — Acceptable Use Rules & Prohibited Content
              </h2>
            </div>
            <p>
              InstaVibes provides creators with artificial intelligence tools designed to analyze public video hook patterns,
              suggest reel script outlines, and adapt content structures into original scripts. Because our AI generates
              spoken-word and written content, all users must strictly adhere to this Acceptable Use Policy.
            </p>

            {/* Explicit NSFW Ban */}
            <div className="mt-4 rounded-xl bg-red-50 border border-red-200 p-4 text-xs sm:text-sm text-red-900">
              <p className="font-bold uppercase tracking-wide text-red-700 flex items-center gap-1.5 mb-1.5">
                <ShieldAlert className="h-4 w-4 text-red-600 shrink-0" />
                Strict Ban on Sexually Explicit & NSFW Content:
              </p>
              <p className="leading-relaxed">
                You are <strong>strictly prohibited</strong> from using the Service or its AI tools to generate, request,
                upload, transmit, promote, or distribute any sexually explicit, pornographic, adult-oriented, non-consensual sexual,
                or NSFW (&quot;Not Safe For Work&quot;) content, scripts, hooks, or imagery. Any attempt to prompt or generate
                sexually explicit material constitutes a material breach of these Terms and will result in immediate, permanent
                account termination with zero refund.
              </p>
            </div>

            <h3 className="mt-6 text-sm font-bold text-[#111827]">2.2 Additional Prohibited Uses</h3>
            <p className="mt-1">You agree that you will NOT use the Service or its AI generation features to:</p>
            <ul className="mt-2 space-y-2 list-disc list-inside text-xs sm:text-sm text-[#4B5563]">
              <li>
                <strong>Hate Speech & Harassment:</strong> Generate content that promotes violence, incites hatred, discriminates,
                defames, bullies, harasses, or threatens any individual, protected group, or minority.
              </li>
              <li>
                <strong>Illegal Activities & Harm:</strong> Promote illegal acts, dangerous substances, weapons, self-harm,
                eating disorders, or cyberattacks.
              </li>
              <li>
                <strong>Deception, Fraud & Scams:</strong> Generate phishing messages, fraudulent get-rich-quick schemes, deceptive
                commercial offers, or fake testimonials designed to mislead consumers.
              </li>
              <li>
                <strong>Unlicensed Regulated Advice:</strong> Generate medical diagnoses, prescription advice, legal counsel,
                or formal financial / investment recommendations that require certified professional licensure.
              </li>
              <li>
                <strong>Impersonation & Privacy Violations:</strong> Misrepresent identity, impersonate real individuals without
                express written authorization, or expose private personal data (doxxing).
              </li>
              <li>
                <strong>System Abuse & Jailbreaks:</strong> Attempt to bypass safety filters, prompt inject, reverse engineer,
                decompile, or launch automated scraping/crawling attacks against our infrastructure.
              </li>
            </ul>

            <p className="mt-4 text-xs text-[#6B7280]">
              We reserve the right to monitor inputs and outputs, deploy automated safety filters, and terminate accounts
              found in violation of these rules immediately without prior notice.
            </p>
          </section>

          {/* Section 3: Subscriptions, Free Trial & Merchant of Record */}
          <section className="bg-white p-6 sm:p-8 rounded-2xl border border-black/8 shadow-sm">
            <h2 className="text-lg font-bold text-[#111827] mb-3">
              3. Subscriptions, Pricing, 3-Day Free Trial & Merchant of Record
            </h2>
            <p>
              InstaVibes offers paid subscription plans providing full access to our Content Brain, Script Studio, and
              curated hook engines:
            </p>
            <ul className="mt-3 space-y-2 list-disc list-inside text-xs sm:text-sm text-[#4B5563]">
              <li>
                <strong>InstaVibes Pro (Monthly):</strong> $10 billed each month.
              </li>
              <li>
                <strong>InstaVibes Pro (Annual):</strong> $100 billed once per year (equivalent to $8.33/month, 17% savings).
              </li>
            </ul>

            <h3 className="mt-5 text-sm font-bold text-[#111827]">3.1 3-Day Risk-Free Trial</h3>
            <p className="mt-1">
              New subscribers receive a 3-day free trial. During the trial period, you enjoy full access to the features included
              in your chosen plan. You may cancel your subscription at any time during the 3-day trial period through your
              dashboard settings or by contacting support, and you will not be billed. If you do not cancel before the 3-day
              trial expires, your chosen billing method will be charged the recurring subscription fee.
            </p>

            <h3 className="mt-5 text-sm font-bold text-[#111827]">3.2 Merchant of Record (Creem)</h3>
            <p className="mt-1">
              Our order process is conducted by our online Merchant of Record, <strong>Creem</strong> (creem.io). Creem is
              the Merchant of Record for all our orders, handles customer billing, tax collection, payment security, and
              order fulfillment. When you enter payment information, transactions are securely handled according to Creem&apos;s
              terms and privacy policy.
            </p>

            <h3 className="mt-5 text-sm font-bold text-[#111827]">3.3 Cancellation & Renewal</h3>
            <p className="mt-1">
              Subscriptions renew automatically at the end of each billing cycle (monthly or annually) unless cancelled prior to
              the renewal date. You can cancel your subscription at any time with 1 click from your Dashboard Account Settings.
              Upon cancellation, your access remains active until the end of your current paid billing period.
            </p>
          </section>

          {/* Section 4: Refund Policy (ANHOR #refunds) */}
          <section id="refunds" className="bg-white p-6 sm:p-8 rounded-2xl border border-black/8 shadow-sm scroll-mt-24">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="h-5 w-5 text-[#FF5A36]" />
              <h2 className="text-lg font-bold text-[#111827]">4. Refund & Cancellation Policy</h2>
            </div>
            <p>
              We want you to be completely satisfied with InstaVibes. Because we offer a generous 3-day free trial with full access
              to all features, creators can test and verify our script tools before any payment is collected.
            </p>
            <div className="mt-4 space-y-3 text-xs sm:text-sm text-[#4B5563]">
              <p>
                <strong>Trial Cancellations:</strong> If you cancel during the 3-day trial period, your card will never be charged.
              </p>
              <p>
                <strong>7-Day Satisfaction Guarantee:</strong> If you were charged for an annual or monthly renewal and experience
                technical failure, or if you forgot to cancel within 7 days of the charge date, please contact{' '}
                <a href="mailto:support@instavibes.com" className="text-[#FF5A36] font-semibold underline">
                  support@instavibes.com
                </a>
                . We review and process valid refund requests promptly.
              </p>
              <p>
                <strong>Chargebacks:</strong> Please reach out to us first at{' '}
                <a href="mailto:support@instavibes.com" className="text-[#FF5A36] font-semibold underline">
                  support@instavibes.com
                </a>{' '}
                before initiating a bank dispute or chargeback. We are committed to resolving all billing inquiries fairly and
                quickly.
              </p>
            </div>
          </section>

          {/* Section 5: Intellectual Property & User Content */}
          <section className="bg-white p-6 sm:p-8 rounded-2xl border border-black/8 shadow-sm">
            <h2 className="text-lg font-bold text-[#111827] mb-3">5. Intellectual Property & Your Content</h2>
            <p>
              <strong>Your Content:</strong> You retain full ownership and copyright of any reel scripts, hooks, and content
              generated using your account on InstaVibes. You grant us a limited, worldwide license solely to store, process, and
              display your content for the purpose of operating the Service for you.
            </p>
            <p className="mt-3">
              <strong>Our Platform:</strong> The InstaVibes website, logos, algorithms, user interface, and proprietary software
              are the intellectual property of InstaVibes and protected by copyright and intellectual property laws.
            </p>
          </section>

          {/* Section 6: Disclaimers & Limitation of Liability */}
          <section className="bg-white p-6 sm:p-8 rounded-2xl border border-black/8 shadow-sm">
            <h2 className="text-lg font-bold text-[#111827] mb-3">6. Disclaimers & Limitation of Liability</h2>
            <p>
              The Service is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis. We do not guarantee specific follower growth,
              virality, or engagement metrics on Instagram or any other third-party platform, as social media performance depends on
              many independent factors including creator delivery, audio trends, and platform algorithm changes.
            </p>
            <p className="mt-3">
              To the maximum extent permitted by applicable law, InstaVibes and its affiliates shall not be liable for any indirect,
              incidental, special, consequential, or punitive damages arising from your use of the Service.
            </p>
          </section>

          {/* Section 7: Contact Information */}
          <section className="bg-white p-6 sm:p-8 rounded-2xl border border-black/8 shadow-sm">
            <h2 className="text-lg font-bold text-[#111827] mb-3">7. Contact & Support</h2>
            <p>
              If you have any questions regarding these Terms, our AI Acceptable Use Policy, or billing inquiries, please contact us:
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
                Visit Support & Contact Page →
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
            <Link href="/terms" className="hover:text-[#111827] font-semibold">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-[#111827]">Privacy Policy</Link>
            <Link href="/contact" className="hover:text-[#111827]">Contact Us</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
