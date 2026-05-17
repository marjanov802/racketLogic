import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { BookingStatusForm } from '@/components/admin/BookingStatusForm'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function AdminBookingDetailPage({ params }: PageProps) {
  const { id } = await params

  let booking
  try {
    booking = await prisma.booking.findUnique({ where: { id } })
  } catch {
    notFound()
  }
  if (!booking) notFound()

  const statusColors: Record<string, 'default' | 'lime' | 'navy' | 'green' | 'red' | 'yellow' | 'gray'> = {
    NEW: 'yellow', CONFIRMED: 'navy', IN_PROGRESS: 'lime',
    READY_FOR_COLLECTION: 'green', COMPLETED: 'default', CANCELLED: 'red',
  }

  return (
    <div className="p-8 max-w-4xl">
      <Link href="/admin/bookings" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-navy-900 mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to Bookings
      </Link>

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">{booking.customerName}</h1>
          <p className="text-gray-500 text-sm">{formatDate(booking.createdAt)}</p>
        </div>
        <Badge variant={statusColors[booking.status] ?? 'default'}>{booking.status.replace(/_/g, ' ')}</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <h3 className="font-bold text-navy-900 mb-4">Customer Details</h3>
          <dl className="space-y-2 text-sm">
            {[
              ['Name', booking.customerName],
              ['Email', booking.email],
              ['Phone', booking.phone || '—'],
            ].map(([label, val]) => (
              <div key={label} className="flex gap-3">
                <dt className="text-gray-500 w-20 flex-shrink-0">{label}</dt>
                <dd className="text-navy-900 font-medium">{val}</dd>
              </div>
            ))}
          </dl>
        </Card>

        <Card>
          <h3 className="font-bold text-navy-900 mb-4">Service Details</h3>
          <dl className="space-y-2 text-sm">
            {[
              ['Service', booking.serviceType.replace(/-/g, ' ')],
              ['Drop-off', booking.dropOffLocation.replace(/-/g, ' ')],
              ['Plays', booking.howOften || '—'],
            ].map(([label, val]) => (
              <div key={label} className="flex gap-3">
                <dt className="text-gray-500 w-20 flex-shrink-0">{label}</dt>
                <dd className="text-navy-900 font-medium capitalize">{val}</dd>
              </div>
            ))}
          </dl>
        </Card>

        <Card>
          <h3 className="font-bold text-navy-900 mb-4">Racket Details</h3>
          <dl className="space-y-2 text-sm">
            {[
              ['Racket', booking.racketModel || '—'],
              ['String', booking.stringName || '—'],
              ['Desired tension', booking.desiredTension || '—'],
            ].map(([label, val]) => (
              <div key={label} className="flex gap-3">
                <dt className="text-gray-500 w-32 flex-shrink-0">{label}</dt>
                <dd className="text-navy-900 font-medium">{val}</dd>
              </div>
            ))}
          </dl>
        </Card>

        <Card>
          <h3 className="font-bold text-navy-900 mb-4">Player Goals</h3>
          <div className="flex flex-wrap gap-2 mb-3">
            {booking.playGoals.length > 0
              ? booking.playGoals.map((g) => <Badge key={g} variant="lime">{g}</Badge>)
              : <span className="text-sm text-gray-400">None specified</span>
            }
          </div>
          <div className="text-sm">
            <span className="text-gray-500">Arm issues: </span>
            <span className="font-medium text-navy-900">{booking.armIssues ? 'Yes' : 'No'}</span>
            {booking.armIssuesDetail && <p className="text-gray-600 mt-1">{booking.armIssuesDetail}</p>}
          </div>
        </Card>
      </div>

      {booking.notes && (
        <Card className="mb-6">
          <h3 className="font-bold text-navy-900 mb-2">Customer Notes</h3>
          <p className="text-sm text-gray-700">{booking.notes}</p>
        </Card>
      )}

      {/* Status update form */}
      <BookingStatusForm
        bookingId={booking.id}
        currentStatus={booking.status}
        currentPaymentStatus={booking.paymentStatus}
        currentAdminNotes={booking.adminNotes ?? ''}
        currentPrice={booking.price ? String(booking.price) : ''}
      />
    </div>
  )
}
