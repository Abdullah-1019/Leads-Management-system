import { z } from 'zod'
import { APPLICATION_STATUSES, JOB_TYPES } from '../../types/application'

export const applicationFormSchema = z.object({
  companyName: z.string().trim().min(1, 'Company name is required'),
  jobTitle: z.string().trim().min(1, 'Job title is required'),
  jobDescriptionUrl: z
    .string()
    .trim()
    .url('Must be a valid URL')
    .optional()
    .or(z.literal('')),
  location: z.string().trim().optional().or(z.literal('')),
  jobType: z.enum(JOB_TYPES).optional().or(z.literal('')),
  source: z.string().trim().optional().or(z.literal('')),
  resumeUsed: z.string().trim().min(1, 'Resume used is required'),
  applicationDate: z.string().min(1, 'Application date is required'),
  status: z.enum(APPLICATION_STATUSES).optional(),
  notes: z.string().trim().optional().or(z.literal('')),
})

export type ApplicationFormValues = z.infer<typeof applicationFormSchema>
