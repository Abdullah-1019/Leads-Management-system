import type { ActivityLogEntry } from '../../types/application'
import type { PaginatedResult } from '../../types/pagination'
import { axiosClient } from './axiosClient'

export interface ListActivityParams {
  page?: number
  limit?: number
  userId?: string
  action?: string
  entityType?: string
  startDate?: string
  endDate?: string
}

export async function listActivity(params: ListActivityParams) {
  const res = await axiosClient.get<PaginatedResult<ActivityLogEntry>>('/api/activity', {
    params,
  })
  return res.data
}
