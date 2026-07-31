import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'
import { MapPin } from 'lucide-react'

import type { Footer } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'
import { WaveDivider } from '@/components/medical/WaveDivider'
import { Button } from '@/components/ui/button'
import { getServerI18n } from '@/i18n/server'
import { cn } from '@/utilities/ui'

const footerLinkClass = 'text-sm text-white/70 transition-colors hover:text-white'

export async function Footer() {
  const footerData: Footer = await getCachedGlobal('footer', 1)()
  const { t } = await getServerI18n()

  const navItems = footerData?.navItems || []

  return (
    <footer className="relative isolate mt-auto overflow-hidden bg-[var(--ink-deep)] text-white">
      <WaveDivider className="absolute inset-x-0 top-0 z-0 -translate-y-full text-[var(--ink-deep)]" />
      <div aria-hidden className="bg-grain absolute inset-0 opacity-[0.05] mix-blend-overlay" />

      <div className="container relative py-14 md:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div className="md:pe-4">
            <Link className="mb-4 flex items-center" href="/">
              <Logo invert />
            </Link>
            <p className="text-sm leading-relaxed text-white/70">{t('footer.description')}</p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold tracking-wide text-white uppercase">
              {t('nav.quickLinks')}
            </h4>
            <nav className="flex flex-col gap-2.5">
              <Link href="/" className={footerLinkClass}>
                {t('nav.home')}
              </Link>
              <Link href="/doctors" className={footerLinkClass}>
                {t('nav.doctors')}
              </Link>
              <Link href="/consultation" className={footerLinkClass}>
                {t('nav.consultation')}
              </Link>
              {navItems.map(({ link }, i) => {
                return <CMSLink className={footerLinkClass} key={i} {...link} />
              })}
            </nav>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold tracking-wide text-white uppercase">
              {t('nav.aboutSite')}
            </h4>
            <p className="text-sm leading-relaxed text-white/70">
              {t('footer.aboutDescription')}
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold tracking-wide text-white uppercase">
              {t('footer.contactTitle')}
            </h4>
            <p className="inline-flex items-center gap-1.5 text-sm text-white/70">
              <MapPin className="size-3.5 shrink-0 text-[var(--gold)]" />
              {t('common.location')}
            </p>
            <Button
              asChild
              size="sm"
              className="mt-4 rounded-full bg-[var(--coral)] text-white hover:bg-[var(--coral-strong)]"
            >
              <Link href="/consultation">{t('home.ctaConsultation')}</Link>
            </Button>
          </div>
        </div>

        <div
          className={cn(
            'mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6',
            'md:flex-row',
          )}
        >
          <p className="text-xs text-white/50">
            {t('footer.rightsReserved', { year: new Date().getFullYear() })}
          </p>
          <p className="text-xs text-white/50">{t('footer.poweredBy')}</p>
        </div>
      </div>
    </footer>
  )
}
