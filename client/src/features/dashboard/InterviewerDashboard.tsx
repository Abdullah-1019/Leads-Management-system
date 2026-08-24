import { CardShell, ErrorState, Spinner } from '../../components/ui/EmptyState'
import { StatTile, StatTileGrid } from '../../components/ui/StatTile'
import { ActivityFeed } from '../activity/ActivityFeed'
import { useDashboardSummaryQuery } from './queries'
import type { InterviewerDashboardSummary } from '../../types/dashboard'

export function InterviewerDashboard() {
  const { data, isLoading, isError, refetch } = useDashboardSummaryQuery()

  if (isLoading) return <Spinner />
  if (isError || !data) {
    return <ErrorState message="Could not load your dashboard." onRetry={() => void refetch()} />
  }
  const summary = data as InterviewerDashboardSummary

  return (
    <div className="flex flex-col gap-6">
      <StatTileGrid>
        <StatTile label="Today's Interviews" value={summary.todaysInterviews} />
        <StatTile label="Upcoming Interviews" value={summary.upcomingInterviews} />
        <StatTile label="Completed Interviews" value={summary.completedInterviews} />
        <StatTile label="Pending Feedback" value={summary.pendingFeedback} />
        <StatTile
          label="Average Rating"
          value={summary.averageRating !== null ? summary.averageRating.toFixed(1) : '—'}
          suffix={summary.averageRating !== null ? '/ 5' : undefined}
        />
      </StatTileGrid>

      <CardShell>
        <div className="p-6">
          <h2 className="mb-4 text-sm font-semibold text-slate-900">Recent Interview Activity</h2>
          <ActivityFeed entries={summary.recentInterviewActivity} />
        </div>
      </CardShell>
    </div>
  )
}
