import { Bell } from 'lucide-react'
import { useState } from 'react'
import { useNotifications } from '../../features/notifications/useNotifications'

export function NotificationBell() {
  const [open, setOpen] = useState(false)
  const { notifications } = useNotifications()

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Notifications"
        className="relative rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
      >
        <Bell className="size-5" />
        {notifications.length > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold text-white">
            {notifications.length > 9 ? '9+' : notifications.length}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-40 mt-2 w-80 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
            {notifications.length === 0 ? (
              <p className="px-3 py-4 text-center text-sm text-slate-400">You're all caught up.</p>
            ) : (
              <ul className="flex flex-col gap-0.5">
                {notifications.map((notification, index) => (
                  <li
                    key={index}
                    className="rounded-lg px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    {notification}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  )
}
