import { Schema, model, Types } from 'mongoose'

export const APPLICATION_STATUSES = [
  'Applied',
  'Follow-up',
  'Response Received',
  'Lead',
  'Interview Scheduled',
  'Interview Completed',
  'Offer',
  'Rejected',
  'Withdrawn',
  'No Response',
] as const
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number]

export const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Other'] as const
export type JobType = (typeof JOB_TYPES)[number]

export interface IApplication {
  companyName: string
  jobTitle: string
  jobDescriptionUrl?: string
  location?: string
  jobType?: JobType
  source?: string
  resumeUsed: string
  applicationDate: Date
  status: ApplicationStatus
  notes?: string
  createdBy: Types.ObjectId
  archivedAt: Date | null
  createdAt: Date
  updatedAt: Date
}

const applicationSchema = new Schema<IApplication>(
  {
    companyName: { type: String, required: true, trim: true },
    jobTitle: { type: String, required: true, trim: true },
    jobDescriptionUrl: { type: String, trim: true },
    location: { type: String, trim: true },
    jobType: { type: String, enum: JOB_TYPES },
    source: { type: String, trim: true },
    resumeUsed: { type: String, required: true, trim: true },
    applicationDate: { type: Date, required: true },
    status: { type: String, enum: APPLICATION_STATUSES, required: true, default: 'Applied' },
    notes: { type: String, trim: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    archivedAt: { type: Date, default: null },
  },
  { timestamps: true },
)

applicationSchema.index({ companyName: 1 })
applicationSchema.index({ jobTitle: 1 })
applicationSchema.index({ applicationDate: -1 })
applicationSchema.index({ status: 1 })
applicationSchema.index({ source: 1 })
applicationSchema.index({ resumeUsed: 1 })
applicationSchema.index({ createdBy: 1, applicationDate: -1 })
applicationSchema.index({ createdBy: 1, status: 1 })
applicationSchema.index({ archivedAt: 1 })
applicationSchema.index({ companyName: 1, jobTitle: 1, jobDescriptionUrl: 1 })

export const Application = model<IApplication>('Application', applicationSchema)
