import { httpService } from "@/services/httpService"
import { apiPaths } from "@/constants/apiPaths"

import type {
  AuthResponse,
  AuthUser,
  LoginPayload,
  RegisterPayload,
} from "../types/auth.types"

export async function loginRequest(
  payload: LoginPayload
): Promise<AuthResponse> {
  const { data } = await httpService.post<AuthResponse>(
    `${apiPaths.auth}/login`,
    payload
  )
  return data
}

export async function registerRequest(
  payload: RegisterPayload
): Promise<AuthResponse> {
  const { data } = await httpService.post<AuthResponse>(
    `${apiPaths.auth}/register`,
    payload
  )
  return data
}

export async function refreshRequest(
  refreshToken: string
): Promise<AuthResponse> {
  const { data } = await httpService.post<AuthResponse>(
    `${apiPaths.auth}/refresh`,
    { refreshToken }
  )
  return data
}

export async function logoutRequest(refreshToken?: string | null): Promise<void> {
  await httpService.post(`${apiPaths.auth}/logout`, { refreshToken: refreshToken ?? undefined })
}

export async function fetchMeRequest(): Promise<AuthUser> {
  const { data } = await httpService.get<AuthUser>(`${apiPaths.auth}/me`)
  return data
}
