'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Zap, ArrowLeft, Mail, Clock, HelpCircle, Check, Copy, MessageSquare, CreditCard, ShieldCheck } from 'lucide-react'

export default function ContactPage() {
  const [copied, setCopied] = useState(false)
  const email = 'support@instavibes.com'

  function handleCopy() {
    navigator.clipboard.writeText(email)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

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
            <Link href="/privacy" className="hover:text-[#111827] transition">
              Privacy
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-6 py-12 sm:py-16">
        <div className="text-center max-w-xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#FF5A36]/10 px-3 py-1 text-xs font-semibold text-[#FF5A36] mb-3">
            <MessageSquare className="h-3.5 w-3.5" />
            Customer Support & Inquiries
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#111827]">
            Get in touch with us
          </h1>
          <p className="mt-3 text-sm text-[#6B7280] leading-relaxed">
            Have questions about your subscription, our AI script engine, or need account assistance?
            We are here to help.
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Email Support Card */}
          <div className="rounded-2xl border border-black/8 bg-white p-6 sm:p-8 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FF5A36]/10 text-[#FF5A36] mb-5">
                <Mail className="h-6 w-6" />
              </div>
              <h2 className="text-lg font-bold text-[#111827]">Email Support</h2>
              <p className="mt-1 text-xs sm:text-sm text-[#6B7280]">
                Send us an email anytime. Our team replies to all creator inquiries within 24 business hours.
              </p>

              <div className="mt-6 flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5">
                <span className="font-mono text-sm font-semibold text-[#111827] select-all flex-1">
                  {email}
                </span>
                <button
                  onClick={handleCopy}
                  className="rounded-lg bg-white border border-gray-200 px-2.5 py-1 text-xs font-semibold text-[#374151] hover:bg-gray-100 transition flex items-center gap-1 cursor-pointer"
                  title="Copy email"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      <span className="text-emerald-600">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 text-[#6B7280]" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-gray-100">
              <a
                href={`mailto:${email}?subject=InstaVibes%20Inquiry`}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#111827] px-5 py-3 text-sm font-bold text-white hover:bg-black transition shadow-sm cursor-pointer"
              >
                <Mail className="h-4 w-4" />
                <span>Open in Email App</span>
              </a>
            </div>
          </div>

          {/* Business & Billing Info Card */}
          <div className="rounded-2xl border border-black/8 bg-white p-6 sm:p-8 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 mb-5">
                <CreditCard className="h-6 w-6" />
              </div>
              <h2 className="text-lg font-bold text-[#111827]">Billing & Orders</h2>
              <p className="mt-1 text-xs sm:text-sm text-[#6B7280]">
                All subscription transactions are securely powered by <strong>Creem</strong> (creem.io), our Merchant of Record.
              </p>

              <div className="mt-6 space-y-3 text-xs sm:text-sm text-[#4B5563]">
                <div className="flex items-start gap-2.5">
                  <Clock className="h-4 w-4 text-[#FF5A36] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-[#111827]">Support Hours</p>
                    <p className="text-xs text-[#6B7280]">Monday – Friday, 9:00 AM – 6:00 PM IST</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-[#111827]">Merchant of Record</p>
                    <p className="text-xs text-[#6B7280]">Orders, VAT & Receipts handled by Creem Merchant of Record</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <HelpCircle className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-[#111827]">Refund & Trial Inquiries</p>
                    <p className="text-xs text-[#6B7280]">
                      Review our{' '}
                      <Link href="/terms#refunds" className="text-[#FF5A36] font-semibold underline">
                        Refund Policy
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-gray-100 flex items-center justify-between text-xs text-[#6B7280]">
              <span>Response time: &lt; 24h</span>
              <Link href="/terms" className="font-semibold text-[#111827] hover:underline">
                Terms of Service →
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Help Accordion */}
        <div className="mt-12 rounded-2xl border border-black/8 bg-white p-6 sm:p-8 shadow-sm">
          <h3 className="text-base font-bold text-[#111827] mb-4">Frequently Asked Support Questions</h3>
          <div className="space-y-4 text-xs sm:text-sm text-[#4B5563]">
            <div>
              <p className="font-semibold text-[#111827]">How does the 3-day free trial work?</p>
              <p className="mt-1 text-[#6B7280]">
                You get full access to all InstaVibes Pro features for 3 days without charge. You can cancel anytime before the 3 days end from your dashboard and nothing will be billed.
              </p>
            </div>
            <div className="pt-3 border-t border-gray-100">
              <p className="font-semibold text-[#111827]">How can I cancel my subscription?</p>
              <p className="mt-1 text-[#6B7280]">
                You can cancel in 1 click from your Dashboard Settings or by emailing support@instavibes.com. Your access remains active until the end of the paid billing period.
              </p>
            </div>
            <div className="pt-3 border-t border-gray-100">
              <p className="font-semibold text-[#111827]">What are the AI Acceptable Use Rules?</p>
              <p className="mt-1 text-[#6B7280]">
                We prohibit sexually explicit/NSFW content, hate speech, scams, and unlawful material. Full rules are documented in our{' '}
                <Link href="/terms" className="text-[#FF5A36] font-semibold underline">
                  Terms of Service & AUP
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-black/8 bg-white py-8 px-6 text-center text-xs text-[#6B7280]">
        <div className="mx-auto max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} InstaVibes. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="hover:text-[#111827]">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-[#111827]">Privacy Policy</Link>
            <Link href="/contact" className="hover:text-[#111827] font-semibold">Contact Us</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
