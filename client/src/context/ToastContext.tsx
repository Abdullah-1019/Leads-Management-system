import { CheckCircle2, XCircle } from 'lucide-react'
import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { ToastContext, type ToastVariant } from './toastContextInstance'

interface Toast {
  id: number
  message: string
  variant: ToastVariant
}

let nextId = 1

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((message: string, variant: ToastVariant = 'success') => {
    const id = nextId++
    setToasts((current) => [...current, { id, message, variant }])
    setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id))
    }, 3500)
  }, [])

  const value = useMemo(() => ({ showToast }), [showToast])

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex flex-col items-center gap-2 px-4">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium shadow-lg ${
              toast.variant === 'success'
                ? 'bg-slate-900 text-white'
                : 'bg-red-600 text-white'
            }`}
          >
            {toast.variant === 'success' ? (
              <CheckCircle2 className="size-4" />
            ) : (
              <XCircle className="size-4" />
            )}
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
