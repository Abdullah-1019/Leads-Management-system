export const FEEDBACK_RECOMMENDATIONS = [
  'Strong Lead',
  'Good Lead',
  'Average Lead',
  'Weak Lead',
  'Poor Lead',
] as const
export type FeedbackRecommendation = (typeof FEEDBACK_RECOMMENDATIONS)[number]

export interface Feedback {
  _id: string
  interviewId: string
  submittedBy: string | { _id: string; name: string }
  overallRating: number
  technicalRating: number
  communicationRating: number
  knowledgeRating: number
  leadQualityRating: number
  recommendation: FeedbackRecommendation
  strengths?: string
  weaknesses?: string
  notes?: string
  followUpRequired: boolean
  submittedAt: string
  updatedAt: string
}
