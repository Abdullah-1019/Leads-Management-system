import { forwardRef, type TextareaHTMLAttributes } from 'react'

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, error, id, className = '', ...rest },
  ref,
) {
  const textareaId = id ?? rest.name

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={textareaId} className="text-sm font-medium text-slate-700">
        {label}
      </label>
      <textarea
        ref={ref}
        id={textareaId}
        rows={3}
        className={`rounded-lg border px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:ring-2 focus:ring-slate-900/10 ${
          error ? 'border-red-400 focus:border-red-400' : 'border-slate-200 focus:border-slate-400'
        } ${className}`}
        {...rest}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  )
})
