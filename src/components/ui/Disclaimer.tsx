import { cn } from '@/lib/utils'
import { AlertCircle } from 'lucide-react'

interface DisclaimerProps {
  type: 'medical' | 'nutrition' | 'affiliate' | 'general'
  className?: string
}

const disclaimerText = {
  medical:
    'RacketLogic provides general tennis training and performance information only. This is not medical advice. If you have pain, injury, or medical concerns, speak to a qualified medical professional or physiotherapist.',
  nutrition:
    'RacketLogic provides general tennis fuelling and hydration information only. This is not medical or dietetic advice. For allergies, health conditions, weight management, or personalised diet plans, speak to a qualified nutritionist, dietitian, or medical professional.',
  affiliate:
    'Some links on this page are affiliate links. RacketLogic may earn a small commission if you buy through these links, at no extra cost to you.',
  general:
    'The information on this page is provided for general guidance only. Individual results may vary.',
}

export function Disclaimer({ type, className }: DisclaimerProps) {
  return (
    <div
      className={cn(
        'flex gap-3 p-4 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-600',
        className
      )}
    >
      <AlertCircle className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
      <p>{disclaimerText[type]}</p>
    </div>
  )
}
