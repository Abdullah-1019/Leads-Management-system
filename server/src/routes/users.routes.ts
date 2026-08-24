import { Router } from 'express'
import { listHandler } from '../controllers/users.controller.js'
import { authenticate } from '../middleware/authenticate.js'
import { validate } from '../middleware/validate.js'
import { listUsersQuerySchema } from '../validators/user.validators.js'

export const usersRouter = Router()

usersRouter.get('/', authenticate, validate({ query: listUsersQuerySchema }), listHandler)
