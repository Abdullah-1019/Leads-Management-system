import type { NextFunction, Request, Response } from 'express'
import { ApiError } from '../utils/ApiError.js'
import { verifyToken } from '../utils/jwt.js'

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization

  if (!header?.startsWith('Bearer ')) {
    next(new ApiError('UNAUTHENTICATED', 'Missing or invalid Authorization header'))
    return
  }

  const token = header.slice('Bearer '.length)

  try {
    const payload = verifyToken(token)
    req.user = { id: payload.sub, role: payload.role }
    next()
  } catch {
    next(new ApiError('UNAUTHENTICATED', 'Invalid or expired token'))
  }
}
