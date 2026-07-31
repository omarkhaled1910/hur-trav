import React from 'react'

import { cn } from '@/utilities/ui'

type Props = {
  className?: string
  flip?: boolean
}

export const WaveDivider: React.FC<Props> = ({ className, flip }) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 1440 100"
    preserveAspectRatio="none"
    className={cn('pointer-events-none block h-12 w-full md:h-20', flip && 'rotate-180', className)}
  >
    <path
      d="M0,40 C240,90 480,0 720,30 C960,60 1200,95 1440,35 L1440,100 L0,100 Z"
      fill="currentColor"
    />
  </svg>
)
