'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

type FeaturedModel = 'review' | 'article' | 'playbook'

export function FeaturedToggle({
  id,
  model,
  featured,
}: {
  id: string
  model: FeaturedModel
  featured: boolean
}) {
  const router = useRouter()
  const [checked, setChecked] = useState(featured)
  const [loading, setLoading] = useState(false)

  async function handleChange(nextChecked: boolean) {
    setChecked(nextChecked)
    setLoading(true)

    try {
      const res = await fetch('/api/admin/featured', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, model, featured: nextChecked }),
      })

      if (!res.ok) throw new Error()
      toast.success(nextChecked ? 'Marked as featured' : 'Removed from featured')
      router.refresh()
    } catch {
      setChecked(!nextChecked)
      toast.error('Failed to update featured status')
    } finally {
      setLoading(false)
    }
  }

  return (
    <label className={`inline-flex items-center gap-2 text-xs font-medium ${loading ? 'opacity-60' : ''}`}>
      <input
        type="checkbox"
        checked={checked}
        disabled={loading}
        onChange={(e) => handleChange(e.target.checked)}
        className="h-4 w-4 rounded border-gray-300 text-lime-600 focus:ring-lime-500"
      />
      <span className={checked ? 'text-lime-700' : 'text-gray-500'}>
        Featured
      </span>
    </label>
  )
}
