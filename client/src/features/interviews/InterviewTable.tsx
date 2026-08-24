import { Link } from 'react-router-dom'
import type { Interview } from '../../types/interview'
import { InterviewStatusBadge } from './InterviewStatusBadge'

function applicationSnapshot(applicationId: Interview['applicationId']) {
  return typeof applicationId === 'string' ? undefined : applicationId
}

function interviewerName(interviewerId: Interview['interviewerId']) {
  return typeof interviewerId === 'string' ? undefined : interviewerId.name
}

export function InterviewTable({ interviews }: { interviews: Interview[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="w-full min-w-180 text-left text-sm">
        <thead className="border-b border-slate-200 text-xs font-medium uppercase tracking-wide text-slate-400">
          <tr>
            <th className="px-4 py-3">Company</th>
            <th className="px-4 py-3">Job Title</th>
            <th className="px-4 py-3">Interviewer</th>
            <th className="px-4 py-3">Date & Time</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Feedback</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {interviews.map((interview) => {
            const application = applicationSnapshot(interview.applicationId)
            return (
              <tr key={interview._id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-900">
                  {application?.companyName ?? '—'}
                </td>
                <td className="px-4 py-3 text-slate-600">{application?.jobTitle ?? '—'}</td>
                <td className="px-4 py-3 text-slate-600">
                  {interviewerName(interview.interviewerId) ?? '—'}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {new Date(interview.scheduledAt).toLocaleString(undefined, {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </td>
                <td className="px-4 py-3">
                  <InterviewStatusBadge status={interview.status} />
                </td>
                <td className="px-4 py-3 text-slate-500">
                  {interview.feedbackStatus === 'submitted'
                    ? 'Submitted'
                    : interview.feedbackStatus === 'pending'
                      ? 'Pending'
                      : '—'}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    to={`/interviews/${interview._id}`}
                    className="text-sm font-medium text-slate-600 hover:text-slate-900"
                  >
                    View
                  </Link>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
