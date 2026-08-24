import type { UserRole } from '../../types/auth'

export interface NavItem {
  label: string
  to: string
  roles: UserRole[]
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', to: '/dashboard', roles: ['APPLICANT', 'INTERVIEWER', 'ADMIN'] },
  { label: 'Applying Jobs', to: '/applying', roles: ['APPLICANT'] },
  { label: 'Jobs Applied', to: '/applications', roles: ['APPLICANT', 'ADMIN'] },
  { label: 'Leads & Interviews', to: '/leads', roles: ['APPLICANT', 'ADMIN'] },
  { label: 'My Interviews', to: '/interviews/mine', roles: ['INTERVIEWER'] },
  { label: 'Upcoming Interviews', to: '/interviews/upcoming', roles: ['INTERVIEWER'] },
  { label: 'Past Interviews', to: '/interviews/past', roles: ['INTERVIEWER'] },
  { label: 'Pending Feedback', to: '/feedback/pending', roles: ['INTERVIEWER'] },
  { label: 'Calendar', to: '/calendar', roles: ['APPLICANT', 'INTERVIEWER', 'ADMIN'] },
  { label: 'Analytics', to: '/analytics', roles: ['ADMIN'] },
  { label: 'Activity', to: '/activity', roles: ['APPLICANT', 'INTERVIEWER'] },
  { label: 'Team Activity', to: '/team-activity', roles: ['ADMIN'] },
]
