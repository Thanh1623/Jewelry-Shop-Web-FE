import { useQuery } from "@tanstack/react-query"
import { Link } from "react-router-dom"

import { openChatSessionsQueryOptions } from "@/app/chat/queries/chat.queries"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { urlPaths } from "@/constants/urlPaths"

export function SaleDashboardPage() {
  const sessionsQuery = useQuery(openChatSessionsQueryOptions())

  return (
    <div className="flex flex-col gap-3">
      <h1 className="text-base font-semibold">Phiên tư vấn</h1>

      {sessionsQuery.isPending && (
        <div className="flex flex-col gap-1.5">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-12 w-full" />
          ))}
        </div>
      )}

      {sessionsQuery.isError && (
        <p className="text-sm text-destructive">Không tải được danh sách phiên.</p>
      )}

      {sessionsQuery.data?.length === 0 && (
        <p className="text-sm text-muted-foreground">Chưa có phiên đang mở.</p>
      )}

      {!!sessionsQuery.data?.length && (
        <ul className="divide-y divide-border border border-border bg-card">
          {sessionsQuery.data.map((session) => (
            <li key={session.id}>
              <Link
                to={urlPaths.saleSessionDetail(session.id)}
                className="flex items-center gap-2 px-3 py-2 hover:bg-muted/50"
              >
                {session.product?.imageUrl ? (
                  <img
                    src={session.product.imageUrl}
                    alt={session.product.name}
                    className="size-9 shrink-0 object-cover"
                  />
                ) : (
                  <div className="size-9 shrink-0 bg-muted" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {session.customer?.fullName ?? session.guestName ?? "Khách"} ·{" "}
                    {session.product?.name ?? "—"}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {[session.customer?.phone, session.customer?.email]
                      .filter(Boolean)
                      .join(" · ") ||
                      session.lastMessage?.content ||
                      "Chưa có tin nhắn"}
                  </p>
                </div>
                <Badge variant={session.isOpen ? "default" : "outline"} className="text-[10px]">
                  {session.isOpen ? "Mở" : "Đóng"}
                </Badge>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
