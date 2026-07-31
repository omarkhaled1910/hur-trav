'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { MapPin, Menu, X } from 'lucide-react'

import type { Header } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { HeaderNav } from './Nav'
import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/i18n/client'
import { cn } from '@/utilities/ui'

interface HeaderClientProps {
  data: Header
}

const navLinkClass = 'text-sm font-medium text-foreground/80 transition-colors hover:text-[var(--coral)]'
const mobileNavLinkClass =
  'py-2.5 text-base font-medium text-foreground transition-colors hover:text-[var(--coral)]'

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  /* Storing the value in a useState to avoid hydration errors */
  const [theme, setTheme] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const { t } = useI18n()
  const pathname = usePathname()

  useEffect(() => {
    setHeaderTheme(null)
    setMenuOpen(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  const navItems = data?.navItems || []

  return (
    <header className="sticky top-0 z-50" {...(theme ? { 'data-theme': theme } : {})}>
      {/* Utility bar */}
      <div className="hidden bg-[var(--ink-deep)] text-white md:block">
        <div className="container flex items-center justify-between py-1.5 text-xs">
          <span className="inline-flex items-center gap-1.5 text-white/70">
            <MapPin className="size-3 text-[var(--gold)]" />
            {t('common.location')}
          </span>
          <Link
            href="/consultation"
            className="font-medium text-[var(--gold)] transition-colors hover:text-white"
          >
            {t('home.ctaConsultation')}
          </Link>
        </div>
      </div>

      {/* Main nav */}
      <div className="border-b border-border bg-background/90 backdrop-blur-md">
        <div className="container flex items-center justify-between py-3.5">
          <Link href="/" className="shrink-0">
            <Logo />
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            <Link href="/" className={navLinkClass}>
              {t('nav.home')}
            </Link>
            <Link href="/doctors" className={navLinkClass}>
              {t('nav.doctors')}
            </Link>
            <Link href="/consultation" className={navLinkClass}>
              {t('nav.consultation')}
            </Link>
            <HeaderNav data={data} />
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-3 md:flex">
              <LanguageSwitcher />
              <ThemeSelector />
            </div>
            <Button
              asChild
              size="sm"
              className="hidden rounded-full bg-[var(--coral)] px-5 text-white hover:bg-[var(--coral-strong)] md:inline-flex"
            >
              <Link href="/consultation">{t('home.ctaConsultation')}</Link>
            </Button>

            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? t('nav.closeMenu') : t('nav.openMenu')}
              aria-expanded={menuOpen}
              className="-me-1.5 flex size-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted md:hidden"
            >
              {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          'overflow-hidden border-b border-border bg-background transition-[max-height] duration-300 ease-out md:hidden',
          menuOpen ? 'max-h-[28rem]' : 'max-h-0 border-b-0',
        )}
      >
        <nav className="container flex flex-col divide-y divide-border py-2">
          <Link href="/" className={mobileNavLinkClass}>
            {t('nav.home')}
          </Link>
          <Link href="/doctors" className={mobileNavLinkClass}>
            {t('nav.doctors')}
          </Link>
          <Link href="/consultation" className={mobileNavLinkClass}>
            {t('nav.consultation')}
          </Link>
          {navItems.map(({ link }, i) => {
            const href =
              link.type === 'reference' &&
              typeof link.reference?.value === 'object' &&
              link.reference.value.slug
                ? `${link.reference.relationTo !== 'pages' ? `/${link.reference.relationTo}` : ''}/${link.reference.value.slug}`
                : link.url

            if (!href) return null

            return (
              <Link key={i} href={href} className={mobileNavLinkClass}>
                {link.label}
              </Link>
            )
          })}
        </nav>
        <div className="container flex items-center justify-between border-t border-border py-4">
          <LanguageSwitcher />
          <ThemeSelector />
        </div>
      </div>
    </header>
  )
}
