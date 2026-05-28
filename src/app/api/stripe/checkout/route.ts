import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getStripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
    }

    const { playbookId } = await req.json()
    if (!playbookId) {
      return NextResponse.json({ error: 'playbookId required' }, { status: 400 })
    }

    const playbook = await prisma.playbook.findUnique({
      where: { id: playbookId, published: true },
    })
    if (!playbook) {
      return NextResponse.json({ error: 'Playbook not found' }, { status: 404 })
    }

    const user = await prisma.user.findUnique({ where: { clerkId: userId } })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check already purchased
    const existing = await prisma.purchase.findFirst({
      where: { userId: user.id, playbookId, paymentStatus: 'PAID' },
    })
    if (existing) {
      return NextResponse.json({ error: 'Already purchased' }, { status: 400 })
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

    const session = await getStripe().checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: playbook.title,
              description: playbook.description,
              metadata: { playbookId: playbook.id, slug: playbook.slug },
            },
            unit_amount: Math.round(Number(playbook.price) * 100),
          },
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/dashboard?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/playbooks/${playbook.slug}?payment=cancelled`,
      metadata: {
        playbookId: playbook.id,
        userId: user.id,
        type: 'playbook',
      },
      customer_email: user.email,
    })

    // Create pending purchase record
    await prisma.purchase.create({
      data: {
        userId: user.id,
        playbookId: playbook.id,
        productType: playbook.isBundle ? 'bundle' : 'playbook',
        amount: playbook.price,
        stripeSessionId: session.id,
        paymentStatus: 'UNPAID',
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
