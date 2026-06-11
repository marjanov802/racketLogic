import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { defaultHomeContent } from '@/lib/home-content'

async function requireAdmin() {
  const { userId, sessionClaims } = await auth()
  if (!userId) return false
  return (sessionClaims?.metadata as { role?: string })?.role === 'admin'
}

export async function PUT(req: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  const body = await req.json()

  const value = Object.fromEntries(
    Object.keys(defaultHomeContent).map((key) => [key, typeof body[key] === 'string' ? body[key] : ''])
  )

  try {
    const setting = await prisma.siteSetting.upsert({
      where: { key: 'home' },
      update: { value },
      create: { key: 'home', value },
    })
    revalidatePath('/')
    revalidatePath('/admin/home')
    return NextResponse.json({ success: true, setting })
  } catch (error) {
    console.error('Home settings update error:', error)
    return NextResponse.json({ error: 'Failed to update homepage' }, { status: 500 })
  }
}
