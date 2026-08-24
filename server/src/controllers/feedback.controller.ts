import type { Request, Response } from 'express'
import * as feedbackService from '../services/feedback.service.js'

export async function createHandler(req: Request, res: Response) {
  const { id } = req.params as unknown as { id: string }
  const feedback = await feedbackService.createFeedback(req.user!, id, req.body)
  res.status(201).json({ data: feedback })
}

export async function updateHandler(req: Request, res: Response) {
  const { id } = req.params as unknown as { id: string }
  const feedback = await feedbackService.updateFeedback(req.user!, id, req.body)
  res.json({ data: feedback })
}
