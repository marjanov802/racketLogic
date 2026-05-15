'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { RichEditor } from './RichEditor'
import { slugify } from '@/lib/utils'

interface ArticleData {
  id?: string
  title?: string
  slug?: string
  category?: string
  excerpt?: string
  content?: string
  readingTime?: string
  published?: boolean
  featured?: boolean
}

const categoryOptions = [
  { value: 'Equipment', label: 'Equipment' },
  { value: 'Training', label: 'Training' },
  { value: 'Matchplay', label: 'Matchplay' },
  { value: 'Beginner', label: 'Beginner' },
  { value: 'Fitness', label: 'Fitness' },
]

export function ArticleForm({ article }: { article?: ArticleData }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState(article?.title ?? '')
  const [slug, setSlug] = useState(article?.slug ?? '')
  const [content, setContent] = useState(article?.content ?? '')

  const isEdit = !!article?.id

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const form = e.currentTarget
    const data = new FormData(form)
    const payload = {
      title: data.get('title'),
      slug: data.get('slug'),
      category: data.get('category'),
      excerpt: data.get('excerpt'),
      content,
      readingTime: data.get('readingTime') ? parseInt(data.get('readingTime') as string) : null,
      published: data.get('published') === 'true',
      featured: data.get('featured') === 'true',
    }
    try {
      const url = isEdit ? `/api/admin/articles/${article!.id}` : '/api/admin/articles'
      const res = await fetch(url, { method: isEdit ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!res.ok) throw new Error()
      toast.success(isEdit ? 'Article updated' : 'Article created')
      router.push('/admin/articles')
    } catch {
      toast.error('Failed to save article')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <h3 className="font-bold text-navy-900 mb-4">Article Info</h3>
        <div className="space-y-4">
          <Input label="Title" name="title" required value={title} onChange={(e) => { setTitle(e.target.value); if (!isEdit) setSlug(slugify(e.target.value)) }} />
          <Input label="Slug" name="slug" required value={slug} onChange={(e) => setSlug(e.target.value)} />
          <div className="grid grid-cols-2 gap-4">
            <Select label="Category" name="category" required options={categoryOptions} defaultValue={article?.category} placeholder="Select category" />
            <Input label="Reading time (minutes)" name="readingTime" type="number" defaultValue={article?.readingTime} placeholder="e.g. 5" />
          </div>
          <Textarea label="Excerpt" name="excerpt" required defaultValue={article?.excerpt} rows={2} placeholder="1–2 sentence summary shown in article listings" />
        </div>
      </Card>
      <Card>
        <h3 className="font-bold text-navy-900 mb-4">Article Content</h3>
        <RichEditor content={content} onChange={setContent} placeholder="Write the full article here..." />
      </Card>
      <Card>
        <h3 className="font-bold text-navy-900 mb-4">Settings</h3>
        <div className="grid grid-cols-2 gap-4">
          <Select label="Published" name="published" defaultValue={article?.published ? 'true' : 'false'} options={[{ value: 'false', label: 'Draft' }, { value: 'true', label: 'Published' }]} />
          <Select label="Featured" name="featured" defaultValue={article?.featured ? 'true' : 'false'} options={[{ value: 'false', label: 'No' }, { value: 'true', label: 'Yes' }]} />
        </div>
      </Card>
      <div className="flex gap-3">
        <Button type="submit" loading={loading}>{isEdit ? 'Update Article' : 'Create Article'}</Button>
        <Button type="button" variant="ghost" onClick={() => router.push('/admin/articles')}>Cancel</Button>
      </div>
    </form>
  )
}
