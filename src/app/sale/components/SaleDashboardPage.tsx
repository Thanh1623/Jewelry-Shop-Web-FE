import { useQuery } from "@tanstack/react-query"
import { Link } from "react-router-dom"

import { openChatSessionsQueryOptions } from "@/app/chat/queries/chat.queries"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { urlPaths } from "@/constants/urlPaths"

export function SaleDashboardPage() {
  const sessionsQuery = useQuery(openChatSessionsQueryOptions())

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="font-heading text-2xl font-semibold">Phiên trò chuyện</h1>
        <p className="text-muted-foreground">Chọn một phiên để tư vấn khách hàng.</p>
      </div>

      {sessionsQuery.isPending && (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-16 w-full rounded-2xl" />
          ))}
        </div>
      )}

      {sessionsQuery.isError && (
        <p className="text-sm text-destructive">Không thể tải danh sách phiên trò chuyện.</p>
      )}

      {sessionsQuery.data?.length === 0 && (
        <p className="text-sm text-muted-foreground">Chưa có phiên trò chuyện nào đang mở.</p>
      )}

      {!!sessionsQuery.data?.length && (
        <ul className="flex flex-col divide-y divide-border/60 overflow-hidden rounded-3xl ring-1 ring-border/60">
          {sessionsQuery.data.map((session) => (
            <li key={session.id}>
              <Link
                to={urlPaths.saleSessionDetail(session.id)}
                className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/50"
              >
                {session.product?.imageUrl && (
                  <img
                    src={session.product.imageUrl}
                    alt={session.product.name}
                    className="size-10 shrink-0 rounded-xl object-cover"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">
                    {session.guestName ?? "Khách"} · {session.product?.name ?? "Chưa gắn sản phẩm"}
                  </p>
                  <p className="truncate text-sm text-muted-foreground">
                    {session.lastMessage?.content ?? "Chưa có tin nhắn"}
                  </p>
                </div>
                <Badge variant={session.isOpen ? "default" : "outline"}>
                  {session.isOpen ? "Đang mở" : "Đã đóng"}
                </Badge>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
