import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Zap, Check } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Disclaimer } from '@/components/ui/Disclaimer'
import { StringingServices } from '@/components/stringing/StringingServices'

export const metadata: Metadata = {
  title: 'Central London Racket Stringing',
  description: 'Tennis racket stringing with Central London pickup and drop-off around London Bridge, Bank and Blackfriars on Tuesday, Wednesday and Thursday.',
}

const services = [
  {
    id: 'labour-only',
    name: 'Labour-Only Restring',
    price: 'GBP 20',
    priceNote: 'Your string',
    badge: null,
    description: 'For players who already have their own string and know what tension they want. Bring your string, we do the rest.',
    includes: [
      'Restring with your own string',
      'Basic racket condition check',
      'Tension confirmation',
    ],
    highlight: false,
  },
  {
    id: 'we-provide-string',
    name: 'We Provide The String',
    price: 'From GBP 30',
    priceNote: 'String included',
    badge: null,
    description: 'We select and provide a suitable string for your racket and game. Variable pricing depending on string chosen.',
    includes: [
      'String selected and provided by RacketLogic',
      'Racket restring',
      'Basic tension advice',
    ],
    highlight: false,
  },
  {
    id: 'we-provide-hybrid',
    name: 'We Provide Hybrid Stringing',
    price: 'From GBP 45',
    priceNote: 'Both strings included',
    badge: 'Popular',
    description: 'Two different strings in one racket - mains and crosses. We provide and recommend both. Variable pricing based on strings chosen.',
    includes: [
      'Two strings selected and provided by RacketLogic',
      'Mains and crosses recommendation',
      'Individual tension for each string',
      'Racket restring',
    ],
    highlight: false,
  },
  {
    id: 'sereggtti-labour',
    name: 'Sereggtti - Labour Only',
    price: 'GBP 30',
    priceNote: 'Your string',
    badge: 'Specialist',
    description: 'Sereggtti is a specialist map-type stringing pattern that changes how strings interact across the bed. Bring your own string.',
    includes: [
      'Specialist Sereggtti stringing pattern',
      'Restring with your own string',
      'Racket condition check',
      'Additional time and precision required',
    ],
    highlight: false,
  },
  {
    id: 'sereggtti-with-strings',
    name: 'Sereggtti - With Strings',
    price: 'From GBP 40',
    priceNote: 'Single or hybrid',
    badge: 'Signature',
    description: 'Specialist Sereggtti pattern with strings provided by RacketLogic. Price depends on whether you choose a single-string or hybrid setup.',
    includes: [
      'Specialist Sereggtti stringing pattern',
      'String selected and provided by RacketLogic',
      'Single-string setup from GBP 40',
      'Hybrid setup from GBP 55',
      'Tension recommendation',
      'Full racket condition check',
      'Written setup notes',
    ],
    highlight: true,
  },
]

const addOns = [
  { label: 'Grip build-up (making grip bigger)', free: false, note: 'Contact for pricing' },
  { label: 'Regripping (overgrip replacement)', free: true, note: 'Free' },
  { label: 'Grommet replacement', free: false, note: 'Contact for pricing' },
  { label: 'Logo stencil application', free: false, note: 'Small fee' },
]

const handoverOptions = [
  {
    title: 'Central London pickup/drop-off',
    description: 'London Bridge, Bank, Blackfriars and nearby areas on Tuesday, Wednesday and Thursday.',
    tag: 'Main service',
  },
  {
    title: 'Northolt UB5 home drop-off',
    description: 'Best for fastest turnaround. 24-hour service is available when dropped off and collected from UB5.',
    tag: '24hr available',
  },
  {
    title: 'Club and area requests',
    description: 'Request Ealing, Northwood, Acton, Ruislip, Eastcote, West London or North West London. We reply within 4 daytime hours to confirm if it works.',
    tag: 'Request first',
  },
]

const stringBreakdown = [
  {
    title: 'Tension & power',
    points: [
      'Higher tension = more control, less power',
      'Lower tension = more power, less control',
      'Most club players string too tight',
      'Start lower if you have arm issues',
    ],
  },
  {
    title: 'String types',
    points: [
      'Polyester - durable, good spin, firmer feel',
      'Multifilament - arm-friendly, softer, more comfort',
      'Natural gut - premium feel, best power and tension hold',
      'Synthetic gut - all-round, budget-friendly',
    ],
  },
  {
    title: 'Hybrid setups',
    points: [
      'Poly mains + natural gut or multi crosses',
      'Gives spin and durability of poly with comfort of gut',
      'Popular with intermediate and advanced players',
      'Different tensions for mains and crosses is normal',
    ],
  },
  {
    title: 'When to restring',
    points: [
      'As many times per year as you play per week',
      'If you play twice a week, restring twice a year',
      'Strings lose tension and feel long before they break',
      'Dead strings mean less control, not just less power',
    ],
  },
]

export default function StringingPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy-gradient text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-lime-500/6 rounded-full blur-[100px]" />
        </div>
        <div className="container-lg relative">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-8 bg-lime-400/60" />
            <span className="text-xs tracking-[0.3em] text-lime-400/80 uppercase font-medium">Central London Stringing Service</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-5 max-w-2xl leading-tight">
            Central London Racket Stringing
          </h1>
          <p className="text-xl text-gray-400 max-w-xl leading-relaxed mb-8 font-light">
            Professional racket stringing with pickup and drop-off around London Bridge, Bank and Blackfriars on Tuesday, Wednesday and Thursday.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="#book">
              <button className="group inline-flex items-center gap-2 px-8 py-3.5 bg-lime-500 text-navy-950 font-semibold rounded hover:bg-lime-400 transition-all duration-300 hover:shadow-[0_0_30px_rgba(212,174,85,0.35)] text-sm tracking-wide">
                Book Now
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </a>
            <a href="#services">
              <button className="inline-flex items-center gap-2 px-8 py-3.5 border border-white/20 text-white font-medium rounded hover:border-lime-400/50 hover:text-lime-300 transition-all duration-300 text-sm">
                View Services
              </button>
            </a>
          </div>
        </div>
      </section>

      {/* String breakdown */}
      <section className="section-padding bg-white">
        <div className="container-lg">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="h-px w-8 bg-lime-500/50" />
              <span className="text-xs tracking-[0.3em] text-lime-600 uppercase font-medium">Quick Guide</span>
              <div className="h-px w-8 bg-lime-500/50" />
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-navy-900 mb-3">String basics</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Not sure what you need? Here is a quick breakdown of the key things that affect how your racket plays.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {stringBreakdown.map((section) => (
              <div key={section.title} className="rounded-2xl border border-gray-100 bg-gray-50 p-6 hover:border-lime-200 hover:bg-lime-50/30 transition-all duration-300">
                <h3 className="font-serif font-bold text-navy-900 mb-4">{section.title}</h3>
                <ul className="space-y-2.5">
                  {section.points.map((point) => (
                    <li key={point} className="flex items-start gap-2.5 text-sm text-gray-600 leading-snug">
                      <div className="w-1.5 h-1.5 rounded-full bg-lime-500 flex-shrink-0 mt-1.5" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p className="mt-8 text-center text-sm text-gray-400">
            Want to go deeper?{' '}
            <Link href="/learn/string-tension-explained" className="text-lime-600 hover:text-lime-500 transition-colors underline">
              Read our full string tension guide
            </Link>{' '}
            or{' '}
            <Link href="/playbooks/string-setup" className="text-lime-600 hover:text-lime-500 transition-colors underline">
              get the String Setup Playbook
            </Link>.
          </p>
        </div>
      </section>

      {/* Services + Booking form (client component handles click -> select) */}
      <StringingServices services={services} />

      {/* Add-ons */}
      <section className="section-padding-sm bg-white">
        <div className="container-lg">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-serif font-bold text-navy-900 mb-6">Add-ons &amp; extras</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {addOns.map((item) => (
                <div key={item.label} className="flex items-center justify-between gap-3 p-4 rounded-xl border border-gray-100 bg-gray-50">
                  <div className="flex items-center gap-2.5">
                    <Zap className="w-4 h-4 text-lime-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{item.label}</span>
                  </div>
                  <span className={`text-xs font-semibold flex-shrink-0 ${item.free ? 'text-lime-600' : 'text-gray-400'}`}>
                    {item.note}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-5 text-sm text-gray-400">
              Not sure what you need?{' '}
              <Link href="/contact" className="text-lime-600 hover:underline">
                Get in touch
              </Link>{' '}
              and we will advise before you book.
            </p>
          </div>
        </div>
      </section>

      {/* Pickup and drop-off */}
      <section className="section-padding-sm bg-gray-50">
        <div className="container-lg">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-serif font-bold text-navy-900 mb-3">Pickup and drop-off</h2>
            <p className="text-gray-500 mb-6">
              Our main service advantage is convenient Central London handover: London Bridge, Bank,
              Blackfriars and nearby areas on Tuesday, Wednesday and Thursday.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {handoverOptions.map((opt) => (
                <div key={opt.title} className="rounded-2xl border border-gray-100 bg-white p-6 text-center hover:border-lime-200 transition-colors">
                  <div className="text-xs font-semibold uppercase tracking-wider text-lime-600 mb-3">{opt.tag}</div>
                  <h3 className="font-serif font-bold text-navy-900 mb-2">{opt.title}</h3>
                  <p className="text-sm text-gray-500">{opt.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <div className="container-lg py-8">
        <div className="max-w-3xl mx-auto">
          <Disclaimer type="medical" />
        </div>
      </div>
    </>
  )
}

