'use client'

import clsx from 'clsx'
import React from 'react'
import { useI18n } from '@/i18n/client'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
}

export const Logo = (props: Props) => {
  const { className } = props
  const { t } = useI18n()

  return (
    <div className={clsx('flex items-center gap-2', className)}>
      <div className="bg-teal-700 text-white font-bold text-sm px-2.5 py-1 rounded-md leading-none tracking-wide">
        HT
      </div>
      <span
        className="text-xl font-bold text-foreground dark:text-white"
        style={{ fontFamily: 'Cairo, sans-serif' }}
      >
        {t('common.brandText')}
      </span>
    </div>
  )
}
