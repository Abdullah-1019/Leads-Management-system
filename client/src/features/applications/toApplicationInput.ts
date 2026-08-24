import type { ApplicationInput } from '../../services/api/applications.api'
import type { ApplicationFormValues } from './applicationSchema'

export function toApplicationInput(values: ApplicationFormValues): ApplicationInput {
  return {
    companyName: values.companyName,
    jobTitle: values.jobTitle,
    jobDescriptionUrl: values.jobDescriptionUrl || undefined,
    location: values.location || undefined,
    jobType: values.jobType || undefined,
    source: values.source || undefined,
    resumeUsed: values.resumeUsed,
    applicationDate: values.applicationDate,
    status: values.status || undefined,
    notes: values.notes || undefined,
  }
}
