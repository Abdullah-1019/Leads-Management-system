import { Archive } from 'lucide-react'
import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import type { Application } from '../../types/application'
import { StatusBadge } from './StatusBadge'

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function creatorName(createdBy: Application['createdBy']) {
  return typeof createdBy === 'string' ? undefined : createdBy.name
}

function withGroupHeaders(applications: Application[], groupByDate: boolean) {
  let lastKey: string | null = null

  return applications.map((application) => {
    const groupKey = formatDate(application.applicationDate)
    const showGroupHeader = groupByDate && groupKey !== lastKey
    lastKey = groupKey
    return { application, groupKey, showGroupHeader }
  })
}

interface ApplicationTableProps {
  applications: Application[]
  groupByDate?: boolean
  showCreatedBy?: boolean
  onArchive: (application: Application) => void
}

export function ApplicationTable({
  applications,
  groupByDate = false,
  showCreatedBy = false,
  onArchive,
}: ApplicationTableProps) {
  const columnCount = 6 + (showCreatedBy ? 1 : 0)
  const rows = withGroupHeaders(applications, groupByDate)

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="w-full min-w-180 text-left text-sm">
        <thead className="border-b border-slate-200 text-xs font-medium uppercase tracking-wide text-slate-400">
          <tr>
            <th className="px-4 py-3">Company</th>
            <th className="px-4 py-3">Job Title</th>
            <th className="px-4 py-3">Source</th>
            <th className="px-4 py-3">Resume</th>
            <th className="px-4 py-3">Status</th>
            {showCreatedBy && <th className="px-4 py-3">Added by</th>}
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map(({ application, groupKey, showGroupHeader }) => {
            return (
              <Fragment key={application._id}>
                {showGroupHeader && (
                  <tr key={`${groupKey}-header`} className="bg-slate-50">
                    <td colSpan={columnCount} className="px-4 py-2 text-xs font-medium text-slate-500">
                      {groupKey}
                    </td>
                  </tr>
                )}
                <tr className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {application.companyName}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{application.jobTitle}</td>
                  <td className="px-4 py-3 text-slate-600">{application.source || '—'}</td>
                  <td className="px-4 py-3 text-slate-600">{application.resumeUsed}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={application.status} />
                  </td>
                  {showCreatedBy && (
                    <td className="px-4 py-3 text-slate-600">
                      {creatorName(application.createdBy) ?? '—'}
                    </td>
                  )}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        to={`/applications/${application._id}`}
                        className="text-sm font-medium text-slate-600 hover:text-slate-900"
                      >
                        View
                      </Link>
                      <Link
                        to={`/applications/${application._id}`}
                        state={{ edit: true }}
                        className="text-sm font-medium text-slate-600 hover:text-slate-900"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => onArchive(application)}
                        className="inline-flex items-center gap-1 text-sm font-medium text-slate-400 hover:text-red-600"
                      >
                        <Archive className="size-3.5" />
                        Archive
                      </button>
                    </div>
                  </td>
                </tr>
              </Fragment>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
