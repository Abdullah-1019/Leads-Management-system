import { Navigate, useNavigate } from 'react-router-dom'
import { LoginForm } from '../features/auth/LoginForm'
import { useAuth } from '../hooks/useAuth'

export function LoginPage() {
  const { status } = useAuth()
  const navigate = useNavigate()

  if (status === 'authenticated') {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <main className="flex min-h-svh items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 text-center">
          <h1 className="text-xl font-semibold text-slate-900">Company CRM</h1>
          <p className="mt-1 text-sm text-slate-500">Sign in to your account</p>
        </div>

        <LoginForm onSuccess={() => navigate('/dashboard', { replace: true })} />
      </div>
    </main>
  )
}
