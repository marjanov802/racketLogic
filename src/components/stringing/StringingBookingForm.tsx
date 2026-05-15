'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
import { Disclaimer } from '@/components/ui/Disclaimer'

interface Service {
  id: string
  name: string
  price: string
}

interface Props {
  services: Service[]
  selectedService?: string
  onServiceChange?: (id: string) => void
}

const frequencyOptions = [
  { value: 'once-a-month', label: 'Once a month or less' },
  { value: 'weekly', label: 'Once a week' },
  { value: '2-3-week', label: '2–3 times a week' },
  { value: '4-plus-week', label: '4+ times a week' },
]

const deliveryOptions = [
  { value: 'drop-off', label: 'Drop-off (agreed location)' },
  { value: 'collection', label: 'Collection (contact first)' },
  { value: 'postal', label: 'Postal' },
]

const goalOptions = ['Power', 'Spin', 'Control', 'Comfort', 'Durability']

export function StringingBookingForm({ services, selectedService = '', onServiceChange }: Props) {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [goals, setGoals] = useState<string[]>([])
  const [armIssues, setArmIssues] = useState(false)
  const [tensionUnit, setTensionUnit] = useState<'lbs' | 'kg'>('lbs')

  const toggleGoal = (goal: string) =>
    setGoals((prev) => prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const form = e.currentTarget
    const data = new FormData(form)

    const payload = {
      customerName: data.get('customerName'),
      email: data.get('email'),
      phone: data.get('phone'),
      racketModel: data.get('racketModel'),
      currentString: data.get('currentString'),
      currentTension: data.get('currentTension') ? `${data.get('currentTension')} ${tensionUnit}` : '',
      desiredTension: data.get('desiredTension') ? `${data.get('desiredTension')} ${tensionUnit}` : '',
      howOften: data.get('howOften'),
      playGoals: goals,
      armIssues,
      armIssuesDetail: data.get('armIssuesDetail'),
      serviceType: selectedService || data.get('serviceType'),
      deliveryMethod: data.get('deliveryMethod'),
      notes: data.get('notes'),
    }

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error('Failed to submit booking')

      setSubmitted(true)
      toast.success('Booking submitted! We will confirm within 24 hours.')
    } catch {
      toast.error('Something went wrong. Please try again or email us directly.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center">
        <div className="w-16 h-16 bg-lime-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-serif font-bold text-navy-900 mb-3">Booking received</h3>
        <p className="text-gray-500 leading-relaxed">
          Thank you for booking with RacketLogic. We will email you within 24 hours to confirm your booking and arrange drop-off, collection or posting details.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 space-y-7">

      {/* Contact */}
      <div>
        <h3 className="font-serif font-bold text-navy-900 mb-4 text-lg">Your details</h3>
        <div className="space-y-4">
          <Input label="Full name" name="customerName" required placeholder="Your full name" />
          <Input label="Email" name="email" type="email" required placeholder="your@email.com" />
          <Input label="Phone" name="phone" type="tel" placeholder="+44 7700 000000" />
        </div>
      </div>

      {/* Service */}
      <div>
        <h3 className="font-serif font-bold text-navy-900 mb-4 text-lg">Service</h3>
        <Select
          label="Which stringing service?"
          name="serviceType"
          required
          placeholder="Select a service"
          value={selectedService}
          onChange={(e) => onServiceChange?.(e.target.value)}
          options={services.map((s) => ({ value: s.id, label: `${s.name} — ${s.price}` }))}
        />
      </div>

      {/* Racket details */}
      <div>
        <h3 className="font-serif font-bold text-navy-900 mb-4 text-lg">Racket details</h3>
        <div className="space-y-4">
          <Input label="Racket model" name="racketModel" placeholder="e.g. Wilson Blade 98, Babolat Pure Drive" />
          <Input label="Current string (if known)" name="currentString" placeholder="e.g. Luxilon ALU Power, not sure" />

          {/* Tension unit toggle */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-navy-900">Tension</span>
              <div className="flex rounded-lg border border-gray-200 overflow-hidden text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setTensionUnit('lbs')}
                  className={`px-3 py-1.5 transition-colors ${tensionUnit === 'lbs' ? 'bg-navy-900 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                >
                  lbs
                </button>
                <button
                  type="button"
                  onClick={() => setTensionUnit('kg')}
                  className={`px-3 py-1.5 transition-colors ${tensionUnit === 'kg' ? 'bg-navy-900 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                >
                  kg
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                name="currentTension"
                placeholder={tensionUnit === 'lbs' ? 'e.g. 52' : 'e.g. 24'}
                hint={`Current tension in ${tensionUnit}`}
              />
              <Input
                name="desiredTension"
                placeholder={tensionUnit === 'lbs' ? 'e.g. 50' : 'e.g. 23'}
                hint={`Desired tension in ${tensionUnit}`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Playing profile */}
      <div>
        <h3 className="font-serif font-bold text-navy-900 mb-4 text-lg">Your game</h3>
        <div className="space-y-4">
          <Select
            label="How often do you play?"
            name="howOften"
            options={frequencyOptions}
            placeholder="Select frequency"
          />
          <div>
            <p className="text-sm font-medium text-navy-900 mb-2">
              What do you want more of? <span className="text-gray-400 font-normal">(select all that apply)</span>
            </p>
            <div className="flex flex-wrap gap-3">
              {goalOptions.map((goal) => (
                <Checkbox
                  key={goal}
                  label={goal}
                  checked={goals.includes(goal)}
                  onChange={() => toggleGoal(goal)}
                />
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <Checkbox
              id="armIssues"
              label="I have arm, wrist or shoulder discomfort when playing"
              checked={armIssues}
              onChange={() => setArmIssues(!armIssues)}
            />
            {armIssues && (
              <Input
                name="armIssuesDetail"
                placeholder="Briefly describe any arm issues (optional)"
                hint="This helps us suggest more comfortable string options."
              />
            )}
          </div>
        </div>
      </div>

      {/* Delivery */}
      <div>
        <h3 className="font-serif font-bold text-navy-900 mb-4 text-lg">Drop-off / collection / postal</h3>
        <Select
          label="How will you send your racket?"
          name="deliveryMethod"
          required
          options={deliveryOptions}
          placeholder="Select an option"
        />
      </div>

      {/* Notes */}
      <Textarea label="Anything else?" name="notes" placeholder="Any other details, questions or instructions." rows={3} />

      <Disclaimer type="medical" />

      <Button type="submit" size="lg" className="w-full" loading={loading}>
        Submit booking request
      </Button>

      <p className="text-xs text-gray-400 text-center">
        We will confirm and discuss payment once we receive your booking.
      </p>
    </form>
  )
}
