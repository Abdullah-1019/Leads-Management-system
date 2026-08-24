import { z } from 'zod'
import { FEEDBACK_RECOMMENDATIONS } from '../../types/feedback'

const rating = z.number().int().min(1, 'Required').max(5)

export const feedbackFormSchema = z.object({
  overallRating: rating,
  technicalRating: rating,
  communicationRating: rating,
  knowledgeRating: rating,
  leadQualityRating: rating,
  recommendation: z.enum(FEEDBACK_RECOMMENDATIONS),
  strengths: z.string().trim().optional().or(z.literal('')),
  weaknesses: z.string().trim().optional().or(z.literal('')),
  notes: z.string().trim().optional().or(z.literal('')),
  followUpRequired: z.boolean(),
})

export type FeedbackFormValues = z.infer<typeof feedbackFormSchema>

export function toFeedbackInput(values: FeedbackFormValues) {
  return {
    ...values,
    strengths: values.strengths || undefined,
    weaknesses: values.weaknesses || undefined,
    notes: values.notes || undefined,
  }
}
