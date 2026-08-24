import { Star } from 'lucide-react'

export function RatingInput({
  label,
  value,
  onChange,
  error,
}: {
  label: string
  value: number
  onChange: (value: number) => void
  error?: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((score) => (
          <button
            key={score}
            type="button"
            onClick={() => onChange(score)}
            aria-label={`${label}: ${score}`}
            className="p-0.5"
          >
            <Star
              className={`size-6 ${
                score <= value ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
              }`}
            />
          </button>
        ))}
      </div>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  )
}
