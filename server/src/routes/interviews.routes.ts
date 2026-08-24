import { Router } from 'express'
import { createHandler as createFeedbackHandler } from '../controllers/feedback.controller.js'
import {
  createHandler,
  getByIdHandler,
  listHandler,
  updateHandler,
} from '../controllers/interviews.controller.js'
import { authenticate } from '../middleware/authenticate.js'
import { authorize } from '../middleware/authorize.js'
import { validate } from '../middleware/validate.js'
import { createFeedbackSchema } from '../validators/feedback.validators.js'
import {
  createInterviewSchema,
  interviewIdParamsSchema,
  listInterviewsQuerySchema,
  updateInterviewSchema,
} from '../validators/interview.validators.js'

export const interviewsRouter = Router()

interviewsRouter.use(authenticate)

interviewsRouter.get(
  '/',
  authorize('APPLICANT', 'INTERVIEWER', 'ADMIN'),
  validate({ query: listInterviewsQuerySchema }),
  listHandler,
)
interviewsRouter.post(
  '/',
  authorize('APPLICANT', 'ADMIN'),
  validate({ body: createInterviewSchema }),
  createHandler,
)
interviewsRouter.get(
  '/:id',
  authorize('APPLICANT', 'INTERVIEWER', 'ADMIN'),
  validate({ params: interviewIdParamsSchema }),
  getByIdHandler,
)
interviewsRouter.patch(
  '/:id',
  authorize('INTERVIEWER', 'ADMIN'),
  validate({ params: interviewIdParamsSchema, body: updateInterviewSchema }),
  updateHandler,
)
interviewsRouter.post(
  '/:id/feedback',
  authorize('INTERVIEWER'),
  validate({ params: interviewIdParamsSchema, body: createFeedbackSchema }),
  createFeedbackHandler,
)
