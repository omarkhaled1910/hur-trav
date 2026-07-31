'use client'

import React from 'react'

import { useI18n } from '@/i18n/client'
import type { Locale } from '@/i18n/translations'
import { cn } from '@/utilities/ui'

type Props = {
  invert?: boolean
}

export const LanguageSwitcher: React.FC<Props> = ({ invert = false }) => {
  const { locale, setLocale, t } = useI18n()

  const handleChange = (nextLocale: Locale) => {
    if (nextLocale !== locale) {
      setLocale(nextLocale)
    }
  }

  const baseButton =
    'rounded-full px-3 py-1.5 text-xs font-semibold transition-colors leading-none'
  const activeButton = 'bg-[var(--coral)] text-white'
  const inactiveButton = invert
    ? 'text-white/60 hover:text-white'
    : 'text-muted-foreground hover:text-foreground'

  return (
    <div
      className={cn(
        'inline-flex items-center gap-0.5 rounded-full border p-0.5',
        invert ? 'border-white/15' : 'border-border',
      )}
    >
      <button
        type="button"
        onClick={() => handleChange('ar')}
        aria-label={t('language.arabic')}
        aria-pressed={locale === 'ar'}
        className={cn(baseButton, locale === 'ar' ? activeButton : inactiveButton)}
      >
        ع
      </button>
      <button
        type="button"
        onClick={() => handleChange('en')}
        aria-label={t('language.english')}
        aria-pressed={locale === 'en'}
        className={cn(baseButton, locale === 'en' ? activeButton : inactiveButton)}
      >
        EN
      </button>
    </div>
  )
}
