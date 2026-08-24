import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as applicationsApi from '../../services/api/applications.api'
import type { ListApplicationsParams, ApplicationInput } from '../../services/api/applications.api'

const APPLICATIONS_KEY = 'applications'

export function useApplicationsQuery(params: ListApplicationsParams) {
  return useQuery({
    queryKey: [APPLICATIONS_KEY, params],
    queryFn: () => applicationsApi.listApplications(params),
    placeholderData: keepPreviousData,
  })
}

export function useApplicationQuery(id: string | undefined) {
  return useQuery({
    queryKey: [APPLICATIONS_KEY, id],
    queryFn: () => applicationsApi.getApplication(id!),
    enabled: Boolean(id),
  })
}

export function useApplicationActivityQuery(id: string | undefined) {
  return useQuery({
    queryKey: [APPLICATIONS_KEY, id, 'activity'],
    queryFn: () => applicationsApi.getApplicationActivity(id!),
    enabled: Boolean(id),
  })
}

export function useCreateApplicationMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: ApplicationInput) => applicationsApi.createApplication(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [APPLICATIONS_KEY] })
    },
  })
}

export function useUpdateApplicationMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<ApplicationInput> }) =>
      applicationsApi.updateApplication(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [APPLICATIONS_KEY] })
    },
  })
}

export function useArchiveApplicationMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => applicationsApi.archiveApplication(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [APPLICATIONS_KEY] })
    },
  })
}
