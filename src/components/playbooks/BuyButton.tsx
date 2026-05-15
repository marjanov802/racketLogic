'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { toast } from 'sonner'

interface Props {
  playbookId: string
  price: number
  title: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function BuyButton({ playbookId, price, title, className, size = 'md' }: Props) {
  const { isSignedIn } = useUser()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleBuy() {
    if (!isSignedIn) {
      router.push(`/sign-in?redirect_url=/playbooks`)
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playbookId }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error ?? 'Failed to create checkout session')
      }

      const { url } = await res.json()
      if (url) window.location.href = url
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handleBuy}
      loading={loading}
      size={size}
      className={className}
    >
      <ShoppingCart className="w-4 h-4" />
      Buy now — £{price.toFixed(2)}
    </Button>
  )
}
