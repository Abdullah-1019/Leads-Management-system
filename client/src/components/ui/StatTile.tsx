import type { ReactNode } from 'react'

function formatValue(value: number | string) {
  if (typeof value === 'string') return value
  return value.toLocaleString()
}

export function StatTile({
  label,
  value,
  suffix,
}: {
  label: string
  value: number | string
  suffix?: string
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1.5 text-2xl font-semibold text-slate-900">
        {formatValue(value)}
        {suffix && <span className="ml-1 text-base font-medium text-slate-400">{suffix}</span>}
      </p>
    </div>
  )
}

export function StatTileGrid({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">{children}</div>
}
