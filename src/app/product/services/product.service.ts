import { apiPaths } from "@/constants/apiPaths"
import { httpService } from "@/services/httpService"

import type { Product } from "../types/product.types"

export async function fetchProductsRequest(): Promise<Product[]> {
  const { data } = await httpService.get<Product[]>(apiPaths.products)
  return data
}

export async function fetchAdminProductsRequest(): Promise<Product[]> {
  const { data } = await httpService.get<Product[]>(apiPaths.productsAdminAll)
  return data
}

export interface ProductWritePayload {
  sku: string
  name: string
  description?: string
  imageUrl?: string
  weightGrams: number
  laborCost: number
  baseSize?: number
  sizeDeltaGrams?: number
  isActive?: boolean
}

export async function createProductRequest(
  payload: ProductWritePayload
): Promise<Product> {
  const { data } = await httpService.post<Product>(apiPaths.products, payload)
  return data
}

export async function updateProductRequest(
  id: string,
  payload: Partial<ProductWritePayload>
): Promise<Product> {
  const { data } = await httpService.patch<Product>(`${apiPaths.products}/${id}`, payload)
  return data
}

export async function deleteProductRequest(id: string): Promise<Product> {
  const { data } = await httpService.delete<Product>(`${apiPaths.products}/${id}`)
  return data
}
