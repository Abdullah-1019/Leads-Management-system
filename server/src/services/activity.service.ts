import type { QueryFilter, Types } from 'mongoose'
import { ActivityLog, type ActivityEntityType, type IActivityLog } from '../models/ActivityLog.js'
import { Application } from '../models/Application.js'
import { Feedback } from '../models/Feedback.js'
import { Interview } from '../models/Interview.js'
import { buildDateRangeFilter } from '../utils/dateRange.js'
import { buildPaginationMeta, toSkipLimit } from '../utils/pagination.js'

interface AuthUser {
  id: string
  role: 'APPLICANT' | 'INTERVIEWER' | 'ADMIN'
}

interface ListParams {
  page: number
  limit: number
  userId?: string
  action?: string
  entityType?: ActivityEntityType
  startDate?: Date
  endDate?: Date
}

async function scopeFilter(user: AuthUser): Promise<QueryFilter<IActivityLog>> {
  if (user.role === 'ADMIN') return {}

  if (user.role === 'APPLICANT') {
    const applicationIds = (await Application.distinct('_id', {
      createdBy: user.id,
    })) as Types.ObjectId[]
    const interviewIds = (await Interview.distinct('_id', {
      applicationId: { $in: applicationIds },
    })) as Types.ObjectId[]
    const feedbackIds = (await Feedback.distinct('_id', {
      interviewId: { $in: interviewIds },
    })) as Types.ObjectId[]

    return {
      $or: [
        { entityType: 'Application', entityId: { $in: applicationIds } },
        { entityType: 'Interview', entityId: { $in: interviewIds } },
        { entityType: 'Feedback', entityId: { $in: feedbackIds } },
      ],
    }
  }

  const interviewIds = (await Interview.distinct('_id', {
    interviewerId: user.id,
  })) as Types.ObjectId[]
  const feedbackIds = (await Feedback.distinct('_id', {
    interviewId: { $in: interviewIds },
  })) as Types.ObjectId[]

  return {
    $or: [
      { entityType: 'Interview', entityId: { $in: interviewIds } },
      { entityType: 'Feedback', entityId: { $in: feedbackIds } },
      { userId: user.id },
    ],
  }
}

export async function listActivity(user: AuthUser, params: ListParams) {
  const filter = await scopeFilter(user)

  if (params.userId && user.role === 'ADMIN') filter.userId = params.userId
  if (params.action) filter.action = params.action
  if (params.entityType) filter.entityType = params.entityType

  const dateRange = buildDateRangeFilter(params.startDate, params.endDate)
  if (dateRange) filter.createdAt = dateRange

  const { skip, limit } = toSkipLimit(params)

  const [data, total] = await Promise.all([
    ActivityLog.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('userId', 'name'),
    ActivityLog.countDocuments(filter),
  ])

  return { data, pagination: buildPaginationMeta(params, total) }
}
