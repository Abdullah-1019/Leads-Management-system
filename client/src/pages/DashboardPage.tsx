import { LogOut } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

const ROLE_LABEL: Record<string, string> = {
  APPLICANT: 'Applicant',
  INTERVIEWER: 'Interviewer',
  ADMIN: 'Admin',
}

export function DashboardPage() {
  const { user, logout } = useAuth()

  return (
    <main className="min-h-svh bg-slate-50">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
        <span className="text-sm font-semibold text-slate-900">Company CRM</span>
        <button
          onClick={() => void logout()}
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 transition hover:text-slate-900"
        >
          <LogOut className="size-4" />
          Sign out
        </button>
      </header>

      <div className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-2xl font-semibold text-slate-900">Welcome, {user?.name}</h1>
        <p className="mt-1 text-sm text-slate-500">
          Signed in as {user ? ROLE_LABEL[user.role] : ''} — role-specific dashboard widgets
          land in a later phase.
        </p>
      </div>
    </main>
  )
}
