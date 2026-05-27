'use client'

import * as React from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { supabaseBrowserClient } from '@/lib/supabase'
import { AuthLayout } from '@/components/templates/AuthLayout'
import { FormField } from '@/components/molecules/FormField'
import { Button } from '@/components/atoms/Button'

const signupSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

type SignupFormValues = z.infer<typeof signupSchema>

export function SignupPage() {
  const [error, setError] = React.useState<string | null>(null)
  const [isSuccess, setIsSuccess] = React.useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  })

  const onSubmit = async (data: SignupFormValues) => {
    setError(null)
    const { error: signUpError } = await supabaseBrowserClient.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          name: data.name,
        },
      },
    })

    if (signUpError) {
      setError(signUpError.message)
      return
    }

    setIsSuccess(true)
  }

  if (isSuccess) {
    return (
      <AuthLayout>
        <div className="flex flex-col items-center justify-center gap-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-neutral-900">
              Check your email
            </h2>
            <p className="mt-2 text-sm text-neutral-500">
              We&apos;ve sent you a verification link to confirm your account.
            </p>
          </div>
          <Link
            href="/login"
            className="mt-4 text-sm font-medium text-violet-600 hover:text-violet-700 hover:underline"
          >
            Return to login
          </Link>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout>
      <div className="flex flex-col gap-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-neutral-900">
            Create an account
          </h2>
          <p className="mt-2 text-sm text-neutral-500">
            Sign up to start tracking your tasks
          </p>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FormField
            label="Name"
            type="text"
            placeholder="John Doe"
            {...register('name')}
            error={errors.name?.message}
          />
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
            Create account
          </Button>
        </form>

        <p className="text-center text-sm text-neutral-500">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-medium text-violet-600 hover:text-violet-700 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
