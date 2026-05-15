import type { Metadata } from 'next'
import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { BookOpen, Download, Calendar, ArrowRight, Package, Clock, Check } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { formatPrice, formatDate } from '@/lib/utils'
import { prisma } from '@/lib/prisma'
import { DownloadButton } from '@/components/dashboard/DownloadButton'

export const metadata: Metadata = {
  title: 'My Dashboard',
}

const bookingStatusLabels: Record<string, { label: string; variant: 'default' | 'lime' | 'navy' | 'green' | 'red' | 'yellow' | 'gray' }> = {
  NEW:                  { label: 'Booking received',     variant: 'yellow' },
  CONFIRMED:            { label: 'Confirmed',            variant: 'navy' },
  IN_PROGRESS:          { label: 'In progress',          variant: 'lime' },
  READY_FOR_COLLECTION: { label: 'Ready for collection', variant: 'green' },
  COMPLETED:            { label: 'Completed',            variant: 'default' },
  CANCELLED:            { label: 'Cancelled',            variant: 'red' },
}

async function getDashboardData(clerkId: string) {
  try {
    let user = await prisma.user.findUnique({
      where: { clerkId },
      include: {
        purchases: {
          where: { paymentStatus: 'PAID' },
          include: { playbook: true },
          orderBy: { createdAt: 'desc' },
        },
        bookings: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    })

    return user
  } catch {
    return null
  }
}

function getRecommendations(purchases: { playbook: { slug: string } | null }[]) {
  const slugs = purchases.map((p) => p.playbook?.slug).filter(Boolean)
  const recs: { text: string; href: string }[] = []

  if (slugs.includes('string-setup') && !slugs.includes('racket-buying')) {
    recs.push({ text: 'You have the String Setup Playbook — the Racket Buying Playbook pairs well with it.', href: '/playbooks/racket-buying' })
  }
  if (slugs.includes('warm-up') && !slugs.includes('cool-down')) {
    recs.push({ text: 'Complete your routine with the Cool-Down Playbook.', href: '/playbooks/cool-down' })
  }
  if (slugs.includes('match-tactics')) {
    recs.push({ text: 'Put your tactics into practice — book a Premium Setup Restring.', href: '/stringing' })
  }
  if (slugs.length > 0 && !slugs.includes('complete-library')) {
    recs.push({ text: 'Upgrade to the Complete RacketLogic Library and access everything.', href: '/playbooks/complete-library' })
  }
  recs.push({ text: 'Want a programme built around your game? Request a custom programme.', href: '/custom-programmes' })

  return recs.slice(0, 3)
}

export default async function DashboardPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const clerkUser = await currentUser()
  const dbUser = await getDashboardData(userId)

  // Ensure user exists in DB
  if (!dbUser && clerkUser) {
    try {
      await prisma.user.create({
        data: {
          clerkId: userId,
          name: `${clerkUser.firstName ?? ''} ${clerkUser.lastName ?? ''}`.trim() || null,
          email: clerkUser.emailAddresses[0]?.emailAddress ?? '',
        },
      })
    } catch {
      // user may already exist, ignore
    }
  }

  const purchases = dbUser?.purchases ?? []
  const bookings = dbUser?.bookings ?? []
  const recommendations = getRecommendations(purchases)
  const displayName = clerkUser?.firstName ?? 'there'

  return (
    <div className="section-padding">
      <div className="container-lg max-w-5xl">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-navy-900 mb-2">Welcome back, {displayName}</h1>
          <p className="text-gray-600">Your purchases, downloads and bookings in one place.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">

            {/* My Playbooks */}
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-navy-900 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-lime-500" />
                  My Playbooks
                </h2>
                {purchases.length === 0 && (
                  <Link href="/playbooks">
                    <Button size="sm" variant="outline">Browse Playbooks</Button>
                  </Link>
                )}
              </div>

              {purchases.length === 0 ? (
                <Card className="text-center py-10">
                  <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 mb-4">No playbooks yet.</p>
                  <Link href="/playbooks">
                    <Button>Browse Playbooks</Button>
                  </Link>
                </Card>
              ) : (
                <div className="space-y-3">
                  {purchases.map((purchase) => (
                    purchase.playbook && (
                      <Card key={purchase.id} padding="sm" className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-10 h-10 bg-navy-gradient rounded-lg flex items-center justify-center flex-shrink-0">
                            <BookOpen className="w-5 h-5 text-lime-400" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-navy-900 text-sm truncate">
                              {purchase.playbook.title}
                            </p>
                            <p className="text-xs text-gray-500">
                              Purchased {formatDate(purchase.createdAt)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Badge variant="green">
                            <Check className="w-3 h-3 mr-1" />
                            Owned
                          </Badge>
                          {purchase.playbook.fileUrl ? (
                            <DownloadButton playbookId={purchase.playbook.id} />
                          ) : (
                            <span className="text-xs text-gray-400 italic">PDF coming soon</span>
                          )}
                        </div>
                      </Card>
                    )
                  ))}
                </div>
              )}
            </div>

            {/* My Bookings */}
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-navy-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-lime-500" />
                  My Bookings
                </h2>
                <Link href="/stringing">
                  <Button size="sm" variant="outline">Book Stringing</Button>
                </Link>
              </div>

              {bookings.length === 0 ? (
                <Card className="text-center py-10">
                  <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 mb-4">No bookings yet.</p>
                  <Link href="/stringing">
                    <Button>Book Stringing</Button>
                  </Link>
                </Card>
              ) : (
                <div className="space-y-3">
                  {bookings.map((booking) => {
                    const status = bookingStatusLabels[booking.status] ?? { label: booking.status, variant: 'default' as const }
                    return (
                      <Card key={booking.id} padding="sm">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-semibold text-navy-900 text-sm capitalize">
                              {booking.serviceType.replace(/-/g, ' ')}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {booking.racketModel ?? 'Racket not specified'} · {formatDate(booking.createdAt)}
                            </p>
                          </div>
                          <Badge variant={status.variant}>{status.label}</Badge>
                        </div>
                      </Card>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar: Recommendations */}
          <div>
            <h2 className="text-xl font-bold text-navy-900 mb-5 flex items-center gap-2">
              <ArrowRight className="w-5 h-5 text-lime-500" />
              Recommended next steps
            </h2>
            <div className="space-y-3">
              {recommendations.map((rec, i) => (
                <Card key={i} hover padding="sm">
                  <p className="text-sm text-gray-700 mb-2 leading-relaxed">{rec.text}</p>
                  <Link href={rec.href} className="text-xs font-semibold text-lime-600 flex items-center gap-1 hover:text-lime-700">
                    View <ArrowRight className="w-3 h-3" />
                  </Link>
                </Card>
              ))}
            </div>

            {/* Quick links */}
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Quick links</h3>
              <div className="space-y-2">
                {[
                  { href: '/playbooks', label: 'Browse Playbooks', icon: BookOpen },
                  { href: '/stringing', label: 'Book Stringing', icon: Calendar },
                  { href: '/custom-programmes', label: 'Custom Programmes', icon: Package },
                ].map((link) => {
                  const Icon = link.icon
                  return (
                    <Link key={link.href} href={link.href} className="flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-gray-100 transition-colors">
                      <Icon className="w-4 h-4 text-lime-500" />
                      <span className="text-sm text-gray-700">{link.label}</span>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
