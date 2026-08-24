import type { Types } from 'mongoose'
import { Application } from '../models/Application.js'
import { Feedback } from '../models/Feedback.js'
import { Interview } from '../models/Interview.js'
import * as activityService from './activity.service.js'
import { startOfDay, startOfMonth, startOfWeek } from '../utils/dateRange.js'

interface AuthUser {
  id: string
  role: 'APPLICANT' | 'INTERVIEWER' | 'ADMIN'
}

function average(values: number[]) {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null
}

async function countPendingFeedback(interviewIds: Types.ObjectId[]) {
  if (!interviewIds.length) return 0
  const submittedIds = new Set(
    ((await Feedback.distinct('interviewId', { interviewId: { $in: interviewIds } })) as Types.ObjectId[]).map(
      String,
    ),
  )
  return interviewIds.filter((id) => !submittedIds.has(String(id))).length
}

async function applicantSummary(user: AuthUser) {
  const now = new Date()
  const todayStart = startOfDay(now)
  const weekStart = startOfWeek(now)
  const monthStart = startOfMonth(now)
  const baseFilter = { createdBy: user.id, archivedAt: null }

  const [applicationsToday, applicationsThisWeek, applicationsThisMonth, applicationsTotal, ownApplicationIdsRaw] =
    await Promise.all([
      Application.countDocuments({ ...baseFilter, applicationDate: { $gte: todayStart } }),
      Application.countDocuments({ ...baseFilter, applicationDate: { $gte: weekStart } }),
      Application.countDocuments({ ...baseFilter, applicationDate: { $gte: monthStart } }),
      Application.countDocuments(baseFilter),
      Application.distinct('_id', { createdBy: user.id }),
    ])
  const ownApplicationIds = ownApplicationIdsRaw as Types.ObjectId[]

  const [leadApplicationIds, upcomingInterviews, recentApplications, recentActivity] = await Promise.all([
    Interview.distinct('applicationId', { applicationId: { $in: ownApplicationIds } }),
    Interview.countDocuments({
      applicationId: { $in: ownApplicationIds },
      scheduledAt: { $gt: now },
      status: { $in: ['Scheduled', 'Rescheduled'] },
    }),
    Application.find(baseFilter)
      .sort({ createdAt: -1 })
      .limit(5)
      .select('companyName jobTitle status applicationDate'),
    activityService.listActivity(user, { page: 1, limit: 5 }),
  ])

  return {
    applicationsToday,
    applicationsThisWeek,
    applicationsThisMonth,
    applicationsTotal,
    leadsGenerated: leadApplicationIds.length,
    upcomingInterviews,
    recentApplications,
    recentActivity: recentActivity.data,
  }
}

async function interviewerSummary(user: AuthUser) {
  const now = new Date()
  const todayStart = startOfDay(now)
  const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000 - 1)

  const [todaysInterviews, upcomingInterviews, completedInterviewIds, ownFeedback, recentActivity] =
    await Promise.all([
      Interview.countDocuments({
        interviewerId: user.id,
        scheduledAt: { $gte: todayStart, $lte: todayEnd },
      }),
      Interview.countDocuments({
        interviewerId: user.id,
        scheduledAt: { $gt: todayEnd },
        status: { $in: ['Scheduled', 'Rescheduled'] },
      }),
      Interview.distinct('_id', { interviewerId: user.id, status: 'Completed' }),
      Feedback.find({ submittedBy: user.id }).select('overallRating'),
      activityService.listActivity(user, { page: 1, limit: 5 }),
    ])

  const pendingFeedback = await countPendingFeedback(completedInterviewIds as Types.ObjectId[])

  return {
    todaysInterviews,
    upcomingInterviews,
    completedInterviews: completedInterviewIds.length,
    pendingFeedback,
    averageRating: average(ownFeedback.map((doc) => doc.overallRating)),
    recentInterviewActivity: recentActivity.data,
  }
}

async function adminSummary(user: AuthUser) {
  const now = new Date()
  const todayStart = startOfDay(now)
  const weekStart = startOfWeek(now)
  const monthStart = startOfMonth(now)

  const [
    applicationsToday,
    applicationsWeek,
    applicationsMonth,
    applicationsTotal,
    allLeadApplicationIds,
    newLeadApplicationIds,
    interviewsScheduled,
    interviewsCompleted,
    allFeedback,
    recentActivity,
  ] = await Promise.all([
    Application.countDocuments({ archivedAt: null, applicationDate: { $gte: todayStart } }),
    Application.countDocuments({ archivedAt: null, applicationDate: { $gte: weekStart } }),
    Application.countDocuments({ archivedAt: null, applicationDate: { $gte: monthStart } }),
    Application.countDocuments({ archivedAt: null }),
    Interview.distinct('applicationId'),
    Interview.distinct('applicationId', { createdAt: { $gte: weekStart } }),
    Interview.countDocuments({ status: { $in: ['Scheduled', 'Rescheduled'] } }),
    Interview.countDocuments({ status: 'Completed' }),
    Feedback.find().select('overallRating'),
    activityService.listActivity(user, { page: 1, limit: 8 }),
  ])

  const completedInterviewIds = (await Interview.distinct('_id', {
    status: 'Completed',
  })) as Types.ObjectId[]
  const feedbackPending = await countPendingFeedback(completedInterviewIds)

  return {
    applications: {
      today: applicationsToday,
      week: applicationsWeek,
      month: applicationsMonth,
      total: applicationsTotal,
    },
    leads: {
      total: allLeadApplicationIds.length,
      new: newLeadApplicationIds.length,
      interviewsScheduled,
      interviewsCompleted,
    },
    feedback: {
      pending: feedbackPending,
      averageRating: average(allFeedback.map((doc) => doc.overallRating)),
    },
    recentTeamActivity: recentActivity.data,
  }
}

export async function getDashboardSummary(user: AuthUser) {
  if (user.role === 'APPLICANT') return applicantSummary(user)
  if (user.role === 'INTERVIEWER') return interviewerSummary(user)
  return adminSummary(user)
}

type AnalyticsRange = 'day' | 'week' | 'month'

function periodGroupExpr(range: AnalyticsRange, dateField: string) {
  if (range === 'day') return { $dateToString: { format: '%Y-%m-%d', date: `$${dateField}` } }
  if (range === 'month') return { $dateToString: { format: '%Y-%m', date: `$${dateField}` } }

  return {
    $concat: [
      { $toString: { $isoWeekYear: `$${dateField}` } },
      '-W',
      {
        $cond: [
          { $lt: [{ $isoWeek: `$${dateField}` }, 10] },
          { $concat: ['0', { $toString: { $isoWeek: `$${dateField}` } }] },
          { $toString: { $isoWeek: `$${dateField}` } },
        ],
      },
    ],
  }
}

function analyticsWindowStart(range: AnalyticsRange, now: Date) {
  if (range === 'day') {
    const start = startOfDay(now)
    start.setDate(start.getDate() - 29)
    return start
  }
  if (range === 'week') {
    const start = startOfWeek(now)
    start.setDate(start.getDate() - 7 * 11)
    return start
  }
  const start = startOfMonth(now)
  start.setMonth(start.getMonth() - 11)
  return start
}

async function groupedApplicationCount(match: Record<string, unknown>, field: string) {
  const rows = (await Application.aggregate([
    { $match: match },
    { $group: { _id: { $ifNull: [`$${field}`, 'Unspecified'] }, count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ])) as { _id: string | null; count: number }[]
  return rows.map((row) => ({ [field]: row._id ?? 'Unspecified', count: row.count }))
}

export async function getAnalytics(range: AnalyticsRange) {
  const now = new Date()
  const since = analyticsWindowStart(range, now)

  const [applicationsTimeSeries, bySource, byResume, byStatus, totalApplications] = await Promise.all([
    Application.aggregate([
      { $match: { archivedAt: null, applicationDate: { $gte: since } } },
      { $group: { _id: periodGroupExpr(range, 'applicationDate'), count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]).then((rows: { _id: string; count: number }[]) =>
      rows.map((row) => ({ period: row._id, count: row.count })),
    ),
    groupedApplicationCount({ archivedAt: null }, 'source'),
    groupedApplicationCount({ archivedAt: null }, 'resumeUsed'),
    groupedApplicationCount({ archivedAt: null }, 'status'),
    Application.countDocuments({ archivedAt: null }),
  ])

  const [leadApplicationIds, leadsTimeSeriesRaw] = await Promise.all([
    Interview.distinct('applicationId'),
    Interview.aggregate([
      { $match: { createdAt: { $gte: since } } },
      { $group: { _id: periodGroupExpr(range, 'createdAt'), applicationIds: { $addToSet: '$applicationId' } } },
      { $sort: { _id: 1 } },
    ]),
  ])
  const leadsTimeSeries = (leadsTimeSeriesRaw as { _id: string; applicationIds: unknown[] }[]).map((row) => ({
    period: row._id,
    count: row.applicationIds.length,
  }))
  const totalLeads = leadApplicationIds.length

  const [totalInterviews, scheduledCount, completedCount, cancelledCount, allFeedback] = await Promise.all([
    Interview.countDocuments({}),
    Interview.countDocuments({ status: { $in: ['Scheduled', 'Rescheduled'] } }),
    Interview.countDocuments({ status: 'Completed' }),
    Interview.countDocuments({ status: 'Cancelled' }),
    Feedback.find().select('overallRating'),
  ])

  const completedInterviewIds = (await Interview.distinct('_id', {
    status: 'Completed',
  })) as Types.ObjectId[]
  const pendingFeedback = await countPendingFeedback(completedInterviewIds)
  const averageRating = average(allFeedback.map((doc) => doc.overallRating))
  const interviewCompletionRate = totalInterviews ? (completedCount / totalInterviews) * 100 : 0

  const leadConversionRate = totalApplications ? (totalLeads / totalApplications) * 100 : 0
  const interviewConversionRate = totalApplications ? (totalInterviews / totalApplications) * 100 : 0

  return {
    applications: { timeSeries: applicationsTimeSeries, bySource, byResume, byStatus },
    leads: { total: totalLeads, timeSeries: leadsTimeSeries, conversionRate: leadConversionRate },
    interviews: {
      scheduled: scheduledCount,
      completed: completedCount,
      cancelled: cancelledCount,
      pendingFeedback,
      averageRating,
      completionRate: interviewCompletionRate,
    },
    kpis: {
      leadConversionRate,
      interviewConversionRate,
      interviewCompletionRate,
      averageLeadRating: averageRating ?? 0,
    },
  }
}
