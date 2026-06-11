import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'

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
    const article = await prisma.learnArticle.update({ where: { id }, data: body })
    revalidatePath('/')
    revalidatePath('/learn')
    revalidatePath(`/learn/${article.slug}`)
    revalidatePath('/admin/home')
    revalidatePath('/admin/articles')
    return NextResponse.json({ success: true, article })
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }) }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  const { id } = await params
  try {
    const article = await prisma.learnArticle.delete({ where: { id } })
    revalidatePath('/')
    revalidatePath('/learn')
    revalidatePath(`/learn/${article.slug}`)
    revalidatePath('/admin/home')
    revalidatePath('/admin/articles')
    return NextResponse.json({ success: true })
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }) }
}
