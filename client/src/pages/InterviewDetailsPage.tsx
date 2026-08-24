import { useState, type ReactNode } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CardShell, ErrorState, Spinner } from '../components/ui/EmptyState'
import { FeedbackForm } from '../features/feedback/FeedbackForm'
import type { FeedbackFormValues } from '../features/feedback/feedbackSchema'
import { toFeedbackInput } from '../features/feedback/feedbackSchema'
import { FeedbackSummary } from '../features/feedback/FeedbackSummary'
import { useCreateFeedbackMutation, useUpdateFeedbackMutation } from '../features/feedback/queries'
import { InterviewForm } from '../features/interviews/InterviewForm'
import { InterviewStatusBadge } from '../features/interviews/InterviewStatusBadge'
import type { InterviewFormValues } from '../features/interviews/interviewSchema'
import { toInterviewInput } from '../features/interviews/interviewSchema'
import { useInterviewQuery, useUpdateInterviewMutation } from '../features/interviews/queries'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../hooks/useToast'
import { getApiErrorMessage } from '../utils/apiError'

export function InterviewDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const { showToast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [showFeedbackForm, setShowFeedbackForm] = useState(false)

  const { data: interview, isLoading, isError, refetch } = useInterviewQuery(id)
  const updateMutation = useUpdateInterviewMutation()
  const createFeedbackMutation = useCreateFeedbackMutation()
  const updateFeedbackMutation = useUpdateFeedbackMutation()

  const canEdit = user?.role === 'INTERVIEWER' || user?.role === 'ADMIN'
  const canAddFeedback = user?.role === 'INTERVIEWER'
  const canEditFeedback = user?.role === 'INTERVIEWER' || user?.role === 'ADMIN'

  async function handleUpdate(values: InterviewFormValues) {
    if (!id) return
    try {
      await updateMutation.mutateAsync({ id, payload: toInterviewInput(values) })
      setIsEditing(false)
      showToast('Interview updated')
    } catch (err) {
      showToast(getApiErrorMessage(err, 'Could not update interview'), 'error')
    }
  }

  async function handleMarkCompleted() {
    if (!id) return
    try {
      await updateMutation.mutateAsync({ id, payload: { status: 'Completed' } })
      showToast('Interview marked Completed')
    } catch (err) {
      showToast(getApiErrorMessage(err, 'Could not update interview'), 'error')
    }
  }

  async function handleFeedbackSubmit(values: FeedbackFormValues) {
    if (!id || !interview) return
    try {
      if (interview.feedback) {
        await updateFeedbackMutation.mutateAsync({
          feedbackId: interview.feedback._id,
          payload: toFeedbackInput(values),
        })
        showToast('Feedback updated')
      } else {
        await createFeedbackMutation.mutateAsync({
          interviewId: id,
          payload: toFeedbackInput(values),
        })
        showToast('Feedback submitted')
      }
      setShowFeedbackForm(false)
    } catch (err) {
      showToast(getApiErrorMessage(err, 'Could not save feedback'), 'error')
    }
  }

  if (isLoading) {
    return <Spinner />
  }

  if (isError || !interview) {
    return <ErrorState message="Could not load this interview." onRetry={() => void refetch()} />
  }

  const application =
    typeof interview.applicationId === 'string' ? undefined : interview.applicationId
  const interviewer =
    typeof interview.interviewerId === 'string' ? undefined : interview.interviewerId
  const applicant =
    application && typeof application.createdBy !== 'string' ? application.createdBy : undefined

  const scheduledAtLocal = new Date(interview.scheduledAt)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            {application?.companyName ?? 'Interview'} — {application?.jobTitle ?? ''}
          </h1>
          <div className="mt-2">
            <InterviewStatusBadge status={interview.status} />
          </div>
        </div>

        {!isEditing && (
          <div className="flex gap-3">
            {canAddFeedback && interview.status !== 'Completed' && (
              <button
                type="button"
                onClick={() => void handleMarkCompleted()}
                className="rounded-lg bg-slate-900 px-3.5 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                Mark Interview Completed
              </button>
            )}
            {canEdit && (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="rounded-lg border border-slate-200 px-3.5 py-2 text-sm font-medium text-slate-600 transition hover:bg-white"
              >
                Edit
              </button>
            )}
          </div>
        )}
      </div>

      {isEditing ? (
        <CardShell>
          <div className="p-6">
            <InterviewForm
              mode="edit"
              defaultValues={{
                interviewerId: interviewer?._id ?? '',
                date: scheduledAtLocal.toISOString().slice(0, 10),
                time: scheduledAtLocal.toTimeString().slice(0, 5),
                timezone: interview.timezone,
                interviewType: interview.interviewType,
                meetingUrl: interview.meetingUrl ?? '',
                notes: interview.notes ?? '',
                status: interview.status,
              }}
              submitLabel="Save Changes"
              onSubmit={handleUpdate}
              onCancel={() => setIsEditing(false)}
            />
          </div>
        </CardShell>
      ) : (
        <CardShell>
          <dl className="grid grid-cols-1 gap-4 p-6 text-sm sm:grid-cols-2">
            <Field label="Job Description">
              {application?.jobDescriptionUrl ? (
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
            <Field label="Source">{application?.source || '—'}</Field>
            <Field label="Resume Used">{application?.resumeUsed || '—'}</Field>
            <Field label="Interviewer">{interviewer?.name ?? '—'}</Field>
            <Field label="Interview Date & Time">
              {scheduledAtLocal.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
            </Field>
            <Field label="Timezone">{interview.timezone}</Field>
            <Field label="Interview Type">{interview.interviewType}</Field>
            <Field label="Meeting Link">
              {interview.meetingUrl ? (
                <a
                  href={interview.meetingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-900 underline underline-offset-2"
                >
                  Join link
                </a>
              ) : (
                '—'
              )}
            </Field>
            <Field label="Applicant">{applicant?.name ?? '—'}</Field>
            <div className="sm:col-span-2">
              <Field label="Original Application">
                {application ? (
                  <Link
                    to={`/applications/${application._id}`}
                    className="underline underline-offset-2"
                  >
                    View application
                  </Link>
                ) : (
                  '—'
                )}
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Field label="Notes">{interview.notes || '—'}</Field>
            </div>
          </dl>
        </CardShell>
      )}

      {interview.status === 'Completed' && (
        <CardShell>
          <div className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900">Feedback</h2>
              {!showFeedbackForm && interview.feedback && canEditFeedback && (
                <button
                  type="button"
                  onClick={() => setShowFeedbackForm(true)}
                  className="text-sm font-medium text-slate-600 hover:text-slate-900"
                >
                  Edit Feedback
                </button>
              )}
            </div>

            {showFeedbackForm ? (
              <FeedbackForm
                existingFeedback={interview.feedback}
                submitLabel={interview.feedback ? 'Save Feedback' : 'Submit Feedback'}
                onSubmit={handleFeedbackSubmit}
                onCancel={() => setShowFeedbackForm(false)}
              />
            ) : interview.feedback ? (
              <FeedbackSummary feedback={interview.feedback} />
            ) : canAddFeedback ? (
              <div className="flex flex-col items-start gap-3">
                <p className="text-sm text-slate-500">
                  Feedback hasn't been submitted for this interview yet.
                </p>
                <button
                  type="button"
                  onClick={() => setShowFeedbackForm(true)}
                  className="rounded-lg bg-slate-900 px-3.5 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                >
                  Add Feedback
                </button>
              </div>
            ) : (
              <p className="text-sm text-slate-500">Feedback Pending.</p>
            )}
          </div>
        </CardShell>
      )}
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
