import React from 'react'
import Link from 'next/link'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

import type { Media } from '@/payload-types'
import { siteConfig } from '@/config/site'
import { MedicalHero } from '@/components/medical/MedicalHero'
import { PackageHighlight } from '@/components/medical/PackageHighlight'
import { DoctorCard } from '@/components/medical/DoctorCard'
import { Reveal } from '@/components/medical/Reveal'
import { WaveDivider } from '@/components/medical/WaveDivider'
import { WhereYouCanBe } from '@/components/medical/WhereYouCanBe'
import { getServerI18n } from '@/i18n/server'
import { getDirection } from '@/i18n/translations'
import { flattenHotelGallerySlides } from '@/utilities/flattenHotelGallerySlides'
import { Button } from '@/components/ui/button'

const getHomepageDoctors = unstable_cache(
  async () => {
    try {
      const payload = await getPayload({ config: configPromise })
      const { docs } = await payload.find({
        collection: 'doctors',
        where: {
          published: { equals: true },
        },
        limit: 6,
        sort: '-featured,fullName',
        depth: 2,
      })
      return docs
    } catch (error) {
      console.warn('Database unavailable, rendering homepage without doctors:', error)
      return []
    }
  },
  ['homepage-doctors'],
  { tags: ['doctors'], revalidate: 60 },
)

const getHomepageHotels = unstable_cache(
  async () => {
    try {
      const payload = await getPayload({ config: configPromise })
      const { docs } = await payload.find({
        collection: 'hotels',
        where: {
          published: { equals: true },
        },
        limit: 20,
        sort: 'sortOrder',
        depth: 2,
      })
      return docs
    } catch (error) {
      console.warn('Database unavailable, rendering homepage without hotels:', error)
      return []
    }
  },
  ['homepage-hotels'],
  { tags: ['hotels'], revalidate: 60 },
)

export default async function HomePage() {
  const { locale, t } = await getServerI18n()
  const [doctors, hotels] = await Promise.all([getHomepageDoctors(), getHomepageHotels()])
  const hotelSlides = flattenHotelGallerySlides(hotels)
  const isRtl = getDirection(locale) === 'rtl'

  const heroImage = hotels
    .flatMap((hotel) => hotel.images ?? [])
    .find((image): image is Media => Boolean(image) && typeof image === 'object')

  const doctorsLabel =
    doctors.length > 0
      ? t('home.statDoctorsLabel', { count: doctors.length })
      : t('home.statDoctorsFallback')

  const packageSteps = [
    {
      title: t('package.step1Title'),
      description: t('package.step1Description'),
    },
    {
      title: t('package.step2Title'),
      description: t('package.step2Description'),
    },
    {
      title: t('package.step3Title'),
      description: t('package.step3Description'),
    },
    {
      title: t('package.step4Title'),
      description: t('package.step4Description'),
    },
  ]

  return (
    <main className="min-h-screen">
      <MedicalHero
        title={t('home.heroTitle')}
        subtitle={t('home.heroSubtitle')}
        ctaLabel={t('home.ctaConsultation')}
        secondaryCtaLabel={t('nav.doctors')}
        locationLabel={t('common.location')}
        daysLabel={t('home.statDaysLabel', { days: siteConfig.packageDays })}
        certifiedLabel={t('doctors.euCertified')}
        doctorsLabel={doctorsLabel}
        backgroundImage={heroImage}
      />

      <PackageHighlight
        eyebrow={t('package.eyebrow')}
        title={t('package.title')}
        description={t('package.subtitle', { days: siteConfig.packageDays })}
        items={packageSteps}
      />

      <WhereYouCanBe
        eyebrow={t('home.hotelsEyebrow')}
        title={t('home.whereYouCanBe')}
        description={t('home.whereYouCanBeDescription')}
        slides={hotelSlides}
        imagesPerPage={6}
        previousLabel={t('pagination.previous')}
        nextLabel={t('pagination.next')}
        pageLabel={t('common.page')}
        emptyLabel={t('home.hotelsEmpty')}
        isRtl={isRtl}
      />

      <section className="relative py-20 md:py-28">
        <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <p className="text-xs font-semibold tracking-[0.25em] text-[var(--coral)] uppercase">
              {t('home.doctorsEyebrow')}
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground md:text-5xl">
              {t('home.featuredDoctors')}
            </h2>
            <p className="mt-4 text-muted-foreground md:text-lg">
              {t('home.featuredDoctorsDescription')}
            </p>
          </div>
          <Button asChild variant="outline" className="rounded-full border-teal-700/30">
            <Link href="/doctors">{t('home.viewAllDoctors')}</Link>
          </Button>
        </Reveal>

        {doctors.length > 0 ? (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {doctors.map((doctor, index) => (
              <Reveal key={doctor.id} delay={index * 90} className="h-full">
                <li className="h-full">
                  <DoctorCard doctor={doctor} className="h-full" />
                </li>
              </Reveal>
            ))}
          </ul>
        ) : (
          <Reveal>
            <p className="rounded-2xl border border-dashed border-border bg-background/60 p-10 text-center text-muted-foreground">
              {t('doctors.empty')}
            </p>
          </Reveal>
        )}
      </section>

      <section className="relative isolate overflow-hidden bg-[var(--ink-deep)] py-20 text-white md:py-28">
        <div
          aria-hidden
          className="bg-grain absolute inset-0 opacity-[0.06] mix-blend-overlay"
        />
        <div
          aria-hidden
          className="absolute end-[-6rem] top-1/2 size-[20rem] -translate-y-1/2 rounded-full bg-[var(--coral)]/25 blur-3xl"
        />
        <WaveDivider className="absolute inset-x-0 top-0 z-0 -translate-y-full text-[var(--ink-deep)]" />

        <Reveal className="container relative flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <p className="text-xs font-semibold tracking-[0.25em] text-[var(--gold)] uppercase">
              {t('home.ctaEyebrow')}
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-5xl">
              {t('home.ctaBandTitle')}
            </h2>
            <p className="mt-4 text-teal-50/75 md:text-lg">{t('home.ctaBandDescription')}</p>
          </div>
          <Button
            asChild
            size="lg"
            className="h-13 shrink-0 rounded-full bg-[var(--coral)] px-8 text-base font-semibold text-white shadow-[0_20px_45px_-15px_var(--coral)] hover:bg-[var(--coral-strong)]"
          >
            <Link href="/consultation">{t('home.ctaConsultation')}</Link>
          </Button>
        </Reveal>
      </section>
    </main>
  )
}

export const dynamic = 'force-dynamic'
export const revalidate = 60
