import { History } from 'lucide-react'
import type { ActivityLogEntry } from '../../types/application'

function actorName(userId: ActivityLogEntry['userId']) {
  return typeof userId === 'string' ? 'Someone' : userId.name
}

export function ActivityFeed({ entries }: { entries: ActivityLogEntry[] }) {
  if (entries.length === 0) {
    return <p className="text-sm text-slate-400">No activity yet.</p>
  }

  return (
    <ol className="flex flex-col gap-4">
      {entries.map((entry) => (
        <li key={entry._id} className="flex gap-3">
          <History className="mt-0.5 size-4 shrink-0 text-slate-300" />
          <div>
            <p className="text-sm text-slate-700">{entry.description}</p>
            <p className="text-xs text-slate-400">
              {actorName(entry.userId)} · {entry.entityType} ·{' '}
              {new Date(entry.createdAt).toLocaleString()}
            </p>
          </div>
        </li>
      ))}
    </ol>
  )
}
