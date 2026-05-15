'use client'

import { cn } from '@/lib/utils'

interface CheckboxProps {
  label: string
  checked?: boolean
  onChange?: (checked: boolean) => void
  className?: string
  id?: string
}

export function Checkbox({ label, checked, onChange, className, id }: CheckboxProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-')

  return (
    <label
      htmlFor={inputId}
      className={cn('flex items-center gap-2.5 cursor-pointer group', className)}
    >
      <div className="relative flex items-center justify-center">
        <input
          type="checkbox"
          id={inputId}
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
          className="sr-only"
        />
        <div
          className={cn(
            'w-5 h-5 rounded border-2 flex items-center justify-center transition-colors',
            checked
              ? 'bg-lime-500 border-lime-500'
              : 'border-gray-300 bg-white group-hover:border-lime-400'
          )}
        >
          {checked && (
            <svg className="w-3 h-3 text-navy-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  )
}
