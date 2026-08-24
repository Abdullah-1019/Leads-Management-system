import type { Request, Response } from 'express'
import * as authService from '../services/auth.service.js'

export async function loginHandler(req: Request, res: Response) {
  const { email, password } = req.body as { email: string; password: string }

  const { token, user } = await authService.login(email, password)

  res.json({ data: { token, user } })
}

export function logoutHandler(_req: Request, res: Response) {
  res.json({ data: { success: true } })
}

export async function meHandler(req: Request, res: Response) {
  const user = await authService.getCurrentUser(req.user!.id)

  res.json({ data: { user } })
}
