import type { ApiSuccess } from '../../types/api'
import type { Feedback } from '../../types/feedback'
import { axiosClient } from './axiosClient'

export interface FeedbackInput {
  overallRating: number
  technicalRating: number
  communicationRating: number
  knowledgeRating: number
  leadQualityRating: number
  recommendation: string
  strengths?: string
  weaknesses?: string
  notes?: string
  followUpRequired: boolean
}

export async function createFeedback(interviewId: string, payload: FeedbackInput) {
  const res = await axiosClient.post<ApiSuccess<Feedback>>(
    `/api/interviews/${interviewId}/feedback`,
    payload,
  )
  return res.data.data
}

export async function updateFeedback(feedbackId: string, payload: Partial<FeedbackInput>) {
  const res = await axiosClient.patch<ApiSuccess<Feedback>>(`/api/feedback/${feedbackId}`, payload)
  return res.data.data
}
