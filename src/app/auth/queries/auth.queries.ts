import { queryOptions } from "@tanstack/react-query"

import { fetchMeRequest } from "../services/auth.service"
import { authKeys } from "./auth.keys"

export function meQueryOptions(enabled: boolean) {
  /**
   * queryOptions là một hàm để tạo các options cho query
   *
   * @param enabled là flag để xác định xem query có được kích hoạt không
   * @returns queryOptions
   */
  return queryOptions({
    queryKey: authKeys.me(),
    queryFn: fetchMeRequest,
    enabled,
    staleTime: 60_000,
    retry: false,
  })
}
