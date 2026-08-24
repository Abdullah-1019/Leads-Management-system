import { axiosClient } from './axiosClient'
import type { ApiSuccess } from '../../types/api'
import type { User } from '../../types/auth'

export interface LoginPayload {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user: User
}

export async function login(payload: LoginPayload) {
  const res = await axiosClient.post<ApiSuccess<LoginResponse>>('/api/auth/login', payload)
  return res.data.data
}

export async function logout() {
  await axiosClient.post('/api/auth/logout')
}

export async function fetchCurrentUser() {
  const res = await axiosClient.get<ApiSuccess<{ user: User }>>('/api/auth/me')
  return res.data.data.user
}
