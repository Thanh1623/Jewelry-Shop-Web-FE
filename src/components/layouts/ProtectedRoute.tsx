import { Navigate, Outlet } from "react-router-dom"

import { urlPaths } from "@/constants/urlPaths"
import { useAuthStore, type UserRole } from "@/stores/auth-store"

interface ProtectedRouteProps {
  allowedRoles?: UserRole[]
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const accessToken = useAuthStore((state) => state.accessToken)
  const user = useAuthStore((state) => state.user)

  if (!accessToken) {
    return <Navigate to={urlPaths.login} replace />
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to={urlPaths.home} replace />
  }

  return <Outlet />
}
