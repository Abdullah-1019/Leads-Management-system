import { z } from 'zod'
import { APPLICATION_STATUSES, JOB_TYPES } from '../models/Application.js'

const optionalUrl = z
  .string()
  .trim()
  .url('Must be a valid URL')
  .optional()
  .or(z.literal(''))

const applicationBaseSchema = z.object({
  companyName: z.string().trim().min(1, 'companyName is required'),
  jobTitle: z.string().trim().min(1, 'jobTitle is required'),
  jobDescriptionUrl: optionalUrl,
  location: z.string().trim().optional(),
  jobType: z.enum(JOB_TYPES).optional(),
  source: z.string().trim().optional(),
  resumeUsed: z.string().trim().min(1, 'resumeUsed is required'),
  applicationDate: z.coerce.date(),
  status: z.enum(APPLICATION_STATUSES).optional(),
  notes: z.string().trim().optional(),
})

export const createApplicationSchema = applicationBaseSchema

export const updateApplicationSchema = applicationBaseSchema.partial()

export const applicationIdParamsSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid application id'),
})

export const listApplicationsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().optional(),
  company: z.string().trim().optional(),
  jobTitle: z.string().trim().optional(),
  source: z.string().trim().optional(),
  resumeUsed: z.string().trim().optional(),
  status: z.enum(APPLICATION_STATUSES).optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  createdBy: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid createdBy id')
    .optional(),
  includeArchived: z.coerce.boolean().default(false),
})

export const checkDuplicateQuerySchema = z.object({
  companyName: z.string().trim().min(1, 'companyName is required'),
  jobTitle: z.string().trim().min(1, 'jobTitle is required'),
  jobDescriptionUrl: z.string().trim().optional(),
})
