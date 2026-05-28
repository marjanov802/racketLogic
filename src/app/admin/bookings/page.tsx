import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { formatDate, formatPrice } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'

const statusVariants: Record<string, 'default' | 'lime' | 'navy' | 'green' | 'red' | 'yellow' | 'gray'> = {
  NEW: 'yellow', CONFIRMED: 'navy', IN_PROGRESS: 'lime',
  READY_FOR_COLLECTION: 'green', COMPLETED: 'default', CANCELLED: 'red',
}

async function getBookings() {
  try {
    return await prisma.booking.findMany({
      orderBy: { createdAt: 'desc' },
    })
  } catch {
    return []
  }
}

export default async function AdminBookingsPage() {
  const bookings = await getBookings()

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy-900">Bookings</h1>
        <p className="text-gray-500 text-sm mt-1">{bookings.length} total booking{bookings.length !== 1 ? 's' : ''}</p>
      </div>

      {bookings.length === 0 ? (
        <Card className="text-center py-16 text-gray-400">No bookings yet.</Card>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Customer</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Service</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Date</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Payment</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {bookings.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-navy-900">{b.customerName}</p>
                    <p className="text-xs text-gray-400">{b.email}</p>
                  </td>
                  <td className="px-4 py-3 capitalize text-gray-700">
                    {b.serviceType.replace(/-/g, ' ')}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{formatDate(b.createdAt)}</td>
                  <td className="px-4 py-3">
                    <Badge variant={statusVariants[b.status] ?? 'default'} className="text-xs">
                      {b.status.replace(/_/g, ' ')}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={b.paymentStatus === 'PAID' ? 'green' : 'gray'} className="text-xs">
                      {b.paymentStatus.replace(/_/g, ' ')}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/bookings/${b.id}`} className="text-lime-600 hover:underline text-xs font-medium">
                      View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
