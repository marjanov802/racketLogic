import type { Metadata } from 'next'
import Link from 'next/link'
import { Star, ArrowRight, Filter } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { Disclaimer } from '@/components/ui/Disclaimer'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = {
  title: 'Gear Reviews',
  description:
    'Honest tennis gear reviews. Rackets, strings, shoes, grips and accessories reviewed with clear verdicts.',
}

const categories = ['All', 'Rackets', 'Strings', 'Shoes', 'Grips', 'Accessories']

async function getReviews() {
  try {
    return await prisma.reviewArticle.findMany({
      where: { published: true },
      orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
    })
  } catch {
    return []
  }
}

function StarRating({ rating }: { rating: number | null | undefined }) {
  if (!rating) return null
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${i < Math.round(rating / 2) ? 'fill-lime-500 text-lime-500' : 'text-gray-300'}`}
        />
      ))}
      <span className="text-xs text-gray-500 ml-1">{rating}/10</span>
    </div>
  )
}

export default async function ReviewsPage() {
  const reviews = await getReviews()

  return (
    <>
      {/* Hero */}
      <section className="bg-navy-gradient text-white py-20">
        <div className="container-lg">
          <Badge variant="lime" className="mb-5 text-xs font-semibold uppercase tracking-widest">
            Gear Reviews
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-5 max-w-2xl">
            Honest gear reviews.
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl leading-relaxed">
            Rackets, strings, shoes, grips and accessories reviewed clearly and honestly.
            Clear verdicts. No sponsored opinions. Affiliate links clearly marked.
          </p>
        </div>
      </section>

      {/* Category filter */}
      <section className="py-6 border-b border-gray-100 bg-white sticky top-16 z-10">
        <div className="container-lg">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
            {categories.map((cat) => (
              <Link
                key={cat}
                href={cat === 'All' ? '/reviews' : `/reviews?category=${cat.toLowerCase()}`}
                className="flex-shrink-0 px-4 py-1.5 rounded-full border border-gray-200 text-sm text-gray-600 hover:border-lime-400 hover:text-lime-600 hover:bg-lime-50 transition-colors"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews grid */}
      <section className="section-padding">
        <div className="container-lg">
          {reviews.length === 0 ? (
            <div>
              {/* Placeholder cards for categories */}
              <div className="mb-10">
                <h2 className="text-xl font-bold text-navy-900 mb-6">Review categories</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { name: 'Rackets', emoji: '🎾', desc: 'Player, control, power and beginner rackets reviewed.' },
                    { name: 'Strings', emoji: '🪡', desc: 'Poly, multifilament, synthetic gut and hybrid string reviews.' },
                    { name: 'Shoes', emoji: '👟', desc: 'Hard court, clay and all-court shoes reviewed for different playing styles.' },
                    { name: 'Grips', emoji: '🖐️', desc: 'Overgrips and replacement grips reviewed for different hand types.' },
                  ].map((cat) => (
                    <Card key={cat.name} className="text-center">
                      <div className="text-4xl mb-3">{cat.emoji}</div>
                      <h3 className="font-bold text-navy-900 mb-2">{cat.name}</h3>
                      <p className="text-sm text-gray-600">{cat.desc}</p>
                      <Badge variant="gray" className="mt-3">Reviews coming soon</Badge>
                    </Card>
                  ))}
                </div>
              </div>
              <div className="text-center py-8 text-gray-500">
                <p className="mb-2">Detailed reviews are being published. Check back soon.</p>
                <p className="text-sm">
                  In the meantime, read the{' '}
                  <Link href="/playbooks/racket-buying" className="text-lime-600 hover:underline">Racket Buying Playbook</Link>
                  {' '}or the{' '}
                  <Link href="/playbooks/string-setup" className="text-lime-600 hover:underline">String Setup Playbook</Link>.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((review) => (
                <Link key={review.id} href={`/reviews/${review.slug}`}>
                  <Card hover className="h-full flex flex-col">
                    {review.coverImage ? (
                      <img
                        src={review.coverImage}
                        alt={review.productName}
                        className="w-full aspect-video object-cover rounded-xl mb-4"
                      />
                    ) : (
                      <div className="aspect-video bg-gray-100 rounded-xl mb-4 flex items-center justify-center text-3xl">
                        {review.category === 'Rackets' ? '🎾' : review.category === 'Strings' ? '🪡' : review.category === 'Shoes' ? '👟' : '🖐️'}
                      </div>
                    )}
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="gray">{review.category}</Badge>
                      {review.featured && <Badge variant="lime">Featured</Badge>}
                    </div>
                    <p className="text-xs text-gray-400 mb-1">{review.brand}</p>
                    <h3 className="font-bold text-navy-900 mb-2 flex-1">{review.title}</h3>
                    <p className="text-sm text-gray-600 mb-4 leading-relaxed line-clamp-2">{review.excerpt}</p>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <StarRating rating={review.rating} />
                      <span className="text-xs font-semibold text-lime-600 flex items-center gap-1">
                        Read review <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="container-lg pb-12">
        <Disclaimer type="affiliate" />
      </div>
    </>
  )
}
