import { CardShell, ErrorState, Spinner } from '../../components/ui/EmptyState'
import { StatTile, StatTileGrid } from '../../components/ui/StatTile'
import { ActivityFeed } from '../activity/ActivityFeed'
import { useDashboardSummaryQuery } from './queries'
import type { AdminDashboardSummary } from '../../types/dashboard'

export function AdminDashboard() {
  const { data, isLoading, isError, refetch } = useDashboardSummaryQuery()

  if (isLoading) return <Spinner />
  if (isError || !data) {
    return <ErrorState message="Could not load the dashboard." onRetry={() => void refetch()} />
  }
  const summary = data as AdminDashboardSummary

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="mb-3 text-sm font-semibold text-slate-900">Applications</h2>
        <StatTileGrid>
          <StatTile label="Today" value={summary.applications.today} />
          <StatTile label="This Week" value={summary.applications.week} />
          <StatTile label="This Month" value={summary.applications.month} />
          <StatTile label="Total" value={summary.applications.total} />
        </StatTileGrid>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold text-slate-900">Leads</h2>
        <StatTileGrid>
          <StatTile label="Total Leads" value={summary.leads.total} />
          <StatTile label="New This Week" value={summary.leads.new} />
          <StatTile label="Interviews Scheduled" value={summary.leads.interviewsScheduled} />
          <StatTile label="Interviews Completed" value={summary.leads.interviewsCompleted} />
        </StatTileGrid>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold text-slate-900">Feedback</h2>
        <StatTileGrid>
          <StatTile label="Pending" value={summary.feedback.pending} />
          <StatTile
            label="Average Rating"
            value={summary.feedback.averageRating !== null ? summary.feedback.averageRating.toFixed(1) : '—'}
            suffix={summary.feedback.averageRating !== null ? '/ 5' : undefined}
          />
        </StatTileGrid>
      </div>

      <CardShell>
        <div className="p-6">
          <h2 className="mb-4 text-sm font-semibold text-slate-900">Team Activity</h2>
          <ActivityFeed entries={summary.recentTeamActivity} />
        </div>
      </CardShell>
    </div>
  )
}
