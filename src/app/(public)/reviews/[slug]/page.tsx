import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Star, ArrowLeft, ArrowRight, ExternalLink, Check, X } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Disclaimer } from '@/components/ui/Disclaimer'
import { prisma } from '@/lib/prisma'

interface PageProps {
  params: Promise<{ slug: string }>
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

function StarRating({ rating }: { rating: number | null | undefined }) {
  if (!rating) return null
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className={`w-3 h-3 rounded-sm ${i < rating ? 'bg-lime-500' : 'bg-gray-200'}`} />
      ))}
      <span className="text-sm font-bold text-navy-900 ml-2">{rating}/10</span>
    </div>
  )
}

export default async function ReviewPage({ params }: PageProps) {
  const { slug } = await params
  const review = await getReview(slug)
  if (!review) notFound()

  return (
    <div className="section-padding">
      <div className="container-lg">
        <Link href="/reviews" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-navy-900 mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Reviews
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main */}
          <div className="lg:col-span-2">
            {review.coverImage ? (
              <img src={review.coverImage} alt={review.productName} className="w-full rounded-2xl mb-8 aspect-video object-cover" />
            ) : (
              <div className="w-full rounded-2xl mb-8 aspect-video bg-gray-100 flex items-center justify-center text-6xl">
                {review.category === 'Rackets' ? '🎾' : review.category === 'Strings' ? '🪡' : review.category === 'Shoes' ? '👟' : '🖐️'}
              </div>
            )}

            <div className="flex items-center gap-2 mb-4">
              <Badge variant="gray">{review.category}</Badge>
              <span className="text-sm text-gray-400">{review.brand}</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-navy-900 mb-3">{review.title}</h1>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">{review.excerpt}</p>

            {/* Quick verdict cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {review.whoIsItFor && (
                <Card className="border-green-200 bg-green-50">
                  <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-2">Who it&apos;s for</p>
                  <p className="text-sm text-gray-700">{review.whoIsItFor}</p>
                </Card>
              )}
              {review.whoIsItNotFor && (
                <Card className="border-red-100 bg-red-50">
                  <p className="text-xs font-semibold text-red-600 uppercase tracking-wide mb-2">Who it&apos;s not for</p>
                  <p className="text-sm text-gray-700">{review.whoIsItNotFor}</p>
                </Card>
              )}
              {review.mainBenefit && (
                <Card>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-gray-500 mb-1">Main benefit</p>
                      <p className="text-sm text-gray-700">{review.mainBenefit}</p>
                    </div>
                  </div>
                </Card>
              )}
              {review.mainDownside && (
                <Card>
                  <div className="flex items-start gap-2">
                    <X className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-gray-500 mb-1">Main downside</p>
                      <p className="text-sm text-gray-700">{review.mainDownside}</p>
                    </div>
                  </div>
                </Card>
              )}
            </div>

            {/* Article content */}
            <div
              className="prose-content"
              dangerouslySetInnerHTML={{ __html: review.content }}
            />

            {/* Verdict */}
            {review.verdict && (
              <div className="mt-8 bg-navy-gradient text-white rounded-2xl p-6">
                <p className="text-xs font-semibold text-lime-400 uppercase tracking-wide mb-2">RacketLogic Verdict</p>
                <p className="text-gray-200 leading-relaxed">{review.verdict}</p>
              </div>
            )}

            <Disclaimer type="affiliate" className="mt-8" />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-5">
              {/* Rating */}
              <Card>
                <p className="text-sm font-semibold text-gray-500 mb-3">RacketLogic Rating</p>
                <StarRating rating={review.rating} />
              </Card>

              {/* Affiliate link */}
              {review.affiliateUrl && (
                <Card>
                  <p className="text-sm font-semibold text-navy-900 mb-3">Buy this product</p>
                  <a href={review.affiliateUrl} target="_blank" rel="noopener noreferrer sponsored">
                    <Button className="w-full">
                      <ExternalLink className="w-4 h-4" />
                      View on retailer
                    </Button>
                  </a>
                  <p className="text-xs text-gray-400 mt-2">
                    Affiliate link. RacketLogic may earn commission at no extra cost to you.
                  </p>
                </Card>
              )}

              {/* Related actions */}
              <Card className="bg-gray-50">
                <p className="text-sm font-semibold text-navy-900 mb-3">Related guides</p>
                <div className="space-y-2">
                  {review.category === 'Rackets' && (
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
                  )}
                  {review.category === 'Strings' && (
                    <Link href="/playbooks/string-setup" className="flex items-center gap-2 text-sm text-lime-600 hover:text-lime-700">
                      <ArrowRight className="w-3 h-3" />
                      String Setup Playbook
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
          </div>
        </div>
      </div>
    </div>
  )
}
