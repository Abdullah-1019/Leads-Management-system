import type { NextFunction, Request, Response } from 'express'
import { z, ZodError, type ZodType } from 'zod'
import { ApiError } from '../utils/ApiError.js'

interface ValidationSchemas {
  body?: ZodType
  query?: ZodType
  params?: ZodType
}

export function validate(schemas: ValidationSchemas) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (schemas.body) req.body = schemas.body.parse(req.body)
      if (schemas.query) req.query = schemas.query.parse(req.query) as Request['query']
      if (schemas.params) req.params = schemas.params.parse(req.params) as Request['params']
      next()
    } catch (err) {
      if (err instanceof ZodError) {
        next(new ApiError('VALIDATION_ERROR', 'Invalid request', z.treeifyError(err)))
        return
      }
      next(err)
    }
  }
}
