import { CheckCircle2, Plus } from 'lucide-react'
import { useState } from 'react'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { CardShell, EmptyState, ErrorState, Spinner } from '../components/ui/EmptyState'
import { ApplicationForm } from '../features/applications/ApplicationForm'
import type { ApplicationFormValues } from '../features/applications/applicationSchema'
import { ApplicationTable } from '../features/applications/ApplicationTable'
import { toApplicationInput } from '../features/applications/toApplicationInput'
import {
  useApplicationsQuery,
  useArchiveApplicationMutation,
  useCreateApplicationMutation,
} from '../features/applications/queries'
import { useTodaysApplyingComplete } from '../hooks/useTodaysApplyingComplete'
import { useToast } from '../hooks/useToast'
import type { Application } from '../types/application'
import { getApiErrorMessage } from '../utils/apiError'

function todayIso() {
  return new Date().toISOString().slice(0, 10)
}

export function ApplyingJobsPage() {
  const { showToast } = useToast()
  const { isComplete, markComplete } = useTodaysApplyingComplete()
  const [formOpen, setFormOpen] = useState(false)
  const [lastSource, setLastSource] = useState<string | undefined>(undefined)
  const [archiveTarget, setArchiveTarget] = useState<Application | null>(null)

  const today = todayIso()
  const { data, isLoading, isError, refetch } = useApplicationsQuery({
    startDate: today,
    endDate: today,
    limit: 100,
  })

  const createMutation = useCreateApplicationMutation()
  const archiveMutation = useArchiveApplicationMutation()

  async function handleCreate(values: ApplicationFormValues) {
    try {
      await createMutation.mutateAsync(toApplicationInput(values))
      setLastSource(values.source || undefined)
      setFormOpen(false)
      showToast('Application saved')
    } catch (err) {
      showToast(getApiErrorMessage(err, 'Could not save application'), 'error')
    }
  }

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
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Applying Jobs</h1>
          <p className="mt-1 text-sm text-slate-500">
            Applications Today: <span className="font-medium text-slate-700">{applications.length}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isComplete ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1.5 text-sm font-medium text-emerald-700">
              <CheckCircle2 className="size-4" />
              Today's Applying Complete
            </span>
          ) : (
            <button
              type="button"
              onClick={markComplete}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-white"
            >
              Mark Today's Applying Complete
            </button>
          )}

          <button
            type="button"
            onClick={() => setFormOpen((open) => !open)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            <Plus className="size-4" />
            Add Application
          </button>
        </div>
      </div>

      {formOpen && (
        <CardShell>
          <div className="p-6">
            <ApplicationForm
              mode="create"
              defaultValues={{ applicationDate: today, source: lastSource }}
              submitLabel="Save Application"
              onSubmit={handleCreate}
              onCancel={() => setFormOpen(false)}
            />
          </div>
        </CardShell>
      )}

      {isLoading ? (
        <Spinner />
      ) : isError ? (
        <ErrorState onRetry={() => void refetch()} />
      ) : applications.length === 0 ? (
        <EmptyState
          title="No applications logged today"
          description="Use + Add Application to log your first one."
        />
      ) : (
        <ApplicationTable applications={applications} onArchive={setArchiveTarget} />
      )}

      <ConfirmDialog
        open={Boolean(archiveTarget)}
        title="Archive this application?"
        description={`${archiveTarget?.companyName ?? ''} — ${archiveTarget?.jobTitle ?? ''} will be moved out of your active list. You can still find it later with "include archived".`}
        confirmLabel="Archive"
        onConfirm={() => void handleArchive()}
        onCancel={() => setArchiveTarget(null)}
      />
    </div>
  )
}
