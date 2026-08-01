import { apiPaths } from "@/constants/apiPaths"
import { httpService } from "@/services/httpService"

import type { Order, OrderStatus } from "../types/cart.types"

export interface ShippingPayload {
  shippingName?: string
  shippingPhone?: string
  shippingAddress?: string
}

export interface CreateOrderFromQuotePayload extends ShippingPayload {
  messageId: string
}

export async function fetchOrdersRequest(): Promise<Order[]> {
  const { data } = await httpService.get<Order[]>(apiPaths.orders)
  return data
}

export async function fetchOrderRequest(orderId: string): Promise<Order> {
  const { data } = await httpService.get<Order>(`${apiPaths.orders}/${orderId}`)
  return data
}

export async function checkoutRequest(payload?: ShippingPayload): Promise<Order> {
  const { data } = await httpService.post<Order>(apiPaths.ordersCheckout, payload)
  return data
}

export async function createOrderFromQuoteRequest(
  payload: CreateOrderFromQuotePayload
): Promise<Order> {
  const { data } = await httpService.post<Order>(apiPaths.ordersFromQuote, payload)
  return data
}

export async function fetchAdminOrdersRequest(): Promise<Order[]> {
  const { data } = await httpService.get<Order[]>(apiPaths.ordersAdminAll)
  return data
}

export async function updateOrderStatusRequest(
  orderId: string,
  status: OrderStatus
): Promise<Order> {
  const { data } = await httpService.patch<Order>(apiPaths.orderStatus(orderId), {
    status,
  })
  return data
}

export async function payDemoRequest(orderId: string): Promise<Order> {
  const { data } = await httpService.post<Order>(apiPaths.orderPayDemo(orderId))
  return data
}

export async function cancelOrderRequest(orderId: string): Promise<Order> {
  const { data } = await httpService.post<Order>(apiPaths.orderCancel(orderId))
  return data
}
