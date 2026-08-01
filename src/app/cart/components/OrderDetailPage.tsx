import { useQuery } from "@tanstack/react-query"
import { Link, useParams } from "react-router-dom"

import { formatVnd } from "@/app/product/utils/format-price"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { urlPaths } from "@/constants/urlPaths"

import {
  useCancelOrderMutation,
  usePayDemoMutation,
} from "../hooks/use-cart-mutations"
import { orderDetailQueryOptions } from "../queries/cart.queries"
import { ORDER_STATUS_LABEL } from "../utils/order-status"

export function OrderDetailPage() {
  const { orderId = "" } = useParams()
  const orderQuery = useQuery(orderDetailQueryOptions(orderId))
  const payDemo = usePayDemoMutation()
  const cancelOrder = useCancelOrderMutation()

  if (orderQuery.isPending) {
    return <Skeleton className="h-40 w-full rounded-none" />
  }

  if (orderQuery.isError || !orderQuery.data) {
    return <p className="text-sm text-destructive">Không tìm thấy đơn hàng.</p>
  }

  const order = orderQuery.data
  const canPay = order.status === "PENDING_PAYMENT"

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <Link to={urlPaths.orders} className="text-xs text-muted-foreground underline">
          ← Đơn của tôi
        </Link>
        <h1 className="mt-2 text-2xl font-light tracking-wide">Đơn hàng</h1>
        <p className="mt-1 text-xs text-muted-foreground">
          {ORDER_STATUS_LABEL[order.status] ?? order.status}
          {order.paymentRef ? ` · Ref ${order.paymentRef}` : ""}
        </p>
        {order.shippingAddress && (
          <p className="mt-1 text-xs text-muted-foreground">
            Giao đến: {order.shippingName ?? "—"}
            {order.shippingPhone ? ` · ${order.shippingPhone}` : ""} · {order.shippingAddress}
          </p>
        )}
      </div>

      <ul className="divide-y divide-border border border-border">
        {order.items.map((item) => (
          <li key={item.id} className="flex justify-between gap-3 p-4 text-sm">
            <span>
              {item.productName} × {item.quantity}
            </span>
            <span>{formatVnd(item.unitPrice * item.quantity)}</span>
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-3 border border-border p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-lg tracking-wide">Tổng {formatVnd(order.totalAmount)}</p>
        {canPay && (
          <div className="flex flex-wrap gap-2">
            <Button
              className="rounded-none"
              disabled={payDemo.isPending}
              onClick={() => payDemo.mutate(order.id)}
            >
              {payDemo.isPending ? "Đang thanh toán..." : "Thanh toán DEMO"}
            </Button>
            <Button
              variant="outline"
              className="rounded-none"
              disabled={cancelOrder.isPending}
              onClick={() => cancelOrder.mutate(order.id)}
            >
              Hủy đơn
            </Button>
          </div>
        )}
      </div>

      {order.status === "PAID" && (
        <p className="text-sm text-muted-foreground">
          Demo xong. Khi cần cổng thật, thay `DemoPaymentProvider` bằng VNPay/MoMo/Stripe.
        </p>
      )}
    </div>
  )
}
