import { Link, Outlet, useLocation } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { urlPaths } from "@/constants/urlPaths"
import { useAuthStore } from "@/stores/auth-store"

export function ShopLayout() {
  const { pathname } = useLocation()
  const isHome = pathname === urlPaths.home
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  return (
    <div className="min-h-svh">
      <header
        className={cn(
          "z-40 w-full transition-colors duration-300",
          isHome
            ? "absolute inset-x-0 top-0 border-b border-white/10 bg-gradient-to-b from-black/50 to-transparent text-white"
            : "sticky top-0 border-b border-border/80 bg-card/95 backdrop-blur-md"
        )}
      >
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-5 py-4 sm:px-6">
          <Link
            to={urlPaths.home}
            className={cn(
              "text-sm font-medium tracking-[0.28em]",
              isHome ? "text-white" : "text-foreground"
            )}
          >
            BẠC Ý
          </Link>
          <nav className="flex items-center gap-4 text-xs tracking-wide sm:gap-5">
            {isHome && (
              <a href="#bo-suu-tap" className="hidden text-white/80 transition hover:text-white sm:inline">
                Bộ sưu tập
              </a>
            )}
            {user?.role === "SALE" && (
              <Link
                to={urlPaths.saleDashboard}
                className={cn(
                  "transition hover:opacity-80",
                  isHome ? "text-white/80" : "text-muted-foreground"
                )}
              >
                Sale
              </Link>
            )}
            {user ? (
              <>
                <span
                  className={cn(
                    "hidden max-w-32 truncate sm:inline",
                    isHome ? "text-white/70" : "text-muted-foreground"
                  )}
                >
                  {user.fullName}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "h-8 rounded-none border px-3 text-xs tracking-wide",
                    isHome &&
                      "border-white/50 bg-transparent text-white hover:bg-white/10 hover:text-white"
                  )}
                  onClick={logout}
                >
                  Đăng xuất
                </Button>
              </>
            ) : (
              <>
                <Link
                  to={urlPaths.login}
                  className={cn(
                    "transition hover:opacity-80",
                    isHome ? "text-white/85" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Đăng nhập
                </Link>
                <Link
                  to={urlPaths.register}
                  className={cn(
                    "border px-3 py-1.5 tracking-wide transition",
                    isHome
                      ? "border-white/60 text-white hover:bg-white hover:text-slate-900"
                      : "border-foreground bg-foreground text-background hover:opacity-90"
                  )}
                >
                  Đăng ký
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className={cn(!isHome && "mx-auto w-full max-w-6xl px-5 py-6 sm:px-6")}>
        <Outlet />
      </main>
      <footer className="border-t border-border bg-[#0f1218] text-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-sm tracking-[0.28em]">BẠC Ý</p>
          <p className="text-xs text-white/55">Bạc 925 · Chế tác thủ công · Tư vấn realtime</p>
        </div>
      </footer>
    </div>
  )
}
