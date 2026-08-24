import { useState } from 'react'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { EmptyState, ErrorState, Spinner } from '../components/ui/EmptyState'
import { Pagination } from '../components/ui/Pagination'
import {
  ApplicationFilters,
  type ApplicationFiltersValue,
} from '../features/applications/ApplicationFilters'
import { ApplicationTable } from '../features/applications/ApplicationTable'
import { useApplicationsQuery, useArchiveApplicationMutation } from '../features/applications/queries'
import { useAuth } from '../hooks/useAuth'
import { usePagination } from '../hooks/usePagination'
import { useToast } from '../hooks/useToast'
import type { Application } from '../types/application'
import { getApiErrorMessage } from '../utils/apiError'

export function ApplicationsPage() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const { page, limit, setPage } = usePagination(20)
  const [filters, setFilters] = useState<ApplicationFiltersValue>({})
  const [archiveTarget, setArchiveTarget] = useState<Application | null>(null)

  const { data, isLoading, isError, refetch } = useApplicationsQuery({ page, limit, ...filters })
  const archiveMutation = useArchiveApplicationMutation()

  async function handleArchive() {
    if (!archiveTarget) return
    try {
      await archiveMutation.mutateAsync(archiveTarget._id)
      showToast('Application archived')
    } catch (err) {
      showToast(getApiErrorMessage(err, 'Could not archive application'), 'error')
    } finally {
      setArchiveTarget(null)
    }
  }

  const applications = data?.data ?? []

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Jobs Applied</h1>
        <p className="mt-1 text-sm text-slate-500">Full application history, filterable and searchable.</p>
      </div>

      <ApplicationFilters
        value={filters}
        onChange={(next) => {
          setFilters(next)
          setPage(1)
        }}
      />

      {isLoading ? (
        <Spinner />
      ) : isError ? (
        <ErrorState onRetry={() => void refetch()} />
      ) : applications.length === 0 ? (
        <EmptyState title="No applications match these filters" />
      ) : (
        <>
          <ApplicationTable
            applications={applications}
            groupByDate
            showCreatedBy={user?.role === 'ADMIN'}
            onArchive={setArchiveTarget}
          />
          {data && <Pagination pagination={data.pagination} onPageChange={setPage} />}
        </>
      )}

      <ConfirmDialog
        open={Boolean(archiveTarget)}
        title="Archive this application?"
        description={`${archiveTarget?.companyName ?? ''} — ${archiveTarget?.jobTitle ?? ''} will be moved out of the active list.`}
        confirmLabel="Archive"
        onConfirm={() => void handleArchive()}
        onCancel={() => setArchiveTarget(null)}
      />
    </div>
  )
}
