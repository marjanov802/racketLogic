import type { Metadata } from 'next'
import Link from 'next/link'
import { BookOpen, ArrowRight, Lock, Download } from 'lucide-react'
import { AnimateIn } from '@/components/ui/AnimateIn'
import { formatPrice } from '@/lib/utils'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = {
  title: 'Playbooks',
  description: 'Practical PDF guides on strings, rackets, shoes and match tactics. Free previews on every playbook.',
}

const freeSnapshots = [
  {
    title: 'Stringing basics',
    summary: 'What you need to know before booking a restring.',
    points: [
      'Higher tension = more control, less power',
      'Lower tension = more power, easier on the arm',
      'Poly strings are durable and spin-friendly',
      'Multifilament strings are softer and more comfortable',
      'Restring as many times per year as you play per week',
    ],
    cta: 'Full string guide',
    href: '/learn/string-tension-explained',
    playbookHref: '/playbooks/string-setup',
    playbookLabel: 'String Setup Playbook — £7.99',
  },
  {
    title: 'Racket basics',
    summary: 'The specs that actually make a difference to your game.',
    points: [
      'Head size: bigger = more power, smaller = more control',
      'Weight: heavier gives more stability and power',
      'Balance: head-heavy adds power, head-light feels faster',
      'String pattern: open (16x19) gives more spin',
      'Stiffness: stiffer frames hit harder but are less comfortable',
    ],
    cta: 'Full racket guide',
    href: '/learn/racket-specs-explained',
    playbookHref: '/playbooks/racket-buying',
    playbookLabel: 'Racket Buying Playbook — £9.99',
  },
  {
    title: 'Shoe basics',
    summary: 'The right shoe for your surface and playing style.',
    points: [
      'Hard court shoes have durable, tough outsoles',
      'Clay shoes have herringbone grip patterns',
      'All-court shoes are a compromise — fine for casual play',
      'Wide feet need specific lasts — check the fit carefully',
      'Replace tennis shoes every 45–60 hours of play',
    ],
    cta: 'Full shoe guide',
    href: '/learn/how-to-choose-tennis-shoes',
    playbookHref: '/playbooks/tennis-shoe',
    playbookLabel: 'Tennis Shoe Playbook — £6.99',
  },
]

async function getPlaybooks() {
  try {
    return await prisma.playbook.findMany({
      where: { published: true, isBundle: false },
      orderBy: [{ featured: 'desc' }, { createdAt: 'asc' }],
    })
  } catch {
    return []
  }
}

export default async function PlaybooksPage() {
  const playbooks = await getPlaybooks()

  return (
    <>
      {/* Hero */}
      <section className="bg-navy-gradient text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-lime-500/6 rounded-full blur-[120px]" />
        </div>
        <div className="container-lg relative">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-8 bg-lime-400/60" />
            <span className="text-xs tracking-[0.3em] text-lime-400/80 uppercase font-medium">PDF Playbooks</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-5 max-w-2xl leading-tight">
            RacketLogic Playbooks
          </h1>
          <p className="text-xl text-gray-400 max-w-xl leading-relaxed mb-8 font-light">
            Practical guides that help you make better decisions about strings, rackets, shoes and match tactics. Free previews on every playbook.
          </p>
          <div className="flex items-center gap-6 border-t border-white/5 pt-6">
            {[
              { icon: BookOpen, label: 'Free preview on every playbook' },
              { icon: Lock, label: 'Locked until purchased' },
              { icon: Download, label: 'Instant PDF download' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-sm text-gray-400">
                <Icon className="w-4 h-4 text-lime-400 flex-shrink-0" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Free knowledge teasers */}
      <section className="section-padding bg-white">
        <div className="container-lg">
          <AnimateIn className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="h-px w-8 bg-lime-500/50" />
              <span className="text-xs tracking-[0.3em] text-lime-600 uppercase font-medium">Free to read</span>
              <div className="h-px w-8 bg-lime-500/50" />
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-navy-900 mb-3">The basics, for free</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Start here. Each section gives you the key points — if you want the full picture, the playbook goes much deeper.
            </p>
          </AnimateIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {freeSnapshots.map((snap, i) => (
              <AnimateIn key={snap.title} delay={(i + 1) as 1 | 2 | 3}>
                {/* Stretch-link pattern: invisible Link covers the card; playbook button sits above it with z-10 */}
                <div className="relative h-full rounded-2xl border border-gray-100 bg-gray-50 overflow-hidden hover:border-lime-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex flex-col group">
                  <Link href={snap.href} className="absolute inset-0 z-0" aria-label={`Read: ${snap.title}`} />
                  <div className="p-6 flex-1">
                    <h3 className="font-serif font-bold text-navy-900 text-lg mb-1">{snap.title}</h3>
                    <p className="text-xs text-gray-400 mb-4">{snap.summary}</p>
                    <ul className="space-y-2">
                      {snap.points.map((point) => (
                        <li key={point} className="flex items-start gap-2 text-sm text-gray-600 leading-snug">
                          <div className="w-1.5 h-1.5 rounded-full bg-lime-500 flex-shrink-0 mt-1.5" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="border-t border-gray-100 p-4 space-y-2 bg-white">
                    <span className="flex items-center gap-1 text-xs font-medium text-lime-600">
                      {snap.cta} <ArrowRight className="w-3 h-3" />
                    </span>
                    <Link href={snap.playbookHref} className="relative z-10 block">
                      <div className="flex items-center justify-between p-3 rounded-xl border border-lime-200 bg-lime-50/50 hover:bg-lime-50 transition-colors">
                        <span className="text-xs font-semibold text-navy-900">{snap.playbookLabel}</span>
                        <BookOpen className="w-3.5 h-3.5 text-lime-600" />
                      </div>
                    </Link>
                  </div>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* Individual playbooks */}
      <section className="section-padding bg-gray-50">
        <div className="container-lg">
          <AnimateIn className="mb-10">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-px w-8 bg-lime-500/50" />
                  <span className="text-xs tracking-[0.3em] text-lime-600 uppercase font-medium">Full guides</span>
                </div>
                <h2 className="text-3xl font-serif font-bold text-navy-900 mb-1">All playbooks</h2>
                <p className="text-gray-500">Buy exactly what you need. Free preview before every purchase.</p>
              </div>
            </div>
          </AnimateIn>

          {playbooks.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-40" />
              <p>Playbooks coming soon. Check back shortly.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {playbooks.map((playbook, i) => (
                <AnimateIn key={playbook.id} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
                  <Link href={`/playbooks/${playbook.slug}`} className="block group h-full">
                    <div className="h-full rounded-2xl border border-gray-200 bg-white overflow-hidden hover:border-lime-300 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col">
                      <div className="h-36 bg-navy-gradient relative flex items-center justify-center">
                        <div className="absolute inset-0 bg-lime-500/5 group-hover:bg-lime-500/10 transition-all duration-500" />
                        <BookOpen className="w-8 h-8 text-lime-400/70 group-hover:text-lime-300 transition-colors relative z-10" />
                        <div className="absolute bottom-2 left-4">
                          <span className="text-xs tracking-widest text-lime-400/60 uppercase">{playbook.category}</span>
                        </div>
                      </div>
                      <div className="p-5 flex flex-col flex-1">
                        <h3 className="font-serif font-bold text-navy-900 mb-2 leading-snug flex-1">{playbook.title}</h3>
                        <p className="text-xs text-gray-500 mb-4 leading-relaxed line-clamp-2">{playbook.description}</p>
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          <span className="text-lg font-bold text-navy-900">{formatPrice(Number(playbook.price))}</span>
                          <span className="text-xs font-semibold text-lime-600 flex items-center gap-1 group-hover:gap-1.5 transition-all">
                            View <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </AnimateIn>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Stringing upsell */}
      <section className="section-padding-sm">
        <div className="container-lg">
          <div className="rounded-2xl bg-navy-gradient p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-lime-500/5 pointer-events-none" />
            <div className="relative">
              <h3 className="text-xl font-serif font-bold text-white mb-2">Want the setup done for you?</h3>
              <p className="text-gray-400 text-sm">Book a stringing service and we will put the advice from your playbook into practice.</p>
            </div>
            <Link href="/stringing" className="flex-shrink-0 relative">
              <button className="inline-flex items-center gap-2 px-7 py-3 bg-lime-500 text-navy-950 font-semibold rounded hover:bg-lime-400 transition-all duration-300 hover:shadow-[0_0_20px_rgba(212,174,85,0.3)] text-sm tracking-wide">
                Book Stringing <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
