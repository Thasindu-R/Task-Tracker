'use client'

import * as React from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { AuthLayout } from '@/components/templates/AuthLayout'
import { FormField } from '@/components/molecules/FormField'
import { Button } from '@/components/atoms/Button'
import { useAuth } from '@/hooks/useAuth'

const signupSchema = z
  .object({
    name: z.string().min(2, 'Name is required'),
    email: z.string().email('Enter a valid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type SignupValues = z.infer<typeof signupSchema>

export default function SignupPage() {
  const { signup, loading } = useAuth()
  const router = useRouter()
  const [error, setError] = React.useState<string | null>(null)

  const form = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (values: SignupValues) => {
    setError(null)
    try {
      await signup(values.name, values.email, values.password)
      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed')
    }
  }

  return (
    <AuthLayout>
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-semibold">Create your account</h1>
          <p className="text-sm text-muted-foreground">
            Start organizing your tasks in minutes.
          </p>
        </div>

        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            label="Name"
            name="name"
            placeholder="Your name"
            error={form.formState.errors.name?.message}
            {...form.register('name')}
          />
          <FormField
            label="Email"
            name="email"
            type="email"
            placeholder="you@example.com"
            error={form.formState.errors.email?.message}
            {...form.register('email')}
          />
          <FormField
            label="Password"
            name="password"
            type="password"
            placeholder="Create a password"
            error={form.formState.errors.password?.message}
            {...form.register('password')}
          />
          <FormField
            label="Confirm password"
            name="confirmPassword"
            type="password"
            placeholder="Repeat password"
            error={form.formState.errors.confirmPassword?.message}
            {...form.register('confirmPassword')}
          />

          {error ? <p className="text-sm text-rose-500">{error}</p> : null}

          <Button type="submit" className="w-full" isLoading={loading}>
            Create account
          </Button>
        </form>
      </div>
    </AuthLayout>
  )
}
