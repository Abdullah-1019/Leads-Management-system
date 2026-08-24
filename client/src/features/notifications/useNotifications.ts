import { useQuery } from '@tanstack/react-query'
import * as activityApi from '../../services/api/activity.api'
import * as dashboardApi from '../../services/api/dashboard.api'
import * as interviewsApi from '../../services/api/interviews.api'
import { useAuth } from '../../hooks/useAuth'
import type { AdminDashboardSummary } from '../../types/dashboard'

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
}

function companyName(applicationId: unknown) {
  if (!applicationId || typeof applicationId === 'string') return 'a company'
  return (applicationId as { companyName?: string }).companyName ?? 'a company'
}

export function useNotifications() {
  const { user } = useAuth()

  const interviewerQuery = useQuery({
    queryKey: ['notifications', 'interviewer-today'],
    queryFn: () => interviewsApi.listInterviews({ tab: 'today', limit: 20 }),
    enabled: user?.role === 'INTERVIEWER',
  })

  const adminQuery = useQuery({
    queryKey: ['notifications', 'admin-summary'],
    queryFn: () => dashboardApi.getDashboardSummary(),
    enabled: user?.role === 'ADMIN',
  })

  const applicantQuery = useQuery({
    queryKey: ['notifications', 'applicant-activity'],
    queryFn: () => activityApi.listActivity({ action: 'interview_scheduled', limit: 5 }),
    enabled: user?.role === 'APPLICANT',
  })

  if (user?.role === 'INTERVIEWER') {
    const notifications = (interviewerQuery.data?.data ?? []).map(
      (interview) => `Interview today at ${formatTime(interview.scheduledAt)} with ${companyName(interview.applicationId)}.`,
    )
    return { notifications, isLoading: interviewerQuery.isLoading }
  }

  if (user?.role === 'ADMIN') {
    const pending = (adminQuery.data as AdminDashboardSummary | undefined)?.feedback.pending ?? 0
    const notifications = pending > 0 ? [`${pending} interview${pending === 1 ? '' : 's'} waiting for feedback.`] : []
    return { notifications, isLoading: adminQuery.isLoading }
  }

  if (user?.role === 'APPLICANT') {
    const notifications = (applicantQuery.data?.data ?? []).map(
      (entry) => `${entry.description}.`,
    )
    return { notifications, isLoading: applicantQuery.isLoading }
  }

  return { notifications: [] as string[], isLoading: false }
}
