import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { Textarea } from '../../components/ui/Textarea'
import { useDebouncedValue } from '../../hooks/useDebouncedValue'
import * as applicationsApi from '../../services/api/applications.api'
import { APPLICATION_SOURCES, APPLICATION_STATUSES, JOB_TYPES } from '../../types/application'
import type { Application } from '../../types/application'
import { applicationFormSchema, type ApplicationFormValues } from './applicationSchema'
import { DuplicateWarningBanner } from './DuplicateWarningBanner'

interface ApplicationFormProps {
  mode: 'create' | 'edit'
  defaultValues?: Partial<ApplicationFormValues>
  onSubmit: (values: ApplicationFormValues) => Promise<void>
  submitLabel: string
  onCancel?: () => void
}

export function ApplicationForm({
  mode,
  defaultValues,
  onSubmit,
  submitLabel,
  onCancel,
}: ApplicationFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues: {
      applicationDate: new Date().toISOString().slice(0, 10),
      ...defaultValues,
    },
  })

  const [duplicateMatches, setDuplicateMatches] = useState<Application[]>([])
  const companyName = useWatch({ control, name: 'companyName' })
  const jobTitle = useWatch({ control, name: 'jobTitle' })
  const jobDescriptionUrl = useWatch({ control, name: 'jobDescriptionUrl' })

  const debouncedCompanyName = useDebouncedValue(companyName, 500)
  const debouncedJobTitle = useDebouncedValue(jobTitle, 500)
  const debouncedJobDescriptionUrl = useDebouncedValue(jobDescriptionUrl, 500)

  useEffect(() => {
    if (mode !== 'create') return

    let cancelled = false
    const hasQuery = Boolean(debouncedCompanyName?.trim() && debouncedJobTitle?.trim())
    const request = hasQuery
      ? applicationsApi.checkDuplicate({
          companyName: debouncedCompanyName,
          jobTitle: debouncedJobTitle,
          jobDescriptionUrl: debouncedJobDescriptionUrl || undefined,
        })
      : Promise.resolve({ possibleDuplicate: false, matches: [] })

    request
      .then((result) => {
        if (!cancelled) setDuplicateMatches(result.matches)
      })
      .catch(() => {
        if (!cancelled) setDuplicateMatches([])
      })

    return () => {
      cancelled = true
    }
  }, [mode, debouncedCompanyName, debouncedJobTitle, debouncedJobDescriptionUrl])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {duplicateMatches.length > 0 && <DuplicateWarningBanner matches={duplicateMatches} />}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Company Name"
          error={errors.companyName?.message}
          {...register('companyName')}
        />
        <Input label="Job Title" error={errors.jobTitle?.message} {...register('jobTitle')} />
      </div>

      <Input
        label="Job Description URL"
        placeholder="https://..."
        error={errors.jobDescriptionUrl?.message}
        {...register('jobDescriptionUrl')}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Location"
          placeholder="Remote - United States"
          error={errors.location?.message}
          {...register('location')}
        />
        <Select label="Job Type" error={errors.jobType?.message} {...register('jobType')}>
          <option value="">Select job type</option>
          {JOB_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </Select>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Source"
          list="source-suggestions"
          placeholder="LinkedIn, Indeed, ..."
          error={errors.source?.message}
          {...register('source')}
        />
        <datalist id="source-suggestions">
          {APPLICATION_SOURCES.map((source) => (
            <option key={source} value={source} />
          ))}
        </datalist>

        <Input
          label="Resume Used"
          placeholder="Pre-Sales Resume"
          error={errors.resumeUsed?.message}
          {...register('resumeUsed')}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Application Date"
          type="date"
          error={errors.applicationDate?.message}
          {...register('applicationDate')}
        />
        {mode === 'edit' && (
          <Select label="Status" error={errors.status?.message} {...register('status')}>
            {APPLICATION_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </Select>
        )}
      </div>

      <Textarea label="Notes" error={errors.notes?.message} {...register('notes')} />

      <div className="flex gap-3">
        <Button type="submit" isLoading={isSubmitting}>
          {submitLabel}
        </Button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg px-4 py-2.5 text-sm font-medium text-slate-500 transition hover:text-slate-900"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
