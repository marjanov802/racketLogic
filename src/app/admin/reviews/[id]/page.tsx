import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { ReviewForm } from '@/components/admin/ReviewForm'

interface PageProps { params: Promise<{ id: string }> }

export default async function EditReviewPage({ params }: PageProps) {
  const { id } = await params
  let review
  try { review = await prisma.reviewArticle.findUnique({ where: { id } }) }
  catch { notFound() }
  if (!review) notFound()

  return (
    <div className="p-8 max-w-4xl">
      <Link href="/admin/reviews" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-navy-900 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Reviews
      </Link>
      <h1 className="text-2xl font-bold text-navy-900 mb-8">Edit Review</h1>
      <ReviewForm review={{
        id: review.id, title: review.title, slug: review.slug, category: review.category,
        productName: review.productName, brand: review.brand, excerpt: review.excerpt,
        content: review.content, affiliateUrl: review.affiliateUrl ?? '',
        affiliateLinks: Array.isArray(review.affiliateLinks) ? review.affiliateLinks as { retailer: string; price: string; url: string }[] : [],
        coverImage: review.coverImage ?? '',
        rating: review.rating ? String(review.rating) : '', whoIsItFor: review.whoIsItFor ?? '',
        whoIsItNotFor: review.whoIsItNotFor ?? '', mainBenefit: review.mainBenefit ?? '',
        mainDownside: review.mainDownside ?? '', verdict: review.verdict ?? '',
        published: review.published, featured: review.featured,
      }} />
    </div>
  )
}
