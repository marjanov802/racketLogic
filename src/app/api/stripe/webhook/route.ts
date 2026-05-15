import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { resend, FROM_EMAIL, ADMIN_EMAIL } from '@/lib/resend'
import type Stripe from 'stripe'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature error:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    try {
      // Mark purchase as paid
      const purchase = await prisma.purchase.updateMany({
        where: { stripeSessionId: session.id },
        data: { paymentStatus: 'PAID' },
      })

      if (purchase.count === 0) {
        console.warn('No purchase found for session:', session.id)
        return NextResponse.json({ received: true })
      }

      // Get the updated purchase + user info
      const updatedPurchase = await prisma.purchase.findFirst({
        where: { stripeSessionId: session.id },
        include: { user: true, playbook: true },
      })

      if (updatedPurchase?.user && updatedPurchase.playbook) {
        const { user, playbook } = updatedPurchase

        // If it's a bundle, grant access to all included playbooks
        if (playbook.isBundle) {
          const bundleItems = await prisma.bundleItem.findMany({
            where: { bundleId: playbook.id },
            include: { playbook: true },
          })

          for (const item of bundleItems) {
            const existing = await prisma.purchase.findFirst({
              where: {
                userId: user.id,
                playbookId: item.playbookId,
                paymentStatus: 'PAID',
              },
            })
            if (!existing) {
              await prisma.purchase.create({
                data: {
                  userId: user.id,
                  playbookId: item.playbookId,
                  productType: 'playbook',
                  amount: 0,
                  paymentStatus: 'PAID',
                },
              })
            }
          }
        }

        // Send confirmation email to customer
        await resend.emails.send({
          from: FROM_EMAIL,
          to: user.email,
          subject: `Your RacketLogic playbook — ${playbook.title}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #0f172a;">Payment confirmed</h2>
              <p>Hi ${user.name ?? 'there'},</p>
              <p>Thank you for purchasing <strong>${playbook.title}</strong>. Your PDF is now available in your RacketLogic dashboard.</p>
              <p>
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard"
                   style="background: #84cc16; color: #0f172a; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
                  Download your playbook
                </a>
              </p>
              <p style="margin-top: 24px; color: #6b7280; font-size: 12px;">
                If you have any questions, reply to this email or contact us at hello@racketlogic.co.uk
              </p>
            </div>
          `,
        })

        // Notify admin
        await resend.emails.send({
          from: FROM_EMAIL,
          to: ADMIN_EMAIL,
          subject: `New playbook purchase — ${playbook.title}`,
          html: `<p>New purchase: <strong>${playbook.title}</strong> by ${user.email} (£${Number(updatedPurchase.amount).toFixed(2)})</p>`,
        })
      }
    } catch (err) {
      console.error('Webhook processing error:', err)
      return NextResponse.json({ error: 'Processing failed' }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
}
