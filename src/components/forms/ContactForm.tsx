'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'

const enquiryTypes = [
  { value: 'book-stringing', label: 'Book stringing' },
  { value: 'playbook-question', label: 'Ask about playbooks' },
  { value: 'custom-programme', label: 'Ask about custom programmes' },
  { value: 'reviews', label: 'Ask about reviews' },
  { value: 'club-partnership', label: 'Club partnership enquiry' },
  { value: 'general', label: 'General question' },
]

export function ContactForm() {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const form = e.currentTarget
    const data = new FormData(form)

    const payload = {
      name: data.get('name'),
      email: data.get('email'),
      phone: data.get('phone'),
      enquiryType: data.get('enquiryType'),
      message: data.get('message'),
      preferredDate: data.get('preferredDate'),
      racketDetails: data.get('racketDetails'),
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error()
      setSubmitted(true)
      toast.success('Message sent! We will be in touch within 24–48 hours.')
    } catch {
      toast.error('Something went wrong. Please email us directly at hello@racket-logic.com')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center">
        <div className="text-5xl mb-4">✅</div>
        <h3 className="text-2xl font-bold text-navy-900 mb-3">Message sent!</h3>
        <p className="text-gray-600 leading-relaxed">
          Thank you for getting in touch. We will respond within 24–48 hours.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 space-y-5">
      <Input label="Full name" name="name" required />
      <Input label="Email" name="email" type="email" required />
      <Input label="Phone (optional)" name="phone" type="tel" />
      <Select
        label="What is your enquiry about?"
        name="enquiryType"
        required
        options={enquiryTypes}
        placeholder="Select enquiry type"
      />
      <Textarea label="Message" name="message" required rows={4} placeholder="Tell us what you need help with." />
      <Input
        label="Preferred date (if booking stringing)"
        name="preferredDate"
        type="date"
        hint="Optional — for stringing bookings only."
      />
      <Textarea
        label="Racket details (if relevant)"
        name="racketDetails"
        placeholder="e.g. Wilson Blade 98, current string Luxilon ALU Power"
        rows={2}
        hint="Optional — helps us prepare for stringing bookings."
      />
      <Button type="submit" size="lg" className="w-full" loading={loading}>
        Send message
      </Button>
    </form>
  )
}
