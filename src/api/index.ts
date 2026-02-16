import axios, {
  type AxiosInstance,
  type AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig
} from 'axios'
import { getToken, removeToken } from "@/utils/userStorage"
import router from '@/router'

export interface ApiErrorResponse {
  message?: string
  errors?: Record<string, string[]>
  statusCode?: number
}

const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
} as const

const api: AxiosInstance = axios.create(API_CONFIG)

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = getToken()

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error: AxiosError): Promise<never> => {
    if (import.meta.env.DEV) {
      console.error('Request Error:', error)
    }
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  async (error: AxiosError<ApiErrorResponse>): Promise<never> => {
    if (!error.response) {
      console.error('Network Error:', error.message)
      return Promise.reject({
        message: 'Network error. Please check your connection.',
        originalError: error
      })
    }

    const { status } = error.response

    switch (status) {
      case 401:
        removeToken()
        break

      case 403:
        console.error('Access Forbidden')
        router.push({ name: 'AccessForbidden' })
        break

      case 404:
        console.error('Resource Not Found')
        break

      case 422:
        console.error('Validation Error:', error.response.data)
        break

      case 500:
      case 502:
      case 503:
        console.error('Server Error')
        break

      default:
        console.error('API Error:', error.response.data)
    }

    if (import.meta.env.DEV) {
      console.error('Response Error:', {
        status,
        data: error.response.data,
        config: error.config
      })
    }

    return Promise.reject(error)
  }
)

export default api
