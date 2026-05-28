import React from 'react'
import { cn } from '@/utilities/ui'

type Props = {
  className?: string
  label?: string
}

export const CertificationBadge: React.FC<Props> = ({
  className,
  label = 'European Certified',
}) => {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border border-teal-600/30 bg-teal-50 px-2.5 py-0.5 text-xs font-semibold text-teal-800 dark:border-teal-400/40 dark:bg-teal-950/50 dark:text-teal-200',
        className,
      )}
    >
      <span aria-hidden className="size-1.5 rounded-full bg-teal-600 dark:bg-teal-400" />
      {label}
    </span>
  )
}
