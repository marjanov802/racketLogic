export type HomeContent = {
  heroEyebrow: string
  heroTitleStart: string
  heroTitleAccent: string
  heroSubtitle: string
  heroPrimaryLabel: string
  heroPrimaryHref: string
  heroSecondaryLabel: string
  heroSecondaryHref: string
  londonTitle: string
  londonSubtitle: string
  londonAreas: string
  londonDays: string
  londonPayment: string
  finalEyebrow: string
  finalTitleStart: string
  finalTitleAccent: string
  finalSubtitle: string
}

export const defaultHomeContent: HomeContent = {
  heroEyebrow: 'Tennis knowledge + Central London stringing',
  heroTitleStart: 'Learn your setup.',
  heroTitleAccent: 'String it in London.',
  heroSubtitle:
    'RacketLogic helps players understand strings, rackets and gear, then makes restringing easy with pickup and drop-off around London Bridge, Bank and Blackfriars on Tuesday, Wednesday and Thursday.',
  heroPrimaryLabel: 'Read the Blog',
  heroPrimaryHref: '/reviews',
  heroSecondaryLabel: 'Central London Stringing',
  heroSecondaryHref: '/stringing',
  londonTitle: 'Central London racket handover.',
  londonSubtitle:
    'Learn what setup you need, then make the restring simple with pickup and drop-off where London players actually move through.',
  londonAreas: 'London Bridge, Bank, Blackfriars + nearby',
  londonDays: 'Tuesday, Wednesday, Thursday',
  londonPayment: 'Online, card or cash accepted',
  finalEyebrow: 'Get started',
  finalTitleStart: 'Read. Learn. Play',
  finalTitleAccent: 'smarter.',
  finalSubtitle:
    'Start with an honest review, go deeper with a guide, or book a restring when you know exactly what you need.',
}

export function mergeHomeContent(value: unknown): HomeContent {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return defaultHomeContent
  const saved = value as Partial<Record<keyof HomeContent, unknown>>

  return Object.fromEntries(
    Object.entries(defaultHomeContent).map(([key, fallback]) => {
      const current = saved[key as keyof HomeContent]
      return [key, typeof current === 'string' && current.trim() ? current : fallback]
    })
  ) as HomeContent
}
