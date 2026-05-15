import type { Metadata } from 'next'
import { Check } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Disclaimer } from '@/components/ui/Disclaimer'
import { CustomProgrammeForm } from '@/components/forms/CustomProgrammeForm'

export const metadata: Metadata = {
  title: 'Custom Programmes',
  description:
    'Request a custom tennis training programme built around your level, goals, weaknesses and training schedule.',
}

const examples = [
  'Custom warm-up programme',
  'Custom cool-down programme',
  'Custom forehand improvement programme',
  'Custom backhand improvement programme',
  'Custom serve practice programme',
  'Custom footwork programme',
  'Custom 4-week training programme',
  'Custom 8-week club player programme',
  'Custom match preparation programme',
  'Custom beginner improvement programme',
  'General match-day fuelling guidance',
]

export default function CustomProgrammesPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy-gradient text-white py-20">
        <div className="container-lg">
          <Badge variant="lime" className="mb-5 text-xs font-semibold uppercase tracking-widest">
            By Enquiry
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-5 max-w-2xl">
            Custom tennis programmes built around your game.
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl leading-relaxed">
            If you want something more specific than a general playbook, RacketLogic can create a
            custom programme based on your level, goals, weaknesses and training schedule.
          </p>
        </div>
      </section>

      {/* What we offer */}
      <section className="section-padding-sm border-b border-gray-100">
        <div className="container-lg">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold text-navy-900 mb-6">Programme options</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {examples.map((item) => (
                <div key={item} className="flex items-center gap-2.5 text-sm text-gray-700">
                  <Check className="w-4 h-4 text-lime-500 flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm text-gray-500">
              Pricing is available by enquiry. Typical range: £25–£200 depending on scope and length.
              We will confirm pricing before any work begins.
            </p>
          </div>
        </div>
      </section>

      {/* Disclaimers */}
      <div className="container-lg pt-8 max-w-3xl">
        <div className="space-y-4">
          <Disclaimer type="medical" />
          <Disclaimer type="nutrition" />
        </div>
      </div>

      {/* Form */}
      <section className="section-padding bg-gray-50">
        <div className="container-lg">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-navy-900 mb-3">Request a custom programme</h2>
              <p className="text-gray-600">
                Tell us about your game and we will be in touch to discuss what we can build for you.
              </p>
            </div>
            <CustomProgrammeForm />
          </div>
        </div>
      </section>
    </>
  )
}
