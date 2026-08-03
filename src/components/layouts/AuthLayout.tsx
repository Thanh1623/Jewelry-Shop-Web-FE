import { Link, Outlet } from "react-router-dom"

import { urlPaths } from "@/constants/urlPaths"

const AUTH_IMAGE =
  "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1800&q=85"

export function AuthLayout() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* Brand plane — desktop */}
      <aside className="relative hidden overflow-hidden bg-[#0f1218] lg:block">
        <img
          src={AUTH_IMAGE}
          alt=""
          className="absolute inset-0 size-full object-cover animate-hero-kenburns"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/30" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.45)_100%)]" />

        <div className="relative z-10 flex h-full min-h-svh flex-col justify-between p-10 xl:p-14">
          <Link
            to={urlPaths.home}
            className="text-sm font-medium tracking-[0.32em] text-white/90 transition hover:text-white"
          >
            BẠC Ý
          </Link>

          <div className="max-w-md pb-6 text-white">
            <p className="animate-fade-up text-[11px] tracking-[0.4em] text-white/65 uppercase">
              Silver atelier
            </p>
            <h1 className="animate-fade-up-delay-1 mt-4 text-6xl font-light leading-[0.92] tracking-[0.14em] xl:text-7xl">
              BẠC Ý
            </h1>
            <p className="animate-fade-up-delay-2 mt-5 max-w-sm text-sm leading-relaxed text-white/80">
              Trang sức bạc 925 chế tác tinh xảo — đăng nhập để hỏi giá realtime với chuyên viên.
            </p>
          </div>
        </div>
      </aside>

      {/* Form plane */}
      <main className="relative flex min-h-svh flex-col bg-[#f7f6f4]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(15,18,24,0.07) 1px, transparent 0)",
            backgroundSize: "22px 22px",
          }}
        />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#e8e6e1]/80 to-transparent" />

        <div className="relative z-10 flex items-center justify-between border-b border-[#0f1218]/10 px-5 py-4 lg:hidden">
          <Link
            to={urlPaths.home}
            className="text-sm font-medium tracking-[0.28em] text-[#0f1218]"
          >
            BẠC Ý
          </Link>
          <span className="text-[10px] tracking-[0.22em] text-[#0f1218]/45 uppercase">
            Atelier
          </span>
        </div>

        <div className="relative z-10 flex flex-1 flex-col justify-center px-5 py-10 sm:px-10 lg:px-14 xl:px-20">
          <div className="mx-auto w-full max-w-md">
            <Outlet />
          </div>
        </div>

        <p className="relative z-10 px-5 pb-6 text-center text-[10px] tracking-[0.18em] text-[#0f1218]/35 uppercase sm:text-left sm:px-10 lg:px-14">
          Bạc 925 · Chế tác thủ công
        </p>
      </main>
    </div>
  )
}
