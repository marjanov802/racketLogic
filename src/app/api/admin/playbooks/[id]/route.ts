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
    const playbook = await prisma.playbook.update({
      where: { id },
      data: {
        title: body.title,
        slug: body.slug,
        description: body.description,
        longDescription: body.longDescription,
        price: body.price,
        previewContent: body.previewContent,
        category: body.category,
        published: body.published,
        featured: body.featured,
        isBundle: body.isBundle,
      },
    })
    revalidatePath('/')
    revalidatePath('/playbooks')
    revalidatePath(`/playbooks/${playbook.slug}`)
    revalidatePath('/admin/home')
    revalidatePath('/admin/playbooks')
    return NextResponse.json({ success: true, playbook })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to update playbook' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  const { id } = await params
  try {
    const playbook = await prisma.playbook.delete({ where: { id } })
    revalidatePath('/')
    revalidatePath('/playbooks')
    revalidatePath(`/playbooks/${playbook.slug}`)
    revalidatePath('/admin/home')
    revalidatePath('/admin/playbooks')
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}
