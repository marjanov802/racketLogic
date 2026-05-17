'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Info } from 'lucide-react'
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

// Strings we stock — update this list as inventory changes
const AVAILABLE_STRINGS = [
  { value: 'luxilon-alu-power-125', label: 'Luxilon ALU Power 125 (Polyester)' },
  { value: 'babolat-rpm-blast-125', label: 'Babolat RPM Blast 125 (Polyester)' },
  { value: 'wilson-revolve-125', label: 'Wilson Revolve 125 (Polyester)' },
  { value: 'tecnifibre-black-code-125', label: 'Tecnifibre Black Code 125 (Polyester)' },
  { value: 'head-lynx-125', label: 'Head Lynx 125 (Polyester)' },
  { value: 'volkl-cyclone-125', label: 'Völkl Cyclone 125 (Polyester)' },
  { value: 'tecnifibre-nrg2-16', label: 'Tecnifibre NRG2 16 (Multifilament)' },
  { value: 'wilson-nxt-16', label: 'Wilson NXT 16 (Multifilament)' },
  { value: 'babolat-xcel-130', label: 'Babolat XCel 130 (Multifilament)' },
  { value: 'prince-synthetic-gut-16', label: 'Prince Synthetic Gut 16' },
  { value: 'babolat-vs-touch-130', label: 'Babolat VS Touch 130 (Natural Gut)' },
  { value: 'request-other', label: '— Request a string not listed' },
]

const frequencyOptions = [
  { value: 'once-a-month', label: 'Once a month or less' },
  { value: 'weekly', label: 'Once a week' },
  { value: '2-3-week', label: '2–3 times a week' },
  { value: '4-plus-week', label: '4+ times a week' },
]

// Drop-off locations — add new clubs to this list as partnerships grow
const dropOffLocations = [
  {
    value: 'home-ub5',
    label: 'Home address — Northolt (UB5)',
    note: '24-hour turnaround available. Exact address confirmed after booking.',
    highlight: true,
  },
  {
    value: 'west-middlesex',
    label: 'West Middlesex Tennis Club',
    note: 'Confirm timing in advance before dropping off.',
  },
  {
    value: 'ealing',
    label: 'Ealing Tennis Club',
    note: 'Confirm timing in advance before dropping off.',
  },
  {
    value: 'mutual',
    label: 'Request another location',
    note: 'Suggest a location in the notes — we\'ll confirm if it\'s possible.',
  },
]

const goalOptions = ['Power', 'Spin', 'Control', 'Comfort', 'Durability']

export function StringingBookingForm({ services, selectedService = '', onServiceChange }: Props) {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [goals, setGoals] = useState<string[]>([])
  const [armIssues, setArmIssues] = useState(false)
  const [tensionUnit, setTensionUnit] = useState<'lbs' | 'kg'>('lbs')
  const [dropOff, setDropOff] = useState('')
  const [hybridProvider, setHybridProvider] = useState<'' | 'customer' | 'us'>('')
  const [providedString, setProvidedString] = useState('')
  const [requestStringText, setRequestStringText] = useState('')

  // Derive what string UI to show based on selected service
  const isLabourType = selectedService === 'labour-only' || selectedService === 'sereggtti-labour'
  const isWeProvideString = selectedService === 'we-provide-string'
  const isHybrid = selectedService === 'we-provide-hybrid'
  const isHybridCustomer = isHybrid && hybridProvider === 'customer'
  const isHybridWeProvide = isHybrid && hybridProvider === 'us'
  const showStringTextField = isLabourType || isHybridCustomer
  const showStringDropdown = isWeProvideString || isHybridWeProvide
  const showRequestBox = showStringDropdown && providedString === 'request-other'

  const selectedDropOff = dropOffLocations.find((l) => l.value === dropOff)

  const toggleGoal = (goal: string) =>
    setGoals((prev) => prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const form = e.currentTarget
    const data = new FormData(form)

    // Build the string name value from whichever input was shown
    let stringNameValue: string | undefined
    if (showStringTextField) {
      stringNameValue = (data.get('stringNameText') as string) || undefined
    } else if (showStringDropdown) {
      if (providedString === 'request-other') {
        stringNameValue = requestStringText ? `REQUEST: ${requestStringText}` : undefined
      } else {
        stringNameValue = AVAILABLE_STRINGS.find(s => s.value === providedString)?.label
      }
    }

    const payload = {
      customerName: data.get('customerName'),
      email: data.get('email'),
      phone: data.get('phone'),
      racketModel: data.get('racketModel'),
      stringName: stringNameValue,
      desiredTension: data.get('desiredTension') ? `${data.get('desiredTension')} ${tensionUnit}` : '',
      howOften: data.get('howOften'),
      playGoals: goals,
      armIssues,
      armIssuesDetail: data.get('armIssuesDetail'),
      serviceType: selectedService || data.get('serviceType'),
      dropOffLocation: dropOff,
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
          Thank you for booking with RacketLogic. We will be in touch within 24 hours to confirm your booking and arrange payment of the £10 deposit.
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
          <Input label="Phone" name="phone" type="tel" placeholder="+44 7700 000000" hint="Optional — useful for arranging drop-off" />
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
          onChange={(e) => {
            onServiceChange?.(e.target.value)
            setHybridProvider('')
            setProvidedString('')
          }}
          options={services.map((s) => ({ value: s.id, label: `${s.name} — ${s.price}` }))}
        />
      </div>

      {/* Racket & string details */}
      <div>
        <h3 className="font-serif font-bold text-navy-900 mb-4 text-lg">Racket details</h3>
        <div className="space-y-4">
          <Input
            label="Racket model"
            name="racketModel"
            placeholder="e.g. Wilson Blade 98, Babolat Pure Drive"
            hint="Optional — helps us set up correctly"
          />

          {/* Hybrid sub-choice */}
          {isHybrid && (
            <div>
              <p className="text-sm font-medium text-navy-900 mb-3">Who is providing the strings?</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'customer', label: "I'll bring my strings" },
                  { value: 'us', label: 'Source strings for me' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => { setHybridProvider(opt.value as 'customer' | 'us'); setProvidedString('') }}
                    className={`py-3 px-4 text-sm font-medium rounded-xl border transition-all duration-200 text-left ${
                      hybridProvider === opt.value
                        ? 'border-lime-500 bg-lime-50 text-lime-800 ring-2 ring-lime-500/20'
                        : 'border-gray-200 text-gray-700 hover:border-lime-300'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Customer brings their own string — text field */}
          {showStringTextField && (
            <div>
              <Input
                label={isHybridCustomer ? 'Strings you\'re bringing (mains & crosses)' : 'String you\'re bringing'}
                name="stringNameText"
                required
                placeholder={isHybridCustomer
                  ? 'e.g. Luxilon ALU Power (mains) + Tecnifibre NRG2 (crosses)'
                  : 'e.g. Luxilon ALU Power 125, Babolat RPM Blast'}
                hint="The new string you will drop off — not your current string."
              />
              <p className="mt-2 text-xs text-gray-500 flex items-start gap-1.5">
                <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-lime-500" />
                <span>
                  Not sure which string to use?{' '}
                  <Link href="/learn" className="text-lime-600 hover:underline font-medium">Free string guides</Link>
                  {' '}or{' '}
                  <Link href="/playbooks" className="text-lime-600 hover:underline font-medium">our playbooks</Link>.
                </span>
              </p>
            </div>
          )}

          {/* We source the string — dropdown selection */}
          {showStringDropdown && (
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-navy-900 block mb-1.5">
                  {isHybridWeProvide ? 'String preference for mains' : 'Choose a string'}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  required
                  value={providedString}
                  onChange={(e) => setProvidedString(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 bg-white text-navy-900 text-sm focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-colors duration-150 hover:border-gray-400"
                >
                  <option value="" disabled>Select a string…</option>
                  {AVAILABLE_STRINGS.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  Not sure? <Link href="/learn" className="text-lime-600 hover:underline font-medium">Read our free string guide</Link> or leave it to us based on your goals below.
                </p>
              </div>

              {isHybridWeProvide && (
                <Input
                  label="Crosses preference"
                  name="hybridCrossesPreference"
                  placeholder="e.g. Tecnifibre NRG2 — or leave blank for our recommendation"
                  hint="Optional — we'll pair a suitable cross string if not specified"
                />
              )}

              {showRequestBox && (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                  <p className="text-sm font-medium text-amber-900 mb-2">Request a specific string</p>
                  <textarea
                    value={requestStringText}
                    onChange={(e) => setRequestStringText(e.target.value)}
                    placeholder="Which string would you like? Include brand, model and gauge if known."
                    rows={2}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-amber-200 bg-white text-navy-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
                    required
                  />
                  <p className="mt-1.5 text-xs text-amber-700 flex items-start gap-1.5">
                    <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                    We will get back to you to confirm if we can source this string before your booking is finalised.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Tension */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-navy-900">
                Desired tension{' '}
                <span className="text-gray-400 font-normal text-xs">(Optional)</span>
              </span>
              <div className="flex rounded-lg border border-gray-200 overflow-hidden text-xs font-semibold">
                <button type="button" onClick={() => setTensionUnit('lbs')}
                  className={`px-3 py-1.5 transition-colors ${tensionUnit === 'lbs' ? 'bg-navy-900 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}>
                  lbs
                </button>
                <button type="button" onClick={() => setTensionUnit('kg')}
                  className={`px-3 py-1.5 transition-colors ${tensionUnit === 'kg' ? 'bg-navy-900 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}>
                  kg
                </button>
              </div>
            </div>
            <Input
              name="desiredTension"
              placeholder={tensionUnit === 'lbs' ? 'e.g. 50' : 'e.g. 23'}
              hint="Leave blank if you'd like a recommendation based on your game"
            />
          </div>
        </div>
      </div>

      {/* Playing profile */}
      <div>
        <h3 className="font-serif font-bold text-navy-900 mb-1 text-lg">
          Your game{' '}
          <span className="text-sm font-normal text-gray-400">(Optional)</span>
        </h3>
        <p className="text-xs text-gray-400 mb-4">Helps us recommend the right string and tension for you.</p>
        <div className="space-y-4">
          <Select
            label="How often do you play?"
            name="howOften"
            options={frequencyOptions}
            placeholder="Select frequency"
          />
          <div>
            <p className="text-sm font-medium text-navy-900 mb-2">
              What do you want more of?{' '}
              <span className="text-gray-400 font-normal">(select all that apply)</span>
            </p>
            <div className="flex flex-wrap gap-3">
              {goalOptions.map((goal) => (
                <Checkbox key={goal} label={goal} checked={goals.includes(goal)} onChange={() => toggleGoal(goal)} />
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
              <Input name="armIssuesDetail" placeholder="Briefly describe (optional)"
                hint="Helps us suggest more comfortable string options." />
            )}
          </div>
        </div>
      </div>

      {/* Drop-off location */}
      <div>
        <h3 className="font-serif font-bold text-navy-900 mb-1 text-lg">Drop-off location</h3>
        <p className="text-xs text-gray-400 mb-3">Where will you drop off your racket?</p>
        <div className="space-y-2">
          {dropOffLocations.map((loc) => (
            <label
              key={loc.value}
              className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                dropOff === loc.value
                  ? 'border-lime-500 bg-lime-50/40 ring-2 ring-lime-500/20'
                  : loc.highlight
                  ? 'border-lime-200 bg-lime-50/20 hover:border-lime-400'
                  : 'border-gray-200 bg-white hover:border-lime-300'
              }`}
            >
              <input
                type="radio"
                name="dropOffLocation"
                value={loc.value}
                checked={dropOff === loc.value}
                onChange={() => setDropOff(loc.value)}
                className="mt-0.5 accent-lime-500"
                required
              />
              <div>
                <p className="text-sm font-semibold text-navy-900">
                  {loc.label}
                  {loc.highlight && (
                    <span className="ml-2 text-xs font-medium text-lime-600 bg-lime-100 px-2 py-0.5 rounded-full">
                      24hr available
                    </span>
                  )}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{loc.note}</p>
              </div>
            </label>
          ))}
        </div>

        {dropOff === 'home-ub5' && (
          <div className="mt-3 p-3 rounded-lg bg-lime-50 border border-lime-200 flex items-start gap-2">
            <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-lime-600" />
            <p className="text-sm text-lime-800">
              Dropping off at our home address means we can offer a <strong>24-hour turnaround</strong>. We will confirm the exact address once your booking is received.
            </p>
          </div>
        )}
        {dropOff === 'mutual' && (
          <div className="mt-3 p-3 rounded-lg bg-gray-50 border border-gray-200 flex items-start gap-2">
            <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-400" />
            <p className="text-sm text-gray-600">
              Add a suggested location in the notes below and we will confirm what works before you drop off.
            </p>
          </div>
        )}
        {selectedDropOff && dropOff !== 'home-ub5' && dropOff !== 'mutual' && (
          <p className="mt-2 text-xs text-gray-500 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
            {selectedDropOff.note}
          </p>
        )}
      </div>

      {/* Notes */}
      <Textarea
        label="Anything else?"
        name="notes"
        placeholder="Additional details, questions, or location suggestions."
        rows={3}
        hint="Optional"
      />

      <Disclaimer type="medical" />

      {/* Deposit notice */}
      <div className="p-4 rounded-xl bg-navy-900/5 border border-navy-900/10 flex items-start gap-3">
        <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-navy-900" />
        <div className="text-sm text-navy-900">
          <span className="font-semibold">£10 deposit required to confirm your booking.</span>{' '}
          The remaining balance is due on collection or return of your racket.
        </div>
      </div>

      <Button type="submit" size="lg" className="w-full" loading={loading}>
        Submit booking request
      </Button>

      <p className="text-xs text-gray-400 text-center">
        We will confirm your booking and send deposit payment details within 24 hours.
      </p>
    </form>
  )
}
