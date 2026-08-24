import { AdminDashboard } from '../features/dashboard/AdminDashboard'
import { ApplicantDashboard } from '../features/dashboard/ApplicantDashboard'
import { InterviewerDashboard } from '../features/dashboard/InterviewerDashboard'
import { useAuth } from '../hooks/useAuth'

export function DashboardPage() {
  const { user } = useAuth()

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-slate-900">Welcome, {user?.name}</h1>
      {user?.role === 'APPLICANT' && <ApplicantDashboard />}
      {user?.role === 'INTERVIEWER' && <InterviewerDashboard />}
      {user?.role === 'ADMIN' && <AdminDashboard />}
    </div>
  )
}
