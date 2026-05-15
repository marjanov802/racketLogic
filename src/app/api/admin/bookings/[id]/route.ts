import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { resend, FROM_EMAIL } from '@/lib/resend'

async function requireAdmin() {
  const { userId, sessionClaims } = await auth()
  if (!userId) return false
  const role = (sessionClaims?.metadata as { role?: string })?.role
  return role === 'admin'
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await requireAdmin()) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const { id } = await params
  const body = await req.json()

  try {
    const booking = await prisma.booking.update({
      where: { id },
      data: {
        status: body.status,
        paymentStatus: body.paymentStatus,
        adminNotes: body.adminNotes,
        price: body.price ?? undefined,
      },
    })

    // Send status update email if status changed to meaningful state
    if (['CONFIRMED', 'READY_FOR_COLLECTION', 'COMPLETED'].includes(body.status)) {
      const statusMessages: Record<string, string> = {
        CONFIRMED: 'Your stringing booking has been confirmed.',
        READY_FOR_COLLECTION: 'Your racket is ready for collection.',
        COMPLETED: 'Your stringing has been completed.',
      }
      await resend.emails.send({
        from: FROM_EMAIL,
        to: booking.email,
        subject: `Booking update — RacketLogic`,
        html: `<p>Hi ${booking.customerName},</p><p>${statusMessages[body.status]}</p><p>If you have any questions, reply to this email or contact us at hello@racketlogic.co.uk.</p>`,
      })
    }

    return NextResponse.json({ success: true, booking })
  } catch (error) {
    console.error('Update booking error:', error)
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 })
  }
}
