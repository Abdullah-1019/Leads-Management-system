import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { INTERVIEW_STATUSES } from '../../types/interview'
import type { ListInterviewsParams } from '../../services/api/interviews.api'
import { useInterviewersQuery } from './queries'

export type InterviewFiltersValue = Omit<ListInterviewsParams, 'page' | 'limit' | 'tab'>

export function InterviewFilters({
  value,
  onChange,
  showInterviewerFilter,
}: {
  value: InterviewFiltersValue
  onChange: (value: InterviewFiltersValue) => void
  showInterviewerFilter: boolean
}) {
  const { data: interviewers = [] } = useInterviewersQuery()

  function set<K extends keyof InterviewFiltersValue>(key: K, fieldValue: InterviewFiltersValue[K]) {
    onChange({ ...value, [key]: fieldValue || undefined })
  }

  return (
    <div className="grid grid-cols-2 gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-3 lg:grid-cols-5">
      <Input
        label="Company"
        value={value.company ?? ''}
        onChange={(e) => set('company', e.target.value)}
      />
      <Input
        label="Job Title"
        value={value.jobTitle ?? ''}
        onChange={(e) => set('jobTitle', e.target.value)}
      />
      {showInterviewerFilter && (
        <Select
          label="Interviewer"
          value={value.interviewerId ?? ''}
          onChange={(e) => set('interviewerId', e.target.value)}
        >
          <option value="">All interviewers</option>
          {interviewers.map((interviewer) => (
            <option key={interviewer._id} value={interviewer._id}>
              {interviewer.name}
            </option>
          ))}
        </Select>
      )}
      <Select
        label="Status"
        value={value.status ?? ''}
        onChange={(e) => set('status', e.target.value)}
      >
        <option value="">All statuses</option>
        {INTERVIEW_STATUSES.map((status) => (
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
