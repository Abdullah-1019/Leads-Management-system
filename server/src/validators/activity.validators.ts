import { z } from 'zod'
import { ACTIVITY_ENTITY_TYPES } from '../models/ActivityLog.js'

export const listActivityQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  userId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid userId')
    .optional(),
  action: z.string().trim().optional(),
  entityType: z.enum(ACTIVITY_ENTITY_TYPES).optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
})
