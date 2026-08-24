import { useState } from 'react'
import { SimpleBarChart } from '../components/charts/SimpleBarChart'
import { SimpleLineChart } from '../components/charts/SimpleLineChart'
import { CardShell, ErrorState, Spinner } from '../components/ui/EmptyState'
import { StatTile, StatTileGrid } from '../components/ui/StatTile'
import { useAnalyticsQuery } from '../features/dashboard/queries'

const RANGE_OPTIONS = [
  { key: 'day', label: 'Daily' },
  { key: 'week', label: 'Weekly' },
  { key: 'month', label: 'Monthly' },
] as const

type Range = (typeof RANGE_OPTIONS)[number]['key']

function pct(value: number) {
  return `${value.toFixed(1)}%`
}

export function AnalyticsPage() {
  const [range, setRange] = useState<Range>('week')
  const { data, isLoading, isError, refetch } = useAnalyticsQuery(range)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-slate-900">Analytics</h1>
        <div className="flex gap-1 rounded-lg border border-slate-200 bg-white p-1">
          {RANGE_OPTIONS.map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => setRange(option.key)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                range === option.key ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <Spinner />
      ) : isError || !data ? (
        <ErrorState onRetry={() => void refetch()} />
      ) : (
        <>
          <StatTileGrid>
            <StatTile label="Lead Conversion Rate" value={pct(data.kpis.leadConversionRate)} />
            <StatTile label="Interview Conversion Rate" value={pct(data.kpis.interviewConversionRate)} />
            <StatTile label="Interview Completion Rate" value={pct(data.kpis.interviewCompletionRate)} />
            <StatTile label="Average Lead Rating" value={data.kpis.averageLeadRating.toFixed(1)} suffix="/ 5" />
          </StatTileGrid>

          <div>
            <h2 className="mb-3 text-sm font-semibold text-slate-900">Applications</h2>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <CardShell>
                <div className="p-5">
                  <h3 className="mb-3 text-xs font-medium uppercase tracking-wide text-slate-400">
                    Applications over time
                  </h3>
                  <SimpleLineChart data={data.applications.timeSeries} />
                </div>
              </CardShell>
              <CardShell>
                <div className="p-5">
                  <h3 className="mb-3 text-xs font-medium uppercase tracking-wide text-slate-400">By status</h3>
                  <SimpleBarChart
                    data={data.applications.byStatus.map((row) => ({ label: row.status, count: row.count }))}
                  />
                </div>
              </CardShell>
              <CardShell>
                <div className="p-5">
                  <h3 className="mb-3 text-xs font-medium uppercase tracking-wide text-slate-400">By source</h3>
                  <SimpleBarChart
                    data={data.applications.bySource.map((row) => ({ label: row.source, count: row.count }))}
                  />
                </div>
              </CardShell>
              <CardShell>
                <div className="p-5">
                  <h3 className="mb-3 text-xs font-medium uppercase tracking-wide text-slate-400">
                    By resume used
                  </h3>
                  <SimpleBarChart
                    data={data.applications.byResume.map((row) => ({ label: row.resumeUsed, count: row.count }))}
                  />
                </div>
              </CardShell>
            </div>
          </div>

          <div>
            <h2 className="mb-3 text-sm font-semibold text-slate-900">Leads</h2>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <StatTile label="Total Leads" value={data.leads.total} />
              <div className="lg:col-span-2">
                <CardShell>
                  <div className="p-5">
                    <h3 className="mb-3 text-xs font-medium uppercase tracking-wide text-slate-400">
                      Leads generated over time
                    </h3>
                    <SimpleLineChart data={data.leads.timeSeries} height={180} />
                  </div>
                </CardShell>
              </div>
            </div>
          </div>

          <div>
            <h2 className="mb-3 text-sm font-semibold text-slate-900">Interviews</h2>
            <StatTileGrid>
              <StatTile label="Scheduled" value={data.interviews.scheduled} />
              <StatTile label="Completed" value={data.interviews.completed} />
              <StatTile label="Cancelled" value={data.interviews.cancelled} />
              <StatTile label="Pending Feedback" value={data.interviews.pendingFeedback} />
              <StatTile
                label="Average Rating"
                value={data.interviews.averageRating !== null ? data.interviews.averageRating.toFixed(1) : '—'}
                suffix={data.interviews.averageRating !== null ? '/ 5' : undefined}
              />
              <StatTile label="Completion Rate" value={pct(data.interviews.completionRate)} />
            </StatTileGrid>
          </div>
        </>
      )}
    </div>
  )
}
