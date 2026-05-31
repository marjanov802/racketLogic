import type { Metadata } from 'next'
import Link from 'next/link'
import { Filter } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { Disclaimer } from '@/components/ui/Disclaimer'
import { ReviewFilters } from '@/components/reviews/ReviewFilters'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = {
  title: 'Blog & Gear Reviews',
  description:
    'Tennis gear reviews and practical buying advice. Rackets, strings, shoes, grips and accessories reviewed with clear verdicts.',
}

const placeholderCategories = [
  { name: 'Rackets', label: 'Frame reviews', desc: 'Control, power and player frames reviewed by setup and player type.' },
  { name: 'Strings', label: 'String tests', desc: 'Poly, multifilament, synthetic gut and hybrid strings explained clearly.' },
  { name: 'Shoes', label: 'Court footwear', desc: 'Hard court, clay and all-court shoes reviewed for movement and durability.' },
  { name: 'Grips', label: 'Grip setup', desc: 'Overgrips and replacement grips reviewed for feel, sweat and sizing.' },
]

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

export default async function ReviewsPage() {
  const reviews = await getReviews()

  return (
    <>
      <section className="bg-navy-gradient text-white py-20">
        <div className="container-lg">
          <Badge variant="lime" className="mb-5 text-xs font-semibold uppercase tracking-widest">
            Blog & Reviews
          </Badge>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-5 max-w-2xl">
            Personal tennis reviews from real product experience.
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl leading-relaxed">
            Rackets, strings, shoes, grips and accessories reviewed through my own opinion,
            setup thinking and on-court experience with the product.
          </p>
        </div>
      </section>

      <section className="py-6 border-b border-gray-100 bg-white">
        <div className="container-lg">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
            Search by product name, brand or review category.
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-lg">
          {reviews.length === 0 ? (
            <div>
              <div className="mb-10">
                <h2 className="text-xl font-bold text-navy-900 mb-6">Review categories</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {placeholderCategories.map((cat) => (
                    <Card key={cat.name} className="text-center">
                      <p className="text-xs font-semibold uppercase tracking-wider text-lime-600 mb-3">{cat.label}</p>
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
            <ReviewFilters reviews={reviews.map((review) => ({
              id: review.id,
              title: review.title,
              slug: review.slug,
              category: review.category,
              productName: review.productName,
              brand: review.brand,
              excerpt: review.excerpt,
              coverImage: review.coverImage,
              featured: review.featured,
            }))} />
          )}
        </div>
      </section>

      <div className="container-lg pb-12">
        <Disclaimer type="affiliate" />
      </div>
    </>
  )
}
