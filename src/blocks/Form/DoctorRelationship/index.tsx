'use client'

import type { Control, FieldErrorsImpl } from 'react-hook-form'
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Controller } from 'react-hook-form'

import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getClientSideURL } from '@/utilities/getURL'
import { Error as FieldError } from '../Error'
import { Width } from '../Width'

type DoctorOption = {
  id: string
  fullName: string
  specialty: string
  certifiedEurope?: boolean | null
}

export type DoctorRelationshipField = {
  blockType: 'doctorRelationship'
  name: string
  label?: string
  required?: boolean
  width?: number
}

export const DoctorRelationship: React.FC<
  DoctorRelationshipField & {
    control: Control
    errors: Partial<FieldErrorsImpl>
  }
> = ({ name, control, errors, label, required, width }) => {
  const searchParams = useSearchParams()
  const preselectedDoctorId = searchParams.get('doctor')
  const [doctors, setDoctors] = useState<DoctorOption[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const res = await fetch(
          `${getClientSideURL()}/api/doctors?where[published][equals]=true&limit=100&depth=0&sort=fullName`,
        )
        if (!res.ok) throw new Error('Failed to load doctors')
        const data = (await res.json()) as { docs: DoctorOption[] }
        setDoctors(data.docs ?? [])
      } catch (err) {
        console.error('[DoctorRelationship]', err)
        setDoctors([])
      } finally {
        setLoading(false)
      }
    }

    void loadDoctors()
  }, [])

  const fieldLabel = label || 'Preferred Doctor'

  return (
    <Width width={width}>
      <Label htmlFor={name}>
        {fieldLabel}
        {required && (
          <span className="required">
            * <span className="sr-only">(required)</span>
          </span>
        )}
      </Label>
      <Controller
        control={control}
        name={name}
        defaultValue={preselectedDoctorId ?? undefined}
        rules={{ required: required ? `${fieldLabel} is required` : false }}
        render={({ field: { onChange, value } }) => (
          <Select
            disabled={loading || doctors.length === 0}
            onValueChange={onChange}
            value={typeof value === 'string' ? value : undefined}
          >
            <SelectTrigger className="w-full" id={name}>
              <SelectValue
                placeholder={
                  loading
                    ? 'Loading doctors…'
                    : doctors.length === 0
                      ? 'No doctors available'
                      : fieldLabel
                }
              />
            </SelectTrigger>
            <SelectContent>
              {doctors.map((doctor) => (
                <SelectItem key={doctor.id} value={doctor.id}>
                  {doctor.fullName}
                  {doctor.specialty ? ` — ${doctor.specialty}` : ''}
                  {doctor.certifiedEurope ? ' · EU Certified' : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      {errors[name] && <FieldError name={name} />}
    </Width>
  )
}
