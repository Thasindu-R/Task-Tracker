'use client'

import * as React from 'react'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/atoms/Input'
import { Button } from '@/components/atoms/Button'

export type SearchBarProps = {
  placeholder?: string
  onSearch: (value: string) => void
  delay?: number
}

export function SearchBar({
  placeholder = 'Search tasks',
  onSearch,
  delay = 300,
}: SearchBarProps) {
  const [value, setValue] = React.useState('')

  React.useEffect(() => {
    const timeout = setTimeout(() => onSearch(value.trim()), delay)
    return () => clearTimeout(timeout)
  }, [value, delay, onSearch])

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={placeholder}
          className="pl-9"
          aria-label="Search tasks"
        />
      </div>
      {value.length > 0 ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setValue('')}
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </Button>
      ) : null}
    </div>
  )
}
