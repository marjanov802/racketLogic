'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Search } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'

type ReviewItem = {
  id: string
  title: string
  slug: string
  category: string
  productName: string
  brand: string
  excerpt: string
  coverImage: string | null
  featured: boolean
}

const categories = ['All', 'Rackets', 'Strings', 'Shoes', 'Grips', 'Accessories']

export function ReviewFilters({ reviews }: { reviews: ReviewItem[] }) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')

  const filteredReviews = useMemo(() => {
    const search = query.trim().toLowerCase()

    return reviews.filter((review) => {
      const matchesCategory = category === 'All' || review.category === category
      const matchesSearch =
        !search ||
        [review.title, review.productName, review.brand, review.category, review.excerpt]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(search))

      return matchesCategory && matchesSearch
    })
  }, [category, query, reviews])

  return (
    <div>
      <div className="rounded-2xl border border-gray-100 bg-white p-4 mb-8 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4 items-center">
          <label className="relative block">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by product, brand or category..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm text-navy-900 placeholder:text-gray-400 focus:border-lime-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-lime-500/20"
            />
          </label>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`flex-shrink-0 px-4 py-2 rounded-full border text-sm transition-colors ${
                  category === cat
                    ? 'border-lime-500 bg-lime-50 text-lime-700'
                    : 'border-gray-200 text-gray-600 hover:border-lime-400 hover:text-lime-600 hover:bg-lime-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <p className="mt-3 text-xs text-gray-500">
          Showing {filteredReviews.length} of {reviews.length} reviews.
        </p>
      </div>

      {filteredReviews.length === 0 ? (
        <Card className="text-center py-12">
          <p className="font-semibold text-navy-900">No reviews found</p>
          <p className="mt-2 text-sm text-gray-500">Try a different product name, brand or category.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map((review) => (
            <Link key={review.id} href={`/reviews/${review.slug}`}>
              <Card hover className="h-full flex flex-col">
                {review.coverImage ? (
                  <img
                    src={review.coverImage}
                    alt={review.productName}
                    className="w-full aspect-video object-contain bg-gray-50 rounded-xl mb-4 border border-gray-100 p-3"
                  />
                ) : (
                  <div className="aspect-video bg-gray-100 rounded-xl mb-4 flex items-center justify-center text-sm font-semibold text-gray-400 uppercase tracking-wider">
                    {review.category}
                  </div>
                )}
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="gray">{review.category}</Badge>
                  {review.featured && <Badge variant="lime">Featured</Badge>}
                </div>
                <p className="text-xs text-gray-400 mb-1">{review.brand}</p>
                <h3 className="font-bold text-navy-900 mb-2 flex-1">{review.title}</h3>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed line-clamp-2">{review.excerpt}</p>
                <div className="flex items-center justify-end pt-3 border-t border-gray-100">
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
  )
}
