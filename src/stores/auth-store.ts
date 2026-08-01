import { create } from "zustand"
import { persist } from "zustand/middleware"

export type UserRole = "CUSTOMER" | "SALE"

export interface AuthUser {
  id: string
  email: string
  fullName: string
  role: UserRole
}

interface AuthState {
  accessToken: string | null
  user: AuthUser | null
  setAuth: (accessToken: string, user: AuthUser) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  /**
   * persist là middleware để lưu trữ state vào localStorage
   * @param name là tên của store
   * @param partialize là hàm để lọc các field cần lưu trữ
   * @returns AuthState
   */

  persist(
    (set) => ({
      accessToken: null,
      user: null,
      setAuth: (accessToken, user) => set({ accessToken, user }),
      logout: () => set({ accessToken: null, user: null }),
    }),
    {
      name: "jewelry-shop-auth",
      partialize: (state) => ({
        accessToken: state.accessToken,
        user: state.user,
      }),
    }
  )
)

export function getAuthToken(): string | null {
  return useAuthStore.getState().accessToken
}

export function logoutAuthStore(): void {
  useAuthStore.getState().logout()
}
