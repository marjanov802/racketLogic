import type { Metadata } from 'next'
import { ComingSoon } from '@/components/ui/ComingSoon'

export const metadata: Metadata = { title: 'Playbooks - Coming Soon' }

export default function PlaybookPage() {
  return (
    <ComingSoon
      title="Playbooks"
      message="Practical PDF guides on strings, rackets, shoes and match tactics. Coming soon."
    />
  )
}
