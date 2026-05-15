import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { slugify } from '@/lib/utils'

async function requireAdmin() {
  const { userId, sessionClaims } = await auth()
  if (!userId) return false
  const role = (sessionClaims?.metadata as { role?: string })?.role
  return role === 'admin'
}

export async function POST(req: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const body = await req.json()
  try {
    const playbook = await prisma.playbook.create({
      data: {
        title: body.title,
        slug: body.slug ?? slugify(body.title),
        description: body.description,
        longDescription: body.longDescription,
        price: body.price,
        previewContent: body.previewContent,
        category: body.category,
        published: body.published ?? false,
        featured: body.featured ?? false,
        isBundle: body.isBundle ?? false,
      },
    })
    return NextResponse.json({ success: true, playbook })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to create playbook' }, { status: 500 })
  }
}
