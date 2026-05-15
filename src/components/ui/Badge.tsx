import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'lime' | 'navy' | 'green' | 'red' | 'yellow' | 'gray'
  className?: string
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    lime:    'bg-lime-100 text-lime-800',
    navy:    'bg-navy-100 text-navy-800',
    green:   'bg-green-100 text-green-800',
    red:     'bg-red-100 text-red-700',
    yellow:  'bg-yellow-100 text-yellow-800',
    gray:    'bg-gray-100 text-gray-600',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
