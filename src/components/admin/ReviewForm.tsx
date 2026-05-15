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

interface ReviewData {
  id?: string
  title?: string
  slug?: string
  category?: string
  productName?: string
  brand?: string
  excerpt?: string
  content?: string
  affiliateUrl?: string
  rating?: string
  whoIsItFor?: string
  whoIsItNotFor?: string
  mainBenefit?: string
  mainDownside?: string
  verdict?: string
  published?: boolean
  featured?: boolean
}

const categoryOptions = [
  { value: 'Rackets', label: 'Rackets' },
  { value: 'Strings', label: 'Strings' },
  { value: 'Shoes', label: 'Shoes' },
  { value: 'Grips', label: 'Grips' },
  { value: 'Accessories', label: 'Accessories' },
  { value: 'Comparisons', label: 'Comparisons' },
]

export function ReviewForm({ review }: { review?: ReviewData }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState(review?.title ?? '')
  const [slug, setSlug] = useState(review?.slug ?? '')
  const [content, setContent] = useState(review?.content ?? '')

  const isEdit = !!review?.id

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setTitle(e.target.value)
    if (!isEdit) setSlug(slugify(e.target.value))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const form = e.currentTarget
    const data = new FormData(form)
    const payload = {
      title: data.get('title'),
      slug: data.get('slug'),
      category: data.get('category'),
      productName: data.get('productName'),
      brand: data.get('brand'),
      excerpt: data.get('excerpt'),
      content,
      affiliateUrl: data.get('affiliateUrl'),
      rating: data.get('rating') ? parseInt(data.get('rating') as string) : null,
      whoIsItFor: data.get('whoIsItFor'),
      whoIsItNotFor: data.get('whoIsItNotFor'),
      mainBenefit: data.get('mainBenefit'),
      mainDownside: data.get('mainDownside'),
      verdict: data.get('verdict'),
      published: data.get('published') === 'true',
      featured: data.get('featured') === 'true',
    }
    try {
      const url = isEdit ? `/api/admin/reviews/${review!.id}` : '/api/admin/reviews'
      const res = await fetch(url, { method: isEdit ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!res.ok) throw new Error()
      toast.success(isEdit ? 'Review updated' : 'Review created')
      router.push('/admin/reviews')
    } catch {
      toast.error('Failed to save review')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <h3 className="font-bold text-navy-900 mb-4">Product Info</h3>
        <div className="space-y-4">
          <Input label="Review Title" name="title" required value={title} onChange={handleTitleChange} placeholder="e.g. Wilson Blade 98 v8 Review" />
          <Input label="Slug" name="slug" required value={slug} onChange={(e) => setSlug(e.target.value)} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Product Name" name="productName" required defaultValue={review?.productName} placeholder="e.g. Blade 98 v8" />
            <Input label="Brand" name="brand" required defaultValue={review?.brand} placeholder="e.g. Wilson" />
          </div>
          <Select label="Category" name="category" required options={categoryOptions} defaultValue={review?.category} placeholder="Select category" />
          <Textarea label="Short excerpt" name="excerpt" required defaultValue={review?.excerpt} rows={2} placeholder="1–2 sentence summary shown in listings" />
          <Input label="Affiliate URL (optional)" name="affiliateUrl" type="url" defaultValue={review?.affiliateUrl ?? ''} placeholder="https://..." />
          <Input label="Rating (1–10)" name="rating" type="number" min={1} max={10} defaultValue={review?.rating} placeholder="e.g. 8" />
        </div>
      </Card>

      <Card>
        <h3 className="font-bold text-navy-900 mb-4">Quick Verdict Fields</h3>
        <div className="space-y-4">
          <Textarea label="Who it's for" name="whoIsItFor" defaultValue={review?.whoIsItFor ?? ''} rows={2} />
          <Textarea label="Who it's not for" name="whoIsItNotFor" defaultValue={review?.whoIsItNotFor ?? ''} rows={2} />
          <Input label="Main benefit" name="mainBenefit" defaultValue={review?.mainBenefit ?? ''} />
          <Input label="Main downside" name="mainDownside" defaultValue={review?.mainDownside ?? ''} />
          <Textarea label="RacketLogic Verdict" name="verdict" defaultValue={review?.verdict ?? ''} rows={3} placeholder="The final verdict shown at the bottom of the review." />
        </div>
      </Card>

      <Card>
        <h3 className="font-bold text-navy-900 mb-4">Full Review Content</h3>
        <RichEditor content={content} onChange={setContent} placeholder="Write the full review here..." />
      </Card>

      <Card>
        <h3 className="font-bold text-navy-900 mb-4">Settings</h3>
        <div className="grid grid-cols-2 gap-4">
          <Select label="Published" name="published" defaultValue={review?.published ? 'true' : 'false'} options={[{ value: 'false', label: 'Draft' }, { value: 'true', label: 'Published' }]} />
          <Select label="Featured" name="featured" defaultValue={review?.featured ? 'true' : 'false'} options={[{ value: 'false', label: 'No' }, { value: 'true', label: 'Yes — show on homepage' }]} />
        </div>
      </Card>

      <div className="flex gap-3">
        <Button type="submit" loading={loading}>{isEdit ? 'Update Review' : 'Create Review'}</Button>
        <Button type="button" variant="ghost" onClick={() => router.push('/admin/reviews')}>Cancel</Button>
      </div>
    </form>
  )
}
