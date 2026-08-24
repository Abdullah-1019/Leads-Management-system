import type { Request, Response } from 'express'
import type { ActivityEntityType } from '../models/ActivityLog.js'
import * as activityService from '../services/activity.service.js'

export async function listHandler(req: Request, res: Response) {
  const query = req.query as unknown as {
    page: number
    limit: number
    userId?: string
    action?: string
    entityType?: ActivityEntityType
    startDate?: Date
    endDate?: Date
  }

  const { data, pagination } = await activityService.listActivity(req.user!, query)
  res.json({ data, pagination })
}
