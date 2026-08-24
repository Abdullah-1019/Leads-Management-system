import { isAxiosError } from 'axios'
import type { ApiErrorBody } from '../types/api'

export function getApiErrorMessage(err: unknown, fallback = 'Something went wrong') {
  if (isAxiosError<ApiErrorBody>(err)) {
    return err.response?.data?.error?.message ?? fallback
  }
  return fallback
}
