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

export async function POST(req: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  const body = await req.json()
  try {
    const data = buildReviewWriteData(body)
    const review = await prisma.reviewArticle.create({
      data,
    })
    revalidatePath('/')
    revalidatePath('/reviews')
    revalidatePath('/admin/home')
    revalidatePath('/admin/reviews')
    return NextResponse.json({ success: true, review })
  } catch (e) { return NextResponse.json({ error: 'Failed' }, { status: 500 }) }
}
