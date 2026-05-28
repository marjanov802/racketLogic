export type BookingStatus =
  | 'NEW'
  | 'CONFIRMED'
  | 'IN_PROGRESS'
  | 'READY_FOR_COLLECTION'
  | 'COMPLETED'
  | 'CANCELLED'

export type PaymentStatus = 'UNPAID' | 'PAID' | 'REFUNDED'

export type EnquiryStatus = 'NEW' | 'REVIEWING' | 'RESPONDED' | 'CLOSED'

export interface StringingService {
  id: string
  name: string
  description: string
  includes: string[]
  price: string
  priceNote?: string
  highlight?: boolean
}

export interface PlaybookPreview {
  id: string
  title: string
  slug: string
  description: string
  price: number
  coverImage?: string | null
  category: string
  featured: boolean
}

export interface ReviewPreview {
  id: string
  title: string
  slug: string
  category: string
  productName: string
  brand: string
  excerpt: string
  rating?: number | null
  coverImage?: string | null
  featured: boolean
}

export interface LearnArticlePreview {
  id: string
  title: string
  slug: string
  category: string
  excerpt: string
  readingTime?: number | null
  featured: boolean
}
