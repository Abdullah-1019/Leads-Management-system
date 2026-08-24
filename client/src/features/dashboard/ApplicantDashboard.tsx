import { Rocket } from 'lucide-react'
import { Link } from 'react-router-dom'
import { CardShell, ErrorState, Spinner } from '../../components/ui/EmptyState'
import { StatTile, StatTileGrid } from '../../components/ui/StatTile'
import { ActivityFeed } from '../activity/ActivityFeed'
import { StatusBadge } from '../applications/StatusBadge'
import { useDashboardSummaryQuery } from './queries'
import type { ApplicantDashboardSummary } from '../../types/dashboard'

export function ApplicantDashboard() {
  const { data, isLoading, isError, refetch } = useDashboardSummaryQuery()

  if (isLoading) return <Spinner />
  if (isError || !data) {
    return <ErrorState message="Could not load your dashboard." onRetry={() => void refetch()} />
  }
  const summary = data as ApplicantDashboardSummary

  return (
    <div className="flex flex-col gap-6">
      <Link
        to="/applying"
        className="inline-flex w-fit items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
      >
        <Rocket className="size-4" />
        Start Today's Applying
      </Link>

      <StatTileGrid>
        <StatTile label="Applications Today" value={summary.applicationsToday} />
        <StatTile label="This Week" value={summary.applicationsThisWeek} />
        <StatTile label="This Month" value={summary.applicationsThisMonth} />
        <StatTile label="Total Applications" value={summary.applicationsTotal} />
        <StatTile label="Leads Generated" value={summary.leadsGenerated} />
        <StatTile label="Upcoming Interviews" value={summary.upcomingInterviews} />
      </StatTileGrid>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <CardShell>
          <div className="p-6">
            <h2 className="mb-4 text-sm font-semibold text-slate-900">Recent Applications</h2>
            {summary.recentApplications.length === 0 ? (
              <p className="text-sm text-slate-400">No applications yet.</p>
            ) : (
              <ul className="flex flex-col gap-3">
                {summary.recentApplications.map((application) => (
                  <li key={application._id}>
                    <Link
                      to={`/applications/${application._id}`}
                      className="flex items-center justify-between gap-3 text-sm hover:text-slate-900"
                    >
                      <span>
                        <span className="font-medium text-slate-900">{application.companyName}</span>{' '}
                        <span className="text-slate-500">— {application.jobTitle}</span>
                      </span>
                      <StatusBadge status={application.status} />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </CardShell>

        <CardShell>
          <div className="p-6">
            <h2 className="mb-4 text-sm font-semibold text-slate-900">Recent Activity</h2>
            <ActivityFeed entries={summary.recentActivity} />
          </div>
        </CardShell>
      </div>
    </div>
  )
}
