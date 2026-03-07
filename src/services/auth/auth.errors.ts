import type { AxiosError } from 'axios'

export class AuthenticationError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public originalError?: AxiosError
  ) {
    super(message)
    this.name = 'AuthenticationError'
  }
}
