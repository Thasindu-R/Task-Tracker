import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const next = url.searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = createServerClient()
    await supabase.auth.exchangeCodeForSession(code)
  }

  return NextResponse.redirect(new URL(next, request.url))
}
