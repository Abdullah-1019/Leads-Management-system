import { User, type UserRole } from '../models/User.js'
import { ApiError } from '../utils/ApiError.js'

interface AuthUser {
  id: string
  role: UserRole
}

export async function listUsers(user: AuthUser, role?: UserRole) {
  if (user.role === 'ADMIN') {
    return User.find(role ? { role } : {})
  }

  if (role !== 'INTERVIEWER') {
    throw new ApiError('FORBIDDEN', 'You do not have permission to list these users')
  }

  return User.find({ role: 'INTERVIEWER', isActive: true }).select('_id name')
}
