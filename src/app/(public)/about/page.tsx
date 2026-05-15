import type { Metadata } from 'next'
import Link from 'next/link'
import { Check, ArrowRight, Zap } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'

export const metadata: Metadata = {
  title: 'About RacketLogic',
  description:
    'RacketLogic was created to help tennis players stop guessing with their equipment and training.',
}

const values = [
  {
    title: 'Practical first',
    description: 'Every guide focuses on what to actually do — not endless theory. If you cannot apply it immediately, we have not explained it well enough.',
  },
  {
    title: 'Honest and transparent',
    description: 'Where affiliate links exist, they are clearly marked. We only recommend equipment and setups we genuinely believe suit the player type described.',
  },
  {
    title: 'No generic advice',
    description: 'Advice is tied to playing style, level and goals. There is no such thing as "the best string" without knowing who it is best for.',
  },
  {
    title: 'Built for real players',
    description: 'Designed for beginners, club players and anyone who wants to understand their setup better — not just elite players with professional coaches.',
  },
]

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy-gradient text-white py-20">
        <div className="container-lg">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-navy-800 border border-navy-700 rounded-xl flex items-center justify-center">
              <Zap className="w-5 h-5 text-lime-400" />
            </div>
            <span className="text-xl font-bold">Racket<span className="text-lime-400">Logic</span></span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-5 max-w-2xl">
            About RacketLogic
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl leading-relaxed">
            RacketLogic was created to help tennis players stop guessing with their equipment and
            training.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="section-padding">
        <div className="container-lg">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold text-navy-900 mb-6">Why RacketLogic exists</h2>
            <div className="space-y-5 text-gray-700 leading-relaxed">
              <p>
                Most tennis players do not know what racket, strings, tension, shoes, grip size,
                warm-up routine or practice structure they should use. They waste money on the wrong
                gear and often train without structure — sometimes for years.
              </p>
              <p>
                The advice available online is often generic, contradictory or paid-for. Product
                reviews are frequently sponsored or written without reference to the player&apos;s
                style or level. "Best strings" lists rarely explain who those strings are actually
                best for.
              </p>
              <p>
                RacketLogic was built from long-term tennis playing experience. The goal is simple:
                give players clear, practical and trustworthy guidance through stringing services,
                playbooks, reviews and training resources.
              </p>
              <p>
                Not trying to sell every product. Not giving vague advice. Just helping players make
                better decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-gray-50">
        <div className="container-lg">
          <h2 className="text-2xl font-bold text-navy-900 mb-8">How RacketLogic works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
            {values.map((value) => (
              <Card key={value.title}>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-lime-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-navy-900 mb-2">{value.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{value.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* What we offer */}
      <section className="section-padding">
        <div className="container-lg">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold text-navy-900 mb-6">What RacketLogic offers</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'Racket stringing', href: '/stringing', desc: 'Six service tiers from labour-only to premium setup restring.' },
                { label: 'Paid playbooks', href: '/playbooks', desc: 'PDF guides covering equipment, training and matchplay.' },
                { label: 'Free gear reviews', href: '/reviews', desc: 'Honest reviews on rackets, strings, shoes and grips.' },
                { label: 'Training guides', href: '/training', desc: 'Warm-ups, drills and practice plans.' },
                { label: 'Learn articles', href: '/learn', desc: 'Free articles on strings, rackets, shoes and more.' },
                { label: 'Custom programmes', href: '/custom-programmes', desc: 'Built around your level, goals and schedule. By enquiry.' },
              ].map((item) => (
                <Link key={item.href} href={item.href}>
                  <Card hover className="h-full">
                    <p className="font-semibold text-navy-900 mb-1">{item.label}</p>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </Card>
                </Link>
              ))}
            </div>
            <p className="mt-6 text-sm text-gray-500">
              Racket customisation (lead tape, grommet replacement, grip build-up) is coming later.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding-sm bg-navy-900 text-white">
        <div className="container-lg">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold mb-2">Start with stringing or a playbook</h3>
              <p className="text-gray-400">Get in touch or browse what RacketLogic offers.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/stringing">
                <Button>Book Stringing <ArrowRight className="w-4 h-4" /></Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" className="border-white/30 text-white hover:bg-white hover:text-navy-900">
                  Get in touch
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
