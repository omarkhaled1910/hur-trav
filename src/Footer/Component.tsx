import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'

import type { Footer } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'
import { getServerI18n } from '@/i18n/server'
import { cn } from '@/utilities/ui'

const footerLinkClass =
  'text-sm text-muted-foreground transition-colors hover:text-teal-700 dark:hover:text-teal-300'

export async function Footer() {
  const footerData: Footer = await getCachedGlobal('footer', 1)()
  const { t } = await getServerI18n()

  const navItems = footerData?.navItems || []

  return (
    <footer className="mt-auto border-t border-border bg-muted/50">
      <div className="container py-10 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <Link className="mb-4 flex items-center" href="/">
              <Logo />
            </Link>
            <p className="text-sm leading-relaxed text-muted-foreground">{t('footer.description')}</p>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-foreground">{t('nav.quickLinks')}</h4>
            <nav className="flex flex-col gap-2">
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
            <h4 className="mb-4 font-semibold text-foreground">{t('nav.aboutSite')}</h4>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {t('footer.aboutDescription')}
            </p>
          </div>
        </div>

        <div
          className={cn(
            'mt-8 flex flex-col items-center justify-between gap-4 border-t border-border pt-6',
            'md:flex-row',
          )}
        >
          <p className="text-xs text-muted-foreground">
            {t('footer.rightsReserved', { year: new Date().getFullYear() })}
          </p>
          <p className="text-xs text-muted-foreground">{t('footer.poweredBy')}</p>
        </div>
      </div>
    </footer>
  )
}
