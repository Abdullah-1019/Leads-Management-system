import { Router } from 'express'
import {
  archiveHandler,
  checkDuplicateHandler,
  createHandler,
  getActivityHandler,
  getByIdHandler,
  listHandler,
  updateHandler,
} from '../controllers/applications.controller.js'
import { authenticate } from '../middleware/authenticate.js'
import { authorize } from '../middleware/authorize.js'
import { validate } from '../middleware/validate.js'
import {
  applicationIdParamsSchema,
  checkDuplicateQuerySchema,
  createApplicationSchema,
  listApplicationsQuerySchema,
  updateApplicationSchema,
} from '../validators/application.validators.js'

export const applicationsRouter = Router()

applicationsRouter.use(authenticate, authorize('APPLICANT', 'ADMIN'))

applicationsRouter.get(
  '/check-duplicate',
  validate({ query: checkDuplicateQuerySchema }),
  checkDuplicateHandler,
)
applicationsRouter.get('/', validate({ query: listApplicationsQuerySchema }), listHandler)
applicationsRouter.post('/', validate({ body: createApplicationSchema }), createHandler)
applicationsRouter.get(
  '/:id',
  validate({ params: applicationIdParamsSchema }),
  getByIdHandler,
)
applicationsRouter.get(
  '/:id/activity',
  validate({ params: applicationIdParamsSchema }),
  getActivityHandler,
)
applicationsRouter.patch(
  '/:id',
  validate({ params: applicationIdParamsSchema, body: updateApplicationSchema }),
  updateHandler,
)
applicationsRouter.delete(
  '/:id',
  validate({ params: applicationIdParamsSchema }),
  archiveHandler,
)
