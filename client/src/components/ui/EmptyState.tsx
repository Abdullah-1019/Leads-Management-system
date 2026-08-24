import { AlertTriangle } from 'lucide-react'
import type { ReactNode } from 'react'

export function ErrorState({
  message = 'Something went wrong. Please try again.',
  onRetry,
}: {
  message?: string
  onRetry?: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-red-200 bg-red-50 py-16 text-center">
      <AlertTriangle className="size-5 text-red-400" />
      <p className="text-sm font-medium text-red-700">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-1 text-sm font-medium text-red-700 underline underline-offset-2"
        >
          Try again
        </button>
      )}
    </div>
  )
}

export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-slate-200 bg-white py-16 text-center">
      <p className="text-sm font-medium text-slate-700">{title}</p>
      {description && <p className="text-sm text-slate-400">{description}</p>}
    </div>
  )
}

export function Spinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="size-6 animate-spin rounded-full border-2 border-slate-200 border-t-slate-500" />
    </div>
  )
}

export function CardShell({ children }: { children: ReactNode }) {
  return <div className="rounded-xl border border-slate-200 bg-white">{children}</div>
}
