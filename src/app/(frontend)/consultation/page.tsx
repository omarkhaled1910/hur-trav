import type { Metadata } from 'next'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React, { Suspense } from 'react'

import { ConsultationForm } from '@/components/ConsultationForm'
import { getServerI18n } from '@/i18n/server'

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerI18n()
  return {
    title: t('meta.consultationTitle'),
    description: t('meta.consultationDescription'),
  }
}

export default async function ConsultationPage() {
  const { locale, t } = await getServerI18n()
  const payload = await getPayload({ config: configPromise })

  const { docs: forms } = await payload.find({
    collection: 'forms',
    locale,
    fallbackLocale: 'en',
    where: {
      title: { equals: 'Medical Consultation' },
    },
    limit: 1,
    depth: 0,
  })

  const form = forms[0]

  return (
    <main className="container py-10 md:py-14">
      <header className="mb-8 max-w-2xl">
        <h1 className="text-3xl font-bold text-foreground md:text-4xl">{t('consultation.title')}</h1>
        <p className="mt-3 text-lg text-muted-foreground">{t('consultation.description')}</p>
      </header>

      {form ? (
        <Suspense fallback={<p className="text-muted-foreground">{t('feed.loading')}</p>}>
          <ConsultationForm form={form} />
        </Suspense>
      ) : (
        <div className="rounded-lg border border-amber-300/50 bg-amber-50 p-6 text-amber-950 dark:bg-amber-950/30 dark:text-amber-100">
          <p className="font-medium">{t('consultation.formMissingTitle')}</p>
          <p className="mt-2 text-sm">{t('consultation.formMissingDescription')}</p>
        </div>
      )}
    </main>
  )
}
