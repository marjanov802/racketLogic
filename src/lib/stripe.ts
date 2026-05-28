import Stripe from 'stripe'

let _client: Stripe | null = null

function getInstance(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not configured')
  }
  _client ??= new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-02-24.acacia',
    typescript: true,
  })
  return _client
}

export function getStripe(): Stripe {
  return getInstance()
}
