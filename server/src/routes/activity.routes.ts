import { Router } from 'express'
import { listHandler } from '../controllers/activity.controller.js'
import { authenticate } from '../middleware/authenticate.js'
import { authorize } from '../middleware/authorize.js'
import { validate } from '../middleware/validate.js'
import { listActivityQuerySchema } from '../validators/activity.validators.js'

export const activityRouter = Router()

activityRouter.get(
  '/',
  authenticate,
  authorize('APPLICANT', 'INTERVIEWER', 'ADMIN'),
  validate({ query: listActivityQuerySchema }),
  listHandler,
)
