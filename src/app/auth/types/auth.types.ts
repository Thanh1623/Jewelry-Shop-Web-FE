export type UserRole = "CUSTOMER" | "SALE"

export interface AuthUser {
  id: string
  email: string
  fullName: string
  role: UserRole
}

export interface AuthResponse {
  accessToken: string
  user: AuthUser
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  email: string
  password: string
  fullName: string
}
