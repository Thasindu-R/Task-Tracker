'use client'

import * as React from 'react'
import { supabaseBrowserClient } from '@/lib/supabase'
import type { User } from '@/types'

function mapSupabaseUser(user: {
  id: string
  email?: string | null
  user_metadata?: Record<string, unknown>
}): User {
  return {
    id: user.id,
    email: user.email ?? '',
    avatarUrl:
      typeof user.user_metadata?.avatar_url === 'string'
        ? user.user_metadata.avatar_url
        : null,
    name:
      typeof user.user_metadata?.name === 'string'
        ? user.user_metadata.name
        : null,
  }
}

export function useAuth() {
  const supabase = supabaseBrowserClient
  const [user, setUser] = React.useState<User | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    let mounted = true

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return
      const sessionUser = data.session?.user
      setUser(sessionUser ? mapSupabaseUser(sessionUser) : null)
      setLoading(false)
    })

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const sessionUser = session?.user
        setUser(sessionUser ? mapSupabaseUser(sessionUser) : null)
      },
    )

    return () => {
      mounted = false
      subscription.subscription.unsubscribe()
    }
  }, [supabase])

  const login = async (email: string, password: string) => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    setLoading(false)
    if (error) throw error
  }

  const signup = async (name: string, email: string, password: string) => {
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        emailRedirectTo: `${window.location.origin}/api/auth/callback`,
      },
    })
    setLoading(false)
    if (error) throw error
  }

  const loginWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    })
  }

  const logout = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signOut()
    setLoading(false)
    if (error) throw error
  }

  return {
    user,
    loading,
    login,
    signup,
    logout,
    loginWithGoogle,
  }
}
