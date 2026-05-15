import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { getSignedDownloadUrl } from '@/lib/supabase'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
    }

    const { id: playbookId } = await params

    const user = await prisma.user.findUnique({ where: { clerkId: userId } })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Admin can download anything
    const isAdmin = user.role === 'ADMIN'

    if (!isAdmin) {
      // Verify purchase
      const purchase = await prisma.purchase.findFirst({
        where: {
          userId: user.id,
          playbookId,
          paymentStatus: 'PAID',
        },
      })

      if (!purchase) {
        return NextResponse.json({ error: 'Not purchased' }, { status: 403 })
      }
    }

    const playbook = await prisma.playbook.findUnique({
      where: { id: playbookId },
    })

    if (!playbook || !playbook.fileUrl) {
      return NextResponse.json({ error: 'File not available yet' }, { status: 404 })
    }

    const signedUrl = await getSignedDownloadUrl(playbook.fileUrl)
    if (!signedUrl) {
      return NextResponse.json({ error: 'Could not generate download link' }, { status: 500 })
    }

    return NextResponse.json({ url: signedUrl, filename: `${playbook.slug}.pdf` })
  } catch (error) {
    console.error('Download error:', error)
    return NextResponse.json({ error: 'Download failed' }, { status: 500 })
  }
}
