'use client'

import React, { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import type { Media } from '@/payload-types'
import { ImageMedia } from '@/components/Media/ImageMedia'
import { Button } from '@/components/ui/button'
import { cn } from '@/utilities/ui'
import { Reveal } from './Reveal'

export type HotelGallerySlide = {
  id: string
  hotelName: string
  shortDescription?: string | null
  media: Media
}

type Props = {
  eyebrow: string
  title: string
  description: string
  slides: HotelGallerySlide[]
  imagesPerPage?: number
  previousLabel: string
  nextLabel: string
  pageLabel: string
  emptyLabel: string
  isRtl?: boolean
}

export const WhereYouCanBe: React.FC<Props> = ({
  eyebrow,
  title,
  description,
  slides,
  imagesPerPage = 6,
  previousLabel,
  nextLabel,
  pageLabel,
  emptyLabel,
  isRtl = false,
}) => {
  const [page, setPage] = useState(0)

  const totalPages = Math.max(1, Math.ceil(slides.length / imagesPerPage))

  const currentSlides = useMemo(() => {
    const start = page * imagesPerPage
    return slides.slice(start, start + imagesPerPage)
  }, [slides, page, imagesPerPage])

  const PrevIcon = isRtl ? ChevronRight : ChevronLeft
  const NextIcon = isRtl ? ChevronLeft : ChevronRight

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,var(--sand)/25,var(--background)_35%)] py-20 md:py-28 dark:bg-[linear-gradient(180deg,var(--muted)/40,var(--background)_35%)]">
      <div className="container relative">
        <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.25em] text-[var(--coral)] uppercase">
              {eyebrow}
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground md:text-5xl">
              {title}
            </h2>
            <p className="mt-4 text-muted-foreground md:text-lg">{description}</p>
          </div>

          {slides.length > 0 && totalPages > 1 && (
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="rounded-full border-teal-700/25"
                disabled={page === 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                aria-label={previousLabel}
              >
                <PrevIcon className="size-4" />
              </Button>
              <span className="min-w-[4.5rem] text-center text-sm text-muted-foreground">
                {page + 1} / {totalPages}
              </span>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="rounded-full border-teal-700/25"
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                aria-label={nextLabel}
              >
                <NextIcon className="size-4" />
              </Button>
            </div>
          )}
        </Reveal>

        {slides.length === 0 ? (
          <Reveal delay={100}>
            <p className="rounded-2xl border border-dashed border-border bg-background/60 p-10 text-center text-muted-foreground">
              {emptyLabel}
            </p>
          </Reveal>
        ) : (
          <>
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {currentSlides.map((slide, index) => (
                <Reveal key={slide.id} delay={index * 90} className="h-full">
                  <li className="group relative h-full overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition-shadow duration-300 hover:shadow-xl">
                    <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                      <ImageMedia
                        fill
                        imgClassName="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                        resource={slide.media}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent transition-opacity duration-300 group-hover:from-black/90" />
                      <div className="absolute inset-x-0 bottom-0 translate-y-2 p-4 transition-transform duration-300 group-hover:translate-y-0">
                        <p className="font-semibold text-white">{slide.hotelName}</p>
                        {slide.shortDescription && (
                          <p className="mt-1 line-clamp-2 max-h-0 text-sm text-white/85 opacity-0 transition-all duration-300 group-hover:mt-1.5 group-hover:max-h-12 group-hover:opacity-100">
                            {slide.shortDescription}
                          </p>
                        )}
                      </div>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ul>

            {totalPages > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index}
                    type="button"
                    aria-label={`${pageLabel} ${index + 1}`}
                    aria-current={index === page ? 'true' : undefined}
                    onClick={() => setPage(index)}
                    className={cn(
                      'h-2 rounded-full transition-all duration-300',
                      index === page
                        ? 'w-7 bg-[var(--coral)]'
                        : 'w-2 bg-teal-700/25 hover:bg-teal-700/50',
                    )}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
