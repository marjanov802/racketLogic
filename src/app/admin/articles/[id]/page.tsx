import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { ArticleForm } from '@/components/admin/ArticleForm'

interface PageProps { params: Promise<{ id: string }> }

export default async function EditArticlePage({ params }: PageProps) {
  const { id } = await params
  let article
  try { article = await prisma.learnArticle.findUnique({ where: { id } }) }
  catch { notFound() }
  if (!article) notFound()

  return (
    <div className="p-8 max-w-4xl">
      <Link href="/admin/articles" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-navy-900 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Articles
      </Link>
      <h1 className="text-2xl font-bold text-navy-900 mb-8">Edit Article</h1>
      <ArticleForm article={{
        id: article.id, title: article.title, slug: article.slug,
        category: article.category, excerpt: article.excerpt, content: article.content,
        readingTime: article.readingTime ? String(article.readingTime) : '',
        published: article.published, featured: article.featured,
      }} />
    </div>
  )
}
