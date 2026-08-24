import { Outlet } from 'react-router-dom'
import { Sidebar } from '../components/layout/Sidebar'
import { Topbar } from '../components/layout/Topbar'

export function DashboardLayout() {
  return (
    <div className="flex min-h-svh flex-col bg-slate-50">
      <Topbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 px-6 py-8">
          <div className="mx-auto max-w-5xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
