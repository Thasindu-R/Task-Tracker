import type { Metadata } from 'next'
import { Space_Grotesk, IBM_Plex_Mono } from 'next/font/google'
import { cn } from '@/lib/utils'
import '@/app/globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-sans',
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'Task Tracker',
  description: 'Manage tasks with clarity and focus',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={cn('h-full', spaceGrotesk.variable, ibmPlexMono.variable)}
    >
      <body className="min-h-full bg-background font-sans text-foreground">
        {children}
      </body>
    </html>
  )
}
