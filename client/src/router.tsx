import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ProtectedRoute } from './components/ProtectedRoute'
import { RoleRoute } from './components/RoleRoute'
import { DashboardLayout } from './layouts/DashboardLayout'
import { ActivityPage } from './pages/ActivityPage'
import { AnalyticsPage } from './pages/AnalyticsPage'
import { ApplicationDetailsPage } from './pages/ApplicationDetailsPage'
import { ApplicationsPage } from './pages/ApplicationsPage'
import { ApplyingJobsPage } from './pages/ApplyingJobsPage'
import { CalendarPage } from './pages/CalendarPage'
import { DashboardPage } from './pages/DashboardPage'
import { InterviewDetailsPage } from './pages/InterviewDetailsPage'
import { LeadsInterviewsPage } from './pages/LeadsInterviewsPage'
import { LoginPage } from './pages/LoginPage'

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: '/dashboard', element: <DashboardPage /> },
          { path: '/calendar', element: <CalendarPage /> },
          {
            element: <RoleRoute roles={['APPLICANT']} />,
            children: [{ path: '/applying', element: <ApplyingJobsPage /> }],
          },
          {
            element: <RoleRoute roles={['APPLICANT', 'ADMIN']} />,
            children: [
              { path: '/applications', element: <ApplicationsPage /> },
              { path: '/applications/:id', element: <ApplicationDetailsPage /> },
              {
                path: '/leads',
                element: (
                  <LeadsInterviewsPage
                    title="Leads & Interviews"
                    description="Interviews scheduled from your applications."
                    showSwitcher
                  />
                ),
              },
            ],
          },
          {
            element: <RoleRoute roles={['INTERVIEWER']} />,
            children: [
              {
                path: '/interviews/mine',
                element: <LeadsInterviewsPage title="My Interviews" lockedTab="all" />,
              },
              {
                path: '/interviews/upcoming',
                element: <LeadsInterviewsPage title="Upcoming Interviews" lockedTab="upcoming" />,
              },
              {
                path: '/interviews/past',
                element: <LeadsInterviewsPage title="Past Interviews" lockedTab="past" />,
              },
              {
                path: '/feedback/pending',
                element: (
                  <LeadsInterviewsPage title="Pending Feedback" lockedTab="pending-feedback" />
                ),
              },
            ],
          },
          {
            element: <RoleRoute roles={['APPLICANT', 'INTERVIEWER', 'ADMIN']} />,
            children: [{ path: '/interviews/:id', element: <InterviewDetailsPage /> }],
          },
          {
            element: <RoleRoute roles={['APPLICANT', 'INTERVIEWER']} />,
            children: [{ path: '/activity', element: <ActivityPage title="Activity" /> }],
          },
          {
            element: <RoleRoute roles={['ADMIN']} />,
            children: [
              { path: '/analytics', element: <AnalyticsPage /> },
              {
                path: '/team-activity',
                element: <ActivityPage title="Team Activity" showUserFilter />,
              },
            ],
          },
        ],
      },
    ],
  },
  { path: '/', element: <Navigate to="/dashboard" replace /> },
  { path: '*', element: <Navigate to="/dashboard" replace /> },
])
