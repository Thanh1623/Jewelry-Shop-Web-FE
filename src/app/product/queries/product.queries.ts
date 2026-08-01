import { queryOptions } from "@tanstack/react-query"

import {
  fetchAdminProductsRequest,
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
