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

async function getDoctor(slug: string): Promise<Doctor | null> {
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'doctors',
    where: {
      and: [{ slug: { equals: slug } }, { published: { equals: true } }],
    },
    limit: 1,
    depth: 2,
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
  const { t } = await getServerI18n()
  const doctor = await getDoctor(slug)

  if (!doctor) notFound()

  const profileImage =
    doctor.profileImage && typeof doctor.profileImage === 'object'
      ? (doctor.profileImage as Media)
      : null

  return (
    <main className="container py-10 md:py-14">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,340px)_1fr] lg:gap-14">
        <aside className="space-y-4">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-border bg-muted">
            {profileImage && <ImageMedia fill imgClassName="object-cover" resource={profileImage} />}
          </div>
          <Button asChild className="w-full bg-teal-700 hover:bg-teal-800">
            <Link href={`/consultation?doctor=${doctor.id}`}>{t('doctors.bookConsultation')}</Link>
          </Button>
        </aside>

        <article className="space-y-8">
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

          <DoctorGallery title={t('doctors.clinicGallery')} items={doctor.clinicGallery} />
          <DoctorGallery title={t('doctors.procedureGallery')} items={doctor.procedureGallery} />
        </article>
      </div>
    </main>
  )
}
