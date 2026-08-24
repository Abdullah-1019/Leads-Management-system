import { Router } from 'express'
import { analyticsHandler, summaryHandler } from '../controllers/dashboard.controller.js'
import { authenticate } from '../middleware/authenticate.js'
import { authorize } from '../middleware/authorize.js'
import { validate } from '../middleware/validate.js'
import { analyticsQuerySchema } from '../validators/dashboard.validators.js'

export const dashboardRouter = Router()

dashboardRouter.use(authenticate)

dashboardRouter.get('/summary', authorize('APPLICANT', 'INTERVIEWER', 'ADMIN'), summaryHandler)
dashboardRouter.get(
  '/analytics',
  authorize('ADMIN'),
  validate({ query: analyticsQuerySchema }),
  analyticsHandler,
)
