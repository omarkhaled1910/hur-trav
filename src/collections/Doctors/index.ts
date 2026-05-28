import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { authenticated } from '../../access/authenticated'
import { publishedOnly } from '../../access/publishedOnly'
import { revalidateDelete, revalidateDoctor } from './hooks/revalidateDoctor'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

const profileEditor = lexicalEditor({
  features: ({ rootFeatures }) => [
    ...rootFeatures,
    HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
    FixedToolbarFeature(),
    InlineToolbarFeature(),
  ],
})

export const Doctors: CollectionConfig = {
  slug: 'doctors',
  admin: {
    useAsTitle: 'fullName',
    defaultColumns: ['fullName', 'specialty', 'certifiedEurope', 'featured', 'published', 'updatedAt'],
    group: 'Medical Tourism',
    preview: (doc) => {
      if (!doc?.slug) return null
      return `${process.env.NEXT_PUBLIC_SERVER_URL}/doctors/${doc.slug}`
    },
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: publishedOnly,
    update: authenticated,
  },
  fields: [
    {
      name: 'fullName',
      label: 'Full Name',
      type: 'text',
      required: true,
    },
    slugField({ fieldToUse: 'fullName' }),
    {
      name: 'professionalTitle',
      label: 'Professional Title',
      type: 'text',
      admin: {
        description: 'e.g. Consultant Plastic Surgeon',
      },
    },
    {
      name: 'specialty',
      label: 'Specialty',
      type: 'text',
      required: true,
      index: true,
    },
    {
      name: 'certifiedEurope',
      label: 'European Certified',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Display European certification badge on profile',
      },
    },
    {
      name: 'featured',
      label: 'Featured on Homepage',
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
      type: 'tabs',
      tabs: [
        {
          label: 'Profile',
          fields: [
            {
              name: 'profileImage',
              label: 'Profile Photo',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
            {
              name: 'shortBio',
              label: 'Short Bio',
              type: 'textarea',
              maxLength: 280,
              admin: {
                description: 'Shown on cards and listing pages',
              },
            },
            {
              name: 'biography',
              label: 'Full Biography',
              type: 'richText',
              editor: profileEditor,
            },
            {
              name: 'languages',
              label: 'Languages Spoken',
              type: 'array',
              fields: [
                {
                  name: 'language',
                  type: 'text',
                  required: true,
                },
              ],
            },
            {
              name: 'yearsOfExperience',
              label: 'Years of Experience',
              type: 'number',
              min: 0,
            },
          ],
        },
        {
          label: 'Career History',
          fields: [
            {
              name: 'careerHistory',
              label: 'Career Timeline',
              type: 'array',
              admin: {
                initCollapsed: true,
              },
              fields: [
                {
                  name: 'role',
                  label: 'Role / Title',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'institution',
                  label: 'Institution / Hospital',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'location',
                  label: 'City, Country',
                  type: 'text',
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'startYear',
                      label: 'Start Year',
                      type: 'number',
                      admin: { width: '50%' },
                    },
                    {
                      name: 'endYear',
                      label: 'End Year',
                      type: 'number',
                      admin: {
                        width: '50%',
                        description: 'Leave empty if current role',
                      },
                    },
                  ],
                },
                {
                  name: 'isCurrent',
                  label: 'Current Position',
                  type: 'checkbox',
                  defaultValue: false,
                },
                {
                  name: 'summary',
                  label: 'Summary',
                  type: 'textarea',
                },
              ],
            },
          ],
        },
        {
          label: 'European Certifications',
          fields: [
            {
              name: 'europeanCertifications',
              label: 'Certifications',
              type: 'array',
              admin: {
                initCollapsed: true,
                description: 'Board certifications, fellowships, and European credentials',
              },
              fields: [
                {
                  name: 'name',
                  label: 'Certification Name',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'issuingBody',
                  label: 'Issuing Body',
                  type: 'text',
                  required: true,
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'country',
                      label: 'Country',
                      type: 'text',
                      admin: { width: '50%' },
                    },
                    {
                      name: 'yearObtained',
                      label: 'Year',
                      type: 'number',
                      admin: { width: '50%' },
                    },
                  ],
                },
                {
                  name: 'credentialId',
                  label: 'Credential ID',
                  type: 'text',
                },
                {
                  name: 'certificateDocument',
                  label: 'Certificate Document',
                  type: 'upload',
                  relationTo: 'media',
                },
                {
                  name: 'supportingGallery',
                  label: 'Supporting Images',
                  type: 'array',
                  fields: [
                    {
                      name: 'image',
                      type: 'upload',
                      relationTo: 'media',
                      required: true,
                    },
                    {
                      name: 'caption',
                      type: 'text',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Galleries',
          fields: [
            {
              name: 'clinicGallery',
              label: 'Clinic Gallery',
              type: 'array',
              admin: {
                description: 'Facility, consultation rooms, and clinic environment',
              },
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                },
                {
                  name: 'caption',
                  type: 'text',
                },
              ],
            },
            {
              name: 'procedureGallery',
              label: 'Procedure Gallery',
              type: 'array',
              admin: {
                description:
                  'Post-procedure and clinical imagery (ensure patient consent in admin workflow)',
              },
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                },
                {
                  name: 'caption',
                  type: 'text',
                },
              ],
            },
          ],
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),
            MetaDescriptionField({}),
            PreviewField({
              hasGenerateFn: true,
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateDoctor],
    afterDelete: [revalidateDelete],
  },
}
