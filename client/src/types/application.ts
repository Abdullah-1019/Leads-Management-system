import type { User } from './auth'
import type { InterviewStatus } from './interview'

export const APPLICATION_STATUSES = [
  'Applied',
  'Follow-up',
  'Response Received',
  'Lead',
  'Interview Scheduled',
  'Interview Completed',
  'Offer',
  'Rejected',
  'Withdrawn',
  'No Response',
] as const
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number]

export const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Other'] as const
export type JobType = (typeof JOB_TYPES)[number]

export const APPLICATION_SOURCES = [
  'LinkedIn',
  'Indeed',
  'Jobright',
  'RemoteHunter',
  'Glassdoor',
  'Wellfound',
  'Company Website',
  'Other',
] as const

export interface RelatedInterviewSummary {
  _id: string
  status: InterviewStatus
  scheduledAt: string
}

export interface Application {
  _id: string
  companyName: string
  jobTitle: string
  jobDescriptionUrl?: string
  location?: string
  jobType?: JobType
  source?: string
  resumeUsed: string
  applicationDate: string
  status: ApplicationStatus
  notes?: string
  createdBy: string | Pick<User, '_id' | 'name'>
  archivedAt: string | null
  createdAt: string
  updatedAt: string
  relatedInterview?: RelatedInterviewSummary | null
}

export interface ActivityLogEntry {
  _id: string
  userId: string | Pick<User, '_id' | 'name'>
  action: string
  entityType: string
  entityId: string
  description: string
  metadata?: Record<string, unknown>
  createdAt: string
}
