import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY)

export const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? 'hello@racketlogic.co.uk'
export const ADMIN_EMAIL = process.env.RESEND_ADMIN_EMAIL ?? 'admin@racketlogic.co.uk'
