import api from "@/api"
import type { AxiosError } from 'axios'
import { apiEndpoints } from "@/api/endpoints"
import { setToken, removeToken, getToken } from "@/utils/userStorage"

export interface User {
  id: number
  name: string
  username: string
  email: string
  email_verified_at: string | null
  created_at: string
  updated_at: string
}

export interface AuthResponse {
  message: string
  user: User
  token: string
}

interface ErrorResponse {
  message?: string
  [key: string]: unknown
}

export interface SigninCredentials {
  identity: string
  password: string
}

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

export class AuthService {
  async authenticate(credentials: SigninCredentials): Promise<AuthResponse> {
    try {
      const { data: response } = await api.post<AuthResponse>(
        apiEndpoints.auth.authenticate,
        credentials
      )

      if (!response.token) {
        throw new AuthenticationError('No token returned from server')
      }

      setToken(response.token)
      return response
    } catch (error) {
      this.handleAuthError(error as AxiosError, 'Authentication failed')
    }
  }

  async signout(): Promise<void> {
    try {
      await api.post(apiEndpoints.auth.destroy)
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      removeToken()
    }
  }

  async signoutAll(): Promise<void> {
    try {
      await api.post(apiEndpoints.auth.destroyAll)
    } catch (error) {
      console.error('Logout all error:', error)
    } finally {
      removeToken()
    }
  }

  async getCurrentUser(): Promise<User> {
    const token = getToken()

    if (!token) {
      throw new AuthenticationError('No authentication token found', 401)
    }

    try {
      const { data } = await api.get<User>(apiEndpoints.auth.user)
      return data
    } catch (error) {
      const axiosError = error as AxiosError

      if (axiosError.response?.status === 401) {
        removeToken()
        throw new AuthenticationError('Session expired', 401, axiosError)
      }

      this.handleAuthError(axiosError, 'Failed to fetch user data')
    }
  }

  isAuthenticated(): boolean {
    return !!getToken()
  }

  getToken(): string | null {
    return getToken()
  }

  private handleAuthError(error: AxiosError, defaultMessage: string): never {
    const status = error.response?.status
    const responseData = error.response?.data as ErrorResponse | undefined

    let message = defaultMessage
    if (responseData?.message) {
      message = responseData.message
    } else if (error.message) {
      message = error.message
    }

    throw new AuthenticationError(message, status, error)
  }
}

export const authService = new AuthService()
