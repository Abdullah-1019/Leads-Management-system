import type { Request, Response } from 'express'
import type { InterviewStatus, InterviewType } from '../models/Interview.js'
import * as interviewsService from '../services/interviews.service.js'

export async function listHandler(req: Request, res: Response) {
  const query = req.query as unknown as {
    page: number
    limit: number
    company?: string
    jobTitle?: string
    interviewerId?: string
    status?: InterviewStatus
    date?: Date
    startDate?: Date
    endDate?: Date
    tab?: 'upcoming' | 'today' | 'past' | 'pending-feedback'
    feedbackStatus?: 'pending' | 'submitted'
  }

  const { data, pagination } = await interviewsService.listInterviews(req.user!, query)
  res.json({ data, pagination })
}

export async function createHandler(req: Request, res: Response) {
  const { interview, hasExistingActiveInterview } = await interviewsService.createInterview(
    req.user!,
    req.body,
  )
  res.status(201).json({ data: { ...interview.toJSON(), hasExistingActiveInterview } })
}

export async function getByIdHandler(req: Request, res: Response) {
  const { id } = req.params as unknown as { id: string }
  const { interview, feedback, feedbackStatus } = await interviewsService.getInterviewById(
    req.user!,
    id,
  )
  res.json({ data: { ...interview.toJSON(), feedback, feedbackStatus } })
}

export async function updateHandler(req: Request, res: Response) {
  const { id } = req.params as unknown as { id: string }
  const body = req.body as Partial<{
    interviewerId: string
    scheduledAt: Date
    timezone: string
    interviewType: InterviewType
    meetingUrl: string
    status: InterviewStatus
    notes: string
  }>
  const interview = await interviewsService.updateInterview(req.user!, id, body)
  res.json({ data: interview })
}
