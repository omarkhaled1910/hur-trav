import type { Metadata } from 'next'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { notFound } from 'next/navigation'
import React from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import type { Doctor, Media } from '@/payload-types'
import RichText from '@/components/RichText'
import { CertificationBadge } from '@/components/medical/CertificationBadge'
import { DoctorGallery } from '@/components/medical/DoctorGallery'
import { ImageMedia } from '@/components/Media/ImageMedia'
import { getServerI18n } from '@/i18n/server'
import { Button } from '@/components/ui/button'
import { getSurgerySlug } from '@/utilities/getSurgerySlug'

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
              <ul className="grid w-full gap-6 sm:grid-cols-2 xl:grid-cols-3">
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
                      surgery.anesthesiaType && surgery.anesthesiaType in anesthesiaLabelKey
                        ? anesthesiaLabelKey[
                            surgery.anesthesiaType as keyof typeof anesthesiaLabelKey
                          ]
                        : null
                    const surgeryHref = `/doctors/${doctor.slug}/${getSurgerySlug(surgery)}`
                    const caseCount = surgery.occurrences?.length ?? 0
                    const photoCount =
                      surgery.occurrences?.reduce(
                        (sum, occ) =>
                          sum +
                          (occ.photos?.filter((p) => p.image && typeof p.image === 'object')
                            .length ?? 0),
                        0,
                      ) ?? 0

                    return (
                      <li key={surgery.id ?? index} className="min-w-0">
                        <Link
                          href={surgeryHref}
                          className="group flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-border bg-card/50 shadow-sm transition hover:border-teal-600/50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
                        >
                          <div className="relative aspect-[16/10] w-full shrink-0 bg-muted">
                            {hero ? (
                              <ImageMedia
                                fill
                                imgClassName="object-cover transition duration-500 group-hover:scale-[1.03]"
                                resource={hero}
                              />
                            ) : (
                              <div className="absolute inset-0 bg-gradient-to-br from-teal-900/20 via-muted to-muted" />
                            )}
                            {surgery.featuredProcedure ? (
                              <span className="absolute start-3 top-3 rounded-full bg-teal-100 px-2 py-0.5 text-xs font-medium text-teal-900 dark:bg-teal-900/70 dark:text-teal-100">
                                {t('doctors.featuredProcedure')}
                              </span>
                            ) : null}
                          </div>

                          <div className="flex min-w-0 flex-1 flex-col gap-3 p-5">
                            <div className="space-y-1">
                              <h3 className="text-lg font-semibold text-foreground transition group-hover:text-teal-800 dark:group-hover:text-teal-200">
                                {surgery.title}
                              </h3>
                              {surgery.procedureCategory ? (
                                <p className="text-xs font-medium uppercase tracking-wide text-teal-800 dark:text-teal-200">
                                  {surgery.procedureCategory}
                                </p>
                              ) : null}
                            </div>

                            {surgery.description ? (
                              <p className="line-clamp-3 text-sm text-muted-foreground">
                                {surgery.description}
                              </p>
                            ) : null}

                            <dl className="mt-auto space-y-1.5 border-t border-border pt-4 text-sm">
                              {priceText ? (
                                <div className="flex justify-between gap-2">
                                  <dt className="text-muted-foreground">{t('doctors.avgPrice')}</dt>
                                  <dd className="text-end font-medium text-foreground">
                                    {priceText}
                                  </dd>
                                </div>
                              ) : null}
                              {surgery.downtime ? (
                                <div className="flex justify-between gap-2">
                                  <dt className="text-muted-foreground">{t('doctors.downtime')}</dt>
                                  <dd className="text-end">{surgery.downtime}</dd>
                                </div>
                              ) : null}
                              {anesthesiaKey ? (
                                <div className="flex justify-between gap-2">
                                  <dt className="text-muted-foreground">{t('doctors.anesthesia')}</dt>
                                  <dd className="text-end">{t(anesthesiaKey)}</dd>
                                </div>
                              ) : null}
                            </dl>

                            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-sm">
                              <span className="text-muted-foreground">
                                {caseCount > 0
                                  ? t('doctors.caseCount', { count: caseCount })
                                  : t('doctors.viewProcedure')}
                                {photoCount > 0 ? ` · ${t('doctors.photoCount', { count: photoCount })}` : ''}
                              </span>
                              <span className="inline-flex items-center gap-1 font-medium text-teal-800 dark:text-teal-200">
                                {t('doctors.viewCases')}
                                <ArrowRight className="size-4 transition group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
                              </span>
                            </div>
                          </div>
                        </Link>
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
