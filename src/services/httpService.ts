import axios from "axios"

import { urlPaths } from "@/constants/urlPaths"
import { getAuthToken, logoutAuthStore } from "@/stores/auth-store"

export const httpService = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
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

httpService.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const hadToken = Boolean(getAuthToken())
      logoutAuthStore()

      // Guest shop/chat must not bounce to login on accidental 401
      if (hadToken && !isPublicPath(window.location.pathname)) {
        window.location.assign(urlPaths.login)
      }
    }

    return Promise.reject(error)
  },
)
