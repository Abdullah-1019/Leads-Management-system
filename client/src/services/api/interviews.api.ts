import type { ApiSuccess } from '../../types/api'
import type { Interview } from '../../types/interview'
import type { PaginatedResult } from '../../types/pagination'
import { axiosClient } from './axiosClient'

export interface ListInterviewsParams {
  page?: number
  limit?: number
  company?: string
  jobTitle?: string
  interviewerId?: string
  status?: string
  date?: string
  startDate?: string
  endDate?: string
  tab?: 'upcoming' | 'today' | 'past' | 'pending-feedback'
}

export interface InterviewInput {
  applicationId?: string
  interviewerId?: string
  scheduledAt: string
  timezone: string
  interviewType: string
  meetingUrl?: string
  notes?: string
  status?: string
}

export async function listInterviews(params: ListInterviewsParams) {
  const res = await axiosClient.get<PaginatedResult<Interview>>('/api/interviews', { params })
  return res.data
}

export async function getInterview(id: string) {
  const res = await axiosClient.get<ApiSuccess<Interview>>(`/api/interviews/${id}`)
  return res.data.data
}

export async function createInterview(payload: InterviewInput) {
  const res = await axiosClient.post<ApiSuccess<Interview & { hasExistingActiveInterview: boolean }>>(
    '/api/interviews',
    payload,
  )
  return res.data.data
}

export async function updateInterview(id: string, payload: Partial<InterviewInput>) {
  const res = await axiosClient.patch<ApiSuccess<Interview>>(`/api/interviews/${id}`, payload)
  return res.data.data
}
