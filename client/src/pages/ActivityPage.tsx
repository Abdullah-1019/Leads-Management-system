import { useState } from 'react'
import { EmptyState, ErrorState, Spinner } from '../components/ui/EmptyState'
import { Pagination } from '../components/ui/Pagination'
import { ActivityFeed } from '../features/activity/ActivityFeed'
import { ActivityFilters, type ActivityFiltersValue } from '../features/activity/ActivityFilters'
import { useActivityQuery } from '../features/activity/queries'
import { usePagination } from '../hooks/usePagination'

export function ActivityPage({
  title,
  showUserFilter = false,
}: {
  title: string
  showUserFilter?: boolean
}) {
  const { page, limit, setPage } = usePagination(20)
  const [filters, setFilters] = useState<ActivityFiltersValue>({})

  const { data, isLoading, isError, refetch } = useActivityQuery({ page, limit, ...filters })
  const entries = data?.data ?? []

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>

      <ActivityFilters
        value={filters}
        onChange={(next) => {
          setFilters(next)
          setPage(1)
        }}
        showUserFilter={showUserFilter}
      />

      {isLoading ? (
        <Spinner />
      ) : isError ? (
        <ErrorState onRetry={() => void refetch()} />
      ) : entries.length === 0 ? (
        <EmptyState title="No activity found" description="Try adjusting the filters." />
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <ActivityFeed entries={entries} />
        </div>
      )}

      {data && <Pagination pagination={data.pagination} onPageChange={setPage} />}
    </div>
  )
}
