import { z } from 'zod'

export const analyticsQuerySchema = z.object({
  range: z.enum(['day', 'week', 'month']).default('month'),
})
