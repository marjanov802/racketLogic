import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { resend, FROM_EMAIL, ADMIN_EMAIL } from '@/lib/resend'
import { auth } from '@clerk/nextjs/server'
import { z } from 'zod'

const bookingSchema = z.object({
  customerName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  racketModel: z.string().optional(),
  currentString: z.string().optional(),
  currentTension: z.string().optional(),
  desiredTension: z.string().optional(),
  playingLevel: z.string().optional(),
  howOften: z.string().optional(),
  playGoals: z.array(z.string()).optional(),
  armIssues: z.boolean().optional(),
  armIssuesDetail: z.string().optional(),
  serviceType: z.string().min(1),
  deliveryMethod: z.string().min(1),
  notes: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = bookingSchema.parse(body)

    const { userId } = await auth()

    // Look up internal user if signed in
    let internalUserId: string | undefined
    if (userId) {
      const user = await prisma.user.findUnique({ where: { clerkId: userId } })
      internalUserId = user?.id
    }

    const booking = await prisma.booking.create({
      data: {
        userId: internalUserId,
        serviceType: data.serviceType,
        customerName: data.customerName,
        email: data.email,
        phone: data.phone ?? '',
        racketModel: data.racketModel,
        currentString: data.currentString,
        currentTension: data.currentTension,
        desiredTension: data.desiredTension,
        playingLevel: data.playingLevel,
        howOften: data.howOften,
        playGoals: data.playGoals ?? [],
        armIssues: data.armIssues ?? false,
        armIssuesDetail: data.armIssuesDetail,
        deliveryMethod: data.deliveryMethod,
        notes: data.notes,
        status: 'NEW',
        paymentStatus: 'UNPAID',
      },
    })

    // Send confirmation email to customer
    await resend.emails.send({
      from: FROM_EMAIL,
      to: data.email,
      subject: 'Booking received — RacketLogic Stringing',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0f172a;">Booking received</h2>
          <p>Hi ${data.customerName},</p>
          <p>Thanks for booking with RacketLogic. We have received your stringing request and will be in touch within 24 hours to confirm your booking and arrange the next steps.</p>
          <h3 style="color: #0f172a;">Your booking summary</h3>
          <ul>
            <li><strong>Service:</strong> ${data.serviceType.replace(/-/g, ' ')}</li>
            <li><strong>Racket:</strong> ${data.racketModel ?? 'Not specified'}</li>
            <li><strong>Delivery:</strong> ${data.deliveryMethod.replace(/-/g, ' ')}</li>
          </ul>
          <p>If you have any questions, reply to this email or contact us at <a href="mailto:hello@racketlogic.co.uk">hello@racketlogic.co.uk</a>.</p>
          <p style="color: #6b7280; font-size: 12px; margin-top: 24px;">RacketLogic — Smarter tennis setups, built around your game.</p>
        </div>
      `,
    })

    // Notify admin
    await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `New stringing booking — ${data.customerName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0f172a;">New stringing booking</h2>
          <ul>
            <li><strong>Name:</strong> ${data.customerName}</li>
            <li><strong>Email:</strong> ${data.email}</li>
            <li><strong>Phone:</strong> ${data.phone ?? '—'}</li>
            <li><strong>Service:</strong> ${data.serviceType}</li>
            <li><strong>Racket:</strong> ${data.racketModel ?? '—'}</li>
            <li><strong>Current string:</strong> ${data.currentString ?? '—'}</li>
            <li><strong>Current tension:</strong> ${data.currentTension ?? '—'}</li>
            <li><strong>Desired tension:</strong> ${data.desiredTension ?? '—'}</li>
            <li><strong>Level:</strong> ${data.playingLevel ?? '—'}</li>
            <li><strong>Goals:</strong> ${(data.playGoals ?? []).join(', ') || '—'}</li>
            <li><strong>Arm issues:</strong> ${data.armIssues ? 'Yes' : 'No'}</li>
            <li><strong>Arm detail:</strong> ${data.armIssuesDetail ?? '—'}</li>
            <li><strong>Delivery:</strong> ${data.deliveryMethod}</li>
            <li><strong>Notes:</strong> ${data.notes ?? '—'}</li>
          </ul>
          <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/bookings/${booking.id}">View in admin →</a></p>
        </div>
      `,
    })

    return NextResponse.json({ success: true, bookingId: booking.id })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid booking data', details: error.errors }, { status: 400 })
    }
    console.error('Booking error:', error)
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { clerkId: userId } })
    if (!user) return NextResponse.json({ bookings: [] })

    const bookings = await prisma.booking.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ bookings })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 })
  }
}
