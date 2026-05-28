import type { Metadata } from 'next'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import { DoctorCard } from '@/components/medical/DoctorCard'
import { getServerI18n } from '@/i18n/server'

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerI18n()
  return {
    title: t('meta.doctorsTitle'),
    description: t('meta.doctorsDescription'),
  }
}

export default async function DoctorsPage() {
  const { t } = await getServerI18n()
  const payload = await getPayload({ config: configPromise })

  const { docs: doctors } = await payload.find({
    collection: 'doctors',
    where: { published: { equals: true } },
    sort: 'fullName',
    limit: 100,
    depth: 2,
  })

  return (
    <main className="container py-10 md:py-14">
      <header className="mb-10 max-w-2xl">
        <h1 className="text-3xl font-bold text-foreground md:text-4xl">{t('doctors.title')}</h1>
        <p className="mt-3 text-lg text-muted-foreground">{t('doctors.description')}</p>
      </header>

      {doctors.length > 0 ? (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {doctors.map((doctor) => (
            <li key={doctor.id}>
              <DoctorCard doctor={doctor} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-lg border border-dashed border-border p-10 text-center text-muted-foreground">
          {t('doctors.empty')}
        </p>
      )}
    </main>
  )
}
