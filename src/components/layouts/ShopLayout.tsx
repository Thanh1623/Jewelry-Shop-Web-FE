import { Link, Outlet } from "react-router-dom"

import { urlPaths } from "@/constants/urlPaths"

export function ShopLayout() {
  return (
    <div className="min-h-svh bg-background">
      <header className="border-b border-border/60 bg-card/60 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <Link to={urlPaths.home} className="font-heading text-lg font-semibold tracking-tight">
            Bạc Ý Jewelry
          </Link>
          <Link to={urlPaths.login} className="text-sm text-muted-foreground hover:text-foreground">
            Đăng nhập nhân viên
          </Link>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  )
}
