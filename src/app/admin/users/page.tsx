import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'

async function getUsers() {
  try {
    return await prisma.user.findMany({
      include: { _count: { select: { purchases: true, bookings: true } } },
      orderBy: { createdAt: 'desc' },
    })
  } catch { return [] }
}

export default async function AdminUsersPage() {
  const users = await getUsers()

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy-900">Users</h1>
        <p className="text-gray-500 text-sm mt-1">{users.length} registered users</p>
      </div>
      {users.length === 0 ? (
        <Card className="text-center py-16 text-gray-400">No users yet.</Card>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-4 py-3 font-semibold text-gray-600">User</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Role</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Purchases</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Bookings</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Joined</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-navy-900">{u.name ?? '—'}</p>
                    <p className="text-xs text-gray-400">{u.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={u.role === 'ADMIN' ? 'lime' : 'gray'}>{u.role}</Badge>
                  </td>
                  <td className="px-4 py-3 text-navy-900">{u._count.purchases}</td>
                  <td className="px-4 py-3 text-navy-900">{u._count.bookings}</td>
                  <td className="px-4 py-3 text-gray-500">{formatDate(u.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
