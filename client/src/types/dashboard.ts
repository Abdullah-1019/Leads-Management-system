import type { ActivityLogEntry, Application } from './application'

export interface ApplicantDashboardSummary {
  applicationsToday: number
  applicationsThisWeek: number
  applicationsThisMonth: number
  applicationsTotal: number
  leadsGenerated: number
  upcomingInterviews: number
  recentApplications: Pick<Application, '_id' | 'companyName' | 'jobTitle' | 'status' | 'applicationDate'>[]
  recentActivity: ActivityLogEntry[]
}

export interface InterviewerDashboardSummary {
  todaysInterviews: number
  upcomingInterviews: number
  completedInterviews: number
  pendingFeedback: number
  averageRating: number | null
  recentInterviewActivity: ActivityLogEntry[]
}

export interface AdminDashboardSummary {
  applications: { today: number; week: number; month: number; total: number }
  leads: { total: number; new: number; interviewsScheduled: number; interviewsCompleted: number }
  feedback: { pending: number; averageRating: number | null }
  recentTeamActivity: ActivityLogEntry[]
}

export type DashboardSummary =
  | ApplicantDashboardSummary
  | InterviewerDashboardSummary
  | AdminDashboardSummary

export interface AnalyticsResponse {
  applications: {
    timeSeries: { period: string; count: number }[]
    bySource: { source: string; count: number }[]
    byResume: { resumeUsed: string; count: number }[]
    byStatus: { status: string; count: number }[]
  }
  leads: {
    total: number
    timeSeries: { period: string; count: number }[]
    conversionRate: number
  }
  interviews: {
    scheduled: number
    completed: number
    cancelled: number
    pendingFeedback: number
    averageRating: number | null
    completionRate: number
  }
  kpis: {
    leadConversionRate: number
    interviewConversionRate: number
    interviewCompletionRate: number
    averageLeadRating: number
  }
}
