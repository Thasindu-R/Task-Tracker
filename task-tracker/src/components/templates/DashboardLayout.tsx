import { Navbar } from '@/components/organisms/Navbar'
import { Sidebar } from '@/components/organisms/Sidebar'

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background text-foreground">
      <Navbar />
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar />
        <main className="flex-1 overflow-y-auto px-4 py-6 md:ml-56 md:px-6 md:py-8 flex flex-col">
          {children}
        </main>
      </div>
    </div>
  )
}
