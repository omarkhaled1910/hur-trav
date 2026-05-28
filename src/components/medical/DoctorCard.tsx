import Link from 'next/link'
import React from 'react'

import type { Doctor, Media } from '@/payload-types'
import { ImageMedia } from '@/components/Media/ImageMedia'
import { CertificationBadge } from './CertificationBadge'
import { cn } from '@/utilities/ui'

type Props = {
  doctor: Doctor
  className?: string
  locale?: string
}

export const DoctorCard: React.FC<Props> = ({ doctor, className }) => {
  const profileImage =
    doctor.profileImage && typeof doctor.profileImage === 'object'
      ? (doctor.profileImage as Media)
      : null

  return (
    <article
      className={cn(
        'group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md',
        className,
      )}
    >
      <Link href={`/doctors/${doctor.slug}`} className="relative aspect-[4/5] overflow-hidden bg-muted">
        {profileImage ? (
          <ImageMedia
            fill
            imgClassName="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            resource={profileImage}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
            No photo
          </div>
        )}
        {doctor.certifiedEurope && (
          <div className="absolute start-3 top-3">
            <CertificationBadge />
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <div>
          {doctor.professionalTitle && (
            <p className="text-xs font-medium uppercase tracking-wide text-teal-700 dark:text-teal-300">
              {doctor.professionalTitle}
            </p>
          )}
          <h3 className="text-lg font-semibold text-foreground">
            <Link href={`/doctors/${doctor.slug}`} className="hover:text-teal-700 dark:hover:text-teal-300">
              {doctor.fullName}
            </Link>
          </h3>
          <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
        </div>

        {doctor.shortBio && (
          <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">{doctor.shortBio}</p>
        )}

        <Link
          href={`/doctors/${doctor.slug}`}
          className="mt-auto text-sm font-medium text-teal-700 hover:underline dark:text-teal-300"
        >
          View profile →
        </Link>
      </div>
    </article>
  )
}
