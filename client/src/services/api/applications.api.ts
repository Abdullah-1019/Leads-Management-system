import type { Application, ActivityLogEntry } from '../../types/application'
import type { ApiSuccess } from '../../types/api'
import type { PaginatedResult } from '../../types/pagination'
import { axiosClient } from './axiosClient'

export interface ListApplicationsParams {
  page?: number
  limit?: number
  search?: string
  company?: string
  jobTitle?: string
  source?: string
  resumeUsed?: string
  status?: string
  startDate?: string
  endDate?: string
  createdBy?: string
  includeArchived?: boolean
}

export interface ApplicationInput {
  companyName: string
  jobTitle: string
  jobDescriptionUrl?: string
  location?: string
  jobType?: string
  source?: string
  resumeUsed: string
  applicationDate: string
  status?: string
  notes?: string
}

export async function listApplications(params: ListApplicationsParams) {
  const res = await axiosClient.get<PaginatedResult<Application>>('/api/applications', {
    params,
  })
  return res.data
}

export async function getApplication(id: string) {
  const res = await axiosClient.get<ApiSuccess<Application>>(`/api/applications/${id}`)
  return res.data.data
}

export async function createApplication(payload: ApplicationInput) {
  const res = await axiosClient.post<ApiSuccess<Application & { possibleDuplicate: boolean }>>(
    '/api/applications',
    payload,
  )
  return res.data.data
}

export async function updateApplication(id: string, payload: Partial<ApplicationInput>) {
  const res = await axiosClient.patch<ApiSuccess<Application>>(
    `/api/applications/${id}`,
    payload,
  )
  return res.data.data
}

export async function archiveApplication(id: string) {
  const res = await axiosClient.delete<ApiSuccess<Application>>(`/api/applications/${id}`)
  return res.data.data
}

export async function checkDuplicate(params: {
  companyName: string
  jobTitle: string
  jobDescriptionUrl?: string
}) {
  const res = await axiosClient.get<ApiSuccess<{ possibleDuplicate: boolean; matches: Application[] }>>(
    '/api/applications/check-duplicate',
    { params },
  )
  return res.data.data
}

export async function getApplicationActivity(id: string) {
  const res = await axiosClient.get<ApiSuccess<ActivityLogEntry[]>>(
    `/api/applications/${id}/activity`,
  )
  return res.data.data
}
