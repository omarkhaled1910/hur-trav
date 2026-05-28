import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'

import type { Hotel } from '@/payload-types'

export const revalidateHotel: CollectionAfterChangeHook<Hotel> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (context.disableRevalidate) return doc

  if (doc.published) {
    revalidatePath('/')
    revalidateTag('hotels')
  }

  if (previousDoc?.published && !doc.published) {
    revalidatePath('/')
    revalidateTag('hotels')
  }

  payload.logger.info(`Revalidated hotel: ${doc.name}`)

  return doc
}

export const revalidateHotelDelete: CollectionAfterDeleteHook<Hotel> = ({ doc, req: { context } }) => {
  if (context.disableRevalidate) return doc

  revalidatePath('/')
  revalidateTag('hotels')

  return doc
}
