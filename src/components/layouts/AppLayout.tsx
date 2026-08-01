import { useQuery } from "@tanstack/react-query"
import { Link, Outlet } from "react-router-dom"

import { meQueryOptions } from "@/app/auth/queries/auth.queries"
import { PushSubscribeButton } from "@/app/push/components/PushSubscribeButton"
import { useSaleInboxSocket } from "@/app/push/hooks/use-sale-inbox-socket"
import { Button } from "@/components/ui/button"
import { urlPaths } from "@/constants/urlPaths"
import { useAuthStore } from "@/stores/auth-store"

export function AppLayout() {
  const accessToken = useAuthStore((state) => state.accessToken)
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  useQuery(meQueryOptions(!!accessToken))
  useSaleInboxSocket(accessToken)

  return (
    <div className="flex h-svh flex-col bg-gradient-to-br from-slate-100 via-stone-50 to-teal-50/40">
      <header className="z-20 flex h-12 shrink-0 items-center justify-between border-b border-slate-200/80 bg-white/80 px-4 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Link
            to={urlPaths.saleDashboard}
            className="text-xs font-semibold tracking-[0.18em] text-slate-800"
          >
            BẠC Ý
          </Link>
          <span className="hidden h-4 w-px bg-slate-200 sm:block" />
          <nav className="hidden items-center gap-3 text-xs text-slate-500 sm:flex">
            <Link to={urlPaths.saleDashboard} className="rounded-full px-2 py-1 hover:bg-slate-100 hover:text-slate-800">
              Hàng đợi
            </Link>
            <Link to={urlPaths.home} className="rounded-full px-2 py-1 hover:bg-slate-100 hover:text-slate-800">
              Cửa hàng
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <PushSubscribeButton />
          <div className="hidden text-right sm:block">
            <p className="text-xs font-medium text-slate-800">{user?.fullName}</p>
            <p className="text-[10px] text-slate-400">Sale</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-7 rounded-full border-slate-200 bg-white text-xs text-slate-600 hover:bg-slate-50"
            onClick={logout}
          >
            Đăng xuất
          </Button>
        </div>
      </header>
      <main className="min-h-0 flex-1 overflow-hidden">
        <Outlet />
      </main>
    </div>
  )
}
