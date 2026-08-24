import { Schema, model, Types } from 'mongoose'

export const FEEDBACK_RECOMMENDATIONS = [
  'Strong Lead',
  'Good Lead',
  'Average Lead',
  'Weak Lead',
  'Poor Lead',
] as const
export type FeedbackRecommendation = (typeof FEEDBACK_RECOMMENDATIONS)[number]

export interface IFeedback {
  interviewId: Types.ObjectId
  submittedBy: Types.ObjectId
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
  submittedAt: Date
  updatedAt: Date
}

const ratingField = { type: Number, required: true, min: 1, max: 5 }

const feedbackSchema = new Schema<IFeedback>(
  {
    interviewId: { type: Schema.Types.ObjectId, ref: 'Interview', required: true, unique: true },
    submittedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    overallRating: ratingField,
    technicalRating: ratingField,
    communicationRating: ratingField,
    knowledgeRating: ratingField,
    leadQualityRating: ratingField,
    recommendation: { type: String, enum: FEEDBACK_RECOMMENDATIONS, required: true },
    strengths: { type: String, trim: true },
    weaknesses: { type: String, trim: true },
    notes: { type: String, trim: true },
    followUpRequired: { type: Boolean, required: true, default: false },
  },
  { timestamps: { createdAt: 'submittedAt', updatedAt: true } },
)

export const Feedback = model<IFeedback>('Feedback', feedbackSchema)
