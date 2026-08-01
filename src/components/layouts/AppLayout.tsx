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
      <header className="border-b border-border/60 bg-card/60 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <Link to={urlPaths.saleDashboard} className="font-heading text-lg font-semibold tracking-tight">
            Bạc Ý Jewelry <span className="text-muted-foreground">— Kênh Sale</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">{user?.fullName}</span>
            <Button variant="outline" size="sm" onClick={logout}>
              Đăng xuất
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl p-6">
        <Outlet />
      </main>
    </div>
  )
}
