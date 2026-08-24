import { useQuery } from '@tanstack/react-query'
import * as dashboardApi from '../../services/api/dashboard.api'

export function useDashboardSummaryQuery() {
  return useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: () => dashboardApi.getDashboardSummary(),
  })
}

export function useAnalyticsQuery(range: 'day' | 'week' | 'month') {
  return useQuery({
    queryKey: ['analytics', range],
    queryFn: () => dashboardApi.getAnalytics(range),
  })
}
