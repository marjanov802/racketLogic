import type { Metadata } from 'next'
import Link from 'next/link'
import { BookOpen, Clock, ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = {
  title: 'Learn',
  description:
    'Free tennis articles covering string tension, racket specs, warm-ups, shoes, tactics and more.',
}

const PLACEHOLDER_ARTICLES = [
  { title: 'String tension explained', slug: 'string-tension-explained', category: 'Equipment', excerpt: 'What does string tension actually do? High tension vs low tension and why it matters to your game.', readingTime: 5 },
  { title: 'Poly vs multifilament strings', slug: 'poly-vs-multifilament', category: 'Equipment', excerpt: 'The key differences between polyester and multifilament strings and which suits your playing style.', readingTime: 6 },
  { title: 'How often should you restring?', slug: 'how-often-to-restring', category: 'Equipment', excerpt: 'A simple guide to knowing when to restring based on how often you play and what string you use.', readingTime: 4 },
  { title: 'How to choose tennis shoes', slug: 'how-to-choose-tennis-shoes', category: 'Equipment', excerpt: 'Hard court, clay or all-court? What to look for in tennis shoes and what actually matters.', readingTime: 5 },
  { title: 'Racket specs explained', slug: 'racket-specs-explained', category: 'Equipment', excerpt: 'Head size, weight, balance, swingweight and string pattern — what they mean and why they matter.', readingTime: 7 },
  { title: 'Grip size explained', slug: 'grip-size-explained', category: 'Equipment', excerpt: 'How to find your correct grip size and what happens when you get it wrong.', readingTime: 4 },
  { title: 'Basic tennis warm-up', slug: 'basic-tennis-warm-up', category: 'Training', excerpt: 'A 10-minute warm-up routine that prepares your body properly for tennis.', readingTime: 5 },
  { title: 'Cool-down basics for tennis', slug: 'cool-down-basics', category: 'Training', excerpt: 'Why a cool-down matters and how to do a simple post-tennis routine to recover better.', readingTime: 4 },
  { title: 'Club match tactics', slug: 'club-match-tactics', category: 'Matchplay', excerpt: 'Practical tactics for club-level singles and doubles play.', readingTime: 6 },
  { title: 'Beginner tennis advice', slug: 'beginner-tennis-advice', category: 'Beginner', excerpt: 'The most important things to get right when you start playing tennis.', readingTime: 6 },
  { title: 'What to eat before tennis', slug: 'what-to-eat-before-tennis', category: 'Fitness', excerpt: 'General guidance on match-day eating and pre-match fuelling.', readingTime: 4 },
  { title: 'How to structure a one-hour practice session', slug: 'how-to-structure-one-hour-practice', category: 'Training', excerpt: 'A practical 60-minute practice structure that covers warm-up, drills and matchplay.', readingTime: 5 },
]

type ArticleItem = { slug: string; title: string; category: string; excerpt: string; readingTime?: number | null; isPlaceholder?: boolean }

async function getArticles(): Promise<ArticleItem[]> {
  try {
    const articles = await prisma.learnArticle.findMany({
      where: { published: true },
      orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
    })
    if (articles.length > 0) return articles
    return PLACEHOLDER_ARTICLES.map((a) => ({ ...a, isPlaceholder: true }))
  } catch {
    return PLACEHOLDER_ARTICLES.map((a) => ({ ...a, isPlaceholder: true }))
  }
}

const categories = ['All', 'Equipment', 'Training', 'Matchplay', 'Beginner', 'Fitness']

export default async function LearnPage() {
  const articles = await getArticles()

  return (
    <>
      {/* Hero */}
      <section className="bg-navy-gradient text-white py-20">
        <div className="container-lg">
          <Badge variant="lime" className="mb-5 text-xs font-semibold uppercase tracking-widest">
            Free Articles
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-5 max-w-2xl">Learn tennis better.</h1>
          <p className="text-xl text-gray-300 max-w-2xl leading-relaxed">
            Free articles covering strings, rackets, shoes, warm-ups, tactics and training.
            All practical. All honest. No fluff.
          </p>
        </div>
      </section>

      {/* Category filter */}
      <section className="py-6 border-b border-gray-100 bg-white">
        <div className="container-lg">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <Link
                key={cat}
                href={cat === 'All' ? '/learn' : `/learn?category=${cat.toLowerCase()}`}
                className="flex-shrink-0 px-4 py-1.5 rounded-full border border-gray-200 text-sm text-gray-600 hover:border-lime-400 hover:text-lime-600 transition-colors"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Articles grid */}
      <section className="section-padding">
        <div className="container-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              article.isPlaceholder ? (
                <Card key={article.slug} className="h-full flex flex-col opacity-70">
                  <Badge variant="gray" className="mb-3 self-start">{article.category}</Badge>
                  <h3 className="font-bold text-navy-900 mb-2 flex-1 leading-snug">{article.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-3">{article.excerpt}</p>
                  <div className="pt-3 border-t border-gray-100 mt-auto">
                    <span className="text-xs text-gray-400">Coming soon</span>
                  </div>
                </Card>
              ) : (
                <Link key={article.slug} href={`/learn/${article.slug}`}>
                  <Card hover className="h-full flex flex-col">
                    <Badge variant="gray" className="mb-3 self-start">{article.category}</Badge>
                    <h3 className="font-bold text-navy-900 mb-2 flex-1 leading-snug">{article.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-3">{article.excerpt}</p>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
                      {article.readingTime && (
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <Clock className="w-3.5 h-3.5" />
                          {article.readingTime} min read
                        </div>
                      )}
                      <span className="text-xs font-semibold text-lime-600 flex items-center gap-1 ml-auto">
                        Read article <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </Card>
                </Link>
              )
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding-sm bg-gray-50">
        <div className="container-lg">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold text-navy-900 mb-2">Want more depth?</h3>
              <p className="text-gray-600">Full playbooks go further — with complete guides, exercises and recommendations.</p>
            </div>
            <Link href="/playbooks">
              <Badge variant="lime" className="cursor-pointer hover:bg-lime-200 transition-colors text-sm py-2 px-5">
                Browse Playbooks <ArrowRight className="w-3.5 h-3.5 ml-1 inline" />
              </Badge>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
