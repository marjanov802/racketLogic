import { prisma } from '@/lib/prisma'
import { formatPrice, formatDate } from '@/lib/utils'
import { Card } from '@/components/ui/Card'
import { TrendingUp, BookOpen, Calendar, Wrench } from 'lucide-react'

async function getRevenue() {
  try {
    const [
      purchaseRevenue,
      purchaseCount,
      bookingRevenue,
      paidBookingCount,
      recentPurchases,
      recentPaidBookings,
    ] = await Promise.all([
      prisma.purchase.aggregate({ where: { paymentStatus: 'PAID' }, _sum: { amount: true } }),
      prisma.purchase.count({ where: { paymentStatus: 'PAID' } }),
      prisma.booking.aggregate({ where: { paymentStatus: 'PAID' }, _sum: { price: true } }),
      prisma.booking.count({ where: { paymentStatus: 'PAID' } }),
      prisma.purchase.findMany({
        where: { paymentStatus: 'PAID' },
        include: { playbook: true, user: true },
        orderBy: { createdAt: 'desc' },
        take: 20,
      }),
      prisma.booking.findMany({
        where: { paymentStatus: 'PAID' },
        orderBy: { updatedAt: 'desc' },
        take: 20,
      }),
    ])

    return { purchaseRevenue, purchaseCount, bookingRevenue, paidBookingCount, recentPurchases, recentPaidBookings }
  } catch {
    return null
  }
}

export default async function AdminRevenuePage() {
  const data = await getRevenue()
  const playbookTotal = Number(data?.purchaseRevenue._sum.amount ?? 0)
  const stringingTotal = Number(data?.bookingRevenue._sum.price ?? 0)
  const totalRevenue = playbookTotal + stringingTotal
  const totalPaidItems = (data?.purchaseCount ?? 0) + (data?.paidBookingCount ?? 0)

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy-900">Revenue</h1>
        <p className="text-gray-500 text-sm mt-1">
          Revenue is calculated from paid playbook purchases and paid stringing bookings with a saved price.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-5 mb-10">
        {[
          { label: 'Total Revenue', value: formatPrice(totalRevenue), icon: TrendingUp, color: 'text-green-600 bg-green-50' },
          { label: 'Playbook Revenue', value: formatPrice(playbookTotal), icon: BookOpen, color: 'text-lime-600 bg-lime-50' },
          { label: 'Stringing Revenue', value: formatPrice(stringingTotal), icon: Wrench, color: 'text-navy-600 bg-navy-50' },
          { label: 'Avg. Paid Item', value: totalPaidItems ? formatPrice(totalRevenue / totalPaidItems) : '-', icon: Calendar, color: 'text-yellow-600 bg-yellow-50' },
        ].map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${stat.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-navy-900">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div>
          <h2 className="font-bold text-navy-900 mb-4">Paid Stringing Bookings</h2>
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Customer</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Service</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Date</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data?.recentPaidBookings.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
                      No paid stringing bookings yet. Add a price and mark payment as Paid on a booking.
                    </td>
                  </tr>
                )}
                {data?.recentPaidBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-navy-900">{booking.customerName}</td>
                    <td className="px-4 py-3 text-gray-500">{booking.serviceType.replace(/-/g, ' ')}</td>
                    <td className="px-4 py-3 text-gray-500">{formatDate(booking.updatedAt)}</td>
                    <td className="px-4 py-3 font-bold text-lime-600">{formatPrice(Number(booking.price ?? 0))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h2 className="font-bold text-navy-900 mb-4">Paid Playbook Purchases</h2>
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Product</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Customer</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Date</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data?.recentPurchases.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-gray-400">No paid playbook purchases yet.</td>
                  </tr>
                )}
                {data?.recentPurchases.map((purchase) => (
                  <tr key={purchase.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-navy-900">{purchase.playbook?.title ?? 'Playbook'}</td>
                    <td className="px-4 py-3 text-gray-500">{purchase.user?.email}</td>
                    <td className="px-4 py-3 text-gray-500">{formatDate(purchase.createdAt)}</td>
                    <td className="px-4 py-3 font-bold text-lime-600">{formatPrice(Number(purchase.amount))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
