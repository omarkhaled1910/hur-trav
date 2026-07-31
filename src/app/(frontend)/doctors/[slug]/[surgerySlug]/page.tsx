import type { Metadata } from 'next'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { notFound } from 'next/navigation'
import React from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

import type { Doctor, Media } from '@/payload-types'
import { ZoomableGallery } from '@/components/medical/ZoomableGallery'
import { ImageMedia } from '@/components/Media/ImageMedia'
import { Button } from '@/components/ui/button'
import { getServerI18n } from '@/i18n/server'
import { findSurgeryBySlug } from '@/utilities/getSurgerySlug'

type Args = {
  params: Promise<{ slug: string; surgerySlug: string }>
}

const anesthesiaLabelKey = {
  local: 'doctors.anesthesia.local',
  sedation: 'doctors.anesthesia.sedation',
  general: 'doctors.anesthesia.general',
  varies: 'doctors.anesthesia.varies',
  none: 'doctors.anesthesia.none',
} as const

const occurrenceStageKey = {
  pre_op: 'doctors.occurrenceStage.pre_op',
  post_op_early: 'doctors.occurrenceStage.post_op_early',
  post_op_followup: 'doctors.occurrenceStage.post_op_followup',
  long_term: 'doctors.occurrenceStage.long_term',
  other: 'doctors.occurrenceStage.other',
} as const

async function getDoctor(slug: string): Promise<Doctor | null> {
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'doctors',
    where: {
      and: [{ slug: { equals: slug } }, { published: { equals: true } }],
    },
    limit: 1,
    depth: 3,
  })
  return docs[0] ?? null
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug, surgerySlug } = await params
  const doctor = await getDoctor(slug)
  const surgery = findSurgeryBySlug(doctor?.surgeries, surgerySlug)
  if (!doctor || !surgery) return { title: 'Procedure' }

  return {
    title: `${surgery.title} | ${doctor.fullName} | Hur Travel Medical`,
    description: surgery.description || doctor.shortBio || undefined,
  }
}

export default async function DoctorSurgeryPage({ params }: Args) {
  const { slug, surgerySlug } = await params
  const { t, locale } = await getServerI18n()
  const doctor = await getDoctor(slug)

  if (!doctor) notFound()

  const surgery = findSurgeryBySlug(doctor.surgeries, surgerySlug)
  if (!surgery) notFound()

  const hero =
    surgery.heroImage && typeof surgery.heroImage === 'object'
      ? (surgery.heroImage as Media)
      : null

  const currency = surgery.priceCurrency ?? 'USD'
  const priceText =
    surgery.averagePrice != null && surgery.averagePrice > 0
      ? new Intl.NumberFormat(locale === 'ar' ? 'ar-EG' : 'en-US', {
          style: 'currency',
          currency,
          maximumFractionDigits: 0,
        }).format(surgery.averagePrice)
      : null

  const anesthesiaKey =
    surgery.anesthesiaType && surgery.anesthesiaType in anesthesiaLabelKey
      ? anesthesiaLabelKey[surgery.anesthesiaType as keyof typeof anesthesiaLabelKey]
      : null

  const occurrences = surgery.occurrences ?? []
  const caseCount = occurrences.length
  const photoCount = occurrences.reduce(
    (sum, occ) => sum + (occ.photos?.filter((p) => p.image && typeof p.image === 'object').length ?? 0),
    0,
  )

  return (
    <main className="min-h-[70vh]">
      <div className="relative isolate overflow-hidden border-b border-border bg-muted">
        {hero ? (
          <div className="absolute inset-0 -z-10">
            <ImageMedia fill imgClassName="object-cover" resource={hero} priority />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/30" />
          </div>
        ) : (
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-teal-950/20 via-background to-background" />
        )}

        <div className="container space-y-6 py-10 md:py-14">
          <Link
            href={`/doctors/${doctor.slug}`}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden />
            {t('doctors.backToDoctor', { name: doctor.fullName })}
          </Link>

          <div className="max-w-3xl space-y-4">
            {surgery.procedureCategory ? (
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-800 dark:text-teal-200">
                {surgery.procedureCategory}
              </p>
            ) : null}
            <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-5xl">
              {surgery.title}
            </h1>
            <p className="text-base text-muted-foreground md:text-lg">
              {t('doctors.surgeryByDoctor', { name: doctor.fullName })}
            </p>
            {surgery.description ? (
              <p className="max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
                {surgery.description}
              </p>
            ) : null}
            <div className="flex flex-wrap gap-3 pt-2 text-sm text-muted-foreground">
              {caseCount > 0 ? (
                <span className="rounded-md border border-border/80 bg-background/70 px-3 py-1.5 backdrop-blur">
                  {t('doctors.caseCount', { count: caseCount })}
                </span>
              ) : null}
              {photoCount > 0 ? (
                <span className="rounded-md border border-border/80 bg-background/70 px-3 py-1.5 backdrop-blur">
                  {t('doctors.photoCount', { count: photoCount })}
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div className="container grid gap-10 py-10 md:py-14 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-14">
        <div className="min-w-0 space-y-12">
          <section className="space-y-3">
            <h2 className="text-2xl font-semibold tracking-tight">{t('doctors.surgeryOccurrences')}</h2>
            <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
              {t('doctors.surgeryGalleryIntro')}
            </p>
          </section>

          {occurrences.length === 0 ? (
            <p className="rounded-xl border border-dashed border-border px-5 py-10 text-center text-muted-foreground">
              {t('doctors.noOccurrences')}
            </p>
          ) : (
            <ul className="space-y-14">
              {occurrences.map((occ, oi) => {
                const stageKey =
                  occ.stage && occ.stage in occurrenceStageKey
                    ? occurrenceStageKey[occ.stage as keyof typeof occurrenceStageKey]
                    : null
                const photoItems =
                  occ.photos
                    ?.filter((p) => p.image && typeof p.image === 'object')
                    .map((p) => ({
                      image: p.image as Media,
                      caption: p.caption,
                      id: p.id,
                    })) ?? []

                return (
                  <li key={occ.id ?? oi} className="space-y-5">
                    <header className="space-y-2 border-b border-border pb-4">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h3 className="text-xl font-semibold text-foreground md:text-2xl">
                          {occ.title}
                        </h3>
                        {occ.occurrenceDate ? (
                          <time
                            className="text-sm text-muted-foreground"
                            dateTime={occ.occurrenceDate}
                          >
                            {new Date(occ.occurrenceDate).toLocaleDateString(
                              locale === 'ar' ? 'ar-EG' : 'en-GB',
                              { year: 'numeric', month: 'long', day: 'numeric' },
                            )}
                          </time>
                        ) : null}
                      </div>
                      {stageKey ? (
                        <p className="text-xs font-semibold uppercase tracking-wide text-teal-800 dark:text-teal-200">
                          {t(stageKey)}
                        </p>
                      ) : null}
                      {occ.summary ? (
                        <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
                          {occ.summary}
                        </p>
                      ) : null}
                      {occ.outcomeNotes ? (
                        <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
                          {occ.outcomeNotes}
                        </p>
                      ) : null}
                    </header>

                    {photoItems.length > 0 ? (
                      <ZoomableGallery
                        items={photoItems}
                        gridClassName="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4"
                        aspectClassName="aspect-[4/5] md:aspect-square"
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground">{t('doctors.noPhotos')}</p>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-border bg-card/60 p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              {t('doctors.procedureDetails')}
            </h2>
            <dl className="space-y-3 text-sm">
              {priceText ? (
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">{t('doctors.avgPrice')}</dt>
                  <dd className="text-end font-medium">
                    {priceText}
                    {surgery.priceNote ? (
                      <span className="mt-0.5 block text-xs font-normal text-muted-foreground">
                        {surgery.priceNote}
                      </span>
                    ) : null}
                  </dd>
                </div>
              ) : null}
              {surgery.downtime ? (
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">{t('doctors.downtime')}</dt>
                  <dd className="text-end">{surgery.downtime}</dd>
                </div>
              ) : null}
              {surgery.stayTime ? (
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">{t('doctors.stay')}</dt>
                  <dd className="text-end">{surgery.stayTime}</dd>
                </div>
              ) : null}
              {anesthesiaKey ? (
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">{t('doctors.anesthesia')}</dt>
                  <dd className="text-end">{t(anesthesiaKey)}</dd>
                </div>
              ) : null}
              {surgery.recoveryNotes ? (
                <div className="space-y-1 border-t border-border pt-3">
                  <dt className="text-muted-foreground">{t('doctors.recovery')}</dt>
                  <dd className="leading-relaxed text-muted-foreground">{surgery.recoveryNotes}</dd>
                </div>
              ) : null}
            </dl>
          </div>

          <Button asChild className="w-full bg-teal-700 hover:bg-teal-800">
            <Link href={`/consultation?doctor=${doctor.id}`}>{t('doctors.bookConsultation')}</Link>
          </Button>
        </aside>
      </div>
    </main>
  )
}
