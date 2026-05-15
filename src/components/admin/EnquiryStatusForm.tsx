'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export function EnquiryStatusForm({ enquiryId, currentStatus, currentAdminNotes }: { enquiryId: string; currentStatus: string; currentAdminNotes: string }) {
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const data = new FormData(e.currentTarget)
    try {
      const res = await fetch(`/api/admin/enquiries/${enquiryId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: data.get('status'), adminNotes: data.get('adminNotes') }),
      })
      if (!res.ok) throw new Error()
      toast.success('Enquiry updated')
    } catch {
      toast.error('Failed to update enquiry')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <h3 className="font-bold text-navy-900 mb-4">Update Enquiry</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Status"
          name="status"
          defaultValue={currentStatus}
          options={[
            { value: 'NEW', label: 'New' },
            { value: 'REVIEWING', label: 'Reviewing' },
            { value: 'RESPONDED', label: 'Responded' },
            { value: 'CLOSED', label: 'Closed' },
          ]}
        />
        <Textarea label="Admin Notes" name="adminNotes" defaultValue={currentAdminNotes} rows={3} placeholder="Internal notes about this enquiry" />
        <Button type="submit" loading={loading}>Update Enquiry</Button>
      </form>
    </Card>
  )
}
