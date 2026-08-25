import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { EmptyState, ErrorState, Spinner } from '../components/ui/EmptyState'
import { InterviewStatusBadge } from '../features/interviews/InterviewStatusBadge'
import { useInterviewsQuery } from '../features/interviews/queries'
import type { Interview } from '../types/interview'

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function endOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999)
}

function toDateInput(date: Date) {
  return date.toISOString().slice(0, 10)
}

function groupByDay(interviews: Interview[]) {
  const groups = new Map<string, Interview[]>()
  for (const interview of interviews) {
    const key = new Date(interview.scheduledAt).toDateString()
    const existing = groups.get(key) ?? []
    existing.push(interview)
    groups.set(key, existing)
  }
  return groups
}

function applicationSnapshot(applicationId: Interview['applicationId']) {
  return typeof applicationId === 'string' ? undefined : applicationId
}

export function CalendarPage() {
  const [monthAnchor, setMonthAnchor] = useState(() => startOfMonth(new Date()))

  const rangeStart = startOfMonth(monthAnchor)
  const rangeEnd = endOfMonth(monthAnchor)

  const { data, isLoading, isError, refetch } = useInterviewsQuery({
    startDate: toDateInput(rangeStart),
    endDate: toDateInput(rangeEnd),
    limit: 100,
  })

  const grouped = useMemo(() => groupByDay(data?.data ?? []), [data])
  const sortedDayKeys = useMemo(
    () => [...grouped.keys()].sort((a, b) => new Date(a).getTime() - new Date(b).getTime()),
    [grouped],
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-slate-900">Calendar</h1>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMonthAnchor((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
            className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:bg-white"
          >
            <ChevronLeft className="size-4" />
          </button>
          <span className="min-w-36 text-center text-sm font-medium text-slate-700">
            {monthAnchor.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
          </span>
          <button
            type="button"
            onClick={() => setMonthAnchor((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
            className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:bg-white"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      {isLoading ? (
        <Spinner />
      ) : isError ? (
        <ErrorState onRetry={() => void refetch()} />
      ) : sortedDayKeys.length === 0 ? (
        <EmptyState title="No interviews this month" />
      ) : (
        <div className="flex flex-col gap-4">
          {sortedDayKeys.map((dayKey) => (
            <div key={dayKey} className="rounded-xl border border-slate-200 bg-white">
              <div className="border-b border-slate-100 px-4 py-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                {new Date(dayKey).toLocaleDateString(undefined, {
                  weekday: 'long',
                  month: 'short',
                  day: 'numeric',
                })}
              </div>
              <ul className="divide-y divide-slate-100">
                {grouped.get(dayKey)!.map((interview) => {
                  const application = applicationSnapshot(interview.applicationId)
                  return (
                    <li key={interview._id}>
                      <Link
                        to={`/interviews/${interview._id}`}
                        className="flex items-center justify-between gap-4 px-4 py-3 text-sm hover:bg-slate-50"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-16 shrink-0 text-slate-500">
                            {new Date(interview.scheduledAt).toLocaleTimeString(undefined, {
                              hour: 'numeric',
                              minute: '2-digit',
                            })}
                          </span>
                          <span className="font-medium text-slate-900">
                            {application?.companyName ?? 'Interview'}
                          </span>
                          <span className="text-slate-500">{application?.jobTitle}</span>
                        </div>
                        <InterviewStatusBadge status={interview.status} />
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
