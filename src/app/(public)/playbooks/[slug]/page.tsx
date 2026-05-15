import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Lock, BookOpen, Check, ArrowLeft, ArrowRight, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { Disclaimer } from '@/components/ui/Disclaimer'
import { formatPrice } from '@/lib/utils'
import { prisma } from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'
import { BuyButton } from '@/components/playbooks/BuyButton'

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getPlaybook(slug: string) {
  try {
    return await prisma.playbook.findUnique({
      where: { slug, published: true },
    })
  } catch {
    return null
  }
}

async function getUserPurchase(userId: string | null, playbookId: string) {
  if (!userId) return null
  try {
    const user = await prisma.user.findUnique({ where: { clerkId: userId } })
    if (!user) return null
    return await prisma.purchase.findFirst({
      where: {
        userId: user.id,
        playbookId,
        paymentStatus: 'PAID',
      },
    })
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const playbook = await getPlaybook(slug)
  if (!playbook) return { title: 'Playbook not found' }
  return {
    title: playbook.title,
    description: playbook.description,
  }
}

export default async function PlaybookPage({ params }: PageProps) {
  const { slug } = await params
  const playbook = await getPlaybook(slug)
  if (!playbook) notFound()

  const { userId } = await auth()
  const purchase = await getUserPurchase(userId, playbook.id)
  const hasPurchased = !!purchase

  const isNutrition = playbook.slug === 'nutrition-fuelling'

  return (
    <div className="section-padding">
      <div className="container-lg">
        {/* Breadcrumb */}
        <Link
          href="/playbooks"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-navy-900 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Playbooks
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main content */}
          <div className="lg:col-span-2">
            <div className="aspect-[16/7] bg-navy-gradient rounded-2xl flex items-center justify-center mb-8">
              <BookOpen className="w-16 h-16 text-lime-400" />
            </div>

            <Badge variant={playbook.isBundle ? 'lime' : 'gray'} className="mb-4">
              {playbook.isBundle ? 'Bundle' : playbook.category}
            </Badge>

            <h1 className="text-3xl md:text-4xl font-bold text-navy-900 mb-4">{playbook.title}</h1>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">{playbook.description}</p>

            {/* Free preview */}
            <div className="bg-gray-50 rounded-2xl p-6 mb-8">
              <h2 className="text-lg font-bold text-navy-900 mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-lime-500" />
                Free preview
              </h2>
              {playbook.previewContent ? (
                <div
                  className="prose-content text-sm"
                  dangerouslySetInnerHTML={{ __html: playbook.previewContent }}
                />
              ) : (
                <p className="text-gray-500 text-sm">Preview coming soon.</p>
              )}
            </div>

            {/* Full content (locked) */}
            {!hasPurchased && (
              <div className="relative rounded-2xl overflow-hidden">
                <div className="bg-gray-100 p-8 blur-sm select-none pointer-events-none" aria-hidden>
                  <p className="text-gray-600 mb-3">Full playbook content visible after purchase...</p>
                  <p className="text-gray-500 text-sm">Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip.</p>
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
                  <div className="w-12 h-12 bg-navy-900 rounded-full flex items-center justify-center mb-3">
                    <Lock className="w-6 h-6 text-lime-400" />
                  </div>
                  <p className="font-bold text-navy-900 mb-1">Full content locked</p>
                  <p className="text-sm text-gray-500 mb-4 text-center max-w-xs">
                    Purchase this playbook to access all content and download the PDF.
                  </p>
                  <BuyButton playbookId={playbook.id} price={Number(playbook.price)} title={playbook.title} />
                </div>
              </div>
            )}

            {hasPurchased && (
              <Card className="border-lime-300 bg-lime-50/50">
                <div className="flex items-center gap-3 mb-4">
                  <Check className="w-6 h-6 text-lime-600" />
                  <h3 className="font-bold text-navy-900">You own this playbook</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Download your PDF from your dashboard at any time.
                </p>
                <Link href="/dashboard">
                  <Button>
                    Go to Dashboard <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </Card>
            )}

            {isNutrition && <Disclaimer type="nutrition" className="mt-6" />}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="mb-6">
                <div className="text-3xl font-bold text-navy-900 mb-1">
                  {formatPrice(Number(playbook.price))}
                </div>
                <p className="text-sm text-gray-500 mb-5">One-time purchase. Instant PDF access.</p>

                {hasPurchased ? (
                  <Link href="/dashboard">
                    <Button className="w-full mb-3">
                      <Check className="w-4 h-4" />
                      Download from Dashboard
                    </Button>
                  </Link>
                ) : (
                  <BuyButton
                    playbookId={playbook.id}
                    price={Number(playbook.price)}
                    title={playbook.title}
                    className="w-full mb-3"
                    size="lg"
                  />
                )}

                <ul className="space-y-2.5 mt-5 pt-5 border-t border-gray-100">
                  {[
                    'Instant PDF download',
                    'Access in your dashboard',
                    'Free preview before buying',
                    'One-time payment',
                  ].map((point) => (
                    <li key={point} className="flex items-center gap-2 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-lime-500 flex-shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              </Card>

              {/* Cross-sells */}
              <Card className="bg-gray-50">
                <p className="text-sm font-semibold text-navy-900 mb-3">Related actions</p>
                <div className="space-y-2">
                  <Link href="/stringing" className="flex items-center gap-2 text-sm text-lime-600 hover:text-lime-700">
                    <ArrowRight className="w-3 h-3" />
                    Book stringing service
                  </Link>
                  <Link href="/playbooks" className="flex items-center gap-2 text-sm text-lime-600 hover:text-lime-700">
                    <ArrowRight className="w-3 h-3" />
                    Browse more playbooks
                  </Link>
                  <Link href="/custom-programmes" className="flex items-center gap-2 text-sm text-lime-600 hover:text-lime-700">
                    <ArrowRight className="w-3 h-3" />
                    Request custom programme
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
