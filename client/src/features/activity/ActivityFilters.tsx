import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import type { ListActivityParams } from '../../services/api/activity.api'
import { useAllUsersQuery } from './queries'

export type ActivityFiltersValue = Omit<ListActivityParams, 'page' | 'limit'>

const ACTION_OPTIONS = [
  'application_added',
  'status_changed',
  'interview_scheduled',
  'interview_completed',
  'feedback_submitted',
]

const ENTITY_TYPE_OPTIONS = ['Application', 'Interview', 'Feedback', 'User']

export function ActivityFilters({
  value,
  onChange,
  showUserFilter,
}: {
  value: ActivityFiltersValue
  onChange: (value: ActivityFiltersValue) => void
  showUserFilter: boolean
}) {
  const { data: users = [] } = useAllUsersQuery(showUserFilter)

  function set<K extends keyof ActivityFiltersValue>(key: K, fieldValue: ActivityFiltersValue[K]) {
    onChange({ ...value, [key]: fieldValue || undefined })
  }

  return (
    <div className="grid grid-cols-2 gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-3 lg:grid-cols-5">
      {showUserFilter && (
        <Select label="User" value={value.userId ?? ''} onChange={(e) => set('userId', e.target.value)}>
          <option value="">All users</option>
          {users.map((u) => (
            <option key={u._id} value={u._id}>
              {u.name}
            </option>
          ))}
        </Select>
      )}
      <Select label="Action" value={value.action ?? ''} onChange={(e) => set('action', e.target.value)}>
        <option value="">All actions</option>
        {ACTION_OPTIONS.map((action) => (
          <option key={action} value={action}>
            {action.replace(/_/g, ' ')}
          </option>
        ))}
      </Select>
      <Select
        label="Entity"
        value={value.entityType ?? ''}
        onChange={(e) => set('entityType', e.target.value)}
      >
        <option value="">All entities</option>
        {ENTITY_TYPE_OPTIONS.map((type) => (
          <option key={type} value={type}>
            {type}
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
