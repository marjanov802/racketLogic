import { prisma } from '@/lib/prisma'
import { formatPrice, formatDate } from '@/lib/utils'
import Link from 'next/link'
import { Calendar, BookOpen, Users, TrendingUp, ArrowRight, MessageSquare } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

async function getStats() {
  try {
    const [
      totalBookings,
      newBookings,
      totalPurchases,
      purchaseRevenue,
      bookingRevenue,
      totalUsers,
      newEnquiries,
      recentBookings,
      recentPurchases,
    ] = await Promise.all([
      prisma.booking.count(),
      prisma.booking.count({ where: { status: 'NEW' } }),
      prisma.purchase.count({ where: { paymentStatus: 'PAID' } }),
      prisma.purchase.aggregate({ where: { paymentStatus: 'PAID' }, _sum: { amount: true } }),
      prisma.booking.aggregate({ where: { paymentStatus: 'PAID' }, _sum: { price: true } }),
      prisma.user.count(),
      prisma.customProgrammeEnquiry.count({ where: { status: 'NEW' } }),
      prisma.booking.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
      prisma.purchase.findMany({ where: { paymentStatus: 'PAID' }, include: { playbook: true, user: true }, orderBy: { createdAt: 'desc' }, take: 5 }),
    ])

    return { totalBookings, newBookings, totalPurchases, purchaseRevenue, bookingRevenue, totalUsers, newEnquiries, recentBookings, recentPurchases }
  } catch {
    return null
  }
}

const statusColors: Record<string, 'default' | 'lime' | 'navy' | 'green' | 'red' | 'yellow' | 'gray'> = {
  NEW: 'yellow', CONFIRMED: 'navy', IN_PROGRESS: 'lime',
  READY_FOR_COLLECTION: 'green', COMPLETED: 'default', CANCELLED: 'red',
}

export default async function AdminPage() {
  const stats = await getStats()
  const totalRevenue = Number(stats?.purchaseRevenue._sum.amount ?? 0) + Number(stats?.bookingRevenue._sum.price ?? 0)

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy-900">Admin Overview</h1>
        <p className="text-gray-500 text-sm mt-1">RacketLogic business dashboard</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {[
          { label: 'New Bookings', value: stats?.newBookings ?? 0, total: stats?.totalBookings, icon: Calendar, href: '/admin/bookings', color: 'text-yellow-600 bg-yellow-50' },
          { label: 'Playbook Sales', value: stats?.totalPurchases ?? 0, icon: BookOpen, href: '/admin/playbooks', color: 'text-lime-600 bg-lime-50' },
          { label: 'Revenue', value: formatPrice(totalRevenue), icon: TrendingUp, href: '/admin/revenue', color: 'text-green-600 bg-green-50' },
          { label: 'New Enquiries', value: stats?.newEnquiries ?? 0, icon: MessageSquare, href: '/admin/enquiries', color: 'text-navy-600 bg-navy-50' },
        ].map((stat) => {
          const Icon = stat.icon
          return (
            <Link key={stat.label} href={stat.href}>
              <Card hover className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-navy-900">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                  {stat.total !== undefined && (
                    <p className="text-xs text-gray-400">{stat.total} total</p>
                  )}
                </div>
              </Card>
            </Link>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent bookings */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-navy-900">Recent Bookings</h2>
            <Link href="/admin/bookings" className="text-xs text-lime-600 flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-2">
            {stats?.recentBookings.length === 0 && (
              <Card className="text-center py-8 text-gray-400 text-sm">No bookings yet.</Card>
            )}
            {stats?.recentBookings.map((b) => (
              <Link key={b.id} href={`/admin/bookings/${b.id}`}>
                <Card hover padding="sm" className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium text-navy-900 text-sm truncate">{b.customerName}</p>
                    <p className="text-xs text-gray-500 capitalize">{b.serviceType.replace(/-/g, ' ')} · {formatDate(b.createdAt)}</p>
                  </div>
                  <Badge variant={statusColors[b.status] ?? 'default'} className="flex-shrink-0 text-xs">
                    {b.status.replace(/_/g, ' ')}
                  </Badge>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent purchases */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-navy-900">Recent Purchases</h2>
            <Link href="/admin/playbooks" className="text-xs text-lime-600 flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-2">
            {stats?.recentPurchases.length === 0 && (
              <Card className="text-center py-8 text-gray-400 text-sm">No purchases yet.</Card>
            )}
            {stats?.recentPurchases.map((p) => (
              <Card key={p.id} padding="sm" className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium text-navy-900 text-sm truncate">{p.playbook?.title ?? 'Playbook'}</p>
                  <p className="text-xs text-gray-500">{p.user?.email} · {formatDate(p.createdAt)}</p>
                </div>
                <span className="text-sm font-bold text-lime-600 flex-shrink-0">{formatPrice(Number(p.amount))}</span>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="mt-10">
        <h2 className="font-bold text-navy-900 mb-4">Quick actions</h2>
        <div className="flex flex-wrap gap-3">
          {[
            { href: '/admin/home', label: 'Edit Home Page' },
            { href: '/admin/playbooks/new', label: '+ New Playbook' },
            { href: '/admin/reviews/new', label: '+ New Review' },
            { href: '/admin/articles/new', label: '+ New Article' },
            { href: '/admin/bookings', label: 'Manage Bookings' },
            { href: '/admin/enquiries', label: 'View Enquiries' },
          ].map((action) => (
            <Link key={action.href} href={action.href}>
              <div className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-navy-900 hover:border-lime-400 hover:bg-lime-50 transition-colors">
                {action.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
