import Link from 'next/link'
import { BookOpen, Mail } from 'lucide-react'

const footerLinks = {
  Knowledge: [
    { href: '/learn', label: 'Free Articles' },
    { href: '/reviews', label: 'Blog & Reviews' },
    { href: '/playbooks', label: 'Playbooks' },
  ],
  Services: [
    { href: '/stringing', label: 'Central London Stringing' },
    { href: '/custom-programmes', label: 'Custom Programmes' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ],
  Legal: [
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
  ],
}

export function Footer() {
  return (
    <footer className="bg-navy-900 text-gray-300">
      <div className="container-lg py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-navy-800 border border-navy-700 rounded-lg flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-lime-400" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Racket<span className="text-lime-400">Logic</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              Tennis knowledge first, with convenient racket pickup and drop-off around London Bridge, Bank and Blackfriars on Tuesday, Wednesday and Thursday.
            </p>
            <div className="mt-5 flex items-center gap-2 text-sm text-gray-400">
              <Mail className="w-4 h-4 text-lime-400" />
              <a href="mailto:hello@racketlogic.co.uk" className="hover:text-lime-400 transition-colors">
                hello@racketlogic.co.uk
              </a>
            </div>
            <p className="mt-2 text-xs text-gray-500">Central London handover + UB5 home drop-off</p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
                {section}
              </h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-lime-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-navy-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            (c) {new Date().getFullYear()} RacketLogic. All rights reserved.
          </p>
          <p className="text-xs text-gray-500">
            Some links may be affiliate links.{' '}
            <Link href="/reviews" className="text-gray-400 hover:text-lime-400 transition-colors">
              Learn more
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}

