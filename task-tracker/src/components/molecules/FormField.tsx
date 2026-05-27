'use client'

import * as React from 'react'
import { Label } from '@/components/atoms/Label'
import { Input, type InputProps } from '@/components/atoms/Input'
import { cn } from '@/lib/utils'

export type FormFieldProps = InputProps & {
  label: string
  name: string
  error?: string
}

export function FormField({
  label,
  name,
  error,
  className,
  ...props
}: FormFieldProps) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} error={error} {...props} />
      {error ? <p className="text-xs text-rose-500">{error}</p> : null}
    </div>
  )
}
