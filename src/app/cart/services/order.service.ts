import { apiPaths } from "@/constants/apiPaths"
import { httpService } from "@/services/httpService"

import type { Order } from "../types/cart.types"

export async function fetchOrdersRequest(): Promise<Order[]> {
  const { data } = await httpService.get<Order[]>(apiPaths.orders)
  return data
}

export async function fetchOrderRequest(orderId: string): Promise<Order> {
  const { data } = await httpService.get<Order>(`${apiPaths.orders}/${orderId}`)
  return data
}

export async function checkoutRequest(): Promise<Order> {
  const { data } = await httpService.post<Order>(apiPaths.ordersCheckout)
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
