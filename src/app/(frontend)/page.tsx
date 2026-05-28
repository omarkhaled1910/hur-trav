import React from 'react'
import Link from 'next/link'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

import { MedicalHero } from '@/components/medical/MedicalHero'
import { PackageHighlight } from '@/components/medical/PackageHighlight'
import { DoctorCard } from '@/components/medical/DoctorCard'
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
      />

      <PackageHighlight title={t('package.title')} items={packageSteps} />

      <WhereYouCanBe
        title={t('home.whereYouCanBe')}
        description={t('home.whereYouCanBeDescription')}
        slides={hotelSlides}
        imagesPerPage={6}
        previousLabel={t('pagination.previous')}
        nextLabel={t('pagination.next')}
        emptyLabel={t('home.hotelsEmpty')}
        isRtl={getDirection(locale) === 'rtl'}
      />

      <section className="container py-14 md:py-16">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground md:text-3xl">{t('home.featuredDoctors')}</h2>
            <p className="mt-2 max-w-xl text-muted-foreground">{t('home.featuredDoctorsDescription')}</p>
          </div>
          <Button asChild variant="outline" className="border-teal-700/30">
            <Link href="/doctors">{t('home.viewAllDoctors')}</Link>
          </Button>
        </div>

        {doctors.length > 0 ? (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {doctors.map((doctor) => (
              <li key={doctor.id}>
                <DoctorCard doctor={doctor} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-lg border border-dashed border-border p-8 text-center text-muted-foreground">
            {t('doctors.empty')}
          </p>
        )}
      </section>

      <section className="bg-teal-900 py-14 text-white md:py-16">
        <div className="container flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <h2 className="text-2xl font-bold md:text-3xl">{t('home.ctaBandTitle')}</h2>
            <p className="mt-2 text-teal-100">{t('home.ctaBandDescription')}</p>
          </div>
          <Button asChild size="lg" className="bg-white text-teal-900 hover:bg-teal-50">
            <Link href="/consultation">{t('home.ctaConsultation')}</Link>
          </Button>
        </div>
      </section>
    </main>
  )
}

export const dynamic = 'force-dynamic'
export const revalidate = 60
