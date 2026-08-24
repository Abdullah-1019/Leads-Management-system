import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as interviewsApi from '../../services/api/interviews.api'
import type { InterviewInput, ListInterviewsParams } from '../../services/api/interviews.api'
import * as usersApi from '../../services/api/users.api'

const INTERVIEWS_KEY = 'interviews'

export function useInterviewsQuery(params: ListInterviewsParams) {
  return useQuery({
    queryKey: [INTERVIEWS_KEY, params],
    queryFn: () => interviewsApi.listInterviews(params),
    placeholderData: keepPreviousData,
  })
}

export function useInterviewQuery(id: string | undefined) {
  return useQuery({
    queryKey: [INTERVIEWS_KEY, id],
    queryFn: () => interviewsApi.getInterview(id!),
    enabled: Boolean(id),
  })
}

export function useInterviewersQuery() {
  return useQuery({
    queryKey: ['interviewers'],
    queryFn: () => usersApi.listInterviewers(),
  })
}

export function useCreateInterviewMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: InterviewInput) => interviewsApi.createInterview(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [INTERVIEWS_KEY] })
      void queryClient.invalidateQueries({ queryKey: ['applications'] })
    },
  })
}

export function useUpdateInterviewMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<InterviewInput> }) =>
      interviewsApi.updateInterview(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [INTERVIEWS_KEY] })
    },
  })
}
