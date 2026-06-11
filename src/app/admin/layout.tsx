import Link from 'next/link'
import { Zap, LayoutDashboard, Calendar, BookOpen, Star, FileText, Users, TrendingUp, MessageSquare, Home } from 'lucide-react'

export const dynamic = 'force-dynamic'

const navItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Overview' },
  { href: '/admin/home', icon: Home, label: 'Home Page' },
  { href: '/admin/bookings', icon: Calendar, label: 'Bookings' },
  { href: '/admin/playbooks', icon: BookOpen, label: 'Playbooks' },
  { href: '/admin/reviews', icon: Star, label: 'Reviews' },
  { href: '/admin/articles', icon: FileText, label: 'Learn Articles' },
  { href: '/admin/enquiries', icon: MessageSquare, label: 'Enquiries' },
  { href: '/admin/users', icon: Users, label: 'Users' },
  { href: '/admin/revenue', icon: TrendingUp, label: 'Revenue' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-60 bg-navy-900 text-white flex flex-col fixed h-full z-20">
        <div className="p-5 border-b border-navy-800">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-lime-500 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-navy-900" />
            </div>
            <div>
              <span className="text-sm font-bold text-white">RacketLogic</span>
              <p className="text-xs text-gray-500">Admin Panel</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-gray-300 hover:text-white hover:bg-navy-800 transition-colors"
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-navy-800">
          <Link href="/" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
            ← Back to website
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 ml-60 min-h-screen">
        {children}
      </main>
    </div>
  )
}
