'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'

const levelOptions = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'improver', label: 'Improver' },
  { value: 'club', label: 'Club Player' },
  { value: 'competitive', label: 'Competitive Club' },
  { value: 'advanced', label: 'Advanced / County' },
]

const daysOptions = [
  { value: '1', label: '1 day' },
  { value: '2', label: '2 days' },
  { value: '3', label: '3 days' },
  { value: '4', label: '4 days' },
  { value: '5+', label: '5+ days' },
]

const sessionOptions = [
  { value: '30-45', label: '30–45 minutes' },
  { value: '60', label: '1 hour' },
  { value: '90', label: '90 minutes' },
  { value: '120+', label: '2 hours +' },
]

const durationOptions = [
  { value: '4-week', label: '4-week programme' },
  { value: '8-week', label: '8-week programme' },
  { value: 'ongoing', label: 'Ongoing / flexible' },
  { value: 'unsure', label: 'Not sure yet' },
]

const areasToImprove = [
  'Forehand', 'Backhand', 'Serve', 'Movement', 'Matchplay',
  'Fitness', 'Warm-up', 'Recovery',
]

export function CustomProgrammeForm() {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [areas, setAreas] = useState<string[]>([])

  const toggleArea = (area: string) =>
    setAreas((prev) => prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const form = e.currentTarget
    const data = new FormData(form)

    const payload = {
      name: data.get('name'),
      email: data.get('email'),
      age: data.get('age'),
      playingLevel: data.get('playingLevel'),
      yearsPlaying: data.get('yearsPlaying'),
      howOften: data.get('howOften'),
      goal: data.get('goal'),
      weakness: data.get('weakness'),
      currentRoutine: data.get('currentRoutine'),
      trainingDaysPerWeek: data.get('trainingDaysPerWeek'),
      sessionLength: data.get('sessionLength'),
      playsMatches: data.get('playsMatches') === 'on',
      hasCoaching: data.get('hasCoaching') === 'on',
      injuriesOrLimitations: data.get('injuriesOrLimitations'),
      areasToImprove: areas,
      programmeDuration: data.get('programmeDuration'),
      notes: data.get('notes'),
    }

    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error()
      setSubmitted(true)
      toast.success('Enquiry sent! We will be in touch within 48 hours.')
    } catch {
      toast.error('Something went wrong. Please try again or email us directly.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center">
        <div className="text-5xl mb-4">✅</div>
        <h3 className="text-2xl font-bold text-navy-900 mb-3">Enquiry received!</h3>
        <p className="text-gray-600 leading-relaxed">
          Thank you for getting in touch. We will review your details and email you within 48 hours
          to discuss your custom programme.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 space-y-6">
      {/* Contact */}
      <div>
        <h3 className="font-bold text-navy-900 mb-4 text-lg">Your details</h3>
        <div className="space-y-4">
          <Input label="Full name" name="name" required />
          <Input label="Email" name="email" type="email" required />
          <Input label="Age (optional)" name="age" type="number" placeholder="e.g. 32" />
        </div>
      </div>

      {/* Playing profile */}
      <div>
        <h3 className="font-bold text-navy-900 mb-4 text-lg">Your game</h3>
        <div className="space-y-4">
          <Select label="Playing level" name="playingLevel" required options={levelOptions} placeholder="Select your level" />
          <Input label="How long have you played?" name="yearsPlaying" placeholder="e.g. 3 years, since I was 12" />
          <Input label="How often do you play?" name="howOften" placeholder="e.g. twice a week, every weekend" />
          <Textarea label="Main goal" name="goal" required placeholder="e.g. Improve my serve consistency, get better at doubles, increase fitness for matches" rows={2} />
          <Textarea label="Biggest weakness" name="weakness" placeholder="e.g. My backhand breaks down under pressure, I have no warm-up routine" rows={2} />
          <Textarea label="Current training routine (if any)" name="currentRoutine" placeholder="e.g. I hit once a week with a friend, I do no structured practice" rows={2} />
        </div>
      </div>

      {/* Training availability */}
      <div>
        <h3 className="font-bold text-navy-900 mb-4 text-lg">Training availability</h3>
        <div className="space-y-4">
          <Select label="How many days per week can you train?" name="trainingDaysPerWeek" options={daysOptions} placeholder="Select days" />
          <Select label="Typical session length" name="sessionLength" options={sessionOptions} placeholder="Select length" />
          <div className="space-y-2">
            <Checkbox id="playsMatches" label="I play matches (club, league, competitive)" />
            <Checkbox id="hasCoaching" label="I currently have a coach or group lessons" />
          </div>
        </div>
      </div>

      {/* Injuries */}
      <Textarea
        label="Any injuries or physical limitations?"
        name="injuriesOrLimitations"
        placeholder="e.g. Tennis elbow (left arm), lower back issues, none"
        hint="This helps us build a programme that works around your body."
        rows={2}
      />

      {/* Areas */}
      <div>
        <p className="text-sm font-medium text-navy-900 mb-2">
          What do you want to improve? <span className="text-gray-400 font-normal">(select all that apply)</span>
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {areasToImprove.map((area) => (
            <Checkbox
              key={area}
              label={area}
              checked={areas.includes(area)}
              onChange={() => toggleArea(area)}
            />
          ))}
        </div>
      </div>

      {/* Duration */}
      <Select label="Programme length preference" name="programmeDuration" options={durationOptions} placeholder="Select duration" />

      {/* Notes */}
      <Textarea label="Anything else?" name="notes" placeholder="Any extra context or specific requests." rows={3} />

      <Button type="submit" size="lg" className="w-full" loading={loading}>
        Send enquiry
      </Button>

      <p className="text-xs text-gray-500 text-center">
        We will email you within 48 hours to discuss your programme and confirm pricing before any work begins.
      </p>
    </form>
  )
}
