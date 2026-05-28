'use client'

import React, { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import type { Media } from '@/payload-types'
import { ImageMedia } from '@/components/Media/ImageMedia'
import { Button } from '@/components/ui/button'
import { cn } from '@/utilities/ui'

export type HotelGallerySlide = {
  id: string
  hotelName: string
  shortDescription?: string | null
  media: Media
}

type Props = {
  title: string
  description: string
  slides: HotelGallerySlide[]
  imagesPerPage?: number
  previousLabel: string
  nextLabel: string
  emptyLabel: string
  isRtl?: boolean
}

export const WhereYouCanBe: React.FC<Props> = ({
  title,
  description,
  slides,
  imagesPerPage = 6,
  previousLabel,
  nextLabel,
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

  if (slides.length === 0) {
    return (
      <section className="border-y border-border bg-muted/30 py-14 md:py-16">
        <div className="container">
          <div className="mb-8 max-w-2xl">
            <h2 className="text-2xl font-bold text-foreground md:text-3xl">{title}</h2>
            <p className="mt-2 text-muted-foreground">{description}</p>
          </div>
          <p className="rounded-lg border border-dashed border-border bg-background p-8 text-center text-muted-foreground">
            {emptyLabel}
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="border-y border-border bg-muted/30 py-14 md:py-16">
      <div className="container">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold text-foreground md:text-3xl">{title}</h2>
            <p className="mt-2 text-muted-foreground">{description}</p>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="border-teal-700/30"
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
                className="border-teal-700/30"
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                aria-label={nextLabel}
              >
                <NextIcon className="size-4" />
              </Button>
            </div>
          )}
        </div>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {currentSlides.map((slide) => (
            <li
              key={slide.id}
              className="group overflow-hidden rounded-xl border border-border bg-card shadow-sm"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                <ImageMedia
                  fill
                  imgClassName="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  resource={slide.media}
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent p-4 pt-12">
                  <p className="font-semibold text-white">{slide.hotelName}</p>
                  {slide.shortDescription && (
                    <p className="mt-1 line-clamp-2 text-sm text-white/85">{slide.shortDescription}</p>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>

        {totalPages > 1 && (
          <div className="mt-6 flex justify-center gap-1.5">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                type="button"
                aria-label={`Page ${index + 1}`}
                aria-current={index === page ? 'true' : undefined}
                onClick={() => setPage(index)}
                className={cn(
                  'size-2 rounded-full transition-colors',
                  index === page ? 'bg-teal-700' : 'bg-teal-700/25 hover:bg-teal-700/50',
                )}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
