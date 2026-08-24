import type { NextFunction, Request, Response } from 'express'

function sanitizeValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sanitizeValue)

  if (value && typeof value === 'object') {
    const result: Record<string, unknown> = {}
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      if (key.startsWith('$') || key.includes('.')) continue
      result[key] = sanitizeValue(val)
    }
    return result
  }

  return value
}

/** Strips keys that look like Mongo operators ($ne, $gt, ...) or dotted paths from
 * user-supplied body/params, as defense-in-depth alongside Zod's type validation. */
export function sanitizeInput(req: Request, _res: Response, next: NextFunction) {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeValue(req.body)
  }
  if (req.params && typeof req.params === 'object') {
    req.params = sanitizeValue(req.params) as Request['params']
  }
  next()
}
