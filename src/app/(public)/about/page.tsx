import type { Metadata } from 'next'
import { ComingSoon } from '@/components/ui/ComingSoon'

export const metadata: Metadata = { title: 'About — Coming Soon' }

export default function AboutPage() {
  return (
    <ComingSoon
      title="About RacketLogic"
      message="More about who we are and what we do. Coming soon."
    />
  )
}
