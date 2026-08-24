import { CardShell } from '../../components/ui/EmptyState'
import { useToast } from '../../hooks/useToast'
import { getApiErrorMessage } from '../../utils/apiError'
import { InterviewForm } from './InterviewForm'
import type { InterviewFormValues } from './interviewSchema'
import { toInterviewInput } from './interviewSchema'
import { useCreateInterviewMutation } from './queries'

export function ScheduleInterviewPanel({
  applicationId,
  onScheduled,
  onCancel,
}: {
  applicationId: string
  onScheduled: () => void
  onCancel: () => void
}) {
  const { showToast } = useToast()
  const createMutation = useCreateInterviewMutation()

  async function handleSubmit(values: InterviewFormValues) {
    try {
      const result = await createMutation.mutateAsync({
        applicationId,
        ...toInterviewInput(values),
      })
      showToast(
        result.hasExistingActiveInterview
          ? 'Interview scheduled (this application already had one — check for duplicates)'
          : 'Interview scheduled',
      )
      onScheduled()
    } catch (err) {
      showToast(getApiErrorMessage(err, 'Could not schedule interview'), 'error')
    }
  }

  return (
    <CardShell>
      <div className="p-6">
        <h2 className="mb-4 text-sm font-semibold text-slate-900">Schedule Interview</h2>
        <InterviewForm
          mode="create"
          submitLabel="Schedule Interview"
          onSubmit={handleSubmit}
          onCancel={onCancel}
        />
      </div>
    </CardShell>
  )
}
