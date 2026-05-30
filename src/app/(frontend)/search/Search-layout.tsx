'use client'

import React, { useState, useEffect } from 'react'
import { SearchFilters } from '@/components/SearchFilters'
import { SearchResults } from '@/components/SearchResults'
import type { Locale } from '@/i18n/translations'

interface SearchLayoutProps {
  query: string
  sort?: string
  locale: Locale
}

export const SearchLayout: React.FC<SearchLayoutProps> = ({ query, sort, locale }) => {
  const [_isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <div className="container mt-8">
      <div className="lg:hidden">
        <SearchFilters currentSort={sort} searchQuery={query} isMobile={true} />
        <div className="mt-6">
          <SearchResults query={query} sort={sort} locale={locale} />
        </div>
      </div>

      <div className="hidden lg:flex gap-8">
        <div className="flex-1 min-w-0">
          <SearchResults query={query} sort={sort} locale={locale} />
        </div>

        <aside className="w-72 shrink-0">
          <SearchFilters currentSort={sort} searchQuery={query} isMobile={false} />
        </aside>
      </div>
    </div>
  )
}
