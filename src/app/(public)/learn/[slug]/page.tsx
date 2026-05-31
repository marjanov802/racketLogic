import type { Metadata } from 'next'
import { ComingSoon } from '@/components/ui/ComingSoon'

export const metadata: Metadata = { title: 'Learn - Coming Soon' }

export default function ArticlePage() {
  return (
    <ComingSoon
      title="Learn"
      message="Free tennis articles covering string tension, racket specs, warm-ups, shoes and tactics. Coming soon."
    />
  )
}
