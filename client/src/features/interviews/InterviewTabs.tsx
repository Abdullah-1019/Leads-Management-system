const TABS = [
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'today', label: 'Today' },
  { key: 'past', label: 'Past' },
  { key: 'pending-feedback', label: 'Pending Feedback' },
] as const

export type InterviewTab = (typeof TABS)[number]['key']

export function InterviewTabs({
  active,
  onChange,
}: {
  active: InterviewTab
  onChange: (tab: InterviewTab) => void
}) {
  return (
    <div className="flex gap-1 rounded-lg border border-slate-200 bg-white p-1">
      {TABS.map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => onChange(tab.key)}
          className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
            active === tab.key
              ? 'bg-slate-900 text-white'
              : 'text-slate-500 hover:bg-slate-100'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
