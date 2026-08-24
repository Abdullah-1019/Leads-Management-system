import { z } from 'zod'
import { FEEDBACK_RECOMMENDATIONS } from '../models/Feedback.js'

const rating = z.coerce.number().int().min(1).max(5)

export const createFeedbackSchema = z.object({
  overallRating: rating,
  technicalRating: rating,
  communicationRating: rating,
  knowledgeRating: rating,
  leadQualityRating: rating,
  recommendation: z.enum(FEEDBACK_RECOMMENDATIONS),
  strengths: z.string().trim().optional(),
  weaknesses: z.string().trim().optional(),
  notes: z.string().trim().optional(),
  followUpRequired: z.coerce.boolean().default(false),
})

export const updateFeedbackSchema = createFeedbackSchema.partial()

export const feedbackIdParamsSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid feedback id'),
})
