import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { publishedOnly } from '../../access/publishedOnly'
import { revalidateHotel, revalidateHotelDelete } from './hooks/revalidateHotel'

export const Hotels: CollectionConfig = {
  slug: 'hotels',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'published', 'featured', 'updatedAt'],
    group: 'Medical Tourism',
    description:
      'Add Hurghada hotels for the homepage gallery. Upload multiple photos in one go via the gallery field.',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: publishedOnly,
    update: authenticated,
  },
  fields: [
    {
      name: 'name',
      label: 'Hotel Name',
      type: 'text',
      required: true,
    },
    {
      name: 'shortDescription',
      label: 'Short Description',
      type: 'textarea',
      maxLength: 200,
      admin: {
        description: 'Optional marketing blurb shown on the homepage gallery',
      },
    },
    {
      name: 'images',
      label: 'Gallery images',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      required: true,
      admin: {
        description:
          'Bulk upload: drag multiple files into the picker, or select many existing images at once. Order here is used on the homepage.',
      },
    },
    {
      name: 'featured',
      label: 'Featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'published',
      label: 'Published',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'sortOrder',
      label: 'Sort Order',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        description: 'Lower numbers appear first on the homepage',
      },
    },
  ],
  hooks: {
    afterChange: [revalidateHotel],
    afterDelete: [revalidateHotelDelete],
  },
}
