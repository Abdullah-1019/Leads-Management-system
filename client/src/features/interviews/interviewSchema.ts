import { z } from 'zod'
import { INTERVIEW_STATUSES, INTERVIEW_TYPES } from '../../types/interview'

export const interviewFormSchema = z.object({
  interviewerId: z.string().min(1, 'Interviewer is required'),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  timezone: z.string().trim().min(1, 'Timezone is required'),
  interviewType: z.enum(INTERVIEW_TYPES),
  meetingUrl: z.string().trim().url('Must be a valid URL').optional().or(z.literal('')),
  notes: z.string().trim().optional().or(z.literal('')),
  status: z.enum(INTERVIEW_STATUSES).optional(),
})

export type InterviewFormValues = z.infer<typeof interviewFormSchema>

export function detectBrowserTimezone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone
  } catch {
    return 'UTC'
  }
}

export function toInterviewInput(values: InterviewFormValues) {
  return {
    interviewerId: values.interviewerId,
    scheduledAt: new Date(`${values.date}T${values.time}`).toISOString(),
    timezone: values.timezone,
    interviewType: values.interviewType,
    meetingUrl: values.meetingUrl || undefined,
    notes: values.notes || undefined,
    status: values.status || undefined,
  }
}
