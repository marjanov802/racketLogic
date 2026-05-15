import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { resend, FROM_EMAIL, ADMIN_EMAIL } from '@/lib/resend'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  enquiryType: z.string().min(1),
  message: z.string().min(5),
  preferredDate: z.string().optional(),
  racketDetails: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = schema.parse(body)

    await prisma.contactEnquiry.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        enquiryType: data.enquiryType,
        message: data.message,
        preferredDate: data.preferredDate,
        racketDetails: data.racketDetails,
      },
    })

    await resend.emails.send({
      from: FROM_EMAIL,
      to: data.email,
      subject: 'Message received — RacketLogic',
      html: `<p>Hi ${data.name},</p><p>Thanks for getting in touch with RacketLogic. We will respond within 24–48 hours.</p><p>Your message: <em>${data.message}</em></p>`,
    })

    await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `Contact form — ${data.enquiryType} — ${data.name}`,
      html: `<h3>Contact enquiry</h3><ul><li>Name: ${data.name}</li><li>Email: ${data.email}</li><li>Type: ${data.enquiryType}</li><li>Message: ${data.message}</li><li>Preferred date: ${data.preferredDate ?? '—'}</li><li>Racket: ${data.racketDetails ?? '—'}</li></ul>`,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
    }
    console.error('Contact error:', error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
