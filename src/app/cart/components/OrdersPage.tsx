import { useQuery } from "@tanstack/react-query"
import { Link } from "react-router-dom"

import { formatVnd } from "@/app/product/utils/format-price"
import { Skeleton } from "@/components/ui/skeleton"
import { urlPaths } from "@/constants/urlPaths"

import { ordersQueryOptions } from "../queries/cart.queries"

const statusLabel: Record<string, string> = {
  PENDING_PAYMENT: "Chờ thanh toán",
  PAID: "Đã thanh toán",
  CANCELLED: "Đã hủy",
  FAILED: "Thất bại",
}

export function OrdersPage() {
  const ordersQuery = useQuery(ordersQueryOptions())

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <p className="text-[11px] tracking-[0.3em] text-muted-foreground uppercase">Orders</p>
        <h1 className="mt-1 text-2xl font-light tracking-wide">Đơn hàng của tôi</h1>
      </div>

      {ordersQuery.isPending && <Skeleton className="h-24 w-full rounded-none" />}
      {ordersQuery.isError && (
        <p className="text-sm text-destructive">Không tải được đơn hàng.</p>
      )}
      {ordersQuery.data?.length === 0 && (
        <p className="text-sm text-muted-foreground">Chưa có đơn nào.</p>
      )}

      <ul className="divide-y divide-border border border-border">
        {ordersQuery.data?.map((order) => (
          <li key={order.id}>
            <Link
              to={urlPaths.orderDetail(order.id)}
              className="flex items-center justify-between gap-3 p-4 text-sm transition hover:bg-muted/40"
            >
              <div>
                <p className="tracking-wide">{statusLabel[order.status] ?? order.status}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(order.createdAt).toLocaleString("vi-VN")} · {order.items.length} mục
                </p>
              </div>
              <p>{formatVnd(order.totalAmount)}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
