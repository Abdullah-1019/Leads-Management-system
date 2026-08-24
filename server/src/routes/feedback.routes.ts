import { Router } from 'express'
import { updateHandler } from '../controllers/feedback.controller.js'
import { authenticate } from '../middleware/authenticate.js'
import { authorize } from '../middleware/authorize.js'
import { validate } from '../middleware/validate.js'
import { feedbackIdParamsSchema, updateFeedbackSchema } from '../validators/feedback.validators.js'

export const feedbackRouter = Router()

feedbackRouter.patch(
  '/:id',
  authenticate,
  authorize('INTERVIEWER', 'ADMIN'),
  validate({ params: feedbackIdParamsSchema, body: updateFeedbackSchema }),
  updateHandler,
)
