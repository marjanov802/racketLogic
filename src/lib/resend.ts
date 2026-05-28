import { Resend } from 'resend'

let resendClient: Resend | null = null

function getResendClient() {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not configured')
  }

  resendClient ??= new Resend(process.env.RESEND_API_KEY)
  return resendClient
}

export const resend = {
  emails: {
    send: (...args: Parameters<Resend['emails']['send']>) => getResendClient().emails.send(...args),
  },
}

export const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? 'hello@racketlogic.co.uk'
export const ADMIN_EMAIL = process.env.RESEND_ADMIN_EMAIL ?? 'admin@racketlogic.co.uk'
