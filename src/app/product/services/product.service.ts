import { apiPaths } from "@/constants/apiPaths"
import { httpService } from "@/services/httpService"

import type { Product } from "../types/product.types"

export async function fetchProductsRequest(): Promise<Product[]> {
  const { data } = await httpService.get<Product[]>(apiPaths.products)
  return data
}
