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

const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password is required'),
})

type LoginValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const { login, loginWithGoogle, loading } = useAuth()
  const router = useRouter()
  const [error, setError] = React.useState<string | null>(null)

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const { name: emailName, ...emailField } = form.register('email')
  const { name: passwordName, ...passwordField } = form.register('password')

  const onSubmit = async (values: LoginValues) => {
    setError(null)
    try {
      await login(values.email, values.password)
      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    }
  }

  return (
    <AuthLayout>
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-semibold">Welcome back</h1>
          <p className="text-sm text-muted-foreground">
            Sign in to manage your tasks.
          </p>
        </div>

        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            label="Email"
            name={emailName}
            type="email"
            placeholder="you@example.com"
            error={form.formState.errors.email?.message}
            {...emailField}
          />
          <FormField
            label="Password"
            name={passwordName}
            type="password"
            placeholder="Your password"
            error={form.formState.errors.password?.message}
            {...passwordField}
          />

          {error ? <p className="text-sm text-rose-500">{error}</p> : null}

          <Button type="submit" className="w-full" isLoading={loading}>
            Sign in
          </Button>
        </form>

        <Button
          variant="secondary"
          className="w-full"
          onClick={loginWithGoogle}
        >
          Continue with Google
        </Button>
      </div>
    </AuthLayout>
  )
}
