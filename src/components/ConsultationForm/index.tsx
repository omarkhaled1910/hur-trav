'use client'

import React from 'react'

import { FormBlock } from '@/blocks/Form/Component'
import type { Form } from '@/payload-types'

type Props = {
  form: Form
  className?: string
}

/**
 * Consultation inquiry form — posts to /api/form-submissions with submissionData entries
 * including { field: 'doctorRelationship', value: '<doctorMongoId>' } when that block is used.
 */
export const ConsultationForm: React.FC<Props> = ({ form, className }) => {
  return (
    <div className={className}>
      <FormBlock
        enableIntro={false}
        form={form as Parameters<typeof FormBlock>[0]['form']}
      />
    </div>
  )
}
