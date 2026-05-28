'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

const statusOptions = [
  { value: 'NEW', label: 'New' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'READY_FOR_COLLECTION', label: 'Ready for Collection' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
]

const paymentOptions = [
  { value: 'UNPAID', label: 'Unpaid' },
  { value: 'PAID', label: 'Paid' },
  { value: 'REFUNDED', label: 'Refunded' },
]

interface Props {
  bookingId: string
  currentStatus: string
  currentPaymentStatus: string
  currentAdminNotes: string
  currentPrice: string
}

export function BookingStatusForm({ bookingId, currentStatus, currentPaymentStatus, currentAdminNotes, currentPrice }: Props) {
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const form = e.currentTarget
    const data = new FormData(form)

    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: data.get('status'),
          paymentStatus: data.get('paymentStatus'),
          adminNotes: data.get('adminNotes'),
          price: data.get('price') ? parseFloat(data.get('price') as string) : null,
        }),
      })
      if (!res.ok) throw new Error()
      toast.success('Booking updated')
    } catch {
      toast.error('Failed to update booking')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <h3 className="font-bold text-navy-900 mb-5">Update Booking</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Booking Status"
            name="status"
            defaultValue={currentStatus}
            options={statusOptions}
          />
          <Select
            label="Payment Status"
            name="paymentStatus"
            defaultValue={currentPaymentStatus}
            options={paymentOptions}
          />
        </div>
        <Input
          label="Price (£)"
          name="price"
          type="number"
          step="0.01"
          defaultValue={currentPrice}
          placeholder="e.g. 35.00"
        />
        <Textarea
          label="Admin Notes"
          name="adminNotes"
          defaultValue={currentAdminNotes}
          placeholder="Internal notes — not visible to customer"
          rows={3}
        />
        <Button type="submit" loading={loading}>Update Booking</Button>
      </form>
    </Card>
  )
}
