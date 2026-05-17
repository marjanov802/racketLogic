import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Plus, Pencil } from 'lucide-react'
import { DeleteButton } from '@/components/admin/DeleteButton'

async function getReviews() {
  try {
    return await prisma.reviewArticle.findMany({ orderBy: { createdAt: 'desc' } })
  } catch {
    return []
  }
}

export default async function AdminReviewsPage() {
  const reviews = await getReviews()

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Reviews</h1>
          <p className="text-gray-500 text-sm mt-1">{reviews.length} reviews</p>
        </div>
        <Link href="/admin/reviews/new">
          <Button size="sm"><Plus className="w-4 h-4" /> New Review</Button>
        </Link>
      </div>
      {reviews.length === 0 ? (
        <Card className="text-center py-16">
          <p className="text-gray-400 mb-4">No reviews yet.</p>
          <Link href="/admin/reviews/new"><Button size="sm">Write first review</Button></Link>
        </Card>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Product</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Category</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Rating</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {reviews.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-navy-900">{r.productName}</p>
                    <p className="text-xs text-gray-400">{r.brand}</p>
                  </td>
                  <td className="px-4 py-3"><Badge variant="gray">{r.category}</Badge></td>
                  <td className="px-4 py-3 text-navy-900">{r.rating ? `${r.rating}/10` : '—'}</td>
                  <td className="px-4 py-3">
                    <Badge variant={r.published ? 'green' : 'yellow'}>{r.published ? 'Published' : 'Draft'}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Link href={`/admin/reviews/${r.id}`} className="text-lime-600 hover:underline text-xs font-medium flex items-center gap-1">
                        <Pencil className="w-3 h-3" />Edit
                      </Link>
                      <DeleteButton endpoint={`/api/admin/reviews/${r.id}`} label={r.productName} />
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
