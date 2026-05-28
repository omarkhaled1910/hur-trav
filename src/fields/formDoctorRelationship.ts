import type { Block } from 'payload'

/**
 * Custom form-builder field block for selecting a doctor.
 * Submissions use: { field: 'doctorRelationship', value: '<doctorMongoId>' }
 */
export const formDoctorRelationshipBlock: Block = {
  slug: 'doctorRelationship',
  labels: {
    singular: 'Doctor Selection',
    plural: 'Doctor Selections',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      defaultValue: 'doctorRelationship',
      admin: {
        readOnly: true,
        description: 'Submission key — must remain doctorRelationship',
      },
    },
    {
      name: 'label',
      type: 'text',
      label: 'Label',
      defaultValue: 'Preferred Doctor',
    },
    {
      name: 'required',
      type: 'checkbox',
      label: 'Required',
      defaultValue: true,
    },
    {
      name: 'width',
      type: 'number',
      label: 'Width (%)',
      defaultValue: 100,
    },
  ],
}
