import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { ReviewForm } from '@/components/admin/ReviewForm'
import { Card } from '@/components/ui/Card'
import { DeleteButton } from '@/components/admin/DeleteButton'

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
        colourways: Array.isArray(review.colourways) ? review.colourways as { name: string; image: string }[] : [],
        colourwayFolder: review.colourwayFolder ?? '',
        gallery: Array.isArray(review.gallery) ? review.gallery as { type: 'image' | 'video'; label: string; url: string }[] : [],
        coverImage: review.coverImage ?? '',
        rating: review.rating ? String(review.rating) : '', whoIsItFor: review.whoIsItFor ?? '',
        whoIsItNotFor: review.whoIsItNotFor ?? '', mainBenefit: review.mainBenefit ?? '',
        mainDownside: review.mainDownside ?? '', verdict: review.verdict ?? '',
        published: review.published, featured: review.featured,
      }} />

      <Card className="mt-8 border-red-100 bg-red-50/40">
        <h3 className="font-bold text-red-900 mb-2">Delete review</h3>
        <p className="text-sm text-red-700 mb-4">
          Remove this review permanently from the Blog.
        </p>
        <DeleteButton
          endpoint={`/api/admin/reviews/${review.id}`}
          label={review.title}
          redirectTo="/admin/reviews"
        />
      </Card>
    </div>
  )
}
