import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'

async function requireAdmin() {
  const { userId, sessionClaims } = await auth()
  if (!userId) return false
  return (sessionClaims?.metadata as { role?: string })?.role === 'admin'
}

export async function PATCH(req: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const body = await req.json()
  const featured = Boolean(body.featured)

  try {
    if (body.model === 'review') {
      await prisma.reviewArticle.update({ where: { id: body.id }, data: { featured } })
      revalidatePath('/reviews')
    } else if (body.model === 'article') {
      await prisma.learnArticle.update({ where: { id: body.id }, data: { featured } })
      revalidatePath('/learn')
    } else if (body.model === 'playbook') {
      await prisma.playbook.update({ where: { id: body.id }, data: { featured } })
      revalidatePath('/playbooks')
    } else {
      return NextResponse.json({ error: 'Invalid featured model' }, { status: 400 })
    }

    revalidatePath('/')
    revalidatePath('/admin/home')
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Featured update error:', error)
    return NextResponse.json({ error: 'Failed to update featured status' }, { status: 500 })
  }
}
