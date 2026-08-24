import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { APPLICATION_STATUSES } from '../../types/application'
import type { ListApplicationsParams } from '../../services/api/applications.api'

export type ApplicationFiltersValue = Omit<ListApplicationsParams, 'page' | 'limit'>

export function ApplicationFilters({
  value,
  onChange,
}: {
  value: ApplicationFiltersValue
  onChange: (value: ApplicationFiltersValue) => void
}) {
  function set<K extends keyof ApplicationFiltersValue>(key: K, fieldValue: ApplicationFiltersValue[K]) {
    onChange({ ...value, [key]: fieldValue || undefined })
  }

  return (
    <div className="grid grid-cols-2 gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-3 lg:grid-cols-6">
      <Input
        label="Search"
        placeholder="Company or title"
        value={value.search ?? ''}
        onChange={(e) => set('search', e.target.value)}
      />
      <Input
        label="Source"
        value={value.source ?? ''}
        onChange={(e) => set('source', e.target.value)}
      />
      <Input
        label="Resume Used"
        value={value.resumeUsed ?? ''}
        onChange={(e) => set('resumeUsed', e.target.value)}
      />
      <Select
        label="Status"
        value={value.status ?? ''}
        onChange={(e) => set('status', e.target.value)}
      >
        <option value="">All statuses</option>
        {APPLICATION_STATUSES.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </Select>
      <Input
        label="From"
        type="date"
        value={value.startDate ?? ''}
        onChange={(e) => set('startDate', e.target.value)}
      />
      <Input
        label="To"
        type="date"
        value={value.endDate ?? ''}
        onChange={(e) => set('endDate', e.target.value)}
      />
    </div>
  )
}
