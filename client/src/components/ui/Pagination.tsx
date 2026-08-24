import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Pagination as PaginationMeta } from '../../types/pagination'

export function Pagination({
  pagination,
  onPageChange,
}: {
  pagination: PaginationMeta
  onPageChange: (page: number) => void
}) {
  if (pagination.totalPages <= 1) return null

  return (
    <div className="flex items-center justify-between px-1 py-3 text-sm text-slate-500">
      <span>
        Page {pagination.page} of {pagination.totalPages} · {pagination.total} total
      </span>
      <div className="flex gap-2">
        <button
          type="button"
          disabled={pagination.page <= 1}
          onClick={() => onPageChange(pagination.page - 1)}
          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 font-medium transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft className="size-4" />
          Prev
        </button>
        <button
          type="button"
          disabled={pagination.page >= pagination.totalPages}
          onClick={() => onPageChange(pagination.page + 1)}
          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 font-medium transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  )
}
