import { Schema, model, Types } from 'mongoose'

export const INTERVIEW_STATUSES = [
  'Scheduled',
  'Rescheduled',
  'Completed',
  'Cancelled',
  'No Show',
] as const
export type InterviewStatus = (typeof INTERVIEW_STATUSES)[number]

export const INTERVIEW_TYPES = ['Phone', 'Video Call', 'On-site', 'Other'] as const
export type InterviewType = (typeof INTERVIEW_TYPES)[number]

export interface IInterview {
  applicationId: Types.ObjectId
  interviewerId: Types.ObjectId
  scheduledAt: Date
  timezone: string
  interviewType: InterviewType
  meetingUrl?: string
  status: InterviewStatus
  notes?: string
  createdAt: Date
  updatedAt: Date
}

const interviewSchema = new Schema<IInterview>(
  {
    applicationId: { type: Schema.Types.ObjectId, ref: 'Application', required: true },
    interviewerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    scheduledAt: { type: Date, required: true },
    timezone: { type: String, required: true, trim: true },
    interviewType: { type: String, enum: INTERVIEW_TYPES, required: true },
    meetingUrl: { type: String, trim: true },
    status: { type: String, enum: INTERVIEW_STATUSES, required: true, default: 'Scheduled' },
    notes: { type: String, trim: true },
  },
  { timestamps: true },
)

interviewSchema.index({ applicationId: 1 })
interviewSchema.index({ interviewerId: 1 })
interviewSchema.index({ scheduledAt: 1 })
interviewSchema.index({ status: 1 })
interviewSchema.index({ interviewerId: 1, scheduledAt: 1 })
interviewSchema.index({ status: 1, scheduledAt: 1 })

export const Interview = model<IInterview>('Interview', interviewSchema)
