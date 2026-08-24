import type { ButtonHTMLAttributes } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isLoading?: boolean
}

export function Button({ isLoading, disabled, children, className = '', ...rest }: ButtonProps) {
  return (
    <button
      disabled={disabled ?? isLoading}
      className={`inline-flex w-full items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      {...rest}
    >
      {isLoading ? 'Please wait…' : children}
    </button>
  )
}
