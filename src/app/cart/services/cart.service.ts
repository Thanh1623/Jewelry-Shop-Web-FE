import { apiPaths } from "@/constants/apiPaths"
import { httpService } from "@/services/httpService"

import type { Cart } from "../types/cart.types"

export async function fetchCartRequest(): Promise<Cart> {
  const { data } = await httpService.get<Cart>(apiPaths.cart)
  return data
}

export async function upsertCartItemRequest(payload: {
  productId: string
  quantity: number
}): Promise<Cart> {
  const { data } = await httpService.post<Cart>(apiPaths.cartItems, payload)
  return data
}

export async function updateCartQuantityRequest(
  itemId: string,
  quantity: number
): Promise<Cart> {
  const { data } = await httpService.patch<Cart>(`${apiPaths.cartItems}/${itemId}`, {
    quantity,
  })
  return data
}

export async function removeCartItemRequest(itemId: string): Promise<Cart> {
  const { data } = await httpService.delete<Cart>(`${apiPaths.cartItems}/${itemId}`)
  return data
}
