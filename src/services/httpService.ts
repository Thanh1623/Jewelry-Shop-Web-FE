import axios from "axios"

import { urlPaths } from "@/constants/urlPaths"
import {
  getAuthToken,
  getRefreshToken,
  logoutAuthStore,
  useAuthStore,
} from "@/stores/auth-store"

const baseURL = import.meta.env.VITE_API_URL

export const httpService = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
})

httpService.interceptors.request.use((config) => {
  const token = getAuthToken()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

function isPublicPath(pathname: string): boolean {
  return (
    pathname === urlPaths.home ||
    pathname === urlPaths.login ||
    pathname === urlPaths.register ||
    pathname.startsWith("/chat/")
  )
}

function isAuthEndpoint(url?: string): boolean {
  if (!url) return false
  return (
    url.includes("/auth/login") ||
    url.includes("/auth/register") ||
    url.includes("/auth/refresh") ||
    url.includes("/auth/logout")
  )
}

let refreshPromise: Promise<string | null> | null = null

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken()
  if (!refreshToken) {
    return null
  }

  try {
    // raw axios — avoid interceptor recursion / circular import
    const { data } = await axios.post<{
      accessToken: string
      refreshToken: string
      user: {
        id: string
        email: string
        fullName: string
        phone: string | null
        role: "CUSTOMER" | "SALE" | "ADMIN"
      }
    }>(`${baseURL}/auth/refresh`, { refreshToken })
    useAuthStore.getState().setAuth(data.accessToken, data.refreshToken, data.user)
    return data.accessToken
  } catch {
    logoutAuthStore()
    return null
  }
}

httpService.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config as
      | (typeof error.config & { _retry?: boolean })
      | undefined

    if (
      error.response?.status === 401 &&
      original &&
      !original._retry &&
      !isAuthEndpoint(original.url)
    ) {
      original._retry = true

      if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
          refreshPromise = null
        })
      }

      const newToken = await refreshPromise
      if (newToken) {
        original.headers = original.headers ?? {}
        original.headers.Authorization = `Bearer ${newToken}`
        return httpService(original)
      }

      if (!isPublicPath(window.location.pathname)) {
        window.location.assign(urlPaths.login)
      }
      return Promise.reject(error)
    }

    if (error.response?.status === 401) {
      const hadToken = Boolean(getAuthToken() || getRefreshToken())
      logoutAuthStore()

      if (hadToken && !isPublicPath(window.location.pathname)) {
        window.location.assign(urlPaths.login)
      }
    }

    return Promise.reject(error)
  }
)
