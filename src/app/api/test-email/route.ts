import { NextResponse } from 'next/server'
import { resend, FROM_EMAIL, ADMIN_EMAIL } from '@/lib/resend'

export async function GET() {
  const config = {
    fromEmail: FROM_EMAIL,
    adminEmail: ADMIN_EMAIL,
    hasApiKey: !!process.env.RESEND_API_KEY,
    apiKeyPrefix: process.env.RESEND_API_KEY?.slice(0, 8) ?? 'missing',
  }

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: 'RacketLogic — test email',
      html: '<p>Test email sent from the /api/test-email endpoint.</p>',
    })

    return NextResponse.json({ ok: true, config, result })
  } catch (error) {
    return NextResponse.json(
      { ok: false, config, error: String(error) },
      { status: 500 }
    )
  }
}
