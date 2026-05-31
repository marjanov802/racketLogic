import type { Metadata } from 'next'
import { ComingSoon } from '@/components/ui/ComingSoon'

export const metadata: Metadata = { title: 'Custom Programmes — Coming Soon' }

export default function CustomProgrammesPage() {
  return (
    <ComingSoon
      title="Custom Programmes"
      message="Bespoke training programmes built around your game. Coming soon."
    />
  )
}
