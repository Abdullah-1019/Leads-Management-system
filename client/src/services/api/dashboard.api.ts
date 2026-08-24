import type { ApiSuccess } from '../../types/api'
import type { AnalyticsResponse, DashboardSummary } from '../../types/dashboard'
import { axiosClient } from './axiosClient'

export async function getDashboardSummary() {
  const res = await axiosClient.get<ApiSuccess<DashboardSummary>>('/api/dashboard/summary')
  return res.data.data
}

export async function getAnalytics(range: 'day' | 'week' | 'month') {
  const res = await axiosClient.get<ApiSuccess<AnalyticsResponse>>('/api/dashboard/analytics', {
    params: { range },
  })
  return res.data.data
}
