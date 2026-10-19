import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
})

export const metadata: Metadata = {
  title: {
    default: 'InstaVibes — Never Run Out of What to Post',
    template: '%s | InstaVibes',
  },
  description:
    'Turn any viral reel into your next script, in your own voice. Find what\'s working in your niche and plan it on a calendar. English, Hindi & Hinglish.',
  keywords: ['instagram reels', 'viral content', 'script writing', 'content calendar', 'instagram growth'],
  openGraph: {
    title: 'InstaVibes: Never Run Out of What to Post',
    description: 'Turn any viral reel into your next script, in your own voice.',
    siteName: 'InstaVibes',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'InstaVibes: Never Run Out of What to Post',
    description: 'Turn any viral reel into your next script, in your own voice.',
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${geist.variable} font-geist antialiased bg-background text-text`}>
        {children}
      </body>
    </html>
  )
}
