import type { Metadata } from 'next'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { notFound } from 'next/navigation'
import React from 'react'

import type { Doctor, Media } from '@/payload-types'
import RichText from '@/components/RichText'
import { CertificationBadge } from '@/components/medical/CertificationBadge'
import { DoctorGallery } from '@/components/medical/DoctorGallery'
import { ImageMedia } from '@/components/Media/ImageMedia'
import { getServerI18n } from '@/i18n/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

type Args = {
  params: Promise<{ slug: string }>
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
  const { slug } = await params
  const doctor = await getDoctor(slug)
  if (!doctor) return { title: 'Doctor' }

  return {
    title: doctor.meta?.title || `${doctor.fullName} | Hur Travel Medical`,
    description: doctor.meta?.description || doctor.shortBio || undefined,
  }
}

export default async function DoctorDetailPage({ params }: Args) {
  const { slug } = await params
  const { t, locale } = await getServerI18n()
  const doctor = await getDoctor(slug)

  if (!doctor) notFound()

  const profileImage =
    doctor.profileImage && typeof doctor.profileImage === 'object'
      ? (doctor.profileImage as Media)
      : null

  const hasProcedureGallery = Boolean(doctor.procedureGallery?.length)
  const hasSurgeries = Boolean(doctor.surgeries?.length)
  const hasFullWidthAfterProfile = hasSurgeries || hasProcedureGallery

  return (
    <main className="container py-10 md:py-14">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,340px)_1fr] lg:gap-14">
        <aside className="space-y-4">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-border bg-muted">
            {profileImage && (
              <ImageMedia fill imgClassName="object-cover" resource={profileImage} />
            )}
          </div>
          <Button asChild className="w-full bg-teal-700 hover:bg-teal-800">
            <Link href={`/consultation?doctor=${doctor.id}`}>{t('doctors.bookConsultation')}</Link>
          </Button>
        </aside>

        <article className="min-w-0 space-y-8">
          <header className="space-y-3 border-b border-border pb-6">
            {doctor.professionalTitle && (
              <p className="text-sm font-semibold uppercase tracking-wide text-teal-700 dark:text-teal-300">
                {doctor.professionalTitle}
              </p>
            )}
            <h1 className="text-3xl font-bold text-foreground md:text-4xl">{doctor.fullName}</h1>
            <p className="text-lg text-muted-foreground">{doctor.specialty}</p>
            <div className="flex flex-wrap gap-2">
              {doctor.certifiedEurope && <CertificationBadge label={t('doctors.euCertified')} />}
              {doctor.yearsOfExperience != null && (
                <span className="text-sm text-muted-foreground">
                  {t('doctors.yearsExperience', { years: doctor.yearsOfExperience })}
                </span>
              )}
            </div>
            {doctor.shortBio && (
              <p className="text-base leading-relaxed text-muted-foreground">{doctor.shortBio}</p>
            )}
          </header>

          {doctor.biography && (
            <section className="prose prose-neutral dark:prose-invert max-w-none">
              <h2 className="text-xl font-semibold not-prose mb-4">{t('doctors.biography')}</h2>
              <RichText data={doctor.biography} enableGutter={false} />
            </section>
          )}

          {doctor.careerHistory && doctor.careerHistory.length > 0 && (
            <section>
              <h2 className="mb-4 text-xl font-semibold">{t('doctors.careerHistory')}</h2>
              <ol className="relative space-y-6 border-s-2 border-teal-200 ps-6 dark:border-teal-800">
                {doctor.careerHistory.map((entry, index) => (
                  <li key={entry.id ?? index} className="relative">
                    <span className="absolute -start-[1.65rem] top-1 size-3 rounded-full bg-teal-600" />
                    <h3 className="font-semibold text-foreground">{entry.role}</h3>
                    <p className="text-sm text-teal-800 dark:text-teal-200">{entry.institution}</p>
                    {entry.location && (
                      <p className="text-sm text-muted-foreground">{entry.location}</p>
                    )}
                    {(entry.startYear || entry.isCurrent) && (
                      <p className="text-xs text-muted-foreground">
                        {entry.startYear}
                        {entry.isCurrent
                          ? ` — ${t('doctors.present')}`
                          : entry.endYear
                            ? ` — ${entry.endYear}`
                            : ''}
                      </p>
                    )}
                    {entry.summary && (
                      <p className="mt-1 text-sm text-muted-foreground">{entry.summary}</p>
                    )}
                  </li>
                ))}
              </ol>
            </section>
          )}

          {doctor.europeanCertifications && doctor.europeanCertifications.length > 0 && (
            <section>
              <h2 className="mb-4 text-xl font-semibold">{t('doctors.certifications')}</h2>
              <ul className="space-y-4">
                {doctor.europeanCertifications.map((cert, index) => (
                  <li
                    key={cert.id ?? index}
                    className="rounded-lg border border-border bg-card/50 p-4"
                  >
                    <h3 className="font-semibold">{cert.name}</h3>
                    <p className="text-sm text-muted-foreground">{cert.issuingBody}</p>
                    {(cert.country || cert.yearObtained) && (
                      <p className="text-xs text-muted-foreground">
                        {[cert.country, cert.yearObtained].filter(Boolean).join(' · ')}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </article>
      </div>

      {hasFullWidthAfterProfile && (
        <div className="mt-10 min-w-0 space-y-10 lg:mt-14">
          {hasSurgeries && doctor.surgeries && (
            <section className="w-full">
              <h2 className="mb-6 text-xl font-semibold">{t('doctors.surgeries')}</h2>
              <ul className="flex w-full flex-col gap-10 md:gap-12">
                {[...doctor.surgeries]
                  .sort((a, b) => Number(!!b.featuredProcedure) - Number(!!a.featuredProcedure))
                  .map((surgery, index) => {
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
                      surgery.anesthesiaType &&
                      surgery.anesthesiaType in anesthesiaLabelKey
                        ? anesthesiaLabelKey[
                            surgery.anesthesiaType as keyof typeof anesthesiaLabelKey
                          ]
                        : null

                    return (
                      <li
                        key={surgery.id ?? index}
                        className="flex w-full min-w-0 flex-col overflow-hidden rounded-xl border border-border bg-card/50 shadow-sm"
                      >
                        <div className="flex w-full flex-col lg:flex-row lg:items-stretch">
                          {hero ? (
                            <div className="relative aspect-video w-full shrink-0 border-b border-border bg-muted lg:aspect-auto lg:min-h-[min(360px,50vh)] lg:w-[min(44vw,520px)] lg:max-w-[520px] lg:border-b-0 lg:border-e">
                              <ImageMedia fill imgClassName="object-cover" resource={hero} />
                            </div>
                          ) : null}
                          <div className="flex min-w-0 flex-1 flex-col gap-3 p-5 md:p-6 lg:justify-center">
                            <div className="flex flex-wrap items-start justify-between gap-2">
                              <h3 className="text-xl font-semibold text-foreground md:text-2xl">
                                {surgery.title}
                              </h3>
                              {surgery.featuredProcedure && (
                                <span className="shrink-0 rounded-full bg-teal-100 px-2 py-0.5 text-xs font-medium text-teal-900 dark:bg-teal-900/40 dark:text-teal-100">
                                  {t('doctors.featuredProcedure')}
                                </span>
                              )}
                            </div>
                          {surgery.procedureCategory && (
                            <p className="text-xs font-medium uppercase tracking-wide text-teal-800 dark:text-teal-200">
                              {surgery.procedureCategory}
                            </p>
                          )}
                          {surgery.description && (
                            <p className="text-sm text-muted-foreground md:text-base">
                              {surgery.description}
                            </p>
                          )}
                          <dl className="mt-auto space-y-1.5 border-t border-border pt-4 text-sm lg:mt-2">
                            {priceText && (
                              <div className="flex justify-between gap-2">
                                <dt className="text-muted-foreground">{t('doctors.avgPrice')}</dt>
                                <dd className="text-end font-medium text-foreground">
                                  {priceText}
                                  {surgery.priceNote ? (
                                    <span className="block text-xs font-normal text-muted-foreground">
                                      {surgery.priceNote}
                                    </span>
                                  ) : null}
                                </dd>
                              </div>
                            )}
                            {surgery.downtime && (
                              <div className="flex justify-between gap-2">
                                <dt className="text-muted-foreground">{t('doctors.downtime')}</dt>
                                <dd className="text-end">{surgery.downtime}</dd>
                              </div>
                            )}
                            {surgery.stayTime && (
                              <div className="flex justify-between gap-2">
                                <dt className="text-muted-foreground">{t('doctors.stay')}</dt>
                                <dd className="text-end">{surgery.stayTime}</dd>
                              </div>
                            )}
                            {anesthesiaKey && (
                              <div className="flex justify-between gap-2">
                                <dt className="text-muted-foreground">{t('doctors.anesthesia')}</dt>
                                <dd className="text-end">{t(anesthesiaKey)}</dd>
                              </div>
                            )}
                            {surgery.recoveryNotes && (
                              <div className="pt-1">
                                <dt className="text-muted-foreground">{t('doctors.recovery')}</dt>
                                <dd className="mt-0.5 text-muted-foreground">
                                  {surgery.recoveryNotes}
                                </dd>
                              </div>
                            )}
                          </dl>
                        </div>
                        </div>

                        {surgery.occurrences && surgery.occurrences.length > 0 && (
                          <div className="w-full border-t border-border bg-muted/20 px-4 py-5 md:px-6 md:py-6">
                            <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                              {t('doctors.surgeryOccurrences')}
                            </p>
                            <ul className="grid w-full gap-4 sm:grid-cols-2 xl:grid-cols-3">
                              {surgery.occurrences.map((occ, oi) => {
                                const stageKey =
                                  occ.stage && occ.stage in occurrenceStageKey
                                    ? occurrenceStageKey[
                                        occ.stage as keyof typeof occurrenceStageKey
                                      ]
                                    : null
                                const photoItems =
                                  occ.photos?.filter(
                                    (p) => p.image && typeof p.image === 'object',
                                  ) ?? []

                                return (
                                  <li
                                    key={occ.id ?? oi}
                                    className="flex min-h-0 min-w-0 flex-col rounded-lg border border-border/80 bg-card/80 p-4 shadow-sm"
                                  >
                                    <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
                                      <h4 className="text-base font-semibold text-foreground">
                                        {occ.title}
                                      </h4>
                                      {occ.occurrenceDate && (
                                        <time
                                          className="text-xs text-muted-foreground"
                                          dateTime={occ.occurrenceDate}
                                        >
                                          {new Date(occ.occurrenceDate).toLocaleDateString(
                                            locale === 'ar' ? 'ar-EG' : 'en-GB',
                                            {
                                              year: 'numeric',
                                              month: 'short',
                                              day: 'numeric',
                                            },
                                          )}
                                        </time>
                                      )}
                                    </div>
                                    {stageKey && (
                                      <p className="mb-2 text-xs font-medium text-teal-800 dark:text-teal-200">
                                        {t(stageKey)}
                                      </p>
                                    )}
                                    {occ.summary && (
                                      <p className="mb-2 text-sm leading-relaxed text-muted-foreground">
                                        {occ.summary}
                                      </p>
                                    )}
                                    {occ.outcomeNotes && (
                                      <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
                                        {occ.outcomeNotes}
                                      </p>
                                    )}
                                    {photoItems.length > 0 && (
                                      <ul className="mt-auto grid grid-cols-2 gap-2 md:grid-cols-3">
                                        {photoItems.map((ph, pi) => (
                                          <li
                                            key={ph.id ?? pi}
                                            className="overflow-hidden rounded-md border border-border bg-muted"
                                          >
                                            <div className="relative aspect-square">
                                              <ImageMedia
                                                fill
                                                imgClassName="object-cover"
                                                resource={ph.image as Media}
                                              />
                                            </div>
                                            {ph.caption && (
                                              <p className="px-1.5 py-1 text-[10px] text-muted-foreground">
                                                {ph.caption}
                                              </p>
                                            )}
                                          </li>
                                        ))}
                                      </ul>
                                    )}
                                  </li>
                                )
                              })}
                            </ul>
                          </div>
                        )}
                      </li>
                    )
                  })}
              </ul>
            </section>
          )}

          <DoctorGallery
            className="w-full"
            title={t('doctors.procedureGallery')}
            items={doctor.procedureGallery}
          />
        </div>
      )}
    </main>
  )
}
