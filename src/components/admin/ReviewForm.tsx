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

interface AffiliateLink {
  retailer: string
  price: string
  url: string
}

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
  affiliateLinks?: AffiliateLink[]
  coverImage?: string
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

const reviewTemplateHints: Record<string, string[]> = {
  Rackets: ['Specifications', 'Technology', 'Feel on court', 'Player fit', 'Sweet spot/control/setup notes'],
  Shoes: ['Specifications', 'Colourways', 'Fit and comfort', 'Court feel', 'Durability', 'Court models'],
  Strings: ['String type', 'Gauge/tension', 'Power/spin/control/comfort', 'Lifespan', 'Best player fit'],
  Grips: ['Grip type', 'Tack/absorption', 'Thickness and bevel feel', 'Sweat handling', 'Replacement timing'],
  Accessories: ['Problem solved', 'Compatibility', 'Build quality', 'Value', 'Who should buy it'],
  Comparisons: ['Products compared', 'Main differences', 'Who should choose each option', 'Final recommendation'],
}

function initialAffiliateLinks(review?: ReviewData): AffiliateLink[] {
  if (Array.isArray(review?.affiliateLinks) && review.affiliateLinks.length > 0) {
    return [
      ...review.affiliateLinks,
      ...Array.from({ length: Math.max(0, 3 - review.affiliateLinks.length) }, () => ({ retailer: '', price: '', url: '' })),
    ].slice(0, 3)
  }

  if (review?.affiliateUrl) {
    return [
      { retailer: '', price: '', url: review.affiliateUrl },
      { retailer: '', price: '', url: '' },
      { retailer: '', price: '', url: '' },
    ]
  }

  return [
    { retailer: '', price: '', url: '' },
    { retailer: '', price: '', url: '' },
    { retailer: '', price: '', url: '' },
  ]
}

export function ReviewForm({ review }: { review?: ReviewData }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState(review?.title ?? '')
  const [slug, setSlug] = useState(review?.slug ?? '')
  const [category, setCategory] = useState(review?.category ?? '')
  const [content, setContent] = useState(review?.content ?? '')
  const [affiliateLinks, setAffiliateLinks] = useState<AffiliateLink[]>(initialAffiliateLinks(review))

  const isEdit = !!review?.id

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setTitle(e.target.value)
    if (!isEdit) setSlug(slugify(e.target.value))
  }

  function updateAffiliateLink(index: number, field: keyof AffiliateLink, value: string) {
    setAffiliateLinks((current) => current.map((link, i) => (i === index ? { ...link, [field]: value } : link)))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const data = new FormData(e.currentTarget)
    const cleanAffiliateLinks = affiliateLinks.filter((link) => link.url.trim() || link.retailer.trim() || link.price.trim())
    const firstAffiliateUrl = cleanAffiliateLinks.find((link) => link.url.trim())?.url ?? ''
    const payload = {
      title: data.get('title'),
      slug: data.get('slug'),
      category: data.get('category'),
      productName: data.get('productName'),
      brand: data.get('brand'),
      excerpt: data.get('excerpt'),
      content,
      affiliateUrl: firstAffiliateUrl,
      affiliateLinks: cleanAffiliateLinks,
      coverImage: data.get('coverImage'),
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
      const res = await fetch(url, {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
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
          <Select
            label="Category"
            name="category"
            required
            options={categoryOptions}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Select category"
          />
          {category && (
            <div className="rounded-xl border border-lime-200 bg-lime-50/70 p-4">
              <p className="text-sm font-semibold text-navy-900 mb-2">{category} review page structure</p>
              <div className="flex flex-wrap gap-2">
                {(reviewTemplateHints[category] ?? []).map((item) => (
                  <span key={item} className="rounded-full bg-white border border-lime-200 px-3 py-1 text-xs font-medium text-lime-800">
                    {item}
                  </span>
                ))}
              </div>
              <p className="mt-3 text-xs text-gray-600">
                The public review page uses this category template automatically. Use the title, image, excerpt and verdict fields for the review-specific opinion. For a fully custom review, send the notes here and we can add a specific template for that product.
              </p>
            </div>
          )}
          <Textarea label="Short excerpt" name="excerpt" required defaultValue={review?.excerpt} rows={2} placeholder="1-2 sentence summary shown in listings" />
          <Input label="Cover image URL (optional)" name="coverImage" defaultValue={review?.coverImage ?? ''} placeholder="/images/reviews/example.jpg" />
          <Input label="Rating (1-10, optional/internal)" name="rating" type="number" min={1} max={10} defaultValue={review?.rating} placeholder="e.g. 8" />
        </div>
      </Card>

      <Card>
        <h3 className="font-bold text-navy-900 mb-4">Affiliate Retailer Links</h3>
        <p className="text-sm text-gray-500 mb-4">
          Add up to three retailer links. Prices are shown as guide prices, so update them manually when needed.
        </p>
        <div className="space-y-4">
          {affiliateLinks.map((link, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-[1fr_120px_2fr] gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4">
              <Input
                label={`Retailer ${index + 1}`}
                value={link.retailer}
                onChange={(e) => updateAffiliateLink(index, 'retailer', e.target.value)}
                placeholder="e.g. Tennis Warehouse Europe"
              />
              <Input
                label="Price"
                value={link.price}
                onChange={(e) => updateAffiliateLink(index, 'price', e.target.value)}
                placeholder="e.g. GBP 189"
              />
              <Input
                label="Affiliate URL"
                type="url"
                value={link.url}
                onChange={(e) => updateAffiliateLink(index, 'url', e.target.value)}
                placeholder="https://..."
              />
            </div>
          ))}
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
          <Select label="Featured" name="featured" defaultValue={review?.featured ? 'true' : 'false'} options={[{ value: 'false', label: 'No' }, { value: 'true', label: 'Yes - show on homepage' }]} />
        </div>
      </Card>

      <div className="flex gap-3">
        <Button type="submit" loading={loading}>{isEdit ? 'Update Review' : 'Create Review'}</Button>
        <Button type="button" variant="ghost" onClick={() => router.push('/admin/reviews')}>Cancel</Button>
      </div>
    </form>
  )
}
