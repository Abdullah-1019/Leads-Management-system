import type { Request, Response } from 'express'
import * as dashboardService from '../services/dashboard.service.js'

export async function summaryHandler(req: Request, res: Response) {
  const summary = await dashboardService.getDashboardSummary(req.user!)
  res.json({ data: summary })
}

export async function analyticsHandler(req: Request, res: Response) {
  const { range } = req.query as unknown as { range: 'day' | 'week' | 'month' }
  const analytics = await dashboardService.getAnalytics(range)
  res.json({ data: analytics })
}
