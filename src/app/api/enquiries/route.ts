import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { resend, FROM_EMAIL, ADMIN_EMAIL } from '@/lib/resend'
import { z } from 'zod'

const enquirySchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  age: z.string().optional(),
  playingLevel: z.string().min(1),
  yearsPlaying: z.string().optional(),
  howOften: z.string().optional(),
  goal: z.string().min(1),
  weakness: z.string().optional(),
  currentRoutine: z.string().optional(),
  trainingDaysPerWeek: z.string().optional(),
  sessionLength: z.string().optional(),
  playsMatches: z.boolean().optional(),
  hasCoaching: z.boolean().optional(),
  injuriesOrLimitations: z.string().optional(),
  areasToImprove: z.array(z.string()).optional(),
  programmeDuration: z.string().optional(),
  notes: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = enquirySchema.parse(body)

    const enquiry = await prisma.customProgrammeEnquiry.create({
      data: {
        name: data.name,
        email: data.email,
        age: data.age,
        playingLevel: data.playingLevel,
        yearsPlaying: data.yearsPlaying,
        howOften: data.howOften,
        goal: data.goal,
        weakness: data.weakness,
        currentRoutine: data.currentRoutine,
        trainingDaysPerWeek: data.trainingDaysPerWeek,
        sessionLength: data.sessionLength,
        playsMatches: data.playsMatches ?? false,
        hasCoaching: data.hasCoaching ?? false,
        injuriesOrLimitations: data.injuriesOrLimitations,
        areasToImprove: data.areasToImprove ?? [],
        programmeDuration: data.programmeDuration,
        notes: data.notes,
        status: 'NEW',
      },
    })

    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: data.email,
        subject: 'Custom programme enquiry received — RacketLogic',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #0f172a;">Enquiry received</h2>
            <p>Hi ${data.name},</p>
            <p>Thanks for getting in touch about a custom programme. We have received your enquiry and will email you within 48 hours to discuss the details and confirm pricing before anything begins.</p>
            <p>Your main goal: <strong>${data.goal}</strong></p>
            <p>If you have any questions in the meantime, reply to this email or contact us at <a href="mailto:hello@racket-logic.com">hello@racket-logic.com</a>.</p>
            <p style="color: #6b7280; font-size: 12px; margin-top: 24px;">RacketLogic — Smarter tennis setups, built around your game.</p>
          </div>
        `,
      })
      await resend.emails.send({
        from: FROM_EMAIL,
        to: ADMIN_EMAIL,
        subject: `New custom programme enquiry — ${data.name}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>New custom programme enquiry</h2>
            <ul>
              <li><strong>Name:</strong> ${data.name}</li>
              <li><strong>Email:</strong> ${data.email}</li>
              <li><strong>Level:</strong> ${data.playingLevel}</li>
              <li><strong>Goal:</strong> ${data.goal}</li>
              <li><strong>Weakness:</strong> ${data.weakness ?? '—'}</li>
              <li><strong>Areas:</strong> ${(data.areasToImprove ?? []).join(', ') || '—'}</li>
              <li><strong>Duration:</strong> ${data.programmeDuration ?? '—'}</li>
              <li><strong>Injuries:</strong> ${data.injuriesOrLimitations ?? '—'}</li>
              <li><strong>Notes:</strong> ${data.notes ?? '—'}</li>
            </ul>
            <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/enquiries/${enquiry.id}">View in admin →</a></p>
          </div>
        `,
      })
    } catch (emailError) {
      console.error('Enquiry email failed:', emailError)
    }

    return NextResponse.json({ success: true, id: enquiry.id })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 })
    }
    console.error('Enquiry error:', error)
    return NextResponse.json({ error: 'Failed to submit enquiry' }, { status: 500 })
  }
}
