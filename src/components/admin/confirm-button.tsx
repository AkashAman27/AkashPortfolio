'use client'

import React, { useRef } from 'react'
import { Button } from '@/components/ui/button'

type Props = {
  action: (formData: FormData) => void
  fields: Record<string, string>
  confirmMessage?: string
  variant?: React.ComponentProps<typeof Button>['variant']
  size?: React.ComponentProps<typeof Button>['size']
  children: React.ReactNode
}

export default function ConfirmButton({ action, fields, confirmMessage = 'Are you sure? This action cannot be undone.', variant = 'destructive', size = 'sm', children }: Props) {
  const formRef = useRef<HTMLFormElement>(null)

  const onClick = (e: React.MouseEvent) => {
    if (!confirm(confirmMessage)) {
      e.preventDefault()
      return
    }
    // Allow the form to submit normally
  }

  return (
    <form ref={formRef} action={action} onSubmit={(e) => { /* submit gated by button confirm */ }}>
      {Object.entries(fields).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
      <Button variant={variant} size={size} type="submit" onClick={onClick}>
        {children}
      </Button>
    </form>
  )
}

