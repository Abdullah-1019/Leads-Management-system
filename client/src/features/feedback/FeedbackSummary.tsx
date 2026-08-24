import { Star } from 'lucide-react'
import type { Feedback } from '../../types/feedback'

function Stars({ value }: { value: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((score) => (
        <Star
          key={score}
          className={`size-4 ${score <= value ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
        />
      ))}
    </div>
  )
}

const RATING_ROWS: { key: keyof Feedback; label: string }[] = [
  { key: 'overallRating', label: 'Overall Rating' },
  { key: 'technicalRating', label: 'Technical Performance' },
  { key: 'communicationRating', label: 'Communication' },
  { key: 'knowledgeRating', label: 'Knowledge / Experience' },
  { key: 'leadQualityRating', label: 'Lead Quality' },
]

export function FeedbackSummary({ feedback }: { feedback: Feedback }) {
  return (
    <div className="flex flex-col gap-4 text-sm">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {RATING_ROWS.map((row) => (
          <div key={row.key} className="flex items-center justify-between">
            <span className="text-slate-500">{row.label}</span>
            <Stars value={feedback[row.key] as number} />
          </div>
        ))}
      </div>

      <div>
        <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
          Recommendation
        </span>
        <p className="mt-1 font-medium text-slate-900">{feedback.recommendation}</p>
      </div>

      {feedback.strengths && (
        <div>
          <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Strengths
          </span>
          <p className="mt-1 text-slate-700">{feedback.strengths}</p>
        </div>
      )}

      {feedback.weaknesses && (
        <div>
          <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Weaknesses
          </span>
          <p className="mt-1 text-slate-700">{feedback.weaknesses}</p>
        </div>
      )}

      {feedback.notes && (
        <div>
          <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Feedback Notes
          </span>
          <p className="mt-1 text-slate-700">{feedback.notes}</p>
        </div>
      )}

      <div>
        <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
          Follow-up Required
        </span>
        <p className="mt-1 text-slate-700">{feedback.followUpRequired ? 'Yes' : 'No'}</p>
      </div>
    </div>
  )
}
