import type { AxiosError } from 'axios'
import api from '@/api'
import { apiEndpoints } from '@/api/endpoints'
import { setToken, removeToken, getToken } from '@/utils/userStorage'
import { AuthenticationError } from './auth.errors'
import { handleAuthError } from './auth.helpers'
import type { AuthResponse, SigninCredentials, User } from './auth.types'

export const authService = {
  async authenticate(credentials: SigninCredentials): Promise<AuthResponse> {
    try {
      const { data } = await api.post<AuthResponse>(apiEndpoints.auth.authenticate, credentials)
      if (!data.token) throw new AuthenticationError('No token returned from server')
      setToken(data.token)
      return data
    } catch (error) {
      handleAuthError(error as AxiosError, 'Authentication failed')
    }
  },

  async signout(all = false): Promise<void> {
    const endpoint = all ? apiEndpoints.auth.destroyAll : apiEndpoints.auth.destroy
    try {
      await api.post(endpoint)
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      removeToken()
    }
  },

  async getCurrentUser(): Promise<User> {
    const token = getToken()
    if (!token) throw new AuthenticationError('No authentication token found', 401)

    try {
      const { data } = await api.get<User>(apiEndpoints.auth.user)
      return data
    } catch (error) {
      const axiosError = error as AxiosError
      if (axiosError.response?.status === 401) {
        removeToken()
        throw new AuthenticationError('Session expired', 401, axiosError)
      }
      handleAuthError(axiosError, 'Failed to fetch user data')
    }
  },

  isAuthenticated: (): boolean => !!getToken(),
  getToken: (): string | null => getToken(),
}
