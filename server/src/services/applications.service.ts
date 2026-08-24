import type { QueryFilter } from 'mongoose'
import { ActivityLog } from '../models/ActivityLog.js'
import { Application, type IApplication } from '../models/Application.js'
import { Interview } from '../models/Interview.js'
import { ApiError } from '../utils/ApiError.js'
import { logActivity } from '../utils/activityLogger.js'
import { buildDateRangeFilter } from '../utils/dateRange.js'
import { buildPaginationMeta, toSkipLimit } from '../utils/pagination.js'
import { exactMatchCaseInsensitive, partialMatch } from '../utils/regex.js'

interface AuthUser {
  id: string
  role: 'APPLICANT' | 'INTERVIEWER' | 'ADMIN'
}

interface ListParams {
  page: number
  limit: number
  search?: string
  company?: string
  jobTitle?: string
  source?: string
  resumeUsed?: string
  status?: IApplication['status']
  startDate?: Date
  endDate?: Date
  createdBy?: string
  includeArchived: boolean
}

function ownershipFilter(user: AuthUser): QueryFilter<IApplication> {
  return user.role === 'ADMIN' ? {} : { createdBy: user.id }
}

export async function listApplications(user: AuthUser, params: ListParams) {
  const filter: QueryFilter<IApplication> = { ...ownershipFilter(user) }

  if (!params.includeArchived) filter.archivedAt = null
  if (params.createdBy && user.role === 'ADMIN') filter.createdBy = params.createdBy
  if (params.company) filter.companyName = partialMatch(params.company)
  if (params.jobTitle) filter.jobTitle = partialMatch(params.jobTitle)
  if (params.source) filter.source = partialMatch(params.source)
  if (params.resumeUsed) filter.resumeUsed = partialMatch(params.resumeUsed)
  if (params.status) filter.status = params.status

  const dateRange = buildDateRangeFilter(params.startDate, params.endDate)
  if (dateRange) filter.applicationDate = dateRange

  if (params.search) {
    const regex = partialMatch(params.search)
    filter.$or = [{ companyName: regex }, { jobTitle: regex }]
  }

  const { skip, limit } = toSkipLimit(params)

  const [data, total] = await Promise.all([
    Application.find(filter)
      .sort({ applicationDate: -1 })
      .skip(skip)
      .limit(limit)
      .populate('createdBy', 'name'),
    Application.countDocuments(filter),
  ])

  return { data, pagination: buildPaginationMeta(params, total) }
}

async function findOwnedApplication(user: AuthUser, id: string) {
  const application = await Application.findOne({
    _id: id,
    ...ownershipFilter(user),
  })

  if (!application) {
    throw new ApiError('NOT_FOUND', 'Application not found')
  }

  return application
}

export async function getApplicationById(user: AuthUser, id: string) {
  const application = await findOwnedApplication(user, id)
  await application.populate('createdBy', 'name')

  const relatedInterview = await Interview.findOne({ applicationId: application.id })
    .sort({ createdAt: -1 })
    .select('_id status scheduledAt')

  return { application, relatedInterview }
}

async function findDuplicates(
  createdBy: string,
  companyName: string,
  jobTitle: string,
  jobDescriptionUrl?: string,
) {
  const filter: QueryFilter<IApplication> = {
    createdBy,
    archivedAt: null,
    companyName: exactMatchCaseInsensitive(companyName),
    jobTitle: exactMatchCaseInsensitive(jobTitle),
  }

  if (jobDescriptionUrl) {
    filter.jobDescriptionUrl = exactMatchCaseInsensitive(jobDescriptionUrl)
  }

  return Application.find(filter)
}

export async function checkDuplicate(
  user: AuthUser,
  companyName: string,
  jobTitle: string,
  jobDescriptionUrl?: string,
) {
  const matches = await findDuplicates(user.id, companyName, jobTitle, jobDescriptionUrl)
  return { possibleDuplicate: matches.length > 0, matches }
}

export async function createApplication(user: AuthUser, input: Partial<IApplication>) {
  const matches = await findDuplicates(
    user.id,
    input.companyName!,
    input.jobTitle!,
    input.jobDescriptionUrl,
  )

  const application = await Application.create({
    ...input,
    createdBy: user.id,
  })
  await application.populate('createdBy', 'name')

  await logActivity({
    userId: user.id,
    action: 'application_added',
    entityType: 'Application',
    entityId: application.id,
    description: `Added application to ${application.companyName} — ${application.jobTitle}`,
  })

  return { application, possibleDuplicate: matches.length > 0 }
}

export async function updateApplication(
  user: AuthUser,
  id: string,
  updates: Partial<IApplication>,
) {
  const application = await findOwnedApplication(user, id)
  const previousStatus = application.status

  Object.assign(application, updates)
  await application.save()
  await application.populate('createdBy', 'name')

  if (updates.status && updates.status !== previousStatus) {
    await logActivity({
      userId: user.id,
      action: 'status_changed',
      entityType: 'Application',
      entityId: application.id,
      description: `Status changed from ${previousStatus} to ${updates.status}`,
      metadata: { from: previousStatus, to: updates.status },
    })
  }

  return application
}

export async function archiveApplication(user: AuthUser, id: string) {
  const application = await findOwnedApplication(user, id)

  application.archivedAt = new Date()
  await application.save()

  return application
}

export async function getApplicationActivity(user: AuthUser, id: string) {
  await findOwnedApplication(user, id)

  return ActivityLog.find({ entityType: 'Application', entityId: id })
    .sort({ createdAt: -1 })
    .populate('userId', 'name')
}
