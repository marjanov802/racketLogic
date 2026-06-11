import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { mergeHomeContent } from '@/lib/home-content'
import { HomeContentForm } from '@/components/admin/HomeContentForm'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

async function getHomeAdminData() {
  try {
    const [setting, reviews, articles, playbooks] = await Promise.all([
      prisma.siteSetting.findUnique({ where: { key: 'home' } }),
      prisma.reviewArticle.findMany({
        where: { featured: true },
        orderBy: { updatedAt: 'desc' },
        take: 6,
        select: { id: true, title: true, slug: true, category: true, published: true },
      }),
      prisma.learnArticle.findMany({
        where: { featured: true },
        orderBy: { updatedAt: 'desc' },
        take: 6,
        select: { id: true, title: true, slug: true, category: true, published: true },
      }),
      prisma.playbook.findMany({
        where: { featured: true },
        orderBy: { updatedAt: 'desc' },
        take: 6,
        select: { id: true, title: true, slug: true, category: true, published: true },
      }),
    ])

    return { content: mergeHomeContent(setting?.value), reviews, articles, playbooks }
  } catch {
    return { content: mergeHomeContent(null), reviews: [], articles: [], playbooks: [] }
  }
}

function FeaturedList({
  title,
  href,
  items,
}: {
  title: string
  href: string
  items: { id: string; title: string; slug: string; category: string; published: boolean }[]
}) {
  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-navy-900">{title}</h2>
        <Link href={href} className="text-xs font-semibold text-lime-700 hover:text-lime-600">
          Manage
        </Link>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-gray-500">Nothing featured yet.</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="rounded-xl border border-gray-100 bg-gray-50 p-3">
              <p className="text-sm font-semibold text-navy-900">{item.title}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge variant="gray">{item.category}</Badge>
                <Badge variant={item.published ? 'green' : 'yellow'}>{item.published ? 'Published' : 'Draft'}</Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}

export default async function AdminHomePage() {
  const { content, reviews, articles, playbooks } = await getHomeAdminData()

  return (
    <div className="p-8 max-w-6xl">
      <div className="flex items-start justify-between gap-6 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Home Page</h1>
          <p className="text-sm text-gray-500 mt-1">
            Edit the public homepage wording and check which content is featured.
          </p>
        </div>
        <Link href="/" className="text-sm font-semibold text-lime-700 hover:text-lime-600">
          View homepage
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
        <HomeContentForm content={content} />
        <aside className="space-y-5">
          <FeaturedList title="Featured Reviews" href="/admin/reviews" items={reviews} />
          <FeaturedList title="Featured Learn Articles" href="/admin/articles" items={articles} />
          <FeaturedList title="Featured Playbooks" href="/admin/playbooks" items={playbooks} />
        </aside>
      </div>
    </div>
  )
}
