import { useQuery } from "@tanstack/react-query"
import { Link } from "react-router-dom"
import { MessageSquareIcon } from "lucide-react"

import { openChatSessionsQueryOptions } from "@/app/chat/queries/chat.queries"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { urlPaths } from "@/constants/urlPaths"

function formatRelative(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diffMs / 60_000)
  if (mins < 1) return "Vừa xong"
  if (mins < 60) return `${mins} phút`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} giờ`
  return new Date(iso).toLocaleDateString("vi-VN")
}

export function SaleDashboardPage() {
  const sessionsQuery = useQuery(openChatSessionsQueryOptions())
  const count = sessionsQuery.data?.length ?? 0

  return (
    <div className="mx-auto flex h-full w-full max-w-5xl flex-col px-4 py-5 sm:px-6">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <p className="text-[11px] tracking-[0.18em] text-slate-400 uppercase">Operations</p>
          <h1 className="text-xl font-semibold tracking-tight text-slate-800">Hàng đợi tư vấn</h1>
          <p className="mt-1 text-sm text-slate-500">
            Chọn phiên để mở workspace 3 kênh (Khách / AI / Thợ)
          </p>
        </div>
        <Badge className="rounded-full bg-teal-100 px-2.5 py-1 text-xs font-medium text-teal-800 hover:bg-teal-100">
          {sessionsQuery.isPending ? "…" : `${count} phiên`}
        </Badge>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-slate-200/50">
        <div className="grid grid-cols-[1fr_auto] border-b border-slate-100 bg-slate-50/80 px-4 py-2.5 text-[11px] font-medium tracking-wide text-slate-400 uppercase sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_120px_88px]">
          <span>Khách / Sản phẩm</span>
          <span className="hidden sm:inline">Tin gần nhất</span>
          <span className="hidden text-right sm:inline">Cập nhật</span>
          <span className="text-right">Trạng thái</span>
        </div>

        {sessionsQuery.isPending && (
          <div className="space-y-0 divide-y divide-slate-100">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="px-4 py-3">
                <Skeleton className="h-10 w-full rounded-xl" />
              </div>
            ))}
          </div>
        )}

        {sessionsQuery.isError && (
          <p className="p-6 text-sm text-destructive">Không tải được hàng đợi.</p>
        )}

        {sessionsQuery.data?.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
            <MessageSquareIcon className="size-8 text-slate-300" />
            <p className="text-sm font-medium text-slate-700">Chưa có phiên đang mở</p>
            <p className="text-xs text-slate-400">Khi khách hỏi giá, phiên sẽ xuất hiện tại đây.</p>
          </div>
        )}

        {!!sessionsQuery.data?.length && (
          <ul className="divide-y divide-slate-100 overflow-y-auto">
            {sessionsQuery.data.map((session) => {
              const customerName =
                session.customer?.fullName ?? session.guestName ?? "Khách"
              const contact = [session.customer?.phone, session.customer?.email]
                .filter(Boolean)
                .join(" · ")

              return (
                <li key={session.id}>
                  <Link
                    to={urlPaths.saleSessionDetail(session.id)}
                    className="grid grid-cols-[1fr_auto] items-center gap-3 px-4 py-3 transition-colors hover:bg-teal-50/50 sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_120px_88px]"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      {session.product?.imageUrl ? (
                        <img
                          src={session.product.imageUrl}
                          alt=""
                          className="size-11 shrink-0 rounded-xl object-cover"
                        />
                      ) : (
                        <div className="size-11 shrink-0 rounded-xl bg-slate-100" />
                      )}
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-slate-800">
                          {customerName}
                        </p>
                        <p className="truncate text-xs text-slate-500">
                          {session.product?.name ?? "Chưa gắn SP"}
                          {contact ? ` · ${contact}` : ""}
                        </p>
                      </div>
                    </div>
                    <p className="hidden truncate text-xs text-slate-500 sm:block">
                      {session.lastMessage?.content ?? "—"}
                    </p>
                    <p className="hidden text-right text-xs text-slate-400 sm:block">
                      {formatRelative(session.updatedAt)}
                    </p>
                    <div className="flex justify-end">
                      <Badge
                        className={
                          session.isOpen
                            ? "rounded-full bg-teal-500 text-[10px] hover:bg-teal-500"
                            : "rounded-full text-[10px]"
                        }
                        variant={session.isOpen ? "default" : "outline"}
                      >
                        {session.isOpen ? "OPEN" : "CLOSED"}
                      </Badge>
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
