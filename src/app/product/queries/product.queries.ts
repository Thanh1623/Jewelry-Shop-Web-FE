import { queryOptions } from "@tanstack/react-query"

import { fetchProductsRequest } from "../services/product.service"
import { productKeys } from "./product.keys"

export function productsQueryOptions() {
  return queryOptions({
    queryKey: productKeys.list(),
    queryFn: fetchProductsRequest,
    staleTime: 60_000,
  })
}
