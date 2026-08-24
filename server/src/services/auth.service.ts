import { User } from '../models/User.js'
import { ApiError } from '../utils/ApiError.js'
import { signToken } from '../utils/jwt.js'
import { comparePassword } from '../utils/password.js'

export async function login(email: string, password: string) {
  const user = await User.findOne({ email: email.toLowerCase() })

  if (!user || !user.isActive) {
    throw new ApiError('UNAUTHENTICATED', 'Invalid email or password')
  }

  const isValid = await comparePassword(password, user.passwordHash)
  if (!isValid) {
    throw new ApiError('UNAUTHENTICATED', 'Invalid email or password')
  }

  const token = signToken({ sub: user.id, role: user.role })

  return { token, user }
}

export async function getCurrentUser(userId: string) {
  const user = await User.findById(userId)

  if (!user || !user.isActive) {
    throw new ApiError('UNAUTHENTICATED', 'User not found or inactive')
  }

  return user
}
