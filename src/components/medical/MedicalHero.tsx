import Link from 'next/link'
import React from 'react'
import { CalendarRange, MapPin, ShieldCheck, Stethoscope } from 'lucide-react'

import type { Media } from '@/payload-types'
import { ImageMedia } from '@/components/Media/ImageMedia'
import { Button } from '@/components/ui/button'
import { WaveDivider } from './WaveDivider'

type Props = {
  title: string
  subtitle: string
  ctaLabel: string
  ctaHref?: string
  secondaryCtaLabel?: string
  secondaryCtaHref?: string
  locationLabel: string
  daysLabel: string
  certifiedLabel: string
  doctorsLabel: string
  backgroundImage?: Media | null
}

export const MedicalHero: React.FC<Props> = ({
  title,
  subtitle,
  ctaLabel,
  ctaHref = '/consultation',
  secondaryCtaLabel,
  secondaryCtaHref = '/doctors',
  locationLabel,
  daysLabel,
  certifiedLabel,
  doctorsLabel,
  backgroundImage,
}) => {
  const stats = [
    { icon: CalendarRange, label: daysLabel },
    { icon: ShieldCheck, label: certifiedLabel },
    { icon: Stethoscope, label: doctorsLabel },
  ]

  return (
    <section className="relative isolate overflow-hidden bg-[var(--ink-deep)] text-white">
      <div className="absolute inset-0">
        {backgroundImage ? (
          <>
            <ImageMedia
              fill
              priority
              resource={backgroundImage}
              imgClassName="animate-ken-burns object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[var(--ink-deep)]/85 via-[var(--ink-deep)]/60 to-[var(--ink-deep)]" />
            <div className="absolute inset-0 bg-gradient-to-tr from-[var(--ink)]/70 via-transparent to-[var(--coral)]/15" />
          </>
        ) : (
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'radial-gradient(ellipse 60% 55% at 15% 10%, oklch(38% 0.09 195deg) 0%, transparent 60%), radial-gradient(ellipse 55% 50% at 90% 90%, oklch(32% 0.1 35deg) 0%, transparent 55%), linear-gradient(165deg, var(--ink), var(--ink-deep))',
            }}
          />
        )}
        <div aria-hidden className="bg-grain absolute inset-0 opacity-[0.06] mix-blend-overlay" />
        <div
          aria-hidden
          className="bg-dot-grid absolute inset-0 text-white opacity-[0.07] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]"
        />
      </div>

      <div
        aria-hidden
        className="absolute -end-24 -top-24 size-[22rem] rounded-full bg-[var(--coral)]/25 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute -start-16 -bottom-32 size-[20rem] rounded-full bg-teal-400/20 blur-3xl"
      />

      <div className="container relative flex min-h-[82vh] flex-col justify-center py-24 md:min-h-[88vh] md:py-32">
        <div className="animate-fade-up inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold tracking-[0.2em] text-teal-50/90 uppercase backdrop-blur-sm">
          <MapPin className="size-3.5 text-[var(--gold)]" />
          {locationLabel}
        </div>

        <h1 className="animate-fade-up mt-6 max-w-4xl text-[2.6rem] leading-[1.05] font-extrabold tracking-tight text-white [animation-delay:120ms] sm:text-6xl lg:text-[5rem]">
          {title}
        </h1>

        <p className="animate-fade-up mt-6 max-w-2xl text-lg leading-relaxed text-teal-50/75 [animation-delay:220ms] md:text-xl">
          {subtitle}
        </p>

        <div className="animate-fade-up mt-10 flex flex-wrap items-center gap-4 [animation-delay:320ms]">
          <Button
            asChild
            size="lg"
            className="h-13 rounded-full bg-[var(--coral)] px-8 text-base font-semibold text-white shadow-[0_20px_45px_-15px_var(--coral)] hover:bg-[var(--coral-strong)]"
          >
            <Link href={ctaHref}>{ctaLabel}</Link>
          </Button>
          {secondaryCtaLabel && secondaryCtaHref && (
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-13 rounded-full border-white/25 bg-white/5 px-8 text-base text-white backdrop-blur-sm hover:bg-white/10 hover:text-white"
            >
              <Link href={secondaryCtaHref}>{secondaryCtaLabel}</Link>
            </Button>
          )}
        </div>

        <dl className="animate-fade-up mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] shadow-2xl backdrop-blur-md [animation-delay:420ms] sm:grid-cols-3">
          {stats.map(({ icon: Icon, label }, index) => (
            <div key={index} className="flex items-center gap-3 p-5">
              <Icon className="size-5 shrink-0 text-[var(--gold)]" />
              <dd className="text-sm font-medium text-white/90">{label}</dd>
            </div>
          ))}
        </dl>
      </div>

      <WaveDivider className="absolute inset-x-0 bottom-0 z-0 text-background" />
    </section>
  )
}
