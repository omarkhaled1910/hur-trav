'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { SlidersHorizontal, ArrowUpDown, ChevronDown, ChevronUp, X } from 'lucide-react'
import { cn } from '@/utilities/ui'
import { useI18n } from '@/i18n/client'

export interface SearchFiltersProps {
  currentSort?: string
  searchQuery?: string
  isMobile?: boolean
}

type SortOption = {
  value: string
  label: string
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  currentSort = 'relevance',
  searchQuery,
  isMobile = false,
}) => {
  const { t, locale } = useI18n()
  const [isOpen, setIsOpen] = useState(!isMobile)
  const isRtl = locale === 'ar'

  const sortOptions: SortOption[] = [
    { value: 'relevance', label: t('search.sort.relevance') },
    { value: 'newest', label: t('search.sort.newest') },
    { value: 'oldest', label: t('search.sort.oldest') },
  ]

  const buildFilterUrl = (sort?: string) => {
    const params = new URLSearchParams()
    if (searchQuery) params.set('q', searchQuery)
    if (sort && sort !== 'relevance') params.set('sort', sort)
    const queryString = params.toString()
    return `/search${queryString ? `?${queryString}` : ''}`
  }

  const activeFilterCount = currentSort !== 'relevance' ? 1 : 0

  const FiltersContent = () => (
    <>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-red-600" />
          {t('search.filters')}
          {activeFilterCount > 0 && (
            <span className="w-5 h-5 bg-red-600 text-white text-xs rounded-full flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </h3>
        {currentSort !== 'relevance' && (
          <Link
            href={buildFilterUrl('relevance')}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-red-600 transition-colors"
          >
            {isMobile ? <X className="w-4 h-4" /> : t('search.clearAll')}
          </Link>
        )}
      </div>

      <div>
        <h4 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4" />
          {t('search.sortBy')}
        </h4>
        <nav aria-label={t('search.sortOptions')}>
          <ul className={cn('space-y-1.5', isRtl ? 'text-right' : 'text-left')}>
            {sortOptions.map((option) => {
              const isActive = currentSort === option.value

              return (
                <li key={option.value}>
                  <Link
                    href={buildFilterUrl(option.value)}
                    className={`
                      flex items-center gap-3 px-3 py-2 rounded-lg
                      transition-all duration-200
                      ${
                        isActive
                          ? 'bg-red-600 text-white shadow-sm'
                          : 'bg-muted/50 text-foreground hover:bg-muted hover:text-red-600'
                      }
                    `}
                  >
                    <span className="flex-1 text-sm font-medium">{option.label}</span>
                    {isActive && <span className="w-1.5 h-1.5 bg-white rounded-full shrink-0" />}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>

      {isMobile && (
        <button
          onClick={() => setIsOpen(false)}
          className="w-full mt-4 py-3 bg-muted text-foreground rounded-lg font-medium hover:bg-muted/80 transition-colors"
        >
          {t('search.closeFilters')}
        </button>
      )}
    </>
  )

  return (
    <>
      {isMobile && (
        <div className="sticky top-[100px] z-40 w-full">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-between bg-card border border-border rounded-xl px-4 py-3 mb-4 hover:bg-muted/50 transition-colors shadow-sm"
          >
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-red-600" />
              <span className="font-semibold text-foreground">{t('search.filters')}</span>
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 bg-red-600 text-white text-xs rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </div>
            {isOpen ? (
              <ChevronUp className="w-5 h-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            )}
          </button>

          {isOpen && (
            <div className="bg-card border border-border rounded-xl p-5 shadow-lg animate-in slide-in-from-top-2 max-h-[70vh] overflow-y-auto">
              <FiltersContent />
            </div>
          )}
        </div>
      )}

      {!isMobile && (
        <div className="sticky top-24">
          <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
            <FiltersContent />
          </div>
        </div>
      )}
    </>
  )
}
