import type { ApplicationStatus } from '../../types/application'

const STATUS_STYLES: Record<ApplicationStatus, string> = {
  Applied: 'bg-slate-100 text-slate-700',
  'Follow-up': 'bg-amber-100 text-amber-700',
  'Response Received': 'bg-blue-100 text-blue-700',
  Lead: 'bg-violet-100 text-violet-700',
  'Interview Scheduled': 'bg-indigo-100 text-indigo-700',
  'Interview Completed': 'bg-cyan-100 text-cyan-700',
  Offer: 'bg-emerald-100 text-emerald-700',
  Rejected: 'bg-red-100 text-red-700',
  Withdrawn: 'bg-gray-100 text-gray-500',
  'No Response': 'bg-orange-100 text-orange-700',
}

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  )
}
