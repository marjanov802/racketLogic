import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
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
    const enquiry = await prisma.customProgrammeEnquiry.update({
      where: { id },
      data: { status: body.status, adminNotes: body.adminNotes },
    })
    return NextResponse.json({ success: true, enquiry })
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }) }
}
