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
  stringName: z.string().optional(),
  desiredTension: z.string().optional(),
  howOften: z.string().optional(),
  playGoals: z.array(z.string()).optional(),
  armIssues: z.boolean().optional(),
  armIssuesDetail: z.string().optional(),
  serviceType: z.string().min(1),
  dropOffLocation: z.string().min(1),
  paymentPreference: z.string().optional(),
  notes: z.string().optional(),
})

const DROP_OFF_LABELS: Record<string, string> = {
  'central-london': 'Central London pickup/drop-off - London Bridge, Bank, Blackfriars or nearby - Tue/Wed/Thu',
  'home-ub5': 'Home address - Northolt (UB5) - 24hr turnaround available',
  'mutual': 'Requested club/local area - not confirmed until RacketLogic replies',
}

const PAYMENT_LABELS: Record<string, string> = {
  'cash-on-collection': 'Cash on collection',
  'bank-transfer': 'Bank transfer before collection',
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = bookingSchema.parse(body)

    let userId: string | null = null

    try {
      const authResult = await auth()
      userId = authResult.userId
    } catch (authError) {
      console.warn('Booking submitted without Clerk auth context:', authError)
    }

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
        stringName: data.stringName,
        desiredTension: data.desiredTension,
        howOften: data.howOften,
        playGoals: data.playGoals ?? [],
        armIssues: data.armIssues ?? false,
        armIssuesDetail: data.armIssuesDetail,
        dropOffLocation: data.dropOffLocation,
        paymentPreference: data.paymentPreference,
        notes: data.notes,
        status: 'NEW',
        paymentStatus: 'UNPAID',
      },
    })

    const dropOffLabel = DROP_OFF_LABELS[data.dropOffLocation] ?? data.dropOffLocation
    const paymentLabel = data.paymentPreference
      ? PAYMENT_LABELS[data.paymentPreference] ?? data.paymentPreference
      : 'To be confirmed'

    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: data.email,
        subject: 'Booking received - RacketLogic Stringing',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #0f172a;">Booking received</h2>
            <p>Hi ${data.customerName},</p>
            <p>Thanks for booking with RacketLogic. We have received your stringing request and will be in touch within 4 daytime hours to confirm your booking, the drop-off plan and payment details.</p>
            <h3 style="color: #0f172a;">Your booking summary</h3>
            <ul>
              <li><strong>Service:</strong> ${data.serviceType.replace(/-/g, ' ')}</li>
              <li><strong>Racket:</strong> ${data.racketModel ?? 'Not specified'}</li>
              <li><strong>Drop-off / collection:</strong> ${dropOffLabel}</li>
              <li><strong>Payment:</strong> ${paymentLabel}</li>
            </ul>
            <p>No deposit is required. The full amount can be paid by cash on collection or by bank transfer before collection/return. If bank transfer is selected, bank details will be sent after the booking is confirmed.</p>
            <p>If you have any questions, reply to this email or contact us at <a href="mailto:hello@racket-logic.com">hello@racket-logic.com</a>.</p>
            <p style="color: #6b7280; font-size: 12px; margin-top: 24px;">RacketLogic - Tennis knowledge first. Stringing when you need it.</p>
          </div>
        `,
      })
      await resend.emails.send({
        from: FROM_EMAIL,
        to: ADMIN_EMAIL,
        subject: `New stringing booking - ${data.customerName}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #0f172a;">New stringing booking</h2>
            <ul>
              <li><strong>Name:</strong> ${data.customerName}</li>
              <li><strong>Email:</strong> ${data.email}</li>
              <li><strong>Phone:</strong> ${data.phone ?? '-'}</li>
              <li><strong>Service:</strong> ${data.serviceType}</li>
              <li><strong>Racket:</strong> ${data.racketModel ?? '-'}</li>
              <li><strong>String:</strong> ${data.stringName ?? '-'}</li>
              <li><strong>Desired tension:</strong> ${data.desiredTension ?? '-'}</li>
              <li><strong>Drop-off / collection:</strong> ${dropOffLabel}</li>
              <li><strong>Payment:</strong> ${paymentLabel}</li>
              <li><strong>Notes:</strong> ${data.notes ?? '-'}</li>
            </ul>
            <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/bookings/${booking.id}">View in admin</a></p>
          </div>
        `,
      })
    } catch (emailError) {
      console.error('Booking email failed:', emailError)
    }

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
