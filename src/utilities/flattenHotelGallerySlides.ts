import type { Hotel, Media } from '@/payload-types'

import type { HotelGallerySlide } from '@/components/medical/WhereYouCanBe'

export function flattenHotelGallerySlides(hotels: Hotel[]): HotelGallerySlide[] {
  const slides: HotelGallerySlide[] = []

  for (const hotel of hotels) {
    if (!hotel.images?.length) continue

    for (const image of hotel.images) {
      if (!image || typeof image !== 'object') continue

      slides.push({
        id: `${hotel.id}-${image.id}`,
        hotelName: hotel.name,
        shortDescription: hotel.shortDescription,
        media: image as Media,
      })
    }
  }

  return slides
}
