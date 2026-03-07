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

export interface SigninCredentials {
  identity: string
  password: string
}

export interface ErrorResponse {
  message?: string
  [key: string]: unknown
}
