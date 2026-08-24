export const USER_ROLES = ['APPLICANT', 'INTERVIEWER', 'ADMIN'] as const

export type UserRole = (typeof USER_ROLES)[number]

export interface User {
  _id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}
