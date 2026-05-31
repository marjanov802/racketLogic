'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { cn } from '@/lib/utils'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { href: '/stringing', label: 'Stringing' },
  { href: '/reviews', label: 'Blog' },
  { href: '/learn', label: 'Learn' },
  { href: '/playbooks', label: 'Playbooks' },
  { href: '/about', label: 'About' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isActive = (href: string) =>
    pathname === href || (href !== '/' && pathname.startsWith(href))

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-all duration-500',
        scrolled
          ? 'bg-navy-950/95 backdrop-blur-md border-b border-lime-500/10 shadow-lg shadow-black/40'
          : 'bg-navy-950 border-b border-white/5'
      )}
    >
      <div className="container-lg">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 border border-lime-500/40 rounded flex items-center justify-center group-hover:border-lime-400/70 transition-all duration-300 group-hover:shadow-[0_0_12px_rgba(212,174,85,0.3)]">
              <span className="font-serif font-bold text-sm text-lime-400 group-hover:text-lime-300 transition-colors">R</span>
            </div>
            <span className="text-base font-medium text-white tracking-wide">
              Racket<span className="text-lime-400 font-semibold">Logic</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-4 py-2 text-sm tracking-wide transition-all duration-200 rounded relative group',
                  isActive(link.href)
                    ? 'text-lime-300'
                    : 'text-gray-400 hover:text-white'
                )}
              >
                {link.label}
                {isActive(link.href) && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-px bg-lime-400" />
                )}
              </Link>
            ))}
          </nav>

          {/* CTA + Auth */}
          <div className="hidden lg:flex items-center gap-4">
            <Link href="/stringing#book">
              <button className="px-5 py-2 text-sm font-semibold bg-lime-500 text-navy-950 rounded hover:bg-lime-400 active:bg-lime-600 transition-all duration-200 hover:shadow-[0_0_20px_rgba(212,174,85,0.4)] tracking-wide">
                Central London Stringing
              </button>
            </Link>
            <SignedIn>
              <Link href="/dashboard">
                <button className="text-sm font-medium text-gray-400 hover:text-white transition-colors duration-200">
                  Dashboard
                </button>
              </Link>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <SignedOut>
              <Link href="/sign-in">
                <button className="text-sm font-medium text-gray-400 hover:text-white transition-colors duration-200">
                  Sign In
                </button>
              </Link>
            </SignedOut>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors rounded"
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={cn(
        'lg:hidden border-t border-white/5 bg-navy-950 overflow-hidden transition-all duration-300',
        open ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
      )}>
        <div className="container-lg py-4 flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={cn(
                'px-4 py-3 text-sm font-medium rounded transition-colors duration-200',
                isActive(link.href) ? 'text-lime-400' : 'text-gray-400 hover:text-white'
              )}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-3 pt-3 border-t border-white/5 flex flex-col gap-2">
            <Link href="/stringing#book" onClick={() => setOpen(false)}>
              <button className="w-full py-2.5 text-sm font-semibold bg-lime-500 text-navy-950 rounded hover:bg-lime-400 transition-colors">
                Central London Stringing
              </button>
            </Link>
            <Link href="/stringing" onClick={() => setOpen(false)}>
              <button className="w-full py-2.5 text-sm font-medium text-gray-300 hover:text-white transition-colors border border-white/10 rounded">
                Book Stringing
              </button>
            </Link>
            <SignedIn>
              <Link href="/dashboard" onClick={() => setOpen(false)}>
                <button className="w-full py-2.5 text-sm font-medium text-gray-300 hover:text-white transition-colors border border-white/10 rounded">
                  My Dashboard
                </button>
              </Link>
            </SignedIn>
            <SignedOut>
              <Link href="/sign-in" onClick={() => setOpen(false)}>
                <button className="w-full py-2.5 text-sm text-gray-400 hover:text-white transition-colors">
                  Sign In
                </button>
              </Link>
            </SignedOut>
          </div>
        </div>
      </div>
    </header>
  )
}
