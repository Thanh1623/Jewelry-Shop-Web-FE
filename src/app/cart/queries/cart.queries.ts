import { queryOptions } from "@tanstack/react-query"

import { fetchCartRequest } from "../services/cart.service"
import { fetchOrderRequest, fetchOrdersRequest } from "../services/order.service"
import { cartKeys, orderKeys } from "./cart.keys"

export function cartQueryOptions(enabled = true) {
  return queryOptions({
    queryKey: cartKeys.me(),
    queryFn: fetchCartRequest,
    enabled,
    staleTime: 15_000,
  })
}

export function ordersQueryOptions(enabled = true) {
  return queryOptions({
    queryKey: orderKeys.list(),
    queryFn: fetchOrdersRequest,
    enabled,
  })
}

export function orderDetailQueryOptions(orderId: string, enabled = true) {
  return queryOptions({
    queryKey: orderKeys.detail(orderId),
    queryFn: () => fetchOrderRequest(orderId),
    enabled: enabled && Boolean(orderId),
  })
}
