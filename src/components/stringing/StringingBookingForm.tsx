'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Info } from 'lucide-react'
import { toast } from 'sonner'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
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

const AVAILABLE_STRINGS = [
  { value: 'luxilon-alu-power-125', label: 'Luxilon ALU Power 125 (Polyester)' },
  { value: 'babolat-rpm-blast-125', label: 'Babolat RPM Blast 125 (Polyester)' },
  { value: 'wilson-revolve-125', label: 'Wilson Revolve 125 (Polyester)' },
  { value: 'tecnifibre-black-code-125', label: 'Tecnifibre Black Code 125 (Polyester)' },
  { value: 'head-lynx-125', label: 'Head Lynx 125 (Polyester)' },
  { value: 'volkl-cyclone-125', label: 'Volkl Cyclone 125 (Polyester)' },
  { value: 'tecnifibre-nrg2-16', label: 'Tecnifibre NRG2 16 (Multifilament)' },
  { value: 'wilson-nxt-16', label: 'Wilson NXT 16 (Multifilament)' },
  { value: 'babolat-xcel-130', label: 'Babolat XCel 130 (Multifilament)' },
  { value: 'prince-synthetic-gut-16', label: 'Prince Synthetic Gut 16' },
  { value: 'babolat-vs-touch-130', label: 'Babolat VS Touch 130 (Natural Gut)' },
  { value: 'consult-free', label: 'Free consultation - message/call to decide' },
  { value: 'request-other', label: 'Request a string not listed' },
]

const dropOffLocations = [
  {
    value: 'central-london',
    label: 'Central London - London Bridge, Bank, Blackfriars or nearby',
    note: 'Main service area. Pickup and drop-off available Tuesday, Wednesday and Thursday.',
    badge: 'Tue-Thu',
    highlight: true,
  },
  {
    value: 'home-ub5',
    label: 'Home address - Northolt (UB5)',
    note: '24-hour turnaround available. Exact address confirmed after booking.',
    badge: '24hr available',
  },
  {
    value: 'mutual',
    label: 'Request another club or local area',
    note: 'Request only - not confirmed until we reply. We respond within 4 daytime hours.',
  },
]

const clubRequestAreas = [
  { value: 'ealing', label: 'Ealing' },
  { value: 'northwood', label: 'Northwood' },
  { value: 'acton', label: 'Acton' },
  { value: 'ruislip', label: 'Ruislip' },
  { value: 'eastcote', label: 'Eastcote' },
  { value: 'west-london', label: 'West London' },
  { value: 'north-west-london', label: 'North West London' },
]

const paymentOptions = [
  { value: 'cash-on-collection', label: 'Cash on collection', note: 'Pay the full amount in cash when you collect or receive the racket.' },
  { value: 'bank-transfer', label: 'Bank transfer before collection', note: 'Bank details are provided after confirmation. Payment must be sent before collection/return.' },
]

export function StringingBookingForm({ services, selectedService = '', onServiceChange }: Props) {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [tensionUnit, setTensionUnit] = useState<'lbs' | 'kg'>('lbs')
  const [dropOff, setDropOff] = useState('')
  const [clubRequestArea, setClubRequestArea] = useState('')
  const [paymentPreference, setPaymentPreference] = useState('')
  const [sereggttiStringMode, setSereggttiStringMode] = useState<'' | 'single' | 'hybrid'>('')
  const [providedString, setProvidedString] = useState('')
  const [providedCrossString, setProvidedCrossString] = useState('')
  const [requestStringText, setRequestStringText] = useState('')
  const [requestCrossStringText, setRequestCrossStringText] = useState('')

  const isLabourType = selectedService === 'labour-only' || selectedService === 'sereggtti-labour'
  const isSereggttiWithStrings = selectedService === 'sereggtti-with-strings'
  const isSingleStringProvided = selectedService === 'we-provide-string' || (isSereggttiWithStrings && sereggttiStringMode === 'single')
  const isHybridWithStrings = selectedService === 'we-provide-hybrid' || (isSereggttiWithStrings && sereggttiStringMode === 'hybrid')
  const showStringTextField = isLabourType
  const showStringDropdown = isSingleStringProvided || isHybridWithStrings
  const showCrossDropdown = isHybridWithStrings
  const showRequestBox = showStringDropdown && providedString === 'request-other'
  const showCrossRequestBox = showCrossDropdown && providedCrossString === 'request-other'
  const selectedDropOff = dropOffLocations.find((location) => location.value === dropOff)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const form = e.currentTarget
    const data = new FormData(form)

    if (isSereggttiWithStrings && !sereggttiStringMode) {
      toast.error('Please choose single-string or hybrid Sereggtti setup.')
      setLoading(false)
      return
    }

    let stringNameValue: string | undefined
    if (showStringTextField) {
      stringNameValue = (data.get('stringNameText') as string) || undefined
    } else if (showStringDropdown) {
      const mainString = providedString === 'request-other'
        ? requestStringText ? `REQUEST MAIN: ${requestStringText}` : undefined
        : providedString === 'consult-free'
          ? 'FREE CONSULTATION REQUESTED'
        : AVAILABLE_STRINGS.find((string) => string.value === providedString)?.label

      if (providedString === 'request-other') {
        stringNameValue = requestStringText ? `REQUEST: ${requestStringText}` : undefined
      } else if (providedString === 'consult-free') {
        stringNameValue = 'FREE CONSULTATION REQUESTED'
      } else {
        stringNameValue = mainString
      }

      if (showCrossDropdown) {
        const crossString = providedCrossString === 'request-other'
          ? requestCrossStringText ? `REQUEST CROSS: ${requestCrossStringText}` : undefined
          : providedCrossString === 'consult-free'
            ? 'FREE CONSULTATION REQUESTED'
          : AVAILABLE_STRINGS.find((string) => string.value === providedCrossString)?.label

        stringNameValue = `Mains: ${mainString || 'Not specified'}; Crosses: ${crossString || 'Not specified'}`
      }
    }

    const notes = [
      clubRequestArea ? `Requested club/local area: ${clubRequestAreas.find((area) => area.value === clubRequestArea)?.label ?? clubRequestArea}` : '',
      data.get('notes') as string,
    ].filter(Boolean).join('\n\n')

    const payload = {
      customerName: data.get('customerName'),
      email: data.get('email'),
      phone: data.get('phone'),
      racketModel: data.get('racketModel'),
      stringName: stringNameValue,
      desiredTension: data.get('desiredTension') ? `${data.get('desiredTension')} ${tensionUnit}` : '',
      serviceType: selectedService || data.get('serviceType'),
      dropOffLocation: dropOff,
      paymentPreference,
      notes,
    }

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error('Failed to submit booking')

      setSubmitted(true)
      toast.success('Booking submitted! We will confirm payment details before collection.')
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
          Thank you for booking with RacketLogic. We will be in touch within 4 daytime hours to confirm your booking, Central London timing if selected, and payment details.
          No deposit is required. You can pay the full amount by cash on collection or bank transfer before collection/return.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 space-y-7">
      <div className="rounded-2xl border border-lime-200 bg-lime-50/70 p-5">
        <p className="text-sm font-semibold text-navy-900">Central London pickup and drop-off</p>
        <p className="mt-1 text-sm text-gray-700">
          Available Tuesday, Wednesday and Thursday around London Bridge, Bank, Blackfriars and nearby areas.
          This is ideal if you work or study in Central London and want easy racket handover.
        </p>
      </div>

      <div>
        <h3 className="font-serif font-bold text-navy-900 mb-4 text-lg">Your details</h3>
        <div className="space-y-4">
          <Input label="Full name" name="customerName" required placeholder="Your full name" />
          <Input label="Email" name="email" type="email" required placeholder="your@email.com" />
          <Input label="Phone" name="phone" type="tel" placeholder="+44 7700 000000" hint="Optional - useful for arranging pickup/drop-off" />
        </div>
      </div>

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
            setSereggttiStringMode('')
            setProvidedString('')
            setProvidedCrossString('')
            setRequestStringText('')
            setRequestCrossStringText('')
          }}
          options={services.map((service) => ({ value: service.id, label: `${service.name} - ${service.price}` }))}
        />
      </div>

      <div>
        <h3 className="font-serif font-bold text-navy-900 mb-4 text-lg">Racket details</h3>
        <div className="space-y-4">
          <div className="rounded-2xl border border-lime-200 bg-lime-50/60 p-4">
            <p className="text-sm font-semibold text-navy-900">Need help choosing a string?</p>
            <p className="mt-1 text-sm text-gray-700">
              Free consultation is available before confirmation. Message or call to decide what string you would like, need, or want to try.
              Email <a href="mailto:hello@racketlogic.co.uk" className="font-semibold text-lime-700 hover:underline">hello@racketlogic.co.uk</a>.
              Daytime response target: within 4 hours.
            </p>
          </div>

          <Input
            label="Racket model"
            name="racketModel"
            placeholder="e.g. Wilson Blade 98, Babolat Pure Drive"
            hint="Optional - helps us set up correctly"
          />

          {isSereggttiWithStrings && (
            <div>
              <p className="text-sm font-medium text-navy-900 mb-3">Sereggtti string setup</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { value: 'single', label: 'Single string setup' },
                  { value: 'hybrid', label: 'Hybrid setup' },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setSereggttiStringMode(option.value as 'single' | 'hybrid')
                      setProvidedString('')
                      setProvidedCrossString('')
                      setRequestStringText('')
                      setRequestCrossStringText('')
                    }}
                    className={`py-3 px-4 text-sm font-medium rounded-xl border transition-all duration-200 text-left ${
                      sereggttiStringMode === option.value
                        ? 'border-lime-500 bg-lime-50 text-lime-800 ring-2 ring-lime-500/20'
                        : 'border-gray-200 text-gray-700 hover:border-lime-300'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Sereggtti with one string starts from GBP 40. Sereggtti hybrid starts from GBP 55 because it takes more time and uses two strings.
              </p>
            </div>
          )}

          {showStringTextField && (
            <div>
              <Input
                label="String you're bringing"
                name="stringNameText"
                required
                placeholder="e.g. Luxilon ALU Power 125, Babolat RPM Blast"
                hint="The new string you will drop off - not your current string."
              />
              <p className="mt-2 text-xs text-gray-500 flex items-start gap-1.5">
                <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-lime-500" />
                <span>
                  Not sure which string to use?{' '}
                  <Link href="/learn" className="text-lime-600 hover:underline font-medium">Read the free guides</Link>
                  {' '}or{' '}
                  <Link href="/playbooks" className="text-lime-600 hover:underline font-medium">view the playbooks</Link>.
                </span>
              </p>
            </div>
          )}

          {showStringDropdown && (
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-navy-900 block mb-1.5">
                  {showCrossDropdown ? 'Choose main string' : 'Choose a string'}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  required
                  value={providedString}
                  onChange={(e) => setProvidedString(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 bg-white text-navy-900 text-sm focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-colors duration-150 hover:border-gray-400"
                >
                  <option value="" disabled>Select a string...</option>
                  {AVAILABLE_STRINGS.map((string) => (
                    <option key={string.value} value={string.value}>{string.label}</option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  Not sure? <Link href="/learn" className="text-lime-600 hover:underline font-medium">Read the free string guide</Link> or choose "request a string not listed".
                </p>
                {providedString === 'consult-free' && (
                  <div className="mt-3 rounded-xl border border-lime-200 bg-lime-50 p-4">
                    <p className="text-sm font-semibold text-navy-900">Free string consultation</p>
                    <p className="mt-1 text-sm text-gray-700">
                      Message or call before final confirmation and we can decide what string you need or what is worth trying. Email{' '}
                      <a href="mailto:hello@racketlogic.co.uk" className="font-semibold text-lime-700 hover:underline">hello@racketlogic.co.uk</a>.
                      Daytime response target: within 4 hours.
                    </p>
                  </div>
                )}
              </div>

              {showCrossDropdown && (
                <div>
                  <label className="text-sm font-medium text-navy-900 block mb-1.5">
                    Choose cross string
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <select
                    required
                    value={providedCrossString}
                    onChange={(e) => setProvidedCrossString(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 bg-white text-navy-900 text-sm focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-colors duration-150 hover:border-gray-400"
                  >
                    <option value="" disabled>Select a string...</option>
                    {AVAILABLE_STRINGS.map((string) => (
                      <option key={string.value} value={string.value}>{string.label}</option>
                    ))}
                  </select>
                </div>
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
                    We will get back to you to confirm if this string can be sourced before your booking is finalised.
                  </p>
                </div>
              )}

              {showCrossRequestBox && (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                  <p className="text-sm font-medium text-amber-900 mb-2">Request a specific cross string</p>
                  <textarea
                    value={requestCrossStringText}
                    onChange={(e) => setRequestCrossStringText(e.target.value)}
                    placeholder="Which cross string would you like? Include brand, model and gauge if known."
                    rows={2}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-amber-200 bg-white text-navy-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
                    required
                  />
                  <p className="mt-1.5 text-xs text-amber-700 flex items-start gap-1.5">
                    <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                    We will get back to you to confirm if this string can be sourced before your booking is finalised.
                  </p>
                </div>
              )}
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-navy-900">
                Desired tension <span className="text-gray-400 font-normal text-xs">(Optional)</span>
              </span>
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
            <Input
              name="desiredTension"
              placeholder={tensionUnit === 'lbs' ? 'e.g. 50' : 'e.g. 23'}
              hint="Leave blank if you would like a recommendation based on your game"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-serif font-bold text-navy-900 mb-1 text-lg">Pickup / drop-off</h3>
        <p className="text-xs text-gray-400 mb-3">Choose the easiest racket handover option.</p>
        <div className="space-y-2">
          {dropOffLocations.map((location) => (
            <label
              key={location.value}
              className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                dropOff === location.value
                  ? 'border-lime-500 bg-lime-50/40 ring-2 ring-lime-500/20'
                  : location.highlight
                    ? 'border-lime-200 bg-lime-50/20 hover:border-lime-400'
                    : 'border-gray-200 bg-white hover:border-lime-300'
              }`}
            >
              <input
                type="radio"
                name="dropOffLocation"
                value={location.value}
                checked={dropOff === location.value}
                onChange={() => setDropOff(location.value)}
                className="mt-0.5 accent-lime-500"
                required
              />
              <div>
                <p className="text-sm font-semibold text-navy-900">
                  {location.label}
                  {location.badge && (
                    <span className="ml-2 text-xs font-medium text-lime-600 bg-lime-100 px-2 py-0.5 rounded-full">
                      {location.badge}
                    </span>
                  )}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{location.note}</p>
              </div>
            </label>
          ))}
        </div>

        {dropOff === 'central-london' && (
          <div className="mt-3 p-3 rounded-lg bg-lime-50 border border-lime-200 flex items-start gap-2">
            <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-lime-600" />
            <p className="text-sm text-lime-800">
              Central London pickup/drop-off is available Tuesday, Wednesday and Thursday around London Bridge, Bank, Blackfriars or nearby areas.
            </p>
          </div>
        )}
        {dropOff === 'home-ub5' && (
          <div className="mt-3 p-3 rounded-lg bg-lime-50 border border-lime-200 flex items-start gap-2">
            <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-lime-600" />
            <p className="text-sm text-lime-800">
              Dropping off at our home address means we can offer a <strong>24-hour turnaround</strong>. We will confirm the exact address once your booking is received.
            </p>
          </div>
        )}
        {dropOff === 'mutual' && (
          <div className="mt-3 p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-3">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-500" />
              <div>
                <p className="text-sm font-semibold text-navy-900">Club/local area request</p>
                <p className="text-sm text-gray-600">
                  This is a request, not a confirmed drop-off point. We will reply within 4 daytime hours to confirm whether we can meet there or suggest the nearest workable option.
                </p>
                <p className="mt-1 text-sm text-gray-600">
                  Email <a href="mailto:hello@racketlogic.co.uk" className="font-semibold text-lime-700 hover:underline">hello@racketlogic.co.uk</a> if you want to check before booking.
                </p>
              </div>
            </div>
            <Select
              label="Requested area"
              name="clubRequestArea"
              value={clubRequestArea}
              onChange={(e) => setClubRequestArea(e.target.value)}
              placeholder="Choose an area"
              options={clubRequestAreas}
            />
          </div>
        )}
        {selectedDropOff && !['central-london', 'home-ub5', 'mutual'].includes(dropOff) && (
          <p className="mt-2 text-xs text-gray-500 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
            {selectedDropOff.note}
          </p>
        )}
      </div>

      <div>
        <h3 className="font-serif font-bold text-navy-900 mb-1 text-lg">Payment preference</h3>
        <p className="text-xs text-gray-400 mb-3">No deposit required. Pay the full amount by cash on collection or bank transfer before collection/return.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {paymentOptions.map((option) => (
            <label
              key={option.value}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                paymentPreference === option.value
                  ? 'border-lime-500 bg-lime-50/40 ring-2 ring-lime-500/20'
                  : 'border-gray-200 bg-white hover:border-lime-300'
              }`}
            >
              <input
                type="radio"
                name="paymentPreference"
                value={option.value}
                checked={paymentPreference === option.value}
                onChange={() => setPaymentPreference(option.value)}
                className="sr-only"
                required
              />
              <p className="text-sm font-semibold text-navy-900">{option.label}</p>
              <p className="mt-1 text-xs text-gray-500">{option.note}</p>
            </label>
          ))}
        </div>
      </div>

      <Textarea
        label="Anything else?"
        name="notes"
        placeholder="Additional details, questions, Central London timing, or location suggestions."
        rows={3}
        hint="Optional"
      />

      <Disclaimer type="medical" />

      <div className="p-4 rounded-xl bg-navy-900/5 border border-navy-900/10 flex items-start gap-3">
        <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-navy-900" />
        <div className="text-sm text-navy-900">
          <span className="font-semibold">No deposit required.</span>{' '}
          Pay the full amount by cash on collection or bank transfer before the racket is collected or returned. Bank details are provided after the booking is confirmed.
        </div>
      </div>

      <Button type="submit" size="lg" className="w-full" loading={loading}>
        Submit booking request
      </Button>

      <p className="text-xs text-gray-400 text-center">
        We will confirm pickup/drop-off timing and payment details within 4 daytime hours.
      </p>
    </form>
  )
}
