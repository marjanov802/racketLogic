import { ArticleForm } from '@/components/admin/ArticleForm'

export default function NewArticlePage() {
  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-2xl font-bold text-navy-900 mb-8">New Learn Article</h1>
      <ArticleForm />
    </div>
  )
}
