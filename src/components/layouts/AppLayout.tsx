import { useQuery } from "@tanstack/react-query"
import { Link, Outlet } from "react-router-dom"

import { meQueryOptions } from "@/app/auth/queries/auth.queries"
import { Button } from "@/components/ui/button"
import { urlPaths } from "@/constants/urlPaths"
import { useAuthStore } from "@/stores/auth-store"

export function AppLayout() {
  const accessToken = useAuthStore((state) => state.accessToken)
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  useQuery(meQueryOptions(!!accessToken))

  return (
    <div className="min-h-svh bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-2.5">
          <Link to={urlPaths.saleDashboard} className="text-sm font-semibold">
            BẠC Ý · Sale
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{user?.fullName}</span>
            <Button variant="outline" size="sm" className="h-7 text-xs" onClick={logout}>
              Đăng xuất
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 py-3">
        <Outlet />
      </main>
    </div>
  )
}
