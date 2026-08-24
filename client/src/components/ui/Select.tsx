import { forwardRef, type SelectHTMLAttributes } from 'react'

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string
  error?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, error, id, className = '', children, ...rest },
  ref,
) {
  const selectId = id ?? rest.name

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={selectId} className="text-sm font-medium text-slate-700">
        {label}
      </label>
      <select
        ref={ref}
        id={selectId}
        className={`rounded-lg border px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:ring-2 focus:ring-slate-900/10 ${
          error ? 'border-red-400 focus:border-red-400' : 'border-slate-200 focus:border-slate-400'
        } ${className}`}
        {...rest}
      >
        {children}
      </select>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  )
})
