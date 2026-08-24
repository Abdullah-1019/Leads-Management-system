import type { InterviewStatus } from '../../types/interview'

const STATUS_STYLES: Record<InterviewStatus, string> = {
  Scheduled: 'bg-indigo-100 text-indigo-700',
  Rescheduled: 'bg-amber-100 text-amber-700',
  Completed: 'bg-emerald-100 text-emerald-700',
  Cancelled: 'bg-gray-100 text-gray-500',
  'No Show': 'bg-red-100 text-red-700',
}

export function InterviewStatusBadge({ status }: { status: InterviewStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  )
}
