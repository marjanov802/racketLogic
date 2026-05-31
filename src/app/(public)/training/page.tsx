import type { Metadata } from 'next'
import { ComingSoon } from '@/components/ui/ComingSoon'

export const metadata: Metadata = { title: 'Training — Coming Soon' }

export default function TrainingPage() {
  return (
    <ComingSoon
      title="Training"
      message="Structured training plans and match preparation guides. Coming soon."
    />
  )
}
