'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import type { HomeContent } from '@/lib/home-content'

export function HomeContentForm({ content }: { content: HomeContent }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const data = new FormData(e.currentTarget)
    const payload = Object.fromEntries(data.entries())

    try {
      const res = await fetch('/api/admin/site-settings/home', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error()
      toast.success('Homepage updated')
      router.refresh()
    } catch {
      toast.error('Failed to update homepage')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <h2 className="text-lg font-bold text-navy-900 mb-4">Hero Section</h2>
        <div className="space-y-4">
          <Input label="Eyebrow" name="heroEyebrow" defaultValue={content.heroEyebrow} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Main title" name="heroTitleStart" defaultValue={content.heroTitleStart} />
            <Input label="Accent title" name="heroTitleAccent" defaultValue={content.heroTitleAccent} />
          </div>
          <Textarea label="Subtitle" name="heroSubtitle" defaultValue={content.heroSubtitle} rows={4} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Primary button label" name="heroPrimaryLabel" defaultValue={content.heroPrimaryLabel} />
            <Input label="Primary button link" name="heroPrimaryHref" defaultValue={content.heroPrimaryHref} />
            <Input label="Secondary button label" name="heroSecondaryLabel" defaultValue={content.heroSecondaryLabel} />
            <Input label="Secondary button link" name="heroSecondaryHref" defaultValue={content.heroSecondaryHref} />
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-bold text-navy-900 mb-4">London Handover Section</h2>
        <div className="space-y-4">
          <Input label="Title" name="londonTitle" defaultValue={content.londonTitle} />
          <Textarea label="Subtitle" name="londonSubtitle" defaultValue={content.londonSubtitle} rows={3} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input label="Areas" name="londonAreas" defaultValue={content.londonAreas} />
            <Input label="Days" name="londonDays" defaultValue={content.londonDays} />
            <Input label="Payment" name="londonPayment" defaultValue={content.londonPayment} />
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-bold text-navy-900 mb-4">Final Call To Action</h2>
        <div className="space-y-4">
          <Input label="Eyebrow" name="finalEyebrow" defaultValue={content.finalEyebrow} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Title" name="finalTitleStart" defaultValue={content.finalTitleStart} />
            <Input label="Accent title" name="finalTitleAccent" defaultValue={content.finalTitleAccent} />
          </div>
          <Textarea label="Subtitle" name="finalSubtitle" defaultValue={content.finalSubtitle} rows={3} />
        </div>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" loading={loading}>Save Homepage</Button>
      </div>
    </form>
  )
}
