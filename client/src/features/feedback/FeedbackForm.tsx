import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { Button } from '../../components/ui/Button'
import { Select } from '../../components/ui/Select'
import { Textarea } from '../../components/ui/Textarea'
import { FEEDBACK_RECOMMENDATIONS, type Feedback } from '../../types/feedback'
import { feedbackFormSchema, type FeedbackFormValues } from './feedbackSchema'
import { RatingInput } from './RatingInput'

const RATING_FIELDS = [
  { name: 'overallRating', label: 'Overall Rating' },
  { name: 'technicalRating', label: 'Technical Performance' },
  { name: 'communicationRating', label: 'Communication' },
  { name: 'knowledgeRating', label: 'Knowledge / Experience' },
  { name: 'leadQualityRating', label: 'Lead Quality' },
] as const

function defaultsFrom(feedback?: Feedback | null): Partial<FeedbackFormValues> {
  if (!feedback) return { followUpRequired: false }
  return {
    overallRating: feedback.overallRating,
    technicalRating: feedback.technicalRating,
    communicationRating: feedback.communicationRating,
    knowledgeRating: feedback.knowledgeRating,
    leadQualityRating: feedback.leadQualityRating,
    recommendation: feedback.recommendation,
    strengths: feedback.strengths ?? '',
    weaknesses: feedback.weaknesses ?? '',
    notes: feedback.notes ?? '',
    followUpRequired: feedback.followUpRequired,
  }
}

export function FeedbackForm({
  existingFeedback,
  onSubmit,
  submitLabel,
  onCancel,
}: {
  existingFeedback?: Feedback | null
  onSubmit: (values: FeedbackFormValues) => Promise<void>
  submitLabel: string
  onCancel?: () => void
}) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackFormSchema),
    defaultValues: defaultsFrom(existingFeedback),
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {RATING_FIELDS.map((field) => (
          <Controller
            key={field.name}
            control={control}
            name={field.name}
            render={({ field: { value, onChange } }) => (
              <RatingInput
                label={field.label}
                value={value ?? 0}
                onChange={onChange}
                error={errors[field.name]?.message}
              />
            )}
          />
        ))}
      </div>

      <Select
        label="Recommendation"
        error={errors.recommendation?.message}
        {...register('recommendation')}
      >
        <option value="">Select recommendation</option>
        {FEEDBACK_RECOMMENDATIONS.map((rec) => (
          <option key={rec} value={rec}>
            {rec}
          </option>
        ))}
      </Select>

      <Textarea label="Strengths" error={errors.strengths?.message} {...register('strengths')} />
      <Textarea
        label="Weaknesses"
        error={errors.weaknesses?.message}
        {...register('weaknesses')}
      />
      <Textarea
        label="Feedback Notes"
        error={errors.notes?.message}
        {...register('notes')}
      />

      <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
        <input type="checkbox" className="size-4 rounded" {...register('followUpRequired')} />
        Follow-up Required
      </label>

      <div className="flex gap-3">
        <Button type="submit" isLoading={isSubmitting}>
          {submitLabel}
        </Button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg px-4 py-2.5 text-sm font-medium text-slate-500 transition hover:text-slate-900"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
