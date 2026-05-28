import Link from 'next/link'
import React from 'react'

import { siteConfig } from '@/config/site'
import { Button } from '@/components/ui/button'

type Props = {
  title: string
  subtitle: string
  ctaLabel: string
  ctaHref?: string
  secondaryCtaLabel?: string
  secondaryCtaHref?: string
}

export const MedicalHero: React.FC<Props> = ({
  title,
  subtitle,
  ctaLabel,
  ctaHref = '/consultation',
  secondaryCtaLabel,
  secondaryCtaHref = '/doctors',
}) => {
  return (
    <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-[var(--sand)] via-background to-teal-50/40 dark:from-teal-950/30 dark:via-background dark:to-background">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-200/30 via-transparent to-transparent dark:from-teal-800/20" />
      <div className="container relative py-16 md:py-24 lg:py-28">
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-teal-700 dark:text-teal-300">
          {siteConfig.location} · {siteConfig.packageDays}-day luxury medical stay
        </p>
        <h1 className="max-w-3xl text-4xl font-bold leading-tight text-foreground md:text-5xl lg:text-6xl">
          {title}
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">{subtitle}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild size="lg" className="bg-teal-700 hover:bg-teal-800 text-white">
            <Link href={ctaHref}>{ctaLabel}</Link>
          </Button>
          {secondaryCtaLabel && secondaryCtaHref && (
            <Button asChild size="lg" variant="outline" className="border-teal-700/30">
              <Link href={secondaryCtaHref}>{secondaryCtaLabel}</Link>
            </Button>
          )}
        </div>
      </div>
    </section>
  )
}
