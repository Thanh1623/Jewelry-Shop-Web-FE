import type { OrderStatus } from "../types/cart.types"

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING_PAYMENT: "Chờ thanh toán",
  PAID: "Đã thanh toán",
  PROCESSING: "Đang chế tác",
  READY: "Sẵn sàng giao",
  DELIVERED: "Đã giao",
  CANCELLED: "Đã hủy",
  FAILED: "Thất bại",
}

/** Fulfillment flow BE allows advancing exactly one step at a time. */
const ORDER_FULFILLMENT_FLOW: OrderStatus[] = [
  "PAID",
  "PROCESSING",
  "READY",
  "DELIVERED",
]

export function nextOrderStatus(status: OrderStatus): OrderStatus | null {
  const index = ORDER_FULFILLMENT_FLOW.indexOf(status)
  if (index === -1 || index === ORDER_FULFILLMENT_FLOW.length - 1) {
    return null
  }
  return ORDER_FULFILLMENT_FLOW[index + 1]
}

const CANCELLABLE_STATUSES: OrderStatus[] = ["PENDING_PAYMENT", "PAID", "PROCESSING"]

export function canCancelOrder(status: OrderStatus): boolean {
  return CANCELLABLE_STATUSES.includes(status)
}
