'use client'

import React from 'react'

import type { Media } from '@/payload-types'
import { ZoomableGallery } from '@/components/medical/ZoomableGallery'
import { cn } from '@/utilities/ui'

type GalleryItem = {
  image: string | Media
  caption?: string | null
  id?: string | null
}

type Props = {
  title: string
  items?: GalleryItem[] | null
  className?: string
}

export const DoctorGallery: React.FC<Props> = ({ title, items, className }) => {
  if (!items?.length) return null

  const zoomableItems = items
    .filter((item) => item.image && typeof item.image === 'object')
    .map((item) => ({
      image: item.image as Media,
      caption: item.caption,
      id: item.id,
    }))

  if (!zoomableItems.length) return null

  return (
    <section className={cn('space-y-4', className)}>
      <h2 className="text-xl font-semibold text-foreground">{title}</h2>
      <ZoomableGallery
        items={zoomableItems}
        gridClassName="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4"
      />
    </section>
  )
}
