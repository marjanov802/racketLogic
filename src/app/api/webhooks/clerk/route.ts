import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Clerk sends webhooks on user.created, user.updated, user.deleted
// This keeps our local User table in sync with Clerk
// Set up at: https://dashboard.clerk.com/webhooks
// Events to enable: user.created, user.updated, user.deleted

interface ClerkUser {
  id: string
  first_name: string | null
  last_name: string | null
  email_addresses: { email_address: string; id: string }[]
  primary_email_address_id: string
}

export async function POST(req: NextRequest) {
  const event = await req.json()

  try {
    if (event.type === 'user.created') {
      const user: ClerkUser = event.data
      const primaryEmail = user.email_addresses.find(
        (e) => e.id === user.primary_email_address_id
      )?.email_address

      if (!primaryEmail) {
        return NextResponse.json({ error: 'No email' }, { status: 400 })
      }

      await prisma.user.upsert({
        where: { clerkId: user.id },
        update: {},
        create: {
          clerkId: user.id,
          name: `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim() || null,
          email: primaryEmail,
        },
      })
    }

    if (event.type === 'user.updated') {
      const user: ClerkUser = event.data
      const primaryEmail = user.email_addresses.find(
        (e) => e.id === user.primary_email_address_id
      )?.email_address

      if (!primaryEmail) return NextResponse.json({ received: true })

      await prisma.user.update({
        where: { clerkId: user.id },
        data: {
          name: `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim() || null,
          email: primaryEmail,
        },
      })
    }

    if (event.type === 'user.deleted') {
      const { id } = event.data
      await prisma.user.deleteMany({ where: { clerkId: id } })
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Clerk webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
