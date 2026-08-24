import { LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { NAV_ITEMS } from './navConfig'
import { NotificationBell } from './NotificationBell'

const ROLE_LABEL: Record<string, string> = {
  APPLICANT: 'Applicant',
  INTERVIEWER: 'Interviewer',
  ADMIN: 'Admin',
}

export function Topbar() {
  const { user, logout } = useAuth()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const items = NAV_ITEMS.filter((item) => user && item.roles.includes(user.role))

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="flex items-center justify-between px-4 py-4 sm:px-6">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileNavOpen((open) => !open)}
            aria-label="Toggle navigation"
            className="-ml-1.5 rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 sm:hidden"
          >
            {mobileNavOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
          <span className="text-sm font-semibold text-slate-900">Company CRM</span>
        </div>
        <div className="flex items-center gap-3">
          {user && (
            <span className="hidden text-sm text-slate-500 sm:inline">
              {user.name} <span className="text-slate-300">·</span> {ROLE_LABEL[user.role]}
            </span>
          )}
          <NotificationBell />
          <button
            onClick={() => void logout()}
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 transition hover:text-slate-900"
          >
            <LogOut className="size-4" />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </div>

      {mobileNavOpen && (
        <nav className="flex flex-col gap-1 border-t border-slate-100 px-3 py-3 sm:hidden">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMobileNavOpen(false)}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  )
}
