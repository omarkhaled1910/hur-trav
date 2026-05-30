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
          label: 'Procedure gallery',
          fields: [
            {
              name: 'procedureGallery',
              label: 'General procedure gallery',
              type: 'array',
              admin: {
                description:
                  'Doctor-level procedure imagery not tied to a specific surgery entry (ensure patient consent in admin workflow)',
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
          label: 'Surgeries',
          fields: [
            {
              name: 'surgeries',
              label: 'Procedures & surgeries',
              type: 'array',
              admin: {
                initCollapsed: true,
                description:
                  'Offered procedures with typical pricing, downtime, and stay guidance for medical travelers.',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'title',
                      label: 'Title',
                      type: 'text',
                      required: true,
                      admin: { width: '50%' },
                    },
                    {
                      name: 'procedureCategory',
                      label: 'Category',
                      type: 'text',
                      admin: {
                        width: '50%',
                        description: 'e.g. Body contouring, Facial',
                      },
                    },
                  ],
                },
                {
                  name: 'description',
                  label: 'Description',
                  type: 'textarea',
                  admin: {
                    description: 'What the procedure involves and who it suits',
                  },
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'averagePrice',
                      label: 'Average price',
                      type: 'number',
                      min: 0,
                      admin: {
                        width: '33%',
                        description: 'Typical package or procedure average',
                      },
                    },
                    {
                      name: 'priceCurrency',
                      label: 'Currency',
                      type: 'select',
                      defaultValue: 'USD',
                      options: [
                        { label: 'USD', value: 'USD' },
                        { label: 'EUR', value: 'EUR' },
                        { label: 'GBP', value: 'GBP' },
                        { label: 'EGP', value: 'EGP' },
                      ],
                      admin: { width: '33%' },
                    },
                    {
                      name: 'priceNote',
                      label: 'Price note',
                      type: 'text',
                      admin: {
                        width: '34%',
                        description: 'e.g. incl. consultation, from',
                      },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'downtime',
                      label: 'Downtime',
                      type: 'text',
                      admin: {
                        width: '50%',
                        description: 'Time off work / limited activity (e.g. 5–7 days)',
                      },
                    },
                    {
                      name: 'stayTime',
                      label: 'Recommended stay',
                      type: 'text',
                      admin: {
                        width: '50%',
                        description: 'Suggested nights in destination (e.g. 7–10 nights)',
                      },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'anesthesiaType',
                      label: 'Anesthesia',
                      type: 'select',
                      options: [
                        { label: 'Local', value: 'local' },
                        { label: 'Sedation', value: 'sedation' },
                        { label: 'General', value: 'general' },
                        { label: 'Varies', value: 'varies' },
                        { label: 'None / N/A', value: 'none' },
                      ],
                      admin: { width: '50%' },
                    },
                    {
                      name: 'featuredProcedure',
                      label: 'Highlight on profile',
                      type: 'checkbox',
                      defaultValue: false,
                      admin: { width: '50%' },
                    },
                  ],
                },
                {
                  name: 'recoveryNotes',
                  label: 'Recovery notes',
                  type: 'textarea',
                  admin: {
                    description: 'Follow-up visits, compression garments, activity limits, etc.',
                  },
                },
                {
                  name: 'occurrences',
                  label: 'Occurrences',
                  type: 'array',
                  admin: {
                    initCollapsed: true,
                    description:
                      'Separate cases or visits for this procedure—each with its own photos and notes (ensure consent for clinical images).',
                  },
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'title',
                          label: 'Title',
                          type: 'text',
                          required: true,
                          admin: {
                            width: '50%',
                            description: 'e.g. Case study — primary rhinoplasty',
                          },
                        },
                        {
                          name: 'occurrenceDate',
                          label: 'Date',
                          type: 'date',
                          admin: {
                            width: '50%',
                            description: 'Procedure or visit date (optional)',
                          },
                        },
                      ],
                    },
                    {
                      name: 'stage',
                      label: 'Stage',
                      type: 'select',
                      options: [
                        { label: 'Pre-operative', value: 'pre_op' },
                        { label: 'Post-operative (early)', value: 'post_op_early' },
                        { label: 'Post-operative (follow-up)', value: 'post_op_followup' },
                        { label: 'Long-term result', value: 'long_term' },
                        { label: 'Other', value: 'other' },
                      ],
                    },
                    {
                      name: 'summary',
                      label: 'Summary',
                      type: 'textarea',
                      admin: {
                        description: 'Goals, technique notes, or context for this occurrence',
                      },
                    },
                    {
                      name: 'outcomeNotes',
                      label: 'Outcome notes',
                      type: 'textarea',
                      admin: {
                        description: 'Anonymized, patient-safe notes suitable for the public site',
                      },
                    },
                    {
                      name: 'photos',
                      label: 'Photos',
                      type: 'array',
                      admin: {
                        initCollapsed: true,
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
                  name: 'heroImage',
                  label: 'Image',
                  type: 'upload',
                  relationTo: 'media',
                  admin: {
                    description: 'Optional photo for listings or detail cards',
                  },
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
