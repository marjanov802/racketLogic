import { prisma } from '@/lib/prisma'
import { formatPrice, formatDate } from '@/lib/utils'
import { Card } from '@/components/ui/Card'
import { TrendingUp, BookOpen, Calendar } from 'lucide-react'

async function getRevenue() {
  try {
    const [
      playbookRevenue,
      playbookCount,
      allPurchases,
    ] = await Promise.all([
      prisma.purchase.aggregate({ where: { paymentStatus: 'PAID' }, _sum: { amount: true } }),
      prisma.purchase.count({ where: { paymentStatus: 'PAID' } }),
      prisma.purchase.findMany({
        where: { paymentStatus: 'PAID' },
        include: { playbook: true, user: true },
        orderBy: { createdAt: 'desc' },
        take: 20,
      }),
    ])
    return { playbookRevenue, playbookCount, allPurchases }
  } catch { return null }
}

export default async function AdminRevenuePage() {
  const data = await getRevenue()
  const totalRevenue = Number(data?.playbookRevenue._sum.amount ?? 0)

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy-900">Revenue</h1>
        <p className="text-gray-500 text-sm mt-1">Playbook sales overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
        {[
          { label: 'Total Revenue', value: formatPrice(totalRevenue), icon: TrendingUp, color: 'text-green-600 bg-green-50' },
          { label: 'Total Sales', value: data?.playbookCount ?? 0, icon: BookOpen, color: 'text-lime-600 bg-lime-50' },
          { label: 'Avg. Order Value', value: data?.playbookCount ? formatPrice(totalRevenue / (data.playbookCount || 1)) : '—', icon: Calendar, color: 'text-navy-600 bg-navy-50' },
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

      <h2 className="font-bold text-navy-900 mb-4">Recent Transactions</h2>
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-gray-100 bg-gray-50">
            <th className="text-left px-4 py-3 font-semibold text-gray-600">Product</th>
            <th className="text-left px-4 py-3 font-semibold text-gray-600">Customer</th>
            <th className="text-left px-4 py-3 font-semibold text-gray-600">Date</th>
            <th className="text-left px-4 py-3 font-semibold text-gray-600">Amount</th>
          </tr></thead>
          <tbody className="divide-y divide-gray-50">
            {data?.allPurchases.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-navy-900">{p.playbook?.title ?? 'Playbook'}</td>
                <td className="px-4 py-3 text-gray-500">{p.user?.email}</td>
                <td className="px-4 py-3 text-gray-500">{formatDate(p.createdAt)}</td>
                <td className="px-4 py-3 font-bold text-lime-600">{formatPrice(Number(p.amount))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
