import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Plus, Pencil } from 'lucide-react'
import { DeleteButton } from '@/components/admin/DeleteButton'

async function getPlaybooks() {
  try {
    return await prisma.playbook.findMany({ orderBy: { createdAt: 'desc' } })
  } catch {
    return []
  }
}

export default async function AdminPlaybooksPage() {
  const playbooks = await getPlaybooks()

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Playbooks</h1>
          <p className="text-gray-500 text-sm mt-1">{playbooks.length} playbooks</p>
        </div>
        <Link href="/admin/playbooks/new">
          <Button size="sm">
            <Plus className="w-4 h-4" />
            New Playbook
          </Button>
        </Link>
      </div>

      {playbooks.length === 0 ? (
        <Card className="text-center py-16">
          <p className="text-gray-400 mb-4">No playbooks yet.</p>
          <Link href="/admin/playbooks/new">
            <Button size="sm">Create first playbook</Button>
          </Link>
        </Card>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Title</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Category</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Price</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">PDF</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {playbooks.map((pb) => (
                <tr key={pb.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-navy-900">{pb.title}</p>
                    <p className="text-xs text-gray-400">{pb.slug}</p>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="gray">{pb.isBundle ? 'Bundle' : pb.category}</Badge>
                  </td>
                  <td className="px-4 py-3 font-medium text-navy-900">{formatPrice(Number(pb.price))}</td>
                  <td className="px-4 py-3">
                    <Badge variant={pb.published ? 'green' : 'yellow'}>
                      {pb.published ? 'Published' : 'Draft'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={pb.fileUrl ? 'lime' : 'red'}>
                      {pb.fileUrl ? 'Uploaded' : 'No PDF'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Link href={`/admin/playbooks/${pb.id}`} className="text-lime-600 hover:underline text-xs font-medium flex items-center gap-1">
                        <Pencil className="w-3 h-3" />Edit
                      </Link>
                      <DeleteButton endpoint={`/api/admin/playbooks/${pb.id}`} label={pb.title} />
                    </div>
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
