import { httpService } from "@/services/httpService"

import type {
  AuthResponse,
  AuthUser,
  LoginPayload,
  RegisterPayload,
} from "../types/auth.types"
import { apiPaths } from "@/constants/apiPaths"

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

export async function fetchMeRequest(): Promise<AuthUser> {
  const { data } = await httpService.get<AuthUser>(`${apiPaths.auth}/me`)
  return data
}
