'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createBrowserClient } from '@/lib/supabase'
import { AuthLayout } from '@/components/templates/AuthLayout'
import { FormField } from '@/components/molecules/FormField'
import { Button } from '@/components/atoms/Button'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginPage() {
  const router = useRouter()
  const [error, setError] = React.useState<string | null>(null)
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormValues) => {
    setError(null)
    const supabase = createBrowserClient()
    
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (signInError) {
      setError(signInError.message)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <AuthLayout>
      <div className="flex flex-col gap-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-neutral-900">Welcome back</h2>
          <p className="mt-2 text-sm text-neutral-500">
            Enter your details to sign in to your account
          </p>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FormField
            label="Email"
            type="email"
            placeholder="you@example.com"
            {...register('email')}
            error={errors.email?.message}
          />
          <FormField
            label="Password"
            type="password"
            placeholder="••••••••"
            {...register('password')}
            error={errors.password?.message}
          />
          
          <Button 
            type="submit" 
            isLoading={isSubmitting} 
            className="mt-2 w-full bg-violet-600 hover:bg-violet-700 text-white"
          >
            Sign in
          </Button>
        </form>

        <p className="text-center text-sm text-neutral-500">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="font-medium text-violet-600 hover:text-violet-700 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
