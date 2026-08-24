import type { Request, Response } from 'express'
import type { ApplicationStatus } from '../models/Application.js'
import * as applicationsService from '../services/applications.service.js'

export async function listHandler(req: Request, res: Response) {
  const query = req.query as unknown as {
    page: number
    limit: number
    search?: string
    company?: string
    jobTitle?: string
    source?: string
    resumeUsed?: string
    status?: ApplicationStatus
    startDate?: Date
    endDate?: Date
    createdBy?: string
    includeArchived: boolean
  }

  const { data, pagination } = await applicationsService.listApplications(req.user!, query)
  res.json({ data, pagination })
}

export async function createHandler(req: Request, res: Response) {
  const { application, possibleDuplicate } = await applicationsService.createApplication(
    req.user!,
    req.body,
  )
  res.status(201).json({ data: { ...application.toJSON(), possibleDuplicate } })
}

export async function getByIdHandler(req: Request, res: Response) {
  const { id } = req.params as unknown as { id: string }
  const { application, relatedInterview } = await applicationsService.getApplicationById(
    req.user!,
    id,
  )
  res.json({ data: { ...application.toJSON(), relatedInterview } })
}

export async function updateHandler(req: Request, res: Response) {
  const { id } = req.params as unknown as { id: string }
  const application = await applicationsService.updateApplication(req.user!, id, req.body)
  res.json({ data: application })
}

export async function archiveHandler(req: Request, res: Response) {
  const { id } = req.params as unknown as { id: string }
  const application = await applicationsService.archiveApplication(req.user!, id)
  res.json({ data: application })
}

export async function getActivityHandler(req: Request, res: Response) {
  const { id } = req.params as unknown as { id: string }
  const activity = await applicationsService.getApplicationActivity(req.user!, id)
  res.json({ data: activity })
}

export async function checkDuplicateHandler(req: Request, res: Response) {
  const { companyName, jobTitle, jobDescriptionUrl } = req.query as unknown as {
    companyName: string
    jobTitle: string
    jobDescriptionUrl?: string
  }

  const result = await applicationsService.checkDuplicate(
    req.user!,
    companyName,
    jobTitle,
    jobDescriptionUrl,
  )
  res.json({ data: result })
}
