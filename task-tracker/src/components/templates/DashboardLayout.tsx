'use client'

import * as React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Navbar } from '@/components/organisms/Navbar'
import { Sidebar } from '@/components/organisms/Sidebar'

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 px-6 py-8">{children}</main>
        </div>
      </div>
    </QueryClientProvider>
  )
}
