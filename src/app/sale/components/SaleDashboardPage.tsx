import { useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Link } from "react-router-dom"
import { MessageSquareIcon } from "lucide-react"

import { openChatSessionsQueryOptions } from "@/app/chat/queries/chat.queries"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { urlPaths } from "@/constants/urlPaths"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/stores/auth-store"

import {
  useClaimSessionMutation,
  useReleaseSessionMutation,
} from "../hooks/use-claim-session-mutation"

type QueueFilter = "all" | "unclaimed" | "mine"

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
  const userId = useAuthStore((s) => s.user?.id)
  const [filter, setFilter] = useState<QueueFilter>("all")
  const sessionsQuery = useQuery(openChatSessionsQueryOptions())
  const claimMutation = useClaimSessionMutation()
  const releaseMutation = useReleaseSessionMutation()

  const filtered = useMemo(() => {
    const list = sessionsQuery.data ?? []
    if (filter === "unclaimed") return list.filter((s) => !s.saleId)
    if (filter === "mine") return list.filter((s) => s.saleId === userId)
    return list
  }, [sessionsQuery.data, filter, userId])

  const unclaimedCount =
    sessionsQuery.data?.filter((s) => !s.saleId).length ?? 0
  const mineCount =
    sessionsQuery.data?.filter((s) => s.saleId === userId).length ?? 0

  return (
    <div className="mx-auto flex h-full w-full max-w-5xl flex-col px-4 py-5 sm:px-6">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <p className="text-[11px] tracking-[0.18em] text-slate-400 uppercase">Operations</p>
          <h1 className="text-xl font-semibold tracking-tight text-slate-800">Hàng đợi tư vấn</h1>
          <p className="mt-1 text-sm text-slate-500">
            Nhận phiên rồi mở workspace 3 kênh (Khách / AI / Thợ)
          </p>
        </div>
        <Badge className="rounded-full bg-teal-100 px-2.5 py-1 text-xs font-medium text-teal-800 hover:bg-teal-100">
          {sessionsQuery.isPending ? "…" : `${filtered.length} phiên`}
        </Badge>
      </div>

      <div className="mb-3 inline-flex rounded-full bg-white p-1 ring-1 ring-slate-200/80">
        {(
          [
            { key: "all", label: "Tất cả", count: sessionsQuery.data?.length ?? 0 },
            { key: "unclaimed", label: "Chưa nhận", count: unclaimedCount },
            { key: "mine", label: "Của tôi", count: mineCount },
          ] as const
        ).map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setFilter(tab.key)}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-medium transition",
              filter === tab.key
                ? "bg-teal-600 text-white"
                : "text-slate-600 hover:bg-slate-50"
            )}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      <div className="min-h-0 flex-1 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-slate-200/50">
        <div className="grid grid-cols-[1fr_auto] border-b border-slate-100 bg-slate-50/80 px-4 py-2.5 text-[11px] font-medium tracking-wide text-slate-400 uppercase sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_100px_140px]">
          <span>Khách / Sản phẩm</span>
          <span className="hidden sm:inline">Tin gần nhất</span>
          <span className="hidden text-right sm:inline">Cập nhật</span>
          <span className="text-right">Phụ trách</span>
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

        {filtered.length === 0 && !sessionsQuery.isPending && (
          <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
            <MessageSquareIcon className="size-8 text-slate-300" />
            <p className="text-sm font-medium text-slate-700">Không có phiên trong bộ lọc này</p>
          </div>
        )}

        {filtered.length > 0 && (
          <ul className="divide-y divide-slate-100 overflow-y-auto">
            {filtered.map((session) => {
              const customerName =
                session.customer?.fullName ?? session.guestName ?? "Khách"
              const contact = [session.customer?.phone, session.customer?.email]
                .filter(Boolean)
                .join(" · ")
              const isMine = session.saleId === userId
              const isUnclaimed = !session.saleId

              return (
                <li
                  key={session.id}
                  className="grid grid-cols-[1fr_auto] items-center gap-3 px-4 py-3 sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_100px_140px]"
                >
                  <Link
                    to={urlPaths.saleSessionDetail(session.id)}
                    className="flex min-w-0 items-center gap-3"
                  >
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
                  </Link>
                  <p className="hidden truncate text-xs text-slate-500 sm:block">
                    {session.lastMessage?.content ?? "—"}
                  </p>
                  <p className="hidden text-right text-xs text-slate-400 sm:block">
                    {formatRelative(session.updatedAt)}
                  </p>
                  <div className="flex flex-col items-end gap-1">
                    {isUnclaimed ? (
                      <Button
                        size="sm"
                        className="h-7 rounded-full px-3 text-[11px]"
                        disabled={claimMutation.isPending}
                        onClick={() => claimMutation.mutate(session.id)}
                      >
                        Nhận
                      </Button>
                    ) : (
                      <>
                        <Badge
                          className={cn(
                            "rounded-full text-[10px]",
                            isMine
                              ? "bg-teal-500 hover:bg-teal-500"
                              : "bg-slate-200 text-slate-700 hover:bg-slate-200"
                          )}
                        >
                          {isMine ? "Bạn" : session.sale?.fullName ?? "Sale"}
                        </Badge>
                        {isMine && (
                          <button
                            type="button"
                            className="text-[10px] text-slate-400 underline-offset-2 hover:underline"
                            disabled={releaseMutation.isPending}
                            onClick={() => releaseMutation.mutate(session.id)}
                          >
                            Trả lại
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
