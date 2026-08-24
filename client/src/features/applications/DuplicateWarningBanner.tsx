import { AlertTriangle } from 'lucide-react'
import type { Application } from '../../types/application'

export function DuplicateWarningBanner({ matches }: { matches: Application[] }) {
  return (
    <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-amber-800">
      <AlertTriangle className="mt-0.5 size-4 shrink-0" />
      <div>
        <p className="font-medium">This looks like a possible duplicate</p>
        <p className="text-amber-700">
          You already have {matches.length === 1 ? 'an application' : 'applications'} for{' '}
          {matches[0]!.companyName} — {matches[0]!.jobTitle}. You can still save if this is
          intentional.
        </p>
      </div>
    </div>
  )
}
