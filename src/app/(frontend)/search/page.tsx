import type { Metadata } from 'next/types'

import { Search } from '@/search/Component'
import PageClient from './page.client'
import { getServerI18n } from '@/i18n/server'
import Link from 'next/link'
import { SearchLayout } from './Search-layout'

type Args = {
  searchParams: Promise<{
    q?: string
    sort?: string
  }>
}

export default async function Page({ searchParams: searchParamsPromise }: Args) {
  const { locale, dir, t } = await getServerI18n()
  const searchParams = await searchParamsPromise
  const query = searchParams.q || ''
  const sort = searchParams.sort || 'relevance'

  return (
    <div className="min-h-screen pb-16" dir={dir}>
      <PageClient />

      <div className="bg-gradient-to-br from-muted/50 to-background border-b border-border">
        <div className="container pt-12 pb-12">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-red-600 transition-colors">
              {t('breadcrumb.home')}
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">{t('search.title')}</span>
          </nav>

          <div className="max-w-2xl mx-auto">
            <Search locale={locale} defaultValue={query} />
          </div>

          {query && (
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
              <Link
                href="/search"
                className="inline-flex items-center gap-1 px-3 py-1 bg-red-600 text-white text-sm rounded-full hover:bg-red-700 transition-colors"
              >
                {t('search.title')}: &quot;{query}&quot;
                <span className="ml-1">×</span>
              </Link>
            </div>
          )}
        </div>
      </div>

      <SearchLayout query={query} sort={sort} locale={locale} />
    </div>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerI18n()
  return {
    title: t('search.title'),
    description: t('meta.homeDescription'),
  }
}
