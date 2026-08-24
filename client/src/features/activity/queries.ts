import { keepPreviousData, useQuery } from '@tanstack/react-query'
import * as activityApi from '../../services/api/activity.api'
import type { ListActivityParams } from '../../services/api/activity.api'
import * as usersApi from '../../services/api/users.api'

export function useActivityQuery(params: ListActivityParams) {
  return useQuery({
    queryKey: ['activity', params],
    queryFn: () => activityApi.listActivity(params),
    placeholderData: keepPreviousData,
  })
}

export function useAllUsersQuery(enabled: boolean) {
  return useQuery({
    queryKey: ['users', 'all'],
    queryFn: () => usersApi.listAllUsers(),
    enabled,
  })
}
