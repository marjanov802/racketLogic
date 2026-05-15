import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { prisma } from '@/lib/prisma'

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getArticle(slug: string) {
  try {
    return await prisma.learnArticle.findUnique({
      where: { slug, published: true },
    })
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticle(slug)
  if (!article) return { title: 'Article not found' }
  return { title: article.title, description: article.excerpt }
}

const relatedPlaybooks: Record<string, { title: string; href: string }[]> = {
  'Equipment': [
    { title: 'String Setup Playbook', href: '/playbooks/string-setup' },
    { title: 'Racket Buying Playbook', href: '/playbooks/racket-buying' },
  ],
  'Training': [
    { title: 'Warm-Up Playbook', href: '/playbooks/warm-up' },
    { title: 'Cool-Down Playbook', href: '/playbooks/cool-down' },
  ],
  'Matchplay': [
    { title: 'Match Tactics Playbook', href: '/playbooks/match-tactics' },
  ],
  'Fitness': [
    { title: 'Tennis Nutrition & Fuelling Guide', href: '/playbooks/nutrition-fuelling' },
  ],
}

export default async function LearnArticlePage({ params }: PageProps) {
  const { slug } = await params
  const article = await getArticle(slug)
  if (!article) notFound()

  const related = relatedPlaybooks[article.category] ?? []

  return (
    <div className="section-padding">
      <div className="container-lg">
        <Link href="/learn" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-navy-900 mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Learn
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main */}
          <div className="lg:col-span-2">
            <Badge variant="gray" className="mb-4">{article.category}</Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-navy-900 mb-4">{article.title}</h1>
            {article.readingTime && (
              <div className="flex items-center gap-1.5 text-sm text-gray-400 mb-8">
                <Clock className="w-4 h-4" />
                {article.readingTime} min read
              </div>
            )}
            <div
              className="prose-content"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-5">
              {related.length > 0 && (
                <Card>
                  <p className="text-sm font-semibold text-navy-900 mb-4">Go deeper with a playbook</p>
                  <div className="space-y-2">
                    {related.map((item) => (
                      <Link key={item.href} href={item.href} className="flex items-center gap-2 text-sm text-lime-600 hover:text-lime-700">
                        <ArrowRight className="w-3 h-3" />
                        {item.title}
                      </Link>
                    ))}
                  </div>
                </Card>
              )}

              <Card className="bg-gray-50">
                <p className="text-sm font-semibold text-navy-900 mb-3">Explore more</p>
                <div className="space-y-2">
                  <Link href="/stringing" className="flex items-center gap-2 text-sm text-lime-600 hover:text-lime-700">
                    <ArrowRight className="w-3 h-3" />
                    Book stringing
                  </Link>
                  <Link href="/reviews" className="flex items-center gap-2 text-sm text-lime-600 hover:text-lime-700">
                    <ArrowRight className="w-3 h-3" />
                    Gear reviews
                  </Link>
                  <Link href="/custom-programmes" className="flex items-center gap-2 text-sm text-lime-600 hover:text-lime-700">
                    <ArrowRight className="w-3 h-3" />
                    Custom programme
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
