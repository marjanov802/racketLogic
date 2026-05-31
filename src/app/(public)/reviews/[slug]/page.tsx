import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Check, ExternalLink } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { Disclaimer } from '@/components/ui/Disclaimer'
import { prisma } from '@/lib/prisma'

interface PageProps {
  params: Promise<{ slug: string }>
}

const reviewedSpecs = [
  ['Model reviewed', 'Tecnifibre TFight 305 ISOFLEX'],
  ['Head size', '98 sq in'],
  ['Weight', '305 g unstrung'],
  ['Other TFight weights', '295 g, 300 g, 315 g options in the wider range'],
  ['String pattern', '18 x 19'],
  ['Length', '27 in'],
  ['Beam', '22.5 mm'],
  ['Balance feel', 'Even to slightly head-heavy feel'],
  ['General style', 'Control, feel and stability'],
  ['Typical player', 'Intermediate to advanced ball striker'],
]

const technologyNotes = [
  {
    title: 'Tecnilab process',
    body: 'Tecnifibre describe Tecnilab as their method for working with players, gathering scientific data, quantifying what needs improving, and then building a technical solution into the racket. The useful point is that the TFight does not feel like random marketing: it feels like a frame designed around stability, feel and a cleaner response under pace.',
  },
  {
    title: 'ISOFLEX frame response',
    body: 'ISOFLEX is there to create a more consistent, stable response around the frame. For a one-handed backhand especially, that stiffness and support matter because you do not have a second hand helping the racket stay firm through contact.',
  },
  {
    title: '18 x 19 pattern',
    body: 'The 18 x 19 string pattern gives extra control without feeling completely dead. You can really feel how string tension changes the response: tighter setups make it feel firmer, more stable and almost bat-like through the ball.',
  },
]

const recommendedFor = [
  'One-handed backhand players who want a manoeuvrable racket with stability through contact',
  'Players who like feeling the ball on forehands, volleys and touch shots',
  'Attackers who want control, feel and confidence when taking the ball early',
  'Players who can generate their own racket speed and want the frame to stay solid',
  'All-court players who want a racket that can absorb pace and redirect it cleanly',
]

const lessIdealFor = [
  'Beginners who need easy depth',
  'Players who want lots of free power',
  'Players who want a huge, forgiving sweet spot',
  'Defensive players who rely on the racket doing more of the work from stretched positions',
  'Players with arm discomfort using stiff polyester at high tension',
]

const shoeSpecs = [
  ['Model reviewed', 'ASICS Gel Resolution 9'],
  ['Court type', 'Hard court / all-court'],
  ['Style', 'Stability shoe'],
  ['Fit feel', 'Secure, supportive'],
  ['Best for', 'Baseline movement'],
  ['Main trade-off', 'Not the lightest speed shoe'],
]

const shoeTechnologyNotes = [
  {
    title: 'DYNAWRAP support',
    body: 'Designed to hold the foot more securely during side-to-side movement.',
  },
  {
    title: 'GEL cushioning',
    body: 'Adds impact protection underfoot, especially useful for hard-court players.',
  },
  {
    title: 'Durable outsole',
    body: 'Built more for stability and durability than a minimal, lightweight feel.',
  },
]

const shoeRecommendedFor = [
  'Baseline players who move side to side a lot',
  'Players who want stability before speed',
  'Hard-court players who wear through shoes quickly',
  'Players who like a locked-in supportive fit',
]

const shoeLessIdealFor = [
  'Players who want the lightest possible shoe',
  'Players who prefer a soft slipper-like upper',
  'Very wide feet unless the fit works for you',
  'Players who mainly want speed-shoe flexibility',
]

const categorySections: Record<string, { eyebrow: string; title: string; items: { label: string; body: string }[] }[]> = {
  Rackets: [
    {
      eyebrow: 'On-court feel',
      title: 'Forehands, volleys and fast balls',
      items: [
        { label: 'Forehands', body: 'The racket feels very manoeuvrable, with a lot of feel on forehands. You can shape the ball, drive through it, or rip up the back of it when you commit to the swing.' },
        { label: 'Volleys', body: 'Volleys feel solid and connected. It does not feel flimsy at the net, which helps when you are blocking pace or trying to keep the volley short and controlled.' },
        { label: 'Fast balls', body: 'Against faster balls, the frame absorbs pace surprisingly well. Once the racket starts to feel like an extension of your arm, it gives a lot of confidence redirecting heavy shots.' },
      ],
    },
    {
      eyebrow: 'Backhand fit',
      title: 'One-handed and two-handed backhands',
      items: [
        { label: 'One-handed backhand', body: 'This is where the racket makes a lot of sense. The balance does not feel buried in the handle; it feels closer to even or slightly head-heavy, which helps the head drop and come up the back of the ball for spin.' },
        { label: 'Two-handed backhand', body: 'For two-handers, the stability still helps. The balance gives the racket enough presence through contact, although the strongest fit still feels like a player who wants feel and precision rather than easy power.' },
        { label: 'Frame support', body: 'The ISOFLEX stiffness around the frame is useful here. On a one-hander especially, you want the racket to stay firm and not twist or feel too flimsy when you only have one hand behind the shot.' },
      ],
    },
    {
      eyebrow: 'String bed',
      title: 'Sweet spot, control and tension',
      items: [
        { label: 'Small but excellent sweet spot', body: 'The sweet spot feels excellent when you find it, but it is not huge. The 98 sq in head rewards clean contact more than it forgives lazy timing.' },
        { label: 'Tension feel', body: 'With the 18 x 19 pattern, you can clearly feel string tension changing the racket. Higher tension makes the response firmer, more controlled and more stable, almost like hitting with a wooden bat.' },
        { label: 'Control identity', body: 'This is not a free-power frame. Its best quality is the feeling that you can choose the shot once you are timing the ball well.' },
      ],
    },
  ],
  Shoes: [
    {
      eyebrow: 'Movement',
      title: 'Court feel and support',
      items: [
        { label: 'Best court type', body: 'Best judged as a hard-court/all-court shoe where outsole durability matters.' },
        { label: 'Support', body: 'The main selling point is lateral stability when pushing wide and recovering.' },
        { label: 'Speed feel', body: 'It feels more planted than light. Good for confidence, less ideal if you want a minimal speed shoe.' },
      ],
    },
    {
      eyebrow: 'Fit',
      title: 'Comfort, durability and sizing',
      items: [
        { label: 'Fit check', body: 'You want a secure midfoot and heel, with enough toe room that the forefoot is not cramped.' },
        { label: 'Durability', body: 'A stability shoe usually gives better outsole life than a very lightweight speed shoe.' },
        { label: 'Break-in', body: 'Expect a more structured feel at first. If it pinches immediately, do not ignore that.' },
      ],
    },
  ],
  Strings: [
    {
      eyebrow: 'Performance',
      title: 'Power, spin, comfort and durability',
      items: [
        { label: 'Power', body: 'Softer strings such as multifilament or natural gut usually give easier power.' },
        { label: 'Spin/control', body: 'Polyester strings tend to suit bigger swings, control and spin, but can feel firm.' },
        { label: 'Comfort', body: 'If arm comfort matters, start with multifilament, natural gut or a softer hybrid.' },
      ],
    },
    {
      eyebrow: 'Setup',
      title: 'Gauge, tension and lifespan',
      items: [
        { label: 'Gauge', body: 'Thicker strings usually last longer; thinner strings can feel livelier and more responsive.' },
        { label: 'Tension', body: 'Lower tension usually adds power and comfort. Higher tension usually adds control but can feel firmer.' },
        { label: 'When it dies', body: 'Poly can lose playability before it breaks, so feel matters as much as breakage.' },
      ],
    },
  ],
  Grips: [
    {
      eyebrow: 'Feel',
      title: 'Tack, sweat and bevel feel',
      items: [
        { label: 'Tacky grip', body: 'Good if you want a sticky, secure feel in normal conditions.' },
        { label: 'Absorbent grip', body: 'Better if your hands sweat heavily or the grip gets slippery quickly.' },
        { label: 'Bevel feel', body: 'Thinner grips make bevels clearer; cushioned grips feel softer but less direct.' },
      ],
    },
    {
      eyebrow: 'Sizing',
      title: 'Grip size and replacement',
      items: [
        { label: 'Overgrip vs replacement grip', body: 'An overgrip goes over the base grip. A replacement grip changes the base feel and thickness.' },
        { label: 'Build-up', body: 'Extra overgrips or grip build-up can increase handle size, but too much can round the bevels.' },
        { label: 'When to change', body: 'Replace when it loses tack, gets slippery, tears, or feels compressed.' },
      ],
    },
  ],
  Accessories: [
    {
      eyebrow: 'Use case',
      title: 'Does it solve a real problem?',
      items: [
        { label: 'Problem solved', body: 'A good accessory should clearly help grip, protection, organisation, comfort or court routine.' },
        { label: 'Compatibility', body: 'Check whether it fits your racket, bag, strings, shoes or playing routine before buying.' },
        { label: 'Durability', body: 'Cheap accessories are only good value if they survive regular use.' },
      ],
    },
    {
      eyebrow: 'Value',
      title: 'When it is worth buying',
      items: [
        { label: 'Worth it', body: 'Worth buying if it removes friction from something you do every time you play.' },
        { label: 'Skip it', body: 'Skip it if it only looks useful but does not change your setup, comfort or preparation.' },
        { label: 'Best buyer', body: 'Most useful for regular players who already know what small problems keep repeating.' },
      ],
    },
  ],
}


type CategoryConfig = {
  label: string
  specs: string[][]
  technologies: { title: string; body: string }[]
  feel: string
  recommendedFor: string[]
  lessIdealFor: string[]
  colourways?: Colourway[]
  finalIntro: string
}

const categoryConfig: Record<string, CategoryConfig> = {
  Rackets: {
    label: 'racket',
    specs: reviewedSpecs,
    technologies: technologyNotes,
    feel: 'In my opinion, the TFight 305 ISOFLEX feels manoeuvrable, solid and very connected. Forehands and volleys have a lot of feel, and the frame gives you the sense that the ball is sitting on the strings long enough for you to shape it. The balance does not feel heavily in the handle; it feels closer to even or slightly head-heavy, which is part of why it works so well for a one-handed backhand. You can drop the racket head easily, generate spin, and rip up the back of the ball without the frame feeling unstable.',
    recommendedFor,
    lessIdealFor,
    finalIntro: 'This is strictly my opinion from using and interpreting the racket. I would describe the TFight 305 ISOFLEX as a control and feel racket with serious stability when you hit the sweet spot. It is not the easiest racket for everyone, and the sweet spot does feel small, but when you are timing the ball well it becomes one of those frames where you feel like you can do almost anything with the shot.',
  },
  Shoes: {
    label: 'shoe',
    specs: shoeSpecs,
    technologies: shoeTechnologyNotes,
    feel: 'In my opinion, this shoe feels secure, stable and built for hard-court movement. It is not trying to be the lightest shoe on court. The main feeling is support: your foot feels held when you push wide, recover, and change direction. That makes it a good option for players who value confidence in movement over a super-light speed feel.',
    recommendedFor: shoeRecommendedFor,
    lessIdealFor: shoeLessIdealFor,
    finalIntro: 'This is strictly my view based on how I would interpret the shoe for a tennis player choosing equipment. I would put it in the stability-first category rather than calling it a pure speed shoe. It suits players who want support, grip and durability from their footwear.',
  },
  Strings: {
    label: 'string',
    specs: [
      ['Product type', 'Tennis string'],
      ['Main category', 'Poly / multi / gut / synthetic gut'],
      ['Main decision', 'Power, control, spin, comfort or durability'],
      ['Key variables', 'Material, gauge and tension'],
      ['Best checked with', 'Your racket, swing speed and arm comfort'],
      ['Typical mistake', 'Choosing too stiff or too high tension'],
    ],
    technologies: [
      { title: 'Material', body: 'The string material usually matters more than the marketing name. Poly, multifilament, gut and synthetic gut all behave differently.' },
      { title: 'Gauge', body: 'Gauge changes feel, durability and response. Thicker strings usually last longer; thinner strings can feel livelier.' },
      { title: 'Tension behaviour', body: 'Some strings hold tension better than others. Polyester can lose playability before it actually breaks.' },
    ],
    feel: 'In my opinion, strings should be reviewed by what they do to the whole racket, not in isolation. The same string can feel controlled in one frame and too firm in another. I would judge a string by launch angle, comfort, tension hold, spin access, and whether it still feels good after the first few sessions.',
    recommendedFor: ['Players matching the string to a clear goal', 'Players who know whether they need comfort, control, power or durability', 'String breakers considering polyester or hybrids', 'Players with arm concerns looking at multifilament, gut or softer hybrids'],
    lessIdealFor: ['Players choosing purely because a professional uses it', 'Beginners using stiff poly at high tension without a reason', 'Players ignoring arm comfort', 'Players who never restring even after the string feels dead'],
    finalIntro: 'This is strictly my view based on how I would interpret the string for real club players. I care less about hype and more about whether the string solves a specific problem in the racket.',
  },
  Grips: {
    label: 'grip',
    specs: [
      ['Product type', 'Overgrip / replacement grip'],
      ['Main feel', 'Tacky, dry, absorbent or cushioned'],
      ['Changes grip size?', 'Sometimes, depending on thickness'],
      ['Best for', 'Sweat control, comfort, bevel feel or security'],
      ['Replacement timing', 'When slippery, worn or compressed'],
      ['Typical mistake', 'Using old grips too long'],
    ],
    technologies: [
      { title: 'Surface finish', body: 'The finish decides whether the grip feels tacky, dry, smooth or absorbent.' },
      { title: 'Thickness', body: 'Thickness changes handle size, cushioning and how clearly you feel the bevels.' },
      { title: 'Moisture handling', body: 'Sweaty hands usually need absorbency more than stickiness.' },
    ],
    feel: 'In my opinion, grips are underrated because they are the only part of the racket you actually hold. A good grip should make the racket feel secure without making the handle feel vague. If your grip gets slippery, too rounded, or too compressed, your timing and confidence can suffer.',
    recommendedFor: ['Players who want better racket security', 'Players with sweaty hands', 'Players trying to fine-tune grip size', 'Players who want clearer or softer handle feel'],
    lessIdealFor: ['Players who never replace worn grips', 'Players adding too many layers and losing bevel feel', 'Players choosing tacky grips when they actually need absorbency', 'Players ignoring grip size completely'],
    finalIntro: 'This is strictly my view based on how I would judge a grip for everyday tennis use. The best grip is the one that keeps the racket secure and comfortable for your hand.',
  },
  Accessories: {
    label: 'accessory',
    specs: [
      ['Product type', 'Tennis accessory'],
      ['Main purpose', 'Convenience, protection, comfort or setup'],
      ['Compatibility', 'Must fit your racket, bag or routine'],
      ['Value check', 'Should solve a repeated problem'],
      ['Durability check', 'Needs to survive regular use'],
      ['Typical mistake', 'Buying something useful-looking but unnecessary'],
    ],
    technologies: [
      { title: 'Design purpose', body: 'A useful accessory should make one tennis task easier, cleaner, safer or more repeatable.' },
      { title: 'Compatibility', body: 'Compatibility matters more than features. If it does not fit your setup, it is not useful.' },
      { title: 'Build quality', body: 'Small accessories are only good value if they last through regular court use.' },
    ],
    feel: 'In my opinion, accessories should be judged by whether they solve a real problem. If something helps you prepare, protect your gear, manage sweat, organise your bag or maintain your racket, it can be worth it. If it just adds clutter, skip it.',
    recommendedFor: ['Players solving a specific recurring problem', 'Regular players who want a cleaner routine', 'Players who maintain their own gear', 'Players who value convenience and preparation'],
    lessIdealFor: ['Players buying accessories before fixing basic gear choices', 'Players who do not need the specific function', 'Players choosing novelty over usefulness', 'Players who want one product to solve everything'],
    finalIntro: 'This is strictly my view based on whether the accessory earns its place in a tennis bag. I would only recommend it if it has a clear job.',
  },
}

const reviewConfigOverrides: Record<string, CategoryConfig> = {
  'lacoste-ag-lt23-review': {
    label: 'shoe',
    specs: [
      ['Model reviewed', 'Lacoste AG-LT23'],
      ['Court type', 'All-court / clay version available'],
      ['Grass version', 'No grass-court model'],
      ['Fit feel', 'Secure and narrow-foot friendly'],
      ['Weight feel', 'Light on foot'],
      ['Best for', 'Players who want comfort, court feel and support'],
      ['Main trade-off', 'Durability'],
    ],
    technologies: [
      {
        title: 'Midfoot support',
        body: 'The middle support gives the shoe a stable platform from the back and through direction changes. It does not feel bulky, but the foot still feels held.',
      },
      {
        title: 'Heel padding',
        body: 'The heel area feels very comfortable and padded. That is a big part of why the shoe feels secure rather than harsh.',
      },
      {
        title: 'Lace protection',
        body: 'The laces are protected by small material guards, which helps stop them getting shredded when sliding.',
      },
      {
        title: 'Low front court feel',
        body: 'The front of the shoe feels quite shallow and close to the court, so you get good feedback from the surface rather than feeling disconnected.',
      },
    ],
    feel: 'In my opinion, the Lacoste AG-LT23 is one of the most comfortable tennis shoes I have worn. It feels light on the foot, breathable, secure, and very all-court. The heel padding gives comfort, the midfoot support gives stability, and the lower front of the shoe helps you feel the court. For my feet, which are narrow, the fit feels especially good.',
    recommendedFor: [
      'Players with narrow feet who want a secure fit',
      'Players who like a light, breathable shoe',
      'All-court players who want comfort without losing court feel',
      'Clay-court players who want a good clay tread pattern',
      'Players who want heel comfort and midfoot support',
    ],
    lessIdealFor: [
      'Players who destroy outsoles quickly',
      'Players who need maximum durability above everything else',
      'Players looking for a grass-court specific shoe',
      'Wide-footed players unless they try the fit first',
    ],
    colourways: [
      { name: 'White / Navy', image: '/images/reviews/lacoste-ag-lt23.jpeg' },
      { name: 'White / Green', image: '/images/reviews/lacoste-ag-lt23.jpeg' },
      { name: 'White / Black', image: '/images/reviews/lacoste-ag-lt23.jpeg' },
      { name: 'Navy / White', image: '/images/reviews/lacoste-ag-lt23.jpeg' },
      { name: 'Black / White', image: '/images/reviews/lacoste-ag-lt23.jpeg' },
      { name: 'Clay White / Red', image: '/images/reviews/lacoste-ag-lt23.jpeg' },
      { name: 'Seasonal Blue', image: '/images/reviews/lacoste-ag-lt23.jpeg' },
      { name: 'Seasonal Green', image: '/images/reviews/lacoste-ag-lt23.jpeg' },
    ],
    finalIntro: 'This is strictly my opinion from wearing the shoe. I think the Lacoste AG-LT23 feels excellent on foot: light, secure, breathable and very comfortable. The problem is durability. The outsole and grip wear too quickly, especially with sliding, so the shoe feels better than it lasts.',
  },
}

const reviewSectionOverrides: typeof categorySections = {
  'lacoste-ag-lt23-review': [
    {
      eyebrow: 'Fit and comfort',
      title: 'Light, secure and narrow-foot friendly',
      items: [
        { label: 'Foot shape', body: 'The fit feels best for narrow feet. It holds the foot securely without making the foot feel inflated or trapped.' },
        { label: 'Heel comfort', body: 'The padding around the heel is one of the best parts of the shoe. It makes the shoe feel comfortable straight away.' },
        { label: 'Breathability', body: 'The shoe feels breathable. Your foot does not feel swollen or inflated inside it, which helps over longer sessions.' },
      ],
    },
    {
      eyebrow: 'Court feel',
      title: 'All-court stability and surface feel',
      items: [
        { label: 'All-court feel', body: 'It feels very all-court: light enough to move easily, but still supported through the middle of the shoe.' },
        { label: 'Shallow front', body: 'The front feels low and close to the court, which gives good court feedback and helps you feel connected when moving.' },
        { label: 'Clay version', body: 'The clay-court version has a good pattern for clay and gives strong bite at first.' },
      ],
    },
    {
      eyebrow: 'Durability',
      title: 'The big weakness',
      items: [
        { label: 'Outsole wear', body: 'Durability is the main issue. The outside wears quickly from sliding and the grip goes faster than it should.' },
        { label: 'Clay grip life', body: 'Even though the clay tread pattern is good, the durability still lets it down if you slide often.' },
        { label: 'Lace protection', body: 'The lace protection is a good detail. The small material guards help stop the laces breaking from sliding.' },
      ],
    },
    {
      eyebrow: 'Range',
      title: 'Colourways and court models',
      items: [
        { label: 'Colourways', body: 'Colourways change by season and retailer, so the review page should show the main colour options available at the time of writing.' },
        { label: 'Clay model', body: 'There is a clay-court model, and the tread pattern works well for clay movement.' },
        { label: 'No grass model', body: 'There is no grass-court model, so players needing a proper grass outsole should look elsewhere.' },
      ],
    },
  ],
}

interface AffiliateLink {
  retailer?: string
  price?: string
  url?: string
}

interface Colourway {
  name?: string
  image?: string
  links?: AffiliateLink[]
}

interface DisplayColourway {
  name: string
  image: string
  links: AffiliateLink[]
}

interface GalleryItem {
  type?: 'image' | 'video'
  label?: string
  url?: string
}

function getAffiliateLinks(value: unknown, fallbackUrl: string | null): AffiliateLink[] {
  const links = Array.isArray(value)
    ? value.filter((item): item is AffiliateLink => typeof item === 'object' && item !== null && 'url' in item)
    : []

  if (links.length > 0) return links.filter((link) => Boolean(link.url))
  if (fallbackUrl) return [{ retailer: 'Retailer', price: 'Check current price', url: fallbackUrl }]
  return []
}

function getColourways(value: unknown, fallback: Colourway[] | undefined): DisplayColourway[] | undefined {
  if (Array.isArray(value)) {
    return value
      .filter((item): item is Colourway => typeof item === 'object' && item !== null)
      .filter((colourway) => Boolean(colourway.name) && Boolean(colourway.image))
      .map((colourway) => ({
        name: colourway.name!,
        image: colourway.image!,
        links: Array.isArray(colourway.links)
          ? colourway.links.filter((link) => Boolean(link.url))
          : [],
      }))
  }

  return fallback
    ?.filter((colourway) => Boolean(colourway.name) && Boolean(colourway.image))
    .map((colourway) => ({
      name: colourway.name!,
      image: colourway.image!,
      links: Array.isArray(colourway.links) ? colourway.links.filter((link) => Boolean(link.url)) : [],
    }))
}

function getGallery(value: unknown): Required<GalleryItem>[] {
  if (!Array.isArray(value)) return []

  return value
    .filter((item): item is GalleryItem => typeof item === 'object' && item !== null)
    .filter((item) => Boolean(item.url))
    .map((item) => ({
      type: item.type === 'video' ? 'video' : 'image',
      label: item.label ?? '',
      url: item.url!,
    }))
}

function hasHtmlContent(value: string | null | undefined) {
  if (!value) return false
  const plainText = value.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, '').trim()
  return plainText.length > 0
}

async function getReview(slug: string) {
  try {
    return await prisma.reviewArticle.findUnique({
      where: { slug, published: true },
    })
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const review = await getReview(slug)
  if (!review) return { title: 'Review not found' }
  return { title: review.title, description: review.excerpt }
}

export default async function ReviewPage({ params }: PageProps) {
  const { slug } = await params
  const review = await getReview(slug)
  if (!review) notFound()
  const affiliateLinks = getAffiliateLinks(review.affiliateLinks, review.affiliateUrl)
  const config = reviewConfigOverrides[review.slug] ?? categoryConfig[review.category] ?? categoryConfig.Accessories
  const specs = config.specs
  const technologies = config.technologies
  const goodFit = config.recommendedFor
  const lessFit = config.lessIdealFor
  const extraSections = reviewSectionOverrides[review.slug] ?? categorySections[review.category] ?? categorySections.Accessories
  const colourways = getColourways(review.colourways, config.colourways)
  const gallery = getGallery(review.gallery)

  return (
    <div className="bg-gray-50">
      <section className="bg-navy-gradient text-white py-14">
        <div className="container-lg">
          <Link href="/reviews" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="lime">{review.category}</Badge>
                <span className="text-sm text-gray-400">{review.brand}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold mb-5 leading-tight">{review.title}</h1>
              <p className="text-lg text-gray-300 leading-relaxed">{review.excerpt}</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white p-5">
              {review.coverImage ? (
                <img src={review.coverImage} alt={review.productName} className="w-full aspect-[4/3] object-contain" />
              ) : (
                <div className="aspect-[4/3] flex items-center justify-center text-sm font-semibold text-gray-400 uppercase">
                  {review.category}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-lg">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <main className="lg:col-span-2 space-y-6">
              <Card>
                <p className="text-xs font-semibold uppercase tracking-wider text-lime-600 mb-2">Reviewed {config.label}</p>
                <h2 className="text-2xl font-serif font-bold text-navy-900 mb-5">Specifications</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {specs.map(([label, value]) => (
                    <div key={label} className="flex justify-between gap-4 rounded-lg border border-gray-100 bg-white px-4 py-3">
                      <span className="text-sm text-gray-500">{label}</span>
                      <span className="text-sm font-semibold text-navy-900 text-right">{value}</span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card>
                <p className="text-xs font-semibold uppercase tracking-wider text-lime-600 mb-2">Technology</p>
                <h2 className="text-2xl font-serif font-bold text-navy-900 mb-5">What is special about it?</h2>
                <div className="space-y-4">
                  {technologies.map((item) => (
                    <div key={item.title}>
                      <h3 className="font-semibold text-navy-900">{item.title}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed mt-1">{item.body}</p>
                    </div>
                  ))}
                </div>
              </Card>

              <Card>
                <p className="text-xs font-semibold uppercase tracking-wider text-lime-600 mb-2">Feel</p>
                <h2 className="text-2xl font-serif font-bold text-navy-900 mb-4">How it feels on court</h2>
                <p className="text-gray-700 leading-relaxed">
                  {config.feel}
                </p>
              </Card>

              {hasHtmlContent(review.content) && (
                <Card>
                  <p className="text-xs font-semibold uppercase tracking-wider text-lime-600 mb-2">Review notes</p>
                  <h2 className="text-2xl font-serif font-bold text-navy-900 mb-4">Personal review notes</h2>
                  <div
                    className="prose-content text-gray-700"
                    dangerouslySetInnerHTML={{ __html: review.content }}
                  />
                </Card>
              )}

              {(review.mainBenefit || review.mainDownside || review.whoIsItFor || review.whoIsItNotFor) && (
                <Card>
                  <p className="text-xs font-semibold uppercase tracking-wider text-lime-600 mb-2">Admin verdict fields</p>
                  <h2 className="text-2xl font-serif font-bold text-navy-900 mb-5">Quick take</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {review.mainBenefit && (
                      <div className="rounded-lg border border-gray-100 bg-white px-4 py-3">
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">Main benefit</p>
                        <p className="text-sm text-gray-700">{review.mainBenefit}</p>
                      </div>
                    )}
                    {review.mainDownside && (
                      <div className="rounded-lg border border-gray-100 bg-white px-4 py-3">
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">Main downside</p>
                        <p className="text-sm text-gray-700">{review.mainDownside}</p>
                      </div>
                    )}
                    {review.whoIsItFor && (
                      <div className="rounded-lg border border-gray-100 bg-white px-4 py-3">
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">Who it is for</p>
                        <p className="text-sm text-gray-700">{review.whoIsItFor}</p>
                      </div>
                    )}
                    {review.whoIsItNotFor && (
                      <div className="rounded-lg border border-gray-100 bg-white px-4 py-3">
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">Who it is not for</p>
                        <p className="text-sm text-gray-700">{review.whoIsItNotFor}</p>
                      </div>
                    )}
                  </div>
                </Card>
              )}

              <Card>
                <p className="text-xs font-semibold uppercase tracking-wider text-lime-600 mb-2">Player fit</p>
                <h2 className="text-2xl font-serif font-bold text-navy-900 mb-5">Who I would recommend it for</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <h3 className="font-semibold text-navy-900 mb-3">Good fit</h3>
                    <ul className="space-y-2">
                      {goodFit.map((item) => (
                        <li key={item} className="flex gap-2 text-sm text-gray-700">
                          <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-navy-900 mb-3">Less ideal</h3>
                    <ul className="space-y-2">
                      {lessFit.map((item) => (
                        <li key={item} className="text-sm text-gray-600">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>

              {extraSections.map((section) => (
                <Card key={section.title}>
                  <p className="text-xs font-semibold uppercase tracking-wider text-lime-600 mb-2">{section.eyebrow}</p>
                  <h2 className="text-2xl font-serif font-bold text-navy-900 mb-5">{section.title}</h2>
                  <div className="space-y-4">
                    {section.items.map((item) => (
                      <div key={item.label} className="rounded-lg border border-gray-100 bg-white px-4 py-3">
                        <h3 className="font-semibold text-navy-900">{item.label}</h3>
                        <p className="text-sm text-gray-600 leading-relaxed mt-1">{item.body}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}

              <Card>
                <p className="text-xs font-semibold uppercase tracking-wider text-lime-600 mb-2">Opinion</p>
                <h2 className="text-2xl font-serif font-bold text-navy-900 mb-4">Final thoughts</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {config.finalIntro}
                </p>
                {review.verdict && (
                  <p className="text-gray-700 leading-relaxed">{review.verdict}</p>
                )}
              </Card>

              {colourways && colourways.length > 0 && (
                <Card>
                  <p className="text-xs font-semibold uppercase tracking-wider text-lime-600 mb-2">Range</p>
                  <h2 className="text-2xl font-serif font-bold text-navy-900 mb-5">Colourways in this model</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {colourways.map((colourway) => (
                      <div key={colourway.name} className="group rounded-2xl border border-gray-100 bg-white overflow-hidden hover:border-lime-200 hover:shadow-md transition-all duration-300">
                        <div className="aspect-square bg-gray-50 flex items-center justify-center p-4">
                          <img
                            src={colourway.image}
                            alt={`${review.productName} ${colourway.name}`}
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="border-t border-gray-100 px-3 py-3">
                          <p className="text-sm font-semibold text-navy-900 text-center">{colourway.name}</p>
                          {colourway.links && colourway.links.length > 0 ? (
                            <div className="mt-3 space-y-2">
                              {colourway.links.map((link, index) => (
                                <a
                                  key={`${link.url}-${index}`}
                                  href={link.url}
                                  target="_blank"
                                  rel="noopener noreferrer sponsored"
                                  className="flex items-center justify-between gap-3 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-xs font-semibold text-navy-900 hover:border-lime-300 hover:bg-lime-50/40 transition-colors"
                                >
                                  <span>{link.retailer || 'Retailer'}</span>
                                  <span className="inline-flex items-center gap-1 text-lime-700">
                                    {link.price || 'Check availability'} <ExternalLink className="w-3 h-3" />
                                  </span>
                                </a>
                              ))}
                            </div>
                          ) : (
                            <p className="mt-2 text-center text-xs text-gray-400">
                              No colour-specific links added.
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 text-xs text-gray-500">
                    Colourways, sizes and stock change regularly by retailer. Use colour-specific links where possible, then check your size before buying.
                  </p>
                </Card>
              )}

              {gallery.length > 0 && (
                <Card>
                  <p className="text-xs font-semibold uppercase tracking-wider text-lime-600 mb-2">Gallery</p>
                  <h2 className="text-2xl font-serif font-bold text-navy-900 mb-5">Product gallery</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {gallery.map((item, index) => (
                      <figure key={`${item.url}-${index}`} className="rounded-2xl border border-gray-100 bg-white overflow-hidden">
                        <div className="aspect-video bg-gray-50 flex items-center justify-center">
                          {item.type === 'video' ? (
                            <video
                              src={item.url}
                              controls
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <img
                              src={item.url}
                              alt={item.label || `${review.productName} gallery image ${index + 1}`}
                              className="w-full h-full object-contain p-3"
                            />
                          )}
                        </div>
                        {item.label && (
                          <figcaption className="border-t border-gray-100 px-4 py-3 text-sm font-semibold text-navy-900">
                            {item.label}
                          </figcaption>
                        )}
                      </figure>
                    ))}
                  </div>
                </Card>
              )}

              <Disclaimer type="affiliate" />
            </main>

            <aside className="lg:col-span-1">
              <div className="sticky top-24 space-y-5">
                {affiliateLinks.length > 0 && (
                  <Card>
                    <p className="text-sm font-semibold text-navy-900 mb-2">Check prices</p>
                    <p className="text-xs text-gray-400 mb-4">
                      Affiliate links. Prices are guide prices and may change.
                    </p>
                    <div className="space-y-3">
                      {affiliateLinks.map((link, index) => (
                        <a
                          key={`${link.url}-${index}`}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer sponsored"
                          className="block rounded-xl border border-gray-100 bg-white p-3 hover:border-lime-300 hover:bg-lime-50/30 transition-colors"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold text-navy-900">{link.retailer || 'Retailer'}</p>
                              <p className="text-xs text-gray-400">{link.price || 'Check current price'}</p>
                            </div>
                            <ExternalLink className="w-4 h-4 text-lime-600 flex-shrink-0" />
                          </div>
                        </a>
                      ))}
                    </div>
                  </Card>
                )}

                <Card className="bg-gray-50">
                  <p className="text-sm font-semibold text-navy-900 mb-3">Related guides</p>
                  <div className="space-y-2">
                    {review.category === 'Shoes' ? (
                      <Link href="/learn/how-to-choose-tennis-shoes" className="flex items-center gap-2 text-sm text-lime-600 hover:text-lime-700">
                        <ArrowRight className="w-3 h-3" />
                        How to choose tennis shoes
                      </Link>
                    ) : review.category === 'Rackets' ? (
                      <>
                        <Link href="/playbooks/racket-buying" className="flex items-center gap-2 text-sm text-lime-600 hover:text-lime-700">
                          <ArrowRight className="w-3 h-3" />
                          Racket Buying Playbook
                        </Link>
                        <Link href="/playbooks/string-setup" className="flex items-center gap-2 text-sm text-lime-600 hover:text-lime-700">
                          <ArrowRight className="w-3 h-3" />
                          String Setup Playbook
                        </Link>
                      </>
                    ) : review.category === 'Strings' ? (
                      <Link href="/playbooks/string-setup" className="flex items-center gap-2 text-sm text-lime-600 hover:text-lime-700">
                        <ArrowRight className="w-3 h-3" />
                        String Setup Playbook
                      </Link>
                    ) : review.category === 'Grips' ? (
                      <Link href="/playbooks/grip-guide" className="flex items-center gap-2 text-sm text-lime-600 hover:text-lime-700">
                        <ArrowRight className="w-3 h-3" />
                        Grip Guide
                      </Link>
                    ) : (
                      <Link href="/learn" className="flex items-center gap-2 text-sm text-lime-600 hover:text-lime-700">
                        <ArrowRight className="w-3 h-3" />
                        Learn articles
                      </Link>
                    )}
                    <Link href="/stringing" className="flex items-center gap-2 text-sm text-lime-600 hover:text-lime-700">
                      <ArrowRight className="w-3 h-3" />
                      Book stringing
                    </Link>
                    <Link href="/reviews" className="flex items-center gap-2 text-sm text-lime-600 hover:text-lime-700">
                      <ArrowRight className="w-3 h-3" />
                      More reviews
                    </Link>
                  </div>
                </Card>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  )
}
