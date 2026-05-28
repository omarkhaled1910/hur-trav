import type { RequiredDataFromCollectionSlug } from 'payload'

/**
 * Seed data for the medical tourism consultation form.
 * Create via Payload admin or seed script; includes doctorRelationship block.
 */
export const medicalConsultationForm: RequiredDataFromCollectionSlug<'forms'> = {
  title: 'Medical Consultation',
  submitButtonLabel: 'Request Consultation',
  confirmationType: 'message',
  confirmationMessage: {
    root: {
      type: 'root',
      children: [
        {
          type: 'heading',
          children: [
            {
              type: 'text',
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: 'Thank you — our medical concierge will contact you shortly.',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          tag: 'h2',
          version: 1,
        },
      ],
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    },
  },
  fields: [
    {
      name: 'fullName',
      blockName: 'fullName',
      blockType: 'text',
      label: 'Full Name',
      required: true,
      width: 100,
    },
    {
      name: 'email',
      blockName: 'email',
      blockType: 'email',
      label: 'Email',
      required: true,
      width: 100,
    },
    {
      name: 'phone',
      blockName: 'phone',
      blockType: 'text',
      label: 'Phone / WhatsApp',
      required: true,
      width: 100,
    },
    {
      name: 'doctorRelationship',
      blockName: 'doctorRelationship',
      blockType: 'doctorRelationship',
      label: 'Preferred Doctor',
      required: true,
      width: 100,
    },
    {
      name: 'procedureInterest',
      blockName: 'procedureInterest',
      blockType: 'textarea',
      label: 'Procedure or treatment interest',
      required: false,
      width: 100,
    },
    {
      name: 'travelDates',
      blockName: 'travelDates',
      blockType: 'text',
      label: 'Preferred travel dates',
      required: false,
      width: 100,
    },
  ],
}
