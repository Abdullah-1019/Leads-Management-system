import type { NextFunction, Request, Response } from 'express'
import type { UserRole } from '../models/User.js'
import { ApiError } from '../utils/ApiError.js'

export function authorize(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      next(new ApiError('UNAUTHENTICATED', 'Authentication required'))
      return
    }

    if (!roles.includes(req.user.role)) {
      next(new ApiError('FORBIDDEN', 'You do not have permission to perform this action'))
      return
    }

    next()
  }
}
