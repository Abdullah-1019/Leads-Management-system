import { z } from 'zod'
import { INTERVIEW_STATUSES, INTERVIEW_TYPES } from '../models/Interview.js'

const objectId = (message: string) => z.string().regex(/^[0-9a-fA-F]{24}$/, message)

const optionalUrl = z.string().trim().url('Must be a valid URL').optional().or(z.literal(''))

export const createInterviewSchema = z.object({
  applicationId: objectId('Invalid applicationId'),
  interviewerId: objectId('Invalid interviewerId'),
  scheduledAt: z.coerce.date(),
  timezone: z.string().trim().min(1, 'timezone is required'),
  interviewType: z.enum(INTERVIEW_TYPES),
  meetingUrl: optionalUrl,
  notes: z.string().trim().optional(),
})

export const updateInterviewSchema = z.object({
  interviewerId: objectId('Invalid interviewerId').optional(),
  scheduledAt: z.coerce.date().optional(),
  timezone: z.string().trim().min(1).optional(),
  interviewType: z.enum(INTERVIEW_TYPES).optional(),
  meetingUrl: optionalUrl,
  status: z.enum(INTERVIEW_STATUSES).optional(),
  notes: z.string().trim().optional(),
})

export const interviewIdParamsSchema = z.object({
  id: objectId('Invalid interview id'),
})

export const listInterviewsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  company: z.string().trim().optional(),
  jobTitle: z.string().trim().optional(),
  interviewerId: objectId('Invalid interviewerId').optional(),
  status: z.enum(INTERVIEW_STATUSES).optional(),
  date: z.coerce.date().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  tab: z.enum(['upcoming', 'today', 'past', 'pending-feedback']).optional(),
  feedbackStatus: z.enum(['pending', 'submitted']).optional(),
})
