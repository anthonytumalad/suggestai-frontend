import type { AxiosError } from 'axios'
import { AuthenticationError } from './auth.errors'
import type { ErrorResponse } from './auth.types'

export function handleAuthError(error: AxiosError, defaultMessage: string): never {
  const status = error.response?.status
  const data = error.response?.data as ErrorResponse | undefined
  const message = data?.message ?? error.message ?? defaultMessage

  throw new AuthenticationError(message, status, error)
}
