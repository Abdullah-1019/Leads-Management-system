import type { QueryFilter, Types } from 'mongoose'
import { Application, type IApplication } from '../models/Application.js'
import { Feedback } from '../models/Feedback.js'
import { Interview, type IInterview, type InterviewStatus } from '../models/Interview.js'
import { User } from '../models/User.js'
import { ApiError } from '../utils/ApiError.js'
import { logActivity } from '../utils/activityLogger.js'
import { endOfDay, startOfDay } from '../utils/dateRange.js'
import { buildPaginationMeta, toSkipLimit } from '../utils/pagination.js'
import { partialMatch } from '../utils/regex.js'

interface AuthUser {
  id: string
  role: 'APPLICANT' | 'INTERVIEWER' | 'ADMIN'
}

interface ListParams {
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

const APPLICATION_SNAPSHOT_FIELDS = 'companyName jobTitle jobDescriptionUrl source resumeUsed status'

async function scopeFilter(user: AuthUser): Promise<QueryFilter<IInterview>> {
  if (user.role === 'ADMIN') return {}
  if (user.role === 'INTERVIEWER') return { interviewerId: user.id }

  const ownApplicationIds = (await Application.distinct('_id', {
    createdBy: user.id,
  })) as Types.ObjectId[]
  return { applicationId: { $in: ownApplicationIds } }
}

async function narrowByApplicationSearch(
  filter: QueryFilter<IInterview>,
  company?: string,
  jobTitle?: string,
) {
  if (!company && !jobTitle) return filter

  const appFilter: QueryFilter<IApplication> = {}
  if (company) appFilter.companyName = partialMatch(company)
  if (jobTitle) appFilter.jobTitle = partialMatch(jobTitle)
  const matchingIds = (await Application.distinct('_id', appFilter)) as Types.ObjectId[]

  const existing = filter.applicationId as { $in?: Types.ObjectId[] } | undefined
  if (existing?.$in) {
    const matchingIdSet = new Set(matchingIds.map(String))
    filter.applicationId = { $in: existing.$in.filter((id) => matchingIdSet.has(String(id))) }
  } else {
    filter.applicationId = { $in: matchingIds }
  }

  return filter
}

function tabFilter(tab?: ListParams['tab']): QueryFilter<IInterview> {
  if (!tab) return {}

  const now = new Date()
  const todayStart = startOfDay(now)
  const todayEnd = endOfDay(now)

  switch (tab) {
    case 'today':
      return { scheduledAt: { $gte: todayStart, $lte: todayEnd } }
    case 'upcoming':
      return { scheduledAt: { $gt: todayEnd }, status: { $in: ['Scheduled', 'Rescheduled'] } }
    case 'past':
      return {
        $or: [
          { scheduledAt: { $lt: todayStart } },
          { status: { $in: ['Completed', 'Cancelled', 'No Show'] } },
        ],
      }
    case 'pending-feedback':
      return {}
  }
}

async function applyFeedbackStatusFilter(
  filter: QueryFilter<IInterview>,
  feedbackStatus: 'pending' | 'submitted',
) {
  const submittedIds = (await Feedback.distinct('interviewId')) as Types.ObjectId[]
  filter.status = 'Completed'
  filter._id = feedbackStatus === 'pending' ? { $nin: submittedIds } : { $in: submittedIds }
  return filter
}

export async function listInterviews(user: AuthUser, params: ListParams) {
  const filter = await scopeFilter(user)
  await narrowByApplicationSearch(filter, params.company, params.jobTitle)

  if (params.tab === 'pending-feedback') {
    await applyFeedbackStatusFilter(filter, 'pending')
  } else {
    Object.assign(filter, tabFilter(params.tab))
  }

  if (params.feedbackStatus) {
    await applyFeedbackStatusFilter(filter, params.feedbackStatus)
  }

  if (params.interviewerId && user.role === 'ADMIN') filter.interviewerId = params.interviewerId
  if (params.status) filter.status = params.status

  if (params.date) {
    filter.scheduledAt = { $gte: startOfDay(params.date), $lte: endOfDay(params.date) }
  } else if (params.startDate || params.endDate) {
    const range: { $gte?: Date; $lte?: Date } = {}
    if (params.startDate) range.$gte = params.startDate
    if (params.endDate) range.$lte = params.endDate
    filter.scheduledAt = range
  }

  const { skip, limit } = toSkipLimit(params)
  const sortDirection = params.tab === 'past' ? -1 : 1

  const [data, total] = await Promise.all([
    Interview.find(filter)
      .sort({ scheduledAt: sortDirection })
      .skip(skip)
      .limit(limit)
      .populate('applicationId', APPLICATION_SNAPSHOT_FIELDS)
      .populate('interviewerId', 'name'),
    Interview.countDocuments(filter),
  ])

  const completedIds = data.filter((doc) => doc.status === 'Completed').map((doc) => doc._id)
  const submittedIdSet = new Set(
    completedIds.length
      ? ((await Feedback.distinct('interviewId', { interviewId: { $in: completedIds } })) as Types.ObjectId[]).map(
          String,
        )
      : [],
  )

  const enriched = data.map((doc) => ({
    ...doc.toJSON(),
    feedbackStatus:
      doc.status === 'Completed'
        ? submittedIdSet.has(String(doc._id))
          ? ('submitted' as const)
          : ('pending' as const)
        : undefined,
  }))

  return { data: enriched, pagination: buildPaginationMeta(params, total) }
}

export async function getInterviewById(user: AuthUser, id: string) {
  const scope = await scopeFilter(user)
  const interview = await Interview.findOne({ _id: id, ...scope })
    .populate({ path: 'applicationId', populate: { path: 'createdBy', select: 'name' } })
    .populate('interviewerId', 'name')

  if (!interview) {
    throw new ApiError('NOT_FOUND', 'Interview not found')
  }

  const feedback = await Feedback.findOne({ interviewId: interview.id })
  const feedbackStatus =
    interview.status === 'Completed' ? (feedback ? ('submitted' as const) : ('pending' as const)) : undefined

  return { interview, feedback, feedbackStatus }
}

export async function createInterview(
  user: AuthUser,
  input: {
    applicationId: string
    interviewerId: string
    scheduledAt: Date
    timezone: string
    interviewType: IInterview['interviewType']
    meetingUrl?: string
    notes?: string
  },
) {
  const application = await Application.findOne({
    _id: input.applicationId,
    archivedAt: null,
    ...(user.role === 'APPLICANT' ? { createdBy: user.id } : {}),
  })
  if (!application) {
    throw new ApiError('NOT_FOUND', 'Application not found')
  }

  const interviewer = await User.findOne({
    _id: input.interviewerId,
    role: 'INTERVIEWER',
    isActive: true,
  })
  if (!interviewer) {
    throw new ApiError('VALIDATION_ERROR', 'interviewerId must reference an active interviewer')
  }

  const existingActive = await Interview.findOne({
    applicationId: application.id,
    status: { $ne: 'Cancelled' },
  })

  const interview = await Interview.create(input)
  await interview.populate('applicationId', APPLICATION_SNAPSHOT_FIELDS)
  await interview.populate('interviewerId', 'name')

  await logActivity({
    userId: user.id,
    action: 'interview_scheduled',
    entityType: 'Interview',
    entityId: interview.id,
    description: `Interview scheduled with ${application.companyName} — ${application.jobTitle}`,
  })

  const previousStatus = application.status
  if (previousStatus !== 'Interview Scheduled') {
    application.status = 'Interview Scheduled'
    await application.save()

    await logActivity({
      userId: user.id,
      action: 'status_changed',
      entityType: 'Application',
      entityId: application.id,
      description: `Status changed from ${previousStatus} to Interview Scheduled (interview scheduled)`,
      metadata: { from: previousStatus, to: 'Interview Scheduled' },
    })
  }

  return { interview, hasExistingActiveInterview: Boolean(existingActive) }
}

export async function updateInterview(
  user: AuthUser,
  id: string,
  updates: Partial<{
    interviewerId: string
    scheduledAt: Date
    timezone: string
    interviewType: IInterview['interviewType']
    meetingUrl: string
    status: InterviewStatus
    notes: string
  }>,
) {
  const scope = user.role === 'ADMIN' ? {} : { interviewerId: user.id }
  const interview = await Interview.findOne({ _id: id, ...scope })
  if (!interview) {
    throw new ApiError('NOT_FOUND', 'Interview not found')
  }

  const previousStatus = interview.status
  Object.assign(interview, updates)
  await interview.save()
  await interview.populate('applicationId', APPLICATION_SNAPSHOT_FIELDS)
  await interview.populate('interviewerId', 'name')

  if (updates.status && updates.status !== previousStatus) {
    const action = updates.status === 'Completed' ? 'interview_completed' : 'status_changed'
    await logActivity({
      userId: user.id,
      action,
      entityType: 'Interview',
      entityId: interview.id,
      description: `Interview status changed from ${previousStatus} to ${updates.status}`,
      metadata: { from: previousStatus, to: updates.status },
    })
  }

  return interview
}
