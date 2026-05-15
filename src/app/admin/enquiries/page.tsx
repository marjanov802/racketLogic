import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'

async function getEnquiries() {
  try { return await prisma.customProgrammeEnquiry.findMany({ orderBy: { createdAt: 'desc' } }) }
  catch { return [] }
}

const statusVariants: Record<string, 'default' | 'lime' | 'navy' | 'green' | 'red' | 'yellow' | 'gray'> = {
  NEW: 'yellow', REVIEWING: 'lime', RESPONDED: 'green', CLOSED: 'default',
}

export default async function AdminEnquiriesPage() {
  const enquiries = await getEnquiries()

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy-900">Custom Programme Enquiries</h1>
        <p className="text-gray-500 text-sm mt-1">{enquiries.length} enquiries</p>
      </div>
      {enquiries.length === 0 ? (
        <Card className="text-center py-16 text-gray-400">No enquiries yet.</Card>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Name</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Level</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Goal</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Date</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
              <th className="px-4 py-3"></th>
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {enquiries.map((e) => (
                <tr key={e.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3"><p className="font-medium text-navy-900">{e.name}</p><p className="text-xs text-gray-400">{e.email}</p></td>
                  <td className="px-4 py-3 capitalize text-gray-700">{e.playingLevel}</td>
                  <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{e.goal}</td>
                  <td className="px-4 py-3 text-gray-500">{formatDate(e.createdAt)}</td>
                  <td className="px-4 py-3"><Badge variant={statusVariants[e.status] ?? 'default'}>{e.status}</Badge></td>
                  <td className="px-4 py-3"><Link href={`/admin/enquiries/${e.id}`} className="text-lime-600 hover:underline text-xs font-medium">View →</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
