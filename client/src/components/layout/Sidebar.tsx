import { NavLink } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { NAV_ITEMS } from './navConfig'

export function Sidebar() {
  const { user } = useAuth()
  const items = NAV_ITEMS.filter((item) => user && item.roles.includes(user.role))

  return (
    <aside className="hidden w-56 shrink-0 border-r border-slate-200 bg-white px-3 py-6 sm:block">
      <nav className="flex flex-col gap-1">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
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
    </aside>
  )
}
