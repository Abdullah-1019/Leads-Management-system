import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { Textarea } from '../../components/ui/Textarea'
import { INTERVIEW_STATUSES, INTERVIEW_TYPES } from '../../types/interview'
import {
  detectBrowserTimezone,
  interviewFormSchema,
  type InterviewFormValues,
} from './interviewSchema'
import { useInterviewersQuery } from './queries'

interface InterviewFormProps {
  mode: 'create' | 'edit'
  defaultValues?: Partial<InterviewFormValues>
  onSubmit: (values: InterviewFormValues) => Promise<void>
  submitLabel: string
  onCancel?: () => void
}

export function InterviewForm({
  mode,
  defaultValues,
  onSubmit,
  submitLabel,
  onCancel,
}: InterviewFormProps) {
  const { data: interviewers = [], isLoading: interviewersLoading } = useInterviewersQuery()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<InterviewFormValues>({
    resolver: zodResolver(interviewFormSchema),
    defaultValues: {
      timezone: detectBrowserTimezone(),
      ...defaultValues,
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Select
        label="Interviewer"
        error={errors.interviewerId?.message}
        disabled={interviewersLoading}
        {...register('interviewerId')}
      >
        <option value="">Select interviewer</option>
        {interviewers.map((interviewer) => (
          <option key={interviewer._id} value={interviewer._id}>
            {interviewer.name}
          </option>
        ))}
      </Select>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input label="Date" type="date" error={errors.date?.message} {...register('date')} />
        <Input label="Time" type="time" error={errors.time?.message} {...register('time')} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input label="Timezone" error={errors.timezone?.message} {...register('timezone')} />
        <Select
          label="Interview Type"
          error={errors.interviewType?.message}
          {...register('interviewType')}
        >
          {INTERVIEW_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </Select>
      </div>

      <Input
        label="Meeting URL"
        placeholder="https://..."
        error={errors.meetingUrl?.message}
        {...register('meetingUrl')}
      />

      {mode === 'edit' && (
        <Select label="Status" error={errors.status?.message} {...register('status')}>
          {INTERVIEW_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </Select>
      )}

      <Textarea label="Notes" error={errors.notes?.message} {...register('notes')} />

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
