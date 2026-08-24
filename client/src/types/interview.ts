import type { Application } from './application'
import type { Feedback } from './feedback'

export const INTERVIEW_STATUSES = [
  'Scheduled',
  'Rescheduled',
  'Completed',
  'Cancelled',
  'No Show',
] as const
export type InterviewStatus = (typeof INTERVIEW_STATUSES)[number]

export const INTERVIEW_TYPES = ['Phone', 'Video Call', 'On-site', 'Other'] as const
export type InterviewType = (typeof INTERVIEW_TYPES)[number]

export type ApplicationSnapshot = Pick<
  Application,
  '_id' | 'companyName' | 'jobTitle' | 'jobDescriptionUrl' | 'source' | 'resumeUsed' | 'status'
> & { createdBy?: string | { _id: string; name: string } }

export interface Interview {
  _id: string
  applicationId: string | ApplicationSnapshot
  interviewerId: string | { _id: string; name: string }
  scheduledAt: string
  timezone: string
  interviewType: InterviewType
  meetingUrl?: string
  status: InterviewStatus
  notes?: string
  createdAt: string
  updatedAt: string
  feedback?: Feedback | null
  feedbackStatus?: 'pending' | 'submitted'
}

export interface RelatedInterview {
  _id: string
  status: InterviewStatus
  scheduledAt: string
}
