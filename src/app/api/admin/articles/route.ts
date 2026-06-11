import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { slugify } from '@/lib/utils'

async function requireAdmin() {
  const { userId, sessionClaims } = await auth()
  if (!userId) return false
  return (sessionClaims?.metadata as { role?: string })?.role === 'admin'
}

export async function POST(req: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  const body = await req.json()
  try {
    const article = await prisma.learnArticle.create({
      data: {
        title: body.title, slug: body.slug ?? slugify(body.title),
        category: body.category, excerpt: body.excerpt, content: body.content,
        readingTime: body.readingTime, published: body.published ?? false, featured: body.featured ?? false,
      },
    })
    revalidatePath('/')
    revalidatePath('/learn')
    revalidatePath('/admin/home')
    revalidatePath('/admin/articles')
    return NextResponse.json({ success: true, article })
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }) }
}
