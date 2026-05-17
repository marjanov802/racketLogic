import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Plus, Pencil, Clock } from 'lucide-react'
import { DeleteButton } from '@/components/admin/DeleteButton'

async function getArticles() {
  try { return await prisma.learnArticle.findMany({ orderBy: { createdAt: 'desc' } }) }
  catch { return [] }
}

export default async function AdminArticlesPage() {
  const articles = await getArticles()
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Learn Articles</h1>
          <p className="text-gray-500 text-sm mt-1">{articles.length} articles</p>
        </div>
        <Link href="/admin/articles/new"><Button size="sm"><Plus className="w-4 h-4" /> New Article</Button></Link>
      </div>
      {articles.length === 0 ? (
        <Card className="text-center py-16"><p className="text-gray-400 mb-4">No articles yet.</p><Link href="/admin/articles/new"><Button size="sm">Write first article</Button></Link></Card>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Title</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Category</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Read time</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
              <th className="px-4 py-3"></th>
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {articles.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3"><p className="font-medium text-navy-900">{a.title}</p><p className="text-xs text-gray-400">{a.slug}</p></td>
                  <td className="px-4 py-3"><Badge variant="gray">{a.category}</Badge></td>
                  <td className="px-4 py-3 text-gray-500">{a.readingTime ? `${a.readingTime} min` : '—'}</td>
                  <td className="px-4 py-3"><Badge variant={a.published ? 'green' : 'yellow'}>{a.published ? 'Published' : 'Draft'}</Badge></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Link href={`/admin/articles/${a.id}`} className="text-lime-600 hover:underline text-xs font-medium flex items-center gap-1"><Pencil className="w-3 h-3" />Edit</Link>
                      <DeleteButton endpoint={`/api/admin/articles/${a.id}`} label={a.title} />
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
