import { Feedback, type IFeedback } from '../models/Feedback.js'
import { Interview } from '../models/Interview.js'
import { ApiError } from '../utils/ApiError.js'
import { logActivity } from '../utils/activityLogger.js'

interface AuthUser {
  id: string
  role: 'APPLICANT' | 'INTERVIEWER' | 'ADMIN'
}

type FeedbackInput = Pick<
  IFeedback,
  | 'overallRating'
  | 'technicalRating'
  | 'communicationRating'
  | 'knowledgeRating'
  | 'leadQualityRating'
  | 'recommendation'
  | 'followUpRequired'
> &
  Partial<Pick<IFeedback, 'strengths' | 'weaknesses' | 'notes'>>

export async function createFeedback(user: AuthUser, interviewId: string, input: FeedbackInput) {
  const interview = await Interview.findOne({
    _id: interviewId,
    interviewerId: user.id,
  }).populate('applicationId', 'companyName jobTitle')
  if (!interview) {
    throw new ApiError('NOT_FOUND', 'Interview not found')
  }

  if (interview.status !== 'Completed') {
    throw new ApiError(
      'CONFLICT',
      'Feedback can only be submitted once the interview is marked Completed',
    )
  }

  const existing = await Feedback.findOne({ interviewId })
  if (existing) {
    throw new ApiError('CONFLICT', 'Feedback has already been submitted for this interview')
  }

  const feedback = await Feedback.create({ ...input, interviewId, submittedBy: user.id })

  const application = interview.applicationId as unknown as
    | { companyName: string; jobTitle: string }
    | undefined

  await logActivity({
    userId: user.id,
    action: 'feedback_submitted',
    entityType: 'Feedback',
    entityId: feedback.id,
    description: application
      ? `Feedback submitted for ${application.companyName} — ${application.jobTitle}`
      : 'Feedback submitted',
  })

  return feedback
}

export async function updateFeedback(user: AuthUser, id: string, updates: Partial<FeedbackInput>) {
  const scope = user.role === 'ADMIN' ? {} : { submittedBy: user.id }
  const feedback = await Feedback.findOne({ _id: id, ...scope })
  if (!feedback) {
    throw new ApiError('NOT_FOUND', 'Feedback not found')
  }

  Object.assign(feedback, updates)
  await feedback.save()

  return feedback
}
