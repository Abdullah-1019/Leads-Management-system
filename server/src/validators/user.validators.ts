import { z } from 'zod'

export const listUsersQuerySchema = z.object({
  role: z.enum(['APPLICANT', 'INTERVIEWER', 'ADMIN']).optional(),
})
