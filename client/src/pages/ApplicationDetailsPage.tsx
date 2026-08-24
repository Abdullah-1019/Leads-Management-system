import { useState, type ReactNode } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { CardShell, ErrorState, Spinner } from '../components/ui/EmptyState'
import { ApplicationForm } from '../features/applications/ApplicationForm'
import type { ApplicationFormValues } from '../features/applications/applicationSchema'
import { ApplicationTimeline } from '../features/applications/ApplicationTimeline'
import { StatusBadge } from '../features/applications/StatusBadge'
import { toApplicationInput } from '../features/applications/toApplicationInput'
import {
  useApplicationActivityQuery,
  useApplicationQuery,
  useArchiveApplicationMutation,
  useUpdateApplicationMutation,
} from '../features/applications/queries'
import { InterviewStatusBadge } from '../features/interviews/InterviewStatusBadge'
import { ScheduleInterviewPanel } from '../features/interviews/ScheduleInterviewPanel'
import { useToast } from '../hooks/useToast'
import { getApiErrorMessage } from '../utils/apiError'

function creatorName(createdBy: string | { name: string }) {
  return typeof createdBy === 'string' ? undefined : createdBy.name
}

export function ApplicationDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const location = useLocation()
  const navigate = useNavigate()
  const { showToast } = useToast()

  const [isEditing, setIsEditing] = useState(Boolean((location.state as { edit?: boolean } | null)?.edit))
  const [confirmArchive, setConfirmArchive] = useState(false)
  const [showScheduleForm, setShowScheduleForm] = useState(false)

  const { data: application, isLoading, isError, refetch } = useApplicationQuery(id)
  const { data: activity = [] } = useApplicationActivityQuery(id)
  const updateMutation = useUpdateApplicationMutation()
  const archiveMutation = useArchiveApplicationMutation()

  async function handleUpdate(values: ApplicationFormValues) {
    if (!id) return
    try {
      await updateMutation.mutateAsync({ id, payload: toApplicationInput(values) })
      setIsEditing(false)
      showToast('Application updated')
    } catch (err) {
      showToast(getApiErrorMessage(err, 'Could not update application'), 'error')
    }
  }

  async function handleArchive() {
    if (!id) return
    try {
      await archiveMutation.mutateAsync(id)
      showToast('Application archived')
      navigate('/applications')
    } catch (err) {
      showToast(getApiErrorMessage(err, 'Could not archive application'), 'error')
    } finally {
      setConfirmArchive(false)
    }
  }

  if (isLoading) {
    return <Spinner />
  }

  if (isError || !application) {
    return <ErrorState message="Could not load this application." onRetry={() => void refetch()} />
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            {application.companyName} — {application.jobTitle}
          </h1>
          <div className="mt-2 flex items-center gap-3">
            <StatusBadge status={application.status} />
            {application.archivedAt && (
              <span className="text-xs font-medium text-slate-400">Archived</span>
            )}
          </div>
        </div>

        {!isEditing && (
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="rounded-lg border border-slate-200 px-3.5 py-2 text-sm font-medium text-slate-600 transition hover:bg-white"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => setConfirmArchive(true)}
              className="rounded-lg border border-slate-200 px-3.5 py-2 text-sm font-medium text-slate-400 transition hover:text-red-600"
            >
              Archive
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <CardShell>
          <div className="p-6">
            <ApplicationForm
              mode="edit"
              defaultValues={{
                companyName: application.companyName,
                jobTitle: application.jobTitle,
                jobDescriptionUrl: application.jobDescriptionUrl ?? '',
                location: application.location ?? '',
                jobType: application.jobType ?? '',
                source: application.source ?? '',
                resumeUsed: application.resumeUsed,
                applicationDate: application.applicationDate.slice(0, 10),
                status: application.status,
                notes: application.notes ?? '',
              }}
              submitLabel="Save Changes"
              onSubmit={handleUpdate}
              onCancel={() => setIsEditing(false)}
            />
          </div>
        </CardShell>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <CardShell>
            <dl className="grid grid-cols-1 gap-4 p-6 text-sm sm:grid-cols-2 lg:col-span-2">
              <Field label="Job Description">
                {application.jobDescriptionUrl ? (
                  <a
                    href={application.jobDescriptionUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-900 underline underline-offset-2"
                  >
                    View posting
                  </a>
                ) : (
                  '—'
                )}
              </Field>
              <Field label="Location">{application.location || '—'}</Field>
              <Field label="Job Type">{application.jobType || '—'}</Field>
              <Field label="Source">{application.source || '—'}</Field>
              <Field label="Resume Used">{application.resumeUsed}</Field>
              <Field label="Application Date">
                {new Date(application.applicationDate).toLocaleDateString()}
              </Field>
              <Field label="Added by">{creatorName(application.createdBy) ?? '—'}</Field>
              <Field label="Created">{new Date(application.createdAt).toLocaleString()}</Field>
              <Field label="Last Updated">{new Date(application.updatedAt).toLocaleString()}</Field>
              <div className="sm:col-span-2">
                <Field label="Notes">{application.notes || '—'}</Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="Related Interview">
                  {application.relatedInterview ? (
                    <Link
                      to={`/interviews/${application.relatedInterview._id}`}
                      className="inline-flex items-center gap-2 underline underline-offset-2"
                    >
                      {new Date(application.relatedInterview.scheduledAt).toLocaleString(
                        undefined,
                        { dateStyle: 'medium', timeStyle: 'short' },
                      )}
                      <InterviewStatusBadge status={application.relatedInterview.status} />
                    </Link>
                  ) : showScheduleForm ? (
                    'No interview scheduled yet.'
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowScheduleForm(true)}
                      className="text-sm font-medium text-slate-900 underline underline-offset-2"
                    >
                      Schedule Interview
                    </button>
                  )}
                </Field>
              </div>
            </dl>
          </CardShell>

          <CardShell>
            <div className="p-6">
              <h2 className="mb-4 text-sm font-semibold text-slate-900">Activity Timeline</h2>
              <ApplicationTimeline entries={activity} />
            </div>
          </CardShell>

          {showScheduleForm && !application.relatedInterview && id && (
            <div className="lg:col-span-3">
              <ScheduleInterviewPanel
                applicationId={id}
                onScheduled={() => setShowScheduleForm(false)}
                onCancel={() => setShowScheduleForm(false)}
              />
            </div>
          )}
        </div>
      )}

      <ConfirmDialog
        open={confirmArchive}
        title="Archive this application?"
        description={`${application.companyName} — ${application.jobTitle} will be moved out of the active list.`}
        confirmLabel="Archive"
        onConfirm={() => void handleArchive()}
        onCancel={() => setConfirmArchive(false)}
      />
    </div>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</dt>
      <dd className="mt-1 text-slate-700">{children}</dd>
    </div>
  )
}
