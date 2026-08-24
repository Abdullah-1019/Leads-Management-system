import type { Request, Response } from 'express'
import type { UserRole } from '../models/User.js'
import * as usersService from '../services/users.service.js'

export async function listHandler(req: Request, res: Response) {
  const { role } = req.query as unknown as { role?: UserRole }
  const users = await usersService.listUsers(req.user!, role)
  res.json({ data: users })
}
