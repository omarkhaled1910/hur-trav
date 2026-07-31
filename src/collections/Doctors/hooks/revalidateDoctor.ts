import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'

import type { Doctor } from '@/payload-types'

export const revalidateDoctor: CollectionAfterChangeHook<Doctor> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (context.disableRevalidate) return doc

  if (doc.published) {
    revalidatePath(`/doctors/${doc.slug}`)
    revalidatePath(`/doctors/${doc.slug}`, 'layout')
    revalidatePath('/doctors')
    revalidatePath('/')
    revalidateTag('doctors')
  }

  if (previousDoc?.published && !doc.published) {
    revalidatePath(`/doctors/${previousDoc.slug}`)
    revalidatePath(`/doctors/${previousDoc.slug}`, 'layout')
    revalidatePath('/doctors')
    revalidatePath('/')
    revalidateTag('doctors')
  }

  payload.logger.info(`Revalidated doctor: ${doc.slug}`)

  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Doctor> = ({ doc, req: { context } }) => {
  if (context.disableRevalidate) return doc

  revalidatePath('/doctors')
  revalidatePath('/')
  revalidateTag('doctors')

  return doc
}
