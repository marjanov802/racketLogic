import { slugify } from '@/lib/utils'
import { normalisePublicFolderPath, normalisePublicMediaPath } from '@/lib/public-media'

type ReviewBody = Record<string, unknown>

type AffiliateLink = {
  retailer: string
  price: string
  url: string
}

function cleanString(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

function optionalString(value: unknown) {
  const cleaned = cleanString(value)
  return cleaned || null
}

function cleanAffiliateLinks(value: unknown): AffiliateLink[] {
  if (!Array.isArray(value)) return []

  return value
    .filter((item): item is Record<string, unknown> => typeof item === 'object' && item !== null)
    .map((item) => ({
      retailer: cleanString(item.retailer),
      price: cleanString(item.price),
      url: cleanString(item.url),
    }))
    .filter((link) => link.retailer || link.price || link.url)
}

function cleanColourways(value: unknown) {
  if (!Array.isArray(value)) return []

  return value
    .filter((item): item is Record<string, unknown> => typeof item === 'object' && item !== null)
    .map((item) => ({
      name: cleanString(item.name),
      image: normalisePublicMediaPath(optionalString(item.image)) ?? '',
      links: cleanAffiliateLinks(item.links),
    }))
    .filter((colourway) => colourway.name || colourway.image || colourway.links.length > 0)
}

function cleanGallery(value: unknown) {
  if (!Array.isArray(value)) return []

  return value
    .filter((item): item is Record<string, unknown> => typeof item === 'object' && item !== null)
    .map((item) => ({
      type: item.type === 'video' ? 'video' : 'image',
      label: cleanString(item.label),
      url: normalisePublicMediaPath(optionalString(item.url)) ?? '',
    }))
    .filter((item) => item.label || item.url)
}

function cleanRating(value: unknown) {
  const rating = typeof value === 'number' ? value : Number(value)
  return Number.isInteger(rating) && rating >= 1 && rating <= 10 ? rating : null
}

export function buildReviewWriteData(body: ReviewBody) {
  const title = cleanString(body.title)
  const slug = cleanString(body.slug) || slugify(title)

  return {
    title,
    slug,
    category: cleanString(body.category),
    productName: cleanString(body.productName),
    brand: cleanString(body.brand),
    excerpt: cleanString(body.excerpt),
    content: cleanString(body.content),
    affiliateUrl: optionalString(body.affiliateUrl),
    affiliateLinks: cleanAffiliateLinks(body.affiliateLinks),
    colourways: cleanColourways(body.colourways),
    colourwayFolder: normalisePublicFolderPath(optionalString(body.colourwayFolder)),
    gallery: cleanGallery(body.gallery),
    coverImage: normalisePublicMediaPath(optionalString(body.coverImage)),
    rating: cleanRating(body.rating),
    whoIsItFor: optionalString(body.whoIsItFor),
    whoIsItNotFor: optionalString(body.whoIsItNotFor),
    mainBenefit: optionalString(body.mainBenefit),
    mainDownside: optionalString(body.mainDownside),
    verdict: optionalString(body.verdict),
    published: body.published === true,
    featured: body.featured === true,
  }
}
