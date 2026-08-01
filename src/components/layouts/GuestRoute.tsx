import { Navigate, Outlet } from "react-router-dom"

import { urlPaths } from "@/constants/urlPaths"
import { useAuthStore } from "@/stores/auth-store"

export function GuestRoute() {
  const accessToken = useAuthStore((state) => state.accessToken)
  const user = useAuthStore((state) => state.user)

  if (accessToken) {
    const redirectTo =
      user?.role === "SALE"
        ? urlPaths.saleDashboard
        : user?.role === "ADMIN"
          ? urlPaths.adminProducts
          : urlPaths.home
    return <Navigate to={redirectTo} replace />
  }

  return <Outlet />
}
