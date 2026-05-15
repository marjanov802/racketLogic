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
import { Upload } from 'lucide-react'

interface PlaybookData {
  id?: string
  title?: string
  slug?: string
  description?: string
  longDescription?: string
  price?: string
  previewContent?: string
  category?: string
  published?: boolean
  featured?: boolean
  isBundle?: boolean
  fileUrl?: string
}

const categoryOptions = [
  { value: 'Equipment', label: 'Equipment' },
  { value: 'Training', label: 'Training' },
  { value: 'Matchplay', label: 'Matchplay' },
  { value: 'Beginner', label: 'Beginner' },
  { value: 'Club Player', label: 'Club Player' },
  { value: 'Fitness', label: 'Fitness' },
  { value: 'Bundle', label: 'Bundle' },
]

export function PlaybookForm({ playbook }: { playbook?: PlaybookData }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploadingPdf, setUploadingPdf] = useState(false)
  const [title, setTitle] = useState(playbook?.title ?? '')
  const [slug, setSlug] = useState(playbook?.slug ?? '')
  const [previewContent, setPreviewContent] = useState(playbook?.previewContent ?? '')
  const [longDesc, setLongDesc] = useState(playbook?.longDescription ?? '')

  const isEdit = !!playbook?.id

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
    setTitle(val)
    if (!isEdit) setSlug(slugify(val))
  }

  async function handlePdfUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingPdf(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('playbookId', playbook?.id ?? 'new')
      const res = await fetch('/api/admin/upload-pdf', { method: 'POST', body: formData })
      if (!res.ok) throw new Error()
      toast.success('PDF uploaded')
    } catch {
      toast.error('PDF upload failed')
    } finally {
      setUploadingPdf(false)
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const form = e.currentTarget
    const data = new FormData(form)

    const payload = {
      title: data.get('title'),
      slug: data.get('slug'),
      description: data.get('description'),
      longDescription: longDesc,
      price: parseFloat(data.get('price') as string),
      previewContent,
      category: data.get('category'),
      published: data.get('published') === 'true',
      featured: data.get('featured') === 'true',
      isBundle: data.get('isBundle') === 'true',
    }

    try {
      const url = isEdit ? `/api/admin/playbooks/${playbook!.id}` : '/api/admin/playbooks'
      const method = isEdit ? 'PATCH' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error()
      toast.success(isEdit ? 'Playbook updated' : 'Playbook created')
      router.push('/admin/playbooks')
    } catch {
      toast.error('Failed to save playbook')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <h3 className="font-bold text-navy-900 mb-4">Basic Info</h3>
        <div className="space-y-4">
          <Input
            label="Title"
            name="title"
            required
            value={title}
            onChange={handleTitleChange}
          />
          <Input
            label="Slug (URL)"
            name="slug"
            required
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            hint="e.g. string-setup-playbook"
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Category"
              name="category"
              required
              options={categoryOptions}
              defaultValue={playbook?.category}
              placeholder="Select category"
            />
            <Input
              label="Price (£)"
              name="price"
              type="number"
              step="0.01"
              required
              defaultValue={playbook?.price}
              placeholder="e.g. 7.99"
            />
          </div>
          <Textarea
            label="Short description"
            name="description"
            required
            defaultValue={playbook?.description}
            rows={2}
            placeholder="Short description shown on cards and listings"
          />
        </div>
      </Card>

      <Card>
        <h3 className="font-bold text-navy-900 mb-4">Long Description</h3>
        <RichEditor
          content={longDesc}
          onChange={setLongDesc}
          placeholder="Full description of the playbook..."
        />
      </Card>

      <Card>
        <h3 className="font-bold text-navy-900 mb-4">Free Preview Content</h3>
        <p className="text-sm text-gray-500 mb-4">This is shown publicly before purchase — table of contents, what it covers, sample sections.</p>
        <RichEditor
          content={previewContent}
          onChange={setPreviewContent}
          placeholder="Free preview content — visible to all visitors..."
        />
      </Card>

      <Card>
        <h3 className="font-bold text-navy-900 mb-4">PDF File</h3>
        {playbook?.fileUrl && (
          <p className="text-sm text-green-600 mb-3">✓ PDF uploaded: {playbook.fileUrl}</p>
        )}
        {isEdit && (
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <div className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:border-lime-400 hover:bg-lime-50 transition-colors">
                <Upload className="w-4 h-4" />
                {uploadingPdf ? 'Uploading...' : 'Upload PDF'}
              </div>
              <input
                type="file"
                accept=".pdf"
                onChange={handlePdfUpload}
                className="sr-only"
                disabled={uploadingPdf}
              />
            </label>
            <p className="text-xs text-gray-400 mt-2">PDF is stored securely. Only accessible after purchase.</p>
          </div>
        )}
        {!isEdit && (
          <p className="text-sm text-gray-500">Save the playbook first, then upload the PDF from the edit page.</p>
        )}
      </Card>

      <Card>
        <h3 className="font-bold text-navy-900 mb-4">Settings</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Select
            label="Published"
            name="published"
            defaultValue={playbook?.published ? 'true' : 'false'}
            options={[{ value: 'false', label: 'Draft' }, { value: 'true', label: 'Published' }]}
          />
          <Select
            label="Featured"
            name="featured"
            defaultValue={playbook?.featured ? 'true' : 'false'}
            options={[{ value: 'false', label: 'No' }, { value: 'true', label: 'Yes' }]}
          />
          <Select
            label="Is Bundle"
            name="isBundle"
            defaultValue={playbook?.isBundle ? 'true' : 'false'}
            options={[{ value: 'false', label: 'Individual' }, { value: 'true', label: 'Bundle' }]}
          />
        </div>
      </Card>

      <div className="flex gap-3">
        <Button type="submit" loading={loading}>
          {isEdit ? 'Update Playbook' : 'Create Playbook'}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.push('/admin/playbooks')}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
