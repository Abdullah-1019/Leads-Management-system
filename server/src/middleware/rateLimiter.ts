import rateLimit from 'express-rate-limit'
import { ApiError } from '../utils/ApiError.js'

export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, _res, next) => {
    next(new ApiError('RATE_LIMITED', 'Too many login attempts. Please try again later.'))
  },
})
