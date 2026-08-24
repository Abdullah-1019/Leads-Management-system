import { Router } from 'express'
import { loginHandler, logoutHandler, meHandler } from '../controllers/auth.controller.js'
import { authenticate } from '../middleware/authenticate.js'
import { loginRateLimiter } from '../middleware/rateLimiter.js'
import { validate } from '../middleware/validate.js'
import { loginSchema } from '../validators/auth.validators.js'

export const authRouter = Router()

authRouter.post('/login', loginRateLimiter, validate({ body: loginSchema }), loginHandler)
authRouter.post('/logout', authenticate, logoutHandler)
authRouter.get('/me', authenticate, meHandler)
