import { useQuery } from "@tanstack/react-query"

import { formatVnd } from "@/app/product/utils/format-price"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

import { useUpdateOrderStatusMutation } from "../hooks/use-cart-mutations"
import { adminOrdersQueryOptions } from "../queries/cart.queries"
import { canCancelOrder, nextOrderStatus, ORDER_STATUS_LABEL } from "../utils/order-status"

export function AdminOrdersPage() {
  const ordersQuery = useQuery(adminOrdersQueryOptions())
  const updateStatus = useUpdateOrderStatusMutation()

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <p className="text-[11px] tracking-[0.3em] text-muted-foreground uppercase">Operations</p>
        <h1 className="mt-1 text-2xl font-light tracking-wide">Quản lý đơn hàng</h1>
      </div>

      {ordersQuery.isPending && (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-none" />
          ))}
        </div>
      )}

      {ordersQuery.isError && (
        <p className="text-sm text-destructive">Không tải được đơn hàng.</p>
      )}

      {ordersQuery.data?.length === 0 && (
        <p className="text-sm text-muted-foreground">Chưa có đơn nào.</p>
      )}

      <ul className="divide-y divide-border border border-border">
        {ordersQuery.data?.map((order) => {
          const next = nextOrderStatus(order.status)
          const canCancel = canCancelOrder(order.status)

          return (
            <li
              key={order.id}
              className="flex flex-col gap-2 p-4 text-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="tracking-wide">
                  {order.user?.fullName ?? order.userId} · {formatVnd(order.totalAmount)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(order.createdAt).toLocaleString("vi-VN")} · {order.items.length} mục
                  {order.user?.phone ? ` · ${order.user.phone}` : ""}
                  {order.shippingAddress ? ` · Giao: ${order.shippingAddress}` : ""}
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap items-center gap-2">
                <Badge variant="outline" className="rounded-none">
                  {ORDER_STATUS_LABEL[order.status]}
                </Badge>
                {next && (
                  <Button
                    size="sm"
                    className="rounded-none"
                    disabled={updateStatus.isPending}
                    onClick={() => updateStatus.mutate({ orderId: order.id, status: next })}
                  >
                    → {ORDER_STATUS_LABEL[next]}
                  </Button>
                )}
                {canCancel && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-none"
                    disabled={updateStatus.isPending}
                    onClick={() => updateStatus.mutate({ orderId: order.id, status: "CANCELLED" })}
                  >
                    Hủy
                  </Button>
                )}
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
