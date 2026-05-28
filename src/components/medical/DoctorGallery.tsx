import React from 'react'

import type { Media } from '@/payload-types'
import { ImageMedia } from '@/components/Media/ImageMedia'
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

  return (
    <section className={cn('space-y-4', className)}>
      <h2 className="text-xl font-semibold text-foreground">{title}</h2>
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {items.map((item, index) => {
          const media =
            item.image && typeof item.image === 'object' ? (item.image as Media) : null
          if (!media) return null

          return (
            <li
              key={item.id ?? index}
              className="overflow-hidden rounded-lg border border-border bg-muted"
            >
              <div className="relative aspect-square">
                <ImageMedia fill imgClassName="object-cover" resource={media} />
              </div>
              {item.caption && (
                <p className="px-2 py-1.5 text-xs text-muted-foreground">{item.caption}</p>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
