'use client'

import React, { useCallback, useEffect, useId, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from 'lucide-react'

import type { Media } from '@/payload-types'
import { ImageMedia } from '@/components/Media/ImageMedia'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { cn } from '@/utilities/ui'

export type ZoomableGalleryItem = {
  image: Media
  caption?: string | null
  id?: string | null
}

type Props = {
  items: ZoomableGalleryItem[]
  className?: string
  /** Tailwind grid classes for the thumbnail strip */
  gridClassName?: string
  aspectClassName?: string
}

const MIN_ZOOM = 1
const MAX_ZOOM = 4
const ZOOM_STEP = 0.5

export const ZoomableGallery: React.FC<Props> = ({
  items,
  className,
  gridClassName = 'grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4',
  aspectClassName = 'aspect-square',
}) => {
  const titleId = useId()
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [zoom, setZoom] = useState(MIN_ZOOM)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const dragRef = useRef<{ startX: number; startY: number; originX: number; originY: number } | null>(
    null,
  )
  const stageRef = useRef<HTMLDivElement | null>(null)

  const isOpen = activeIndex !== null
  const active = isOpen ? items[activeIndex] : null
  const activeSrc =
    active?.image?.url != null
      ? getMediaUrl(active.image.url, active.image.updatedAt)
      : ''

  const close = useCallback(() => {
    setActiveIndex(null)
    setZoom(MIN_ZOOM)
    setOffset({ x: 0, y: 0 })
  }, [])

  const go = useCallback(
    (delta: number) => {
      if (activeIndex === null || items.length === 0) return
      const next = (activeIndex + delta + items.length) % items.length
      setActiveIndex(next)
      setZoom(MIN_ZOOM)
      setOffset({ x: 0, y: 0 })
    },
    [activeIndex, items.length],
  )

  const adjustZoom = useCallback((delta: number) => {
    setZoom((current) => {
      const next = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, current + delta))
      if (next === MIN_ZOOM) setOffset({ x: 0, y: 0 })
      return next
    })
  }, [])

  useEffect(() => {
    if (!isOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
      if (event.key === 'ArrowRight') go(1)
      if (event.key === 'ArrowLeft') go(-1)
      if (event.key === '+' || event.key === '=') adjustZoom(ZOOM_STEP)
      if (event.key === '-') adjustZoom(-ZOOM_STEP)
    }

    const stage = stageRef.current
    const onWheel = (event: WheelEvent) => {
      event.preventDefault()
      adjustZoom(event.deltaY < 0 ? ZOOM_STEP / 2 : -ZOOM_STEP / 2)
    }

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)
    stage?.addEventListener('wheel', onWheel, { passive: false })

    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKeyDown)
      stage?.removeEventListener('wheel', onWheel)
    }
  }, [adjustZoom, close, go, isOpen])

  const onPointerDown = (event: React.PointerEvent) => {
    if (zoom <= MIN_ZOOM) return
    event.currentTarget.setPointerCapture(event.pointerId)
    dragRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      originX: offset.x,
      originY: offset.y,
    }
  }

  const onPointerMove = (event: React.PointerEvent) => {
    if (!dragRef.current || zoom <= MIN_ZOOM) return
    const { startX, startY, originX, originY } = dragRef.current
    setOffset({
      x: originX + (event.clientX - startX),
      y: originY + (event.clientY - startY),
    })
  }

  const onPointerUp = (event: React.PointerEvent) => {
    if (dragRef.current) {
      event.currentTarget.releasePointerCapture(event.pointerId)
      dragRef.current = null
    }
  }

  if (!items.length) return null

  return (
    <>
      <ul className={cn(gridClassName, className)}>
        {items.map((item, index) => (
          <li key={item.id ?? index} className="min-w-0">
            <button
              type="button"
              className="group relative block w-full overflow-hidden rounded-lg border border-border bg-muted text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
              onClick={() => setActiveIndex(index)}
              aria-label={item.caption || item.image.alt || `Open image ${index + 1}`}
            >
              <div className={cn('relative', aspectClassName)}>
                <ImageMedia
                  fill
                  imgClassName="object-cover transition duration-300 group-hover:scale-[1.03]"
                  resource={item.image}
                />
                <span className="pointer-events-none absolute inset-0 flex items-end justify-end bg-gradient-to-t from-black/35 via-transparent to-transparent p-2 opacity-0 transition group-hover:opacity-100">
                  <ZoomIn className="size-5 text-white drop-shadow" aria-hidden />
                </span>
              </div>
              {item.caption ? (
                <p className="px-2 py-1.5 text-xs text-muted-foreground">{item.caption}</p>
              ) : null}
            </button>
          </li>
        ))}
      </ul>

      {isOpen && active ? (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-black/90 text-white"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
        >
          <div className="flex items-center justify-between gap-3 border-b border-white/10 px-3 py-3 sm:px-5">
            <p id={titleId} className="min-w-0 truncate text-sm text-white/80">
              {active.caption || active.image.alt || `${activeIndex! + 1} / ${items.length}`}
            </p>
            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                className="rounded-md p-2 hover:bg-white/10 disabled:opacity-40"
                onClick={() => adjustZoom(-ZOOM_STEP)}
                disabled={zoom <= MIN_ZOOM}
                aria-label="Zoom out"
              >
                <ZoomOut className="size-5" />
              </button>
              <span className="min-w-[3rem] text-center text-xs tabular-nums text-white/70">
                {Math.round(zoom * 100)}%
              </span>
              <button
                type="button"
                className="rounded-md p-2 hover:bg-white/10 disabled:opacity-40"
                onClick={() => adjustZoom(ZOOM_STEP)}
                disabled={zoom >= MAX_ZOOM}
                aria-label="Zoom in"
              >
                <ZoomIn className="size-5" />
              </button>
              <button
                type="button"
                className="rounded-md p-2 hover:bg-white/10"
                onClick={close}
                aria-label="Close"
              >
                <X className="size-5" />
              </button>
            </div>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center">
            {items.length > 1 ? (
              <>
                <button
                  type="button"
                  className="absolute start-2 z-10 rounded-full bg-black/50 p-2 hover:bg-black/70 sm:start-4"
                  onClick={() => go(-1)}
                  aria-label="Previous image"
                >
                  <ChevronLeft className="size-6" />
                </button>
                <button
                  type="button"
                  className="absolute end-2 z-10 rounded-full bg-black/50 p-2 hover:bg-black/70 sm:end-4"
                  onClick={() => go(1)}
                  aria-label="Next image"
                >
                  <ChevronRight className="size-6" />
                </button>
              </>
            ) : null}

            <div
              ref={stageRef}
              className={cn(
                'flex h-full w-full items-center justify-center overflow-hidden px-12 py-6 sm:px-16',
                zoom > MIN_ZOOM ? 'cursor-grab active:cursor-grabbing' : 'cursor-zoom-in',
              )}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              onDoubleClick={() => {
                if (zoom > MIN_ZOOM) {
                  setZoom(MIN_ZOOM)
                  setOffset({ x: 0, y: 0 })
                } else {
                  setZoom(2)
                }
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeSrc}
                alt={active.caption || active.image.alt || ''}
                draggable={false}
                className="max-h-full max-w-full select-none object-contain transition-transform duration-150"
                style={{
                  transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
                }}
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
