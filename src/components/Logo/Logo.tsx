'use client'

import clsx from 'clsx'
import React from 'react'
import { useI18n } from '@/i18n/client'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
  invert?: boolean
}

export const Logo = (props: Props) => {
  const { className, invert = false } = props
  const { t } = useI18n()

  return (
    <div className={clsx('flex items-center gap-2.5', className)}>
      <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--coral)] to-[var(--ink)] text-xs leading-none font-bold tracking-wide text-white shadow-sm">
        HT
      </div>
      <span
        className={clsx(
          'text-xl font-extrabold tracking-tight',
          invert ? 'text-white' : 'text-foreground',
        )}
        style={{ fontFamily: 'Cairo, sans-serif' }}
      >
        {t('common.brandText')}
      </span>
    </div>
  )
}
