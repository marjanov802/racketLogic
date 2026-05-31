import type { Metadata } from 'next'
import { ComingSoon } from '@/components/ui/ComingSoon'

export const metadata: Metadata = { title: 'Dashboard — Coming Soon' }

export default function DashboardPage() {
  return (
    <ComingSoon
      title="Dashboard"
      message="Your purchased playbooks and account details will live here. Coming soon."
    />
  )
}
