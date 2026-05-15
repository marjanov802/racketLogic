'use client'

import { useState } from 'react'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { toast } from 'sonner'

export function DownloadButton({ playbookId }: { playbookId: string }) {
  const [loading, setLoading] = useState(false)

  async function handleDownload() {
    setLoading(true)
    try {
      const res = await fetch(`/api/download/${playbookId}`)
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error ?? 'Download failed')
      }
      const { url } = await res.json()
      window.open(url, '_blank')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Download failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button size="sm" variant="outline" onClick={handleDownload} loading={loading}>
      <Download className="w-3.5 h-3.5" />
      Download
    </Button>
  )
}
