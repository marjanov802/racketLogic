import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabaseAdmin, PLAYBOOKS_BUCKET } from '@/lib/supabase'
import { prisma } from '@/lib/prisma'

async function requireAdmin() {
  const { userId, sessionClaims } = await auth()
  if (!userId) return false
  return (sessionClaims?.metadata as { role?: string })?.role === 'admin'
}

export async function POST(req: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  const playbookId = formData.get('playbookId') as string | null

  if (!file || !playbookId) {
    return NextResponse.json({ error: 'Missing file or playbookId' }, { status: 400 })
  }

  if (!file.name.endsWith('.pdf')) {
    return NextResponse.json({ error: 'Only PDF files accepted' }, { status: 400 })
  }

  try {
    const playbook = await prisma.playbook.findUnique({ where: { id: playbookId } })
    if (!playbook) return NextResponse.json({ error: 'Playbook not found' }, { status: 404 })

    const filePath = `${playbook.slug}.pdf`
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const { error } = await supabaseAdmin.storage
      .from(PLAYBOOKS_BUCKET)
      .upload(filePath, buffer, {
        contentType: 'application/pdf',
        upsert: true,
      })

    if (error) throw error

    await prisma.playbook.update({
      where: { id: playbookId },
      data: { fileUrl: filePath },
    })

    return NextResponse.json({ success: true, filePath })
  } catch (error) {
    console.error('PDF upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
