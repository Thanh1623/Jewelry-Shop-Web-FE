import { queryOptions } from "@tanstack/react-query"

import {
  fetchAdminProductsRequest,
  fetchProductByIdRequest,
  fetchProductsRequest,
} from "../services/product.service"
import { productKeys } from "./product.keys"

export function productsQueryOptions() {
  return queryOptions({
    queryKey: productKeys.list(),
    queryFn: fetchProductsRequest,
    staleTime: 60_000,
  })
}

export function adminProductsQueryOptions() {
  return queryOptions({
    queryKey: productKeys.adminList(),
    queryFn: fetchAdminProductsRequest,
    staleTime: 15_000,
  })
}

export function productDetailQueryOptions(productId: string) {
  return queryOptions({
    queryKey: productKeys.detail(productId),
    queryFn: () => fetchProductByIdRequest(productId),
    enabled: Boolean(productId),
    staleTime: 60_000,
  })
}
