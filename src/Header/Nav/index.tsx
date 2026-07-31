'use client'

import React from 'react'
import { SearchIcon } from 'lucide-react'
import Link from 'next/link'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { useI18n } from '@/i18n/client'

const navLinkClass =
  'text-sm font-medium text-foreground/80 transition-colors hover:text-[var(--coral)]'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []
  const { t } = useI18n()

  return (
    <>
      {navItems.map(({ link }, i) => (
        <CMSLink key={i} {...link} appearance="link" className={navLinkClass} />
      ))}
      <Link
        href="/search"
        className="text-foreground/70 transition-colors hover:text-[var(--coral)]"
      >
        <span className="sr-only">{t('nav.search')}</span>
        <SearchIcon className="size-[18px]" />
      </Link>
    </>
  )
}
