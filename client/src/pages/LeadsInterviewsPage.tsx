import { useState } from 'react'
import { EmptyState, ErrorState, Spinner } from '../components/ui/EmptyState'
import { Pagination } from '../components/ui/Pagination'
import { InterviewFilters, type InterviewFiltersValue } from '../features/interviews/InterviewFilters'
import { InterviewTable } from '../features/interviews/InterviewTable'
import { InterviewTabs, type InterviewTab } from '../features/interviews/InterviewTabs'
import { useInterviewsQuery } from '../features/interviews/queries'
import { useAuth } from '../hooks/useAuth'
import { usePagination } from '../hooks/usePagination'

interface LeadsInterviewsPageProps {
  title: string
  description?: string
  lockedTab?: InterviewTab | 'all'
  showSwitcher?: boolean
}

export function LeadsInterviewsPage({
  title,
  description,
  lockedTab,
  showSwitcher = false,
}: LeadsInterviewsPageProps) {
  const { user } = useAuth()
  const { page, limit, setPage } = usePagination(20)
  const [activeTab, setActiveTab] = useState<InterviewTab>(
    lockedTab && lockedTab !== 'all' ? lockedTab : 'upcoming',
  )
  const [filters, setFilters] = useState<InterviewFiltersValue>({})

  const effectiveTab = lockedTab === 'all' ? undefined : lockedTab ?? activeTab

  const { data, isLoading, isError, refetch } = useInterviewsQuery({
    page,
    limit,
    tab: effectiveTab,
    ...filters,
  })

  const interviews = data?.data ?? []

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
        {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
      </div>

      {showSwitcher && (
        <InterviewTabs
          active={activeTab}
          onChange={(tab) => {
            setActiveTab(tab)
            setPage(1)
          }}
        />
      )}

      <InterviewFilters
        value={filters}
        onChange={(next) => {
          setFilters(next)
          setPage(1)
        }}
        showInterviewerFilter={user?.role === 'ADMIN'}
      />

      {isLoading ? (
        <Spinner />
      ) : isError ? (
        <ErrorState onRetry={() => void refetch()} />
      ) : interviews.length === 0 ? (
        <EmptyState title="No interviews found" description="Try adjusting the filters." />
      ) : (
        <>
          <InterviewTable interviews={interviews} />
          {data && <Pagination pagination={data.pagination} onPageChange={setPage} />}
        </>
      )}
    </div>
  )
}
