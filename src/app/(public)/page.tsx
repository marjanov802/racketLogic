import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { AnimateIn } from '@/components/ui/AnimateIn'
import { prisma } from '@/lib/prisma'
import { mergeHomeContent, type HomeContent } from '@/lib/home-content'
import {
  BookOpen,
  Dumbbell,
  Star,
  Users,
  ArrowRight,
  Check,
  ShieldCheck,
  Target,
  TrendingUp,
  Zap,
  ChevronRight,
} from 'lucide-react'

// Data

const services = [
  {
    icon: BookOpen,
    title: 'Learn',
    description: 'Free guides on string tension, racket specs, shoe choice, warm-ups and more. Coming soon.',
    href: '/learn',
    cta: 'Coming Soon',
    highlight: true,
  },
  {
    icon: Star,
    title: 'Gear Reviews',
    description: 'Honest reviews on rackets, strings, shoes and accessories. Clear verdicts, no sponsored opinions.',
    href: '/reviews',
    cta: 'Read Reviews',
  },
  {
    icon: BookOpen,
    title: 'Playbooks',
    description: 'Paid PDF guides on strings, rackets, shoes, tactics, warm-ups and nutrition. Coming soon.',
    href: '/playbooks',
    cta: 'Coming Soon',
  },
  {
    icon: Zap,
    title: 'Central London Stringing',
    description: 'Pickup and drop-off around London Bridge, Bank and Blackfriars on Tuesday, Wednesday and Thursday. Practical setup advice included.',
    href: '/stringing',
    cta: 'Book London Handover',
  },
  {
    icon: Users,
    title: 'Custom Programmes',
    description: 'A training programme built around your level, goals and schedule. Available by enquiry.',
    href: '/custom-programmes',
    cta: 'Request a Programme',
  },
]

const howItWorks = [
  { step: '01', title: 'Start with stringing support', description: 'Book a restring or ask for guidance on strings and tension while the knowledge library is being prepared.' },
  { step: '02', title: 'Learn section coming soon', description: 'Free guides on strings, rackets, shoes, warm-ups and tactics are being built so players can make better setup decisions.' },
  { step: '03', title: 'Read reviews before you buy', description: 'Honest verdicts on rackets, strings and shoes before spending money on kit that might not suit your game.' },
  { step: '04', title: 'Use the Central London handover', description: 'Once you know what strings and tension suit your game, hand over your racket around London Bridge, Bank or Blackfriars on Tuesday, Wednesday or Thursday.' },
]

const fallbackFeaturedPlaybooks = [
  { title: 'String Setup Playbook', description: 'Poly vs multifilament, tension explained, strings for spin, control and comfort.', meta: 'Coming soon', category: 'Equipment', href: '/playbooks/string-setup' },
  { title: 'Racket Buying Playbook', description: 'Head size, weight, balance, swingweight and string pattern explained clearly.', meta: 'Coming soon', category: 'Equipment', href: '/playbooks/racket-buying' },
  { title: 'Match Tactics Playbook', description: 'Singles and doubles tactics, serve patterns, return tactics and tie-break strategy.', meta: 'Coming soon', category: 'Matchplay', href: '/playbooks/match-tactics' },
]

type FeaturedHomeItem = {
  title: string
  description: string
  category: string
  href: string
  image?: string | null
  meta?: string
}

async function getHomePageData() {
  try {
    const [setting, reviews, articles, playbooks] = await Promise.all([
      prisma.siteSetting.findUnique({ where: { key: 'home' } }),
      prisma.reviewArticle.findMany({
        where: { published: true, featured: true },
        orderBy: { updatedAt: 'desc' },
        take: 3,
        select: { title: true, slug: true, excerpt: true, category: true, brand: true, coverImage: true },
      }),
      prisma.learnArticle.findMany({
        where: { published: true, featured: true },
        orderBy: { updatedAt: 'desc' },
        take: 3,
        select: { title: true, slug: true, excerpt: true, category: true, coverImage: true, readingTime: true },
      }),
      prisma.playbook.findMany({
        where: { published: true, featured: true, isBundle: false },
        orderBy: { updatedAt: 'desc' },
        take: 3,
        select: { title: true, slug: true, description: true, category: true, coverImage: true, price: true },
      }),
    ])

    return {
      content: mergeHomeContent(setting?.value),
      reviews: reviews.map((review): FeaturedHomeItem => ({
        title: review.title,
        description: review.excerpt,
        category: review.category,
        href: `/reviews/${review.slug}`,
        image: review.coverImage,
        meta: review.brand,
      })),
      articles: articles.map((article): FeaturedHomeItem => ({
        title: article.title,
        description: article.excerpt,
        category: article.category,
        href: `/learn/${article.slug}`,
        image: article.coverImage,
        meta: article.readingTime ? `${article.readingTime} min read` : 'Free article',
      })),
      playbooks: playbooks.map((playbook): FeaturedHomeItem => ({
        title: playbook.title,
        description: playbook.description,
        category: playbook.category,
        href: `/playbooks/${playbook.slug}`,
        image: playbook.coverImage,
        meta: `GBP ${Number(playbook.price).toFixed(2)}`,
      })),
    }
  } catch {
    return { content: mergeHomeContent(null), reviews: [], articles: [], playbooks: [] }
  }
}

const trustPoints = [
  { icon: ShieldCheck, title: 'No generic opinions', description: 'Every recommendation is practical and based on real tennis experience, not marketing.' },
  { icon: Target, title: 'Built around your game', description: 'Setup advice is specific to your style, level and goals - not one-size-fits-all.' },
  { icon: TrendingUp, title: 'Honest and transparent', description: 'Where affiliate links exist, they are clearly marked. We only recommend what works.' },
  { icon: BookOpen, title: 'Practical first', description: 'Guides focus on what to actually do, not endless theory. Actionable from the first page.' },
]

// Sections

function Hero({ content }: { content: HomeContent }) {
  return (
    <section className="bg-navy-gradient text-white overflow-hidden relative min-h-[90vh] flex items-center">
      {/* Animated background orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-lime-500/8 rounded-full blur-[120px] animate-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-lime-300/5 rounded-full blur-[100px] animate-glow" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 right-1/3 w-[200px] h-[200px] bg-navy-300/10 rounded-full blur-[80px] animate-float" />
      </div>

      {/* Subtle grid overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(237,217,163,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(237,217,163,0.5) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />

      <div className="container-lg py-28 md:py-36 relative z-10">
        <div className="max-w-3xl">
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px w-8 bg-lime-400/60" />
            <span className="text-xs tracking-[0.3em] text-lime-400/80 uppercase font-medium">{content.heroEyebrow}</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold leading-[1.05] tracking-tight mb-8">
            {content.heroTitleStart}{' '}
            <span className="text-gradient italic">{content.heroTitleAccent}</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 leading-relaxed mb-10 max-w-xl font-light">
            {content.heroSubtitle}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 mb-16">
            <Link href={content.heroPrimaryHref}>
              <button className="group inline-flex items-center gap-2 px-8 py-3.5 bg-lime-500 text-navy-950 font-semibold rounded hover:bg-lime-400 transition-all duration-300 hover:shadow-[0_0_40px_rgba(212,174,85,0.4)] text-sm tracking-wide">
                {content.heroPrimaryLabel}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <Link href={content.heroSecondaryHref}>
              <button className="inline-flex items-center gap-2 px-8 py-3.5 border border-white/20 text-white font-medium rounded hover:border-lime-400/50 hover:text-lime-300 transition-all duration-300 text-sm tracking-wide">
                {content.heroSecondaryLabel}
              </button>
            </Link>
          </div>

          {/* Social proof */}
          <div className="flex items-center gap-6 border-t border-white/5 pt-8">
            {[['Learn', 'Coming soon'], ['Playbooks', 'Coming soon'], ['London Handover', 'Tue-Thu central pickup']].map(([label, sub]) => (
              <div key={label} className="text-center">
                <div className="text-sm font-semibold text-lime-300">{label}</div>
                <div className="text-xs text-gray-500 mt-0.5">{sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </section>
  )
}

function LondonHandover({ content }: { content: HomeContent }) {
  return (
    <section className="-mt-10 relative z-20">
      <div className="container-lg">
        <AnimateIn>
          <div className="rounded-3xl border border-lime-500/20 bg-white shadow-2xl shadow-navy-950/10 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_2fr]">
              <div className="bg-navy-950 p-8 md:p-10 text-white">
                <div className="text-xs tracking-[0.28em] uppercase text-lime-400/80 mb-4">
                  Main stringing advantage
                </div>
                <h2 className="font-serif text-3xl md:text-4xl font-bold leading-tight">
                  {content.londonTitle}
                </h2>
                <p className="mt-4 text-sm text-gray-400 leading-relaxed">
                  {content.londonSubtitle}
                </p>
              </div>
              <div className="p-8 md:p-10">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-7">
                  {[
                    ['Areas', content.londonAreas],
                    ['Days', content.londonDays],
                    ['Payment', content.londonPayment],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-2xl bg-gray-50 border border-gray-100 p-5">
                      <div className="text-xs font-semibold uppercase tracking-wider text-lime-600 mb-2">{label}</div>
                      <div className="text-sm font-semibold text-navy-900 leading-snug">{value}</div>
                    </div>
                  ))}
                </div>
                <Link href="/stringing#book">
                  <button className="group inline-flex items-center gap-2 px-6 py-3 bg-lime-500 text-navy-950 font-semibold rounded hover:bg-lime-400 transition-all duration-300 text-sm tracking-wide">
                    Book Central London handover
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </AnimateIn>
      </div>
    </section>
  )
}

function WhatWeDo() {
  return (
    <section className="section-padding bg-white">
      <div className="container-lg">
        <AnimateIn className="max-w-2xl mx-auto text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-px w-8 bg-lime-500/50" />
            <span className="text-xs tracking-[0.3em] text-lime-600 uppercase font-medium">What we do</span>
            <div className="h-px w-8 bg-lime-500/50" />
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-navy-900 mb-5">
            Understand first. Improve after.
          </h2>
          <p className="text-gray-500 text-lg leading-relaxed">
            Most tennis players guess. Wrong strings, wrong tension, no training structure. RacketLogic gives you the knowledge to stop guessing - and the stringing service to put it into practice.
          </p>
        </AnimateIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <AnimateIn delay={1}>
            <div className="group relative bg-navy-950 rounded-2xl p-8 overflow-hidden border border-white/5 hover:border-lime-500/20 transition-all duration-500 glow-champagne-hover">
              <div className="absolute top-0 right-0 w-40 h-40 bg-lime-500/5 rounded-full blur-3xl group-hover:bg-lime-500/10 transition-all duration-700" />
              <div className="w-12 h-12 border border-lime-500/30 rounded flex items-center justify-center mb-6 group-hover:border-lime-400/60 transition-colors">
                <BookOpen className="w-5 h-5 text-lime-400" />
              </div>
              <h3 className="font-serif text-xl font-bold text-white mb-3">Tennis Knowledge</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-5">
                Free articles and in-depth playbooks on strings, rackets, shoes, warm-ups, tactics and nutrition are coming soon. The aim is simple tennis information written clearly.
              </p>
              <ul className="space-y-2">
                {['Learn section coming soon', 'Honest gear reviews', 'Practical PDF playbooks coming soon', 'String, racket and shoe guides'].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-gray-300">
                    <Check className="w-3.5 h-3.5 text-lime-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </AnimateIn>

          <AnimateIn delay={2}>
            <div className="group relative bg-navy-950 rounded-2xl p-8 overflow-hidden border border-white/5 hover:border-lime-500/20 transition-all duration-500 glow-champagne-hover">
              <div className="absolute top-0 right-0 w-40 h-40 bg-navy-300/5 rounded-full blur-3xl group-hover:bg-navy-300/10 transition-all duration-700" />
              <div className="w-12 h-12 border border-lime-500/30 rounded flex items-center justify-center mb-6 group-hover:border-lime-400/60 transition-colors">
                <Zap className="w-5 h-5 text-lime-400" />
              </div>
              <h3 className="font-serif text-xl font-bold text-white mb-3">Racket Stringing</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-5">
                Once you know what strings and tension suit your game, we do the stringing. Central London pickup/drop-off is available around London Bridge, Bank and Blackfriars on Tuesday, Wednesday and Thursday.
              </p>
              <ul className="space-y-2">
                {['London Bridge, Bank and Blackfriars', 'Tuesday to Thursday handover', 'Cash, card or online payment', 'UB5 and club options also available'].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-gray-300">
                    <Check className="w-3.5 h-3.5 text-lime-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </AnimateIn>
        </div>
      </div>
    </section>
  )
}

function Services() {
  return (
    <section className="section-padding bg-gray-50">
      <div className="container-lg">
        <AnimateIn className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-px w-8 bg-lime-500/50" />
            <span className="text-xs tracking-[0.3em] text-lime-600 uppercase font-medium">Services</span>
            <div className="h-px w-8 bg-lime-500/50" />
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-navy-900 mb-4">Everything in one place</h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">Stringing is available now. Learn articles and playbooks are being prepared.</p>
        </AnimateIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service, i) => {
            const Icon = service.icon
            return (
              <AnimateIn key={service.title} delay={(i % 3 + 1) as 1 | 2 | 3}>
                <Link href={service.href} className="block h-full group">
                  <div className={`h-full rounded-2xl p-7 border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${service.highlight ? 'bg-navy-950 border-lime-500/30 hover:border-lime-400/50' : 'bg-white border-gray-100 hover:border-lime-200'}`}>
                    <div className={`w-11 h-11 rounded flex items-center justify-center mb-5 ${service.highlight ? 'bg-lime-500/10 border border-lime-500/30' : 'bg-navy-950'}`}>
                      <Icon className={`w-5 h-5 ${service.highlight ? 'text-lime-400' : 'text-lime-400'}`} />
                    </div>
                    {service.highlight && (
                      <span className="inline-block text-xs tracking-widest text-lime-400 uppercase font-medium mb-3">Most Popular</span>
                    )}
                    <h3 className={`font-serif text-lg font-bold mb-2 ${service.highlight ? 'text-white' : 'text-navy-900'}`}>{service.title}</h3>
                    <p className={`text-sm leading-relaxed mb-5 ${service.highlight ? 'text-gray-400' : 'text-gray-500'}`}>{service.description}</p>
                    <div className={`flex items-center gap-1 text-sm font-semibold transition-all group-hover:gap-2 ${service.highlight ? 'text-lime-400' : 'text-lime-600'}`}>
                      {service.cta}
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              </AnimateIn>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function HowItWorks() {
  return (
    <section className="section-padding bg-navy-gradient relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-lime-500/4 rounded-full blur-[150px]" />
      </div>
      <div className="container-lg relative">
        <AnimateIn className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-px w-8 bg-lime-400/40" />
            <span className="text-xs tracking-[0.3em] text-lime-400/70 uppercase font-medium">How it works</span>
            <div className="h-px w-8 bg-lime-400/40" />
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">Simple to get started</h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">Getting better tennis results doesn't have to be complicated.</p>
        </AnimateIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {howItWorks.map((step, i) => (
            <AnimateIn key={step.step} delay={(i + 1) as 1 | 2 | 3 | 4}>
              <div className="relative group">
                <div className="font-serif text-7xl font-bold text-lime-500/10 mb-4 leading-none group-hover:text-lime-500/20 transition-all duration-500">
                  {step.step}
                </div>
                <div className="w-8 h-px bg-lime-500/40 mb-4 group-hover:w-12 group-hover:bg-lime-400/60 transition-all duration-300" />
                <h3 className="font-serif text-base font-bold text-white mb-2 leading-snug">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.description}</p>
              </div>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  )
}

function FeaturedItems({
  eyebrow,
  title,
  subtitle,
  href,
  linkLabel,
  items,
  fallback,
}: {
  eyebrow: string
  title: string
  subtitle: string
  href: string
  linkLabel: string
  items: FeaturedHomeItem[]
  fallback?: FeaturedHomeItem[]
}) {
  const displayItems = items.length > 0 ? items : fallback ?? []
  if (displayItems.length === 0) return null

  return (
    <section className="section-padding bg-white">
      <div className="container-lg">
        <AnimateIn className="flex items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8 bg-lime-500/50" />
              <span className="text-xs tracking-[0.3em] text-lime-600 uppercase font-medium">{eyebrow}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-navy-900 mb-2">{title}</h2>
            <p className="text-gray-500">{subtitle}</p>
          </div>
          <Link href={href} className="hidden md:flex items-center gap-1.5 text-sm font-medium text-lime-600 hover:text-lime-500 transition-colors group">
            {linkLabel} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </AnimateIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {displayItems.map((item, i) => (
            <AnimateIn key={`${item.href}-${item.title}`} delay={(i + 1) as 1 | 2 | 3}>
              <Link href={item.href} className="block group">
                <div className="h-full rounded-2xl overflow-hidden border border-gray-100 hover:border-lime-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl bg-white">
                  <div className="h-44 bg-navy-gradient relative flex items-center justify-center overflow-hidden">
                    {item.image ? (
                      <img src={item.image} alt={item.title} className="h-full w-full object-contain bg-white p-4" />
                    ) : (
                      <>
                        <div className="absolute inset-0 bg-lime-500/5 group-hover:bg-lime-500/10 transition-all duration-500" />
                        <BookOpen className="w-10 h-10 text-lime-400/70 group-hover:text-lime-300 transition-colors relative z-10" />
                      </>
                    )}
                    <div className="absolute bottom-3 left-4">
                      <span className="text-xs tracking-widest text-lime-400/80 uppercase">{item.category}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-serif font-bold text-navy-900 mb-2 group-hover:text-navy-800 transition-colors">{item.title}</h3>
                    <p className="text-sm text-gray-500 mb-5 leading-relaxed">{item.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-navy-900 rounded-full bg-lime-100 text-lime-800 px-3 py-1">{item.meta ?? 'Featured'}</span>
                      <span className="text-xs font-semibold text-lime-600 flex items-center gap-1 group-hover:gap-1.5 transition-all">
                        Open <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  )
}

function WhyTrust() {
  return (
    <section className="section-padding relative overflow-hidden" style={{ background: 'linear-gradient(145deg, #030805 0%, #071410 50%, #0d2218 100%)' }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-lime-500/5 rounded-full blur-[130px] animate-glow" />
      </div>
      <div className="container-lg relative">
        <AnimateIn className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-px w-8 bg-lime-400/40" />
            <span className="text-xs tracking-[0.3em] text-lime-400/70 uppercase font-medium">Why RacketLogic</span>
            <div className="h-px w-8 bg-lime-400/40" />
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">Built on honesty</h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">Real tennis experience. Practical advice. No sponsored spin.</p>
        </AnimateIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {trustPoints.map((point, i) => {
            const Icon = point.icon
            return (
              <AnimateIn key={point.title} delay={(i + 1) as 1 | 2 | 3 | 4}>
                <div className="group rounded-2xl p-7 border border-white/5 hover:border-lime-500/20 bg-white/3 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 glow-champagne-hover">
                  <div className="w-10 h-10 border border-lime-500/25 rounded flex items-center justify-center mb-5 group-hover:border-lime-400/50 transition-colors">
                    <Icon className="w-4.5 h-4.5 text-lime-400" />
                  </div>
                  <h3 className="font-serif font-bold text-white mb-2">{point.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{point.description}</p>
                </div>
              </AnimateIn>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function FinalCTA({ content }: { content: HomeContent }) {
  return (
    <section className="section-padding bg-white">
      <div className="container-lg">
        <AnimateIn>
          <div className="relative rounded-3xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #071410 0%, #0d2218 50%, #133020 100%)' }}>
            {/* Champagne glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-lime-500/8 rounded-full blur-[100px] animate-glow" />

            {/* Decorative border line */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-lime-400/60 to-transparent" />

            <div className="relative px-10 py-20 md:py-24 text-center">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="h-px w-8 bg-lime-400/40" />
                <span className="text-xs tracking-[0.3em] text-lime-400/70 uppercase font-medium">{content.finalEyebrow}</span>
                <div className="h-px w-8 bg-lime-400/40" />
              </div>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-5 max-w-2xl mx-auto leading-tight">
                {content.finalTitleStart}{' '}
                <span className="text-gradient italic">{content.finalTitleAccent}</span>
              </h2>
              <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
                {content.finalSubtitle}
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/learn">
                  <button className="group inline-flex items-center gap-2 px-8 py-3.5 bg-lime-500 text-navy-950 font-semibold rounded hover:bg-lime-400 transition-all duration-300 hover:shadow-[0_0_40px_rgba(212,174,85,0.35)] text-sm tracking-wide">
                    Start Reading Free
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
                <Link href="/playbooks">
                  <button className="inline-flex items-center gap-2 px-8 py-3.5 border border-white/15 text-white font-medium rounded hover:border-lime-400/40 hover:text-lime-300 transition-all duration-300 text-sm tracking-wide">
                    Browse Playbooks
                  </button>
                </Link>
                <Link href="/stringing">
                  <button className="inline-flex items-center gap-2 px-8 py-3.5 text-gray-500 font-medium hover:text-gray-300 transition-colors text-sm">
                    Central London Stringing
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </AnimateIn>
      </div>
    </section>
  )
}

// Page

export default async function HomePage() {
  const { content, reviews, articles, playbooks } = await getHomePageData()

  return (
    <>
      <Hero content={content} />
      <LondonHandover content={content} />
      <WhatWeDo />
      <Services />
      <FeaturedItems
        eyebrow="Blog"
        title="Featured reviews"
        subtitle="Personal, practical opinions on rackets, shoes, strings and gear."
        href="/reviews"
        linkLabel="All reviews"
        items={reviews}
      />
      <FeaturedItems
        eyebrow="Learn"
        title="Featured free articles"
        subtitle="Free tennis information from the admin article library."
        href="/learn"
        linkLabel="All articles"
        items={articles}
      />
      <HowItWorks />
      <FeaturedItems
        eyebrow="Playbooks"
        title="Featured playbooks"
        subtitle="Practical tennis setup guides selected from admin."
        href="/playbooks"
        linkLabel="All playbooks"
        items={playbooks}
        fallback={fallbackFeaturedPlaybooks}
      />
      <WhyTrust />
      <FinalCTA content={content} />
    </>
  )
}

