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
import { Plus, Trash2 } from 'lucide-react'

interface AffiliateLink {
  retailer: string
  price: string
  url: string
}

interface Colourway {
  name: string
  image: string
  links?: AffiliateLink[]
}

interface GalleryItem {
  type: 'image' | 'video'
  label: string
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
  colourways?: Colourway[]
  colourwayFolder?: string
  gallery?: GalleryItem[]
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

const reviewTemplateHints: Record<string, { intro: string; sections: string[] }> = {
  Rackets: {
    intro: 'Racket reviews focus on specifications, technology, feel, player fit, sweet spot, control, spin, serve/return/net play and setup direction.',
    sections: ['Specs', 'Technology', 'Feel on court', 'Who it suits', 'Sweet spot/control', 'Strings/customisation'],
  },
  Shoes: {
    intro: 'Shoe reviews focus on fit, comfort, court feel, stability, breathability, durability, outsole type and colourway images.',
    sections: ['Specs', 'Colourway images', 'Fit and comfort', 'Court feel', 'Durability', 'Court models'],
  },
  Strings: {
    intro: 'String reviews focus on material, gauge, tension, power, control, spin, comfort, durability and when the string goes dead.',
    sections: ['String type', 'Gauge/tension', 'Power/spin/control', 'Comfort', 'Lifespan', 'Best player fit'],
  },
  Grips: {
    intro: 'Grip reviews focus on tack, sweat absorption, thickness, bevel feel, grip size impact, comfort and replacement timing.',
    sections: ['Grip type', 'Tack/absorption', 'Thickness', 'Bevel feel', 'Sweat handling', 'When to replace'],
  },
  Accessories: {
    intro: 'Accessory reviews focus on whether the product solves a real problem, compatibility, durability, value and who should buy it.',
    sections: ['Problem solved', 'Compatibility', 'Build quality', 'Value', 'Who should buy it'],
  },
  Comparisons: {
    intro: 'Comparison posts focus on practical differences and which player should choose each product.',
    sections: ['Products compared', 'Main differences', 'Who should choose each', 'Final recommendation'],
  },
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

function initialColourways(review?: ReviewData): Colourway[] {
  if (Array.isArray(review?.colourways) && review.colourways.length > 0) {
    return review.colourways.map((colourway) => ({
      ...colourway,
      links: Array.isArray(colourway.links) ? colourway.links : [],
    }))
  }

  return []
}

function initialGallery(review?: ReviewData): GalleryItem[] {
  if (Array.isArray(review?.gallery) && review.gallery.length > 0) {
    return review.gallery.map((item) => ({
      type: item.type === 'video' ? 'video' : 'image',
      label: item.label ?? '',
      url: item.url ?? '',
    }))
  }

  return []
}

export function ReviewForm({ review }: { review?: ReviewData }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState(review?.title ?? '')
  const [slug, setSlug] = useState(review?.slug ?? '')
  const [category, setCategory] = useState(review?.category ?? '')
  const [content, setContent] = useState(review?.content ?? '')
  const [affiliateLinks, setAffiliateLinks] = useState<AffiliateLink[]>(initialAffiliateLinks(review))
  const [colourways, setColourways] = useState<Colourway[]>(initialColourways(review))
  const [gallery, setGallery] = useState<GalleryItem[]>(initialGallery(review))

  const isEdit = !!review?.id

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setTitle(e.target.value)
    if (!isEdit) setSlug(slugify(e.target.value))
  }

  function updateAffiliateLink(index: number, field: keyof AffiliateLink, value: string) {
    setAffiliateLinks((current) => current.map((link, i) => (i === index ? { ...link, [field]: value } : link)))
  }

  function updateColourway(index: number, field: keyof Colourway, value: string) {
    setColourways((current) => current.map((colourway, i) => (i === index ? { ...colourway, [field]: value } : colourway)))
  }

  function addColourway() {
    setColourways((current) => [...current, { name: '', image: '', links: [] }])
  }

  function removeColourway(index: number) {
    setColourways((current) => current.filter((_, i) => i !== index))
  }

  function addColourwayLink(colourwayIndex: number) {
    setColourways((current) =>
      current.map((colourway, i) =>
        i === colourwayIndex
          ? { ...colourway, links: [...(colourway.links ?? []), { retailer: '', price: '', url: '' }] }
          : colourway
      )
    )
  }

  function updateColourwayLink(colourwayIndex: number, linkIndex: number, field: keyof AffiliateLink, value: string) {
    setColourways((current) =>
      current.map((colourway, i) => {
        if (i !== colourwayIndex) return colourway
        const links = colourway.links ?? []
        return {
          ...colourway,
          links: links.map((link, j) => (j === linkIndex ? { ...link, [field]: value } : link)),
        }
      })
    )
  }

  function removeColourwayLink(colourwayIndex: number, linkIndex: number) {
    setColourways((current) =>
      current.map((colourway, i) =>
        i === colourwayIndex
          ? { ...colourway, links: (colourway.links ?? []).filter((_, j) => j !== linkIndex) }
          : colourway
      )
    )
  }

  function addGalleryItem(type: 'image' | 'video' = 'image') {
    setGallery((current) => [...current, { type, label: '', url: '' }])
  }

  function updateGalleryItem(index: number, field: keyof GalleryItem, value: string) {
    setGallery((current) => current.map((item, i) => (i === index ? { ...item, [field]: value } : item)))
  }

  function removeGalleryItem(index: number) {
    setGallery((current) => current.filter((_, i) => i !== index))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const data = new FormData(e.currentTarget)
    const cleanAffiliateLinks = affiliateLinks.filter((link) => link.url.trim() || link.retailer.trim() || link.price.trim())
    const cleanColourways = colourways
      .filter((colourway) => colourway.name.trim() || colourway.image.trim())
      .map((colourway) => ({
        name: colourway.name.trim(),
        image: colourway.image.trim(),
        links: (colourway.links ?? []).filter((link) => link.url.trim() || link.retailer.trim() || link.price.trim()),
      }))
    const cleanGallery = gallery
      .filter((item) => item.url.trim() || item.label.trim())
      .map((item) => ({ type: item.type, label: item.label.trim(), url: item.url.trim() }))
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
      colourways: cleanColourways,
      colourwayFolder: data.get('colourwayFolder'),
      gallery: cleanGallery,
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
              <p className="text-xs text-gray-600 mb-3">{reviewTemplateHints[category]?.intro}</p>
              <div className="flex flex-wrap gap-2">
                {(reviewTemplateHints[category]?.sections ?? []).map((item) => (
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
          <Input
            label="Colourway folder path (optional)"
            name="colourwayFolder"
            defaultValue={review?.colourwayFolder ?? ''}
            placeholder="/images/reviews/Shoes/Lacoste AG-LT23"
          />
          <p className="-mt-3 text-xs text-gray-500">
            If this is filled in, the public review page will automatically show every image inside that folder. The folder must be inside <span className="font-mono">public</span>.
          </p>
          <Input label="Rating (1-10, optional/internal)" name="rating" type="number" min={1} max={10} defaultValue={review?.rating} placeholder="e.g. 8" />
        </div>
      </Card>

      <Card>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-4">
          <div>
            <h3 className="font-bold text-navy-900">Product Gallery</h3>
            <p className="text-sm text-gray-500 mt-1">
              Add extra product images or videos from different sides, angles, sole views, string bed close-ups, or on-court clips.
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Use image paths like <span className="font-mono">/images/reviews/detail.jpg</span> or video URLs like <span className="font-mono">/videos/reviews/clip.mp4</span>.
            </p>
          </div>
          <div className="flex gap-2">
            <Button type="button" size="sm" onClick={() => addGalleryItem('image')}>
              <Plus className="w-4 h-4" />
              Add image
            </Button>
            <Button type="button" size="sm" variant="outline" onClick={() => addGalleryItem('video')}>
              <Plus className="w-4 h-4" />
              Add video
            </Button>
          </div>
        </div>

        {gallery.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center">
            <p className="text-sm text-gray-500">No gallery media added.</p>
            <button type="button" onClick={() => addGalleryItem('image')} className="mt-2 text-sm font-semibold text-lime-700 hover:text-lime-600">
              Add the first gallery image
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {gallery.map((item, index) => (
              <div key={index} className="rounded-xl border border-gray-100 bg-gray-50 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-navy-900">Gallery item {index + 1}</p>
                  <button
                    type="button"
                    onClick={() => removeGalleryItem(index)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Remove
                  </button>
                </div>
                <Select
                  label="Media type"
                  options={[
                    { value: 'image', label: 'Image' },
                    { value: 'video', label: 'Video' },
                  ]}
                  value={item.type}
                  onChange={(e) => updateGalleryItem(index, 'type', e.target.value)}
                />
                <Input
                  label="Label"
                  value={item.label}
                  onChange={(e) => updateGalleryItem(index, 'label', e.target.value)}
                  placeholder="e.g. Lateral side, outsole, heel padding, string bed close-up"
                />
                <Input
                  label="Media URL"
                  value={item.url}
                  onChange={(e) => updateGalleryItem(index, 'url', e.target.value)}
                  placeholder={item.type === 'video' ? '/videos/reviews/ag-lt23-side.mp4' : '/images/reviews/ag-lt23-side.jpg'}
                />
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-4">
          <div>
            <h3 className="font-bold text-navy-900">Colourway Images</h3>
            <p className="text-sm text-gray-500 mt-1">
              Optional. Use this when you need colour-specific affiliate links. If you only need images, use the folder path above instead.
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Example path: <span className="font-mono">/images/reviews/lacoste-ag-lt23.jpeg</span>
            </p>
          </div>
          <Button type="button" size="sm" onClick={addColourway}>
            <Plus className="w-4 h-4" />
            Add colourway
          </Button>
        </div>

        {colourways.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center">
            <p className="text-sm text-gray-500">No colourways added.</p>
            <button type="button" onClick={addColourway} className="mt-2 text-sm font-semibold text-lime-700 hover:text-lime-600">
              Add the first colourway
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {colourways.map((colourway, index) => (
            <div key={index} className="rounded-xl border border-gray-100 bg-gray-50 p-4 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-navy-900">Colourway {index + 1}</p>
                <button
                  type="button"
                  onClick={() => removeColourway(index)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Remove
                </button>
              </div>
              <Input
                label="Name"
                value={colourway.name}
                onChange={(e) => updateColourway(index, 'name', e.target.value)}
                placeholder="e.g. White / Navy"
              />
              <Input
                label="Image URL"
                value={colourway.image}
                onChange={(e) => updateColourway(index, 'image', e.target.value)}
                placeholder="/images/reviews/shoe-white-navy.jpg"
              />

              <div className="rounded-xl border border-gray-200 bg-white p-3">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div>
                    <p className="text-sm font-semibold text-navy-900">Retailer links for this colour</p>
                    <p className="text-xs text-gray-500">Use this when only some shops sell this colourway or size.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => addColourwayLink(index)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-lime-700 hover:text-lime-600"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add link
                  </button>
                </div>

                {(colourway.links ?? []).length === 0 ? (
                  <p className="text-xs text-gray-400">No colour-specific retailer links. General affiliate links can still show elsewhere.</p>
                ) : (
                  <div className="space-y-3">
                    {(colourway.links ?? []).map((link, linkIndex) => (
                      <div key={linkIndex} className="grid grid-cols-1 gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold text-gray-500">Link {linkIndex + 1}</p>
                          <button
                            type="button"
                            onClick={() => removeColourwayLink(index, linkIndex)}
                            className="text-xs font-semibold text-red-600 hover:text-red-700"
                          >
                            Remove
                          </button>
                        </div>
                        <Input
                          label="Retailer"
                          value={link.retailer}
                          onChange={(e) => updateColourwayLink(index, linkIndex, 'retailer', e.target.value)}
                          placeholder="e.g. Tennis Point"
                        />
                        <Input
                          label="Price / size note"
                          value={link.price}
                          onChange={(e) => updateColourwayLink(index, linkIndex, 'price', e.target.value)}
                          placeholder="e.g. GBP 135, sizes 8-10"
                        />
                        <Input
                          label="Affiliate URL"
                          type="url"
                          value={link.url}
                          onChange={(e) => updateColourwayLink(index, linkIndex, 'url', e.target.value)}
                          placeholder="https://..."
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          </div>
        )}
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
