import { create } from "zustand"
import { persist } from "zustand/middleware"

export type UserRole = "CUSTOMER" | "SALE" | "ADMIN"

export interface AuthUser {
  id: string
  email: string
  fullName: string
  phone: string | null
  role: UserRole
}

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  user: AuthUser | null
  setAuth: (accessToken: string, refreshToken: string, user: AuthUser) => void
  setAccessToken: (accessToken: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      setAuth: (accessToken, refreshToken, user) =>
        set({ accessToken, refreshToken, user }),
      setAccessToken: (accessToken) => set({ accessToken }),
      logout: () => set({ accessToken: null, refreshToken: null, user: null }),
    }),
    {
      name: "jewelry-shop-auth",
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
      }),
    }
  )
)

export function getAuthToken(): string | null {
  return useAuthStore.getState().accessToken
}

export function getRefreshToken(): string | null {
  return useAuthStore.getState().refreshToken
}

export function logoutAuthStore(): void {
  useAuthStore.getState().logout()
}
