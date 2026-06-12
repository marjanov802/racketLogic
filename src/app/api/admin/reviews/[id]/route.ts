import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { buildReviewWriteData } from '@/lib/review-write-data'

async function requireAdmin() {
  const { userId, sessionClaims } = await auth()
  if (!userId) return false
  return (sessionClaims?.metadata as { role?: string })?.role === 'admin'
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  const { id } = await params
  const body = await req.json()
  try {
    const existing = await prisma.reviewArticle.findUnique({ where: { id }, select: { slug: true } })
    const review = await prisma.reviewArticle.update({ where: { id }, data: buildReviewWriteData(body) })
    revalidatePath('/')
    revalidatePath('/reviews')
    if (existing?.slug && existing.slug !== review.slug) revalidatePath(`/reviews/${existing.slug}`)
    revalidatePath(`/reviews/${review.slug}`)
    revalidatePath('/admin/home')
    revalidatePath('/admin/reviews')
    revalidatePath(`/admin/reviews/${id}`)
    return NextResponse.json({ success: true, review })
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }) }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  const { id } = await params
  try {
    const review = await prisma.reviewArticle.delete({ where: { id } })
    revalidatePath('/admin/reviews')
    revalidatePath('/reviews')
    revalidatePath(`/reviews/${review.slug}`)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete review error:', error)
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 })
  }
}
