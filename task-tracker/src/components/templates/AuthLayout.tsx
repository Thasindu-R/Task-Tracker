import type { ReactNode } from 'react'

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-neutral-50 via-white to-neutral-100 px-6">
      <div className="w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-lg">
        {children}
      </div>
    </div>
  )
}
