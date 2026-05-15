import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { Toaster } from 'sonner'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'RacketLogic — Smarter Tennis Setups, Built Around Your Game',
    template: '%s | RacketLogic',
  },
  description:
    'RacketLogic provides professional tennis racket stringing, practical setup guides, training playbooks and honest gear reviews to help players choose better equipment and train with more structure.',
  keywords: [
    'tennis stringing',
    'tennis racket setup',
    'tennis playbooks',
    'tennis training guides',
    'racket string advice',
    'tennis gear reviews',
    'tennis coaching',
  ],
  authors: [{ name: 'RacketLogic' }],
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    siteName: 'RacketLogic',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en-GB">
        <body>
          {children}
          <Toaster richColors position="top-right" />
        </body>
      </html>
    </ClerkProvider>
  )
}
