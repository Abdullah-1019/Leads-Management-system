import type { ApiSuccess } from '../../types/api'
import { axiosClient } from './axiosClient'

export interface UserOption {
  _id: string
  name: string
}

export async function listInterviewers() {
  const res = await axiosClient.get<ApiSuccess<UserOption[]>>('/api/users', {
    params: { role: 'INTERVIEWER' },
  })
  return res.data.data
}

export async function listAllUsers() {
  const res = await axiosClient.get<ApiSuccess<UserOption[]>>('/api/users')
  return res.data.data
}
